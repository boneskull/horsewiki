HorseWiki
=========

HorseWiki is a wiki developed entirely in JavaScript for use with CouchDB.

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

If they existed, they'd be written in QUnit because that is how I roll, unfortunately I haven't gotten to it yet.
