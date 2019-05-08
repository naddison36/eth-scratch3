const HDWalletProvider = require("truffle-hdwallet-provider")
const config = require('./scratch/extensions/config.js')
const infuraProjectId = config.infuraProjectId
const privateKeys = config.privateKeys

module.exports = {
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // Match any network id
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    parity: {
      host: "127.0.0.1",
      port: 8646,
      network_id: "*" // Match any network id
    },
    ropsten:  {
      provider: () => {
        return new HDWalletProvider(privateKeys, `https://ropsten.infura.io/v3/${infuraProjectId}`)
      },
      network_id: 3,
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      evmVersion: 'petersburg',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200  // Optimize for how many times you intend to run the code
        }
      },
      version: "0.5.8"
    }
  }
}
