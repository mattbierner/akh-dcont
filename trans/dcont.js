 /**
 * Delimited continuation monad transformer.
 * 
 * Based on:
 * http://www.cs.indiana.edu/~sabry/papers/monadicDC.pdf
 * 
 * @TODO: Tail call implementation could be improved.
 */
"use strict"
const nu = require('nu-stream').stream
const UniqueT = require('akh.unique').UniqueT
const spec = require('akh.core.spec')
const DContMonad = require('../spec/dcont')
const tramp = require('akh.core.trampoline')

/* Segments
 ******************************************************************************/
/**
 * Control segment.
 */
const Seg = function(f) {
    this.frame = f
}

/**
 * Delimiter.
 */
const P = function (t) {
    this.prompt = t
}

/* Control Stack
 ******************************************************************************/
/**
 * Empty control stack.
 */
const empty = nu.NIL

/**
 * Push a single frame onto a control stack.
 */
const push = nu.cons

/**
 * Push an entire slice of control stack onto a control stack.
 */
const pushSeq = nu.append

/**
 * Push a delimiter `t` on onto control stack `k`.
 */
const pushP = (t, k) =>
    push(new P(t), k)

/**
 * Push a segment for `f` onto control stack `k`.
 */
const pushSeg = (f, k) =>
    push(new Seg(f), k)

/**
 * Splits the control stack around prompt `t`.
 */
const splitSeq = (t, k) => {
    if (nu.isEmpty(k))
        return [empty, empty]
    
    const x = nu.first(k)
    const xs = nu.rest(k)
    
    if (x instanceof P && x.prompt === t)
        return [empty, xs]
    
    const s = splitSeq(t, xs)
    return [push(x, s[0]), s[1]]
}

/* Transformer
 ******************************************************************************/
const unDContT = (m, k) =>
    tramp.tail(m._run, k)

const runDContT = (m, k) =>
    UniqueT.run(tramp.trampoline(unDContT(m, k))) 

/**
 * Delimited continuation monad transformer.
 * 
 * @param m Base monad.
 */
const DContT = m => {
    const M = UniqueT(m)
    
    const Instance = function(run) {
        this._run = run
    }
    
    /**
     * Apply continuation `k`
     * 
     * @param k Continuation.
     * @param x Value
     */
    const appk = (k, x) => {
        let c = k
        do {
            if (typeof c === 'function')
                return M.of(c(x))
            
            const top = nu.first(c)
            if (top instanceof Seg)
                return unDContT(top.frame(x), nu.rest(c))
            c = top instanceof P ? nu.rest(c) : top
        } while (true)
    }
    
    spec.Monad(Instance,
        x =>
            new Instance(k =>
                appk(k, x)),
        
        function(f) {
            return new Instance(k =>
                unDContT(this, pushSeg(f, k)))
        })

    spec.Transformer(Instance, m,
        t =>
            new Instance(k =>
                M.lift(t.map(tramp.trampoline)).chain(x => tramp.trampoline(appk(k, x)))))
    
    DContMonad(Instance, {
        newPrompt: new Instance(k =>
            M.unique.chain(x => tramp.trampoline(appk(k, x)))),
        
        pushPrompt: (prompt, c) =>
            new Instance(k =>
                unDContT(c, pushP(prompt, k))),
        
        withSubCont: (prompt, f) =>
            new Instance(function(k) {
                const s = splitSeq(prompt, k)
                return unDContT(f(s[0]), s[1])
            }),
        
        pushSubCont: (subk, c) =>
            new Instance(k =>
                unDContT(c, pushSeq(subk, k)))
    })

    Instance.prototype.run = function(k) {
        return DContT.run(this, k)
    }
    
    return Instance
}

/**
 * Perform a continuation computation and complete with `k`.
 * 
 * @param m ContT computation.
 * @param k Outer continuation.
 */
DContT.run = (m, k) =>
    runDContT(m, push(k, empty))

module.exports = DContT
