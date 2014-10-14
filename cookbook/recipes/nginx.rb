node.default['nginx']['default_site_enabled'] = false

apt_repository 'phusion-passenger' do
  uri          'https://oss-binaries.phusionpassenger.com/apt/passenger'
  distribution 'trusty'
  components   ['main']
  keyserver    'keyserver.ubuntu.com'
  key          '561F9B9CAC40B2F7'
end

%w(nginx-extras passenger).each do |pkg|
  package pkg
end

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

# TODO: We might have to rework this config file if we ever do Couch-only
# deployments
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
    :rvm_ruby_path => ::File.join(node[:primero][:home_dir], ".rvm/gems/ruby-#{node[:primero][:ruby_version]}-#{node[:primero][:ruby_patch]}/wrappers/ruby"),
    :ssl_cert_path => ::File.join(ssl_dir, 'primero.crt'),
    :ssl_key_path => ::File.join(ssl_dir, 'primero.key'),
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

