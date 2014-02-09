redis.call('zadd', ARGV[1], 0, ARGV[3])
redis.call('lpush',ARGV[2],ARGV[3]);
return redis.call('set',ARGV[3], ARGV[4]);


