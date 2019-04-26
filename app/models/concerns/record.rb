module Record
  extend ActiveSupport::Concern

  STATUS_OPEN = 'open' ; STATUS_CLOSED = 'closed'

  included do
    store_accessor :data, :unique_identifier, :short_id, :record_state, :status, :marked_for_mobile

    after_initialize :defaults
    before_create :create_identification
    before_save :populate_subform_ids
    after_save :index_nested_reportables, unless: Proc.new{ Rails.env == 'production' }
    after_destroy :unindex_nested_reportables, unless: Proc.new{ Rails.env == 'production' }
  end

  #TODO: Refactor when making names
  def self.model_from_name(name)
    name == 'case' ? Child : Object.const_get(name.camelize)
  end

  module ClassMethods

    def new_with_user(user, data = {})
      record = self.new
      record.data = Utils.merge_data(record.data, data)
      record.set_creation_fields_for(user)
      record.set_owner_fields_for(user)
      record
    end

    #TODO: This method is currently unused, but should eventually replace the mess in the record actions controller
    def find_or_initialize(unique_identifier)
      record = find_by_unique_identifier(unique_identifier)
      if record.nil?
        record = self.new
      end
      return record
    end

    def find_by_unique_identifier(unique_identifier)
      self.find_by('data @> ?', {unique_identifier: unique_identifier}.to_json)
    end

    def generate_unique_id
      return SecureRandom.uuid
    end

    def parent_form
      self.name.underscore.downcase
    end


    #TODO: Refactor with UIUX
    def model_name_for_messages
      self.name.titleize.downcase
    end

    #TODO: Refactor with UIUX
    def locale_prefix
      self.name.underscore.downcase
    end

    def nested_reportable_types ; [] ; end

  end


  #Override this in the implementing classes to set your own defaults
  def defaults
    self.record_state = true if self.record_state.nil?
    self.status ||= STATUS_OPEN
  end

  def create_identification
    self.unique_identifier ||= self.class.generate_unique_id
    self.short_id ||= self.unique_identifier.last 7
    self.set_instance_id
  end


  def display_field(field_or_name, lookups = nil)
    result = ""
    if field_or_name.present?
      if field_or_name.is_a?(Field)
        result = field_or_name.display_text(self.data[field_or_name.name], lookups)
      else
        field = Field.get_by_name(field_or_name)
        if field.present?
          result = field.display_text(self.data[field_or_name], lookups)
        end
      end
    end
    return result
  end

  def display_id
    short_id
  end

  #TODO: Refactor or delete with UIUX. This looks like its only useful for setting and getting via the form
  # # @param attr_keys: An array whose elements are properties and array indeces
  #   # Ex: `child.value_for_attr_keys(['family_details_section', 0, 'relation_name'])`
  #   # is equivalent to doing `child.family_details_section[0].relation_name`
  def value_for_attr_keys(attr_keys)
    attr_keys.inject(self.data) do |acc, attr|
      if acc.blank?
        nil
      else
        acc[attr]
      end
    end
  end

  #TODO: Refactor or delete with UIUX. This looks like its only useful for setting and getting via the form
  def set_value_for_attr_keys(attr_keys, value)
    parent = value_for_attr_keys(attr_keys[0..-2])
    parent[attr_keys[-1]] = value
  end

  def update_properties(properties, user_name)
    #TODO: This used to replace empty values with nil to avoid wiping out data. This may be a rails forms thing.
    #properties = self.class.blank_to_nil(self.class.convert_arrays(properties))
    properties['record_state'] = true if properties['record_state'].nil?
    self.data = Utils.merge_data(self.data, properties)
    self.last_updated_by = user_name
  end

  def nested_reportables_hash
    #TODO: Consider returning this as a straight list
    self.class.nested_reportable_types.reduce({}) do |hash, type|
      if self.try(type.record_field_name).present?
        hash[type] = type.from_record(self)
      end
      hash
    end
  end

  def populate_subform_ids
    if self.data.present?
      self.data.each do |_, value|
        if value.is_a?(Array) && value.first.is_a?(Hash)
          value.each do |subform|
            unless subform['unique_id'].present?
              subform['unique_id'] = SecureRandom.uuid
            end
          end
        end
      end
    end
  end

  def index_nested_reportables
    self.nested_reportables_hash.each do |_, reportables|
      Sunspot.index! reportables if reportables.present?
    end
  end

  def unindex_nested_reportables
    self.nested_reportables_hash.each do |_, reportables|
      Sunspot.remove! reportables if reportables.present?
    end
  end


  class Utils
    #TODO: WRITE UNIT TESTS FOR THIS!!!
    def self.merge_data(old_data, new_data)
      if old_data.is_a?(Hash) && new_data.is_a?(Hash)
        old_data.merge(new_data) do |_, old_value, new_value|
          merge_data(old_value, new_value)
        end
      elsif is_an_array_of_hashes?(old_data) && is_an_array_of_hashes?(new_data)
        new_data.inject([]) do |result, new_nested_record|
          nested_record_id = new_nested_record['unique_id']
          if nested_record_id.present?
            old_nested_record = old_data.find{|r| r['unique_id'] == nested_record_id}
            result << merge_data(old_nested_record, new_nested_record)
          else
            result << new_nested_record
          end
          result
        end
      elsif new_data.nil?
        old_data
      else
        new_data
      end
    end

    def self.is_an_array_of_hashes?(value)
      value.is_a?(Array) && (value.blank? || value.first.is_a?(Hash))
    end

  end

end
