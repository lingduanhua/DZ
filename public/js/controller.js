window.App={};
App.model={};
App.view={};
App.controller = {

	lang : '',
	
	load : function(){
		//加载本地数据
		App.database.open();
		//加载本地文章列表
		//App.articleController.load();
		//加载view

	},

	start_dz : function(lang, fun){
		//设置 语言
		this.lang = lang;
		//随机文章
		this.article = App.articleController.random_article();
		if(this.article == false){
			fun(false,'还没有文章快去添加吧');
		}else{
			fun(true,this.article.body);
		}
	},

	over_dz : function(){
		var grade = this.dz.get_result();
	},

	// article_list : function(){
	// 	App.view.showArticles(App.articleController.selectAllArticles());
	// },

	route : function(page){
		var controller = page + 'Controller';
		if(typeof App[controller]  == 'undefined'){
			return;
		}
		App[controller].load();
		// if(page == 'article'){

		// }else if(page == 'index'){

		// }else if(page == 'grade'){

		// }
	},
};