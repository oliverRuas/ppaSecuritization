'use strict';

const commonSecuritizationContract = require('./lib/securitizationContract').commonSecuritizationContract;
const servicingContract = require('./lib/securitizationContract').servicingContract;
const ppaContract=require('./lib/securitizationContract').ppaContract;
const bondIssuanceContract=require('./lib/securitizationContract').bondIssuanceContract;
const securitizationContext = require('./lib/securitizationContract').securitizationContext;

module.exports.securitizationContext=securitizationContext;
module.exports.commonSecuritizationContract = commonSecuritizationContract;
module.exports.servicingContract=servicingContract;
module.exports.ppaContract= ppaContract;
module.exports.bondIssuanceContract= bondIssuanceContract;
module.exports.contracts = [commonSecuritizationContract,servicingContract,ppaContract,bondIssuanceContract];
