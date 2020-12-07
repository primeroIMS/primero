# frozen_string_literal: true

require 'rails_helper'
require 'roo'

module Exporters
  describe FormExporter do
    before do
      clean_data(Field, FormSection, PrimeroModule, PrimeroProgram, Lookup)

      #################
      # Build CP Forms
      #################

      #### Build Form Section with subforms fields only ######
      subform = FormSection.new(name: 'cases_test_subform_0', parent_form: 'case', visible: false, is_nested: true,
                                order_form_group: 2, order: 0, order_subform: 0, form_group_id: 'form_group1',
                                unique_id: 'cases_test_subform_0')
      subform.fields << Field.new(name: 'field_3', type: Field::TEXT_FIELD, display_name: 'field_3')
      subform.fields << Field.new(name: 'field_4', type: Field::TEXT_FIELD, display_name: 'field_4')
      subform.save!

      cp_form1 = FormSection.new(name: 'cases_test_form_1', parent_form: 'case', visible: true,
                                 order_form_group: 2, order: 0, order_subform: 0, form_group_id: 'form_group1',
                                 unique_id: 'cases_test_form_1')

      cp_form1.fields << Field.new(name: 'subform_field_1', type: Field::SUBFORM, display_name: 'subform field',
                                   subform_section_id: subform.id)
      cp_form1.save!

      #### Build Form Section with no subforms fields ######
      cp_form2 = FormSection.new(name: 'cases_test_form_2', parent_form: 'case', visible: true,
                                 order_form_group: 1, order: 0, order_subform: 0, form_group_id: 'form_group2',
                                 unique_id: 'cases_test_form_2')
      cp_form2.fields << Field.new(name: 'relationship', type: Field::TEXT_FIELD, display_name: 'relationship')
      cp_form2.fields << Field.new(name: 'array_field', type: Field::SELECT_BOX, display_name: 'array_field',
                                   multi_select: true,
                                   option_strings_text: [{ id: 'option_1', display_text: 'Option 1' },
                                                         { id: 'option_2', display_text: 'Option 2' }])

      cp_form2.save!

      #### Build Form Section with subforms fields and others kind of fields ######
      subform1 = FormSection.new(name: 'cases_test_subform_1', parent_form: 'case', visible: false, is_nested: true,
                                 order_form_group: 0, order: 0, order_subform: 0, form_group_id: 'form_group1',
                                 unique_id: 'cases_test_subform_1')
      subform1.fields << Field.new(name: 'field_1', type: Field::TEXT_FIELD, display_name: 'field_1')
      subform1.fields << Field.new(name: 'field_2', type: Field::TEXT_FIELD, display_name: 'field_2')
      subform1.save!
      subform3 = FormSection.new(name: 'cases_test_subform_3', parent_form: 'case', visible: false, is_nested: true,
                                 order_form_group: 0, order: 0, order_subform: 0, form_group_id: 'form_group1',
                                 unique_id: 'cases_test_subform_3')
      subform3.fields << Field.new(name: 'field_5', type: Field::TEXT_FIELD, display_name: 'field_5')
      subform3.fields << Field.new(name: 'field_6', type: Field::TEXT_FIELD, display_name: 'field_6')
      subform3.save!

      cp_form3 = FormSection.new(name: 'cases_test_form_3', parent_form: 'case', visible: true,
                                 order_form_group: 0, order: 0, order_subform: 0, form_group_id: 'form_group1',
                                 unique_id: 'cases_test_form_3')
      cp_form3.fields << Field.new(name: 'first_name', type: Field::TEXT_FIELD, display_name: 'first_name')
      cp_form3.fields << Field.new(name: 'last_name', type: Field::TEXT_FIELD, display_name: 'last_name')
      cp_form3.fields << Field.new(name: 'subform_field_1', type: Field::SUBFORM, display_name: 'subform field',
                                   subform_section_id: subform1.id)
      cp_form3.fields << Field.new(name: 'subform_field_3', type: Field::SUBFORM, display_name: 'subform 3 field',
                                   subform_section_id: subform3.id)
      cp_form3.save!

      #### Build Hidden Form Section ######
      cp_form_hidden = FormSection.new(name: 'cases_test_form_hidden', parent_form: 'case', visible: false,
                                       order_form_group: 1, order: 0, order_subform: 0, form_group_id: 'form_group2',
                                       unique_id: 'cases_test_form_hidden')
      cp_form_hidden.fields << Field.new(name: 'relationship', type: Field::TEXT_FIELD, display_name: 'relationship')
      cp_form_hidden.fields << Field.new(name: 'array_field', type: Field::SELECT_BOX, display_name: 'array_field',
                                         multi_select: true,
                                         option_strings_text: [{ id: 'option_1', display_text: 'Option 1' },
                                                               { id: 'option_2', display_text: 'Option 2' }])
      cp_form_hidden.save!

      #################
      # Build GBV Forms
      #################

      #### Build Form Section with subforms fields and others kind of fields ######
      subform4 = FormSection.new(name: 'cases_test_subform_4', parent_form: 'case', visible: false, is_nested: true,
                                 order_form_group: 0, order: 0, order_subform: 0, form_group_id: 'form_group_gbv',
                                 unique_id: 'cases_test_subform_4')
      subform4.fields << Field.new(name: 'field_1', type: Field::TEXT_FIELD, display_name: 'field_1')
      subform4.fields << Field.new(name: 'field_2', type: Field::TEXT_FIELD, display_name: 'field_2')
      subform4.save!
      subform5 = FormSection.new(name: 'cases_test_subform_5', parent_form: 'case', visible: false, is_nested: true,
                                 order_form_group: 0, order: 0, order_subform: 0, form_group_id: 'form_group_gbv',
                                 unique_id: 'cases_test_subform_5')
      subform5.fields << Field.new(name: 'field_5', type: Field::TEXT_FIELD, display_name: 'field_5')
      subform5.fields << Field.new(name: 'field_6', type: Field::TEXT_FIELD, display_name: 'field_6')
      subform5.save!

      gbv_form1 = FormSection.new(name: 'cases_test_form_gbv', parent_form: 'case', visible: true,
                                  order_form_group: 0, order: 0, order_subform: 0, form_group_id: 'form_group_gbv',
                                  unique_id: 'cases_test_form_gbv')
      gbv_form1.fields << Field.new(name: 'first_name', type: Field::TEXT_FIELD, display_name: 'first_name')
      gbv_form1.fields << Field.new(name: 'last_name', type: Field::TEXT_FIELD, display_name: 'last_name')
      gbv_form1.fields << Field.new(name: 'subform_field_4', type: Field::SUBFORM, display_name: 'subform 4 field',
                                    subform_section_id: subform4.id)
      gbv_form1.fields << Field.new(name: 'subform_field_5', type: Field::SUBFORM, display_name: 'subform 5 field',
                                    subform_section_id: subform5.id)
      gbv_form1.save!

      cp_forms = FormSection.where(unique_id: %w[cases_test_form_1 cases_test_form_2 cases_test_form_3
                                                 cases_test_form_hidden])
      @primero_module_cp = create(:primero_module, unique_id: 'primeromodule-cp', name: 'CP', form_sections: cp_forms)

      gbv_forms = FormSection.where(unique_id: %w[cases_test_form_gbv])
      @primero_module_gbv = create(:primero_module, unique_id: 'primeromodule-gbv', name: 'GBV',
                                                    form_sections: gbv_forms)

      @lookup_yes_no = Lookup.create!(
        unique_id: 'lookup-yes-no',
        name_i18n: { en: 'Yes / No' },
        lookup_values_i18n: [
          { id: 'true', display_text: { en: 'Yes' } },
          { id: 'false', display_text: { en: 'No' } }
        ]
      )

      @lookup_sex = Lookup.create!(
        unique_id: 'lookup-sex',
        name_i18n: { en: 'Sex' },
        lookup_values_i18n: [
          { id: 'male', display_text: { en: 'Male' } },
          { id: 'female', display_text: { en: 'Female' } }
        ]
      )

      # This is to be used to clean up test .xlsx files created during these tests
      @test_xlsx_files = []
    end

    context 'when no params are passed' do
      before do
        exporter = Exporters::FormExporter.new
        exporter.export
        @book = Roo::Spreadsheet.open(exporter.file_name)

        # This is to be used to clean up test .xlsx files created during these tests
        @test_xlsx_files << exporter.file_name
      end

      it 'exports all visible CP forms' do
        expected_sheets = %w[cases_test_form_3 cases_test_subform_1 cases_test_subform_3 cases_test_form_2
                             cases_test_form_1 cases_test_subform_0 lookups]
        expect(@book.sheets).to match_array(expected_sheets)
      end

      describe 'worksheets' do
        describe 'header' do
          it 'has no visible column' do
            sheet = @book.sheet(@book.sheets.first)

            expect(sheet.row(2)).not_to include('Visible')
          end
        end
      end
    end

    context 'when visible false is passed in' do
      before do
        exporter = Exporters::FormExporter.new(visible: false)
        exporter.export
        @book = Roo::Spreadsheet.open(exporter.file_name)

        # This is to be used to clean up test .xlsx files created during these tests
        @test_xlsx_files << exporter.file_name
      end

      it 'exports all CP forms' do
        expected_sheets = %w[cases_test_form_3 cases_test_subform_1 cases_test_subform_3 cases_test_form_2
                             cases_test_form_1 cases_test_subform_0 cases_test_form_hidden lookups]
        expect(@book.sheets).to match_array(expected_sheets)
      end

      describe 'worksheets' do
        describe 'header' do
          it 'has a visible column' do
            sheet = @book.sheet(@book.sheets.first)

            expect(sheet.row(2)).to include('Visible')
          end
        end
      end
    end

    context 'when GBV module is passed in' do
      before do
        exporter = Exporters::FormExporter.new(module_id: 'primeromodule-gbv')
        exporter.export
        @book = Roo::Spreadsheet.open(exporter.file_name)

        # This is to be used to clean up test .xlsx files created during these tests
        @test_xlsx_files << exporter.file_name
      end

      it 'exports all GBV forms' do
        expected_sheets = %w[cases_test_form_gbv cases_test_subform_5 cases_test_subform_4 lookups]
        expect(@book.sheets).to match_array(expected_sheets)
      end
    end

    context 'when file_name is passed in' do
      context 'and file_name does not have a .xlsx extension' do
        before do
          @exporter = Exporters::FormExporter.new(file_name: 'my_test_file')
        end

        it 'adds .xlsx to the file_name' do
          expect(@exporter.file_name).to eq('my_test_file.xlsx')
        end
      end

      context 'and file_name has a .xlsx extension' do
        before do
          @exporter = Exporters::FormExporter.new(file_name: 'my_test_file.xlsx')
        end

        it 'uses the passed in file_name' do
          expect(@exporter.file_name).to eq('my_test_file.xlsx')
        end
      end

      context 'and file_name has spaces' do
        before do
          @exporter = Exporters::FormExporter.new(file_name: 'my test file.xlsx')
        end

        it 'replaces spaces with underscores' do
          expect(@exporter.file_name).to eq('my_test_file.xlsx')
        end
      end
    end

    after do
      clean_data(Field, FormSection, PrimeroModule, PrimeroProgram, Lookup)

      # Remove test xlsx files
      @test_xlsx_files.each { |test_file| File.delete(test_file) }
    end
  end
end
