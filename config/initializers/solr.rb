path = ::Rails.root.join "config", "solr.yml"
SUNSPOT_CONFIG = YAML::load(ERB.new(File.read(path)).result)
Sunspot.config.solr.url = SUNSPOT_CONFIG['url']
