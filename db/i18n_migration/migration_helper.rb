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
end
