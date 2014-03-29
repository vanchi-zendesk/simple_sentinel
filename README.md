simple_sentinel
===============

A simple nodejs utility to start and stop a test sentinel and redis.
Starts redis at port 16379 and sentinel at port 26379.

This is mainly intended as a test helper. If you have several projects which needs to run tests against redis and sentinel, you could include simple_sentinel as a package, and use it to start and stop your redis/sentinel setup.


Configuration
=============

For redis: Slightly modified from https://raw.github.com/antirez/redis/2.8/redis.conf
For sentinel: Created by reading this page: http://redis.io/topics/sentinel

Requirements
============
- redis (tested @2.8.4)
- node
- Include this package in your project, run npm install.

Usage
=====
```
-$ node_modules/simple_sentinel/bin/simple_sentinel --help

  Usage: simple_sentinel [start|stop]

  Commands:

    start     start redis and sentinel
    stop      stop redis and sentinel

  Options:

    -h, --help  output usage information
```

In code
=======
You can also use simple_sentinel from code.

```
var simple_sentinel = require('simple_sentinel');
simple_sentinel.start(/*silent*/);
simple_sentinel.stop(/*silent*/);
```

Notes about stop
================

Stops redis:16379 by sending 'redis-cli -p 16379 shutdown', so watch out if you have redis running on that port.

For the sentinel, since the 'shutdown' command is not working on redis v2.8.4, we try to 'kill -TERM `cat sentinel.pid`'. If the pid file is not found, stop exits with return code 1.
