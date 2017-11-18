const buildBody = (body) => {
  if (typeof body === 'string' || typeof body === 'number') {
    return body;
  } else {
    return JSON.stringify(body);
  }
}

const buildResponse = (statusCode, body, cors = false) => {
  const response = {
    statusCode: statusCode,
    body: buildBody(body),
  };
  return response;
}

const success = (body, cors) => {
  return buildResponse(200, body, cors);
};

const failure = (body, cors) => {
  return buildResponse(500, body, cors);
};

const problem = (code, body, cors) => {
  return buildResponse(code, body, cors);
};

export {
  success,
  failure,
  problem,
};
