(function(){dust.register("comment",body_0);function body_0(chk,ctx){return chk.write(" <h3>").reference(ctx.get("type"),ctx,"h").write("</h3><div class=\"user-score\"><h1>").reference(ctx.get("score"),ctx,"h").write("</h2></div><p>").reference(ctx.get("text"),ctx,"h").write("</p><div class=\"user-fact-time\"><p>").reference(ctx.get("date"),ctx,"h").write("</p></div>");}return body_0;})();