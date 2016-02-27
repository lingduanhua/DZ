App.view = {
	showArticles : function(articles){
		var html = "";
		for (var i = 0; i < articles.length; i++) {
			html += "<tr aid="+articles[i].id+"><td>"+(i+1)+"</td><td>" +
					articles[i].title + "</td><td>" +
					(articles[i].lang == 0 ? '中文' : '英文') + "</td><td>" +
					articles[i].length + "</td><td>" +
					"<a class='opt edit-article'>编辑</a><a class='opt del-article'>删除</a></td></tr>"
		};
		$('#article-table-body').html(html);
	},
}