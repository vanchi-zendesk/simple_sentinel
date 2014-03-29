require('shelljs/global');

var redis_dir          = __dirname + '/redis';
var sentinel_dir       = __dirname + '/sentinel';
var redis_conf_path    = __dirname + '/conf/redis-2.8.conf';
var sentinel_conf_path = __dirname + '/conf/sentinel.conf';
var redis_log_file     = __dirname + '/redis/redis.log';
var sentinel_log_file  = __dirname + '/sentinel/sentinel.log';
var sentinel_pid_file  = __dirname + '/sentinel/sentinel.pid';

var redis_start    = 'redis-server ' + redis_conf_path +
                     ' --logfile ' + redis_log_file +
                     ' --dir ' + redis_dir +
                     ' --loglevel verbose';

var sentinel_start = 'redis-server ' + sentinel_conf_path +
                     ' --sentinel ' +
                     ' --logfile ' + sentinel_log_file +
                     ' --pidfile ' + sentinel_pid_file +
                     ' --loglevel verbose';
function redis_alive(verbose){
  return (exec('redis-cli -p 16379 ping', { silent: !verbose }).code === 0);
}

function sentinel_alive(verbose){
  return (exec('redis-cli -p 26379 ping', { silent: !verbose }).code === 0);
}

module.exports = {

  start: function(silent) {
    mkdir('-p', redis_dir);
    mkdir('-p', sentinel_dir);
    rm('-f', redis_log_file);
    rm('-f', sentinel_log_file);

    if(!silent) echo('Starting redis:16379');
    if(!which('redis-server')) {
      echo('Please install redis >2.8.4');
      exit(1);
    }

    if (exec(redis_start).code !== 0) {
      if(test('-f', redis_log_file)) {
        echo('Failed to start redis. Here\'s the log:');
        cat(redis_log_file);
        exit(1);
      }
      echo('Failed to start redis, bailing...');
      exit(1);
    }

    exec('sleep 1');

    if(!redis_alive()) {
      if(test('-f', redis_log_file)) {
        echo('Redis failed ping, Here\'s the log:');
        cat(redis_log_file);
        exit(1);
      }
      echo('Redis failed ping, bailing...');
      exit(1);
    }
    if(!silent) echo('success');

    if(!silent) echo('Starting sentinel:26379');
    if(exec(sentinel_start).code !== 0) {
      if(test('-f', sentinel_log_file)) {
        echo('Failed to start sentinel. Here\'s the log:');
        cat(sentinel_log_file);
        exit(1);
      }
      echo('Failed to start sentinel, bailing...');
      exit(1);
    }

    exec('sleep 1');

    if(!sentinel_alive()) {
      if(test('-f', sentinel_log_file)) {
        echo('Sentinel failed ping. Here\'s the log:');
        cat(sentinel_log_file);
        exit(1);
      }
      echo('Sentinel failed ping, bailing...');
      exit(1);
    }
    if (!silent) echo('success');
  },

  stop: function(silent) {
    if(!silent) echo('Shutting down redis');
    if(redis_alive()) {
      exec('redis-cli -p 16379 shutdown');
    } else {
      if(!silent) echo('already down');
    }
    if(!silent) echo('Shutting down sentinel');
    if(sentinel_alive()) {
      var pid;

      if(test('-f', sentinel_pid_file)) {
        pid = exec('cat '+sentinel_pid_file, {silent:true}).output;
      } else {
        pid = exec('redis-cli -p 26379 info | grep process_id | cut -d: -f2', {silent:true}).output;
      }
      if(pid) {
        pid = parseInt(pid);
        exec('kill -TERM ' + pid);
      }
    } else {
      if(!silent) echo('already down');
    }
    rm('-f', redis_log_file);
    rm('-f', sentinel_log_file);
  }
};