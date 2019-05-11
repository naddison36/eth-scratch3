const log = require('minilog')('eth-scratch3:BaseContract')
const VError = require('verror')
const EventEmitter = require('events')

class BaseContract {

    constructor(Contract, options = {}) {

        this.Contract = Contract
        this.eventEmitter = new EventEmitter()

        // For MetaMask >= 4.14.0
        if (window.ethereum) {
            this.web3Client = new Web3(ethereum)
        }
        // For MetaMask < 4.14.0
        else if (window.web3) {
            this.web3Client = new Web3(web3.currentProvider)
        }
        // This should only be used for unit testing
        else {
            log.warn('MetaMask is not installed so will load web3 locally.')
            Web3 = require('web3')
            this.web3Client = new Web3(options.provider)
        }

        this.setContract(options)
    }

    setContract(options)
    {
        this.network = options.network || 3 // default to the Ropsten network
        this.contractAddress = options.contractAddress || this.Contract.networks[this.network].address

        this.contract = this.web3Client.eth.contract(this.Contract.abi).at(this.contractAddress)

        log.debug(`Set contract to address ${this.contractAddress} for network ${this.network}`)

        this.startWatchingEvents()
    }

    // of selected address of the browser wallet is not available, then
    // request access to the browser wallet from the user
    enableEthereum() {

        if (ethereum.selectedAddress) {
            return Promise.resolve(ethereum.selectedAddress)
        }

        log.debug(`About to request access to the browser wallet from the user`)

        return new Promise((resolve, reject) => {

            ethereum.enable()
            .then(() => {
                log.info(`Enabled browser wallet with selected address ${ethereum.selectedAddress}`)
                resolve(ethereum.selectedAddress)
            })
            .catch((err) => {
                const error = new VError(err, `Failed to enable the browser wallet.`)
                log.error(error.message)
                reject(error)
            })
        })
    }

    deploy(params, description)
    {
        return new Promise((resolve, reject) => {

            description = `${description} using sender address ${ethereum.selectedAddress}, network with id ${ethereum.networkVersion} with params ${JSON.stringify(params)}`

            this.enableEthereum()
            .then(account => {

                description = `${description} and sender address ${ethereum.selectedAddress}`

                this.contract = web3.eth.contract(this.Contract.abi)

                try {
                    this.contract.new(
                        ...params,
                        {data: this.Contract.bytecode},
                        (err, contract) =>
                    {
                        if(err) {
                            const error = new VError(err, `Failed to ${description}.`)
                            log.error(error.stack)
                            return reject(error)
                        }
    
                        if(!contract.address) {
                            log.info(`Got transaction hash ${contract.transactionHash} for ${description}`)
                        }
                        else {
                            this.setContract({
                                contractAddress: contract.address,
                                network: web3.version.network
                            })
    
                            resolve(contract.address)
                        }
                    })
                }
                catch (err) {
                    const error = new VError(err, `Failed to send ${description}.`)
                    log.error(error.stack)
                    return reject(error)
                }
            })
            .catch(err => {
                const error = new VError(err, `Failed to enable browser wallet before ${description}`)
                log.error(error.stack)
                reject(error)
            })
        })
    }

    send(methodName, args, description)
    {
        return new Promise((resolve, reject) => {

            description = `${description} using contract with address ${this.contractAddress}, network with id ${ethereum.networkVersion}`

            log.debug(`About to ${description}`)

            this.enableEthereum()
            .then(account => {

                description = `${description} and sender address ${ethereum.selectedAddress}`

                try {
                    this.contract[methodName].sendTransaction(...args,
                    (err, transactionHash) =>
                    {
                        if(err) {
                            const error = new VError(err, `Failed to ${description}.`)
                            log.error(error.stack)
                            return reject(error)
                        }
        
                        log.info(`Got transaction hash ${transactionHash} for ${description}`)
        
                        resolve(transactionHash)
                    })
                }
                catch (err) {
                    const error = new VError(err, `Failed to send ${description}.`)
                    log.error(error.stack)
                    return reject(error)
                }
            })
            .catch(err => {
                const error = new VError(err, `Failed to enable browser wallet before ${description}`)
                log.error(error.stack)
                reject(error)
            })
        })
    }

    call(methodName, args, description)
    {
        return new Promise((resolve, reject) => {

            const callDescription = `${description} using contract with address ${this.contractAddress}`

            log.debug(`About to ${callDescription} calling method name ${methodName}`)

            this.contract[methodName](...args, (err, returnedValue) =>
            {
                if(err) {
                    const error = new VError(err, `Failed to ${callDescription}.`)
                    log.error(error.stack)
                    return reject(error)
                }

                log.info(`Got ${returnedValue} from ${callDescription}`)

                resolve(returnedValue)
            })
        })
    }

    startWatchingEvents() {

        const eventDescription = `watching for events on contract with address ${this.contractAddress}`

        log.debug(`Start ${eventDescription}`)

        this.contract.allEvents().watch((err, event) =>
        {
            if (err) {
                const error = new VError(err, `Failed ${eventDescription}.`)
                log.error(error.stack)
                return callback(error)
            }

            log.info(`Got event ${event.event} from contract ${this.contractAddress}: ${JSON.stringify(event)}`)

            this.eventEmitter.emit(event.event, event)
        })
    }
}

module.exports = BaseContract
