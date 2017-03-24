class CustomFieldsValidator
  attr_accessor :options

  def initialize(target, options)
    @options = options
    fields = retrieve_field_definitions(target)
    validated_fields = select_validated_fields(fields, options[:type])
    if options[:pattern_name].present?
      validated_fields.select!{ |field| field.name =~ options[:pattern_name] }
    end
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
  end

  def validate_fields(fields, target)
    fields.each do |field|
      nested_field = field.form ? field.form.is_nested : false
      if nested_field
        fields_instance = target[field.form.unique_id]
        if target.class.name == "Incident" and target["violations"].present? and target["violations"][field.form.unique_id].present?
          fields_instance = target["violations"][field.form.unique_id]
        end
        fields_instance.each do |t|
          has_field_sub_fields(field, target, t)
        end if fields_instance.respond_to?(:each)
      elsif field[:type] == Field::DATE_RANGE
        sub_type_range = target["#{field[:name]}_date_or_date_range"]
        if sub_type_range == "date_range"
          validate_field(field, target, nil, "_from") && validate_field(field, target, nil, "_to")
        elsif sub_type_range == "date"
          validate_field(field, target, nil, nil)
        end
      else
        has_field_sub_fields(field, target, nil)
      end
    end
  end

  def has_field_sub_fields(field, target, field_instance)
    if field[:type] == Field::TALLY_FIELD
      field.tally.each do |tally|
        validate_field(field, target, field_instance, "_#{tally}", tally)
      end
    else
      validate_field(field, target, field_instance)
    end
  end

  def validate_field(field, target, subfield, suffix = nil, field_sub_field = nil)
    valid = true

    field_name = field[:name]
    field_name = field_name + suffix if suffix

    value_obj = (subfield || target)[field_name]
    value =
      if value_obj.nil?
        ''
      elsif value_obj.respond_to?(:strip)
        value_obj.strip
      else
        value_obj
      end

    if value.present? and is_not_valid(value)
      target.errors.add(:"#{field[:name]}", validation_message_for(field, field_sub_field))

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
            message: validation_message_for(field, field_sub_field),
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
    !value.is_a? Numeric
  end

  def validation_message_for field, field_sub_field
    I18n.t("messages.enter_valid_number", field: field.display_name)
  end
end

class CustomTextFieldsValidator < CustomFieldsValidator
  def is_not_valid value
    value.length > 200
  end

  def validation_message_for field, field_sub_field
    I18n.t("messages.more_than_200_chars", field: field.display_name)
  end
end

class CustomTextAreasValidator < CustomFieldsValidator
  MAX_LENGTH = 400_000
  def is_not_valid value
    value.length > MAX_LENGTH
  end
  def validation_message_for field, field_sub_field
    I18n.t("messages.no_more_than_x_chars", field: field.display_name, length: MAX_LENGTH)
  end
end

class DateFieldsValidator < CustomFieldsValidator
  # Blackberry client can only parse specific date formats
  def is_not_valid value
    return false if value.is_a?(Date)
    begin
      PrimeroDate.parse_with_format(value)
      false
    rescue
      true
    end
  end
  def validation_message_for field, field_sub_field
    I18n.t("messages.enter_valid_date")
  end
end

class NumericRangeValidator < CustomFieldsValidator
  def is_not_valid value
    return !(value.to_f >= @options[:min] && value.to_f <= @options[:max])
  end
  def validation_message_for field, field_sub_field
    I18n.t("errors.models.child.value_range", :field_name => field.display_name, :min => @options[:min], :max => @options[:max])
  end
end

class TallyFieldValidator < CustomFieldsValidator
  def is_not_valid value
   !value.is_a? Numeric
  end

  def validation_message_for field, field_sub_field
    I18n.t("messages.enter_valid_number_in_tally", field: field.display_name, tally: field_sub_field)
  end
end

module Extensions
  module CustomValidator
    module CustomFieldsValidator
      class FieldValidator  < ActiveModel::Validator
        def validate(record)
          case @options[:type]
            when Field::NUMERIC_FIELD
              if @options[:min].present? and @options[:max].present? and @options[:pattern_name].present?
                validator = NumericRangeValidator
              else
                validator = CustomNumericFieldsValidator
              end
            when Field::TEXT_FIELD
              validator = CustomTextFieldsValidator
            when Field::TEXT_AREA
              validator = CustomTextAreasValidator
            when Field::DATE_FIELD, Field::DATE_RANGE
              validator = DateFieldsValidator
            when Field::TALLY_FIELD
              validator = TallyFieldValidator
            else
              raise "Unrecognised field type " + field_type.to_s + " for validation"
          end
          validator.new(record, @options) if validator
        end
      end
    end
  end
end

