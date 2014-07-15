var eventCounters = {
    "click": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["click"].count += 1;
            eventCounters["click"].updated = false;
        },
        listener: function (msg) {
            eventCounters["click"].count += 1;
            eventCounters["click"].updated = false;
        }
    },
    "dblclick": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["dblclick"].count += 1;
            eventCounters["dblclick"].updated = false;
        },
        listener: function (msg) {
            eventCounters["dblclick"].count += 1;
            eventCounters["dblclick"].updated = false;
        }
    },
    "mousedown": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["mousedown"].count += 1;
            eventCounters["mousedown"].updated = false;
        },
        listener: function (msg) {
            eventCounters["mousedown"].count += 1;
            eventCounters["mousedown"].updated = false;
        }

    },
    "mouseup": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["mouseup"].count += 1;
            eventCounters["mouseup"].updated = false;
        },
        listener: function (msg) {
            eventCounters["mouseup"].count += 1;
            eventCounters["mouseup"].updated = false;
        }
    },
    "mouseover": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["mouseover"].count += 1;
            eventCounters["mouseover"].updated = false;
        },
        listener: function (msg) {
            eventCounters["mouseover"].count += 1;
            eventCounters["mouseover"].updated = false;
        }

    },
    "mousemove": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["mousemove"].count += 1;
            eventCounters["mousemove"].updated = false;
        },
        listener: function (msg) {
            eventCounters["mousemove"].count += 1;
            eventCounters["mousemove"].updated = false;
        }
    },
    "mouseout": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["mouseout"].count += 1;
            eventCounters["mouseout"].updated = false;
        },
        listener: function (msg) {
            eventCounters["mouseout"].count += 1;
            eventCounters["mouseout"].updated = false;
        }
    },
    "keydown": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["keydown"].count += 1;
            eventCounters["keydown"].updated = false;
        },
        listener: function (msg) {
            eventCounters["keydown"].count += 1;
            eventCounters["keydown"].updated = false;
        }
    },
    "keypress": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["keypress"].count += 1;
            eventCounters["keypress"].updated = false;
        },
        listener: function (msg) {
            eventCounters["keypress"].count += 1;
            eventCounters["keypress"].updated = false;
        }
    },
    "keyup": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["keyup"].count += 1;
            eventCounters["keyup"].updated = false;
        },
        listener: function (msg) {
            eventCounters["keyup"].count += 1;
            eventCounters["keyup"].updated = false;
        }
    },
    "resize": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["resize"].count += 1;
            eventCounters["resize"].updated = false;
        },
        listener: function (msg) {
            eventCounters["resize"].count += 1;
            eventCounters["resize"].updated = false;
        }

    },
    "scroll": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["scroll"].count += 1;
            eventCounters["scroll"].updated = false;
        },
        listener: function (msg) {
            eventCounters["scroll"].count += 1;
            eventCounters["scroll"].updated = false;
        }
    },
    "focus": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["focus"].count += 1;
            eventCounters["focus"].updated = false;
        },
        listener: function (msg) {
            eventCounters["focus"].count += 1;
            eventCounters["focus"].updated = false;
        },

    },

    "blur": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["blur"].count += 1;
            eventCounters["blur"].updated = false;
        },
        listener: function (msg) {
            eventCounters["blur"].count += 1;
            eventCounters["blur"].updated = false;
        }

    },
    "focusin": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["focusin"].count += 1;
            eventCounters["focusin"].updated = false;
        },
        listener: function (msg) {
            eventCounters["focusin"].count += 1;
            eventCounters["focusin"].updated = false;
        }

    },
    "focusout": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["focusout"].count += 1;
            eventCounters["focusout"].updated = false;
        },
        listener: function (msg) {
            eventCounters["focusout"].count += 1;
            eventCounters["focusout"].updated = false;
        }

    },
    "DOMActivate": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["DOMActivate"].count += 1;
            eventCounters["DOMActivate"].updated = false;
        },
        listener: function (msg) {
            eventCounters["DOMActivate"].count += 1;
            eventCounters["DOMActivate"].updated = false;
        }
    },
    "touchstart": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["touchstart"].count += 1;
            eventCounters["touchstart"].updated = false;
        },
        listener: function (msg) {
            eventCounters["touchstart"].count += 1;
            eventCounters["touchstart"].updated = false;
        }
    },
    "touchend": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["touchend"].count += 1;
            eventCounters["touchend"].updated = false;
        },
        listener: function (msg) {
            eventCounters["touchend"].count += 1;
            eventCounters["touchend"].updated = false;
        }
    },
    "touchmove": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["touchmove"].count += 1;
            eventCounters["touchmove"].updated = false;
        },
        listener: function (msg) {
            eventCounters["touchmove"].count += 1;
            eventCounters["touchmove"].updated = false;
        }
    },
    "touchenter": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["touchenter"].count += 1;
            eventCounters["touchenter"].updated = false;
        },
        listener: function (msg) {
            eventCounters["touchenter"].count += 1;
            eventCounters["touchenter"].updated = false;
        }
    },
    "touchleave": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["touchleave"].count += 1;
            eventCounters["touchleave"].updated = false;
        },
        listener: function (msg) {
            eventCounters["touchleave"].count += 1;
            eventCounters["touchleave"].updated = false;
        }
    },
    "touchcancel": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["touchcancel"].count += 1;
            eventCounters["touchcancel"].updated = false;
        },
        listener: function (msg) {
            eventCounters["touchcancel"].count += 1;
            eventCounters["touchcancel"].updated = false;
        }
    },
    "pointerdown": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["pointerdown"].count += 1;
            eventCounters["pointerdown"].updated = false;
        },
        listener: function (msg) {
            eventCounters["pointerdown"].count += 1;
            eventCounters["pointerdown"].updated = false;
        }
    },
    "pointerup": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["pointerup"].count += 1;
            eventCounters["pointerup"].updated = false;
        },
        listener: function (msg) {
            eventCounters["pointerup"].count += 1;
            eventCounters["pointerup"].updated = false;
        }
    },
    "pointercancel": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["pointercancel"].count += 1;
            eventCounters["pointercancel"].updated = false;
        },
        listener: function (msg) {
            eventCounters["pointercancel"].count += 1;
            eventCounters["pointercancel"].updated = false;
        }
    },
    "pointermove": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["pointermove"].count += 1;
            eventCounters["pointermove"].updated = false;
        },
        listener: function (msg) {
            eventCounters["pointermove"].count += 1;
            eventCounters["pointermove"].updated = false;
        }

    },
    "pointerover": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["pointerover"].count += 1;
            eventCounters["pointerover"].updated = false;
        },
        listener: function (msg) {
            eventCounters["pointerover"].count += 1;
            eventCounters["pointerover"].updated = false;
        }

    },
    "pointerout": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["pointerout"].count += 1;
            eventCounters["pointerout"].updated = false;
        },
        listener: function (msg) {
            eventCounters["pointerout"].count += 1;
            eventCounters["pointerout"].updated = false;
        }
    },
    "pointerenter": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["pointerenter"].count += 1;
            eventCounters["pointerenter"].updated = false;
        },
        listener: function (msg) {
            eventCounters["pointerenter"].count += 1;
            eventCounters["pointerenter"].updated = false;
        }
    },
    "pointerleave": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["pointerleave"].count += 1;
            eventCounters["pointerleave"].updated = false;
        },
        listener: function (msg) {
            eventCounters["pointerleave"].count += 1;
            eventCounters["pointerleave"].updated = false;
        }

    },
    "gotpointercapture": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["gotpointercapture"].count += 1;
            eventCounters["gotpointercapture"].updated = false;
        },
        listener: function (msg) {
            eventCounters["gotpointercapture"].count += 1;
            eventCounters["gotpointercapture"].updated = false;
        }
    },
    "lostpointercapture": {
        count: 0,
        updated: true,
        handler: function (msg) {
            eventCounters["lostpointercapture"].count += 1;
            eventCounters["lostpointercapture"].updated = false;
        },
        listener: function (msg) {
            eventCounters["lostpointercapture"].count += 1;
            eventCounters["lostpointercapture"].updated = false;
        }
    }
};


