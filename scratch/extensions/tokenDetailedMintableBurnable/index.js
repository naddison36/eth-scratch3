const formatMessage = require('format-message')

const ArgumentType = require('../../../extension-support/argument-type')
const BlockType = require('../../../extension-support/block-type')
const log = require('../../../util/log')

const regEx = require('../regEx')

const Token = require('./TokenDetailedMintableBurnable')

class TokenDetailedMintableBurnableBlocks {

    constructor(runtimeProxy) {
        this.runtime = runtimeProxy

        this.token = new Token()
    }

    getInfo() {

        return {
            // Required: the machine-readable name of this extension.
            // Will be used as the extension's namespace.
            id: 'tokenDetailedMintableBurnable',

            // Optional: the human-readable name of this extension as string.
            // This and any other string to be displayed in the Scratch UI may either be
            // a string or a call to `formatMessage` a plain string will not be
            // translated whereas a call to `formatMessage` will connect the string
            // to the translation map (see below). The `formatMessage` call is
            // similar to `formatMessage` from `react-intl` in form, but will actually
            // call some extension support code to do its magic. For example, we will
            // internally namespace the messages such that two extensions could have
            // messages with the same ID without colliding.
            // See also: https://github.com/yahoo/react-intl/wiki/API#formatmessage
            // name: 'Crypto Beasts',
            name: formatMessage({
                id: 'tokenDetailedMintableBurnable.categoryName',
                default: 'ERC20 Token',
                description: 'extension name',
            }),

            // Optional: URI for a block icon, to display at the edge of each block for this
            // extension. Data URI OK.
            // TODO: what file types are OK? All web images? Just PNG?
            // blockIconURI: 'data:image/pngbase64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',

            // Optional: URI for an icon to be displayed in the blocks category menu.
            // If not present, the menu will display the block icon, if one is present.
            // Otherwise, the category menu shows its default filled circle.
            // Data URI OK.
            // TODO: what file types are OK? All web images? Just PNG?
            // menuIconURI: 'data:image/pngbase64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',

            // Optional: Link to documentation content for this extension.
            // If not present, offer no link.
            // docsURI: 'https://github.com/naddison36/loom-scratch-tcg',

            // Required: the list of blocks implemented by this extension,
            // in the order intended for display.
            blocks: [
                {
                    // Required: the machine-readable name of this operation.
                    // This will appear in project JSON.
                    opcode: 'transfer',

                    // Required: the kind of block we're defining, from a predefined list:
                    // 'command' - a normal command block, like "move {} steps"
                    // 'reporter' - returns a value, like "direction"
                    // 'Boolean' - same as 'reporter' but returns a Boolean value
                    // 'hat' - starts a stack if its value is truthy
                    // 'conditional' - control flow, like "if {}" or "if {} else {}"
                    // A 'conditional' block may return the one-based index of a branch to
                    // run, or it may return zero/falsy to run no branch.
                    // 'loop' - control flow, like "repeat {} {}" or "forever {}"
                    // A 'loop' block is like a conditional block with two differences:
                    // - the block is assumed to have exactly one child branch, and
                    // - each time a child branch finishes, the loop block is called again.
                    blockType: BlockType.COMMAND,

                    // Required for conditional blocks, ignored for others: the number of
                    // child branches this block controls. An "if" or "repeat" block would
                    // specify a branch count of 1 an "if-else" block would specify a
                    // branch count of 2.
                    // TODO: should we support dynamic branch count for "switch"-likes?
                    branchCount: 0,

                    // Optional, default false: whether or not this block ends a stack.
                    // The "forever" and "stop all" blocks would specify true here.
                    terminal: false,

                    // Optional, default false: whether or not to block all threads while
                    // this block is busy. This is for things like the "touching color"
                    // block in compatibility mode, and is only needed if the VM runs in a
                    // worker. We might even consider omitting it from extension docs...
                    blockAllThreads: false,

                    // Required: the human-readable text on this block, including argument
                    // placeholders. Argument placeholders should be in [MACRO_CASE] and
                    // must be [ENCLOSED_WITHIN_SQUARE_BRACKETS].
                    text: formatMessage({
                        id: 'tokenDetailedMintableBurnable.transfer',
                        default: 'Transfer [TO], [VALUE]',
                        description: 'command text',
                    }),

                    // Required: describe each argument.
                    // Argument order may change during translation, so arguments are
                    // identified by their placeholder name. In those situations where
                    // arguments must be ordered or assigned an ordinal, such as interaction
                    // with Scratch Blocks, arguments are ordered as they are in the default
                    // translation (probably English).
                    arguments: {
                        // Required: the ID of the argument, which will be the name in the
                        // args object passed to the implementation function.
                        TO: {
                            // Required: type of the argument / shape of the block input
                            type: ArgumentType.STRING,
                            defaultValue: 'to address',
                        },
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: 'transferFrom',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'tokenDetailedMintableBurnable.transferFrom',
                        default: 'Transfer [FROM], [TO], [VALUE]',
                        description: 'command text',
                    }),
                    arguments: {
                        FROM: {
                            type: ArgumentType.STRING,
                            defaultValue: 'from address',
                        },
                        TO: {
                            type: ArgumentType.STRING,
                            defaultValue: 'to address',
                        },
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: 'approve',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'tokenDetailedMintableBurnable.approve',
                        default: 'Approve [SPENDER], [VALUE]',
                        description: 'command text',
                    }),
                    arguments: {
                        SPENDER: {
                            type: ArgumentType.STRING,
                            defaultValue: 'spender address',
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
                        id: 'tokenDetailedMintableBurnable.balanceOf',
                        default: 'Balance of [ADDRESS]',
                        description: 'command text',
                    }),
                    arguments: {
                        ADDRESS: {
                            type: ArgumentType.STRING,
                            defaultValue: 'address',
                        },
                    },
                },
                {
                    opcode: 'allowance',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'tokenDetailedMintableBurnable.allowance',
                        default: 'Allowance from [OWNER] to [SPENDER]',
                        description: 'command text',
                    }),
                    arguments: {
                        OWNER: {
                            type: ArgumentType.STRING,
                            defaultValue: 'owner address',
                        },
                        SPENDER: {
                            type: ArgumentType.STRING,
                            defaultValue: 'spender address',
                        },
                    },
                },
                {
                    opcode: 'totalSupply',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'tokenDetailedMintableBurnable.totalSupply',
                        default: 'Total supply',
                        description: 'command text',
                    }),
                },
                {
                    opcode: 'symbol',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'tokenDetailedMintableBurnable.symbol',
                        default: 'Symbol',
                        description: 'command text',
                    }),
                },
                {
                    opcode: 'name',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'tokenDetailedMintableBurnable.name',
                        default: 'Name',
                        description: 'command text',
                    }),
                },
                {
                    opcode: 'decimals',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'tokenDetailedMintableBurnable.decimals',
                        default: 'Decimals',
                        description: 'command text',
                    }),
                },
            ],
        }
    }

    transfer(args)
    {
        if (!args.TO || !args.TO.match(regEx.ethereumAddress)) {
            log.error(`Invalid TO address "${args.TO}" for the transfer command. Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }

        if (!Number.isInteger(args.VALUE) && args.VALUE < 0) {
            log.error(`Invalid value for the transfer command. Must be a positive integer, not: ${args.VALUE}`)
            return
        }

        return this.token.transfer(args.TO, args.VALUE)
    }

    transferFrom(args)
    {
        if (!args.FROM || !args.FROM.match(regEx.ethereumAddress)) {
            log.error(`Invalid FROM address "${args.FROM}" for the transfer command. Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }
        if (!args.TO || !args.TO.match(regEx.ethereumAddress)) {
            log.error(`Invalid TO address "${args.TO}" for the transfer command. Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }
        if (!Number.isInteger(args.VALUE) && args.VALUE < 0) {
            log.error(`Invalid value for the transfer from command. Must be a positive integer, not: ${args.VALUE}`)
            return
        }

        return this.token.transferFrom(args.TO, args.FROM, args.VALUE)
    }

    approve(args) {

    }


    allowance(args)
    {
        if (!args.OWNER || !args.OWNER.match(regEx.ethereumAddress)) {
            log.error(`Invalid owner address "${args.OWNER}" for the allowance command. Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }
        if (!args.SENDER || !args.SENDER.match(regEx.ethereumAddress)) {
            log.error(`Invalid spender address "${args.SENDER}" for the allowance command. Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }

        return this.token.allowance(args.OWNER, args.SENDER)
    }


    balanceOf(args)
    {
        if (!args.ADDRESS || !args.ADDRESS.match(regEx.ethereumAddress)) {
            log.error(`Invalid ADDRESS address "${args.ADDRESS}" for the transfer command. Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }

        return this.token.balanceOf(args.ADDRESS)
    }

    totalSupply() {
        return this.token.totalSupply()
    }

    symbol() {
        return this.token.symbol()
    }

    name() {
        return this.token.name()
    }

    decimals() {
        return this.token.decimals()
    }

    setContractAddress(args) {
        if (!args.ADDRESS || !args.ADDRESS.match(regEx.ethereumAddress)) {
            log.error(`Invalid ADDRESS address "${args.ADDRESS}" for the transfer command. Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }

        this.contractAddress = args.ADDRESS

        log.debug(`Contract address set to ${this.contractAddress}`)
    }

    // gets an instance of a contract
    getContract(tokenAddress) {

        if (this.tokenContracts[tokenAddress]) {
            return this.tokenContracts[tokenAddress]
        }
        else {
            console.log(`Creating contract instance for address ${tokenAddress}.`)

            // Get Token contract instance
            this.tokenContracts[tokenAddress] = this.web3Client.eth.contract(TokenContract.abi).at(tokenAddress)

            return this.tokenContracts[tokenAddress]
        }
    }
}
module.exports = TokenDetailedMintableBurnableBlocks
