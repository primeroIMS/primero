module CouchChanges
  module Processors
    class SolrReindexer < BaseProcessor
      class << self
        def supported_models
          [Child, Incident, TracingRequest]
        end

        def process(model, change)
          dfd = EventMachine::DefaultDeferrable.new

          CouchChanges.logger.info "Reindexing Solr for #{model.name} id #{change['id']}"

          instance = model.get(change['id'])
          if instance.present?
            Sunspot.index! instance
            dfd.succeed
          else
            CouchChanges.logger.error "Could not find #{model.name} with id #{change['id']}"
            dfd.fail
          end

          dfd
        end
      end
    end
  end
end
