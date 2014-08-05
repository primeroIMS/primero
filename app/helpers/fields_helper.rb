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
      "#{object.class.name.downcase}[#{field_keys.join('][')}]"
    else
      field.tag_name_attribute(object.class.name.downcase)
    end
  end

  def field_value(object, field, field_keys=[])
    if field_keys.present? && !object.new?
      field_value = object
      field_keys.each {|k| field_value = field_value[k]}
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

  def subforms_count(object, field)
    subforms_count = 0
    if object[field.name].present?
      subforms_count = object[field.name].count
    end
    return subforms_count
  end

  # TODO: Translate these
  def scope_values(record)
    record = record.pluralize
    [
      [t("#{record}.filter_by.valid"), "Valid record" ],
      [t("#{record}.filter_by.invalid"), "Invalid record"],
      [t("#{record}.filer_by.all"), "all" ],
      [t("#{record}.filer_by.active"),"active"],
      [t("#{record}.filer_by.reunited"),"reunited"],
      [t("#{record}.filer_by.flagged"),"flag"]
    ]
  end
end
