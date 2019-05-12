const log = require('minilog')('eth-scratch3:Ether')

const formatMessage = require('format-message')
const ArgumentType = require('../../../extension-support/argument-type')
const BlockType = require('../../../extension-support/block-type')

const EventEmitter = require('events')

const regEx = require('../regEx')

class ContractBlocks {

    constructor(runtimeProxy) {
        this.runtime = runtimeProxy

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

    getInfo() {

        return {
            id: 'ether',
            name: formatMessage({
                id: 'ether.categoryName',
                default: 'Ether',
                description: 'extension name',
            }),
            blocks: [
                {
                    opcode: 'transfer',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'ether.transfer',
                        default: 'Transfer [VALUE] ether to [TO]',
                        description: 'command text',
                    }),
                    arguments: {
                        TO: {
                            type: ArgumentType.STRING,
                            defaultValue: 'toAddress',
                        },
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: 'balanceOf',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'ether.balanceOf',
                        default: 'Ether balance of [ADDRESS]',
                        description: 'command text',
                    }),
                    arguments: {
                        ADDRESS: {
                            type: ArgumentType.STRING,
                            defaultValue: 'ownerAddress',
                        },
                    },
                },
            ],
        }
    }

    transfer(args)
    {
        const methodName = 'transfer'

        if (!args.TO || !args.TO.match(regEx.ethereumAddress)) {
            log.error(`Invalid TO address "${args.TO}" for the ${methodName} command. Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }
        if (!args.VALUE) {
            log.error(`Invalid value "${args.VALUE}". Must be a positive integer.`)
            return
        }

        const weiAmount = web3.toWei(args.VALUE, "ether")

        return new Promise((resolve, reject) => {

            let description = `send ${args.VALUE} ether (${weiAmount} wei) to address ${args.TO}`

            log.debug(`About to ${description}`)

            this.enableEthereum()
            .then(account => {

                description = `${description} from sender address ${ethereum.selectedAddress}`

                try {

                    this.web3Client.eth.sendTransaction({
                        to: args.TO,
                        value: weiAmount,
                    },
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
                    const error = new VError(err, `Failed to send transaction to ${description}.`)
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

    balanceOf(args)
    {
        if (!args.ADDRESS || !args.ADDRESS.match(regEx.ethereumAddress)) {
            log.error(`Invalid owner address "${args.ADDRESS}" for the balanceOf reporter. Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }

        return new Promise((resolve, reject) => {

            const description = `get balance of account with address ${args.ADDRESS}`

            log.debug(`About to ${description}`)

            this.web3Client.eth.getBalance(args.ADDRESS,
              (err, weiAmount) =>
              {
                if(err) {
                    const error = new VError(err, `Failed to ${description}.`)
                    log.error(error.stack)
                    return reject(error)
                }

                const ethBalance = web3.fromWei(weiAmount, 'ether');

                log.info(`Got ${ethBalance} ether (${weiAmount} wei) from ${description}`)

                resolve(ethBalance)
              })
        })
    }
}
module.exports = ContractBlocks
