# frozen_string_literal: true

# Concern that allow records to be searchable through phonetics
# TODO: Once the Searchable concern is deprecated this concern will be renamed to Searchable
module PhoneticSearchable
  extend ActiveSupport::Concern

  IDENTIFIER_TYPE_ID = 'id'
  IDENTIFIER_TYPE_PHONE_NUMBER = 'phone_number'

  included do
    has_many :searchable_identifiers, as: :record
    store_accessor :phonetic_data, :tokens

    accepts_nested_attributes_for :searchable_identifiers

    before_save :recalculate_phonetic_tokens
    before_create :recalculate_searchable_identifiers
    before_update :recalculate_searchable_identifiers
  end

  # Class methods to indicate the phonetic_field_names of a record
  module ClassMethods
    def phonetic_field_names
      []
    end

    def phone_number_fields
      []
    end
  end

  def recalculate_phonetic_tokens
    return unless phonetic_fields_changed?

    self.tokens = generate_tokens
  end

  def recalculate_searchable_identifiers
    generate_searchable_identifiers(self.class.filterable_id_fields) if filterable_id_fields_changed?

    return unless phone_number_fields_changed?

    generate_searchable_identifiers(self.class.phone_number_fields, IDENTIFIER_TYPE_PHONE_NUMBER)
  end

  def generate_searchable_identifiers(field_names, identifier_type = IDENTIFIER_TYPE_ID)
    identifiers_to_save = identifiers_to_update(identifier_type)

    field_names.each do |field_name|
      value = data[field_name]&.strip
      next if value.blank? || identifiers_to_save.any? { |identifier| identifier[:field_name] == field_name }

      identifiers_to_save << { field_name:, value:, identifier_type: }
    end

    self.searchable_identifiers_attributes = identifiers_to_save
  end

  def identifiers_to_update(identifier_type)
    searchable_identifiers.where(identifier_type:).map do |searchable_identifier|
      {
        field_name: searchable_identifier.field_name,
        value: data[searchable_identifier.field_name]&.strip,
        identifier_type: searchable_identifier.identifier_type,
        id: searchable_identifier.id
      }
    end
  end

  def filterable_id_fields_changed?
    (changes_to_save_for_record.keys & self.class.filterable_id_fields).present?
  end

  def phone_number_fields_changed?
    (changes_to_save_for_record.keys & self.class.phone_number_fields).present?
  end

  def generate_tokens
    self.class.phonetic_field_names.reduce([]) do |memo, field_name|
      value = data[field_name]
      next(memo) unless value.present?
      next((memo + LanguageService.tokenize(value)).uniq) unless value.is_a?(Array)

      (memo + value.flat_map { |elem| LanguageService.tokenize(elem) }).uniq
    end
  end

  def phonetic_fields_changed?
    (changes_to_save_for_record.keys & self.class.phonetic_field_names).present?
  end
end
