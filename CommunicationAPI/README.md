# IDPF ePub Widget Framework

This open source framework is a collection of interactive widgets based 
on the Open Web Platform. 
The goal is to form a common, standards-based foundation for Widgets in ePubs.

This folder contains prototype code for the code that will allow 
communication between RS, EPUB and Widgets where these entities exist 
in domains preventing XSS.

        TODO
        1. Get basic pub/sub code working.
        2. Get naming conventions correct.
        3. Document for standards doc - message schema, topic names, 
           use of sendMessage, expected behaviors
        4. Understand performance characteristics of postMessage vs. dispatchEvent for
           propagating events.

### Installation
    Get a recent version of node.
    cd CommunicationAPI
    npm install

    There are some issues on windows running npm, among them:

        http://stackoverflow.com/questions/25093276/nodejs-windows-error-enoent-stat-c-users-rt-appdata-roaming-npm
        
        On a clean install of windows i have found npm install to fail, 
          but npm install napa, followed by npm install to work.
### Samples
    to run:
        If this is the first time running the widgets, install connect, this is
        a one time process.
        **npm install connect**
        node server.js - starts up a local http server on 8080
	index.html presents some choices.

    the samples are a work in progress...


### Units Tests
      have been run on most of the popular recent browsers
      some unit tests require additions to host file 

### Coding standards

#### JS

- End all lines with a semi-colon
- Comma last
- Indent of 4 spaces, remove tabs.
- Make it readable and attractive
- Modern screens can handle vertical space, use brackets on their own 
  lines for visual clarity of blocks
- Please use jsDoc annotations/comments to add typing information.

#### HTML

- Indent of 4 spaces, remove tabs.
- Double quotes only, never single quotes
- Use tags and elements appropriate for an HTML5 doctype (e.g., self-closing tags)
- Use CDNs and HTTPS for third-party JS when possible. We don"t use
  protocol-relative URLs in this case because they break when viewing the page 
  locally via `file://`

#### CSS

- Adhere to the [RECESS CSS property order](http://markdotto.com/2011/11/29/css-property-order/)
- Multiple-line approach (one property and value per line)
- Always a space after a property"s colon (e.g., `display: block;` and not `display:block;`)
- End all lines with a semi-colon
- For multiple, comma-separated selectors, place each selector on its own line
- Attribute selectors, like `input[type="text"]` should always wrap the 
  attribute"s value in double quotes, for consistency and safety 
  (see this [blog post on unquoted attribute values](
   http://mathiasbynens.be/notes/unquoted-attribute-values) 
   that can lead to XSS attacks)

### License

By contributing your code, you agree to license your contribution under the 
[MIT](http://opensource.org/licenses/MIT) license.
