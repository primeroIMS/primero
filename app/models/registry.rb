# frozen_string_literal: true

# Model representing a registry
class Registry < ApplicationRecord
  REGISTRY_TYPE_FARMER = 'farmer'
  REGISTRY_TYPE_FOSTER_CARE = 'foster_care'
  REGISTRY_TYPE_INDIVIDUAL = 'individual'

  include Record
  include Searchable
  include Historical
  include Ownable
  include Flaggable
  include Alertable
  include Attachable
  include EagerLoadable

  store_accessor(:data, :registry_id, :registry_type)

  class << self
    def registry_types
      SystemSettings.current&.registry_types ||
        [REGISTRY_TYPE_FARMER, REGISTRY_TYPE_FOSTER_CARE, REGISTRY_TYPE_INDIVIDUAL]
    end
  end

  def set_instance_id
    self.registry_id ||= unique_identifier
  end
end
