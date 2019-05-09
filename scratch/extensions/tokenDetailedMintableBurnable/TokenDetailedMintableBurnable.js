const BaseContract = require('../BaseContract')
const TokenContract = require('../contracts/TokenDetailedMintableBurnable.json')

class TokenDetailedMintableBurnable extends BaseContract {

    constructor () {
        super(TokenContract)
    }
}

module.exports = TokenDetailedMintableBurnable
