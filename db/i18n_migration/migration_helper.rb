module MigrationHelper
  def generate_keyed_value(value)
    if value.present?
      if value.is_a?(String)
        value =
            value.gsub(/\r\n?/, "\n").split("\n")
                .map{|v| v.present? ? {id: v.parameterize.underscore, display_text: v}.with_indifferent_access : nil}
                .compact
      elsif value.is_a?(Array)
        if value.first.is_a?(String)
          value = value.map{|v| v.present? ? {id: v.parameterize.underscore, display_text: v}.with_indifferent_access : nil}.compact
        elsif value.first.is_a?(Hash)
          value
        end
      end
    end
  end

  def create_locales
    Primero::Application::locales.each do |locale|
      yield(locale)
    end
  end

  def get_field_options(prefix)
    fields = {}
    prefix = 'case' if prefix == 'child'
    field_types = ['select_box', 'tick_box', 'radio_button']

    FormSection.find_by_parent_form(prefix).each do |fs|
      i18n_fields = fs.fields.select{|f| field_types.include?(f.type)}

      i18n_fields.each do |f|
        fields[f.name] = f.options_list if f.options_list.present?
      end
    end

    fields
  end
end
