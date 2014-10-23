
module CouchChanges
  # Handles the lower-level work of receiving and parsing the data from Couch
  class RequestHandler
    # How long (in seconds) without any activity before it times out and
    # reconnects
    INACTIVITY_TIMEOUT_SECONDS = 60*60
    def initialize(model)
      @model = model
      @received = ""
    end

    def reset_received
      @received = ""
      self
    end

    def handle_chunk chunk
      CouchChanges.logger.debug "Chunk received on _changes API for model #{@model.name}: #{chunk.strip}"
      @received += chunk
      while @received.include?("\n")
        lines = @received.split("\n")
        first = lines.shift
        if first
          begin
            change = JSON.parse(first)

            yield change
          rescue JSON::ParserError => e
            CouchChanges.logger.error("Error parsing CouchDB change notification: #{e}\nData received: #{lines[0]}")
          end

        end
        @received = lines.join("\n")
      end
    end

    def change_uri
      conf = CouchSettings.instance

      conf.uri.tap do |uri|
        uri.path = "/#{@model.database.name}/_changes"
        uri.query = {
          :feed => 'continuous',
          :heartbeat => INACTIVITY_TIMEOUT_SECONDS * 1000 / 2,
        }.to_query
      end
    end

    # This must be called inside of the EventMachine.run block
    def create_http_request
      EventMachine::HttpRequest.new(change_uri.to_s, :inactivity_timeout => INACTIVITY_TIMEOUT_SECONDS).get
    end
  end
end
