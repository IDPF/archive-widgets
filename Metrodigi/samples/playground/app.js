/*

IDPF ePub Widget Framework
MIT License
Demos: http://widgets.chaucercloud.com

*/

(function(){
	window.randStr = function(len){
		return (function(){g=function(){c='0123 4567 89ab cde fghi jklmn opqrstuvwxy zAB CDEFG HIJKLM NOPQR STUVWXYZ';p='';for(i=0;i<len;i++){p+=c.charAt(Math.floor(Math.random()*62));}return p;};p=g();while(!/[A-Z]/.test(p)||!/[0-9]/.test(p)||!/[a-z]/.test(p)){p=g();}return p;})()
	}

	
	var MODEL = {
		'audio': {
			jsString: "new epubWidget.Audio($('sample'), 'http://www.tonycuffe.com/mp3/cairnomount.mp3', {});"
		},
		'video': {
			jsString: "new epubWidget.Video($('sample'), 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4', {posterImageUrl: 'http://placehold.it/350x150', altText:'Sample alt text', autoPlay: false, subtitles: '../shared/sample.vtt'});"
		},
		'text-resizer': {
			jsString: "new epubWidget.TextResizer($('sample'), {target: $('sample-content')});"
		},
		'gallery': {
			jsString: 'new epubWidget.Gallery($("sample"),{options:{"delay":4000,"autoplay":false,"transition":"fade"}},undefined,' +
				'{"size":{"height":"450","width":"250"},"images":[' + 
					'{"id":"89437","src":"http://placehold.it/350x300?v=1369317434333"}, {"id":"89436","src":"http://placehold.it/350x301?v=1369317434332"},' +
					'{"id":"89436","src":"http://placehold.it/350x302?v=1369317434332"}, {"id":"89436","src":"http://placehold.it/350x303?v=1369317434332"}],' +
					'"thumbnails":false,"clickToNext":true})'
		},
		'scrolling-sidebar': {
			jsString: "new epubWidget.ScrollingSidebar($('sample'), {header: 'This is header', footer: 'this is footer', content:randStr(1444), width: 200, height: 400});"
		},
		'quiz-multiple-choice': {
			jsString: 'new epubWidget.QuizMultipleChoice($("sample"),{"persist":false,"generateHTML":true,"questionData":' +
				'{"correctMsg":"Correct! You answered correctly. Good job.","incorrectMsg":"Sorry! This is not the correct answer.","questions":' + 
				'[{"text":"This is Q2","options":[{"text":"o2","correct":true,"order":1},{"text":"o1","correct":false,"order":2}],"order":1},{"text":"This is new Q1","options":[{"text":"o3","correct":false,"order":1},' + 
				'{"text":"O1","correct":false,"order":2},{"text":"o2","correct":true,"order":3}],"order":2}]}})'
		},
		'popup': {
			jsString: "new epubWidget.Popup($('sample'), '<p>Popup with close btn <br/> Lorem ipsum blah blah bla....</p>' ," +
				"{'title':'Test title', 'size':{width: 500, height:300}, closeBtn: true});",
			content: "Click here to open Popup"
		}
	};

	document.addEvent('domready' ,function(){
		var CodeView = new Class({
			Implements: [Events],
			initialize: function(el) {
				this.el = el;
				this.el.getElement('button.preview').addEvent('click', function(){
					if(!this.widgetKey) {
						return;
					}

					this.fireEvent("previewClicked", [this.widgetKey, this.el.getElement('#code').get('text')]);
				}.bind(this))
			},
			setView: function(widgetKey){
				this.widgetKey = widgetKey;
				this.el.getElement('#code').set('text', MODEL[widgetKey].jsString);
			}
		});
		var PreviewView = new Class({
			initialize: function(el){
				this.el = el;
			},
			preview: function(widgetKey, code) {
				var widget = MODEL[widgetKey];
				this.el.empty();
				this.el.adopt(new Element('div', {id: 'sample', 'class': 'widget-space', html: widget.content}));
				this.el.adopt(new Element('div', {
					id: 'sample-content', 'class': 'content', 
					'html': "This is sample content for widget demo. This is sample content for widget demo. This is sample content for widget demo. " + 
					"<br/>This is sample content for widget demo. This is sample content for widget demo. This is sample content for widget demo."}));

				var codeJs = code || widget.jsString;

				try {
					window.eval(codeJs);	
				} catch(e) {
					alert('Error in running widget code');
				}
				
			}
		})

		var WidgetList = new Class({
			Implements: [Events],
			initialize: function(el, model) {
				this.el = el;
				this.model = model;
				this.render();
			},
			render: function(){
				this.el.empty();
				Object.keys(this.model).each(function(widgetName){
					this.el.adopt(this.createEntry(widgetName));
				}.bind(this));

				var entries = this.el.getElements('.widget-entry');
				entries.addEvent("click", function(e){
					entries.removeClass("active");
					e.target.addClass("active");
					this.fireEvent('widgetSelected', e.target.get('html'));
				}.bind(this))
			},
			createEntry: function(widgetName){
				var entryEl = new Element('a', {html: widgetName, 'class': 'widget-entry list-group-item'});
				return entryEl;
			}
		});


		var codeView = new CodeView($("code-view"));
		var previewView = new PreviewView($("preview-view"));
		var widgetList = new WidgetList($('widget-list'), MODEL);
		widgetList.addEvent('widgetSelected', function(widgetKey) {
			codeView.setView(widgetKey);
			previewView.preview(widgetKey);
		});

		codeView.addEvent('previewClicked', function(widgetKey, code) {
			previewView.preview(widgetKey, code);
		});
	})

})()