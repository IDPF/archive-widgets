/*

IDPF ePub Widget Framework
MIT License
Demos: http://widgets.chaucercloud.com

*/
(function(){
var Loop = new Class({

	loopCount: 0,
	isLooping: false,
	loopMethod: function(){},

	setLoop: function(fn, delay){
		wasLooping = this.isLooping;
		if (wasLooping) this.stopLoop();
		this.loopMethod = fn;
		this.loopDelay = delay || 3000;
		if (wasLooping) this.startLoop();
		return this;
	},

	stopLoop: function(){
		this.isLooping = false;
		clearInterval(this.periodical);
		return this;
	},

	startLoop: function(delay, now){
		if (!this.isLooping){
			this.isLooping = true;
			if (now) this.looper();
			this.periodical = this.looper.periodical(delay || this.loopDelay, this);
		};
		return this;
	},

	resetLoop: function(){
		this.loopCount = 0;
		return this;
	},

	looper: function(){
		this.loopCount++;
		this.loopMethod(this.loopCount);
		return this;
	}

});

var Gallery = this.Gallery = new Class({

	Implements: [Options, Events, Loop],

	options: {
		delay: 7000,
		transition: 'crossFade',
		duration: 500,
		autoplay: false,
		dataAttribute: 'data-gallery',
		selector: '> *',
		initialSlideIndex: 0
	},

	transitioning: false,
	reversed: false,

	initialize: function(element, options, noSetup){
		this.element = document.id(element);
		this.setOptions(options);
		if (!noSetup) this.setup();
	},

	setup: function(options){
		if (options) this.setOptions(options);
		this.slides = this.element.getElements(this.options.selector);
		this.setupElement().setupSlides();
		this.current = this.current || this.slides[this.options.initialSlideIndex];
		this.index = this.current.retrieve('gallery-index');
		this.setLoop(this.show.pass(this.reversed ? 'previous' : 'next', this), this.options.delay);
		if (this.options.autoplay) this.play();
		return this;
	},

	show: function(slide, options){
		if (slide == 'next' || slide == 'previous') slide = this[slide + 'Slide']();
		if (typeof slide == 'number') slide = this.slides[slide];
		if (slide == this.current || this.transitioning) return this;

		this.transitioning = true;
		this.current.store('gallery:oldStyles', this.current.get('style'));

		var transition = (options && options.transition) ? options.transition : slide.retrieve('gallery-transition'),
			duration = (options && options.duration) ? options.duration : slide.retrieve('gallery-duration'),
			previous = this.current.setStyle('z-index', 1),
			next = this.reset(slide).setStyle('z-index', 0),
			nextIndex = this.index = next.retrieve('gallery-index')
			slideData = {
				previous: { element: previous, index: previous.retrieve('gallery-index') },
				next: { element: next, index: nextIndex }
			};

		this.fireEvent('show', slideData);

		Gallery.transitions[transition]({
			previous: previous,
			next: next,
			duration: duration,
			instance: this
		});

		previous.setStyle('width', 0);
		(function(){
			previous.setStyle('visibility', 'hidden');
			this.fireEvent('showComplete', slideData);
			this.transitioning = false;
		}).bind(this).delay(duration);

		this.current = next;
		return this;
	},

	play: function(){
		this.startLoop();
		this.fireEvent('play');
		return this;
	},

	pause: function(){
		this.stopLoop();
		this.fireEvent('pause');
		return this;
	},

	reverse: function(){
		this.setLoop(this.show.pass(this.reversed ? 'next' : 'previous', this), this.options.delay);
		this.reversed = !this.reversed;
		this.fireEvent('reverse');
		return this;
	},

	setupElement: function(){
		this.storeData(this.element);
		this.options.duration = this.element.retrieve('gallery-duration');
		this.options.transition = this.element.retrieve('gallery-transition');
		this.options.delay = this.element.retrieve('gallery-delay');
		if (this.element.getStyle('position') == 'static') this.element.setStyle('position', 'relative');
		return this;
	},

	setupSlides: function(){
		this.slides.each(function(slide, index){
			slide.store('gallery-index', index).store('gallery:oldStyles', slide.get('style'));
			this.storeData(slide);
			slide.setStyle('visibility', (this.current || index == this.options.initialSlideIndex) ? '' : 'hidden');
			if (!this.current && index !== this.options.initialSlideIndex) {
				slide.setStyle('width', 0);
			}
		}, this);
		return this;
	},

	storeData: function(element){
		var ops = this.options;
		// default options
		element.store('gallery-transition', ops.transition);
		element.store('gallery-duration', ops.duration);
		if (element == this.element) element.store('gallery-delay', ops.delay);
		// override from data attribute
		var data = element.get(this.options.dataAttribute);
		if (!data) return this;
		Slick.parse(data).expressions[0].each(function(option){
			element.store('gallery-' + option.tag, option.pseudos[0].key);
		});
		return this;
	},

	reset: function(slide){
		return slide.set('style', slide.retrieve('gallery:oldStyles'));
	},

	nextSlide: function(){
		return this.slides[this.index + 1] || this.slides[0];
	},

	previousSlide: function(){
		return this.slides[this.index - 1] || this.slides.getLast();
	},

	toElement: function(){
		return this.element;
	}

});

Gallery.transitions = {};

Gallery.defineTransition = function(name, fn){
	Gallery.transitions[name] = fn;
};

Gallery.defineTransitions = function(transitions){
	Object.each(transitions, function(item, index){
		Gallery.defineTransition(index, item);
	});
};

})();

