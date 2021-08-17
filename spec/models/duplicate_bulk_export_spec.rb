# frozen_string_literal: true

require 'rails_helper'
require 'sunspot'

describe DuplicateBulkExport, search: true do
  before :each do
    clean_data(BulkExport, Agency, Location, UserGroup, Role, User, Field,
               FormSection, Child, PrimeroModule, PrimeroProgram, SystemSettings,
               FormPermission)

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

    @expected_headers = [
      ' ', 'MOHA ID DEPRECATED', 'National ID No', 'Case ID', 'Progress ID',
      'Child Name', 'Age', 'Sex', 'Family Size', 'Hospital code and patient number'
    ]

    @bulk_exporter = DuplicateBulkExport.new(
      format: Exporters::DuplicateIdCsvExporter.id,
      record_type: 'case',
      owned_by: @user.user_name
    )
  end

  let(:export_csv) do
    @bulk_exporter.export('XXX')
    exported = @bulk_exporter.exporter.buffer.string
    CSV.parse(exported)
  end

  describe 'find BulkExport' do
    context 'when type is a Duplicate Bulk Export' do
      before do
        @bulk_exporter.save
      end

      it 'returns a DuplicateBulkExport' do
        dupe_bulk_export = BulkExport.find_by(id: @bulk_exporter.id)
        expect(dupe_bulk_export).to be_an_instance_of(DuplicateBulkExport)
        expect(dupe_bulk_export.type).to eq('DuplicateBulkExport')
      end
    end
  end

  context 'when cases have duplicate ids' do
    before do
      create(:child, national_id_no: 'test2', age: 2, name: 'Test Child 3')
      create(:child, national_id_no: 'test3', age: 3, name: 'Test Child 4')
      create(:child, age: 4, name: 'Test Child 5')
      create(:child, age: 5, name: 'Test Child 6')
      @child1 = create(:child, national_id_no: 'test1', age: 5, name: 'Test Child 1')
      @child2 = create(:child, national_id_no: 'test1', age: 6, name: 'Test Child 2')
      Sunspot.commit
    end

    it 'export cases with duplicate ids' do
      expect(export_csv.count).to eq(3)
      expect(export_csv[0]).to eq(@expected_headers)
      expect([export_csv[1][3], export_csv[2][3]]).to include(@child1.case_id, @child2.case_id)
    end

    it 'sort cases by national id in asc order' do
      create(:child, national_id_no: 'test5', age: 3, name: 'Test Child 4')
      create(:child, national_id_no: 'test5', age: 3, name: 'Test Child 4')
      create(:child, national_id_no: 'test3', age: 3, name: 'Test Child 4')
      Sunspot.commit
      expect(export_csv.count).to eq(7)
      ids_orderes = %w[test1 test3 test5]
      export_csv[1..-1].each_with_index do |row, index|
        expect(row[2]).to eq(ids_orderes.first)
        ids_orderes.shift if index.odd?
      end
    end
  end

  context 'when no cases have duplicate ids' do
    before do
      @child1 = create(:child, national_id_no: 'test1', age: 5, name: 'Test Child 1')
      @child2 = create(:child, national_id_no: 'test1111', age: 6, name: 'Test Child 2')
      create(:child, national_id_no: 'test2', age: 2, name: 'Test Child 3')
      create(:child, national_id_no: 'test3', age: 3, name: 'Test Child 4')
      create(:child, age: 4, name: 'Test Child 5')
      create(:child, age: 5, name: 'Test Child 6')
      Sunspot.commit
    end

    it 'exports no cases' do
      expect(export_csv.count).to eq(1)
      expect(export_csv[0]).to eq(@expected_headers)
    end
  end

  context 'when no cases have national_id_no' do
    before do
      @child1 = create(:child, age: 5, name: 'Test Child 1')
      @child2 = create(:child, age: 6, name: 'Test Child 2')
      create(:child, age: 2, name: 'Test Child 3')
      create(:child, age: 3, name: 'Test Child 4')
      create(:child, age: 4, name: 'Test Child 5')
      create(:child, age: 5, name: 'Test Child 6')
      Sunspot.commit
    end

    it 'exports no cases' do
      expect(export_csv.count).to eq(1)
      expect(export_csv[0]).to eq(@expected_headers)
    end
  end

  context 'when no cases found' do
    it 'exports headers' do
      expect(export_csv).to eq(
        [[' ', 'MOHA ID DEPRECATED', 'National ID No', 'Case ID', 'Progress ID',
          'Child Name', 'Age', 'Sex', 'Family Size', 'Hospital code and patient number']]
      )
    end
  end

  after :each do
    clean_data(BulkExport, Agency, Location, UserGroup, Role, User, Field,
               FormSection, Child, PrimeroModule, PrimeroProgram, SystemSettings,
               FormPermission)
  end
end
