# frozen_string_literal: true

require 'rails_helper'

describe FormSection do
  before :each do
    clean_data(Field, FormSection, PrimeroModule, PrimeroProgram, Role, Lookup)

    @lookup = Lookup.create!(
      unique_id: 'lookup-form-group-cp-case',
      name: 'Form Group CP Case',
      lookup_values_en: [
        { id: 'm', display_text: 'M' }.with_indifferent_access,
        { id: 'x', display_text: 'X' }.with_indifferent_access,
        { id: 'y', display_text: 'Y' }.with_indifferent_access,
        { id: 'group_1', display_text: 'Group 1' }.with_indifferent_access
      ]
    )

    @form_section_a = FormSection.create!(unique_id: 'A', name: 'A', parent_form: 'case', form_group_id: 'm')
    @form_section_b = FormSection.create!(unique_id: 'B', name: 'B', parent_form: 'case', form_group_id: 'x')
    @form_section_c = FormSection.create!(unique_id: 'C', name: 'C', parent_form: 'case', form_group_id: 'y')
    @primero_program = PrimeroProgram.create!(unique_id: 'some_program', name_en: 'Some program')
    @primero_module = PrimeroModule.create!(
      primero_program: @primero_program, name: 'Test Module', associated_record_types: ['case'],
      form_sections: [@form_section_a, @form_section_b]
    )
    @permission_case_read = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
    @role = Role.create!(
      form_sections: [@form_section_b, @form_section_c],
      name: 'Test Role', permissions: [@permission_case_read],
      modules: [@primero_module]
    )
    @user = User.new(user_name: 'test_user', role: @role)
  end

  def create_formsection(stubs = {})
    stubs.reverse_merge!(fields: [], editable: true)
    @create_formsection = FormSection.new stubs
    @create_formsection.save
    @create_formsection
  end

  def new_field(fields = {})
    fields.reverse_merge!(name: "name_#{random_string}", display_name: "display_name_#{random_string}")
    Field.new fields
  end

  def random_string(length = 10)
    chars = 'abcdefghjkmnpqrstuvwxyz23456789'
    password = +''
    length.times { password << chars[rand(chars.size)] }
    password
  end

  describe '#unique_id' do
    it 'should be generated when not provided' do
      f = FormSection.create!(name: 'test')
      expect(f.unique_id).to match(/^formsection-test-[0-9a-f]{7}$/)
    end

    it 'should not be generated when provided' do
      f = FormSection.new(unique_id: 'test_form')
      f.unique_id.should == 'test_form'
    end

    it 'should not allow duplicate unique ids' do
      FormSection.new(unique_id: 'test', name: 'test').save!

      expect { FormSection.new(unique_id: 'test').save! }.to raise_error(ActiveRecord::RecordInvalid)

      expect { FormSection.find_by(unique_id: 'test').save! }.to_not raise_error
    end
  end

  describe 'sync_form_group' do
    it 'generates the form group if the form group does not exist' do
      created_form_section = FormSection.create!(
        unique_id: 'new_form_group',
        name: 'New Form Group',
        parent_form: 'case',
        form_group_id: 'New Form Group'
      )

      lookup_form_group = Lookup.find_by(unique_id: 'lookup-form-group-cp-case')

      form_group_value = lookup_form_group.lookup_values.find do |value|
        value['id'] == created_form_section.form_group_id
      end

      expect(form_group_value).not_to be_nil
    end

    it 'does not generate the form group if the form group exists' do
      FormSection.create!(
        unique_id: 'new_form_group', name: 'New Form Group', parent_form: 'case', form_group_id: 'Group 1'
      )

      lookup_form_group = Lookup.find_by(unique_id: 'lookup-form-group-cp-case')

      expect(lookup_form_group.lookup_values.length).to eq(@lookup.lookup_values.length)
    end
  end

  describe 'sync_modules' do
    context 'when a forms modules changes' do
      before do
        @primero_module2 = PrimeroModule.create!(
          primero_program: @primero_program, name: 'Test Module 2', associated_record_types: ['case']
        )

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
      end

      it 'updates the modules of the subform' do
        expect(@form_module_test.primero_modules).to be_empty
        expect(@form_module_test.subforms.map(&:primero_modules).flatten).to be_empty
        @form_module_test.primero_modules = [@primero_module2]
        @form_module_test.save!
        expect(@form_module_test.primero_modules).to include(@primero_module2)
        expect(@form_module_test.subforms.map(&:primero_modules).flatten).to include(@primero_module2)
      end
    end
  end

  describe 'Adding fields' do
    it 'adds the textarea to the formsection' do
      field = build(:field, type: Field::TEXT_AREA)
      formsection = create_formsection(name: 'form_test', fields: [new_field, new_field])
      formsection.fields << field
      formsection.save!
      expect(formsection.fields.length).to eq(3)
      expect(formsection.fields.last).to eq(field)
    end
  end

  describe 'editable' do
    it 'should be editable by default' do
      formsection = FormSection.new
      formsection.editable?.should be_truthy
    end
  end

  describe 'valid?' do
    it 'should validate name is filled in' do
      form_section = FormSection.new
      expect(form_section.valid?).to be_falsey
      expect(form_section.errors[:name_en]).to be_present
    end

    it 'should not allows empty form names in form base_language ' do
      form_section = FormSection.new(name_en: 'English', name_es: 'Chinese')
      I18n.default_locale = 'es'
      expect do
        form_section.name_en = ''
        form_section.save!
      end.to raise_error(ActiveRecord::RecordInvalid, /errors.models.form_section.presence_of_name/)
    end

    it 'should validate name is alpha_num' do
      form_section = FormSection.new(name: 'r@ndom name!')
      form_section.should_not be_valid
      form_section.errors[:name].should be_present
    end

    it 'should not allow name with white spaces only' do
      form_section = FormSection.new(name: '     ')
      form_section.should_not be_valid
      form_section.errors[:name].should be_present
    end

    it 'should allow arabic names' do
      # TODO: for non english name the unique_id generation fail.
      form_section = FormSection.new(name: 'العربية', unique_id: 'test')
      form_section.should be_valid
      form_section.errors[:name].should_not be_present
    end

    it "should occur error about the name can't be blank" do
      form_section = FormSection.new(name: '')
      form_section.should_not be_valid
      form_section.errors[:unique_id].should be_present
    end

    it 'should not trip the unique name validation on self' do
      form_section = FormSection.new(name: 'Unique Name', unique_id: 'unique_name')
      form_section.save!
    end

    context 'when changinging field type' do
      before do
        fields = [
          Field.new(name: 'field_test_field_type_text', type: Field::TEXT_FIELD,
                    display_name_all: 'Field Test Field Type Text'),
          Field.new(name: 'field_test_field_type_textarea', type: Field::TEXT_AREA,
                    display_name_all: 'Field Test Field Type Text Area'),
          Field.new(name: 'field_test_field_type_select_box', type: Field::SELECT_BOX,
                    display_name_all: 'Field Test Field Type select box',
                    option_strings_text_en: [{ 'id' => 'yes', 'display_text' => 'Yes' },
                                             { 'id' => 'no', 'display_text' => 'No' }])
        ]
        @form_field_type_test = FormSection.create(unique_id: 'form_section_test_field_type', parent_form: 'case',
                                                   visible: true, order_form_group: 1, order: 1, order_subform: 0,
                                                   form_group_id: 'm', editable: true, name_all: 'Form Section Test 2',
                                                   description_all: 'Form Section Test 2', fields: fields)
      end

      context 'from text field' do
        before do
          @changing_field = @form_field_type_test.fields.select { |fd| fd.type == Field::TEXT_FIELD }.first
        end

        context 'to textarea field' do
          before do
            @changing_field.type = Field::TEXT_AREA
          end

          it 'is valid' do
            expect(@form_field_type_test).to be_valid
          end
        end
      end

      context 'from textarea field' do
        before do
          @changing_field = @form_field_type_test.fields.select { |fd| fd.type == Field::TEXT_AREA }.first
        end

        context 'to text field' do
          before do
            @changing_field.type = Field::TEXT_FIELD
          end

          it 'is valid' do
            expect(@form_field_type_test).to be_valid
          end
        end
      end
    end
  end

  describe 'Create FormSection Or Add Fields' do
    it 'should create the FormSection if it does not exist' do
      form_section = FormSection.create_or_update!(visible: true, order: 11, unique_id: 'tracing', editable: true,
                                                   name_all: 'Tracing Name', description_all: 'Tracing Description')
      expect(form_section.new_record?).to be_falsey
      expect(form_section.fields.length).to eq(0)
      expect(form_section.visible).to be_truthy
      expect(form_section.order).to eq(11)
      expect(form_section.editable).to be_truthy
      expect(form_section.name).to eq('Tracing Name')
      expect(form_section.description).to eq('Tracing Description')
    end
  end

  describe 'Fields with the same name' do
    before :each do
      subform_fields = [
        Field.new(name: 'field_name_1', type: Field::TEXT_FIELD, display_name_all: 'Field name 1')
      ]
      subform_section = FormSection.new(visible: false, is_nested: true, order_form_group: 1, order: 1,
                                        order_subform: 1, unique_id: 'subform_section_1', parent_form: 'case',
                                        editable: true, fields: subform_fields, initial_subforms: 1,
                                        name_all: 'Nested Subform Section 1',
                                        description_all: 'Details Nested Subform Section 1')
      subform_section.save!

      fields = [
        Field.new(name: 'field_name_2', type: Field::TEXT_FIELD, display_name_all: 'Field Name 2'),
        Field.new(name: 'field_name_3', type: 'subform', editable: true, subform_section_id: subform_section.id,
                  display_name_all: 'Subform Section 1')
      ]
      form = FormSection.new(unique_id: 'form_section_test_1', parent_form: 'case', visible: true, order_form_group: 1,
                             order: 1, order_subform: 0, form_group_id: 'm', editable: true,
                             name_all: 'Form Section Test 1', description_all: 'Form Section Test 1', fields: fields)
      form.save!
    end

    describe 'Create Form Section' do
      it 'should allow fields with the same name on different subforms' do
        # This field exists in a different subforms, but should be possible
        # add with the same name and different type in another subform.
        subform_fields = [
          Field.new(name: 'field_name_1', type: 'textarea', display_name_all: 'Field name 1')
        ]
        subform_section = FormSection.new(visible: false, is_nested: true, order_form_group: 1, order: 1,
                                          order_subform: 1, unique_id: 'subform_section_2', parent_form: 'case',
                                          editable: true, fields: subform_fields, initial_subforms: 1,
                                          name_all: 'Nested Subform Section 2',
                                          description_all: 'Details Nested Subform Section 2')
        subform_section.save

        expect(subform_section.new_record?).to be_falsey
        expect(subform_section.fields.first.errors.messages[:name]).to be_blank
      end
    end

    describe 'Edit Form Section' do
      before :each do
        subform_fields = [
          Field.new(name: 'field_name_5', type: 'textarea', display_name_all: 'Field name 5')
        ]
        @subform_section = FormSection.new(visible: false, is_nested: true, order_form_group: 1, order: 1,
                                           order_subform: 1, unique_id: 'subform_section_3', parent_form: 'case',
                                           editable: true, fields: subform_fields, initial_subforms: 1,
                                           name_all: 'Nested Subform Section 3',
                                           description_all: 'Details Nested Subform Section 3')
        @subform_section.save!

        fields = [
          Field.new(name: 'field_name_4', type: 'textarea', display_name_all: 'Field Name 4'),
          Field.new(name: 'field_name_2', type: Field::TEXT_FIELD, display_name_all: 'Field Name 2')
        ]
        @form = FormSection.new(unique_id: 'form_section_test_2', parent_form: 'case', visible: true,
                                order_form_group: 1, order: 1, order_subform: 0, form_group_id: 'm', editable: true,
                                name_all: 'Form Section Test 2', description_all: 'Form Section Test 2', fields: fields)
        @form.save!
      end

      it 'should not add field with different type' do
        # This field is a text_field in another form.
        @form.fields << Field.new(
          name: 'field_name_2',
          type: Field::SELECT_BOX,
          display_name_all: 'Field Name 2',
          option_strings_text: [
            { id: 'test1', display_text: 'test1' },
            { id: 'test2', display_text: 'test2' },
            { id: 'test3', display_text: 'test3' }
          ]
        )
        expect(@form).to be_invalid
        expect(@form.save).to be_falsey
      end

      it 'should allow fields with the same name on different subforms' do
        field = @subform_section.fields.first
        # Match the name with this field on different subforms
        field.name = 'field_name_1'

        # Save the record and check the status
        expect(@subform_section.save).to be_truthy
        expect(@subform_section.fields.first.errors.messages[:name]).to be_blank
      end
    end
  end

  describe 'update_translations' do
    before do
      [Field, FormSection].each(&:destroy_all)
    end

    describe 'handles bad input data' do
      before do
        @locale = :es
      end
      context 'when locale translations do not exist' do
        before do
          @fields = [
            Field.new(name: 'field_name_1', type: Field::TEXT_FIELD, display_name_all: 'Field Name 1'),
            Field.new(name: 'field_name_2', type: Field::SELECT_BOX, display_name_all: 'Test Select Field',
                      option_strings_text_en: [{ id: 'option_1', display_text: 'Test Option 1' },
                                               { id: 'option_2', display_text: 'Test Option 2' },
                                               { id: 'option_3', display_text: 'Test Option 3' }]
                                                .map(&:with_indifferent_access))
          ]
        end
        context 'and input has all of the options' do
          before do
            FormSection.create_or_update!(unique_id: 'form_t_1', name_en: 'Form One',
                                          description_en: 'Test Form One Description',
                                          help_text_en: 'Form One Help Text', parent_form: 'case', fields: @fields)
            @translated_hash = {
              'form_t_1' => {
                'name' => 'Spanish Form 1 Translated',
                'description' => 'Spanish Form 1 Description Translated',
                'fields' => {
                  'field_name_1' => { 'display_name' => 'Spanish Field Name 1 Translated' },
                  'field_name_2' => {
                    'display_name' => 'Spanish Field Name 2 Translated',
                    'option_strings_text' => {
                      'option_1' => 'Spanish Option One Translated',
                      'option_2' => 'Spanish Option Two Translated',
                      'option_3' => 'Spanish Option Three Translated'
                    }
                  }
                }
              }
            }
            @form_t1 = FormSection.find_by(unique_id: 'form_t_1')
            @form_t1.update_translations(@locale, @translated_hash.values.first)
          end

          it 'adds translated options for the specified locale' do
            expected = [{ 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                        { 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                        { 'id' => 'option_3', 'display_text' => 'Spanish Option Three Translated' }]
            expect(@form_t1.fields.last.option_strings_text_es).to match_array(expected)
          end
        end

        context 'and input has only some of the options' do
          before do
            FormSection.create_or_update!(unique_id: 'form_t_2', name_en: 'Form Two',
                                          description_en: 'Test Form Two Description',
                                          help_text_en: 'Form Two Help Text', parent_form: 'case', fields: @fields)
            @translated_hash = {
              'form_t_2' => {
                'name' => 'Spanish Form 2 Translated',
                'description' => 'Spanish Form 2 Description Translated',
                'fields' => {
                  'field_name_1' => { 'display_name' => 'Spanish Field Name 1 Translated' },
                  'field_name_2' => {
                    'display_name' => 'Spanish Field Name 2 Translated',
                    'option_strings_text' => {
                      'option_1' => 'Spanish Option One Translated',
                      'option_2' => 'Spanish Option Two Translated'
                    }
                  }
                }
              }
            }
            @form_t2 = FormSection.find_by(unique_id: 'form_t_2')
            @form_t2.update_translations(@locale, @translated_hash.values.first)
          end

          it 'only updates the translations passed in' do
            expected = [{ 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                        { 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                        { 'id' => 'option_3', 'display_text' => nil }]
            expect(@form_t2.fields.last.option_strings_text_es).to match_array(expected)
          end
        end

        context 'and input has too many options' do
          before do
            FormSection.create_or_update!(unique_id: 'form_t_3', name_en: 'Form Three',
                                          description_en: 'Test Form Three Description',
                                          help_text_en: 'Form Three Help Text', parent_form: 'case', fields: @fields)
            @translated_hash = {
              'form_t_3' => {
                'name' => 'Spanish Form 3 Translated',
                'description' => 'Spanish Form 3 Description Translated',
                'fields' => {
                  'field_name_1' => { 'display_name' => 'Spanish Field Name 1 Translated' },
                  'field_name_2' => {
                    'display_name' => 'Spanish Field Name 2 Translated',
                    'option_strings_text' => {
                      'option_1' => 'Spanish Option One Translated',
                      'option_2' => 'Spanish Option Two Translated',
                      'option_3' => 'Spanish Option Three Translated',
                      'option_4' => 'Spanish Option Four Translated'
                    }
                  }
                }
              }
            }
            @form_t3 = FormSection.find_by(unique_id: 'form_t_3')
            @form_t3.update_translations(@locale, @translated_hash.values.first)
          end

          it 'adds only the translated options that also exist in the default locale' do
            expected = [{ 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                        { 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                        { 'id' => 'option_3', 'display_text' => 'Spanish Option Three Translated' }]
            expect(@form_t3.fields.last.option_strings_text_es).to match_array(expected)
          end

          it 'does not add an option that does not exist in the default locale' do
            expect(@form_t3.fields.last.option_strings_text_es.map { |os| os['id'] }).not_to include('option_4')
          end
        end

        context 'and input has completely different options' do
          before do
            FormSection.create_or_update!(unique_id: 'form_t_4', name_en: 'Form Four',
                                          description_en: 'Test Form Four Description',
                                          help_text_en: 'Form Four Help Text', parent_form: 'case', fields: @fields)
            @translated_hash = {
              'form_t_4' => {
                'name' => 'Spanish Form 4 Translated',
                'description' => 'Spanish Form 4 Description Translated',
                'fields' => {
                  'field_name_1' => { 'display_name' => 'Spanish Field Name 1 Translated' },
                  'field_name_2' => {
                    'display_name' => 'Spanish Field Name 2 Translated',
                    'option_strings_text' => {
                      'option_4' => 'Spanish Option Four Translated',
                      'option_5' => 'Spanish Option Five Translated',
                      'option_6' => 'Spanish Option Six Translated',
                      'option_7' => 'Spanish Option Seven Translated'
                    }
                  }
                }
              }
            }
            @form_t4 = FormSection.find_by(unique_id: 'form_t_4')
            @form_t4.update_translations(@locale, @translated_hash.values.first)
          end

          it 'does not add any option that does not exist in the default locale' do
            es_keys = @form_t4.fields.last.option_strings_text_es.map { |o| o['id'] }
            expect(es_keys).not_to include('option_4')
            expect(es_keys).not_to include('option_5')
            expect(es_keys).not_to include('option_6')
            expect(es_keys).not_to include('option_7')
          end
        end

        context 'and input has same options in different order' do
          before :each do
            FormSection.create_or_update!(unique_id: 'form_t_5', name_en: 'Form Five',
                                          description_en: 'Test Form Five Description',
                                          help_text_en: 'Form Five Help Text', parent_form: 'case', fields: @fields)
            @translated_hash = {
              'form_t_5' => {
                'name' => 'Spanish Form 5 Translated',
                'description' => 'Spanish Form 5 Description Translated',
                'fields' => {
                  'field_name_1' => { 'display_name' => 'Spanish Field Name 1 Translated' },
                  'field_name_2' => {
                    'display_name' => 'Spanish Field Name 2 Translated',
                    'option_strings_text' => {
                      'option_2' => 'Spanish Option Two Translated',
                      'option_1' => 'Spanish Option One Translated',
                      'option_3' => 'Spanish Option Three Translated'
                    }
                  }
                }
              }
            }
            @form_t5 = FormSection.find_by(unique_id: 'form_t_5')
            @form_t5.update_translations(@locale, @translated_hash.values.first)
          end

          it 'adds translated options for the specified locale' do
            expected = [{ 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                        { 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                        { 'id' => 'option_3', 'display_text' => 'Spanish Option Three Translated' }]
            expect(@form_t5.fields.last.option_strings_text_es).to match_array(expected)
          end
        end
      end

      context 'locale translations do exist' do
        before :each do
          Field.all.each(&:destroy)
          FormSection.all.each(&:destroy)
          @fields = [
            Field.new(name: 'field_name_1', type: Field::TEXT_FIELD, display_name_all: 'Field Name 1'),
            Field.new(name: 'field_name_2', type: Field::SELECT_BOX, display_name_all: 'Test Select Field',
                      option_strings_text_en: [{ id: 'option_1', display_text: 'Test Option 1' },
                                               { id: 'option_2', display_text: 'Test Option 2' },
                                               { id: 'option_3', display_text: 'Test Option 3' }]
                                                .map(&:with_indifferent_access),
                      option_strings_text_es: [{ id: 'option_1', display_text: 'Test Spanish Option 1' },
                                               { id: 'option_2', display_text: 'Test Spanish Option 2' },
                                               { id: 'option_3', display_text: 'Test Spanish Option 3' }]
                                                .map(&:with_indifferent_access))
          ]
        end
        context 'and input has all of the options' do
          before do
            FormSection.create_or_update!(unique_id: 'form_t_10', name_en: 'Form Ten',
                                          description_en: 'Test Form Ten Description',
                                          help_text_en: 'Form Ten Help Text', parent_form: 'case', fields: @fields)
            @translated_hash = {
              'form_t_10' => {
                'name' => 'Spanish Form 10 Translated',
                'description' => 'Spanish Form 10 Description Translated',
                'fields' => {
                  'field_name_1' => { 'display_name' => 'Spanish Field Name 1 Translated' },
                  'field_name_2' => {
                    'display_name' => 'Spanish Field Name 2 Translated',
                    'option_strings_text' => {
                      'option_1' => 'Spanish Option One Translated',
                      'option_2' => 'Spanish Option Two Translated',
                      'option_3' => 'Spanish Option Three Translated'
                    }
                  }
                }
              }
            }
            @form_t10 = FormSection.find_by(unique_id: 'form_t_10')
            @form_t10.update_translations(@locale, @translated_hash.values.first)
          end

          it 'adds translated options for the specified locale' do
            expected = [{ 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                        { 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                        { 'id' => 'option_3', 'display_text' => 'Spanish Option Three Translated' }]
            expect(@form_t10.fields.last.option_strings_text_es).to match_array(expected)
          end
        end

        context 'and input has only some of the options' do
          before do
            FormSection.create_or_update!(unique_id: 'form_t_11', name_en: 'Form Eleven',
                                          description_en: 'Test Form Eleven Description',
                                          help_text_en: 'Form Eleven Help Text', parent_form: 'case', fields: @fields)
            @translated_hash = {
              'form_t_11' => {
                'name' => 'Spanish Form 11 Translated',
                'description' => 'Spanish Form 11 Description Translated',
                'fields' => {
                  'field_name_1' => { 'display_name' => 'Spanish Field Name 1 Translated' },
                  'field_name_2' => {
                    'display_name' => 'Spanish Field Name 2 Translated',
                    'option_strings_text' => {
                      'option_1' => 'Spanish Option One Translated',
                      'option_2' => 'Spanish Option Two Translated'
                    }
                  }
                }
              }
            }
            @form_t11 = FormSection.find_by(unique_id: 'form_t_11')
            @form_t11.update_translations(@locale, @translated_hash.values.first)
          end

          it 'updates only the translated options provided for the specified locale' do
            expected = [{ 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                        { 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                        { 'id' => 'option_3', 'display_text' => 'Test Spanish Option 3' }]
            expect(@form_t11.fields.last.option_strings_text_es).to match_array(expected)
          end
        end

        context 'and input has too many options' do
          before do
            FormSection.create_or_update!(unique_id: 'form_t_12', name_en: 'Form Twelve',
                                          description_en: 'Test Form Twelve Description',
                                          help_text_en: 'Form Twelve Help Text', parent_form: 'case', fields: @fields)
            @translated_hash = {
              'form_t_12' => {
                'name' => 'Spanish Form 12 Translated',
                'description' => 'Spanish Form 12 Description Translated',
                'fields' => {
                  'field_name_1' => { 'display_name' => 'Spanish Field Name 1 Translated' },
                  'field_name_2' => {
                    'display_name' => 'Spanish Field Name 2 Translated',
                    'option_strings_text' => {
                      'option_1' => 'Spanish Option One Translated',
                      'option_2' => 'Spanish Option Two Translated',
                      'option_3' => 'Spanish Option Three Translated',
                      'option_4' => 'Spanish Option Four Translated'
                    }
                  }
                }
              }
            }
            @form_t12 = FormSection.find_by(unique_id: 'form_t_12')
            @form_t12.update_translations(@locale, @translated_hash.values.first)
          end

          it 'adds only the translated options that also exist in the default locale' do
            expected = [{ 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                        { 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                        { 'id' => 'option_3', 'display_text' => 'Spanish Option Three Translated' }]
            expect(@form_t12.fields.last.option_strings_text_es).to match_array(expected)
          end

          it 'does not add an option that does not exist in the default locale' do
            expect(@form_t12.fields.last.option_strings_text_es.map { |os| os['id'] }).not_to include('option_4')
          end
        end

        context 'and input has completely different options' do
          before do
            FormSection.create_or_update!(unique_id: 'form_t_13', name_en: 'Form Thirteen',
                                          description_en: 'Test Form Thirteen Description',
                                          help_text_en: 'Form Thirteen Help Text', parent_form: 'case', fields: @fields)
            @translated_hash = {
              'form_t_13' => {
                'name' => 'Spanish Form 13 Translated',
                'description' => 'Spanish Form 13 Description Translated',
                'fields' => {
                  'field_name_1' => { 'display_name' => 'Spanish Field Name 1 Translated' },
                  'field_name_2' => {
                    'display_name' => 'Spanish Field Name 2 Translated',
                    'option_strings_text' => {
                      'option_4' => 'Spanish Option Four Translated',
                      'option_5' => 'Spanish Option Five Translated',
                      'option_6' => 'Spanish Option Six Translated',
                      'option_7' => 'Spanish Option Seven Translated'
                    }
                  }
                }
              }
            }
            @form_t13 = FormSection.find_by(unique_id: 'form_t_13')
            @form_t13.update_translations(@locale, @translated_hash.values.first)
          end

          it 'does not add any option that does not exist in the default locale' do
            expected = [{ 'id' => 'option_1', 'display_text' => 'Test Spanish Option 1' },
                        { 'id' => 'option_2', 'display_text' => 'Test Spanish Option 2' },
                        { 'id' => 'option_3', 'display_text' => 'Test Spanish Option 3' }]
            expect(@form_t13.fields.last.option_strings_text_es).to match_array(expected)
          end
        end

        context 'and input has same options in different order' do
          before do
            FormSection.create_or_update!(unique_id: 'form_t_14', name_en: 'Form Fourteen',
                                          description_en: 'Test Form Fourteen Description',
                                          help_text_en: 'Form Fourteen Help Text', parent_form: 'case', fields: @fields)
            @translated_hash = {
              'form_t_14' => {
                'name' => 'Spanish Form 14 Translated',
                'description' => 'Spanish Form 14 Description Translated',
                'fields' => {
                  'field_name_1' => { 'display_name' => 'Spanish Field Name 1 Translated' },
                  'field_name_2' => {
                    'display_name' => 'Spanish Field Name 2 Translated',
                    'option_strings_text' => {
                      'option_2' => 'Spanish Option Two Translated',
                      'option_1' => 'Spanish Option One Translated',
                      'option_3' => 'Spanish Option Three Translated'
                    }
                  }
                }
              }
            }
            @form_t14 = FormSection.find_by(unique_id: 'form_t_14')
            @form_t14.update_translations(@locale, @translated_hash.values.first)
          end

          it 'adds translated options for the specified locale' do
            expected = [{ 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                        { 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                        { 'id' => 'option_3', 'display_text' => 'Spanish Option Three Translated' }]
            expect(@form_t14.fields.last.option_strings_text_es).to match_array(expected)
          end
        end
      end
    end
  end

  describe 'ConfigurationRecord' do
    let(:form1) { FormSection.create!(unique_id: 'A', name: 'A', parent_form: 'case', form_group_id: 'm') }
    let(:field1) do
      Field.create!(name: 'test', display_name: 'test', type: Field::TEXT_FIELD, form_section_id: form1.id)
    end
    let(:subform) do
      FormSection.create!(unique_id: 'B', name: 'B', parent_form: 'case', form_group_id: 'm', is_nested: true)
    end
    let(:field_on_subform) do
      Field.create!(
        name: 'test2', type: Field::TEXT_FIELD, form_section_id: subform.id, display_name: 'test',
        collapsed_field_for_subform_section_id: subform.id
      )
    end
    let(:subform_field) do
      Field.create!(
        name: 'test3', type: Field::SUBFORM, form_section_id: form1.id,
        subform_section_id: subform.id, display_name: 'test'
      )
    end
    let(:module1) do
      PrimeroModule.create!(
        unique_id: 'primeromodule-cp-a',
        name: 'CPA',
        description: 'Child Protection A',
        associated_record_types: %w[case tracing_request incident],
        form_sections: [form1]
      )
    end
    before(:each) do
      clean_data(Field, FormSection, PrimeroModule)
      form1 && field1 && subform && field_on_subform && subform_field && module1 && form1.reload
    end

    describe '#configuration_hash' do
      it 'returns the configuration hash' do
        configuration_hash = form1.configuration_hash
        expect(configuration_hash['id']).to be_nil
        expect(configuration_hash['name']).to be_nil
        expect(configuration_hash['name_i18n']['en']).to eq(form1.name)
        expect(configuration_hash['module_ids']).to eq([module1.unique_id])
        expect(configuration_hash['fields_attributes'].size).to eq(2)
        expect(configuration_hash['fields_attributes'].map { |f| f['name'] }).to match_array(
          [field1.name, subform_field.name]
        )
      end
    end

    describe '.create_or_update!' do
      it 'creates a new form and fields from a configuration hash' do
        configuration_hash = {
          'unique_id' => 'AB',
          'name_i18n' => { 'en' => 'AB' },
          'fields_attributes' => [
            { 'name' => 'test', 'type' => 'text_field', 'display_name' => { 'en' => 'test' } }
          ],
          'module_ids' => ['primeromodule-cp-a']
        }
        new_form = FormSection.create_or_update!(configuration_hash)
        new_configuration_hash = new_form.configuration_hash
        expect(new_configuration_hash['unique_id']).to eq(configuration_hash['unique_id'])
        expect(new_configuration_hash['name_i18n']).to eq(configuration_hash['name_i18n'])
        expect(new_configuration_hash['fields_attributes'].size).to eq(1)
        expect(new_configuration_hash['fields_attributes'][0]['name']).to eq(
          configuration_hash['fields_attributes'][0]['name']
        )
        expect(new_configuration_hash['fields_attributes'][0]['type']).to eq(
          configuration_hash['fields_attributes'][0]['type']
        )
        expect(new_configuration_hash['module_ids']).to eq(configuration_hash['module_ids'])
        expect(new_form.id).not_to eq(form1.id)
      end

      it 'updates an existing form from a configuration hash' do
        configuration_hash = {
          'unique_id' => 'A',
          'name_i18n' => { 'en' => 'AB' },
          'fields_attributes' => [
            { 'name' => 'test', 'type' => 'text_field', 'display_name' => { 'en' => 'test' } }
          ],
          'module_ids' => ['primeromodule-cp-a']
        }
        form2 = FormSection.create_or_update!(configuration_hash)
        new_configuration_hash = form2.configuration_hash
        expect(form2.id).to eq(form1.id)
        expect(form2.name('en')).to eq('AB')
        expect(new_configuration_hash['fields_attributes'].size).to eq(1)
        expect(new_configuration_hash['fields_attributes'][0]['name']).to eq(
          configuration_hash['fields_attributes'][0]['name']
        )
        expect(new_configuration_hash['fields_attributes'][0]['type']).to eq(
          configuration_hash['fields_attributes'][0]['type']
        )
      end
    end
  end

  describe 'list' do
    let(:form1) { FormSection.create!(unique_id: 'A', name: 'A', parent_form: 'case', form_group_id: 'm') }
    let(:field1) do
      Field.create!(name: 'test', display_name: 'test', type: Field::TEXT_FIELD, form_section_id: form1.id)
    end
    let(:form2) { FormSection.create!(unique_id: 'B', name: 'B', parent_form: 'case', form_group_id: 'm') }
    let(:field2) do
      Field.create!(name: 'test', display_name: 'test', type: Field::TEXT_FIELD, form_section_id: form2.id)
    end
    let(:subform) do
      FormSection.create!(unique_id: 'SUB_A', name: 'SUB A', parent_form: 'case', form_group_id: 'm', is_nested: true)
    end
    let(:field_on_subform) do
      Field.create!(
        name: 'test2', type: Field::TEXT_FIELD, form_section_id: subform.id, display_name: 'test',
        collapsed_field_for_subform_section_id: subform.id
      )
    end
    let(:subform_field) do
      Field.create!(
        name: 'test3', type: Field::SUBFORM, form_section_id: form1.id,
        subform_section_id: subform.id, display_name: 'test'
      )
    end
    let(:module1) do
      PrimeroModule.create!(
        unique_id: 'primeromodule-cp-a',
        name: 'CPA',
        description: 'Child Protection A',
        associated_record_types: %w[case tracing_request incident],
        form_sections: [form1, form2]
      )
    end
    before do
      clean_data(Field, FormSection, PrimeroModule)
      form1 && field1 && form2 && field2 && subform && field_on_subform && subform_field && module1 && form1.reload && form2.reload
    end

    context 'when exclude_subforms is true' do
      before do
        @form_params = { module_id: 'primeromodule-cp-a', record_type: 'case', visible: true, exclude_subforms: true }
      end
      it 'returns forms without subforms' do
        expected = [form1, form2]
        expect(FormSection.list(@form_params)).to match_array(expected)
      end
    end

    context 'when exclude_subforms is false' do
      before do
        @form_params = { module_id: 'primeromodule-cp-a', record_type: 'case', visible: true, exclude_subforms: false }
      end
      it 'returns forms with subforms' do
        expected = [form1, form2, subform]
        expect(FormSection.list(@form_params)).to match_array(expected)
      end
    end
  end

  describe 'new_with_properties' do
    it 'assigns the role of the user to the form' do
      fields = [
        Field.new(name: 'field_name_99', type: 'textarea', display_name_all: 'Field Name 99'),
        Field.new(name: 'field_name_98', type: Field::TEXT_FIELD, display_name_all: 'Field Name 98')
      ]
      form_params = { unique_id: 'form_section_test_role', parent_form: 'case', visible: true,
                      order_form_group: 1, order: 99, order_subform: 0, form_group_id: 'm', editable: true,
                      name_all: 'Form Section Test Role', description_all: 'Form Section Test Role', fields: fields }
      form = FormSection.new_with_properties(form_params, user: @user)
      expect(form.roles).to match_array([@user.role])

      form.save
      r2 = Role.where(id: @role.id).first
      expect(r2.form_sections).to include(form)
    end
  end

  describe 'touch_roles' do
    before do
      clean_data(Field, FormSection, PrimeroModule, PrimeroProgram, Role)

      @child_form = FormSection.create!(
        unique_id: 'child_form',
        name: 'Child Form',
        parent_form: 'case',
        form_group_id: 'main',
        is_nested: true
      )
      @parent_form = FormSection.create!(
        unique_id: 'main_form',
        name: 'Main Form',
        parent_form: 'case',
        form_group_id: 'main',
        fields: [
          Field.new(name: 'field_1', type: Field::SUBFORM, display_name_all: 'Field 1', subform_section: @child_form)
        ]
      )
      @parent_form_program = PrimeroProgram.create!(unique_id: 'parent_form_program', name_en: 'Parent Form program')
      @parent_form_module = PrimeroModule.create!(
        primero_program: @parent_form_program,
        name: 'Parent Form Module',
        associated_record_types: ['case'],
        form_sections: [@parent_form]
      )
      @parent_form_permission_case_read = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
      @parent_form_role = Role.create!(
        form_sections: [@parent_form],
        name: 'Parent Form Role',
        permissions: [@parent_form_permission_case_read],
        modules: [@parent_form_module]
      )
    end

    it 'should touch the roles of a parent form if a field is added' do
      updated_at = @parent_form_role.updated_at

      @parent_form.fields.push(
        Field.new(name: 'field_2', type: Field::TEXT_FIELD, display_name_all: 'Field 2')
      )
      @parent_form.save!

      @parent_form_role.reload

      expect(@parent_form_role.updated_at > updated_at).to be_truthy
    end

    it 'should touch the roles of the parent form if a field is added to a subform' do
      updated_at = @parent_form_role.updated_at

      @child_form.fields.push(
        Field.new(name: 'field_3', type: Field::TEXT_FIELD, display_name_all: 'Field 3')
      )
      @child_form.save!

      @parent_form_role.reload

      expect(@parent_form_role.updated_at > updated_at).to be_truthy
    end
  end

  describe '#insert_field!' do
    before(:each) do
      @form_section_a.fields = [
        Field.new(name: 'foo', type: 'text_field',display_name_en: 'Foo', order: 1),
        Field.new(name: 'bar', type: 'text_field',display_name_en: 'Foo', order: 2),
        Field.new(name: 'test', type: 'text_field',display_name_en: 'Foo', order: 3)
      ]
    end

    it 'insert at specified order when this one is specified' do
      new_field = Field.new(name: 'second_test', type: 'text_field',display_name_en: 'Foo', order: 2)
      @form_section_a.insert_field!(new_field)
      fields_new_order = FormSection.find_by(unique_id: 'A').fields

      expect(Field.find_by(name: 'second_test').order).to eq(2)
      expect(fields_new_order.last.name).to eq('test')
      expect(fields_new_order.last.order).to eq(4)
    end

    it 'insert at the end when order is not specified' do
      new_field = Field.new(name: 'third_test', type: 'text_field',display_name_en: 'Foo')
      @form_section_a.insert_field!(new_field)

      expect(FormSection.find_by(unique_id: 'A').fields.last.name).to eq(new_field.name)
    end
  end

  describe '#field_exists?' do

    before(:each) do
      @form_section_a.fields << Field.new(name: 'foo', type: 'text_field',display_name_en: 'Foo', order: 5)
    end

    it 'return true when field exist' do
      expect(@form_section_a.field_exists?('foo')).to be_truthy
    end

    it 'return false when field do not exist' do
      expect(@form_section_a.field_exists?('bar')).to be_falsey
    end
  end

  after do
    clean_data(Field, FormSection, PrimeroModule, PrimeroProgram, Role, Lookup)
  end
end