// element extensions

Element.Properties.gallery = {

	set: function(options){
		this.get('gallery').setup(options);
		return this;
	},

	get: function(){
		var instance = this.retrieve('gallery');
		if (!instance){
			instance = new Gallery(this, {}, true);
			this.store('gallery', instance);
		}
		return instance;
	}

};

Element.implement({

	playGallery: function(options){
		this.get('gallery').setup(options).play();
		return this;
	},

	pauseGallery: function(){
		this.get('gallery').pause();
		return this;
	}

});

// 19 transitions :D
Gallery.defineTransitions({

	none: function(data){
		data.previous.setStyle('display', 'none');
		return this;
	},

	fade: function(data){
		data.previous.set('tween', {duration: data.duration}).fade('out');
		return this;
	},

	crossFade: function(data){
		data.previous.set('tween', {duration: data.duration}).fade('out');
		data.next.set('tween', {duration: data.duration}).fade('in');
		return this;
	},

	fadeThroughBackground: function(data){
		var half = data.duration / 2;
		data.next.set('tween', {duration: half}).fade('hide');
		data.previous.set('tween',{
			duration: half,
			onComplete: function(){ data.next.fade('in'); }
		}).fade('out');
		return this;
	}

});

(function(){

	function getStyles(direction){
		return {
			property: (direction == 'left' || direction == 'right') ? 'left' : 'top',
			inverted: (direction == 'left' || direction == 'up') ? 1 : -1
		};
	}

	function go(type, styles, data){
		var tweenOptions = {duration: data.duration, unit: '%'};
		if (type == 'blind') {
			data.next.setStyle('z-index', 2);
		}
		if (type != 'slide') {
			data.next
				.set('tween', tweenOptions)
				.setStyle(styles.property, 100 * styles.inverted + '%');
			data.next.tween(styles.property, 0);
		}
		if (type != 'blind'){
			data.previous
				.set('tween', tweenOptions)
				.tween(styles.property, -(100 * styles.inverted));
		}
	}

	['left', 'right', 'up', 'down'].each(function(direction){

		var capitalized = direction.capitalize(),
			blindName = 'blind' + capitalized,
			slideName = 'slide' + capitalized;

		[
			['push' + capitalized, (function(){
				var styles = getStyles(direction);
				return function(data){
					go('push', styles, data);
				}
			}())],

			[blindName, (function(){
				var styles = getStyles(direction);
				return function(data){
					go('blind', styles, data);
				}
			}())],

			[slideName, (function(){
				var styles = getStyles(direction);
				return function(data){
					go('slide', styles, data);
				}
			}())],

			[blindName + 'Fade', function(data){
				this.fade(data)[blindName](data);
				return this;
			}]
		].each(function(transition){
			Gallery.defineTransition(transition[0], transition[1]);
		});
	});

})();


