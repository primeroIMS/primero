Primero JMeter Test
===================

This folder contains [JMeter](jmeter.apache.org) performance/load tests for the
Primero application.


You will need to install JMeter, as well as
[jmeter-plugins](http://jmeter-plugins.org/home/) to be able to use these
tests.  Please follow the instructions on their respective websites.

It will install all of this under a newly created user called `jmeter`.  Once
this cookbook has run, you can run the basic performance test suite by running
the `scripts/run-jmeter` script, passing a name for the run as the first argument.  You
need to pass it the `JMETER_TARGET_HOST` envvar and tell it the hostname of the
box you are testing against (i.e.  `primero-app-integration.quoininc.com`,
without the `https`).  For convenience, you can make a file called
`jmeter_config` in the same folder and the `run-jmeter` script will source it
and use any envvars from it.  

That script will **reset all of the application data** so make sure any prior
data on the machine is backed up if you want it for later.

Here is an example that doesn't use the `jmeter_config` file:

```bash
    primero/jmeter$ JMETER_TARGET_HOST=10.0.0.171 scripts/run-jmeter test1
```

The log for that run will be found at `logs/test1.jtl` in the current dir, and
likewise for other runs, with the log file basename varying.

## Using the plot.sh script

This script will plot the average response time for each page for two different
test runs, side-by-side.  Just pass the script the path to the two JTL files
you want to compare.  You might have to specify the path of the JMeter Plugins
`CMDRunner.jar` library with the `CMD_RUNNER_JAR` envvar.

## Running tests manually
If you want to do something other than what the `run-jmeter` script is
hardcoded to do, you can run JMeter directly.  You can specify parameters (they
are called *properties* in the JMeter lingo) at the command line when running
JMeter to tell it which host you want to test, among other things.  This is so
that you don't have to modify the `.jmx` file itself (which you shouldn't have
to do if you are only running tests).  The currently available properties are:

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
instance.

You specify the properties with the `-J` flag to JMeter.  So if you want to
start up the JMeter GUI using the QA server, you would do:

```bash
    primero/jmeter$ jmeter -Jhost=primero-qa.quoininc.com -Jport=443 -n -t primero.jmx
```

### No GUI
To run the tests without a GUI, you pass the `-n` flag to JMeter:

```bash
    primero/jmeter$ jmeter -n -t primero.jmx -Jlogfile_base=nogui
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

## Testing a single page
If you are just testing a single page's performance, you are probably better
off just doing a simple test with Apache's `ab` tool rather than firing up
JMeter and all of it's complexity.
