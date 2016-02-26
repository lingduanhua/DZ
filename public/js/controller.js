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

	load_local_article : function(){
		this.article_list = [{
			text: "热爱是风，“贫穷而能听到风声也是好的”。热爱是雨，“有情芍药含春泪”。热爱是土，俯身就能抠出一把，哪一把土壤里没有先民的血汗和未来人的绿梦呢？热爱是云，仰首就能望到一片，哪一片云里没落过孩子的向往和老人的忆念呢？ 因为热爱，我们心存感激，因为热爱，我们满怀忧愤；因为热爱，我们甘于淡泊宁静的日子；也因为热爱，我们敢于金戈铁马去，马革裹尸还。忍辱负重的生，生是热爱；大义凛然地死，死是热爱；清清爽爽，认认真真地活着，活着又何尝不是热爱！"
		}];
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