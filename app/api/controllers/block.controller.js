// block.controller.js

const log = require('../infrastructure/logger/applicationLogger.gateway');
const httpResponseConstants = require('../constants/httpResponse.contants');
const controllerHelper = require('../helpers/controller.helper');
const blockService = require('../services/block.service');
const authService = require('../services/auth.service');

// //////////////////////////////////////////////////////////////////////////////
// CONSTANTS & PROPERTIES
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[Block Controller]';

// //////////////////////////////////////////////////////////////////////////////
// PRIVATE FUNCTIONS
// //////////////////////////////////////////////////////////////////////////////

// Build the condition errors for the controller
function buildConditionErrors() {
  return [{
    errorMsg: authService.ERROR_USER_NOT_AUTHORIZED,
    errorCode: httpResponseConstants.HTTP_UNAUTHORIZED_ERROR,
  }, {
    errorMsg: blockService.ERROR_BLOCK_NOT_FOUND,
    errorCode: httpResponseConstants.HTTP_NOT_FOUND,
  }];
}

// //////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS
// //////////////////////////////////////////////////////////////////////////////

async function getBlockByTransactionId(req, res) {
  try {
    const params = {
      transactionId: controllerHelper.getSwaggerQueryParam(req, 'transactionId', null),
    };

    log.info(`${MODULE_NAME}:${getBlockByTransactionId.name} (IN) -> params: ${JSON.stringify(params)}`);

    // Check authorization
    await authService.authorizeJWTSecurityHeader(req.headers.authorization);

    const result = await blockService.getBlockByTransactionId(params);

    // Return result
    log.info(`${MODULE_NAME}:${getBlockByTransactionId.name} (OUT) -> result: ${JSON.stringify(params)}`);
    res.status(httpResponseConstants.HTTP_RESOURCE_CREATED).json(result);
  } catch (error) {
    controllerHelper.errorHandler(MODULE_NAME, error, res, buildConditionErrors());
  }
}

module.exports = {
  getBlockByTransactionId,
};
