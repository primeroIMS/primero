module CouchChanges
  # Uses EventMachine to watch for fresh changes
  class Watcher
    def initialize(models_to_watch, history_path=nil)
      @models = models_to_watch
      @sequencer = Sequencer.new(history_path)
    end

    def watch_for_changes
      create_request_handlers.each do |model, handler|
        listen_for_changes(model, handler) do |change|
          handle_change(model, change)
        end
      end
    end

    private

    def listen_for_changes(model, handler, retry_period=2, &block)
      CouchChanges.logger.info "Listening for changes to #{model.name}..."

      req = handler.create_http_request

      req.stream do |chunk|
        handler.handle_chunk(chunk, &block)
      end

      req.errback do
        CouchChanges.logger.warn "Disconnected from Couch change API for model #{model.name}, reconnecting in #{retry_period} seconds..."
        EM.add_timer(retry_period) do
          listen_for_changes(model, handler.reset_received, retry_period*2, &block)
        end
      end
    end

    def handle_change(model, change, retry_period=5)
      if change_is_valid?(model, change)
        CouchChanges.logger.info "Handling change to #{model.name}: #{change.to_s[0..100]}..."

        CouchChanges::Processors.process_change(model, change).callback do
          update_sequence(model, change)
        end.errback do
          CouchChanges.logger.warn "change \##{change['seq']} for model #{model.name} could not be handled, retrying in #{retry_period} seconds"
          EM.add_timer(retry_period) do
            handle_change(model, change, retry_period*2)
          end
        end
      else
        CouchChanges.logger.info "Ignoring stale or irrelevant change to #{model.name}: #{change.to_s[0..100]}..."
      end
    end

    def create_request_handlers
      @models.inject({}) do |acc, m|
        acc.merge( m => RequestHandler.new(m, @sequencer.for_model(m).try(:last_seq)))
      end
    end

    def change_is_valid?(model, change)
      seq = change['seq']

      if seq.nil?
        CouchChanges.logger.error "Change doesn't have a sequence number: #{change}"
        false
      else
        seq > @sequencer.for_model(model).last_seq && !change['id'].start_with?('_design')
      end
    end

    def update_sequence(model, change)
      @sequencer.for_model(model).last_seq = change['seq']
    end
  end
end
