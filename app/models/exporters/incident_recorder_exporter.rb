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

      def authorize_fields_to_user?
        false
      end

    end

    def initialize(output_file_path=nil)
      super(output_file_path)
      @builder = IRBuilder.new(self.buffer)
    end

    def complete
      @builder.close
    end

    # @returns: a String with the Excel file data
    def export(models, _, *args)
       @builder.export(models)
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

      def close
        #Print at the end of the processing the data collected
        #because this is batch mode, this is the end of the processing
        #of all records.
        incident_menu
        @workbook.close
      end

      def initialize(buffer)
        #TODO: I am dubious that these values are correctly accumulated.
        #      Shouldn't we be trying to fetch all possible values,
        #      rather than all values for incidents getting exported?
        #TODO - discuss with Pavel to see if this needs to change per SL-542
        @districts = {}
        @counties = {}
        @camps = {}
        @locations = {}
        @caseworker_code = {}

        @workbook = WriteExcel.new(buffer)
        @data_worksheet = @workbook.add_worksheet('Incident Data')
        @menu_worksheet = @workbook.add_worksheet('Menu Data')

        #Sheet data start at row 1 (based 0 index).
        @row_data = 1
      end

      def incident_data_header
        unless @data_headers.present?
          @data_headers = true
          @data_worksheet.write_row(0, 0, props.keys)
          #TODO revisit, there is a bug in the gem.
          #set_column_widths(@data_worksheet, props.keys)
        end
      end

      def incident_menu_header
        unless @menu_headers.present?
          @menu_headers = true
          header = ["CASEWORKER CODE", "ETHNICITY", "INCIDENT LOCATION", "INCIDENT COUNTY", "INCIDENT DISTRICT", "INCIDENT CAMP"]
          @menu_worksheet.write_row(0, 0, header)
          #TODO revisit, there is a bug in the gem.
          #set_column_widths(@menu_worksheet, header)
        end
      end

      def export(models)
        incident_data(models)
      end

      def incident_recorder_sex(sex)
        r = SEX[sex]
        r.present? ? r : sex
      end

      def perpetrators_sex(perpetrators=[])
        if perpetrators.present?
          gender_list = perpetrators.map{|p| p.perpetrator_sex}
          male_count = gender_list.count {|g| g.try(:downcase) == 'male'}
          female_count = gender_list.count {|g| g.try(:downcase) == 'female'}

          if male_count > 0
            (female_count > 0) ? I18n.t("exports.incident_recorder_xls.gender.both") : I18n.t("exports.incident_recorder_xls.gender.male")
          elsif female_count > 0
            I18n.t("exports.incident_recorder_xls.gender.female")
          end
        end
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

      def all_alleged_perpetrators(model)
        alleged_perpetrators = model.try(:alleged_perpetrator)
        alleged_perpetrators.present? ? alleged_perpetrators : []
      end

      def location_from_hierarchy(location_name, types)
        location = Location.find_types_in_hierarchy(location_name, types)
        location ? location.placename : ""
      end

      def props
         ##### ADMINISTRATIVE INFORMATION #####
         #TODO - discuss with Pavel to see if this needs to change per SL-542
        {"INCIDENT ID" => "incidentid_ir",
         "SURVIVOR CODE" => "survivor_code",
         "CASE MANAGER CODE" => ->(model) do
            caseworker_code = @caseworker_code[model.owned_by]
            unless caseworker_code.present?
              caseworker_code = model.try(:owner).try(:code)
            end
            #Collect information to the "Menu Data" sheet
            @caseworker_code[caseworker_code] = caseworker_code if caseworker_code.present?
            caseworker_code
          end,
          "DATE OF INTERVIEW" => "date_of_first_report",
          "DATE OF INCIDENT" => "incident_date",
          "DATE OF BIRTH" => "date_of_birth",
          "SEX" => ->(model) do
            #Need to convert 'Female' to 'F' and 'Male' to 'M' because
            #the spreadsheet is expecting those values.
            incident_recorder_sex(model.try(:sex))
          end,
          #NOTE: 'H' is hidden and protected in the spreadsheet.
          "ETHNICITY" => "ethnicity",
          "COUNTRY OF ORIGIN" => "country_of_origin",
          "CIVIL / MARITAL STATUS" => "maritial_status",
          "DISPLACEMENT STATUS AT REPORT" => "displacement_status",
          "PERSON WITH DISABILITY?" => "disability_type",
          "UNACCOMPANIED OR SEPARATED CHILD?" => "unaccompanied_separated_status",
          "STAGE OF DISPLACEMENT AT INCIDENT" => "displacement_incident",
          "INCIDENT TIME OF DAY" => ->(model) do
            incident_timeofday = model.try(:incident_timeofday)
            incident_timeofday.present? ? incident_timeofday.split("(").first.strip : nil
          end,
          "INCIDENT LOCATION" => "incident_location_type",
          "INCIDENT COUNTY" => ->(model) do
            county_name = location_from_hierarchy(model.try(:incident_location), ['county'])
            #Collect information to the "2. Menu Data sheet."
            @counties[county_name] = county_name if county_name.present?
            county_name
          end,
          "INCIDENT DISTRICT" => ->(model) do
            district_name = location_from_hierarchy(model.try(:incident_location), ['province'])
            #Collect information to the "2. Menu Data sheet."
            @districts[district_name] = district_name if district_name.present?
            district_name
          end,
          "INCIDENT CAMP / TOWN" => ->(model) do
            camp_town_name = location_from_hierarchy(model.try(:incident_location),['camp', 'city', 'village'])
            #Collect information to the "2. Menu Data sheet."
            @camps[camp_town_name] = camp_town_name if camp_town_name.present?
            camp_town_name
          end,
          "GBV TYPE" => "gbv_sexual_violence_type",
          "HARMFUL TRADITIONAL PRACTICE" => "harmful_traditional_practice",
          "MONEY, GOODS, BENEFITS AND / OR SERVICES EXCHANGED ?" => "goods_money_exchanged",
          "TYPE OF ABDUCTION" => "abduction_status_time_of_incident",
          "PREVIOUSLY REPORTED THIS INCIDENT?" => ->(model) do
            if model.gbv_reported_elsewhere == 'Yes'
              reporting_agency = model.gbv_reported_elsewhere_subform.reduce(false) {|acc, v| acc || (v.gbv_reported_elsewhere_reporting == 'Yes') }

              if reporting_agency
                'Yes-GBVIMS Org / Agency'
              else
                'Yes-Non GBVIMS Org / Agency'
              end
            else
              'No'
            end
          end,
          "PREVIOUS GBV INCIDENTS?" => "gbv_previous_incidents",
          ##### ALLEGED PERPETRATOR INFORMATION #####
          "No. ALLEGED PRIMARY PERPETRATOR(S)" => ->(model) do
            calculated = all_alleged_perpetrators(model).size
            from_ir = model.try(:number_of_individual_perpetrators_from_ir)
            if from_ir.present?
              (calculated.present? && calculated > 1) ? calculated : from_ir
            else
              calculated
            end
          end,
          "ALLEGED PERPETRATOR SEX" => ->(model) do
            perpetrators_sex(all_alleged_perpetrators(model))
          end,
          "PREVIOUS INCIDENT WITH THIS PERPETRATOR" => ->(model) do
            former_perpetrators = primary_alleged_perpetrator(model)
            .map{|ap| ap.try(:former_perpetrator)}
            .select{|is_ap| is_ap != nil}
            if former_perpetrators.include? 'Yes'
              'Yes'
            elsif former_perpetrators.all? { |is_fp| is_fp == 'No' }
              'No'
            end
          end,
          "ALLEGED PERPETRATOR AGE GROUP" => ->(model) do
            incident_recorder_age(primary_alleged_perpetrator(model).first.try(:age_group))
          end,
          "ALLEGED PERPETRATOR - SURVIVOR RELATIONSHIP" => ->(model) do
            primary_alleged_perpetrator(model).first.try(:perpetrator_relationship)
          end,
          "ALLEGED PERPETRATOR OCCUPATION" => ->(model) do
            primary_alleged_perpetrator(model).first.try(:perpetrator_occupation)
          end,
          ##### REFERRAL PATHWAY DATA #####
          "REFERRED TO YOU FROM?" => ->(model) do
            services = model.try(:service_referred_from)
            services.map{|srf| incident_recorder_service_referral_from(srf) }.join(" & ") if services.present?
          end,
          "SAFE HOUSE / SHELTER" => ->(model) do
            incident_recorder_service_referral(model.try(:service_safehouse_referral))
          end,
          "HEALTH / MEDICAL SERVICES" => ->(model) do
            health_medical = model.try(:health_medical_referral_subform_section)
            health_medical.map{|hmr| incident_recorder_service_referral(hmr.try(:service_medical_referral))}.
                            uniq.join(" & ") if health_medical.present?
          end,
          "PSYCHOSOCIAL SERVICES" => ->(model) do
            psychosocial = model.try(:psychosocial_counseling_services_subform_section)
            psychosocial.map{|psycs| incident_recorder_service_referral(psycs.try(:service_psycho_referral))}.
                          uniq.join(" & ") if psychosocial.present?
          end,
          "WANTS LEGAL ACTION?" => ->(model) do
            psychosocial_counseling = model.try(:psychosocial_counseling_services_subform_section)
            if psychosocial_counseling.present?
              legal_actions = psychosocial_counseling.
                map{|psycs| psycs.try(:pursue_legal_action)}
              if legal_actions.include? 'Yes'
                'Yes'
              elsif legal_actions.include? 'No'
                'No'
              elsif legal_actions.include? 'Undecided at time of report'
                'Undecided at time of report'
              end
            end
          end,
          "LEGAL ASSISTANCE SERVICES" => ->(model) do
            legal = model.try(:legal_assistance_services_subform_section)
            legal.map{|psycs| incident_recorder_service_referral(psycs.try(:service_legal_referral))}.
                    uniq.join(" & ") if legal.present?
          end,
          "POLICE / OTHER SECURITY ACTOR" => ->(model) do
            police = model.try(:police_or_other_type_of_security_services_subform_section)
            police.map{|psycs| incident_recorder_service_referral(psycs.try(:service_police_referral))}.
                    uniq.join(" & ") if police.present?
          end,
          "LIVELIHOODS PROGRAM" => ->(model) do
            livelihoods = model.try(:livelihoods_services_subform_section)
            livelihoods.map{|psycs| incident_recorder_service_referral(psycs.try(:service_livelihoods_referral))}.
                          uniq.join(" & ") if livelihoods.present?
          end,
          ##### ADMINISTRATION 2 #####
          "CHILD PROTECTION SERVICES / EDUCATION SERVICES" => ->(model) do
            service_protection_referrals = model.try(:child_protection_services_subform_section)
            service_protection_referrals.map{|psycs| incident_recorder_service_referral(psycs.try(:service_protection_referral))}.
                          uniq.join(" & ") if service_protection_referrals.present?
          end,
          "CONSENT GIVEN" => "consent_reporting",
          "REPORTING AGENCY CODE" => "agency_organization"
        }
      end

      def incident_data(models)
        #Sheet 0 is the "Incident Data".
        incident_data_header
        models.each do |model|
          j = 0
          props.each do |name, prop|
            if prop.present?
              if prop.is_a?(Proc)
                value = prop.call(model)
              else
                value = model.try(prop.to_sym)
              end
              if value.is_a?(Date)
                formatted_value = value.strftime("%d-%b-%Y")
              else
                formatted_value = value
              end
              @data_worksheet.write(@row_data, j, formatted_value) unless formatted_value.nil?
            end
            j += 1
          end
          @row_data += 1
        end
      end

      def incident_menu
        #Sheet 1 is the "Menu Data".
        incident_menu_header
        #lookups.
        #In this sheet only 50 rows are editable for lookups.
        menus = [
          {:cell_index => 0, :values => @caseworker_code.values[0..49]},
          {:cell_index => 1, :values => @locations.values[0..49]},
          {:cell_index => 2, :values => @counties.values[0..49]},
          {:cell_index => 3, :values => @districts.values[0..49]},
          {:cell_index => 4, :values => @camps.values[0..49]}
        ]

        menus.each do |menu|
          #Sheet data start at row 1 (based 0 index).
          i = 1
          #Cell where the data should be push.
          j = menu[:cell_index]
          menu[:values].each do |value|
            @menu_worksheet.write(i, j, value)
            i += 1
          end
        end
      end

      def set_column_widths(worksheet, header)
        header.each_with_index do |v, i|
          worksheet.set_column(i, i, v.length+5)
        end
      end

    end
  end
end
