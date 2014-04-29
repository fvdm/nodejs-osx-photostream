/*
Name:          osx-photostream
Description:   Node.js module to realtime process iCloud PhotoStream photos on OSX
Author:        Franklin van de Meent (https://frankl.in)
Source:        https://github.com/fvdm/nodejs-osx-photostream
Feedback:      https://github.com/fvdm/nodejs-osx-photostream/issues
License:       Unlicense / Public domain (see LICENSE file)
*/

var fs = require('fs') 
var EE = require('events').EventEmitter
var exec = require('child_process').exec

var app = new EE()

app.watchPath = process.env.HOME +'/Library/Application Support/iLifeAssetManagement/assets/sub'

module.exports = function( dest ) {
	app.writeDest = dest ? dest.replace( /^~(\/.*)/, process.env.HOME +'$1' ) : false
	doWatch()
	return app
}

function doWatch() {
	fs.watch( app.watchPath, function( event, dirname ) {
		if( event === 'rename' && dirname.match(/^[a-z0-9]{42}$/) ) {
			fs.readdir( app.watchPath +'/'+ dirname, function( err, files ) {
				if( !err ) {
					for( var f = 0; f < files.length; f++ ) {
						var file = {}
						file.pathname = app.watchPath +'/'+ dirname
						file.filename = files[f]
						file.fullpath = file.pathname +'/'+ file.filename
						
						app.emit( 'update', file )
						
						if( app.writeDest ) {
							file.copypath = app.writeDest +'/'+ files[f]
							
							exec(
								'/bin/cp -p '+ cmdescape(file.fullpath) +' '+ cmdescape(file.copypath),
								{ timeout: 5000 },
								function( err, stdout, stderr ) {
									if( err ) {
										app.emit( 'fail', 'copy failed', err, file )
									} else {
										app.emit( 'copy', file )
									}
								}
							)
						}
					}
				} else {
					app.emit( 'fail', 'readdir failed', err, app.watchPath +'/'+ dirname )
				}
			})
			
			delete files
		}
	})
}

function cmdescape( str ) {
	return str.replace( /([\\$'"`\s])/g, '\\$1' )
}
