module CouchChanges
  module Processors
    # Notifies the individual Passenger processes
    class Notifier < BaseProcessor
      class << self
        def supported_models
          [Lookup, Location, FormSection, User, Agency, PrimeroModule]
        end

        def process(modelCls, change)
          dfd = EventMachine::DefaultDeferrable.new

          CouchChanges.logger.info "Notifying Passenger instances about change \##{change['seq']} to #{modelCls.name}"

          begin
            procs = CouchChanges::Passenger.http_process_info
          rescue PassengerNotRunningError => e
            CouchChanges.logger.warn "Marking notifier as done since Passenger isn't running"
            dfd.succeed
          rescue MultiplePassengersError
            CouchChanges.logger.error "Cannot handle multiple Passenger servers!"
            dfd.fail "Multiple Passenger Servers"
          else
            notify_each_process(procs, modelCls, change, dfd)
          end

          dfd
        end

        def notify_each_process(procs, modelCls, change, dfd)
          multi = EventMachine::MultiRequest.new

          procs.each {|p| start_request_to_process(p, modelCls, change, multi) }

          multi.callback do
            # For now, just mark the notification as successful if the
            # request didn't catastrophically fail, regardless of the status
            # code returned by rails.
            if multi.responses[:errback].length == 0
              CouchChanges.logger.info "App successfully notified of change \##{change['seq']} on model #{modelCls.name}"
              dfd.succeed
            else
              multi.responses[:errback].each do |k, v|
                CouchChanges.logger.error "Error notifying app instance #{k} of change \##{change['seq']} on model #{modelCls.name}: #{v.try(:error)}"
              end
              dfd.fail
            end
          end
        end

        def start_request_to_process(process, modelCls, change, multi)
          uri = Addressable::URI.parse(Rails.application.routes.url_for(:controller => 'couch_changes', :action => 'notify', :host => process.address))

          headers = {
            'X-Passenger-Connect-Password' => process.password,
            'Content-Type' => 'application/json'
          }
          uri.query_values = {
            :id => change['id'],
            :deleted => change['deleted'],
            :model_name => modelCls.name,
          }

          # Use GET here instead of POST since the requests hang on normal POST requests.  See
          # https://groups.google.com/forum/#!topic/phusion-passenger/-XYYtqTQpLk
          multi.add(process.pid, EventMachine::HttpRequest.new(uri.to_s).get(:head => headers))
        end
      end
    end
  end
end
