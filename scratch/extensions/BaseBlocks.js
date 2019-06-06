const log = require('minilog')('eth-scratch3:BaseBlocks')

const formatMessage = require('format-message')
const ArgumentType = require('../../extension-support/argument-type')
const BlockType = require('../../extension-support/block-type')

const regEx = require('./regEx')
const QueueManager = require('./QueueManager')

class BaseBlocks {

    constructor(runtimeProxy) {
        this.runtime = runtimeProxy

        // Request the user to connect MetaMask to the Scratch application
        ethereum.enable()

        this.queueManager = new QueueManager()
    }

    commonBlocks() {
        return [
            {
                opcode: 'setContract',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                    id: 'tokenBasic.setContract',
                    default: 'Set contract [ADDRESS]',
                    description: 'command text',
                }),
                arguments: {
                    ADDRESS: {
                        type: ArgumentType.STRING,
                        defaultValue: 'tokenAddress',
                    },
                },
            },
            {
                opcode: 'getContractAddress',
                blockType: BlockType.REPORTER,
                text: formatMessage({
                    id: 'tokenBasic.contractAddress',
                    default: 'Contract Address',
                    description: 'command text',
                }),
            },
            {
                opcode: 'getNetworkId',
                blockType: BlockType.REPORTER,
                text: formatMessage({
                    id: 'tokenBasic.networkId',
                    default: 'Network Identifier',
                    description: 'command text',
                }),
            },
            {
                opcode: 'isQueuedEvent',
                text: formatMessage({
                    id: 'tokenBasic.isQueuedEvent',
                    default: 'When [EVENT_NAME] event',
                    description: 'command text',
                }),
                blockType: BlockType.HAT,
                arguments: {
                    EVENT_NAME: {
                        type: ArgumentType.STRING,
                        menu: 'events',
                        defaultValue: this.eventNames[0]
                    }
                }
            },
            {
                opcode: 'getQueuedEventProperty',
                text: formatMessage({
                    id: 'tokenBasic.getQueuedEventProperty',
                    default: 'Property [EVENT_PROPERTY] of [EVENT_NAME] event',
                    description: 'command text',
                }),
                blockType: BlockType.REPORTER,
                arguments: {
                    EVENT_NAME: {
                        type: ArgumentType.STRING,
                        menu: 'events',
                        defaultValue: this.eventNames[0]
                    },
                    EVENT_PROPERTY: {
                        type: ArgumentType.STRING,
                        menu: 'eventProperties',
                        defaultValue: 'TO'
                    }
                }
            },
            {
                opcode: 'dequeueEvent',
                text: formatMessage({
                    id: 'tokenBasic.dequeueTransfer',
                    default: 'Clear [EVENT_NAME] event',
                    description: 'command text',
                }),
                blockType: BlockType.COMMAND,
                arguments: {
                    EVENT_NAME: {
                        type: ArgumentType.STRING,
                        menu: 'events',
                        defaultValue: this.eventNames[0]
                    }
                }
            },
        ]
    }

    initEvents(eventNames)
    {
        this.eventNames = eventNames

        for (let eventName of eventNames) {
            this.registerEvent(eventName)
        }
    }

    registerEvent(eventName)
    {
        log.debug(`Registering event ${eventName}`)

        this.queueManager.initQueue(eventName)

        // Add event listener to add events to the queue
        this.contract.eventEmitter.on(eventName, (event) => {

            this.queueManager.enqueueItem(eventName, {
                id: event.transactionHash,
                // only storing the event args on the queue
                ...event.args
            })
        })
    }

    eventsMenu() {
        // create an array of Block menu items for each event
        return this.eventNames.map(eventName => {
            return {
                text: eventName,
                value: eventName,
            }
        })
    }

    // is there a new event that can be dequeued?
    // this is a mutating function
    isQueuedEvent(args) {
        return this.queueManager.isQueued(args.EVENT_NAME)
    }

    // dequeue a pending event
    dequeueEvent(args)
    {
        this.queueManager.dequeueItem(args.EVENT_NAME)
    }

    getQueuedEventProperty(args)
    {
        return this.queueManager.readQueuedItemProperty(args.EVENT_NAME, args.EVENT_PROPERTY.toLowerCase())
    }

    setContract(args) {
        const methodName = 'setContractAddress'
        if (!args.ADDRESS || !args.ADDRESS.match(regEx.ethereumAddress)) {
            return this.errorHandler(`Invalid address "${args.ADDRESS}" for the ${methodName} command. Must be a 40 char hexadecimal with a 0x prefix`)
        }

        this.contract.setContract({
            contractAddress: args.ADDRESS,
        })
    }

    getContractAddress()
    {
        if (!this.contract || !this.contract.contractAddress) {
            log.error(`Failed to get contract address as it has not been set.`)
            return
        }

        return this.contract.contractAddress
    }

    getNetworkId()
    {
        if (!ethereum || !ethereum.networkVersion) {
            log.error(`Failed to get network identifier. Make sure a browser wallet like MetaMask has been installed.`)
            return
        }

        return ethereum.networkVersion
    }

    errorHandler(errorMessage) {
        log.error(errorMessage)
        return errorMessage
    }
}
module.exports = BaseBlocks
