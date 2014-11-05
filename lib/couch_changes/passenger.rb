
module CouchChanges
  class Passenger
    class << self
      def initialize_passenger
        if !@_passenger_loaded
          ENV["PASSENGER_LOCATION_CONFIGURATION_FILE"] = "/usr/lib/ruby/vendor_ruby/phusion_passenger/locations.ini"
          require '/usr/lib/ruby/vendor_ruby/phusion_passenger'

          PhusionPassenger.locate_directories
          PhusionPassenger.require_passenger_lib 'platform_info'
          PhusionPassenger.require_passenger_lib 'admin_tools/server_instance'

          class << self
            include PhusionPassenger::AdminTools
          end

          @_passenger_loaded = true
        end
      end

      def client
        @_client ||= server_instance.connect(:role => :passenger_status)
      end

      def server_instance
        initialize_passenger
        @_server_instance ||= ServerInstance.list.tap do |instances|
          if instances.length == 0
            CouchChanges.logger.error "No Passenger servers found!"
            raise PassengerNotRunningError
          elsif instances.length > 1
            CouchChanges.logger.error "More than one Passenger server found!"
            raise MultiplePassengersError
          end
        end.first
      end

      def http_process_info
        procs = server_instance.processes(client)
        procs.map do |p|
          OpenStruct.new({
            :address => "http://#{p.server_sockets[:http].address.gsub('tcp://', '')}",
            :password => p.connect_password,
          })
        end
      end
    end
  end

  class PassengerNotRunningError < Exception; end
  class MultiplePassengersError < Exception; end
end
