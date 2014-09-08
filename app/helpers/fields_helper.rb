module FieldsHelper

  def option_fields_for form, suggested_field
    return [] unless suggested_field.field.option_strings.present?
    suggested_field.field.option_strings.collect do |option_string|
      form.hidden_field("option_strings_text", { :multiple => true, :id => "option_string_" + option_string, :value => option_string+"\n" })
    end
  end

	def display_options field
		field.option_strings.collect { |f| '"'+f+'"' }.join(", ")
	end

	def forms_for_display
	  FormSection.all.sort_by{ |form| form.name || "" }.map{ |form| [form.name, form.unique_id] }
	end

  def field_tag_name(object, field, field_keys=[])
    if field_keys.present?
      "#{object.class.name.underscore.downcase}[#{field_keys.join('][')}]"
    else
      field.tag_name_attribute(object.class.name.underscore.downcase)
    end
  end

  def field_value(object, field, field_keys=[])
    if field_keys.present? && !object.new?
      field_value = object
      if field.type == Field::TALLY_FIELD
        tally_values = []
        field.tally << 'total'
        field.tally.each do |t|
          field_keys.each do |k| 
            k = k.gsub(k, "#{k}_#{t}") if k == field_keys.last
            field_value = field_value[k]
          end
          tally_values << field_value
          field_value = object
        end
        field.tally.pop
        field_value = tally_values
      else
        field_keys.each {|k| field_value = field_value[k]}
      end
    else
      if field == 'status'
        return 'Open'
      elsif field.type == Field::DATE_RANGE
        return [object["#{field.name}_from"], object["#{field.name}_to"]]
      else
        field_value = object[field.name] || ''
      end
    end
    return field_value
  end
  
  def field_value_for_display field_value
    case
    when field_value.nil?
      ""
    when field_value.respond_to?(:length) && field_value.length == 0
      ""
    when field_value.instance_of?(Array)
      field_value.join ", " 
    else
      field_value
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

  # TODO: Translate these
  def scope_values(record)
    record = record.pluralize
    [
      [t("#{record}.filter_by.valid"), "record_state:valid record" ],
      [t("#{record}.filter_by.invalid"), "record_state:invalid record"],
      [t("#{record}.filer_by.all"), "record:all" ],
      # [t("#{record}.filer_by.active"),"active"],
      # [t("#{record}.filer_by.reunited"),"reunited"],
      [t("#{record}.filer_by.flagged"),"flag:flag"]
    ]
  end
end
