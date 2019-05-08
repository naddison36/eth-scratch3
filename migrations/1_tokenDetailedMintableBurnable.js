const Token = artifacts.require("./TokenDetailedMintableBurnable.sol")

module.exports = function(deployer, network, accounts) {

  deployer.then(async () => {

    console.log(`About to deploy Token contract`)
    await deployer.deploy(Token, 'Backer Bucks', 'BMB', 0, {from: accounts[0]})
    const tokenContract = await Token.deployed()

    console.log(`Token contract address: ${tokenContract.address}`)

    const result = await tokenContract.mint(accounts[0], 1200000)

    console.log(`Mint tx hash: ${JSON.stringify(result.tx)}`)
  })
  .catch((err) => {
    console.log(`Error: ${err}`)
  })
};
