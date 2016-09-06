module BIADerivedFields
  extend ActiveSupport::Concern

  def bia_mother
    mother_section = get_relation_section("Mother")
    return mother_section.present? ? mother_section : []
  end

  def bia_father
    father_section = get_relation_section("Father")
    return father_section.present? ? father_section : []
  end

  def not_family_explantion
    # Add all the explanations from other fields
    "NOT FAMILY"
  end

  def father_death_details
    get_death_details("Father")
  end

  def mother_death_details
    get_death_details("Mother")
  end

  def bia_male_caregiver
    get_primary_caregiver("Male")
  end

  def bia_female_caregiver
    get_primary_caregiver("Female")
  end

  private

  def get_relation_section(relation_name)
    relation_section = []
    family_details = self.try(:family_details_section)
    if family_details.present?
      relation_section = family_details.select{ |details| details.relation == relation_name }
    end
    relation_section
  end

  def get_death_details(relation_name)
    details = ""
    relation_section = get_relation_section(relation_name)
    if relation_section.present? && relation_section.relation_death_details.present?
      details = relation_section.relation_death_details
    end
    details
  end

  def get_primary_caregiver(sex)
    relation_section = []
    family_details = self.try(:family_details_section)
    if family_details.present?
      relation_section = family_details.select do |details|
        details.relation_is_caregiver == true && details.relation_sex == sex
      end
    end
    relation_section
  end

end
