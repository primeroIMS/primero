# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

puts 'Migrating (i18n): Reports'

include MigrationHelper

# TODO: extract this into MigrationHelper
report_localized_properties = Report.localized_properties.map(&:to_s)
Report.all.rows.map { |r| Report.database.get(r['id']) }.each do |report|
  report_localized_properties.each do |report_prop|
    next if report[report_prop].blank?

    MigrationHelper.create_locales do |l|
      report["#{report_prop}_#{l}"] = report[report_prop] if report["#{report_prop}_#{l}"].blank?
    end
    report.delete(report_prop)
  end
  report.save
end
