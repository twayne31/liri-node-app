var Key = require("./key.js")
var Twitter = require('twitter');
var inquirer = require('inquirer');
var request = require('request');
var Spotify = require('node-spotify-api');
var spotifyKey = require("./spotifyAPI.js")
// const MovieDB = require('moviedb')('7a22360e');

// var input = process.argv[2]


var question = [{

	type: "input",
	name: "your_name",
	message: "Hello my name is Liri.  What is your name?"

}]
var question2 = [{

	type: "input",
	name: "your_movie",
	message: "What movie would you like to search for?"

}]
var question3 = [{
    type: 'input',
    name: 'your_theme',
    message: "What tweets you are looking for?"
}]
var question4 = [{
    type: 'input',
    name: 'your_song',
    message: "Search for a song?"
}]


inquirer.prompt(question)
.then(function(answer){
	console.log(`Hello ${answer.your_name}`)

	inquirer.prompt([{
		type: 'list',
		message: `${answer.your_name}, what would you like to do?`,
		name: 'command',
		choices:[
			new inquirer.Separator('*****Choices*****'),
			{
				name: 'my-tweets'
			},
			{
				name: 'movie-this'
			},
			{
				name: 'spotify-this-song'
			},
			{
				name: 'Exit'
			}
		]
	}]).then(function(answer){

		if(answer.command == 'my-tweets'){


			inquirer.prompt(question3).then(function(answer){
				console.log(answer)
				var client = new Twitter(Key)
				var params = {
					q: answer.your_theme
				};
				console.log(client.get("search/tweets",params,function(e,tweets,res){
						if (e){
							console.log("error message")
						}

						  tweet = tweets.statuses	
				 		  // console.log(tweets);
                   	  	  for (var i = 0; i < 20; i++){
                   	  	  console.log('🐦 New Tweet:')
                       	  console.log(tweet[i].text)
                		}
				}));		  				

			})

		}

		if(answer.command == 'movie-this'){


	   // * Title of the movie.
    //    * Year the movie came out.
    //    * IMDB Rating of the movie.
    //    * Rotten Tomatoes Rating of the movie.
    //    * Country where the movie was produced.
    //    * Language of the movie.
    //    * Plot of the movie.
    //    * Actors in the movie.

			inquirer.prompt(question2)

			.then(function(answer){
				queryUrl = `http://www.omdbapi.com/?t=${answer.your_movie}&y=&plot=short&apikey=trilogy`
				console.log(queryUrl)
				request(queryUrl, function(error, response, body) {

  				// If the request is successful
			  	if (!error && response.statusCode === 200) {

			    // Parse the body of the site and recover just the imdbRating
			    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
			    console.log("New Movie! 🎬")
			    console.log("Title: " + JSON.parse(body).Title);
			    console.log("Release Year: " + JSON.parse(body).Year);
			    // console.log("IMDB Rating: " + JSON.parse(body).Rating.Source.Value[0])
			    console.log("Actors: " + JSON.parse(body).Actors);
			    console.log("Country: " + JSON.parse(body).Country);
			    console.log("------------------------------------------------------------------------")
			    console.log(body)
			  	}
				console.log('error:', error); // Print the error if one occurred
				});
			    // console.log(response)
			    // console.log('body:', body); // Print the HTML for the Google homepage.
			    
			 });
	
		}

		if(answer.command == 'spotify-this-song'){
			inquirer.prompt(question4)

			.then(function(answer){
				// var spotify = new Spotify(spotifyKey);
				   //   * The song's name    
				   //   * A preview link of the song from Spotify    
				   //   * The album that the song is from
				   // * If no song is provided then your program will default to "The Sign" by Ace of Base.

				var spotify = new Spotify({
				  id: 'f55e3b4b1d4c48c39c18f5f29031c237',
				  secret: 'fbde8e7a8fe542118345e47f9dd99f4c',
				});

				spotify.search({ type: 'track', query: answer.your_song }, function(err, data) {
				if (err) {
				   return console.log('Error occurred: ' + err);
				} 
				for (var i = 0; i < data.tracks.items.length ;  i++) {
					console.log('New song alert! 🚨')
					console.log(`Song name: ${data.tracks.items[i].name}`)
					// console.log(`Artist: ${data.tracks.items[i].artists}`)
					console.log(`Preview: ${data.tracks.items[i].preview_url}`)
					console.log(`Album: ${data.tracks.items[i].album.name}`)
					console.log('-----------------------------------------------------------------------')

				}
				

				});

			})	

		}
	

		if(answer.command == 'Exit'){
				console.log('Im out')
				process.exit(); 		
		}	
	})
});
