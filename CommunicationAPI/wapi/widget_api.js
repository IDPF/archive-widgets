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

    /* debugging stuff */

    /**
     * Assertion testing function.
     * @param {boolean} book - value of assertion.
     * @param {string} msg to show on failed assertion.
     */
    function debugAssert(bool, msg) {
        if (!bool)
        {
            alert("AssertionFailure: " + msg);
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

    /**
     * @return {string} a uuid.
     */
    function generateUUID_() {
        var d = new Date().getTime();
        var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == "x" ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    };


    /**
     * ID of widget
     * @type {string} guid -.
     * @private
     */
    var widgetID_ = generateUUID_();


    var childIDs_ = {};

    var Widget = {};

    /**
     * Constructor for widgetNode
     * @param {string} id -.
     * @constructor
     */
    Widget = function (id, url) {
        this.path_ = url;
        this.widgetid_ = id;
    };

    /**
     * Child widgets
     * @type {Widget}
     */
    var widgetTree_ = null;


    /**
     * Add widget path to tree
     * @param {Array.<string>} widgetPath - array of ids.
     */
    function addWidgetNode(widgetPath) {
        if (widgetTree_ === null)
        {
            debugAssert(widgetPath[0].widgetid_ === widgetID_);
            widgetTree_ = widgetPath[0];
        }

        function addNode(node, path) {
            if (path.length === 0)
            {
                return;
            }

            var currentid = path[0].widgetid_;

            if (!node.children_)
            {
                node.children_ = {};
            }

            if (!node.children_[currentid])
            {
                node.children_[currentid] = path[0];
            }
            addNode(node.children_[currentid], path.slice(1));
        }

        addNode(widgetTree_, widgetPath.slice(1));
    }

    var findWidgetPath = function (id) {
        var path = [];

        function find(node, id, path) {
            if (node.widgetid_ === id)
            {
                path.push(node.widgetid_);
                return true;
            }

            if (node.children_)
            {
                for (var key in node.children_)
                {
                    if (find(node.children_[key], id, path))
                    {
                        path.unshift(node.widgetid_);
                        return true;
                    }
                }
            }
            return false;
        }

        find(widgetTree_, id, path);
        return path;
    }


    /**
     *
     * @type {{}}
     * @private
     */
    var TopicMap_ = {};


    /**
     * An object to store handlers and subscribers to a
     * topic.
     * @type {{}}
     * @private
     */
    var TopicHandler_ = {};

    /**
     * Constructor for topic handler.
     * @param {string} topicname -.
     * @constructor
     */
    TopicHandler_ = function (topicName) {
        this.topic_ = topicName;

        /**
         * array of iframe window
         * @type {Window}
         */
        this.subscribers_ = [];

        /**
         * array of functions
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

        if (!childIDs_[widgetid])
        {
            childIDs_[widgetid] = win;
        }
        else
        {
            debugAssert(childIDs_[widgetid] === win);
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


    /**
     * start time of widget code.
     * @type {Date} starttime
     * for debugging startup
     */
    var startTime = new Date().getTime();

    /**
     * The message used to pass topics between components/windows.
     * @type {{}}
     * @private
     */
    var TopicMessage_ = {};

    /**
     * Constructor for messages.
     * @param {string} method -.
     * @param {string} topicName -.
     * @param {boolean} capture -.
     * @param {Object | string | undefined} opt_data
     * @constructor
     */
    TopicMessage_ = function (method, topicName, capture, opt_data) {
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

    var wapi = {
        /* debug */
        dbgANote: "Any property starting with dbg should be removed in a release build",
        dbgTopicMap_: TopicMap_,
        dbgVerbose: verbose_,
        dbgChildIDs: childIDs_,
        dbgWidgetTree: widgetTree_,

        widgetID: widgetID_

    };


    /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

    /**
     * Publish a message topic to only my ancestors.
     * @param {string} topicName
     * @param {*} data to publish.
     */
    function publishToParent_(topicName, data) {
        var message = new TopicMessage_("ready", topicName, true, data);
        message.bubbleonly = true;
        message.widgetPath_.unshift(new Widget(widgetID_, document.URL));
        publish_(topicName, message, window);
    };


    /**
     * Publish a message topic.
     * @param {string} topicName
     * @param {TopicMessage_} message to publish.
     * @private
     */
    function publish_(topicName, message) {
        var topic = TopicMap_[topicName];

        if (window.parent === window)
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
    };


    /**
     * System publish, right now just going up to parents.
     * @param {string} topicName
     * @param {TopicMessage_} message to publish.
     * @private
     */
    function systemPublish_(topicName, message) {
        var topic = TopicMap_[topicName];

        if (message.capture === true)
        {
            message.widgetPath_.unshift(new Widget(widgetID_, document.URL));
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
    };


    /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

    /**
     * The message handler.
     */
    window.addEventListener("message", function (event) {
        /**
         * Subscribe to a topic.
         * @param {Window} srcWin -.
         * @param {TopicMessage_} message -.
         */
        function subscribe(srcWin, message) {
            var topicName = message.payload.topic;
            var srcWidgetID = message.widgetSourceID_;

            if (!TopicMap_[topicName])
            {
                TopicMap_[topicName] = new TopicHandler_(topicName);
            }
            TopicMap_[topicName].addSubscriber(srcWin, srcWidgetID);
            if (window.parent != window)
            {
                window.parent.postMessage(new TopicMessage_("subscribe", topicName, true), "*");
            }
        }


        /**
         * Unsubscribe from the topic.
         * @param {Window} srcWin -.
         * @param {TopicMessage_} message -.
         */
        function unsubscribe(srcWin, message) {
            var topicName = message.payload.topic;
            var srcWidgetID = message.widgetSourceID_;

            if (TopicMap_[topicName])
            {
                var topic = TopicMap_[topicName];
                topic.removeSubscriber(srcWin);

                if (!topic.anyHandlers() && !topic.anySubscribers())
                {
                    window.parent.postMessage(new TopicMessage_("unsubscribe", topicName, true), "*");
                    delete TopicMap_[topicName];
                }
            }
        }


        /**
         * Publish the message to parent, child windows, and local handlers.
         * @param {Window} srcWin of message.
         * @param {TopicMessage_} message -.
         */
        function publish(srcWin, message) {

            var topicName = message.payload.topic;

            publish_(topicName, message, srcWin);
        }


        /**
         * System publish, right now just going up to parents.
         * @param {Window} srcWin of message.
         * @param {TopicMessage_} message -.
         */
        function systemPublish(srcWin, message) {

            var topicName = message.payload.topic;

            systemPublish_(topicName, message, srcWin);
        }


        if (event.data.type_ === "message")
        {
            switch (event.data.method)
            {
                case "subscribe":
                    subscribe(event.source, event.data);
                    break;

                case "unsubscribe":
                    unsubscribe(event.source, event.data);
                    break;

                case "publish":
                    publish(event.source, event.data);
                    break;

                case "ready":
                    systemPublish(event.source, event.data);
                    break;

                default:
                    window.console.error("unknown method");
                    break;
            }
        }
    });

    /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

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
            window.parent.postMessage(new TopicMessage_("subscribe", topicName, true), "*");
        }
    };


    /**
     * Unsubscribe from a topic
     * @param {string} topicName
     * @param {Object} data to publish.
     * @param {string} widgetid -.
     */
    wapi.unsubscribe = function (topicName, func) {
        if (TopicMap_[topicName])
        {
            var topic = TopicMap_[topicName];
            topic.removeHandler(func);

            if (!topic.anyHandlers() && !topic.anySubscribers())
            {
                window.parent.postMessage(new TopicMessage_("unsubscribe", topicName, true), "*");
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
        publish_(topicName, new TopicMessage_("publish", topicName, true, data), window);
    };


    /**
     * unused as of yet.
     * @param widgetid
     * @param event
     */
    wapi.directSubscribe = function (widgetid, event) {
        var path = findWidgetPath(widgetid);
        window.console.log("directSubscribe: " + widgetid + ", " + event + ", [" + path.join(",") + "]");
    };

    /**
     * Send a message topic to a specific iframe.
     * @param {Window} win -.
     * @param {string} topicName -.
     * @param {{*}} data to publish.
     */
    wapi.send = function (win, topicName, data) {
        win.postMessage(new TopicMessage_("publish", topicName, false, data), "*");
    };


    /**
     * Returns array of child widget ids.
     * @returns {Array}
     */
    wapi.dbgChildWidgets = function () {
        var ids = [];

        for (var key in childIDs_)
        {
            if (childIDs_.hasOwnProperty(key))
            {
                try
                {
                    ids.push(key + ":" + childIDs_[key].document.URL)
                }
                catch (e)
                {
                    // catch and print out if document.URL can't be accessed
                    // (cross domain violation)
                    ids.push(key + "!")
                }
            }
        }
        return ids;
    };


    /**
     * Returns an array of non system subscriptions
     * @returns {Array}
     */
    wapi.subscriptions = function () {
        // there are a few subscriptions are all components
        // subscribe to at startup, so no need to broadcast
        // these, we will remove.
        var syslevelSubscriptions = ["ready", "eventSubscribe", "eventUnsubscribe"];

        var subscriptions = [];

        for (var key in TopicMap_)
        {
            if (TopicMap_.hasOwnProperty(key))
            {
                if (syslevelSubscriptions.indexOf(key) < 0)
                {
                    subscriptions.push(key);
                }
            }
        }
        return subscriptions;
    };


    /**
     * Returns array of all DOM level events subscribed to.
     * @returns {Array}
     * @private
     */
    function subscribedEvents_() {
        var subscribedEvents = [];

        /* this list of events is provisional,
         * need to explore different ways
         * of getting a list of subscribedEvents
         */
        var potentialEvents = [
            "click", "dblclick", "mousedown", "mouseup",
            "mouseover", "mousemove", "mouseout",
            "keydown", "keypress", "keyup",
            "touchstart", "touchend", "touchmove", "touchenter", "touchleave", "touchcancel",
            "pointerdown", "pointerup", "pointercancel", "pointermove",
            "pointerover", "pointerout", "pointerenter", "pointerleave",
            "gotpointercapture", "lostpointercapture"
        ];

        for (var key in TopicMap_)
        {
            if (TopicMap_.hasOwnProperty(key) && potentialEvents.indexOf(key) > -1)
            {
                subscribedEvents.push(key);
            }
        }
        return subscribedEvents;
    };


    /**
     * Startup
     * Collect the paths of widget ids, not sure if this is still needed.
     * Publish events to components that are now ready.
     */
    wapi.subscribe("ready", function (msg) {
        /* this is provisional, may not need it */
        var ids = [];

        for (var i = 0; i < msg.widgetPath_.length; i++)
        {
            ids.push(msg.widgetPath_[i].widgetid_);
        }
        window.console.log(window.document.URL + "-" + widgetID_ + "   received ready: " + ids.join(", "));
        addWidgetNode(msg.widgetPath_);
        /* end provisional, may not need it */

        var events = subscribedEvents_();
        if (events.length)
        {
            wapi.publish("eventSubscribe", events);
        }
    });


    /**
     *  TODO: pick the right event to publish READY
     */
    window.addEventListener("load", function (e) {
        /* this will distribute the ready topic to
         * just my ancestors.
         */
        publishToParent_("ready", "ready");
    }, false);


    /**
     * TODO: pick the correct inverse.
     */
    window.addEventListener("unload", function (e) {
        /* this will distribute the unready topic to
         * just my ancestors.
         */
    }, false);


    wapi.dbgSubscribedEvents = subscribedEvents_;

    window.wapi = wapi;
})();