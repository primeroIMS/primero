node.default['nginx']['default_site_enabled'] = false

package 'nginx-extras'

service 'nginx' do
  supports [:enable, :restart, :start, :reload]
  action [:enable, :start]
end

