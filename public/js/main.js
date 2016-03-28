$(function(){
	//加载App
	App.controller.load();
	skip_page('grade');
	//弹出菜单
	$('#menu-button').on('click',function(){
		if($('.sider').is(':visible')){
			hide_menu();
		}else{
			show_menu();
		}
	});
	//导航栏跳转
	$('.nav-item').on('click',function(){
		var tar = $(this).attr('for');
		if(typeof tar != 'undefined'  && tar != '') skip_page(tar);
	});

	//添加文章按钮
	$('#add-article').on('click',function(){
		App.articleController.edit_article('', function(html){
			$.dialog('edit-article', '添加文章', html, article_post);
		});
	})
	//切换文章按钮
	$('#change-article').on('click', function(){
		start_dz(App.controller.lang);
	})

	//上传文件
	$(document).on('click','#article-upload-btn',function(){
		$(this).prev().click();
	})
	//将文件内容写入文本域
	$(document).on('change','#article-file',function(){
		var fileList = this.files;
		if(fileList){
			for(var i = 0; i < fileList.length; i ++){
				// if(!/image\/\w+/.test(fileList[i].type)){
				//     continue;
				// }
					//读取文件
				var reader = new FileReader();
				reader.onloadend = function (e) {
	                var result = e.target.result;
	                $('#article-body').val(result);
	            };
				reader.readAsText(fileList[i],'gbk'); 
			}
		}
	})
})
function hide_menu(){
	if($('.sider').is(':visible')){
		$('.sider').animate({
			left : "-160px"
		},250,function(){
			$('.sider').hide();
		});
		$('.main').animate({
			left : 0
		},250);
	}
}
function show_menu(){
	if(!$('.sider').is(':visible')){
		$('.sider').show().animate({
			left : 0
		},250);
		$('.main').animate({
			left : "150px"
		},250);
	}
}
function start_dz(lang){
	App.controller.start_dz(lang,function(lang, title, text){
		skip_page('dz');
		$('#article-title').text(title);
		window.cc = DZ.getInstance("dz-main", lang, text, App.controller.log_grade, function(){
			skip_page('index');
		});
	},function(text){
		errorAlert(text);
	});
}
/**
 * 菜单页跳转
 * @param  {string} page 页id
 */
function skip_page(page){
	$('.page').hide();
	$('#' + page + '-page').show();
	$('.nav-item').removeClass('active');
	$('.nav-item[for='+page+']').addClass('active');
	App.controller.route(page);
	hide_menu();
}
function errorAlert(text){
	highAlert('error', text);
}

function successAlert(text){
	highAlert('success', text);
}
/**
 * 整理文章的修改添加时提交的信息 并交给控制器处理
 * @param  {int} id 有值则表示 修改
 */
function article_post(id){
	var form = $('#article-add-form');
	var article_text = form.find('textarea[name=article_body]').val();
	var data = {
		title : form.find('input[name=article_name]').val(),
		lang  : form.find('select[name=article_lang]').val(),
		body  : article_text,
		length: article_text.length
 	}
 	if(!isNaN(id) && id > 0){
 		data.id = id;
 		console.log('edit_main :' + id);
 		App.articleController.update_article(data);
 	}else{
 		App.articleController.insert_article(data);
 	}
 	
}
function del_article(id,title){
	highAlert('confirm','是否删除文章 ' + title, ['确定', '取消'],[function(){
		App.articleController.delete_article({id},function(){
	 		successAlert("删除成功");
	 	},function(text){
	 		errorAlert(text);
	 	})
	}]);
}
function edit_article(id){
 	App.articleController.edit_article(id, function(html){
 		$.dialog('edit-article', '编辑文章', html, function(){
 			article_post(id);
 		});
 	})	
}
function resetGrade(){
	highAlert('confirm','是否重置成绩记录 ?', ['确定', '取消'],[function(){
		App.gradeController.reset(function(){
	 		successAlert("重置成功");
	 	},function(text){
	 		errorAlert(text);
	 	})
	}]);
} 

function changeGrageLang(lang){
	var temp = 0;
	if(lang != 'zh'){
		temp = 1;
	}
	App.gradeController.showTable(temp);
	$('#lang-radio').find('.active').removeClass('active');
	$('#lang-radio').find(':nth-child('+(temp+1)+')').addClass('active');
}
function changePanel(panel){
	$('#grade-panel-bar').css({
		left : (- panel * $('#grade-window').width()) + 'px'
	});
	$('#panel-radio').find('.active').removeClass('active');
	$('#panel-radio').find(':nth-child('+(panel+1)+')').addClass('active');
}