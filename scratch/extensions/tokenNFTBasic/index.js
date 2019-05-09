const formatMessage = require('format-message')

const ArgumentType = require('../../../extension-support/argument-type')
const BlockType = require('../../../extension-support/block-type')
const log = require('../../../util/log')

const regEx = require('../regEx')

const Contract = require('./TokenNFTBasic')

class ContractBlocks {

    constructor(runtimeProxy) {
        this.runtime = runtimeProxy

        this.contract = new Contract()
    }

    getInfo() {

        return {
            // Required: the machine-readable name of this extension.
            // Will be used as the extension's namespace.
            id: 'tokenNFTBasic',

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
                id: 'tokenNFTBasic.categoryName',
                default: 'Basic Non-Fungible Token',
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
                    opcode: 'setContract',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'tokenNFTBasic.setContract',
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
