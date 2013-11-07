/*

IDPF ePub Widget Framework
MIT License
Demos: http://widgets.chaucercloud.com

*/
var epubWidget= epubWidget || {};
epubWidget.TextResizer = new Class({
	Extends: epubWidget.AbstractWidget,
	INVALID_TAGS: ['AUDIO', 'VIDEO', 'IMG', 'BR', 'HR'],
	options: {
		target: null,
		defaultSize: 12,
		incrementPerc: 10,
		widgetContainerClass: 'text-zoom-controls', 
		widgetZoomInClass: 'zoom-in',
		widgetZoomOutClass: 'zoom-out',
		widgetZoomResetClass: 'zoom-reset',
		createEl: true
	},
	originalSize: undefined,
	initialize: function(ele, options){
		this.parent("text-resizer", ele, options);
		
		this.target = document.body;
		if(this.options.target) {
			this.target = this.options.target;
		};

		if(this.options.createEl) {
			var mainEl = new Element('ul', {'class': this.options.widgetContainerClass});
			var zoomInEl = new Element('li', {text: '+', 'class': this.options.widgetZoomInClass + " zoom-action"});
			var zoomOutEl = new Element('li', {text: '-', 'class': this.options.widgetZoomOutClass + " zoom-action"});
			var zoomResetEl = new Element('li', {text: '0', 'class': this.options.widgetZoomResetClass + " zoom-action"});
			var clearEl = new Element('div', {'style': 'clear: both'});
			mainEl.adopt(zoomInEl, zoomOutEl, zoomResetEl, clearEl);
			this.el.empty();
			this.el.adopt(mainEl);
		} else {
			mainEl = this.el.getElements('.'+this.options.widgetContainerClass);
			zoomInEl = this.el.getElements('.'+this.options.widgetZoomInClass);
			zoomOutEl = this.el.getElements('.'+this.options.widgetZoomOutClass);
			zoomResetEl = this.el.getElements('.'+this.options.widgetZoomResetClass);
		}

		zoomInEl.addEvent('click', function(e){
			e.preventDefault();
			this.changeFontSize(this.target, true);
		}.bind(this));
		
		zoomOutEl.addEvent('click', function(e){
			e.preventDefault();
			this.changeFontSize(this.target, false);
		}.bind(this));
		
		zoomResetEl.addEvent('click', function(e){
			e.preventDefault();
			this.resetFontSize(this.target);
		}.bind(this));
	},
	resetFontSize: function(textEl){
		var oriSize = textEl.getAttribute('data-ori-font-size');
		if(oriSize) {
			console.log('Changed to original size: ' + oriSize + ", el:", textEl);
			textEl.setStyle('font-size', oriSize);
		}
		textEl.getChildren().each(function(el) {
			this.resetFontSize(el);
		}.bind(this));
	},
	changeFontSize:function(textEl, increase){
		var isInvalid = this.INVALID_TAGS.contains(textEl.tagName);
		//CALCULATE FOR CHILD
		textEl.getChildren().each(function(el) {
			this.changeFontSize(el, increase);
		}.bind(this))

		if(isInvalid) {
			return;
		}

		var fontSize =  oriSize = textEl.getStyle('font-size');
		//Save original Size
		if(!textEl.hasAttribute('data-ori-font-size')) {
			textEl.setAttribute('data-ori-font-size', fontSize);
		}

		var unit = '%';
		if(fontSize.indexOf('%')>=0) {
			fontSize = fontSize.substr(0, fontSize.length - 1);
		} else {
			//every other unit is 2 char.
			unit = fontSize.substr(fontSize.length - 2, fontSize.length);
			fontSize = fontSize.substr(0, fontSize.length - 2);
		}

		fontSize = parseFloat(fontSize);
		var sizeChangeVal = fontSize*this.options.incrementPerc / 100;
		if(increase) {
			fontSize = fontSize + sizeChangeVal;	
		} else {
			fontSize = fontSize - sizeChangeVal;	
		}
		
		textEl.setStyle('font-size', fontSize + unit);
		console.log('changed size to ' + (fontSize + unit) + " from " + oriSize +  ", el:", textEl);
		
	}
});