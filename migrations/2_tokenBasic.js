const Contract = artifacts.require("./TokenBasic.sol")

module.exports = function(deployer, network, accounts) {

  deployer.then(async () => {

    const totalSupply = 1000
    console.log(`About to deploy a basic token contract and mint ${totalSupply} tokens to ${accounts[0]}`)
    await deployer.deploy(Contract, totalSupply, {from: accounts[0]})
    const contract = await Contract.deployed()

    console.log(`Basic token contract address: ${contract.address}`)
  })
  .catch((err) => {
    console.log(`Error: ${err}`)
  })
};
