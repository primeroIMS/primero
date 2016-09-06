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

  def bia_father
    family_details = self.try(:family_details_section)
    if family_details.present?
      father_section = family_details.select{ |details| details.relation == "Father" }
      if father_section.present?
        return father_section
      end
    end
    []
  end

end
