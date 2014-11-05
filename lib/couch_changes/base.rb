
Bundler.require(:couch_watcher)

module CouchChanges
  MODELS_TO_WATCH = [Child, Incident, TracingRequest, Lookup, Location, FormSection, PrimeroModule]

  class << self
    def logger
      @_logger ||= Logger.new(STDOUT)
    end

    def run(history_file=nil)
      EventMachine.run do
        CouchChanges::Watcher.new(MODELS_TO_WATCH, history_file).watch_for_changes
      end
    end

  end
end


CouchChanges.run ARGV[0] if __FILE__ == $0

