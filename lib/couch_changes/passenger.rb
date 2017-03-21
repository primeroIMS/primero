
module CouchChanges
  class Passenger
    class << self
      def initialize_passenger
        if !@_passenger_loaded
          require 'phusion_passenger'

          PhusionPassenger.locate_directories
          PhusionPassenger.require_passenger_lib 'platform_info'
          PhusionPassenger.require_passenger_lib 'admin_tools/instance'
          PhusionPassenger.require_passenger_lib 'admin_tools/instance_registry'

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
        procs = reset_client_if_necessary { server_instance.processes(client) }
        procs.map do |p|
          OpenStruct.new({
            :address => "http://#{p.server_sockets[:http].address.gsub('tcp://', '')}",
            :pid => p.pid,
            :password => p.connect_password,
          })
        end
      end

      private

      # Resets the client if there is a broken pipe exception
      def reset_client_if_necessary &block
        begin
          block.call
        rescue Errno::EPIPE
          @_client = nil
          block.call
        end
      end
    end
  end

  class PassengerNotRunningError < Exception; end
  class MultiplePassengersError < Exception; end
end
