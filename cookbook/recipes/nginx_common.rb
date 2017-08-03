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

#still need to create ca for only default
ssl_client_ca_path = nil
if node[:primero][:ssl][:client_ca]
  ssl_files << 'client_ca'
  ssl_client_ca_path = ::File.join(ssl_dir, 'primero.client_ca')
end

rails_log_dir = ::File.join(node[:primero][:log_dir], 'default')
default_conf_file = "#{node[:nginx_dir]}/sites-available/000-default"
template default_conf_file do
  source "nginx_default.erb"
  owner 'root'
  group 'root'
  mode '0644'
  variables({
    :http_port => node[:primero][:http_port],
    :https_port => node[:primero][:https_port],
    :server_name => node[:primero][:server_hostname],
    :current_path => node[:primero][:app_dir],
    :rails_log_dir => rails_log_dir,
    :log_dir => rails_log_dir,
    :rails_env => node[:primero][:rails_env],
    :rvm_ruby_path => ::File.join(node[:primero][:home_dir], ".rvm/gems/ruby-#{node[:primero][:ruby_version]}-#{node[:primero][:ruby_patch]}/wrappers/ruby"),
    :ssl_cert_path => ::File.join(ssl_dir, 'default_ca.crt'),
    :ssl_key_path => ::File.join(ssl_dir, 'primero.key'),
    :ssl_client_ca => ssl_client_ca_path,
    :dh_param => "#{node[:nginx_dir]}/ssl/dhparam.pem",
  })
  notifies :restart, 'service[nginx]'
end

link "#{node[:nginx_dir]}/sites-enabled/000-default" do
  to default_conf_file
end
