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

#TODO: Do we need this in light of the last few lines in the nginx recipe?
service 'nginx' do
  action :reload
end
