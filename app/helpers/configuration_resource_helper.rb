module ConfigurationResourceHelper
  def resource_edit_field(object, field, label_key, type, required=false, disabled=false, help_text=nil, error_text=nil, select_values=[])
    field_id = "#{object.class.name.underscore}_#{field}"
    name = "#{object.class.name.underscore}[#{field}]"
    value = object.send(field)
    locale = field.split('_').last.to_sym
    label_text = if Primero::Application::locales.include?(locale)
      I18n.t(label_key, locale: locale)
    else
      I18n.t(label_key)
    end

    tag_helper = if type == 'date'
                   'text_field_tag'
                 elsif type == 'multi_select'
                   'select_tag'
                 else
                   "#{type}_tag"
                 end

    content_tag :div, class: 'row' do
      concat(content_tag(:div, class: 'medium-3 columns'){
        content_tag(:span, class: 'tool-tip-label'){
          label_tag(field_id, label_text, class: 'key inline') if label_key.present?
        }
      })
      concat(
        content_tag(:div, class: 'medium-8 columns'){
        if type == 'file_field' && field == 'logo'
          show_logo_upload(object, field_id, type, tag_helper)
        elsif type == 'check_box'
          concat(label_tag(nil, class: 'left'){
              concat(hidden_field_tag(name, false))
              concat(check_box_tag(name, '1', value.present? ? true : false))
          })
        elsif type == 'multi_select'
          concat(self.send(tag_helper, name, options_for_select(select_values, value), id: field_id, class: 'chosen-select',
            multiple: true, include_blank: true, disabled: disabled, required: required ))
        else
          concat(self.send(tag_helper, name, h(value), id: field_id, autocomplete: 'off',
            class: ((type == 'date') ? 'form_date_field' : ''), disabled: disabled, required: required))
          if required && !error_text.nil?
            concat(content_tag(:small, t(error_text), class: 'error'))
          end
        end
        if help_text.present?
          concat(content_tag(:p, help_text, class: 'help'))
        end
      })
      #TODO: This should be replaced with Foundation required field components
      concat(content_tag(:div, class: 'medium-1 columns'){
        content_tag(:span, '*', class: 'required') if required
      })
    end
  end

  def resource_show_field(object, field, label_key, translation_class=nil, lookup=nil)
    cached_display_text_classes = [Agency, Location]
    label_text = I18n.t(label_key)

    value = if lookup.present?
              object.send(field).map do |id|
                display_value = Lookup.display_value(lookup, id)
                if lookup == 'lookup-service-type' && display_value.blank?
                  I18n.t("messages.non_active_service", { service: id })
                else
                  display_value
                end
              end.compact.join(', ')
            else
              object.send(field)
            end

    value = cached_display_text_classes.include?(translation_class) ?
      eval("#{translation_class}.display_text('#{value}', locale: '#{I18n.locale}')") :
      eval("#{translation_class}.display_text('#{value}')") if translation_class.present?

    content_tag :div, class: 'row' do
      concat(content_tag(:div, class: 'medium-4 columns'){
        label_tag(field, label_text, class: 'key')
      })
      concat(content_tag(:div, class: 'medium-8 columns'){
        if field == 'logo' && object['logo_key']
          img = send("#{object.class.name.underscore.downcase}_logo_url", object, object['logo_key'])
          concat(content_tag(:span, image_tag(img), class: value))
        else
          content_tag(:span, h(value), class: 'value')
        end
      })
    end
  end

  def show_logo_upload(object, field_id, type, tag_helper)
    if !object.new_record? && object['logo_key']
      concat(self.send(tag_helper, "agency[upload_logo]logo", id: "#{field_id}", autocomplete: 'off',
          class: ((type == 'date') ? 'form_date_field' : 'file_upload_input'), style:"color: transparent;"))
      img = send("#{object.class.name.underscore.downcase}_logo_url", object.id, object['logo_key'])
      concat(content_tag(:span, image_tag(img)))
    else
      concat(self.send(tag_helper, "agency[upload_logo]logo", id: "#{field_id}", autocomplete: 'off',
          class: ((type == 'date') ? 'form_date_field' : 'file_name')))
    end
  end

  def service_options(object, services)
    services_ids = services.map{ |option| option[1] }
    non_active_services = (object.services || []).select do |service|
      services_ids.exclude?(service)
    end.map do |service|
      [I18n.t("messages.non_active_service", { service: service }), service, { style: "display: none" }]
    end
    services + non_active_services
  end

  def agency_options(user, agencies)
    agency_ids = agencies.map{ |option| option[1] }
    if(user.agency.present? && agency_ids.exclude?(user.agency.id))
      agency_id = user.agency.id
      agencies += [
        [I18n.t("messages.non_active_agency", { agency: agency_id }), agency_id, { style: "display: none" }]
      ]
    end
    agencies
  end

end
