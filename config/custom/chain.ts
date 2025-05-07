import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts/index'

export const WETH_ADDRESS = "0xccf9D57d9a0468829D6DdC9bE54538b89a37a6da";
export const USDC_ADDRESS = "0xe45eFf7a6889893E166a0Dd84bfAa95ad9d04D64";
export const USDT_ADDRESS = "0x04e61318095bcac3b4F186469598bd4dCCb23621";
export const DAI_ADDRESS = "0x519f46ae0962abe5BF3516B225c3181914A3F735";
export const UNI_ADDRESS = "0xC76413e3c098DC67cfdE4C2E92351792EC6924bf";
export const LINK_ADDRESS = "0x58A4706D2Ae016219D0d5D15a612455E94572334";
export const FACTORY_ADDRESS = "0x68EA48917a3f9416613A48788BCe54578395a315";
export const ROUTER_ADDRESS = "0x1cf29Efd16400F9F4995a0A2261c9c891a556Af9";

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
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('10000')

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
