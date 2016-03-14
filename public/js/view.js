App.view = {
	/**
	 * 文章基本信息列表
	 * @param  {array(object)} articles 文章数组
	 * {
	 * 	id,title,lang,length
	 * }
	 */
	showArticles : function(articles){
		var html = "";
		for (var i = 0; i < articles.length; i++) {
			html += "<tr aid="+articles[i].id+"><td>"+(i+1)+"</td><td>" +
					articles[i].title + "</td><td>" +
					(articles[i].lang == 0 ? '中文' : '英文') + "</td><td>" +
					articles[i].length + "</td><td>" +
					"<a class='opt edit-article' onclick='edit_article("+ articles[i].id +")'>编辑</a>"+
					"<a class='opt del-article' onclick='del_article("+ articles[i].id + ",\"" +  articles[i].title + "\")'>删除</a></td></tr>"
		};
		$('#article-table-body').html(html);
	},

	/**
	 * 插入或修改文章是的表单
	 * @param  {object} article 要修改的文章
	 */
	editArticle : function(article){
		// var flag = true;
		// if(typeof article == 'undefined' || !article || article){
		// 	flag = false;
		// }
		var html = '<div id="article-add-form">'+
			'<div class="form-item">'+
				'<label>文章标题</label><input type="text" value="'+ ( article.title ? article.title : "" )+'" name="article_name" />'+
			'</div>'+
			'<div class="form-item">'+
				'<label>语言</label>'+
				'<select name="article_lang">'+
				(function(){
					if(article.lang == 1){
						return '<option value="0">中文</option><option value="1" selected="true">English</option>';
					}
					return '<option value="0">中文</option><option value="1">English</option>'
				}())
				+ '</select>'+
			'</div>'+
			'<div class="form-item">'+
				'<label>文章内容</label>'+
				'<input id="article-file" type="file" name="article_file" accept=".txt"/>'+
				'<button class="btn primary-btn" id="article-upload-btn">本地文件</button>'+
				'<textarea id="article-body" name="article_body">'+ ( article.body ? article.body : "" )+'</textarea>'+
			'</div>'+
		'</div>';
		return html;
	},

}