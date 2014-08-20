// Copyright 2013 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('goog.PromiseTest');

goog.require('goog.Promise');
goog.require('goog.Thenable');
goog.require('goog.functions');
goog.require('goog.testing.AsyncTestCase');
goog.require('goog.testing.MockClock');
goog.require('goog.testing.PropertyReplacer');
goog.require('goog.testing.jsunit');
goog.require('goog.testing.recordFunction');

goog.setTestOnly('goog.PromiseTest');


// TODO(brenneman):
// - Add tests for interoperability with native Promises where available.
// - Make most tests use the MockClock (though some tests should still verify
//   real asynchronous behavior.
// - Add tests for long stack traces.


var mockClock;
var asyncTestCase = goog.testing.AsyncTestCase.createAndInstall(document.title);
var stubs = new goog.testing.PropertyReplacer();
var unhandledRejections;


// Simple shared objects used as test values.
var dummy = {toString: goog.functions.constant('[object dummy]')};
var sentinel = {toString: goog.functions.constant('[object sentinel]')};


function setUpPage() {
  asyncTestCase.stepTimeout = 5000;
//  mockClock = new goog.testing.MockClock();
}


function setUp() {
  unhandledRejections = goog.testing.recordFunction();
  goog.Promise.setUnhandledRejectionHandler(unhandledRejections);
}


function tearDown() {
  if (mockClock) {
    // The system should leave no pending unhandled rejections. Advance the mock
    // clock to the end of time to catch any rethrows waiting in the queue.
    mockClock.tick(Infinity);
    mockClock.uninstall();
    mockClock.reset();
  }
  stubs.reset();
}


function tearDownPage() {
  goog.dispose(mockClock);
}


function continueTesting() {
	window.console.log("continueTesting");
	if (window.widgetEventTestComplete === true)
	{
		asyncTestCase.continueTesting();
	}
}






function testIsComplete() {
  asyncTestCase.waitForAsync();
  var timesCalled = 0;

	var p = new goog.Promise(function(resolve, reject) {
		window.console.log("anonymouse resolve, reject");

		resolve(widgetEventTestComplete);

	});
	
	p.then(function(value) {
		window.console.log("p.then");		
    timesCalled++;
    assertEquals('onFulfilled must be called exactly once.', 1, timesCalled);
	});
	
  p.thenAlways(continueTesting);

  assertEquals('then() must return before callbacks are invoked.',
               0, timesCalled);
}

