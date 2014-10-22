
module CouchChanges
  class RequestHandler
    def initialize(model)
      @model = model
      @received = ""
    end

    def reset_received
      @received = ""
      self
    end

    def handle_chunk chunk
      @received += chunk
      while @received.include?("\n")
        lines = @received.split("\n")
        begin
          change = JSON.parse(lines[0])

          yield change
        rescue JSON::ParserError => e
          logger.error("Error parsing CouchDB change notification: #{e}\nData received: #{lines[0]}")
        end

        @received = lines[1..-1].join("")
      end
    end

    def change_uri
      conf = CouchSettings.instance

      conf.uri.tap do |uri|
        uri.path = "/#{@model.database.name}/_changes"
        uri.query = {
          :feed => 'continuous',
        }.to_query
      end
    end

    # This must be called inside of the EventMachine.run block
    def create_http_request
      EventMachine::HttpRequest.new(change_uri.to_s, :inactivity_timeout => 5).get
    end
  end
end
