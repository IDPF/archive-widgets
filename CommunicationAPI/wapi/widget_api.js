/**
 * IDPF Widget Communication Package
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Inkling/IDPF
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * This is all very prototype code:
 * TODO:
 *     1. [fixed] This code broadcasts to all nodes/widgets in the hierarchy,
 *        we need to revisit strategies to optimize this.
 *     2. Encapsulate code
 *     3. Clean up signatures
 *     4. Get naming right
 *     5. Determine if we have timing issues
 */


(function () {

    //<editor-fold desc="DEBUGGING">
    var DEBUG = true;

    /**
     * Assertion testing function.
     * @param {boolean} bool - value of assertion.
     * @param {string} msg to show on failed assertion.
     */
    function assert_(bool, msg) {
        if (!bool)
        {
            if (DEBUG)
            {
                window.console.warn("AssertionFailure: " + msg);
                debugger;
            }
            else
            {
                alert("AssertionFailure: " + msg);
            }
        }
    }

    /**
     * Message counter.
     * @type {number}
     */
    var counter = 0;

    /**
     * Turn console.log spew on or off.
     * @type {boolean}
     * @private
     */
    var verbose_ = false;
    /* end debugging stuff */
    //</editor-fold>


    //<editor-fold desc="IDness">
    /**
     * @return {string} a uuid.
     */
    function generateUUID_() {
        var d = new Date().getTime();
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == "x" ? r : (r & 0x7 | 0x8)).toString(16);
        });
    }

    /**
     * ID of widget
     * @type {string} guid -.
     * @private
     */
    var widgetID_ = generateUUID_();
    //</editor-fold>


    /**
     * Constructor for widgetNode
     * @param {string} id -.
     * @param {string} url -.
     * @constructor
     */
    var Widget_ = function (id, url) {
        /**
         * ID of widget.
         * @type {string}
         * @private
         */
        this.widgetid_ = id;


        /* jshint unused: true */
        //noinspection JSUnusedGlobalSymbols
        /**
         * Unused.
         * @type {string}
         * @private
         */
        this.url_ = url;
    };


    //<editor-fold desc="Topic Message">
    /**
     * The message used to pass topics between components/windows.
     * TODO: the schema of this has to be in spec.
     * @param {string} method -.
     * @param {string} topicName -.
     * @param {boolean} capture -.
     * @param {(Object | string)=} opt_data topic data.
     * @constructor
     */
    var TopicMessage_ = function (method, topicName, capture, opt_data) {
        this.init(method, topicName, capture, opt_data);
    };


    /**
     * Constructor for messages.
     * @param {string} method -.
     * @param {string} topicName -.
     * @param {boolean} capture -.
     * @param {Object | string | undefined} opt_data
     */
    TopicMessage_.prototype.init = function (method, topicName, capture, opt_data) {
        this.type_ = "message";

        this.widgetSourceID_ = widgetID_;
        this.widgetPath_ = [];
        this.id = generateUUID_();

        this.time = +new Date();
        this.counter = ++counter;

        this.capture = capture;

        this.bubbleonly = false;	// if true this message only goes to parents

        this.method = method;

        this.payload = {
            topic: topicName,
            topicData: opt_data
        };
    };
    //</editor-fold>


    /**
     *
     * @type {{}}
     * @private
     */
    var TopicMap_ = {};


    //<editor-fold desc="Topic Handler">
    /**
     * Constructor for topic handler.
     * @constructor
     */
    var TopicHandler_ = function () {
        /**
         * array of iframe windows, these are windows
         * that we dispatch topics to.
         * Each subscriber in this array must be unique (e.g. we do
         * not dispatch a topic to a window twice.
         * @type {Window}
         */
        this.subscribers_ = [];

        /**
         * array of functions
         * these are local functions that implement a topic.
         * Multiple handlers must be allowed.
         * (e.g. wapi.subscribe("topic", function (msg) {
         *     code
         * });
         * wapi.subscribe("topic", function (msg) {
         *      different code
         * });
         * @type {function}
         */
        this.handlers_ = [];
    };

    /**
     * @param {function} f new handler.
     */
    TopicHandler_.prototype.addHandler = function (f) {
        this.handlers_.push(f);
    };


    /**
     * Remove the function handler from this topic
     * @param {function} f new handler.
     */
    TopicHandler_.prototype.removeHandler = function (f) {
        var i = this.handlers_.indexOf(f);
        if (i >= 0)
        {
            this.handlers_.splice(i, 1);
        }
    };


    /**
     * @param {TopicMessage_} message to publish.
     */
    TopicHandler_.prototype.callHandlers = function (message) {
        for (var i = 0; i < this.handlers_.length; i++)
        {
            if (message.widgetSourceID_ != widgetID_)
            {
                this.handlers_[i](message.payload.topicData);
            }
        }
    };

    /**
     * @param {TopicMessage_} message to publish.
     */
    TopicHandler_.prototype.callHandlers2 = function (message) {
        for (var i = 0; i < this.handlers_.length; i++)
        {
            if (message.widgetSourceID_ != widgetID_)
            {
                this.handlers_[i](message);
            }
        }
    };

    /**
     * Does the TopicHandler have any handlers
     * @return {boolean}
     */
    TopicHandler_.prototype.anyHandlers = function () {
        return this.handlers_.length > 0;
    };

    //noinspection JSUnusedLocalSymbols
    /**
     * Add a child window as a subscriber to this topic.
     * @param {Window} win subscriber.
     * @param {string} widgetid -.
     */
    TopicHandler_.prototype.addSubscriber = function (win, widgetid) {
        /**
         * The window can only exist in the current windows context,
         * so no need to protect against duplicate subscribers,
         * which happens when a child and a grandchild subscribe
         * to the same topic
         */
        if (this.subscribers_.indexOf(win) < 0)
        {
            this.subscribers_.push(win);
        }
    };


    /**
     * Remove the child window as a subscriber to this topic.
     * @param {Window} win subscriber.
     */
    TopicHandler_.prototype.removeSubscriber = function (win) {
        // Find and remove item from an array
        var i = this.subscribers_.indexOf(win);
        if (i >= 0)
        {
            this.subscribers_.splice(i, 1);
        }
    };


    /**
     * Call all my subscribers
     * @param {TopicMessage_} message -.
     */
    TopicHandler_.prototype.callSubscribers = function (message) {
        for (var i = 0; i < this.subscribers_.length; i++)
        {
            /* TODO: security implications of star? */
            this.subscribers_[i].postMessage(message, "*");
        }
    };


    /**
     * Does the TopicHandler have any subscribers
     * @return {boolean}
     */
    TopicHandler_.prototype.anySubscribers = function () {
        return this.subscribers_.length > 0;
    };
    //</editor-fold>


    //<editor-fold desc="Internal implementation">
    /**
     * Publish a message topic to only my ancestors.
     * @param {string} topicName
     * @param {*} data to publish.
     */
    function publishToParent_(topicName, data) {
        var message = new TopicMessage_("methodReady", topicName, true, data);
        message.bubbleonly = true;
        message.widgetPath_.unshift(new Widget_(widgetID_, document.URL));
        publish_(topicName, message, window);
    }


    //noinspection JSUnusedLocalSymbols
    /**
     * Publish a message topic.
     * @param {string} topicName topic string.
     * @param {TopicMessage_} message to publish.
     * @param {Window} srcWin -.
     * @private
     */
    function publish_(topicName, message, srcWin) {
        var topic = TopicMap_[topicName];

        /* TODO: discuss widgetRoot problem */
        if (window.widgetRoot || window.parent === window)
        {
            /* we have reached the parent,
             * this will need to be tweaked to account for RS
             */
            message.capture = false;
        }

        if (message.capture === true)
        {
            if (message.bubbleonly)
            {
                topic.callHandlers(message);
            }
            /* still in capture phase, send to parent */
            window.parent.postMessage(message, "*");
        }
        else if (topic)
        {
            /* walk back down the tree */
            topic.callHandlers(message);
            if (!message.bubbleonly)
            {
                topic.callSubscribers(message);
            }
        }
    }


    //noinspection JSUnusedLocalSymbols
    /**
     * System publish, right now just going up to parents.
     * @param {string} topicName -.
     * @param {TopicMessage_} message to publish.
     * @param {Window} srcWin -.
     * @private
     */
    function systemPublish_(topicName, message, srcWin) {
        var topic = TopicMap_[topicName];

        if (message.capture === true)
        {
            message.widgetPath_.unshift(new Widget_(widgetID_, document.URL));
            if (message.bubbleonly)
            {
                topic.callHandlers2(message);
            }

            if (window.parent === window)
            {
                /* we have reached the parent,
                 * this will need to be tweaked to account for RS
                 */
                message.capture = false;
            }

            /* still in capture phase, send to parent */
            window.parent.postMessage(message, "*");
        }
        else if (topic && !message.bubbleonly)
        {
            /* walk back down the tree */
            topic.callHandlers2(message);

            topic.callSubscribers(message);
        }
    }

    /**
     * Returns array of all DOM level events subscribed to.
     * @returns {Array}
     * @private
     */
    function subscribedEvents_() {
        var subscribedEvents = [];

        for (var key in TopicMap_)
        {
            if (TopicMap_.hasOwnProperty(key) && publishableBrowserEvents_.indexOf(key) > -1)
            {
                subscribedEvents.push(key);
            }
        }
        return subscribedEvents;
    }

    //</editor-fold>


    //<editor-fold desc="Events">

    /**
     * A generic browser event object, suitable for publishing across frame
     * boundaries.
     * @param {Event=} opt_event An event to clone.
     * @constructor
     */
    var BrowserEvent = function (opt_event) {
        if (opt_event)
        {
            this.init(opt_event);
        }
    };


    /**
     * TODO: this schema must be documented in public spec.
     * Initialize a BrowserEvent object that conforms to [insert spec ref here].
     * The new object is suitable for use in publishing events in ESC. Note
     * that, per the spec, parameters that reference elements (for example,
     * e.target or e.srcElement) are not copied.
     * @param {!Event} e
     */
    BrowserEvent.prototype.init = function (e) {
        // TODO: Decide if assigning undefined properties is bad. It means that
        // this.hasOwnProperty(X) will be true even if e.hasOwnProperty(X) is
        // false.
        this.type = e.type;
        this.screenX = e.screenX;
        this.screenY = e.screenY;
        this.button = e.button;

        this.keyCode = e.keyCode;
        this.charCode = e.charCode;
        this.ctrlKey = e.ctrlKey;
        this.altKey = e.altKey;
        this.shiftKey = e.shiftKey;
        this.metaKey = e.metaKey;

        // TODO: Test this.
        if (e.touches)
        {
            // TODO: Decide if we want to rely on Array.prototype.map. If not,
            // we should provide an implementation.
            this.touches = e.touches.map(function (coord) {
                return {screenX: coord.screenX, screenY: coord.screenY};
            });
        }

        this.state = e.state;
        this.defaultPrevented = e.defaultPrevented;
    };

    /**
     * Dictionary of published events.
     * @type {{}}
     * @private
     */
    var eventPublishDictionary_ = {};

    /**
     * An array of all publishable events.
     * TODO: Consider a set, then we can test event types to make sure they
     * should be propagated.
     * @type {Array.<string>}
     */
    var publishableBrowserEvents_ = [
        "click", "dblclick", "mousedown", "mouseup", "mousemove",
        "keydown", "keypress", "keyup",
        "touchstart", "touchend", "touchmove", "touchcancel",
        "pointerdown", "pointerup", "pointercancel", "pointermove"
    ];

    /**
     * TODO: Consider polyfill for forEach.
     */
    publishableBrowserEvents_.forEach(function (eventName) {
        eventPublishDictionary_[eventName] = {
            active: false,
            publish: function (e) {
                wapi.publish(eventName, new BrowserEvent(e));
            }
        }
    });
    //</editor-fold>


    //<editor-fold desc="Public API">
    var wapi = {
        widgetID: widgetID_
    };

    /**
     * Subscribe to a topic
     * @param {string} topicName name of topic.
     * @param {function} func to handle topic messages.
     */
    wapi.subscribe = function (topicName, func) {

        if (!TopicMap_[topicName])
        {
            TopicMap_[topicName] = new TopicHandler_(topicName);
        }
        TopicMap_[topicName].addHandler(func);

        /* Tell parent I am subscribing to topic. */
        if (window.parent != window)
        {
            window.parent.postMessage(new TopicMessage_("methodSubscribe", topicName, true), "*");
        }
    };

    /**
     * Unsubscribe from a topic
     * @param {string} topicName
     * @param {function} func to remove.
     */
    wapi.unsubscribe = function (topicName, func) {
        if (TopicMap_[topicName])
        {
            var topic = TopicMap_[topicName];
            topic.removeHandler(func);

            if (!topic.anyHandlers() && !topic.anySubscribers())
            {
                window.parent.postMessage(new TopicMessage_("methodUnsubscribe", topicName, true), "*");
                delete TopicMap_[topicName];
            }
        }
    };


    /**
     * Publish a message topic.
     * @param {string} topicName
     * @param {*} data to publish.
     */
    wapi.publish = function (topicName, data) {
        publish_(topicName, new TopicMessage_("methodPublish", topicName, true, data), window);
    };

    /**
     * Send a message topic to a specific iframe.
     * @param {Window} win -.
     * @param {string} topicName -.
     * @param {*} data to publish.
     */
    wapi.send = function (win, topicName, data) {
        win.postMessage(new TopicMessage_("methodPublish", topicName, false, data), "*");
    };

    /**
     * Returns an array of non system subscriptions
     * @returns {Array}
     */
    wapi.subscriptions = function () {
        // there are a few subscriptions are all components
        // subscribe to at startup, so no need to broadcast
        // these, we will remove.
        var sysLevelSubscriptions = ["sysReady", "sysShutdown", "sysEventSubscribe", "sysEventUnsubscribe"];

        var subscriptions = [];

        for (var key in TopicMap_)
        {
            if (TopicMap_.hasOwnProperty(key))
            {
                if (sysLevelSubscriptions.indexOf(key) < 0)
                {
                    subscriptions.push(key);
                }
            }
        }
        return subscriptions;
    };
    //</editor-fold>

    //<editor-fold desc="Subscriptions">
    /**
     * Startup
     * Collect the paths of widget ids, not sure if this is still needed.
     * Publish events to components that are now ready.
     */
    wapi.subscribe("sysReady", function (msg) {
        /* this is provisional, may not need it */
        var ids = [];

        for (var i = 0; i < msg.widgetPath_.length; i++)
        {
            ids.push(msg.widgetPath_[i].widgetid_);
        }

        if (verbose_)
        {
            window.console.log(window.document.URL + "-" + widgetID_ + "   received ready: " + ids.join(", "));
        }
        /* end provisional, may not need it */

        var events = subscribedEvents_();
        if (events.length)
        {
            wapi.publish("sysEventSubscribe", events);
        }
    });

    /**
     * Shutdown - is
     */
    wapi.subscribe("sysShutdown", function (msg) {
        if (verbose_)
        {
            window.console.log("sysShutdown: " + msg);
        }
    });

    /**
     *
     */
    wapi.subscribe("sysEventSubscribe", function (msg) {

        /**
         * Adds listener for events and then propagates those events
         * to the parent window
         * @param {Array.<string>} events to propagte.
         */
        function publishEvents(events) {
            for (var i = 0; i < events.length; i++)
            {
                var key = events[i];
                if (eventPublishDictionary_[key])
                {
                    if (!eventPublishDictionary_[key].active)
                    {
                        window.addEventListener(key, eventPublishDictionary_[key].publish, false);
                        eventPublishDictionary_[key].active = true;
                    }
                }
            }
        }


        if (verbose_)
        {
            window.console.log(window.document.URL + " - eventSubscribe: " + msg);
        }

        if (msg instanceof Array)
        {
            publishEvents(msg);
        }
        else if (typeof(msg) === "string")
        {
            publishEvents([msg]);
        }
    });

    /**
     *
     */
    wapi.subscribe("sysEventUnsubscribe", function (msg) {
        /**
         * Removes listener for events
         * @param {Array.<string>} events to remove.
         */
        function unpublishEvents(events) {
            for (var i = 0; i < events.length; i++)
            {
                var key = events[i];
                if (eventPublishDictionary_[key])
                {
                    if (eventPublishDictionary_[key].active)
                    {
                        window.removeEventListener(key, eventPublishDictionary_[key].publish, false);
                        eventPublishDictionary_[key].active = false;
                    }
                }
            }
        }


        if (verbose_)
        {
            window.console.log(window.document.URL + " - eventUnsubscribe: " + msg);
        }

        if (msg instanceof Array)
        {
            unpublishEvents(msg);
        }
        else if (typeof(msg) === "string")
        {
            unpublishEvents([msg]);
        }
        else
        {
            assert_(false, "unknown event type");
        }
    });
    //</editor-fold>


    //<editor-fold desc="Event Listeners">
    /**
     * TODO: is there a better name for message?
     * The message handler.
     */
    window.addEventListener("message", function (event) {
        /**
         * Subscribe to a topic.
         * @param {Window} srcWin -.
         * @param {TopicMessage_} message -.
         */
        function methodSubscribe(srcWin, message) {
            var topicName = message.payload.topic;
            var srcWidgetID = message.widgetSourceID_;

            if (!TopicMap_[topicName])
            {
                TopicMap_[topicName] = new TopicHandler_();
            }
            TopicMap_[topicName].addSubscriber(srcWin, srcWidgetID);
            if (window.parent != window)
            {
                window.parent.postMessage(new TopicMessage_("methodSubscribe", topicName, true), "*");
            }
        }


        /**
         * Unsubscribe from the topic.
         * @param {Window} srcWin -.
         * @param {TopicMessage_} message -.
         */
        function methodUnscribe(srcWin, message) {
            var topicName = message.payload.topic;

            if (TopicMap_[topicName])
            {
                var topic = TopicMap_[topicName];
                topic.removeSubscriber(srcWin);

                if (!topic.anyHandlers() && !topic.anySubscribers())
                {
                    window.parent.postMessage(new TopicMessage_("methodUnsubscribe", topicName, true), "*");
                    delete TopicMap_[topicName];
                }
            }
        }


        /**
         * Publish the message to parent, child windows, and local handlers.
         * @param {Window} srcWin of message.
         * @param {TopicMessage_} message -.
         */
        function methodPublish(srcWin, message) {

            var topicName = message.payload.topic;

            publish_(topicName, message, srcWin);
        }


        /**
         * System publish, right now just going up to parents.
         * @param {Window} srcWin of message.
         * @param {TopicMessage_} message -.
         */
        function methodSystem(srcWin, message) {

            var topicName = message.payload.topic;

            systemPublish_(topicName, message, srcWin);
        }


        if (event.data.type_ === "message")
        {
            if (verbose_)
            {
                window.console.log(document.URL + " - " + event.data.method + ": [" + event.data.payload.topic + "]");
            }
            switch (event.data.method)
            {
                case "methodSubscribe":
                    methodSubscribe(event.source, event.data);
                    break;

                case "methodUnsubscribe":
                    methodUnscribe(event.source, event.data);
                    break;

                case "methodPublish":
                    methodPublish(event.source, event.data);
                    break;

                case "methodReady":
                    methodSystem(event.source, event.data);
                    break;

                default:
                    window.console.error("unknown method");
                    break;
            }
        }
    });


    /**
     *  TODO: pick the right event to publish READY
     *  load, DOMContentLoaded, other?
     */
    window.addEventListener("DOMContentLoaded", function () {
        /* this will distribute the ready topic to
         * just my ancestors.
         */
        publishToParent_("sysReady", "ready");
    }, false);


    /**
     * TODO: pick the correct inverse.
     */
    window.addEventListener("unload", function () {
        /* this will distribute the unready topic to
         * just my ancestors.
         */

        if (verbose_)
        {
            window.console.log("*************unload: " + wapi.subscriptions().join(",") + "   " + subscribedEvents_().join(","));
        }

        //unpublishEvents_(subscribedEvents_());

        publishToParent_("sysShutdown", document.URL);
    }, false);
    //</editor-fold>


    //<editor-fold desc="DEBUGGING">
    if (DEBUG)
    {
        wapi.dbgANote = "Any property starting with dbg should be removed in a release build";

        /**
         * Debugging - call this from the javascript console window to see
         * what events have been subscribed to
         * @return {Array.<string>} Events registered.
         */
        function dbgPublishedEvents_() {
            var publishedEvents = [];
            for (var key in eventPublishDictionary_)
            {
                if (eventPublishDictionary_.hasOwnProperty(key))
                {
                    if (eventPublishDictionary_[key].active)
                    {
                        publishedEvents.push(key);
                    }
                }
            }
            return publishedEvents;
        }

        verbose_ = true;

        wapi.dbgTopicMap = TopicMap_;
        wapi.dbgVerbose = verbose_;
        wapi.dbgSubscribedEvents = subscribedEvents_;
        wapi.dbgAssert = assert_;

        wapi.dbgPublishedEvents = dbgPublishedEvents_;
    }
    //</editor-fold>

    window.wapi = wapi;
})();