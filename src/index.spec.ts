import { gptstream, useModel } from './index'

describe('gptstream', () => {
    test('SHOULD create gptstream without arguments', async () => {
        const got = gptstream`Please write a short story`
        await got((res) => console.log(res))
    }, 12000)
    // test('SHOULD create gptstream with one argument', async () => {
    //     const got = await gptstream`Please echo the following to prove we can communicate: ${"hello"}`
    //     console.log(got)
    // }, 6000)
    // test('SHOULD create gptstream with multiple arguments', async () => {
    //     const got = await gptstream`Please echo the following to prove we can communicate: ${"hello"}, ${"world"}!`
    //     console.log(got)
    // }, 6000)
})