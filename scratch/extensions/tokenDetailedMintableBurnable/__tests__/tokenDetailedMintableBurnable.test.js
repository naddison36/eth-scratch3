const Token = require('../TokenDetailedMintableBurnable')
// const regEx = require('../../regEx')

var log = require('minilog').enable()

jest.setTimeout(20000);

describe('TokenDetailedMintableBurnable', () => {

    let token

    beforeAll(() => {
        token = new Token()
    })

    test('Initiated', () => {
        expect(token.tokenContract).toBeDefined()
    })

    // test('deploy', async () => {
    //     const contractAddress = await token.deploy()
    //
    //     console.log(`Deployed contract address is ${contractAddress}`)
    //     // expect(contractAddress).toMatch(regEx.ethereumAddress)
    //     expect(contractAddress).toMatch(/^0x([A-Fa-f0-9]{40})$/)
    // })

    test('Getters', async () => {
        expect(await token.symbol()).toEqual('BMB')
        expect(await token.name()).toEqual('Backer Bucks')
        expect(await token.decimals()).toEqual(0)
    })

    test('View functions', async() => {
        expect(await token.totalSupply()).toEqual(1200000)
        expect(await token.balanceOf('0xfb8e36d94a05b92ec2d92058e0bd00672ad4a514')).toEqual(1200000)
        expect(await token.balanceOf('0x63ED9BFe027f9e3dD3D14CA7612D02E1bfdAab03')).toEqual(0)
        expect(await token.allowance('0xfb8e36d94a05b92ec2d92058e0bd00672ad4a514', '0x63ED9BFe027f9e3dD3D14CA7612D02E1bfdAab03')).toEqual(0)
    })

    test('Transfer 100', async () => {
        const result = await token.transfer('0x63ED9BFe027f9e3dD3D14CA7612D02E1bfdAab03', 100)

        expect(await token.balanceOf('0xfb8e36d94a05b92ec2d92058e0bd00672ad4a514')).toEqual(1199900)
        expect(await token.balanceOf('0x63ED9BFe027f9e3dD3D14CA7612D02E1bfdAab03')).toEqual(100)
    })
})
