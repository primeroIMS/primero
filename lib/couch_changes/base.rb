
Bundler.require(:couch_watcher)

module CouchChanges
  MODELS_TO_WATCH = [Child, Incident, TracingRequest, Lookup, Location, FormSection]

  class << self
    def logger
      @_logger ||= Logger.new(STDOUT)
    end

    def run
      EventMachine.run do
        CouchChanges::Watcher.new(MODELS_TO_WATCH).watch_for_changes do |model, change|
          logger.debug "Handling change to #{model.name}: #{change}"

          CouchChanges::Processors.process_change(model, change)
        end
      end
    end

  end
end


CouchChanges.run if __FILE__ == $0

