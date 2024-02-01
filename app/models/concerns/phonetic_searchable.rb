# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Concern that allow records to be searchable through phonetics
module PhoneticSearchable
  extend ActiveSupport::Concern

  included do
    store_accessor :data, :phonetic_search
    before_save :recalculate_phonetic_search_field
  end

  def recalculate_phonetic_search_field
    return unless phonetic_fields_changed?

    self.phonetic_search = Searchable::PHONETIC_FIELD_NAMES.reduce([]) do |memo, field_name|
      memo + phonetic_field_to_array(field_name)
    end
  end

  def phonetic_field_to_array(field_name)
    return [] unless data[field_name].present?

    data[field_name]&.split&.map do |value|
      diacriticless = LanguageService.strip_diacritics(value)
      next(diacriticless) unless LanguageService.latin?(value)

      Text::Metaphone.double_metaphone(diacriticless).first
    end
  end

  def phonetic_fields_changed?
    (changes_to_save_for_record.keys & Searchable::PHONETIC_FIELD_NAMES).present?
  end
end
