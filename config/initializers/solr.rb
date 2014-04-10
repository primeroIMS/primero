
path = ::Rails.root.join "config", "solr.yml"
begin
  config = YAML::load(ERB.new(File.read(path)).result)
rescue
  Rails.logger.error 'Could not load solr yaml config!'
  raise
end

ENV['SOLR_PORT'] = "#{config['port']}"
Sunspot.config.solr.url = "http://localhost:#{ config['port'] || "8983" }/solr"
