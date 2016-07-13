module UNHCRMapping
  extend ActiveSupport::Concern

  included do
    before_save :map_protection_concerns_to_unhcr_codes

    def map_protection_concerns_to_unhcr_codes
        # TODO Implement this!!
    end
  end

end
