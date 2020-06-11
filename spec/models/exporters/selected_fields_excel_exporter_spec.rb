# frozen_string_literal: true

require 'rails_helper'
require 'spreadsheet'

describe Exporters::SelectedFieldsExcelExporter do
  before :each do
    clean_data(
      Agency, Role, UserGroup, User, PrimeroProgram,
      Field, FormSection, PrimeroModule, Child
    )
    subform = FormSection.new(
      name: 'cases_test_subform_2', parent_form: 'case', visible: false, is_nested: true,
      order_form_group: 0, order: 0, order_subform: 0, form_group_id: 'cases_test_subform_2',
      unique_id: 'cases_test_subform_2'
    )
    subform.fields << Field.new(name: 'field_3', type: Field::TEXT_FIELD, display_name: 'field_3')
    subform.fields << Field.new(name: 'field_4', type: Field::TEXT_FIELD, display_name: 'field_4')
    subform.save!

    form1 = FormSection.new(
      name: 'cases_test_form_3', parent_form: 'case', visible: true,
      order_form_group: 0, order: 0, order_subform: 0, form_group_id: 'cases_test_form_3',
      unique_id: 'cases_test_form_3'
    )
    form1.fields << Field.new(
      name: 'subform_field_2', type: Field::SUBFORM,
      display_name: 'subform field', subform_section_id: subform.id
    )
    form1.save!

    form2 = FormSection.new(
      name: 'cases_test_form_2', parent_form: 'case', visible: true,
      order_form_group: 0, order: 0, order_subform: 0, form_group_id: 'cases_test_form_2',
      unique_id: 'cases_test_form_2'
    )
    form2.fields << Field.new(name: 'relationship', type: Field::TEXT_FIELD, display_name: 'relationship')
    form2.fields << Field.new(
      name: 'array_field', type: Field::SELECT_BOX, display_name: 'array_field', multi_select: true,
      option_strings_text: [
        { id: 'option1', display_text: 'Option1' }, { id: 'option2', display_text: 'Option2' },
        { id: 'option5', display_text: 'Option5' }, { id: 'option4', display_text: 'Option4' }
      ].map(&:with_indifferent_access)
    )
    form2.save!
    subform = FormSection.new(
      name: 'cases_test_subform_1', parent_form: 'case', visible: false, is_nested: true,
      order_form_group: 0, order: 0, order_subform: 0, form_group_id: 'cases_test_subform_1',
      unique_id: 'cases_test_subform_1'
    )
    subform.fields << Field.new(name: 'field_1', type: Field::TEXT_FIELD, display_name: 'field_1')
    subform.fields << Field.new(name: 'field_2', type: Field::TEXT_FIELD, display_name: 'field_2')
    subform.save!

    form3 = FormSection.new(
      :name => 'cases_test_form_1', :parent_form => 'case', 'visible' => true,
      :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_id => 'cases_test_form_1',
      :unique_id => 'cases_test_form_1'
    )
    form3.fields << Field.new(name: 'first_name', type: Field::TEXT_FIELD, display_name: 'first_name')
    form3.fields << Field.new(name: 'last_name', type: Field::TEXT_FIELD, display_name: 'last_name')
    form3.fields << Field.new(
      name: 'subform_field_1', type: Field::SUBFORM,
      display_name: 'subform field', subform_section_id: subform.id
    )
    form3.save!

    @primero_module = create(
      :primero_module,
      name: 'CP', description: 'Child Protection', associated_record_types: ['case']
    )

    @records = [
      create(
        :child,
        'first_name' => 'John', 'last_name' => 'Doe',
        'id' => '00000000001',
        'relationship' => 'Mother', 'array_field' => %w[option1 option2],
        'subform_field_1' => [
          { 'unique_id' => '1', 'field_1' => 'field_1 value', 'field_2' => 'field_2 value' },
          { 'unique_id' => '11', 'field_1' => 'field_11 value', 'field_2' => 'field_22 value' },
          { 'unique_id' => '12', 'field_1' => 'field_12 value', 'field_2' => 'field_23 value' }
        ],
        'subform_field_2' => [
          { 'unique_id' => '2', 'field_3' => 'field_3 value', 'field_4' => 'field_4 value' },
          { 'unique_id' => '21', 'field_3' => 'field_33 value', 'field_4' => 'field_44 value' }
        ]
      ),
      create(
        :child,
        'first_name' => 'Jane', 'last_name' => 'Doe Doe',
        'id' => '00000000002',
        'relationship' => 'Father', 'array_field' => %w[option4 option5],
        'subform_field_2' => [
          { 'unique_id' => '21', 'field_3' => 'field_31 value', 'field_4' => 'field_41 value' },
          { 'unique_id' => '211', 'field_3' => 'field_331 value', 'field_4' => 'field_441 value' }
        ]
      ),
      create(:child, 'first_name' => 'Jimmy', 'last_name' => 'James', 'id' => '00000000003'),
      create(:child, 'first_name' => 'Timmy', 'last_name' => 'Tom', 'id' => '00000000004'),
      create(
        :child,
        'first_name' => 'Charlie', 'last_name' => 'Sheen', 'id' => '00000000005',
        'subform_field_1' => [{ 'unique_id' => '21' }]
      ),
      create(
        :child,
        'first_name' => 'Emilio', 'last_name' => 'Steves', 'id' => '00000000006',
        'subform_field_1' => [{ 'unique_id' => '99' }], 'subform_field_2' => [{ 'unique_id' => '66' }]
      )
    ]
    # @user = User.new(:user_name => 'fakeadmin', module_ids: ['primeromodule-cp'])
    @role = create(:role, modules: [@primero_module], form_sections: [form1, form2, form3])
    @user = create(:user, user_name: 'fakeadmin', role: @role)
  end

  describe 'Export format' do
    let(:workbook) do
      data = Exporters::SelectedFieldsExcelExporter.export(@records, @user, {})
      Spreadsheet.open(StringIO.new(data))
    end

    it 'contains a metadata worksheet' do
      sheet = workbook.worksheets.last
      headers = sheet.row(0).to_a

      metadata_headers = %w[
        ID created_organization created_by_full_name last_updated_at last_updated_by last_updated_by_full_name
        posted_at unique_identifier record_state hidden_name owned_by_full_name previously_owned_by_full_name
        duplicate duplicate_of
      ]
      expect(headers).to eq(metadata_headers)
      expect(sheet.rows.size).to eq (1 + 6)
    end

    it 'contains a worksheet for every form and nested subform' do
      expect(workbook.worksheets.size).to eq(4 + 1)
      expect(workbook.worksheets[0].row(0).to_a).to eq(%w[ID field_3 field_4])
      expect(workbook.worksheets[1].row(0).to_a).to eq(%w[ID relationship array_field])
      expect(workbook.worksheets[2].row(0).to_a).to eq(%w[ID first_name last_name])
      expect(workbook.worksheets[3].row(0).to_a).to eq(%w[ID field_1 field_2])
    end

    it 'correctly exports record values for a form' do
      expect(workbook.worksheets[0].row(1)).to eq([@records[0].short_id, 'field_3 value', 'field_4 value'])
    end

    it 'correctly exports record values for a subform' do
      expect(workbook.worksheets[1].row(1)).to eq([@records[0].short_id, 'Mother', 'Option1 ||| Option2'])
    end
  end

  context 'Selected forms' do
    let(:workbook) do
      data = Exporters::SelectedFieldsExcelExporter.export(@records, @user, form_unique_ids: %w[cases_test_form_1])
      Spreadsheet.open(StringIO.new(data))
    end

    it 'contains a sheet for the selected form' do
      expect(workbook.worksheets[0].row(0).to_a).to eq(%w[ID first_name last_name])
    end

    it 'contains the sheet for the subform found in the selected form' do
      expect(workbook.worksheets[1].row(0).to_a).to eq(%w[ID field_1 field_2])
    end

    it 'contains no other form but the metadata form' do
      partial_metadata_header = %w[ID created_organization created_by_full_name last_updated_at]
      expect(workbook.worksheets.size).to eq(3)
      expect(workbook.worksheets[2].row(0).to_a[0..3]).to eq(partial_metadata_header)
    end
  end

  context 'Selected fields' do
    let(:workbook) do
      data = Exporters::SelectedFieldsExcelExporter.export(@records, @user, field_names: %w[first_name array_field])
      Spreadsheet.open(StringIO.new(data))
    end

    it 'contains only the Selected Fields form' do
      expect(workbook.worksheets[0].row(0).to_a).to eq(%w[ID first_name array_field])
      expect(workbook.worksheets[0].row(1).to_a).to eq([@records[0].short_id, 'John', 'Option1 ||| Option2'])
    end

    it 'contains no other form but the metadata form' do
      partial_metadata_header = %w[ID created_organization created_by_full_name last_updated_at]
      expect(workbook.worksheets.size).to eq(2)
      expect(workbook.worksheets[1].row(0).to_a[0..3]).to eq(partial_metadata_header)
    end
  end

  context 'Selected forms and fields' do
    let(:workbook) do
      data = Exporters::SelectedFieldsExcelExporter.export(
        @records, @user,
        form_unique_ids: %w[cases_test_form_1],
        field_names: %w[first_name]
      )
      Spreadsheet.open(StringIO.new(data))
    end

    it 'contains a sheet for the selected form with only the selected fields' do
      expect(Field.count).to eq(10)
      expect(workbook.worksheets[0].row(0).to_a).to eq(%w[ID first_name])
      expect(Field.count).to eq(10)
    end

    it 'contains no other form but the metadata form' do
      expect(Field.count).to eq(10)
      partial_metadata_header = %w[ID created_organization created_by_full_name last_updated_at]
      expect(workbook.worksheets.size).to eq(2)
      expect(workbook.worksheets[1].row(0).to_a[0..3]).to eq(partial_metadata_header)
      expect(Field.count).to eq(10)
    end
  end
end
