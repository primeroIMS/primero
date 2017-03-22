module CouchChanges
  module Processors
    class SolrReindexer < BaseProcessor
      class << self
        def supported_models
          [Child, Incident, TracingRequest, PotentialMatch]
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

              if instance.respond_to? :find_match_tracing_requests
                instance.find_match_tracing_requests
              end

              if instance.respond_to? :find_match_cases
                instance.find_match_cases
              end

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
