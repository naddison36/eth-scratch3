const log = require('minilog')('eth-scratch3:BaseBlocks')

const formatMessage = require('format-message')
const ArgumentType = require('../../extension-support/argument-type')
const BlockType = require('../../extension-support/block-type')

const regEx = require('./regEx')

class BaseBlocks {

    constructor(runtimeProxy) {
        this.runtime = runtimeProxy

        this.eventQueues = {}
    }

    commonBlocks() {
        return [
            {
                opcode: 'setContract',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                    id: 'tokenBasic.setContract',
                    default: 'Set contract [ADDRESS] on network with id [NETWORK_ID]',
                    description: 'command text',
                }),
                arguments: {
                    ADDRESS: {
                        type: ArgumentType.STRING,
                        defaultValue: 'tokenAddress',
                    },
                    NETWORK_ID: {
                        type: ArgumentType.NUMBER,
                        defaultValue: this.contract.network,
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
                        defaultValue: 'Transfer'
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
                        defaultValue: 'Transfer'
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
                        defaultValue: 'Transfer'
                    }
                }
            },
        ]
    }

    initEvents(eventNames)
    {
        for (let eventName of eventNames) {
            this.registerEvent(eventName)
        }
    }

    registerEvent(eventName)
    {
        log.debug(`Registering event ${eventName}`)

        // Register queue for emitted events
        this.eventQueues[eventName] = {
            queue: [],
            pendingDequeue: false
        }

        // Add event listener to add events to the queue
        this.contract.eventEmitter.on(eventName, (event) => {
            this.eventQueues[eventName].queue.push(event)
            log.info(`Added ${eventName} event to queue with tx hash ${event.transactionHash}. Queue length ${this.eventQueues[eventName].queue.length}`)
        })
    }

    eventsMenu() {
        // for each event queue
        return Object.keys(this.eventQueues).map(eventName => {
            return {
                text: eventName,
                value: eventName,
            }
        })
    }

    // is there a new event that can be dequeued?
    isQueuedEvent(args) {

        const eventName = args.EVENT_NAME

        if (!this.eventQueues || !this.eventQueues[eventName]) {
            log.error(`Failed to find "${eventName}" event queue.`)
            return false
        }

        const eventQueue = this.eventQueues[eventName]

        if (eventQueue.queue.length > 0 && eventQueue.pendingDequeue === false) {
            log.info(`When pending ${eventName} event with hash ${eventQueue.queue[0].transactionHash}`)
            eventQueue.pendingDequeue = true
            return true
        }
        else {
            return false
        }
    }

    // dequeue a pending event
    dequeueEvent(args)
    {
        const eventName = args.EVENT_NAME

        const description = `dequeue the "${eventName}" event`

        if (!this.eventQueues || !this.eventQueues[eventName]) {
            log.error(`Failed to ${description} as failed to find the "${eventName}" event queue.`)
            return
        }

        const eventQueue = this.eventQueues[eventName]

        if (!eventQueue.pendingDequeue) {
            log.error(`Failed to ${description} as no events are on the queue. Queue length ${eventQueue.queue.length}.`)
            return
        }

        log.info(`About to ${description} with hash ${eventQueue.queue[0].transactionHash}`)

        // remove the oldest event from the queue
        eventQueue.queue.shift()
        eventQueue.pendingDequeue = false

        log.debug(`${eventQueue.queue.length} in the "${eventName}" event queue after dequeue`)
    }

    getQueuedEventProperty(args)
    {
        const eventName = args.EVENT_NAME
        const propertyName = args.EVENT_PROPERTY.toLowerCase()

        const description = `read property "${propertyName}" from queued "${eventName}" event`

        if (!this.eventQueues || !this.eventQueues[eventName]) {
            log.error(`Failed to ${description}. The ${eventName} queue does not exist.`)
            return
        }

        const eventQueue = this.eventQueues[eventName]

        if (!eventQueue.pendingDequeue) {
            log.error(`Failed to ${description} as no events are on the queue. Queue length ${eventQueue.queue.length}.`)
            return
        }

        if (!eventQueue.queue[0].args.hasOwnProperty(propertyName)) {
            log.error(`Failed to ${description} as property does not exist on the queued event.`)
            return
        }

        log.debug(`Property ${propertyName} from queued ${eventName} event with hash ${eventQueue.queue[0].transactionHash} has value ${eventQueue.queue[0].args[propertyName]}`)

        return eventQueue.queue[0].args[propertyName]
    }

    setContract(args) {
        const methodName = 'setContractAddress'
        if (!args.ADDRESS || !args.ADDRESS.match(regEx.ethereumAddress)) {
            log.error(`Invalid address "${args.ADDRESS}" for the ${methodName} command. Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }

        this.contract.setContract({
            contractAddress: args.ADDRESS,
            network: args.NETWORK_ID,
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
}
module.exports = BaseBlocks
