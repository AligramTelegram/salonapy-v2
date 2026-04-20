import { GoogleGenerativeAI, FunctionDeclaration, SchemaType, Part } from '@google/generative-ai'
import { prisma } from '@/lib/prisma'
import { getAvailableSlots, getNextAvailableSlots } from './availability'

async function getGeminiClient() {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: 'gemini_api_key' },
  })
  const apiKey = setting?.value || process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY ayarlanmamış. Admin → Site Ayarları → API Ayarları bölümünden ekleyin.')
  return new GoogleGenerativeAI(apiKey)
}

// ─── Tool tanımları ───────────────────────────────────────────────────────────

const FUNCTION_DECLARATIONS: FunctionDeclaration[] = [
  {
    name: 'get_services',
    description: 'İşletmenin sunduğu aktif hizmetlerin listesini döner.',
    parameters: { type: SchemaType.OBJECT, properties: {}, required: [] },
  },
  {
    name: 'get_staff',
    description: 'Aktif personellerin listesini döner.',
    parameters: { type: SchemaType.OBJECT, properties: {}, required: [] },
  },
  {
    name: 'get_available_slots',
    description: 'Belirli bir hizmet için müsait randevu slotlarını döner. Müşteri tarih belirtmezse sonraki 7 günü tarar.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        service_id: { type: SchemaType.STRING, description: 'Hizmet ID' },
        date: { type: SchemaType.STRING, description: 'YYYY-MM-DD formatında tarih. Boş bırakılırsa sonraki 7 gün taranır.' },
        staff_id: { type: SchemaType.STRING, description: 'Belirli bir personel istiyorsa personel ID (opsiyonel)' },
      },
      required: ['service_id'],
    },
  },
  {
    name: 'create_appointment',
    description: 'Müşteri onayladıktan sonra randevuyu oluşturur.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        customer_name: { type: SchemaType.STRING, description: 'Müşteri adı soyadı' },
        customer_phone: { type: SchemaType.STRING, description: 'Müşteri telefon numarası' },
        service_id: { type: SchemaType.STRING, description: 'Hizmet ID' },
        staff_id: { type: SchemaType.STRING, description: 'Personel ID' },
        date: { type: SchemaType.STRING, description: 'YYYY-MM-DD' },
        start_time: { type: SchemaType.STRING, description: 'HH:MM' },
      },
      required: ['customer_name', 'customer_phone', 'service_id', 'staff_id', 'date', 'start_time'],
    },
  },
]

// ─── Tool uygulayıcılar ───────────────────────────────────────────────────────

async function runTool(
  toolName: string,
  input: Record<string, string>,
  tenantId: string
): Promise<string> {
  try {
    if (toolName === 'get_services') {
      const services = await prisma.service.findMany({
        where: { tenantId, isActive: true },
        select: { id: true, name: true, duration: true, price: true },
        orderBy: { name: 'asc' },
      })
      if (!services.length) return 'Henüz aktif hizmet tanımlanmamış.'
      return services.map(s =>
        `- ${s.name} (ID: ${s.id}) | Süre: ${s.duration} dk | Fiyat: ₺${s.price}`
      ).join('\n')
    }

    if (toolName === 'get_staff') {
      const staff = await prisma.staff.findMany({
        where: { tenantId, isActive: true },
        select: { id: true, name: true, title: true },
        orderBy: { name: 'asc' },
      })
      if (!staff.length) return 'Henüz aktif personel tanımlanmamış.'
      return staff.map(s =>
        `- ${s.name}${s.title ? ` (${s.title})` : ''} (ID: ${s.id})`
      ).join('\n')
    }

    if (toolName === 'get_available_slots') {
      const { service_id, date, staff_id } = input
      let slots
      if (date) {
        slots = await getAvailableSlots(tenantId, service_id, date, staff_id)
      } else {
        slots = await getNextAvailableSlots(tenantId, service_id, 7, 8, staff_id)
      }
      if (!slots.length) return 'Seçilen kriterlerde müsait slot bulunamadı.'
      return slots.map(s =>
        `- ${s.date} ${s.startTime}-${s.endTime} | Personel: ${s.staffName} (ID: ${s.staffId})`
      ).join('\n')
    }

    if (toolName === 'create_appointment') {
      const { customer_name, customer_phone, service_id, staff_id, date, start_time } = input

      const service = await prisma.service.findFirst({
        where: { id: service_id, tenantId },
        select: { duration: true, price: true, name: true },
      })
      if (!service) return 'Hizmet bulunamadı.'

      const [h, m] = start_time.split(':').map(Number)
      const endMin = h * 60 + m + service.duration
      const endTime = `${Math.floor(endMin / 60).toString().padStart(2, '0')}:${(endMin % 60).toString().padStart(2, '0')}`

      let customer = await prisma.customer.findFirst({
        where: { tenantId, phone: customer_phone },
      })
      if (!customer) {
        customer = await prisma.customer.create({
          data: { tenantId, name: customer_name, phone: customer_phone },
        })
      }

      const appointmentDate = new Date(date + 'T00:00:00Z')

      await prisma.appointment.create({
        data: {
          tenantId,
          customerId: customer.id,
          staffId: staff_id,
          serviceId: service_id,
          date: appointmentDate,
          startTime: start_time,
          endTime,
          price: service.price,
          status: 'ONAYLANDI',
          notes: 'AI asistan tarafından oluşturuldu',
        },
      })

      return `✅ Randevu oluşturuldu!\n- Hizmet: ${service.name}\n- Tarih: ${date} ${start_time}-${endTime}\n- Fiyat: ₺${service.price}`
    }

    return 'Bilinmeyen araç.'
  } catch (err) {
    console.error(`[Tool ${toolName}] Error:`, err)
    return 'İşlem sırasında hata oluştu.'
  }
}

