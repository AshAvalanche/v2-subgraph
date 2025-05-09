/* eslint-disable prefer-const */
import { Address, BigDecimal, BigInt, log } from '@graphprotocol/graph-ts/index'

import { Bundle, Pair, PairTokenLookup, Token, PairDayData, UniswapDayData} from '../../generated/schema'
import {
  MINIMUM_LIQUIDITY_THRESHOLD_ETH,
  MINIMUM_USD_THRESHOLD_NEW_PAIRS,
  REFERENCE_TOKEN,
  STABLE_TOKEN_PAIRS,
  STABLECOINS,
  WHITELIST,
} from './chain'
import { ADDRESS_ZERO, ONE_BD, ZERO_BD } from './constants'

export function getEthPriceInUSD(): BigDecimal {
  // create an array with same length as STABLE_TOKEN_PAIRS
  let stableTokenPairs = new Array<Pair | null>(STABLE_TOKEN_PAIRS.length)
  let stableTokenReserves = new Array<BigDecimal>(STABLE_TOKEN_PAIRS.length)
  let stableTokenPrices = new Array<BigDecimal>(STABLE_TOKEN_PAIRS.length)
  let stableTokenIsToken0 = new Array<boolean>(STABLE_TOKEN_PAIRS.length)
  let totalLiquidityETH = ZERO_BD
  for (let i = 0; i < STABLE_TOKEN_PAIRS.length; i++) {
    const stableTokenPair = Pair.load(STABLE_TOKEN_PAIRS[i])
    if (stableTokenPair) {
      stableTokenIsToken0[i] = stableTokenPair.token1 == REFERENCE_TOKEN
      if (stableTokenIsToken0[i]) {
        stableTokenReserves[i] = stableTokenPair.reserve1
        stableTokenPrices[i] = stableTokenPair.token0Price
        totalLiquidityETH = totalLiquidityETH.plus(stableTokenPair.reserve1)
      } else {
        stableTokenReserves[i] = stableTokenPair.reserve0
        stableTokenPrices[i] = stableTokenPair.token1Price
        totalLiquidityETH = totalLiquidityETH.plus(stableTokenPair.reserve0)
      }
    }
    stableTokenPairs[i] = stableTokenPair
  }

  let tokenPrice = BigDecimal.fromString('0')
  for (let i = 0; i < STABLE_TOKEN_PAIRS.length; i++) {
    if (stableTokenPairs[i] !== null) {
      tokenPrice = tokenPrice.plus(stableTokenPrices[i].times(safeDiv(stableTokenReserves[i], totalLiquidityETH)))
    }
  }
  return tokenPrice
}

// return 0 if denominator is 0 in division
export function safeDiv(amount0: BigDecimal, amount1: BigDecimal): BigDecimal {
  if (amount1.equals(ZERO_BD)) {
    return ZERO_BD
  } else {
    return amount0.div(amount1)
  }
}

/**
 * Search through graph to find derived Eth per token.
 * @todo update to be derived ETH (add stablecoin estimates)
 **/
