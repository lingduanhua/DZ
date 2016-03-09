window.App={};  //应用
App.model={};	//应用的模型
App.view={};	//应用的视图

/*!
 * 应用程序总控制类
 * @type {Object}
 */
App.controller = {

	lang : '',	//语言
	
	/**
	 * 加载必须内容
	 */
	load : function(){
		//加载本地数据
		App.database.open();
	},

	/**
	 * 开始打字
	 * @param  {int} lang    语言 0: 中文  1: 英文
	 * @param  {function} successCallback 成功回调函数
	 * @param  {function} errorCallBack   失败回调函数
	 * successCallback : {id,title,lang,body}
	 * errorCallBack   : text 错误信息
	 */
	start_dz : function(lang, successCallback, errorCallBack){
		//设置 语言
		this.lang = lang;
		//随机文章
		App.articleController.random_article(successCallback, errorCallBack);
	},

	over_dz : function(){
		var grade = this.dz.get_result();
	},

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