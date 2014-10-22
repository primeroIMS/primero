module CouchChanges
  class Watcher
    def initialize(models_to_watch)
      @models = models_to_watch
    end

    # This method will block indefinitely waiting for changes
    def watch_for_changes &block
      EventMachine.run do
        create_request_handlers.each do |model, handler|
          listen_for_changes(model, handler) do |change|
            if change_is_fresh(model, change)
              # The block to process the change yields itself when it has
              # successfully completed
              block.call(model, change) do
                update_sequence(model, change)
              end
            else
              logger.debug "Ignoring stale change: #{change}"
            end
          end
        end
      end
    end

    def listen_for_changes(model, handler, &block)
      logger.info "Handling changes to #{model.name}..."

      req = handler.create_http_request

      req.stream do |chunk|
        handler.handle_chunk(chunk, &block)
      end

      req.errback do
        logger.warn "Disconnected from Couch change API for model #{model.name}, reconnecting..."
        handle_changes(model, handler.reset_recevied)
      end
    end

    def create_request_handlers
      @models.inject({}) do |acc, m|
        acc.merge( m => RequestHandler.new(m, Sequencer.for_model(m)))
      end
    end

    private

    def change_is_fresh(model, change)
      seq = change['seq']

      if seq.nil?
        logger.error "Change doesn't have a sequence number: #{change}"
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
