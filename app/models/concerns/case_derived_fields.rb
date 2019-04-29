#TODO: Leaving derived fields in concerns for now but we should find more
# appropriate place (outside of the concerns mechanism) to store derived fields
module CaseDerivedFields
  extend ActiveSupport::Concern

  def latest_caregiver_name
    latest_care_arrangements['name_caregiver'] if latest_care_arrangements.present?
  end

  def latest_caregiver_relationship
    latest_care_arrangements['relationship_caregiver'] if latest_care_arrangements.present?
  end

  def latest_caregiver_address
    latest_care_arrangements['address_caregiver'] if latest_care_arrangements.present?
  end

  def latest_caregiver_telephone
    latest_care_arrangements['telephone_caregiver'] if latest_care_arrangements.present?
  end

  def has_case_plan
    plan = false
    interventions = self.data['cp_case_plan_subform_case_plan_interventions']
    if interventions.present?
      plan = interventions.find_index do |i|
        i['intervention_service_to_be_provided'].present? ||
        i['intervention_service_goal'].present?
      end
    end
    return plan.present?
  end
  alias :has_case_plan? :has_case_plan

  private

  def latest_care_arrangements
    latest = nil
    care_arrangements = self.data['care_arrangements_subform_care_arrangement']
    if care_arrangements.present?
      latest = care_arrangements.first
    end
    latest
  end
end
