package 'nginx-extras'

file "#{node[:nginx_dir]}/sites-enabled/default" do
  force_unlink true
  ignore_failure true
  action :delete
end

ssl_dir = ::File.join(node[:nginx_dir], 'ssl')
directory ssl_dir do
  action :create
  recursive true
  owner 'root'
  group 'root'
  mode '0700'
end

dhparam_file = ::File.join(ssl_dir,'dhparam.pem')
execute "Generate the DH parameters" do
  #TODO: Really should be 4096 but takes to long to generate when making a fresh env.
  #      Wouldn't be an big bother if we knew we were building a VM and skipped this step.
  command "openssl dhparam -out #{dhparam_file} 2048"
  not_if do
    File.exist?(dhparam_file)
  end
end

service 'nginx' do
  supports [:enable, :restart, :start, :reload]
  action [:enable, :start]
end

include_recipe 'primero::nginx_default'