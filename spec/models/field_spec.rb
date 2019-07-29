# -*- coding: utf-8 -*-
require 'rails_helper'


describe "record field model" do

  before :each do
    FormSection.all.each { |form| form.destroy }
    @field_name = "gender"
    @field = Field.new :name => "gender", :display_name => @field_name, :option_strings_text => "male\nfemale", :type => Field::RADIO_BUTTON
  end

  describe 'default property values' do
    before do
      @field_default = Field.new
    end

    it 'editable is true' do
      expect(@field_default.editable?).to be_truthy
    end

    it 'deletable is true' do
      expect(@field_default.deletable?).to be_truthy
    end
  end

  describe '#name' do
    it "should not be generated when provided" do
      field = Field.new :name => 'test_name'
      field.name.should == 'test_name'
    end
  end

  it "converts field name to a HTML tag ID" do
    @field.tag_id.should == "child_#{@field_name}"
  end

  it "converts field name to a HTML tag name" do
    @field.tag_name_attribute.should == "child[#{@field_name}]"
  end

  it "should have form type" do
    @field.type.should == "radio_button"
    @field.form_type.should == "multiple_choice"
  end

  it "should create options from text" do
    field = Field.new :display_name => "something", :option_strings_text => "Tim\nRob Smith"
    field['option_strings_text'].should == nil
    expect(field.option_strings_text).to eq([{"id"=>"tim", "display_text"=>"Tim"}, {"id"=>"rob_smith", "display_text"=>"Rob Smith"}])
  end

  it "should have display name with hidden text if not visible" do
    @field.display_name = "pokpok"
    @field.visible = false

    @field.display_name_for_field_selector.should == "pokpok (Hidden)"

  end

  describe "valid?" do

    it "should not allow blank display name" do
      field = Field.new(:display_name => "")
      form_section = FormSection.new(:parent_form => "case")
      form_section.fields = [field]
      expect(field.valid?).to be false
      field.errors[:display_name].should be_present
    end

    it "should not allow display name without alphabetic characters" do
      field = Field.new(:display_name => "!@£$@")
      form_section = FormSection.new(:parent_form => "case")
      form_section.fields = [field]
      field.valid?.should == false
      field.errors[:display_name].should include("Display name must contain at least one alphabetic characters")
    end

    it "should not allow blank name" do
      field = Field.new(:display_name => "ABC 123", :name => "")
      form_section = FormSection.new(:parent_form => "case")
      form_section.fields = [field]
      expect(field.valid?).to be false
      expect(field.errors[:name].first).to eq "Field name must not be blank"
    end

    it "should not allow capital letters in name" do
      field = Field.new(:display_name => "ABC 123", :name => "Abc_123")
      form_section = FormSection.new(:parent_form => "case")
      form_section.fields = [field]
      expect(field.valid?).to be false
      expect(field.errors[:name].first).to eq "Field name must contain only lower case alphabetic characters, numbers, and underscores"
    end

    it "should not allow special characters in name" do
      field = Field.new(:display_name => "ABC 123", :name => "a$bc_123")
      form_section = FormSection.new(:parent_form => "case")
      form_section.fields = [field]
      expect(field.valid?).to be false
      expect(field.errors[:name].first).to eq "Field name must contain only lower case alphabetic characters, numbers, and underscores"
    end

    it "should not allow name to start with a number" do
      field = Field.new(:display_name => "ABC 123", :name => "1abc_123")
      form_section = FormSection.new(:parent_form => "case")
      form_section.fields = [field]
      expect(field.valid?).to be false
      expect(field.errors[:name].first).to eq "Field name cannot start with a number"
    end

    it "should allow alphabetic characters numbers and underscore in name" do
      field = Field.new(:display_name => "ABC 123", :name => "abc_123")
      form_section = FormSection.new(:parent_form => "case")
      form_section.fields = [field]
      expect(field.valid?).to be true
    end

    it "should allow alphabetic only in name" do
      field = Field.new(:display_name => "ABC 123", :name => "abc")
      form_section = FormSection.new(:parent_form => "case")
      form_section.fields = [field]
      expect(field.valid?).to be true
    end

    it "should allow alphabetic and numeric only in name" do
      field = Field.new(:display_name => "ABC 123", :name => "abc123")
      form_section = FormSection.new(:parent_form => "case")
      form_section.fields = [field]
      expect(field.valid?).to be true
    end

    it "should validate radio button has at least 2 options" do
      field = Field.new(:display_name => "test", :option_strings => ["test"], :type => Field::RADIO_BUTTON)
      form_section = FormSection.new(:parent_form => "case")
      form_section.fields = [field]

      field.valid?
      field.errors[:option_strings].should ==  ["Field must have at least 2 options"]
    end

    describe 'select box option strings' do
      before :each do
        @field = Field.new(name: 'test', display_name: 'test', type: Field::SELECT_BOX)
      end

      context 'with no options' do
        it 'is not valid' do
          expect(@field.valid?).to be_falsey
          expect(@field.errors.messages[:option_strings]).to eq(['Field must have at least 2 options'])
        end
      end

      context 'with only 1 option' do
        before do
          @field.option_strings_text = ["test"]
        end
        it 'is not valid' do
          expect(@field.valid?).to be_falsey
          expect(@field.errors.messages[:option_strings]).to eq(['Field must have at least 2 options'])
        end
      end

      context 'with multiple options' do
        before do
          @field.option_strings_text_en = [
              {id: 'option_1', display_text: "Test Option 1"},
              {id: 'option_2', display_text: "Test Option 2"},
              {id: 'option_3', display_text: "Test Option 3"}
          ].map(&:with_indifferent_access)
        end

        it 'is valid' do
          expect(@field.valid?).to be_truthy
        end

        context 'and some options have blank id' do
          before do
            @field.option_strings_text_en << {id: '', display_text: "Test Option 1"}.with_indifferent_access
          end

          it 'is not valid' do
            expect(@field.valid?).to be_falsey
            expect(@field.errors.messages[:option_strings_text]).to eq(['Option Strings Text option id is blank'])
          end
        end

        context 'and some options have blank description' do
          before do
            @field.option_strings_text_en << {id: 'option_4', display_text: ""}.with_indifferent_access
          end

          it 'is not valid' do
            expect(@field.valid?).to be_falsey
            expect(@field.errors.messages[:option_strings_text]).to eq(['Option Strings Text option display text is blank'])
          end
        end

        describe 'translations' do
          context 'and translated options are missing some options' do
            before do
              @field.option_strings_text_fr = [
                  {id: 'option_1', display_text: "Test Option 1"},
                  {id: 'option_2', display_text: "Test Option 2"}
              ].map(&:with_indifferent_access)
            end

            it 'is not valid' do
              expect(@field.valid?).to be_falsey
              expect(@field.errors.messages[:option_strings_text]).to eq(['Field translated options must have same ids'])
            end
          end

          context 'and translated options have extra options' do
            before do
              @field.option_strings_text_fr = [
                  {id: 'option_1', display_text: "Test Option 1"},
                  {id: 'option_2', display_text: "Test Option 2"},
                  {id: 'option_3', display_text: "Test Option 3"},
                  {id: 'option_4', display_text: "Test Option 4"}
              ].map(&:with_indifferent_access)
            end

            it 'is not valid' do
              expect(@field.valid?).to be_falsey
              expect(@field.errors.messages[:option_strings_text]).to eq(['Field translated options must have same ids'])
            end
          end

          context 'and translated options have different options' do
            before do
              @field.option_strings_text_fr = [
                  {id: 'foo', display_text: "Test Option Foo"},
                  {id: 'bar', display_text: "Test Option Bar"},
                  {id: 'baz', display_text: "Test Option Baz"}
              ].map(&:with_indifferent_access)
            end

            it 'is not valid' do
              expect(@field.valid?).to be_falsey
              expect(@field.errors.messages[:option_strings_text]).to eq(['Field translated options must have same ids'])
            end
          end

          context 'and translated options have the same options as the default locale' do
            before do
              @field.option_strings_text_fr = [
                  {id: 'option_1', display_text: "Test French Option 1"},
                  {id: 'option_2', display_text: "Test French Option 2"},
                  {id: 'option_3', display_text: "Test French Option 3"}
              ].map(&:with_indifferent_access)
            end

            it 'is valid' do
              expect(@field.valid?).to be_truthy
            end
          end

          context 'and translated options have the same options as the default locale in a different order' do
            before do
              @field.option_strings_text_fr = [
                  {id: 'option_2', display_text: "Test French Option 2"},
                  {id: 'option_1', display_text: "Test French Option 1"},
                  {id: 'option_3', display_text: "Test French Option 3"}
              ].map(&:with_indifferent_access)
            end

            it 'is valid' do
              expect(@field.valid?).to be_truthy
            end
          end

          context 'and some translated options have blank description' do
            before do
              @field.option_strings_text_fr = [
                  {id: 'option_1', display_text: "Test French Option 1"},
                  {id: 'option_2', display_text: ""},
                  {id: 'option_3', display_text: ""}
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

  describe "save" do
    it "should set visible" do
      field = Field.new(:name => "diff_field", :display_name => "diff_field", :visible => "true")
      form = FormSection.new(:fields => [field], :name => "test_form")

      form.save!

      form.fields.first.should be_visible
    end
  end

  describe "default_value" do
    it "should be empty string for text entry, radio, audio, photo and select fields" do
      Field.new(:type=>Field::TEXT_FIELD).default_value.should == ""
      Field.new(:type=>Field::NUMERIC_FIELD).default_value.should == ""
      Field.new(:type=>Field::TEXT_AREA).default_value.should == ""
      Field.new(:type=>Field::DATE_FIELD).default_value.should == ""
      Field.new(:type=>Field::RADIO_BUTTON).default_value.should == ""
      Field.new(:type=>Field::SELECT_BOX).default_value.should == ""
    end

    it "should be nil for photo/audio upload boxes" do
      Field.new(:type=>Field::PHOTO_UPLOAD_BOX).default_value.should be_nil
      Field.new(:type=>Field::AUDIO_UPLOAD_BOX).default_value.should be_nil
    end

    it "should raise an error if can't find a default value for this field type" do
      expect {Field.new(:type=>"INVALID_FIELD_TYPE").default_value}.to raise_error(RuntimeError, 'Cannot find default value for type INVALID_FIELD_TYPE')
    end
  end

  describe "highlight information" do

    it "should initialize with empty highlight information" do
      field = Field.new(:name => "No highlight")
      field.is_highlighted?.should be_falsey
    end

    it "should set highlight information" do
      field = Field.new(:name => "highlighted")
      field.highlight_with_order 6
      field.is_highlighted?.should be_truthy
    end

    it "should unhighlight a field" do
      field = Field.new(:name => "new highlighted")
      field.highlight_with_order 1
      field.unhighlight
      field.is_highlighted?.should be_falsey
    end
  end

  describe "display_text" do
    context 'when field is a select field' do
      before :each do
        @select_field = Field.new({'name' => "my_select_field",
                            'type' => "select_box",
                            'display_name_all' => "My Select Field",
                            'option_strings_text_en' => [{id: 'option_one', display_text: "Option One"}.with_indifferent_access,
                                                         {id: 'option_two', display_text: "Option Two"}.with_indifferent_access,
                                                         {id: 'option_three', display_text: "Option Three"}.with_indifferent_access],
                            'option_strings_text_fr' => [{id: 'option_one', display_text: "French One"}.with_indifferent_access,
                                                         {id: 'option_two', display_text: "French Two"}.with_indifferent_access,
                                                         {id: 'option_three', display_text: "French Three"}.with_indifferent_access],
                            'option_strings_text_es' => [{id: 'option_one', display_text: "Spanish One"}.with_indifferent_access,
                                                         {id: 'option_two', display_text: "Spanish Two"}.with_indifferent_access,
                                                         {id: 'option_three', display_text: "Spanish Three"}.with_indifferent_access],
                            'option_strings_text_ar' => [{id: 'option_one', display_text: "Arabic One"}.with_indifferent_access,
                                                         {id: 'option_two', display_text: "Arabic Two"}.with_indifferent_access,
                                                         {id: 'option_three', display_text: "Arabic Three"}.with_indifferent_access]
                           })
      end

      context 'and locale is English' do
        it 'returns the translated display text' do
          expect(@select_field.display_text('option_two')).to eq('Option Two')
        end
      end
      context 'and locale is French' do
        before :each do
          I18n.locale = "fr"
        end
        it 'returns the translated display text' do
          expect(@select_field.display_text('option_two')).to eq('French Two')
        end
      end
      context 'and locale is Spanish' do
        before :each do
          I18n.locale = "es"
        end
        it 'returns the translated display text' do
          expect(@select_field.display_text('option_two')).to eq('Spanish Two')
        end
      end
      context 'and locale is Arabic' do
        before :each do
          I18n.locale = "ar"
        end
        it 'returns the translated display text' do
          expect(@select_field.display_text('option_two')).to eq('Arabic Two')
        end
      end
    end

    context 'when field is a lookup select field' do
      before do
        Lookup.all.each(&:destroy)
        @lookup = Lookup.create!(id: 'lookup-ethnicity',
                                 name: 'Ethnicity',
                                 lookup_values_en: [{:id => "ethnicity_one", :display_text => "Ethnicity One"},
                                                    {:id => "ethnicity_two", :display_text => "Ethnicity Two"},
                                                    {:id => "ethnicity_three", :display_text => "Ethnicity Three"},
                                                    {:id => "ethnicity_four", :display_text => "Ethnicity Four"},
                                                    {:id => "ethnicity_five", :display_text => "Ethnicity Five"}],
                                 lookup_values_fr: [{:id => "ethnicity_one", :display_text => "French Ethnicity One"},
                                                    {:id => "ethnicity_two", :display_text => "French Ethnicity Two"},
                                                    {:id => "ethnicity_three", :display_text => "French Ethnicity Three"},
                                                    {:id => "ethnicity_four", :display_text => "French Ethnicity Four"},
                                                    {:id => "ethnicity_five", :display_text => "French Ethnicity Five"}],
                                 lookup_values_es: [{:id => "ethnicity_one", :display_text => "Spanish Ethnicity One"},
                                                    {:id => "ethnicity_two", :display_text => "Spanish Ethnicity Two"},
                                                    {:id => "ethnicity_three", :display_text => "Spanish Ethnicity Three"},
                                                    {:id => "ethnicity_four", :display_text => "Spanish Ethnicity Four"},
                                                    {:id => "ethnicity_five", :display_text => "Spanish Ethnicity Five"}],
                                 lookup_values_ar: [{:id => "ethnicity_one", :display_text => "Arabic Ethnicity One"},
                                                    {:id => "ethnicity_two", :display_text => "Arabic Ethnicity Two"},
                                                    {:id => "ethnicity_three", :display_text => "Arabic Ethnicity Three"},
                                                    {:id => "ethnicity_four", :display_text => "Arabic Ethnicity Four"},
                                                    {:id => "ethnicity_five", :display_text => "Arabic Ethnicity Five"}]
        )
      end
      before :each do
        @lookup_field = Field.new({'name' => "my_lookup_field",
                                   'type' => "select_box",
                                   'display_name_all' => "My Lookup Field",
                                   'option_strings_source' => 'lookup lookup-ethnicity'
                                  })
      end

      context 'and locale is English' do
        it 'returns the translated display text' do
          expect(@lookup_field.display_text('ethnicity_four')).to eq('Ethnicity Four')
        end
      end
      context 'and locale is French' do
        before :each do
          I18n.locale = "fr"
        end
        it 'returns the translated display text' do
          expect(@lookup_field.display_text('ethnicity_four')).to eq('French Ethnicity Four')
        end
      end
      context 'and locale is Spanish' do
        before :each do
          I18n.locale = "es"
        end
        it 'returns the translated display text' do
          expect(@lookup_field.display_text('ethnicity_four')).to eq('Spanish Ethnicity Four')
        end
      end
      context 'and locale is Arabic' do
        before :each do
          I18n.locale = "ar"
        end
        it 'returns the translated display text' do
          expect(@lookup_field.display_text('ethnicity_four')).to eq('Arabic Ethnicity Four')
        end
      end
    end

    context 'when field is a yes/no field' do
      before do
        Lookup.all.each(&:destroy)
        @lookup = Lookup.create!(:id => "lookup-yes-no",
                                 :name => "Yes or No",
                                 :lookup_values_en => [{id: "true", display_text: "Yes"}.with_indifferent_access,
                                                       {id: "false", display_text: "No"}.with_indifferent_access],
                                 :lookup_values_fr => [{id: "true", display_text: "French Yes"}.with_indifferent_access,
                                                       {id: "false", display_text: "French No"}.with_indifferent_access],
                                 :lookup_values_es => [{id: "true", display_text: "Spanish Yes"}.with_indifferent_access,
                                                       {id: "false", display_text: "Spanish No"}.with_indifferent_access],
                                 :lookup_values_ar => [{id: "true", display_text: "Arabic Yes"}.with_indifferent_access,
                                                       {id: "false", display_text: "Arabic No"}.with_indifferent_access]
        )
      end

      before :each do
        @lookup_field = Field.new({'name' => "my_lookup_field",
                                   'type' => "select_box",
                                   'display_name_all' => "My Yes No Field",
                                   'option_strings_source' => 'lookup lookup-yes-no'
                                  })
      end

      context 'and value is true' do
        before :each do
          @field_value = true
        end

        context 'and locale is English' do
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('Yes')
          end
        end
        context 'and locale is French' do
          before :each do
            I18n.locale = "fr"
          end
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('French Yes')
          end
        end
        context 'and locale is Spanish' do
          before :each do
            I18n.locale = "es"
          end
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('Spanish Yes')
          end
        end
        context 'and locale is Arabic' do
          before :each do
            I18n.locale = "ar"
          end
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('Arabic Yes')
          end
        end
      end
      context 'and value is false' do
        before :each do
          @field_value = false
        end

        context 'and locale is English' do
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('No')
          end
        end
        context 'and locale is French' do
          before :each do
            I18n.locale = "fr"
          end
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('French No')
          end
        end
        context 'and locale is Spanish' do
          before :each do
            I18n.locale = "es"
          end
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('Spanish No')
          end
        end
        context 'and locale is Arabic' do
          before :each do
            I18n.locale = "ar"
          end
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('Arabic No')
          end
        end
      end
      context 'and value is nil' do
        before :each do
          @field_value = nil
        end

        context 'and locale is English' do
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('')
          end
        end
        context 'and locale is French' do
          before :each do
            I18n.locale = "fr"
          end
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('')
          end
        end
        context 'and locale is Spanish' do
          before :each do
            I18n.locale = "es"
          end
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('')
          end
        end
        context 'and locale is Arabic' do
          before :each do
            I18n.locale = "ar"
          end
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('')
          end
        end
      end
    end
    context 'when field is a yes/no/unknown field' do
      before do
        Lookup.all.each(&:destroy)
        @lookup = Lookup.create!(:id => "lookup-yes-no-unknown",
                                 :name => "Yes or No",
                                 :lookup_values_en => [{id: "true", display_text: "Yes"}.with_indifferent_access,
                                                       {id: "false", display_text: "No"}.with_indifferent_access,
                                                       {id: 'default_convert_unknown_id_to_nil', display_text: "Unknown"}.with_indifferent_access],
                                 :lookup_values_fr => [{id: "true", display_text: "French Yes"}.with_indifferent_access,
                                                       {id: "false", display_text: "French No"}.with_indifferent_access,
                                                       {id: 'default_convert_unknown_id_to_nil', display_text: "French Unknown"}.with_indifferent_access],
                                 :lookup_values_es => [{id: "true", display_text: "Spanish Yes"}.with_indifferent_access,
                                                       {id: "false", display_text: "Spanish No"}.with_indifferent_access,
                                                       {id: 'default_convert_unknown_id_to_nil', display_text: "Spanish Unknown"}.with_indifferent_access],
                                 :lookup_values_ar => [{id: "true", display_text: "Arabic Yes"}.with_indifferent_access,
                                                       {id: "false", display_text: "Arabic No"}.with_indifferent_access,
                                                       {id: 'default_convert_unknown_id_to_nil', display_text: "Arabic Unknown"}.with_indifferent_access]
        )
      end

      before :each do
        @lookup_field = Field.new({'name' => "my_lookup_field",
                                   'type' => "select_box",
                                   'display_name_all' => "My Yes No Field",
                                   'option_strings_source' => 'lookup lookup-yes-no-unknown'
                                  })
      end

      context 'and value is true' do
        before :each do
          @field_value = true
        end

        context 'and locale is English' do
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('Yes')
          end
        end
        context 'and locale is French' do
          before :each do
            I18n.locale = "fr"
          end
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('French Yes')
          end
        end
        context 'and locale is Spanish' do
          before :each do
            I18n.locale = "es"
          end
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('Spanish Yes')
          end
        end
        context 'and locale is Arabic' do
          before :each do
            I18n.locale = "ar"
          end
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('Arabic Yes')
          end
        end
      end
      context 'and value is false' do
        before :each do
          @field_value = false
        end

        context 'and locale is English' do
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('No')
          end
        end
        context 'and locale is French' do
          before :each do
            I18n.locale = "fr"
          end
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('French No')
          end
        end
        context 'and locale is Spanish' do
          before :each do
            I18n.locale = "es"
          end
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('Spanish No')
          end
        end
        context 'and locale is Arabic' do
          before :each do
            I18n.locale = "ar"
          end
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('Arabic No')
          end
        end
      end
      context 'and value is nil' do
        before :each do
          @field_value = nil
        end

        context 'and locale is English' do
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('Unknown')
          end
        end
        context 'and locale is French' do
          before :each do
            I18n.locale = "fr"
          end
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('French Unknown')
          end
        end
        context 'and locale is Spanish' do
          before :each do
            I18n.locale = "es"
          end
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('Spanish Unknown')
          end
        end
        context 'and locale is Arabic' do
          before :each do
            I18n.locale = "ar"
          end
          it 'returns the translated display text' do
            expect(@lookup_field.display_text(@field_value)).to eq('Arabic Unknown')
          end
        end
      end
    end
  end

  describe "I18n" do

    it "should set the value of system language for the given field" do
      I18n.default_locale = "fr"
      field = Field.new(:name => "first name", :display_name => "first name in french",
                        :help_text => "help text in french",
                        :option_strings_text => "option string in french")
      field.display_name_fr.should == "first name in french"
      field.help_text_fr.should == "help text in french"
      expect(field.option_strings_text_fr).to eq([{"id"=>"option_string_in_french", "display_text"=>"option string in french"}])
    end


    it "should get the value of system language for the given field" do
      I18n.locale = "fr"
      field = Field.new(:name => "first name", :display_name_fr => "first name in french", :display_name_en => "first name in english",
                        :help_text_en => "help text in english", :help_text_fr => "help text in french",
                        :option_strings_text_en => [{id: "opt1", display_text: "option string in english"}.with_indifferent_access],
                        :option_strings_text_fr => [{id: "opt1", display_text: "option string in french"}.with_indifferent_access])
      field.display_name.should == field.display_name_fr
      field.help_text.should == field.help_text_fr
      field.option_strings_text.should == field.option_strings_text_fr
    end

    it "should fetch the default locale's value if translation is not available for given locale" do
      I18n.locale = "fr"
      field = Field.new(:name => "first name", :display_name_en => "first name in english",
                        :help_text_en => "help text in english", :help_text_fr => "help text in french",
                        :option_strings_text_en => [{id: "opt1", display_text: "option string in english"}.with_indifferent_access],
                        :option_strings_text_fr => [{id: "opt1", display_text: "option string in french"}.with_indifferent_access])
      field.display_name.should == field.display_name_en
      field.help_text.should == field.help_text_fr
      field.option_strings_text.should == field.option_strings_text_fr
    end

  end
  describe "formatted hash" do

    it "should combine the field_name_translation into hash" do
      field = Field.new(:name => "first name", :display_name_en => "first name in english",
                        :help_text_en => "help text in english", :help_text_fr => "help text in french")

      field_hash = field.formatted_hash
      field_hash["display_name"].should == {"en" => "first name in english"}
      field_hash["help_text"].should == {"en" => "help text in english", "fr" => "help text in french"}
    end

  end

  describe "normalize line endings" do
    it "should convert \\r\\n to \\n" do
      field = Field.new :name => "test", :display_name_en => "test", :option_strings_text => "Uganda\r\nSudan"
      expect(field.option_strings_text).to eq([{"id"=>"uganda", "display_text"=>"Uganda"}, {"id"=>"sudan", "display_text"=>"Sudan"}])
    end

    it "should use \\n as it is" do
      field = Field.new :name => "test", :display_name_en => "test", :option_strings_text => "Uganda\nSudan"
      expect(field.option_strings_text).to eq([{"id"=>"uganda", "display_text"=>"Uganda"}, {"id"=>"sudan", "display_text"=>"Sudan"}])
    end
  end

  it "should show that the field is new until the field is saved" do
     form = FormSection.create! :name => 'test_form', :unique_id => 'test_form'
     field = Field.new :name => "test_field", :display_name_en => "test_field", :type=>Field::TEXT_FIELD
     expect(field.new?).to be_truthy
     FormSection.add_field_to_formsection form, field
     expect(field.new?).to be_falsey
  end

  it "should show that the field is new after the field fails validation" do
    form = FormSection.create! :name => 'test_form2', :unique_id => 'test_form'
    field = Field.new :name => "test_field2", :display_name_en => "test_field", :type=>Field::TEXT_FIELD
    FormSection.add_field_to_formsection form, field
    #Adding duplicate field.
    field = Field.new :name => "test_field2", :display_name_en => "test_field", :type=>Field::TEXT_FIELD
    FormSection.add_field_to_formsection form, field
    expect(field.errors.length).to be > 0
    field.errors[:name].should == ["Field already exists on this form"]
    expect(field.new?).to be_truthy
  end

  it "should fails save because fields are duplicated and fields remains as new" do
    #Try to create a FormSection with duplicate fields. That will make fails the save.
    fields = [Field.new(:name => "test_field2", :display_name_en => "test_field", :type=>Field::TEXT_FIELD),
              Field.new(:name => "test_field2", :display_name_en => "test_field", :type=>Field::TEXT_FIELD)]
    form = FormSection.create :name => 'test_form2', :unique_id => 'test_form', :fields => fields
    expect(fields.first.errors.length).to be > 0
    fields.first.errors[:name].should == ["Field already exists on this form"]
    expect(fields.last.errors.length).to be > 0
    fields.last.errors[:name].should == ["Field already exists on this form"]
    #Because it fails save, field remains new.
    expect(fields.first.new?).to be_truthy
    expect(fields.last.new?).to be_truthy
  end

  it "should fails save because fields changes make them duplicate" do
    #Create the FormSection with two valid fields.
    fields = [Field.new(:name => "test_field1", :display_name_en => "test_field1", :type=>Field::TEXT_FIELD),
              Field.new(:name => "test_field2", :display_name_en => "test_field2", :type=>Field::TEXT_FIELD)]
    form = FormSection.create :name => 'test_form2', :unique_id => 'test_form', :fields => fields
    expect(fields.first.errors.length).to be == 0
    expect(fields.first.new?).to be_falsey
    expect(fields.last.errors.length).to be == 0
    expect(fields.last.new?).to be_falsey

    #Update the first one to have the same name of the second,
    #This make fails saving the FormSection.
    fields.first.name = fields.last.name
    form.save
    expect(form.errors.length).to be > 0
    expect(fields.first.errors.length).to be > 0
    fields.first.errors[:name].should == ["Field already exists on this form"]

    #because field already came from the database should remains false
    expect(fields.first.new?).to be_falsey
    expect(fields.last.new?).to be_falsey

    #Fix the field and save again
    fields.first.name ="something_else"
    form.save
    expect(form.errors.length).to be == 0
  end

  describe "showable?" do
    context "when visible is set to false" do
      it "should be false if hide_on_view_page is not set" do
        field = Field.new(:display_name => "ABC 123", :name => "abc123", :visible => false)
        expect(field.showable?).to be false
      end

      it "should be false if hide_on_view_page is set to false" do
        field = Field.new(:display_name => "ABC 123", :name => "abc123", :visible => false, :hide_on_view_page => false)
        expect(field.showable?).to be false
      end

      it "should be false if hide_on_view_page is set to true" do
        field = Field.new(:display_name => "ABC 123", :name => "abc123", :visible => false, :hide_on_view_page => true)
        expect(field.showable?).to be false
      end
    end

    context "when visible is set to true" do
      it "should be true if hide_on_view_page is not set" do
        field = Field.new(:display_name => "ABC 123", :name => "abc123", :visible => true)
        expect(field.showable?).to be true
      end

      it "should be true if hide_on_view_page is set to false" do
        field = Field.new(:display_name => "ABC 123", :name => "abc123", :visible => true, :hide_on_view_page => false)
        expect(field.showable?).to be true
      end

      it "should be false if hide_on_view_page is set to true" do
        field = Field.new(:display_name => "ABC 123", :name => "abc123", :visible => true, :hide_on_view_page => true)
        expect(field.showable?).to be false
      end
    end

    context "when visible is not set" do
      it "should be true if hide_on_view_page is not set" do
        field = Field.new(:display_name => "ABC 123", :name => "abc123")
        expect(field.showable?).to be true
      end

      it "should be true if hide_on_view_page is set to false" do
        field = Field.new(:display_name => "ABC 123", :name => "abc123", :hide_on_view_page => false)
        expect(field.showable?).to be true
      end

      it "should be false if hide_on_view_page is set to true" do
        field = Field.new(:display_name => "ABC 123", :name => "abc123", :hide_on_view_page => true)
        expect(field.showable?).to be false
      end
    end
  end

  describe 'is_location?' do
    context 'when it is a select field' do
      context 'and option_strings_source is Location' do
        it 'should be true' do
          field = Field.new({"name" => "test_location",
                             "type" => "select_box",
                             "display_name_all" => "My Test Field",
                             "option_strings_source" => "Location"
                            })
          expect(field.is_location?).to be_truthy
        end
      end

      context 'and option_strings_source is not Location' do
        it 'should be false' do
          field = Field.new({"name" => "test_not_location",
                             "type" => "select_box",
                             "display_name_all" => "My Test Field",
                             "option_strings_source" => "lookup lookup-country"
                            })
          expect(field.is_location?).to be_falsey
        end
      end

      context 'and option_strings_source is empty' do
        it 'should be false' do
          field = Field.new({"name" => "test_not_location",
                             "type" => "select_box",
                             "display_name_all" => "My Test Field",
                             "option_strings" => "yes\nno"
                            })
          expect(field.is_location?).to be_falsey
        end

      end

    end

    context 'when it is not a select field' do
      it 'should be false' do
        field = Field.new({"name" => "test_field",
                           "type" => "text_field",
                           "display_name_all" => "My Test Field"
                          })
        expect(field.is_location?).to be_falsey
      end
    end
  end

  describe "all location field names" do
    before do
      FormSection.all.each &:destroy

      fields = [
          Field.new({"name" => "field_name_1",
                     "type" => "text_field",
                     "display_name_all" => "Field Name 1"
                    }),
          Field.new({"name" => "field_name_2",
                     "type" => "text_field",
                     "display_name_all" => "Field Name 2"
                    })
      ]
      @form_0 = FormSection.create(
          :unique_id => "form_section_no_locations",
          :parent_form=>"case",
          "visible" => true,
          :order_form_group => 1,
          :order => 1,
          :order_subform => 0,
          :form_group_name => "Form Section Test",
          "editable" => true,
          "name_all" => "Form Section No Locations",
          "description_all" => "Form Section No Locations",
          :fields => fields
      )

      fields = [
          Field.new({"name" => "test_location_1",
                     "type" => "select_box",
                     "display_name_all" => "Test Location 1",
                     "option_strings_source" => "Location"
                    }),
          Field.new({"name" => "field_name_1",
                     "type" => "text_field",
                     "display_name_all" => "Field Name 1"
                    }),
          Field.new({"name" => "field_name_2",
                     "type" => "text_field",
                     "display_name_all" => "Field Name 2"
                    }),
          Field.new({"name" => "test_country",
                     "type" => "select_box",
                     "display_name_all" => "My Test Country",
                     "option_strings_source" => "lookup lookup-country"
                    })
      ]
      @form_1 = FormSection.create(
          :unique_id => "form_section_one_location",
          :parent_form=>"case",
          "visible" => true,
          :order_form_group => 1,
          :order => 1,
          :order_subform => 0,
          :form_group_name => "Form Section Test",
          "editable" => true,
          "name_all" => "Form Section One Location",
          "description_all" => "Form Section One Location",
          :fields => fields
      )

      fields = [
          Field.new({"name" => "test_location_2",
                     "type" => "select_box",
                     "display_name_all" => "Test Location 2",
                     "option_strings_source" => "Location"
                    }),
          Field.new({"name" => "test_location_3",
                     "type" => "select_box",
                     "display_name_all" => "Test Location 3",
                     "option_strings_source" => "Location"
                    }),
          Field.new({"name" => "field_name_1",
                     "type" => "text_field",
                     "display_name_all" => "Field Name 1"
                    }),
          Field.new({"name" => "field_name_2",
                     "type" => "text_field",
                     "display_name_all" => "Field Name 2"
                    }),
          Field.new({"name" => "test_yes_no",
                     "type" => "select_box",
                     "display_name_all" => "My Test Field",
                     "option_strings_text_all" => "yes\nno"
                    }),
          Field.new({"name" => "test_country",
                     "type" => "select_box",
                     "display_name_all" => "My Test Country",
                     "option_strings_source" => "lookup lookup-country"
                    })
      ]
      @form_2 = FormSection.create(
          :unique_id => "form_section_two_locations",
          :parent_form=>"tracing_request",
          "visible" => true,
          :order_form_group => 1,
          :order => 1,
          :order_subform => 0,
          :form_group_name => "Form Section Test",
          "editable" => true,
          "name_all" => "Form Section Two Locations",
          "description_all" => "Form Section Two Locations",
          :fields => fields
      )

      fields = [
          Field.new({"name" => "test_location_4",
                     "type" => "select_box",
                     "display_name_all" => "Test Location 4",
                     "option_strings_source" => "Location"
                    }),
          Field.new({"name" => "test_location_5",
                     "type" => "select_box",
                     "display_name_all" => "Test Location 5",
                     "option_strings_source" => "Location"
                    }),
          Field.new({"name" => "field_name_1",
                     "type" => "text_field",
                     "display_name_all" => "Field Name 1"
                    }),
          Field.new({"name" => "field_name_2",
                     "type" => "text_field",
                     "display_name_all" => "Field Name 2"
                    }),
          Field.new({"name" => "test_location_6",
                     "type" => "select_box",
                     "display_name_all" => "Test Location 6",
                     "option_strings_source" => "Location"
                    })
      ]
      @form_3 = FormSection.create(
          :unique_id => "form_section_three_locations",
          :parent_form=>"tracing_request",
          "visible" => true,
          :order_form_group => 1,
          :order => 1,
          :order_subform => 0,
          :form_group_name => "Form Section Test",
          "editable" => true,
          "name_all" => "Form Section Three Locations",
          "description_all" => "Form Section Three Locations",
          :fields => fields
      )

      fields = [
          Field.new({"name" => "test_location_7",
                     "type" => "select_box",
                     "display_name_all" => "Test Location 7",
                     "option_strings_source" => "Location"
                    }),
          Field.new({"name" => "test_location_8",
                     "type" => "select_box",
                     "display_name_all" => "Test Location 8",
                     "option_strings_source" => "Location"
                    }),
          Field.new({"name" => "field_name_1",
                     "type" => "text_field",
                     "display_name_all" => "Field Name 1"
                    }),
          Field.new({"name" => "field_name_2",
                     "type" => "text_field",
                     "display_name_all" => "Field Name 2"
                    }),
          Field.new({"name" => "test_location_9",
                     "type" => "select_box",
                     "display_name_all" => "Test Location 9",
                     "option_strings_source" => "Location"
                    }),
          Field.new({"name" => "test_location_10",
                     "type" => "select_box",
                     "display_name_all" => "Test Location 10",
                     "option_strings_source" => "Location"
                    })
      ]
      @form_4 = FormSection.create(
          :unique_id => "form_section_four_locations",
          :parent_form=>"incident",
          "visible" => true,
          :order_form_group => 1,
          :order => 1,
          :order_subform => 0,
          :form_group_name => "Form Section Test",
          "editable" => true,
          "name_all" => "Form Section Four Locations",
          "description_all" => "Form Section Four Locations",
          :fields => fields
      )
    end

    after :all do
      FormSection.all.each &:destroy
    end

    context "when parent form is not passed in" do
      it "returns the forms for case" do
        expect(Field.all_location_field_names).to match_array ['test_location_1']
      end
    end

    context "when parent form is case" do
      it "returns the forms" do
        expect(Field.all_location_field_names('case')).to match_array ['test_location_1']
      end
    end

    context "when parent form is tracing_request" do
      it "returns the forms" do
        expect(Field.all_location_field_names('tracing_request')).to match_array ['test_location_2', 'test_location_3',
                                                                             'test_location_4', 'test_location_5',
                                                                             'test_location_6']
      end
    end

    context "when parent form is incident" do
      it "returns the forms" do
        expect(Field.all_location_field_names('incident')).to match_array ['test_location_7', 'test_location_8',
                                                                      'test_location_9', 'test_location_10']
      end
    end

  end


  describe "options_list" do
    before do

      @english_options = [{'id' => "option_1", 'display_text' => "EN1"}, {'id' => "option_2", 'display_text' => "EN2"}, {'id' => "option_3", 'display_text' => "EN3"}]
      @french_options = [{'id' => "option_1", 'display_text' => "FR1"}, {'id' => "option_2", 'display_text' => "FR2"}, {'id' => "option_3", 'display_text' => "FR3"}]
      @arabic_options = [{'id' => "option_1", 'display_text' => "AR1"}, {'id' => "option_2", 'display_text' => "AR2"}, {'id' => "option_3", 'display_text' => ""}]
      @spanish_options = [{'id' => "option_1", 'display_text' => ""}, {'id' => "option_2", 'display_text' => ""}, {'id' => "option_3", 'display_text' => ""}]
    end

    context "when using option_strings_text" do
      before do
        @field_options = Field.new({"name" => "field_with_options",
                                    "type" => "select_box",
                                    "display_name_all" => "Field With Options",
                                    "option_strings_text_en" => @english_options,
                                    "option_strings_text_fr" => @french_options,
                                    "option_strings_text_ar" => @arabic_options,
                                    "option_strings_text_es" => @spanish_options
                                   })
      end

      context "and no locale is passed in" do
        it "returns the English version of options" do
          expect(@field_options.options_list(record=nil, lookups=nil, locations=nil, add_lookups=false)).to eq(@english_options)
        end
      end

      context "and a locale is passed in" do
        context "and all options for that locale are populated" do
          it "returns options for the specified locale" do
            expect(@field_options.options_list(record=nil, lookups=nil, locations=nil, add_lookups=false, locale: 'fr')).to eq(@french_options)
          end
        end

        context "and some options for that locale are populated" do
          it "returns options for the specified locale" do
            expect(@field_options.options_list(record=nil, lookups=nil, locations=nil, add_lookups=false, locale: 'ar')).to eq(@arabic_options)
          end
        end

        context "and no options for that locale are populated" do
          it "returns the English version of options" do
            expect(@field_options.options_list(record=nil, lookups=nil, locations=nil, add_lookups=false, locale: 'es')).to eq(@english_options)
          end
        end
      end
    end

    context "when using option_strings_source" do
      before do
        Lookup.all.each &:destroy
        @lookup_multi_locales = Lookup.create!(id: "test", name_en: "English", name_fr: "French", name_ar: "Arabic", lookup_values_en: @english_options, lookup_values_fr: @french_options, lookup_values_ar: @arabic_options)
        @lookup_no_locales = Lookup.create!(id: "default", name: "Default", lookup_values: [{id: "default1", display_text: "Default1"}, {id: "default2", display_text: "default2"}])
        @field_multi_locales = Field.new({"name" => "test_location_4",
                       "type" => "select_box",
                       "display_name_all" => "Test Location 4",
                       "option_strings_source" => "lookup test"
                      })
        @field_no_locales = Field.new({"name" => "test_location_4",
                       "type" => "select_box",
                       "display_name_all" => "Test Location 4",
                       "option_strings_source" => "lookup default"
                      })
      end

      context "and field lookup has many locales" do
        it "should return settings for specified locale" do
          expect(@field_multi_locales.options_list(record=nil, lookups=nil, locations=nil, add_lookups=true, locale: 'ar')).to eq(@arabic_options)
        end
      end

      context "and field is looking up non-specified locale" do
        it "should return the default locale" do
          expect(@field_no_locales.options_list(record=nil, lookups=nil, locations=nil, add_lookups=true, locale: 'ar')[0]["id"]).to eq('default1')
        end
      end
    end
  end

  describe "aggregate or disaggregate with number at the end should be able to match with a field" do
    before do
      FormSection.all.each &:destroy

      fields = [
        Field.new({
          "name" => "field_name",
          "type" => "text_field",
          "display_name_all" => "Field Name"
        })
      ]

      @form_0 = FormSection.create(
        :unique_id => "form_section_name",
        :parent_form=>"case",
        "visible" => true,
        :order_form_group => 1,
        :order => 1,
        :order_subform => 0,
        :form_group_name => "Form Section Test",
        "editable" => true,
        "name_all" => "Form Section Name",
        "description_all" => "Form Section Name",
        :fields => fields
      )
    end
    it "should return a field" do
      expect(Field.find_by_name('field_name1')['name']).to eq('field_name')
    end
  end

  describe "generate option keys for new options added to select fields" do
    before do
      Lookup.all.each &:destroy
      @field_multi_locales = Field.new({
        "name" => "test_location_1",
        "type" => "select_box",
        "display_name_all" => "Test Location 1",
        "option_strings_text_en" => [{id: "", display_text: "option string in english"}.with_indifferent_access],
        "option_strings_text_fr" => [{id: "", display_text: "option string in french"}.with_indifferent_access]
      })
    end

    context "when new field option has values for other locales" do
      it "should add keys that match en version for all locales with values" do
        @field_multi_locales.generate_options_keys
        expect(@field_multi_locales["option_strings_text_en"][0]["id"]).not_to be_empty
        expect(@field_multi_locales["option_strings_text_fr"][0]["id"]).not_to be_empty
        expect(@field_multi_locales["option_strings_text_en"][0]["id"]).to eq(@field_multi_locales["option_strings_text_fr"][0]["id"])
      end
    end
  end
end
