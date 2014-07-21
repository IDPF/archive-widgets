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
    var wapi = {};

    wapi.verbose = false;

    /* Hash of topicName {string} to iframe element reference and handler. */
    wapi.TopicMap_ = {};

    /**
     * Constructor for topic handler.
     * @param {string} topicname -.
     * @constructor
     */
    wapi.TopicHandler_ = function (topicName) {
        this.topic_ = topicName;
        this.subscribers_ = [];
        this.handlers_ = [];
    };


    /**
     * @param {function} f new handler.
     */
    wapi.TopicHandler_.prototype.addHandler = function (f) {
        this.handlers_.push(f);
    };


    /**
     * @param {function} f new handler.
     */
    wapi.TopicHandler_.prototype.removeHandler = function (f) {
        var i = this.handlers_.indexOf(f);
        if (i >= 0)
        {
            this.handlers_.splice(i, 1);
        }
    };


    wapi.TopicHandler_.prototype.callHandlers = function (data) {
        for (var i = 0; i < this.handlers_.length; i++)
        {
            this.handlers_[i](data.payload.message);
        }
    };

    wapi.TopicHandler_.prototype.anyHandlers = function () {
        return this.handlers_.length > 0;
    };

    /**
     * @param {} s subscriber.
     */
    wapi.TopicHandler_.prototype.addSubscriber = function (s) {
        /**
         * Need to protect against duplicate subscribers,
         * which happens when a child and a grandchild subscribe
         * to the same topic
         */
        if (this.subscribers_.indexOf(s) < 0)
        {
            this.subscribers_.push(s);
        }
    };


    /**
     * @param {} s subscriber.
     */
    wapi.TopicHandler_.prototype.removeSubscriber = function (s) {
        // Find and remove item from an array
        var i = this.subscribers_.indexOf(s);
        if (i >= 0)
        {
            this.subscribers_.splice(i, 1);
        }
    };


    wapi.TopicHandler_.prototype.callSubscribers = function (message) {
        for (var i = 0; i < this.subscribers_.length; i++)
        {
            this.subscribers_[i].postMessage(message, "*");
        }
    };


    wapi.TopicHandler_.prototype.anySubscribers = function () {
        return this.subscribers_.length > 0;
    };

    /**
     * @return {string} a uuid.
     */
    wapi.generateUUID = function () {
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
     */
    wapi.widgetID = wapi.generateUUID();


    /**
     * start time of widget code.
     * @type {Date} starttime
     * for debugging startup
     */
    wapi.startTime = new Date().getTime();

    /**
     * Constructor for messages.
     * @param {string} method -.
     * @param {string} topicName -.
     * @param {boolean} capture -.
     * @param {Object | string | undefined} opt_data
     * @constructor
     */
    wapi.TopicMessage_ = function (method, topicName, capture, opt_data) {
        this.type_ = "message";
        this.widgetID = wapi.widgetID;
        this.messageSource = wapi.widgetID;
        this.id = wapi.generateUUID();
        this.method = method;
        this.capture = capture;
        this.payload = {};
        this.payload.topic = topicName;
        if (opt_data)
        {
            this.payload.message = opt_data;
        }
    };


    /**
     * Subscribe to a topic
     * @param {string} topicName name of topic.
     * @param {function} func to handle topic messages.
     */
    wapi.subscribe = function (topicName, func) {

        if (!wapi.TopicMap_[topicName])
        {
            wapi.TopicMap_[topicName] = new wapi.TopicHandler_(topicName);
        }
        wapi.TopicMap_[topicName].addHandler(func);

        /* Tell parent I am subscribing to topic. */
        if (window.parent != window)
        {
            window.parent.postMessage(new wapi.TopicMessage_("subscribe", topicName, true), "*");
        }
    };


    /**
     * Unsubscribe from a topic
     * @param {string} topicName
     * @param {Object} data to publish.
     */
    wapi.unsubscribe = function (topicName, func) {
        if (wapi.TopicMap_[topicName])
        {
            var topic = wapi.TopicMap_[topicName];
            topic.removeHandler(func);

            if (!topic.anyHandlers() && !topic.anySubscribers())
            {
                window.parent.postMessage(new wapi.TopicMessage_("unsubscribe", topicName, true), "*");
                delete wapi.TopicMap_[topicName];
            }
        }
    };


    /**
     * Publish a message topic.
     * @param {string} topicName
     * @param {*} data to publish.
     */
    wapi.publish = function (topicName, data) {
        wapi.publish_(topicName, new wapi.TopicMessage_("publish", topicName, true, data));
    };


    /**
     * Publish a message topic.
     * @param {string} topicName
     * @param {TopicMessage_} message to publish.
     * @private
     */
    wapi.publish_ = function (topicName, message) {
        var topic = wapi.TopicMap_[topicName];

        if (wapi.verbose)
        {
            window.console.log("Widget API message: send to parent - " +
                                   topicName + ", " + window.document.URL);
        }

        if (window.parent === window)
        {
            /* we have reached the parent,
             * this will need to be tweaked to account for RS
             */
            message.capture = false;
        }

        if (message.capture === true)
        {
            /* still in capture phase, send to parent */
            window.parent.postMessage(message, "*");
        }
        else if (topic)
        {
            /* walk back down the tree */
            topic.callHandlers(message);
            topic.callSubscribers(message);
        }
    };


    /**
     * Send a message topic to a specific iframe.
     * @param {Window} win -.
     * @param {string} topicName -.
     * @param {{*}} data to publish.
     */
    wapi.send = function (win, topicName, data) {
        win.postMessage(new wapi.TopicMessage_("publish", topicName, false, data), "*");
    };


    window.addEventListener("message", function (event) {

        /**
         * Subscribe to a topic.
         * @param {string} topicName - name of topic.
         * @param {Event} event -.
         */
        function subscribe(topicName, event) {
            if (!wapi.TopicMap_[topicName])
            {
                wapi.TopicMap_[topicName] = new wapi.TopicHandler_(topicName);
            }
            wapi.TopicMap_[topicName].addSubscriber(event.source);
            if (window.parent != window)
            {
                window.parent.postMessage(new wapi.TopicMessage_("subscribe", topicName, true), "*");
            }
        }


        /**
         * Unsubscribe from the topic.
         * @param {string} topicName - name of topic.
         * @param {Event} event -.
         */
        function unsubscribe(topicName, event) {
            if (wapi.TopicMap_[topicName])
            {
                var topic = wapi.TopicMap_[topicName];
                topic.removeSubscriber(event.source);

                if (!topic.anyHandlers() && !topic.anySubscribers())
                {
                    window.parent.postMessage(new wapi.TopicMessage_("unsubscribe", topicName, true), "*");
                    delete wapi.TopicMap_[topicName];
                }
            }
        }


        /**
         * Publish the message to parent, child windows, and local handlers.
         * @param {Window} srcWin of message.
         * @param {Object} message -.
         */
        function publish(srcWin, message) {

            var topicName = message.payload.topic;

            wapi.publish_(topicName, message);
        }


        if (event.data.type_ === "message")
        {
            switch (event.data.method)
            {
                case "subscribe":
                    subscribe(event.data.payload.topic, event);
                    break;

                case "unsubscribe":
                    unsubscribe(event.data.payload.topic, event);
                    break;

                case "publish":
                    publish(event.source, event.data);
                    break;


                default:
                    window.console.error("unknown method");
                    break;
            }
        }
    });


    window.wapi = wapi;

    /* startup - not entirely clear if this will suffice */
    wapi.subscribe("ready", function (msg) {
        window.console.log(window.document.URL + ": " + wapi.widgetID + ":" + msg);
    });

    wapi.publish("ready", window.document.URL + " - " + wapi.widgetID + ", " + wapi.startTime);

    window.console.log("Widget API is loaded for " + wapi.widgetID + ", " + window.document.URL);

})();