require('dotenv').config();
var request = require('request');

const GITHUB_USER = process.env.GITHUB_USER;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

//makes a request for JSON, get back an array of contributors
module.exports = function getRepoContributors(repoOwner, repoName, cb) {

  const requestURL = `https://${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/repos/${repoOwner}/${repoName}/contributors`;

  var options = {
    url: requestURL,
    headers: {
      "User-Agent": "GitHub Avatar Downloader - Student Project"
    }
  };

  request.get(options, function (error, response, body){
    if(error) {
      console.error(error);
      return;

    }
    const responseData = JSON.parse(body);
    cb(responseData);

  });
};
