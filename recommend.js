require('dotenv').config();
var getRepoContributors = require('./get-repo-contributors');

var args = process.argv.slice(2);

var owner = args[0];
var repo = args[1];

var request = require('request');
var fs = require('fs');

const GITHUB_USER = process.env.GITHUB_USER;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

var allStaredRepos = {};


function recommend(contributors){
  if (contributors.message === 'Not Found'){
    console.log("Repository not found.");
    process.exit();
  }
  if (contributors.message === 'Bad credentials'){
    console.log("Bad credentials. Please check your github user id or token in your .env file");
    process.exit();
  }
  contributors.forEach((contributor) => {
    var newURL = contributor.starred_url.split("{")[0].replace("https://", `https://${GITHUB_USER}:${GITHUB_TOKEN}@`);

    loadStarredReposByURL(newURL, fillRepoList);
  });

}


var counter = 0;
function loadStarredReposByURL(url, cb){
  var options = {
    url: url,
    headers: {
      "User-Agent": "GitHub Avatar Downloader - Student Project"
    }
  };

  var body = [];
  counter += 1;
  request.get(options)
    .on('error', function (err){
      return;

    })
    .on('data', function (chunk){
      body.push(chunk);
    })
    .on('end', () => {
      body = Buffer.concat(body).toString();
      const responseData = JSON.parse(body);
      fillRepoList(responseData);

      counter -= 1;
      if (counter === 0){
        filterOutput(allStaredRepos);
      }
    });

}

function fillRepoList(repos){

  repos.forEach((repo) => {
    (allStaredRepos[repo.full_name]) ? allStaredRepos[repo.full_name] += 1 :  allStaredRepos[repo.full_name] = 1;
  });

}

//this function actually logs the output from the object containing all starred repositories
function filterOutput(obj){
  let sortable = [];
    for (var repo in obj){
      sortable.push( [repo, obj[repo]] );
    }
    sortable.sort(function(a, b) {
      return b[1] - a[1];
    });
    for ( var i = 0; i < 5 ; i +=1){
      console.log(`[${sortable[i][1]} stars] ${sortable[i][0]}`);
    }
}

console.log(`Recommended repositories by contributors of ${owner}/${repo}:`);
getRepoContributors(owner, repo, recommend);
