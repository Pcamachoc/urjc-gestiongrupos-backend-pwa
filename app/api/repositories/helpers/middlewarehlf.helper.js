// middlewarehlf.helper.js

const axios = require('axios');

const log = require('../../infrastructure/logger/applicationLogger.gateway');
const configRepository = require('../config/mem.config.repository');
const middlewarehlfUserRepository = require('../user/middlewarehlf.user.repository');

// //////////////////////////////////////////////////////////////////////////////
// CONSTANTS & PROPERTIES
// //////////////////////////////////////////////////////////////////////////////

const MODULE_NAME = '[MiddlewareHLF Helper]';

// //////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
// //////////////////////////////////////////////////////////////////////////////

async function initRequestOptions(params) {
  log.debug(`${MODULE_NAME}:${initRequestOptions.name} (IN) --> restMethod: ${params.restMethod}, apiMethod: ${params.apiMethod}`);

  const hlfConf = configRepository.getHLFConfig();
  // Get the uri of HLF middleware
  const hlfUrl = hlfConf.url;
  const hlfApiPrefix = hlfConf.apiPrefix;

  const options = {
    method: params.restMethod,
    url: `${hlfUrl}${hlfApiPrefix}/${params.apiMethod}`,
    headers: {
      authorization: `Bearer ${params.tokenAuth}`,
    },
  };

  log.debug(`${MODULE_NAME}:${initRequestOptions.name} (MID) --> options: ${JSON.stringify(options)}`);


  if (params.bodyParams !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.data = params.bodyParams;
  }

  log.debug(`${MODULE_NAME}:${initRequestOptions.name} (OUT) -> filter: ${JSON.stringify(options)}`);
  return options;
}

async function auxIntermediateCaller(restMethod, apiMethodIN, bodyParams, invokingChaincodeMethod) {
  log.debug(`${MODULE_NAME}:${auxIntermediateCaller.name} (IN) --> restMethod: ${restMethod}, apiMethodIN: ${apiMethodIN}, bodyParams: ${JSON.stringify(bodyParams)}`);

  // Get auth Credentials
  const authCredentials = configRepository.getHLFConfig().authentication;
  // Authenticate and get tokenAuth
  const tokenAuth = await middlewarehlfUserRepository.authenticateUser(authCredentials);

  // Prepare apiMethod
  let apiMethod;
  if (invokingChaincodeMethod) {
    const hlfChaincodePrefix = configRepository.getHLFConfig().chaincodePrefix;
    apiMethod = `${hlfChaincodePrefix}/${apiMethodIN}`;
  } else {
    apiMethod = apiMethodIN;
  }

  // Building params
  const params = {
    restMethod,
    apiMethod,
    bodyParams,
    tokenAuth,
  };

  // Prepare options before call API method
  const options = await initRequestOptions(params);
  log.debug(`${MODULE_NAME}:${auxIntermediateCaller.name} HLF will called with options: ${JSON.stringify(options)}`);

  // Call middleware using axios library
  const result = await axios(options);

  log.debug(`${MODULE_NAME}:${auxIntermediateCaller.name} (OUT) -> result: <<transaction result>>`);
  return result;
}

// //////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS
// //////////////////////////////////////////////////////////////////////////////

// Invoke a chaincode method using the middleware hlf
async function invoke(restMethod, apiMethod, bodyParams) {
  try {
    log.debug(`${MODULE_NAME}:${invoke.name} (IN) --> restMethod: ${restMethod}, apiMethod: ${apiMethod}, bodyParams: ${JSON.stringify(bodyParams)}`);

    const result = await auxIntermediateCaller(restMethod, apiMethod, bodyParams, true);

    log.debug(`${MODULE_NAME}:${invoke.name} (OUT) -> result: <<result>>`);
    return result.data;
  } catch (error) {
    log.error(`${MODULE_NAME}:${invoke.name} (ERROR) --> error: ${error.message}`);
    throw error;
  }
}

// Call api rest method of the middleware
async function callApi(restMethod, apiMethod, bodyParams) {
  try {
    log.debug(`${MODULE_NAME}:${callApi.name} (IN) --> restMethod: ${restMethod}, apiMethod: ${apiMethod}, bodyParams: ${JSON.stringify(bodyParams)}`);

    const result = await auxIntermediateCaller(restMethod, apiMethod, bodyParams, false);

    log.debug(`${MODULE_NAME}:${callApi.name} (OUT) -> result: <<result>>`);
    return result.data;
  } catch (error) {
    log.error(`${MODULE_NAME}:${callApi.name} (ERROR) --> error: ${error.message}`);
    throw error;
  }
}

module.exports = {
  invoke,
  callApi,
};
