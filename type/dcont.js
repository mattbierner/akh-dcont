"use strict"
const Identity = require('akh.identity').Identity
const DContT = require('../trans/dcont')

/**
 * Delimited continuation computation.
 */
const DCont = DContT(Identity);

/**
 * Perform a delimited continuation computation.
 * 
 * @param m Computation.
 * @param k Outer continuation.
 */
DCont.run = (m, k) =>
    Identity.run(DContT.run(m, k))

module.exports = DCont

