$(function(){
	//加载App
	App.controller.load();
	skip_page('article');
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
		skip_page($(this).attr('for'));
	});

	$('#article-upload-btn').on('click',function(){
		//console.log("dfsdfdf");
		$('#article-file').click();
	})

	$('#article-file').on('change',function(){
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
	App.controller.start_dz(lang,function(text){
		skip_page('dz');
		new DZ("dz-main",text);
	},function(text){
		errorAlert(text);
	});
}

function skip_page(page){
	$('.page').hide();
	$('#' + page + '-page').show();
	$('.nav-item').removeClass('active');
	$('.nav-item[for='+page+']').addClass('active');
	App.controller.route(page);
	hide_menu();
}
function errorAlert(text){
	alert(text);
}
function  add_article(btn){
	var form = $('#article-add-form');
	var article_text = form.find('textarea[name=article_body]').val();
	var data = {
		title : form.find('input[name=article_name]').val(),
		lang  : form.find('select[name=article_lang]').val(),
		body  : article_text,
		length: article_text.length
 	}
 	App.articleController.insert_article(data,function(){
 		$('#add-article-dialog').find('.dialog-close').click();
 	},function(text){
 		errorAlert(text);
 	})
}