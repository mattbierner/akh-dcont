"use strict"
const assert = require('chai').assert
const DContT = require('../index').DContT
const State = require('akh.state').State

const run = function (c, s, k) {
    return State.eval(
        DContT.run(
            c,
            k),
        s)
}

const id = function (x) { return x }

const sqr = function (x) { return x * x }

const M = DContT(State)


describe('DContT', () => {
    it("simple_of", () => {
        const c = M.of(3)
        assert.strictEqual(9, run(c, 's', sqr))
    })

    it("lift", () => {
        const c = M.of(3)
            .chain(function (x) {
                return M.lift(State.modify(function (s) { return s + x * 2 }))
            })
            .chain(function (x) {
                return M.lift(State.get)
            })

        assert.deepEqual(
            run(c, 1, id),
            7)
    })
})
