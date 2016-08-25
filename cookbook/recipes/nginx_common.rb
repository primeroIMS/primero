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

dhparam_file = "#{node[:nginx_dir]}/ssl/dhparam.pem"
execute "Generate the DH parameters" do
  command "openssl dhparam -out #{dhparam_file} 4096"
  not_if do
    File.exist?(dhparam_file)
  end
end

service 'nginx' do
  supports [:enable, :restart, :start, :reload]
  action [:enable, :start]
end

