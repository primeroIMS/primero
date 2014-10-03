# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper

  def current_url_with_format_of( format )
    url_for( params.merge( :format => format ) )
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

  def session
    current_session
  end

  def submit_button(name = t("buttons.save"))
      submit_tag(name, :class => 'green-button btn_submit')
  end

  def cancel_button(path)
      link_to t('cancel'), path, data: {confirm: t('messages.cancel_confirmation')}, class: "link_cancel"
  end

  def discard_button(path)
      link_to t('cancel'), path, data: {confirm: t('messages.confirmation_message')}, class: "grey-button"
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

  #TODO: Fix this when fixing customizations. Do we need them as hashed values
  def translated_permissions
    permissions = Permission.all_grouped.map do |group, permissions|
      [
          I18n.t(group, :scope => "permissions.group"),
          permissions.map do |permission|
            [ I18n.t(permission, :scope => 'permissions.permission'), permission ]
          end
      ]
    end
  end

  def ctl_edit_button(record, path=nil)
    path = path.singularize if path.instance_of? String
    ctl_button_wrapper do
      link_to t("buttons.edit"), edit_polymorphic_path(path || record, { follow: true, id: record.id }),
          class: "green-button #{'arrow' if current_actions(action: ['update', 'edit'])}"
    end
  end

  def ctl_cancel_button(path)
    record = controller.controller_name.gsub('_', ' ').titleize
    ctl_button_wrapper do
      discard_button polymorphic_path(path)
    end
  end

  def ctl_save_button
    ctl_button_wrapper do
      submit_button
    end
  end

  def ctl_create_incident_button(record)
    if record.present? and record.class.name == "Child" and record.module_id == PrimeroModule::GBV
      if current_actions(action: ['update', 'edit'])
        content_tag :li do
          submit_button(t("buttons.create_incident"))
        end
      elsif current_actions(action: ['show'])
        content_tag :li do
          link_to t("buttons.create_incident"), child_create_incident_path(record), class: "green-button"
        end
      end
    end
  end

  def ctl_button_wrapper(&block)
    content_tag :li, class: "#{'rec_ctl' unless current_actions(action: ['new', 'show'])}" do
      block.call
    end
  end

  def render_controls(record, path=nil)
    if record.new?
      ctl_cancel_button(path || record) + ctl_save_button
    elsif current_actions(action: ['update', 'edit'])
      ctl_edit_button(record, path) + ctl_cancel_button(path || record) + ctl_save_button
    else
      ctl_edit_button(record, path)
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
end
