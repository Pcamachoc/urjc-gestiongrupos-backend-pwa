// call.controller.js
const { parse } = require('json2csv');
const log = require('../infrastructure/logger/applicationLogger.gateway');
const httpResponseConstants = require('../constants/httpResponse.contants');
const controllerHelper = require('../helpers/controller.helper');
const callService = require('../services/call.service');
const authService = require('../services/auth.service');

// //////////////////////////////////////////////////////////////////////////////
// CONSTANTS & PROPERTIES
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[Call Controller]';
const MIME_TYPE_CSV = 'text/csv';

// //////////////////////////////////////////////////////////////////////////////
// PRIVATE FUNCTIONS
// //////////////////////////////////////////////////////////////////////////////

// Build the condition errors for the controller
function buildConditionErrors() {
  return [{
    errorMsg: authService.ERROR_USER_NOT_AUTHORIZED,
    errorCode: httpResponseConstants.HTTP_UNAUTHORIZED_ERROR,
  }, {
    errorMsg: callService.ERROR_CALL_NOT_FOUND,
    errorCode: httpResponseConstants.HTTP_NOT_FOUND,
  },
  ];
}

function formatAndSend(innerResult, res) {
  const csv = parse(innerResult);
  const buff = Buffer.from(csv);
  res.setHeader('Content-Type', MIME_TYPE_CSV);
  res.setHeader('Content-Disposition', `attachment; filename="resultBallot-${Date.now()}.csv"`);
  res.send(buff);
}

// //////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS
// //////////////////////////////////////////////////////////////////////////////

async function getCalls(req, res) {
  try {
    const params = {};

    log.info(`${MODULE_NAME}:${getCalls.name} (IN) -> params: ${JSON.stringify(params)}`);

    // Check authorization
    await authService.authorizeJWTSecurityHeader(req.headers.authorization);

    // Retrieve idParticipant from token
    const loggedUser = authService.getUserInfoFromAuthHeader(req.headers.authorization);
    params.idParticipant = loggedUser.id;
    const result = await callService.getCalls(params);

    // Return result
    log.info(`${MODULE_NAME}:${getCalls.name} (OUT) -> result: <<list of calls>>`);
    res.json(result);
  } catch (error) {
    controllerHelper.errorHandler(MODULE_NAME, error, res, buildConditionErrors());
  }
}

async function getCallById(req, res) {
  try {
    const params = {
      idCall: controllerHelper.getSwaggerQueryParam(req, 'idCall', undefined),
    };

    log.info(`${MODULE_NAME}:${getCallById.name} (IN) -> params: ${JSON.stringify(params)}`);

    // Check authorization
    await authService.authorizeJWTSecurityHeader(req.headers.authorization);

    const result = await callService.getCallById(params);

    // Return result
    log.info(`${MODULE_NAME}:${getCallById.name} (OUT) -> result: <<list of calls>>`);
    res.json(result);
  } catch (error) {
    controllerHelper.errorHandler(MODULE_NAME, error, res, buildConditionErrors());
  }
}

async function getBallotResult(req, res) {
  try {
    const params = {
      idCall: controllerHelper.getSwaggerQueryParam(req, 'idCall', undefined),
    };

    log.info(`${MODULE_NAME}:${getBallotResult.name} (IN) -> params: ${JSON.stringify(params)}`);

    // Check authorization
    await authService.authorizeJWTSecurityHeader(req.headers.authorization);

    const innerResult = await callService.getBallotResult(params);

    // Return result
    log.info(`${MODULE_NAME}:${getBallotResult.name} (OUT) -> result: <<summary>>`);

    // Formatting output
    formatAndSend(innerResult, res);
  } catch (error) {
    controllerHelper.errorHandler(MODULE_NAME, error, res, buildConditionErrors());
  }
}

module.exports = {
  getCalls,
  getCallById,
  getBallotResult,
};
