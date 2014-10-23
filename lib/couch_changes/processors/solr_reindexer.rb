module CouchChanges
  module Processors
    class SolrReindexer < BaseProcessor
      class << self
        def supported_models
          [Child, Incident, TracingRequest]
        end

        def process(model, change, &done)
        end
      end
    end
  end
end
