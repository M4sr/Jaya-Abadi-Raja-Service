import webpush from 'web-push'

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY!

webpush.setVapidDetails(
  'mailto:info@jayateknik.com',
  vapidPublicKey,
  vapidPrivateKey
)

export default webpush
