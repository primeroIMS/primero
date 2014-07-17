
default[:primero].tap do |p|
  p[:http_port] = 80
  p[:https_port] = 443
  p[:rails_env] = 'production'
  p[:home_dir] = '/srv/primero'
  p[:app_dir] = File.join(node[:primero][:home_dir], 'application')
  p[:app_user] = 'primero'
  p[:app_group] = 'primero'

  p[:git].tap do |git|
    git[:repo] = 'git@bitbucket.org:jtoliver/primero.git'
    git[:revision] = 'Primero-285'
  end

  p[:couchdb].tap do |c|
    c[:host] = 'localhost'
    c[:username] = 'primero'
    c[:bind_address] = '127.0.0.1'
  end

  p[:solr_url] = 'http://localhost:8983/solr'
  p[:local_solr_port] = 8983
end

default[:rvm].tap do |rvm|
  rvm[:user_default_ruby] = '2.1.0'
  rvm[:user_installs] = [
    {
      :user => node[:primero][:app_user],
      :home => node[:primero][:home_dir],
    }
  ]
  rvm[:vagrant][:system_chef_solo] = '/opt/chef/bin/chef-solo'
end

default[:nginx_dir] = '/etc/nginx'
#default[:nginx].tap do |n|
  #n[:install_method] = 'package'
  #n[:repo_source] = 'nginx'
#end
