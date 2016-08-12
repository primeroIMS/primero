package 'beanstalkd'

beanstalkd_user = 'beanstalkd'
beanstalkd_group = 'beanstalkd'

group beanstalkd_group do
  system true
end

directory node[:primero][:queue][:storage_dir] do
  action :create
  mode '0700'
  owner beanstalkd_user
  group beanstalkd_group
end

file '/etc/default/beanstalkd' do
  mode '0644'
  content <<-EOH
## Defaults for the beanstalkd init script, /etc/init.d/beanstalkd on
BEANSTALKD_LISTEN_ADDR=#{node[:primero][:queue][:host]}
BEANSTALKD_LISTEN_PORT=#{node[:primero][:queue][:port]}
BEANSTALKD_EXTRA="-b #{node[:primero][:queue][:storage_dir]}"
EOH
end

#TODO: Consider adding an admin interface: https://github.com/kr/beanstalkd/wiki/Tools

