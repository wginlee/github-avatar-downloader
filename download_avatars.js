var args = process.argv.slice(2);

var owner = args[0];
var repo = args[1];

var request = require('request');
var fs = require('fs');

const GITHUB_USER = "wginlee";
const GITHUB_TOKEN = "40296713ef37d0aae3a6d706d7c45010938b3aaf";

console.log('Welcome to the GitHub Avatar Downloader!');


//download the image given the avatar url
function downloadImageByURL(url, filePath, cb) {

  //gets the filePath and creates a directory accordin to the path if needed
  const regex = /(\w+)\//;
  var dir = regex.exec(filePath)[1];


  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  const png = "image/png";
  const jpg = "image/jpeg";
  const gif = "image/gif";


  //request the image from the server (find out if the image is jpg or png)
  request.get({
    url, encoding: 'binary'
  }, function(err, response, data){
    if(err) {
      console.error(err);
      return;

    }

    var ext = '.png';

    // determine the file extension given the content type in the header (default to png)
    switch(response.headers['content-type']){
    case "image/jpeg":
    case "image/pjpeg":
      ext = '.jpg';
      break;

    case "image/gif":
      ext = ".gif";
      break;

    case "image/bmp":
    case "image/x-windows-bmp":
      ext = ".bmp";
      break;

    }

    fs.writeFile(filePath + ext, data, { encoding: 'binary' }, function(err, res){
      //handle filesystem error here (with a callback)
      if(err){
        console.error(err);
      }
    });
  });
}

//makes a request for JSON, get back an array of contributors
function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = `https://${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/repos/${repoOwner}/${repoName}/contributors`;


  var options = {
    url: requestURL,
    headers: {
      "User-Agent": "GitHub Avatar Downloader - Student Project"
    }
  };

  request.get(options, function (error, response, body){
    const responseData = JSON.parse(body);

    cb(responseData);

  })
    .on('end', function(response){
      console.log('Download complete.');
    });
}

//download the avatars per contributor
function downloadAvatars(contributors){
  const directory = "avatars";
  contributors.forEach((contributor) => {
    downloadImageByURL(contributor.avatar_url, directory + '\/' + contributor.login);
  });
}

// halt the program if not enough arguements, yell some more
if (!args || !args[0] || !args[1]){
  console.log("Please pass in 2 arguments: <repoOwner> <repoName>");
} else {
  getRepoContributors(owner, repo, downloadAvatars);
}

