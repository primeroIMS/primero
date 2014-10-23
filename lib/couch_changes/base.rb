
Bundler.require(:couch_watcher)

module CouchChanges
  class << self
    def logger
      @_logger ||= Logger.new(STDOUT)
    end
  end
end

def run
  models_to_watch = [Child, Incident, TracingRequest, Role, User, FormSection]

  EventMachine.run do
    CouchChanges::Watcher.new(models_to_watch).watch_for_changes do |model, change, done|
      CouchChanges.logger.debug "Handling change to #{model.name}: #{change}"

      done.call
    end
  end
end

run if __FILE__ == $0

