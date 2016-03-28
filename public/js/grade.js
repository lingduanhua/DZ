/*!
 * 成绩模型类
 * @type Object
 */
App.model.grade = {
    /**
     * 删除所有成绩
     * @param  function successCallback 成功回调函数
     * @param  function errorCallback   失败回调函数
     * {
     *     id
     * }
     */
	deleteAll : function(successCallback, errorCallback){
		App.database.runQuery("DELETE FROM grades WHERE id > 0", [], successCallback, errorCallback);
	},

    /**
     * 添加成绩
     * @param  array grades       要删除的成绩数组
     * @param  function successCallback 成功回调函数
     * @param  function errorCallback   失败回调函数
     * {
     *     title, lang, body, length
     * }
     */
	insertGrades : function(grades, successCallback, errorCallback){
		var remaining = grades.length, i, l, data = [];

        if (remaining === 0 && successCallback) {
            successCallback();
        }

        for (i = 0, l = grades.length; i < l; i = i + 1) {
            data[i] = [grades[i].speed, grades[i].right, grades[i].lang, grades[i].time];
        }

        App.database.runQuery("INSERT INTO grades (speed, right, lang, time) VALUES (?, ?, ?, ?);", data, successCallback, errorCallback);
	},

    /**
     * 得到所有成绩的基本信息
     * @param  function successCallback 成功灰调函数
     * {
     *     id, title, lang, length
     * }
     */
	selectAllgrades : function(lang, successCallback){
		App.database.runQuery('SELECT id, speed, right, lang, time FROM grades where lang = '+lang+' order by time desc limit 5', [], successCallback);
	},

    /**
     * 得到一篇成绩
     * @param  int id              成绩id
     * @param  function successCallback(grade) 成功回调函数
     * @param  function errorCallback   失败回调函数
     * {
     *     id,title,lang,body
     * }
     */
	selectFullgrade : function(id, successCallback, errorCallback) {
        App.database.runQuery("SELECT id, title, lang, body FROM grades WHERE id = ?"
            , [id]
            , function(grades){successCallback(grades[0])}
            , errorCallback);
    } 
}