"use strict"

/**
 * DCont monad interface.
 */
const DContMonad = (instance, spec) => {
    /**
     * M.newPrompt
     * 
     * Create a new unique prompt.
     */
    instance.newPrompt = instance.prototype.newPrompt = spec.newPrompt
    
    /**
     * M.pushPrompt(prompt, c)
     * 
     * Pushes prompt onto the stack and evaluate `c`.
     * 
     * @param prompt Prompt.
     * @param c Computation.
     */
    instance.pushPrompt = instance.prototype.pushPrompt = spec.pushPrompt
    
    /**
     * M.withSubCont(prompt, f)
     * 
     * Capture the continuation delimited by `prompt` and call `f` with it.
     * 
     * @param prompt Prompt.
     * @param f Function mapping delimited continuation to computation.
     */
    instance.withSubCont = instance.prototype.withSubCont = spec.withSubCont
    
    /**
     * M.pushSubCont(subk, c)
     * 
     * Push an entire sub continuation onto the stack and evaluate `c`.
     * 
     * @param subk Sub continuation.
     * @param c Computation
     */
    instance.pushSubCont = instance.prototype.pushSubCont = spec.pushSubCont
    
// Derived
    /**
     * M.reset(f)
     * 
     * Delimit a continuation
     * 
     * @param f Function taking a new prompt and returning the computation to be 
     *    enclosed.
     */
    instance.reset = instance.prototype.reset = f =>
        spec.newPrompt.chain(p => spec.pushPrompt(p, f(p)))
    
    /**
     * M.shift(p)
     * 
     * Capture the continuation delimited by `p`
     * 
     * @param p Prompt.
     * @param f Function taking current delimited continuation.
     */
    instance.shift = instance.prototype.shift = (p, f) =>
        spec.withSubCont(p, k =>
            spec.pushPrompt(p, f(c =>
                spec.pushPrompt(p, spec.pushSubCont(k, c)))))
    
    return instance
}

module.exports = DContMonad
