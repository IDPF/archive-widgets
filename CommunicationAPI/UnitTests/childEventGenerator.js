(function () {

	function generateTouchEvents() {
	};

	
	function generateMouseEvents(n) {
		var intervalId;
		var counter = 0;
		function generateMouseEvent() {
			if (counter === n)
			{
				window.clearInterval(intervalId);
				wapi.publish("end", counter);
			}
			var event = new MouseEvent('click', {
				'view': window,
				'bubbles': true,
				'cancelable': true
			});

			window.dispatchEvent(event);
			counter++;
		};
		
		intervalId = window.setInterval(generateMouseEvent, 10);
	};

	function generatePointerEvents() {	
	};

	window.generateWidgetEvents = function(n) {
		if (goog.userAgent)
		{
			if (goog.userAgent.MOBILE)
			{
				generateTouchEvents(n);
				// TODO: add pointer events
			}
			else
			{
				generateMouseEvents(n);
			}
		}
	};
	
})();
	 