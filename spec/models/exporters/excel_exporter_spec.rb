# frozen_string_literal: true

# TODO: There are some rubocop warnings related to double quotes around some of the Arabic text.  Leaving as-is for now

require 'rails_helper'
require 'roo'

module Exporters
  describe ExcelExporter do
    before do
      clean_data(Child, Family, User, Agency, Role, UserGroup, Field, FormSection, PrimeroModule, PrimeroProgram)
      #### Build Form Section with subforms fields only ######
      subform = FormSection.new(name: 'cases_test_subform_2', parent_form: 'case', visible: false, is_nested: true,
                                order_form_group: 2, order: 0, order_subform: 0, form_group_id: 'case_form_3',
                                unique_id: 'cases_test_subform_2')
      subform.fields << Field.new(name: 'field_3', type: Field::TEXT_FIELD, display_name: 'field_3')
      subform.fields << Field.new(name: 'field_4', type: Field::TEXT_FIELD, display_name: 'field_4')
      subform.save!

      form_a = FormSection.new(name: 'cases_test_form_3', parent_form: 'case', visible: true,
                               order_form_group: 2, order: 1, order_subform: 0, form_group_id: 'case_form_3',
                               unique_id: 'cases_test_form_3')

      form_a.fields << Field.new(name: subform.name, type: Field::SUBFORM, display_name: 'subform field',
                                 subform_section_id: subform.id)
      form_a.save!
      #### Build Form Section with subforms fields only ######

      #### Build Form Section with no subforms fields ######
      form_b = FormSection.new(name: 'cases_test_form_2', parent_form: 'case', visible: true,
                               order_form_group: 1, order: 2, order_subform: 0, form_group_id: 'case_form_2',
                               unique_id: 'cases_test_form_2')
      form_b.fields << Field.new(name: 'relationship', type: Field::TEXT_FIELD, display_name: 'relationship')
      form_b.fields << Field.new(name: 'array_field', type: Field::SELECT_BOX, display_name: 'array_field',
                                 multi_select: true,
                                 option_strings_text: [{ id: 'option_1', display_text: 'Option 1' },
                                                       { id: 'option_2',
                                                         display_text: 'Option 2' }].map(&:with_indifferent_access))

      form_b.save!
      #### Build Form Section with none subforms fields ######

      #### Build Form Section with subforms fields and others kind of fields ######
      subform1 = FormSection.new(name: 'cases_test_subform_1', parent_form: 'case', visible: false, is_nested: true,
                                 order_form_group: 0, order: 0, order_subform: 0, form_group_id: 'case_form_1',
                                 unique_id: 'cases_test_subform_1')
      subform1.fields << Field.new(name: 'field_1', type: Field::TEXT_FIELD, display_name: 'field_1')
      subform1.fields << Field.new(name: 'field_2', type: Field::TEXT_FIELD, display_name: 'field_2')
      subform1.save!
      #### Build Form Section with subforms fields only ######
      subform3 = FormSection.new(name: 'cases_test_subform_3', parent_form: 'case', visible: false, is_nested: true,
                                 order_form_group: 0, order: 0, order_subform: 1, form_group_id: 'case_form_1',
                                 unique_id: 'cases_test_subform_3')
      subform3.fields << Field.new(name: 'field_5', type: Field::TEXT_FIELD, display_name: 'field_5')
      subform3.fields << Field.new(name: 'field_6', type: Field::TEXT_FIELD, display_name: 'field_6')
      subform3.save!

      form_c = FormSection.new(name: 'cases_test_form_1', parent_form: 'case', visible: true,
                               order_form_group: 0, order: 3, order_subform: 0, form_group_id: 'case_form_1',
                               unique_id: 'cases_test_form_1')
      form_c.fields << Field.new(name: 'first_name', type: Field::TEXT_FIELD, display_name: 'first_name')
      form_c.fields << Field.new(name: 'last_name', type: Field::TEXT_FIELD, display_name: 'last_name')
      form_c.fields << Field.new(name: 'cases_test_subform_1', type: Field::SUBFORM, display_name: 'subform field',
                                 subform_section_id: subform1.id)
      form_c.fields << Field.new(name: 'cases_test_subform_3', type: Field::SUBFORM, display_name: 'subform 3 field',
                                 subform_section_id: subform3.id)
      form_c.fields << Field.new(name: 'address', type: Field::TEXT_AREA, display_name: 'address')
      form_c.save!
      #### Build Form Section with subforms fields and others kind of fields ######

      #### Build Form Section with Arabic characters in the form name ######
      form_d = FormSection.new(name: 'Test Arabic فاكيا قد به،. بـ حتى', parent_form: 'case', visible: true,
                               order_form_group: 3, order: 4, order_subform: 0, form_group_id: 'form_group_arabic')
      form_d.fields << Field.new(name: 'arabic_text', type: Field::TEXT_FIELD, display_name: 'arabic text')
      form_d.fields << Field.new(name: 'arabic_array', type: Field::SELECT_BOX, display_name: 'arabic array',
                                 multi_select: true,
                                 option_strings_text: [{ id: 'option_1', display_text: 'عقبت 1' },
                                                       { id: 'option_2',
                                                         display_text: 'لدّفاع 2' }].map(&:with_indifferent_access))
      form_d.save!

      subform4 = FormSection.new(name: 'cases_test_subform_4', parent_form: 'case', visible: false, is_nested: true,
                                 order_form_group: 0, order: 0, order_subform: 2, form_group_id: 'case_form_1',
                                 unique_id: 'cases_test_subform_4')
      subform4.fields << Field.new(name: 'field_1', type: Field::TEXT_FIELD, display_name: 'field_1')
      subform4.fields << Field.new(name: 'field_2', type: Field::TEXT_FIELD, display_name: 'field_2')
      subform4.save!

      subform5 = FormSection.new(name: 'cases_test_subform_5', parent_form: 'case', visible: false, is_nested: true,
                                 order_form_group: 0, order: 0, order_subform: 3, form_group_id: 'case_form_1',
                                 unique_id: 'cases_test_subform_5')
      subform5.fields << Field.new(name: 'field_7', type: Field::TEXT_FIELD, display_name: 'field_7')
      subform5.fields << Field.new(name: 'field_8', type: Field::TEXT_FIELD, display_name: 'field_8')
      subform5.save!

      form_e = FormSection.new(name: 'cases_test_form_4', parent_form: 'case', visible: true,
                               order_form_group: 0, order: 5, order_subform: 0, form_group_id: 'case_form_1',
                               unique_id: 'cases_test_form_4')

      form_e.fields << Field.new(name: 'cases_test_subform_4', type: Field::SUBFORM, display_name: 'subform 4 field',
                                 subform_section_id: subform4.id, subform_section_configuration: {
                                   fields: %w[field_2],
                                   display_conditions: [{ field_1: 'some_value' }]
                                 })
      form_e.save!

      form_f = FormSection.new(name: 'case_test_form_5', parent_form: 'case', visible: true,
                               order_form_group: 0, order: 6, order_subform: 0, form_group_id: 'case_form_1',
                               unique_id: 'cases_test_form_5')

      form_f.fields << Field.new(name: 'cases_test_subform_5', type: Field::SUBFORM, display_name: 'subform 5 field',
                                 subform_section_id: subform5.id, subform_section_configuration: {
                                   fields: %w[field_7],
                                   display_conditions: [{ field_7: 'some_value' }]
                                 })
      form_f.save!

      family_details_section = FormSection.new(
        unique_id: 'family_details_section',
        name: 'Nested Family Details',
        parent_form: 'case',
        visible: true,
        is_nested: true,
        fields: [
          Field.new(name: 'relation_name', display_name: 'Name', type: 'text_field', visible: true),
          Field.new(name: 'relation_age', display_name: 'Age', type: 'numeric_field', visible: true),
          Field.new(name: 'relation_sex', display_name: 'Sex', type: 'text_field', visible: true),
          Field.new(name: 'relation', display_name: 'Relation', type: 'text_field', visible: true)
        ]
      )
      family_details_section.save!

      form_h = FormSection.new(
        unique_id: 'family_details',
        name: 'Family Details',
        parent_form: 'case',
        visible: true,
        form_group_id: 'case_form_1',
        order: 7,
        fields: [
          Field.new(name: 'family_number', display_name: 'Family Number', type: 'text_field', visible: true),
          Field.new(name: 'family_size', display_name: 'Family Size', type: 'numeric_field', visible: true),
          Field.new(name: 'family_notes', display_name: 'Family Notes', type: 'text_field', visible: true),
          Field.new(
            name: 'family_details_section',
            display_name_en: 'Family Details',
            type: 'subform',
            editable: true,
            subform_section_id: family_details_section.id,
            visible: true
          )
        ]
      )
      form_h.save!

      @primero_module = create(:primero_module, unique_id: 'primeromodule-cp', name: 'CP')
      @role = create(
        :role, form_sections: [form_a, form_b, form_c, form_d, form_e, form_f, form_h], modules: [@primero_module]
      )
      @user = create(:user, user_name: 'fakeadmin', role: @role)
      @family = Family.create!(
        data: {
          family_number: 'FA-001',
          family_size: 5,
          family_notes: 'FamilyNotes',
          family_members: [
            { unique_id: '001', relation_name: 'FirstName1 LastName1', relation_age: 10, relation_sex: 'male' },
            { unique_id: '002', relation_name: 'FirstName2 LastName2', relation_age: 12, relation_sex: 'female' }
          ]
        }
      )
      @records = [
        create(
          :child, id: '1234', short_id: 'abc123', first_name: 'John', last_name: 'Doe',
          address: 'this is an address', relationship: 'Mother', array_field: %w[option_1 option_2],
          arabic_text: 'لدّفاع', arabic_array: %w[النفط المشتّتون],
          cases_test_subform_1: [{ unique_id: '1', field_1: 'field_1 value', field_2: 'field_2 value' }],
          cases_test_subform_2: [
            { unique_id: '2', field_3: 'field_3 value', field_4: 'field_4 value' },
            { unique_id: '22', field_3: 'field_3 value2', field_4: 'field_4 value2' }
          ],
          cases_test_subform_3: [
            { unique_id: '3', field_5: 'field_5 value', field_6: 'field_6 value' },
            { unique_id: '33', field_5: 'field_5 value2', field_6: 'field_6 value2' },
            { unique_id: '333', field_5: 'field_5 value3', field_6: 'field_6 value3' }
          ],
          cases_test_subform_4: [
            { unique_id: '4', field_1: 'some_value', field_2: 'field_2 value' },
            { unique_id: '44', field_1: 'field_1 value2', field_2: 'field_2 value2' },
            { unique_id: '444', field_1: 'field_1 value3', field_2: 'field_2 value3' }
          ],
          cases_test_subform_5: nil,
          family_details_section: [
            { unique_id: '002', relation: 'relation1', relation_name: 'Detail1', relation_sex: 'male', relation_age: 5 }
          ]
        ),
        Child.create!(
          family: @family,
          data: {
            family_member_id: '001',
            family_number: 'CA-001',
            family_size: 0,
            family_notes: 'CaseNotes',
            first_name: 'FirstName1',
            last_name: 'LastName1',
            age: 10,
            sex: 'male',
            family_details_section: [{ unique_id: '002', relation: 'relation2' }]
          }
        )
      ]
      @record_id = @records.first.short_id
    end

    describe 'Export' do
      let(:workbook) do
        data = ExcelExporter.export(@records, nil, { user: @user })
        Roo::Spreadsheet.open(StringIO.new(data), extension: :xlsx)
      end

      it 'contains a worksheet for each form and subform' do
        expect(workbook.sheets.size).to eq(10)
        expect(workbook.sheets).to match_array(
          [
            'cases_test_form_2', 'cases_test_form_1',
            'Test Arabic فاكيا قد به،. بـ...', 'cases_test_form-cases_test_s...', 'cases_test_form-cases_test_s.-1',
            'cases_test_form-cases_test_s.-2', 'cases_test_form-cases_test_s.-3',
            'case_test_form_-cases_test_s...', 'Family Details', 'Family Details-Nested Family...'
          ]
        )
      end

      it 'prints a header for each form and subform' do
        expect(workbook.sheet(0).row(1)).to eq(%w[ID field_3 field_4])
        expect(workbook.sheet(1).row(1)).to eq(%w[ID relationship array_field])
        expect(workbook.sheet(2).row(1)).to eq(%w[ID first_name last_name address])
        expect(workbook.sheet(3).row(1)).to eq(%w[ID field_1 field_2])
        expect(workbook.sheet(4).row(1)).to eq(%w[ID field_5 field_6])
        expect(workbook.sheet(5).row(1)).to eq(['ID', 'arabic text', 'arabic array'])
        expect(workbook.sheet(6).row(1)).to eq(%w[ID field_2])
        expect(workbook.sheet(7).row(1)).to eq(%w[ID field_7])
      end

      it 'exports record values for regular forms' do
        expect(workbook.sheets[1]).to eq('cases_test_form_2')
        expect(workbook.sheet(1).row(2)).to eq([@record_id, 'Mother', 'Option 1 ||| Option 2'])
        expect(workbook.sheets[2]).to eq('cases_test_form_1')
        expect(workbook.sheet(2).row(2)).to eq([@record_id, 'John', 'Doe', 'this is an address'])
      end

      it 'exports record values for each instance of subforms' do
        expect(workbook.sheet(0).last_row).to eq(4)
        expect(workbook.sheet(0).row(2)).to eq([@records[0].short_id, 'field_3 value', 'field_4 value'])
        expect(workbook.sheet(0).row(3)).to eq([@records[0].short_id, 'field_3 value2', 'field_4 value2'])

        expect(workbook.sheet(3).last_row).to eq(3)
        expect(workbook.sheet(3).row(2)).to eq([@record_id, 'field_1 value', 'field_2 value'])

        expect(workbook.sheet(4).last_row).to eq(5)
        expect(workbook.sheet(4).row(2)).to eq([@record_id, 'field_5 value', 'field_6 value'])
        expect(workbook.sheet(4).row(3)).to eq([@record_id, 'field_5 value2', 'field_6 value2'])
        expect(workbook.sheet(4).row(4)).to eq([@record_id, 'field_5 value3', 'field_6 value3'])
      end

      it 'exports only the record values for each instance of subforms that meets the condition' do
        expect(workbook.sheet(6).last_row).to eq(3)
        expect(workbook.sheet(6).row(2)).to eq([@record_id, 'field_2 value'])
      end

      it 'does not exports data if the conditional subform is empty' do
        expect(workbook.sheets[7]).to eq('case_test_form_-cases_test_s...')
        expect(workbook.sheet(7).last_row).to eq(3)
        expect(workbook.sheet(7).row(2)).to eq([@record_id, nil])
      end

      it 'exports the family global fields' do
        expect(workbook.sheet(8).last_row).to eq(3)
        expect(workbook.sheet(8).row(1)).to eq(['ID', 'Family Number', 'Family Size', 'Family Notes'])
        expect(workbook.sheet(8).row(2)).to eq([@record_id, nil, nil, nil])
        expect(workbook.sheet(8).row(3)).to eq([@records[1].short_id, 'FA-001', 5, 'FamilyNotes'])
      end

      it 'exports the family details section' do
        expect(workbook.sheet(9).last_row).to eq(3)
        expect(workbook.sheet(9).row(1)).to eq(%w[ID Name Age Sex Relation])
        expect(workbook.sheet(9).row(2)).to eq([@records[0].short_id, 'Detail1', 5, 'male', 'relation1'])
        expect(workbook.sheet(9).row(3)).to eq(
          [@records[1].short_id, 'FirstName2 LastName2', 12, 'female', 'relation2']
        )
      end

      context 'when forms name has special characters' do
        before do
          clean_data(Field, FormSection, User, Role, PrimeroModule)
          form1 = FormSection.new(
            name: "Child's Details / Identity / Another / Word", parent_form: 'case', visible: true,
            order_form_group: 2, order: 0, order_subform: 0, form_group_id: 'form_group1',
            unique_id: 'basic_identity'
          )
          form1.fields << Field.new(
            name: 'basic_identity_field_1',
            type: Field::TEXT_FIELD,
            display_name: 'basic_identity field'
          )
          form1.save!

          form2 = FormSection.new(
            name: 'cases_test_form_2', parent_form: 'case', visible: true,
            order_form_group: 1, order: 0, order_subform: 0, form_group_id: 'form_group2',
            unique_id: 'cases_test_form_2'
          )
          form2.fields << Field.new(
            name: 'cases_test_form_2_field_2',
            type: Field::TEXT_FIELD,
            display_name: 'cases_test_form_2 field'
          )
          form2.save!

          create(:primero_module, unique_id: 'primeromodule-cp', name: 'CP', form_sections: [form1, form2])

          exporter = Exporters::FormExporter.new
          exporter.export
          @book = Roo::Spreadsheet.open(exporter.file_name)
        end

        it 'export sheets with correct name' do
          expected_sheets = ['Key', 'Primero Forms', 'cases_test_form_2', "Child's Details   Identity   An", 'lookups']
          expect(@book.sheets).to match_array(expected_sheets)
        end
      end
    end
    after do
      clean_data(Child, User, Agency, Role, UserGroup, Field, FormSection, PrimeroModule, PrimeroProgram)
    end
  end
end
