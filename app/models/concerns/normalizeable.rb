# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Concern that saves and updated searchable values
module Normalizeable
  extend ActiveSupport::Concern

  included do
    has_many :searchable_values, as: :record
    has_many :searchable_numerics, as: :record
    has_many :searchable_datetimes, as: :record

    accepts_nested_attributes_for :searchable_values, allow_destroy: true
    accepts_nested_attributes_for :searchable_numerics, allow_destroy: true
    accepts_nested_attributes_for :searchable_datetimes, allow_destroy: true

    before_save :save_normalized_data
  end

  def save_normalized_data
    return unless searchable_fields_changed?

    create_or_update_searchable_record
  end

  def create_or_update_searchable_record
    self.class.normalized_field_names.each do |searchable_type, fields|
      data_to_save = searchable_values_to_update(searchable_type)

      fields.each do |field_name|
        value = data[field_name]
        next if value.blank?

        data_to_save += generate_searchable_hashes(data_to_save, field_name, value)
      end

      send("#{searchable_type}_attributes=", data_to_save)
    end
  end

  def generate_searchable_hashes(searchables_to_update, field_name, value)
    if value.is_a?(Array)
      current_values = searchables_to_update.reduce([]) do |memo, searchable|
        next(memo) unless searchable[:field_name] == field_name

        memo + [searchable[:value]]
      end
      (value - current_values).map { |new_value| { field_name:, value: new_value } }
    else
      return [] if searchables_to_update.any? { |searchable| searchable[:field_name] == field_name }

      [{ field_name:, value: }]
    end
  end

  def searchable_values_to_update(key)
    send(key).map do |searchable|
      value = data[searchable.field_name]
      searchable_attributes = { field_name: searchable.field_name, id: searchable.id }
      if searchable_multivalue?(searchable)
        searchable_attributes.merge(value: searchable.value, _destroy: value.exclude?(searchable.value))
      else
        searchable_attributes.merge(value:)
      end
    end
  end

  def searchable_multivalue?(searchable)
    data[searchable.field_name].is_a?(Array) || changes_to_save_for_record[searchable.field_name]&.first.is_a?(Array)
  end

  def searchable_fields_changed?
    (changes_to_save_for_record.keys & self.class.normalized_field_names.values.flatten).present?
  end
end
