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
 *     1. This code broadcasts to all nodes/widgets in the hierarchy,
 *        we need to revisit strategies to optimize this.
 *     2. Encapsulate code
 *     3. Clean up signatures
 *     4. Get naming right
 *     5. Determine if we have timing issues
 */

/* anonymous function closure */
!function(){
    var wapi = {
        /* Hash of topicName {string} to iframe element reference and handler. */
        TopicMap_ : {},
        /* Initialize function called at the same time as the wapi object is assigned to window */
        initialize : function(){
            window.console.log("Widget API is loaded for " + window.document.URL);
            /* add the event listener for message, and point to the handler */
            window.addEventListener("message", Private.handler);
			// possibly add a mutation observer here to observe the dom nodes with
			// iframes. If it's hidden, then send it a pause message automatically
        },
        /**
         * Constructor for messages.
         * @param {string} method -.
         * @param {string} topicName -.
         * @param {Object | string | undefined} opt_data
         * @constructor
         */
        Message : function (method, topicName, opt_data, bubbles, originalEvent) {
            this.type_ = "message";
            this.method = method;
            this.bubbles = bubbles ? bubbles : true; // bubbles defaults to true
            this.timestamp = new Date().getTime(); // date string
            this.id = Private.generateUUID();
            this.payload = {};
            this.payload.id = wapi.widgetID;
            this.payload.topic = topicName;
            if (opt_data) this.payload.message = opt_data;
            if(originalEvent)
            {
                this.payload.originalEvent = {};
                // selectively rebuild the event to prevent circular logic
                // this is fairly in-elegant, might need some thinking
                for(var key in originalEvent)
                {
                    var item = originalEvent[key];
                    if(key == "clientX" || key == "clientY" || key == "charCode" || key == "keyCode" || key == "pageX" || key == "pageY" || key == "screenX" || key == "screenY" || key == "offsetX" || key == "offsetY" || key == "type")
                    {
                        this.payload.originalEvent[key] = item;
                    }
                }
            }
        },
        /**
         * Subscribe to a topic
         * @param {string} topicName name of topic.
         * @param {function} func to handle topic messages.
         */
        subscribe : function (topicName, func) {

            if (!this.TopicMap_[topicName])
            {
                this.TopicMap_[topicName] = {
                    subscribers: [],
                    handler: null /* can we have more than one handler? */
                }
            }
            this.TopicMap_[topicName].handler = func;

            /* Tell parent I am subscribing to topic. */
            window.parent.postMessage(new this.Message("subscribe", topicName), "*");
        },
        /**
         * Unsubscribe from a topic
         * @param {string} topicName
         * @param {Object} data to publish.
         */
        unsubscribe : function (topicName) {
            window.parent.postMessage(new this.Message("unsubscribe", topicName), "*");
            if (this.TopicMap_[topicName])
            {
                delete this.TopicMap_[topicName];
            }
        },
        /**
         * Publish a message topic.
         * @param {string} topicName
         * @param {Object} data to publish.
         */
        publish : function (topicName, data) {

            var message = new this.Message("publish", topicName, data);

            /* send to parent */
            if (window.parent != window)
            {
                window.console.log("Widget API message: send to parent - " +
                                    topicName + ", " + window.document.URL);
                window.parent.postMessage(message, "*");
            }

            /* handle locally */
            if (this.TopicMap_[topicName] && this.TopicMap_[topicName].handler)
            {
                /* there is a local handler */
                window.console.log("Widget API message: handle locally - " + topicName + ", " + window.document.URL);
                this.TopicMap_[topicName].handler(message.payload.message);
            }

            /* send to children */
            /* TODO: figure out how to call querySelector on epub:type="widget" */
            var widgets = window.document.querySelectorAll(".widget");

            for (var i = 0; i < widgets.length; i++)
            {
                window.console.log("Widget API message: child - " + topicName);
                widgets[i].contentWindow.postMessage(message, "*");
            }
        },
        /**
         * Send a message topic to a specific iframe.
         * @param {Window} win -.
         * @param {string} topicName -.
         * @param {Object} data to publish.
         */
        sendMessage : function (win, topicName, data) {
            // re-work this so that publish can be used instead
            // make publish accept a target object
            win.postMessage(new this.Message("publish", topicName, data), "*");
        }
    },
    Private = {
        /**
         * @return {string} a uuid.
         */
        generateUUID : function () {
            var d = new Date().getTime();
            var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == "x" ? r : (r & 0x7 | 0x8)).toString(16);
            });
            return uuid;
        },
        handler : function(event){
            /**
             * Subscribe to a topic.
             * @param {string} topicName - name of topic.
             * @param {Event} event -.
             */
            function subscribe(topicName, event) {
                if (!wapi.TopicMap_[topicName])
                {
                    wapi.TopicMap_[topicName] = {
                        subscribers: [],
                        handler: null
                    }
                }

                /* Don"t add duplicate subscriptions. */
                if (wapi.TopicMap_[topicName].subscribers.indexOf(event.source) >= 0)
                {
                    return;
                }
                wapi.TopicMap_[topicName].subscribers.push(event.source);
            }


            /**
             * Unsubscribe from the topic.
             * @param {string} topicName - name of topic.
             * @param {Event} event -.
             */
            function unsubscribe(topicName, event) {
                if (!wapi.TopicMap_[topicName])
                {
                    return;
                }

                var index = wapi.TopicMap_[topicName].subscribers.indexOf(event.source);
                if (index >= 0)
                {
                    wapi.TopicMap_[topicName].subscribers.splice(index, 1);
                }
            }


            /**
             * Broadcast the message to parent, child windows, and local handlers.
             * @param {Window} srcWin of message.
             * @param {Object} message -.
             */
            function broadcastTopic(srcWin, message) {
                /* this code is largely a dup of above, fix */

                var topicName = message.payload.topic;

                if (message.payload.id != wapi.widgetID)
                {
                    if (window.parent != window)
                    {
                        /* ideally we would know that the message came from the parent and
                         * not feel the necessity to make this call :-)
                         */
                        window.console.log("Widget API message2: send to parent - " +
                                           topicName + ", " + window.document.URL);
                        window.parent.postMessage(message, "*");
                    }

                    /* handle locally, the assumption is that there is one handler per widget/window */
                    if (wapi.TopicMap_[topicName] && wapi.TopicMap_[topicName].handler)           
                    {
                        /* there is a local handler */
                        window.console.log("Widget API message2: handle locally - " +
                                           topicName + ", " + window.document.URL);
                        wapi.TopicMap_[topicName].handler(message.payload.message);
                    }

                    /* send to children */
                    var widgets = window.document.querySelectorAll(".widget");

                    if (widgets.length)
                    {
                        message.payload.id = wapi.widgetID;
                        for (var i = 0; i < widgets.length; i++)
                        {
                            window.console.log("Widget API message: child - " + topicName);
                            widgets[i].contentWindow.postMessage(message, "*");
                        }
                    }
                }
            }

            if (event.data.type_ === "message")
            {
                switch (event.data.method)
                {
                    case "subscribe":
                        window.console.log("Widget API message: subscribe - " +
                                            event.data.payload.topic + ", " + window.document.URL);
                        subscribe(event.data.payload.topic, event);
                        break;

                    case "unsubscribe":
                        window.console.log("Widget API message: unsubscribe - " +
                                            event.data.payload.topic + ", " + window.document.URL);
                        unsubscribe(event.data.payload.topic, event);
                        break;

                    case "publish":
                        broadcastTopic(event.source, event.data);
                        break;

                    default:
                        window.console.error("unknown method");
                        break;
                }
            }
        }
    }
    
    /**
     * ID of widget
     * @type {string} guid -.
     */
    wapi.widgetID = Private.generateUUID()

    /* declare the wapi object on the window */
    window.wapi = wapi
    
    /* initialize the widget API */
    wapi.initialize()
}()