# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Concern that allow records to be searchable through phonetics
module PhoneticSearchable
  extend ActiveSupport::Concern

  included do
    has_many :searchable_identifiers, as: :record
    store_accessor :phonetic_data, :tokens

    before_save :recalculate_phonetic_tokens
    before_save :recalculate_searchable_identifiers
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
    return unless searchable_identifiers_changed?

    generate_searchable_identifiers
  end

  def generate_searchable_identifiers
    self.class.filterable_id_fields.each do |field_name|
      value = data[field_name]
      next unless value.present?

      create_or_update_searchable_identifier!(field_name, value)
    end
  end

  def create_or_update_searchable_identifier!(field_name, value)
    searchable_identifier = searchable_identifiers.select { |identifier| identifier.field_name == field_name }

    if searchable_identifier.present? && searchable_identifier.value != value
      searchable_identifier.value = value
      searchable_identifier.save!
    else
      searchable_identifiers << SearchableIdentifier.new(field_name:, value:)
    end
  end

  def searchable_identifiers_changed?
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
