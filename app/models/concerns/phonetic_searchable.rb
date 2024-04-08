# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Concern that allow records to be searchable through phonetics
module PhoneticSearchable
  extend ActiveSupport::Concern

  included do
    store_accessor :phonetic_data, :tokens

    before_save :recalculate_phonetic_tokens
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

  def generate_tokens
    self.class.phonetic_field_names.reduce([]) do |memo, field_name|
      next(memo) unless data[field_name].present?

      memo + LanguageService.tokenize(data[field_name])
    end
  end

  def phonetic_fields_changed?
    (changes_to_save_for_record.keys & self.class.phonetic_field_names).present?
  end
end
