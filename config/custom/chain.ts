import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts/index'

export const WPBBTC_ADDRESS = "0xd820f6D0297f805Dc7f640f891E1Df356A9DC496";
export const USDC_ADDRESS = "0xbD432441c53620FBf4b393A6A0b7f3117990df98";
export const USDT_ADDRESS = "0x74E50Bbc14d86e0959eD002a081852f3AeD04301";
export const PLANB_ADDRESS = "0xd08C6F6D7B179E6d27EAd067aa0E46645B63Be8C";
export const FACTORY_ADDRESS = "0xA55aa0EAF02592451dA587352C1B3fB82165Cebf";
export const ROUTER_ADDRESS = "0x13b5932c12F0ac19716D4cbAcDBc078a5E27176e";

export const REFERENCE_TOKEN = WPBBTC_ADDRESS;
export const STABLE_TOKEN_PAIRS = [
  '0xf9aa1a3691088ba1ee7ade78c3147b0605dd159d', // USDC-WBPBTC

];

// token where amounts should contribute to tracked volume and liquidity
export const WHITELIST: string[] = [
  WPBBTC_ADDRESS.toLowerCase(),
  USDC_ADDRESS.toLowerCase(),
  USDT_ADDRESS.toLowerCase(),
  PLANB_ADDRESS.toLowerCase()
];


export const STABLECOINS = [
  USDC_ADDRESS,
  USDT_ADDRESS,
];

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('0')

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('0')

export class TokenDefinition {
  address: Address
  symbol: string
  name: string
  decimals: BigInt
}

export const STATIC_TOKEN_DEFINITIONS: TokenDefinition[] = []

export const SKIP_TOTAL_SUPPLY: string[] = []
