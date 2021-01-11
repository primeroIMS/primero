# frozen_string_literal: true

# Abstract superclass for user identity connectors
class ApiConnector::AbstractConnector
  attr_accessor :connection

  def self.build_from_env
    prefix = "PRIMERO_CONNECT_API_#{id.upcase}_"
    config = ENV.select { |key, _| key.start_with?(prefix) }
                .transform_keys { |key| key.delete_prefix(prefix).downcase }
    new(config)
  end

  def self.id
    raise NotImplementedError
  end

  def id
    self.class.id
  end

  def initialize(options = {}); end

  def sync(record)
    return {} unless syncable?(record)

    if new?(record)
      create(record)
    elsif relevant_updates?(record)
      update(record)
    else
      {}
    end
  end

  def fetch(_record)
    raise NotImplementedError
  end

  def create(_record)
    raise NotImplementedError
  end

  def update(_record)
    raise NotImplementedError
  end

  def syncable?(_record)
    raise NotImplementedError
  end

  def new?(_record)
    raise NotImplementedError
  end

  def relevant_updates?(_record)
    true
  end
end
