module ConfigurationResourceHelper

  def resource_edit_field(object, field, label_key, type, required=false, disabled=false)
    field_id = "#{object.class.name.underscore}_#{field}"
    name = "#{object.class.name.underscore}[#{field}]"
    value = object.send(field)
    label_text = I18n.t(label_key)

    content_tag :div, class: 'row' do
        concat(content_tag(:div, class: 'medium-3 columns'){
          content_tag(:span, class: 'tool-tip-label'){
            label_tag(field_id, label_text, class: 'key inline')
          }
        })
        concat(content_tag(:div, class: 'medium-8 columns'){
          self.send("#{type}_tag", name, h(value), id: field_id, autocomplete: 'off', disabled: disabled)
        })
        #TODO: This should be replaced with Foundation required field components
        concat(content_tag(:div, class: 'medium-1 columns'){
          content_tag(:span, '*', class: 'required') if required
        })
    end
  end

  def resource_show_field(object, field, label_key)
    label_text = I18n.t(label_key)
    value = object.send(field)

    content_tag :div, class: 'row' do
      concat(content_tag(:div, class: 'medium-4 columns'){
        label_tag(field, label_text, class: 'key')
      })
      concat(content_tag(:div, class: 'medium-8 columns'){
        content_tag(:span, h(value), class: 'value')
      })
    end
  end

end