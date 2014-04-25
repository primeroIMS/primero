path = ::Rails.root.join "config", "solr.yml"
begin
  SOLR_CONFIG = YAML::load(ERB.new(File.read(path)).result)[Rails.env]
  Sunspot.config.solr.url = SOLR_CONFIG['url']
  ENV['SOLR_PORT'] = SOLR_CONFIG['local_solr_port'].to_s
rescue => e
  Rails.logger.error "Could not load solr.yml configuration file.\n#{e}"
end
