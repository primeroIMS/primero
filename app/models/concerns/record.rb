# frozen_string_literal: true

# A shared concern for all core Primero record types: Cases (child), Incidents, Tracing Requests
module Record
  extend ActiveSupport::Concern

  STATUS_OPEN = 'open'
  STATUS_CLOSED = 'closed'
  STATUS_TRANSFERRED = 'transferred'

  attr_writer :location_service

  included do
    store_accessor :data, :unique_identifier, :short_id, :record_state, :status, :marked_for_mobile

    # Indicates if the update was performed through the API.
    attribute :record_user_update, :boolean

    after_initialize :defaults, unless: :persisted?
    before_create :create_identification
    before_save :populate_subform_ids
    after_save :index_nested_reportables
    after_destroy :unindex_nested_reportables
  end

  def self.model_from_name(name)
    case name
    when 'case' then Child
    when 'violation' then Incident
    else Object.const_get(name.camelize)
    end
  rescue NameError
    nil
  end

  def self.map_name(name)
    name = name.underscore
    name == 'child' ? 'case' : name
  end

  # Class methods for all Record types
  module ClassMethods
    def new_with_user(user, data = {})
      new.tap do |record|
        id = data.delete('id') || data.delete(:id)
        record.id = id if id.present?
        record.data = RecordMergeDataHashService.merge_data(record.data, data)
        record.creation_fields_for(user)
        record.owner_fields_for(user)
        record.record_user_update = true
      end
    end

    def common_summary_fields
      %w[created_at owned_by owned_by_agency_id photos
         flag_count status record_in_scope short_id alert_count]
    end

    def find_by_unique_identifier(unique_identifier)
      find_by('data @> ?', { unique_identifier: unique_identifier }.to_json)
    end

    def parent_form
      name.underscore.downcase
    end

    def preview_field_names
      PermittedFieldService::ID_SEARCH_FIELDS + Field.joins(:form_section).where(
        form_sections: { parent_form: parent_form },
        show_on_minify_form: true
      ).pluck(:name)
    end

    def nested_reportable_types
      []
    end
  end

  # Override this in the implementing classes to set your own defaults
  def defaults
    self.record_state = true if record_state.nil?
    self.status ||= STATUS_OPEN
  end

  def create_identification
    self.unique_identifier ||= SecureRandom.uuid
    self.short_id ||= self.unique_identifier.to_s.last(7)
    set_instance_id
  end

  def associations_as_data(_current_user)
    {}
  end

  def associations_as_data_keys
    []
  end

  def display_id
    short_id
  end

  def values_from_subform(subform_field_name, field_name)
    data[subform_field_name]&.map { |fds| fds[field_name] }&.compact&.uniq
  end

  # TODO: This is used in configurable exporters. Rename to something meaningful if useful
  # # @param attr_keys: An array whose elements are properties and array indeces
  #   # Ex: `child.value_for_attr_keys(['family_details_section', 0, 'relation_name'])`
  #   # is equivalent to doing `child.family_details_section[0].relation_name`
  def value_for_attr_keys(attr_keys)
    attr_keys.inject(data) do |acc, attr|
      acc.blank? ? nil : acc[attr]
    end
  end

  def update_properties(user, data)
    self.data = RecordMergeDataHashService.merge_data(self.data, data)
    self.record_user_update = true
    self.last_updated_by = user&.user_name
  end

  def nested_reportables_hash
    self.class.nested_reportable_types.each_with_object({}) do |type, hash|
      hash[type] = type.from_record(self) if try(type.record_field_name).present?
    end
  end

  def populate_subform_ids
    return unless data.present?

    data.each do |_, value|
      next unless value.is_a?(Array) && value.first.is_a?(Hash)

      value.each do |subform|
        subform['unique_id'].present? ||
          (subform['unique_id'] = SecureRandom.uuid)
      end
    end
  end

  def location_service
    @location_service ||= LocationService.instance
  end

  def index_nested_reportables
    nested_reportables_hash.each do |_, reportables|
      Sunspot.index! reportables if reportables.present?
    end
  end

  def unindex_nested_reportables
    nested_reportables_hash.each do |_, reportables|
      Sunspot.remove! reportables if reportables.present?
    end
  end
end
