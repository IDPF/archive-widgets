/*

IDPF ePub Widget Framework
MIT License
Demos: http://widgets.chaucercloud.com

*/
var epubWidget= epubWidget || {};
epubWidget.Video = new Class({
	Extends: epubWidget.AbstractWidget,
	
	options: {
		autoPlay: true,
		controlsVisible: true,
		loop: false,
		posterImageUrl: null,
		altText: null
	},
	initialize: function(containerEl, url, options){
		if(!containerEl) {
			throw("Container Element needs to be specified.")
		}
		if(!url) {
			throw("URL(s) needs to be specified.")
		}
		
		this.parent("video", containerEl, options);
		this.url = url;
		this._buildDOM(containerEl);
	},
	_buildDOM: function(containerEl){
		var videoOptions = {};
		if(this.options.autoPlay) {
			videoOptions.autoplay = "autoplay";
		}
		if(this.options.controlsVisible) {
			videoOptions.controls = "controls";
		}
		if(this.options.loop) {
			videoOptions.loop = true;
		}
		if(this.options.altText) {
			videoOptions.alt = this.options.altText;
		}
		if(this.options.posterImageUrl) {
			videoOptions.poster = this.options.posterImageUrl;
		}
		var videoEl = new Element('video', videoOptions);

		var sources = typeOf(this.url)=='array'?this.url:[this.url];
		sources.each(function(source){
			videoEl.adopt(new Element('source', {src: source}));
		}.bind(this));

		containerEl.adopt(videoEl);
	}
});