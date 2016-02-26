$(function(){
	$(".show-dialog").on('click',function(){
		$('#cover-level').show();
		var dialog = $('#' + $(this).attr('for') + "-dialog");
		
		dialog.show();dialog.find('.dialog-body').css('height',
			dialog.height() - 
			dialog.find('.dialog-head')[0].offsetHeight - 
			dialog.find('.dialog-foot')[0].offsetHeight + 
		"px");
	})

	$(".dialog-close").on('click',function(){
		$(this).parent().parent().hide();
		$('#cover-level').hide();
	})

	$(window).resize(function(){
		$('.dialog').each(function(){
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