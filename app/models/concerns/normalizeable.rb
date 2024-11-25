# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Concern that saves and updated reportable values
module Normalizeable
  extend ActiveSupport::Concern

  included do
    attr_accessor :normalized_field_names

    has_many :reportable_values, as: :record
    has_many :reportable_numeric_values, as: :record
    has_many :reportable_date_values, as: :record

    accepts_nested_attributes_for :reportable_values
    accepts_nested_attributes_for :reportable_numeric_values
    accepts_nested_attributes_for :reportable_date_values

    before_save :save_normalized_data
  end

  def save_normalized_data
    return unless reportable_fields_changed?

    create_or_update_reportable_record
  end

  def create_or_update_reportable_record
    normalized_field_names.each do |key, fields|
      data_to_save = reportable_values_to_update(key)

      fields.each do |field_name|
        value = data[field_name]
        next if value.blank? || data_to_save.any? { |reportable| reportable[:field_name] == field_name }

        data_to_save << { field_name:, value: }
      end

      send("#{key}_attributes=", data_to_save)
    end
  end

  def reportable_values_to_update(key)
    send(key).map do |reportable|
      {
        field_name: reportable.field_name,
        value: data[reportable.field_name],
        id: reportable.id
      }
    end
  end

  def reportable_fields_changed?
    (changes_to_save_for_record.keys & normalized_field_names.values.flatten).present?
  end
end
