"use strict"
const DContT = require('./trans/dcont');
const DCont = require('./type/dcont');

module.exports = {
    DContT: DContT,
    DCont: DCont,

    trans: { dcont: DContT },
    type: { dcont: DCont }
};
