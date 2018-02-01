require 'rails_helper'

describe GBVDerivedFields do

  before :all do
    Incident.all.all.each { |incident| incident.destroy }
    FormSection.all.all.each { |form| form.destroy }
    #### Perpetrator subform
    alleged_perpetrator_subform_fields = [
      Field.new({"name" => "perpetrator_relationship",
                 "type" => "select_box",
                 "display_name_all" => "Alleged perpetrator relationship with survivor",
                 "option_strings_text_all" =>
                              ["Intimate Partner/Former Partner",
                               "Primary Caregiver", "Unknown"].join("\n")
                })
    ]
    alleged_perpetrator_subform_section = FormSection.new(
      "visible" => false,
      "is_nested" => true,
      :order_form_group => 80,
      :order => 10,
      :order_subform => 1,
      :unique_id => "alleged_perpetrator",
      :parent_form=>"incident",
      "editable" => true,
      :fields => alleged_perpetrator_subform_fields,
      :initial_subforms => 1,
      "name_all" => "Nested Alleged Perpetrator Subform",
      "description_all" => "Nested Alleged Perpetrator Subform"
    )
    alleged_perpetrator_subform_section.save!
    #### GBV reported elsewhere subform
    gbv_reported_elsewhere_subform_fields = [
      Field.new({"name" => "gbv_reported_elsewhere_reporting",
                 "type" => "radio_button",
                 "display_name_all" => "Is this a GBV reporting organization?",
                 "option_strings_text_all" => "Yes\nNo"
                })
    ]
    gbv_reported_elsewhere_subform = FormSection.new(
      "visible" => false,
      "is_nested" => true,
      :order_form_group => 40,
      :order => 40,
      :order_subform => 1,
      :unique_id => "gbv_reported_elsewhere_subform",
      :parent_form=>"incident",
      "editable" => true,
      :fields => gbv_reported_elsewhere_subform_fields,
      :initial_subforms => 1,
      "name_all" => "GBV Reported Elsewhere Subform",
      "description_all" => "GBV Reported Elsewhere Subform",
      "collapsed_fields" => ["gbv_reported_elsewhere_organization_provider"]
    )
    gbv_reported_elsewhere_subform.save!
    form = FormSection.new(
      :unique_id => "gbv_derived_fields",
      :parent_form=>"incident",
      "visible" => true,
      :order_form_group => 50,
      :order => 15,
      :order_subform => 0,
      :form_group_name => "GBV Derived Fields",
      "editable" => true,
      "name_all" => "GBV Derived Fields",
      "description_all" => "GBV Derived Fields",
      :fields => [
        #### gbv_incident_form form section.
        Field.new({"name" => "incident_date",
                   "type" => "date_field",
                   "display_name_all" => "Date of Incident"
                  }),
        Field.new({"name" => "date_of_first_report",
                   "type" => "date_field",
                   "display_name_all" => "Date of Interview"
                  }),
        #### gbv_sexual_violence form section.
        Field.new({"name" => "gbv_sexual_violence_type",
                   "type" => "select_box",
                   "display_name_all" => "Type of Incident Violence",
                   "option_strings_text_all" =>
                                      ["Rape",
                                       "Sexual Assault",
                                       "Non-GBV"].join("\n")
                  }),
        Field.new({"name" => "harmful_traditional_practice",
                   "type" => "select_box",
                   "display_name_all" => "Was this incident a Harmful Traditional Practice",
                   "option_strings_text_all" =>
                                          ["No",
                                           "Type of Practice 1",
                                           "Type of Practice 2",
                                           "Type of Practice 3",
                                           "Type of Practice 4",
                                           "Type of Practice 5"].join("\n")
                    }),
        Field.new({"name" => "goods_money_exchanged",
                   "type" => "radio_button",
                   "display_name_all" => "Were money, goods, benefits, and/or services exchanged in relation to the incident?",
                   "option_strings_text_all" => "Yes\nNo"
                  }),
        Field.new({"name" => "abduction_status_time_of_incident",
                   "type" => "select_box",
                   "display_name_all" => "Type of abduction at time of the incident",
                   "option_strings_text_all" =>
                                          ["None",
                                           "Forced Conscription",
                                           "Trafficked",
                                           "Other Abduction/Kidnapping"].join("\n")
                  }),
        #### subform
        Field.new({"name" => "gbv_reported_elsewhere_subform",
                   "type" => "subform",
                   "editable" => true,
                   "subform_section_id" => gbv_reported_elsewhere_subform.unique_id,
                   "display_name_all" => "If yes, where?"
                  }),
        #### subform
        #### gbv_individual_details form section.
        Field.new({"name" => "age",
                   "type" => "numeric_field",
                   "display_name_all" => "What is the survivor's age?",
                  }),
        Field.new({"name" => "disability_type",
                   "type" => "radio_button",
                   "display_name_all" => "Disability Type",
                   "option_strings_text_all" =>
                                ["Mental Disability",
                                 "Physical Disability",
                                 "Both"].join("\n")
                    }),
        Field.new({"name" => "unaccompanied_separated_status",
                   "type" => "select_box",
                   "display_name_all" => "Is the survivor an Unaccompanied Minor, Separated Child, or Other Vulnerable Child?",
                   "option_strings_source" => "lookup UnaccompaniedSeparatedStatus"}),
        #### subform
        Field.new({"name" => "alleged_perpetrator",
                   "type" => "subform", "editable" => true,
                   "subform_section_id" => alleged_perpetrator_subform_section.unique_id,
                   "display_name_all" => "Alleged Perpetrator"
                  })
        #### subform
      ])
    form.save!
    Incident.refresh_form_properties
  end

  after :all do
    # TODO: Change this for a better approach. This is a work arround.
    # Custom validators are registered for the subforms when saved, they keep registered in the execution of the rspecs and some test breaks up because the subforms are no longer available (which is ok, they shouldn't be).
    # Should the validators be registered on Incident when a incident subform is saved?
    FormSection.all.all.map{|f| f.fields}
      .flatten.select{|f| f.type == Field::SUBFORM}
      .map{|f| f.name.to_sym}.each do |key|
      # Remove the validator for the subforms used only on this test.
      Incident._validators.delete key if Incident._validators[key]
    end
  end

  shared_examples_for "GBV Calculated/Derived fields" do |fields_name|
    it "It should calculate a value for #{fields_name}" do
      incident_gbv.save
      expected_values.each do |name, value|
        #Read from the database
        read = { name => incident_gbv.send("#{name}") }
        #Hash with the expected values.
        expected = { name => value }
        expected.should eq(read)
      end
    end
  end

  describe "GBV Incident Report" do
    before :each do
      Incident.any_instance.stub(:field_definitions).and_return([])
    end

    it_behaves_like "GBV Calculated/Derived fields", "gbv_uam_sc_ovc" do
      let(:expected_values) { {"gbv_uam_sc_ovc" => "UAM/SC/OVC"} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :unaccompanied_separated_status => "Separated Child") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_uam_sc_ovc" do
      let(:expected_values) { {"gbv_uam_sc_ovc" => "UAM/SC/OVC"} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :unaccompanied_separated_status => "Unaccompanied Minor") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_uam_sc_ovc" do
      let(:expected_values) { {"gbv_uam_sc_ovc" => "UAM/SC/OVC"} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :unaccompanied_separated_status => "Other Vulnerable Child") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_uam_sc_ovc" do
      let(:expected_values) { {"gbv_uam_sc_ovc" => "No"} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :unaccompanied_separated_status => "") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_uam_sc_ovc" do
      let(:expected_values) { {"gbv_uam_sc_ovc" => "No"} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :unaccompanied_separated_status => nil) }
    end

    it_behaves_like "GBV Calculated/Derived fields", "gbv_disability" do
      let(:expected_values) { {"gbv_disability" => "Disability"} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :disability_type => "Mental Disability") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_disability" do
      let(:expected_values) { {"gbv_disability" => "Disability"} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :disability_type => "Physical Disability") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_disability" do
      let(:expected_values) { {"gbv_disability" => "Disability"} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :disability_type => "Both") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_disability" do
      let(:expected_values) { {"gbv_disability" => "No"} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :disability_type => "") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_disability" do
      let(:expected_values) { {"gbv_disability" => "No"} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :disability_type => nil) }
    end

    it_behaves_like "GBV Calculated/Derived fields", "gbv_sexual_violence" do
      let(:expected_values) { {"gbv_sexual_violence" => "Sexual Violence"} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :gbv_sexual_violence_type => "Rape") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_sexual_violence" do
      let(:expected_values) { {"gbv_sexual_violence" => "Sexual Violence"} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :gbv_sexual_violence_type => "Sexual Assault") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_sexual_violence" do
      let(:expected_values) { {"gbv_sexual_violence" => nil} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :gbv_sexual_violence_type => "") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_sexual_violence" do
      let(:expected_values) { {"gbv_sexual_violence" => nil} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :gbv_sexual_violence_type => nil) }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_sexual_violence" do
      let(:expected_values) { {"gbv_sexual_violence" => nil} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :gbv_sexual_violence_type => "Any Value") }
    end

    it_behaves_like "GBV Calculated/Derived fields", "gbv_harmful_traditional_practice" do
      let(:expected_values) { {"gbv_harmful_traditional_practice" => "Harmful Traditional Practice"} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :harmful_traditional_practice => "Any Value") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_harmful_traditional_practice" do
      let(:expected_values) { {"gbv_harmful_traditional_practice" => nil} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :harmful_traditional_practice => "No") }
    end
    it_behaves_like "GBV Calculated/Derived fields","gbv_harmful_traditional_practice" do
      let(:expected_values) { {"gbv_harmful_traditional_practice" => nil} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :harmful_traditional_practice => "") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_harmful_traditional_practice" do
      let(:expected_values) { {"gbv_harmful_traditional_practice" => nil} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :harmful_traditional_practice => nil) }
    end

    it_behaves_like "GBV Calculated/Derived fields", "gbv_possible_sexual_exploitation" do
      let(:expected_values) { {"gbv_possible_sexual_exploitation" => "Possible Sexual Exploitation"} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :goods_money_exchanged => "Yes", :gbv_sexual_violence_type => "Rape") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_possible_sexual_exploitation" do
      let(:expected_values) { {"gbv_possible_sexual_exploitation" => "Possible Sexual Exploitation"} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :goods_money_exchanged => "Yes", :gbv_sexual_violence_type => "Sexual Assault") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_possible_sexual_exploitation" do
      let(:expected_values) { {"gbv_possible_sexual_exploitation" => nil} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :goods_money_exchanged => "No", :gbv_sexual_violence_type => "Rape") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_possible_sexual_exploitation" do
      let(:expected_values) { {"gbv_possible_sexual_exploitation" => nil} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :goods_money_exchanged => "No", :gbv_sexual_violence_type => "Sexual Assault") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_possible_sexual_exploitation" do
      let(:expected_values) { {"gbv_possible_sexual_exploitation" => nil} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :goods_money_exchanged => "Yes", :gbv_sexual_violence_type => "Any Value") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_possible_sexual_exploitation" do
      let(:expected_values) { {"gbv_possible_sexual_exploitation" => nil} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :goods_money_exchanged => nil, :gbv_sexual_violence_type => nil) }
    end

    it_behaves_like "GBV Calculated/Derived fields", "gbv_possible_sexual_slavery" do
      let(:expected_values) { {"gbv_possible_sexual_slavery" => "Possible Sexual Slavery"} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :abduction_status_time_of_incident => "Any Value", :gbv_sexual_violence_type => "Rape") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_possible_sexual_slavery" do
      let(:expected_values) { {"gbv_possible_sexual_slavery" => "Possible Sexual Slavery"} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :abduction_status_time_of_incident => "Any Value", :gbv_sexual_violence_type => "Sexual Assault") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_possible_sexual_slavery" do
      let(:expected_values) { {"gbv_possible_sexual_slavery" => nil} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :abduction_status_time_of_incident => "None", :gbv_sexual_violence_type => "Any Value") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_possible_sexual_slavery" do
      let(:expected_values) { {"gbv_possible_sexual_slavery" => nil} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :abduction_status_time_of_incident => "None", :gbv_sexual_violence_type => "Rape") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_possible_sexual_slavery" do
      let(:expected_values) { {"gbv_possible_sexual_slavery" => nil} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :abduction_status_time_of_incident => "None", :gbv_sexual_violence_type => "Sexual Assault") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_possible_sexual_slavery" do
      let(:expected_values) { {"gbv_possible_sexual_slavery" => nil} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :abduction_status_time_of_incident => "", :gbv_sexual_violence_type => "") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_possible_sexual_slavery" do
      let(:expected_values) { {"gbv_possible_sexual_slavery" => nil} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :abduction_status_time_of_incident => nil, :gbv_sexual_violence_type => nil) }
    end

    it_behaves_like "GBV Calculated/Derived fields", "gbv_incident_month_year, gbv_incident_quarter" do
      let(:expected_values) { {"gbv_incident_month_year" => "Jul-2006", "gbv_incident_quarter" => "Quarter 3"} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :incident_date => "10-Jul-2006") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_incident_month_year, gbv_incident_quarter" do
      let(:expected_values) { {"gbv_incident_month_year" => nil, "gbv_incident_quarter" => nil} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :incident_date => "") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_incident_month_year, gbv_incident_quarter" do
      let(:expected_values) { {"gbv_incident_month_year" => nil, "gbv_incident_quarter" => nil} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :incident_date => nil) }
    end

    it_behaves_like "GBV Calculated/Derived fields", "gbv_incident_reported_year, gbv_incident_reported_quarter" do
      let(:expected_values) { {"gbv_incident_reported_year" => 2007, "gbv_incident_reported_quarter" => "Quarter 4"} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :date_of_first_report => "10-Oct-2007") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_incident_reported_year, gbv_incident_reported_quarter" do
      let(:expected_values) { {"gbv_incident_reported_year" => nil, "gbv_incident_reported_quarter" => nil} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :date_of_first_report => "") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_incident_reported_year, gbv_incident_reported_quarter" do
      let(:expected_values) { {"gbv_incident_reported_year" => nil, "gbv_incident_reported_quarter" => nil} }
      let(:incident_gbv) { Incident.new(:module_id => "primeromodule-gbv", :date_of_first_report => nil) }
    end

    it_behaves_like "GBV Calculated/Derived fields", "gbv_intimate_partner_violence" do
      let(:expected_values) { {"gbv_intimate_partner_violence" => nil} }
      let(:incident_gbv) {
        Incident.new(:module_id => "primeromodule-gbv",
                     :gbv_sexual_violence_type => "Rape",
                     :alleged_perpetrator => [
                       { :perpetrator_relationship => "Primary Caregiver" },
                       { :perpetrator_relationship => "Schoolmate" }
                     ]
                    )
      }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_intimate_partner_violence" do
      let(:expected_values) { {"gbv_intimate_partner_violence" => "Intimate Partner Violence"} }
      let(:incident_gbv) {
        Incident.new(:module_id => "primeromodule-gbv",
                     :gbv_sexual_violence_type => "Rape",
                     :alleged_perpetrator => [
                       { :perpetrator_relationship => "Primary Caregiver" },
                       { :perpetrator_relationship => "Intimate Partner/Former Partner" }
                     ]
                    )
      }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_intimate_partner_violence" do
      let(:expected_values) { {"gbv_intimate_partner_violence" => nil} }
      let(:incident_gbv) {
        Incident.new(:module_id => "primeromodule-gbv",
                     :gbv_sexual_violence_type => "Non-GBV",
                     :alleged_perpetrator => [
                       { :perpetrator_relationship => "Primary Caregiver" },
                       { :perpetrator_relationship => "Intimate Partner/Former Partner" }
                     ]
                    )
      }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_intimate_partner_violence" do
      let(:expected_values) { {"gbv_intimate_partner_violence" => nil} }
      let(:incident_gbv) {
        Incident.new(:module_id => "primeromodule-gbv",
                     :gbv_sexual_violence_type => "Rape",
                     :alleged_perpetrator => []
                    )
      }
    end

    it_behaves_like "GBV Calculated/Derived fields", "gbv_excluded_from_statistics" do
      let(:expected_values) { {"gbv_excluded_from_statistics" => "Exclude"} }
      let(:incident_gbv) {
        Incident.new(:module_id => "primeromodule-gbv",
                     :gbv_reported_elsewhere_subform => [
                       { :gbv_reported_elsewhere_reporting => "No" },
                       { :gbv_reported_elsewhere_reporting => "Yes" }
                     ]
                    )
      }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_excluded_from_statistics" do
      let(:expected_values) { {"gbv_excluded_from_statistics" => "Include"} }
      let(:incident_gbv) {
        Incident.new(:module_id => "primeromodule-gbv",
                     :gbv_reported_elsewhere_subform => [
                       { :gbv_reported_elsewhere_reporting => "No" },
                       { :gbv_reported_elsewhere_reporting => "No" }
                     ]
                    )
      }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_excluded_from_statistics" do
      let(:expected_values) { {"gbv_excluded_from_statistics" => nil} }
      let(:incident_gbv) {
        Incident.new(:module_id => "primeromodule-gbv",
                     :gbv_reported_elsewhere_subform => []
                    )
      }
    end

    it_behaves_like "GBV Calculated/Derived fields", "gbv_days_between_incident_and_interview, gbv_range_between_incident_and_interview" do
      let(:expected_values) { {"gbv_days_between_incident_and_interview" => 97, "gbv_range_between_incident_and_interview" => "Over 1 month"} }
      let(:incident_gbv) {  Incident.new(:module_id => "primeromodule-gbv", :incident_date => "10-Jul-2014", :date_of_first_report => "15-Oct-2014") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_days_between_incident_and_interview, gbv_range_between_incident_and_interview" do
      let(:expected_values) { {"gbv_days_between_incident_and_interview" => 5, "gbv_range_between_incident_and_interview" => "4-5 Days"} }
      let(:incident_gbv) {  Incident.new(:module_id => "primeromodule-gbv", :incident_date => "10-Mar-2014", :date_of_first_report => "15-Mar-2014") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_days_between_incident_and_interview, gbv_range_between_incident_and_interview" do
      let(:expected_values) { {"gbv_days_between_incident_and_interview" => nil, "gbv_range_between_incident_and_interview" => nil} }
      let(:incident_gbv) {  Incident.new(:module_id => "primeromodule-gbv", :incident_date => "15-Mar-2014", :date_of_first_report => "") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_days_between_incident_and_interview, gbv_range_between_incident_and_interview" do
      let(:expected_values) { {"gbv_days_between_incident_and_interview" => nil, "gbv_range_between_incident_and_interview" => nil} }
      let(:incident_gbv) {  Incident.new(:module_id => "primeromodule-gbv", :incident_date => "", :date_of_first_report => "10-Mar-2014") }
    end

    it_behaves_like "GBV Calculated/Derived fields", "gbv_age_group_at_time_of_incident, gbv_adult_or_child_at_time_of_incident, gbv_age_at_time_of_incident, gbv_child_sexual_abuse, gbv_early_marriage" do
      let(:expected_values) { {"gbv_age_group_at_time_of_incident" => "0-11",
                          "gbv_adult_or_child_at_time_of_incident" => "Child",
                          "gbv_age_at_time_of_incident" => 7,
                          "gbv_child_sexual_abuse" => "Child Sexual Abuse",
                          "gbv_early_marriage" => nil} }
      let(:incident_gbv) {  Incident.new(:module_id => "primeromodule-gbv", :age => 7, :gbv_sexual_violence_type => "Rape") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_age_group_at_time_of_incident, gbv_adult_or_child_at_time_of_incident, gbv_age_at_time_of_incident, gbv_child_sexual_abuse, gbv_early_marriage" do
      let(:expected_values) { {"gbv_age_group_at_time_of_incident" => "0-11",
                          "gbv_adult_or_child_at_time_of_incident" => "Child",
                          "gbv_age_at_time_of_incident" => 7,
                          "gbv_child_sexual_abuse" => "Child Sexual Abuse",
                          "gbv_early_marriage" => nil} }
      let(:incident_gbv) {  Incident.new(:module_id => "primeromodule-gbv", :age => 7, :gbv_sexual_violence_type => "Sexual Assault") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_age_group_at_time_of_incident, gbv_adult_or_child_at_time_of_incident, gbv_age_at_time_of_incident, gbv_child_sexual_abuse, gbv_early_marriage" do
      let(:expected_values) { {"gbv_age_group_at_time_of_incident" => "0-11",
                          "gbv_adult_or_child_at_time_of_incident" => "Child",
                          "gbv_age_at_time_of_incident" => 7,
                          "gbv_child_sexual_abuse" => nil,
                          "gbv_early_marriage" => nil} }
      let(:incident_gbv) {  Incident.new(:module_id => "primeromodule-gbv", :age => 7, :gbv_sexual_violence_type => "Any Value") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_age_group_at_time_of_incident, gbv_adult_or_child_at_time_of_incident, gbv_age_at_time_of_incident, gbv_child_sexual_abuse, gbv_early_marriage" do
      let(:expected_values) { {"gbv_age_group_at_time_of_incident" => "0-11",
                          "gbv_adult_or_child_at_time_of_incident" => "Child",
                          "gbv_age_at_time_of_incident" => 7,
                          "gbv_child_sexual_abuse" => nil,
                          "gbv_early_marriage" => "Early Marriage"} }
      let(:incident_gbv) {  Incident.new(:module_id => "primeromodule-gbv", :age => 7, :gbv_sexual_violence_type => "Forced Marriage") }
    end
    it_behaves_like "GBV Calculated/Derived fields", "gbv_age_group_at_time_of_incident, gbv_adult_or_child_at_time_of_incident, gbv_age_at_time_of_incident, gbv_child_sexual_abuse, gbv_early_marriage" do
      let(:expected_values) { {"gbv_age_group_at_time_of_incident" => "Age 18 and over",
                          "gbv_adult_or_child_at_time_of_incident" => "Adult",
                          "gbv_age_at_time_of_incident" => 19,
                          "gbv_child_sexual_abuse" => nil,
                          "gbv_early_marriage" => nil} }
      let(:incident_gbv) {  Incident.new(:module_id => "primeromodule-gbv", :age => 19) }
    end

  end

  describe 'alleged_perpetrators' do
    context 'when there is 1 blank record' do
      before :each do
        @incident1 = Incident.new(module_id: "primeromodule-gbv", alleged_perpetrator: [{"uniquie_id" => "abc123"}])
      end

      it 'returns an empty array' do
        expect(@incident1.alleged_perpetrators).to eq([])
      end
    end

    context 'when there is 1 populated record' do
      before :each do
        @incident1 = Incident.new(module_id: "primeromodule-gbv", alleged_perpetrator: [{"uniquie_id" => "abc123", "perpetrator_relationship" => "foo"}])
      end
      it 'returns an array containing the populated record' do
        expect(@incident1.alleged_perpetrators.size).to eq(1)
      end
    end
  end

end
