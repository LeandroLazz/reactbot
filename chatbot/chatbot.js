'use strict'
const dialogFlow = require('dialogflow');
const structjson = require('./structjson');
const config = require('../config/keys');

const projectId = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;

const credentials = {
  client_email: config.googleClientEmail,
  private_key: config.googlePrivateKey
}

const sessionClient = new dialogFlow.SessionsClient({projectId, credentials});

module.exports = {
  textQuery: async function (text, userID, parameters = {}) {
    let sessionPath = sessionClient.sessionPath(projectId, sessionId + userID);
    let self = module.exports;
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: languageCode,
        },
      },
      queryParams: {
        payload: {
          data: parameters
        }
      }
    };
    let responses = await sessionClient.detectIntent(request);
    responses = await self.handleAction(responses);
    return responses;
  },
  eventQuery: async function (event, userID, parameters = {}) {
    let sessionPath = sessionClient.sessionPath(projectId, sessionId + userID);
    let self = module.exports;
    const request = {
      session: sessionPath,
      queryInput: {
        event: {
          name: event,
          parameters: structjson.jsonToStructProto(parameters),
          languageCode: languageCode,
        },
      }
    };
    let responses = await sessionClient.detectIntent(request);
    responses = await self.handleAction(responses);
    return responses;
  },
  handleAction: function (responses) {
    let queryResult = responses[0].queryResult;
    
    switch (queryResult.action) {
      case 'recommendcourses-yes':
        if (queryResult.allRequiredParamsPresent) {

        }
        break;
    }
    
    return responses;
  }
}