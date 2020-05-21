# frozen_string_literal: true

require 'rails_helper'
require 'sunspot'

describe DuplicateBulkExport, search: true do
  before :each do
    clean_data(BulkExport, Agency, Location, UserGroup, Role, User, Field,
               FormSection, Child, PrimeroModule, PrimeroProgram, SystemSettings)

    SystemSettings.create(duplicate_export_field: 'national_id_no')
    SystemSettings.current(true)
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
    role = create(:role, form_sections: [@form_section], modules: [primero_module], group_permission: Permission::ALL)
    @user = create(:user, role: role)

    @bulk_exporter = DuplicateBulkExport.new(
      format: Exporters::DuplicateIdCSVExporter.id,
      record_type: 'case',
      owned_by: @user.user_name
    )
  end

  let(:export_csv) do
    @bulk_exporter.export('XXX')
    exported = @bulk_exporter.exporter.buffer.string
    CSV.parse(exported)
  end

  it 'export cases with duplicate ids' do
    child1 = create(:child, national_id_no: 'test1', age: 5, name: 'Test Child 1')
    child2 = create(:child, national_id_no: 'test1', age: 6, name: 'Test Child 2')
    create(:child, national_id_no: 'test2', age: 2, name: 'Test Child 3')
    Sunspot.commit

    expected_headers = [
      ' ', 'MOHA ID DEPRECATED', 'National ID No', 'Case ID', 'Progress ID',
      'Child Name', 'Age', 'Sex', 'Family Size'
    ]
    expect(export_csv[0]).to eq(expected_headers)
    expect([export_csv[1][3], export_csv[2][3]]).to include(child1.case_id, child2.case_id)
  end

  context 'when no cases found' do
    it 'exports headers' do
      expect(export_csv).to eq(
        [[' ', 'MOHA ID DEPRECATED', 'National ID No', 'Case ID', 'Progress ID',
          'Child Name', 'Age', 'Sex', 'Family Size']]
      )
    end
  end

  after :each do
    clean_data(BulkExport, Agency, Location, UserGroup, Role, User, Field,
               FormSection, Child, PrimeroModule, PrimeroProgram, SystemSettings)
  end
end
