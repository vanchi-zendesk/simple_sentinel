require('shelljs/global');
var assert         = require('assert');
var SimpleSentinel = require('../index.js');

process.env.noverbose = true;
describe('simple_sentinel', function() {
  describe('without config', function() {
    it('should start redis and sentinel', function() {
      assert.equal(0, SimpleSentinel.start(null, true));
      assert.equal(0, exec('redis-cli -p 16379 ping', {silent: true}).code);
      assert.equal(0, exec('redis-cli -p 26379 ping', {silent: true}).code);
      assert.equal(0, exec('redis-cli -p 26379 sentinel master mymaster', {silent: true}).code);
    });

    it('should stop redis and sentinel', function() {
      assert.equal(0, SimpleSentinel.stop(null, true));
      assert.ok(0 !== exec('redis-cli -p 16379 ping', {silent: true}).code);
      assert.ok(0 !== exec('redis-cli -p 26379 ping', {silent: true}).code);
    });
  });
  describe('with config', function() {
    var config = require('../sample_config.js');
    it('should start redis and sentinel', function() {
      assert.equal(0, SimpleSentinel.start(config, true));
      assert.equal(0, exec('redis-cli -p 16379 ping', {silent: true}).code);
      assert.equal(0, exec('redis-cli -p 16380 ping', {silent: true}).code);
      assert.equal(0, exec('redis-cli -p 16381 ping', {silent: true}).code);
      assert.equal(0, exec('redis-cli -p 26379 ping', {silent: true}).code);
      assert.equal(0, exec('redis-cli -p 26380 ping', {silent: true}).code);
      assert.equal(0, exec('redis-cli -p 26381 ping', {silent: true}).code);
      assert.equal(0, exec('redis-cli -p 26379 sentinel master mymaster', {silent: true}).code);
    });

    it('should stop redis and sentinel', function() {
      assert.equal(0, SimpleSentinel.stop(config, true));
      assert.ok(0 !== exec('redis-cli -p 16379 ping', {silent: true}).code);
      assert.ok(0 !== exec('redis-cli -p 16380 ping', {silent: true}).code);
      assert.ok(0 !== exec('redis-cli -p 16381 ping', {silent: true}).code);
      assert.ok(0 !== exec('redis-cli -p 26379 ping', {silent: true}).code);
      assert.ok(0 !== exec('redis-cli -p 26380 ping', {silent: true}).code);
      assert.ok(0 !== exec('redis-cli -p 26381 ping', {silent: true}).code);
    });
  });

});
