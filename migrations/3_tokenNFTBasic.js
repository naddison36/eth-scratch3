const Contract = artifacts.require("./TokenNFTBasic.sol")

module.exports = function(deployer, network, accounts) {

  deployer.then(async () => {

    console.log(`About to deploy a basic non-fungible token contract`)
    await deployer.deploy(Contract, {from: accounts[0]})
    const contract = await Contract.deployed()

    console.log(`Token contract address: ${contract.address}`)
  })
  .catch((err) => {
    console.log(`Error: ${err}`)
  })
};
