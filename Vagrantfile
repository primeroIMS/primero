VAGRANTFILE_API_VERSION = "2"

def project_path(path)
  File.join(File.dirname(__FILE__), path)
end

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "bento/ubuntu-16.04"

  config.vm.network :forwarded_port, guest: 3000, host: 3000
  config.vm.network :forwarded_port, guest: 3001, host: 3001 # Second server for testing replication
  config.vm.network :forwarded_port, guest: 5984, host: 5984
  config.vm.network :forwarded_port, guest: 8000, host: 8000
  config.vm.network :forwarded_port, guest: 8443, host: 8443
  config.vm.network :forwarded_port, guest: 3035, host: 3035
  config.vm.network :forwarded_port, guest: 5432, host: 5432

  #Sunspot solr servers.
  config.vm.network :forwarded_port, guest: 8983, host: 8983
  config.vm.network :forwarded_port, guest: 8982, host: 8982
  config.vm.network :forwarded_port, guest: 8981, host: 8981
  config.vm.network :forwarded_port, guest: 8901, host: 8901
  config.vm.network :forwarded_port, guest: 8903, host: 8903
  config.vm.network :forwarded_port, guest: 8902, host: 8902

  if ENV['PUBLIC_NETWORK']
    config.vm.network "public_network"
  end

  config.omnibus.chef_version = '11.10.4'
  config.berkshelf.enabled = true
  config.berkshelf.berksfile_path = 'cookbook/Berksfile'

  config.vm.provision :chef_solo do |chef|
    node_file = if File.exists?(project_path("dev-node.json"))
      project_path("dev-node.json")
    else
      project_path("dev-node.json.sample")
    end
    nodedata = JSON.parse(File.read(node_file))
    chef.run_list = nodedata.delete('run_list')
    chef.json = nodedata
    chef.log_level = 'debug'
  end

  config.vm.provider :virtualbox do |vb, override|
    vb.customize ["modifyvm", :id, "--memory", ENV['PRIMERO_RAM'] || "2048"]
    vb.customize ["modifyvm", :id, "--cpus", "2"]
  end
end
