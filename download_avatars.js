var args = process.argv.slice(2);

var request = require('request');
var fs = require('fs');

const GITHUB_USER = "wginlee";
const GITHUB_TOKEN = "40296713ef37d0aae3a6d706d7c45010938b3aaf";

console.log('Welcome to the GitHub Avatar Downloader!');


function getRepoContributors(repoOwner, repoName, cb) {
  // ...
  var requestURL = `https://${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/repos/${repoOwner}/${repoName}/contributors`;
  // console.log(requestURL);


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
    // console.log(responseData[0].login);
    cb(responseData);

  });
}

// getRepoContributors("jquery", "jquery", function(err, result) {
//   console.log("Errors:", err);
//   console.log("Result:", result);
// });

function downloadAvatars(contributors){
  const directory = "avatars";
  console.log(directory);
  contributors.forEach((contributor) => {
    console.log(contributor.avatar_url);
    downloadImageByURL(contributor.avatar_url, directory+'\/'+contributor.login);
  });
}



function downloadImageByURL(url, filePath) {
  // ...

  //gets the filePath and creates a directory accordin to the path if needed
  const regex = /(\w+)\//;
  console.log(filePath);
  var dir = regex.exec(filePath)[1];

  const png = "image/png";
  const jpg = "image/jpeg";

  var extn;


  console.log(dir);
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  request.get(url, function (error, response, body){
    var imageType = response.headers['content-type']
    extn = (imageType.toString() === png) ? ".png" : ".jpg";
  })
    .on('error', function (err){
      throw err;
    })
    // .on('data', function (response){
    //   console.log(response.headers['content-type']);
    // })
    .on('end', function (response){
      console.log("Download complete.");
    })
    .pipe(fs.createWriteStream(`./${filePath+extn}`));
}

// downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg");

getRepoContributors("jquery", "jquery", downloadAvatars);
// console.log(avatarURLs);