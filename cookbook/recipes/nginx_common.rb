node.default['nginx']['default_site_enabled'] = false

apt_repository 'phusion-passenger' do
  uri          'https://oss-binaries.phusionpassenger.com/apt/passenger'
  distribution 'trusty'
  components   ['main']
  keyserver    'keyserver.ubuntu.com'
  key          '561F9B9CAC40B2F7'
end

package 'nginx-extras'

service 'nginx' do
  supports [:enable, :restart, :start, :reload]
  action [:enable, :start]
end

