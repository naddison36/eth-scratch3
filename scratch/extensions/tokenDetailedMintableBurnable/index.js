const log = require('minilog')('eth-scratch3:TokenDetailedMintableBurnable')
const TruffleContractDetails = require('../contracts/TokenDetailedMintableBurnable.json')

const formatMessage = require('format-message')
const ArgumentType = require('../../../extension-support/argument-type')
const BlockType = require('../../../extension-support/block-type')

const regEx = require('../regEx')
const BaseBlocks = require('../BaseBlocks')
const BaseContract = require('../BaseContract')

class ContractBlocks extends BaseBlocks {

    constructor(runtimeProxy) {
        super()
        this.contract = new BaseContract(TruffleContractDetails)

        this.initEvents(['Transfer', 'Approve'])
    }

    getInfo() {

        return {
            id: 'tokenDetailedMintableBurnable',
            name: formatMessage({
                id: 'tokenDetailedMintableBurnable.categoryName',
                default: 'Full Token (ERC20)',
                description: 'extension name',
            }),
            menus: {
                events: this.eventsMenu(),
                eventProperties: [
                    {text: 'From', value: 'from'},
                    {text: 'To', value: 'to'},
                    {text: 'Value', value: 'value'},
                    {text: 'Owner', value: 'owner'},
                    {text: 'Spender', value: 'spender'},
                ],
            },
            blocks: [
                ...this.commonBlocks(),
                {
                    opcode: 'deploy',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'tokenDetailedMintableBurnable.deploy',
                        default: 'Deploy contract with symbol [SYMBOL] name [NAME] and decimals [DECIMALS]',
                        description: 'command text',
                    }),
                    arguments: {
                        SYMBOL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'symbol',
                        },
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'name',
                        },
                        DECIMALS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: 'transfer',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'tokenDetailedMintableBurnable.transfer',
                        default: 'Transfer [VALUE] tokens to [TO]',
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
                    opcode: 'transferFrom',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'tokenDetailedMintableBurnable.transferFrom',
                        default: 'Transfer [VALUE] tokens from [FROM] to [TO]',
                        description: 'command text',
                    }),
                    arguments: {
                        FROM: {
                            type: ArgumentType.STRING,
                            defaultValue: 'fromAddress',
                        },
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
                    opcode: 'approve',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'tokenDetailedMintableBurnable.approve',
                        default: 'Approve [VALUE] tokens to be spent by spender [SPENDER]',
                        description: 'command text',
                    }),
                    arguments: {
                        SPENDER: {
                            type: ArgumentType.STRING,
                            defaultValue: 'spenderAddress',
                        },
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: 'mint',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'tokenDetailedMintableBurnable.mint',
                        default: 'Mint [VALUE] tokens to [TO]',
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
                    opcode: 'burn',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'tokenDetailedMintableBurnable.burn',
                        default: 'Burn [VALUE] tokens',
                        description: 'command text',
                    }),
                    arguments: {
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: 'burnFrom',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'tokenDetailedMintableBurnable.burnFrom',
                        default: 'Burn [VALUE] tokens from [FROM]',
                        description: 'command text',
                    }),
                    arguments: {
                        FROM: {
                            type: ArgumentType.STRING,
                            defaultValue: 'fromAddress',
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
                            defaultValue: 'ownerAddress',
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

    deploy(args) {
        if (!args.SYMBOL || typeof args.SYMBOL !== 'string') {
            return this.errorHandler(`Invalid symbol "${args.SYMBOL}" for contract deploy command. Must be a string`)
        }
        if (!args.NAME || typeof args.NAME !== 'string') {
            return this.errorHandler(`Invalid name "${args.NAME}" for contract deploy command. Must be a string`)
        }
        if (!(args.DECIMALS >= 0)) {
            return this.errorHandler(`Invalid decimals "${args.DECIMALS}" for the ${methodName} command. Must be a positive integer.`)
        }

        return this.contract.deploy(
            [args.SYMBOL, args.NAME, args.DECIMALS],
            `deploy token contract with symbol ${args.SYMBOL}, name ${args.NAME} and decimals ${args.DECIMALS}`)
    }

    transfer(args)
    {
        const methodName = 'transfer'

        if (!args.TO || !args.TO.match(regEx.ethereumAddress)) {
            return this.errorHandler(`Invalid TO address "${args.TO}" for the ${methodName} command. Must be a 40 char hexadecimal with a 0x prefix`)
        }
        if (!(args.VALUE >= 0)) {
            return this.errorHandler(`Invalid value "${args.VALUE}" for the ${methodName} command. Must be a positive integer.`)
        }

        return this.contract.send(
            methodName,
            [args.TO, args.VALUE],
            `transfer ${args.VALUE} tokens to address ${args.TO}`)
    }

    transferFrom(args)
    {
        const methodName = 'transferFrom'

        if (!args.FROM || !args.FROM.match(regEx.ethereumAddress)) {
            return this.errorHandler(`Invalid from address "${args.FROM}" for the ${methodName} command. Must be a 40 char hexadecimal with a 0x prefix`)
        }
        if (!args.TO || !args.TO.match(regEx.ethereumAddress)) {
            return this.errorHandler(`Invalid to address "${args.TO}" for the ${methodName} command. Must be a 40 char hexadecimal with a 0x prefix`)
        }
        if (!(args.VALUE >= 0)) {
            return this.errorHandler(`Invalid value "${args.VALUE}" for the ${methodName} command. Must be a positive integer.`)
        }

        return this.contract.send(
            methodName,
            [args.TO, args.FROM, args.VALUE],
            `transfer ${args.VALUE} tokens from address ${args.FROM} to address ${args.TO}`)
    }

    approve(args)
    {
        const methodName = 'transferFrom'

        if (!args.SPENDER || !args.SPENDER.match(regEx.ethereumAddress)) {
            return this.errorHandler(`Invalid spender address "${args.SPENDER}" for the ${methodName} command. Must be a 40 char hexadecimal with a 0x prefix`)
        }
        if (!(args.VALUE >= 0)) {
            return this.errorHandler(`Invalid value "${args.VALUE}" for the ${methodName} command. Must be a positive integer.`)
        }

        return this.contract.send(
            methodName,
            [args.SPENDER, args.VALUE],
            `approve ${args.VALUE} tokens to be spent by spender address ${args.SPENDER}`)
    }

    mint(args)
    {
        const methodName = 'mint'

        if (!args.TO || !args.TO.match(regEx.ethereumAddress)) {
            return this.errorHandler(`Invalid TO address "${args.TO}" for the ${methodName} command. Must be a 40 char hexadecimal with a 0x prefix`)
        }
        if (!(args.VALUE >= 0)) {
            return this.errorHandler(`Invalid value "${args.VALUE}" for the ${methodName} command. Must be a positive integer.`)
        }

        return this.contract.send(
            methodName,
            [args.TO, args.VALUE],
            `mint ${args.VALUE} tokens to address ${args.TO}`)
    }

    burn(args)
    {
        const methodName = 'burn'

        if (!(args.VALUE >= 0)) {
            return this.errorHandler(`Invalid value "${args.VALUE}" for the ${methodName} command. Must be a positive integer.`)
        }

        return this.contract.send(
            methodName,
            [args.VALUE],
            `burn ${args.VALUE} tokens`)
    }

    burnFrom(args)
    {
        const methodName = 'burn'

        if (!args.FROM || !args.FROM.match(regEx.ethereumAddress)) {
            return this.errorHandler(`Invalid FROM address "${args.FROM}" for the ${methodName} command. Must be a 40 char hexadecimal with a 0x prefix`)
        }
        if (!(args.VALUE >= 0)) {
            return this.errorHandler(`Invalid value "${args.VALUE}" for the ${methodName} command. Must be a positive integer.`)
        }

        return this.contract.send(
            methodName,
            [args.FROM, args.VALUE],
            `mint ${args.VALUE} tokens to address ${args.TO}`)
    }

    allowance(args)
    {
        const methodName = 'allowance'

        if (!args.OWNER || !args.OWNER.match(regEx.ethereumAddress)) {
            return this.errorHandler(`Invalid owner address "${args.OWNER}" for the ${methodName} reporter. Must be a 40 char hexadecimal with a 0x prefix`)
        }
        if (!args.SENDER || !args.SENDER.match(regEx.ethereumAddress)) {
            return this.errorHandler(`Invalid spender address "${args.SENDER}" for the ${methodName} reporter. Must be a 40 char hexadecimal with a 0x prefix`)
        }

        return this.contract.call(
          'allowance',
          [args.OWNER, args.SENDER],
          `get token allowance for spender ${args.SENDER} to transfer from owner ${args.OWNER}`)
    }

    balanceOf(args)
    {
        const methodName = 'balanceOf'

        if (!args.ADDRESS || !args.ADDRESS.match(regEx.ethereumAddress)) {
            return this.errorHandler(`Invalid owner address "${args.ADDRESS}" for the ${methodName} reporter. Must be a 40 char hexadecimal with a 0x prefix`)
        }

        return this.contract.call(
          'balanceOf',
          [args.ADDRESS],
          `get token balance of owner address ${args.ADDRESS}`)
    }

    totalSupply() {
        return this.contract.call(
            'totalSupply',
            [],
            `get total supply`)
    }

    symbol() {
        return this.contract.call(
            'symbol',
            [],
            `get symbol`)
    }

    name() {
        return this.contract.call(
            'name',
            [],
            `get name`)
    }

    decimals() {
        return this.contract.call(
            'decimals',
            [],
            `get decimals`)
    }
}
module.exports = ContractBlocks
