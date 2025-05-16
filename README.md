# Uniswap V2 and V2-Tokens Subgraph

## Dependencies

- yarn or npm

## Initial Setup

1. Create the `.env` file in the root directory of the project. You can use the `.env.example` file as a template.

2. Add the following environment variables to the `.env` file with your custom values:

```bash
# The network you want to deploy to (e.g., mainnet, rinkeby, etc.)
CUSTOM_DEPLOY_URL=http://10.198.246.245:8020/
CUSTOM_IPFS_URL=http://10.198.246.245:5001/

V2_SUBGRAPH_NAME="UNISWAP V2 Subgraph"
V2_SUBGRAPH_VERSION="1.0.0"
```

3. Install dependencies
   `yarn install`

## Configuring the Subgraph

In order to configure the subgrpah you will need to modify all the files in the [custom](./config/custom/) directory of the project to match your usecase.

1. **Chain.ts**: This file contains :

   - The token, router and factory addresses
     e.g. :

     ```typescript
     export const WETH_ADDRESS = '0x52C84043CD9c865236f11d9Fc9F56aa003c1f922'
     export const USDC_ADDRESS = '0x17aB05351fC94a1a67Bf3f56DdbB941aE6c63E25'
     export const USDT_ADDRESS = '0x5aa01B3b5877255cE50cc55e8986a7a5fe29C70e'
     export const DAI_ADDRESS = '0x5DB9A7629912EBF95876228C24A848de0bfB43A9'
     export const UNI_ADDRESS = '0x4Ac1d98D9cEF99EC6546dEd4Bd550b0b287aaD6D'
     export const LINK_ADDRESS = '0xA4cD3b0Eb6E5Ab5d8CE4065BcCD70040ADAB1F00'
     export const FACTORY_ADDRESS = '0xa4DfF80B4a1D748BF28BC4A271eD834689Ea3407'
     export const ROUTER_ADDRESS = '0xe336d36FacA76840407e6836d26119E1EcE0A2b4'
     ```

   - The reference token address the subgraph will use to fetch the token prices
     e.g. :

     ```typescript
     export const REFERENCE_TOKEN = WETH_ADDRESS
     ```

   - A stable coin pair address to be used for the price calculation
     e.g. :

     ```typescript
     export const STABLE_TOKEN_PAIRS = [
       `0x9fbcf01cee6a10cc9bf3c2a57450fa020e2e616e`, // WETH/USDC
       `0x4a54c00fe54b42868b8e95abf611cbb41c0b76c5` // DAI/USDC
     ]
     ```

     Note: The string must be in lowercase.

   - A whitelist of tokens to be used to track volume and liquidity
     e.g. :

     ```typescript
     export const WHITELIST: string[] = [
       WETH_ADDRESS, // WETH
       USDC_ADDRESS, // USDC
       USDT_ADDRESS, // USDT
       DAI_ADDRESS, // DAI
       UNI_ADDRESS, // UNI
       LINK_ADDRESS // LINK
     ]
     ```

   - The stable coin address to be used for the price calculation
     e.g. :

     ```typescript
     export const STABLECOINS = [USDC_ADDRESS, USDT_ADDRESS, DAI_ADDRESS]
     ```

   - A minimum liquidity threshold for pairs to be considered
     e.g. :

     ```typescript
     export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('0')
     ```

   - The minimum liquidity threshold for prices to be considered
     e.g. :

     ```typescript
     export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('0')
     ```

2. **Config.js**: This file contains the configuration for the subgraph.

   - The type of network you want to deploy to (e.g., mainnet, rinkeby, etc.) in our case it is `subnet`
     e.g. :
     `network: 'subnet'`

   - The factory address of the Uniswap V2 contract
     e.g. :
     `factory: '0xa4DfF80B4a1D748BF28BC4A271eD834689Ea3407'`

   - The start block number for the subgraph
     e.g. :
     `startBlock: 0`

3. The **.subgraph-env**: This file contains the variables to identify the subgraph and his version.
   e.g. :

   ```bash
   V2_TOKEN_SUBGRAPH_NAME="v2-tokens-ash"
   V2_SUBGRAPH_NAME="v2-ash"
   V2_TOKEN_SUBGRAPH_VERSION="v0.0.1"
   ```

## Development

1. Build a v2 subgraph
   `yarn build --network <network> --subgraph-type v2`

2. Deploy a v2 subgraph
   `yarn build --network <network> --subgraph-type v2 --deploy`

3. Build a v2-tokens subgraph
   `yarn build --network <network> --subgraph-type v2-tokens`

4. Deploy a v2-tokens subgraph
   `yarn build --network <network> --subgraph-type v2-tokens --deploy`

Note:

- Deployments will fail if there are uncommitted changes in the subgraph. Please commit your changes before deploying.
- When using the custom setup, remember to modify the chain.ts and the config.ts files with your tokens, factory and router addresses.
