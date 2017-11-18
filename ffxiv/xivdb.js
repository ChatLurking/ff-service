const rq = require('request');
const request = require('request-promise');

const getUserId = async (userName, server) => {
  const response = await request(`https://api.xivdb.com/search?string=${userName}&one=characters&server=${server}`);
  const body = await JSON.parse(response);
  return body.characters.results[0].id;
};

const fetchUserProfile = async (userId) => {
  const response = await request(`https://api.xivdb.com/character/${userId}`);
  const body = await JSON.parse(response);
  return body;
};

export {
  getUserId,
  fetchUserProfile,
};
