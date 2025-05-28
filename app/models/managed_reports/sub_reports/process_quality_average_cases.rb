# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes a subreport for Process And Quality - Average Cases
class ManagedReports::SubReports::ProcessQualityAverageCases < ManagedReports::SubReport
  def id
    'process_quality_average_cases'
  end

  def indicators
    [
      ManagedReports::Indicators::AverageCasesPerCaseWorker
    ].freeze
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::AverageCasesPerCaseWorker.id => 'lookup-gender-identity'
    }.freeze
  end

  def indicators_rows
    {
      ManagedReports::Indicators::AverageCasesPerCaseWorker.id => [
        { id: 'average_cases_per_case_worker', display_text: average_cases_per_case_worker_display_texts }
      ]
    }
  end

  private

  def average_cases_per_case_worker_display_texts
    I18n.available_locales.each_with_object({}) do |locale, memo|
      memo[locale] = I18n.t(
        'managed_reports.process_quality_average_cases.average_cases_per_case_worker', locale:
      )
    end
  end
end
