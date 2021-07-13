// middlewarehlf.block.repository.js

const _ = require('lodash');
const log = require('../../infrastructure/logger/applicationLogger.gateway');
const configRepository = require('../config/mem.config.repository');
const middlewareHlfHelper = require('../helpers/middlewarehlf.helper');

// //////////////////////////////////////////////////////////////////////////////
// CONSTANTS & PROPERTIES
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[Block Repository]';

const GET_METHOD = 'GET';

const INNER_ERROR_BLOCK_NOT_FOUND = 'Data not found';
const ERROR_BLOCK_NOT_FOUND = INNER_ERROR_BLOCK_NOT_FOUND;

// //////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS
// //////////////////////////////////////////////////////////////////////////////

async function getBlockByTransactionId(params) {
  try {
    log.debug(`${MODULE_NAME}:${getBlockByTransactionId.name} (IN) --> params: ${JSON.stringify(params)}`);

    const apiMethod = `${configRepository.getHLFConfig().channelBlockResource}?txId=${params.transactionId}`;

    const result = await middlewareHlfHelper.callApi(GET_METHOD, apiMethod, undefined);
    log.debug(`${MODULE_NAME}:${getBlockByTransactionId.name} (OUT) --> result: <<result>>`);
    return result;
  } catch (error) {
    const responseError = _.get(error, 'response.data.error.message');
    if (responseError !== undefined && responseError.includes(INNER_ERROR_BLOCK_NOT_FOUND)) {
      throw new Error(ERROR_BLOCK_NOT_FOUND);
    }
    throw error;
  }
}

module.exports = {
  ERROR_BLOCK_NOT_FOUND,
  getBlockByTransactionId,
};
