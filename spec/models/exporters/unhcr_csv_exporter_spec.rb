require 'rails_helper'

module Exporters
  xdescribe UnhcrCSVExporter do
    before do
      [Field, FormSection, Lookup].each(&:destroy_all)
      @lookup = Lookup.create!(unique_id: 'lookup-unhcr-needs-codes', name: 'UNHCR Needs Codes',
                               lookup_values: [
                                 {id: "cr-cp", display_text: "CR-CP"},
                                 {id: "cr-cs", display_text: "CR-CS"},
                                 {id: "cr-cc", display_text: "CR-CC"},
                                 {id: "cr-tp", display_text: "CR-TP"},
                                 {id: "cr-lw", display_text: "CR-LW"},
                                 {id: "cr-lo", display_text: "CR-LO"},
                                 {id: "cr-ne", display_text: "CR-NE"},
                                 {id: "cr-se", display_text: "CR-SE"},
                                 {id: "cr-af", display_text: "CR-AF"},
                                 {id: "cr-cl", display_text: "CR-CL"},
                                 {id: "sc-ch", display_text: "SC-CH"},
                                 {id: "sc-ic", display_text: "SC-IC"},
                                 {id: "sc-fc", display_text: "SC-FC"},
                                 {id: "ds-bd", display_text: "DS-BD"},
                                 {id: "ds-df", display_text: "DS-DF"},
                                 {id: "ds-pm", display_text: "DS-PM"},
                                 {id: "ds-ps", display_text: "DS-PS"},
                                 {id: "ds-mm", display_text: "DS-MM"},
                                 {id: "ds-ms", display_text: "DS-MS"},
                                 {id: "ds-sd", display_text: "DS-SD"},
                                 {id: "sm-mi", display_text: "SM-MI"},
                                 {id: "sm-mn", display_text: "SM-MN"},
                                 {id: "sm-ci", display_text: "SM-CI"},
                                 {id: "sm-cc", display_text: "SM-CC"},
                                 {id: "sm-ot", display_text: "SM-OT"},
                                 {id: "fu-tr", display_text: "FU-TR"},
                                 {id: "fu-fr", display_text: "FU-FR"},
                                 {id: "lp-nd", display_text: "LP-ND"},
                                 {id: "tr-pi", display_text: "TR-PI"},
                                 {id: "tr-ho", display_text: "TR-HO"},
                                 {id: "tr-wv", display_text: "TR-WV"},
                                 {id: "sv-va", display_text: "SV-VA"},
                                 {id: "lp-an", display_text: "LP-AN"},
                                 {id: "lp-md", display_text: "LP-MD"},
                                 {id: "lp-ms", display_text: "LP-MS"},
                                 {id: "lp-rr", display_text: "LP-RR"}
                               ].map(&:with_indifferent_access))
      fields = [
          Field.new({"name" => "registration_date",
                     "type" => "date_field",
                     "display_name_all" => "Registration Date"
                    }),
          Field.new({"name" => "name_caregiver",
                     "type" => "text_field",
                     "display_name_all" => "Name of Caregiver"
                    }),
          Field.new({"name" => "unhcr_individual_no",
                     "type" => "text_field",
                     "display_name_all" => "proGres Individual ID"
                    }),
          Field.new({"name" => "cpims_id",
                     "type" => "text_field",
                     "display_name_all" => "CPIMS ID"
                    }),
          Field.new({"name" => "age",
                     "type" => "numeric_field",
                     "display_name_all" => "Age"
                    }),
          Field.new({"name" => "unhcr_needs_codes",
                     "type" => "select_box",
                     "multi_select" => true,
                     "display_name_all" => "UNHCR Needs Codes",
                     "option_strings_source" => "lookup lookup-unhcr-needs-codes"
                    })
        ]
      form = FormSection.new(
        :unique_id => "form_section_test_for_unhcr_export",
        :parent_form=>"case",
        "visible" => true,
        :order_form_group => 50,
        :order => 15,
        :order_subform => 0,
        "editable" => true,
        "name_all" => "Form Section Test",
        "description_all" => "Form Section Test",
        :fields => fields
      )
      form.save!
      Child.any_instance.stub(:field_definitions).and_return(fields)
      Child.all.each { |form| form.destroy }

      @child_cls = Child.clone
      @test_child = Child.new()
    end

    describe "unhcr_needs_codes" do
      before do
        @test_child.unhcr_needs_codes = ['cr-cp', 'ds-sd']
        data = UnhcrCSVExporter.export([@test_child])
        @parsed = CSV.parse(data)
      end

      context "for Secondary Protection Concerns" do
        it "is converted to comma separated string" do
          expect(@parsed[1][@parsed[0].index("Secondary Protection Concerns")]).to eq("CR-CP, DS-SD")
        end
      end

      context "for Vulnrability Codes" do
        it "is displays the first half of the code separated by a ;" do
          expect(@parsed[1][@parsed[0].index("Vulnerability Codes")]).to eq("CR; DS")
        end
      end

      context "for Vulnerability Details Codes" do
        it "is displays the first half of the code separated by a ;" do
          expect(@parsed[1][@parsed[0].index("Vulnerability Details Codes")]).to eq("CR-CP; DS-SD")
        end
      end

    end

    describe 'export configuration' do
      before do
        ExportConfiguration.all.each &:destroy
        SystemSettings.all.each &:destroy
        SystemSettings.create(default_locale: "en")
      end

      context 'when no export configuration' do
        it 'exports all defined properties' do
          data = UnhcrCSVExporter.export([@test_child])
          parsed = CSV.parse(data)
          expect(parsed[0]).to eq([" ",
                                   "Long ID",
                                   "Individual Progress ID",
                                   "Progres ID",
                                   "CPIMS Code",
                                   "Short ID",
                                   "Date of Identification",
                                   "Primary Protection Concerns",
                                   "Secondary Protection Concerns",
                                   "Vulnerability Codes",
                                   "Vulnerability Details Codes",
                                   "Governorate - Country",
                                   "Address (Camp, Block, and other applicable address levels, such as shelter GPS coordinates)",
                                   "Sex",
                                   "Sex",
                                   "Date of Birth",
                                   "Age",
                                   "Causes of Separation",
                                   "Country of Origin",
                                   "Current Care Arrangement",
                                   "Reunification Status",
                                   "Case Status",
                                   "Family Count Number",
                                   "MOHA ID",
                                   "Full name of child",
                                   "Full name of caregiver"])
        end
      end

      context 'when export configuration is the same as properties defined in the exporter' do
        before do
          ExportConfiguration.create(unique_id: "export-test-same", name: "Test Same Properties", export_id: "unhcr_csv",
            property_keys: [
              "individual_progress_id",
              "cpims_code",
              "date_of_identification",
              "primary_protection_concerns",
              "secondary_protection_concerns",
              "governorate_country",
              "sex",
              "date_of_birth",
              "age",
              "causes_of_separation",
              "country_of_origin",
              "current_care_arrangement",
              "reunification_status",
              "case_status"
            ]
          )

          SystemSettings.any_instance.stub(:export_config_id).and_return({"unhcr" => 'export-test-same'})
        end

        it 'exports all defined properties' do
          data = UnhcrCSVExporter.export([@test_child])
          parsed = CSV.parse(data)
          expect(parsed[0]).to eq([" ",
                                   "Individual Progress ID",
                                   "CPIMS Code",
                                   "Date of Identification",
                                   "Primary Protection Concerns",
                                   "Secondary Protection Concerns",
                                   "Governorate - Country",
                                   "Sex",
                                   "Date of Birth",
                                   "Age",
                                   "Causes of Separation",
                                   "Country of Origin",
                                   "Current Care Arrangement",
                                   "Reunification Status",
                                   "Case Status"])
        end
      end

      context 'when export configuration is different than properties defined in the exporter' do
        context 'and the configuration is in a different order' do
          before do
            ExportConfiguration.create(unique_id: "export-test-different-order", name: "Test Properties Order", export_id: "unhcr_csv",
               property_keys: [
                 "case_status",
                 "reunification_status",
                 "current_care_arrangement",
                 "country_of_origin",
                 "governorate_country",
                 "date_of_identification",
                 "individual_progress_id",
                 "cpims_code",
                 "primary_protection_concerns",
                 "secondary_protection_concerns",
                 "sex",
                 "date_of_birth",
                 "age",
                 "causes_of_separation"
               ]
            )

            SystemSettings.any_instance.stub(:export_config_id).and_return({"unhcr" => 'export-test-different-order'})
          end

          it 'exports properties in the same order as the config' do
            data = UnhcrCSVExporter.export([@test_child])
            parsed = CSV.parse(data)
            expect(parsed[0]).to eq([" ",
                                     "Case Status",
                                     "Reunification Status",
                                     "Current Care Arrangement",
                                     "Country of Origin",
                                     "Governorate - Country",
                                     "Date of Identification",
                                     "Individual Progress ID",
                                     "CPIMS Code",
                                     "Primary Protection Concerns",
                                     "Secondary Protection Concerns",
                                     "Sex",
                                     "Date of Birth",
                                     "Age",
                                     "Causes of Separation"])
          end
        end

        context 'and the configuration has less property keys than defined in the exporter' do
          before do
            ExportConfiguration.create(unique_id: "export-test-less", name: "Test Less Properties", export_id: "unhcr_csv",
              property_keys: [
                "individual_progress_id",
                "cpims_code",
                "date_of_identification",
                "current_care_arrangement",
                "reunification_status",
                "case_status"
              ]
            )

            SystemSettings.any_instance.stub(:export_config_id).and_return({"unhcr" => 'export-test-less'})
          end

          it 'exports only properties defined in the config' do
            data = UnhcrCSVExporter.export([@test_child])
            parsed = CSV.parse(data)
            expect(parsed[0]).to eq([" ",
                                     "Individual Progress ID",
                                     "CPIMS Code",
                                     "Date of Identification",
                                     "Current Care Arrangement",
                                     "Reunification Status",
                                     "Case Status"])
          end
        end

        context 'and the configuration has more property keys than defined in the exporter' do
          before do
            ExportConfiguration.create(unique_id: "export-test-more", name: "Test More Properties", export_id: "unhcr_csv",
              property_keys: [
                "individual_progress_id",
                "cpims_code",
                "extra_1",
                "date_of_identification",
                "primary_protection_concerns",
                "extra_2",
                "secondary_protection_concerns",
                "governorate_country",
                "sex",
                "extra_3",
                "date_of_birth",
                "age",
                "causes_of_separation",
                "country_of_origin",
                "extra_4",
                "current_care_arrangement",
                "reunification_status",
                "extra_5",
                "case_status"
              ]
            )

            SystemSettings.any_instance.stub(:export_config_id).and_return({"unhcr" => 'export-test-more'})
          end

          it 'exports only the properties defined in the exporter' do
            data = UnhcrCSVExporter.export([@test_child])
            parsed = CSV.parse(data)
            expect(parsed[0]).to eq([" ",
                                     "Individual Progress ID",
                                     "CPIMS Code",
                                     "Date of Identification",
                                     "Primary Protection Concerns",
                                     "Secondary Protection Concerns",
                                     "Governorate - Country",
                                     "Sex",
                                     "Date of Birth",
                                     "Age",
                                     "Causes of Separation",
                                     "Country of Origin",
                                     "Current Care Arrangement",
                                     "Reunification Status",
                                     "Case Status"])
          end
        end

        context 'and the configuration is missing some properties and has some extra property keys than defined in the exporter' do
          before do
            ExportConfiguration.create(unique_id: "export-test-mixture", name: "Test Some More Some Less Properties", export_id: "unhcr_csv",
               property_keys: [
                 "individual_progress_id",
                 "date_of_birth",
                 "age",
                 "cpims_code",
                 "extra_1",
                 "extra_2",
                 "secondary_protection_concerns",
                 "governorate_country",
                 "sex",
                 "extra_3",
                 "current_care_arrangement",
                 "reunification_status",
                 "extra_4",
                 "case_status"
               ]
            )

            SystemSettings.any_instance.stub(:export_config_id).and_return({"unhcr" => 'export-test-mixture'})
          end

          it 'exports only properties defined in the config and in the exporter' do
            data = UnhcrCSVExporter.export([@test_child])
            parsed = CSV.parse(data)
            expect(parsed[0]).to eq([" ",
                                     "Individual Progress ID",
                                     "Date of Birth",
                                     "Age",
                                     "CPIMS Code",
                                     "Secondary Protection Concerns",
                                     "Governorate - Country",
                                     "Sex",
                                     "Current Care Arrangement",
                                     "Reunification Status",
                                     "Case Status"])
          end
        end
      end

      describe 'export configuration opt out' do
        before do
          @export_config = ExportConfiguration.create(
             unique_id: "export-test-less", name: "Test Less Properties", export_id: "unhcr_csv",
             property_keys: [
               "long_id",
               "individual_progress_id",
               "short_id",
               "cpims_code",
               "age",
               "name_of_caregiver"
             ],
             opt_out_field: 'unhcr_export_opt_out',
             property_keys_opt_out: ["short_id"]
          )

          SystemSettings.any_instance.stub(:export_config_id).and_return({"unhcr" => 'export-test-less'})
          @test_child.case_id = '1111-2222-3333-4444-aaa111'
          @test_child.short_id = 'aaa111'
          @test_child.unhcr_individual_no = 'bbb222'
          @test_child.cpims_id = 'ccc333'
          @test_child.age = 13
          @test_child.name_caregiver = "Test Name Caregiver"
        end

        context 'and the child has opted out' do
          before do
            @test_child.unhcr_export_opt_out = true
          end

          context 'and an opt_out property is defined' do
            it 'exports data for only the opt_out properties' do
              data = UnhcrCSVExporter.export([@test_child])
              parsed = CSV.parse(data)
              expect(parsed[0]).to eq([" ", "Long ID", "Individual Progress ID", "Short ID", "CPIMS Code", "Age", "Full name of caregiver"])
              expect(parsed[1]).to eq(["1", nil, nil, "aaa111", nil, nil, nil])
            end
          end

          context 'and an opt_out property is not defined' do
            before do
              @export_config.property_keys_opt_out = []
              @export_config.save
            end
            it 'exports no data' do
              data = UnhcrCSVExporter.export([@test_child])
              parsed = CSV.parse(data)
              expect(parsed[0]).to eq([" ", "Long ID", "Individual Progress ID", "Short ID", "CPIMS Code", "Age", "Full name of caregiver"])
              expect(parsed[1]).to eq(["1", nil, nil, nil, nil, nil, nil])
            end
          end
        end

        context 'and the child has not opted out' do
          before do
            @test_child.unhcr_export_opt_out = false
          end

          it 'exports data for all of the configured properties' do
            data = UnhcrCSVExporter.export([@test_child])
            parsed = CSV.parse(data)
            expect(parsed[0]).to eq([" ", "Long ID", "Individual Progress ID", "Short ID", "CPIMS Code", "Age", "Full name of caregiver"])
            expect(parsed[1]).to eq(["1", "1111-2222-3333-4444-aaa111", "bbb222", "aaa111", "ccc333", "13", "Test Name Caregiver"])
          end
        end

        context 'and the opt_out field is not set' do
          before do
            @test_child.unhcr_export_opt_out = nil
          end

          it 'exports data for all of the configured properties' do
            data = UnhcrCSVExporter.export([@test_child])
            parsed = CSV.parse(data)
            expect(parsed[0]).to eq([" ", "Long ID", "Individual Progress ID", "Short ID", "CPIMS Code", "Age", "Full name of caregiver"])
            expect(parsed[1]).to eq(["1", "1111-2222-3333-4444-aaa111", "bbb222", "aaa111", "ccc333", "13", "Test Name Caregiver"])
          end
        end
      end
    end
  end
end
