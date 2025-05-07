# Uniswap V2 and V2-Tokens Subgraph

## Initial Setup

1. Create the `.env` file in the root directory of the project. You can use the `.env.example` file as a template.

2. Add the following environment variables to the `.env` file:

```bash
# The network you want to deploy to (e.g., mainnet, rinkeby, etc.)
CUSTOM_DEPLOY_URL=http://10.198.246.245:8020/
CUSTOM_IPFS_URL=http://10.198.246.245:5001/

# The address of the Uniswap V2 factory contract
V2_SUBGRAPH_NAME="UNISWAP V2 Subgraph"
V2_SUBGRAPH_VERSION="1.0.0"
```

3. Install dependencies
   `yarn install`

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
