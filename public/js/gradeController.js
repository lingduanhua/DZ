/*!
 * 文章控制类
 * @type {Object}
 */
App.gradeController = {

	insert_grade : function(grade,successCallback, errorCallback){
		var data = {
			speed : grade.grade,
			right : grade.right_rate,
			lang : grade.lang,
			time : (new Date()).getTime()
		}
		App.model.grade.insertGrades([data], successCallback, errorCallback);
	}
}