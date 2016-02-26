if(!window.addEventListener){
	window.addEventListener = function(eventtype,todo,flag){
		window.attachEvent(eventtype,todo);
	}
}

DZ = function( selector , text){
	if( this instanceof DZ ){
		this.main = document.getElementById(selector);
		this.main.style.width = "625px";
		this.text = text;
		this.main.innerHTML = "";
		this.enterArray = [];
		this.now_line = 0;
		this.all_line = 0;
		this.clock = 0;
		//this.lang = window.DZlang;
		this.timer;
		this.word_num = 0;
		this.right_num = 0;
		this.show_line_num = 4;
		this.finish = false;
		this.load();
	}else{
		return new DZ(selector);
	}
}
DZ.prototype = { 
	load : function(){
		this.loadGradeBar();
		this.loadEnterPanel();
		this.createEnter();
		this.loadEvent();
	 },

	 loadEnterPanel : function(){
	 	var length = this.text.length;
	 	var div = document.createElement("div");
	 	div.className = "enterPanel";
	 	var i = 0;
	 	var j = 0;
	 	while ( i + 20 < length ){
	 		var textitem = this.text.substr(i,20);
	 		i = i + 20;
	 		var enter = new Enter(this,textitem);
	 		this.enterArray[j++] = enter;
	 		if(j <= this.show_line_num){
	 			enter.elem.className = "showline";
	 		}else{
	 			enter.elem.className = "hideline";
	 		}
	 		div.appendChild(enter.elem);
	 	}
	 	if(i < length){
	 		var textitem = this.text.substr(i,length - i);
	 		var enter = new Enter(this,textitem);
	 		this.enterArray[j++] = enter;
	 		if(j <= this.show_line_num){
	 			enter.elem.className = "showline";
	 		}else{
	 			enter.elem.className = "hideline";
	 		}
	 		div.appendChild(enter.elem);
	 	}
	 	this.all_line = j;
	 	this.main.appendChild(div);
	 },

	 loadGradeBar : function(){
	 	var div = document.createElement("div");
	 	div.id = "grade-bar";
	 	div.innerHTML = "<div id='timeBar' class='bar-item'>"+
	 						"<label id='time-label'>时　间<label>"+
	 						"<input id='time-input' value ='00:00:00' type='text' disabled='true' class='bar-input'>"+
	 					"</div>"+
	 					"<div id='speedBar' class='bar-item'>"+
	 						"<label id='speed-label'>速　度<label>"+
	 						"<input id='speed-input' value='0 字/分' type='text' disabled='true' class='bar-input'>"+
	 					"</div>"+
	 					"<div id='finishBar' class='bar-item'>"+
	 						"<label id='finish-label'>已完成<label>"+
	 						"<input id='finish-input' value='0 %' type='text' disabled='true' class='bar-input'>"+
	 					"</div>"+
	 					"<div id='successBar' class='bar-item'>"+
	 						"<label id='success-label'>正确率<label>"+
	 						"<input id='success-input' value='100 %' type='text' disabled='true' class='bar-input'>"+
	 					"</div>";
	 	this.main.appendChild(div);
	 },

	 createEnter : function(){
	 	var input = document.createElement("input");
		input.className = 'enter';
		that = this;
		var flag = false;
		this.findEnter().input.appendChild(input);
		input.addEventListener('input',function(){
			// console.log('input:' + this.value);

			reg = /[ a-z]+/;
			if(reg.test(this.value) && !flag){
				return;
			}
			flag = false;
			that.oneinput();
			
		},false);
		input.addEventListener('keypress',function(e){
			flag = true;
		},false);
		this.enter = input;
		this.pointEnter();
	 },

	 findEnter : function(){
	 	return this.enterArray[this.now_line];
	 },

	 loadEvent : function(){
	 	that = this;
	 	var flag = true;
	 	this.main.addEventListener('click', function(){that.pointEnter.call(that)} ,false);
	 	this.main.addEventListener('keypress',function(e){
	 		if(e.keyCode == "8" && that.enter.value == "" ){
	 			that.rollback();
	 			flag = false;
	 		}
	 	},false);
	 	this.main.addEventListener('keydown',function(e){
	 		if(flag && e.keyCode == "8" && that.enter.value == "" ){
	 			that.rollback();
	 		}
	 	},false);
	 },

	 rollback : function(){
	 	var line = this.findEnter().rollback();
	 	
	 },

	 pointEnter : function(){
	 	this.enter.focus();
	 },

	 oneinput : function(){
	 	if(typeof this.timer == "undefined"){
	 		this.startTimer();
	 	}
		var word = this.enter.value;

		if(word != ""){
			var line = that.findEnter();
			line.insterWord(word);
			this.enter.value = ""; 
		}
	},

	 insterWord : function(word){
	 	this.findEnter().insterWord(word);
	 },

	 nextline : function(){
	 	this.findEnter().input.removeChild(this.enter);
	 	this.now_line ++;
	 	if(this.now_line >= this.all_line){
	 		this.finish = true;
	 		this.gameOver();
	 		return;
	 	}
	 	console.log(this.now_line % this.show_line_num);
	 	if(this.now_line % this.show_line_num == 0){
	 		this.nextPage();
	 	}
	 	this.createEnter();
	 },

	 nextPage :function(){
	 	for(var i = 0 ; i < this.show_line_num; i ++){
	 		this.enterArray[this.now_line - i - 1].elem.className = "hideline";
	 		if(this.now_line + i < this.all_line){
	 			this.enterArray[this.now_line + i].elem.className = "showline";
	 		}
	 	}
	 },

	 startTimer : function(){
	 	that = this;
	 	this.timer = setInterval(function(){
	 		that.clock ++;
	 		//console.log("all_word:"+that.word_num + "right_word:"+that.right_num + "clock:"+that.clock);
	 		that.grade = parseInt((that.right_num  / that.clock) * 60);
	 		that.updateTime(that.showtime());
	 		that.updateSpeed();
	 		that.updateSuccess();
	 	},1000);
	 },

	 updateTime : function(time){
	 	document.getElementById('time-input').value = time;
	 },

	 updateSpeed : function(time){
	 	document.getElementById('speed-input').value = this.grade + " 字/分钟";
	 },

	 updateSuccess : function(time){

	 	document.getElementById('success-input').value = this.get_right_rate() + " %";
	 },

	 updateFinish : function(time){
	 	document.getElementById('finish-input').value = parseInt((this.word_num / this.length) * 100) + " %";
	 },

	 get_right_rate : function(){
	 	return parseInt((this.right_num / (this.word_num == 0? 1 : this.word_num)) * 100);
	 },

	 showtime : function(){
	 	var mm = parseInt(this.clock / 60);
	 	var ss = this.clock % 60;
	 	var hour = parseInt(mm / 60);
	 	mm = mm % 60;
	 	var time = (hour >= 10 ? hour : "0" + hour) + ":" 
	 			 + (mm >= 10 ? mm : "0" + mm) + ":" 
	 			 + (ss >= 10 ? ss : "0" + ss);
	 	return time;
	 },

	 gameOver : function(){
	 	clearInterval(this.timer);
	 	this.showFinishDialog();
	 },

	 showFinishDialog : function(){
	 	var div = document.createElement("div");
	 	div.id = "finish-dialog";
	 	div.innerHTML = "<div id='dialog-main'>"+
	 						"<div id='dialog-head'></div>"+
	 						"<div id='dialog-content'>"+
	 							"<p>总共用时:"+this.showtime()+"</p>"+
	 							"<p>平均打字速度每分钟"+this.grade+"字</p>"+
	 							"<p>正确率:"+parseInt((this.right_num / this.word_num) * 100) + " %</p>"+
	 							"<p>"+this.resultWord()+"</p>"+
	 						"<div>"+
	 						"<div id='dialog-foot'><div>"+
	 					"</div>"
	 	this.main.appendChild(div);
	 },

	 resultWord : function(){
	 	if(parseInt((this.right_num / this.word_num) * 100) < 60){
	 		return "正确率有待提高，赶紧练习哦！";
	 	}
	 	if(this.lang == "zh"){
	 		if(this.grade < 50){
	 			return "打字速度不给力呀，还是再练练吧";
	 		}
	 		if(this.grade < 70){
	 			return "这个速度还可以，想练成神速吗，继续练习吧";
	 		}
	 		if(this.grade < 100){
	 			return "诶呦，不错呦，你已练成神速了！";
	 		}
	 		return "不得了了，超神啦！！！";
	 	}
	 	if(this.lang == "en"){
	 		if(this.grade < 100){
	 			return "打字速度不给力呀，还是再练练吧";
	 		}
	 		if(this.grade < 150){
	 			return "这个速度还可以，想练成神速吗，继续练习吧";
	 		}
	 		if(this.grade < 200){
	 			return "诶呦，不错呦，你已练成神速了！";
	 		}
	 		return "不得了了，超神啦！！！";
	 	}
	 	
	 },

	 get_result : function(){
	 	if(this.finish){
	 		return {
	 			grade : this.grade,
	 			right_rate : this.get_right_rate()
	 		}
	 	}
	 	return false;
	 }
}
Enter = function(dz,text){
	this.dz = dz;
	this.text = text;
	this.length = this.text.length;
	this.spanArray = [];
	this.enterArray = [];
	this.start_point = 0;
	this.status = false;
	this.init();
}

