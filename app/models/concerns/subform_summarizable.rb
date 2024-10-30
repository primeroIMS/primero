# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Implements methods to calculate summary subform fields
module SubformSummarizable
  extend ActiveSupport::Concern

  included do
    before_save :calculate_summary_fields
  end

  def calculate_summary_fields
    SubformSummaryFieldsService.instance.subform_summary_fields(self.class.parent_form).each do |field|
      next unless subform_to_summarize_changed?(field)

      data[field.name] = calculate_summary(field)
    end
  end

  def subform_to_summarize_changed?(field)
    subform_field_name = field.subform_summary['subform_field_name']
    changes_to_save_for_record.key?(subform_field_name)
  end

  def calculate_summary(field)
    subform_field_name = field.subform_summary['subform_field_name']
    subforms = data[subform_field_name]
    function_name = field.subform_summary.keys.reject { |key| key == 'subform_field_name' }.first
    function_args = field.subform_summary[function_name]
    SubformSummaryService.new(subforms:, args: function_args).send(function_name)
  end
end
