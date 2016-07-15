module UNHCRMapping
  extend ActiveSupport::Concern

  included do
    before_save :map_protection_concerns_to_unhcr_codes
  end

  def map_protection_concerns_to_unhcr_codes
    if self.is_a? Child
      system_settings = SystemSettings.current
      unhcr_mapping = system_settings.unhcr_needs_codes_mapping
      if unhcr_mapping.present?
        if unhcr_mapping.autocalculate == true && unhcr_mapping.mapping.present? && self['protection_concerns'].present?

          concerns = self['protection_concerns']
          mapping = unhcr_mapping.mapping

          self['unhcr_needs_codes'] = concerns.map{ |concern| mapping[concern] }.compact.uniq
        else
          self['unhcr_needs_codes'] = nil
        end
      end
    end
  end

end
