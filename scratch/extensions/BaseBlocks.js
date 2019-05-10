const log = require('minilog')('eth-scratch3:BaseBlocks')

const regEx = require('./regEx')

class BaseBlocks {

    constructor(runtimeProxy) {
        this.runtime = runtimeProxy

        this.eventQueues = {}
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
}
module.exports = BaseBlocks