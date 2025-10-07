# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes Cases based on in Primero.
class ManagedReports::SubReports::ImprovedPsychosocialWellbeing < ManagedReports::SubReport
  def id
    'improved_psychosocial_wellbeing'
  end

  def indicators
    [
      ManagedReports::Indicators::ImprovedWellbeingAfterSupport
    ]
  end

  def indicators_rows
    {
      ManagedReports::Indicators::ImprovedWellbeingAfterSupport.id => [
        { id: 'improve_by_at_least_3_points', display_text: improved_display_texts },
        { id: 'not_improve_by_at_least_3_points', display_text: not_improved_display_texts }
      ]
    }
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::ImprovedWellbeingAfterSupport.id => 'lookup-gender-identity'
    }
  end

  private

  def improved_display_texts
    I18n.available_locales.each_with_object({}) do |locale, memo|
      memo[locale] = I18n.t(
        'managed_reports.protection_outcomes.improved_wellbeing_after_support.improve_by_at_least_3_points', locale:
      )
    end
  end

  def not_improved_display_texts
    I18n.available_locales.each_with_object({}) do |locale, memo|
      memo[locale] = I18n.t(
        'managed_reports.protection_outcomes.improved_wellbeing_after_support.not_improve_by_at_least_3_points', locale:
      )
    end
  end
end
