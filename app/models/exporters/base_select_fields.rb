module Exporters
  module BaseSelectFields
    extend self #Expose these for rspec testing

    #TODO: These methods have been moved here from the record controller concern.
    #      They should be refactored into something sane. Or at least have some rspec coverage!

    def filter_custom_exports(properties_by_module, custom_export_options)
      if custom_export_options.present?
        if custom_export_options[:forms].present? || custom_export_options[:selected_subforms].present?
          properties_by_module = filter_by_subform(properties_by_module, custom_export_options)
          .deep_merge(
            filter_by_form(properties_by_module, custom_export_options)
          )
        elsif custom_export_options.present? && custom_export_options[:fields].present?
          #Filter the selected fields from the whole form section fields.
          properties_by_module.each do |pm, fs|
            filtered_forms = []
            fs.each do |fk, fields|
              selected_fields = []
              fields.each do |field|
                f_name, f_property = field[0], field[1]
                #Add selected fields.
                if custom_export_options[:fields].include?(f_name)
                  selected_fields << field
                elsif custom_export_options[:fields].any? {|f| f.include? "#{f_name}|||location"}
                  #Big happy hack to handle admin level locations
                  #We need to loop here because more than 1 admin level could have been selected for a single location
                  custom_export_options[:fields].select{|f| f.include? "#{f_name}|||location"}.each do |location_key|
                    lct_array = location_key.split('|||')
                    exportable_location = {field_name: lct_array.first, display_name: lct_array.last, admin_level: lct_array[-2]}
                    lct_field = [(field.first + lct_array[-2]), [field.last, exportable_location]]
                    selected_fields << lct_field
                  end
                end
                #If there is a subform in the section, filter the fields selected by the user
                #for the subform.
                if f_property.array && f_property.type.include?(CouchRest::Model::Embeddable)
                  subform_props = f_property.type.properties.select do |property|
                    #Fields to be selected has the format: subform-field-name:field-name
                    custom_export_options[:fields].include?("#{f_name}:#{property.name}")
                  end
                  #Create the hash to hold the selected fields for the subform.
                  selected_fields << [f_name, subform_props.map{|p| [p.name, p]}.to_h] if subform_props.present?
                end
              end
              filtered_forms << [fk, selected_fields.to_h]
            end
            properties_by_module[pm] = filtered_forms.to_h
          end
          #Find out duplicated fields assumed because they are shared fields.
          properties_by_module.each do |pm, form_sections|
            all_fields = []
            form_sections.each do |form_section_key, fields|
              filtered_fields = fields.map do |field_key, field|
                if all_fields.include?(field)
                  #Field already seem, generate a key that will be wipe.
                  element = [field_key, nil]
                else
                  #First time seem the field, generate the key/value valid.
                  element = [field_key, field]
                end
                all_fields << field
                element
              end
              form_sections[form_section_key] = filtered_fields.to_h.compact
            end
          end
          properties_by_module.compact
        end
      end
      properties_by_module
    end

    def filter_by_subform(properties, custom_export_options)
      sub_props = {}
      if custom_export_options[:selected_subforms].present?
        properties.each do |pm, fs|
          sub_props[pm] = fs.map{|fk, fields| [fk, fields.select{|f| custom_export_options[:selected_subforms].include?(f)}]}.to_h.compact
        end
      end
      sub_props
    end

    def filter_by_form(properties, custom_export_options)
      form_sections_fields = FormSection.includes(:fields)
                                        .where(unique_id: custom_export_options[:forms], fields: { id: properties.pluck(:id) } )
      form_sections_fields.inject({}) { |acc, fs| acc.merge({ fs.unique_id => fs.fields }) }
    end

  end
end