export function findEthPerToken(token: Token): BigDecimal {
  // Handle the reference token (e.g., WETH) with a fixed value of 1 ETH
  if (token.id.toLowerCase() == REFERENCE_TOKEN.toLowerCase()) {
    return ONE_BD;
  }

  // Handle stablecoins by inverting the ETH/USD price
  if (STABLECOINS.map<string>(s => s.toLowerCase()).includes(token.id.toLowerCase())) {
    const bundle = Bundle.load('1');
    if (bundle && bundle.ethPrice.notEqual(ZERO_BD)) {
      return safeDiv(ONE_BD, bundle.ethPrice);
    }
    return ZERO_BD;
  }

  // Search for pairs with whitelisted tokens
  for (let i = 0; i < WHITELIST.length; ++i) {
    let pairLookup = PairTokenLookup.load(
      token.id.concat('-').concat(Address.fromString(WHITELIST[i]).toHexString())
    );

    if (pairLookup) {
      let pairId = pairLookup.pair;
      if (pairId != ADDRESS_ZERO) {
        let pair = Pair.load(pairId);
        if (pair && pair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
          // If the token is token0
          if (pair.token0 == token.id) {
            let token1 = Token.load(pair.token1);
            if (token1) {
              return pair.token1Price.times(token1.derivedETH as BigDecimal);
            }
          }
          // If the token is token1
          if (pair.token1 == token.id) {
            let token0 = Token.load(pair.token0);
            if (token0) {
              return pair.token0Price.times(token0.derivedETH as BigDecimal);
            }
          }
        }
      }
    }
  }

  return ZERO_BD; // Return 0 if no price is found
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD.
 * If both are, return average of two amounts
 * If neither is, return 0
 */
export function getTrackedVolumeUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token,
  pair: Pair
): BigDecimal {
  let bundle = Bundle.load('1')!
  let price0 = token0.derivedETH.times(bundle.ethPrice)
  let price1 = token1.derivedETH.times(bundle.ethPrice)

  // if less than 5 LPs, require high minimum reserve amount amount or return 0
  if (pair.liquidityProviderCount.lt(BigInt.fromI32(5))) {
    let reserve0USD = pair.reserve0.times(price0)
    let reserve1USD = pair.reserve1.times(price1)
    if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      if (reserve0USD.plus(reserve1USD).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return ZERO_BD
      }
    }
    if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
      if (reserve0USD.times(BigDecimal.fromString('2')).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return ZERO_BD
      }
    }
    if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      if (reserve1USD.times(BigDecimal.fromString('2')).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return ZERO_BD
      }
    }
  }

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1)).div(BigDecimal.fromString('2'))
  }

  // take full value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0)
  }

  // take full value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1)
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD * 2.
 * If both are, return sum of two amounts
 * If neither is, return 0
 */
export function getTrackedLiquidityUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  let bundle = Bundle.load('1')!
  let price0 = token0.derivedETH.times(bundle.ethPrice)
  let price1 = token1.derivedETH.times(bundle.ethPrice)

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1))
  }

  // take double value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).times(BigDecimal.fromString('2'))
  }

  // take double value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1).times(BigDecimal.fromString('2'))
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD
}

export function getTokenTrackedLiquidityUSD(
  tokenForPricing: Token,
  tokenForPricingAmount: BigDecimal,
  companionTokenAmount: BigDecimal,
  companionToken: Token
): BigDecimal {
  let bundle = Bundle.load('1')!
  let price0 = tokenForPricing.derivedETH.times(bundle.ethPrice)
  let price1 = companionToken.derivedETH.times(bundle.ethPrice)

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(tokenForPricing.id) && WHITELIST.includes(companionToken.id)) {
    return tokenForPricingAmount.times(price0)
  }

  // take double value of the whitelisted token amount
  if (WHITELIST.includes(tokenForPricing.id) && !WHITELIST.includes(companionToken.id)) {
    return tokenForPricingAmount.times(price0)
  }

  // take double value of the whitelisted token amount
  if (!WHITELIST.includes(tokenForPricing.id) && WHITELIST.includes(companionToken.id)) {
    return companionTokenAmount.times(price1)
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD
}


/**
 * Calculate the APY for a Uniswap V2 LP position based on daily fees.
 *
 * APY = (dailyFees / totalReserveUSD) * 365
 *
 * @param dailyVolumeUSD - the daily volume in USD
 * @param reserveUSD - the total reserve in USD
 * @returns BigDecimal - the APY (as a decimal, e.g. 0.15 = 15%)
 */
export function calculateAPY(dailyVolumeUSD: BigDecimal, reserveUSD: BigDecimal): BigDecimal {
  // Avoid division by zero
  if (reserveUSD.equals(ZERO_BD)) {
    return ZERO_BD
  }

  // Uniswap V2 fee rate is 0.3% per swap
  let feeRate = BigDecimal.fromString('0.003')

  // Compute daily fees in USD
  let dailyFeesUSD = dailyVolumeUSD.times(feeRate)

  // Daily rate relative to pool TVL
  let dailyRate = dailyFeesUSD.div(reserveUSD)

  // Annualize (simple compounding approximation)
  let apy = dailyRate.times(BigDecimal.fromString('365'))

  return apy
}

