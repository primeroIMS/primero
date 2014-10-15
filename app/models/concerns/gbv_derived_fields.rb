module GBVDerivedFields
  extend ActiveSupport::Concern
  extend Memoist

  def gbv_age_at_time_of_incident
    self.try(:age).try(:to_i)
  end
  memoize :gbv_age_at_time_of_incident

  def gbv_age_group_at_time_of_incident
    age = gbv_age_at_time_of_incident
    return unless age.present?
    if age >= 18
      "Age 18 and over"
    elsif age >= 12
      "12-17"
    elsif age >= 0
      "0-11"
    else
      "Unknown"
    end
  end
  memoize :gbv_age_group_at_time_of_incident

  def gbv_adult_or_child_at_time_of_incident
    age = gbv_age_at_time_of_incident
    return unless age.present?
    if age >= 18
      "Adult"
    elsif age >= 0
      "Child"
    end
  end
  memoize :gbv_adult_or_child_at_time_of_incident

  def gbv_uam_sc_ovc
    unaccompanied_separated_status = self.try(:unaccompanied_separated_status)
    if unaccompanied_separated_status.blank? or unaccompanied_separated_status == "No"
      "No"
    elsif ["Unaccompanied Minor", "Separated Child", "Other Vulnerable Child"].include?(unaccompanied_separated_status)
      "UAM/SC/OVC"
    end
  end
  memoize :gbv_uam_sc_ovc

  def gbv_disability
    if self.try(:disability_type).blank?
      "No"
    else
      "Disability"
    end
  end
  memoize :gbv_disability

  def gbv_sexual_violence
    "Sexual Violence" if is_sexual_violence?
  end
  memoize :gbv_sexual_violence

  def gbv_intimate_partner_violence
    gbv_sexual_violence_type = self.try(:gbv_sexual_violence_type)
    alleged_perpetrator = self.try(:alleged_perpetrator)

    if gbv_sexual_violence_type.present? and gbv_sexual_violence_type != "Non-GBV"
      if alleged_perpetrator.respond_to?(:select)
        #perpetrator_relationship is the subform, so will check if we found the value "Intimate Partner/Former Partner" in any subform.
        if alleged_perpetrator.select {|subform| subform.try(:perpetrator_relationship) == "Intimate Partner/Former Partner" }.present?
          "Intimate Partner Violence"
        end
      end
    end
  end
  memoize :gbv_intimate_partner_violence

  def gbv_child_sexual_abuse
    if gbv_adult_or_child_at_time_of_incident == "Child" and is_sexual_violence?
      "Child Sexual Abuse"
    end
  end
  memoize :gbv_child_sexual_abuse

  def gbv_early_marriage
    if gbv_adult_or_child_at_time_of_incident == "Child" and self.try(:gbv_sexual_violence_type) == "Forced Marriage"
      "Early Marriage"
    end
  end
  memoize :gbv_early_marriage

  def gbv_harmful_traditional_practice
    harmful_traditional_practice = self.try(:harmful_traditional_practice)
    if harmful_traditional_practice.present? and harmful_traditional_practice != "No"
      "Harmful Traditional Practice"
    end
  end
  memoize :gbv_harmful_traditional_practice

  def gbv_possible_sexual_exploitation
    if self.try(:goods_money_exchanged) == "Yes" and is_sexual_violence?
      "Possible Sexual Exploitation"
    end
  end
  memoize :gbv_possible_sexual_exploitation

  def gbv_possible_sexual_slavery
    abduction_status_time_of_incident = self.try(:abduction_status_time_of_incident)
    if abduction_status_time_of_incident.present? and abduction_status_time_of_incident != "None" and is_sexual_violence?
      "Possible Sexual Slavery"
    end
  end
  memoize :gbv_possible_sexual_slavery

  def gbv_incident_month_year
    self.try(:incident_date).try(:strftime, "%b-%Y")
  end
  memoize :gbv_incident_month_year

  def gbv_incident_quarter
    get_quarter_month(self.try(:incident_date).try(:month))
  end
  memoize :gbv_incident_quarter

  def gbv_incident_reported_year
    self.try(:date_of_first_report).try(:year)
  end
  memoize :gbv_incident_reported_year

  def gbv_incident_reported_quarter
    get_quarter_month(self.try(:date_of_first_report).try(:month))
  end
  memoize :gbv_incident_reported_quarter

  def gbv_days_between_incident_and_interview
    incident_date = self.try(:incident_date)
    date_of_first_report = self.try(:date_of_first_report)
    if date_of_first_report.is_a?(Date) and incident_date.is_a?(Date)
      (date_of_first_report - incident_date).to_i
    end
  end
  memoize :gbv_days_between_incident_and_interview

  def gbv_range_between_incident_and_interview
    days = gbv_days_between_incident_and_interview
    return unless days.present?
    if days >= 30
      "Over 1 month"
    elsif days >= 15
      "2 weeks - 1 month"
    elsif days >= 6
      "6-14 Days"
    elsif days >= 4
      "4-5 Days"
    elsif days >= 0
      "0-3 Days"
    end
  end
  memoize :gbv_range_between_incident_and_interview

  def gbv_excluded_from_statistics
    if self.try(:gbv_reported_elsewhere_subform).respond_to?(:select)
      #gbv_reported_elsewhere_reporting field is in a subform, so per Laurie request will check if found the value "Yes"
      #no matter what the "No" we can found.
      if self.gbv_reported_elsewhere_subform.select {|subform| subform.try(:gbv_reported_elsewhere_reporting) == "Yes" }.present?
        "Exclude"
      #If we reach this point we did not found "Yes", so check if there is any "No", the subform could be empty.
      elsif self.gbv_reported_elsewhere_subform.select {|subform| subform.try(:gbv_reported_elsewhere_reporting) == "No" }.present?
        "Include"
      end
    end
  end
  memoize :gbv_excluded_from_statistics

  private

  def is_sexual_violence?
    ["Rape", "Sexual Assault"].include?(self.try(:gbv_sexual_violence_type))
  end
  memoize :is_sexual_violence?

  def get_quarter_month(month)
    return unless month.present?
    if month >= 10
      "Quarter 4"
    elsif month >= 7
      "Quarter 3"
    elsif month >= 4
      "Quarter 2"
    elsif month >= 1
      "Quarter 1"
    end
  end
  memoize :get_quarter_month

end
