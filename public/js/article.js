App.model.article = {

	deleteArticles : function(articles ,successCallback){
		var remaining = articles.length, i, l, data = [];

		if (remaining === 0) {
            successCallback();
        }

        for (i = 0, l = articles.length; i < l; i = i + 1) {
            data[i] = [articles[i].id];
        }

		App.database.runQuery("DELETE FROM articles WHERE id = ?", data, successCallback);
	},

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

	selectAllArticles : function(successCallback){
		App.database.runQuery("SELECT id, title, lang, length FROM articles", [], successCallback);
	},

	selectFullArticle : function(id, successCallback) {
        App.database.runQuery("SELECT id, title, lang, body FROM articles WHERE id = ?", [id], successCallback);
    }

}