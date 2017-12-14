require 'spec_helper'

describe Lookup do
  it "should not be valid if name is empty" do
    lookup = Lookup.new
    lookup.should_not be_valid
    lookup.errors[:name].should == ["Name must not be blank"]
  end

  it "should not be valid if lookup_values is empty" do
    lookup = Lookup.new
    lookup.should_not be_valid
    lookup.errors[:lookup_values].should == ["Field must have at least 2 options"]
  end

  it "should sanitize and check for lookup values" do
    lookup = Lookup.new(:name => "Name", :lookup_values => [{:id => "", :display_text => ""}]) #Need empty array, can't use %w here.
    lookup.should_not be_valid
    lookup.errors[:lookup_values].should == ["Field must have at least 2 options"]
  end

  it "should have a unique id when the name is the same as an existing lookup" do
    lookup1 = create :lookup, :name => "Unique", :lookup_values => [{:id => "value1", :display_text => "value1"}, {:id => "value2", :display_text => "value2"}]
    lookup2 = create :lookup, :name => "Unique", :lookup_values => [{:id => "value3", :display_text => "value3"}, {:id => "value4", :display_text => "value4"}]
    lookup1.id.should_not == lookup2.id
  end

  it "should titleize lookup name before validating it" do
    lookup = Lookup.new(:name => "should be titleized")
    lookup.valid?
    lookup.name.should == "Should Be Titleized"
  end

  it "should create a valid lookup" do
    Lookup.new(:name => "some_lookup", :lookup_values => [{:id => "value1", :display_text => "value1"}, {:id => "value2", :display_text => "value2"}]).should be_valid
  end

  it "should generate id" do
    Lookup.all.each {|lookup| lookup.destroy}
    lookup = create :lookup, :name => 'test lookup 1234', :id => nil
    lookup.id.should include("lookup-test-lookup-1234")
  end

  describe "get_location_types" do
    before do
      lookup1 = create :lookup, :id => "lookup-location-type", :lookup_values => [{:id => "value1", :display_text => "value1"}, {:id => "value2", :display_text => "value2"}]
    end
    
    it "should return location types" do
      location_types = Lookup.get_location_types
      
      expect(location_types.lookup_values).to eq([
        {"id"=>"value1", "display_text"=>"value1"},
        {"id"=>"value2", "display_text"=>"value2"}
      ])
    end
  end

  describe "check being used" do
    before do
      Lookup.all.each &:destroy
      @lookup = create :lookup, name: 'test lookup', lookup_values: [{:id => "value1", :display_text => "value1"}, {:id => "value2", :display_text => "value2"}]
    end

    context "when not on a form" do
      it "should return that it is not being used" do
        expect(@lookup.is_being_used?).to be_false
      end
    end

    context "when on a form" do
      before do
        @lookup_d = Lookup.create!(id: "d", name: "D", lookup_values: [{id: "d", display_text: "D"}, {id: "dd", display_text: "DD"}, {id: "ddd", display_text: "DDD"}, {id: "dddd", display_text: "DDDD"}])
        text_field = Field.new(name: "text_field", type: Field::TEXT_FIELD, display_name: "My Text Field")
        select_box_field = Field.new(name: "select_box", type: Field::SELECT_BOX, display_name: "My Select Box", option_strings_source: "lookup d" )
        fs = create :form_section, fields: [select_box_field]
      end

      it "should return that it is being used" do
        expect(@lookup_d.is_being_used?).to be_true
      end
    end
  end

  describe "check return when locale is specified" do
    before do
      Lookup.all.each &:destroy
      @lookup_multi_locales = Lookup.create!(id: "test", name_en: "English", name_fr: "French", name_ar: "Arabic", name_es: "Spanish", lookup_values_en: [{id: "en1", display_text: "EN1"}, {id: "en2", display_text: "EN2"}], lookup_values_fr: [{id: "fr1", display_text: "FR1"}, {id: "fr2", display_text: "FR2"}], lookup_values_ar: [{id: "ar1", display_text: "AR1"}, {id: "ar2", display_text: "AR2"}], lookup_values_es: [{id: "es1", display_text: "ES1"}, {id: "es2", display_text: "ES2"}])
      @lookup_no_locales = Lookup.create!(id: "default", name: "Default", lookup_values: [{id: "default1", display_text: "Default1"}, {id: "default2", display_text: "default2"}])
    end

    context "when lookup has many locales" do

      it "should return settings for specified locale" do
        expect(Lookup.values('test',nil,locale:'ar')[0]['id']).to eq('ar1')
      end
    end

    context "when lookup is does not specify all locales" do
      it "should return the default locale for any missing locales" do
        expect(Lookup.values('default',nil,locale:'ar')[0]['id']).to eq('default1')
      end
    end
  end

  describe 'localized_property_hash' do
    before do
      Lookup.all.each &:destroy
      @lookup_multi_locales = Lookup.create!(id: "test", name_en: "English", name_fr: "French", name_ar: "Arabic", name_es: "Spanish",
                                             lookup_values_en: [{id: "option_1", display_text: "English Option 1"}, {id: "option_2", display_text: "English Option 2"}],
                                             lookup_values_fr: [{id: "option_1", display_text: "French Option 1"}, {id: "option_2", display_text: "French Option 2"}],
                                             lookup_values_ar: [{id: "option_1", display_text: "Arabic Option 1"}, {id: "option_2", display_text: "Arabic Option 2"}],
                                             lookup_values_es: [{id: "option_1", display_text: "Spanish Option 1"}, {id: "option_2", display_text: "Spanish Option 2"}])
      @lookup_no_locales = Lookup.create!(id: "default", name: "Default", lookup_values: [{id: "default1", display_text: "Default1"}, {id: "default2", display_text: "default2"}])
    end

    context "when passed locale is en" do
      it "returns a hash of the English values" do
        expected = {"name" => "English",
                    "lookup_values" =>
                        {"option_1" => "English Option 1",
                         "option_2" => "English Option 2"}
        }
        lkp1 = Lookup.get(@lookup_multi_locales.id)
        expect(lkp1.localized_property_hash('en')).to eq(expected)
      end
    end

    context "when passed locale is fr" do
      it "returns a hash of the French values" do
        expected = {"name" => "French",
                    "lookup_values" =>
                        {"option_1" => "French Option 1",
                         "option_2" => "French Option 2"}
        }
        lkp1 = Lookup.get(@lookup_multi_locales.id)
        expect(lkp1.localized_property_hash('fr')).to eq(expected)
      end
    end

    context "when no locale is passed in" do
      it "returns a hash of the English values" do
        expected = {"name" => "English",
                    "lookup_values" =>
                        {"option_1" => "English Option 1",
                         "option_2" => "English Option 2"}
        }
        lkp1 = Lookup.get(@lookup_multi_locales.id)
        expect(lkp1.localized_property_hash).to eq(expected)
      end
    end
  end

  describe 'import_translations' do
    before do
      Lookup.all.each &:destroy
      Lookup.create!(id: "lookup_1", name_en: "English", name_fr: "French", name_ar: "Arabic", name_es: "Spanish",
                     lookup_values_en: [{id: "option_1", display_text: "English Option 1"}, {id: "option_2", display_text: "English Option 2"}],
                     lookup_values_fr: [{id: "option_1", display_text: "French Option 1"}, {id: "option_2", display_text: "French Option 2"}],
                     lookup_values_ar: [{id: "option_1", display_text: "Arabic Option 1"}, {id: "option_2", display_text: "Arabic Option 2"}],
                     lookup_values_es: [{id: "option_1", display_text: "Spanish Option 1"}, {id: "option_2", display_text: "Spanish Option 2"}])
      Lookup.create!(id: "lookup_2", name_en: "English Two",
                     lookup_values_en: [{id: "option_1", display_text: "English Option One"}, {id: "option_2", display_text: "English Option Two"}])
    end

    context "when translations are French" do
      before do
        @locale = 'fr'
        @translated_hash = {"lookup_1" => {"name" => "French Translated",
                                           "lookup_values" => {"option_1"=>"French Option 1 Translated", "option_2"=>"French Option 2 Translated"}},
                            "lookup_2" => {"name" => "French Two Translated",
                                           "lookup_values" => {"option_1"=>"French Option One Translated", "option_2"=>"French Option Two Translated"}}}
      end

      it 'updates the French translations for each lookup' do
        Lookup.import_translations(@translated_hash, @locale)
        lkp1 = Lookup.get('lookup_1')
        lkp2 = Lookup.get('lookup_2')
        expect(lkp1.name_en).to eq('English')
        expect(lkp1.name_fr).to eq('French Translated')
        expect(lkp1.lookup_values_en).to eq([{'id'=>'option_1', 'display_text'=>'English Option 1'}, {'id'=>'option_2', 'display_text'=>'English Option 2'}])
        expect(lkp1.lookup_values_fr).to eq([{'id'=>'option_1', 'display_text'=>'French Option 1 Translated'}, {'id'=>'option_2', 'display_text'=>'French Option 2 Translated'}])

        expect(lkp2.name_en).to eq('English Two')
        expect(lkp2.name_fr).to eq('French Two Translated')
        expect(lkp2.lookup_values_en).to eq([{'id'=>'option_1', 'display_text'=>'English Option One'}, {'id'=>'option_2', 'display_text'=>'English Option Two'}])
        expect(lkp2.lookup_values_fr).to eq([{'id'=>'option_1', 'display_text'=>'French Option One Translated'}, {'id'=>'option_2', 'display_text'=>'French Option Two Translated'}])
      end
    end
  end

end
