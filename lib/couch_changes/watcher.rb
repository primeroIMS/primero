module CouchChanges
  # Uses EventMachine to watch for fresh changes
  class Watcher
    def initialize(models_to_watch)
      @models = models_to_watch
    end

    def watch_for_changes &block
      create_request_handlers.each do |model, handler|
        listen_for_changes(model, handler) do |change|
          if change_is_fresh(model, change)
            # The block to process the change yields itself when it has
            # successfully completed
            block.call(model, change, ->() { update_sequence(model, change) })
          else
            CouchChanges.logger.debug "Ignoring stale change to #{model.name}: #{change}"
          end
        end
      end
    end

    def listen_for_changes(model, handler, &block)
      CouchChanges.logger.info "Listening for changes to #{model.name}..."

      req = handler.create_http_request

      req.stream do |chunk|
        handler.handle_chunk(chunk, &block)
      end

      req.errback do
        CouchChanges.logger.warn "Disconnected from Couch change API for model #{model.name}, reconnecting..."
        listen_for_changes(model, handler.reset_received, &block)
      end
    end

    def create_request_handlers
      @models.inject({}) do |acc, m|
        acc.merge( m => RequestHandler.new(m))
      end
    end

    private

    def change_is_fresh(model, change)
      seq = change['seq']

      if seq.nil?
        CouchChanges.logger.error "Change doesn't have a sequence number: #{change}"
        false
      else
        seq > Sequencer.for_model(model).last_seq
      end
    end

    def update_sequence(model, change)
      Sequencer.for_model(model).last_seq = change['seq']
    end
  end
end
