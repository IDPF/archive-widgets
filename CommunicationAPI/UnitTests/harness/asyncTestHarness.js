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

goog.require('goog.testing.AsyncTestCase');
goog.require('goog.testing.jsunit');
goog.require('goog.testing.recordFunction');

goog.setTestOnly('goog.PromiseTest');

var asyncTestCase = goog.testing.AsyncTestCase.createAndInstall(document.title);
var unhandledRejections;


function setUpPage(opt_value) {
	asyncTestCase.stepTimeout = opt_value ? opt_value : 3000;
}


function setUp() {
    unhandledRejections = goog.testing.recordFunction();
    goog.Promise.setUnhandledRejectionHandler(unhandledRejections);
}


function tearDown() {
}


function tearDownPage() {
}

var run = false;

function testRun() {
    asyncTestCase.log("**** TestRun ****");
    if (run)
    {
        alert("These tests are not rentrant!");
        assertTrue(false);
    }
    else
    {
        asyncTestCase.waitForAsync();
        startTest();
    }
    run = true;
}

function completedTest() {
    asyncTestCase.log("**** completedTest ****");
    asyncTestCase.continueTesting();
}
