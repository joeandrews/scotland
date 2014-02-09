local member = redis.call('sismember',ARGV[1], ARGV[4]);
if member == 0 then 
	redis.call('sadd',ARGV[1],ARGV[4])
	redis.call('zincrby',ARGV[2], '-1',ARGV[3]);
end

return member






