// vote.service.js
const log = require('../infrastructure/logger/applicationLogger.gateway');
const voteRepository = require('../repositories/vote/middlewarehlf.vote.repository');

// //////////////////////////////////////////////////////////////////////////////
// CONSTANTS & PROPERTIES
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[Vote Service]';

const ERROR_VOTES_NOT_FOUND = 'No votes found';
const {
  ERROR_VOTE_NOT_FOUND, ERROR_CALL_OVER, ERROR_PARTICIPANT_NOT_ALLOWED, ERROR_PARTICIPANT_ALREADY_VOTED,
} = voteRepository;
const SUCCESS = 'SUCCESS';

// //////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS
// //////////////////////////////////////////////////////////////////////////////

async function createVote(params) {
  log.debug(`${MODULE_NAME}:${createVote.name} (IN) --> params: ${JSON.stringify(params)}`);

  let result = await voteRepository.createVote(params);

  // Same response as params
  if (result !== undefined && result[0].status !== undefined && result[0].status === SUCCESS) {
    const txId = result[1].txID;
    result = params.args;
    result.tx_id = txId;
  }
  log.debug(`${MODULE_NAME}:${createVote.name} (OUT) --> result: ${JSON.stringify(result)}`);
  return result;
}

async function getVotes(params) {
  log.debug(`${MODULE_NAME}:${getVotes.name} (IN) --> params: ${JSON.stringify(params)}`);

  const result = await voteRepository.getVotes(params);


  log.debug(`${MODULE_NAME}:${getVotes.name} (OUT) --> result: ${JSON.stringify(result)}`);
  return result;
}

async function getVoteById(params) {
  log.debug(`${MODULE_NAME}:${getVoteById.name} (IN) --> params: ${JSON.stringify(params)}`);

  const result = await voteRepository.getVoteById(params);

  log.debug(`${MODULE_NAME}:${getVoteById.name} (OUT) --> result: <<result>>`);
  return result;
}

async function getVoteByIdWithHistory(params) {
  log.debug(`${MODULE_NAME}:${getVoteByIdWithHistory.name} (IN) --> params: ${JSON.stringify(params)}`);

  const result = await voteRepository.getVoteByIdWithHistory(params);

  log.debug(`${MODULE_NAME}:${getVoteByIdWithHistory.name} (OUT) --> result: <<result>>`);
  return result;
}

async function getVoteIdByParameters(params) {
  log.debug(`${MODULE_NAME}:${getVoteIdByParameters.name} (IN) --> params: ${JSON.stringify(params)}`);

  const result = await voteRepository.getVoteIdByParameters(params);

  log.debug(`${MODULE_NAME}:${getVoteById.name} (OUT) --> result: <<result>>`);
  return result;
}

module.exports = {
  ERROR_VOTES_NOT_FOUND,
  ERROR_VOTE_NOT_FOUND,
  ERROR_PARTICIPANT_ALREADY_VOTED,
  ERROR_PARTICIPANT_NOT_ALLOWED,
  ERROR_CALL_OVER,
  createVote,
  getVotes,
  getVoteById,
  getVoteByIdWithHistory,
  getVoteIdByParameters,
};
