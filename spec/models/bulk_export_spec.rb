# frozen_string_literal: true

require 'rails_helper'
require 'sunspot'
require 'spreadsheet'

describe BulkExport, search: true do
  before :each do
    clean_data(BulkExport, Agency, Location, UserGroup, Role, User, Field,
               FormSection, Child, PrimeroModule, PrimeroProgram, SystemSettings)

    @form_section = create(
      :form_section,
      unique_id: 'test_form',
      fields: [
        build(:field, name: 'national_id_no', type: 'text_field', display_name: 'National ID No'),
        build(:field, name: 'case_id', type: 'text_field', display_name: 'Case Id'),
        build(:field, name: 'unhcr_individual_no', type: 'text_field', display_name: 'Unh No'),
        build(:field, name: 'child_name_last_first', type: 'text_field', display_name: 'Name'),
        build(:field, name: 'age', type: 'numeric_field', display_name: 'Age'),
        build(:field, name: 'family_count_no', type: 'numeric_field', display_name: 'Family No')
      ]
    )
    primero_module = create(:primero_module)
    role = create(:role, form_sections: [@form_section], modules: [primero_module])
    @user = create(:user, role: role)
  end

  describe 'custom bulk export' do
    let(:bulk_export) do
      BulkExport.new(
        format: Exporters::SelectedFieldsExcelExporter.id,
        record_type: 'case',
        custom_export_params: { field_names: %w[age sex] },
        owned_by: @user.user_name
      )
    end

    let(:export_spreadsheet) do
      bulk_export.export('XXX')
      data = bulk_export.exporter.buffer.string
      book = Spreadsheet.open(StringIO.new(data))
      book.worksheets[0]
    end

    it 'exports only the selected fields for cases' do
      expect(export_spreadsheet.row(0).to_a).to eq %w[ID Age]
    end
  end

  after :each do
    clean_data(BulkExport, Agency, Location, UserGroup, Role, User, Field,
               FormSection, Child, PrimeroModule, PrimeroProgram, SystemSettings)
  end
end
