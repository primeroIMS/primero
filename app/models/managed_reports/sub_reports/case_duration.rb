# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes Cases by Duration in Primero.
class ManagedReports::SubReports::CaseDuration < ManagedReports::SubReport
  def id
    'case_duration'
  end

  def indicators
    [
      ManagedReports::Indicators::PercentageCasesDuration
    ]
  end

  def indicators_rows
    {
      ManagedReports::Indicators::PercentageCasesDuration.id => %w[
        1_month 1_3_months 3_6_months over_6_months
      ].map { |id| { id:, display_text: row_display_texts(id) } }
    }
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::PercentageCasesDuration.id => 'lookup-gender-identity'
    }
  end

  private

  def row_display_texts(id)
    I18n.available_locales.each_with_object({}) do |locale, memo|
      memo[locale] = I18n.t("managed_reports.case_characteristics.percentage_cases_duration.#{id}", locale:)
    end
  end
end
