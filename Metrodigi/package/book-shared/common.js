/*

IDPF ePub Widget Framework
MIT License
Demos: http://widgets.chaucercloud.com

*/
var epubWidget = epubWidget || {};
epubWidget.AbstractWidget = new Class({
	Implements: [Events, Options],
	initialize: function(widgetName, el, options){
		this.name = widgetName;
		this.el = el;
		$(this).addClass('epubWidget-widget');
		$(this).addClass('epubWidget-'+widgetName);
		this.setOptions(options);
	},
	toElement: function(){
		return this.el;
	}
});


epubWidget.util = epubWidget.util || {};
epubWidget.util.Flash = new Class({
	Implements: [Options, Events],
	//DEFAULT OPTIONS
	options: {
		containerSelector:'body', //Will use first element
		type:'info', // One of 'error', 'success', 'info', 'warning'
		time: 5000,
		position: 'top' // One of 'top', 'center', 'bottom',
	},
	initialize:function(options){
		this.setOptions(options);
	}, 
	show: function(msg, type){
		if(!type) {
			type= this.options.type;
		}
		if (this.flashDiv) this.destroy();
		
		this.flashDiv = new Element('div', {
			'class': 'alert-message flash'
			,'styles': { 'width':this.options.width }
		}).inject($$(this.options.containerSelector)[0]);
		
		this.flashDiv.addClass(type);
		this.flashDiv.show().innerHTML += '<p>' +  msg + '</p>';
		
		if(this.options.position == 'center') {
			this._center(this.flashDiv);
		}
		clearTimeout(this.flashTimer);
		this.flashTimer = this.destroy.bind(this).delay(this.options.time);
	},
	_center: function(div) {
	},
	destroy: function(){
		if(this.flashDiv) {
			this.flashDiv.destroy();
    		this.flashDiv = null;
		}
	}
});

/*
Allows storing data into Local or Session storage
*/
epubWidget.storage = epubWidget.storage || {};
epubWidget.storage.MemoryStorage = new Class({
	data: null,
	initialize: function(){
		this.data = {};
	},
	setItem: function(key, value){
		this.data[key] = value;
	},
	getItem: function(key){
		return this.data[key];
	}
});

epubWidget.storage.Local = new Class({
	Implements: [Options, Events],
	//DEFAULT OPTIONS
	options: {
		//DEPERECATED
		session:false,
		storage: null //Either memory, session, local
	},
	MAP: {
		memory: new epubWidget.storage.MemoryStorage(),
		session: window.sessionStorage,
		local: window.localStorage
	},
	initialize:function(name, options){
		if(typeOf(name) != "string") {
			throw('name must be string, found: ' + key);
		}
		this.name = name;
		this.setOptions(options);
		if(this.options.storage) {
			this.storage = this.MAP[this.options.storage];
		} else {
			//DEPRECATED SUPPORT
			if(this.options.session) {
				this.storage = window.sessionStorage;
			} else {
				this.storage = window.localStorage;
			}
		}
	},
	save:function(key, value) {
		var obj = this._get();
		obj[key] = value;
		this._persist(obj);
	},
	remove: function(key) {
		var obj = this._get();
		delete obj[key];
		this._persist(obj);
	},
	get: function(key) {
		var obj = this._get();
		if(obj==undefined || obj == null) { obj = {}; }
		return obj[key];
	},
	has: function(key) {
		var val = this.get(key);
		return !(val==null || val ==undefined);
	},
	getAll: function(){
		return this._get();
	},
	clear: function(){
		this._persist({});
	},
	_get: function(){
		var item = this.storage.getItem(this.name)
		if(!item) {
			return {};
		}
		var resp = JSON.parse(item);
		return resp || {};
	},
	_persist: function(obj) {
		this.storage.setItem(this.name, JSON.stringify(obj));
	}
});