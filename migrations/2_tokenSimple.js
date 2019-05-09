const Token = artifacts.require("./TokenSimple.sol")

module.exports = function(deployer, network, accounts) {

  deployer.then(async () => {

    const totalSupply = 1000
    console.log(`About to deploy a simple token contract and mint ${totalSupply} tokens to ${accounts[0]}`)
    await deployer.deploy(Token, totalSupply, {from: accounts[0]})
    const tokenContract = await Token.deployed()

    console.log(`Token contract address: ${tokenContract.address}`)
  })
  .catch((err) => {
    console.log(`Error: ${err}`)
  })
};
