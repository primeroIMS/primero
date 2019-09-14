module BIADerivedFields
  extend ActiveSupport::Concern

  #TODO: Improve with i18n
  MOTHER = "mother"
  FATHER = "father"

  def bia_mother
    mother_section = get_relation_section(MOTHER)
    return mother_section.present? ? mother_section : []
  end

  def bia_father
    father_section = get_relation_section(FATHER)
    return father_section.present? ? father_section : []
  end

  def not_family_explanation
    explanation = ""
    family_details = self.data['family_details_section']
    if family_details.present?
      family_details.each do |detail|
        explanation += (detail['not_family_explanation'] + "\n") if detail['not_family_explanation'].present?
      end
    end
    explanation
  end

  def father_death_details
    get_death_details(FATHER)
  end

  def mother_death_details
    get_death_details(MOTHER)
  end

  def bia_caregiver
    relation_section = []
    family_details = self.data['family_details_section']
    if family_details.present?
      relation_section = family_details.select do |details|
        details['relation_is_caregiver'] == true &&
          details['relation'] != MOTHER &&
          details['relation'] != FATHER
      end
    end
    relation_section
  end

  def bia_child_wishes
    self.data['child_preferences_section']
  end

  def bia_child_other_wishes
    self.data['child_other_relations_section']
  end

  def current_care_arrangements
    current = []
    care_arrangements = self.data['care_arrangements_subform_care_arrangement']
    if care_arrangements.present?
      #this subform has "subform_sort_by": "care_arrangement_started_date"
      #therefore .first care arrangement should have latest care arrangement
      current = [care_arrangements.first]
    end
    current
  end

  def bia_interviews
    current_care_arrangements
  end

  def bia_interventions
    self.data['cp_case_plan_subform_case_plan_interventions']
  end

  def bia_followups
    self.data['followup_subform_section']
  end

  def case_transferred_for_bia
    transfers = self.data['transitions'].select{ |t| t['type'] == Transition::TRANSFER }
    return transfers.present? ? true : false
  end

  def bia_transfers
    latest_transfer = []
    if case_transferred_for_bia
      transfers = self.data['transitions'].select{ |t| t['type'] == Transition::TRANSFER }
      latest_transfer = [transfers.first]
    end
    latest_transfer
  end

  def bia_consent_for_services
     self.data['consent_for_services']
  end

  private

  def get_relation_section(relation_name)
    relation_section = []
    family_details = self.data['family_details_section']
    if family_details.present?
      relation_section = family_details.select{ |details| details['relation'] == relation_name }
    end
    relation_section
  end

  def get_death_details(relation_name)
    details = ""
    # Assuming there's only one father and one mother specified in the nested forms
    relation_section = get_relation_section(relation_name).first
    if relation_section.present? && relation_section['relation_death_details'].present?
      details = relation_section['relation_death_details']
    end
    details
  end

end
