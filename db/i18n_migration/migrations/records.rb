# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

puts 'Migrating (i18n): Records'

include MigrationHelper

record_classes = [Child, TracingRequest, Incident]

record_classes.each do |record_type|
  MigrationHelper.get_field_options(record_type.locale_prefix)

  record_type.each_slice do |records|
    records_to_save = []

    records.each do |record|
      record.each do |k, v|
      end

      records_to_save << record
    end

    record_type.save_all!(records_to_save) if records_to_save.present?
  end
end
