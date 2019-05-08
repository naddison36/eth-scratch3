const TokenContract = artifacts.require('TokenDetailedMintableBurnable')

let tokenContract

contract('TokenDetailedMintableBurnable', async accounts => {

    before(async () => {
        tokenContract = await TokenContract.deployed()
    })

    it('First card using explicit getter', async () => {
        assert.equal(await tokenContract.symbol.call(), 'BMB')
        assert.equal(await tokenContract.name.call(), 'Backer Bucks')
    })
})
