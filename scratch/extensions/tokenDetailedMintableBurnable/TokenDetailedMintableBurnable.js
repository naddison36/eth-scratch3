const BaseContract = require('../BaseContract')
const TruffleContractDetails = require('../contracts/TokenDetailedMintableBurnable.json')

class Contract extends BaseContract {

    constructor () {
        super(TruffleContractDetails)
    }
}

module.exports = Contract
