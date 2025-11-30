// Simple test runner for countapi.js without external deps
var assert = require('assert');
var path = require('path');
var api = require(path.join('..','scripts','countapi.js'));

// Mock element
function makeEl(){ return { textContent: '' }; }

function mockFetchResponse(value){
  return function(url){
    return Promise.resolve({ ok: true, json: function(){ return Promise.resolve({ value: value }); } });
  };
}

async function testGlobalKey() {
  var el = makeEl();
  var res = await api.initCountAPI({
    namespace: 'test-ns',
    element: el,
    fetch: mockFetchResponse(123),
    keyStrategy: 'global',
    globalKey: 'test-global',
    increment: false
  });
  assert.strictEqual(el.textContent, '123', 'element should be updated with returned value');
}

async function testPathKey() {
  var el = makeEl();
  var res = await api.initCountAPI({
    namespace: 'test-ns',
    element: el,
    fetch: mockFetchResponse(7),
    // simulate location by providing key directly
    key: 'home',
    increment: true
  });
  assert.strictEqual(el.textContent, '7');
}

async function testFeatureFlagDisabled() {
  var el = makeEl();
  var res = await api.initCountAPI({
    namespace: 'test-ns',
    element: el,
    fetch: mockFetchResponse(1),
    featureFlag: false
  });
  // When disabled, initCountAPI returns undefined and element remains unchanged
  assert.strictEqual(el.textContent, '');
}

async function run(){
  await testGlobalKey();
  console.log('testGlobalKey passed');
  await testPathKey();
  console.log('testPathKey passed');
  await testFeatureFlagDisabled();
  console.log('testFeatureFlagDisabled passed');
  console.log('All tests passed');
}

run().catch(function(err){
  console.error('Tests failed', err);
  process.exit(1);
});
