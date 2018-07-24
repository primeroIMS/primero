module Exporters
  class ConfigurableExporter < BaseExporter
    class << self
      def config_property_keys
        #TODO
        []
      end

      def properties_to_export(props)
        self.config_property_keys.present? ? props.select{|p| self.config_property_keys.include?(p.keys.first)} : props
      end
    end

    def initialize
      #TODO
    end

  end
end
