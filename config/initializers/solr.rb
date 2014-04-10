
default_port = 8983
path = ::Rails.root.join "config", "solr.yml"
begin
  config = YAML::load(ERB.new(File.read(path)).result)
rescue
  Rails.logger.warn "Could not load solr yaml config! Using default solr port #{default_port}"
end

config['port'] ||= default_port
ENV['SOLR_PORT'] ||= config['port'].to_s
Sunspot.config.solr.url = "http://localhost:#{ config['port'] }/solr"
