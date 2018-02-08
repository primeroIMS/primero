include_recipe 'primero::nginx_common'
include_recipe 'primero::passenger'

unless node[:primero][:server_hostname]
  Chef::Application.fatal!("You must specify the nginx server hostname in node[:primero][:server_hostname]!")
end

ssl_dir = ::File.join(node[:nginx_dir], 'ssl')
ssl_files = ['crt', 'key']
ssl_client_ca_path = nil
if node[:primero][:ssl][:client_ca]
  ssl_files << 'client_ca'
  ssl_client_ca_path = ::File.join(ssl_dir, 'primero.client_ca')
end
ssl_files.each do |ext|
  certfile = ::File.join(ssl_dir, "primero.#{ext}")
  file certfile do
    content node[:primero][:ssl][ext.to_sym]
    owner "root"
    group "root"
    mode "0400"
    not_if { ::File.symlink?(certfile) }
    #If symlink, then this has been created and is being maintained by letsencrypt
    notifies :reload, 'service[nginx]'
  end
end

template "#{node[:nginx_dir]}/conf.d/primero.conf" do
  source 'primero.conf.erb'
  user 'root'
  group 'root'
  notifies :reload, 'service[nginx]'
end

rails_log_dir = ::File.join(node[:primero][:log_dir], 'rails')
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
    :rails_log_dir => rails_log_dir,
    :log_dir => rails_log_dir,
    :rails_env => node[:primero][:rails_env],
    :rvm_ruby_path => ::File.join(node[:primero][:home_dir], ".rvm/gems/ruby-#{node[:primero][:ruby_version]}-#{node[:primero][:ruby_patch]}/wrappers/ruby"),
    :ssl_cert_path => ::File.join(ssl_dir, 'primero.crt'),
    :ssl_key_path => ::File.join(ssl_dir, 'primero.key'),
    :ssl_client_ca => ssl_client_ca_path,
    :dh_param => "#{node[:nginx_dir]}/ssl/dhparam.pem",
  })
  notifies :restart, 'service[nginx]'
end

link "#{node[:nginx_dir]}/sites-enabled/primero" do
  to site_conf_file
end

service 'nginx' do
  supports [:enable, :restart, :start, :reload]
  action [:enable, :start]
end

logrotate_app 'primero-nginx' do
  path ::File.join(rails_log_dir, 'nginx_*.log')
  size 50 * 1024 * 1024
  rotate 2
  frequency nil
  options %w( delaycompress compress notifempty missingok )
  create '0640 www-data adm'
  sharedscripts true
  prerotate <<-EOH
    if [ -d /etc/logrotate.d/httpd-prerotate ]; then \
            run-parts /etc/logrotate.d/httpd-prerotate; \
    fi \
  EOH
  postrotate <<-EOH
    [ -s /run/nginx.pid ] && kill -USR1 `cat /run/nginx.pid`
  EOH
end