var epubWidget = epubWidget || {};
epubWidget.Gallery = new Class({
	Extends: epubWidget.AbstractWidget,
	//DEFAULT OPTIONS
	options: {
		images:null,
		thumbnails: false,
		size: null,
		clickToNext: false
	},
	initialize:function(el, slideShowInfo, sliderInfo, options){
		this.parent("gallery", $(el), options);

		if(this.options.images) {
			var mainImageOuter = new Element('div', {'class': 'main-image-outer'});
			//var mainImageInner = new Element('div', {'class': 'main-image-inner'});
			slideShowInfo.el = new Element('div', {'class': 'main-image-inner'});

			mainImageOuter.adopt(slideShowInfo.el);
			//mainImageInner.adopt(slideShowInfo.el);

			this.el.empty();
			this.options.images.each(function(img){
				var wrapperEl = new Element('div', {'class':'slide-wrapper wraptocenter'});
				var slideWrapperHeight = this.options.thumbnails?this.options.size.height - 90:this.options.size.height;
				if(this.options.size) {
					wrapperEl.setStyles({
						width: this.options.size.width + "px",
						height: slideWrapperHeight + "px"
					})
				}
				var imgEl = new Element('img', {src: img.src});
				wrapperEl.adopt(new Element('span'));
				wrapperEl.adopt(imgEl);
				slideShowInfo.el.adopt(wrapperEl);
			}.bind(this));
			this.el.adopt(mainImageOuter);
		}
		if(this.options.size) {
			this.el.setStyles({
				width: this.options.size.width + "px",
				height: this.options.size.height + "px"
			});
		}

		if(this.options.thumbnails) {
			this.appendThumbnails(slideShowInfo.el);
			this.el.getElements('.main-image-outer').setStyle('height', this.el.getHeight()-90);			
		}
		

		this.gallery = new Gallery(slideShowInfo.el, slideShowInfo.options);

		if(this.options.clickToNext) {
			this.el.addEvent('click', function(e){
				e.preventDefault();
				this.gallery.show('next');
			}.bind(this))
		}
		$(this.gallery).addEvents({
			swipe: function(event){
				gallery['show' + ((event.direction == 'left') ? 'Next' : 'Previous')]({
					transition: 'blind' + event.direction.capitalize() 
				});
			}.bind(this),
			mousedown: function(event){
				event.stop();
			}
		});

		if(sliderInfo) {
			this.slider = new Slider(sliderInfo.el, sliderInfo.knob, sliderInfo.options);
			this.slider.addEvent('change',function(pos){
				this.current = pos;
				console.log('slider moved ' + pos);
				if(this.gallery.slides.length <= pos) {
					return;
				}
				this.gallery.show(pos);
			}.bind(this));
		}
	},
	appendThumbnails: function(el){
		var thumbWrapOuter = new Element('div', {'class':'thumb-wrapper-outer'});
		var thumbWrapInner = new Element('div', {'class':'thumb-wrapper-inner'});
		
		thumbWrapOuter.adopt(thumbWrapInner);

		var images = this.el.getElements('img');

		images.each(function(img, i){
			thumbWrapInner.adopt(
				new Element('img', {
					src: img.getAttribute('src'), 'data-pos':i
				})
			);
		});
		
		thumbWrapInner.getChildren().addEvent('click', function(e){
			e.preventDefault();
			this.gallery.show(parseInt(e.target.getAttribute('data-pos')));
		}.bind(this));

		this.el.adopt(thumbWrapOuter);
	}
});