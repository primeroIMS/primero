module Exporters
  class RolePermissionsExporter

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
    def export_role_permissions_to_spreadsheet
      @roles = Role.all.to_a.sort_by {|i| i.name }
      @role_permissions_array = @roles.map do |r|
        r.permissions.map{|p| [p.resource, p.to_h]}.to_h
      end
      permissions_all = Permission.all_available
      header = ["Resource", "Action"] + @roles.map{|r| r.name}
      write_row header

      write_general_permissions

      permissions_all.each do |permission_group|
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
      attr_keys = ['self', 'group', 'all']
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

    def write_out_permissions_by_resource(permission_group)
      resource_label = I18n.t("permissions.permission.#{permission_group.resource}", locale: @locale)
      write_row resource_label
      permission_group.actions.each do |action|
        permissions = @role_permissions_array.map do |p|
          permission_entry = p[permission_group.resource]
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
        managed_roles_array = @role_permissions_array.map do |p|
          role_managed = p[:role_ids] && (p[:role_ids].include? role.id)
          get_check role_managed
        end
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
        permitted = (r.has_permitted_form_id? form.unique_id) || (r.permitted_form_ids.length == 0)
        get_check permitted
      end
      form_row = ['',form.send("name_#{@locale}")] + forms_permitted_array
      write_row form_row
    end

    def write_row(row_data)
      @worksheet.write(@row, 0, row_data)
      @row+=1
    end

    def get_check(cell_attr)
      return cell_attr ? '✔' : ''
    end

  end
end
