App.view = {
	showArticles : function(articles){
		var html = "";
		for (var i = 0; i < articles.length; i++) {
			html += "<tr aid="+articles[i].id+"><td>"+(i+1)+"</td><td>" +
					articles[i].title + "</td><td>" +
					articles[i].lang + "</td><td>" +
					articles[i].length + "</td><td>" +
					"<a class='del-article'>删除</a></td></tr>"
		};
		$('#article-table-body').html()
	},
}