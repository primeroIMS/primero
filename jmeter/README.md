Primero JMeter Tests
====================

You can use [JMeter](jmeter.apache.org) to do some performance/load testing on
the site.

## Install JMeter
Your OS might have a package available for you to install.  Otherwise, you will
need to follow the [installation
instructions](http://jmeter.apache.org/usermanual/get-started.html#install).

You will also need the [`jmeter-plugins`](http://jmeter-plugins.org/home/)
library to enhance things a bit.  Try a package or install it manually.

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
 * **user_count** (Default: `5`): The number of simultaneous users to launch
 * **loop_count** (Default: `10`): How many times for each user to repeat the test
 * **logfile_base** (Default: current timestamp): The basename (without
   extension) of the log file that JMeter will write in the `logs/` folder in
   this directory.  This is useful to describe any test metadata, as it is not
   saved elsewhere.

As you can see, the properties default to testing against your local VM Nginx
instance.  Therefore, you should make sure that any code you are trying to test
is on Nginx, and not only on the Rails dev server.

You specify the properties with the `-J` flag to JMeter.  So if you want to
start up the JMeter GUI using the QA server, you would do:

```bash
    primero/jmeter$ jmeter -Jhost=primero-qa.quoininc.com -Jport=443 primero.jmx
```

### No GUI
To run the tests without a GUI, you can do something like the following:

```bash
    primero/jmeter$ jmeter -n -t primero.jmx
```

You can specify properties as above.  The log will output to `jmeter.log` in
the same dir and the output JTL will go in the `logs` folder.

### Generate Aggregate Stats
To make useful comparisons between test runs, you can convert the XML output
from the test run to a simple CSV format that gives aggregate statistics for
each of the pages under test.  This is very useful for creating overlay graphs
to compare two test runs to see if your changes have made any significant
difference.  The JMeter Plugins project provides a nice tool to do this
conversion:

```bash
    primero/jmeter$ java -jar /path/to/CMDRunner.jar --tool Reporter --generate-csv agg1.csv \
      --plugin-type AggregateReport --input-jtl logs/core_<time stamp>.jtl
```

You will need to find where the `CMDRunner.jar` library is installed on your
system and replace that path, as well as get the time stamp for the latest
JMeter test run to know which JTL file to use.

### Using the plot.sh script

This script will plot the average response time for each page for two different
test runs, side-by-side.  Just pass the script the path to the two JTL files
you want to compare.  You might have to specify the path of the JMeter Plugins
`CMDRunner.jar` library with the `CMD_RUNNER_JAR` envvar.
