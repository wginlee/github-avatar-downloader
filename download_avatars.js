require('dotenv').config();
var getRepoContributors = require('./get-repo-contributors');

var args = process.argv.slice(2);

var owner = args[0];
var repo = args[1];

var request = require('request');
var fs = require('fs');

const GITHUB_USER = process.env.GITHUB_USER;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

console.log('Welcome to the GitHub Avatar Downloader!');


//download the image given the avatar url
function downloadImageByURL(url, fileName, cb) {

  //creates a directory according to the path if needed
  var dir = "avatars";

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

    let filePath = fileName + ext;
    let fullPath = dir + '\/'+ filePath;
    fs.writeFile( fullPath, data, { encoding: 'binary' }, function(err, res){
      //handle filesystem error here (with a callback)
      if(err){
        console.error(err);
      }
    });
    console.log(filePath + " downloaded.");

  });
}

//download the avatars per contributor
function downloadAvatars(contributors){
  const directory = "avatars";
  if (contributors.message === 'Not Found'){
    console.log("Repository not found.");
    process.exit();
  }
  if (contributors.message === 'Bad credentials'){
    console.log("Bad credentials. Please check your github user id or token in your .env file");
    process.exit();
  }
  contributors.forEach((contributor) => {
    downloadImageByURL(contributor.avatar_url, contributor.login);
  });
}

// halt the program if not enough arguements, yell some more
if (!args || !args[1] || args.length > 2){
  console.log("Please pass in 2 arguments: <repoOwner> <repoName>");
} else {
  getRepoContributors(owner, repo, downloadAvatars);
}
