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
        if type == 'file_field' && field.start_with?('logo')
          show_logo_upload(object, field_id, field, type, tag_helper)
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
              object.send(field).map { |id| Lookup.display_value(lookup, id)}.compact.join(', ')
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
        if field.start_with?('logo')
          img = value.attachment.present? ? image_tag(value.attachment.variant(resize: '30')) : h(value.attachment)
          concat(content_tag(:span, img, class: value.attachment.present? ? value : 'value'))
        else
          content_tag(:span, h(value), class: 'value')
        end
      })
    end
  end

  def show_logo_upload(object, field_id, field, type, tag_helper)
    logo = object.send(field).attachment
    if !object.new_record? && logo.present?
      concat(self.send(tag_helper, "agency[#{field}]", id: "#{field_id}", autocomplete: 'off',
          class: 'file_upload_input', style:"color: transparent;"))
      img = logo.variant(resize: '30')
      concat(content_tag(:span, image_tag(img)))
    else
      concat(self.send(tag_helper, "agency[#{field}]", id: "#{field_id}", autocomplete: 'off',
          class: 'file_name'))
    end
  end
end
