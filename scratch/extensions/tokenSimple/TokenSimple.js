
const BaseContract = require('../BaseContract')
const TokenContract = require('../contracts/TokenSimple.json')

class TokenSimple extends BaseContract {
    
    constructor () {
        super(TokenContract)
    }
}

module.exports = TokenSimple
