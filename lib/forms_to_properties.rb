require "uuidtools"

module FormToPropertiesConverter
  def properties_hash_from_forms(form_sections)
    prop_hash = form_sections.reject {|fs| fs.is_nested}.inject({}) do |acc, fs|
      acc.deep_merge((fs.form_group_keyed ? fs.form_group_id : fs.unique_id) => process_form(fs))
    end

    # Handling stuff like violations.  How to make it clearer and cleaner??
    prop_hash.each do |form, props|
      props.select {|k,v| v.is_a?(Hash) && !v.include?(:type)}.each do |name, subprops|
        props[name] = {
          :type => create_embeddable_model(subprops, false),
          :read_only => false,
          :array => false,
        }
      end
    end
    prop_hash
  end

  private

  def process_form(form_section)
    include_field = lambda do |field|
      field.visible && field.create_property
    end

    form_section.fields.select(&include_field).inject({}) do |form_acc, f|
      props = if form_section.form_group_keyed && form_section.form_group_id
        {form_section.form_group_id => properties_for_field(f)}
      else
        properties_for_field(f)
      end

      form_acc.merge(props)
    end
  end

  def create_embeddable_model(properties_hash, include_unique_id=false)
    Class.new do
      include CouchRest::Model::Embeddable

      if include_unique_id
        include Syncable::PrimeroEmbeddedModel
      end

      properties_hash.each do |name,options|
        #TODO: This doesn't seem broken, but consider replacing this with:
        #      couchrest_model_property name, options
        property name, options
      end
    end
  end

  def properties_for_field(field)
    base_options = {
     # field.editable just means that it's not editable in a particular form.
     # The system can still edit to its heart's content.
     # :read_only => !field.editable,
     :allow_blank => false,
     :hidden_text_field => field.hidden_text_field
    }

    date_options = {
      :type => PrimeroDate,
      :init_method => :parse,
    }

    tally_options = {
      :type => Integer
    }

    case field.type
    when "subform"
      #subform = FormSection.get_by_unique_id(field.subform_section_id)
      subform = field.subform_section

      if subform.nil?
        raise "The FormSection pointed to (#{field.subform_section_id}) by the subform #{field.name} does not exist"
      end

      { field.name => {
          :type => create_embeddable_model(process_form(subform), true),
          :array => true
        }.update(base_options)
      }
    # TODO: add validation for select_box and radio_button options
    when "textarea", "text_field", "numeric_field", "tick_box"
      type_map = {
        :textarea => String,
        :text_field => String,
        :numeric_field => Integer,
        :tick_box => TrueClass,
      }

      { field.name => {
          :type => type_map[field.type.to_sym]
        }.update(base_options)
      }
    when "radio_button"
      {field.name => {
          :type => field.is_yes_no? ? TrueClass : String
        }.update(base_options)
      }
    when "select_box"
      if field.multi_select
        type = [String]
      elsif field.is_yes_no?
        type = TrueClass
      else
        type = String
      end
      {field.name => {
          :type => type
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
    when 'separator', 'photo_upload_box', 'audio_upload_box', 'document_upload_box', 'custom'
      {}
    else
      #TODO: is there a more graceful way to handle this error?
      # If 1 field gets fouled up with no type, it causes the entire site to crash
      raise "Unknown field type #{field.type}"
    end
  end
end

