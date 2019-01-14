#
# Cookbook Name:: primero
# Recipe:: default
#
# Copyright 2014, Quoin, Inc.
#
# All rights reserved - Do Not Redistribute
#

include_recipe 'primero::database'
include_recipe 'primero::application'

directory node[:primero][:bin_dir] do
  action :create
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
end

cookbook_file ::File.join(node[:primero][:bin_dir], 'primeroctl') do
  source 'primeroctl'
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
  mode '755'
end

execute '/usr/sbin/nginx -t'

service 'nginx' do
  action :restart
end
