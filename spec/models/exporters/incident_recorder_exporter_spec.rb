# frozen_string_literal: true

require 'rails_helper'

require 'roo'

module Exporters
  describe IncidentRecorderExporter do
    before :each do
      clean_data(Agency, Role, UserGroup, User, PrimeroProgram, Field, FormSection, PrimeroModule, Incident, Location,
                 Lookup)
      subform = FormSection.new(
        name: 'cases_test_subform_2', parent_form: 'case', 'visible' => false, 'is_nested' => true,
        order_form_group: 0, order: 0, order_subform: 0, form_group_id: 'cases_test_subform_2',
        unique_id: 'cases_test_subform_2'
      )
      subform.fields << Field.new(name: 'field_3', type: Field::TEXT_FIELD, display_name: 'field_3')
      subform.fields << Field.new(name: 'field_4', type: Field::TEXT_FIELD, display_name: 'field_4')
      subform.save!
      form1 = FormSection.new(
        name: 'cases_test_form_3', parent_form: 'case', 'visible' => true, order_form_group: 0,
        order: 0, order_subform: 0, form_group_id: 'cases_test_form_3', unique_id: 'cases_test_form_3'
      )
      form1.fields << Field.new(
        name: 'incidentid_ir', type: Field::SUBFORM, display_name: 'incidentid ir', 'subform_section_id' => subform.id
      )
      form1.save!
      form2 = FormSection.new(
        :name => 'cases_test_form_2', parent_form: 'case', 'visible' => true, order_form_group: 0,
        order: 0, order_subform: 0, form_group_id: 'cases_test_form_2', unique_id: 'cases_test_form_2'
      )
      form2.fields << Field.new(name: 'relationship', type: Field::TEXT_FIELD, display_name: 'relationship')
      form2.fields << Field.new(
        name: 'array_field', type: Field::SELECT_BOX, display_name: 'array_field', multi_select: true,
        option_strings_text: [{ id: 'option1', display_text: 'Option1' }, { id: 'option2', display_text: 'Option2' },
                              { id: 'option5', display_text: 'Option5' }, { id: 'option4', display_text: 'Option4' }]
                              .map(&:with_indifferent_access)
      )
      form2.save!
      subform = FormSection.new(
        name: 'cases_test_subform_1', parent_form: 'case', 'visible' => false, 'is_nested' => true, order_form_group: 0,
        order: 0, order_subform: 0, form_group_id: 'cases_test_subform_1', unique_id: 'cases_test_subform_1'
      )
      subform.fields << Field.new(name: 'field_1', type: Field::TEXT_FIELD, display_name: 'field_1')
      subform.fields << Field.new(name: 'field_2', type: Field::TEXT_FIELD, display_name: 'field_2')
      subform.save!
      form3 = FormSection.new(
        name: 'cases_test_form_1', parent_form: 'case', 'visible' => true, order_form_group: 0,
        order: 0, order_subform: 0, form_group_id: 'cases_test_form_1', unique_id: 'cases_test_form_1'
      )
      form3.fields << Field.new(name: 'first_name', type: Field::TEXT_FIELD, display_name: 'first_name')
      form3.fields << Field.new(name: 'last_name', type: Field::TEXT_FIELD, display_name: 'last_name')
      form3.fields << Field.new(
        name: 'subform_field_1', type: Field::SUBFORM, display_name: 'subform field', 'subform_section_id' => subform.id
      )
      form3.save!
      @primero_module = create(
        :primero_module, name: 'CP', description: 'Child Protection', associated_record_types: %w[case]
      )
      @role = create(:role, modules: [@primero_module], form_sections: [form1, form2, form3])
      @user = create(:user, user_name: 'fakeadmin', role: @role, code: 'test01')

      Field.create!(name: 'ethnicity', display_name: 'ethnicity', type: Field::SELECT_BOX,
                    option_strings_source: 'lookup lookup-ethnicity')
      Field.create!(name: 'displacement_incident', type: Field::SELECT_BOX,
                    display_name: 'Stage of displacement at time of incident',
                    option_strings_text_i18n: [
                      { 'id': 'during_flight', 'display_text': { 'en': 'During Flight' } },
                      { 'id': 'during_refuge', 'display_text': { 'en': 'During Refuge' } }
                    ])
      Lookup.create!(unique_id: 'lookup-ethnicity', name_i18n: { 'en': 'Ethnicity' },
                     lookup_values_i18n: [
                       { 'id': 'ethnicity1', 'display_text': { 'en': 'Ethnicity1' } },
                       { 'id': 'ethnicity2', 'display_text': { 'en': 'Ethnicity2' } },
                       { 'id': 'ethnicity3', 'display_text': { 'en': 'Ethnicity3' } },
                       { 'id': 'ethnicity4', 'display_text': { 'en': 'Ethnicity4' } }
                     ])

      incident_a = Incident.create!(
        data: {
          incident_date: Date.new(2019, 3, 1), description: 'Test 1', owned_by: @user.user_name, incidentid_ir: 'test',
          alleged_perpetrator: [
            {
              primary_perpetrator: 'primary',
              age_type: 'adult',
              unique_id: '3341413f-15e4-411c-8158-5535e4cf2fae',
              perpetrator_sex: 'male',
              former_perpetrator: true,
              perpetrator_ethnicity: 'ethnicity4',
              perpetrator_occupation: 'occupation_1',
              perpetrator_nationality: 'nationality2',
              perpetrator_relationship: 'supervisor_employer'
            }
          ]
        }
      )
      incident_b = Incident.create!(data: { incident_date: Date.new(2019, 3, 1), description: 'Test 1' })
      @records = [incident_a, incident_b]

      Location.create!(placename: 'Guinea', type: 'county', location_code: 'GUI')
      Location.create!(placename: 'Kindia', type: 'district', location_code: 'GUI123', hierarchy_path: 'GUI.GUI123')

      incident_c = Incident.create!(
        data: {
          age: 14,
          sex: 'female',
          status: 'open',
          owned_by: @user.user_name,
          religion: 'religion4',
          short_id: '61246a4',
          estimated: false,
          ethnicity: 'ethnicity3',
          module_id: 'primeromodule-gbv',
          created_by: 'primero',
          incident_id: '881d482d-3a36-4e65-8de4-72bd461246a4',
          nationality: 'nationality2',
          record_state: true,
          date_of_birth: '2006-03-02',
          incident_code: '61246a4',
          incident_date: '2020-03-01',
          incidentid_ir: '111-22-ir',
          survivor_code: '111-222',
          disability_type: 'mental_disability',
          maritial_status: 'divorced_separated',
          consent_reporting: true,
          country_of_origin: 'andorra',
          incident_location: 'GUI123',
          incident_camp_town: 'town',
          incident_timeofday: 'afternoon',
          non_gbv_type_notes: 'non',
          owned_by_agency_id: 1,
          alleged_perpetrator:
            [
              {
                age_group: '18_25',
                unique_id: '3341413f-15e4-411c-8158-5535e4cf2fae',
                perpetrator_sex: 'male',
                former_perpetrator: true,
                perpetrator_ethnicity: 'ethnicity4',
                perpetrator_occupation: 'occupation_1',
                perpetrator_nationality: 'nationality2',
                perpetrator_relationship: 'supervisor_employer'
              },
              {
                age_group: '18_30',
                unique_id: '3341413f-154e-411c-8158-5535e4cf2fae',
                perpetrator_sex: 'female',
                former_perpetrator: true,
                primary_perpetrator: 'primary',
                perpetrator_ethnicity: 'ethnicity4',
                perpetrator_occupation: 'occupation_2',
                perpetrator_nationality: 'nationality3',
                perpetrator_relationship: 'supervisor_employer'
              }
            ],
          displacement_status: 'refugee',
          previously_owned_by: 'primero',
          created_organization: Agency.last.unique_id,
          date_of_first_report: '2020-03-02',
          incident_description: 'test account',
          displacement_incident: 'during_flight',
          goods_money_exchanged: false,
          service_referred_from: 'police_other_service',
          gbv_previous_incidents: true,
          gbv_reported_elsewhere: 'non-gbvims-org',
          incident_location_type: 'garden',
          gbv_sexual_violence_type: 'sexual_assault',
          service_safehouse_location: 'loc',
          service_safehouse_provider: 'provider',
          service_safehouse_referral: 'services_already_received_from_another_agency',
          service_referred_from_other: 'asdfasdf',
          harmful_traditional_practice: 'type_of_practice_1',
          unaccompanied_separated_status: 'separated_child',
          service_safehouse_referral_notes: 'note',
          abduction_status_time_of_incident: 'forced_conscription',
          service_safehouse_appointment_date: '2020-06-23',
          service_safehouse_appointment_time: 'time',
          livelihoods_services_subform_section:
            [
              {
                unique_id: 'cfdbcb5f-02c7-4fd7-b56a-2e453647c5d7',
                service_livelihoods_location: 'kmlfdjgr',
                service_livelihoods_provider: 'i39',
                service_livelihoods_referral: 'service_not_applicable',
                service_livelihoods_referral_notes: 'kjfig',
                service_livelihoods_appointment_date: '2020-06-14T22:07:00.000Z',
                service_livelihoods_appointment_time: 'sdrtyio'
              }
            ],
          health_medical_referral_subform_section:
            [
              {
                unique_id: 'b569d95b-08f3-4433-8ffd-0cf136f3a6dd',
                service_medical_location: 'sdfgt',
                service_medical_provider: 'asdf',
                service_medical_referral: 'service_provided_by_your_agency',
                service_medical_referral_notes: 'd',
                service_medical_appointment_date: '2020-06-23T22:06:39.023Z',
                service_medical_appointment_time: 'asdf'
              }
            ],
          child_protection_services_subform_section:
            [
              {
                unique_id: '97e391c7-45cf-4d25-a7f6-e894bb2401e7',
                service_protection_location: 'oifgut',
                service_protection_provider: 'klwfjir',
                service_protection_referral: 'services_already_received_from_another_agency',
                service_protection_referral_notes: ',fmdkjjnd;fskj',
                service_protection_appointment_date: '2020-06-22T22:07:00.000Z',
                service_protection_appointment_time: 'dsfgtoi'
              }
            ],
          legal_assistance_services_subform_section:
            [
              {
                unique_id: '872fd2ca-57db-42f8-a86a-f994d2558552',
                pursue_legal_action: 'false',
                service_legal_location: 'kjcviu',
                service_legal_provider: 'vkcjbh',
                service_legal_referral: 'service_not_applicable',
                service_legal_referral_notes: 'jri',
                service_legal_appointment_date: '2020-06-20T22:07:09.304Z',
                service_legal_appointment_time: 'asdfgh n'
              }
            ],
          psychosocial_counseling_services_subform_section:
            [
              {
                unique_id: 'bf14784d-42f6-497f-9955-79a555ccf592',
                service_psycho_provider: 'rtiu',
                service_psycho_referral: 'service_not_applicable',
                service_psycho_referral_notes: 'nfbgiu',
                service_psycho_appointment_date: '2020-06-02T22:06:00.000Z',
                service_psycho_appointment_time: 'asdf',
                service_psycho_service_location: 'xcmvn'
              }
            ],
          police_or_other_type_of_security_services_subform_section:
            [
              {
                unique_id: 'e12082d3-b290-4832-be11-ac3e891c1dfe',
                service_police_location: 'igro',
                service_police_provider: 'vjkobi04',
                service_police_referral: 'referral_declined_by_survivor',
                service_police_referral_notes: 'kjsdfgh oiew',
                service_police_appointment_date: '2020-06-14T22:07:00.000Z',
                service_police_appointment_time: 'errt5y'
              }
            ]
        }
      )
      @record_with_all_fields = [incident_c]
    end

    describe 'Export format' do
      let(:workbook) do
        data = IncidentRecorderExporter.export(@records, @user, {})
        Roo::Spreadsheet.open(StringIO.new(data).set_encoding('ASCII-8BIT'), extension: :xlsx)
      end

      it 'contains a metadata worksheet' do
        sheet = workbook.sheet(workbook.sheets.last)
        headers = sheet.row(1)

        metadata_headers = [
          'CASEWORKER CODE', 'ETHNICITY', 'INCIDENT LOCATION', 'INCIDENT COUNTY', 'INCIDENT DISTRICT', 'INCIDENT CAMP'
        ]

        expect(headers).to eq(metadata_headers)
        expect(sheet.last_row).to eq(1)
      end

      it 'contains a worksheet for every form and nested subform' do
        expect(workbook.sheets.size).to eq(2)
        expect(workbook.sheet(0).row(1)).to eq(
          [
            'INCIDENT ID', 'SURVIVOR CODE', 'CASE MANAGER CODE', 'DATE OF INTERVIEW', 'DATE OF INCIDENT',
            'DATE OF BIRTH', 'SEX', 'ETHNICITY', 'COUNTRY OF ORIGIN', 'CIVIL / MARITAL STATUS',
            'DISPLACEMENT STATUS AT REPORT', 'PERSON WITH DISABILITY?', 'UNACCOMPANIED OR SEPARATED CHILD?',
            'STAGE OF DISPLACEMENT AT INCIDENT', 'INCIDENT TIME OF DAY', 'INCIDENT LOCATION', 'INCIDENT COUNTY',
            'INCIDENT DISTRICT', 'INCIDENT CAMP / TOWN', 'GBV TYPE', 'HARMFUL TRADITIONAL PRACTICE',
            'MONEY, GOODS, BENEFITS AND / OR SERVICES EXCHANGED ?', 'TYPE OF ABDUCTION',
            'PREVIOUSLY REPORTED THIS INCIDENT?', 'PREVIOUS GBV INCIDENTS?', 'No. ALLEGED PRIMARY PERPETRATOR(S)',
            'ALLEGED PERPETRATOR SEX', 'PREVIOUS INCIDENT WITH THIS PERPETRATOR', 'ALLEGED PERPETRATOR AGE GROUP',
            'ALLEGED PERPETRATOR - SURVIVOR RELATIONSHIP', 'ALLEGED PERPETRATOR OCCUPATION', 'REFERRED TO YOU FROM?',
            'SAFE HOUSE / SHELTER', 'HEALTH / MEDICAL SERVICES', 'PSYCHOSOCIAL SERVICES', 'WANTS LEGAL ACTION?',
            'LEGAL ASSISTANCE SERVICES', 'POLICE / OTHER SECURITY ACTOR', 'LIVELIHOODS PROGRAM',
            'CHILD PROTECTION SERVICES / EDUCATION SERVICES', 'CONSENT GIVEN', 'REPORTING AGENCY CODE'
          ]
        )
        expect(workbook.sheet(1).row(1)).to eq(
          ['CASEWORKER CODE', 'ETHNICITY', 'INCIDENT LOCATION', 'INCIDENT COUNTY', 'INCIDENT DISTRICT', 'INCIDENT CAMP']
        )
      end
    end

    context 'Selected fields' do
      let(:workbook) do
        data = IncidentRecorderExporter.export(@records, @user, field_names: %w[first_name array_field])
        Roo::Spreadsheet.open(StringIO.new(data).set_encoding('ASCII-8BIT'), extension: :xlsx)
      end

      it 'contains no other form but the metadata form' do
        partial_metadata_header = ['CASEWORKER CODE', 'ETHNICITY', 'INCIDENT LOCATION', 'INCIDENT COUNTY']
        expect(workbook.sheets.size).to eq(2)
        expect(workbook.sheet(1).row(1)[0..3]).to eq(partial_metadata_header)
      end
    end

    context 'Selected forms and fields' do
      let(:workbook) do
        data = IncidentRecorderExporter.export(
          @records, @user,
          form_unique_ids: %w[cases_test_form_1],
          field_names: %w[first_name]
        )
        Roo::Spreadsheet.open(StringIO.new(data).set_encoding('ASCII-8BIT'), extension: :xlsx)
      end

      it 'contains no other form but the metadata form' do
        partial_metadata_header = ['CASEWORKER CODE', 'ETHNICITY', 'INCIDENT LOCATION', 'INCIDENT COUNTY']
        expect(workbook.sheets.size).to eq(2)
        expect(workbook.sheet(1).row(1)[0..3]).to eq(partial_metadata_header)
      end
    end

    context 'Test the data form the record' do
      it 'contains the correct data' do
        data = IncidentRecorderExporter.export(@record_with_all_fields, @user, {})
        workbook = Roo::Spreadsheet.open(StringIO.new(data).set_encoding('ASCII-8BIT'), extension: :xlsx)
        expect(workbook.sheets.size).to eq(2)
        model = @record_with_all_fields.first
        expect(workbook.sheet(0).row(2)).to eq(
          [
            model.incident_id, '111-222', 'test01', I18n.l(model.date_of_first_report), I18n.l(model.incident_date),
            I18n.l(model.data['date_of_birth']), 'F', 'Ethnicity3', 'andorra', 'divorced_separated', 'refugee',
            'mental_disability', 'separated_child', 'During Flight', 'afternoon', 'garden', 'Guinea', 'Kindia', 'town',
            'sexual_assault', 'type_of_practice_1', 'false', 'forced_conscription', 'non-gbvims-org', 'true', 2,
            'M and F', 'Yes', 'Age 18 - 25', 'supervisor_employer', 'occupation_2', 'police_other_service',
            'services_already_received_from_another_agency', 'service_provided_by_your_agency',
            'service_not_applicable', 'No', 'service_not_applicable',
            'referral_declined_by_survivor', 'service_not_applicable', 'services_already_received_from_another_agency',
            'true', Agency.last.agency_code
          ]
        )
      end

      it 'translate the correct data' do
        data = IncidentRecorderExporter.export(@record_with_all_fields, @user, {})
        workbook = Roo::Spreadsheet.open(StringIO.new(data).set_encoding('ASCII-8BIT'), extension: :xlsx)
        expect(workbook.sheets.size).to eq(2)
        expect(workbook.sheet(0).row(2)[7]).to eq('Ethnicity3')
        expect(workbook.sheet(0).row(2)[13]).to eq('During Flight')
      end

      it 'Get age_type form perpetrators' do
        form_perpetrator = FormSection.new(
          name: 'alleged_perpetrator', parent_form: 'case', 'visible' => true, order_form_group: 0,
          order: 0, order_subform: 0, form_group_id: 'cases_test_subform_2', unique_id: 'alleged_perpetrator'
        )
        form_perpetrator.fields << Field.new(name: 'age_type', type: Field::TEXT_FIELD, display_name: 'age_type')
        form_perpetrator.save!

        data = IncidentRecorderExporter.export(@records, @user, {})
        workbook = Roo::Spreadsheet.open(StringIO.new(data).set_encoding('ASCII-8BIT'), extension: :xlsx)
        expect(workbook.sheet(0).last_row).to eq(3)
        expect(workbook.sheet(0).row(1)[28]).to eq('ALLEGED PERPETRATOR AGE TYPE')
        expect(workbook.sheet(0).row(2)[28]).to eq('Adult')
      end

      it 'Get select field value from primary perpetrators' do
        form_perpetrator = FormSection.new(
          name: 'alleged_perpetrator', parent_form: 'case', 'visible' => true, order_form_group: 0,
          order: 0, order_subform: 0, form_group_id: 'cases_test_subform_2', unique_id: 'alleged_perpetrator'
        )
        fields = [
          Field.new(name: 'perpetrator_occupation', type: Field::SELECT_BOX, display_name: 'perpetrator_occupation',
                    multi_select: true, option_strings_text: [
                      { id: 'occupation_1', display_text: 'Occupation 1' },
                      { id: 'occupation_2', display_text: 'Occupation ' }
                    ].map(&:with_indifferent_access))
        ]
        form_perpetrator.fields = fields
        form_perpetrator.save!

        data = IncidentRecorderExporter.export(@records, @user, {})
        workbook = Roo::Spreadsheet.open(StringIO.new(data).set_encoding('ASCII-8BIT'), extension: :xlsx)
        expect(workbook.sheet(0).last_row).to eq(3)
        expect(workbook.sheet(0).row(1)[30]).to eq('ALLEGED PERPETRATOR OCCUPATION')
        expect(workbook.sheet(0).row(2)[30]).to eq('Occupation 1')
      end
    end

    after :each do
      clean_data(Agency, Role, UserGroup, User, PrimeroProgram, Field, FormSection, PrimeroModule, Incident, Location)
    end
  end
end
