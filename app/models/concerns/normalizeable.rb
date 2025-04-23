# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Concern for updating searchable columns.
# Ensure that the parent record invokes `save_searchable_fields` when this concern is included.
module Normalizeable
  extend ActiveSupport::Concern

  # ClassMethods
  module ClassMethods
    def searchable_columns
      column_names.grep(/srch/)
    end

    def searchable_field_names
      searchable_columns.map { |column| column.gsub('srch_', '') }
    end

    def searchable_column_array?(column_name)
      column_hash[column_name].array
    end

    def searchable_field_name?(field_name)
      searchable_field_names.include?(field_name)
    end
  end

  def save_searchable_fields
    return unless searchable_fields_changed?

    self.class.searchable_field_names.each do |field_name|
      send("srch_#{field_name}=", data[field_name])
    end
  end

  def searchable_fields_changed?
    (changes_to_save_for_record.keys & self.class.searchable_field_names).present?
  end
end
