
module CouchChanges
  # Handles the lower-level work of receiving and parsing the data from Couch
  class RequestHandler
    # How long (in seconds) without any activity before it times out and
    # reconnects
    INACTIVITY_TIMEOUT_SECONDS = 60

    def initialize(model, starting_seq)
      @model = model
      @starting_seq = starting_seq || 0
      @received = ""
    end

    def reset_received
      @received = ""
      self
    end

    # TODO: surely there is an existing lib that will handle the stream
    # processing
    def handle_chunk chunk
      CouchChanges.logger.debug "Chunk received on _changes API for model #{@model.name}: #{chunk.dump}"
      @received += chunk
      while @received.include?("\n")
        lines = @received.split("\n")
        first = lines.shift
        if first
          begin
            change = JSON.parse(first)

            yield change
          rescue JSON::ParserError => e
            CouchChanges.logger.error("Error parsing CouchDB change notification: #{e}\nData received: #{lines[0].dump}")
          end

        end
        @received = lines.join("\n")
      end
    end

    def change_uri
      conf = CouchSettings.instance

      @_change_uri ||= conf.uri.tap do |uri|
        uri.path = "/#{@model.database.name}/_changes"
        uri.query = {
          :feed => 'continuous',
          :heartbeat => INACTIVITY_TIMEOUT_SECONDS * 1000 / 2,
          :include_docs => true,
          :conflicts => true,
          :timeout => 10000,
          :since => @starting_seq || 0,
        }.to_query
      end
    end

    # This must be called inside of the EventMachine.run block
    def create_http_request
      CouchChanges.logger.debug "Creating http request to #{change_uri}"
      EventMachine::HttpRequest.new(change_uri.to_s, :inactivity_timeout => INACTIVITY_TIMEOUT_SECONDS).get
    end
  end
end
