# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Class to build search filters
class ManagedReports::FilterService
  class << self
    def to_datetime(date_param)
      return unless date_param.present?

      date_param.from = date_param.from.to_datetime.beginning_of_day
      date_param.to = date_param.to.to_datetime.end_of_day
      date_param
    end

    def consent_reporting
      return unless consent_reporting_visible?

      SearchFilters::BooleanValue.new(field_name: 'consent_reporting', value: true)
    end

    def filter_next_steps(record_class, next_step = 'a_continue_protection_assessment')
      SearchFilters::TextValue.new(field_name: 'next_steps', value: next_step).query(record_class)
    end

    def consent_reporting_visible?
      Field.find_by(name: 'consent_reporting')&.visible?
    end

    def reporting_location(location_param)
      # TODO: Since all params are the same for a report, this should not be needed,
      # the frontend can pass the appropiate param
      return unless location_param.present?

      SearchFilters::LocationValue.new(field_name: 'owned_by_location', value: location_param.value)
    end

    def module_id(module_id_params)
      return unless module_id_params.present?

      SearchFilters::Value.new(field_name: 'module_id', value: module_id_params.value)
    end

    def scope(current_user)
      return if current_user.blank? || current_user.managed_report_scope_all?

      if current_user.managed_report_scope == Permission::AGENCY
        SearchFilters::TextValue.new(field_name: 'associated_user_agencies', value: current_user.agency.unique_id)
      elsif current_user.managed_report_scope == Permission::GROUP
        SearchFilters::TextList.new(field_name: 'associated_user_groups', values: current_user.user_group_unique_ids)
      else
        SearchFilters::TextValue.new(field_name: 'associated_user_names', value: current_user.user_name)
      end
    end
  end
end
