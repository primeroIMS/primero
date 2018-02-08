module AutoPopulatable
  extend ActiveSupport::Concern

  def auto_populate(field_key, system_settings = nil)
    @system_settings ||= (system_settings.present? ? system_settings : SystemSettings.current)
    auto_populate_info = @system_settings.auto_populate_info(field_key) if @system_settings.present?
    if auto_populate_info.present? && auto_populate_info.auto_populated == true && auto_populate_info.format.present?
      id_code_parts = []
      auto_populate_info.format.each {|pf| id_code_parts << PropertyEvaluator.evaluate(self, pf)}
      id_code_parts.reject(&:blank?).join(auto_populate_info.separator)
    else
      nil
    end
  end

  def auto_populate_separator(field_key, system_settings = nil)
    @system_settings ||= (system_settings.present? ? system_settings : SystemSettings.current)
    auto_populate_info = @system_settings.auto_populate_info(field_key) if @system_settings.present?
    auto_populate_info.present? ? auto_populate_info.separator : ""
  end

end