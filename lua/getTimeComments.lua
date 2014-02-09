local commentsFor = redis.call('lrange','comments:for:time','0','15');
local commentsAgainst = redis.call('lrange','comments:against:time','0','15');
local forComments = {};
local againstComments = {};
local i = 0;
local j = 0;
if table.getn(commentsFor) > 0 then
	for var = i, table.getn(commentsFor) do
		forComments[i] = redis.call('get',commentsFor[i]);

	end
end	
if table.getn(commentsAgainst) > 0 then

	for var= j, table.getn(commentsAgainst) do
		againstComments[j] = redis.call('get',commentsAgainst[i]);
	end
end	
local comments = {};
comments[1] = againstComments;
comments[2] = forComments;

return comments;