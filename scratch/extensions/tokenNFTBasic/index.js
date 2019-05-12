const log = require('minilog')('eth-scratch3:TokenNFTBasic')
const TruffleContractDetails = require('../contracts/TokenNFTBasic.json')

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

        this.initEvents(['Transfer', 'Approve', 'ApprovalForAll'])
    }

    getInfo() {

        return {
            id: 'tokenNFTBasic',
            name: formatMessage({
                id: 'tokenNFTBasic.categoryName',
                default: 'Basic Non-Fungible Token (ERC721)',
                description: 'extension name',
            }),
            menus: {
                events: this.eventsMenu(),
                eventProperties: [
                    {text: 'From', value: 'from'},
                    {text: 'To', value: 'to'},
                    {text: 'Token ID', value: 'tokenId'},
                    {text: 'Owner', value: 'owner'},
                    {text: 'Operator', value: 'operator'},
                    {text: 'Approved', value: 'approved'},
                ],
            },
            blocks: [
                ...this.commonBlocks(),
                {
                    opcode: 'deploy',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'tokenNFTBasic.deploy',
                        default: 'Deploy contract',
                        description: 'command text',
                    }),
                },
                {
                    opcode: 'transferFrom',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'tokenNFTBasic.transferFrom',
                        default: 'Transfer token id [TOKEN_ID] from [FROM] to [TO]',
                        description: 'command text',
                    }),
                    arguments: {
                        TO: {
                            type: ArgumentType.STRING,
                            defaultValue: 'toAddress',
                        },
                        FROM: {
                            type: ArgumentType.STRING,
                            defaultValue: 'fromAddress',
                        },
                        TOKEN_ID: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: 'safeTransferFrom',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'tokenNFTBasic.safeTransferFrom',
                        default: 'Safe transfer token id [TOKEN_ID] from [FROM] to [TO] with data [DATA]',
                        description: 'command text',
                    }),
                    arguments: {
                        TO: {
                            type: ArgumentType.STRING,
                            defaultValue: 'toAddress',
                        },
                        FROM: {
                            type: ArgumentType.STRING,
                            defaultValue: 'fromAddress',
                        },
                        TOKEN_ID: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: '0x0',
                        },
                    },
                },
                {
                    opcode: 'approve',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'tokenNFTBasic.approve',
                        default: 'Approve [TO] to control token id [TOKEN_ID]',
                        description: 'command text',
                    }),
                    arguments: {
                        TO: {
                            type: ArgumentType.STRING,
                            defaultValue: 'toAddress',
                        },
                        TOKEN_ID: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: 'setApprovalForAll',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'tokenNFTBasic.setApprovalForAll',
                        default: 'Set operator [OPERATOR] approval for all tokens [APPROVED]',
                        description: 'command text',
                    }),
                    arguments: {
                        OPERATOR: {
                            type: ArgumentType.STRING,
                            defaultValue: 'operatorAddress',
                        },
                        APPROVED: {
                            type: ArgumentType.BOOLEAN,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: 'getApproved',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'tokenNFTBasic.getApproved',
                        default: 'Approved controller of token id [TOKEN_ID]',
                        description: 'command text',
                    }),
                    arguments: {
                        TOKEN_ID: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: 'isApprovedForAll',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'tokenNFTBasic.isApprovedForAll',
                        default: 'Is operator [OPERATOR] approved to control all owner\'s [OWNER] tokens',
                        description: 'command text',
                    }),
                    arguments: {
                        OPERATOR: {
                            type: ArgumentType.STRING,
                            defaultValue: 'operatorAddress',
                        },
                        OWNER: {
                            type: ArgumentType.STRING,
                            defaultValue: 'ownerAddress',
                        },
                    },
                },
                {
                    opcode: 'balanceOf',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'tokenNFTBasic.balanceOf',
                        default: 'Count tokens of owner [OWNER]',
                        description: 'command text',
                    }),
                    arguments: {
                        OWNER: {
                            type: ArgumentType.STRING,
                            defaultValue: 'ownerAddress',
                        },
                    },
                },
                {
                    opcode: 'ownerOf',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'tokenNFTBasic.ownerOf',
                        default: 'Owner of token id [TOKEN_ID]',
                        description: 'command text',
                    }),
                    arguments: {
                        TOKEN_ID: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
            ],
        }
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

    deploy(args) {
        return this.contract.deploy(
            [],
            `deploy non-fungible token contract`)
    }

    transferFrom(args)
    {
        const methodName = 'transferFrom'

        if (!args.FROM || !args.FROM.match(regEx.ethereumAddress)) {
            log.error(`Invalid to address "${args.FROM}" for the ${methodName} command. Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }
        if (!args.TO || !args.TO.match(regEx.ethereumAddress)) {
            log.error(`Invalid to address "${args.TO}" for the ${methodName} command. Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }

        return this.contract.send(
            methodName,
            [args.FROM, args.TO, args.TOKEN_ID],
            `transfer token with id ${args.TOKEN_ID} from address ${args.FROM} to address ${args.TO}`)
    }

    safeTransferFrom(args)
    {
        const methodName = 'safeTransferFrom'

        if (!args.FROM || !args.FROM.match(regEx.ethereumAddress)) {
            log.error(`Invalid to address "${args.FROM}" for the ${methodName} command. Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }
        if (!args.TO || !args.TO.match(regEx.ethereumAddress)) {
            log.error(`Invalid to address "${args.TO}" for the ${methodName} command. Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }

        return this.contract.send(
            methodName,
            [args.FROM, args.TO, args.TOKEN_ID, args.DATA],
            `transfer token with id ${args.TOKEN_ID} from address ${args.FROM} to address ${args.TO}`)
    }

    approve(args)
    {
        const methodName = 'approve'

        if (!args.TO || !args.TO.match(regEx.ethereumAddress)) {
            log.error(`Invalid to address "${args.TO}" for the ${methodName} command. Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }

        return this.contract.send(
            methodName,
            [args.TO, args.TOKEN_ID],
            `approve token with id ${args.TOKEN_ID} to be controlled by address ${args.TO}`)
    }

    getApproved(args)
    {
        const methodName = 'getApproved'

        return this.contract.call(
            methodName,
            [args.TOKEN_ID],
            `get operator approved to control token with id ${args.TOKEN_ID}`)
    }

    setApprovalForAll(args)
    {
        const methodName = 'setApprovalForAll'

        if (!args.OPERATOR || !args.OPERATOR.match(regEx.ethereumAddress)) {
            log.error(`Invalid operator address "${args.OPERATOR}" for the ${methodName} command. Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }

        return this.contract.send(
            methodName,
            [args.OPERATOR, args.APPROVED],
            `set operator ${args.OPERATOR} approval for all tokens to ${args.APPROVED}`)
    }


    isApprovedForAll(args)
    {
        const methodName = 'isApprovedForAll'

        if (!args.OWNER || !args.OWNER.match(regEx.ethereumAddress)) {
            log.error(`Invalid owner address "${args.OWNER}" for the ${methodName} reporter. Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }
        if (!args.OPERATOR || !args.OPERATOR.match(regEx.ethereumAddress)) {
            log.error(`Invalid owner address "${args.OPERATOR}" for the ${methodName} reporter. Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }

        return this.contract.call(
            methodName,
            [args.OWNER, args.OPERATOR],
            `is operator ${args.OPERATOR} approved to control all owner\'s [OWNER] tokens?`)
    }

    balanceOf(args)
    {
        const methodName = 'balanceOf'

        if (!args.OWNER || !args.OWNER.match(regEx.ethereumAddress)) {
            log.error(`Invalid owner address "${args.OWNER}" for the ${methodName} reporter. Must be a 40 char hexadecimal with a 0x prefix`)
            return
        }

        return this.contract.call(
            methodName,
            [args.OWNER],
            `count tokens owned by ${args.OWNER}`)
    }

    ownerOf(args)
    {
        const methodName = 'ownerOf'

        return this.contract.call(
            methodName,
            [args.TOKEN_ID],
            `get owner of token with id ${args.TOKEN_ID}`)
    }
}
module.exports = ContractBlocks
