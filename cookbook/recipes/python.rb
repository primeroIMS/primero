# python cookbook is trying to upgrade setuptools, but for reasons is not
# installed and fails. Python cookbook is a dependency of supervisor cookbook
# and it can't be avoided.

package 'python3'
package 'python3-pip'

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
