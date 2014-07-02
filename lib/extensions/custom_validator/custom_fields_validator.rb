class CustomFieldsValidator
  def initialize(target, options)
    fields = retrieve_field_definitions(target)
    validated_fields = select_validated_fields(fields, options[:type])
    validate_fields(validated_fields, target)
  end

  def select_validated_fields(fields, type)
    validated_fields = []

    fields.each do |field|
      if field.type == 'subform'
        validated_fields = validated_fields + field.subform_section.fields.select { |subfield| subfield[:type] == type }
      else
        validated_fields << field if field.type == type
      end
    end
    return validated_fields
  end

  def retrieve_field_definitions(target)
    return target.field_definitions if (target.respond_to? :field_definitions) && !target.field_definitions.nil?
    return FormSection.all_enabled_child_fields
  end

  def validate_fields(fields, target)
    fields.each do |field|
      if field.form.is_nested && target[field.form.unique_id]
        target[field.form.unique_id].each do |k, t|
          validate_field(field, target, t)
        end
      else
        validate_field(field, target, nil)
      end
    end
  end

  def validate_field(field, target, subfield)
    valid = true

    field_name = field[:name]

    value = 
      if subfield
        subfield[field_name].nil? ? '' : subfield[field_name].strip
      else
        target[field_name].nil? ? '' : target[field_name].strip
      end

    if value.present? and is_not_valid(value)
      target.errors.add(:"#{field[:name]}", validation_message_for(field))

      lookup = 
        if subfield
          FormSection.get_form_containing_field(field.form.unique_id)
        else
          field.form
        end

      if lookup
        error_info = {
            internal_section: "#tab_#{lookup.unique_id}",
            translated_section: lookup["name_#{I18n.locale}"],
            message: validation_message_for(field),
            order: lookup.order }
        target.errors.add(:section_errors, error_info)
      end

      valid = false
    end

    return valid
  end
end

class CustomNumericFieldsValidator < CustomFieldsValidator
  def is_not_valid value
    !value.is_number?
  end
  def validation_message_for field
    "#{field.display_name} must be a valid number"
  end
end

class CustomTextFieldsValidator < CustomFieldsValidator
  def is_not_valid value
    value.length > 200
  end
  def validation_message_for field
    "#{field.display_name} cannot be more than 200 characters long"
  end
end

class CustomTextAreasValidator < CustomFieldsValidator
  MAX_LENGTH = 400_000
  def is_not_valid value
    value.length > MAX_LENGTH
  end
  def validation_message_for field
    "#{field.display_name} cannot be more than #{MAX_LENGTH} characters long"
  end
end

class DateFieldsValidator < CustomFieldsValidator
  # Blackberry client can only parse specific date formats
  def is_not_valid value
    begin
      Date.strptime(value, '%d-%b-%Y')
      false
    rescue
      true
    end
  end
  def validation_message_for field
    I18n.t("messages.enter_valid_date")
  end
end

module Extensions
  module CustomValidator
    module CustomFieldsValidator
      class FieldValidator  < ActiveModel::Validator
        def validate(record)
          case @options[:type]
            when Field::NUMERIC_FIELD
              validator = CustomNumericFieldsValidator
            when Field::TEXT_FIELD
              validator = CustomTextFieldsValidator
            when Field::TEXT_AREA
              validator = CustomTextAreasValidator
            when Field::DATE_FIELD
              validator = DateFieldsValidator
            else
              raise "Unrecognised field type " + field_type.to_s + " for validation"
          end
          validator.new(record, @options) if validator
        end
      end
    end
  end
end

