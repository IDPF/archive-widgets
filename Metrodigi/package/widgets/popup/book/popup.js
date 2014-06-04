/*

IDPF ePub Widget Framework
MIT License
Demos: http://widgets.chaucercloud.com

*/
var epubWidget = epubWidget || {};
epubWidget.Popup = new Class({
	Extends: epubWidget.AbstractWidget,
	options: {
		closeBtn: false,
		closeBtnText: 'Close',
		//allowed options are 'relative','fixed'
		position: 'fixed', 
		alignment: 'topLeft'
	},

	initialize: function(ele, html, options){
		this.parent('popup', ele, options);
		if(typeOf(html) == 'string') {
			this.popupEl = Elements.from(html);
		} else {
			this.popupEl = html;
		}
		this.el.addEvent('click', this.show.bind(this));
	},
	createModal: function () {
		// Setup the modal elements.
		var modal = new Element('div', {'class':'epubWidget-modal'}),
			mask = new Mask(document.body, {
				'class': 'epubWidget-mask',
				destroyOnHide: false,
				width: '100%', height:'100%'
			}),
			close = function () {
				// Pause any playing media elements.
				modal.getElements('video, audio').each(function (el) {
					el.pause();
				});
				modal.hide();
				mask.hide();
			},
			closeAndStop = function (e) {
				var ev = e || event;
				close();
				ev.preventDefault();
			};

		mask.addEvent('hide', closeAndStop);
		mask.addEvent('click', closeAndStop);
		this.el.addEvent('click:relay(.close)', closeAndStop);

		if (this.options.size) {
			modal.setStyles({
				"width" : this.options.size.width+"px"
			});
		}

		$(mask).setStyle('position', 'fixed');

		//Populate modal
		var modalTitle = null;
		if (this.options.title && this.options.title.length > 0) {
			modalTitle = new Element('div', {'class':'modal-header'});
			modalTitle.adopt(new Element('h4', {text: this.options.title}));
			modal.adopt(modalTitle);
		}

		var modalBody = new Element('div', {'class':'modal-body'});
		modalBody.setStyle('height', this.options.size.height + "px");
		modalBody.adopt(this.popupEl);
		modal.adopt(modalBody);

		if (this.options.closeBtn) {
			var modalFooter = new Element('div', {'class':'modal-footer'});
			modal.adopt(modalFooter);

			var closeEl = new Element('a', {'class':'modal-close btn primary', 'text': this.options.closeBtnText});
			closeEl.addEvent('click', close);
			modalFooter.adopt(closeEl);
		}

		modal.inject(document.body, 'top').hide();

		if (this.options.position == 'fixed') {
			modal.position(this.options.pos || {});
		} else {
			var getRelativePos = function (alignment) {
				if (alignment == 'topLeft') { return 'bottomRight'; }
				else if (alignment == 'topRight') { return 'bottomLeft'; }
				else if (alignment == 'bottomLeft') { return 'topRight'; }
				else { return 'topLeft'; }
			};
			modal.position({
				relativeTo: e.target,
				position: getRelativePos(this.options.alignment),
				edge: this.options.alignment
			});
		}

		this.modal = modal;
		this.mask = mask;
	},
	show: function (e) {
		// Lazily build and add the modal DOM on first attempt to show.
		if (this.modal === undefined) {
			this.createModal();
		}
		e.preventDefault();
		this.mask.show();
		this.modal.show();
		this.el.fireEvent('popupVisible', this);
	}
});
