# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes Cases based on in Primero.
class ManagedReports::SubReports::ImpactedProtectionRisks < ManagedReports::SubReport
  def id
    'impacted_protection_risks'
  end

  def indicators
    [
      ManagedReports::Indicators::LessImpactedAfterSupport
    ]
  end

  def indicators_rows
    {
      ManagedReports::Indicators::LessImpactedAfterSupport.id => [
        { id: 'clients_report_less_impacted', display_text: less_impacted_display_texts },
        { id: 'clients_report_equally_or_more_severely_impacted', display_text: more_impacted_display_texts }
      ]
    }
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::LessImpactedAfterSupport.id => 'lookup-gender-identity'
    }
  end

  private

  def less_impacted_display_texts
    I18n.available_locales.each_with_object({}) do |locale, memo|
      memo[locale] = I18n.t(
        'managed_reports.protection_outcomes.less_impacted_after_support.clients_report_less_impacted', locale:
      )
    end
  end

  def more_impacted_display_texts
    I18n.available_locales.each_with_object({}) do |locale, memo|
      memo[locale] = I18n.t(
        'managed_reports.protection_outcomes.less_impacted_after_support.' \
        'clients_report_equally_or_more_severely_impacted',
        locale:
      )
    end
  end
end
