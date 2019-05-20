include_recipe 'apt'
include_recipe 'primero::common'
include_recipe 'primero::git_stage'

package 'unzip'
package 'openjdk-8-jre-headless'

group node[:primero][:solr][:group] do
  system true
end

user node[:primero][:solr][:user] do
  system true
  home node[:primero][:home_dir]
  gid node[:primero][:solr][:group]
  shell '/bin/bash'
end

directory node[:primero][:solr][:log_dir] do
  action :create
  mode '0700'
  owner node[:primero][:solr][:user]
  group node[:primero][:solr][:group]
end

directory node[:primero][:solr][:home_dir] do
  action :create
  mode '0755'
  owner node[:primero][:solr][:user]
  group node[:primero][:solr][:group]
end

execute 'Stage solr.xml' do
  command "cp #{node[:primero][:app_dir]}/solr/solr.xml #{node[:primero][:solr][:home_dir]}"
  user node[:primero][:solr][:user]
end

execute 'Stage solr configsets' do
  command "cp -r #{node[:primero][:app_dir]}/solr/configsets #{node[:primero][:solr][:home_dir]}"
  user node[:primero][:solr][:user]
end

directory node[:primero][:solr][:data_dir] do
  action :create
  mode '0700'
  owner node[:primero][:solr][:user]
  group node[:primero][:solr][:group]
end

directory node[:primero][:solr][:core_dir] do
  action :create
  mode '0700'
  owner node[:primero][:solr][:user]
  group node[:primero][:solr][:group]
end

core_dir = File.join(node[:primero][:solr][:core_dir], node[:primero][:rails_env])
directory core_dir do
  action :create
  mode '0700'
  owner node[:primero][:solr][:user]
  group node[:primero][:solr][:group]
end

template File.join(core_dir, 'core.properties') do
  source "solr/core.properties.erb"
  variables({
    :data_dir => File.join(node[:primero][:solr][:data_dir], node[:primero][:rails_env])
  })
  owner node[:primero][:solr][:user]
  group node[:primero][:solr][:group]
end

solr_tar="solr-#{node[:primero][:solr][:version]}.tgz"
solr_bin = "/opt/solr-#{node[:primero][:solr][:version]}/bin/solr"
execute 'Download Solr' do
  command "wget https://archive.apache.org/dist/lucene/solr/#{node[:primero][:solr][:version]}/#{solr_tar}"
  cwd "/tmp"
  only_if { ! (::File.exists?(solr_bin) || ::File.exists?("/tmp/#{solr_tar}")) }
end

execute 'Install Solr' do
  command "tar xzf #{solr_tar} solr-#{node[:primero][:solr][:version]}/bin/install_solr_service.sh --strip-components=2 && bash ./install_solr_service.sh #{solr_tar} -u #{node[:primero][:solr][:user]}"
  cwd "/tmp"
  only_if { ! (::File.exists?(solr_bin)) }
end

template "#{node[:primero][:solr][:home_dir]}/solr.in.sh" do
  source 'solr/solr.in.sh.erb'
  owner node[:primero][:solr][:user]
  group node[:primero][:solr][:group]
end

execute 'Reload Systemd' do
  command 'systemctl daemon-reload'
end

execute 'Enable Solr' do
  command 'systemctl enable solr.service'
end

execute 'Reload Solr' do
  command 'systemctl restart solr'
end

file "/etc/cron.daily/solr_restart" do
  mode '0755'
  owner "root"
  group "root"
  content <<EOH
#!/bin/bash

systemctl restart solr
EOH
end
