module GBVDerivedFields
  extend ActiveSupport::Concern

  def gbv_age_at_time_of_incident
    self.try(:age).try(:to_i)
  end

  def gbv_age_group_at_time_of_incident
    age = gbv_age_at_time_of_incident
    return unless age.present?
    if age >= 18
      I18n.t("gbv_report.18_and_over_age")
    elsif age >= 12
      I18n.t("gbv_report.12_17_age")
    elsif age >= 0
      I18n.t("gbv_report.0_11_age")
    else
      I18n.t("gbv_report.unknown")
    end
  end

  def gbv_adult_or_child_at_time_of_incident
    age = gbv_age_at_time_of_incident
    return unless age.present?
    if age >= 18
      I18n.t("gbv_report.adult")
    elsif age >= 0
      I18n.t("gbv_report.child")
    end
  end

  def gbv_uam_sc_ovc
    unaccompanied_separated_status = self.try(:unaccompanied_separated_status)
    if unaccompanied_separated_status.blank? or unaccompanied_separated_status == I18n.t("gbv_report.no")
      I18n.t("gbv_report.no")
    elsif [I18n.t("gbv_report.unaccompanied_minor"),
           I18n.t("gbv_report.separated_child"), 
           I18n.t("gbv_report.other_vulnerable_child")].include?(unaccompanied_separated_status)
      I18n.t("gbv_report.uam_sc_ovc")
    end
  end

  def gbv_disability
    if self.try(:disability_type).blank?
      I18n.t("gbv_report.no")
    else
      I18n.t("gbv_report.disability")
    end
  end

  def gbv_sexual_violence
    I18n.t("gbv_report.sexual_violence") if is_sexual_violence?
  end

  def gbv_intimate_partner_violence
    gbv_sexual_violence_type = self.try(:gbv_sexual_violence_type)
    alleged_perpetrator = self.try(:alleged_perpetrator)

    if gbv_sexual_violence_type.present? and gbv_sexual_violence_type != I18n.t("gbv_report.non_gbv")
      if alleged_perpetrator.respond_to?(:select)
        #perpetrator_relationship is the subform, so will check if we found the value "Intimate Partner/Former Partner" in any subform.
        if alleged_perpetrator.select {|subform| subform.try(:perpetrator_relationship) == I18n.t("gbv_report.intimate_partner_former_partner") }.present?
          I18n.t("gbv_report.intimate_partner_violence")
        end
      end
    end
  end

  def alleged_perpetrators
    ap = self.try(:alleged_perpetrator)
    # Weed out empty records (excluding the id, of course)
    ap.present? ? ap.reject{|a| a.attributes.except("unique_id").values.any? == false} : []
  end

  def gbv_child_sexual_abuse
    if is_child? and is_sexual_violence?
      I18n.t("gbv_report.child_sexual_abuse")
    end
  end

  def gbv_early_marriage
    if is_child? and self.try(:gbv_sexual_violence_type) == I18n.t("gbv_report.forced_marriage")
      I18n.t("gbv_report.early_marriage")
    end
  end

  def gbv_harmful_traditional_practice
    harmful_traditional_practice = self.try(:harmful_traditional_practice)
    if harmful_traditional_practice.present? and harmful_traditional_practice != I18n.t("gbv_report.no")
      I18n.t("gbv_report.harmful_traditional_practice")
    end
  end

  def gbv_possible_sexual_exploitation
    if self.try(:goods_money_exchanged) == I18n.t("gbv_report.yes") and is_sexual_violence?
      I18n.t("gbv_report.possible_sexual_exploitation")
    end
  end

  def gbv_possible_sexual_slavery
    abduction_status_time_of_incident = self.try(:abduction_status_time_of_incident)
    if abduction_status_time_of_incident.present? and abduction_status_time_of_incident != I18n.t("gbv_report.none") and is_sexual_violence?
      I18n.t("gbv_report.possible_sexual_slavery")
    end
  end

  def gbv_incident_month_year
    self.try(:incident_date).try(:strftime, "%b-%Y")
  end

  def gbv_incident_quarter
    get_quarter_month(self.try(:incident_date).try(:month))
  end

  def gbv_incident_reported_year
    self.try(:date_of_first_report).try(:year)
  end

  def gbv_incident_reported_quarter
    get_quarter_month(self.try(:date_of_first_report).try(:month))
  end

  def gbv_days_between_incident_and_interview
    incident_date = self.try(:incident_date)
    date_of_first_report = self.try(:date_of_first_report)
    if date_of_first_report.is_a?(Date) and incident_date.is_a?(Date)
      (date_of_first_report - incident_date).to_i
    end
  end

  def gbv_range_between_incident_and_interview
    days = gbv_days_between_incident_and_interview
    return unless days.present?
    if days >= 30
      I18n.t("gbv_report.over_1_month")
    elsif days >= 15
      I18n.t("gbv_report.2_weeks_1_month")
    elsif days >= 6
      I18n.t("gbv_report.6_14_days")
    elsif days >= 4
      I18n.t("gbv_report.4_5_days")
    elsif days >= 0
      I18n.t("gbv_report.0_3_days")
    end
  end

  def gbv_excluded_from_statistics
    if self.try(:gbv_reported_elsewhere_subform).respond_to?(:select)
      #gbv_reported_elsewhere_reporting field is in a subform, so per Laurie request will check if found the value "Yes"
      #no matter what "No" we can found.
      if self.gbv_reported_elsewhere_subform.select {|subform| subform.try(:gbv_reported_elsewhere_reporting) == I18n.t("gbv_report.yes") }.present?
        I18n.t("gbv_report.exclude")
      #If we reach this point we did not found "Yes", so check if there is any I18n.t("gbv_report.no"), the subform could be empty.
      elsif self.gbv_reported_elsewhere_subform.select {|subform| subform.try(:gbv_reported_elsewhere_reporting) == I18n.t("gbv_report.no") }.present?
        I18n.t("gbv_report.include")
      end
    end
  end

  private

  def is_child?
    gbv_adult_or_child_at_time_of_incident == I18n.t("gbv_report.child")
  end

  def is_sexual_violence?
    [I18n.t("gbv_report.rape"), I18n.t("gbv_report.sexual_assault")].include?(self.try(:gbv_sexual_violence_type))
  end

  def get_quarter_month(month)
    return unless month.present?
    if month >= 10
      I18n.t("gbv_report.quarter_4")
    elsif month >= 7
      I18n.t("gbv_report.quarter_3")
    elsif month >= 4
      I18n.t("gbv_report.quarter_2")
    elsif month >= 1
      I18n.t("gbv_report.quarter_1")
    end
  end

end
