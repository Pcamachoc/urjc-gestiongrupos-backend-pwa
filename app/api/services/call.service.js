// call.service.js
const log = require('../infrastructure/logger/applicationLogger.gateway');
const callRepository = require('../repositories/call/middlewarehlf.call.repository');

// //////////////////////////////////////////////////////////////////////////////
// CONSTANTS & PROPERTIES
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[Call Service]';

const { ERROR_CALL_NOT_FOUND } = callRepository;

// //////////////////////////////////////////////////////////////////////////////
// PRIVATE FUNCTIONS
// //////////////////////////////////////////////////////////////////////////////

function getSharesSummary(proposals, countResults) {
  log.debug(`${MODULE_NAME}:${getSharesSummary.name} (IN) --> proposals: ${JSON.stringify(proposals)}`);
  log.debug(`${MODULE_NAME}:${getSharesSummary.name} (IN) --> countResults: ${JSON.stringify(countResults)}`);

  const result = [];
  for (let i = 0; i < proposals.length; i += 1) {
    const proposalCall = proposals[i];
    const currentResult = {
      proposalId: proposalCall.id,
      proposalName: proposalCall.description,
      resultsPoll: [],
    };
    for (let j = 0; j < countResults.length; j += 1) {
      const currentResultPoll = countResults[j];
      // Same proposal
      if (proposalCall.id === currentResultPoll.idVote) {
        // Option
        const { option } = currentResultPoll;
        // Putting all together
        currentResult.resultsPoll.push({
          option,
        });
      }
    }
    result.push(currentResult);
  }
  log.debug(`${MODULE_NAME}:${getSharesSummary.name} (OUT) --> result: ${JSON.stringify(result)}`);
  return result;
}
// //////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS
// //////////////////////////////////////////////////////////////////////////////

async function getCalls(params) {
  log.debug(`${MODULE_NAME}:${getCalls.name} (IN) --> params: ${JSON.stringify(params)}`);

  const result = await callRepository.getCalls(params);

  log.debug(`${MODULE_NAME}:${getCalls.name} (OUT) --> result: <<result>>`);
  return result;
}

async function getCallById(params) {
  log.debug(`${MODULE_NAME}:${getCallById.name} (IN) --> params: ${JSON.stringify(params)}`);

  const result = await callRepository.getCallById(params);

  log.debug(`${MODULE_NAME}:${getCallById.name} (OUT) --> result: <<result>>`);
  return result;
}

async function getBallotResult(params) {
  log.debug(`${MODULE_NAME}:${getBallotResult.name} (IN) --> params: ${JSON.stringify(params)}`);

  const innerResult = await callRepository.getCallById(params);

  log.debug(`${MODULE_NAME}:${getBallotResult.name} (MID) --> params: ${JSON.stringify(innerResult)}`);

  // Output refactoring
  // Retrieving results
  const result = {
    callName: innerResult.name,
    results: getSharesSummary(innerResult.proposals, innerResult.counting),
  };

  log.debug(`${MODULE_NAME}:${getBallotResult.name} (OUT) --> result: ${JSON.stringify(result)}`);
  log.debug(`${MODULE_NAME}:${getBallotResult.name} (OUT) --> result: <<result>>`);
  return result;
}

module.exports = {
  ERROR_CALL_NOT_FOUND,
  getCalls,
  getCallById,
  getBallotResult,
};
