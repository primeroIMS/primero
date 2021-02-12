# python cookbook is trying to upgrade setuptools, but for reasons is not
# installed and fails. Python cookbook is a dependency of supervisor cookbook
# and it can't be avoided.

bash 'Remove chef pip and install ubuntu pip' do
  code <<-EOH
    rm -rf /usr/local/bin/pip* /usr/local/lib/python3.5/dist-packages/pip* \
    && apt remove --purge -y python3-pip \
    && apt install -y python3-pip
    EOH
end
