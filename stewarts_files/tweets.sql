CREATE TABLE tweets (
	tweet_id BIGINT,
	user_id BIGINT,
	user_name VARCHAR(255),
	location VARCHAR(255),
	time timestamp,
	tweet VARCHAR(200),	
	image VARCHAR(255),
	retweeted boolean,
	PRIMARY KEY (tweet_id)
)