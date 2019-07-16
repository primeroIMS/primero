module Api::V2::I18nFieldHelper
  def strip_i18n_suffix(json)
    json.map{ |k,v| { k.gsub(/_i18n/, '') => v } }.inject(&:merge)
  end
  
  def complete_locales_for(properties, json)
    locales = I18n.available_locales.map{ |locale| { locale.to_s => "" } }.inject(&:merge)
    properties.each do |prop|
      json[prop.to_s] = locales.merge(json[prop.to_s]) if json[prop.to_s].present?
    end
    json
  end
end
