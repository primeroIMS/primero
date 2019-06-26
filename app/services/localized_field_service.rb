class LocalizedFieldService

  def self.to_localized_fields(klass, params)
    localized_props = klass.localized_properties.map(&:to_s)
    unlocalized_params = params.reject { |k,_| localized_props.include?(k) }
    localized_fields = localized_props.select { |prop| params[prop].present? }.map do |prop| 
      { "#{prop}_i18n" => params[prop] }
    end.inject(&:merge)

    unlocalized_params.merge(localized_fields || {})
  end
  
end
