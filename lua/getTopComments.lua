local commentsFor = redis.call('zrange','comments:for','0','15','withscores');
local commentsAgainst = redis.call('zrange','comments:against','0','15','withscores');
local forComments = {};
local againstComments = {};
local i = 1;
local j = 1;
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