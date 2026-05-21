const QRCode = require('qrcode')
const path = require('path')

const URL = 'https://plus-one-blush.vercel.app/onboard'
const OUTPUT = path.join(__dirname, '..', 'qr-code.png')

QRCode.toFile(OUTPUT, URL, {
  width: 600,
  margin: 2,
  color: {
    dark: '#2A2A2A',
    light: '#FAF7F2',
  },
}, (err) => {
  if (err) throw err
  console.log(`QR code saved to: ${OUTPUT}`)
  console.log(`URL: ${URL}`)
})
