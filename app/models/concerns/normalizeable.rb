# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Concern that saves and updated searchable values
module Normalizeable
  extend ActiveSupport::Concern

  included do
    attr_accessor :normalized_field_names

    has_many :searchable_values, as: :record
    has_many :searchable_numerics, as: :record
    has_many :searchable_datetimes, as: :record

    accepts_nested_attributes_for :searchable_values
    accepts_nested_attributes_for :searchable_numerics
    accepts_nested_attributes_for :searchable_datetimes

    before_save :save_normalized_data
  end

  def save_normalized_data
    return unless searchable_fields_changed?

    create_or_update_searchable_record
  end

  def create_or_update_searchable_record
    normalized_field_names.each do |searchable_type, fields|
      data_to_save = searchable_values_to_update(searchable_type)

      fields.each do |field_name|
        value = data[field_name]
        next if value.blank? || data_to_save.any? { |searchable| searchable[:field_name] == field_name }

        data_to_save << { field_name:, value: }
      end

      send("#{searchable_type}_attributes=", data_to_save)
    end
  end

  def searchable_values_to_update(key)
    send(key).map do |searchable|
      {
        field_name: searchable.field_name,
        value: data[searchable.field_name],
        id: searchable.id
      }
    end
  end

  def searchable_fields_changed?
    (changes_to_save_for_record.keys & normalized_field_names.values.flatten).present?
  end
end
