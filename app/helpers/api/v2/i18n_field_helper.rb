module Api::V2::I18nFieldHelper
  def strip_i18n_suffix(json)
    json.map{ |k,v| { k.gsub(/_i18n/, '') => v } }.inject(&:merge)
  end
end
