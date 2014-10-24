
Bundler.require(:couch_watcher)

module CouchChanges
  class << self
    def logger
      @_logger ||= Logger.new(STDOUT)
    end

    def run
      models_to_watch = [Child, Incident, TracingRequest, Lookup, Location, FormSection]

      EventMachine.run do
        dfd = CouchChanges::Watcher.new(models_to_watch).watch_for_changes
        
        dfd.callback do |model, change|
          logger.debug "Handling change to #{model.name}: #{change}"

          CouchChanges::Processors.process_change(model, change, &done)
        end

        dfd.errback do |model, 
      end
    end

  end
end


CouchChanges.run if __FILE__ == $0

