# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes a subreport for Process And Quality - Implemented Referrals
class ManagedReports::SubReports::ProcessQualityImplementedReferrals < ManagedReports::SubReport
  def id
    'process_quality_implemented_referrals'
  end

  def indicators
    [
      ManagedReports::Indicators::ImplementedSuccessfulReferrals
    ].freeze
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::ImplementedSuccessfulReferrals.id => 'lookup-gender-identity'
    }.freeze
  end

  def indicators_rows
    {
      ManagedReports::Indicators::ImplementedSuccessfulReferrals.id => [
        { id: 'implemented', display_text: row_display_texts('implemented') }
      ]
    }
  end

  private

  def row_display_texts(id)
    I18n.available_locales.each_with_object({}) do |locale, memo|
      memo[locale] = I18n.t(
        "managed_reports.process_quality_implemented_referrals.#{id}", locale:
      )
    end
  end
end
