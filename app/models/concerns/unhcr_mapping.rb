module UNHCRMapping
  extend ActiveSupport::Concern

  included do
    before_save :map_protection_concerns_to_unhcr_codes
  end

  def map_protection_concerns_to_unhcr_codes
        # TODO Implement this!!
        puts SystemSettings.mapping
  end

end
