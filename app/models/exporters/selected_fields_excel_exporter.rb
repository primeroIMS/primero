require 'writeexcel'

module Exporters
  class SelectedFieldsExcelExporter < BaseExporter
    extend BaseSelectFields

    class << self

      def id
        'selected_xls'
      end

      def supported_models
        [Child, TracingRequest]
      end

      def excluded_properties
        ['histories']
      end

      def excluded_forms
        FormSection.binary_form_names
      end

      def mime_type
        "xls"
      end

    end

    def initialize(output_file_path=nil)
      super(output_file_path)
      @row_worksheet = 1
      @row_record_worksheet = 1
      @workbook = WriteExcel.new(self.buffer)
      @worksheet = @workbook.add_worksheet('Selected Fields')
      @record_worksheet = @workbook.add_worksheet('__record__')
    end

    def complete
      #TODO correct place?
      #In the record iteration we calculate the width and set
      #at the end of the processing, the export in the batch
      #it is called several times and the end of the processing
      #is somehow here.
      #TODO revisit There is some memory leak on the gem related to the set_column.
      #set_column_widths(@worksheet, @withds[:selected_fields])
      #set_column_widths(@record_worksheet, @withds[:record])

      @workbook.close
    end

    # @returns: a String with the Excel file data
    def export(models, properties_by_module, current_user, custom_export_options, *args)

      if @props.blank?
        properties_by_module = self.class.properties_to_export(properties_by_module)
        #Bulk export will call the exporter several times and so
        #calculate one time the properties because they will not change
        #with the next calls.
        @props = plain_properties(properties_by_module)
      end

      if @selected_fields_headers.blank?
        #Bulk export will call the exporter several times and so
        #calculate and write the headers one time.
        @selected_fields_headers = get_header(@props[:selected_fields])
        @worksheet.write(0, 0, @selected_fields_headers)
      end

      if @record_headers.blank?
        #Bulk export will call the exporter several times and so
        #calculate and write the headers one time.
        @record_headers = get_header(@props[:record])
        @record_worksheet.write(0, 0, @record_headers)
      end

      if @withds.blank?
        #Initialize the variable to hold the widths
        #and so we set at the end of the processing.
        @withds = {
          :selected_fields => initial_column_widths(@selected_fields_headers),
          :record => initial_column_widths(@record_headers)
        }
      end

      models.each do |model|
        @row_worksheet = write_row(@row_worksheet, @props[:selected_fields], @worksheet,
                                   model, @withds[:selected_fields], @selected_fields_headers)
        @row_record_worksheet = write_row(@row_record_worksheet, @props[:record], @record_worksheet,
                                          model, @withds[:record], @record_headers)
      end

    end

    private

    def initial_column_widths(props)
      props.map do |v|
        v.length
      end
    end

    #Return the value based on the property.
    def get_value(model, property)
      if property.is_a?(Hash)
        #When is a hash, it is a subform with some of the selected fields.
        subform_name, subform_props = property.keys.first, property.values.first
        (model.send(subform_name) || []).map do |row|
          subform_props.map do |p|
            get_value(row, p)
          end
        end
      elsif property.is_a?(String)
        #Process synthetic properties.
        if property == "model_type"
          {'Child' => 'Case'}.fetch(model.class.name, model.class.name)
        else
          field = property.split(':')
          subform_name, subform_field = field.first, field.last
          value = if field.length > 1
                    subform = model.data.try(:[], subform_name)
                    subform.try(:[], subform_field) unless subform.blank?
                  else
                    model.try(:send, property)
                  end
          self.class.translate_value(property, value)
        end
      elsif property.is_a?(Array)
        #This assumes that the only properties that are Arrays are locations
        #Which is true at the time of this coding
        self.class.get_model_location_value(model, property)
      elsif property.try(:type).eql?("subform")
        #data from the subform.!
        (model.data[property.name] || []).map do |row|
          #Remove unique_id field for subforms.
          property.subform_section.fields.select{|p| p.name != 'unique_id'}.map do |p|
            get_value(row, p)
          end
        end
      else
        #regular fields.
        self.class.get_model_value(model, property)
      end
    end

    def write_row(row, properties, worksheet, model, withds, fields_headers)
      col = 0
      max_row = 1
      fields_headers.map do |property|
        #Obtain the property value.
        field = properties.select {|f| f.name.eql?(property) }.first || property
        data_row = get_value(model, field)
        #Grab the corresponding column and data for
        #second phase to write the data in the sheet
        value = {col => data_row}
        if data_row.is_a?(Array) && data_row.length > 0
          #Calculate the next row based on the subforms data.
          max_row = data_row.size if data_row.size > max_row
          #calculate width based on the data.
          data_row.each{|row| row.each{|data| withds[col] = data.to_s.length if withds[col] < data.to_s.length}}
          if property.is_a?(Hash)
            #This is a subform with some selected fields.
            size = property.values.first.size
          else
            #exclude unique_id
            size = property.type.properties.select{|p| p.name != 'unique_id'}.size
          end
          #Calculate the next column
          col = col + size
        else
          #Regular fields calculate metadata.
          withds[col] = data_row.to_s.length if withds[col] < data_row.to_s.length
          col = col + 1
        end
        value
      end.each do |data_row|
        #Occurs the write on the sheet.
        col = data_row.keys.first
        data = data_row.values.first
        if data.is_a?(Array)
          #Write subforms in the sheet.
          worksheet.write_col(row, col, data)
        else
          #Write regular fields and fill the blanks because subforms.
          worksheet.write_col(row, col, Array.new(max_row, data))
        end
      end
      row + max_row
    end

    #Fields are by module and Form Sections, build a more plain
    #structure, all the selected fields in one sheet and
    #the other special section __record__
    def plain_properties(properties_by_module)
      properties = {:selected_fields => [], :record => []}

      properties_by_module.each do |field|
        if field.form_section.unique_id == "__record__"
          properties[:record] << field
        else
          properties[:selected_fields] << field
        end
      end
      properties[:record].flatten!

      #Only flatten 1 level to preserve location info being grouped with its property
      properties[:selected_fields].flatten!(1)
      properties
    end

    #Return the header based on the properties.
    def get_header(properties)
      (["id"] +
       properties.map do |property|
         if property.is_a?(Hash)
           #When is a hash, it is a subform with some of the selected fields.
           subform_name, subform_props = property.keys.first, property.values.first
           #Field name will include the subform field name.
           subform_props.map{|prop| "#{subform_name}:#{prop.name}"}.flatten
         elsif property.is_a?(Array)
           property.last[:display_name] if property.last.is_a?(Hash)
         elsif property.type.eql?("subform")
           #Returns every property in the subform to build the header of the sheet.
           #Remove unique_id field for subforms.
            property.subform_section.fields.map{|p| "#{property.name}:#{p.name}" if p.name != "unique_id"}.compact
         else
           property.name
         end
       end).flatten
    end

    def set_column_widths(worksheet, withds)
      withds.each_with_index do |w, i|
        worksheet.set_column(i, i, w)
      end
    end

  end
end
