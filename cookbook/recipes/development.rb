
include_recipe 'apt'

%w(vim curl chromium-browser libgconf-2-4).each do |pkg|
  package pkg
end

link '/home/vagrant/primero' do
  to '/vagrant'
end

include_recipe 'rvm::user_install'

railsexpress_patch_setup 'dev' do
  user 'vagrant'
  group 'vagrant'
end

execute_with_ruby 'dev-ruby' do
  command <<-EOH
    rvm install #{node[:primero][:ruby_version]} -n #{node[:primero][:ruby_patch]} --patch #{node[:primero][:ruby_patch]}
    rvm rubygems #{node[:primero][:rubygems_version]} --force
    rvm --default use #{node[:primero][:ruby_version]}-#{node[:primero][:ruby_patch]}
    rvm reload && rvm repair all
  EOH
  cwd '/home/vagrant/primero'
  user 'vagrant'
  group 'vagrant'
end

update_bundler 'dev-stack' do
  user 'vagrant'
  group 'vagrant'
  bundler_version node[:primero][:bundler_version]
end

execute_with_ruby 'bundle-install-vagrant' do
  command 'bundle install'
  cwd '/home/vagrant/primero'
  user 'vagrant'
  group 'vagrant'
  rails_env 'development'
end

template "/vagrant/config/couchdb.yml" do
  source 'couchdb/couch_config.yml.erb'
  variables({
    :environments => [ 'development', 'test', 'production' ],
    :couchdb_host => node[:primero][:couchdb][:host],
    :couchdb_username => node[:primero][:couchdb][:username],
    :couchdb_password => node[:primero][:couchdb][:password],
  })
  owner 'vagrant'
  group 'vagrant'
end

template "/vagrant/config/couch_watcher.yml" do
  source 'couch_watcher/couch_watcher.yml.erb'
  variables({
    :environments => ['production'],
    :couch_watcher_host => node[:primero][:couch_watcher][:host],
    :couch_watcher_port => node[:primero][:couch_watcher][:port]
  })
  owner 'vagrant'
  group 'vagrant'
end


template '/vagrant/config/sunspot.yml' do
  source "solr/sunspot.yml.erb"
  variables({
    :environments => [ 'development', 'test', 'production' ],
    :hostnames => {'development' => 'localhost',
                   'test' => 'localhost',
                   'production' => node[:primero][:solr][:hostname]},
    :ports => {'development' => 8982,
               'test' => 8981,
               'production' => node[:primero][:solr][:port]},
    :log_levels => {'development' => 'INFO',
                    'test' => 'INFO',
                    'production' => node[:primero][:solr][:log_level]},
    :log_files => {'production' => "#{node[:primero][:solr][:log_dir]}/sunspot-solr-production.log"}
  })
  owner 'vagrant'
  group 'vagrant'
end


file "/vagrant/config/mailers.yml" do
  content ::File.open("/vagrant/config/mailers.yml.example").read
  owner 'vagrant'
  group 'vagrant'
  action :create
end

['development', 'test'].each do |core_name|
  core_dir = File.join(node[:primero][:solr][:core_dir], core_name)
  directory core_dir do
    action :create
    mode '0700'
    owner node[:primero][:solr][:user]
    group node[:primero][:solr][:group]
    only_if { ::File.exists?(node[:primero][:solr][:core_dir])}
  end
  template File.join(core_dir, 'core.properties') do
    source "solr/core.properties.erb"
    variables({
      :data_dir => File.join(node[:primero][:solr][:data_dir], core_name)
    })
    owner node[:primero][:solr][:user]
    group node[:primero][:solr][:group]
    only_if { ::File.exists?(core_dir)}
  end
end

execute 'Restart Solr' do
  command 'systemctl restart solr'
  only_if { ::File.exists?(node[:primero][:solr][:core_dir])}
end

directory '/home/vagrant/primero/log' do
  action :create
  owner 'vagrant'
  group 'vagrant'
end

cookbook_file '/home/vagrant/.pryrc' do
  source 'development/pryrc'
  owner 'vagrant'
  group 'vagrant'
  mode '0644'
end
