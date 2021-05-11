# frozen_string_literal: true

# TODO: There are some rubocop warnings related to double quotes around some of the Arabic text.  Leaving as-is for now

require 'rails_helper'
require 'roo'

module Exporters
  describe ExcelExporter do
    before :each do
      clean_data(Child, Role, UserGroup, User, Agency, Field, FormSection, PrimeroProgram, PrimeroModule)
      #### Build Form Section with subforms fields only ######
      subform = FormSection.new(name: 'cases_test_subform_2', parent_form: 'case', visible: false, is_nested: true,
                                order_form_group: 2, order: 0, order_subform: 0, form_group_id: 'Case Form 3',
                                unique_id: 'cases_test_subform_2')
      subform.fields << Field.new(name: 'field_3', type: Field::TEXT_FIELD, display_name: 'field_3')
      subform.fields << Field.new(name: 'field_4', type: Field::TEXT_FIELD, display_name: 'field_4')
      subform.save!

      form_a = FormSection.new(name: 'cases_test_form_3', parent_form: 'case', visible: true,
                               order_form_group: 2, order: 0, order_subform: 0, form_group_id: 'Case Form 3',
                               unique_id: 'cases_test_form_3')

      form_a.fields << Field.new(name: subform.name, type: Field::SUBFORM, display_name: 'subform field',
                                 subform_section_id: subform.id)
      form_a.save!
      #### Build Form Section with subforms fields only ######

      #### Build Form Section with no subforms fields ######
      form_b = FormSection.new(name: 'cases_test_form_2', parent_form: 'case', visible: true,
                               order_form_group: 1, order: 0, order_subform: 0, form_group_id: 'Case Form 2',
                               unique_id: 'cases_test_form_2')
      form_b.fields << Field.new(name: 'relationship', type: Field::TEXT_FIELD, display_name: 'relationship')
      form_b.fields << Field.new(name: 'array_field', type: Field::SELECT_BOX, display_name: 'array_field',
                                 multi_select: true,
                                 option_strings_text: [{ id: 'option_1', display_text: 'Option 1' },
                                                       { id: 'option_2', display_text: 'Option 2' }].map(&:with_indifferent_access))

      form_b.save!
      #### Build Form Section with none subforms fields ######

      #### Build Form Section with subforms fields and others kind of fields ######
      subform1 = FormSection.new(name: 'cases_test_subform_1', parent_form: 'case', visible: false, is_nested: true,
                                 order_form_group: 0, order: 0, order_subform: 0, form_group_id: 'Case Form 1',
                                 unique_id: 'cases_test_subform_1')
      subform1.fields << Field.new(name: 'field_1', type: Field::TEXT_FIELD, display_name: 'field_1')
      subform1.fields << Field.new(name: 'field_2', type: Field::TEXT_FIELD, display_name: 'field_2')
      subform1.save!
      #### Build Form Section with subforms fields only ######
      subform3 = FormSection.new(name: 'cases_test_subform_3', parent_form: 'case', visible: false, is_nested: true,
                                 order_form_group: 0, order: 0, order_subform: 0, form_group_id: 'Case Form 1',
                                 unique_id: 'cases_test_subform_3')
      subform3.fields << Field.new(name: 'field_5', type: Field::TEXT_FIELD, display_name: 'field_5')
      subform3.fields << Field.new(name: 'field_6', type: Field::TEXT_FIELD, display_name: 'field_6')
      subform3.save!

      form_c = FormSection.new(name: 'cases_test_form_1', parent_form: 'case', visible: true,
                               order_form_group: 0, order: 0, order_subform: 0, form_group_id: 'Case Form 1',
                               unique_id: 'cases_test_form_1')
      form_c.fields << Field.new(name: 'first_name', type: Field::TEXT_FIELD, display_name: 'first_name')
      form_c.fields << Field.new(name: 'last_name', type: Field::TEXT_FIELD, display_name: 'last_name')
      form_c.fields << Field.new(name: 'cases_test_subform_1', type: Field::SUBFORM, display_name: 'subform field',
                                 subform_section_id: subform1.id)
      form_c.fields << Field.new(name: 'cases_test_subform_3', type: Field::SUBFORM, display_name: 'subform 3 field',
                                 subform_section_id: subform3.id)
      form_c.save!
      #### Build Form Section with subforms fields and others kind of fields ######

      #### Build Form Section with Arabic characters in the form name ######
      form_d = FormSection.new(name: "Test Arabic فاكيا قد به،. بـ حتى", parent_form: 'case', visible: true,
                               order_form_group: 3, order: 3, order_subform: 0, form_group_id: 'Test Arabic')
      form_d.fields << Field.new(name: 'arabic_text', type: Field::TEXT_FIELD, display_name: 'arabic text')
      form_d.fields << Field.new(name: 'arabic_array', type: Field::SELECT_BOX, display_name: 'arabic array',
                                 multi_select: true,
                                 option_strings_text: [{ id: 'option_1', display_text: "عقبت 1" },
                                                       { id: 'option_2', display_text: "لدّفاع 2" }].map(&:with_indifferent_access))
      form_d.save!

      @primero_module = create(:primero_module, unique_id: 'primeromodule-cp', name: 'CP')
      @role = create(:role, form_sections: [form_a, form_b, form_c, form_d], modules: [@primero_module])
      @user = create(:user, user_name: 'fakeadmin', role: @role)
      @records = [create(:child, id: '1234', short_id: 'abc123', first_name: 'John', last_name: 'Doe',
                                 relationship: 'Mother', array_field: %w[option_1 option_2],
                                 arabic_text: "لدّفاع", arabic_array: ["النفط", "المشتّتون"],
                                 cases_test_subform_1: [
                                   { unique_id: '1', field_1: 'field_1 value', field_2: 'field_2 value' }
                                 ],
                                 cases_test_subform_2: [
                                   { unique_id: '2', field_3: 'field_3 value', field_4: 'field_4 value' },
                                   { unique_id: '22', field_3: 'field_3 value2', field_4: 'field_4 value2' }
                                 ],
                                 cases_test_subform_3: [
                                   { unique_id: '3', field_5: 'field_5 value', field_6: 'field_6 value' },
                                   { unique_id: '33', field_5: 'field_5 value2', field_6: 'field_6 value2' },
                                   { unique_id: '333', field_5: 'field_5 value3', field_6: 'field_6 value3' }
                                 ])]
      @record_id = Child.last.short_id
    end

    describe 'Export' do
      let(:workbook) do
        data = ExcelExporter.export(@records, @user)
        Roo::Spreadsheet.open(StringIO.new(data), extension: :xlsx)
      end

      it 'contains a worksheet for each form and subform' do
        expect(workbook.sheets.size).to eq(6)
        expect(workbook.sheets).to match_array(['cases_test_subform_2', 'cases_test_form_2', 'cases_test_form_1',
                                                'cases_test_subform_1', 'cases_test_subform_3', 'Test Arabic   .'])
      end

      it 'prints a header for each form and subform' do
        expect(workbook.sheet(0).row(1)).to eq(%w[ID field_3 field_4])
        expect(workbook.sheet(1).row(1)).to eq(%w[ID relationship array_field])
        expect(workbook.sheet(2).row(1)).to eq(%w[ID first_name last_name])
        expect(workbook.sheet(3).row(1)).to eq(%w[ID field_1 field_2])
        expect(workbook.sheet(4).row(1)).to eq(%w[ID field_5 field_6])
        expect(workbook.sheet(5).row(1)).to eq(['ID', 'arabic text', 'arabic array'])
      end

      it 'exports record values for regular forms' do
        expect(workbook.sheet(1).row(2)).to eq([@record_id, 'Mother', 'Option 1 ||| Option 2'])
        expect(workbook.sheet(2).row(2)).to eq([@record_id, 'John', 'Doe'])
      end

      it 'exports record values for each instance of subforms' do
        expect(workbook.sheet(0).last_row).to eq(3)
        expect(workbook.sheet(0).row(2)).to eq([@records[0].short_id, 'field_3 value', 'field_4 value'])
        expect(workbook.sheet(0).row(3)).to eq([@records[0].short_id, 'field_3 value2', 'field_4 value2'])

        expect(workbook.sheet(3).last_row).to eq(2)
        expect(workbook.sheet(3).row(2)).to eq([@record_id, 'field_1 value', 'field_2 value'])

        expect(workbook.sheet(4).last_row).to eq(4)
        expect(workbook.sheet(4).row(2)).to eq([@record_id, 'field_5 value', 'field_6 value'])
        expect(workbook.sheet(4).row(3)).to eq([@record_id, 'field_5 value2', 'field_6 value2'])
        expect(workbook.sheet(4).row(4)).to eq([@record_id, 'field_5 value3', 'field_6 value3'])
      end
    end
  end
end
