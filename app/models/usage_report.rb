# frozen_string_literal: true

# Copyright (c) 2014 UNICEF. All rights reserved.

# Class to export UsageReport
# rubocop:disable Metrics/ClassLength
class UsageReport < ValueObject
  attr_accessor :from, :to, :include_user_metrics, :data

  def initialize(args = {})
    args[:from] = first_day_of_quarter unless args[:from].respond_to?(:strftime)
    args[:to] = Time.now.to_date.to_time unless args[:to].respond_to?(:strftime)
    super(args)
  end

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def build
    return if data.present?

    agencies = build_agencies
    self.data = {
      cases_total: records(Child).count,
      cases_open_total: records_open_count(Child),
      incidents_total: records(Incident).count,
      incidents_open_total: records_open_count(Incident),
      agencies:,
      agencies_total: agencies.size,
      modules: build_modules,
      users_by_role: build_users_by_role
    }.with_indifferent_access
    data.merge!(build_user_metrics) if include_user_metrics
  end
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/AbcSize

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def build_user_metrics
    {
      maximum_users_warning: SystemSettings.current.maximum_users_warning,
      maximum_users: SystemSettings.current.maximum_users,
      standard_users_total: User.standard.size,
      limited_users_total: User.by_category(Role::CATEGORY_LIMITED).size,
      identified_users_total: User.by_category(Role::CATEGORY_IDENTIFIED).size,
      system_users_total: User.by_category(Role::CATEGORY_SYSTEM).size,
      maintenance_users_total: User.by_category(Role::CATEGORY_MAINTENANCE).size,
      last_login: AuditLog.last_login&.timestamp,
      storage_total: SystemSettings.current.total_attachment_file_size,
      storage_per_user: SystemSettings.current.total_attachment_file_size_per_user
    }.with_indifferent_access
  end
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/AbcSize

  def build_agencies
    agencies = Agency.pluck(:id, :unique_id).each_with_object({}) do |agency, hash|
      hash[agency[0]] =
        { unique_id: agency[1], users_total: 0, users_active: 0, users_disabled: 0, users_new: 0 }
    end
    User.all.each do |user|
      next unless user.agency_id.present?

      count_user_for_agency(agencies, user)
    end
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
      module_hash = { unique_id: primero_module.unique_id, name: primero_module.name }
      if primero_module.associated_record_types.include?('case')
        module_hash = module_hash.merge(build_modules_cases(primero_module.unique_id))
      end
      if primero_module.associated_record_types.include?('incident')
        module_hash = module_hash.merge(build_modules_incidents(primero_module.unique_id))
      end
      module_hash
    end
  end

  def build_modules_cases(module_id)
    {
      cases_total: records_with_module(Child, module_id).count,
      cases_open: cases_open_count(module_id),
      cases_closed: cases_closed_count(module_id),
      cases_open_this_quarter: records_open_this_quarter(Child, module_id),
      cases_closed_this_quarter: records_closed_this_quarter(Child, module_id),
      services_total: cases_subform_total(module_id)['service_count'],
      followups_total: cases_subform_total(module_id)['followups_count']
    }
  end

  def build_modules_incidents(module_id)
    {
      incidents_total: records_with_module(Incident, module_id).count,
      incidents_open_this_quarter: records_open_this_quarter(Incident, module_id)
    }
  end

  def build_users_by_role(user = nil, params = {})
    count_users_by_role(user, params).each_with_object({}) do |elem, memo|
      role_unique_id = elem['role_unique_id']
      user_group_unique_id = elem['user_group_unique_id']
      count = elem['count']

      aggregate_result_group(memo, 'overall', role_unique_id, count)
      aggregate_result_group(memo, user_group_unique_id, role_unique_id, count)
    end
  end

  def aggregate_result_group(results, user_group_unique_id, role_unique_id, count)
    results[user_group_unique_id] ||= { 'total' => 0 }
    results[user_group_unique_id][role_unique_id] ||= 0
    results[user_group_unique_id][role_unique_id] += count
    results[user_group_unique_id]['total'] += count
  end

  def count_users_by_role(user, params = {})
    query = users_in_scope(user).group('user_groups.unique_id', 'roles.unique_id').select(
      'user_groups.unique_id AS user_group_unique_id, roles.unique_id AS role_unique_id, COUNT(*)'
    ).where(
      {
        disabled: params[:disabled],
        user_groups: { unique_id: params[:user_group_unique_id] }.compact.presence,
        agencies: { unique_id: params[:agency_unique_id] }.compact.presence
      }.compact_deep
    )

    User.connection.select_all(query.to_sql).to_a
  end

  def users_in_scope(user)
    query = User.joins(:user_groups, :role, :agency)
    return query if user.blank? || user.managed_report_scope_all?

    if current_user.managed_report_scope == Permission::AGENCY
      query.where(agency_id: user.agency_id)
    elsif current_user.managed_report_scope == Permission::GROUP
      query.where(user_groups: { unique_id: user.user_group_unique_ids })
    else
      query.where(user_name: user.user_name)
    end
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

  def records(recordtype)
    filter = SearchFilters::BooleanValue.new(field_name: 'record_state', value: true)
    recordtype.where(filter.query(recordtype))
  end

  def records_open_count(recordtype)
    filter = SearchFilters::TextValue.new(field_name: 'status', value: Record::STATUS_OPEN)
    records(recordtype).where(filter.query(Child)).count
  end

  def records_with_module(recordtype, module_id)
    filter = SearchFilters::TextValue.new(field_name: 'module_id', value: module_id)
    records(recordtype).where(filter.query(recordtype))
  end

  def cases_open_count(module_id)
    filter = SearchFilters::TextValue.new(field_name: 'status', value: Record::STATUS_OPEN)
    records_with_module(Child, module_id).where(filter.query(Child)).count
  end

  def cases_closed_count(module_id)
    filter = SearchFilters::TextValue.new(field_name: 'status', value: Record::STATUS_CLOSED)
    records_with_module(Child, module_id).where(filter.query(Child)).count
  end

  def records_open_this_quarter(recordtype, module_id)
    filter = SearchFilters::DateRange.new(field_name: 'created_at', from:, to:)
    records_with_module(recordtype, module_id).where(filter.query(recordtype)).count
  end

  def records_closed_this_quarter(recordtype, module_id)
    filter = SearchFilters::DateRange.new(field_name: 'date_closure', from:, to:)
    records_with_module(recordtype, module_id).where(filter.query(recordtype)).count
  end

  def cases_subform_total_query
    <<~SQL
      SELECT
        SUM(JSONB_ARRAY_LENGTH(data->'services_section')) AS service_count,
        SUM(JSONB_ARRAY_LENGTH(data->'followup_subform_section')) AS followups_count
      FROM cases
      WHERE srch_module_id = ?
      AND (
        JSONB_ARRAY_LENGTH(data->'services_section') > 0
        OR JSONB_ARRAY_LENGTH(data->'followup_subform_section') > 0
      )
    SQL
  end

  def cases_subform_total(module_id)
    return @cases_subform_total if @cases_subform_total.present?

    @cases_subform_total = ActiveRecord::Base.connection.exec_query(
      ActiveRecord::Base.sanitize_sql_array([cases_subform_total_query, module_id])
    ).to_a.first
  end
end
# rubocop:enable Metrics/ClassLength
