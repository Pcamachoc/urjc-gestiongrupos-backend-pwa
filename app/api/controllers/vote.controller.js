// vote.controller.js

const log = require('../infrastructure/logger/applicationLogger.gateway');
const httpResponseConstants = require('../constants/httpResponse.contants');
const controllerHelper = require('../helpers/controller.helper');
const voteService = require('../services/vote.service');
const authService = require('../services/auth.service');

// //////////////////////////////////////////////////////////////////////////////
// CONSTANTS & PROPERTIES
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[Vote Controller]';

// //////////////////////////////////////////////////////////////////////////////
// PRIVATE FUNCTIONS
// //////////////////////////////////////////////////////////////////////////////

// Build the condition errors for the controller
function buildConditionErrors() {
  return [{
    errorMsg: authService.ERROR_USER_NOT_AUTHORIZED,
    errorCode: httpResponseConstants.HTTP_UNAUTHORIZED_ERROR,
  }, {
    errorMsg: voteService.ERROR_VOTES_NOT_FOUND,
    errorCode: httpResponseConstants.HTTP_NOT_FOUND,
  }, {
    errorMsg: voteService.ERROR_VOTE_NOT_FOUND,
    errorCode: httpResponseConstants.HTTP_NOT_FOUND,
  }, {
    errorMsg: voteService.ERROR_CALL_NOT_FOUND,
    errorCode: httpResponseConstants.HTTP_NOT_FOUND,
  }, {
    errorMsg: voteService.ERROR_CALL_OVER,
    errorCode: httpResponseConstants.HTTP_CONFLICT,
  }, {
    errorMsg: voteService.ERROR_PARTICIPANT_NOT_ALLOWED,
    errorCode: httpResponseConstants.HTTP_CONFLICT,
  }, {
    errorMsg: voteService.ERROR_PARTICIPANT_ALREADY_VOTED,
    errorCode: httpResponseConstants.HTTP_CONFLICT,
  },

  ];
}

// //////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS
// //////////////////////////////////////////////////////////////////////////////

async function createVote(req, res) {
  try {
    const params = {
      args: req.body,
    };

    log.info(`${MODULE_NAME}:${createVote.name} (IN) -> params: <<params>>`);

    // Check authorization
    await authService.authorizeJWTSecurityHeader(req.headers.authorization);

    // Retrieve idParticipant from token
    const loggedUser = authService.getUserInfoFromAuthHeader(req.headers.authorization);
    params.args.idParticipant = loggedUser.id;

    const result = await voteService.createVote(params);

    // Return result
    log.info(`${MODULE_NAME}:${createVote.name} (OUT) -> result: ${JSON.stringify(params)}`);
    res.status(httpResponseConstants.HTTP_RESOURCE_CREATED).json(result);
  } catch (error) {
    controllerHelper.errorHandler(MODULE_NAME, error, res, buildConditionErrors());
  }
}

async function getVotes(req, res) {
  try {
    const params = {};

    log.info(`${MODULE_NAME}:${getVotes.name} (IN) -> params: <<params>>`);

    // Check authorization
    await authService.authorizeJWTSecurityHeader(req.headers.authorization);

    // Retrieve idParticipant from token
    const loggedUser = authService.getUserInfoFromAuthHeader(req.headers.authorization);
    params.idParticipant = loggedUser.id;

    const result = await voteService.getVotes(params);

    // Return result
    log.info(`${MODULE_NAME}:${getVotes.name} (OUT) -> result: ${JSON.stringify(params)}`);
    res.json(result);
  } catch (error) {
    controllerHelper.errorHandler(MODULE_NAME, error, res, buildConditionErrors());
  }
}

async function getVoteById(req, res) {
  try {
    const params = {
      idVote: controllerHelper.getSwaggerQueryParam(req, 'idVote', undefined),
    };

    log.info(`${MODULE_NAME}:${getVoteById.name} (IN) -> params: ${JSON.stringify(params)}`);

    // Check authorization
    await authService.authorizeJWTSecurityHeader(req.headers.authorization);

    const result = await voteService.getVoteById(params);

    // Return result
    log.info(`${MODULE_NAME}:${getVoteById.name} (OUT) -> result: <<list of calls>>`);
    res.json(result);
  } catch (error) {
    controllerHelper.errorHandler(MODULE_NAME, error, res, buildConditionErrors());
  }
}
async function getVoteByIdWithHistory(req, res) {
  try {
    const params = {
      idVote: controllerHelper.getSwaggerQueryParam(req, 'idVote', undefined),
      tx_id: controllerHelper.getSwaggerQueryParam(req, 'tx_id', undefined),
    };

    log.info(`${MODULE_NAME}:${getVoteByIdWithHistory.name} (IN) -> params: ${JSON.stringify(params)}`);

    // Check authorization
    await authService.authorizeJWTSecurityHeader(req.headers.authorization);

    const result = await voteService.getVoteByIdWithHistory(params);

    // Return result
    log.info(`${MODULE_NAME}:${getVoteByIdWithHistory.name} (OUT) -> result: <<list of calls>>`);
    res.json(result);
  } catch (error) {
    controllerHelper.errorHandler(MODULE_NAME, error, res, buildConditionErrors());
  }
}

async function getVoteIdByParameters(req, res) {
  try {
    const params = {
      idCall: controllerHelper.getSwaggerQueryParam(req, 'idCall', undefined),
    };

    log.info(`${MODULE_NAME}:${getVoteIdByParameters.name} (IN) -> params: ${JSON.stringify(params)}`);

    // Check authorization
    await authService.authorizeJWTSecurityHeader(req.headers.authorization);

    // Retrieve idParticipant from token
    const loggedUser = authService.getUserInfoFromAuthHeader(req.headers.authorization);
    params.idParticipant = loggedUser.id;

    const result = await voteService.getVoteIdByParameters(params);

    // Return result
    log.info(`${MODULE_NAME}:${getVoteIdByParameters.name} (OUT) -> result: <<list of calls>>`);
    res.json(result);
  } catch (error) {
    controllerHelper.errorHandler(MODULE_NAME, error, res, buildConditionErrors());
  }
}


module.exports = {
  createVote,
  getVotes,
  getVoteById,
  getVoteByIdWithHistory,
  getVoteIdByParameters,
};
