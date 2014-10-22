
Bundler.require(:couch_watcher)

module CouchChanges
  logger = Logger.new(STDOUT)
end

def run
  models_to_watch = [Role]#Child, Incident, TracingRequest, Role, User, FormSection]
  CouchChanges::Watcher.new(models_to_watch).watch_for_changes
end

run if __FILE__ == $0

