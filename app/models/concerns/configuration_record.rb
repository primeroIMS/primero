# frozen_string_literal: true

# A shared concern for all Primero configuration types: FormSections, Agencies, Lookups, etc.
module ConfigurationRecord
  extend ActiveSupport::Concern

  included do
    # Set the default unique id attributes
    self.unique_id_attribute = 'unique_id'
    self.unique_id_from_attribute = 'name'
  end

  # Class methods
  module ClassMethods
    def create_or_update!(configuration_hash)
      configuration_hash = configuration_hash.with_indifferent_access if configuration_hash.is_a?(Hash)
      configuration_record = find_or_initialize_by(unique_id_attribute => configuration_hash[unique_id_attribute])
      configuration_record.update_properties(configuration_hash)
      configuration_record.save!
      configuration_record
    end

    def unique_id_attribute
      @unique_id_attribute
    end

    def unique_id_attribute=(attribute)
      @unique_id_attribute = attribute.to_s
    end

    def unique_id_from_attribute
      @unique_id_from_attribute
    end

    def unique_id_from_attribute=(attribute = 'name')
      @unique_id_from_attribute = attribute.to_s
    end

    # Override this in the implementing class if data needs to be applied in a special order
    def sort_configuration_hash(configuration_hash)
      configuration_hash
    end
  end

  def configuration_hash
    attributes.except('id', 'created_at', 'updated_at').with_indifferent_access
  end

  def update_properties(configuration_hash)
    self.attributes = configuration_hash
  end

  def generate_unique_id
    generate_from = send(self.class.unique_id_from_attribute)
    return unless generate_from.present?

    self[self.class.unique_id_attribute] ||= unique_id_from_string(generate_from)
  end

  def unique_id_from_string(string)
    code = SecureRandom.uuid.to_s.last(7)
    string = string.gsub(/[^A-Za-z0-9_ ]/, '')
    "#{self.class.name}-#{string}-#{code}".parameterize.dasherize
  end
end
