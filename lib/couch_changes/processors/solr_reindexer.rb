module CouchChanges
  module Processors
    class SolrReindexer < BaseProcessor
      class << self
        def supported_models
          [Child, Incident, TracingRequest]
        end

        def process(modelCls, change)
          dfd = EventMachine::DefaultDeferrable.new

          CouchChanges.logger.info "Reindexing Solr for #{modelCls.name} id #{change['id']}"

          instance = modelCls.get(change['id'])
          if instance.present?
            p Sunspot.object_id
            Sunspot.index! instance
            dfd.succeed
          else
            CouchChanges.logger.error "Could not find #{modelCls.name} with id #{change['id']}"
            dfd.fail
          end

          dfd
        end
      end
    end
  end
end
