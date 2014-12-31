module Exporters
  class IncidentRecorderExporter < BaseExporter
    class << self

      def id
        "incident_recorder_xls"
      end

      def mime_type
        "xls"
      end

      def supported_models
        [Incident]
      end

      def excluded_properties
        ["histories"]
      end

      # @returns: a String with the Excel file data
      def export(models, _, *args)
        builder = IRBuilder.new
        builder.export(models)
      end

    end

    #private

    #This is a private utility class that encapsulates the business logic of exporting to the GBV IR.
    #The state of the class represents the individual export.
    class IRBuilder
      extend Memoist

      #Spreadsheet is expecting "M" and "F".
      SEX = { "Male" => "M", "Female" => "F" }

      #TODO: should we change the value in the form section ?.
      #      spreadsheet is expecting the "Age" at the beginning and the dash between blanks.
      AGE_GROUP = { "0-11" => "Age 0 - 11",
                    "12-17" => "Age 12 - 17",
                    "18-25" => "Age 18 - 25",
                    "26-40" => "Age 26 - 40",
                    "41-60" => "Age 41 - 60",
                    "61+" => "Age 61 & Older",
                    "Unknown" =>"Unknown" }

      SERVICE_REFERRED_FROM = {
        "health_medical_services" => "Health / Medical Services",
        "psychosocial_counseling_services" => "Psychosocial / Counseling Services",
        "police_other_security_actor" => "Police / Other Security Actor",
        "legal_assistance_services" => "Legal Assistance Services",
        "livelihoods_program" => "Livelihoods Program",
        "self_referral_first_point_of_contact" => "Self Referral / First Point of Contact",
        "teacher_school_official" => "Teacher / School Official",
        "community_or_camp_leader" => "Community or Camp Leader",
        "safe_house_shelter" => "Safe House / Shelter",
        "other_humanitarian_or_development_actor" => "Other Humanitarian or Development Actor",
        "other_government_service" => "Other Government Service",
        "other" => "Other"
      }

      SERVICE_REFERRAL = {
        "Referred" => "Referred",
        "No referral, Service provided by your agency" => "Service provided by your agency",
        "No referral, Services already received from another agency" => "Services already received from another agency",
        "No referral, Service not applicable" => "Service not applicable",
        "No, Referral declined by survivor" => "Referral declined by survivor",
        "No referral, Service unavailable" => "Service unavailable"
      }

      def initialize
        #TODO: I am dubious that these values are correctly accumulated.
        #      Shouldn't we be trying to fetch all possible values,
        #      rather than all values for incidents getting exported?
        @districts = {}
        @counties = {}
        @camps = {}
        @locations = {}
        @caseworker_code = {}
      end

      def export(models)
        poi = Poi.instance
        ir_template = Rails.root.join("incident_report_template", "IRv66_Blank-MARA.xls").to_s
        workbook = poi.open_workbook_from_template(ir_template)
        incident_data(models, workbook)
        incident_menu(workbook)
        poi.workbook_to_string(workbook)
      end

      def incident_recorder_sex(sex)
        r = SEX[sex]
        r.present? ? r : sex
      end

      def incident_recorder_age(age)
        r = AGE_GROUP[age]
        r.present? ? r : age
      end

      def incident_recorder_service_referral_from(service_referral_from)
        r = SERVICE_REFERRED_FROM[service_referral_from]
        r.present? ? r : service_referral_from
      end

      def incident_recorder_service_referral(service)
        r = SERVICE_REFERRAL[service]
        r.present? ? r : service
      end

      def primary_alleged_perpetrator(model)
        alleged_perpetrator = model.try(:alleged_perpetrator)
        return [] if alleged_perpetrator.blank?
        alleged_perpetrator.select{|ap| ap.try(:primary_perpetrator) == "Primary"}
      end
      memoize :primary_alleged_perpetrator

      def location_from_hierarchy(location_name, types)
        location = Location.find_types_in_hierarchy(location_name, types)
        location ? location.placename : ""
      end

      def props
         ##### ADMINISTRATIVE INFORMATION #####
        ["short_id", "survivor_code",
          #CASEWORKER CODE
          ->(model) do
            caseworker_code = model.try(:caseworker_code)
            #Collect information to the "2. Menu Data" sheet."
            @caseworker_code[caseworker_code] = caseworker_code if caseworker_code.present?
            caseworker_code
          end,
          "date_of_first_report", "incident_date",
          ##### SURVIVOR INFORMATION.
          "date_of_birth",
          #SEX
          ->(model) do
            #Need to convert 'Female' to 'F' and 'Male' to 'M' because
            #the spreadsheet is expecting those values.
            incident_recorder_sex(model.try(:sex))
          end,
          #NOTE: 'H' is hidden and protected in the spreadsheet.
          "",
          "country_of_origin", "maritial_status", "displacement_status",
          "disability_type", "unaccompanied_separated_status",
          ##### DETAILS OF THE INCIDENT #####
          "displacement_incident", "incident_timeofday",
          #INCIDENT LOCATION
          ->(model) do
            #cut off the hierarchical structure from the name.
            location_name = Location.placename_from_name(model.try(:incident_location))
            #Collect information to the "2. Menu Data" sheet."
            @locations[location_name] = location_name if location_name.present?
            location_name
          end,
          #INCIDENT COUNTY
          ->(model) do
            county_name = location_from_hierarchy(model.try(:incident_location), ['county'])
            #Collect information to the "2. Menu Data sheet."
            @counties[county_name] = county_name if county_name.present?
            county_name
          end,
          #INCIDENT DISTRICT
          ->(model) do
            district_name = location_from_hierarchy(model.try(:incident_location), ['province'])
            #Collect information to the "2. Menu Data sheet."
            @districts[district_name] = district_name if district_name.present?
            district_name
          end,
          #INCIDENT CAMP TOWN"
          ->(model) do
            camp_town_name = location_from_hierarchy(model.try(:incident_location),['camp', 'city', 'village'])
            #Collect information to the "2. Menu Data sheet."
            @camps[camp_town_name] = camp_town_name if camp_town_name.present?
            camp_town_name
          end,
          "gbv_sexual_violence_type", "harmful_traditional_practice", "goods_money_exchanged",
          "abduction_status_time_of_incident", "gbv_reported_elsewhere", "gbv_previous_incidents",
          ##### ALLEGED PERPETRATOR INFORMATION #####
          #No. ALLEGED PRIMARY PERPETRATOR(S).
          ->(model) do
            primary_alleged_perpetrator(model).size
          end,
          #ALLEGED PERPETRATOR SEX.
          ->(model) do
            primary_alleged_perpetrator(model).
              map{|ap| incident_recorder_sex(ap.try(:perpetrator_sex))}.uniq.join(" and ")
          end,
          #PREVIOUS INCIDENT WITH THIS PERPETRATOR.
          ->(model) do
            primary_alleged_perpetrator(model).
              select{|ap| ap.try(:former_perpetrator) == "Yes"}.
              first.try(:former_perpetrator)
          end,
          #ALLEGED PERPETRATOR AGE GROUP.
          ->(model) do
            age_group_list = primary_alleged_perpetrator(model).
                    map{|ap| ap.try(:age_group) }.uniq.reject(&:blank?)
            if age_group_list.size > 1
              "Multiple Age Groups"
            else
              incident_recorder_age(age_group_list.first)
            end
          end,
          #ALLEGED PERPETRATOR - SURVIVOR RELATIONSHIP.
          ->(model) do
            primary_alleged_perpetrator(model).first.try(:perpetrator_relationship)
          end,
          #ALLEGED PERPETRATOR OCCUPATION.
          ->(model) do
            primary_alleged_perpetrator(model).first.try(:perpetrator_occupation)
          end,
          ##### REFERRAL PATHWAY DATA #####
          #REFERRED TO YOU FROM?.
          ->(model) do
            services = model.try(:service_referred_from)
            services.map{|srf| incident_recorder_service_referral_from(srf) }.join(" & ") if services.present?
          end,
          #SAFE HOUSE / SHELTER.
          ->(model) do
            incident_recorder_service_referral(model.try(:service_safehouse_referral))
          end,
          #HEALTH / MEDICAL SERVICES
          ->(model) do
            health_medical = model.try(:health_medical_referral_subform_section)
            health_medical.map{|hmr| incident_recorder_service_referral(hmr.try(:service_medical_referral))}.
                            uniq.join(" & ") if health_medical.present?
          end,
          #PSYCHOSOCIAL SERVICES
          ->(model) do
            psychosocial = model.try(:psychosocial_counseling_services_subform_section)
            psychosocial.map{|psycs| incident_recorder_service_referral(psycs.try(:service_psycho_referral))}.
                          uniq.join(" & ") if psychosocial.present?
          end,
          #WANTS LEGAL ACTION?
          ->(model) do
            psychosocial_counseling = model.try(:psychosocial_counseling_services_subform_section)
            if psychosocial_counseling.present?
              psychosocial_counseling.
                select{|psycs| psycs.try(:pursue_legal_action) == "Yes"}.
                first.try(:pursue_legal_action)
            end
          end,
          #LEGAL ASSISTANCE SERVICES
          ->(model) do
            legal = model.try(:legal_assistance_services_subform_section)
            legal.map{|psycs| incident_recorder_service_referral(psycs.try(:service_legal_referral))}.
                    uniq.join(" & ") if legal.present?
          end,
          #POLICE / OTHER SECURITY ACTOR
          ->(model) do
            police = model.try(:police_or_other_type_of_security_services_subform_section)
            police.map{|psycs| incident_recorder_service_referral(psycs.try(:service_police_referral))}.
                    uniq.join(" & ") if police.present?
          end,
          #LIVELIHOODS PROGRAM
          ->(model) do
            livelihoods = model.try(:livelihoods_services_subform_section)
            livelihoods.map{|psycs| incident_recorder_service_referral(psycs.try(:service_livelihoods_referral))}.
                          uniq.join(" & ") if livelihoods.present?
          end,
          ##### ADMINISTRATION 2 #####
          "consent_reporting",
          "agency_organization"
        ]
      end

      def incident_data(models, workbook)
        #Sheet 0 is the "1. Incident Data".
        sheet = workbook.getSheetAt(0)
        #Sheet data start at row 5 (based 0 index).
        i = 4
        models.each do |model|
          row = sheet.getRow(i)
          #Current template file has initialized until 4,510 rows,
          #far from that will need to create the next bunch of rows.
          row = sheet.createRow(i) if row.nil?
          j = 0
          props.each do |prop|
            if prop.present?
              cell = row.getCell(j)
              #Current template file has initialized until 1,314 rows with cells,
              #far from that will need to create the next bunch of cell.
              cell = row.createCell(j) if cell.nil?
              if prop.is_a?(Proc)
                value = prop.call(model)
              else
                value = model.try(prop.to_sym)
              end
              #TODO: how to simulate typing? some macro is executed?
              #      formating dates using that format seems to work,
              #      but when typing the values look different in the spreadsheet.
              value = value.strftime("%d-%b-%Y") if value.is_a?(Date)
              cell.setCellValue(value)
            end
            j += 1
          end
          i += 1
        end
      end

      def incident_menu(workbook)
        #Sheet 1 is the "2. Menu Data".
        sheet = workbook.getSheetAt(1)

        #lookups.
        #In this sheet only 50 rows are editable for lookups.
        menus = [
          {:cell_index => 0, :values => @caseworker_code.values[0..49]},
          {:cell_index => 4, :values => @locations.values[0..49]},
          {:cell_index => 6, :values => @counties.values[0..49]},
          {:cell_index => 8, :values => @districts.values[0..49]},
          {:cell_index => 10, :values => @camps.values[0..49]}
        ]

        menus.each do |menu|
          #Sheet data start at row 5 (based 0 index).
          i = 4
          #Cell where the data should be push.
          j = menu[:cell_index]
          menu[:values].each do |value|
            row = sheet.getRow(i)
            cell = row.getCell(j)
            cell.setCellValue(value)
            i += 1
          end
        end
      end

    end
  end
end
