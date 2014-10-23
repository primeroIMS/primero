
ENV["PASSENGER_LOCATION_CONFIGURATION_FILE"] = "/usr/lib/ruby/vendor_ruby/phusion_passenger/locations.ini"
require '/usr/lib/ruby/vendor_ruby/phusion_passenger'

PhusionPassenger.locate_directories
PhusionPassenger.require_passenger_lib 'platform_info'
PhusionPassenger.require_passenger_lib 'admin_tools/server_instance'
PhusionPassenger.require_passenger_lib 'utils/ansi_colors'

module CouchChanges
  class Passenger
    DEFAULT_OPTIONS = { :show => 'pool' }.freeze

    class << self
      include PhusionPassenger::AdminTools
      include PhusionPassenger::Utils::AnsiColors

      def client
        @_client ||= server_instance.connect(:role => :passenger_status)
      end

      def server_instance
        @_server_instance ||= ServerInstance.list.tap do |instances|
          if instances.length == 0
            CouchChanges.logger.error "No Passenger servers found!"
            raise
          elsif instances.length > 1
            CouchChanges.logger.error "More than one Passenger server found!"
            raise
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
end
