import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts/index'

export const WETH_ADDRESS = "0x52C84043CD9c865236f11d9Fc9F56aa003c1f922";
export const USDC_ADDRESS = "0x17aB05351fC94a1a67Bf3f56DdbB941aE6c63E25";
export const USDT_ADDRESS = "0x5aa01B3b5877255cE50cc55e8986a7a5fe29C70e";
export const DAI_ADDRESS = "0x5DB9A7629912EBF95876228C24A848de0bfB43A9";
export const UNI_ADDRESS = "0x4Ac1d98D9cEF99EC6546dEd4Bd550b0b287aaD6D";
export const LINK_ADDRESS = "0xA4cD3b0Eb6E5Ab5d8CE4065BcCD70040ADAB1F00";
export const FACTORY_ADDRESS = "0xa4DfF80B4a1D748BF28BC4A271eD834689Ea3407";
export const ROUTER_ADDRESS = "0xe336d36FacA76840407e6836d26119E1EcE0A2b4";

export const REFERENCE_TOKEN = WETH_ADDRESS;
export const STABLE_TOKEN_PAIRS = [
  `${WETH_ADDRESS}-${USDC_ADDRESS}`
];

// token where amounts should contribute to tracked volume and liquidity
export const WHITELIST: string[] = [
  WETH_ADDRESS, // WETH
  USDC_ADDRESS, // USDC
  USDT_ADDRESS, // USDT
  DAI_ADDRESS, // DAI
  UNI_ADDRESS, // UNI
  LINK_ADDRESS // LINK
]

export const STABLECOINS = [
  USDC_ADDRESS,
  USDT_ADDRESS,
  DAI_ADDRESS
];

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('0')

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('1')

export class TokenDefinition {
  address: Address
  symbol: string
  name: string
  decimals: BigInt
}

export const STATIC_TOKEN_DEFINITIONS: TokenDefinition[] = []

export const SKIP_TOTAL_SUPPLY: string[] = []
