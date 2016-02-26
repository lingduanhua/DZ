$(function(){
	//加载App
	App.controller.load();
	skip_page('index');
	//弹出菜单
	$('#menu-button').on('click',function(){
		if($('.sider').is(':visible')){
			$('.sider').animate({
				left : "-160px"
			},250,function(){
				$('.sider').hide();
			});
			$('.main').animate({
				left : 0
			},250);
		}else{
			$('.sider').show().animate({
				left : 0
			},250);
			$('.main').animate({
				left : "150px" 
			},250);
		}
	});
	//导航栏跳转
	$('.nav-item').on('click',function(){
		skip_page($(this).attr('for'));
	});
	//添加文章
	$('#add-article').on("click",function(){
		$('#add-article-dialog').show();
	})

})
function start_dz(lang){
	App.controller.start_dz(lang,function(status,text){
		if(!status){
			errorAlert(text);
		}else{
			skip_page('dz');
			new DZ("dz-main",text);
		}
	});
}

function skip_page(page){
	$('.page').hide();
	$('#' + page + '-page').show();
	$('.nav-item').removeClass('active');
	$('.nav-item[for='+page+']').addClass('active');
	App.controller.route(page);
	$('#menu-button').click();
}

function errorAlert(text){
	alert(text);
}