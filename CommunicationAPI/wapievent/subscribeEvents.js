(function () {

    document.getElementById("sub_allmouse").addEventListener("click", function (e) {
        var mouseSubscribe = [
            "click", "dblclick", "mousedown", "mouseup",
            "mouseover", "mousemove", "mouseout"
        ];
        if (e.srcElement.checked)
        {
            wapi.publish("sysEventSubscribe", mouseSubscribe);
            for (var i = 0; i < mouseSubscribe.length; i++)
            {
                document.getElementById("sub_" + mouseSubscribe[i]).checked = true;
                wapi.subscribe(mouseSubscribe[i], eventMonitor.eventCounters[mouseSubscribe[i]].handler);
            }
        }
        else
        {
            wapi.publish("sysEventUnsubscribe", mouseSubscribe);
            for (var i = 0; i < mouseSubscribe.length; i++)
            {
                document.getElementById("sub_" + mouseSubscribe[i]).checked = false;
                wapi.unsubscribe(mouseSubscribe[i], eventMonitor.eventCounters[mouseSubscribe[i]].handler);
            }
        }
    }, false);

    document.getElementById("sub_allkey").addEventListener("click", function (e) {
        var keySubscribe = ["keydown", "keypress", "keyup"];
        if (e.srcElement.checked)
        {
            wapi.publish("sysEventSubscribe", keySubscribe);
            for (var i = 0; i < keySubscribe.length; i++)
            {
                document.getElementById("sub_" + keySubscribe[i]).checked = true;
                wapi.subscribe(keySubscribe[i], eventMonitor.eventCounters[keySubscribe[i]].handler);
            }
        }
        else
        {
            wapi.publish("sysEventUnsubscribe", keySubscribe);
            for (var i = 0; i < keySubscribe.length; i++)
            {
                document.getElementById("sub_" + keySubscribe[i]).checked = false;
                wapi.unsubscribe(keySubscribe[i], eventMonitor.eventCounters[keySubscribe[i]].handler);
            }
        }
    }, false);

    document.getElementById("sub_alltouch").addEventListener("click", function (e) {
        var touchSubscribe = ["touchstart", "touchend", "touchmove", "touchenter", "touchleave", "touchcancel"];
        if (e.srcElement.checked)
        {
            wapi.publish("sysEventSubscribe", touchSubscribe);
            for (var i = 0; i < touchSubscribe.length; i++)
            {
                document.getElementById("sub_" + touchSubscribe[i]).checked = true;
                wapi.subscribe(touchSubscribe[i], eventMonitor.eventCounters[touchSubscribe[i]].handler);
            }
        }
        else
        {
            wapi.publish("sysEventUnsubscribe", touchSubscribe);
            for (var i = 0; i < touchSubscribe.length; i++)
            {
                document.getElementById("sub_" + touchSubscribe[i]).checked = false;
                wapi.unsubscribe(touchSubscribe[i], eventMonitor.eventCounters[touchSubscribe[i]].handler);
            }
        }
    }, false);

    document.getElementById("sub_allpointer").addEventListener("click", function (e) {
        var pointerSubscribe = [
            "pointerdown", "pointerup", "pointercancel", "pointermove",
            "pointerover", "pointerout", "pointerenter", "pointerleave",
            "gotpointercapture", "lostpointercapture"
        ];
        if (e.srcElement.checked)
        {
            wapi.publish("sysEventSubscribe", pointerSubscribe);
            for (var i = 0; i < pointerSubscribe.length; i++)
            {
                document.getElementById("sub_" + pointerSubscribe[i]).checked = true;
                wapi.subscribe(pointerSubscribe[i], eventMonitor.eventCounters[pointerSubscribe[i]].handler);
            }
        }
        else
        {
            wapi.publish("sysEventUnsubscribe", pointerSubscribe);
            for (var i = 0; i < pointerSubscribe.length; i++)
            {
                document.getElementById("sub_" + pointerSubscribe[i]).checked = false;
                wapi.unsubscribe(pointerSubscribe[i], eventMonitor.eventCounters[pointerSubscribe[i]].handler);
            }
        }
    }, false);


    function subscribe_(eventType) {
        wapi.publish("sysEventSubscribe", eventType);
        wapi.subscribe(eventType, eventMonitor.eventCounters[eventType].handler);
    }

    function unsubscribe_(eventType) {
        wapi.publish("sysEventUnsubscribe", eventType);
        wapi.unsubscribe(eventType, eventMonitor.eventCounters[eventType].handler);
    }


    document.getElementById("sub_click").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("click") : unsubscribe_("click");
    }, false);


    document.getElementById("sub_dblclick").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("dblclick") : unsubscribe_("dblclick");
    }, false);


    document.getElementById("sub_mousedown").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("mousedown") : unsubscribe_("mousedown");
    }, false);


    document.getElementById("sub_mouseup").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("mouseup") : unsubscribe_("mouseup");
    }, false);


    document.getElementById("sub_mouseover").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("mouseover") : unsubscribe_("mouseover");
    }, false);


    document.getElementById("sub_mousemove").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("mousemove") : unsubscribe_("mousemove");
    }, false);


    document.getElementById("sub_mouseout").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("mouseout") : unsubscribe_("mouseout");
    }, false);


    document.getElementById("sub_keydown").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("keydown") : unsubscribe_("keydown");
    }, false);


    document.getElementById("sub_keypress").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("keypress") : unsubscribe_("keypress");
    }, false);


    document.getElementById("sub_keyup").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("keyup") : unsubscribe_("keyup");
    }, false);


    document.getElementById("sub_resize").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("resize") : unsubscribe_("resize");
    }, false);


    document.getElementById("sub_scroll").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("scroll") : unsubscribe_("scroll");
    }, false);


    document.getElementById("sub_focus").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("focus") : unsubscribe_("focus");
    }, false);


    document.getElementById("sub_blur").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("blur") : unsubscribe_("blur");
    }, false);


    document.getElementById("sub_focusin").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("focusin") : unsubscribe_("focusin");
    }, false);


    document.getElementById("sub_focusout").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("focusout") : unsubscribe_("focusout");
    }, false);


    document.getElementById("sub_DOMActivate").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("DOMActivate") : unsubscribe_("DOMActivate");
    }, false);


    document.getElementById("sub_touchstart").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("touchstart") : unsubscribe_("touchstart");
    }, false);


    document.getElementById("sub_touchend").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("touchend") : unsubscribe_("touchend");
    }, false);


    document.getElementById("sub_touchmove").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("touchmove") : unsubscribe_("touchmove");
    }, false);


    document.getElementById("sub_touchenter").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("touchenter") : unsubscribe_("touchenter");
    }, false);


    document.getElementById("sub_touchleave").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("touchleave") : unsubscribe_("touchleave");
    }, false);


    document.getElementById("sub_touchcancel").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("touchcancel") : unsubscribe_("touchcancel");
    }, false);


    document.getElementById("sub_pointerdown").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("pointerdown") : unsubscribe_("pointerdown");
    }, false);


    document.getElementById("sub_pointerup").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("pointerup") : unsubscribe_("pointerup");
    }, false);


    document.getElementById("sub_pointercancel").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("pointercancel") : unsubscribe_("pointercancel");
    }, false);


    document.getElementById("sub_pointermove").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("pointermove") : unsubscribe_("pointermove");
    }, false);


    document.getElementById("sub_pointerover").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("pointerover") : unsubscribe_("pointerover");
    }, false);


    document.getElementById("sub_pointerout").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("pointerout") : unsubscribe_("pointerout");
    }, false);


    document.getElementById("sub_pointerenter").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("pointerenter") : unsubscribe_("pointerenter");
    }, false);


    document.getElementById("sub_pointerleave").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("pointerleave") : unsubscribe_("pointerleave");
    }, false);


    document.getElementById("sub_gotpointercapture").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("gotpointercapture") : unsubscribe_("gotpointercapture");
    }, false);


    document.getElementById("sub_lostpointercapture").addEventListener("click", function (e) {
        e.srcElement.checked === true ? subscribe_("lostpointercapture") : unsubscribe_("lostpointercapture");
    }, false);


    window.print_eventinfo = true;

    document.getElementById("print_eventinfo").addEventListener("click", function (e) {
        print_eventinfo = e.srcElement.checked;
        if (!print_eventinfo)
        {
            var eventinfo = document.getElementById("eventinfo");
            eventinfo.innerHTML = "";
        }
    }, false);

    window.printEventInfo = function (msg) {
        var eventinfo = document.getElementById("eventinfo");
        eventinfo.innerHTML = "";
        for (key in msg)
        {
            if (msg.hasOwnProperty(key))
            {
                eventinfo.innerHTML += "<div>" + key + ":" + msg[key] + "</div>";
            }
        }
    };

})();