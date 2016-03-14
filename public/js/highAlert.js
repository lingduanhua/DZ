/**
 * [highAlert description]
 * @param  {[type]} type   [description]   confirm
 * @param  {[type]} text   [description]
 * @param  {[type]} button [description]
 * @param  {[type]} fun    [description]
 * @return {[type]}        [description]
 */
window.highAlert = function(type, text, button ,fun){

	showAlert();
	addEvent();

	
	function buttonHtml(){
		if(button && button.length > 0){
			buttonHtml = '<div id="high-alert-button-bar">'
			for(var i = 0; i < button.length; i ++){
				buttonHtml += '<button>'+button[i]+'</button>';
			}
			buttonHtml += '</div>';
			return buttonHtml;
		}
		return "";
	}
	function buildHtml(){
		var html = '<div id="high-alert" class="' + type + '">'
				  +'<div id="high-alert-text">' + text
				  + buttonHtml()
				  + '</div></div>';
		return html;
	}
	function showAlert(){
		$('body').append(buildHtml());
	}
	function delAlert(){
		$('#high-alert').remove();
	} 
	function addEvent(){
		var i = 0;
		$('#high-alert-button-bar').find('button').each(function(){
			$(this).on('click',function(num){
				return function(){
					delAlert();
					if(fun[num]){
						fun[num]();
					}
				}
			}(i));
			i ++;
		});
		if(type != 'confirm'){
			setTimeout(function(){
				$('#high-alert').remove();
			},1000);
		}
	}
}