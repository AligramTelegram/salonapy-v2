/** WhatsApp Business API ile mesaj gönder */
export async function sendWhatsApp(
  phoneNumberId: string,
  accessToken: string,
  to: string,  // +90xxxxxxxxxx
  text: string
): Promise<void> {
  const res = await fetch(
    `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text },
      }),
    }
  )
  if (!res.ok) {
    const err = await res.text()
    console.error('[WA Send] Error:', err)
    throw new Error('WhatsApp mesaj gönderilemedi')
  }
}

/** Instagram Graph API ile DM gönder */
export async function sendInstagramDM(
  instagramAccountId: string,
  accessToken: string,
  recipientId: string,
  text: string
): Promise<void> {
  const res = await fetch(
    `https://graph.facebook.com/v19.0/${instagramAccountId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text },
      }),
    }
  )
  if (!res.ok) {
    const err = await res.text()
    console.error('[IG Send] Error:', err)
    throw new Error('Instagram mesaj gönderilemedi')
  }
}
