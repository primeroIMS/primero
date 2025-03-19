# frozen_string_literal: true

# Copyright (c) 2014 UNICEF. All rights reserved.

# Class to export UsageReport
class UsageReport < ValueObject
  attr_accessor :from, :to, :data

  def initialize(args = {})
    args[:from] = first_day_of_quarter unless args[:from].respond_to?(:strftime)
    args[:to] = Time.now.to_date.to_time unless args[:to].respond_to?(:strftime)
    super(args)
  end

  def build
    return if data.present?

    self.data = {}.with_indifferent_access
    data[:agencies] = build_agencies
    data[:agencies_total] = data[:agencies].size
    data[:modules] = build_modules
  end

  def build_agencies
    agencies = Agency.pluck(:id, :unique_id).each_with_object({}) do |agency, hash|
      hash[agency[0]] =
        { unique_id: agency[1], users_total: 0, users_active: 0, users_disabled: 0, users_new: 0 }
    end
    User.all.each { |user| count_user_for_agency(agencies, user) }
    agencies.values
  end

  def count_user_for_agency(agencies_hash, user)
    agencies_hash[user.agency_id][:users_total] += 1
    if user.disabled
      agencies_hash[user.agency_id][:users_disabled] += 1
    else
      agencies_hash[user.agency_id][:users_active] += 1
    end
    agencies_hash[user.agency_id][:users_new] += 1 if newly_created?(user)
  end

  def newly_created?(user)
    user.created_at.between?(from, to)
  end

  def build_modules
    PrimeroModule.all.map do |primero_module|
      unique_id = primero_module.unique_id
      module_hash = { unique_id:, name: primero_module.name }
      if primero_module.associated_record_types.include?('case')
        module_hash = module_hash.merge(build_modules_cases(unique_id))
      end
      if primero_module.associated_record_types.include?('incident')
        module_hash.merge(build_modules_incidents(unique_id))
      end
    end
  end

  def build_modules_cases(module_id)
    {
      cases_total: records(Child, module_id).count,
      cases_open: cases_open_count(module_id),
      cases_closed: cases_closed_count(module_id),
      cases_open_this_quarter: records_open_this_quarter(Child, module_id),
      cases_closed_this_quarter: records_open_this_quarter(Child, module_id),
      services_total: cases_subform_total(module_id, 'services_section'),
      followups_total: cases_subform_total(module_id, 'followup_subform_section')
    }
  end

  def build_modules_incidents(module_id)
    {
      incidents_total: UsageReportService.get_total_records(module_id, Incident),
      incidents_open_this_quarter: UsageReportService.get_new_records_quarter(module_id, from, to, Incident)
    }
  end

  def quarter
    return unless from.present? && to.present?

    ((from.month - 1) / 3) + 1
  end

  def first_day_of_quarter
    today = Date.today
    first_month_of_quarter = today.month - ((today.month - 1) % 3)
    Time.new(today.year, first_month_of_quarter, 1)
  end

  # TODO: Change these query methods in v2.13 to use the normalized value index
  def records(recordtype, module_id)
    filter = SearchFilters::TextValue.new(field_name: 'module_id', value: module_id)
    recordtype.where(filter.query)
  end

  def cases_open_count(module_id)
    filter = SearchFilters::TextValue.new(field_name: 'status', value: Record::STATUS_OPEN)
    records(Child, module_id).where(filter.query).count
  end

  def cases_closed_count(module_id)
    filter = SearchFilters::TextValue.new(field_name: 'status', value: Record::STATUS_CLOSED)
    records(Child, module_id).where(filter.query).count
  end

  def records_open_this_quarter(recordtype, module_id)
    filter = SearchFilters::DateRange.new(field_name: 'created_at', from:, to:)
    records(recordtype, module_id).where(filter.query).count
  end

  def records_closed_this_quarter(recordtype, module_id)
    filter = SearchFilters::DateRange.new(field_name: 'date_closure', from:, to:)
    records(recordtype, module_id).where(filter.query).count
  end

  def cases_subform_total(module_id, subform)
    query = <<~SQL
      SELECT COUNT(*)
      FROM (
        SELECT jsonb_array_elements(data->'#{subform}') AS subform
        FROM cases
        WHERE data->>'module_id' = ?
      ) subquery
    SQL

    ActiveRecord::Base.connection.exec_query(ActiveRecord::Base.sanitize_sql_array([query, module_id]))
                      .rows.flatten.first.to_i
  end
end
