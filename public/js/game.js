// IE 兼容 addEventlistener 方法
if(!window.addEventListener){
	window.addEventListener = function(eventtype,todo,flag){
		window.attachEvent(eventtype,todo);
	}
}

/*!
 * 打字主类   应用单模式
 */
DZ = (function(){
/**
 * 主构造器
 * @param {string} selector 选择器
 * @param {string} text     文章内容
 * @param {function} gradeDriver 完成一篇文章时的回调函数
 * @param {function} quitCallback 退出打字时的回调函数
 */
Construct = function (selector, lang, text, gradeDriver, quitCallback){
	this.main = document.getElementById(selector);
	this.main.style.width = "625px";
	this.gradeDriver = gradeDriver;
	this.quitCallback = quitCallback;
	this.load(lang, text);
	this.loadEvent();
}

Construct.prototype = { 
	/**
	 * 初始化
	 * @param  {string} text 文章内容
	 */
	load : function(lang, text ){

		if(this.timer){
			clearInterval(this.timer); // 停止计时器
		}

		this.main.innerHTML = "";

		if(text && text.length > 0){
	 		this.text = text;
	 	}else{
	 		if(this.text && this.text.length > 0){

	 		}else{
	 			return;
	 		}
	 	}
	 	//初始化变量
	 	this.lang = lang;
	 	this.length = this.text.length	//文章总字数
		this.enterArray = [];			//行数组
		this.now_line = 0;				//正在输入的行号
		this.all_line = 0;				//总行数
		this.clock = 0;					//用间 单位s
		this.word_num = 0;				//打字总数
		this.right_num = 0;				//正确总数
		this.show_line_num = 4;			//每页显示行数
		this.finish = false;			//是否结束
		this.timer = undefined;			// 清除计时器

		//加载视图
		this.loadGradeBar();			//计分板
		this.loadEnterPanel();			//输入面板
		this.createEnter();				//光标
	},

	/**
	 * 加载输入面板
	 */
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

	 /**
	 * 加载计分板
	 */
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

	 /**
	  * 创建光标 
	  */
	 createEnter : function(){
	 	var input = document.createElement("input");
		input.className = 'enter';
		that = this;
		var flag = false;
		this.findEnter().input.appendChild(input);
		input.addEventListener('input',function(){
			reg = /[ a-z]+/;		//空格或英文字母
			//英文输入时可监听到keypress事件，直接打印
			//
			//当监听不到keypress 却触发input时说明中文输入法正在输入
			//中文输入法下当点击空格时完成输入，应该打印
			//但不会触发keypress事件
			//所以需判断此时的值是否为汉字或符号
			if(!flag && reg.test(this.value)){
				return;
			}
			flag = false;
			that.oneinput();
		},false);
		//当中文输入时 监听不到keypress事件
		input.addEventListener('keypress',function(e){
			flag = true;
		},false);
		this.enter = input;
		this.pointEnter();
	 },

	 /**
	  * 主面板事件
	  */
	 loadEvent : function(){
	 	that = this;
	 	var flag = true;
	 	this.main.addEventListener('click', function(){that.pointEnter.call(that)} ,false);
	 	//firefox 会同时触发 keypress keydown 其他浏览器只会触发keydown
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

	 /**
	  * 删除一个字符
	  */
	 rollback : function(){
	 	var line = this.findEnter().rollback();
	 },

	 /**
	  * 得到正在输入的行
	  */
	 findEnter : function(){
	 	return this.enterArray[this.now_line];
	 },

	 /**
	  * 光标获得焦点
	  */
	 pointEnter : function(){
	 	this.enter.focus();
	 },

	 /**
	  * 打印单个字符
	  */
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

	/**
	 * 打印多个字符(中文输入法)
	 * @param  {string} word 打印的字符串
	 */
	 insterWord : function(word){
	 	this.findEnter().insterWord(word);
	 },

	 /**
	  * 转行
	  */
	 nextline : function(){
	 	this.findEnter().input.removeChild(this.enter);
	 	this.now_line ++;
	 	if(this.now_line >= this.all_line){
	 		this.finish = true;
	 		this.gameOver();
	 		return;
	 	}
	 	if(this.now_line % this.show_line_num == 0){
	 		this.nextPage();
	 	}
	 	this.createEnter();
	 },

	 /**
	  * 下一页
	  */
	 nextPage :function(){
	 	for(var i = 0 ; i < this.show_line_num; i ++){
	 		this.enterArray[this.now_line - i - 1].elem.className = "hideline";
	 		if(this.now_line + i < this.all_line){
	 			this.enterArray[this.now_line + i].elem.className = "showline";
	 		}
	 	}
	 },

	 /**
	  * 开始计时
	  */
	 startTimer : function(){
	 	that = this;
	 	this.timer = setInterval(function(){
	 		that.clock ++;
	 		that.updateGradeBar();
	 	},1000);
	 },

	 /**
	  * 更新计分板
	  */
	 updateGradeBar : function(){
	 	document.getElementById('time-input').value = this.getTime();
	 	document.getElementById('speed-input').value = this.getGrade() + " 字/分钟";
	 	document.getElementById('success-input').value = this.getRightRate() + " %";
	 	document.getElementById('finish-input').value = this.getFinishRate() + " %";
	 },

	 getRightRate : function(){
	 	return parseInt((this.right_num / (this.word_num == 0? 1 : this.word_num)) * 100);
	 },

	 getFinishRate : function(){
	 	return parseInt((this.word_num / this.length) * 100);
	 },

	 getGrade : function(){
	 	console.log(this.right_num);
	 	console.log(this.clock);
	 	return parseInt((this.right_num  / (this.clock == 0 ? 1 : this.clock)) * 60);
	 },

	 getTime : function(){
	 	console.log("time:" + this.clock);
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
	 	this.gradeDriver(this.getResult(), function(that){
	 		return function(is_save){
	 			that.showFinishDialog.call(that, is_save);
	 		}
	 	}(this));
	 },

	 /**
	  * 展示最后的成绩面板
	  * @return {[type]} [description]
	  */
	 showFinishDialog : function(is_save){
	 	// console.log('right : ' + this.right_num);
	 	// console.log('word : ' + this.word_num);
	 	// console.log('length : ' + this.length);
	 	var html = "<div id='finish-dialog'><div id='dialog-main'>"
	 						+"<div id='dialog-head'></div>"
	 						+"<div id='dialog-content'>"
	 							+"<div id='save-status'>" + (is_save ? "成绩保存成功" : "成绩保存失败") + "<div>"
	 							+"<p>总共用时:"+ 	 this.getTime()
	 							+"</p><p>平均速度:"+ this.getGrade() +"字每分钟"
	 							+"</p><p>正确率:"+ 	 this.getRightRate() + " %"
	 							+"</p><p>"+ 		 this.resultWord() 
	 						+"</p></div>"
	 						+"<div id='dialog-foot'></div>"
	 					+"</div></div>";
	 	that = this;
	 	$.dialog('dz-result' , '成绩' , html, function(){
	 		that.load();
	 	}, this.quitCallback);
	 },

	 /**
	  * 根据得分  给出评价
	  * @return {[type]} [description]
	  */
	 resultWord : function(){
	 	if(parseInt((this.right_num / this.word_num) * 100) < 60){
	 		return "正确率有待提高，赶紧练习哦！";
	 	}
	 	if(this.lang == 0){
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
	 	if(this.lang == 1){
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
	 	return "失败";
	 },

	 getResult : function(){
	 	if(this.finish){
	 		return {
	 			grade : this.getGrade(),
	 			right_rate : this.getRightRate()
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
			console.log("cccc");
	 		this.input.removeChild(this.enterArray[--this.start_point]);
	 		if(this.spanArray[this.start_point].className == "trueLetter") this.dz.right_num --;
	 		this.dz.word_num --;
	 		this.spanArray[this.start_point].className = "";
	 	}
	}

}

var unique;

function getInstance(selector, lang, text, gradeDriver, quitCallback){
    if( unique === undefined ){
        unique = new Construct(selector, lang, text, gradeDriver, quitCallback);
    }else{
    	unique.load(unique.lang, text);
    }
    return unique;
}

return {
		getInstance : getInstance
	}
})();