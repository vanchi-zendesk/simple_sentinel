simple_sentinel
===============

A simple nodejs utility to start and stop a test sentinel and redis.
Starts redis at port 16379 and sentinel at port 26379.

Configuration for redis: Slightly modified from https://raw.github.com/antirez/redis/2.8/redis.conf
Configuration for sentinel was created by reading this page: http://redis.io/topics/sentinel

This is mainly intended as a test helper. If you have a project which needs to run tests against redis and sentinel, you could use simple_sentinel to start and stop your redis/sentinel setup.

Usage
=====
```
-$ simple_sentinel --help

  Usage: simple_sentinel [start|stop]

  Commands:

    start                  start redis and sentinel
    stop                   stop redis and sentinel

  Options:

    -h, --help  output usage information
```

Notes about stop
===============

Stops redis:16379 by sending 'redis-cli -p 16379 shutdown', so watch out if you have redis running on that port.
For the sentinel, since the 'shutdown' command is not working on redis v2.8.4, we try to 'kill -TERM `cat sentinel.pid`'. If the pid file is not found, stop exits with return code 1.
