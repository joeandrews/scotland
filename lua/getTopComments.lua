local commentsFor = redis.call('zrange','comments:for','0','15','withscores');
local commentsAgainst = redis.call('zrange','comments:against','0','15','withscores');
local forComments = {};
local againstComments = {};
local i = 0;
local j = 0;
for var = i, table.getn(commentsFor), 2 do
	forComments[table.getn(commentsFor) + 1] = {};
	forComments[table.getn(commentsFor) + 1][1] = redis.call('get',commentsFor[i]);
	forComments[table.getn(commentsFor) + 1][2] = commentsFor[ i+ 1];

end
for var= j, table.getn(commentsAgainst),2 do
	againstComments[table.getn(commentsAgainst) +1 ] = {};
	againstComments[table.getn(commentsAgainst) +1][1] = redis.call('get',commentsAgainst[i]);
	againstComments[table.getn(commentsAgainst) +1][2] = commentsAgainst[i+1];
end
local comments = {};
comments[1] = againstComments;
comments[2] = forComments;

return comments;