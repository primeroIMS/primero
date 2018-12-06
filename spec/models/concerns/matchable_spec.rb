require 'rails_helper'

describe Matchable do

  describe "map_match_field" do
    it "should return test_field field for no MATCH_MAP" do
      expect(Child.map_match_field("test_field")).to eq("test_field")
    end

    it "should return an exact MATCH_MAP" do
      expect(Child.map_match_field("nationality")).to eq('relation_nationality')
    end
  end

  describe "matchable_fields" do
    before do
      Child.all.each &:destroy
      FormSection.all.each &:destroy
      fields = [
          Field.new({"name" => "name",
                     "type" => "text_field",
                     "display_name_all" => "name",
                     "matchable" => true
                    }),
          Field.new({"name" => "name_nickname",
                    "type" => "text_field",
                    "display_name_en" => "Nickname",
                    "matchable" => true
                    }),
          Field.new({"name" => "age",
                     "type" => "numeric_field",
                     "display_name_all" => "Age"
                    })]
      form = FormSection.new(
          :unique_id => "form_section_test",
          :parent_form=>"case",
          "visible" => true,
          :order_form_group => 50,
          :order => 15,
          :order_subform => 0,
          :form_group_name => "Form Section Test",
          "editable" => true,
          "name_all" => "Form Section Test",
          "description_all" => "Form Section Test",
          :fields => fields
      )
      form.save!
      Child.any_instance.stub(:field_definitions).and_return(fields)
      Child.refresh_form_properties
    end

    context "when all form" do
      it "should get all matchable fields" do
        expect(Child.matchable_fields).to eq(["name", "name_nickname"])
      end
    end

    context "when form" do
      it "should get parent form matchable fields" do
        expect(Child.form_matchable_fields).to eq(["name", "name_nickname"])
      end
    end

    context "when subform" do
      it "should get subform matchable fields" do
        expect(Child.subform_matchable_fields).to eq([])
      end
    end
  end

  describe "match_fields" do
    it "should return empty array for no match field" do
      expect(Child.match_fields.first[:no_fields]).to eq(nil)
    end

    it "should return an exact match field" do
      expect(Child.match_fields.first[:fields]).to include('name')
    end

    it "should have a boost value" do
      expect(Child.match_fields.first[:boost]).to eq(10)
    end
  end

  describe "get_match_field" do
    it "should return test_field field for no match_fields" do
      expect(Child.get_match_field("test_field")).to eq([:test_field])
    end

    it "should return an exact match_fields" do
      expect(Child.get_match_field("name")).to eq([:name, :name_other, :name_nickname])
    end
  end

  describe "get_field_boost" do
    it "should return default boost for the match_fields" do
      expect(Child.get_field_boost("test_field")).to eq(1)
    end

    it "should return an exact boost for the match_fields" do
      expect(Child.get_field_boost("name")).to eq(10)
    end
  end

  describe "match_field_exist" do
    before do
      @field_list = Child.matchable_fields
    end

    it "should return false if the match_fields exist" do
      expect(Child.match_field_exist?("test_field", @field_list)).to eq(false)
    end

    it "should return true if the match_fields exist" do
      expect(Child.match_field_exist?("name", @field_list)).to eq(true)
    end
  end


  describe "match_multi_value" do
    before do
      @case = Child.create(name: ['murtaza', 'hussain'], name_nickname: 'murtaza', age: 14)
    end

    context "when no field in match_request" do
      it "should return nil" do
        expect(Child.match_multi_value("test_field", @case)).to eq(nil)
      end
    end

    context "when field in match_request" do
      it "should return exact value" do
        expect(Child.match_multi_value("name_nickname", @case)).to eq("murtaza")
      end

      it "should return joined value" do
        expect(Child.match_multi_value("name", @case)).to eq('murtaza hussain')
      end
    end
  end

  describe "match_multi_criteria" do
    before do
      @case = Child.create(name: 'case1', name_nickname: 'murtaza', age: 15, address_last: "1234")
    end

    context "when field in match_fields" do
      it "should return no values in match_criteria" do
        expect(Child.match_multi_criteria("relation_name", @case)).to eq(['relation_name', []])
      end

      it "should return values in match_criteria" do
        expect(Child.match_multi_criteria("name_nickname", @case)).to eq(["name", ["murtaza", "case1"]])
      end

      it "should return single value in match_criteria" do
        expect(Child.match_multi_criteria("age", @case)).to eq(['age', [15]])
      end
    end

    context "when field NOT in match_fields" do
      it "should return no value in match_criteria" do
        expect(Child.match_multi_criteria("current_address", @case)).to eq(['current_address', []])
      end

      it "should return value in match_criteria" do
        expect(Child.match_multi_criteria("address_last", @case)).to eq(['address_last', ["1234"]])
      end
    end
  end

  describe "find match records", search: true, skip_session: true do
    before do
      Child.all.each &:destroy
      TracingRequest.all.each &:destroy
      Sunspot.remove_all!
      FormSection.all.each &:destroy
      fields = [
          Field.new({"name" => "name",
                     "type" => "text_field",
                     "display_name_all" => "name",
                     "matchable" => true
                    }),
          Field.new({"name" => "name_nickname",
                     "type" => "text_field",
                     "display_name_en" => "Nickname",
                     "matchable" => true
                    }),
          Field.new({"name" => "age",
                     "type" => "numeric_field",
                     "display_name_all" => "Age",
                     "matchable" => true
                    })]
      form = FormSection.new(
          :unique_id => "form_section_test",
          :parent_form=>"case",
          "visible" => true,
          :order_form_group => 50,
          :order => 15,
          :order_subform => 0,
          :form_group_name => "Form Section Test",
          "editable" => true,
          "name_all" => "Form Section Test",
          "description_all" => "Form Section Test",
          :fields => fields
      )
      form.save!
      Child.any_instance.stub(:field_definitions).and_return(fields)
      Child.refresh_form_properties

      fields = [
          Field.new({"name" => "name",
                     "type" => "text_field",
                     "display_name_all" => "name",
                     "matchable" => true
                    }),
          Field.new({"name" => "name_nickname",
                     "type" => "text_field",
                     "display_name_en" => "Nickname",
                     "matchable" => true
                    }),
          Field.new({"name" => "age",
                     "type" => "numeric_field",
                     "display_name_all" => "Age",
                     "matchable" => true
                    })]
      FormSection.create_or_update_form_section(
          {
                    :unique_id=> "form_section_with_dates_fields",
                    "visible" => true,
                    :order => 1,
                    "editable" => true,
                    :fields => fields,
                    :perm_enabled => true,
                    :parent_form=>"tracing_request",
                    "name_all" => "Form Section With Dates Fields",
                    "description_all" => "Form Section With Dates Fields",
                  })
      TracingRequest.any_instance.stub(:field_definitions).and_return(fields)
      TracingRequest.refresh_form_properties

      Sunspot.setup(Child) {
        text 'name', as: 'name_text'.to_sym
        text 'name_nickname', as: 'name_nickname_text'.to_sym
        text 'age', as: 'age_text'.to_sym
        string 'consent_for_tracing', as: 'consent_for_tracing_sci'.to_sym
      }

      Sunspot.setup(TracingRequest) {
        text 'name', as: 'name_text'.to_sym
        text 'name_nickname', as: 'name_nickname_text'.to_sym
        text 'age', as: 'age_text'.to_sym
        string 'consent_for_tracing', as: 'consent_for_tracing_sci'.to_sym
      }
      @case = Child.create(name: 'Robert', name_nickname: 'Bobby', age: 15, consent_for_tracing: true)
      @trace = TracingRequest.create(:name => "Bobby", :name_nickname => "you cant see me",
                                     :age => 11, consent_for_tracing: true)
      Sunspot.commit
    end

    after :all do
      Child.all.each &:destroy
      TracingRequest.all.each &:destroy
      FormSection.all.each &:destroy
      Sunspot.remove_all!
      Sunspot.commit
    end

    context "when trace" do
      it "name should match nickname in Child" do
        result = TracingRequest.find_match_records({:name => [@trace.name], :age => [@trace.age]}, Child)
        expect(result.has_key?(@case.id)).to eq(true)
      end

      it "age should not match age in Child" do
        expect(TracingRequest.find_match_records({:age => [@trace.age]}, Child)).to eq({})
      end
    end

    context "when child" do
      it "nickname should match name in Trace" do
        result = Child.find_match_records({:name_nickname => [@case.name_nickname], :age => [@case.age]}, TracingRequest)
        expect(result.has_key?(@trace.id)).to eq(true)
      end

      it "age should not match age in Trace" do
        expect(Child.find_match_records({:age => [@case.age]}, TracingRequest)).to eq({})
      end
    end
  end

  describe "phonetic_fields" do
    it "should be an array of fields" do
      expect(Child.phonetic_fields.is_a? Array).to eq(true)
    end
  end

  describe "phonetic_fields_exist" do
    it "should return false for no phonetic_fields" do
      expect(Child.phonetic_fields_exist?("test_field")).to eq(false)
    end

    it "should return true for exact phonetic_fields" do
      expect(Child.phonetic_fields_exist?("name")).to eq(true)
    end
  end
end



