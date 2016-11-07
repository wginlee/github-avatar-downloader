var args = process.argv.slice(2);

var request = require('request');
var fs = require('fs');


const GITHUB_USER = "wginlee";
const GITHUB_TOKEN = "40296713ef37d0aae3a6d706d7c45010938b3aaf";


console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  // ...
  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  // console.log(requestURL);

  var options = {
    url: requestURL,
    headers: {
      "User-Agent": "GitHub Avatar Downloader - Student Project"
    }
  };

  request.get(options)
    .on('error', function (err) {
      throw err;
    })
    .on('response', function (response) {
          console.log('Response Status Code: ', response.statusCode);
          console.log('Response Status Message: ', response.statusMessage);
          console.log('Content Type: ', response.headers['content-type']);
          // console.log('Downloading image...');
       })
    .on('end', function(response){
          console.log('Download complete.');
       })
    // .pipe(fs.createWriteStream('./future.jpg'));
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});