module CouchChanges
  # Uses EventMachine to watch for fresh changes
  class Watcher
    def initialize(models_to_watch, sequencer=nil)
      @models = models_to_watch
      @sequencer ||= Sequencer.new
    end

    def watch_for_changes &block
      create_request_handlers.each do |model, handler|
        listen_for_changes(model, handler) do |change|
          handle_change(model, change, &block)
        end
      end
    end

    private

    def handle_change(model, change, retry_period=5, &block)
      if change_is_fresh(model, change)
        callback = lambda do |success=true|
          if success
            update_sequence(model, change)
          else
            EventMachine.add_timer(retry_period) do
              CouchChanges.logger.warn "Change \##{change['seq']} for model #{model.name} could not be handled, retrying in #{retry_period*2} seconds"
              handle_change(model, change, retry_period*2, &block)
            end
          end
        end
        # The block to process the change calls the callback when it has
        # completed
        block.call(model, change, callback)
      else
        CouchChanges.logger.debug "Ignoring stale change to #{model.name}: #{change}"
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
        acc.merge( m => RequestHandler.new(m, @sequencer.for_model(m).try(:last_seq)))
      end
    end

    def change_is_fresh(model, change)
      seq = change['seq']

      if seq.nil?
        CouchChanges.logger.error "Change doesn't have a sequence number: #{change}"
        false
      else
        seq > @sequencer.for_model(model).last_seq
      end
    end

    def update_sequence(model, change)
      @sequencer.for_model(model).last_seq = change['seq']
    end
  end
end
