require 'writeexcel'

module Exporters
  class RolePermissionsExporter
    CASE = %w[referral transfer read create write enable_disable_record flag manage add_note reopen close]
    CASE_EXPORTS = %w[
      export_list_view_csv export_csv export_xls export_photowall export_unhcr_csv consent_override
      export_duplicate_id_csv export_json export_custom import sync_mobile
    ]
    CASE_APPROVALS = %w[
      request_approval_bia request_approval_case_plan request_approval_closure
      approve_bia approve_case_plan approve_closure
    ]
    CASE_MANAGED_OTHER_USERS = %w[
      search_owned_by_others display_view_page view_photo incident_from_case
      incident_details_from_case service_provision_incident_details services_section_from_case
    ]
    CASE_ASSIGNMENT_REFERRALS_TRANSFERS = %w[
      assign assign_within_agency assign_within_user_group remove_assigned_users
      receive_transfer receive_referral request_transfer referral_from_service find_tracing_match
    ]

    class << self
      def id
        'rolepermission'
      end

      def mime_type
        'xls'
      end

      def supported_models
        [Child]
      end

      def authorize_fields_to_user?
        false
      end
    end

    def initialize(export_file, locale=:en)
      @export_file_name = export_file || CleansingTmpDir.temp_file_name
      @locale = locale
      @io = File.new(@export_file_name, "w")
      @workbook = WriteExcel.new(@io)
      @worksheet = @workbook.add_worksheet("Role Permissions")
      @row = 0
    end

    def complete
      @workbook.close
      @io.close if !@io.closed?
      puts "Exported to " + @export_file_name
      return @io
    end

    def export_file
      return  @export_file_name
    end

    # Exports forms to an Excel spreadsheet
    def export(*_args)
      @roles = Role.all.to_a.sort_by {|i| i.name }
      @role_permissions_array = @roles.map do |r|
        r.permissions.map{|p| [p.resource, p.to_h]}.to_h
      end
      permissions_all = Permission.all_available
      header = ["Resource", "Action"] + @roles.map{|r| r.name}
      write_row(header, true)
      add_format(header.count)
      write_general_permissions
      write_case_permission(permissions_all.first)

      permissions_all.drop(1).each do |permission_group|
        write_out_permissions_by_resource(permission_group)
      end
      @forms_by_record_type = FormSection.all_forms_grouped_by_parent
      @forms_by_record_type.each {|record_type, forms| write_out_permitted_form_record_type record_type, forms }
      complete
    end

    def write_general_permissions
      # Group permissions
      group_permission_header_row = [I18n.t("role.group_permission_label", locale: @locale)]
      write_row group_permission_header_row
      attr_keys = %w[self group admin_only all]
      attr_keys.each do |attr_key|
        group_permission_row = ['', I18n.t("permissions.permission.#{attr_key}", locale: @locale)]
        group_permissions_checks = @roles.map { |r| get_check(r.group_permission == attr_key) }
        group_permission_row += group_permissions_checks
        write_row group_permission_row
      end

      # Referral and transfer permissions
      attr_keys = ['referral', 'transfer']
      attr_keys.each do |attr_key|
        header_row = [I18n.t("permissions.permission.#{attr_key}", locale: @locale)]
        write_row header_row

        permission_row = ['', I18n.t("role.#{attr_key}_label", locale: @locale)]
        permission_row += @roles.map {|r| get_check r.send(attr_key) }
        write_row permission_row
      end
    end

    def write_case_permission(permission)
      case_permissions = [
        Permission.new(resource: Permission::CASE, actions: permission.actions.select { |action| CASE.include?(action) }),
        Permission.new(resource: 'case_exports', actions: permission.actions.select { |action| CASE_EXPORTS.include?(action) }),
        Permission.new(resource: 'case_approvals', actions: permission.actions.select { |action| CASE_APPROVALS.include?(action) }),
        Permission.new(resource: 'cases_managed_other_users', actions: permission.actions.select { |action| CASE_MANAGED_OTHER_USERS.include?(action) }),
        Permission.new(resource: 'case_assignments_referrals_transfers', actions: permission.actions.select { |action| CASE_ASSIGNMENT_REFERRALS_TRANSFERS.include?(action) })
      ]
      case_permissions.each { |case_permission| write_out_permissions_by_resource(case_permission, Permission::CASE) }
    end

    def write_out_permissions_by_resource(permission_group, permission_resource = nil)
      resource_label = I18n.t("permissions.permission.#{permission_group.resource}", locale: @locale)
      write_row resource_label
      permission_group.actions.each do |action|
        permissions = @role_permissions_array.map do |p|
          permission_entry = permission_resource.nil? ? p[permission_group.resource] : p[permission_resource]
          has_action = (permission_entry && permission_entry['actions'] && (permission_entry['actions'].include? action))
          get_check has_action
        end
        permission_row = ["", I18n.t("permissions.permission.#{action}", locale: @locale)] + permissions
        write_row permission_row
      end
      write_managed_roles if permission_group.resource == 'role'
    end

    def write_managed_roles
      resource_label = I18n.t("role.role_ids_label", locale: @locale)
      write_row resource_label
      for i in (0..@roles.length-1)
        role = @roles[i]
        managed_roles_array = @role_permissions_array.map{ |p| '✔' if p.dig('role')&.dig('role_unique_ids')&.include? role.unique_id }
        role_row = ["", role.name] + managed_roles_array
        write_row role_row
      end
    end

    def write_out_permitted_form_record_type(record_type, forms)
      record_type_row = [
        I18n.t("forms.label", locale: @locale),
        " - ",
        I18n.t("permissions.permission.#{record_type}", locale: @locale)
      ].join
      write_row record_type_row
      forms.each {|form| write_out_permitted_form form }
    end

    def write_out_permitted_form(form)
      forms_permitted_array = @roles.map do |r|
        permitted = (r.has_permitted_form_id? form.unique_id) || (r.form_sections.size == 0)
        get_check permitted
      end
      form_row = ['',form.send("name_#{@locale}")] + forms_permitted_array
      write_row form_row
    end

    def write_row(row_data, bold = false)
      format = @workbook.add_format(bold: 1, text_wrap: 1) if bold

      @worksheet.write(@row, 0, row_data, format)
      @row+=1
    end

    def get_check(cell_attr)
      return cell_attr ? '✔' : ''
    end

    def add_format(col_count)
      @worksheet.set_column('A:A', 35, @workbook.add_format(bold: 1, text_wrap: 1))
      @worksheet.set_column('B:B', 50, @workbook.add_format(text_wrap: 1))
      @worksheet.set_column(2, (col_count - 1), 32, @workbook.add_format(text_wrap: 1))
    end
  end
end
