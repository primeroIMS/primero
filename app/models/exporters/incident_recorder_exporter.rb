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
    class IRBuilder < IncidentRecorderExporter
      # extend Memoist

      #Spreadsheet is expecting "M" and "F".
      SEX = { "male" => I18n.t("exports.incident_recorder_xls.gender.male"),
              "female" => I18n.t("exports.incident_recorder_xls.gender.female") }

      #TODO: Should we change the value in the form section?  If we do, this can go away and just use the field translation
      #      spreadsheet is expecting the "Age" at the beginning and the dash between blanks.
      AGE_GROUP = { "0_11" => "#{I18n.t("exports.incident_recorder_xls.age_group.age")} 0 - 11",
                    "12_17" => "#{I18n.t("exports.incident_recorder_xls.age_group.age")} 12 - 17",
                    "18_25" => "#{I18n.t("exports.incident_recorder_xls.age_group.age")} 18 - 25",
                    "26_40" => "#{I18n.t("exports.incident_recorder_xls.age_group.age")} 26 - 40",
                    "41_60" => "#{I18n.t("exports.incident_recorder_xls.age_group.age")} 41 - 60",
                    "61" => I18n.t("exports.incident_recorder_xls.age_group.61_older"),
                    "unknown" => I18n.t("exports.incident_recorder_xls.age_group.unknown") }

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
        @age_group_count = -1
        @age_type_count = -1
        @fields = Field.find_by_name([
          'service_referred_from',
          'service_safehouse_referral',
          'perpetrator_relationship',
          'perpetrator_occupation',
          'incidentid_ir',
          'survivor_code',
          'date_of_first_report',
          'incident_date',
          'date_of_birth',
          'ethnicity',
          'country_of_origin',
          'maritial_status',
          'displacement_status',
          'disability_type',
          'unaccompanied_separated_status',
          'displacement_incident',
          'incident_location_type',
          'incident_camp_town',
          'gbv_sexual_violence_type',
          'harmful_traditional_practice',
          'goods_money_exchanged',
          'abduction_status_time_of_incident',
          'gbv_reported_elsewhere',
          'gbv_previous_incidents'
        ]).inject({}) { |acc, field| acc.merge({ field.name => field }) }

        @workbook = WriteExcel.new(buffer)
        @data_worksheet = @workbook.add_worksheet('Incident Data')
        @menu_worksheet = @workbook.add_worksheet('Menu Data')

        #Sheet data start at row 1 (based 0 index).
        @row_data = 1
      end

      def incident_data_header
        if @data_headers.blank?
          @data_headers = true
          @data_worksheet.write_row(0, 0, @props.keys.map{|prop| I18n.t("exports.incident_recorder_xls.headers.#{prop}")})
          #TODO revisit, there is a bug in the gem.
          #set_column_widths(@data_worksheet, props.keys)
        end
      end

      def incident_menu_header
        unless @menu_headers.present?
          @menu_headers = true
          header = ['case_worker_code', 'ethnicity', 'location', 'county', 'district', 'camp']
          @menu_worksheet.write_row(0, 0, header.map{|prop| I18n.t("exports.incident_recorder_xls.headers.#{prop}")})
          #TODO revisit, there is a bug in the gem.
          #set_column_widths(@menu_worksheet, header)
        end
      end

      def export(models)
        incident_data(models)
      end

      def incident_recorder_sex(sex)
        SEX[sex] || sex
      end

      def perpetrators_sex(perpetrators=[])
        if perpetrators.present?
          gender_list = perpetrators.map{|p| p.perpetrator_sex}
          male_count = gender_list.count {|gender| gender == 'male'}
          female_count = gender_list.count {|gender| gender == 'female'}

          if male_count > 0
            (female_count > 0) ? I18n.t("exports.incident_recorder_xls.gender.both") : I18n.t("exports.incident_recorder_xls.gender.male")
          elsif female_count > 0
            I18n.t("exports.incident_recorder_xls.gender.female")
          end
        end
      end

      def age_group_or_age_type(age_group_count, age_type_count)
        if age_type_count > 0 && age_group_count <= 0
          'age_type'
        else
          'age_group'
        end
      end

      def age_group_and_type_count
        age_group_count = 0
        age_type_count = 0
        fs = FormSection.find_by(unique_id: 'alleged_perpetrator')
        if fs.present?
          age_group_count = fs.fields.count{|f| f.name == 'age_group' and f.visible?}
          age_type_count = fs.fields.count{|f| f.name == 'age_type' and f.visible?}
        end
        return age_group_count, age_type_count
      end

      def alleged_perpetrator_header
        #Only calculate these once
        if @age_group_count < 0 || @age_type_count < 0
          @age_group_count, @age_type_count = age_group_and_type_count
        end

        case age_group_or_age_type(@age_group_count, @age_type_count)
          when 'age_type'
            'perpetrator.age_type'
          else
            'perpetrator.age_group'
        end
      end

      def incident_recorder_age(perpetrators)
        case age_group_or_age_type(@age_group_count, @age_type_count)
          when 'age_type'
            incident_recorder_age_type(perpetrators)
          else
            incident_recorder_age_group(perpetrators)
        end
      end

      def incident_recorder_age_group(perpetrators)
        age = perpetrators.first.try(:age_group)
        AGE_GROUP[age] || age
      end

      def incident_recorder_age_type(perpetrators)
        if perpetrators.present?
          age_type_list = perpetrators.map{|p| p.age_type}
          adult_count = age_type_list.count {|age_type| age_type == 'adult'}
          minor_count = age_type_list.count {|age_type| age_type == 'minor'}
          unknown_count = age_type_list.count {|age_type| age_type == 'unknown'}

          if adult_count > 0
            (minor_count > 0) ? I18n.t("exports.incident_recorder_xls.age_type.both") : I18n.t("exports.incident_recorder_xls.age_type.adult")
          elsif minor_count > 0
            I18n.t("exports.incident_recorder_xls.age_type.minor")
          elsif unknown_count > 0
            I18n.t("exports.incident_recorder_xls.age_type.unknown")
          end
        end
      end

      def incident_recorder_service_referral_from(service_referral_from)
        export_value(service_referral_from, @fields['service_referred_from']) if service_referral_from.present?
      end

      def incident_recorder_service_referral(service)
        #The services use the same lookup... using safehouse service field for purpose of translation
        export_value(service, @fields['service_safehouse_referral']) if service.present?
      end

      def primary_alleged_perpetrator(model)
        @alleged_perpetrators ||= model.try(:alleged_perpetrator).try(:select) {|ap| ap.try(:primary_perpetrator) == "primary"}
        @alleged_perpetrators.present? ? @alleged_perpetrators : []
      end

      def all_alleged_perpetrators(model)
        alleged_perpetrators = model.try(:alleged_perpetrators)
        alleged_perpetrators.present? ? alleged_perpetrators : []
      end

      def location_from_hierarchy(location_name, types)
        return '' if location_name.nil?

        location = Location.find_types_in_hierarchy(location_name, types)
        location.present? ? location.try(:placename) : ""
      end

      # This sets up a hash where
      #   key   -  an identifier which is translated later and used to print the worksheet headers
      #   value -  either: the field on the incident to display  OR
      #                    a proc which derives the value to be displayed
      #TODO: Fix these props. Some of them don't work. A try(:method) is needed in those props to make the export work.
      def props
         ##### ADMINISTRATIVE INFORMATION #####
        {
          'incident_id' => "incidentid_ir",
          'survivor_code' => "survivor_code",
          'case_manager_code' => ->(model) do
            caseworker_code = @caseworker_code[model.owned_by]
            if caseworker_code.blank?
              caseworker_code = model.try(:owner).try(:code)
            end
            #Collect information to the "Menu Data" sheet
            @caseworker_code[caseworker_code] = caseworker_code if caseworker_code.present?
            caseworker_code
          end,
          'date_of_interview' => "date_of_first_report",
          'date_of_incident' => "incident_date",
          'date_of_birth' => "date_of_birth",
          'sex' => ->(model) do
            #Need to convert 'Female' to 'F' and 'Male' to 'M' because
            #the spreadsheet is expecting those values.
            incident_recorder_sex(model.try(:sex))
          end,
          #NOTE: 'H' is hidden and protected in the spreadsheet.
          'ethnicity' => "ethnicity",
          'country_of_origin' => "country_of_origin",
          'marital_status' => "maritial_status",
          'displacement_status' => "displacement_status",
          'disability_type' => "disability_type",
          'unaccompanied_separated_status' => "unaccompanied_separated_status",
          'stage_of_displacement' => "displacement_incident",
          'time_of_day' => ->(model) do
            incident_timeofday = model.try(:incident_timeofday)
            return if incident_timeofday.blank?
            timeofday_translated = export_value(incident_timeofday, @fields['incident_timeofday'])
            #Do not use the display text that is between the parens ()
            timeofday_translated.present? ? timeofday_translated.split("(").first.strip : nil
          end,
          'location' => "incident_location_type",
          'county' => ->(model) do
            county_name = location_from_hierarchy(model.try(:incident_location), ['county'])
            #Collect information to the "2. Menu Data sheet."
            @counties[county_name] = county_name if county_name.present?
            county_name
          end,
          'district' => ->(model) do
            district_name = location_from_hierarchy(model.try(:incident_location), ['province'])
            #Collect information to the "2. Menu Data sheet."
            @districts[district_name] = district_name if district_name.present?
            district_name
          end,
          'camp_town' => "incident_camp_town",
          'gbv_type' => "gbv_sexual_violence_type",
          'harmful_traditional_practice' => "harmful_traditional_practice",
          'goods_money_exchanged' => "goods_money_exchanged",
          'abduction_type' => "abduction_status_time_of_incident",
          'previously_reported' => "gbv_reported_elsewhere",
          'gbv_previous_incidents' => "gbv_previous_incidents",
          ##### ALLEGED PERPETRATOR INFORMATION #####
          'number_primary_perpetrators' => ->(model) do
            calculated = all_alleged_perpetrators(model).size
            from_ir = model.try(:number_of_individual_perpetrators_from_ir)
            if from_ir.present?
              (calculated.present? && calculated > 1) ? calculated : from_ir
            else
              calculated
            end
          end,
          'perpetrator.sex' => ->(model) do
            perpetrators_sex(all_alleged_perpetrators(model))
          end,
          'perpetrator.former' => ->(model) do
            former_perpetrators = primary_alleged_perpetrator(model).map{|ap| ap.try(:former_perpetrator)}.select{|is_ap| is_ap != nil}
            if former_perpetrators.include? true
              I18n.t("exports.incident_recorder_xls.yes")
            elsif former_perpetrators.all? { |is_fp| is_fp == false }
              I18n.t("exports.incident_recorder_xls.no")
            end
          end,
          alleged_perpetrator_header => ->(model) do
            incident_recorder_age(all_alleged_perpetrators(model))
          end,
          'perpetrator.relationship' => ->(model) do
            relationship = primary_alleged_perpetrator(model).first.try(:perpetrator_relationship)
            export_value(relationship, @fields['perpetrator_relationship']) if relationship.present?
          end,
          'perpetrator.occupation' => ->(model) do
            occupation = primary_alleged_perpetrator(model).first.try(:perpetrator_occupation)
            export_value(occupation, @fields['perpetrator_occupation']) if occupation.present?
          end,
          ##### REFERRAL PATHWAY DATA #####
          'service.referred_from' => ->(model) do
            services = model.try(:service_referred_from)
            if services.present?
              if services.is_a?(Array)
                services.map{|service| incident_recorder_service_referral_from(service) }.join(" & ")
              else
                incident_recorder_service_referral_from(services)
              end
            end
          end,
          'service.safehouse_referral' => ->(model) do
            incident_recorder_service_referral(model.try(:service_safehouse_referral))
          end,
          'service.medical_referral' => ->(model) do
            service_value = model.health_medical_referral_subform_section.try(:first).try(:[], 'service_medical_referral')
            incident_recorder_service_referral(service_value) if service_value.present?
          end,
          'service.psycho_referral' => ->(model) do
            service_value = model.psychosocial_counseling_services_subform_section.try(:first).try(:[], 'service_psycho_referral')
            incident_recorder_service_referral(service_value) if service_value.present?
          end,
          'service.wants_legal_action' => ->(model) do
            legal_counseling = model.try(:legal_assistance_services_subform_section)
            if legal_counseling.present?
              legal_actions = legal_counseling.
                  map{|l| l.try(:pursue_legal_action)}
              if legal_actions.include? true
                I18n.t("exports.incident_recorder_xls.yes")
              elsif legal_actions.include? false
                I18n.t("exports.incident_recorder_xls.no")
              elsif legal_actions.include? nil
                I18n.t("exports.incident_recorder_xls.service_referral.undecided")
              end
            end
          end,
          'service.legal_referral' => ->(model) do
            service_value = model.legal_assistance_services_subform_section.try(:first).try(:[], 'service_legal_referral')
            incident_recorder_service_referral(service_value) if service_value.present?
          end,
          'service.police_referral' => ->(model) do
            service_value = model.police_or_other_type_of_security_services_subform_section.try(:first).try(:[], 'service_police_referral')
            incident_recorder_service_referral(service_value) if service_value.present?
          end,
          'service.livelihoods_referral' => ->(model) do
            service_value = model.livelihoods_services_subform_section.try(:first).try(:[], 'service_livelihoods_referral')
            incident_recorder_service_referral(service_value) if service_value.present?
          end,
          ##### ADMINISTRATION 2 #####
          'service.protection_referral' => ->(model) do
            service_value = model.child_protection_services_subform_section.try(:first).try(:[], 'service_protection_referral')
            incident_recorder_service_referral(service_value) if service_value.present?
          end,
          'consent' => "consent_reporting",
          'agency_code' => ->(model) do
            model.owner.try(:agency).try(:agency_code)
          end
        }
      end

      def format_value(prop, value)
        if value.is_a?(Date)
          I18n.l(value)
        elsif prop.is_a?(Proc)
          value
        else
          # All of the Procs above should already be translated.
          # Only worry about translating the string properties (i.e. the ones using the field name)
          export_value(value, @fields[prop].try(:first))
        end
      end

      def incident_data(models)
        #Sheet 0 is the "Incident Data".
        @props = props
        incident_data_header
        models.each do |model|
          @alleged_perpetrators = nil
          j = 0
          @props.each do |name, prop|
            if prop.present?
              value = prop.is_a?(Proc) ? prop.call(model) : model.try(prop.to_sym)
              formatted_value = format_value(prop, value)
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
