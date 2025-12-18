# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# TODO: There are some rubocop warnings related to double quotes around some of the Arabic text.  Leaving as-is for now

require 'rails_helper'
require 'roo'

module Exporters
  describe UnusedFieldsExporter do
    clean_data(FormSection, PrimeroModule, PrimeroProgram, Child)

    before { travel_to Time.zone.parse('2023-08-10 12:18:05') }

    let!(:primero_module1) do
      create(:primero_module, name: 'Primero Module 1', unique_id: 'primero-module-1', form_sections: [form_section1])
    end

    let(:form_section1) do
      FormSection.create!(
        unique_id: 'form_section_1',
        name: 'Form Section 1',
        parent_form: 'case',
        visible: true,
        is_nested: false,
        fields: [
          Field.new(name: 'field_name1', type: Field::TEXT_FIELD, display_name: 'Field Name 1'),
          Field.new(name: 'field_name2', type: Field::TEXT_FIELD, display_name: 'Field Name 2')
        ]
      )
    end

    let!(:child1) do 
      Child.create!(data: { field_name1: 'Value 1', field_name2: 'Value 2', module_id: 'primero-module-1' })
    end

    let!(:child2) { Child.create!(data: { field_name2: 'Value 2', module_id: 'primero-module-1' }) }

    let!(:child3) { Child.create!(data: { field_name1: 'Value 1', module_id: 'primero-module-1' }) }

    let!(:child4) { Child.create!(data: { field_name1: 'Value 1', module_id: 'primero-module-1' }) }

    let(:workbook) do
      unused_fields_report = UnusedFieldsReport.new
      unused_fields_report.build

      data = Exporters::UnusedFieldsExporter.export(unused_fields_report)
      Roo::Spreadsheet.open(StringIO.new(data), extension: :xlsx)
    end

    it 'exports the stats for the fields' do
      expect(workbook.sheets.size).to eq(1)
      expect(workbook.sheet(0).row(1)).to eq(
        ['Generated Periodically. Last generated at Aug 10, 2023 12:18 PM.', nil, nil, nil, nil, nil]
      )
      expect(workbook.sheet(0).row(2)).to eq(['Primero Module 1 - Case', nil, nil, nil, nil, nil])
      expect(workbook.sheet(0).row(4)).to eq(['Out of 4 Cases...', nil, nil, nil, nil, nil])
      expect(workbook.sheet(0).row(7)).to eq(
        ['Field ID', 'Field Name', 'Form Name', 'Cases where filled', 'Prevalence', 'Created At']
      )
      expect(workbook.sheet(0).row(8)).to eq(
        ['field_name2', 'Field Name 2', 'Form Section 1', 2, BigDecimal(0.5, 10), 'Aug 10, 2023 12:18 PM']
      )
      expect(workbook.sheet(0).row(9)).to eq(
        ['field_name1', 'Field Name 1', 'Form Section 1', 3, BigDecimal(0.75, 10), 'Aug 10, 2023 12:18 PM']
      )
    end
  end
end
