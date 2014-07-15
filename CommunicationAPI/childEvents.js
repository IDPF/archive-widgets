// the set of events that we monitor will be an interesting topic

var events_ = {
    "click": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('click' + e.target.localName);
            }
            wapi.publish('click', '0');
        },
        dispatch: function (e) {
            window.console.log("click");
        }
    },

    "dblclick": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('dblclick' + e.target.localName);
            }
            wapi.publish('dblclick', '0');
        },
        dispatch: function (e) {
            window.console.log("dblclick");
        }
    },

    "mousedown": {
        publish: function (e) {
            if (wapi.verbose)
            {
                window.console.log('mousedown: ' + e.target.localName);
            }
            wapi.publish('mousedown', '0');
        },
        dispatch: function (e) {
            var event = new MouseEvent('mousedown', e);
            window.parent.dispatchEvent(event);
        }
    },

    "mouseup": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('mouseup' + e.target.localName);
            }
            wapi.publish('mouseup', '0');
        },
        dispatch: function (e) {
            var event = new MouseEvent('mouseup', e);
            window.parent.dispatchEvent(event);
        }
    },

    "mouseover": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('mouseover' + e.target.localName);
            }
            wapi.publish('mouseover', '0');
        },
        dispatch: function (e) {
            var event = new MouseEvent('mouseover', e);
            window.parent.dispatchEvent(event);
        }
    },

    "mousemove": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('mousemove' + e.target.localName);
            }
            wapi.publish('mousemove', '0');
        },
        dispatch: function (e) {
            var event = new MouseEvent('mousemove', e);
            window.parent.dispatchEvent(event);
        }
    },

    "mouseout": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('mouseout' + e.target.localName);
            }
            wapi.publish('mouseout', '0');
        },
        dispatch: function (e) {
            var event = new MouseEvent('mouseout', e);
            window.parent.dispatchEvent(event);
        }
    },

    "keydown": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('keydown' + e.target.localName);
            }
            wapi.publish('keydown', '0');
        },
        dispatch: function (e) {
            window.console.log("keydown");
        }
    },

    "keypress": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('keypress' + e.target.localName);
            }
            wapi.publish('keypress', '0');
        },
        dispatch: function (e) {
            window.console.log("keypress");
        }
    },

    "keyup": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('keyup' + e.target.localName);
            }
            wapi.publish('keyup', '0');
        },
        dispatch: function (e) {
            window.console.log("keyup");
        }
    },

    "resize": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('resize' + e.target.localName);
            }
            wapi.publish('resize', '0');
        },
        dispatch: function (e) {
            window.console.log("resize");
        }
    },

    "scroll": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('scroll' + e.target.localName);
            }
            wapi.publish('scroll', '0');
        },
        dispatch: function (e) {
            window.console.log("scroll");
        }
    },

    "focus": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('focus' + e.target.localName);
            }
            wapi.publish('focus', '0');
        },
        dispatch: function (e) {
            window.console.log("focus");
        }
    },

    "blur": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('blur' + e.target.localName);
            }
            wapi.publish('blur', '0');
        },
        dispatch: function (e) {
            window.console.log("blur");
        }
    },

    "focusin": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('focusin' + e.target.localName);
            }
            wapi.publish('focusin', '0');
        },
        dispatch: function (e) {
            window.console.log("focusin");
        }
    },

    "focusout": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('focusout' + e.target.localName);
            }
            wapi.publish('focusout', '0');
        },
        dispatch: function (e) {
            window.console.log("focusout");
        }
    },

    "DOMActivate": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('DOMActivate' + e.target.localName);
            }
            wapi.publish('DOMActivate', '0');
        },
        dispatch: function (e) {
            window.console.log("DOMActivate");
        }
    },

    "touchstart": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('touchstart' + e.target.localName);
            }
            wapi.publish('touchstart', '0');
        },
        dispatch: function (e) {
            window.console.log("touchstart");
        }
    },

    "touchend": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('touchend' + e.target.localName);
            }
            wapi.publish('touchend', '0');
        },
        dispatch: function (e) {
            window.console.log("touchend");
        }
    },

    "touchmove": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('touchmove' + e.target.localName);
            }
            wapi.publish('touchmove', '0');
        },
        dispatch: function (e) {
            window.console.log("touchmove");
        }
    },

    "touchenter": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('touchenter' + e.target.localName);
            }
            wapi.publish('touchenter', '0');
        },
        dispatch: function (e) {
            window.console.log("touchenter");
        }
    },

    "touchleave": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('touchleave' + e.target.localName);
            }
            wapi.publish('touchleave', '0');
        },
        dispatch: function (e) {
            window.console.log("touchleave");
        }
    },

    "touchcancel": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('touchcancel' + e.target.localName);
            }
            wapi.publish('touchcancel', '0');
        },
        dispatch: function (e) {
            window.console.log("touchcancel");
        }
    },

    "pointerdown": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('pointerdown' + e.target.localName);
            }
            wapi.publish('pointerdown', '0');
        },
        dispatch: function (e) {
            window.console.log("pointerdown");
        }
    },

    "pointerup": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('pointerup' + e.target.localName);
            }
            wapi.publish('pointerup', '0');
        },
        dispatch: function (e) {
            window.console.log("pointerup");
        }
    },

    "pointercancel": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('pointercancel' + e.target.localName);
            }
            wapi.publish('pointercancel', '0');
        },
        dispatch: function (e) {
            window.console.log("pointercancel");
        }
    },

    "pointermove": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('pointermove' + e.target.localName);
            }
            wapi.publish('pointermove', '0');
        },
        dispatch: function (e) {
            window.console.log("pointermove");
        }
    },

    "pointerover": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('pointerover' + e.target.localName);
            }
            wapi.publish('pointerover', '0');
        },
        dispatch: function (e) {
            window.console.log("pointerover");
        }
    },

    "pointerout": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('pointerout' + e.target.localName);
            }
            wapi.publish('pointerout', '0');
        },
        dispatch: function (e) {
            window.console.log("pointerout");
        }
    },

    "pointerenter": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('pointerenter' + e.target.localName);
            }
            wapi.publish('pointerenter', '0');
        },
        dispatch: function (e) {
            window.console.log("pointerenter");
        }

    },

    "pointerleave": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('pointerleave' + e.target.localName);
            }
            wapi.publish('pointerleave', '0');
        },
        dispatch: function (e) {
            window.console.log("pointerleave");
        }
    },

    "gotpointercapture": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('gotpointercapture' + e.target.localName);
            }
            wapi.publish('gotpointercapture', '0');
        },
        dispatch: function (e) {
            window.console.log("gotpointercapture");
        }
    },

    "lostpointercapture": {
        publish: function (e) {
            if (wapi.verboxe)
            {
                window.console.log('lostpointercapture' + e.target.localName);
            }
            wapi.publish('lostpointercapture', '0');
        },
        dispatch: function (e) {
            window.console.log("lostpointercapture");
        }
    }
};


function registerPublish(events) {
    for (var key in events)
    {
        if (events.hasOwnProperty(key))
        {
            window.addEventListener(key, events[key].publish, false);
        }
    }
}

function unregisterPublish(events) {
    for (var key in events)
    {
        if (events.hasOwnProperty(key))
        {
            window.removeEventListener(key, events[key].publish, false);
        }
    }
}


function registerDispatch(events) {
    for (var key in events)
    {
        if (events.hasOwnProperty(key))
        {
            window.addEventListener(key, events[key].dispatch, false);
        }
    }
}

function unregisterDispatch(events) {
    for (var key in events)
    {
        if (events.hasOwnProperty(key))
        {
            window.removeEventListener(key, events[key].dispatch, false);
        }
    }
}


registerPublish(events_);
//window.addEventListener('resize', events_['resize'], false);

wapi.subscribe('pubsub', function (msg) {
    if (msg.use)
    {
        unregisterDispatch(events_);
        registerPublish(events_);
    }
    else
    {
        unregisterPublish(events_);
        registerDispatch(events_);
    }
});