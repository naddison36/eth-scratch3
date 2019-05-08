const log = require('minilog')('eth-scratch3:TokenDetailedMintableBurnable')

const TokenContract = require('../contracts/TokenDetailedMintableBurnable.json')
const ethereumAddress = require('../regEx').ethereumAddress

class TokenDetailedMintableBurnable {

    constructor(options = {}) {
        this.network = options.network || 3   // default to the Ropsten network
        this.contractAddress = options.contractAddress || TokenContract.networks[this.network].address

        if (typeof web3 === 'undefined') {
          log.warn('MetaMask is not installed so will load web3 locally')
          Web3 = require('web3')
          const config = require('../config.js')
          this.web3Client = new Web3(new Web3.providers.HttpProvider(`https://ropsten.infura.io/v3/${config.infuraProjectId}`))
        }
        else {
          if (web3.version) {
            log.debug(`Using injected web3 version ${web3.version.api}`)
          }
          else {
            log.error(`Could not get version of injected web3`)
          }

          this.web3Client = new Web3(web3.currentProvider)
        }

        this.tokenContract = this.web3Client.eth.contract(TokenContract.abi).at(this.contractAddress)

        log.debug(`Token contract address ${this.contractAddress} for network ${this.network}`)
    }

    deploy() {

        // return new Promise((resolve, reject) => {
        //     log.debug(`About to deploy challenge contract signed by challenger ${this.challengerAddress}`)

        //     this.contract.deploy({
        //         data: ChallengeContract.bytecode,
        //     })
        //     .send({from: this.challengerAddress})
        //     .catch(err => {
        //         reject(new Error(`Failed to deploy Challenge contract. ${err.message}`))
        //     })
        //     .then(contract => {
        //         this.contract = contract

        //         log.info(`Deployed Challenge contract address ${this.contract.options.address}`)

        //         resolve(this.contract.options.address)
        //     })
        // })
    }

    transfer(toAddress, value)
    {
        return new Promise((resolve, reject) => {

            if (!toAddress || !toAddress.match(ethereumAddress)) {
                const error = TypeError(`Invalid to address "${toAddress}". Must be a 40 char hexadecimal with a 0x prefix`)
                log.error(error.message)
                return reject(error)
            }

            if (!value) { // TODO add validation that the value can be converted to an integer and is postive
            // if (!value) || !Number.isInteger(value) || value < 0) {
                const error = TypeError(`Invalid transfer value "${value}". Must be a positive integer.`)
                log.error(error.message)
                return reject(error)
            }

            const description = `transfer ${value} tokens to address ${toAddress} in token contract with address ${this.contractAddress}`

            log.debug(`About to ${description}`)

            this.tokenContract.transfer(toAddress, value, (err, transactionHash) => {

                if (err) {
                    log.error(`Failed to ${description}. Error: ${err}`)
                    return reject();
                }

                log.info(`Got transaction hash ${transactionHash} for ${description}`);

                resolve(transactionHash);
            });
        })
    }

    symbol()
    {
        return new Promise((resolve, reject) => {

            const description = `get symbol of token contract at address ${this.contractAddress}`

            log.debug(`About to ${description}`)

            this.tokenContract.symbol((err, symbol) =>
            {
                if(err) {
                    // TODO reject a VError
                    log.error(`Failed to ${description}. Error: ${err}`)
                    return reject()
                }

                log.info(`Got ${symbol} from ${description}`)

                resolve(symbol)
            })
        })
    }

    name()
    {
        return new Promise((resolve, reject) => {

            const description = `get name of token contract at address ${this.contractAddress}`

            log.debug(`About to ${description}`)

            this.tokenContract.name((err, name) =>
            {
                if(err) {
                    // TODO reject a VError
                    log.error(`Failed to ${description}. Error: ${err}`)
                    return reject()
                }

                log.info(`Got ${name} from ${description}`)

                resolve(name)
            })
        })
    }

    decimals()
    {
        return new Promise((resolve, reject) => {

            const description = `get decimals of token contract at address ${this.contractAddress}`

            log.debug(`About to ${description}`)

            this.tokenContract.decimals((err, decimals) =>
            {
                if(err) {
                    // TODO reject a VError
                    log.error(`Failed to ${description}. Error: ${err}`)
                    return reject()
                }

                log.info(`Got ${decimals} from ${description}`)

                try {
                    const convertedDecimals = parseInt(decimals)

                    resolve(convertedDecimals)
                }
                catch (e) {
                    log.error(`Failed to parse ${decimals} returned from ${description}`)
                    reject()
                }
            })
        })
    }

    totalSupply()
    {
        return new Promise((resolve, reject) => {

            const description = `get total supply of tokens of token contract at address ${this.contractAddress}`

            log.debug(`About to ${description}`)

            this.tokenContract.totalSupply((err, totalSupply) =>
            {
                if(err) {
                    // TODO reject a VError
                    log.error(`Failed to ${description}. Error: ${err}`)
                    return reject()
                }

                log.info(`Got ${totalSupply} from ${description}`)

                try {
                    const convertedTotalSupply = parseInt(totalSupply)

                    resolve(convertedTotalSupply)
                }
                catch (e) {
                    log.error(`Failed to parse ${totalSupply} returned from ${description}`)
                    reject()
                }
            })
        })
    }

    balanceOf(ownerAddress)
    {
        if (!ownerAddress || !ownerAddress.match(ethereumAddress)) {
            log.error(`Invalid owner address "${ownerAddress}". Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }

        return new Promise((resolve, reject) => {

            const description = `get token balance of owner address ${ownerAddress} in token contract at address ${this.contractAddress}`

            log.debug(`About to ${description}`)

            this.tokenContract.balanceOf(ownerAddress, (err, balance) => {

                if(err) {
                    log.error(`Failed to ${description}. Error: ${err}`)
                    return reject()
                }

                // calculate a balance = 10 ^ decimals
                // balance = balance.div(10 ** tokenDecimals).toString()

                log.info(`Got ${balance} from ${description}`)

                try {
                    const convertedBalance = parseInt(balance)

                    resolve(convertedBalance)
                }
                catch (e) {
                    log.error(`Failed to parse ${balance} returned from ${description}`)
                    reject()
                }
            })
        })
    }

    allowance(ownerAddress, spenderAddress)
    {
        if (!ownerAddress || !ownerAddress.match(ethereumAddress)) {
            log.error(`Invalid owner address "${ownerAddress}". Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }
        if (!spenderAddress || !spenderAddress.match(ethereumAddress)) {
            log.error(`Invalid spender address "${spenderAddress}". Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }

        return new Promise((resolve, reject) => {

            const description = `get token allowance for spender ${spenderAddress} to transfer from owner ${ownerAddress}`

            log.debug(`About to ${description}`)

            this.tokenContract.allowance(ownerAddress, spenderAddress, (err, allowance) => {

                if(err) {
                    log.error(`Failed to ${description}. Error: ${err}`)
                    return reject()
                }

                log.info(`Got ${allowance} from ${description}`)

                try {
                    const convertedAllowance = parseInt(allowance)

                    resolve(convertedAllowance)
                }
                catch (e) {
                    log.error(`Failed to parse ${allowance} returned from ${description}`)
                    reject()
                }
            })
        })
    }
}

module.exports = TokenDetailedMintableBurnable
