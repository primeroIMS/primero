# python cookbook is trying to upgrade setuptools, but for reasons is not
# installed and fails. Python cookbook is a dependency of supervisor cookbook
# and it can't be avoided.

package 'python3'

# python3-pip install a version that is not compatible with python3.5.
# https://github.com/pypa/pip/issues/9500
# https://github.com/pypa/get-pip/pull/87
cookbook_file '/tmp/get-pip.py' do
  source 'get-pip.py'
  owner 'root'
  group 'root'
  mode '755'
end

execute 'pip compatible version' do
  command "python3 /tmp/get-pip.py"
end

# Create symbolic link to make think to the supervisor/python cookbook that
# python2 is already installed.
execute 'python alternatives' do
  command "update-alternatives --install /usr/bin/python python /usr/bin/python3.5 1"
end

# Create symbolic links to make think to the supervisor cookbook that
# pip python2 is already installed.
execute 'pip alternatives option 1' do
  command "update-alternatives --install /usr/bin/pip pip /usr/local/bin/pip3 1"
  only_if { !File.exists?('/usr/bin/pip') && File.exists?('/usr/local/bin/pip3') }
end
execute 'pip alternatives option 2' do
  command "update-alternatives --install /usr/bin/pip pip /usr/bin/pip3 1"
  only_if { !File.exists?('/usr/bin/pip') && File.exists?('/usr/bin/pip3')}
end
