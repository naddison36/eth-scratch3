
const BaseContract = require('../BaseContract')
const TruffleContractDetails = require('../contracts/TokenBasic.json')

class Contract extends BaseContract {

    constructor () {
        super(TruffleContractDetails)
    }
}

module.exports = Contract
