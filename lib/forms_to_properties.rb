module FormToPropertiesConverter
  def properties_hash_from_forms(form_sections)
    prop_hash = form_sections.reject {|fs| fs.is_nested}.inject({}) do |acc, fs|
      acc.deep_merge(process_form(fs))
    end

    # Handling stuff like violations.  How to make it clearer and cleaner??
    prop_hash.select {|k,v| v.is_a?(Hash) && !v.include?(:type)}.each do |name, props|
      prop_hash[name] = {
        :type => create_embeddable_model(props),
        :read_only => false,
        :array => false,
      }
    end
    prop_hash
  end

  private

  def process_form(form_section)
    include_field = lambda do |field|
      field.visible
    end

    form_section.fields.select(&include_field).inject({}) do |form_acc, f|
      props = if form_section.form_group_name && form_section.form_group_keyed
        {form_section.form_group_name.downcase => properties_for_field(f)}
      else
        properties_for_field(f)
      end

      form_acc.merge(props)
    end
  end

  def create_embeddable_model(properties_hash)
    Class.new do
      include CouchRest::Model::Embeddable

      properties_hash.each do |name,options|
        property name, options
      end
    end
  end

  def properties_for_field(field)
    base_options = {
     # field.editable just means that it's not editable in a particular form.
     # The system can still edit to its heart's content.
     # :read_only => !field.editable,
      :allow_blank => false
    }

    date_options = {
      :type => Date,
      :init_method => :parse,
    }

    tally_options = {
      :type => Integer
    }

    case field.type
    when "subform"
      #subform = FormSection.get_by_unique_id(field.subform_section_id)
      subform = field.subform

      if subform.nil?
        raise "The FormSection pointed to (#{field.subform_section_id}) by the subform #{field.name} does not exist"
      end

      { field.name => {
          :type => create_embeddable_model(process_form(subform)),
          :array => true
        }.update(base_options)
      }
    # TODO: add validation for select_box and radio_button options
    when "textarea", "text_field", "radio_button", "check_boxes", "numeric_field", "tick_box"
      type_map = {
        :textarea => String,
        :text_field => String,
        :radio_button => String,
        :check_boxes => String,
        :numeric_field => Integer,
        :tick_box => TrueClass,
      }

      { field.name => {
          :type => type_map[field.type.to_sym]
        }.update(base_options)
      }
    when "select_box"
      { field.name => {
          :type => field.multi_select ? [String] : String
        }.update(base_options)
      }
    when "date_field"
      { field.name => date_options.update(base_options) }
    when "date_range"
      {
        "#{field.name}_from" => date_options.update(base_options),
        "#{field.name}_to" => date_options.update(base_options),
        "#{field.name}_date_or_date_range" => {:type => String}.update(base_options),
        field.name => date_options.update(base_options),
      }
    when "tally_field"
      tallys = {}
      field.tally.each { |t| tallys["#{field.name}_#{t}"] = tally_options.update(base_options) }
      tallys["#{field.name}_total"] = tally_options.update(base_options)
      tallys

    # TODO: Figure out how to handle these things
    when 'separator', 'photo_upload_box', 'audio_upload_box', 'document_upload_box'
      {}
    else
      raise "Unknown field type #{field.type}"
    end
  end
end

