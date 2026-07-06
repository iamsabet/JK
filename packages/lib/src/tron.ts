import TronWeb from 'tronweb'

const USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' // mainnet, use test for shasta

export async function generateTronAddress(): Promise<{ address: string; privateKey?: string }> {
  // For dev: generate random address (no real private key exposed for security)
  const tronWeb = new TronWeb({
    fullHost: process.env.TRON_HOST || 'https://api.shasta.trongrid.io',
  })
  const acc = await tronWeb.createAccount()
  return {
    address: acc.address.base58,
    privateKey: undefined, // never return pk to client
  }
}

export async function getIncomingTransfers(
  address: string,
  since: number
): Promise<any[]> {
  const host = process.env.TRON_HOST || 'https://api.shasta.trongrid.io'
  const url = `${host}/v1/accounts/${address}/transactions/trc20?only_confirmed=true&limit=50&min_timestamp=${since}`
  try {
    const res = await fetch(url)
    const data = await res.json()
    return data.data || []
  } catch {
    return []
  }
}

export function isPaymentConfirmed(
  expectedAmount: number, // in USDT (not decimals)
  transfers: any[],
  toAddress: string
): { confirmed: boolean; tx?: any } {
  const expected = Math.floor(expectedAmount * 1_000_000) // 6 decimals
  for (const t of transfers) {
    if (
      t.to === toAddress &&
      t.contract_address === USDT_CONTRACT &&
      parseInt(t.value) === expected
    ) {
      return { confirmed: true, tx: t }
    }
  }
  return { confirmed: false }
}
