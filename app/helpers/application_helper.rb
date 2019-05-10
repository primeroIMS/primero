# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper

  @@menu_groups = {
    "Home" => "root",
    "Children" => "cases",
    "TracingRequests" => "tracings",
    "Incidents" => "incidents",
    "PotentialMatches" => "matches",
    "Duplicates" => "duplicates",
    "FormSection" => "forms",
    "Fields" => "forms",
    "Lookups" => "forms",
    "Locations" => "forms",
    "Users" => "setting",
    "Agencies" => "setting",
    "Roles" => "setting",
    "UserGroups" => "setting",
    "PrimeroPrograms" => "setting",
    "PrimeroModules" => "setting",
    "SystemSettings" => "setting",
    "ContactInformation" => "setting",
    "Reports" => "reports",
    "BulkExports" => "bulk_exports",
    "Tasks" => "tasks"
  }

  @@alias_role_action_label = {
      "report" => { "read" => "administrator_read" }
  }

  def available_locations
    Dir.glob("public/options/*").map{ |file| file.gsub(/public\/options\//, '') }.to_json.html_safe
  end

  def current_menu(menu_name)
    "current" if @@menu_groups[controller.name] == menu_name
  end

  def current_page(path)
    "current" if current_page?(path)
  end

  def current_actions(*requests)
    requests.each do |request|
      return true if request[:action].is_a?(Array) && request[:action].include?(controller.action_name)
      return true if request[:action] == controller.action_name
    end
    false
  end

  def submit_button(name = t("buttons.save"), additional_classes = nil)
      submit_tag(name, :class => "button btn_submit #{additional_classes}")
  end

  def cancel_button(path)
      link_to t('cancel'), path, data: {confirm: t('messages.cancel_confirmation'), turbolinks: false}, class: "link_cancel button gray"
  end

  def discard_button(path, additional_classes = "gray" )
      link_to t('cancel'), path, data: {confirm: t('messages.confirmation_message'), turbolinks: false}, class: "button #{additional_classes}"
  end

  def link_with_confirm(link_to, anchor, link_options = {})
    link_options.merge!(link_confirm_options(controller))
    link_to link_to, anchor, link_options
  end

  def link_confirm_options(controller)
    confirm_options = { }
    confirm_options[:data] = { }
    confirm_message = t('messages.confirmation_message')
    if /children/.match(controller.controller_name) and /edit|new/.match(controller.action_name)
      confirm_options[:data][:confirm] = confirm_message % { record: 'Child Record' }
    elsif /user/.match(controller.controller_name) and /edit|new/.match(controller.action_name)
      confirm_options[:data][:confirm] = confirm_message % { record: 'Users Page' }
    elsif /form_section/.match(controller.controller_name) and /index/.match(controller.action_name)
      confirm_options[:data][:confirm] = confirm_message % { record: 'Manage Form Sections' }
    end
    confirm_options
  end

  # This is still used by the filter on the ROLES index page
  def translated_permissions
    permissions = Permission.all_grouped.map do |group, permissions|
      [
          I18n.t(group, :scope => "permissions.group"),
          permissions.map do |permission|
            [ I18n.t(permission, :scope => 'permissions.permission'), "#{group}:#{permission}" ]
          end
      ]
    end
  end

  def translated_group_permissions
    translated_hash_list(Permission.management, 'permissions.permission')
  end

  def translated_all_permissions_list
    translated_permissions_list(Permission.all_available)
  end

  def translated_permissions_list(permission_list)
    permission_list.map{|p| {resource: p.resource,
                             resource_translated: I18n.t(p.resource, scope: 'permissions.permission'),
                             actions_translated: translated_hash_list(p.actions, 'permissions.permission', p.resource)}}
  end

  # Input:  an array of strings
  # Input:  scope within dictionary yaml
  # Output: an array of hashes in format {key: <input string>, value: <translation>}
  def translated_hash_list(list, scope, resource=nil)
    list.map do |a|
      key_to_translate = @@alias_role_action_label.keys.include?(resource) && @@alias_role_action_label[resource].try(:[], a) ?
          @@alias_role_action_label[resource][a] : a
      {key: a, value: I18n.t(key_to_translate, :scope => scope)}
    end
  end

  # Used by the view to determine if the resource / action pair in the all translated permission hash
  # exists in the current role's permissions list, and therefore should be checked on the form
  # Input: permission_list (from the current role)
  # Input: resource (from the translated permissions)
  # Input: action_hash (from the translated permissions)
  # Output: true/false
  def is_permission_checked(permission_list = [], resource = "", action_hash = {})
    permission_list.select{|p| p.resource == resource}.any? {|p| p.actions.include? action_hash[:key]}
  end

  def ctl_edit_button(record, path=nil)
    path = path.singularize if path.instance_of? String
    if path.present?
      if record.present?
        # This is necessary to make the translation between children and cases
        link_to t("buttons.edit"), edit_polymorphic_path(path, { follow: true, id: record.id }),
          class: "button #{'green arrow' if current_actions(action: ['update', 'edit'])}"
      else
        #TODO - sort of a hack for language edit, since it uses i18n.locale instead of a model
        link_to t("buttons.edit"), edit_polymorphic_path(path, { follow: true }),
          class: "button #{'green arrow' if current_actions(action: ['update', 'edit'])}"
      end
    else
      link_to t("buttons.edit"), edit_polymorphic_path(record, { follow: true }),
        class: "button #{'green arrow' if current_actions(action: ['update', 'edit'])}"
    end
  end

  def ctl_cancel_button(path, additional_classes = "gray")
    record = controller.controller_name.gsub('_', ' ').titleize
    discard_button(polymorphic_path(path), additional_classes)
  end

  def ctl_save_button
    submit_button
  end

  def ctl_create_incident_button(record)
    if record.present? and record.class.name == "Child" and record.module_id == PrimeroModule::GBV and (can? :incident_from_case, record)
      if current_actions(action: ['update', 'edit'])
        submit_button(t("buttons.create_incident"))
      elsif current_actions(action: ['show'])
        link_to t("buttons.create_incident"), child_create_incident_path(record), class: "button"
      end
    end
  end

  def render_controls(record, path=nil)
    content_tag :div, class: 'button-group' do
      if record.present? && record.new_record?
        ctl_cancel_button(path || record) + ctl_save_button
      elsif current_actions(action: ['update', 'edit'])
        ctl_edit_button(record, path) + ctl_cancel_button(path || record, "middle_btn") + ctl_save_button
      elsif current_actions(action: ['edit_locale'])
        ctl_edit_button(record, path) + ctl_cancel_button(record) + ctl_save_button
      else
        ctl_edit_button(record, path)
      end
    end
  end

  #TODO: Will we refactor the Child/Case once and for all? Get rid of this method when we do!
  def path_for_model(*args)
    model = args.first
    model_class = if model.is_a? Class
      model_class = model
    else
      model_class = model.class
    end

    result = polymorphic_path(*args)
    if model_class == Child
      result = result.sub('children','cases')
    end
    return result
  end

  def exporter_params_page(exporter_id, params)
    if exporter_id == "list_view_csv"
      params.merge({"export_list_view" => "true"})
    elsif exporter_id == "duplicate_id_csv"
      params.merge({"export_duplicates" => "true"})
    else
      params
    end
  end

  def exporter_visible_page?(exporter_id, modules_id)
    if ["list_view_csv", "duplicate_id_csv"].include?(exporter_id)
      current_actions(action: ['index'])
    elsif exporter_id == "unhcr_csv"
      return modules_id.include?(PrimeroModule::CP)
    elsif exporter_id == "incident_recorder_xls"
      return modules_id.include?(PrimeroModule::GBV)
    elsif exporter_id == "selected_xls"
      true
    else
      true
    end
  end

  def display_sex(value, lookups=[])
    gender_lookup = lookups.find{|l| l.unique_id == 'lookup-gender'}
    genders = gender_lookup.lookup_values.map{|v| [v['id'], v['display_text']]}.to_h
    genders[value] || value
  end

  def disabled_status(object)
    if object.disabled == true
      t "disabled.status.disabled"
    else
      t "disabled.status.enabled"
    end
  end

  def disabled_options filter
    options_for_select([[t("disabled.status.enabled"),"enabled"],
                        [t("disabled.status.disabled"),"disabled"],
                        [t("disabled.status.all"), "all"]], filter)
  end

  def icon(icon, text = nil, html_options = {})
    text, html_options = nil, text if text.is_a?(Hash)

    content_class = "fa fa-#{icon}"
    content_class << " #{html_options[:class]}" if html_options.key?(:class)
    html_options[:class] = content_class

    html = content_tag(:i, nil, html_options)
    html << ' ' << text.to_s unless text.blank?
    html
  end
end
