// couchdb.vote.repository.js
const _ = require('lodash');
const log = require('../../infrastructure/logger/applicationLogger.gateway');
const configRepository = require('../config/mem.config.repository');
const middlewareHlfHelper = require('../helpers/middlewarehlf.helper');

// //////////////////////////////////////////////////////////////////////////////
// CONSTANTS & PROPERTIES
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[MiddlewareHLF Vote Repository]';

const PUT_METHOD = 'PUT';
const GET_METHOD = 'GET';

const INNER_ERROR_VOTE_NOT_FOUND = 'vote not found';
const ERROR_VOTE_NOT_FOUND = INNER_ERROR_VOTE_NOT_FOUND;

const INNER_ERROR_CALL_OVER = 'Call voting is over';
const ERROR_CALL_OVER = INNER_ERROR_CALL_OVER;

const INNER_ERROR_PARTICIPANT_NOT_ALLOWED = 'Participant not allowed in the call';
const ERROR_PARTICIPANT_NOT_ALLOWED = INNER_ERROR_PARTICIPANT_NOT_ALLOWED;

const INNER_ERROR_PARTICIPANT_ALREADY_VOTED = 'Participant have already voted';
const ERROR_PARTICIPANT_ALREADY_VOTED = INNER_ERROR_PARTICIPANT_ALREADY_VOTED;

// //////////////////////////////////////////////////////////////////////////////
// PRIVATE FUNCTIONS
// //////////////////////////////////////////////////////////////////////////////

async function buildObject(params) {
  log.debug(`${MODULE_NAME}:${buildObject.name} (IN) --> params: ${JSON.stringify(params)}`);

  let objectResult = {};

  if ((params) && params.length > 0) {
    // eslint-disable-next-line prefer-destructuring
    objectResult = params[0];
    if ('is_delete' in objectResult) {
      delete objectResult.is_delete;
    }
  }

  return objectResult;
}


// //////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS
// //////////////////////////////////////////////////////////////////////////////

async function createVote(params) {
  log.debug(`${MODULE_NAME}:${createVote.name} (IN) --> params: ${JSON.stringify(params)}`);

  try {
    const hlfConfig = configRepository.getHLFConfig().vote;
    const paramsVote = {
      functionName: hlfConfig.createVoteMethod,
      args: params.args,
    };

    const result = await middlewareHlfHelper.invoke(PUT_METHOD, hlfConfig.chaincodeId, paramsVote);

    log.debug(`${MODULE_NAME}:${createVote.name} (OUT) --> result: <<result>>`);
    return result;
  } catch (error) {
    const responseError = _.get(error, 'response.data.error.message');
    if (responseError !== undefined && responseError.includes(INNER_ERROR_VOTE_NOT_FOUND)) {
      throw new Error(ERROR_VOTE_NOT_FOUND);
    } else if (responseError !== undefined && responseError.includes(INNER_ERROR_CALL_OVER)) {
      throw new Error(ERROR_CALL_OVER);
    } else if (responseError !== undefined && responseError.includes(INNER_ERROR_PARTICIPANT_NOT_ALLOWED)) {
      throw new Error(ERROR_PARTICIPANT_NOT_ALLOWED);
    } else if (responseError !== undefined && responseError.includes(INNER_ERROR_PARTICIPANT_ALREADY_VOTED)) {
      throw new Error(ERROR_PARTICIPANT_ALREADY_VOTED);
    }
    throw error;
  }
}

async function getVotes(params) {
  log.debug(`${MODULE_NAME}:${getVotes.name} (IN) --> params: ${JSON.stringify(params)}`);

  const hlfConfig = configRepository.getHLFConfig().vote;
  const paramsVote = {
    functionName: hlfConfig.findVotesMethod,
    args: {
      filter: {
        idParticipant: {
          $eq: params.idParticipant,
        },
      },
    },
  };

  const result = await middlewareHlfHelper.invoke(GET_METHOD, hlfConfig.chaincodeId, paramsVote);

  log.debug(`${MODULE_NAME}:${getVotes.name} (OUT) --> result: <<result>>`);
  return result;
}