// ─── Ana agent fonksiyonu ─────────────────────────────────────────────────────

export interface AgentContext {
  tenantId: string
  tenantName: string
  conversationId: string
  systemPrompt?: string | null
  workingHoursStart?: string
  workingHoursEnd?: string
  outOfHoursMessage?: string | null
}

export async function runBookingAgent(
  ctx: AgentContext,
  incomingMessage: string
): Promise<string> {
  // Konuşma geçmişini yükle (son 20 mesaj)
  const history = await prisma.message.findMany({
    where: { conversationId: ctx.conversationId },
    orderBy: { createdAt: 'asc' },
    take: 20,
  })

  // Mesai dışı kontrolü
  const now = new Date()
  const hour = now.getHours() + now.getMinutes() / 60
  if (ctx.workingHoursStart && ctx.workingHoursEnd) {
    const [sh, sm] = ctx.workingHoursStart.split(':').map(Number)
    const [eh, em] = ctx.workingHoursEnd.split(':').map(Number)
    const start = sh + sm / 60
    const end = eh + em / 60
    if (hour < start || hour >= end) {
      return ctx.outOfHoursMessage ||
        `Merhaba! Şu an çalışma saatlerimiz (${ctx.workingHoursStart}-${ctx.workingHoursEnd}) dışındayız. En kısa sürede yanıt vereceğiz.`
    }
  }

  // Gelen mesajı kaydet
  await prisma.message.create({
    data: {
      conversationId: ctx.conversationId,
      direction: 'INBOUND',
      content: incomingMessage,
    },
  })

  const today = new Date().toISOString().split('T')[0]
  const systemInstruction = `${ctx.systemPrompt || `Sen ${ctx.tenantName} işletmesinin AI randevu asistanısın.`}

Görevin: Müşterilere hizmet bilgisi vermek ve randevu almalarına yardımcı olmak.
Bugünün tarihi: ${today}

Kurallar:
- Önce hangi hizmeti istediklerini öğren
- Mevcut hizmetleri ve personeli sorgula (araçları kullan)
- Müsait slotları göster ve seçmelerini iste
- Müşteri ad-soyad ve onay verdikten sonra randevuyu oluştur
- Kısa ve samimi yanıtlar ver, Türkçe konuş
- Randevu oluşturunca net özet bilgi ver`

  // Gemini geçmiş formatı: user/model rolleri
  const geminiHistory = history.map(m => ({
    role: m.direction === 'INBOUND' ? 'user' as const : 'model' as const,
    parts: [{ text: m.content }],
  }))

  const genAI = await getGeminiClient()
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction,
    tools: [{ functionDeclarations: FUNCTION_DECLARATIONS }],
  })

  const chat = model.startChat({ history: geminiHistory })

  let response = ''
  let currentMessage: string | Part[] = incomingMessage

  // Tool use döngüsü
  while (true) {
    const result = await chat.sendMessage(currentMessage)
    const geminiResponse = result.response
    const functionCalls = geminiResponse.functionCalls()

    if (functionCalls && functionCalls.length > 0) {
      // Tool çağrılarını işle
      const toolResponses: Part[] = await Promise.all(
        functionCalls.map(async (fc) => ({
          functionResponse: {
            name: fc.name,
            response: {
              result: await runTool(fc.name, fc.args as Record<string, string>, ctx.tenantId),
            },
          },
        }))
      )
      currentMessage = toolResponses
    } else {
      response = geminiResponse.text()
      break
    }
  }

  // Yanıtı kaydet
  await prisma.message.create({
    data: {
      conversationId: ctx.conversationId,
      direction: 'OUTBOUND',
      content: response,
      aiGenerated: true,
    },
  })

  await prisma.conversation.update({
    where: { id: ctx.conversationId },
    data: { lastMessageAt: new Date() },
  })

  return response
}
