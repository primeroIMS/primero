module BIADerivedFields
  extend ActiveSupport::Concern

  def bia_mother
    family_details = self.try(:family_details_section)
    if family_details.present?
      mother_section = family_details.select{ |details| details.relation == "Mother" }
      if mother_section.present?
        return mother_section
      end
    end
    []
  end

end
