(function($){ 
	$.dialog = function(selector, title, html, sure_fucntion, cencel_function){
		if(!html){
			return;
		}
		$('#cover-level').show();
		var dialog = $('#' + selector + "-dialog");
		if(title){
			dialog.find('.dialog-title').text(title);
		}
		dialog.find('.dialog-body').html(html);
		if(sure_fucntion){
			(dialog.find('.sure-btn')[0]).onclick = function(){
				sure_fucntion();
				dialog.find('.dialog-close').click();
			};
		}
		if(cencel_function){
			(dialog.find('.cancel-btn')[0]).onclick = function(){
				cencel_function();
				dialog.find('.dialog-close').click();
			}
		}
		dialog.show();
		$(window).resize();
	}
})(jQuery);
$(function(){
	// $(".show-dialog").on('click',function(){
	// 	$('#cover-level').show();
	// 	var dialog = $('#' + $(this).attr('for') + "-dialog");
	// 	dialog.show();
	// })

	$(".dialog-close").on('click',function(){
		$(this).parent().parent().hide();
		$('#cover-level').hide();
	})

	$(window).resize(function(){
		$('.dialog:visible').each(function(){
			dialog = $(this);
			dialog.find('.dialog-body').css('height',
				dialog.height() - 
				dialog.find('.dialog-head')[0].offsetHeight - 
				dialog.find('.dialog-foot')[0].offsetHeight + 
			"px");
		});

		$('#cover-level').css({
			width : $('body')[0].scrollWidth+'px',
			height: $('body')[0].scrollHeight+'px'
		})
	}).resize();;
})