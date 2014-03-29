require('shelljs/global');
var assert         = require('assert');
var SimpleSentinel = require('../index.js');

describe('simple_sentinel', function() {
  it('should start redis and sentinel', function() {
    SimpleSentinel.start(true);
    assert.equal(0, exec('redis-cli -p 16379 ping', {silent: true}).code);
    assert.equal(0, exec('redis-cli -p 26379 ping', {silent: true}).code);
    assert.equal(0, exec('redis-cli -p 26379 sentinel master mymaster', {silent: true}).code);
  });

  it('should stop redis and sentinel', function() {
    SimpleSentinel.stop(true);
    assert.ok(0 !== exec('redis-cli -p 16379 ping', {silent: true}).code);
    assert.ok(0 !== exec('redis-cli -p 26379 ping', {silent: true}).code);
  });
});
