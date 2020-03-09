# frozen_string_literal: true

require 'rails_helper'

require 'spreadsheet'

module Exporters
  describe IncidentRecorderExporter do
    before :each do
      clean_data(Agency, Role, UserGroup, User, PrimeroProgram, Field, FormSection, PrimeroModule, Incident)
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
      @user = create(:user, user_name: 'fakeadmin', role: @role)

      incident_a = Incident.create!(
        data: { incident_date: Date.new(2019, 3, 1), description: 'Test 1',
                owned_by: @user.user_name, incidentid_ir: 'test' }
      )
      incident_b = Incident.create!(data: { incident_date: Date.new(2019, 3, 1), description: 'Test 1' })
      @records = [incident_a, incident_b]
    end

    describe 'Export format' do
      let(:workbook) do
        data = IncidentRecorderExporter.export(@records, @user, {})
        Spreadsheet.open(StringIO.new(data))
      end

      it 'contains a metadata worksheet' do
        sheet = workbook.worksheets.last
        headers = sheet.row(0).to_a

        metadata_headers = [
          'CASEWORKER CODE', 'ETHNICITY', 'INCIDENT LOCATION', 'INCIDENT COUNTY', 'INCIDENT DISTRICT', 'INCIDENT CAMP'
        ]

        expect(headers).to eq(metadata_headers)
        expect(sheet.rows.size).to eq(1)
      end

      it 'contains a worksheet for every form and nested subform' do
        expect(workbook.worksheets.size).to eq(2)
        expect(workbook.worksheets[0].row(0).to_a).to eq(
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
        expect(workbook.worksheets[1].row(0).to_a).to eq(
          ['CASEWORKER CODE', 'ETHNICITY', 'INCIDENT LOCATION', 'INCIDENT COUNTY', 'INCIDENT DISTRICT', 'INCIDENT CAMP']
        )
      end
    end

    context 'Selected fields' do
      let(:workbook) do
        data = IncidentRecorderExporter.export(@records, @user, field_names: %w[first_name array_field])
        Spreadsheet.open(StringIO.new(data))
      end

      it 'contains no other form but the metadata form' do
        partial_metadata_header = ['CASEWORKER CODE', 'ETHNICITY', 'INCIDENT LOCATION', 'INCIDENT COUNTY']
        expect(workbook.worksheets.size).to eq(2)
        expect(workbook.worksheets[1].row(0).to_a[0..3]).to eq(partial_metadata_header)
      end
    end

    context 'Selected forms and fields' do
      let(:workbook) do
        data = IncidentRecorderExporter.export(
          @records, @user,
          form_unique_ids: %w[cases_test_form_1],
          field_names: %w[first_name]
        )
        Spreadsheet.open(StringIO.new(data))
      end

      it 'contains no other form but the metadata form' do
        partial_metadata_header = ['CASEWORKER CODE', 'ETHNICITY', 'INCIDENT LOCATION', 'INCIDENT COUNTY']
        expect(workbook.worksheets.size).to eq(2)
        expect(workbook.worksheets[1].row(0).to_a[0..3]).to eq(partial_metadata_header)
      end
    end
  end
end
