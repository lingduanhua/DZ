/*!
 * 文章控制类
 * @type {Object}
 */
App.articleController = {

	list : [],   		//文章列表

	en_list : [],		//英文文章列表

	zh_list : [],		//中文文章列表

	is_load : false,	//是否加载过

	/**
	 * 初始化文章页
	 */
	load : function(){
		if(!this.is_load){
			App.model.article.selectAllArticles(function(rs){
				App.articleController.list = rs;

				for(var i = 0; i < rs.length; i ++){
					if(rs[i].lang == 0){
						App.articleController.zh_list.push(rs[i]);
					}else if(rs[i].lang == 1){
						App.articleController.en_list.push(rs[i]);
					}
				}

				App.view.showArticles(App.articleController.list);
			});
			is_load = true;
		}
		App.view.showArticles(this.list);
	},

	/**
	 * 重新加载文章页
	 */
	reload : function(){
		this.is_load = false;
		App.articleController.load();
	},

	/**
	 * 随机选出一篇文章
     * @param  function successCallback 成功回调函数
     * @param  function errorCallback   失败回调函数
	 * successCallback : {id,title,lang,body}
	 * errorCallBack   : text 错误信息
	 */
	random_article : function(success, error){
		if(this.is_load){
			this.reload();
		}
		var lang = App.controller.lang;
		var length = lang == 0 ? this.zh_list.length : this.en_list.length; 
		if(length <= 0){
			return error('还没有文章快去添加吧');
		}
		var i = Math.ceil(Math.random()*length) - 1;
		var id = 0;
		if(lang == 0){
			id = this.zh_list[i].id;
		}else{
			id = this.en_list[i].id;
		}
		App.model.article.selectFullArticle(id, success, error);
	},

	/**
	 * 编辑文章
	 * @param  int id  要修改的文章id
	 * @param  function fun 成功回调函数
	 * fun : {} || {id,title,lang,body}
	 */
	edit_article : function(id, fun){
		console.log(id + " \n" + fun)
		if(typeof id == 'undefined' || isNaN(id) || id == 0){
			fun(App.view.editArticle({}));
		}else{
			this.select_full_article( id, function(article){
				fun(App.view.editArticle(article));
			});
		}
	},

	/**
	 * 得到一篇文章
	 * @param  {int} id      文章id
	 * @param  {function} success 成功回调函数
	 * @param  {function} error   失败回调函数
	 * successCallback : {id,title,lang,body}
	 * errorCallBack   : text 错误信息
	 */
	select_full_article : function(id, success, error){
		App.model.article.selectFullArticle(id, success, error);
	},

	/**
	 * 更新一篇文章
	 * @param  {object} article      文章
	 *         {id,title,lang,body}
	 * @param  {function} successCallBack 成功回调函数
	 * @param  {function} errorCallBack   失败回调函数
	 * errorCallBack   : text 错误信息
	 */
	update_article : function(article,successCallBack,errorCallBack){
		App.model.article.updateArticle(article,function(){
			if(successCallBack){
				successCallBack();
			}
			App.articleController.reload();
		},errorCallBack);
	},

	/**
	 * 插入一篇文章
	 * @param  {object} article      文章
	 *         {title, lang, body, length}
	 * @param  {function} successCallBack 成功回调函数
	 * @param  {function} errorCallBack   失败回调函数
	 * errorCallBack   : text 错误信息
	 */
	insert_article : function(article,successCallBack,errorCallBack){
		App.model.article.insertArticles([article],function(){
			if(successCallBack){
				successCallBack();
			}
			App.articleController.reload();
		},errorCallBack);
	},

	/**
	 * 插入一篇文章
	 * @param  {object} article      文章
	 *         {id}
	 * @param  {function} successCallBack 成功回调函数
	 * @param  {function} errorCallBack   失败回调函数
	 * errorCallBack   : text 错误信息
	 */
	delete_article : function(article,successCallBack,errorCallBack){
		App.model.article.deleteArticles([article],function(){
			if(successCallBack){
				successCallBack();
			}
			App.articleController.reload();
		},errorCallBack);
	}
}