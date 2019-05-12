const log = require('minilog')('eth-scratch3:TokenBasic')
const TruffleContractDetails = require('../contracts/TokenBasic.json')

const formatMessage = require('format-message')
const ArgumentType = require('../../../extension-support/argument-type')
const BlockType = require('../../../extension-support/block-type')

const regEx = require('../regEx')
const BaseBlocks = require('../BaseBlocks')
const BaseContract = require('../BaseContract')

class ContractBlocks extends BaseBlocks {

    constructor(runtimeProxy) {
        super(runtimeProxy)
        this.contract = new BaseContract(TruffleContractDetails)

        this.initEvents(['Transfer', 'Approve'])
    }

    getInfo() {

        return {
            id: 'tokenBasic',
            name: formatMessage({
                id: 'tokenBasic.categoryName',
                default: 'Basic ERC20 Token',
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
                        id: 'tokenBasic.deploy',
                        default: 'Deploy contract with total supply [TOTAL_SUPPLY]',
                        description: 'command text',
                    }),
                    arguments: {
                        TOTAL_SUPPLY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: 'transfer',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'tokenBasic.transfer',
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
                        id: 'tokenBasic.transferFrom',
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
                        id: 'tokenBasic.approve',
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
                    opcode: 'balanceOf',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'tokenBasic.balanceOf',
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
                        id: 'tokenBasic.allowance',
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
                        id: 'tokenBasic.totalSupply',
                        default: 'Total supply',
                        description: 'command text',
                    }),
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
            ],
        }
    }

    deploy(args) {
        return this.contract.deploy(
            [args.TOTAL_SUPPLY],
            `deploy token contract with total supply of ${args.TOTAL_SUPPLY}`)
    }

    transfer(args)
    {
        const methodName = 'transfer'

        if (!args.TO || !args.TO.match(regEx.ethereumAddress)) {
            log.error(`Invalid TO address "${args.TO}" for the ${methodName} command. Must be a 40 char hexadecimal with a 0x prefix`)
            return
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
            log.error(`Invalid from address "${args.FROM}" for the ${methodName} command. Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }
        if (!args.TO || !args.TO.match(regEx.ethereumAddress)) {
            log.error(`Invalid to address "${args.TO}" for the ${methodName} command. Must be a 40 char hexadecimal with a 0x prefix`)
            return
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
            log.error(`Invalid spender address "${args.SPENDER}" for the ${methodName} command. Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }

        return this.contract.send(
            methodName,
            [args.SPENDER, args.VALUE],
            `approve ${args.VALUE} tokens to be spent by spender address ${args.SPENDER}`)
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

        return this.contract.call(
            'allowance',
            [args.OWNER, args.SENDER],
            `get token allowance for spender ${args.SENDER} to transfer from owner ${args.OWNER}`)
    }

    balanceOf(args)
    {
        if (!args.ADDRESS || !args.ADDRESS.match(regEx.ethereumAddress)) {
            log.error(`Invalid ADDRESS address "${args.ADDRESS}" for the transfer command. Must be a 40 char hexadecimal with a 0x prefix`)
            return
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
}
module.exports = ContractBlocks
