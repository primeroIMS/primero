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
