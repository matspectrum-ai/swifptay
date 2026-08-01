export type PixPayload = {
  payloadFormatIndicator: string
  pointOfInitiationMethod: string
  merchantAccountInformation: {
    globallyUniqueIdentifier: string
    key: string
  }
  merchantCategoryCode: string
  transactionCurrency: string
  transactionAmount: string
  countryCode: string
  merchantName: string
  merchantCity: string
  additionalDataField: {
    referenceLabel: string
  }
}

function tlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0')
  return `${id}${len}${value}`
}

function crc16(payload: string): string {
  let crc = 0xFFFF
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc = crc << 1
      }
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0')
}

export function buildPixPayload(pixKey: string, amount: number, merchantName: string, merchantCity: string, txid?: string): string {
  const referenceLabel = txid || `SP${Date.now().toString().slice(-8)}`
  const payloadAmount = amount > 0 ? amount.toFixed(2) : ''

  const payload = [
    tlv('00', '01'),
    tlv('26', [
      tlv('00', 'br.gov.bcb.pix'),
      tlv('01', pixKey),
    ].join('')),
    tlv('52', '0000'),
    tlv('53', '986'),
    tlv('54', payloadAmount),
    tlv('58', 'BR'),
    tlv('59', merchantName.slice(0, 25)),
    tlv('60', merchantCity.slice(0, 15)),
    tlv('62', [
      tlv('05', referenceLabel.slice(0, 25)),
    ].join('')),
  ].join('')

  const payloadWithCrc = `${payload}6304`
  const crc = crc16(payloadWithCrc)
  return `${payloadWithCrc}${crc}`
}
