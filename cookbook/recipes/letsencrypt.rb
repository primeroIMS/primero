letsencrypt_config_dir = "/etc/letsencrypt"
letsencrypt_dir = ::File.join(node[:primero][:home_dir], "letsencrypt")
letsencrypt_public_dir = ::File.join(node[:primero][:app_dir], "public")

git letsencrypt_dir do
  repository "https://github.com/letsencrypt/letsencrypt"
  action :sync
end

unless node[:primero][:letsencrypt][:email]
  Chef::Application.fatal!("You must specify the LetsEncrypt registration email in node[:primero][:letsencrypt][:email]!")
end

fullchain = ::File.join(letsencrypt_config_dir, 'live', node[:primero][:server_hostname], 'fullchain.pem')
privkey = ::File.join(letsencrypt_config_dir, 'live', node[:primero][:server_hostname], 'privkey.pem')

execute "Register Let's Encrypt Certificate" do
  command "./letsencrypt-auto certonly --webroot -w #{letsencrypt_public_dir} -d #{node[:primero][:server_hostname]} --agree-tos --email #{node[:primero][:letsencrypt][:email]}"
  cwd letsencrypt_dir
  not_if do
    File.exist?(fullchain) &&
    File.exist?(privkey)
  end
end

#Update references to letsencrypt certs in app
certfiles = {
  '/etc/nginx/ssl/primero.crt' => fullchain,
  '/etc/nginx/ssl/primero.key' => privkey
}
if node[:primero][:letsencrypt][:couchdb]
  certfiles.merge({
    node[:primero][:couchdb][:cert_path] => fullchain,
    node[:primero][:couchdb][:key_path] => privkey
  })
end

certfiles.each do |certfile|
  file certfile[0] do
    action :delete
    not_if { ::File.symlink?(certfile[0]) }
  end

  link certfile[0] do
    to certfile[1]
    not_if { ::File.symlink?(certfile[0])   }
  end
end

#Restart nginx
service 'nginx' do
  action :restart
end

file "/etc/cron.monthly/letsencrypt_renew.sh" do
  mode '0755'
  owner "root"
  group "root"
  content <<EOH
#!/bin/bash

cd #{letsencrypt_dir}
./letsencrypt-auto certonly --renew-by-default --webroot -w #{letsencrypt_public_dir} -d #{node[:primero][:server_hostname]} --agree-tos --email #{node[:primero][:letsencrypt][:email]}
/etc/init.d/nginx restart
EOH
end


