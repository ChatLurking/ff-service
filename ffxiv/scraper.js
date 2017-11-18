const cheerio = require('cheerio');
const rq = require('request');
const request = require('request-promise');

async function parseMembers(id, pageNum) {
  try {
    const response = await request(`https://na.finalfantasyxiv.com/lodestone/freecompany/${id}/member/?page=${pageNum}`);
    const body = await response;
    let list = [];
    const $ = cheerio.load(body);
    $('div.entry__freecompany__center p.entry__name').each((index, ele) => {
      list.push($(ele).text());
    });
    return list;
  } catch (error) {
    console.log(error);
  }
}

async function scrapeWholeFCPage(id) {
  let FCData = {};
  try {
    const response = await request(`https://na.finalfantasyxiv.com/lodestone/freecompany/${id}/`);
    const body = await response;
    const $ = cheerio.load(body);

    const image = [];
    $('div[class=entry__freecompany__crest__image] > img').each((index, item) => {
      image.push($(item).attr('src'))
    });

    const reputationImages = [];
    $('div.freecompany__reputation > div > img').each((i, ele) => {
      reputationImages.push($(ele).attr('src'));
    });

    const FCRanking = [];
    $('th').each((index, ele) => {
      FCRanking.push($(ele).text())
    });

    const focus = [];
    const seeking = [];
    $('ul.freecompany__focus_icon.clearfix > li').each((index, ele) => {
      if (index < 9) {
        $(ele).attr('class') !== undefined ? focus[$(ele).text().trim()] = {active: false, image: $(ele).children().children().attr('src')} : focus[$(ele).text().trim()] = {active: true, image: $(ele).children().children().attr('src')};
      } else {
        $(ele).attr('class') !== undefined ? seeking[$(ele).text().trim()] = {active: false, image: $(ele).children().children().attr('src')} : seeking[$(ele).text().trim()] = {active: true, image: $(ele).children().children().attr('src')};
      }
    });

    return FCData = {
      crest: image,
      numOfMembers: $('p[class=freecompany__text]')['1'].children[0].data,
      slogan: $('p.freecompany__text.freecompany__text__message').text().trim(),
      name: $('p.freecompany__text__name').text().trim(),
      tag: $('p.freecompany__text__tag').text().trim(),
      server: $('p.entry__freecompany__gc')[1].children[0].data.trim(),
      formedDate: parseInt(/(\d+)/.exec($('p.freecompany__text > script').get()[0].children[0].data.split('=').pop().trim())[0]) * 1000,
      rank: $('p[class=freecompany__text]')['2'].children[0].data,
      reputationImages: reputationImages,
      FCRank: FCRanking,
      focus: focus,
      seeking: seeking,
      recruitment: $('p.freecompany__text.freecompany__recruitment').text().trim(),
    };
  } catch (err) {
    console.log(err);
  }
}

async function fetchMemberList(id, numberOfMemebers) {
  const pages = parseInt(Math.ceil(numberOfMemebers / 50), 10);
  const promiseArray = [...Array.from(Array(pages).keys())].map((x) => x += 1);
  return Promise.all(promiseArray.map((value) => parseMembers(id, value)))
  .then((values) => {
    return values.reduce((a, b) => a.concat(b))
  });
}

async function shallowFCPage(id) {
  try {
    const response = await request(`https://na.finalfantasyxiv.com/lodestone/freecompany/${id}`);
    const body = await response;
    const $ = cheerio.load(body);
    let FCData = {};
    // crest, active members, ranking

    const image = [];
    $('div[class=entry__freecompany__crest__image] > img').each((index, item) => {
      image.push($(item).attr('src'))
    });

    const FCRanking = [];
    $('th').each((index, ele) => {
      FCRanking.push($(ele).text())
    });

    return FCData = {
      crest: image,
      numOfMembers: $('p[class=freecompany__text]')['1'].children[0].data,
      FCRank: FCRanking,
    };
  } catch (err) {
    console.log(err);
  }
}

async function getFCId(id) {
  try {
    const response = await request(`https://na.finalfantasyxiv.com/lodestone/character/${id}`);
    const body = await response;
    const $ = cheerio.load(body);

    return /(\d+)/.exec($('div.character__freecompany__name > h4 > a').attr('href'))[0];
  } catch (error) {
    console.log(error);
  }
}

export {
  scrapeWholeFCPage,
  shallowFCPage,
  getFCId,
  fetchMemberList
};
