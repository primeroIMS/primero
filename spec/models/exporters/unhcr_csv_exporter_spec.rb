require 'spec_helper'

module Exporters
  describe UnhcrCSVExporter do
    before :each do
      FormSection.all.all.each { |form| form.destroy }
      fields = [
          Field.new({"name" => "registration_date",
                     "type" => "date_field",
                     "display_name_all" => "Registration Date"
                    })
        ]
      form = FormSection.new(
        :unique_id => "form_section_test_for_risk_level_follow_up",
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
      Child.all.each { |form| form.destroy }

      @child_cls = Child.clone
      @child_cls.class_eval do
        property :unhcr_needs_codes, [String]
        property :nationality, [String]
        property :ethnicity, [String]
        property :protection_concerns, [String]
        property :language, [String]
        property :family_details_section, [Class.new do
          include CouchRest::Model::Embeddable
          property :relation_name, String
          property :relation, String
        end]
      end
      @test_child = Child.new()
    end

    after :each do
      property_index = @child_cls.properties.find_index{|p| p.name == "family_details_section"}
      @child_cls.properties.delete_at(property_index)
    end

    it "converts unhcr_needs_codes to comma separated string" do
      @test_child.unhcr_needs_codes = ['abc', 'def']

      data = UnhcrCSVExporter.export([@test_child])

      parsed = CSV.parse(data)
      parsed[1][parsed[0].index("Secondary Protection Concerns")].should == 'abc, def'
    end
  end
end
