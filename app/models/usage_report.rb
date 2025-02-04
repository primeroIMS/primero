# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# class for Usage Report
class UsageReport
  include ActiveModel::Model

  class << self
    def user_agencies(agency_id)
      User.joins(:agency).where(agencies: { unique_id: agency_id })
    end

    def all_users(agency)
      user_agencies(agency.unique_id)
    end

    def active_users(agency)
      user_agencies(agency.unique_id).where(disabled: false)
    end

    def disabled_users(agency)
      user_agencies(agency.unique_id).where(disabled: true)
    end

    def new_quarter_users(agency, start_date, end_date)
      user_agencies(agency.unique_id).where('DATE(users.created_at) BETWEEN ? AND ?', start_date, end_date)
    end

    def all_agencies
      Agency.all
    end

    def modules
      PrimeroModule.all
    end

    def total_records(module_id, recordtype)
      recordtype.where("data->>'module_id' = ?", module_id)
    end

    def open_cases(module_id)
      Child.where("data->>'module_id' = ? AND data->>'status' = ?", module_id, 'open')
    end

    def closed_cases(module_id)
      Child.where("data->>'module_id' = ? AND data->>'status' = ?", module_id, 'closed')
    end

    def new_records_quarter(module_id, start_date, end_date, recordtype)
      recordtype.where(
        "data->>'module_id' = ? AND CAST(data->>'created_at' AS DATE) BETWEEN ? AND ?",
        module_id, start_date, end_date
      )
    end

    def closed_cases_quarter(module_id, start_date, end_date)
      Child.where(
        "data->>'module_id' = ? AND CAST(data->>'date_closure' AS DATE) BETWEEN ? AND ?",
        module_id, start_date, end_date
      )
    end

    def total_services(module_id)
      cases = Child.where("data->>'module_id' = ?", module_id)
      cases.flat_map { |c| c.data['services_section'] }.compact
    end

    def total_followup(module_id)
      cases = Child.where("data->>'module_id' = ?", module_id)
      cases.flat_map { |c| c.data['followup_subform_section'] }.compact
    end
  end
end
