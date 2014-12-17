require 'spec_helper'

module Exporters
  describe IncidentRecorderExporter do

    def verify_values(sheet, expected_values)
      i = 4
      expected_values.each do |record|
        row = sheet.getRow(i)
        j = 0
        record.each do |value|
          if value != @skip
            cell = row.getCell(j)
            if cell.getCellType == 0
              cell_value = cell.getNumericCellValue
            else
              cell_value = cell.getStringCellValue
            end
            cell_value.should eq(value), "Value at row #{i+1} column #{j+1} is unexpected. Got \"#{cell_value}\" but was expected \"#{value}\""
          end
          j += 1
        end
        i += 1
      end
    end

    def verify_lookups(sheet, expected_lookups)
      expected_lookups.each do |lookup|
        i = 4
        j = lookup[:cell_index]
        lookup[:values].each do |value|
          row = sheet.getRow(i)
          cell = row.getCell(j)
          cell_value = cell.getStringCellValue
          cell_value.should eq(value), "Value at row #{i+1} column #{j+1} is unexpected. Got \"#{cell_value}\" but was expected \"#{value}\""
          i += 1
        end
      end
    end

    before :all do
      @skip = "skip-column"
      #Define the properties required by the report to be filled.
      @incident_cls = Incident.clone
      @incident_cls.class_eval do
        property :service_referred_from, [String]
  
        ["survivor_code", "caseworker_code", "sex", "country_of_origin", "maritial_status",
         "displacement_status", "disability_type", "unaccompanied_separated_status",
         "displacement_incident", "incident_timeofday", "incident_location",
         "gbv_sexual_violence_type", "harmful_traditional_practice",
         "goods_money_exchanged", "abduction_status_time_of_incident",
         "gbv_reported_elsewhere", "gbv_previous_incidents",
         "service_safehouse_referral"].each do |name|
          properties.select{|p| p.name == name}.each{|p| properties.delete(p)}
          property name.to_sym, String
        end
  
        ["date_of_first_report", "incident_date", "date_of_birth"].each do |name|
          properties.select{|p| p.name == name}.each{|p| properties.delete(p)}
          property name.to_sym, Date
        end
  
        {
          "alleged_perpetrator" => ["primary_perpetrator", "perpetrator_sex", "former_perpetrator",
                                    "age_group", "perpetrator_relationship", "perpetrator_occupation"],
          "health_medical_referral_subform_section" => ["service_medical_referral"],
          "psychosocial_counseling_services_subform_section" => ["service_psycho_referral", "pursue_legal_action"],
          "legal_assistance_services_subform_section" => ["service_legal_referral"],
          "police_or_other_type_of_security_services_subform_section" => ["service_police_referral"],
          "livelihoods_services_subform_section" => ["service_livelihoods_referral"]
        }.each do |subform, fields|
           properties.select{|p| p.name == subform}.each{|p| properties.delete(p)}
           property subform.to_sym,
            [Class.new do
              include CouchRest::Model::Embeddable
                fields.each do |name|
                 property name.to_sym, String
                end
            end]
        end
      end
    end

    before :each do
      FormSection.all.each &:destroy
    end

    describe "verify expected columns headers in the template file IRv66_Blank-MARA.xls" do
      it "at sheet '1. Incident Data'" do
        IncidentRecorderExporter.export([], nil)
        #Verify the headers in the spreadsheet are in place
        ##### ADMINISTRATIVE INFORMATION #####
        cells = ["INCIDENT ID", "SURVIVOR CODE ", "CASE MANAGER CODE", "DATE OF INTERVIEW", "DATE OF INCIDENT",
         ##### SURVIVOR INFORMATION.
         #NOTE: 'H' is hidden and protected in the spreadsheet.
         "DATE OF BIRTH", "SEX", "", "COUNTRY OF ORIGIN¦", "CIVIL / MARITAL STATUS",
         "DISPLACEMENT STATUS AT REPORT", "PERSON WITH DISABILITY?", "UNACCOMPANIED OR SEPARATED CHILD?",
         ##### DETAILS OF THE INCIDENT #####
         "STAGE OF DISPLACEMENT AT INCIDENT", "INCIDENT TIME OF DAY", "INCIDENT LOCATION¦", "INCIDENT COUNTY¦",
         "INCIDENT DISTRICT¦", "INCIDENT CAMP / TOWN¦", "GBV TYPE", "HARMFUL TRADITIONAL PRACTICE¦",
         "MONEY, GOODS, BENEFITS AND / OR SERVICES EXCHANGED ?", "TYPE OF ABDUCTION", "PREVIOUSLY REPORTED THIS INCIDENT ?",
         "PREVIOUS GBV INCIDENTS?",
         ##### ALLEGED PERPETRATOR INFORMATION #####
         "No. ALLEGED PRIMARY PERPETRATOR(S)", "ALLEGED PERPETRATOR SEX", "PREVIOUS INCIDENT WITH THIS PERPETRATOR¦",
         "ALLEGED PERPETRATOR AGE GROUP", "ALLEGED PERPETRATOR - SURVIVOR RELATIONSHIP", "ALLEGED PERPETRATOR OCCUPATION¦",
         ##### REFERRAL PATHWAY DATA #####
         "REFERRED TO YOU FROM?", "SAFE HOUSE / SHELTER", "HEALTH / MEDICAL SERVICES", "PSYCHOSOCIAL SERVICES",
         "WANTS LEGAL ACTION?", "LEGAL ASSISTANCE SERVICES", "POLICE / OTHER SECURITY ACTOR", "LIVELIHOODS PROGRAM",
         ##### ADMINISTRATION 2 #####
         "CONSENT GIVEN", "REPORTING AGENCY CODE ¦"
        ]
        workbook = IncidentRecorderExporter.workbook
        sheet = workbook.getSheetAt(0)
        #Headers are in row 4 (zero based index)
        row = sheet.getRow(3)
        j = 0
        cells.each do |value|
          if value.present?
            cell = row.getCell(j)
            cell_value = cell.getStringCellValue
            cell_value.should eq(value), "Value at row 4 column #{j+1} is unexpected. Got \"#{cell_value}\" but was expected \"#{value}\""
          end
          j += 1
        end
      end

      it "at sheet '2. Menu Data'" do
        IncidentRecorderExporter.export([], nil)
        workbook = IncidentRecorderExporter.workbook
        sheet = workbook.getSheetAt(1)
        row = sheet.getRow(3)
        row.getCell(0).getStringCellValue.should eq("CASEWORKER CODE")
        row.getCell(4).getStringCellValue.should eq("INCIDENT LOCATION")
        row.getCell(6).getStringCellValue.should eq("INCIDENT COUNTY")
        row.getCell(8).getStringCellValue.should eq("INCIDENT DISTRICT")
        row.getCell(10).getStringCellValue.should eq("INCIDENT CAMP")
      end

    end

    describe "verify expected columns values based on the template file IRv66_Blank-MARA.xls" do
      before :each do
        @expected_values = [
          ["1", "5001", "4001", "01-Jan-2014", "21-Dec-2013", "01-Jan-2001", "F", @skip,
           "Somalia", "Single", "Resident", "Mental Disability", "No", "During Flight",
           "Morning (sunrise to noon)", "Nyeri", "Nyeri", "Central", "",
           "Rape", "Practice 1", "Yes", "None", "No", "Yes", 
           1, "M", "Yes", "Age 26 - 40", "Family other than spouse or caregiver",
           "Unemployed", "Health/Medical Services & Psychosocial/Counseling Services",
           "Referred",
           "Referred",
           "Referred",
           "Yes",
           "Referred & No referral, Service provided by your agency",
           "Referred & No referral, Service provided by your agency",
           "Referred & No referral, Service provided by your agency"],
          ["2", "5002", "4002", "02-Jan-2014", "22-Dec-2013", "01-Jan-2002", "M", @skip,
           "Uganda", "Married/Cohabitating", "Refugee", "", "Separated Child", "During Refuge",
           "Afternoon (noon to sunset)", "Zone 1", "Turkana", "Rift Valley", "Kakuma IV",
           "Sexual Assault", "Practice 2", "No", "Forced Conscription", "Yes", "No", 
           2, "F and M", "Yes", "Age 0 - 11", "Primary Caregiver",
           "Unknown", "Police/Other Security Actor & Legal Assistance Services",
           "No referral, Service provided by your agency",
           "Referred & No referral, Service provided by your agency",
           "Referred & No referral, Service provided by your agency",
           "Yes",
           "Referred",
           "Referred",
           "Referred"]
        ]

        @expected_lookups = [
          {:cell_index => 0, :values => ["4001", "4002"]},  #case worker code.
          {:cell_index => 4, :values => ["Nyeri", "Zone 1"]}, #locations.
          {:cell_index => 6, :values => ["Nyeri", "Turkana"]}, #counties.
          {:cell_index => 8, :values => ["Central", "Rift Valley"]}, #districts.
          {:cell_index => 10, :values => ["Kakuma IV"]} #camps.
        ]

        location_name_1 = "Kenya::Central::Nyeri::Nyeri"
        location_name_2 = "Kenya::Rift Valley::Turkana::Kakuma::Kakuma IV::Zone 1"
  
        service_referred_from_1 = ["health_medical_services", "psychosocial_counseling_services"]
        service_referred_from_2 = ["police_other_security_actor", "legal_assistance_services"]
  
        alleged_perpetrator_1 = [
          {
            "primary_perpetrator" => "Primary",
            "perpetrator_sex" => "Male",
            "former_perpetrator" => "Yes",
            "age_group" => "26-40",
            "perpetrator_relationship" => "Family other than spouse or caregiver",
            "perpetrator_occupation" =>  "Unemployed"
          },
          {
            "primary_perpetrator" => "Secondary",
            "perpetrator_sex" => "Male",
            "former_perpetrator" => "Yes",
            "age_group" => "26-40",
            "perpetrator_relationship" => nil,
            "perpetrator_occupation" =>  nil
          }
        ]
  
        alleged_perpetrator_2 = [
           {
             "primary_perpetrator" => "Primary",
             "perpetrator_sex" => "Female",
             "former_perpetrator" => "Yes",
             "perpetrator_nationality" => "Nationality1",
             "perpetrator_ethnicity" => "Ethnicity1",
             "age_group" => "0-11",
             "perpetrator_relationship" => "Primary Caregiver",
             "perpetrator_occupation" => "Unknown"
           },
           {
             "primary_perpetrator" => "Primary",
             "perpetrator_sex" => "Male",
             "former_perpetrator" => "No",
             "perpetrator_nationality" => "Nationality2",
             "perpetrator_ethnicity" => "Ethnicity2",
             "age_group" => "0-11",
             "perpetrator_relationship" => "Intimate Partner/Former Partner",
             "perpetrator_occupation" => "Unemployed"
           }
        ]
  
        health_medical_referral_subform_section_1 = [
          {:service_medical_referral => "Referred"},
          {:service_medical_referral => "Referred"}
        ]
        health_medical_referral_subform_section_2 = [
          {:service_medical_referral => "Referred"},
          {:service_medical_referral => "No referral, Service provided by your agency"}
        ]
  
        psychosocial_counseling_services_subform_section_1 = [
          {:service_psycho_referral => "Referred", :pursue_legal_action => "Yes"},
          {:service_psycho_referral => "Referred", :pursue_legal_action => "No"}
        ]
        psychosocial_counseling_services_subform_section_2 = [
          {:service_psycho_referral => "Referred", :pursue_legal_action => "Yes"},
          {:service_psycho_referral => "No referral, Service provided by your agency",
           :pursue_legal_action => "Yes"}
        ]
  
        legal_assistance_services_subform_section_1 = [
          {:service_legal_referral => "Referred"},
          {:service_legal_referral => "No referral, Service provided by your agency"}
        ]
        legal_assistance_services_subform_section_2 = [
          {:service_legal_referral => "Referred"}, {:service_legal_referral => "Referred"}
        ]
  
        police_or_other_type_of_security_services_subform_section_1 = [
          {:service_police_referral => "Referred"},
          {:service_police_referral => "No referral, Service provided by your agency"}
        ]
        police_or_other_type_of_security_services_subform_section_2 = [
          {:service_police_referral => "Referred"}, {:service_police_referral => "Referred"}
        ]
  
        livelihoods_services_subform_section_1 = [
          {:service_livelihoods_referral => "Referred"},
          {:service_livelihoods_referral => "No referral, Service provided by your agency"}
        ]
        livelihoods_services_subform_section_2 = [
          {:service_livelihoods_referral => "Referred"}, {:service_livelihoods_referral => "Referred"}
        ]

        @records = [
          @incident_cls.new(
            :short_id => "1", :survivor_code => "5001", :caseworker_code => "4001",
            :date_of_first_report => "2014-01-01", :incident_date => "2013-12-21",
            :date_of_birth => "2001-01-01", :sex => "Female", :country_of_origin => "Somalia",
            :maritial_status => "Single", :displacement_status => "Resident",
            :disability_type => "Mental Disability", :unaccompanied_separated_status => "No",
            :displacement_incident => "During Flight", :incident_timeofday => "Morning (sunrise to noon)",
            :incident_location => location_name_1, :gbv_sexual_violence_type => "Rape",
            :harmful_traditional_practice => "Practice 1", :goods_money_exchanged => "Yes",
            :abduction_status_time_of_incident => "None", :gbv_reported_elsewhere => "No",
            :gbv_previous_incidents => "Yes", :alleged_perpetrator => alleged_perpetrator_1,
            :service_referred_from => service_referred_from_1, 
            :service_safehouse_referral => "Referred",
            :health_medical_referral_subform_section => health_medical_referral_subform_section_1,
            :psychosocial_counseling_services_subform_section => psychosocial_counseling_services_subform_section_1,
            :legal_assistance_services_subform_section => legal_assistance_services_subform_section_1,
            :police_or_other_type_of_security_services_subform_section => police_or_other_type_of_security_services_subform_section_1,
            :livelihoods_services_subform_section => livelihoods_services_subform_section_1
          ),
          @incident_cls.new(
            :short_id => "2", :survivor_code => "5002", :caseworker_code => "4002",
            :date_of_first_report => "2014-01-02", :incident_date => "2013-12-22",
            :date_of_birth => "2002-01-01", :sex => "Male", :country_of_origin => "Uganda",
            :maritial_status => "Married/Cohabitating", :displacement_status => "Refugee",
            :disability_type => nil, :unaccompanied_separated_status => "Separated Child",
            :displacement_incident => "During Refuge", :incident_timeofday => "Afternoon (noon to sunset)",
            :incident_location => location_name_2, :gbv_sexual_violence_type => "Sexual Assault",
            :harmful_traditional_practice => "Practice 2", :goods_money_exchanged => "No",
            :abduction_status_time_of_incident => "Forced Conscription", :gbv_reported_elsewhere => "Yes",
            :gbv_previous_incidents => "No", :alleged_perpetrator => alleged_perpetrator_2,
            :service_referred_from => service_referred_from_2, 
            :service_safehouse_referral => "No referral, Service provided by your agency",
            :health_medical_referral_subform_section => health_medical_referral_subform_section_2,
            :psychosocial_counseling_services_subform_section => psychosocial_counseling_services_subform_section_2,
            :legal_assistance_services_subform_section => legal_assistance_services_subform_section_2,
            :police_or_other_type_of_security_services_subform_section => police_or_other_type_of_security_services_subform_section_2,
            :livelihoods_services_subform_section => livelihoods_services_subform_section_2
          )
        ]
        IncidentRecorderExporter.should_receive(:incident_recorder_county).with(location_name_1).and_return("Nyeri")
        IncidentRecorderExporter.should_receive(:incident_recorder_county).with(location_name_2).and_return("Turkana")
        IncidentRecorderExporter.should_receive(:incident_recorder_district).with(location_name_1).and_return("Central")
        IncidentRecorderExporter.should_receive(:incident_recorder_district).with(location_name_2).and_return("Rift Valley")
        IncidentRecorderExporter.should_receive(:incident_recorder_camp_town).with(location_name_1).and_return(nil)
        IncidentRecorderExporter.should_receive(:incident_recorder_camp_town).with(location_name_2).and_return("Kakuma IV")

        IncidentRecorderExporter.export(@records, nil)
        @workbook = IncidentRecorderExporter.workbook
      end

      it "at sheet '1. Incident Data'" do
        sheet = @workbook.getSheetAt(0)
        verify_values(sheet, @expected_values)
      end

      it "at sheet '2. Menu Data'" do
        sheet = @workbook.getSheetAt(1)
        verify_lookups(sheet, @expected_lookups)
      end
    end

    describe "Export a lot of records" do
      before :each do
        @records = []
        @caseworker_code_lookup = []
        @expected_values = []
        #Current template file has initialized until 1,314 row,
        #far from that will need to create the next bunch of cell.
        #export should be able to create the cells.
        (1..3516).each do |value|
          @caseworker_code_lookup << "400#{value}"
          @expected_values << [value.to_s, "500#{value}", "400#{value}"]
          @records << @incident_cls.new(:short_id => value.to_s, :survivor_code => "500#{value}", :caseworker_code => "400#{value}")
        end
        @expected_lookups = [{:cell_index => 0, :values => @caseworker_code_lookup[0..49]}]
        IncidentRecorderExporter.export(@records, nil)
        @workbook = IncidentRecorderExporter.workbook
      end

      it "at sheet '1. Incident Data' should export all records" do
        sheet = @workbook.getSheetAt(0)
        verify_values(sheet, @expected_values)
      end

      it "at sheet '2. Menu Data' should export only 50 lookups" do
        sheet = @workbook.getSheetAt(1)
        #Lookup allow write in 50 rows, far from that is protected in the spreadsheet.
        verify_lookups(sheet, @expected_lookups)
      end
    end

    after :each do
      FormSection.all.each &:destroy
    end

  end
end