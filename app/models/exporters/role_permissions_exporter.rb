# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# TODO: Adding the frozen_string_literal breaks rspec tests

require 'write_xlsx'

# Exports Role Permissions to an Excel file
# rubocop:disable Metrics/ClassLength
class Exporters::RolePermissionsExporter
  CASE = %w[
    referral transfer read create write enable_disable_record flag resolve_any_flag flag_update manage add_note reopen
    close change_log view_incident_from_case view_protection_concerns_filter list_case_names view_registry_record
    add_registry_record view_family_record case_from_family link_family_record remove_alert service_own_entries_only
    create_case_from_referral view_case_relationships update_case_relationships access_log
  ].freeze
  CASE_EXPORTS = %w[
    export_list_view_csv export_csv export_xls export_photowall export_unhcr_csv export_pdf consent_override
    export_duplicate_id_csv export_json export_custom import sync_mobile sync_external
  ].freeze
  CASE_APPROVALS = %w[
    request_approval_assessment request_approval_case_plan request_approval_closure request_approval_action_plan
    request_approval_gbv_closure approve_assessment approve_case_plan approve_closure approve_action_plan
    approve_gbv_closure self_approve
  ].freeze
  CASE_MANAGED_OTHER_USERS = %w[
    search_owned_by_others display_view_page view_photo incident_from_case
    incident_details_from_case service_provision_incident_details services_section_from_case
    accept_or_reject_transfer
  ].freeze
  CASE_ASSIGNMENT_REFERRALS_TRANSFERS = %w[
    assign assign_within_agency assign_within_user_group remove_assigned_users
    receive_transfer receive_referral receive_referral_different_module request_transfer referral_from_service
    find_tracing_match
  ].freeze

  class << self
    def id
      'rolepermission'
    end

    def mime_type
      'xlsx'
    end

    def supported_models
      [Child]
    end

    def authorize_fields_to_user?
      false
    end
  end

  def initialize(export_file, locale = :en)
    @export_file_name = export_file || temp_file_name
    @locale = locale
    @io = File.new(@export_file_name, 'w')
    @workbook = WriteXLSX.new(@io)
    @worksheet = @workbook.add_worksheet('Role Permissions')
    @row = 0
  end

  def complete
    @workbook.close
    @io.close unless @io.closed?
    puts "Exported to #{@export_file_name}"
    @io
  end

  def export_file
    @export_file_name
  end

  # Exports forms to an Excel spreadsheet
  def export(*_args)
    write_header
    write_permissions
    write_permitted_forms
    complete
  end

  def write_header
    @roles = Role.all.to_a.sort_by(&:name)
    @role_permissions_array = @roles.map do |r|
      r.permissions.to_h { |p| [p.resource, p.to_h] }
    end
    header = %w[Resource Action] + @roles.map(&:name)
    write_row(header, true)
    add_format(header.count)
  end

  def write_permissions
    write_group_permissions
    write_referral_transfer_permissions
    permissions_all = Permission.all_available
    write_case_permission(permissions_all.first)
    write_resource_permissions(permissions_all)
  end

  def write_group_permissions
    group_permission_header_row = [I18n.t('role.group_permission_label', locale: @locale)]
    write_row(group_permission_header_row)
    %w[self group admin_only all].each do |attr_key|
      group_permission_row = ['', I18n.t("permissions.permission.#{attr_key}", locale: @locale)]
      group_permissions_checks = @roles.map { |r| get_check(r.group_permission == attr_key) }
      group_permission_row += group_permissions_checks
      write_row(group_permission_row)
    end
  end

  def write_referral_transfer_permissions
    %w[referral transfer].each do |attr_key|
      header_row = [I18n.t("permissions.permission.#{attr_key}", locale: @locale)]
      write_row header_row

      permission_row = ['', I18n.t("role.#{attr_key}_label", locale: @locale)]
      permission_row += @roles.map { |r| get_check r.send(attr_key) }
      write_row permission_row
    end
  end

  def write_case_permission(permission)
    case_permissions = [
      permission_case(permission), permission_case_exports(permission), permission_case_approvals(permission),
      permission_cases_managed_other_users(permission), case_assignments_referrals_transfers(permission)
    ]
    case_permissions.each { |case_permission| write_out_permissions_by_resource(case_permission, Permission::CASE) }
  end

  def permission_case(permission)
    Permission.new(resource: Permission::CASE, actions: permission.actions.select { |action| CASE.include?(action) })
  end

  def permission_case_exports(permission)
    Permission.new(resource: 'case_exports',
                   actions: permission.actions.select { |action| CASE_EXPORTS.include?(action) })
  end

  def permission_case_approvals(permission)
    Permission.new(resource: 'case_approvals',
                   actions: permission.actions.select { |action| CASE_APPROVALS.include?(action) })
  end

  def permission_cases_managed_other_users(permission)
    Permission.new(resource: 'cases_managed_other_users',
                   actions: permission.actions.select { |action| CASE_MANAGED_OTHER_USERS.include?(action) })
  end

  def case_assignments_referrals_transfers(permission)
    Permission.new(resource: 'case_assignments_referrals_transfers',
                   actions: permission.actions.select { |action| CASE_ASSIGNMENT_REFERRALS_TRANSFERS.include?(action) })
  end

  def write_resource_permissions(permissions_all)
    permissions_all.drop(1).each do |permission_group|
      write_out_permissions_by_resource(permission_group)
    end
  end

  def write_out_permissions_by_resource(permission_group, permission_resource = nil)
    resource_label = I18n.t("permissions.permission.#{permission_group.resource}", locale: @locale)
    write_row resource_label
    permission_group.actions.each do |action|
      write_resource_permission_row(permission_resource, permission_group, action)
    end
    write_managed_roles if permission_group.resource == 'role'
  end

  def write_resource_permission_row(permission_resource, permission_group, action)
    permissions = @role_permissions_array.map do |p|
      permission_entry = permission_resource.nil? ? p[permission_group.resource] : p[permission_resource]
      has_action =
        permission_entry && permission_entry['actions'] && (permission_entry['actions'].include? action)
      get_check has_action
    end
    permission_row = ['', I18n.t("permissions.permission.#{action}", locale: @locale)] + permissions
    write_row permission_row
  end

  def write_managed_roles
    resource_label = I18n.t('role.role_ids_label', locale: @locale)
    write_row resource_label
    @roles.each do |role|
      managed_roles_array =
        @role_permissions_array.map { |p| '✔' if p['role']&.dig('role_unique_ids')&.include? role.unique_id }
      role_row = ['', role.name] + managed_roles_array
      write_row role_row
    end
  end

  def write_permitted_forms
    @forms_by_record_type = FormSection.all_forms_grouped_by_parent
    @forms_by_record_type.each { |record_type, forms| write_out_permitted_form_record_type record_type, forms }
  end

  def write_out_permitted_form_record_type(record_type, forms)
    record_type_row = [
      I18n.t('forms.label', locale: @locale),
      ' - ',
      I18n.t("permissions.permission.#{record_type}", locale: @locale)
    ].join
    write_row record_type_row
    forms.each { |form| write_out_permitted_form form }
  end

  def write_out_permitted_form(form)
    forms_permitted_array = @roles.map do |r|
      permitted = (r.permitted_form_id? form.unique_id) || r.form_sections.empty?
      get_check permitted
    end
    form_row = ['', form.send("name_#{@locale}")] + forms_permitted_array
    write_row form_row
  end

  def write_row(row_data, bold = false)
    format = @workbook.add_format(bold: 1, text_wrap: 1) if bold

    @worksheet.write(@row, 0, row_data, format)
    @row += 1
  end

  def get_check(cell_attr)
    cell_attr ? '✔' : ''
  end

  def add_format(col_count)
    @worksheet.set_column('A:A', 35, @workbook.add_format(bold: 1, text_wrap: 1))
    @worksheet.set_column('B:B', 50, @workbook.add_format(text_wrap: 1))
    @worksheet.set_column(2, col_count - 1, 32, @workbook.add_format(text_wrap: 1))
  end

  def temp_file_name
    dir_name = File.join(Rails.root, 'tmp', 'cleanup')
    FileUtils.mkdir_p(dir_name)
    "#{File.join(dir_name, SecureRandom.uuid)}.xls"
  end
end
# rubocop:enable Metrics/ClassLength
