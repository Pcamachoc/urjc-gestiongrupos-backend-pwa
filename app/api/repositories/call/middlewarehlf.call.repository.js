// middlewarehlf.call.repository.js
const _ = require('lodash');
const log = require('../../infrastructure/logger/applicationLogger.gateway');
const configRepository = require('../config/mem.config.repository');
const middlewareHlfHelper = require('../helpers/middlewarehlf.helper');

// //////////////////////////////////////////////////////////////////////////////
// CONSTANTS & PROPERTIES
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[MiddlewareHLF Call Repository]';

const GET_METHOD = 'GET';

const INNER_ERROR_DATA_NOT_FOUND = 'Data not found';
const ERROR_CALL_NOT_FOUND = 'Call not found';

// //////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS
// //////////////////////////////////////////////////////////////////////////////

async function getCalls(params) {
  log.debug(`${MODULE_NAME}:${getCalls.name} (IN) --> params: ${JSON.stringify(params)}`);

  const hlfConfig = configRepository.getHLFConfig().call;
  const invokeParams = {
    functionName: hlfConfig.findCallsMethod,
    args: {
      filter: {
        participants: {
          $elemMatch: {
            id: params.idParticipant,
          },
        },
      },
    },
  };

  log.debug(`${MODULE_NAME}:${getCalls.name} (MID) --> invokeParams: ${JSON.stringify(invokeParams)}`);

  const result = await middlewareHlfHelper.invoke(GET_METHOD, hlfConfig.chaincodeId, invokeParams);

  log.debug(`${MODULE_NAME}:${getCalls.name} (MID) --> result: <<result>>`);
  return result;
}

async function getCallById(params) {
  try {
    log.debug(`${MODULE_NAME}:${getCalls.name} (IN) --> params: ${JSON.stringify(params)}`);

    const hlfConfig = configRepository.getHLFConfig().call;
    const invokeParams = {
      functionName: hlfConfig.findCallByIdMethod,
      args: {
        id: params.idCall,
      },
    };

    log.debug(`${MODULE_NAME}:${getCalls.name} (MID) --> invokeParams: ${JSON.stringify(invokeParams)}`);

    const result = await middlewareHlfHelper.invoke(GET_METHOD, hlfConfig.chaincodeId, invokeParams);

    log.debug(`${MODULE_NAME}:${getCalls.name} (MID) --> result: <<result>>`);
    return result;
  } catch (error) {
    const responseError = _.get(error, 'response.data.error.message');
    if (responseError !== undefined && responseError.includes(INNER_ERROR_DATA_NOT_FOUND)) {
      throw new Error(ERROR_CALL_NOT_FOUND);
    }
    throw error;
  }
}

module.exports = {
  getCalls,
  getCallById,
  ERROR_CALL_NOT_FOUND,
};
