thoughts on the widget api
========

single accessible window object - wapi

methods on that object
wapi
	.initalize -- start up the api mechanism, bind up event handlers
	.Message -- message constructor
		{
			type_ : "message",
			method : "publish/subscribe/unsubscribe/request/respond",
			bubbles : true/false,
			timestamp : new Date().getTime(),
			id : uuid, // the id of the message
			payload : {
				topic : string,
				id : widgetid, // the id of the widget/page
				message : string,
				originalEvent : {
					// constructed object from event with pertinent info
					// prevents getting a parse error by trying to pass whole object
					// and the parent window won't care about the original event target, etc...
				}
			}
		}
	.publish -- publish a message
	.subscribe -- subscribe to a chain
	.unsubscribe - unsubscribe to a chain
	.request -- one-time request (lightbox, stop all, etc...)
	.respond -- response to one-time request
	
private methods for wapi
private
	.uuid - gen a uuid for the widget to self identify
	.messageHandlers - handle the incoming messages
	.passEvent - uses the native event's [bubbles] option to know whether or not to pass along to parent window. This would respect the stop propagation that the native event relies on, to prevent the parent window from receiving a message about an event that the widget has asked to stop propagation on.
	
questions
--------------

* should the widget api include an "always subscribed" methodology for stop events? That way, the parent window can "pause" the widget, even if the widget has never subscribed to the topic from the parent.