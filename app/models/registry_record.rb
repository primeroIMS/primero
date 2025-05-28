# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Model representing a registry
class RegistryRecord < ApplicationRecord
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
  include LocationCacheable
  include PhoneticSearchable
  include Normalizeable

  store_accessor(
    :data,
    :registry_type, :registry_id, :registry_no, :registration_date, :registry_id_display, :name, :hidden_name,
    :module_id, :location_current
  )

  has_many :cases, class_name: 'Child', foreign_key: :registry_record_id

  before_save :save_searchable_fields

  class << self
    def registry_types
      SystemSettings.current&.registry_types ||
        [REGISTRY_TYPE_FARMER, REGISTRY_TYPE_FOSTER_CARE, REGISTRY_TYPE_INDIVIDUAL]
    end

    def filterable_id_fields
      %w[registry_id short_id registry_no]
    end

    def summary_field_names
      common_summary_fields + %w[registry_type registry_id_display name registration_date
                                 module_id name location_current registry_no]
    end

    def phonetic_field_names
      %w[name]
    end
  end

  alias super_defaults defaults
  def defaults
    super_defaults
    self.registration_date ||= Date.today
  end

  def self.report_filters
    [
      { 'attribute' => 'status', 'value' => [STATUS_OPEN] },
      { 'attribute' => 'record_state', 'value' => ['true'] }
    ]
  end

  def set_instance_id
    self.registry_id ||= unique_identifier
    self.registry_id_display ||= short_id
  end
end
