(function () {

    function generateTouchEvents() {
    };


    function generateMouseEvents(n) {
        var intervalId;
        var counter = 1;

        function generateMouseEvent() {
            if (counter === n)
            {
                window.clearInterval(intervalId);
                window.setTimeout(function () {
                    wapi.publish("end", counter);
                }, 100);
            }
            var event = new MouseEvent("click", {
                "view": window,
                "bubbles": true,
                "cancelable": true
            });

            window.dispatchEvent(event);
            counter++;
        };

        intervalId = window.setInterval(generateMouseEvent, 10);
    };

    function generatePointerEvents() {
    };

    window.generateWidgetEvents = function (n) {
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
	 