# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Concern for updating searchable columns.
# Ensure that the parent record invokes `save_searchable_fields` when this concern is included.
module Normalizeable
  extend ActiveSupport::Concern

  # ClassMethods
  module ClassMethods
    def searchable_columns
      column_names.grep(/^srch_/)
    end

    def searchable_field_names
      columns_in_map = searchable_field_map.values.flatten.map { |column| column['name'] }
      field_names_in_map = searchable_field_map.keys
      (searchable_columns - columns_in_map).map { |column| column.gsub(/^srch_/, '') } + field_names_in_map
    end

    def searchable_column_array?(column_name)
      columns_hash[column_name].array
    end

    def searchable_field_name?(field_name)
      searchable_field_names.include?(field_name)
    end

    # Defines custom mappings for searchable fields. This is helpful for fields that can hold different types.
    def searchable_field_map
      {}
    end

    def searchable_column_name(field_name)
      return unless searchable_field_name?(field_name)

      searchable_field_map&.dig(field_name, 'name') || "srch_#{field_name}"
    end
  end

  def save_searchable_fields
    return unless searchable_fields_changed?

    klass = self.class
    klass.searchable_field_names.each do |field_name|
      searchable_column = klass.searchable_field_map[field_name]
      if searchable_column.present?
        send("#{searchable_column['name']}=", searchable_value_for_type(searchable_column['type'], data[field_name]))
      else
        send("srch_#{field_name}=", data[field_name])
      end
    end
  end

  def searchable_value_for_type(type, value)
    case type
    when 'integer'
      value&.match?(/\d+/) ? value.to_i : nil
    else
      value
    end
  end

  def searchable_fields_changed?
    (changes_to_save_for_record.keys & self.class.searchable_field_names).present?
  end
end
