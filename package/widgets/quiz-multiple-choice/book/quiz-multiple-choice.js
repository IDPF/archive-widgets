/*

IDPF ePub Widget Framework
MIT License
Demos: http://widgets.chaucercloud.com

*/
var epubWidget = epubWidget || {};

epubWidget.QuizMultipleChoice = new Class({
	Extends: epubWidget.AbstractWidget,
	CHAR_MAP: 'abcdefghijklmnopqrstuvwxyz0123456789',
	//DEFAULT OPTIONS
	options: {
		container:undefined,
		qAttr:'data-que',
		optAttr: 'data-option',
		qSetAttr:'data-que-set',
		answerAttr: 'data-answer',
		correctMsgAttr: 'data-que-correct-text',
		incorrectMsgAttr: 'data-que-incorrect-text',
		correctClass: 'correctAnswer',
		incorrectClass: 'incorrectAnswer',
		selectedClass: 'selectedAnswer',
		multiAnswer: 'data-multi-answer',
		totalQuestions: -1,
		persist: true,
		generateHTML: false,
		questionData: null,
		msgTimeout: 5000,
		inlineMsg: true,
		minHeight: '300px',
		correctMsg: 'Correct! You answered correctly. Good job.',
		incorrectMsg: 'Sorry! That is not the correct answer.'
	},
	initialize:function(el, options){
		options.correctMsg = options.questionData.correctMsg;
		options.incorrectMsg = options.questionData.incorrectMsg;

		this.parent("quiz-multiple-choice", $(el), options);

		if(this.options.generateHTML) {
			this.generateHTML(this.options.questionData);
		}

		this.flash = new epubWidget.util.Flash({position:"center", type:"info", time: this.options.msgTimeout});
		this.stores = {};
		this.quizSummaries = {};
		var questions = this.options.container.getElements('['+this.options.qAttr+']');
		this.totalCount = questions.length;
		if(this.options.totalQuestions<=0) { 
			this.options.totalQuestions = this.totalCount;
		}
		questions.each(function(questionEl) {
			this._setupQuestion(questionEl);
		}.bind(this));
	},
	showMessage: function(isSuccess, questionEl, msg){
		var msg = isSuccess ? this.options.correctMsg : this.options.incorrectMsg;
		if(this.options.inlineMsg) {
			var quizElParent = questionEl;
			//REmove if already has
			if(quizElParent.getElements('.inline-message')) {
				quizElParent.getElements('.inline-message').destroy();
			}
			var cls = isSuccess?'quiz-correct':'quiz-incorrect';
			var msgEl = new Element("blockquote", {'class':"inline-message epub__inline-message " + cls + " epub__"+cls});
			var innerMsgEl = new Element('small');
			innerMsgEl.set('text', msg);
			msgEl.adopt(innerMsgEl);
			quizElParent.adopt(msgEl);
			setTimeout(function(){msgEl.destroy()}, this.options.msgTimeout);
		} else {
			if(isSuccess) {
				this.flash.show(msg);
			} else {
				this.flash.show(msg, 'error');
			}
		}
	},
	generateHTML: function(questionData){
		var self = this;
		this.el.empty();
		var quizWrapperEl = new Element('ol', {'class':'quiz-wrapper', styles: { 'min-height': this.options.minHeight } });
		var addOption = function(option, i, optContainer){
			var optEl = new Element('li', {
				'html': '<span class="order">'+self.CHAR_MAP.charAt(option.order-1)+'</span> ' + option.text,
				'class':'question-option'
			});
			optEl.setAttribute(self.options.optAttr, option.order);

			if(option.correct) {
				optEl.setAttribute(self.options.answerAttr, 'true');
			}
			optContainer.adopt(optEl);
		};
		var addQuestion = function(question, i){
			var qEl = new Element('li', {
				'class':'question-wrapper'
			});
			qEl.setAttribute(self.options.mulitAnswer, true);
			qEl.setAttribute(self.options.qSetAttr, self.el.getAttribute('id')||'1');
			qEl.setAttribute(self.options.qAttr, i+"");

			qEl.setAttribute(self.options.correctMsgAttr, questionData.correctMsg);
			qEl.setAttribute(self.options.incorrectMsgAttr, questionData.incorrectMsg);

			var textEl = new Element('p', {
				html: '<span class="order">'+question.order+'</span> ' + question.text,
				'class': 'question-text'
			});
			qEl.adopt(textEl);

			var optContainerEl = new Element('ol', {
				'class': 'options-wrapper'
			});
			var i = 0;
			question.options.each(function(option) {
				i++;
				addOption(option, i, optContainerEl)
			});
			//Add options El to Question El.
			qEl.adopt(optContainerEl);
			//Put Question into Quiz
			quizWrapperEl.adopt(qEl);
		};
		
		var i=0;
		questionData.questions.each(function(question){
			i++;
			addQuestion(question, i);
		});
		//Put Quiz in EL
		this.el.adopt(quizWrapperEl);
		this.options.container = this.el;
	},
	isAnswered: function(store, qId){
		return store.has(qId) && store.get(qId).answered;
	},
	_setupQuestion: function(questionEl) {
		var qSet = questionEl.getAttribute(this.options.qSetAttr);
		var qId = questionEl.getAttribute(this.options.qAttr);
		var isMultiAnswer = questionEl.getAttribute(this.options.multiAnswer) || false;
		
		var optionsEl = questionEl.getElements('['+this.options.optAttr+']');
		optionsEl.each(function(optionEl) {
			this._setupOption(questionEl, optionEl, qSet, qId, isMultiAnswer);
		}.bind(this));
	},
	_setupOption: function(questionEl, optionEl, qSet, qId, isMultiAnswer) {
		var optionId = optionEl.getAttribute(this.options.optAttr);

		var store = this.stores[qSet];
		var quizSummary = this.quizSummaries[qSet];
		if(!store) {
			var storage = this.options.persist?"local":"memory";
			store = new epubWidget.storage.Local(qSet+"-store", { storage: storage });
			quizSummary = new epubWidget.QuizSummary(qSet, store, this.options.totalQuestions);
			this.stores[qSet] = store;
			this.quizSummaries[qSet] = quizSummary;
		}

		if(!this.isAnswered(store, qId)) {
			optionEl.addEvent('click', function(e){
				e.preventDefault();
				//If it is already answered
				if(this.isAnswered(store, qId)) { return; }
				var isCorrect = optionEl.hasAttribute('data-answer');
				if(isMultiAnswer) {
					this._handleMultiAnswerClick(store, optionEl, qId, optionId)
				} else {
					store.save(qId+"", {'answered': true, 'correct': isCorrect, 'optionId': optionId, 'multiAnswer': isMultiAnswer});
				}
				var answer = store.get(qId);
				this._setEl(optionEl, answer);
				this._showMsg(answer, questionEl, quizSummary);
			}.bind(this));
			
			//SETUP Half ticked Answers UI
			if(isMultiAnswer && store.has(qId)) {
				var ans = store.get(qId);
				if(ans.optionIds.contains(optionId)) {
					this._setEl(optionEl, ans);
				}
			}
		} else {
			console.log('already answered');
			var ans  = store.get(qId);
			if(ans.multiAnswer) {
				if(ans.optionIds.contains(optionId)) {
					this._setEl(optionEl, ans);
				}
			} else {
				if(optionId == ans.optionId) {
					this._setEl(optionEl, ans);
				}
			}
		}
	},
	_handleMultiAnswerClick: function(store, optionEl, qId, optionId){
		if(!store.has(qId)) {
			store.save(qId,
			 {'answered': false, 'correct': false, 'optionIds': [], 'multiAnswer': true});
		}
		
		var ans = store.get(qId);
		//If already selected
		if(ans.optionIds.contains(optionId)) {
			return;
		}
		ans.optionIds.push(optionId);
		ans.correct = this._isMultiAnswerCorrect(ans, qId);
		store.save(qId, ans);
		//Mark Answer as saved if required are ticked.
		if(this._isMultiAnswered(store, optionEl, qId)) {
			this._setMultiAnswerEl(ans, qId);
			var ans = store.get(qId);
			ans['answered']=true;
			store.save(qId, ans);
		}
	},
	_isMultiAnswerCorrect: function(answer, qId) {
		var answersEl = this.options.container.getElements('['+this.options.qAttr+'='+ qId +'] ['+this.options.answerAttr+'=true]');
		var optionIds = answersEl.map(function(answer) {
		 	return answer.getAttribute(this.options.optAttr);
		}.bind(this));
		return optionIds.every(function(optionId) {
			return answer.optionIds.contains(optionId);
		})
	},
	_isMultiAnswered: function(store, optionEl, qId) {
		var answersEl = this.options.container.getElements('['+this.options.qAttr+'='+ qId +'] ['+this.options.answerAttr+'=true]');		
		var ans = store.get(qId);
		return ans.optionIds.length == answersEl.length;
	},
	_showMsg: function(answer, questionEl, quizSummary) {
		//return is answer is not complete
		if(!answer.answered) {
			return;
		}

		var attr = this.options.incorrectMsgAttr;
		if(answer.correct) {
			attr = this.options.correctMsgAttr;
		}
		
		if(questionEl.hasAttribute(attr)) {
			this.showMessage(answer.correct, questionEl, questionEl.getAttribute(attr));
		} else {
			var msg = null;
			if(answer.correct) {
				msg = "You have " + quizSummary.getCorrectQCount() + " correct answer. Remaining: " + quizSummary.getRemainingQCount();
			} else {
				msg = 'You have ' + quizSummary.getIncorrectQCount() + ' incorrect answer' +
				 (quizSummary.getIncorrectQCount() > 1 ? 's' : '') + '. Remaining: ' + quizSummary.getRemainingQCount();				
			}
			this.showMessage(answer.correct, questionEl, msg);
		}
	},
	_setEl: function(el, ans) {
		if(ans.multiAnswer && !ans.answered) {
			el.addClass(this.options.selectedClass);
		} else if(ans.answered) {
			if(ans.correct){
				this.correctCount++;
			} else {
				this.incorrectCount++;
			}
			this._setOptionColor(el, ans.correct);
		}
	},
	_setMultiAnswerEl: function(answer, qId) {
		var answersEl = this.options.container.getElements('['+this.options.qAttr+'='+ qId +'] [class='+this.options.selectedClass+']');
		answersEl.each(function(answerEl) {
			answerEl.removeClass(this.options.selectedClass);
			this._setOptionColor(answerEl, answer.correct);
		}.bind(this));
	},
	_setOptionColor: function(el, isCorrect) {
		var clasName = isCorrect?this.options.correctClass:this.options.incorrectClass;
		el.addClass(clasName);
	}
	
});

epubWidget.QuizSummary = new Class({
	initialize: function(qSet, quizStore, totalQuestions){
		this.quizStore = quizStore;
		this.totalQuestions = totalQuestions;
		this.store = new epubWidget.storage.Local(qSet +"-summary", { session: true });
		this.store.save('totalQuestions', this.totalQuestions);
	},
	getTotalQCount: function(){
		return parseInt(this.store.get('totalQuestions'));
	},
	getCorrectQCount: function(){
		return this._processAndCount(function(q) {
			return q.answered && q.correct
		});
	},
	getIncorrectQCount: function(){
		return this._processAndCount(function(q) {
			return q.answered && !q.correct
		});
	},
	getAnsweredQCount: function(){
		return this._processAndCount(function(q) {
			return q.answered;
		})
	},
	getRemainingQCount: function(){
		return this.getTotalQCount() - this.getAnsweredQCount();
	},
	_processAndCount: function(validateMethod){
		var count = 0;
		Object.each(this.quizStore.getAll(), function(q){
			if(validateMethod(q)) {
				count++;
			}
		});
		return count;
	}
});