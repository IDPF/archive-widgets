/*

IDPF ePub Widget Framework
MIT License
Demos: http://widgets.chaucercloud.com

*/
Class.refactor(Drag,{
	attach: function(){
		this.handles.addEvent('touchstart', this.bound.start);
		return this.previous.apply(this, arguments);
	},

	detach: function(){
		this.handles.removeEvent('touchstart', this.bound.start);
		return this.previous.apply(this, arguments);
	},

	start: function(event){
		document.body.addEvents({
			touchmove: this.bound.check,
			touchend: this.bound.cancel
		});
		this.previous.apply(this, arguments);
	},

	check: function(event){
		if (this.options.preventDefault) event.preventDefault();
		var distance = Math.round(Math.sqrt(Math.pow(event.page.x - this.mouse.start.x, 2) + Math.pow(event.page.y - this.mouse.start.y, 2)));
		if (distance > this.options.snap){
			this.cancel();
			this.document.addEvents({
				mousemove: this.bound.drag,
				mouseup: this.bound.stop
			});
			document.body.addEvents({
				touchmove: this.bound.drag,
				touchend: this.bound.stop
			});
			this.fireEvent('start', [this.element, event]).fireEvent('snap', this.element);
		}
	},

	cancel: function(event) {
		document.body.removeEvents({
			touchmove: this.bound.check,
			touchend: this.bound.cancel
		});
		return this.previous.apply(this, arguments);
	},

	stop: function(event){
		document.body.removeEvents({
			touchmove: this.bound.drag,
			touchend: this.bound.stop
		});
		return this.previous.apply(this, arguments);
	}
});