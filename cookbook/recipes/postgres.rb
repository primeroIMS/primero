%w(postgresql postgresql-contrib libpq-dev).each do |package|
  package package
end

execute 'Crdeate Postgres role' do
  command "psql -c \"create role #{node[:primero][:postgres][:role]} with login password '#{node[:primero][:postgres][:password]}';\""
  only_if { `sudo -upostgres psql postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='#{node[:primero][:postgres][:role]}'"`.to_i != 1}
end