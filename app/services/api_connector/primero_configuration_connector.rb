# frozen_string_literal: true

# Connector that sends configuration data to another instance of Primero.
# For now connection parameters for these endpoints is configured through environment variables.
# TODO: This can be refactored and merged with the PrimeroConnector.
#       The params should really be methods on the model classes
class ApiConnector::PrimeroConfigurationConnector < ApiConnector::PrimeroConnector
  def new?(configuration)
    status, _response = connection.get(configuration.api_path)
    status == 404
  end

  # We don't actually want to update a remote configuration record, only create
  def update(_configuration)
    {}
  end

  def params(configuration)
    attributes = %w[id name description version data]
    { data: configuration.attributes.slice(*attributes) }
  end
end