async function getVoteById(params) {
  log.debug(`${MODULE_NAME}:${getVoteById.name} (IN) --> params: ${JSON.stringify(params)}`);

  try {
    const hlfConfig = configRepository.getHLFConfig().vote;
    const invokeParams = {
      functionName: hlfConfig.findVoteByIdMethod,
      args: {
        id: params.idVote,
      },
    };

    log.debug(`${MODULE_NAME}:${getVoteById.name} (MID) --> invokeParams: ${JSON.stringify(invokeParams)}`);

    const result = await middlewareHlfHelper.invoke(GET_METHOD, hlfConfig.chaincodeId, invokeParams);

    log.debug(`${MODULE_NAME}:${getVoteById.name} (MID) --> result: <<result>>`);
    return result;
  } catch (error) {
    const responseError = _.get(error, 'response.data.error.message');
    if (responseError !== undefined && responseError.includes(INNER_ERROR_VOTE_NOT_FOUND)) {
      throw new Error(ERROR_VOTE_NOT_FOUND);
    }
    throw error;
  }
}

async function getVoteByIdWithHistory(params) {
  log.debug(`${MODULE_NAME}:${getVoteByIdWithHistory.name} (IN) --> params: ${JSON.stringify(params)}`);

  try {
    const hlfConfig = configRepository.getHLFConfig().vote;
    const invokeParams = {
      functionName: hlfConfig.findVoteByIdWithHistoryMethod,
      args: {
        id: params.idVote,
        tx_id: params.tx_id,
      },
    };

    log.debug(`${MODULE_NAME}:${getVoteByIdWithHistory.name} (MID) --> invokeParams: ${JSON.stringify(invokeParams)}`);

    const result = await middlewareHlfHelper.invoke(GET_METHOD, hlfConfig.chaincodeId, invokeParams);

    const resultObject = await buildObject(result);

    log.debug(`${MODULE_NAME}:${getVoteByIdWithHistory.name} (MID) --> result: <<result>>`);
    return resultObject;
  } catch (error) {
    const responseError = _.get(error, 'response.data.error.message');
    if (responseError !== undefined && responseError.includes(INNER_ERROR_VOTE_NOT_FOUND)) {
      throw new Error(ERROR_VOTE_NOT_FOUND);
    }
    throw error;
  }
}

async function getVoteIdByParameters(params) {
  log.debug(`${MODULE_NAME}:${getVoteIdByParameters.name} (IN) --> params: ${JSON.stringify(params)}`);
  try {
    const hlfConfig = configRepository.getHLFConfig().vote;
    const paramsVote = {
      functionName: hlfConfig.findVotesMethod,
      args: {
        filter: {
          idParticipant: {
            $eq: params.idParticipant,
          },
          idCall: {
            $eq: params.idCall,
          },
        },
      },
    };
    const result = await middlewareHlfHelper.invoke(GET_METHOD, hlfConfig.chaincodeId, paramsVote);

    const objectResult = await buildObject(result);

    log.debug(`${MODULE_NAME}:${getVoteIdByParameters.name} (OUT) --> result: <<result>>`);
    return objectResult;
  } catch (error) {
    const responseError = _.get(error, 'response.data.error.message');
    if (responseError !== undefined && responseError.includes(INNER_ERROR_VOTE_NOT_FOUND)) {
      throw new Error(ERROR_VOTE_NOT_FOUND);
    }
    throw error;
  }
}

module.exports = {
  ERROR_VOTE_NOT_FOUND,
  ERROR_CALL_OVER,
  ERROR_PARTICIPANT_NOT_ALLOWED,
  ERROR_PARTICIPANT_ALREADY_VOTED,
  createVote,
  getVotes,
  getVoteById,
  getVoteByIdWithHistory,
  getVoteIdByParameters,
};
