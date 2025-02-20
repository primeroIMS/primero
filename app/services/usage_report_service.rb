# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Service class for Usage Report
class UsageReportService
  class << self
    def build(params, user)
      return unless params[:export_format] && params[:record_type]

      params_hash = DestringifyService.destringify(params.except(:password).to_h, true)
      export = BulkExport.new(params_hash)
      export.owner = user
      export
    end

    def enqueue(bulk_export, password = nil, kpi_parameters = nil)
      encrypted_password = EncryptionService.encrypt(password)
      UsageReportJob.perform_later(bulk_export.id, encrypted_password, kpi_parameters)
    end

    def user_agencies(agency_id)
      User.joins(:agency).where(agencies: { unique_id: agency_id })
    end

    def get_all_users(agency)
      user_agencies(agency.unique_id).count
    end

    def get_active_users(agency)
      user_agencies(agency.unique_id).where(disabled: false).count
    end

    def get_disabled_users(agency)
      user_agencies(agency.unique_id).where(disabled: true).count
    end

    def get_new_quarter_users(agency, start_date, end_date)
      user_agencies(agency.unique_id).where('DATE(users.created_at) BETWEEN ? AND ?', start_date, end_date).count
    end

    def all_agencies
      Agency.all
    end

    def modules
      PrimeroModule.all
    end

    def get_total_records(module_id, recordtype)
      recordtype.where("data->>'module_id' = ?", module_id).count
    end

    def get_open_cases(module_id)
      Child.where("data->>'module_id' = ? AND data->>'status' = ?", module_id, 'open').count
    end

    def get_closed_cases(module_id)
      Child.where("data->>'module_id' = ? AND data->>'status' = ?", module_id, 'closed').count
    end

    def get_new_records_quarter(module_id, start_date, end_date, recordtype)
      recordtype.where(
        "data->>'module_id' = ? AND data->>'created_at' BETWEEN ? AND ?",
        module_id, start_date, end_date
      ).count
    end

    def get_closed_cases_quarter(module_id, start_date, end_date)
      Child.where(
        "data->>'module_id' = ? AND data->>'date_closure' BETWEEN ? AND ?",
        module_id, start_date, end_date
      ).count
    end

    def get_total_services(module_id)
      query = <<~SQL
        SELECT COUNT(*)
        FROM (
          SELECT jsonb_array_elements(data->'services_section') AS service_entry
          FROM cases
          WHERE data->>'module_id' = ?
        ) subquery
      SQL

      ActiveRecord::Base.connection.exec_query(ActiveRecord::Base.send(:sanitize_sql_array, [query, module_id]))
                        .rows.flatten.first.to_i
    end

    def get_total_followup(module_id)
      query = <<~SQL
        SELECT COUNT(*)
        FROM (
          SELECT jsonb_array_elements(data->'followup_subform_section') AS followup_entry
          FROM cases
          WHERE data->>'module_id' = ?
        ) subquery
      SQL

      ActiveRecord::Base.connection.exec_query(ActiveRecord::Base.send(:sanitize_sql_array, [query, module_id]))
                        .rows.flatten.first.to_i
    end
  end
end
