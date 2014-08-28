module FormToPropertiesConverter

  def properties_hash_from_forms(form_sections)
    prop_hash = form_sections.reject {|fs| fs.is_nested}.inject({}) do |acc, fs|
      acc.deep_merge(process_form(fs))
    end

    # Handling stuff like violations.  How to make it clearer??
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
      :read_only => !field.editable,
      :allow_blank => true
    }

    case field.type
    when "subform"
      subform = FormSection.get(field.subform_section_id)

      { field.name => {
          :type => create_embeddable_model(process_form(subform)),
          :array => true
        }.update(base_options)
      }
    # TODO: add validation for select_box and radio_button options
    when "select_box", "textarea", "text_field", "radio_button", "check_boxes", "numeric_field", "date_field", "tick_box"
      type_map = {
        :select_box => String,
        :textarea => String,
        :text_field => String,
        :radio_button => String,
        :check_boxes => String,
        :numeric_field => Integer,
        :date_field => Date,
        :tick_box => TrueClass,
      }

      { field.name => {
          :type => type_map[field.type.to_sym]
        }.update(base_options)
      }
    when "date_range"
      { 
        "#{field.name}_from" => { :type => Date }.update(base_options),
        "#{field.name}_to" => {:type => Date}.update(base_options),
        "#{field.name}_date_or_date_range" => {:type => String}.update(base_options),
        field.name => {:type => Date}.update(base_options),
      }
    when 'separator', 'photo_upload_box', 'audio_upload_box', 'document_upload_box'
      {}
    else
      raise "Unknown field type #{field.type}"
    end
  end
end

