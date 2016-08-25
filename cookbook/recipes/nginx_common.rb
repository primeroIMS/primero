apt_repository 'phusion-passenger' do
  uri          'https://oss-binaries.phusionpassenger.com/apt/passenger/4'
  distribution 'trusty'
  components   ['main']
  keyserver    'keyserver.ubuntu.com'
  key          '561F9B9CAC40B2F7'
end

package 'nginx-extras'

file "#{node[:nginx_dir]}/sites-enabled/default" do
  force_unlink true
  ignore_failure true
  action :delete
end

service 'nginx' do
  supports [:enable, :restart, :start, :reload]
  action [:enable, :start]
end

