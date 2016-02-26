App.articleController = {

	list : [],

	is_load : false,

	load : function(){
		if(!this.is_load){
			App.model.article.selectAllArticles(function(rs){
				App.articleController.list = rs;
			});
			App.view.showArticles(this.list);
		}
	},

	random_article : function(){
		if(this.list.length <= 0){
			return false;
		}
		var id = this.list[Math.ceil(Math.random()*this.list.length)].id;
		return App.model.article.selectFullArticle(id);
	},

	selectAllArticles : function(){
		return list;
	},

	add_article : function(){
		App.view.article.add_article();
	}

}