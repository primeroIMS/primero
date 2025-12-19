# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# Describes ReasonsForClosure subreport in Primero.
class ManagedReports::SubReports::ReasonsForClosure < ManagedReports::SubReport
  def id
    'reasons_for_closure'
  end

  def indicators
    [ManagedReports::Indicators::PercentageCasesReasonsForClosure].freeze
  end

  def indicators_rows
    { ManagedReports::Indicators::PercentageCasesReasonsForClosure.id => closure_reasons_options }.freeze
  end

  def indicators_subcolumns
    { ManagedReports::Indicators::PercentageCasesReasonsForClosure.id => 'lookup-gender' }.freeze
  end

  private

  def closure_reasons_options
    # NOTE: This code will need to change if we need to handle different modules.
    field = Field.joins(form_section: :primero_modules).find_by(
      name: 'closure_reason',
      form_sections: {
        parent_form: PrimeroModelService.to_name(Child.name), primero_modules: { unique_id: PrimeroModule::CP }
      }
    )
    return [] unless field.present? && field.option_strings_text_i18n.present?

    field.option_strings_text_i18n
  end
end
