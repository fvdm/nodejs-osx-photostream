osx-photostream
===============

Process new images in real-time with iCloud PhotoStream on OSX.

This node.js module can run in the background to listen ([kqueue](http://en.wikipedia.org/wiki/Kqueue)) for new images
in your PhotoStream on iCloud. You can snap a photo with your iPhone and within moments have your Mac archive it to 
another folder or do other post-processing with it.


* [Package on npm](http://npmjs.org/package/osx-photostream)
* [Source-code on Github](https://github.com/fvdm/nodejs-osx-photostream)
* [Feedback](https://github.com/fvdm/nodejs-osx-photostream/issues)


Requirements
------------

* Mac OS X (tested on 10.9 and 10.10)
* Mac with iCloud account and PhotoStream enabled
* Another Apple device with iCloud and PhotoStream enabled
* [node.js](http://nodejs.org)


Installation
------------

The release on npm is always the latest stable version:

`npm install osx-photostream`


The code in the Github repository is the most recent, but can be unstable:

`npm install fvdm/nodejs-osx-photostream`


Usage
-----

There are two ways to use this module, these can be combined:


### Copy new images to another folder

Very useful if you prefer apps like Picasa over iPhoto. For example, to archive photos before iCloud expires them after 30 days.

```js
var ps = require('osx-photostream')('~/Pictures/iCloud')
```


### Do something else with new images

```js
var ps = require('osx-photostream')()

ps.on( 'update', function( file ) {
  console.log('New image added: '+ file.filename)
})
```


### Copy to folder and forward with iMessage to friend

```js
var ps = require('osx-photostream')('~/Pictures/iCloud')
var exec = require('child_process').exec
 
ps.on( 'copy', function( file ) {
  // Forward image to friend with iMessage
  exec('osascript -e "tell application \"Messages\" to send POSIX file \"'+ file.copypath +'\" to buddy \"friend@email.tld\" of service \"E:my@email.tld\""')
})
```


Events
------

### update : callback( fileObject )

A new file was added to your PhotoStream.

```js
ps.on( 'update', function( file ) {
  console.log( 'New image: '+ file.filename )
})
```


### copy : callback ( fileObject )

A new file was copied from PhotoStream to the other folder.

This event is only triggered when a destination path is set and the copy succeeded.

```js
ps.on( 'copy', function( file ) {
  // tell another app or module the image at file.copypath is ready.
})
```


### watching : callback ( watchPath )

The app is watching `watchPath` for updates.

```js
ps.on( 'watching', function( watchPath ) {
  console.log( 'Watching PhotoStream' )
})
```


### fail : callback ( reason, error, [fileObject] )

An error occured. You can safely ignore this event, but it may help in times of trouble.

parameter  | description
---------- | ----------------------------------------------
reason     | See table below.
error      | The error as reported.
fileObject | See below.

```js
ps.on( 'fail', function( reason, error, file ) {
  console.log( 'ERROR: '+ reason +' - '+ file.filename )
  console.log( error )
})
```

reason         | description
-------------- | ------------------------------------
exception      | Uncaught exception
watch error    | Something went wrong during watching
readdir failed | New item can not be read
mkdir failed   | Can not create copy destination
copy failed    | Can not copy new file to destination



fileObject
----------

property  | description
--------- | -------------------------------------------
.pathname | Path to your PhotoStream location
.filename | Filename of the new file, i.e. IMG_5778.PNG
.fullpath | .pathname +'/'+ .filename
.copypath | If copied, new location with filename


Unlicense
---------

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org>


Author
------

Franklin van de Meent
| [Website](http://frankl.in)
| [Github](https://github.com/fvdm)
