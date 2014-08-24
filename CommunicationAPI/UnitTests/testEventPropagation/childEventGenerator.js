(function () {

    function generatePointerEvents(n) {
        var intervalId;
        var counter = 1;

        function generatePointerEvent() {
            if (counter === n)
            {
                window.clearInterval(intervalId);
                window.setTimeout(function () {
                    wapi.publish("end", counter);
                }, 100);
            }


            var event = document.createEvent('PointerEvent');

            /* the single dumbest function call i have ever seen */
            event.initPointerEvent(
                "pointermove", /* typeArg [in]Type: DOMString */
                true, /* canBubbleArg [in]Type: boolean */
                true, /* cancelableArg [in]Type: boolean */
                window, /* viewArg [in]Type: AbstractView */
                0, /* detailArg [in]Type: Integer */
                300, /* screenXArg [in]Type: Integer */
                300, /* screenYArg [in]Type: Integer */
                0, /* clientXArg [in]Type: Floating-point */
                0, /* clientYArg [in]Type: Floating-point */
                false, /* ctrlKeyArg [in]Type: boolean */
                false, /* altKeyArg [in]Type: boolean */
                false, /* shiftKeyArg [in]Type: boolean */
                false, /* metaKeyArg [in]Type: boolean */
                0, /* buttonArg [in]Type: Number */
                window, /* relatedTargetArg [in]Type: EventTarget */
                0, /* offsetXArg [in]Type: Floating-point */
                0, /* offsetYArg [in]Type: Floating-point */
                100, /* widthArg [in]Type: Integer */
                100, /* heightArg [in]Type: Integer */
                5, /* pressure [in]Type: Floating-point */
                0, /* rotation [in]Type: Integer */
                0, /* tiltX [in]Type: Integer */
                0, /* tiltY [in]Type: Integer */
                0, /* pointerIdArg [in]Type: Integer */
                0, /* pointerType [in]Type: Integer */
                0, /* hwTimestampArg [in]Type: Integer */
                true /* isPrimary [in]Type: boolean */
            );

            window.dispatchEvent(event);
            counter++;

        };

        intervalId = window.setInterval(generatePointerEvent, 10);

    };

    function generateTouchEvents(n) {
        var intervalId;
        var counter = 1;

        function generateTouchEvent() {
            if (counter === n)
            {
                window.clearInterval(intervalId);
                window.setTimeout(function () {
                    wapi.publish("end", counter);
                }, 100);
            }
            try
            {
                var event = document.createEvent('TouchEvent');

                event.initUIEvent('touchstart', true, true);
                window.dispatchEvent(event);
                counter++;
            }
            catch (e)
            {
                window.clearInterval(intervalId);
                alert(e);
            }

        };

        intervalId = window.setInterval(generateTouchEvent, 10);

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
            try
            {
                var event = new MouseEvent("click", {
                    "view": window,
                    "bubbles": true,
                    "cancelable": true
                });
            }
            catch (e)
            {
                window.clearInterval(intervalId);
                alert(e);
            }

            window.dispatchEvent(event);
            counter++;
        };

        intervalId = window.setInterval(generateMouseEvent, 10);
    };

    window.generateWidgetEvents = function (n) {
        if (goog.userAgent)
        {
            /* TODO: add pointer generator and code to switch to
             * appropriate generator
             */
            if (window.MSPointerEvent)
            {
                generatePointerEvents(n);
            }
            else if (goog.userAgent.MOBILE)
            {
                generateTouchEvents(n);
            }
            else
            {
                generateMouseEvents(n);
            }
        }
    };

})();
	 












