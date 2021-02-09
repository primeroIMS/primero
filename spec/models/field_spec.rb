# frozen_string_literal: true

require 'rails_helper'

describe Field do
  before :each do
    clean_data(Field, FormSection)
    @field_name = 'gender'
    @field = Field.new(name: 'gender', display_name: 'gender', type: 'radio_button',
                       option_strings_text: [
                         { 'id' => 'male', 'display_text' => 'Male' },
                         { 'id' => 'female', 'display_text' => 'Female' }
                       ])
  end

  describe '#name' do
    it 'should not be generated when provided' do
      field = Field.new(name: 'test_name')
      expect(field.name).to eq('test_name')
    end
  end

  describe 'options' do
    it 'should create options from text' do
      field = Field.new(
        display_name: 'something',
        option_strings_text: [
          { 'id' => 'tim', 'display_text' => 'Tim' }, { 'id' => 'rob_smith', 'display_text' => 'Rob Smith' }
        ]
      )
      expect(field.option_strings_text).to eq(
        [{ 'id' => 'tim', 'display_text' => 'Tim' }, { 'id' => 'rob_smith', 'display_text' => 'Rob Smith' }]
      )
    end
  end

  describe 'valid?' do
    it 'should not allow blank display name' do
      field = Field.new(display_name: '')
      form_section = FormSection.new(parent_form: 'case')
      form_section.fields = [field]
      expect(field.valid?).to be false
      expect(field.errors[:display_name_en]).to be_present
    end

    it 'should not allow display name without alphabetic characters' do
      field = Field.new(display_name: '!@£$@')
      form_section = FormSection.new(parent_form: 'case')
      form_section.fields = [field]
      expect(field.valid?).to be_falsey
      expect(field.errors[:display_name]).to include('errors.models.field.display_name_format')
    end

    it 'should not allow blank name' do
      field = Field.new(display_name: 'ABC 123', name: '')
      form_section = FormSection.new(parent_form: 'case')
      form_section.fields = [field]
      expect(field.valid?).to be_falsey
      expect(field.errors[:name]).to include('errors.models.field.name_presence')
    end

    it 'should not allow capital letters in name' do
      field = Field.new(display_name: 'ABC 123', name: 'Abc_123')
      form_section = FormSection.new(parent_form: 'case')
      form_section.fields = [field]
      expect(field.valid?).to be false
      expect(field.errors[:name]).to include('errors.models.field.name_format')
    end

    it 'should not allow special characters in name' do
      field = Field.new(display_name: 'ABC 123', name: 'a$bc_123')
      form_section = FormSection.new(parent_form: 'case')
      form_section.fields = [field]
      expect(field.valid?).to be false
      expect(field.errors[:name]).to include('errors.models.field.name_format')
    end

    it 'should not allow name to start with a number' do
      field = Field.new(display_name: 'ABC 123', name: '1abc_123')
      form_section = FormSection.new(parent_form: 'case')
      form_section.fields = [field]
      expect(field.valid?).to be false
      expect(field.errors[:name]).to include('errors.models.field.name_format')
    end

    it 'should allow alphabetic characters numbers and underscore in name' do
      field = Field.new(display_name: 'ABC 123', name: 'abc_123')
      form_section = FormSection.new(parent_form: 'case')
      form_section.fields = [field]
      expect(field.valid?).to be true
    end

    it 'should allow alphabetic only in name' do
      field = Field.new(display_name: 'ABC 123', name: 'abc')
      form_section = FormSection.new(parent_form: 'case')
      form_section.fields = [field]
      expect(field.valid?).to be true
    end

    it 'should allow alphabetic and numeric only in name' do
      field = Field.new(display_name: 'ABC 123', name: 'abc123')
      form_section = FormSection.new(parent_form: 'case')
      form_section.fields = [field]
      expect(field.valid?).to be true
    end

    it 'should not allow blank id on the option_string_text' do
      field = Field.new(name: 'test_field', display_name: 'tesf_field', type: Field::SELECT_BOX)
      field.option_strings_text = [{ id: nil, display_text: { en: 'C lot (4 pts)' } }]

      expect(field.valid?).to be false
      expect(field.errors[:option_strings_text].first).to eq('errors.models.field.option_strings_text.not_hash')
    end

    describe 'select box option strings' do
      before :each do
        @field = Field.new(name: 'test', display_name: 'test', type: Field::SELECT_BOX)
      end

      context 'with no options' do
        it 'is valid' do
          expect(@field.valid?).to be_truthy
        end
      end

      context 'with multiple options' do
        before do
          @field.option_strings_text_en = [
            { id: 'option_1', display_text: 'Test Option 1' },
            { id: 'option_2', display_text: 'Test Option 2' },
            { id: 'option_3', display_text: 'Test Option 3' }
          ].map(&:with_indifferent_access)
        end

        it 'is valid' do
          expect(@field.valid?).to be_truthy
        end

        context 'and some options have blank id' do
          before do
            @field.option_strings_text_en << { id: '', display_text: 'Test Option 1' }.with_indifferent_access
          end

          it 'is not valid' do
            expect(@field.valid?).to be_truthy
          end
        end

        context 'and some options have blank description' do
          before do
            @field.option_strings_text_en = [{ id: 'option_4', display_text: '' }.with_indifferent_access]
          end

          it 'is not valid' do
            expect(@field.valid?).to be_falsey
            expect(@field.errors.messages[:option_strings_text]).to eq(
              ['errors.models.field.option_strings_text.not_hash']
            )
          end
        end

        describe 'translations' do
          context 'and translated options are missing some options' do
            before do
              @field.option_strings_text_fr = [
                { id: 'option_1', display_text: 'Test Option 1' },
                { id: 'option_2', display_text: 'Test Option 2' }
              ].map(&:with_indifferent_access)
            end

            it 'is valid' do
              expect(@field.valid?).to be_truthy
              expect(@field.errors.messages[:option_strings_text]).to eq([])
            end
          end

          context 'and translated options have extra options' do
            before do
              @field.option_strings_text_fr = [
                { id: 'option_1', display_text: 'Test Option 1' },
                { id: 'option_2', display_text: 'Test Option 2' },
                { id: 'option_3', display_text: 'Test Option 3' },
                { id: 'option_4', display_text: 'Test Option 4' }
              ].map(&:with_indifferent_access)
            end

            # the base options should not have empty options
            it 'is not valid' do
              expect(@field.valid?).to be_falsey
              expect(@field.errors.messages[:option_strings_text]).to eq(
                ['errors.models.field.option_strings_text.not_hash']
              )
            end
          end

          context 'and translated options have different options' do
            before do
              @field.option_strings_text_fr = [
                { id: 'foo', display_text: 'Test Option Foo' },
                { id: 'bar', display_text: 'Test Option Bar' },
                { id: 'baz', display_text: 'Test Option Baz' }
              ].map(&:with_indifferent_access)
            end

            it 'is not valid' do
              expect(@field.valid?).to be_falsey
              expect(@field.errors.messages[:option_strings_text]).to eq(
                ['errors.models.field.option_strings_text.not_hash']
              )
            end
          end

          context 'and translated options have the same options as the default locale' do
            before do
              @field.option_strings_text_fr = [
                { id: 'option_1', display_text: 'Test French Option 1' },
                { id: 'option_2', display_text: 'Test French Option 2' },
                { id: 'option_3', display_text: 'Test French Option 3' }
              ].map(&:with_indifferent_access)
            end

            it 'is valid' do
              expect(@field.valid?).to be_truthy
            end
          end

          context 'and translated options have the same options as the default locale in a different order' do
            before do
              @field.option_strings_text_fr = [
                { id: 'option_2', display_text: 'Test French Option 2' },
                { id: 'option_1', display_text: 'Test French Option 1' },
                { id: 'option_3', display_text: 'Test French Option 3' }
              ].map(&:with_indifferent_access)
            end

            it 'is valid' do
              expect(@field.valid?).to be_truthy
            end
          end

          context 'and some translated options have blank description' do
            before do
              @field.option_strings_text_fr = [
                { id: 'option_1', display_text: 'Test French Option 1' },
                { id: 'option_2', display_text: '' },
                { id: 'option_3', display_text: '' }
              ].map(&:with_indifferent_access)
            end

            it 'is valid' do
              expect(@field).to be_valid
            end
          end
        end
      end
    end
  end

  describe 'save' do
    it 'should set visible' do
      field = Field.new(name: 'diff_field', display_name: 'diff_field', visible: 'true')
      form = FormSection.new(fields: [field], name: 'test_form', unique_id: 'test_form_1')
      form.save!
      form.fields.first.should be_visible
    end
  end

  describe 'I18n' do
    before do
      I18n.locale = :fr
    end
    it 'should set the value of system language for the given field' do
      field = Field.new(
        name: 'first_name', display_name: 'first name in french',
        help_text: 'help text in french',
        option_strings_text: [
          { id: 'option_string_in_french', display_text: 'option string in french' }.with_indifferent_access
        ]
      )
      expect(field.display_name_fr).to eq('first name in french')
      expect(field.help_text_fr).to eq('help text in french')
      expect(field.option_strings_text_fr).to eq(
        [{ 'id' => 'option_string_in_french', 'display_text' => 'option string in french' }]
      )
    end

    it 'should get the value of system language for the given field' do
      field = Field.new(
        name: 'first_name', display_name_fr: 'first name in french',
        help_text_en: 'help text in english', help_text_fr: 'help text in french',
        option_strings_text_en: [{ id: 'opt1', display_text: 'option string in english' }.with_indifferent_access],
        option_strings_text_fr: [{ id: 'opt1', display_text: 'option string in french' }.with_indifferent_access]
      )
      expect(field.display_name).to eq(field.display_name_fr)
      expect(field.help_text).to eq(field.help_text_fr)
      expect(field.option_strings_text).to eq(field.option_strings_text_fr)
    end

    it "should fetch the default locale's value if translation is not available for given locale" do
      field = Field.new(
        name: 'first_name', display_name_en: 'first name in english',
        help_text_en: 'help text in english', help_text_fr: 'help text in french',
        option_strings_text_en: [{ id: 'opt1', display_text: 'option string in english' }.with_indifferent_access],
        option_strings_text_fr: [{ id: 'opt1', display_text: 'option string in french' }.with_indifferent_access]
      )
      expect(field.display_name).to eq(field.display_name_en)
      expect(field.help_text).to eq(field.help_text_fr)
      expect(field.option_strings_text).to eq(field.option_strings_text_fr)
    end
  end

  describe 'formatted hash' do
    it 'should combine the field_name_translation into hash' do
      field = Field.new(name: 'first_name', display_name_en: 'first name in english',
                        help_text_en: 'help text in english', help_text_fr: 'help text in french')

      expect(field.display_name_i18n).to eq('en' => 'first name in english')
      expect(field.help_text_i18n).to eq('en' => 'help text in english', 'fr' => 'help text in french')
    end
  end

  describe 'normalize line endings' do
    it 'should convert \\r\\n to \\n' do
      field = Field.new(
        name: 'test', display_name_en: 'test',
        option_strings_text: [
          { 'id' => 'uganda', 'display_text' => 'Uganda' }, { 'id' => 'sudan', 'display_text' => 'Sudan' }
        ]
      )
      expect(field.option_strings_text_en).to eq(
        [{ 'id' => 'uganda', 'display_text' => 'Uganda' }, { 'id' => 'sudan', 'display_text' => 'Sudan' }]
      )
    end

    it 'should use \\n as it is' do
      field = Field.new(
        name: 'test', display_name_en: 'test',
        option_strings_text: [
          { 'id' => 'uganda', 'display_text' => 'Uganda' }, { 'id' => 'sudan', 'display_text' => 'Sudan' }
        ]
      )
      expect(field.option_strings_text_en).to eq(
        [{ 'id' => 'uganda', 'display_text' => 'Uganda' }, { 'id' => 'sudan', 'display_text' => 'Sudan' }]
      )
    end
  end

  it 'should show that the field is new until the field is saved' do
    form = FormSection.create! name: 'test_form', unique_id: 'test_form'
    field = Field.new name: 'test_field', display_name_en: 'test_field', type: Field::TEXT_FIELD
    expect(field.new_record?).to be_truthy
    form.fields << field
    form.save
    expect(field.new_record?).to be_falsey
  end

  it 'should show that the field is new after the field fails validation' do
    form = FormSection.create! name: 'test_form2', unique_id: 'test_form'
    field = Field.new name: 'test_field2', display_name_en: 'test_field', type: Field::TEXT_FIELD
    form.fields << field
    form.save
    # Adding duplicate field.
    field = Field.new name: 'test_field2', display_name_en: 'test_field', type: Field::TEXT_FIELD
    form.fields << field
    form.save
    expect(field.errors.count).to be > 0
    expect(field.new_record?).to be_truthy
  end

  it 'should fails save because fields are duplicated and fields remains as new' do
    # Try to create a FormSection with duplicate fields. That will make fails the save.
    fields = [Field.new(name: 'test_field2', display_name_en: 'test_field', type: Field::TEXT_FIELD),
              Field.new(name: 'test_field2', display_name_en: 'test_field', type: Field::TEXT_FIELD)]
    form = FormSection.create name: 'test_form2', unique_id: 'test_form', fields: fields
    expect(fields.first.errors.count).to eq(0)
    expect(form.errors.count).to be > 0
    expect(form.errors[:fields]).to eq(['errors.models.form_section.unique_field_names'])
    # Because it fails save, fields remains new.
    expect(fields.first.new_record?).to be_truthy
    expect(fields.last.new_record?).to be_truthy
  end

  it 'should fails save because fields changes make them duplicate' do
    # Create the FormSection with two valid fields.
    fields = [Field.new(name: 'test_field1', display_name_en: 'test_field1', type: Field::TEXT_FIELD),
              Field.new(name: 'test_field2', display_name_en: 'test_field2', type: Field::TEXT_FIELD)]
    form = FormSection.create name: 'test_form2', unique_id: 'test_form', fields: fields
    expect(fields.first.errors.count).to be == 0
    expect(fields.first.new_record?).to be_falsey
    expect(fields.last.errors.count).to be == 0
    expect(fields.last.new_record?).to be_falsey

    # Update the first one to have the same name of the second,
    # This make fails saving the FormSection.
    fields.first.name = fields.last.name
    fields.first.save
    form.save
    expect(form.fields.map { |x| x.errors[:name] }.flatten.count).to be > 0
    expect(fields.first.errors.count).to be > 0
    expect(fields.first.errors[:name]).to eq(['errors.models.field.unique_name_this'])

    # because field already came from the database should remains false
    expect(fields.first.new_record?).to be_falsey
    expect(fields.last.new_record?).to be_falsey

    # Fix the field and save again
    fields.first.name = 'something_else'
    fields.first.save
    form.save
    expect(form.errors.count).to be == 0
  end

  describe 'showable?' do
    context 'when visible is set to false' do
      it 'should be false if hide_on_view_page is not set' do
        field = Field.new(display_name: 'ABC 123', name: 'abc123', visible: false)
        expect(field.showable?).to be false
      end

      it 'should be false if hide_on_view_page is set to false' do
        field = Field.new(display_name: 'ABC 123', name: 'abc123', visible: false, hide_on_view_page: false)
        expect(field.showable?).to be false
      end

      it 'should be false if hide_on_view_page is set to true' do
        field = Field.new(display_name: 'ABC 123', name: 'abc123', visible: false, hide_on_view_page: true)
        expect(field.showable?).to be false
      end
    end

    context 'when visible is set to true' do
      it 'should be true if hide_on_view_page is not set' do
        field = Field.new(display_name: 'ABC 123', name: 'abc123', visible: true)
        expect(field.showable?).to be true
      end

      it 'should be true if hide_on_view_page is set to false' do
        field = Field.new(display_name: 'ABC 123', name: 'abc123', visible: true, hide_on_view_page: false)
        expect(field.showable?).to be true
      end

      it 'should be false if hide_on_view_page is set to true' do
        field = Field.new(display_name: 'ABC 123', name: 'abc123', visible: true, hide_on_view_page: true)
        expect(field.showable?).to be false
      end
    end

    context 'when visible is not set' do
      it 'should be true if hide_on_view_page is not set' do
        field = Field.new(display_name: 'ABC 123', name: 'abc123')
        expect(field.showable?).to be true
      end

      it 'should be true if hide_on_view_page is set to false' do
        field = Field.new(display_name: 'ABC 123', name: 'abc123', hide_on_view_page: false)
        expect(field.showable?).to be true
      end

      it 'should be false if hide_on_view_page is set to true' do
        field = Field.new(display_name: 'ABC 123', name: 'abc123', hide_on_view_page: true)
        expect(field.showable?).to be false
      end
    end
  end

  describe 'location?' do
    context 'when it is a select field' do
      context 'and option_strings_source is Location' do
        it 'should be true' do
          field = Field.new(
            'name' => 'test_location',
            'type' => 'select_box',
            'display_name_all' => 'My Test Field',
            'option_strings_source' => 'Location'
          )
          expect(field.location?).to be_truthy
        end
      end

      context 'and option_strings_source is not Location' do
        it 'should be false' do
          field = Field.new(
            'name' => 'test_not_location',
            'type' => 'select_box',
            'display_name_all' => 'My Test Field',
            'option_strings_source' => 'lookup lookup-country'
          )
          expect(field.location?).to be_falsey
        end
      end

      context 'and option_strings_source is empty' do
        it 'should be false' do
          field = Field.new(
            'name' => 'test_not_location',
            'type' => 'select_box',
            'display_name_all' => 'My Test Field',
            'option_strings_text' => [
              { 'id' => 'yes', 'display_text' => 'yes' }, { 'id' => 'no', 'display_text' => 'no' }
            ]
          )
          expect(field.location?).to be_falsey
        end
      end
    end

    context 'when it is not a select field' do
      it 'should be false' do
        field = Field.new(
          'name' => 'test_field',
          'type' => 'text_field',
          'display_name_all' => 'My Test Field'
        )
        expect(field.location?).to be_falsey
      end
    end
  end

  describe 'all location field names' do
    before do
      clean_data(FormSection)

      fields = [
        Field.new(
          'name' => 'field_name_1',
          'type' => 'text_field',
          'display_name_all' => 'Field Name 1'
        ),
        Field.new(
          'name' => 'field_name_2',
          'type' => 'text_field',
          'display_name_all' => 'Field Name 2'
        )
      ]
      @form0 = FormSection.create(
        unique_id: 'form_section_no_locations',
        :parent_form => 'case',
        'visible' => true,
        :order_form_group => 1,
        :order => 1,
        :order_subform => 0,
        'editable' => true,
        'name_all' => 'Form Section No Locations',
        'description_all' => 'Form Section No Locations',
        :fields => fields
      )

      fields = [
        Field.new(
          'name' => 'test_location_1',
          'type' => 'select_box',
          'display_name_all' => 'Test Location 1',
          'option_strings_source' => 'Location'
        ),
        Field.new(
          'name' => 'field_name_1',
          'type' => 'text_field',
          'display_name_all' => 'Field Name 1'
        ),
        Field.new(
          'name' => 'field_name_2',
          'type' => 'text_field',
          'display_name_all' => 'Field Name 2'
        ),
        Field.new(
          'name' => 'test_country',
          'type' => 'select_box',
          'display_name_all' => 'My Test Country',
          'option_strings_source' => 'lookup lookup-country'
        )
      ]
      @form1 = FormSection.create(
        :unique_id => 'form_section_one_location',
        :parent_form => 'case',
        'visible' => true,
        :order_form_group => 1,
        :order => 1,
        :order_subform => 0,
        'editable' => true,
        'name_all' => 'Form Section One Location',
        'description_all' => 'Form Section One Location',
        :fields => fields
      )

      fields = [
        Field.new(
          'name' => 'test_location_2',
          'type' => 'select_box',
          'display_name_all' => 'Test Location 2',
          'option_strings_source' => 'Location'
        ),
        Field.new(
          'name' => 'test_location_3',
          'type' => 'select_box',
          'display_name_all' => 'Test Location 3',
          'option_strings_source' => 'Location'
        ),
        Field.new(
          'name' => 'field_name_1',
          'type' => 'text_field',
          'display_name_all' => 'Field Name 1'
        ),
        Field.new(
          'name' => 'field_name_2',
          'type' => 'text_field',
          'display_name_all' => 'Field Name 2'
        ),
        Field.new(
          'name' => 'test_yes_no',
          'type' => 'select_box',
          'display_name_all' => 'My Test Field',
          'option_strings_text' => [
            { 'id' => 'yes', 'display_text' => 'yes' }, { 'id' => 'no', 'display_text' => 'no' }
          ]
        ),
        Field.new(
          'name' => 'test_country',
          'type' => 'select_box',
          'display_name_all' => 'My Test Country',
          'option_strings_source' => 'lookup lookup-country'
        )
      ]
      @form2 = FormSection.create(
        :unique_id => 'form_section_two_locations',
        :parent_form => 'tracing_request',
        'visible' => true,
        :order_form_group => 1,
        :order => 1,
        :order_subform => 0,
        'editable' => true,
        'name_all' => 'Form Section Two Locations',
        'description_all' => 'Form Section Two Locations',
        :fields => fields
      )

      fields = [
        Field.new(
          'name' => 'test_location_4',
          'type' => 'select_box',
          'display_name_all' => 'Test Location 4',
          'option_strings_source' => 'Location'
        ),
        Field.new(
          'name' => 'test_location_5',
          'type' => 'select_box',
          'display_name_all' => 'Test Location 5',
          'option_strings_source' => 'Location'
        ),
        Field.new(
          'name' => 'field_name_1',
          'type' => 'text_field',
          'display_name_all' => 'Field Name 1'
        ),
        Field.new(
          'name' => 'field_name_2',
          'type' => 'text_field',
          'display_name_all' => 'Field Name 2'
        ),
        Field.new(
          'name' => 'test_location_6',
          'type' => 'select_box',
          'display_name_all' => 'Test Location 6',
          'option_strings_source' => 'Location'
        )
      ]
      @form3 = FormSection.create(
        :unique_id => 'form_section_three_locations',
        :parent_form => 'tracing_request',
        'visible' => true,
        :order_form_group => 1,
        :order => 1,
        :order_subform => 0,
        'editable' => true,
        'name_all' => 'Form Section Three Locations',
        'description_all' => 'Form Section Three Locations',
        :fields => fields
      )

      fields = [
        Field.new(
          'name' => 'test_location_7',
          'type' => 'select_box',
          'display_name_all' => 'Test Location 7',
          'option_strings_source' => 'Location'
        ),
        Field.new(
          'name' => 'test_location_8',
          'type' => 'select_box',
          'display_name_all' => 'Test Location 8',
          'option_strings_source' => 'Location'
        ),
        Field.new(
          'name' => 'field_name_1',
          'type' => 'text_field',
          'display_name_all' => 'Field Name 1'
        ),
        Field.new(
          'name' => 'field_name_2',
          'type' => 'text_field',
          'display_name_all' => 'Field Name 2'
        ),
        Field.new(
          'name' => 'test_location_9',
          'type' => 'select_box',
          'display_name_all' => 'Test Location 9',
          'option_strings_source' => 'Location'
        ),
        Field.new(
          'name' => 'test_location_10',
          'type' => 'select_box',
          'display_name_all' => 'Test Location 10',
          'option_strings_source' => 'Location'
        )
      ]
      @form4 = FormSection.create(
        :unique_id => 'form_section_four_locations',
        :parent_form => 'incident',
        'visible' => true,
        :order_form_group => 1,
        :order => 1,
        :order_subform => 0,
        'editable' => true,
        'name_all' => 'Form Section Four Locations',
        'description_all' => 'Form Section Four Locations',
        :fields => fields
      )
    end

    after :all do
      clean_data(FormSection)
    end

    context 'when parent form is not passed in' do
      it 'returns the forms for case' do
        expect(Field.all_location_field_names).to match_array ['test_location_1']
      end
    end

    context 'when parent form is case' do
      it 'returns the forms' do
        expect(Field.all_location_field_names('case')).to match_array ['test_location_1']
      end
    end

    context 'when parent form is tracing_request' do
      it 'returns the forms' do
        expect(Field.all_location_field_names('tracing_request')).to match_array(
          %w[test_location_2 test_location_3 test_location_4 test_location_5 test_location_6]
        )
      end
    end

    context 'when parent form is incident' do
      it 'returns the forms' do
        expect(Field.all_location_field_names('incident')).to match_array(
          %w[test_location_7 test_location_8 test_location_9 test_location_10]
        )
      end
    end
  end

  describe 'options_list' do
    before do
      @english_options = [
        { 'id' => 'option_1', 'display_text' => 'EN1' },
        { 'id' => 'option_2', 'display_text' => 'EN2' },
        { 'id' => 'option_3', 'display_text' => 'EN3' }
      ]
      @french_options = [
        { 'id' => 'option_1', 'display_text' => 'FR1' },
        { 'id' => 'option_2', 'display_text' => 'FR2' },
        { 'id' => 'option_3', 'display_text' => 'FR3' }
      ]
      @arabic_options = [
        { 'id' => 'option_1', 'display_text' => 'AR1' },
        { 'id' => 'option_2', 'display_text' => 'AR2' },
        { 'id' => 'option_3', 'display_text' => '' }
      ]
      @spanish_options = [
        { 'id' => 'option_1', 'display_text' => '' },
        { 'id' => 'option_2', 'display_text' => '' },
        { 'id' => 'option_3', 'display_text' => '' }
      ]
    end

    context 'when using option_strings_text' do
      before do
        @field_options = Field.new(
          'name' => 'field_with_options',
          'type' => 'select_box',
          'display_name_all' => 'Field With Options',
          'option_strings_text_en' => @english_options,
          'option_strings_text_fr' => @french_options,
          'option_strings_text_ar' => @arabic_options,
          'option_strings_text_es' => @spanish_options
        )
      end

      context 'and no locale is passed in' do
        it 'returns the English version of options' do
          expect(@field_options.options_list).to eq(@english_options)
        end
      end

      context 'and a locale is passed in' do
        context 'and all options for that locale are populated' do
          it 'returns options for the specified locale' do
            expect(@field_options.options_list(locale: 'fr')).to eq(@french_options)
          end
        end

        context 'and some options for that locale are populated' do
          it 'returns options for the specified locale' do
            expect(@field_options.options_list(locale: 'ar')).to eq(@arabic_options)
          end
        end
      end
    end

    context 'when using option_strings_source' do
      before do
        clean_data(Lookup)
        @lookup_multi_locales = Lookup.create!(
          unique_id: 'test', name_en: 'English', name_fr: 'French', name_ar: 'Arabic',
          lookup_values_en: @english_options, lookup_values_fr: @french_options, lookup_values_ar: @arabic_options
        )
        @lookup_no_locales = Lookup.create!(
          unique_id: 'default', name: 'Default',
          lookup_values: [{ id: 'default1', display_text: 'Default1' }, { id: 'default2', display_text: 'default2' }]
        )
        @field_multi_locales = Field.new(
          'name' => 'test_location_4',
          'type' => 'select_box',
          'display_name_all' => 'Test Location 4',
          'option_strings_source' => 'lookup test'
        )
        @field_no_locales = Field.new(
          'name' => 'test_location_4',
          'type' => 'select_box',
          'display_name_all' => 'Test Location 4',
          'option_strings_source' => 'lookup default'
        )
      end

      context 'and field lookup has many locales' do
        it 'should return settings for specified locale' do
          expect(@field_multi_locales.options_list(locale: 'ar', lookups: [])).to eq(@arabic_options)
        end
      end

      context 'and field is looking up non-specified locale' do
        it 'should return the default locale' do
          expect(@field_no_locales.options_list(locale: 'ar', lookups: [])[0]['id']).to eq('default1')
        end
      end
    end
  end

  describe 'aggregate or disaggregate with number at the end should be able to match with a field' do
    before do
      clean_data(FormSection)

      fields = [
        Field.new(
          'name' => 'field_name',
          'type' => Field::SELECT_BOX,
          'display_name_all' => 'Field Name',
          'option_strings_source' => 'Location'
        )
      ]

      @form0 = FormSection.create(
        :unique_id => 'form_section_name',
        :parent_form => 'case',
        'visible' => true,
        :order_form_group => 1,
        :order => 1,
        :order_subform => 0,
        'editable' => true,
        'name_all' => 'Form Section Name',
        'description_all' => 'Form Section Name',
        :fields => fields
      )
    end

    it 'should return a field' do
      expect(Field.find_by_name('field_name1')[0]['name']).to eq('field_name')
    end
  end

  describe 'agency?' do
    context 'when option_strings_sources is Agency' do
      it 'should be true' do
        field = Field.new(
          name: 'test_agency',
          type: 'select_box',
          display_name_all: 'Test field',
          option_strings_source: 'Agency'
        )
        expect(field.agency?).to be_truthy
      end
    end
    context 'when option_strings_sources is not Agency' do
      it 'should be false' do
        field = Field.new(
          name: 'test_agency',
          type: 'select_box',
          display_name_all: 'Test field',
          option_strings_source: 'Location'
        )
        expect(field.agency?).to be_falsy
      end
    end
  end

  describe 'nested?' do
    context 'when field is on a subform' do
      before do
        @field = Field.new(display_name: 'test 1', name: 'test1')
        FormSection.create!(name_en: 'Test Subform', parent_form: 'case', unique_id: 'form_section_subform',
                            fields:[@field], is_nested: true)
      end

      it 'is true' do
        expect(@field.nested?).to be_truthy
      end
    end

    context 'when field is not on a subform' do
      before do
        @field = Field.new(display_name: 'test 1', name: 'test1')
        FormSection.create!(name_en: 'Test Regular Form', parent_form: 'case', unique_id: 'form_section_not_nested',
                            fields:[@field])
      end

      it 'is false' do
        expect(@field.nested?).to be_falsey
      end
    end
  end

  describe 'ConfigurationRecord' do
    describe '#configuration_hash' do
      let(:form1) { FormSection.create!(unique_id: 'A', name: 'A', parent_form: 'case', form_group_id: 'm') }
      let(:field1) { Field.create!(name: 'test', display_name: 'test', type: Field::TEXT_FIELD, form_section_id: form1.id) }
      let(:subform) { FormSection.create!(unique_id: 'B', name: 'B', parent_form: 'case', form_group_id: 'm', is_nested: true) }
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

      context 'regular form field' do
        let(:configuration_hash) { field1.configuration_hash }

        it 'returns field properties in the configuration hash' do
          expect(configuration_hash['name']).to eq(field1.name)
          expect(configuration_hash['type']).to eq(field1.type)
          expect(configuration_hash['id']).to be_nil
          expect(configuration_hash['form_section_id']).to be_nil
        end
      end

      context 'field on subform' do
        let(:configuration_hash) { field_on_subform.configuration_hash }

        it 'contains the pointer to the subform' do
          expect(configuration_hash['collapsed_field_for_subform_unique_id']).to eq(subform.unique_id)
          expect(configuration_hash['subform_unique_id']).to be_nil
        end
      end

      context 'subform field' do
        let(:configuration_hash) { subform_field.configuration_hash }

        it 'contains the pointer to the subform' do
          expect(configuration_hash['subform_unique_id']).to eq(subform.unique_id)
        end
      end
    end
  end
end
