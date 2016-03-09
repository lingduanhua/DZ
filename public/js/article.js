/*!
 * 文章模型类
 * @type Object
 */
App.model.article = {
    /**
     * 删除文章
     * @param  array articles       要删除的文章数组
     * @param  function successCallback 成功回调函数
     * @param  function errorCallback   失败回调函数
     * {
     *     id
     * }
     */
	deleteArticles : function(articles ,successCallback, errorCallback){
		var remaining = articles.length, i, l, data = [];

		if (remaining === 0) {
            successCallback();
        }

        for (i = 0, l = articles.length; i < l; i = i + 1) {
            data[i] = [articles[i].id];
        }

		App.database.runQuery("DELETE FROM articles WHERE id = ?", data, successCallback, errorCallback);
	},

    /**
     * 添加文章
     * @param  array articles       要删除的文章数组
     * @param  function successCallback 成功回调函数
     * @param  function errorCallback   失败回调函数
     * {
     *     title, lang, body, length
     * }
     */
	insertArticles : function(articles, successCallback, errorCallback){
		var remaining = articles.length, i, l, data = [];

        if (remaining === 0) {
            successCallback();
        }

        for (i = 0, l = articles.length; i < l; i = i + 1) {
            data[i] = [articles[i].title, articles[i].lang, articles[i].body, articles[i].length];
        }

        App.database.runQuery("INSERT INTO articles (title, lang, body, length) VALUES (?, ?, ?, ?);", data, successCallback, errorCallback);
	},

    /**
     * 修改文章
     * @param  object articles       要修改的文章
     * @param  function successCallback 成功回调函数
     * @param  function errorCallback   失败回调函数
     * {
     *     id,title,lang,length,body
     * }
     */
    updateArticle : function(article, successCallback, errorCallback){
        if(!article){
            successCallback();
        }

        data = [article.title, article.lang, article.body, article.length, article.id];
        App.database.runQuery("update articles set title = ?, lang = ?, body = ?, length = ? where id = ?;", [data], successCallback, errorCallback);
    },

    /**
     * 得到所有文章的基本信息
     * @param  function successCallback 成功灰调函数
     * {
     *     id, title, lang, length
     * }
     */
	selectAllArticles : function(successCallback){
		App.database.runQuery("SELECT id, title, lang, length FROM articles", [], successCallback);
	},

    /**
     * 得到一篇文章
     * @param  int id              文章id
     * @param  function successCallback(article) 成功回调函数
     * @param  function errorCallback   失败回调函数
     * {
     *     id,title,lang,body
     * }
     */
	selectFullArticle : function(id, successCallback, errorCallback) {
        App.database.runQuery("SELECT id, title, lang, body FROM articles WHERE id = ?"
            , [id]
            , function(articles){successCallback(articles[0])}
            , errorCallback);
    } 
}