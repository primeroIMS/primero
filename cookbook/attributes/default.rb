
default[:primero].tap do |p|
  p[:http_port] = 80
  p[:https_port] = 443
  p[:rails_env] = 'production'
  p[:home_dir] = '/srv/primero'
  p[:app_dir] = File.join(node[:primero][:home_dir], 'application')
  p[:app_user] = 'primero'
  p[:app_group] = 'primero'

  p[:git].tap do |git|
    git[:repo] = 'git@bitbucket.org:quoin/primero.git'
    git[:revision] = 'master'
  end

  p[:couchdb].tap do |c|
    c[:host] = 'localhost'
    c[:username] = 'primero'
  end

  p[:solr_port] = 9999
end

default[:rvm].tap do |rvm|
  rvm[:user_default_ruby] = '1.9.3-p545' #TODO: Will need to upgrade
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
