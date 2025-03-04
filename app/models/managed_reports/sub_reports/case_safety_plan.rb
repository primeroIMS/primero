# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes Cases by Safety Plan in Primero.
class ManagedReports::SubReports::CaseSafetyPlan < ManagedReports::SubReport
  def id
    'case_safety_plan'
  end

  def indicators
    [
      ManagedReports::Indicators::PercentageCasesSafetyPlan
    ]
  end

  def indicators_rows
    {
      ManagedReports::Indicators::PercentageCasesSafetyPlan.id => %w[
        safety_plan_completed safety_plan_not_completed
      ].map { |id| { id:, display_text: row_display_texts(id) } }
    }
  end

  def lookups
    {}
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::PercentageCasesSafetyPlan.id => 'lookup-gender-identity'
    }
  end

  private

  def row_display_texts(id)
    I18n.available_locales.each_with_object({}) do |locale, memo|
      memo[locale] = I18n.t("managed_reports.case_characteristics.percentage_cases_safety_plan.#{id}", locale:)
    end
  end
end
