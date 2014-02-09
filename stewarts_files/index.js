var http = require("http"),
	url = require("url"),
	mysql = require("mysql"),
	Twit = require("twit");
	//twit = require('node-twitter-api');	
	//twitter = require('twitter');

var connection = mysql.createConnection({
	host: 'localhost',
	port: '3000',
	user: 'root',
	password: 'root',
	database: 'scottish_referendum'
});

var T = new Twit({
    consumer_key:         'wy3v1jQZyATuB12k947gZw'
  , consumer_secret:      'IB7zAuYPZQTh1L4AoOnPcwk7l98MGGYsWkBOamoCo'
  , access_token:         '53513453-CfFWoT3zf0DuoUc6HxAYwkMgG4vqZAS6lUFjHVSmu'
  , access_token_secret:  's2Ky4qZBR0orgvgAYIK8r0C0DvNEuKDYVhZ3fQbbdTNQP'
})

var stream = T.stream('statuses/filter', { track: ['#voteyes',
												   //'scotland',
												   //'scottish',
												   //'independence',
												   '#bettertogether',
												   '#voteno'] });

stream.on('tweet', function (tweet) {
  // Parse the tweet
  console.log(tweet.user.name)

  if(tweet.text.indexOf("#voteyes") != -1){
  	// The tweet contains #voteyes
  	var vote_type = true;
  } else{
  	vote_type = false;
  }

  // append the tweet to the result
  connection.query('INSERT INTO tweets (tweet_id, user_id, user_name, location, tweet, image, retweeted, vote_type) VALUES (' + tweet.id + ', '                                    
                                               + tweet.user.id + ', "'
                                               + tweet.user.name + '", "'
                                               + tweet.user.location + '", "'
                                               + tweet.text + '", "'
                                               + tweet.user.profile_image_url + '", '
                                               + tweet.retweeted + ','
                                               + vote_type +')',
  					function(err){
  						if(err){
  							 console.log(err.code);
  							 console.log(tweet.user.profile_image_url);
  							 console.log(tweet.user.name);
  							 console.log(tweet.text);
  							 console.log(err.code);
  						}
  						else{
  							 console.log('Row inserted');
  						}
  					}); 
});




