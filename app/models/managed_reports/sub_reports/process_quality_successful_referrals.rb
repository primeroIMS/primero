# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes a subreport for Process And Quality - Successful Referrals
class ManagedReports::SubReports::ProcessQualitySuccessfulReferrals < ManagedReports::SubReport
  def id
    'process_quality_successful_referrals'
  end

  def indicators
    [
      ManagedReports::Indicators::PercentageSuccessfulReferrals
    ].freeze
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::PercentageSuccessfulReferrals.id => 'lookup-gender-identity'
    }.freeze
  end

  def indicators_rows
    {
      ManagedReports::Indicators::PercentageSuccessfulReferrals.id => [
        { id: 'implemented', display_text: row_display_texts('implemented') },
        { id: 'not_implemented', display_text: row_display_texts('not_implemented') }
      ]
    }
  end

  private

  def row_display_texts(id)
    I18n.available_locales.each_with_object({}) do |locale, memo|
      memo[locale] = I18n.t(
        "managed_reports.process_quality_successful_referrals.#{id}", locale:
      )
    end
  end
end
