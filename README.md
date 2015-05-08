# WARNING
This repository is no longer under active development. Please refer to https://github.com/IDPF/scriptable-components for the latest development work on EPUB Scriptable Components.

# IDPF ePub Widget Framework

This open source framework is a collection of interactive widgets based on the Open Web Platform. 
The goal is to form a common, standards-based foundation for Widgets in ePubs.

## Contributing to ePub Widgets Framework

Looking to contribute something to ePub Widgets Framework? **Here's how you can help:**


### Reporting issues

We only accept issues that are bug reports or feature requests. Bugs must be isolated and reproducible problems that we can fix within this project. Please read the following guidelines before opening any issue.

1. **Search for existing issues.** We get a lot of duplicate issues, and you'd help us out a lot by first checking if someone else has reported the same issue. Moreover, the issue may have already been resolved with a fix available.
2. **Create an isolated and reproducible test case.** Be sure the problem exists in ePub Widget Framework's code with a [reduced test case](http://css-tricks.com/reduced-test-cases/) that should be included in each bug report.
3. **Include a live example.** Make use of jsFiddle or jsBin to share your isolated test cases.
4. **Share as much information as possible.** Include operating system and version, browser and version, version of ePub Widget Framework, customized or vanilla build, etc. where appropriate. Also include steps to reproduce the bug.



### Pull requests

- Try not to pollute your pull request with unintended changes--keep them simple and small
- Try to share which browsers your code has been tested in before submitting a pull request
- Pull requests should always be against the `dev` branch, never against `master`



### Coding standards

#### JS

- End all lines with a semi-colon
- Comma last
- Indent of 4 spaces, remove tabs.
- Make it readable and attractive
- Modern screens can handle vertical space, use brackets on their own lines for visual clarity of blocks
- Please use jsDoc annotations/comments to add typing information.

#### HTML

- Indent of 4 spaces, remove tabs.
- Double quotes only, never single quotes
- Use tags and elements appropriate for an HTML5 doctype (e.g., self-closing tags)
- Use CDNs and HTTPS for third-party JS when possible. We don't use protocol-relative URLs in this case because they break when viewing the page locally via `file://`

#### CSS

- Adhere to the [RECESS CSS property order](http://markdotto.com/2011/11/29/css-property-order/)
- Multiple-line approach (one property and value per line)
- Always a space after a property's colon (e.g., `display: block;` and not `display:block;`)
- End all lines with a semi-colon
- For multiple, comma-separated selectors, place each selector on its own line
- Attribute selectors, like `input[type="text"]` should always wrap the attribute's value in double quotes, for consistency and safety (see this [blog post on unquoted attribute values](http://mathiasbynens.be/notes/unquoted-attribute-values) that can lead to XSS attacks)




### License

By contributing your code, you agree to license your contribution under the [MIT](http://opensource.org/licenses/MIT) license.
