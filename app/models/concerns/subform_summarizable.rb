# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Implements methods to calculate summary subform fields
module SubformSummarizable
  extend ActiveSupport::Concern

  included do
    before_save :calculate_summary_fields
  end

  def calculate_summary_fields
    subform_summary_fields.each do |field|
      next unless subform_to_summarize_changed?(field)

      data[field.name] = calculate_summary(field)
    end
  end

  def subform_to_summarize_changed?(field)
    subform_unique_id = field.subform_summary['subform_unique_id']
    changes_to_save_for_record.key?(subform_unique_id)
  end

  def calculate_summary(field)
    subform_unique_id = field.subform_summary['subform_unique_id']
    subforms = data[subform_unique_id]
    function_name = field.subform_summary.keys.reject { |key| key == 'subform_unique_id' }.first
    function_args = field.subform_summary[function_name]
    SubformSummaryService.new(subforms:, args: function_args).send(function_name)
  end

  def subform_summary_fields
    # TODO: Should this be cached somewhere else?
    # TODO: Review permitted fields caching
    @subform_summary_fields ||= Field.joins(:form_section).where(
      form_section: { parent_form: self.class.parent_form }, visible: true
    ).where.not(subform_summary: nil)
  end
end
