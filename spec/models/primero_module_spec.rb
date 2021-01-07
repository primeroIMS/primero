# frozen_string_literal: true

require 'rails_helper'

describe PrimeroModule do
  before do
    clean_data(Field, FormSection, PrimeroModule, PrimeroProgram)
  end

  it 'should not be valid if name is empty' do
    primero_module = PrimeroModule.new
    primero_module.should_not be_valid
    primero_module.errors[:name].should == ['Name must not be blank']
  end

  it 'should not be valid if a module name has been taken already' do
    create(:primero_module, name: 'Unique')
    primero_module = build(:primero_module, name: 'Unique')
    primero_module.should_not be_valid
    expect(primero_module.errors[:name]).to be
  end

  it 'should not be valid if it assigned record types are missing' do
    primero_module = PrimeroModule.new
    primero_module.should_not be_valid
    expect(primero_module.errors[:associated_record_types]).to be
  end

  it 'should generate id' do
    primero_module = create(:primero_module, name: 'test module 1234')
    primero_module.unique_id.should == 'primeromodule-test-module-1234'
  end

  describe 'associated forms' do
    before do
      @form_section_a = FormSection.create!(unique_id: 'A', name: 'A', parent_form: 'case', form_group_id: 'm')
      @form_section_b = FormSection.create!(unique_id: 'B', name: 'B', parent_form: 'case', form_group_id: 'x')
      @form_section_c = FormSection.create!(unique_id: 'C', name: 'C', parent_form: 'case', form_group_id: 'y')

      subform_fields = [
        Field.new(name: 'field_name_1', type: Field::TEXT_FIELD, display_name_all: 'Field name 1')
      ]
      @subform_module_test = FormSection.new(visible: false, is_nested: true, order_form_group: 1, order: 1,
                                             order_subform: 1, unique_id: 'subform_module_test', parent_form: 'case',
                                             editable: true, fields: subform_fields, initial_subforms: 1,
                                             name_all: 'Nested Subform Section Module Test',
                                             description_all: 'Details Nested Subform Section module_test')
      @subform_module_test.save!

      fields = [
        Field.new(name: 'field_name_2', type: Field::TEXT_FIELD, display_name_all: 'Field Name 2'),
        Field.new(name: 'field_name_3', type: 'subform', editable: true, subform_section_id: @subform_module_test.id,
                  display_name_all: 'Subform Section Module Test')
      ]
      @form_module_test = FormSection.new(unique_id: 'form_module_test', parent_form: 'case', visible: true,
                                          order_form_group: 1, order: 1, order_subform: 0, form_group_id: 'm',
                                          editable: true, name_all: 'Form Module Test',
                                          description_all: 'Form Module Test', fields: fields)
      @form_module_test.save!

      @primero_program = PrimeroProgram.create!(unique_id: 'some_program', name_en: 'Some program')
      @primero_module = PrimeroModule.create!(
        primero_program: @primero_program, name: 'Test Module', associated_record_types: ['case']
      )
    end

    context 'when a modules forms changes' do
      it 'updates the subforms' do
        @primero_module.form_sections = [@form_section_a, @form_section_b, @form_module_test]
        @primero_module.save!

        expected = [@form_section_a, @form_section_b, @form_module_test, @subform_module_test]
        expect(@primero_module.form_sections).to match_array(expected)
      end
    end
  end

  after do
    clean_data(Field, FormSection, PrimeroModule, PrimeroProgram)
  end
end
