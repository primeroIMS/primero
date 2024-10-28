# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Concern that allow records to be searchable through phonetics
# TODO: Once the Searchable concern is deprecated this concern will be renamed to Searchable
module PhoneticSearchable
  extend ActiveSupport::Concern

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
  end

  def recalculate_phonetic_tokens
    return unless phonetic_fields_changed?

    self.tokens = generate_tokens
  end

  def recalculate_searchable_identifiers
    return unless filterable_id_fields_changed?

    generate_searchable_identifiers
  end

  def generate_searchable_identifiers
    identifiers_to_save = identifiers_to_update

    self.class.filterable_id_fields.each do |field_name|
      value = data[field_name]&.strip
      next if value.blank? || identifiers_to_save.any? { |identifier| identifier[:field_name] == field_name }

      identifiers_to_save << { field_name:, value: }
    end

    self.searchable_identifiers_attributes = identifiers_to_save
  end

  def identifiers_to_update
    searchable_identifiers.map do |searchable_identifier|
      {
        field_name: searchable_identifier.field_name,
        value: data[searchable_identifier.field_name]&.strip,
        id: searchable_identifier.id
      }
    end
  end

  def filterable_id_fields_changed?
    (changes_to_save_for_record.keys & self.class.filterable_id_fields).present?
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
