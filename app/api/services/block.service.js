// block.service.js

const log = require('../infrastructure/logger/applicationLogger.gateway');
const blockRepository = require('../repositories/block/middlewarehlf.block.repository');

// //////////////////////////////////////////////////////////////////////////////
// CONSTANTS & PROPERTIES
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[Block Service]';

const { ERROR_BLOCK_NOT_FOUND } = blockRepository;

// //////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS
// //////////////////////////////////////////////////////////////////////////////

async function getBlockByTransactionId(params) {
  log.debug(`${MODULE_NAME}:${getBlockByTransactionId.name} (IN) --> params: ${JSON.stringify(params)}`);

  const innerResult = await blockRepository.getBlockByTransactionId(params);

  // Build the result
  const result = { tx_id: params.transactionId, block_id: innerResult.header.number };

  log.debug(`${MODULE_NAME}:${getBlockByTransactionId.name} (OUT) --> result: ${JSON.stringify(result)}`);
  return result;
}

module.exports = {
  ERROR_BLOCK_NOT_FOUND,
  getBlockByTransactionId,
};
