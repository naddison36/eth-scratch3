
const BaseContract = require('../BaseContract')
const TruffleContractDetails = require('../contracts/TokenNFTBasic.json')

class Contract extends BaseContract {
    
    constructor () {
        super(TruffleContractDetails)
    }
}

module.exports = Contract
