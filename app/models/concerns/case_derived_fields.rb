module CaseDerivedFields
  extend ActiveSupport::Concern

  def latest_caregiver_name
    name = ""
    latest = latest_care_arrangements
    if latest.present?
      name = latest.name_caregiver
    end
    name
  end

  def latest_caregiver_relationship
    relationship = ""
    latest = latest_care_arrangements
    if latest.present?
      relationship = latest.relationship_caregiver
    end
    relationship
  end

  def latest_caregiver_address
    address = ""
    latest = latest_care_arrangements
    if latest.present?
      address = latest.address_caregiver
    end
    address
  end

  def latest_caregiver_telephone
    telephone = ""
    latest = latest_care_arrangements
    if latest.present?
      telephone = latest.telephone_caregiver
    end
    telephone
  end

  private

  def latest_care_arrangements
    latest = nil
    care_arrangements = self.try(:care_arrangements_subform_care_arrangement)
    if care_arrangements.present?
      latest = care_arrangements.first
    end
    latest
  end
end
