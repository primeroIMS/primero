# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Class for Reportable Protection Concern
class ReportableProtectionConcern
  include ReportableNestedRecord

  def self.parent_record_type
    Child
  end

  def self.record_field_name
    'protection_concern_detail_subform_section'
  end

  def self.report_filters
    [
      { 'attribute' => 'status', 'value' => [Record::STATUS_OPEN] },
      { 'attribute' => 'record_state', 'value' => ['true'] },
      { 'attribute' => 'protection_concern_type', 'value' => 'not_null' }
    ]
  end

  def id
    object_value('unique_id')
  end
end
