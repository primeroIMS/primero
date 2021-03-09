# python cookbook is trying to upgrade setuptools, but for reasons is not
# installed and fails. Python cookbook is a dependency of supervisor cookbook
# and it can't be avoided.

# Remove alternatives created with the latest patch to fix the pip issue.
execute 'remove python3.5 alternatives' do
  command "update-alternatives --remove python /usr/bin/python3.5"
  only_if { File.exists?('/usr/bin/python3.5')}
end
execute 'remove pip3.5 alternatives' do
  command "update-alternatives --remove pip /usr/local/bin/pip3"
  only_if { File.exists?('/usr/local/bin/pip3')}
end

execute 'Install python3.9' do
  command 'apt update -y && apt -y install software-properties-common && add-apt-repository -y ppa:deadsnakes/ppa && apt update -y && apt install -y python3.9 python3.9-venv python3.9-dev'
end

execute 'Install Pip for python3.9' do
  command 'wget https://bootstrap.pypa.io/get-pip.py && python3.9 get-pip.py'
  cwd '/tmp'
end

# Create symbolic link to make think to the supervisor/python cookbook that
# python2 is already installed.
execute 'python alternatives' do
  command "update-alternatives --install /usr/bin/python python /usr/bin/python3.9 1"
end

# Create symbolic links to make think to the supervisor cookbook that
# pip python2 is already installed.
execute 'pip alternatives option 1' do
  command "update-alternatives --install /usr/bin/pip pip /usr/local/bin/pip3.9 1"
  only_if { !File.exists?('/usr/bin/pip') && File.exists?('/usr/local/bin/pip3.9') }
end
execute 'pip alternatives option 2' do
  command "update-alternatives --install /usr/bin/pip pip /usr/bin/pip3.9 1"
  only_if { !File.exists?('/usr/bin/pip') && File.exists?('/usr/bin/pip3.9')}
end
