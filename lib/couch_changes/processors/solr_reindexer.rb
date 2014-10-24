module CouchChanges
  module Processors
    class SolrReindexer < BaseProcessor
      class << self
        def supported_models
          [Child, Incident, TracingRequest]
        end

        def process(model, change, &done)
          CouchChanges.logger.info "Reindexing Solr for #{model.name}"
          require 'pry'; binding.pry
        end
      end
    end
  end
end
