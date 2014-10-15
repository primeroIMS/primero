
Bundler.require(:couch_watcher)

def watch_for_changes db_name
  conf = CouchSettings.instance

  changes_uri = conf.uri.tap do |uri|
    uri.path = "/#{db_name}/_changes"
    uri.query = 'feed=continuous&include_docs=true'
  end

  EventMachine.run do
    p "Waiting for changes to #{db_name}..."
    http = EventMachine::HttpRequest.new(changes_uri.to_s).get
    received = ""
    http.stream do |chunk|
      require 'pry'; binding.pry
      received += chunk
      while received.include?("\n")
        lines = received.split("\n")
        change = JSON.parse(lines[0])
        received = lines[1..-1].join("")

        process_change(change)
      end
    end
  end
end

def process_change change
  require 'pry'; binding.pry
  change
end

watch_for_changes("primero_child_development")
