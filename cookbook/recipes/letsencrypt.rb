letsencrypt_config_dir = "/etc/letsencrypt"
letsencrypt_dir = ::File.join(node[:primero][:home_dir], "letsencrypt")
letsencrypt_public_dir = ::File.join(node[:primero][:app_dir], "public")

#TODO: After upgrading to Ubuntu 16.04 LTS, use the native package instead of downloading
package 'gnupg2'

directory letsencrypt_dir do
  action :create
end

execute 'Download Certbot' do
  command 'wget https://dl.eff.org/certbot-auto && chmod a+x certbot-auto'
  cwd letsencrypt_dir
  not_if do
    File.exist?(::File.join(letsencrypt_dir, 'certbot-auto'))
  end
end

execute 'Verify Certbot' do
  command <<-EOH
    wget -N https://dl.eff.org/certbot-auto.asc && \
    gpg2 --recv-key A2CFB51FA275A7286234E7B24D17C995CD9775F2 && \
    gpg2 --trusted-key 4D17C995CD9775F2 --verify certbot-auto.asc certbot-auto
  EOH
  cwd letsencrypt_dir
  not_if do
    File.exist?(::File.join(letsencrypt_dir, 'certbot-auto.asc'))
  end
end

unless node[:primero][:letsencrypt][:email]
  Chef::Application.fatal!("You must specify the LetsEncrypt registration email in node[:primero][:letsencrypt][:email]!")
end

fullchain = ::File.join(letsencrypt_config_dir, 'live', node[:primero][:server_hostname], 'fullchain.pem')
privkey = ::File.join(letsencrypt_config_dir, 'live', node[:primero][:server_hostname], 'privkey.pem')

service 'nginx' do
  action 'stop'
end

execute "Register Let's Encrypt Certificate" do
  command "./certbot-auto certonly --standalone -d #{node[:primero][:server_hostname]} --non-interactive --agree-tos --email #{node[:primero][:letsencrypt][:email]}"
  cwd letsencrypt_dir
  not_if do
    File.exist?(fullchain) &&
    File.exist?(privkey)
  end
end

execute 'Trigger Certbot update and a cert renewal' do
  command './certbot-auto renew -n'
  cwd letsencrypt_dir
end

#Update references to letsencrypt certs in app
certfiles = {
  '/etc/nginx/ssl/primero.crt' => fullchain,
  '/etc/nginx/ssl/primero.key' => privkey
}
if node[:primero][:letsencrypt] && node[:primero][:letsencrypt][:couchdb]
  certfiles = certfiles.merge({
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

#Start nginx
service 'nginx' do
  action :start
end

file "/etc/cron.daily/letsencrypt_renew" do
  mode '0755'
  owner "root"
  group "root"
  content <<EOH
#!/bin/bash

cd #{letsencrypt_dir}
./certbot-auto renew --quiet -n --no-self-upgrade --pre-hook "service nginx stop" --post-hook "service nginx start"
EOH
end


