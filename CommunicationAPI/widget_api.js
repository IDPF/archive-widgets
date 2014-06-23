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
        subscriptions_ : {},
        eventCounter : 0, // sample purposes only
        
        /** 
         * Initialize function called at the same time as the wapi object is assigned to window
        */
        initialize : function(){
            window.console.log("Widget API is loaded for " + window.document.URL);
            /* add the event listener for message, and point to the handler */
            window.addEventListener("message", function(e){
                // bind to Private to get the "this" scope right
                var handler = Private.handler.bind(Private);
                handler(e);
            });
            
            /**
             * ID of widget
             * @type {string} guid -.
             */
            wapi.widgetID = Private.generateUUID();
            
			// possibly add a mutation observer here to observe the dom nodes with
			// iframes. If it's hidden, then send it a pause message automatically
			
			/* add in the event listeners for any events we want to pass up through automatically */
			document.addEventListener("click", Private.passEvent); // leaving out everything but click for testing
			//document.addEventListener("mousedown", Private.passEvent);
			//document.addEventListener("mousemove", Private.passEvent);
			//document.addEventListener("mouseup", Private.passEvent);
			//document.addEventListener("touchstart", Private.passEvent);
			//document.addEventListener("touchmove", Private.passEvent);
			//document.addEventListener("touchend", Private.passEvent);
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
         * @param {object} win is the target window object.
         * @param {string} topicName name of topic.
         * @param {function} func to handle topic messages.
         */
        subscribe : function (win, topicName, func) {

            if (!this.subscriptions_[topicName])
            {
                this.subscriptions_[topicName] = {
                    subscribers: [],
                    handlers: []
                }
            }
            /* add the handler into the array */
            this.subscriptions_[topicName].handlers.push(func);

            /* Tell window I am subscribing to topic. */
            win.postMessage(new this.Message("subscribe", topicName), "*");
        },
        /**
         * Unsubscribe from a topic
         * @param {object} win is the target window object.
         * @param {string} topicName
         */
        unsubscribe : function (win, topicName) {
            win.postMessage(new this.Message("unsubscribe", topicName), "*");
            if (this.subscriptions_[topicName])
            {
                delete this.subscriptions_[topicName];
            }
        },
        /**
         * Publish a message topic.
         * @param {string} topicName
         * @param {Object} data to publish.
         */
        publish : function (topicName, data) {
            var message = new this.Message("publish", topicName, data);
            /* loop through subscribers and send them the message */
            for(var key in this.subscriptions_[topicName].subscribers) {
                var win = this.subscriptions_[topicName].subscribers[key];
                win.postMessage(message, "*");
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
        
        /**
         * Message an event object up through to the parent window
         * @param {Event} event -.
        */
        passEvent : function(event) {
            if(event.bubbles){
				if(window.parent){
				    // message included for testing only
					var msg = "capture phase "+event.type+":" + wapi.eventCounter++ + " - " + wapi.widgetID,
					    message = new wapi.Message("publish", "event", msg, event.bubbles, event)
					window.parent.postMessage(message, "*")
				}
			}
        },
        
        /**
         * Handle the message event from another window
         * @param {Event} event - original message event.
        */
        handler : function(event) {
            if (event.data.type_ === "message")
            {
                switch (event.data.method)
                {
                    case "subscribe":
                        window.console.log("Widget API message: subscribe - " +
                                            event.data.payload.topic + ", " + window.document.URL);
                        this.subscribe(event.data.payload.topic, event);
                        break;

                    case "unsubscribe":
                        window.console.log("Widget API message: unsubscribe - " +
                                            event.data.payload.topic + ", " + window.document.URL);
                        this.unsubscribe(event.data.payload.topic, event);
                        break;

                    case "publish":
                        this.broadcastTopic(event.source, event.data);
                        break;

                    default:
                        window.console.error("unknown method");
                        break;
                }
            }
        },
        
        /**
         * Subscribe to a topic.
         * @param {string} topicName - name of topic.
         * @param {Event} event -.
         */
        subscribe : function(topicName, event) {
            if (!wapi.subscriptions_[topicName])
            {
                wapi.subscriptions_[topicName] = {
                    subscribers: [],
                    handlers: null
                }
            }

            /* Don"t add duplicate subscriptions. */
            if (wapi.subscriptions_[topicName].subscribers.indexOf(event.source) >= 0)
            {
                return;
            }
            wapi.subscriptions_[topicName].subscribers.push(event.source);
        },
        
        /**
         * Unsubscribe from the topic.
         * @param {string} topicName - name of topic.
         * @param {Event} event -.
         */
        unsubscribe : function(topicName, event) {
            if (!wapi.subscriptions_[topicName])
            {
                return;
            }

            var index = wapi.subscriptions_[topicName].subscribers.indexOf(event.source);
            if (index >= 0)
            {
                wapi.subscriptions_[topicName].subscribers.splice(index, 1);
            }
        },
        
        /**
         * Broadcast the message to parent, child windows, and local handlers.
         * @param {Window} srcWin of message.
         * @param {Object} message -.
         */
        broadcastTopic : function(srcWin, message) {
            var topicName = message.payload.topic;
            
            if(topicName == "event" && message.payload.id != wapi.widgetID)
            {
                /* events are broadcast up to the parents no matter what */
                if (window.parent != window && message.bubbles)
                {
                    window.console.log("Widget API message2: send to parent - " +
                                       topicName + ", " + window.document.URL);
                    window.parent.postMessage(message, "*");
                }

                handleLocal()                    
            }
            else if (message.payload.id != wapi.widgetID)
            {
                /* send to all subscribers */
                if(wapi.subscriptions_[topicName] && wapi.subscriptions_[topicName].subscribers && message.bubbles)
                {
                    for(var key in wapi.subscriptions_[topicName].subscribers)
                    {
                        var win = wapi.subscriptions_[topicName].subscribers[key];
                        win.postMessage(message, "*");
                    }
                }
                
                handleLocal()

            }
            
            function handleLocal()
            {
                /* handle locally */
                if (wapi.subscriptions_[topicName] && wapi.subscriptions_[topicName].handlers)
                {
                    /* there is a local handler */
                    window.console.log("Widget API message: handle locally - " + topicName + ", " + window.document.URL);
                    for(var key in wapi.subscriptions_[topicName].handlers)
                    {
                        var handler = wapi.subscriptions_[topicName].handlers[key];
                        handler(message.payload.message);
                    }
                }
            }
            
        }
    }
    
    /* declare the wapi object on the window */
    window.wapi = wapi
    
    /* initialize the widget API */
    wapi.initialize()
}()