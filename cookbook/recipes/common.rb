cookbook_file '/usr/local/share/ca-certificates/couch_ca.crt' do
  source 'couch_ca.crt'
  owner 'root'
  group 'root'
  mode '0644'
end

execute 'update-ca-certificates' do
  command 'update-ca-certificates'
  user 'root'
  group 'root'
end
