include_recipe 'primero::nginx_common'

package 'passenger'

ssl_dir = ::File.join('/etc/nginx', 'ssl')
directory ssl_dir do
  action :create
  recursive true
  owner 'root'
  group 'root'
  mode '0700'
end

unless node[:primero][:server_hostname]
  Chef::Application.fatal!("You must specify the nginx server hostname in node[:primero][:server_hostname]!")
end

['crt', 'key'].each do |ext|
  file ::File.join(ssl_dir, "primero.#{ext}") do
    content node[:primero][:ssl][ext.to_sym]
    owner "root"
    group "root"
    mode "0400"
    notifies :reload, 'service[nginx]'
  end
end

template "#{node[:nginx_dir]}/conf.d/passenger.conf" do
  source 'passenger.conf.erb'
  user 'root'
  group 'root'
  variables({
    :conf => node[:primero][:passenger_conf],
  })
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
    :rails_log_path => "#{node[:primero][:log_dir]}/rails",
    :log_path => "#{node[:primero][:log_dir]}/nginx",
    :rails_env => node[:primero][:rails_env],
    :rvm_ruby_path => ::File.join(node[:primero][:home_dir], ".rvm/gems/ruby-#{node[:primero][:ruby_version]}-#{node[:primero][:ruby_patch]}/wrappers/ruby"),
    :ssl_cert_path => ::File.join(ssl_dir, 'primero.crt'),
    :ssl_key_path => ::File.join(ssl_dir, 'primero.key'),
    :passenger_conf => node[:primero][:passenger_conf],
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