Enter.prototype = {
	init : function(){
		var div = document.createElement("div");
		div.className = 'line';
		var line = document.createElement("p");
		line.className = "ppp";
		for(var j = 0; j < this.length ; j ++){
			var span = document.createElement("span");
			span.innerHTML = this.text[j];
			this.spanArray[j] = span;
			line.appendChild(span);
		}
		div.appendChild(line);
		var inputBar = document.createElement("div");
		inputBar.className = 'inputBar';
		div.appendChild(inputBar);
		this.line = line;
		this.input = inputBar;
		this.elem = div;
	},

	insterLetter : function(letter){
		var span = document.createElement("span");
		span.innerHTML = letter;
		if(letter == this.spanArray[this.start_point].innerHTML){
			span.className = "trueLetter";
			this.spanArray[this.start_point].className = "trueLetter";
			this.dz.right_num ++;
		}else{
			span.className = "errorLetter";
			this.spanArray[this.start_point].className = "errorLetter";
		}
		this.dz.word_num ++;
		this.enterArray[this.start_point ++] = span;
		this.input.insertBefore(span,this.dz.enter);
		if(this.start_point >= this.length){
			this.status = true;
			this.dz.nextline();
		}
	},

	insterWord : function(word){
		var maxlen = this.length - this.start_point;
		var less = "";
		if(word.length > maxlen){
			less = word.substring(maxlen,word.length);
			word = word.substring(0,maxlen);
		}

		for(var i = 0; i < word.length; i ++){
			this.insterLetter(word[i]);
		}
		if(less != ""){
			this.dz.insterWord(less);
		}
	},

	rollback : function(){
		if(this.start_point > 0){
	 		this.input.removeChild(this.enterArray[--this.start_point]);
	 		if(this.spanArray[this.start_point].className == "trueLetter") this.dz.right_num --;
	 		this.dz.word_num --;
	 		this.spanArray[this.start_point].className = "";
	 	}
	}

}