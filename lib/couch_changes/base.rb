
Bundler.require(:couch_watcher)

module CouchChanges
  class << self
    def logger
      @_logger ||= Logger.new(STDOUT)
    end

    def run
      models_to_watch = [Child, Incident, TracingRequest, Lookup, Location, FormSection]

      EventMachine.run do
        CouchChanges::Watcher.new(models_to_watch).watch_for_changes do |model, change, done|
          logger.debug "Handling change to #{model.name}: #{change}"

          CouchChanges::Processors.process_change(model, change, &done)
        end
      end
    end

  end
end


CouchChanges.run if __FILE__ == $0

