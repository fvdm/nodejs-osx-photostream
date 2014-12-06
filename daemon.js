/*
Name:          osx-photostream daemon.js
Description:   Launch the module as a daemon process
Author:        Franklin van de Meent (http://frankl.in)
Source:        https://github.com/fvdm/nodejs-osx-photostream
Feedback:      https://github.com/fvdm/nodejs-osx-photostream/issues
License:       Unlicense / Public domain (see LICENSE file)
*/

// ! Config defaults
var config = {
  dest: '~/Pictures/iCloud',
  name: 'node-photostream',
  pidfile: 'node-photostream.pid'
}

for( var i = 0; i < process.argv.length; i++ ) {
  process.argv[i].replace( /^\-([a-z]+)=(.+)$/, function(s,k,v) {
    config[k] = v
  })
}

// ! Daemon
var daemon = require('daemonize2').setup({
  main: 'osx-photostream.js',
  name: config.name,
  pidfile: config.pidfile,
  argv: [config.dest],
  cwd: process.env.PWD
})

// ! Commands
switch( process.argv[2] ) {
  case 'start': daemon.start(); break;
  case 'stop': daemon.stop(); break;
  case 'restart':
    daemon.stop( function(err) { daemon.start() })
    break
  case 'status':
    var pid = daemon.status()
    if( pid ) {
      console.log('Daemon running. PID: ' + pid)
    } else {
      console.log('Daemon is not running.')
    }
    break
  default:
    console.log('Usage: [start|stop|restart|status] [OPTIONS]')
    console.log('\nOPTIONS\n')
    console.log('  -copy=PATH     Copy destination, default: '+ config.dest)
    console.log('  -name=NAME     Process name, default: '+ config.name)
    console.log('  -pidfile=PATH  PID file path, default: '+ config.pidfile)
  break
}
