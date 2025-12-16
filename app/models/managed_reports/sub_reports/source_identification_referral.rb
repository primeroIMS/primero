# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes SourceIdentificationReferral subreport in Primero.
class ManagedReports::SubReports::SourceIdentificationReferral < ManagedReports::SubReport
  def id
    'source_identification_referral'
  end

  def indicators
    [
      ManagedReports::Indicators::CaseSourceIdentificationReferral
    ].freeze
  end

  def indicators_rows
    {
      ManagedReports::Indicators::CaseSourceIdentificationReferral.id => source_identification_referral_options
    }
  end

  def indicators_subcolumns
    { ManagedReports::Indicators::CaseSourceIdentificationReferral.id => 'lookup-gender' }.freeze
  end

  def source_identification_referral_options
    field = Field.joins(:form_section).find_by(
      name: 'source_identification_referral',
      form_sections: { parent_form: PrimeroModelService.to_name(Child.name) }
    )
    return [] unless field.present?

    field.option_strings_text_i18n
  end
end
