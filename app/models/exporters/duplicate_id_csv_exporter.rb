require 'csv'

module Exporters
  class DuplicateIdCSVExporter < ConfigurableExporter
    class << self
      def id
        'duplicate_id_csv'
      end

      def mime_type
        'csv'
      end

      def supported_models
        [Child]
      end

      def authorize_fields_to_user?
        false
      end
    end

    def initialize(output_file_path=nil)
      super(output_file_path, export_config_id)
      @fields = Field.find_by_name(%w(national_id_no case_id unhcr_individual_no
                                      name age sex family_count_no))
    end

    def export(cases, *args)
      duplicate_export = CSV.generate do |rows|
        # Supposedly Ruby 1.9+ maintains hash insertion ordering
        @props = self.properties_to_export(props)
        rows << @props.keys.map{|prop| I18n.t("exports.duplicate_id_csv.headers.#{prop}")} if @called_first_time.nil?
        @called_first_time ||= true

        cases.each_with_index do |c, index|
          values = @props.map do |_, generator|
            case generator
            when Array
              self.class.translate_value(@fields.select {|f| f.name.eql?(generator.first) }, c.value_for_attr_keys(generator))
            when Proc
              generator.call(c)
            end
          end
          rows << values
        end
      end
      self.buffer.write(duplicate_export)
    end

    def props
      {
        'moha_id' => ['national_id_no'],
        'national_id_no' => ['national_id_no'],
        'case_id' => ['case_id'],
        'progress_id' => ['unhcr_individual_no'],
        'child_name_last_first' => ->(c) do
          return '' if c.name.blank?
          name_array = c.name.try(:split, ' ')
          name_array.size > 1 ? "#{name_array.last}, #{name_array[0..-2].join(' ')}" : c.name
        end,
        'age' => ['age'],
        'sex_mapping_m_f_u' => ->(c) do
          ['male', 'female'].include?(c.sex) ? I18n.t("exports.duplicate_id_csv.#{c.sex}_abbreviation") : I18n.t("exports.unhcr_csv.unknown_abbreviation")
        end,
        'family_size' => ['family_count_no'],
      }
    end

    def export_config_id
      #TODO pass SystemSettings in from the controller
      @system_settings ||= SystemSettings.current
      @system_settings.try(:export_config_id).try(:[], "duplicate_id")
    end
  end
end

