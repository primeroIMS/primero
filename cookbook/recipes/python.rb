# python cookbook is trying to upgrade setuptools, but for reasons is not
# installed and fails. Python cookbook is a dependency of supervisor cookbook
# and it can't be avoided, so if we installed pip from the package system
# the upgrade will not fails. The following will install python2.
# In order to keep supervisor '3.1.2' python2 is required.
package 'python'
package 'python-pip'
