//accesses all the credentials in .env.
require("dotenv").config();

//imports credentials from keys.js
var keys = require("./keys.js");

var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');

var client = new Twitter(keys.twitter);
var nodeArgv = process.argv;
var command = nodeArgv[2];
//var userInputs =nodeArgv[3];

//Creates an empty valiable for the movies and musics names with multiple words 
var x = "";
for (var i=3; i < nodeArgv.length; i++){
    if(i >3 && i <nodeArgv.length){
        x = x + " " + nodeArgv[i];
    }
    else{
        x += nodeArgv[i];
    }
}

//create a switch statement to execute commands;
switch(command){
    case 'my-tweets':
    tweets();
    break;

    case 'spotify-this-song':
    spotifySong(x);
    break;

    case 'movie-this':
    movie(x);
    break;

    case 'do-what-it-says':
    doIt();
    break;

    default:
    console.log("Enter one of these commands: my-tweets, spotify-this-song, movie-this, do-what-it-says");
    break;
}

function tweets(){
    var params = {screen_name: 'tarachan2018', count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        for(var i=0; i < tweets.length; i++){
            console.log("Tweets: " + tweets[i].text +" Created at " + tweets[i].created_at + ".");
            console.log("---------------------------------------------------------------");
            //console.log(tweets);

            //append data to log.txt file
            fs.appendFile('log.txt', "\nTweets:" + tweets[i].text +  "Created at " + tweets[i].created_at + "." +"\n", function(err){

                if(err) throw err;
            })
        }
      }
      else{
        return console.log('Error occurred: ' + err);
      }
    });    
}

function spotifySong(userInputs){
    if(!userInputs){
        userInputs = 'The Sign Ace of Base'
    }
    var spotify = new Spotify(keys.spotify);
    spotify.search({ type: 'track', query: userInputs,limit:3}, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }            
        var songsData = data.tracks.items[0];
        
        console.log('--------------------------------------------------');
        console.log("\nArtist(s): " +songsData.artists[0].name);
        console.log("Song: " + songsData.name);
        console.log("Preview URL: " + songsData.preview_url);
        console.log("Album: "+ songsData.album.name);
        console.log('--------------------------------------------------');
        //console.log(JSON.stringify(data.tracks.items,null, 4)); 

        //append data to log.txt file   
        fs.appendFile('log.txt',"\nArtist(s): " +songsData.artists[0].name + "\nSong: " + songsData.name + "\nPreview URL: " + songsData.preview_url + "\nAlbum: "+ songsData.album.name + "\n",function(err){

            if(err) throw err;
        });
    });
}

function movie(movie){
    if(!movie){
        movie = 'Mr.nobody';
        console.log("\nIf you haven't watched 'Mr. Nobody' then you should: http://www.imdb.com/title/tt0485947/")
        console.log("\nIt's on Netflix!")
        fs.appendFile('log.txt',"\nIf you haven't watched 'Mr. Nobody' then you should: http://www.imdb.com/title/tt0485947/\nIt's on Netflix!\n",function(err){

            if(err) throw err;    
        });
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&tomatoes=true&apikey=trilogy";
    //console.log(queryUrl);
    //run the request module on a URL with a JSON
    request(queryUrl, function(error, response, body) {

    // If there were no errors and the response code was 200 (i.e. the request was successful)...
    if (!error && response.statusCode === 200) {
        var body = JSON.parse(body);

        console.log("\nTitle: " + body.Title);
        console.log("Release Year: " + body.Year);
        console.log("IMDB rating: " + body.imdbRating);
        console.log("Rotten Tomatoes rating: " + body.tomatoRating);
        console.log("Country: " + body.Country);
        console.log("Language: " + body.Language);  
        console.log("\nPlot: " + body.Plot);
        console.log("\nActors: " + body.Actors);

        //append data to log.txt file
        fs.appendFile('log.txt',"\nTitle: " + body.Title + "\nRelease Year: " + body.Year + "\nIMDB rating: " + body.imdbRating + "\nRotten Tomatoes rating: " + body.tomatoRating + "\nCountry: " + body.Country + "\nLanguage: " + body.Language +"\nPlot: " + body.Plot +"\nActors: " + body.Actors+"\n",function(err){

            if(err) throw err;
        });
    }
    });
}
function doIt(){
    fs.readFile("random.txt","utf8",function(err,data){
        var dataArr = data.split(",");
        //console.log(dataArr);
        spotifySong(dataArr[1]);
    })
}