import dynamodb from './lib/dynamodb';
import { success, failure, problem } from './lib/response';
import * as ffxivAPI from './ffxiv/api';

const getXIVData = async (event, context, callback) => {
  const { channel } = event.pathParameters;
  logger.debug(`Got a data request for user ${channel}`);
  const data = await ffxivAPI.getXIVData(dynamodb, channel);
  callback(null, success((data.state && JSON.parse(data.state)) || {}, true));
};

const registerUsername = async (event, context, callback) => {
  const { channel } = event.pathParameters;
  const username = event.queryStringParameters.username;
  const server = event.queryStringParameters.server;

  if (username === undefined || server === undefined) {
    callback(null, problem((429, 'Error: username and/or server name are required.')));
    return;
  }

  const data = await ffxivAPI.initialUserHydration(dynamodb, channel, username, server);
  callback(null, success((data)));
};

export {
  getXIVData,
  registerUsername,
};
