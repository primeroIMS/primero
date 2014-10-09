module FieldsHelper

  def option_fields_for form, suggested_field
    return [] unless suggested_field.field.option_strings.present?
    suggested_field.field.option_strings.collect do |option_string|
      form.hidden_field("option_strings_text", { :multiple => true, :id => "option_string_" + option_string, :value => option_string+"\n" })
    end
  end

  def field_tag_name(object, field, field_keys=[])
    if field_keys.present?
      "#{object.class.name.underscore.downcase}[#{field_keys.join('][')}]"
    else
      field.tag_name_attribute(object.class.name.underscore.downcase)
    end
  end

  def field_format_date(a_date)
    if a_date.present? && a_date.is_a?(Date)
      a_date.strftime("%d-%b-%Y")
    else
      a_date
    end
  end

  def field_value(object, field, field_keys=[])
    if field.nil?
      object.value_for_attr_keys(field_keys)
    else
      parent_obj = object.value_for_attr_keys(field_keys[0..-2])
      case field.type
      when Field::TALLY_FIELD
        (['total'] + field.tally).map {|t| parent_obj["#{field.name}_#{t}"] }
      when Field::DATE_RANGE
        [parent_obj["#{field.name}_from"], parent_obj["#{field.name}_to"]]
      when Field::DATE_FIELD
        field_format_date(parent_obj[field.name])
      else
        parent_obj[field.name] || ''
      end
    end
  end
  
  def field_value_for_display field_value
    case
    when field_value.nil?
      ""
    when field_value.respond_to?(:length) && field_value.length == 0
      ""
    when field_value.is_a?(Array)
      field_value.join ", "
    when field_value.is_a?(Date)
      field_format_date(field_value)
    else
      field_value.to_s
    end
  end
  
  def field_keys(subform_name, subform_index, field_name, form_group_name)
    field_key = []
  
    if form_group_name.present? and form_group_name == "Violations"
      field_key << form_group_name.downcase
    end
    
    if subform_name.present?
      field_key << subform_name << subform_index
    end
    
    field_key << field_name
    
    return field_key 
  end

  def subforms_count(object, field, form_group_name = "")
    subforms_count = 0
    if object[field.name].present?
      subforms_count = object[field.name].count
    elsif object[form_group_name.downcase].present? && object[form_group_name.downcase][field.name].present?
      subforms_count = object[form_group_name.downcase][field.name].count
    end
    return subforms_count
  end
  
  def get_subform_object(object, subform_section, form_group_name)
    subform_object = {}
    if form_group_name.present? && form_group_name == "Violations" && object[form_group_name.downcase].present?
      subform_object = object[form_group_name.downcase][subform_section.unique_id]
    else
      subform_object = object[:"#{subform_section.unique_id}"]
    end
    return subform_object
  end

  def violation_status(formObject, form_group_name, subform_name, index)
    if formObject[form_group_name.downcase].present? && !formObject[form_group_name.downcase][subform_name].empty? &&
      index != 'template'
      content_tag :span, class: 'verification_status' do
        "(#{formObject[form_group_name.downcase][subform_name][index].verified})"
      end
    end
  end
end
