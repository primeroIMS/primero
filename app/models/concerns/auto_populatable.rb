module AutoPopulatable
  extend ActiveSupport::Concern

  def auto_populate(field_key, system_settings)
    system_setings ||= SystemSettings.current
    auto_populate_info = system_setings.auto_populate_info(field_key) if system_setings.present?
    id_code_parts = []
    if auto_populate_info.present? && auto_populate_info.autoPopulated == true && auto_populate_info.populate_format.present?
      auto_populate_info.populate_format.each {|pf| id_code_parts << PropertyEvaluator.evaluate(self, pf)}
      id_code_parts.reject(&:blank?).join(auto_populate_info.separator)
    end
  end

end