VAGRANTFILE_API_VERSION = "2"

def project_path(path)
  File.join(File.dirname(__FILE__), path)
end

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "ubuntu-server-1204-64bit"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"

  config.vm.network :forwarded_port, guest: 3000, host: 3000
  config.vm.network :forwarded_port, guest: 5984, host: 5984
  config.vm.network :forwarded_port, guest: 8000, host: 8000
  config.vm.network :forwarded_port, guest: 8443, host: 8443

  #Sunspot solr servers.
  config.vm.network :forwarded_port, guest: 8983, host: 8983
  config.vm.network :forwarded_port, guest: 8984, host: 8984
  config.vm.network :forwarded_port, guest: 8985, host: 8985
  config.vm.network :forwarded_port, guest: 8901, host: 8901
  config.vm.network :forwarded_port, guest: 8903, host: 8903
  config.vm.network :forwarded_port, guest: 8902, host: 8902

  config.omnibus.chef_version = '11.10.4'

  config.vm.provision :chef_solo do |chef|
    nodedata = JSON.parse(File.read(project_path("cookbook/private/dev/node.json")))
    chef.run_list = nodedata["run_list"]
    chef.json = nodedata
    chef.log_level = 'debug'
  end

  config.vm.provider :virtualbox do |vb, override|
    vb.customize ["modifyvm", :id, "--memory", "1024"]
    vb.customize ["modifyvm", :id, "--cpus", "2"]
  end
end
