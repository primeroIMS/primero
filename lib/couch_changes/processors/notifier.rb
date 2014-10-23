module CouchChanges
  module Processors
    # Notifies the individual Passenger processes
    class Notifier < BaseProcessor
      class << self
        def supported_models
          [Lookup, Location, FormSection]
        end

        def process model, change, &done)
          multi = EventMachine::MultiRequest.new

          CouchChanges::Passenger.http_process_info.each do |process|
            url = Rails.application.routes.url_for(:controller => 'couch_changes', :action => 'notify', :host => process.address)
            multi.add EventMachine::HttpRequest.new(url).post

            multi.callback do
              CouchChanges.logger.debug multi.responses
              done.call
            end
          end
        end
      end
    end
  end
end
