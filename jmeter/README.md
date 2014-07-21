Primero JMeter Tests
====================

You can use [JMeter](jmeter.apache.org) to do some performance/load testing on
the site.

## Install JMeter
Your OS might have a package available for you to install.  Otherwise, you will
need to follow the [installation
instructions](http://jmeter.apache.org/usermanual/get-started.html#install).

## Running tests
You can specify parameters (they are called *properties* in the JMeter
lingo) at the command line when running JMeter to tell it which host you want
to test, among other things.  This is so that you don't have to modify the
`.jmx` file itself (which you shouldn't have to do if you are only running
tests).  The currently available properties are:

 * **host** (Default: `primero.dev`): Specifies the server to test against
 * **protocol** (Default: `https`): Whether to use *http* or *https* (should
   always be *https*.
 * **port** (Default: `8443`): The port to use for the host above (should be
   `443` for normal server setups, like QA/UAT)

As you can see, the properties default to testing against your local VM Nginx
instance.  Therefore, you should make sure that any code you are trying to test
is on Nginx, and not only on the Rails dev server.

You specify the properties with the `-J` flag to JMeter.  So if you
want to run the tests against the QA server, you would do:

```bash
    primero/jmeter$ jmeter -Jhost=primero-qa.quoininc.com -Jport=443 primero.jmx
```

