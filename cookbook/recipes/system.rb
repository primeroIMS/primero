template '/etc/sysctl.d/99-primero-attributes.conf' do
  source 'primero-attributes.conf.erb'
  owner "root"
  group "root"
end

template '/etc/security/limits.d/nginx.conf' do
  source 'nginx_limits.conf.erb'
  owner "root"
  group "root"
end
