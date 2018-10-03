#
# Cookbook Name:: primero
# Recipe:: default
#
# Copyright 2014, Quoin, Inc.
#
# All rights reserved - Do Not Redistribute
#

include_recipe 'primero::database'
include_recipe 'primero::solr'
include_recipe 'primero::application'

bin_dir = ::File.join(node[:primero][:home_dir], 'bin')
directory bin_dir do
  action :create
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
end

primeroctl = ::File.join(bin_dir, 'primeroctl')
cookbook_file primeroctl do
  source 'primeroctl'
  owner node[:primero][:app_user]
  group node[:primero][:app_group]
  mode '755'
end

execute '/usr/sbin/nginx -t'

service 'nginx' do
  action :restart
end
