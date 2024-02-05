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
      next(memo) unless data[field_name].present?

      memo + PhoneticSearchService.tokenize(data[field_name])
    end
  end

  def phonetic_fields_changed?
    (changes_to_save_for_record.keys & Searchable::PHONETIC_FIELD_NAMES).present?
  end
end
