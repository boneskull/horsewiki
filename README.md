HorseWiki
=========

HorseWiki is a wiki developed entirely in JavaScript for use with CouchDB.

This is mainly just an experiment or an example;  I'm trying to learn some technologies new to me such as long polling, Twitter Bootstrap and Angular 1.0. This project uses:

* [AngularJS](https://github.com/angular/angular.js) as the core framework
* [CouchDB](http://couchdb.apache.org/) as the backend database
* [jQuery](https://github.com/jquery/jquery) for some DOM manipulation
* [QUnit](https://github.com/jquery/qunit/) for unit tests
* [Sinon](http://sinonjs.org/) for mocks
* [Twitter Bootstrap](https://github.com/twitter/bootstrap/) for the look & feel
* [CodeMirror](http://codemirror.net/) for the text editor
* [Some Base64 lib](http://www.onicos.com/staff/iz/amuse/javascript/expert/base64.txt) I found by Masanao Izumo which I needed to support revision history.

and optionally,

* [nginx](http://nginx.org) as the web & proxy server

Installation
------------

1.  Install CouchDB from [http://couchdb.apache.org/].  Any further configuration (such as you know, securing the installation) is up to you.
2.  I'm using nginx to run my wiki locally.  If you want to replicate my setup, install nginx from [http://nginx.org/].
3.  Modify your `/usr/local/conf/nginx.conf` to add the following entry where the rest of the "locations" are defined:

        location /couchdb {
            rewrite /couchdb/(.*) /$1 break;
            proxy_pass http://localhost:5984;
            proxy_redirect off;
            proxy_set_header Host $host;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

4.  Copy everything in the horsewiki dir into `/usr/local/html` or whatever dir you want to host this from.
5.  Stop Apache, or if you're on Mac, stop the web sharing service.
6.  Start nginx by running `sudo /usr/local/sbin/nginx`
7.  Start CouchDB if you haven't already.  Should be on default port 5984.  
8.  Create the `wiki` database in CouchDB.
9.  You should now be able to hit `http://localhost` which should create the Home page for you.
10.  Optionally, edit `js/wiki.js` to have the `DEBUG` flag set to false, which will hide some crap.

Running the Tests
-----------------

Tests are written in QUnit because I don't dig Jasmine.

1.  Assuming you've done the above, hit `http://localhost/test/test_wiki.html`.
