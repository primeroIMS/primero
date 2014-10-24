module CouchChanges
  module Processors
    # Notifies the individual Passenger processes
    class Notifier < BaseProcessor
      class << self
        def supported_models
          [Lookup, Location, FormSection]
        end

        def process(modelCls, change, &done)
          CouchChanges.logger.info "Notifying Passenger instances about change \##{change['seq']} to #{modelCls.name}"
          multi = EventMachine::MultiRequest.new

          begin
            procs = CouchChanges::Passenger.http_process_info
          rescue PassengerNotRunningError => e
            CouchChanges.logger.warn "Marking notifier as done since Passenger isn't running"
            done.call
          rescue MultiplePassengersError
            CouchChanges.logger.error "Cannot handle multiple Passenger servers!"
            done.call false
          else
            procs.each do |process|
              uri = Addressable::URI.parse(Rails.application.routes.url_for(:controller => 'couch_changes', :action => 'notify', :host => process.address))

              headers = {
                'X-Passenger-Connect-Password' => process.password,
                'Content-Type' => 'application/json'
              }
              uri.query_values = {
                :id => change['id'],
                :model_name => modelCls.name,
              }

              # Use GET here instead of POST since the requests hang on normal POST requests.  See 
              # https://groups.google.com/forum/#!topic/phusion-passenger/-XYYtqTQpLk
              multi.add(uri.port.to_s, EventMachine::HttpRequest.new(uri.to_s).get(:head => headers))
            end

            multi.callback do
              if multi.responses[:errback].length == 0
                CouchChanges.logger.debug "App successfully notified of change \##{change['seq']} on model #{modelCls.name}"
                done.call
              else
                multi.responses[:errback].each do |k, v|
                  CouchChanges.logger.error "Error notifying app instance #{k} of change \##{change['seq']} on model #{modelCls.name}: #{v.try(:error)}"
                end
                done.call false
              end
            end
          end
        end
      end
    end
  end
end
