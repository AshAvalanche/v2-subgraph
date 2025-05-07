import { exec as execCallback } from 'child_process'
import * as util from 'util'

import { getSubgraphVersion, getCustomDeploymentParams, getSubgraphName, prepare } from './prepareNetwork'

const exec = util.promisify(execCallback)

// Creating subgraphs is only available from hosted-service dashboard
// yarn graph create $network_name-v2 --node https://api.thegraph.com/deploy/ --access-token $SUBGRAPH_DEPLOY_KEY"
export const build = async (network, subgraphType) => {
  console.log(`Building subgraph for ${network}`)
  console.log(`\n Copying constants & templates for ${network} \n`)
  await prepare(network, subgraphType)
  console.log(`\n Generating manifest for ${network} ${subgraphType} subgraph \n`)
  await exec(
    `cross-env mustache config/${network}/config.json ${subgraphType}-subgraph.template.yaml > ${subgraphType}-subgraph.yaml`
  )
  console.log(`\n Generating types for ${network} ${subgraphType} subgraph \n`)
  await exec(`graph codegen ${subgraphType}-subgraph.yaml`)
  console.log('\n finished generating types \n')
}

export const deploy = async (subgraphType) => {

  const subgraphName = getSubgraphName(subgraphType)
  const node = getCustomDeploymentParams().node
  const ipfs = getCustomDeploymentParams().ipfs
  const versionLabel = getSubgraphVersion(subgraphType)
  // create subgraph
  try {
    const { stdout, stderr } = await exec(`graph create --node ${node} ${subgraphName}`)
    console.log(stderr)
    if (stderr.includes('Subgraph already exists')) {
      console.log('Subgraph already exists. Please update the version label and try again.')
      process.exit(1)
    }
    console.log(stdout)
    console.log('Subgraph created successfully.')
  } catch (e) {
    console.log(e.stdout)
    console.log('Error: Failed to create subgraph. Please try again.')
    process.exit(1)
  }

  // deploy subgraph
  console.log(`Deploying subgraph for ${subgraphName} to ${node} with IPFS ${ipfs}`)

  try {
    const { stdout, stderr } = await exec(
      `graph deploy --node ${node} --ipfs ${ipfs} ${subgraphName} --version-label=${versionLabel} ${subgraphType}-subgraph.yaml`
    )
    console.log(stderr)
    if (stderr.includes('Subgraph version already exists')) {
      console.log('Subgraph version already exists. Please update the version label and try again.')
      process.exit(1)
    }
    console.log(stdout)
    console.log('Subgraph deployed successfully.')
  } catch (e) {
    console.log(e.stdout)
    console.log('Error: Failed to deploy subgraph. Please try again.')
    process.exit(1)
  }
}
