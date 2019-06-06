/*
 Manages a number of different queues which includes a pendingDequeue flag so a separate execution context can watch for new items on the queue.
 When the separate context sees a new item it broadcasts it's seen the new item and updates the pendingDequeue flas to true.
 This is needed in Scratch as it's not a functional language. It can't pass arguments from one command to another.
*/

const log = require('minilog')('eth-scratch3:QueueManager')

class QueueManager {

    // QueueManager is a singleton
    constructor() {

        // return single instance of QueueManager already created
        if (QueueManager.instance) {
            return QueueManager.instance
        }

        // QueueManager instance does not exist so will create one
        QueueManager.instance = this

        // queues object is of type {items: any[], pendingDequeue: boolean}
        this.queues = {}

        // Initialize object
        return QueueManager.instance
    }

    // initialises a queue
    initQueue(queueName)
    {
        this.queues[queueName] = {
            items: [],
            pendingDequeue: false
        }
    }

    // adds an item to a queue
    enqueueItem(queueName, item)
    {
        if (!queueName) {
            return this.errorHandler(`Failed to enqueue item as queue name "${queueName}" was invalid.`)
        }
        if (typeof item === 'undefined') {
            return this.errorHandler(`Failed to enqueue item to the "${queueName}" queue as the item was not passed.`)
        }

        const description = `enqueue item with id ${item.id} to the "${queueName}" queue`

        if (!this.queues || !this.queues[queueName]) {
            return this.errorHandler(`Failed to ${description} as failed to find the "${queueName}" queue.`)
        }

        if (!Array.isArray(this.queues[queueName].items)) {
            return this.errorHandler(`Failed to ${description} as the queue has not been initialised.`)
        }

        this.queues[queueName].items.push(item)

        log.info(`Successful ${description}. Queue length now ${this.queues[queueName].items.length}`)
    }

    // removes the first item from a queue
    dequeueItem(queueName)
    {
        if (!queueName) {
            return this.errorHandler(`Failed to dequeue items as queue name "${queueName}" was invalid.`)
        }

        const description = `dequeue item from the "${queueName}" queue`

        if (!this.queues || !this.queues[queueName]) {
            return this.errorHandler(`Failed to ${description} as failed to find the "${queueName}" queue.`)
        }

        const queue = this.queues[queueName]

        if (!queue.pendingDequeue) {
            return this.errorHandler(`Failed to ${description} as no items are in the queue. Current queue length is ${queue.length}.`)
        }

        // remove the oldest item from the queue
        const item = queue.items.shift()
        queue.pendingDequeue = false

        log.info(`Successful ${description} with id "${item.id}". ${queue.items.length} remain in queue`)
    }

    // Reads a property value of the first item in a queue
    readQueuedItemProperty(queueName, propertyName)
    {
        const description = `read property "${propertyName}" from first item on the "${queueName}" queue`

        if (!this.queues || !this.queues[queueName]) {
            log.error(`Failed to ${description}. The "${queueName}" queue does not exist.`)
            return
        }

        const queue = this.queues[queueName]

        if (!queue.pendingDequeue) {
            log.error(`Failed to ${description} as no items are on the "${queueName}" queue. Queue length ${queue.items.length}.`)
            return
        }

        if (!queue.items[0].hasOwnProperty(propertyName)) {
            log.error(`Failed to ${description} as the property does not exist on the item.`)
            return
        }

        log.debug(`Property "${propertyName}" from first of "${queue.items.length}" items in the "${queueName}" queue with id "${queue.items[0].id}" has value "${queue.items[0][propertyName]}"`)

        return queue.items[0][propertyName]
    }

    // is there a new item that can be dequeued?
    // this is a mutating function.
    isQueued(queueName) {

        if (!this.queues || !this.queues[queueName]) {
            log.error(`Failed to find the "${queueName}" queue.`)
            return false
        }

        const queue = this.queues[queueName]

        // are there any items in the queue
        // and is the next item not pending dequeue?
        if (queue.items.length > 0 && queue.pendingDequeue === false) {
            log.info(`New pending item on the "${queueName}" queue with id ${queue.items[0].id}`)
            queue.pendingDequeue = true
            return true
        }
        else {
            return false
        }
    }

    // Gets the number of items in a queue
    queueLength(queueName) {
        return this.queues[queueName].items.length
    }

    errorHandler(errorMessage) {
        log.error(errorMessage)
        return errorMessage
    }
}

module.exports = QueueManager