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


/* Hash of topicName {string} to iframe element reference and handler. */
window.TopicMap_ = {};


/**
 * @return {string} a uuid.
 */
window.generateUUID = function () {
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
window.widgetID = window.generateUUID();


/**
 * Constructor for messages.
 * @param {string} method -.
 * @param {string} topicName -.
 * @param {Object | string | undefined} opt_data
 * @constructor
 */
window.TopicMessage = function (method, topicName, opt_data) {
    this.type_ = "message";
    this.widgetID = window.widgetID;
    this.messageSource = window.widgetID;
    this.id = window.generateUUID();
    this.method = method;
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
window.TopicSubscribe = function (topicName, func) {

    if (!window.TopicMap_[topicName])
    {
        window.TopicMap_[topicName] = {
            subscribers: [],
            handler: null /* can we have more than one handler? */
        }
    }
    window.TopicMap_[topicName].handler = func;

    /* Tell parent I am subscribing to topic. */
    window.parent.postMessage(new TopicMessage("subscribe", topicName), "*");
};


/**
 * Unsubscribe from a topic
 * @param {string} topicName
 * @param {Object} data to publish.
 */
window.TopicUnsubscribe = function (topicName) {
    window.parent.postMessage(new TopicMessage("unsubscribe", topicName), "*");
    if (window.TopicMap_[topicName])
    {
        delete window.TopicMap_[topicName];
    }
};


/**
 * Publish a message topic.
 * @param {string} topicName
 * @param {Object} data to publish.
 */
window.TopicPublish = function (topicName, data) {

    var message = new TopicMessage("publish", topicName, data);

    /* send to parent */
    if (window.parent != window)
    {
        window.console.log("Widget API message: send to parent - " +
                            topicName + ", " + window.document.URL);
        window.parent.postMessage(message, "*");
    }

    /* handle locally */
    if (window.TopicMap_[topicName] && window.TopicMap_[topicName].handler)
    {
        /* there is a local handler */
        window.console.log("Widget API message: handle locally - " + topicName + ", " + window.document.URL);
        window.TopicMap_[topicName].handler(message.payload.message);
    }

    /* send to children */
    /* TODO: figure out how to call querySelector on epub:type="widget" */
    var widgets = window.document.querySelectorAll(".widget");

    for (var i = 0; i < widgets.length; i++)
    {
        window.console.log("Widget API message: child - " + topicName);
        widgets[i].contentWindow.postMessage(message, "*");
    }
};


/**
 * Send a message topic to a specific iframe.
 * @param {Window} win -.
 * @param {string} topicName -.
 * @param {Object} data to publish.
 */
window.TopicSend = function (win, topicName, data) {
    win.postMessage(new TopicMessage("publish", topicName, data), "*");
};


window.addEventListener("message", function (event) {

    /**
     * Subscribe to a topic.
     * @param {string} topicName - name of topic.
     * @param {Event} event -.
     */
    function subscribe(topicName, event) {
        if (!window.TopicMap_[topicName])
        {
            window.TopicMap_[topicName] = {
                subscribers: [],
                handler: null
            }
        }

        /* Don"t add duplicate subscriptions. */
        if (window.TopicMap_[topicName].subscribers.indexOf(event.source) >= 0)
        {
            return;
        }
        window.TopicMap_[topicName].subscribers.push(event.source);
    }


    /**
     * Unsubscribe from the topic.
     * @param {string} topicName - name of topic.
     * @param {Event} event -.
     */
    function unsubscribe(topicName, event) {
        if (!window.TopicMap_[topicName])
        {
            return;
        }

        var index = window.TopicMap_[topicName].subscribers.indexOf(event.source);
        if (index >= 0)
        {
            window.TopicMap_[topicName].subscribers.splice(index, 1);
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

        if (message.messageSource != window.widgetID)
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
            if (window.TopicMap_[topicName] && window.TopicMap_[topicName].handler)           
            {
                /* there is a local handler */
                window.console.log("Widget API message2: handle locally - " +
                                   topicName + ", " + window.document.URL);
                window.TopicMap_[topicName].handler(message.payload.message);
            }

            /* send to children */
            var widgets = window.document.querySelectorAll(".widget");

            if (widgets.length)
            {
                message.messageSource = window.widgetID;
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
});


window.console.log("Widget API is loaded for " + window.document.URL);
