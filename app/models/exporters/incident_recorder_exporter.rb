# frozen_string_literal: true

# Exports Incident Recorder to an Excel File
# rubocop:disable Metrics/ClassLength
class Exporters::IncidentRecorderExporter < Exporters::BaseExporter
  class << self
    def id
      'incident_recorder_xls'
    end

    def mime_type
      'xlsx'
    end

    def supported_models
      [Incident]
    end

    def excluded_properties
      ['histories']
    end

    def authorize_fields_to_user?
      false
    end
  end

  def initialize(output_file_path = nil, config = {}, options = {})
    super(output_file_path, config, options)
    self.locale = user&.locale || I18n.locale
    @builder = IRBuilder.new(self, locale)
  end

  def complete
    @builder.close
  end

  # @returns: a String with the Excel file data
  def export(models)
    @builder.export(models)
  end

  def setup_export_constraints?
    false
  end

  # private

  # This is a private utility class that encapsulates the business logic of exporting to the GBV IR.
  # The state of the class represents the individual export.
  class IRBuilder < Exporters::IncidentRecorderExporter
    def close
      # Print at the end of the processing the data collected
      # because this is batch mode, this is the end of the processing
      # of all records.
      incident_menu
      @workbook.close
    end

    attr_accessor :exporter

    # TODO: We need to refactor this class, rubocop wants to call super but this throw an exception
    # rubocop:disable Lint/MissingSuper
    def initialize(exporter, locale = nil)
      # TODO: I am dubious that these values are correctly accumulated.
      #      Shouldn't we be trying to fetch all possible values,
      #      rather than all values for incidents getting exported?
      # TODO: discuss with Pavel to see if this needs to change per SL-542
      self.exporter = exporter
      initialize_location_types
      @caseworker_code = {}
      @age_group_count = -1
      @age_type_count = -1
      @fields = initialize_fields
      initialize_workbook(exporter)

      # Sheet data start at row 1 (based 0 index).
      @row_data = 1
      self.locale = locale || I18n.locale
      self.field_value_service = FieldValueService.new
    end
    # rubocop:enable Lint/MissingSuper

    def initialize_location_types
      @districts = {}
      @counties = {}
      @camps = {}
      @locations = {}
    end

    def initialize_workbook(exporter)
      @workbook = WriteXLSX.new(exporter.buffer)
      @data_worksheet = @workbook.add_worksheet('Incident Data')
      @menu_worksheet = @workbook.add_worksheet('Menu Data')
    end

    def initialize_fields
      Field.where(
        name: %w[service_referred_from service_safehouse_referral perpetrator_relationship perpetrator_occupation
                 incidentid_ir survivor_code date_of_first_report incident_date date_of_birth ethnicity
                 country_of_origin maritial_status displacement_status disability_type unaccompanied_separated_status
                 displacement_incident incident_location_type incident_camp_town gbv_sexual_violence_type
                 harmful_traditional_practice goods_money_exchanged abduction_status_time_of_incident
                 gbv_reported_elsewhere gbv_previous_incidents incident_timeofday consent_reporting]
      ).inject({}) { |acc, field| acc.merge(field.name => field) }
    end

    def incident_data_header
      return unless @data_headers.blank?

      @data_headers = true
      @data_worksheet.write_row(
        0, 0, @props.keys.map { |prop| I18n.t("exports.incident_recorder_xls.headers.#{prop}", **locale_hash) }
      )
      # TODO: revisit, there is a bug in the gem.
      # set_column_widths(@data_worksheet, props.keys)
    end

    def incident_menu_header
      return if @menu_headers.present?

      @menu_headers = true
      header = %w[case_worker_code ethnicity location county district camp]
      @menu_worksheet.write_row(
        0, 0, header.map { |prop| I18n.t("exports.incident_recorder_xls.headers.#{prop}", **locale_hash) }
      )
      # TODO: revisit, there is a bug in the gem.
      # set_column_widths(@menu_worksheet, header)
    end

    def export(models)
      incident_data(models)
    end

    def incident_recorder_sex(sex)
      # Spreadsheet is expecting "M" and "F".
      case sex
      when 'male' then I18n.t('exports.incident_recorder_xls.gender.male', **locale_hash)
      when 'female' then I18n.t('exports.incident_recorder_xls.gender.female', **locale_hash)
      end
    end

    def perpetrators_sex(perpetrators = [])
      return unless perpetrators.present?

      gender_list = perpetrators.map { |model| model['perpetrator_sex'] }
      male_count = gender_list.count { |gender| gender == 'male' }
      female_count = gender_list.count { |gender| gender == 'female' }
      perpetrators_sex_string(female_count, male_count)
    end

    def perpetrators_sex_string(female_count, male_count)
      if male_count.positive?
        if female_count.positive?
          I18n.t('exports.incident_recorder_xls.gender.both', **locale_hash)
        else
          I18n.t('exports.incident_recorder_xls.gender.male', **locale_hash)
        end
      elsif female_count.positive?
        I18n.t('exports.incident_recorder_xls.gender.female', **locale_hash)
      end
    end

    def age_group_or_age_type(age_group_count, age_type_count)
      if age_type_count.positive? && age_group_count <= 0
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
        age_group_count = fs.fields.count { |f| f.name == 'age_group' && f.visible? }
        age_type_count = fs.fields.count { |f| f.name == 'age_type' && f.visible? }
      end
      [age_group_count, age_type_count]
    end

    def alleged_perpetrator_header
      # Only calculate these once
      if @age_group_count.negative? || @age_type_count.negative?
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
      age = perpetrators&.first&.[]('age_group')
      incident_recorder_age_groups[age] || age
    end

    def incident_recorder_age_groups
      age_group_label = I18n.t('exports.incident_recorder_xls.age_group.age', **locale_hash)
      @incident_recorder_age_groups ||= {
        '0_11' => "#{age_group_label} 0 - 11",
        '12_17' => "#{age_group_label} 12 - 17",
        '18_25' => "#{age_group_label} 18 - 25",
        '26_40' => "#{age_group_label} 26 - 40",
        '41_60' => "#{age_group_label} 41 - 60",
        '61' => I18n.t('exports.incident_recorder_xls.age_group.61_older', **locale_hash),
        'unknown' => I18n.t('exports.incident_recorder_xls.age_group.unknown', **locale_hash)
      }
    end

    def incident_recorder_age_type(perpetrators)
      return unless perpetrators.present?

      age_type_list = perpetrators.map { |perpetrator| perpetrator['age_type'] }
      adult_count = age_type_list.count { |age_type| age_type == 'adult' }
      minor_count = age_type_list.count { |age_type| age_type == 'minor' }
      unknown_count = age_type_list.count { |age_type| age_type == 'unknown' }
      age_type_string(adult_count, minor_count, unknown_count)
    end

    def age_type_string(adult_count, minor_count, unknown_count)
      if adult_count.positive?
        if minor_count.positive?
          I18n.t('exports.incident_recorder_xls.age_type.both', **locale_hash)
        else
          I18n.t('exports.incident_recorder_xls.age_type.adult', **locale_hash)
        end
      elsif minor_count.positive? then I18n.t('exports.incident_recorder_xls.age_type.minor', **locale_hash)
      elsif unknown_count.positive? then I18n.t('exports.incident_recorder_xls.age_type.unknown', **locale_hash)
      end
    end

    def incident_recorder_service_referral_from(service_referral_from)
      export_value(service_referral_from, @fields['service_referred_from']) if service_referral_from.present?
    end

    def incident_recorder_service_referral(service)
      # The services use the same lookup... using safehouse service field for purpose of translation
      export_value(service, @fields['service_safehouse_referral']) if service.present?
    end

    def primary_alleged_perpetrator(model)
      @alleged_perpetrators ||= model.data['alleged_perpetrator']
                                     &.select { |ap| ap['primary_perpetrator'] == 'primary' }
      @alleged_perpetrators.present? ? @alleged_perpetrators : []
    end

    def all_alleged_perpetrators(model)
      alleged_perpetrators = model.data['alleged_perpetrator']
      alleged_perpetrators.present? ? alleged_perpetrators : []
    end

    # This sets up a hash where
    #   key   -  an identifier which is translated later and used to print the worksheet headers
    #   value -  either: the field on the incident to display  OR
    #                    a proc which derives the value to be displayed
    # TODO: Fix these props. Some of them don't work. A try(:method) is needed in those props to make the export work.
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    def props
      ##### ADMINISTRATIVE INFORMATION #####
      {
        'incident_id' => 'incidentid_ir',
        'survivor_code' => 'survivor_code',
        'case_manager_code' => case_manager_code_props,
        'date_of_interview' => 'date_of_first_report',
        'date_of_incident' => 'incident_date',
        'date_of_birth' => 'date_of_birth',
        'sex' => gender_props,
        'ethnicity' => 'ethnicity',
        'country_of_origin' => 'country_of_origin',
        'marital_status' => 'maritial_status',
        'displacement_status' => 'displacement_status',
        'disability_type' => 'disability_type',
        'unaccompanied_separated_status' => 'unaccompanied_separated_status',
        'stage_of_displacement' => 'displacement_incident',
        'time_of_day' => time_of_day_props,
        'location' => 'incident_location_type',
        'county' => county_props,
        'district' => district_props,
        'camp_town' => 'incident_camp_town',
        'gbv_type' => 'gbv_sexual_violence_type',
        'harmful_traditional_practice' => 'harmful_traditional_practice',
        'goods_money_exchanged' => 'goods_money_exchanged',
        'abduction_type' => 'abduction_status_time_of_incident',
        'previously_reported' => 'gbv_reported_elsewhere',
        'gbv_previous_incidents' => 'gbv_previous_incidents',
        'number_primary_perpetrators' => number_primary_perpetrators_props,
        'perpetrator.sex' => perpetrators_sex_props,
        'perpetrator.former' => perpetrator_former_props,
        alleged_perpetrator_header => alleged_perpetrator_header_props,
        'perpetrator.relationship' => perpetrator_relationship_props,
        'perpetrator.occupation' => perpetrator_occupation_props,
        'service.referred_from' => service_referred_from_props,
        'service.safehouse_referral' => service_safehouse_referral_props,
        'service.medical_referral' => service_medical_referral_props,
        'service.psycho_referral' => service_psycho_referral_props,
        'service.wants_legal_action' => service_legal_assistance_props,
        'service.legal_referral' => service_legal_referral_props,
        'service.police_referral' => service_police_referral_props,
        'service.livelihoods_referral' => service_livelihoods_props,
        'service.protection_referral' => service_protection_referral,
        'consent' => 'consent_reporting',
        'agency_code' => agency_code_props
      }
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength

    def case_manager_code_props
      lambda do |model|
        model&.owner&.code
      end
    end

    def gender_props
      lambda do |model|
        # Need to convert 'Female' to 'F' and 'Male' to 'M' because
        # the spreadsheet is expecting those values.
        incident_recorder_sex(model.data['sex'])
      end
    end

    def time_of_day_props
      lambda do |model|
        incident_timeofday = model.data['incident_timeofday']
        return if incident_timeofday.blank?

        timeofday_translated = export_value(incident_timeofday, @fields['incident_timeofday'])
        # Do not use the display text that is between the parens ()
        timeofday_translated.present? ? timeofday_translated.split('(').first.strip : nil
      end
    end

    def county_props
      lambda do |model|
        county_name = exporter_county_name(model)
        # Collect information to the "2. Menu Data sheet."
        @counties[county_name] = county_name if county_name.present?
        county_name
      end
    end

    def exporter_county_name(model)
      exporter.location_service.ancestor_of_type(model.data['incident_location'], 'county')&.placename || ''
    end

    def district_props
      lambda do |model|
        district_name = exporter_district_name(model)
        # Collect information to the "2. Menu Data sheet."
        @districts[district_name] = district_name if district_name.present?
        district_name
      end
    end

    def exporter_district_name(model)
      exporter.location_service.ancestor_of_type(model.data['incident_location'], 'district')&.placename || ''
    end

    def number_primary_perpetrators_props
      lambda do |model|
        calculated = all_alleged_perpetrators(model).size
        from_ir = model.try(:number_of_individual_perpetrators_from_ir)
        if from_ir.present?
          calculated.present? && calculated > 1 ? calculated : from_ir
        else
          calculated
        end
      end
    end

    def perpetrators_sex_props
      lambda do |model|
        perpetrators_sex(all_alleged_perpetrators(model))
      end
    end

    def perpetrator_former_props
      lambda do |model|
        former_perpetrators = primary_alleged_perpetrator(model).map { |ap| ap['former_perpetrator'] }.reject(&:nil?)
        if former_perpetrators.include? 'true'
          I18n.t('exports.incident_recorder_xls.yes', **locale_hash)
        elsif former_perpetrators.all? { |is_fp| is_fp == 'false' }
          I18n.t('exports.incident_recorder_xls.no', **locale_hash)
        end
      end
    end

    def alleged_perpetrator_header_props
      lambda do |model|
        incident_recorder_age(all_alleged_perpetrators(model))
      end
    end

    def perpetrator_relationship_props
      lambda do |model|
        relationship = primary_alleged_perpetrator(model).first.try(:[], 'perpetrator_relationship')
        export_value(relationship, @fields['perpetrator_relationship']) if relationship.present?
      end
    end

    def perpetrator_occupation_props
      lambda do |model|
        occupation = primary_alleged_perpetrator(model).first.try(:[], 'perpetrator_occupation')
        export_value(occupation, @fields['perpetrator_occupation']) if occupation.present?
      end
    end

    def service_referred_from_props
      lambda do |model|
        services = model.data['service_referred_from']
        if services.present?
          if services.is_a?(Array)
            services.map { |service| incident_recorder_service_referral_from(service) }.join(' & ')
          else
            incident_recorder_service_referral_from(services)
          end
        end
      end
    end

    def service_safehouse_referral_props
      lambda do |model|
        incident_recorder_service_referral(model.data['service_safehouse_referral'])
      end
    end

    def service_medical_referral_props
      lambda do |model|
        service_value = model.health_medical_referral_subform_section.try(:first).try(:[], 'service_medical_referral')
        incident_recorder_service_referral(service_value) if service_value.present?
      end
    end

    def service_psycho_referral_props
      lambda do |model|
        service_value = model.psychosocial_counseling_services_subform_section.try(:first)
                             .try(:[], 'service_psycho_referral')
        incident_recorder_service_referral(service_value) if service_value.present?
      end
    end

    def service_legal_assistance_props
      lambda do |model|
        legal_counseling = model.try(:legal_assistance_services_subform_section)
        return if legal_counseling.blank?

        actions = legal_counseling.map { |l| l.try(:[], 'pursue_legal_action') }
        if actions.include?('true') then I18n.t('exports.incident_recorder_xls.yes', **locale_hash)
        elsif actions.include?('false') then I18n.t('exports.incident_recorder_xls.no', **locale_hash)
        elsif actions.include?('undecided')
          I18n.t('exports.incident_recorder_xls.service_referral.undecided', **locale_hash)
        end
      end
    end

    def service_legal_referral_props
      lambda do |model|
        service_value = model.legal_assistance_services_subform_section.try(:first)
                             .try(:[], 'service_legal_referral')
        incident_recorder_service_referral(service_value) if service_value.present?
      end
    end

    def service_police_referral_props
      lambda do |model|
        service_value = model.police_or_other_type_of_security_services_subform_section
                             .try(:first).try(:[], 'service_police_referral')
        incident_recorder_service_referral(service_value) if service_value.present?
      end
    end

    def service_livelihoods_props
      lambda do |model|
        service_value = model.livelihoods_services_subform_section
                             .try(:first).try(:[], 'service_livelihoods_referral')
        incident_recorder_service_referral(service_value) if service_value.present?
      end
    end

    def service_protection_referral
      lambda do |model|
        service_value = model.child_protection_services_subform_section
                             .try(:first).try(:[], 'service_protection_referral')
        incident_recorder_service_referral(service_value) if service_value.present?
      end
    end

    def agency_code_props
      lambda do |model|
        Agency.get_field_using_unique_id(model.data['created_organization'], :agency_code)
      end
    end

    def format_value(prop, value)
      if value.is_a?(Date)
        I18n.l(value, **locale_hash)
      elsif prop.is_a?(Proc)
        value
      else
        # All of the Procs above should already be translated.
        # Only worry about translating the string properties (i.e. the ones using the field name)
        export_value(value, @fields[prop])
      end
    end

    def incident_data(models)
      # Sheet 0 is the "Incident Data".
      @props = props
      incident_data_header
      models.each do |model|
        @alleged_perpetrators = nil
        write_model_data(model)
        @row_data += 1
      end
    end

    def write_model_data(model)
      @props.each_with_index do |(_, prop), index|
        next unless prop.present?

        value = prop.is_a?(Proc) ? prop.call(model) : model.data[prop]
        formatted_value = format_value(prop, value).to_s
        @data_worksheet.write(@row_data, index, formatted_value) unless formatted_value.nil?
      end
    end

    def incident_menu
      # Sheet 1 is the "Menu Data".
      incident_menu_header
      # lookups.
      # In this sheet only 50 rows are editable for lookups.
      menus = [
        { cell_index: 0, values: @caseworker_code.values[0..49] },
        { cell_index: 1, values: @locations.values[0..49] },
        { cell_index: 2, values: @counties.values[0..49] },
        { cell_index: 3, values: @districts.values[0..49] },
        { cell_index: 4, values: @camps.values[0..49] }
      ]
      write_menus(menus)
    end

    def write_menus(menus)
      menus.each do |menu|
        # Sheet data start at row 1 (based 0 index).
        i = 1
        # Cell where the data should be push.
        j = menu[:cell_index]
        menu[:values].each do |value|
          @menu_worksheet.write(i, j, value)
          i += 1
        end
      end
    end

    def set_column_widths(worksheet, header)
      header.each_with_index do |v, i|
        worksheet.set_column(i, i, v.length + 5)
      end
    end
  end
end
# rubocop:enable Metrics/ClassLength
