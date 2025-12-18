# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'rails_helper'

describe UnusedFieldsReport do
  before do
    clean_data(FormSection, PrimeroModule, PrimeroProgram, Child)
    travel_to Time.zone.parse('2023-08-10 12:18:05')
  end

  let!(:primero_module1) do
    create(:primero_module, name: 'Primero Module 1', unique_id: 'primero-module-1', form_sections: [form_section1])
  end

  let(:field1) { Field.new(name: 'field_name1', type: Field::TEXT_FIELD, display_name: 'Field Name 1') }

  let(:field2) { Field.new(name: 'field_name2', type: Field::TEXT_FIELD, display_name: 'Field Name 2') }

  let(:form_section1) do
    FormSection.create!(
      unique_id: 'form_section_1',
      name: 'Form Section 1',
      parent_form: 'case',
      visible: true,
      is_nested: false,
      fields: [field1, field2]
    )
  end

  let!(:child1) do
    Child.create!(data: { field_name1: 'Value 1', field_name2: 'Value 2', module_id: 'primero-module-1' })
  end

  let!(:child2) { Child.create!(data: { field_name2: 'Value 2', module_id: 'primero-module-1' }) }

  let!(:child3) { Child.create!(data: { field_name1: 'Value 1', module_id: 'primero-module-1' }) }

  let!(:child4) { Child.create!(data: { field_name1: 'Value 1', module_id: 'primero-module-1' }) }

  it 'builds the report data' do
    unused_fields_report = UnusedFieldsReport.new
    unused_fields_report.build

    expect(unused_fields_report.data).to match_array(
      [
        {
          'module_id' => 'primero-module-1',
          'field_stats' => match_array(
            [
              {
                'field' => field1, 'form_section' => form_section1, 'total' => 3, 'prevalence' => BigDecimal(0.75, 10)
              },
              {
                'field' => field2, 'form_section' => form_section1, 'total' => 2, 'prevalence' => BigDecimal(0.5, 10)
              }
            ]
          ),
          'total_records' => 4
        }
      ]
    )
  end
end
