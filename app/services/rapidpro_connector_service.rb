# frozen_string_literal: true

class RapidproConnectorService
  class << self
    def instance
      @instance || ApiConnector::RapidproConnector.build_from_env.freeze
    end
  end
end
