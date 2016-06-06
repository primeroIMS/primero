module CouchChanges
  module Processors
    class ConflictResolver < BaseProcessor
      class << self
        def supported_models
          [Child, Incident, TracingRequest, PotentialMatch]
        end

        def process(modelCls, change)
          dfd = EventMachine::DefaultDeferrable.new

          doc = change["doc"]
          if doc && doc["_conflicts"].present?
            begin
              CouchChanges.logger.info "Resolving conflicts for #{modelCls.name} id #{change['id']}"
              modelCls.get(change["id"]).resolve_conflicting_revisions
              dfd.succeed
            rescue Exception => e
              CouchChanges.logger.error("Error resolving conflicts: #{e}\n#{e.backtrace}")
              dfd.fail
            end
          else
            dfd.succeed
          end

          dfd
        end
      end
    end
  end
end
