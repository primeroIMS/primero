# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Connector for sending data to another instance of Primero.
# For now connection parameters for these endpoints is configured through environment variables.
# TODO: This is an abstract connector, but it could be made pretty generic and functional.
# TODO: Consider constraining outbound sends by a Role, like the webhook connector
class ApiConnector::PrimeroConnector < ApiConnector::AbstractConnector
  def create(record)
    with_retry do
      status, response = connection.post(record.class.api_path, params(record))
      # TODO: Should we log on the record that it was sent?
      { status:, response: }
    end
  end

  def update(record)
    with_retry do
      status, response = connection.patch(record.api_path, params(record))
      # TODO: Should we log on the record that it was sent?
      { status:, response: }
    end
  end

  def syncable?(_record)
    true
  end

  def new?(_record)
    # TODO: Based on the presense of the send timestamp
    true
  end

  def relevant_updates?(_record)
    true
  end

  def params(_record)
    raise NotImplementedError
  end
end
