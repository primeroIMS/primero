# frozen_string_literal: true

require 'rails_helper'

module Exporters
  describe MRMViolationExporter do
    def violation_tally_field
      Field.new(
        name: 'violation_tally', display_name: 'Number of victims', order: 1, type: 'tally_field',
        tally: [
          { 'id' => 'tally1', 'display_text' => 'Tally 1' },
          { 'id' => 'tally2', 'display_text' => 'Tally 2' },
          { 'id' => 'tally3', 'display_text' => 'Tally 3' }
        ]
      )
    end

    def verification_fields
      [
        Field.new(name: 'ctfmr_verified', display_name: 'CTFMR Verified', type: 'text_field', order: 2),
        Field.new(name: 'ctfmr_verified_date', display_name: 'CTFMR Verified Date', type: 'date_field', order: 3)
      ]
    end

    def generate_field(unique_id)
      Field.new(
        type: Field::TEXT_FIELD,
        name: "#{unique_id}_field_1",
        display_name: "#{unique_id.capitalize} - Field 1",
        order: 0
      )
    end

    def violation?(unique_id)
      Violation::TYPES.include?(unique_id)
    end

    def generate_subforms(form_unique_ids)
      form_unique_ids.each_with_object({}) do |unique_id, memo|
        name = violation?(unique_id) ? unique_id : "#{unique_id}_subform_section"
        field = generate_field(unique_id)

        memo[unique_id] = FormSection.create!(
          name: name, unique_id: name, visible: true, order_form_group: 0, order: 0, order_subform: 0, is_nested: true,
          fields: violation?(unique_id) ? [field, violation_tally_field] + verification_fields : [field]
        )
      end
    end

    def generate_forms(form_unique_ids)
      subforms = generate_subforms(form_unique_ids)
      form_unique_ids.map.with_index do |unique_id, index|
        name = violation?(unique_id) ? "#{unique_id}_violation_wrapper" : unique_id
        FormSection.create!(
          name: name, parent_form: 'incident', visible: true, order_form_group: 0, order: index, order_subform: 0,
          form_group_id: 'violations', unique_id: name, fields: [Field.new(
            name: unique_id, display_name: unique_id.capitalize, type: 'subform', subform_section: subforms[unique_id]
          )]
        )
      end
    end

    before do
      clean_data(Incident, Role, UserGroup, User, Agency, Field, FormSection, PrimeroProgram, PrimeroModule)
    end

    let(:incident_form) do
      FormSection.create!(
        name: 'incident_form',
        parent_form: 'incident',
        visible: true,
        order_form_group: 0,
        order: 0,
        order_subform: 0,
        fields: [
          Field.new(type: Field::TEXT_FIELD, name: 'incident_field_1', display_name: 'Incident - Field 1', order: 1),
          Field.new(type: Field::TEXT_FIELD, name: 'incident_field_2', display_name: 'Incident - Field 2', order: 2)
        ],
        form_group_id: 'incident_form',
        unique_id: 'incident_form'
      )
    end

    let(:violation_forms) do
      generate_forms(Violation::TYPES)
    end

    let(:association_forms) do
      generate_forms(Violation::MRM_ASSOCIATIONS_KEYS)
    end

    let(:primero_module) do
      PrimeroModule.create!(
        unique_id: 'primeromodule-mrm',
        name: 'MRM',
        associated_record_types: ['incident'],
        form_sections: [incident_form, individual_victims, group_victims, sources, perpetrators, response]
      )
    end

    let(:role) do
      Role.create!(
        name: 'Role MRM',
        unique_id: 'role-mrm',
        permissions: [
          Permission.new(
            resource: Permission::INCIDENT, actions: [Permission::MANAGE]
          )
        ],
        form_sections: [incident_form] + violation_forms + association_forms
      )
    end

    let(:user) do
      user = User.new(user_name: 'user_mrm', role: role)
      user.save(validate: false)
      user
    end

    let(:incident_1) do
      Incident.create!(
        data: { incident_field_1: 'Incident 1 - Value 1', owned_by: 'user_mrm' },
        violations: [
          Violation.new(
            data: {
              type: 'killing',
              violation_tally: { tally1: 1, tally2: 3, tally3: 0, total: 4 },
              killing_field_1: 'Killing Value 1'
            },
            individual_victims: [
              IndividualVictim.new(data: { individual_victims_field_1: 'Incident 1 IV Value 1' })
            ],
            group_victims: [
              GroupVictim.new(data: { group_victims_field_1: 'Incident 1 GV Value 1' })
            ]
          )
        ]
      )
    end

    let(:incident_2) do
      Incident.create!(
        data: { incident_field_1: 'Incident 2 - Value 1', owned_by: 'user_mrm' },
        violations: [
          Violation.new(
            data: {
              type: 'maiming',
              violation_tally: { tally1: 1, tally2: 0, tally3: 1, total: 2 },
            },
            individual_victims: [
              IndividualVictim.new(data: { individual_victims_field_1: 'Incident 2 IV Value 1' })
            ]
          ),
          Violation.new(
            data: {
              type: 'abduction',
              violation_tally: { tally1: 1, tally2: 0, tally3: 0, total: 1 }
            },
            perpetrators: [
              Perpetrator.new(data: { perpetrators_field_1: 'Incident 2 Perpetrator Value 1' })
            ]
          )
        ]
      )
    end

    let(:incident_3) do
      Incident.create!(
        data: { incident_field_1: 'Incident 3 - Value 1', owned_by: 'user_mrm' },
        violations: [
          Violation.new(
            data: {
              type: 'attack_on_hospitals',
              violation_tally: { tally1: 1, tally2: 2, tally3: 1, total: 4 }
            },
            individual_victims: [
              IndividualVictim.new(data: { individual_victims_field_1: 'Incident 3 IV Value 1' })
            ],
            source: Source.new(data: { sources_field_1: 'Incident 3 Source Value 1' })
          ),
          Violation.new(
            data: {
              type: 'military_use',
              violation_tally: { tally1: 1, tally2: 1, tally3: 1, total: 3 },
              military_use_field_1: 'Military Value 1'
            },
            responses: [
              Response.new(data: { responses_field_1: 'Incident 3 Response Value 1' })
            ]
          )
        ]
      )
    end

    describe 'Export' do
      let(:workbook) do
        data = MRMViolationExporter.export([incident_1, incident_2, incident_3], user)
        Roo::Spreadsheet.open(StringIO.new(data), extension: :xlsx)
      end

      it 'contains a worksheet for violations and each association' do
        expect(workbook.sheets.size).to eq(6)
      end

      it 'prints the id headers' do
        expect(workbook.sheet(0).row(2)[0]).to eq('ID#')
        expect(workbook.sheet(0).row(3)[0..3]).to eq(
          ['Incident', 'Violation', 'Violation Type', 'Summary']
        )
      end

      it 'prints the headers for the incident' do
        expect(workbook.sheet(0).row(3)[4..5]).to eq(
          ['Incident - Field 1', 'Incident - Field 2']
        )
      end

      it 'prints the headers for the verification fields' do
        expect(workbook.sheet(0).row(3)[6..7]).to eq(
          ['CTFMR Verified', 'CTFMR Verified Date']
        )
      end

      it 'prints the headers for the shared violation fields' do
        expect(workbook.sheet(0).row(3)[8..11]).to eq(['Tally 1', 'Tally 2', 'Tally 3', 'Total'])
      end

      it 'prints the headers for each violation types' do
        expect(workbook.sheet(0).row(3)[12..21]).to eq(
          [
            'Killing - Field 1', 'Maiming - Field 1', 'Recruitment - Field 1', 'Sexual_violence - Field 1',
            'Abduction - Field 1', 'Attack_on_hospitals - Field 1', 'Attack_on_schools - Field 1',
            'Military_use - Field 1', 'Denial_humanitarian_access - Field 1'
          ]
        )
      end

      it 'prints the headers for each association' do
        expect(workbook.sheet(1).row(2)).to eq(
          ['Incident', 'Violation', 'Violation Type', 'Summary', 'Sources - Field 1']
        )
        expect(workbook.sheet(2).row(2)).to eq(
          ['Incident', 'Violation', 'Violation Type', 'Summary', 'Perpetrators - Field 1']
        )
        expect(workbook.sheet(3).row(2)).to eq(
          ['Incident', 'Violation', 'Violation Type', 'Summary', 'Individual_victims - Field 1']
        )
        expect(workbook.sheet(4).row(2)).to eq(
          ['Incident', 'Violation', 'Violation Type', 'Summary', 'Group_victims - Field 1']
        )
        expect(workbook.sheet(5).row(2)).to eq(
          ['Incident', 'Violation', 'Violation Type', 'Summary', 'Responses - Field 1']
        )
      end

      it 'prints the violation data' do
        expect(workbook.sheet(0).row(4)).to eq(
          [
            incident_1.id, incident_1.violations[0].id, 'Killing of Children',
            "Killing of Children - Killing Value 1 - #{incident_1.violations[0].id[0..4]}",
            'Incident 1 - Value 1', nil,
            nil, nil,
            1, 3, 0, 4,
            'Killing Value 1', nil, nil, nil, nil, nil, nil, nil, nil
          ]
        )
        expect(workbook.sheet(0).row(5)).to eq(
          [
            incident_2.id, incident_2.violations[0].id, 'Maiming of Children',
            "Maiming of Children - #{incident_2.violations[0].id[0..4]}",
            'Incident 2 - Value 1', nil,
            nil, nil,
            1, 0, 1, 2,
            nil, nil, nil, nil, nil, nil, nil, nil, nil
          ]
        )
        expect(workbook.sheet(0).row(6)).to eq(
          [
            incident_2.id, incident_2.violations[1].id, 'Abduction',
            "Abduction - #{incident_2.violations[1].id[0..4]}",
            'Incident 2 - Value 1', nil,
            nil, nil,
            1, 0, 0, 1,
            nil, nil, nil, nil, nil, nil, nil, nil, nil
          ]
        )
        expect(workbook.sheet(0).row(7)).to eq(
          [
            incident_3.id, incident_3.violations[0].id, 'Attacks on hospital(s)',
            "Attacks on hospital(s) - #{incident_3.violations[0].id[0..4]}",
            'Incident 3 - Value 1', nil,
            nil, nil,
            1, 2, 1, 4,
            nil, nil, nil, nil, nil, nil, nil, nil, nil
          ]
        )

        expect(workbook.sheet(0).row(8)).to eq(
          [
            incident_3.id, incident_3.violations[1].id, 'Military use of school(s) and/or hospital(s)',
            "Military use of school(s) and/or hospital(s) - Military Value 1 - #{incident_3.violations[1].id[0..4]}",
            'Incident 3 - Value 1', nil,
            nil, nil,
            1, 1, 1, 3,
            nil, nil, nil, nil, nil, nil, nil, 'Military Value 1', nil
          ]
        )
      end

      it 'prints the associations data' do
        expect(workbook.sheet(1).row(3)).to eq(
          [
            incident_3.id, incident_3.violations.first.id, 'Attacks on hospital(s)',
            "Attacks on hospital(s) - #{incident_3.violations[0].id[0..4]}", 'Incident 3 Source Value 1'
          ]
        )
        expect(workbook.sheet(2).row(3)).to eq(
          [
            incident_2.id, incident_2.violations[1].id, 'Abduction',
            "Abduction - #{incident_2.violations[1].id[0..4]}", 'Incident 2 Perpetrator Value 1'
          ]
        )
        expect(workbook.sheet(3).row(3)).to eq(
          [
            incident_1.id, incident_1.violations[0].id, 'Killing of Children',
            "Killing of Children - Killing Value 1 - #{incident_1.violations[0].id[0..4]}",
            'Incident 1 IV Value 1'
          ]
        )
        expect(workbook.sheet(3).row(4)).to eq(
          [
            incident_2.id, incident_2.violations[0].id, 'Maiming of Children',
            "Maiming of Children - #{incident_2.violations[0].id[0..4]}",
            'Incident 2 IV Value 1'
          ]
        )
        expect(workbook.sheet(3).row(5)).to eq(
          [
            incident_3.id, incident_3.violations[0].id, 'Attacks on hospital(s)',
            "Attacks on hospital(s) - #{incident_3.violations[0].id[0..4]}",
            'Incident 3 IV Value 1'
          ]
        )
        expect(workbook.sheet(3).row(5)).to eq(
          [
            incident_3.id, incident_3.violations[0].id, 'Attacks on hospital(s)',
            "Attacks on hospital(s) - #{incident_3.violations[0].id[0..4]}",
            'Incident 3 IV Value 1'
          ]
        )
        expect(workbook.sheet(4).row(3)).to eq(
          [
            incident_1.id, incident_1.violations[0].id, 'Killing of Children',
            "Killing of Children - Killing Value 1 - #{incident_1.violations[0].id[0..4]}",
            'Incident 1 GV Value 1'
          ]
        )
        expect(workbook.sheet(5).row(3)).to eq(
          [
            incident_3.id, incident_3.violations[1].id, 'Military use of school(s) and/or hospital(s)',
            "Military use of school(s) and/or hospital(s) - Military Value 1 - #{incident_3.violations[1].id[0..4]}",
            'Incident 3 Response Value 1'
          ]
        )
      end
    end
  end
end
