include_recipe 'apt'

%w(mailutils).each do |pkg|
  package pkg
end

template File.join(node[:postfix_dir], 'main.cf') do
  source 'main.cf.erb'
  variables({
    :server_hostname => node[:primero][:server_hostname],
    :postfix => node[:postfix]
  })
  user 'root'
  group 'root'
end

template node[:postfix][:alias_path] do
  source 'aliases.erb'
  variables({
    :postfix => node[:postfix]
  })
  user 'root'
  group 'root'
end
