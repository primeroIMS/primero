
include_recipe 'rvm::vagrant'
include_recipe 'apt'

package 'curl'

# To get tmux 1.8 and newer vim
# DON'T do this because it causes tmux to pull in the libpam-tmpdir module
# which causes Ruby/Chef to bomb on trying to execute scripts that it
# automatically puts in the temp dir.
#apt_repository "pi-rho" do
  #uri "http://ppa.launchpad.net/pi-rho/dev/ubuntu"
  #distribution "precise"
  #components ["main"]
  #action :add
  #keyserver 'keyserver.ubuntu.com'
  #key '779C27D7'
  #notifies :run, 'execute[apt-get update]', :immediately
#end

%w(tmux vim).each do |pkg|
  package pkg
end 