function listen(e) {
    for (var key in e)
    {
        if (e.hasOwnProperty(key))
        {
            window.addEventListener(key, e[key].listener, false);
        }
    }
}

function removeListen(e) {
    for (var key in e)
    {
        if (e.hasOwnProperty(key))
        {
            window.removeEventListener(key, e[key].listener, false);
        }
    }
}

function subscribe(e) {
    for (var key in e)
    {
        if (e.hasOwnProperty(key))
        {
            wapi.subscribe(key, e[key].handler);
        }
    }
}

function unsubscribe(e) {
    for (var key in e)
    {
        if (e.hasOwnProperty(key))
        {
            wapi.unsubscribe(key, e[key].handler);
        }
    }
}

//listen(eventCounters);
//wapi.subscribe('resize', eventCounters['resize'].listener);


var interval = null;
var interval2 = null;

function startCounters() {
    // updates counters
    interval = window.setInterval(function () {
        for (var key in eventCounters)
        {
            if (eventCounters.hasOwnProperty(key) && eventCounters[key].updated === false)
            {
                var e = document.getElementById(key);
                if (usePubsub)
                {
                    e.innerHTML = "<span style='color:red;font-weight:bold;'>" + eventCounters[key].count + "</span>";
                }
                else
                {
                    e.innerHTML =
                        "<span style='color:green;font-style:italic;font-weight:bold;'>" + eventCounters[key].count + "</span>";
                }
                eventCounters[key].updated = true;
            }
        }
    }, 50);


// clears red color from recently updated counters
    interval2 = window.setInterval(function () {
        for (var key in eventCounters)
        {
            if (eventCounters.hasOwnProperty(key))
            {
                var e = document.getElementById(key);
                e.innerHTML = "<span style='font-weight:bold;'>" + eventCounters[key].count + "</span>";
            }
        }
    }, 500);
}

function stopCounters() {
    if (interval)
    {
        window.clearInterval(interval);
        interval = null;
    }

    if (interval2)
    {
        window.clearInterval(interval2);
        interval2 = null;
    }
}

startCounters();

function getEventCount() {
    var count = 0;
    for (var key in eventCounters)
    {
        if (eventCounters.hasOwnProperty(key))
        {
            count += eventCounters[key].count;
        }
    }
    return count;
};