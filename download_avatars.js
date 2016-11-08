var args = process.argv.slice(2);

var request = require('request');
var fs = require('fs');


const GITHUB_USER = "wginlee";
const GITHUB_TOKEN = "40296713ef37d0aae3a6d706d7c45010938b3aaf";


console.log('Welcome to the GitHub Avatar Downloader!');

function githubUsername(){
  return args[0];
}

function getRepoContributors(repoOwner, repoName, cb) {
  // ...
  // var requestURL = `https://${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/repos/${repoOwner}/${repoName}/contributors`;
  console.log(requestURL);

  var options = {
    url: requestURL,
    headers: {
      "User-Agent": "GitHub Avatar Downloader - Student Project"
    }
  };

  request.get(options, function (error, response, body){
    // console.log(response.headers['content-type']);
    const responseData = JSON.parse(body);
    // console.log(Object.keys(responseData[0]));
    responseData.forEach( (element) => {
      console.log(element.avatar_url);
    });
    // cb();

  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});

// function putAvatarURLs(contributors){
//   contributors.forEach(function (contributor){
//     console.log("do stuff to me");
//   });
// }

// getRepoContributors("jquery", "jquery", putAvatarURLs);