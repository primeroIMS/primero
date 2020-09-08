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
        { id: 'y', display_text: 'Y' }.with_indifferent_access
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
    password = ''.dup
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
          Field.new(
            'name' => 'field_test_field_type_text',
            'type' => Field::TEXT_FIELD,
            'display_name_all' => 'Field Test Field Type Text'
          ),
          Field.new(
            'name' => 'field_test_field_type_textarea',
            'type' => Field::TEXT_AREA,
            'display_name_all' => 'Field Test Field Type Text Area'
          ),
          Field.new(
            'name' => 'field_test_field_type_select_box',
            'type' => Field::SELECT_BOX,
            'display_name_all' => 'Field Test Field Type select box',
            'option_strings_text_en' => [
              { 'id' => 'yes', 'display_text' => 'Yes' },
              { 'id' => 'no', 'display_text' => 'No' }
            ]
          )
        ]
        @form_field_type_test = FormSection.create(
          :unique_id => 'form_section_test_field_type',
          :parent_form => 'case',
          'visible' => true,
          :order_form_group => 1,
          :order => 1,
          :order_subform => 0,
          :form_group_id => 'm',
          'editable' => true,
          'name_all' => 'Form Section Test 2',
          'description_all' => 'Form Section Test 2',
          :fields => fields
        )
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
      form_section = FormSection.create_or_update!(
        'visible' => true,
        :order => 11,
        :unique_id => 'tracing',
        'editable' => true,
        'name_all' => 'Tracing Name',
        'description_all' => 'Tracing Description'
      )
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
        Field.new(
          'name' => 'field_name_1',
          'type' => Field::TEXT_FIELD,
          'display_name_all' => 'Field name 1'
        )
      ]
      subform_section = FormSection.new(
        'visible' => false,
        'is_nested' => true,
        :order_form_group => 1,
        :order => 1,
        :order_subform => 1,
        :unique_id => 'subform_section_1',
        :parent_form => 'case',
        'editable' => true,
        :fields => subform_fields,
        :initial_subforms => 1,
        'name_all' => 'Nested Subform Section 1',
        'description_all' => 'Details Nested Subform Section 1'
      )
      subform_section.save!

      fields = [
        Field.new(
          'name' => 'field_name_2',
          'type' => Field::TEXT_FIELD,
          'display_name_all' => 'Field Name 2'
        ),
        Field.new(
          'name' => 'field_name_3',
          'type' => 'subform',
          'editable' => true,
          'subform_section_id' => subform_section.id,
          'display_name_all' => 'Subform Section 1'
        )
      ]
      form = FormSection.new(
        :unique_id => 'form_section_test_1',
        :parent_form => 'case',
        'visible' => true,
        :order_form_group => 1,
        :order => 1,
        :order_subform => 0,
        :form_group_id => 'm',
        'editable' => true,
        'name_all' => 'Form Section Test 1',
        'description_all' => 'Form Section Test 1',
        :fields => fields
      )
      form.save!
    end

    describe 'Create Form Section' do
      it 'should allow fields with the same name on different subforms' do
        # This field exists in a different subforms, but should be possible
        # add with the same name and different type in another subform.
        subform_fields = [
          Field.new(
            'name' => 'field_name_1',
            'type' => 'textarea',
            'display_name_all' => 'Field name 1'
          )
        ]
        subform_section = FormSection.new(
          'visible' => false,
          'is_nested' => true,
          :order_form_group => 1,
          :order => 1,
          :order_subform => 1,
          :unique_id => 'subform_section_2',
          :parent_form => 'case',
          'editable' => true,
          :fields => subform_fields,
          :initial_subforms => 1,
          'name_all' => 'Nested Subform Section 2',
          'description_all' => 'Details Nested Subform Section 2'
        )
        subform_section.save

        expect(subform_section.new_record?).to be_falsey
        expect(subform_section.fields.first.errors.messages[:name]).to be_blank
      end
    end

    describe 'Edit Form Section' do
      before :each do
        subform_fields = [
          Field.new(
            'name' => 'field_name_5',
            'type' => 'textarea',
            'display_name_all' => 'Field name 5'
          )
        ]
        @subform_section = FormSection.new(
          'visible' => false,
          'is_nested' => true,
          :order_form_group => 1,
          :order => 1,
          :order_subform => 1,
          :unique_id => 'subform_section_3',
          :parent_form => 'case',
          'editable' => true,
          :fields => subform_fields,
          :initial_subforms => 1,
          'name_all' => 'Nested Subform Section 3',
          'description_all' => 'Details Nested Subform Section 3'
        )
        @subform_section.save!

        fields = [
          Field.new(
            'name' => 'field_name_4',
            'type' => 'textarea',
            'display_name_all' => 'Field Name 4'
          ),
          Field.new(
            'name' => 'field_name_2',
            'type' => Field::TEXT_FIELD,
            'display_name_all' => 'Field Name 2'
          )
        ]
        @form = FormSection.new(
          :unique_id => 'form_section_test_2',
          :parent_form => 'case',
          'visible' => true,
          :order_form_group => 1,
          :order => 1,
          :order_subform => 0,
          :form_group_id => 'm',
          'editable' => true,
          'name_all' => 'Form Section Test 2',
          'description_all' => 'Form Section Test 2',
          :fields => fields
        )
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

  xdescribe 'import_translations' do
    before do
      [Field, FormSection].each(&:destroy_all)
    end

    describe 'handles bad input data' do
      before do
        @locale = 'es'
      end
      context 'when locale translations do not exist' do
        before do
          @fields = [
              Field.new( 'name' => 'field_name_1',
                         'type' => Field::TEXT_FIELD,
                         'display_name_all' => 'Field Name 1'
                        ),
              Field.new( 'name' => 'field_name_2',
                         'type' => Field::SELECT_BOX,
                         'display_name_all' => 'Test Select Field',
                         'option_strings_text_en' => [{ id: 'option_1', display_text: 'Test Option 1' },
                                                      { id: 'option_2', display_text: 'Test Option 2' },
                                                      { id: 'option_3', display_text: 'Test Option 3' }].map(&:with_indifferent_access)
                        )
          ]
        end
        context 'and input has all of the options' do
          before do
            FormSection.create_or_update!( unique_id: 'form_t_1', name: 'Form One',
                                                       description: 'Test Form One Description',
                                                       help_text: 'Form One Help Text', parent_form: 'case',
                                                       fields: @fields )
            @translated_hash = { 'form_t_1' => { 'name' => 'Spanish Form 1 Translated',
                                               'description' => 'Spanish Form 1 Description Translated',
                                               'fields' => { 'field_name_1' => { 'display_name' => 'Spanish Field Name 1 Translated' },
                                                            'field_name_2' => { 'display_name' => 'Spanish Field Name 2 Translated',
                                                                               'option_strings_text' => { 'option_1' => 'Spanish Option One Translated',
                                                                                                         'option_2' => 'Spanish Option Two Translated',
                                                                                                         'option_3' => 'Spanish Option Three Translated' } } } } }
            FormSection.import_translations(@locale, @translated_hash)
            @form_t_1 = FormSection.find_by(unique_id: 'form_t_1')
          end

          it 'adds translated options for the specified locale' do
            expect(@form_t_1.fields.last.option_strings_text_es).to eq([{ 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                                                                        { 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                                                                        { 'id' => 'option_3', 'display_text' => 'Spanish Option Three Translated' }])
          end
        end

        context 'and input has only some of the options' do
          before do
            FormSection.create_or_update!( unique_id: 'form_t_2', name: 'Form Two',
                                                       description: 'Test Form Two Description',
                                                       help_text: 'Form Two Help Text', parent_form: 'case',
                                                       fields: @fields )
            @translated_hash = { 'form_t_2' => { 'name' => 'Spanish Form 2 Translated',
                                               'description' => 'Spanish Form 2 Description Translated',
                                               'fields' => { 'field_name_1' => { 'display_name' => 'Spanish Field Name 1 Translated' },
                                                            'field_name_2' => { 'display_name' => 'Spanish Field Name 2 Translated',
                                                                               'option_strings_text' => { 'option_1' => 'Spanish Option One Translated',
                                                                                                         'option_2' => 'Spanish Option Two Translated' } } } } }
          end

          xit 'does not allow the translations to be saved' do
            expect{FormSection.import_translations(@locale, @translated_hash)}.to raise_error(ActiveRecord::RecordInvalid, /Option strings text Field translated options must have same ids/)
          end
        end

        context 'and input has too many options' do
          before do
            FormSection.create_or_update!( unique_id: 'form_t_3', name: 'Form Three',
                                                       description: 'Test Form Three Description',
                                                       help_text: 'Form Three Help Text', parent_form: 'case',
                                                       fields: @fields )
            @translated_hash = { 'form_t_3' => { 'name' => 'Spanish Form 3 Translated',
                                               'description' => 'Spanish Form 3 Description Translated',
                                               'fields' => { 'field_name_1' => { 'display_name' => 'Spanish Field Name 1 Translated' },
                                                            'field_name_2' => { 'display_name' => 'Spanish Field Name 2 Translated',
                                                                               'option_strings_text' => { 'option_1' => 'Spanish Option One Translated',
                                                                                                         'option_2' => 'Spanish Option Two Translated',
                                                                                                         'option_3' => 'Spanish Option Three Translated',
                                                                                                         'option_4' => 'Spanish Option Four Translated' } } } } }
            FormSection.import_translations(@locale, @translated_hash)
            @form_t_3 = FormSection.find_by(unique_id: 'form_t_3')
          end

          xit 'adds only the translated options that also exist in the default locale' do
            expect(@form_t_3.fields.last.option_strings_text_es).to eq([{ 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                                                                        { 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                                                                        { 'id' => 'option_3', 'display_text' => 'Spanish Option Three Translated' }])
          end

          xit 'does not add an option that does not exist in the default locale' do
            expect(@form_t_3.fields.last.option_strings_text_es.map{|os| os['id']}).not_to include('option_4')
          end
        end

        context 'and input has completely different options' do
          before do
            FormSection.create_or_update!( unique_id: 'form_t_4', name: 'Form Four',
                                                       description: 'Test Form Four Description',
                                                       help_text: 'Form Four Help Text', parent_form: 'case',
                                                       fields: @fields )
            @translated_hash = { 'form_t_4' => { 'name' => 'Spanish Form 4 Translated',
                                               'description' => 'Spanish Form 4 Description Translated',
                                               'fields' => { 'field_name_1' => { 'display_name' => 'Spanish Field Name 1 Translated' },
                                                            'field_name_2' => { 'display_name' => 'Spanish Field Name 2 Translated',
                                                                               'option_strings_text' => { 'option_4' => 'Spanish Option Four Translated',
                                                                                                         'option_5' => 'Spanish Option Five Translated',
                                                                                                         'option_6' => 'Spanish Option Six Translated',
                                                                                                         'option_7' => 'Spanish Option Seven Translated' } } } } }
            FormSection.import_translations(@locale, @translated_hash)
            @form_t_4 = FormSection.find_by(unique_id: 'form_t_4')
          end

          xit 'does not add any option that does not exist in the default locale' do
            expect(@form_t_4.fields.last.option_strings_text_es).to be_empty
          end
        end

        context 'and input has same options in different order' do
          before :each do
            FormSection.create_or_update!( unique_id: 'form_t_5', name: 'Form Five',
                                                       description: 'Test Form Five Description',
                                                       help_text: 'Form Five Help Text', parent_form: 'case',
                                                       fields: @fields )
            @translated_hash = { 'form_t_5' => { 'name' => 'Spanish Form 5 Translated',
                                               'description' => 'Spanish Form 5 Description Translated',
                                               'fields' => { 'field_name_1' => { 'display_name' => 'Spanish Field Name 1 Translated' },
                                                            'field_name_2' => { 'display_name' => 'Spanish Field Name 2 Translated',
                                                                               'option_strings_text' => { 'option_2' => 'Spanish Option Two Translated',
                                                                                                         'option_1' => 'Spanish Option One Translated',
                                                                                                         'option_3' => 'Spanish Option Three Translated' } } } } }
            FormSection.import_translations(@locale, @translated_hash)
            @form_t_5 = FormSection.find_by(unique_id: 'form_t_5')
          end

          xit 'adds translated options for the specified locale' do
            expect(@form_t_5.fields.last.option_strings_text_es).to eq([{ 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                                                                        { 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                                                                        { 'id' => 'option_3', 'display_text' => 'Spanish Option Three Translated' }])
          end
        end
      end

      context 'locale translations do exist' do
        before :each do
          Field.all.each(&:destroy)
          FormSection.all.each(&:destroy)
          @fields = [
              Field.new( 'name' => 'field_name_1',
                         'type' => Field::TEXT_FIELD,
                         'display_name_all' => 'Field Name 1'
                        ),
              Field.new( 'name' => 'field_name_2',
                         'type' => Field::SELECT_BOX,
                         'display_name_all' => 'Test Select Field',
                         'option_strings_text_en' => [{ id: 'option_1', display_text: 'Test Option 1' },
                                                      { id: 'option_2', display_text: 'Test Option 2' },
                                                      { id: 'option_3', display_text: 'Test Option 3' }].map(&:with_indifferent_access),
                         'option_strings_text_es' => [{ id: 'option_1', display_text: 'Test Spanish Option 1' },
                                                      { id: 'option_2', display_text: 'Test Spanish Option 2' },
                                                      { id: 'option_3', display_text: 'Test Spanish Option 3' }].map(&:with_indifferent_access)
                        )
          ]
        end
        context 'and input has all of the options' do
          before do
            FormSection.create_or_update!( unique_id: 'form_t_10', name: 'Form Ten',
                                                       description: 'Test Form Ten Description',
                                                       help_text: 'Form Ten Help Text', parent_form: 'case',
                                                       fields: @fields )
            @translated_hash = { 'form_t_10' => { 'name' => 'Spanish Form 10 Translated',
                                               'description' => 'Spanish Form 10 Description Translated',
                                               'fields' => { 'field_name_1' => { 'display_name' => 'Spanish Field Name 1 Translated' },
                                                            'field_name_2' => { 'display_name' => 'Spanish Field Name 2 Translated',
                                                                               'option_strings_text' => { 'option_1' => 'Spanish Option One Translated',
                                                                                                         'option_2' => 'Spanish Option Two Translated',
                                                                                                         'option_3' => 'Spanish Option Three Translated' } } } } }
            FormSection.import_translations(@locale, @translated_hash)
            @form_t_10 = FormSection.find_by(unique_id: 'form_t_10')
          end

          it 'adds translated options for the specified locale' do
            expect(@form_t_10.fields.last.option_strings_text_es).to eq([{ 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                                                                        { 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                                                                        { 'id' => 'option_3', 'display_text' => 'Spanish Option Three Translated' }])
          end
        end

        context 'and input has only some of the options' do
          before do
            FormSection.create_or_update!( unique_id: 'form_t_11', name: 'Form Eleven',
                                                       description: 'Test Form Eleven Description',
                                                       help_text: 'Form Eleven Help Text', parent_form: 'case',
                                                       fields: @fields )
            @translated_hash = { 'form_t_11' => { 'name' => 'Spanish Form 11 Translated',
                                               'description' => 'Spanish Form 11 Description Translated',
                                               'fields' => { 'field_name_1' => { 'display_name' => 'Spanish Field Name 1 Translated' },
                                                            'field_name_2' => { 'display_name' => 'Spanish Field Name 2 Translated',
                                                                               'option_strings_text' => { 'option_1' => 'Spanish Option One Translated',
                                                                                                         'option_2' => 'Spanish Option Two Translated' } } } } }
            FormSection.import_translations(@locale, @translated_hash)
            @form_t_11 = FormSection.find_by(unique_id: 'form_t_11')
          end

          it 'updates only the translated options provided for the specified locale' do
            expect(@form_t_11.fields.last.option_strings_text_es).to eq([{ 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                                                  { 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                                                  { 'id' => 'option_3', 'display_text' => 'Test Spanish Option 3' }])
          end
        end

        context 'and input has too many options' do
          before do
            FormSection.create_or_update!( unique_id: 'form_t_12', name: 'Form Twelve',
                                                       description: 'Test Form Twelve Description',
                                                       help_text: 'Form Twelve Help Text', parent_form: 'case',
                                                       fields: @fields )
            @translated_hash = { 'form_t_12' => { 'name' => 'Spanish Form 12 Translated',
                                               'description' => 'Spanish Form 12 Description Translated',
                                               'fields' => { 'field_name_1' => { 'display_name' => 'Spanish Field Name 1 Translated' },
                                                            'field_name_2' => { 'display_name' => 'Spanish Field Name 2 Translated',
                                                                               'option_strings_text' => { 'option_1' => 'Spanish Option One Translated',
                                                                                                         'option_2' => 'Spanish Option Two Translated',
                                                                                                         'option_3' => 'Spanish Option Three Translated',
                                                                                                         'option_4' => 'Spanish Option Four Translated' } } } } }
            FormSection.import_translations(@locale, @translated_hash)
            @form_t_12 = FormSection.find_by(unique_id: 'form_t_12')
          end

          xit 'adds only the translated options that also exist in the default locale' do
            expect(@form_t_12.fields.last.option_strings_text_es).to eq([{ 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                                                                        { 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                                                                        { 'id' => 'option_3', 'display_text' => 'Spanish Option Three Translated' }])
          end

          xit 'does not add an option that does not exist in the default locale' do
            expect(@form_t_12.fields.last.option_strings_text_es.map{|os| os['id']}).not_to include('option_4')
          end
        end

        context 'and input has completely different options' do
          before do
            FormSection.create_or_update!( unique_id: 'form_t_13', name: 'Form Thirteen',
                                                       description: 'Test Form Thirteen Description',
                                                       help_text: 'Form Thirteen Help Text', parent_form: 'case',
                                                       fields: @fields )
            @translated_hash = { 'form_t_13' => { 'name' => 'Spanish Form 13 Translated',
                                               'description' => 'Spanish Form 13 Description Translated',
                                               'fields' => { 'field_name_1' => { 'display_name' => 'Spanish Field Name 1 Translated' },
                                                            'field_name_2' => { 'display_name' => 'Spanish Field Name 2 Translated',
                                                                               'option_strings_text' => { 'option_4' => 'Spanish Option Four Translated',
                                                                                                         'option_5' => 'Spanish Option Five Translated',
                                                                                                         'option_6' => 'Spanish Option Six Translated',
                                                                                                         'option_7' => 'Spanish Option Seven Translated' } } } } }
            FormSection.import_translations(@locale, @translated_hash)
            @form_t_13 = FormSection.find_by(unique_id: 'form_t_13')
          end

          xit 'does not add any option that does not exist in the default locale' do
            expect(@form_t_13.fields.last.option_strings_text_es).to eq([{ 'id' => 'option_1', 'display_text' => 'Test Spanish Option 1' },
                                                                        { 'id' => 'option_2', 'display_text' => 'Test Spanish Option 2' },
                                                                        { 'id' => 'option_3', 'display_text' => 'Test Spanish Option 3' }])
          end
        end

        context 'and input has same options in different order' do
          before :each do
            FormSection.create_or_update!( unique_id: 'form_t_14', name: 'Form Fourteen',
                                                       description: 'Test Form Fourteen Description',
                                                       help_text: 'Form Fourteen Help Text', parent_form: 'case',
                                                       fields: @fields )
            @translated_hash = { 'form_t_14' => { 'name' => 'Spanish Form 14 Translated',
                                                'description' => 'Spanish Form 14 Description Translated',
                                                'fields' => { 'field_name_1' => { 'display_name' => 'Spanish Field Name 1 Translated' },
                                                             'field_name_2' => { 'display_name' => 'Spanish Field Name 2 Translated',
                                                                                'option_strings_text' => { 'option_2' => 'Spanish Option Two Translated',
                                                                                                          'option_1' => 'Spanish Option One Translated',
                                                                                                          'option_3' => 'Spanish Option Three Translated' } } } } }
            FormSection.import_translations(@locale, @translated_hash)
            @form_t_14 = FormSection.find_by(unique_id: 'form_t_14')
          end

          it 'adds translated options for the specified locale' do
            expect(@form_t_14.fields.last.option_strings_text_es).to eq([{ 'id' => 'option_1', 'display_text' => 'Spanish Option One Translated' },
                                                                         { 'id' => 'option_2', 'display_text' => 'Spanish Option Two Translated' },
                                                                         { 'id' => 'option_3', 'display_text' => 'Spanish Option Three Translated' }])
          end
        end
      end
    end
  end

  describe 'ConfigurationRecord' do
    let(:form1) { FormSection.create!(unique_id: 'A', name: 'A', parent_form: 'case', form_group_id: 'm') }
    let(:field1) { Field.create!(name: 'test', display_name: 'test', type: Field::TEXT_FIELD, form_section_id: form1.id) }
    let(:subform) do
      FormSection.create!(
        unique_id: 'B', name: 'B', parent_form: 'case', form_group_id: 'm', is_nested: true
      )
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
end
