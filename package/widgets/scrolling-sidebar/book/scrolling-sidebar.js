/*

IDPF ePub Widget Framework
MIT License
Demos: http://widgets.chaucercloud.com

*/
var epubWidget= epubWidget || {};
epubWidget.ScrollingSidebar = new Class({
	Extends: epubWidget.AbstractWidget,
	options: {
		header: null,
		footer: null,
		content: null,
		width: null
	},
	
	initialize: function(ele, options){
		this.parent("scrolling-sidebar", ele, options);
		ele.empty();
		
		var clsAppend = (this.options.header?'sb-header':'') + (this.options.footer?' sb-footer':'')
		var tbody = new Element('div', {
			'class':'sidebar-widget ' + clsAppend
		});
		
		//add header
		if(this.options.header && this.options.header.length>0) {
			tbody.adopt(this.addTr(this.options.header, 'header', 'sb-gradient', 'h4'));
		}
		
		//add content
		tbody.adopt(this.addTr(this.options.content, 'content', ''));

		//add footer
		if(this.options.footer && this.options.footer.length>0) {
			tbody.adopt(this.addTr(this.options.footer, 'footer', 'sb-gradient', 'h5'));
		}

		// Set the height of the container
		this.el.setStyles({
			'height': this.options.height + 'px',
			'width': this.options.width + 'px'
		});
		this.el.adopt(tbody);
	},
	addTr: function(data, type, cls, innerElementType){
		innerElementType = innerElementType || 'div';
		var td = new Element('div', {'class': 'sidebar-'+type});
		var div = new Element(innerElementType, {
			'class': 'sb-inner ' + cls,
			'html': data
		});
		td.adopt(div);
		return td;
	}
});