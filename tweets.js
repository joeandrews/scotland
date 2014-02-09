module.exports = function(voteApp) {

	var T = new voteApp.twit({
		consumer_key: 'wy3v1jQZyATuB12k947gZw',
		consumer_secret: 'IB7zAuYPZQTh1L4AoOnPcwk7l98MGGYsWkBOamoCo',
		access_token: '53513453-CfFWoT3zf0DuoUc6HxAYwkMgG4vqZAS6lUFjHVSmu',
		access_token_secret: 's2Ky4qZBR0orgvgAYIK8r0C0DvNEuKDYVhZ3fQbbdTNQP'
	})
	var stream = T.stream('statuses/filter', {
		track: ['#voteyes',
			//'scotland',
			//'scottish',
			//'independence',
			'#votesnp',
			'#indyref',
			'#bettertogether',
			'#voteno'
		]
	});
	var determine = true;
	stream.on('tweet', function(tweet) {
		// Parse the tweet
		console.log(tweet.user.name)
		if (tweet.text.indexOf("#voteyes") != -1 || tweet.text.indexOf("#votesnp") != -1) {
			// The tweet contains #voteyes
			var vote_type = true;
		} 
		else if (tweet.text.indexOf("#indyref") != -1) {
			if(tweet.text.indexOf("#yes") != -1 || tweet.text.indexOf("#yesscot") != -1 || tweet.text.indexOf("#yes14") != -1){
				var vote_type = true;
			}
			else if(tweet.text.indexOf("#no") != -1 || tweet.text.indexOf("#UKOK") != -1 ){
				var vote_type = false;
			}
			else{
				// We can't determine the sentiment expressed
				determine = false;
			}
		}
		else{
			vote_type = false;
		}
		// append the tweet to the result

			voteApp.connection.query('INSERT INTO tweets (tweet_id, user_id, user_name, location, tweet, image, retweeted, vote_type) VALUES (' + tweet.id + ', ' + tweet.user.id + ', "' + tweet.user.name + '", "' + tweet.user.location + '", "' + tweet.text + '", "' + tweet.user.profile_image_url + '", ' + tweet.retweeted + ',' + vote_type + ')',
				function(err) {
					console.log(err);
					if (err) {
						console.log(err.code);
						console.log(tweet.user.profile_image_url);
						console.log(tweet.user.name);
						console.log(tweet.text);
						console.log(err.code);
					} else {
						console.log('Row inserted');
					}
				});
		
	});
}