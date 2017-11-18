import { getUserId, fetchUserProfile } from './xivdb';
import { scrapeWholeFCPage, fetchMemberList, shallowFCPage, getFCId } from './scraper';

const getUserProfile = async (db, params, logger) => {
  const data = {
    success: false,
    state: null,
    error: null,
  };

  db.get(params, (err, result) => {
    if (err) {
      data.error = true;
      data.state = err;
    } else {
      data.success = true;
      data.state = result;
    }
  });

  return data;
};

const setUserProfile = (db, params, logger) => {
  const data = {
    success: false,
    state: null,
    error: null,
  };

  db.put(params, (err, result) => {
    if (err) {
      data.error = true;
      data.state = err;
    } else {
      data.success = true;
      data.state = result;
    }
  });

  return data;
};

const getFCInfoData = async (db, params, logger) => {
  const data = {
    success: false,
    state: null,
    error: null,
  };

  db.get(params, (err, result) =>  {
    if (err) {
      data.error = true;
      data.state = err;
    } else {
      data.success = true;
      data.state = result;
    }
  });

  return data;
};

const setFCData = async (db, params, logger) => {
  const data = {
    success: false,
    state: null,
    error: null,
  };

  db.put(params, (err, result) => {
    if (err) {
      data.error = true;
      data.state = err;
    } else {
      data.success = true;
      data.state = result;
    }
  });

  return data;
}

const getXIVData = async (db, id, logger) => {
  const userMapParams = {
    TableName: process.env.USER_MAP_TABLE,
    Key: {
      "channelID": parseInt(id, 10),
    },
  };

  const data = await getUserProfile(db, userMapParams, logger);
  return data;
}

const setXIVData = async (db, channelId, characterId, logger) => {
  const userMapParams = {
    TableName: process.env.USER_MAP_TABLE,
    Item: {
      "channelID": parseInt(channelId, 10),
      "characterID": characterId,
    },
  };

  const data = await setUserProfile(db, userMapParams, logger);
  return data;
}

const getFCIdData = async (db, fcid, logger) => {
  const fcidParams = {
    TableName: process.env.FC_TABLE,
    Key: {
      "FCIndex": fcid,
    },
  };
  
  const data = await getFCInfoData(db, fcidParams, logger);
  return data;
};

const setFcIdData = async (db, fcid, fcInfo, memberList, logger) => {
  const fcidParams = {
    TableName: process.env.FC_TABLE,
    Item: {
      "FCIndex": fcid,
      "FCInfo": fcInfo,
      "members": memberList,
    },
  };

  const data = await setFCData(db, params, logger);
  return data;
};

const initialUserHydration = async (db, channel, username, server, logger) => {
  /* 
    Maybe just use this to get the charId and fcId,
    the rest of the info can wait or start up another lambda since the rest is 100% needed in the begining...maybe?

    This is probably a good option...unless I turn the direction of the app to be more of a waiting list to play with the streamer,
    then I would need the fc members list right away, which might be more useful in the long run since FF doesn't update character info until a player logs out

    charId in db ? return : get fcid;
    fcid in db ? return : get fcdata and members;
  */

  const xivProfile = await getXIVData(db, channel, logger);
  console.log(xivProfile)
  try {
    const characterId = await getUserId(username, server);
    if (xivProfile.state === null) {
      const setProfile = await setXIVData(db, channel, characterId, logger);
    }
    // const fcid = await getFCId(characterId);
    // const fcIdFromDb = await getFCIdData(db, fcid, logger);
    // if (!fcIdFromDb.state) {
    //   // if id is in fd database skip the rest of the stuff
    //   const fcdata = await scrapeWholeFCPage(fcid);
    //   const memebers = await fetchMemberList(fcid, fcdata.numOfMembers);
    // }
    return {
      id: characterId,
      FCId: fcid,
      fcInfo: fcdata,
      memberList: memebers,
    };
  } catch (error) {
    return null;
  }
};

export {
  getXIVData,
  initialUserHydration,
};
