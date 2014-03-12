
apt_repository 'phusion-passenger' do
  uri          'https://oss-binaries.phusionpassenger.com/apt/passenger'
  distribution 'precise'
  components   ['main']
  keyserver    'keyserver.ubuntu.com'
  key          '561F9B9CAC40B2F7'
end

%w(nginx-full passenger).each do |pkg|
  package pkg
end

unless node[:primero][:server_hostname]
  Chef::Application.fatal!("You must specify the nginx server hostname in node[:primero][:server_hostname]!")
end

remote_directory "#{node[:nginx_dir]}/ssl" do
  source "ssl_certs"
  owner "root"
  group "root"
  files_owner "root"
  files_group "root"
  mode "0600"
  files_mode "0600"
  notifies :restart, 'service[nginx]'
end

#remote_directory "#{node[:nginx_dir]}/conf.d" do
  #source "nginx_conf"
  #owner "root"
  #group "root"
  #files_owner "root"
  #files_group "root"
  #mode "0755"
  #files_mode "0644"
  #notifies :restart, 'service[nginx]'
#end

template "#{node[:nginx_dir]}/nginx.conf" do
  source "nginx.conf.erb"
  owner "root"
  group "root"
  mode '0644'
  notifies :restart, 'service[nginx]'
end

site_conf_file = "#{node[:nginx_dir]}/sites-available/primero"
template site_conf_file do
  source "nginx_site.erb"
  owner 'root'
  group 'root'
  mode '0644'
  variables({
    :http_port => node[:primero][:http_port],
    :https_port => node[:primero][:https_port],
    :server_name => node[:primero][:server_hostname],
    :current_path => node[:primero][:app_dir],
    :rails_env => node[:primero][:rails_env],
  })
  notifies :restart, 'service[nginx]'
end

link "#{node[:nginx_dir]}/sites-enabled/primero" do
  to site_conf_file
end

service 'nginx' do
  action [:enable, :start]
end

