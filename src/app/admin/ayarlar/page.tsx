'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Save, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

const SETTING_DEFS = {
  api: [
    { key: 'gemini_api_key', label: 'Google Gemini API Key', type: 'secret', placeholder: 'AIzaSy...' },
    { key: 'whatsapp_verify_token', label: 'WhatsApp Webhook Verify Token', type: 'secret', placeholder: 'hemensalon_wa_verify_2025' },
    { key: 'instagram_verify_token', label: 'Instagram Webhook Verify Token', type: 'secret', placeholder: 'hemensalon_ig_verify_2025' },
  ],
  general: [
    { key: 'site_name', label: 'Site Adı', type: 'input', placeholder: 'Hemensalon' },
    { key: 'site_slogan', label: 'Site Sloganı', type: 'input', placeholder: 'Randevunuzu otomatikleştirin' },
  ],
  seo: [
    { key: 'seo_title', label: 'Varsayılan Meta Title', type: 'input', placeholder: 'Hemensalon — Salon Randevu Yönetimi' },
    { key: 'seo_description', label: 'Varsayılan Meta Description', type: 'textarea', placeholder: 'Hemensalon ile salonunuzu dijitalleştirin...' },
    { key: 'seo_og_image', label: 'Varsayılan OG Görseli URL', type: 'input', placeholder: 'https://...' },
    { key: 'google_site_verification', label: 'Google Site Verification Kodu', type: 'input', placeholder: 'xxxxx' },
  ],
  contact: [
    { key: 'contact_email', label: 'Destek Email', type: 'input', placeholder: 'destek@hemensalon.com' },
    { key: 'contact_phone', label: 'Telefon', type: 'input', placeholder: '+90 555 000 0000' },
    { key: 'contact_address', label: 'Adres', type: 'textarea', placeholder: 'İstanbul, Türkiye' },
    { key: 'social_facebook', label: 'Facebook URL', type: 'input', placeholder: 'https://facebook.com/hemensalon' },
    { key: 'social_twitter', label: 'Twitter/X URL', type: 'input', placeholder: 'https://twitter.com/hemensalon' },
    { key: 'social_instagram', label: 'Instagram URL', type: 'input', placeholder: 'https://instagram.com/hemensalon' },
    { key: 'social_linkedin', label: 'LinkedIn URL', type: 'input', placeholder: 'https://linkedin.com/company/hemensalon' },
  ],
  analytics: [
    { key: 'ga_id', label: 'Google Analytics ID', type: 'input', placeholder: 'G-XXXXXXXXXX' },
    { key: 'gtm_id', label: 'Google Tag Manager ID', type: 'input', placeholder: 'GTM-XXXXXXX' },
    { key: 'fb_pixel_id', label: 'Facebook Pixel ID', type: 'input', placeholder: '123456789' },
  ],
}

const CATEGORY_MAP: Record<string, string> = {
  gemini_api_key: 'api', whatsapp_verify_token: 'api', instagram_verify_token: 'api',
  site_name: 'general', site_slogan: 'general',
  seo_title: 'seo', seo_description: 'seo', seo_og_image: 'seo', google_site_verification: 'seo',
  contact_email: 'contact', contact_phone: 'contact', contact_address: 'contact',
  social_facebook: 'contact', social_twitter: 'contact', social_instagram: 'contact', social_linkedin: 'contact',
  ga_id: 'analytics', gtm_id: 'analytics', fb_pixel_id: 'analytics',
}

type TabKey = keyof typeof SETTING_DEFS

const TAB_LABELS: Record<TabKey, string> = {
  api: 'API Ayarları',
  general: 'Genel',
  seo: 'SEO',
  contact: 'İletişim',
  analytics: 'Analytics',
}

export default function AdminAyarlarPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<TabKey | null>(null)
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => setValues(data))
      .catch(() => toast.error('Ayarlar yüklenemedi'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(tab: TabKey) {
    setSaving(tab)
    const defs = SETTING_DEFS[tab]
    const settings = defs.map((def) => ({
      key: def.key,
      value: values[def.key] ?? '',
      category: CATEGORY_MAP[def.key] ?? tab,
    }))
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
      toast.success('Ayarlar kaydedildi')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Bilinmeyen hata'
      toast.error('Kayıt başarısız: ' + msg)
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Site Ayarları</h1>
        <p className="text-sm text-gray-500 mt-0.5">Vitrin sitenizin genel ayarlarını yönetin</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="bg-white border border-gray-200 p-1 rounded-xl h-auto gap-1">
          {(Object.keys(SETTING_DEFS) as TabKey[]).map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="rounded-lg text-gray-500 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-none px-4 py-1.5 text-sm font-medium transition-colors"
            >
              {TAB_LABELS[tab]}
            </TabsTrigger>
          ))}
        </TabsList>

        {(Object.keys(SETTING_DEFS) as TabKey[]).map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
              {SETTING_DEFS[tab].map((def) => (
                <div key={def.key} className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">{def.label}</Label>
                  {def.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={values[def.key] ?? ''}
                      onChange={(e) => setValues((v) => ({ ...v, [def.key]: e.target.value }))}
                      placeholder={def.placeholder}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : def.type === 'secret' ? (
                    <div className="relative">
                      <Input
                        type={showSecret[def.key] ? 'text' : 'password'}
                        value={values[def.key] ?? ''}
                        onChange={(e) => setValues((v) => ({ ...v, [def.key]: e.target.value }))}
                        placeholder={def.placeholder}
                        className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 pr-10 font-mono text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(s => ({ ...s, [def.key]: !s[def.key] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showSecret[def.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  ) : (
                    <Input
                      value={values[def.key] ?? ''}
                      onChange={(e) => setValues((v) => ({ ...v, [def.key]: e.target.value }))}
                      placeholder={def.placeholder}
                      className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500"
                    />
                  )}
                </div>
              ))}
              <div className="pt-2 border-t border-gray-100">
                <Button
                  onClick={() => handleSave(tab)}
                  disabled={saving === tab}
                  className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
                >
                  {saving === tab ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Kaydet
                </Button>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
