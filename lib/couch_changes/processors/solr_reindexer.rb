module CouchChanges
  module Processors
    class SolrReindexer < BaseProcessor
      class << self
        def supported_models
          [Child, Incident, TracingRequest, PotentialMatch, BulkExport]
        end

        def process(modelCls, change)
          dfd = EventMachine::DefaultDeferrable.new

          CouchChanges.logger.info "Reindexing Solr for #{modelCls.name} id #{change['id']}"

          if change['deleted']
            Sunspot.remove_by_id(modelCls, change['id'])
            dfd.succeed
          else
            instance = modelCls.get(change['id'])
            if instance.present?
              Sunspot.index! instance

              if instance.respond_to? :index_flags
                instance.index_flags
              end

              if instance.respond_to? :index_violations
                instance.index_violations
              end

              if instance.respond_to? :index_nested_reportables
                instance.index_nested_reportables
              end

              #Note: The Solr reindexer used to also create/update potential matches.
              #      Currently the matches aren't getting persisted,
              #      and in the future will be recalculated by a batch job

              dfd.succeed
            else
              CouchChanges.logger.error "Could not find #{modelCls.name} with id #{change['id']}"
              dfd.fail
            end
          end

          dfd
        end
      end
    end
  end
end
