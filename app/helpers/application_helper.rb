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

  def discard_button(path, confirm_model = nil)
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

  def translated_permissions
    permissions = Permission.hashed_values.map do |group, permissions|
      [
          I18n.t(group, :scope => "permissions.group"),
          permissions.map do |permission|
            [ I18n.t(permission, :scope => 'permissions.permission'), permission ]
          end
      ]
    end
  end

  def ctl_edit_button(record)
    record = record.singularize if record.instance_of? String
    ctl_button_wrapper do 
      link_to t("buttons.edit"), edit_polymorphic_path(record, { follow: true }),
          class: "green-button #{'arrow' if current_actions(action: ['update', 'edit'])}"
    end
  end

  def ctl_cancel_button(path)
    record = controller.controller_name.gsub('_', ' ').titleize
    ctl_button_wrapper do 
      discard_button polymorphic_path(path), record
    end
  end

  def ctl_save_button
    ctl_button_wrapper do 
      submit_button
    end
  end

  def ctl_create_incident_button(record)
    ctl_button_wrapper do 
      submit_button(t("buttons.create_incident"))
    end if record.present? and record.class.name == "Child" and record.module.name == PrimeroModule::GBV
  end

  def ctl_button_wrapper(&block)
    content_tag :li, class: "#{'rec_ctl' unless current_actions(action: ['new', 'show'])}" do
      block.call
    end
  end

  def render_controls(record, path = nil)
    path = path ||= record

    if record.new?
      ctl_cancel_button(path) + ctl_save_button
    elsif current_actions(action: ['update', 'edit'])
        #TODO - Create Incident is not ready for release.  Commenting out for now...
        # ctl_edit_button(path) + ctl_cancel_button(path) + ctl_save_button + ctl_create_incident_button(record)
        ctl_edit_button(path) + ctl_cancel_button(path) + ctl_save_button
    else
      ctl_edit_button(path)
    end
  end
end
