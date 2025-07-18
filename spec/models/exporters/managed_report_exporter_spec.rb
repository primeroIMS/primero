# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Exporters::ManagedReportExporter do
  before do
    clean_data(PrimeroModule, PrimeroProgram, Lookup, UserGroup, Incident, Child, User, Role, Agency, Violation)
    travel_to Time.zone.local(2022, 6, 30, 11, 30, 44)

    SystemSettings.stub(:primary_age_ranges).and_return(AgeRange::DEFAULT_AGE_RANGES)

    program = PrimeroProgram.create!(
      unique_id: 'primeroprogram-primero',
      name: 'Primero',
      description: 'Default Primero Program'
    )

    PrimeroModule.create!(
      unique_id: 'primeromodule-cp',
      name: 'Primero Module CP',
      description: '',
      associated_record_types: %w[case tracing_request incident],
      primero_program: program,
      form_sections: []
    )

    Lookup.create_or_update!(
      unique_id: 'lookup-gbv-sexual-violence-type',
      name_en: 'Gbv Sexual Violence Type',
      lookup_values_en: [
        { id: 'rape', display_text: 'Rape' }.with_indifferent_access,
        { id: 'sexual_assault', display_text: 'Sexual Assault' }.with_indifferent_access,
        { id: 'forced_marriage', display_text: 'Forced Marriage' }.with_indifferent_access
      ]
    )

    Lookup.create_or_update!(
      unique_id: 'lookup-gbv-case-context',
      name_en: 'GBV Case Context',
      locked: true,
      lookup_values: [
        { id: 'intimate_partner_violence', display_text: 'Intimate Partner Violence' },
        { id: 'child_sexual_abuse', display_text: 'Child Sexual Abuse' },
        { id: 'early_marriage', display_text: 'Early Marriage' },
        { id: 'possible_sexual_exploitation', display_text: 'Possible Sexual Exploitation' },
        { id: 'possible_sexual_slavery', display_text: 'Possible Sexual Slavery' },
        { id: 'harmful_traditional_practice', display_text: 'Harmful Traditional Practice' }
      ].map(&:with_indifferent_access)
    )

    Lookup.create_or_update!(
      unique_id: 'lookup-gbv-incident-timeofday',
      name_en: 'GBV Incident Time Of Day',
      lookup_values_en: [
        { id: 'morning', display_text: 'Morning (sunrise to noon)' },
        { id: 'afternoon', display_text: 'Afternoon (noon to sunset)' },
        { id: 'evening_night', display_text: 'Evening/Night (sunset to sunrise)' }
      ]
    )

    Lookup.create_or_update!(
      unique_id: 'lookup-elapsed-reporting-time',
      name_en: 'GBV Elapsed Reporting Time Range',
      lookup_values_en: [
        { id: '0_3_days', display_text: '0-3 Days' },
        { id: '4_5_days', display_text: '4-5 Days' },
        { id: '6_14_days', display_text: '6-14 Days' },
        { id: '2_weeks_1_month', display_text: '2 Weeks - 1 Month' },
        { id: 'over_1_month', display_text: 'More than 1 Month' }
      ].map(&:with_indifferent_access)
    )

    Lookup.create_or_update!(
      unique_id: 'lookup-gbv-incident-location-type',
      name_en: 'GBV Incident Location Type',
      lookup_values_en: [
        { id: 'forest', display_text: 'Bush/Forest' },
        { id: 'garden', display_text: 'Garden/Cultivated Field' },
        { id: 'school', display_text: 'School' }
      ]
    )

    Lookup.create_or_update!(
      unique_id: 'lookup-perpetrator-relationship',
      name_en: 'Perpetrator Relationship',
      lookup_values_en: [
        { id: 'primary_caregiver', display_text: 'Primary Caregiver' },
        { id: 'other', display_text: 'Other' },
        { id: 'no_relation', display_text: 'No relation' }
      ]
    )

    Lookup.create_or_update!(
      unique_id: 'lookup-perpetrator-occupation',
      name_en: 'Perpetrator Occupation',
      lookup_values_en: [
        { id: 'occupation_1', display_text: 'Occupation 1' },
        { id: 'occupation_2', display_text: 'Occupation 2' },
        { id: 'unknown', display_text: 'Unknown' }
      ]
    )

    Lookup.create_or_update!(
      unique_id: 'lookup-number-of-perpetrators',
      name_en: 'Number of Perpetrators',
      lookup_values_en: [
        { id: 'equal_to_1', display_text: '1' },
        { id: 'equal_to_2', display_text: '2' },
        { id: 'equal_to_3', display_text: '3' },
        { id: 'more_than_3', display_text: 'More than 3' },
        { id: 'unknown', display_text: 'Unknown' }
      ].map(&:with_indifferent_access)
    )

    Lookup.create_or_update!(
      unique_id: 'lookup-perpetrator-age-group',
      name_en: 'Alleged perpetrator Age groups ',
      lookup_values_en: [
        { id: '0_11', display_text: '0-11' },
        { id: '12_17', display_text: '12-17' },
        { id: '18_25', display_text: '18-25' },
        { id: '26_40', display_text: '26-40' },
        { id: '41_60', display_text: '41-60' },
        { id: '61', display_text: '61+' },
        { id: 'unknown', display_text: 'Unknown' }
      ].map(&:with_indifferent_access)
    )

    Lookup.create_or_update!(
      unique_id: 'lookup-gender',
      name_en: 'Sex',
      lookup_values_en: [
        { id: 'male', display_text: 'Male' },
        { id: 'female', display_text: 'Female' },
        { id: 'other', display_text: 'Other' }
      ].map(&:with_indifferent_access)
    )

    Lookup.create_or_update!(
      unique_id: 'lookup-case-status',
      name_en: 'Case Status',
      lookup_values_en: [
        { id: 'open', display_text: 'Open' },
        { id: 'closed', display_text: 'Closed' },
        { id: 'transferred', display_text: 'Transferred' },
        { id: 'duplicate', display_text: 'Duplicate' }
      ].map(&:with_indifferent_access)
    )

    Lookup.create_or_update!(
      unique_id: 'lookup-service-referred',
      name_en: 'Service Referred',
      lookup_values_en: [
        { id: 'referred', display_text: 'Referred' }.with_indifferent_access,
        { id: 'service_provided_by_your_agency', display_text: 'Service provided by your agency' }.with_indifferent_access,
        { id: 'service_unavailable', display_text: 'Service unavailable' }.with_indifferent_access
      ]
    )

    Incident.create!(
      data: {
        gbv_sexual_violence_type: 'forced_marriage',
        incident_date: Date.today,
        module_id: 'primeromodule-gbv',
        incident_timeofday: 'morning',
        incident_location_type: 'forest',
        age: 3,
        consent_reporting: 'true',
        service_referred_from: 'unknown',
        alleged_perpetrator: [
          {
            primary_perpetrator: 'primary',
            age_group: '0_11',
            perpetrator_occupation: 'occupation_1',
            perpetrator_relationship: 'primary_caregiver'
          }
        ]
      }
    )

    UserGroup.create!(unique_id: 'usergroup-group-1', name: 'Group 1')

    Incident.create!(
      data: {
        gbv_sexual_violence_type: 'sexual_assault',
        incident_date: Date.today,
        module_id: 'primeromodule-gbv',
        incident_timeofday: 'evening_night',
        incident_location_type: 'garden',
        goods_money_exchanged: true,
        age: 7,
        consent_reporting: 'true',
        health_medical_referral_subform_section: [
          { unique_id: '001', service_medical_referral: 'service_unavailable' }
        ],
        alleged_perpetrator: [
          {
            primary_perpetrator: 'primary',
            age_group: '0_11',
            perpetrator_occupation: 'occupation_1',
            perpetrator_relationship: 'primary_caregiver'
          },
          {
            primary_perpetrator: 'primary',
            age_group: '12_17',
            perpetrator_occupation: 'occupation_2',
            perpetrator_relationship: 'no_relation'
          }
        ]
      }
    )
    Incident.create!(
      data: {
        gbv_sexual_violence_type: 'rape',
        incident_date: Date.today,
        module_id: 'primeromodule-gbv',
        gbv_previous_incidents: 'true',
        incident_timeofday: 'afternoon',
        incident_location_type: 'school',
        age: 2,
        consent_reporting: 'true',
        health_medical_referral_subform_section: [
          { unique_id: '001', service_medical_referral: 'referred' }
        ],
        psychosocial_counseling_services_subform_section: [
          { unique_id: '002', service_psycho_referral: 'service_provided_by_your_agency' }
        ],
        alleged_perpetrator: [
          {
            primary_perpetrator: 'primary',
            age_group: '0_11',
            perpetrator_relationship: 'primary_caregiver'
          },
          {
            primary_perpetrator: 'primary',
            age_group: '12_17',
            perpetrator_occupation: 'occupation_2',
            perpetrator_relationship: 'no_relation'
          },
          {
            primary_perpetrator: 'primary',
            age_group: '18_25',
            perpetrator_occupation: 'unknown',
            perpetrator_relationship: 'other'
          }
        ]
      }
    )
  end

  after do
    travel_back
  end

  describe 'Export' do
    context 'when is a export of GBV statistics' do
      let(:workbook) do
        data = ManagedReport.list[Permission::GBV_STATISTICS_REPORT].export(
          nil,
          [
            SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: Date.today.beginning_of_quarter,
              to: Date.today.end_of_quarter
            )
          ],
          { output_to_file: false }
        )

        Roo::Spreadsheet.open(StringIO.new(data), extension: :xlsx)
      end

      it 'should export the excel' do
        expect(workbook.sheets.size).to eq(1)
      end

      describe 'GBV Statistics subreport' do
        it 'prints subreport headers' do
          expect(workbook.sheet(0).row(1)).to eq(['GBV Statistics', nil, nil, nil, nil])
        end

        it 'prints report params' do
          expect(workbook.sheet(0).row(2)).to eq(
            [
              '<html><b>Date Range: </b>This Quarter / <b>Date: </b>Date of Incident / </html>',
              nil, nil, nil, nil
            ]
          )
        end

        it 'prints indicator tables' do
          expect(workbook.sheet(0).row(5)).to eq(['General Statistics', nil, nil, nil, nil])
          expect(workbook.sheet(0).row(6)).to eq([nil, 'Total', nil, nil, nil])
          expect(workbook.sheet(0).row(7)).to eq(['New GBV Incidents Reported', 3, nil, nil, nil])
          expect(workbook.sheet(0).row(8)).to eq(
            ['Number of Incidents Reported by Survivors with Prior GBV Incidents', 1, nil, nil, nil]
          )
          expect(workbook.sheet(0).row(11)).to eq(
            ['Survivor Statistics - Sex of survivors', nil, nil, nil, nil]
          )
          expect(workbook.sheet(0).row(12)).to eq(['Sex of survivors', 'Total', nil, nil, nil])
          expect(workbook.sheet(0).row(13)).to eq(['Male', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(14)).to eq(['Female', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(15)).to eq(['Other', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(41)).to eq(
            ['Survivor Statistics - Age of survivors', nil, nil, nil, nil]
          )
          expect(workbook.sheet(0).row(42)).to eq(['Age of survivors', 'Total', nil, nil, nil])
          expect(workbook.sheet(0).row(43)).to eq(['Children - 17 Yrs & Younger',  nil, nil, nil, nil])
          expect(workbook.sheet(0).row(44)).to eq(['0-11 Yrs Old', 3,  nil, nil, nil])
          expect(workbook.sheet(0).row(45)).to eq(['12-17 Yrs Old', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(46)).to eq(['Adults - 18 Yrs & Older', nil, nil, nil, nil])
          expect(workbook.sheet(0).row(47)).to eq(['Elderly (50 & Older)', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(48)).to eq(['Adolescent (10-19)', 0, nil, nil, nil])

          expect(workbook.sheet(0).row(74)).to eq(
            ['Survivor Statistics - Marital Status of Survivors', nil, nil, nil, nil]
          )
          expect(workbook.sheet(0).row(75)).to eq(['Marital Status', 'Total', nil, nil, nil])

          expect(workbook.sheet(0).row(101)).to eq(
            ['Survivor Statistics - Displacement Status at Time of Report', nil, nil, nil, nil]
          )
          expect(workbook.sheet(0).row(102)).to eq(['Displacement Status at time of report', 'Total', nil, nil, nil])

          expect(workbook.sheet(0).row(128)).to eq(
            ['Survivor Statistics - Stage of Displacement at Time of Incident', nil, nil, nil, nil]
          )
          expect(workbook.sheet(0).row(129)).to eq(['Stage of displacement at time of incident', 'Total', nil, nil, nil])

          expect(workbook.sheet(0).row(155)).to eq(
            ['Survivor Statistics - Vulnerable Populations', nil, nil, nil, nil]
          )
          expect(workbook.sheet(0).row(156)).to eq([nil, 'Total', nil, nil, nil])
          expect(workbook.sheet(0).row(157)).to eq(['With Disabilities', 0, nil, nil, nil])

          expect(workbook.sheet(0).row(183)).to eq(
            ['Survivor Statistics - Number of Incidents of Sexual Violence Reported', nil, nil, nil, nil]
          )
          expect(workbook.sheet(0).row(184)).to eq([nil, 'Total', nil, nil, nil])
          expect(workbook.sheet(0).row(185)).to eq(['Incidents', 3, nil, nil, nil])

          expect(workbook.sheet(0).row(211)).to eq(
            ['Incident Statistics - Type of GBV', nil, nil, nil, nil]
          )
          expect(workbook.sheet(0).row(212)).to eq(['Type of incident violence', 'Total', nil, nil, nil])
          expect(workbook.sheet(0).row(213)).to eq(['Rape', 1, nil, nil, nil])
          expect(workbook.sheet(0).row(214)).to eq(['Sexual Assault', 1, nil, nil, nil])
          expect(workbook.sheet(0).row(215)).to eq(['Forced Marriage', 1, nil, nil, nil])

          expect(workbook.sheet(0).row(241)).to eq(
            ['Incident Statistics - Incident Time of Day', nil, nil, nil, nil]
          )
          expect(workbook.sheet(0).row(242)).to eq(['Time of day that the incident took place', 'Total', nil, nil, nil])
          expect(workbook.sheet(0).row(243)).to eq(['Morning (sunrise to noon)', 1, nil, nil, nil])
          expect(workbook.sheet(0).row(244)).to eq(['Afternoon (noon to sunset)', 1, nil, nil, nil])
          expect(workbook.sheet(0).row(245)).to eq(['Evening/Night (sunset to sunrise)', 1, nil, nil, nil])

          expect(workbook.sheet(0).row(271)).to eq(['Incident Statistics - Case Context', nil, nil, nil, nil])
          expect(workbook.sheet(0).row(272)).to eq([nil, 'Total', nil, nil, nil])
          expect(workbook.sheet(0).row(273)).to eq(['Intimate Partner Violence', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(274)).to eq(['Child Sexual Abuse', 2, nil, nil, nil])
          expect(workbook.sheet(0).row(275)).to eq(['Early Marriage', 1, nil, nil, nil])
          expect(workbook.sheet(0).row(276)).to eq(['Possible Sexual Exploitation', 1, nil, nil, nil])
          expect(workbook.sheet(0).row(277)).to eq(['Possible Sexual Slavery', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(278)).to eq(['Harmful Traditional Practice', 0, nil, nil, nil])

          expect(workbook.sheet(0).row(304)).to eq(
            ['Incident Statistics - Time Between Incident and Report Date', nil, nil, nil, nil]
          )
          expect(workbook.sheet(0).row(305)).to eq([nil, 'Total', nil, nil, nil])
          expect(workbook.sheet(0).row(306)).to eq(['0-3 Days', 3, nil, nil, nil])
          expect(workbook.sheet(0).row(307)).to eq(['4-5 Days', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(308)).to eq(['6-14 Days', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(309)).to eq(['2 Weeks - 1 Month', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(310)).to eq(['More than 1 Month', 0, nil, nil, nil])

          expect(workbook.sheet(0).row(336)).to eq(
            [
              'Incident Statistics - Incidents of Rape, Time Elapsed between Incident and Report Date',
              nil, nil, nil, nil
            ]
          )
          expect(workbook.sheet(0).row(337)).to eq([nil, 'Total', nil, nil, nil])
          expect(workbook.sheet(0).row(338)).to eq(['0-3 Days', 1, nil, nil, nil])
          expect(workbook.sheet(0).row(339)).to eq(['4-5 Days', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(340)).to eq(['6-14 Days', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(341)).to eq(['2 Weeks - 1 Month', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(342)).to eq(['More than 1 Month', 0, nil, nil, nil])

          expect(workbook.sheet(0).row(368)).to eq(
            [
              'Incident Statistics - Incidents of Rape, Time Elapsed (Health Service or Referral)',
              nil, nil, nil, nil
            ]
          )
          expect(workbook.sheet(0).row(369)).to eq([nil, 'Total', nil, nil, nil])
          expect(workbook.sheet(0).row(370)).to eq(['0-3 Days', 1, nil, nil, nil])
          expect(workbook.sheet(0).row(371)).to eq(['4-5 Days', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(372)).to eq(['6-14 Days', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(373)).to eq(['2 Weeks - 1 Month', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(374)).to eq(['More than 1 Month', 0, nil, nil, nil])

          expect(workbook.sheet(0).row(400)).to eq(
            ['Incident Statistics - Incident Location', nil, nil, nil, nil]
          )

          expect(workbook.sheet(0).row(401)).to eq(['Type of place where the incident took place', 'Total', nil, nil, nil])
          expect(workbook.sheet(0).row(402)).to eq(['Bush/Forest', 1, nil, nil, nil])
          expect(workbook.sheet(0).row(403)).to eq(['Garden/Cultivated Field', 1, nil, nil, nil])
          expect(workbook.sheet(0).row(404)).to eq(['School', 1, nil, nil, nil])

          expect(workbook.sheet(0).row(430)).to eq(
            ['Perpetrator Statistics - Number of Primary Perpetrators', nil, nil, nil, nil]
          )
          expect(workbook.sheet(0).row(431)).to eq([nil, 'Total', nil, nil, nil])
          expect(workbook.sheet(0).row(432)).to eq([1, 1, nil, nil, nil])
          expect(workbook.sheet(0).row(433)).to eq([2, 1, nil, nil, nil])
          expect(workbook.sheet(0).row(434)).to eq([3, 1, nil, nil, nil])
          expect(workbook.sheet(0).row(435)).to eq(['More than 3', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(436)).to eq(['Unknown', 0, nil, nil, nil])

          expect(workbook.sheet(0).row(462)).to eq(
            ['Perpetrator Statistics - Alleged Perpetrator - Survivor Relationship', nil, nil, nil, nil]
          )
          expect(workbook.sheet(0).row(463)).to eq(['Alleged perpetrator relationship with survivor', 'Total', nil, nil, nil])
          expect(workbook.sheet(0).row(464)).to eq(['Primary Caregiver', 3, nil, nil, nil])
          expect(workbook.sheet(0).row(465)).to eq(['Other', 1, nil, nil, nil])
          expect(workbook.sheet(0).row(466)).to eq(['No relation', 2, nil, nil, nil])

          expect(workbook.sheet(0).row(492)).to eq(
            ['Perpetrator Statistics - Alleged Primary Perpetrators Age Group', nil, nil, nil, nil]
          )
          expect(workbook.sheet(0).row(493)).to eq(['Age group of alleged perpetrator', 'Total', nil, nil, nil])
          expect(workbook.sheet(0).row(494)).to eq(['0-11', 3, nil, nil, nil])
          expect(workbook.sheet(0).row(495)).to eq(['12-17', 2, nil, nil, nil])
          expect(workbook.sheet(0).row(496)).to eq(['18-25', 1, nil, nil, nil])
          expect(workbook.sheet(0).row(497)).to eq(['26-40', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(498)).to eq(['41-60', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(499)).to eq(['61+', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(500)).to eq(['Unknown', 0, nil, nil, nil])

          expect(workbook.sheet(0).row(526)).to eq(
            ['Perpetrator Statistics - Alleged Primary Perpetrator Occupation', nil, nil, nil, nil]
          )
          expect(workbook.sheet(0).row(527)).to eq(['Main occupation of alleged perpetrator', 'Total', nil, nil, nil])
          expect(workbook.sheet(0).row(528)).to eq(['Occupation 1', 2, nil, nil, nil])
          expect(workbook.sheet(0).row(529)).to eq(['Occupation 2', 2, nil, nil, nil])
          expect(workbook.sheet(0).row(530)).to eq(['Unknown', 1, nil, nil, nil])
          expect(workbook.sheet(0).row(531)).to eq(['Incomplete Data', 1, nil, nil, nil])

          expect(workbook.sheet(0).row(557)).to eq(
            [
              'Referral Statistics - Number of incidents for which your organisation is the first point of contact',
              nil, nil, nil, nil
            ]
          )
          expect(workbook.sheet(0).row(558)).to eq([nil, 'Total', nil, nil, nil])
          expect(workbook.sheet(0).row(559)).to eq(['Incidents', 0, nil, nil, nil])

          expect(workbook.sheet(0).row(585)).to eq(
            ['Referral Statistics - Incidents Referred From Other Service Providers', nil, nil, nil, nil]
          )
          expect(workbook.sheet(0).row(586)).to eq([nil, 'Total', nil, nil, nil])
          expect(workbook.sheet(0).row(587)).to eq(['Incidents', 1, nil, nil, nil])

          expect(workbook.sheet(0).row(613)).to eq(
            ['Referral Statistics - Number of Services Provided for Incidents', nil, nil, nil, nil]
          )
          expect(workbook.sheet(0).row(614)).to eq([nil, 'Total', nil, nil, nil])
          expect(workbook.sheet(0).row(615)).to eq(['Safe House/Safe Shelter Referral', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(616)).to eq(['Health/Medical Referral', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(617)).to eq(['Psychosocial/Counseling Services', 1, nil, nil, nil])
          expect(workbook.sheet(0).row(618)).to eq(['Legal Assistance Services', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(619)).to eq(
            ['Police or Other Type of Security Services', 0, nil, nil, nil]
          )
          expect(workbook.sheet(0).row(620)).to eq(['Livelihoods Services', 0, nil, nil, nil])
          expect(workbook.sheet(0).row(621)).to eq(['Child Protection Services', 0, nil, nil, nil])

          expect(workbook.sheet(0).row(647)).to eq(
            ['Referral Statistics - New Incident Referrals to Other Service Providers', nil, nil, nil, nil]
          )
          expect(workbook.sheet(0).row(648)).to eq(
            [nil, 'Referred', 'Service provided by your agency', 'Service unavailable', 'Total']
          )
          expect(workbook.sheet(0).row(649)).to eq(['Safe House/Safe Shelter Referral', 0, 0, 0, 0])
          expect(workbook.sheet(0).row(650)).to eq(['Health/Medical Referral', 1, 0, 1, 2])
          expect(workbook.sheet(0).row(651)).to eq(['Psychosocial/Counseling Services', 0, 1, 0, 1])
          expect(workbook.sheet(0).row(652)).to eq(['Legal Assistance Services', 0, 0, 0, 0])
          expect(workbook.sheet(0).row(653)).to eq(
            ['Police or Other Type of Security Services', 0, 0, 0, 0]
          )
          expect(workbook.sheet(0).row(654)).to eq(['Livelihoods Services', 0, 0, 0, 0])
          expect(workbook.sheet(0).row(655)).to eq(['Child Protection Services', 0, 0, 0, 0])
        end
      end
    end

    describe 'grouped by' do
      context 'when is month' do
        let(:workbook_grouped) do
          data = ManagedReport.list[Permission::GBV_STATISTICS_REPORT].export(
            nil,
            [
              SearchFilters::DateRange.new(
                field_name: 'incident_date',
                from: Date.today - 2.month,
                to: Date.today + 2.month
              ),
              SearchFilters::Value.new(
                field_name: 'grouped_by',
                value: 'month'
              )
            ],
            { output_to_file: false }
          )

          Roo::Spreadsheet.open(StringIO.new(data), extension: :xlsx)
        end

        let(:empty_columns_for_title) do
          [nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil]
        end

        let(:empty_columns_for_rows) do
          [nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil]
        end

        let(:subcolumns) { ['Referred', 'Service provided by your agency', 'Service unavailable', 'Total'] }

        def year_range(title = nil)
          [
            title, (Date.today - 2.month).strftime('%Y-%b'), (Date.today - 1.month).strftime('%Y-%b'),
            Date.today.strftime('%Y-%b'), (Date.today + 1.month).strftime('%Y-%b'),
            (Date.today + 2.month).strftime('%Y-%b')
          ] + empty_columns_for_rows
        end

        context 'GBV Statistics subreport' do
          it 'prints subreport headers' do
            expect(workbook_grouped.sheet(0).row(1)).to match_array(['GBV Statistics'] + empty_columns_for_title)
          end

          it 'prints report params' do
            result =
              '<html><b>View By: </b>Month / <b>Date Range: </b>Custom / ' \
              "<b>From: </b>#{(Date.today - 2.month).strftime('%Y-%m-%d')} / " \
              "<b>To: </b>#{(Date.today + 2.month).strftime('%Y-%m-%d')} / <b>Date: </b>Date of Incident / </html>"

            expect(workbook_grouped.sheet(0).row(2)).to match_array(
              [result] + empty_columns_for_title
            )
          end

          it 'prints indicator tables' do
            expect(workbook_grouped.sheet(0).row(5)).to match_array(
              ['General Statistics'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(6)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(7)).to match_array(
              ['New GBV Incidents Reported', 0, 0, 3, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(8)).to match_array(
              [
                'Number of Incidents Reported by Survivors with Prior GBV Incidents', 0, 0, 1, 0, 0
              ] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(11)).to match_array(
              ['Survivor Statistics - Sex of survivors'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(13)).to match_array(
              ['Survivor Statistics - Age of survivors'] + empty_columns_for_title
            )

            expect(workbook_grouped.sheet(0).row(14)).to match_array(year_range('Age of survivors'))
            expect(workbook_grouped.sheet(0).row(15)).to match_array(
              ['Children - 17 Yrs & Younger'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(16)).to match_array(
              ['0-11 Yrs Old', 0, 0, 3, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(17)).to match_array(
              ['12-17 Yrs Old', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(18)).to match_array(
              ['Adults - 18 Yrs & Older'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(19)).to match_array(
              ['Elderly (50 & Older)', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(20)).to match_array(
              ['Adolescent (10-19)', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )

            expect(workbook_grouped.sheet(0).row(45)).to eq(
              ['Survivor Statistics - Marital Status of Survivors'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(47)).to eq(
              ['Survivor Statistics - Displacement Status at Time of Report'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(49)).to eq(
              ['Survivor Statistics - Stage of Displacement at Time of Incident'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(51)).to eq(
              ['Survivor Statistics - Vulnerable Populations'] + empty_columns_for_title
            )

            expect(workbook_grouped.sheet(0).row(53)).to eq(
              ['Survivor Statistics - Number of Incidents of Sexual Violence Reported'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(54)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(55)).to match_array(
              ['Incidents', 0, 0, 3, 0, 0] + empty_columns_for_rows
            )

            expect(workbook_grouped.sheet(0).row(80)).to eq(
              ['Incident Statistics - Type of GBV'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(81)).to match_array(year_range('Type of incident violence'))
            expect(workbook_grouped.sheet(0).row(82)).to match_array(
              ['Rape', 0, 0, 1, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(83)).to match_array(
              ['Sexual Assault', 0, 0, 1, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(84)).to match_array(
              ['Forced Marriage', 0, 0, 1, 0, 0] + empty_columns_for_rows
            )

            expect(workbook_grouped.sheet(0).row(109)).to eq(
              ['Incident Statistics - Incident Time of Day'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(110)).to match_array(
              year_range('Time of day that the incident took place')
            )
            expect(workbook_grouped.sheet(0).row(111)).to eq(
              ['Morning (sunrise to noon)', 0, 0, 1, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(112)).to eq(
              ['Afternoon (noon to sunset)', 0, 0, 1, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(113)).to eq(
              ['Evening/Night (sunset to sunrise)', 0, 0, 1, 0, 0] + empty_columns_for_rows
            )

            expect(workbook_grouped.sheet(0).row(138)).to eq(
              ['Incident Statistics - Case Context'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(139)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(140)).to eq(
              ['Intimate Partner Violence', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(141)).to eq(
              ['Child Sexual Abuse', 0, 0, 2, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(142)).to eq(
              ['Early Marriage', 0, 0, 1, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(143)).to eq(
              ['Possible Sexual Exploitation', 0, 0, 1, 0, 0] + empty_columns_for_rows
            )

            expect(workbook_grouped.sheet(0).row(144)).to eq(
              ['Possible Sexual Slavery', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(145)).to eq(
              ['Harmful Traditional Practice', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )

            expect(workbook_grouped.sheet(0).row(170)).to eq(
              ['Incident Statistics - Time Between Incident and Report Date'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(171)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(172)).to eq(
              ['0-3 Days', 0, 0, 3, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(173)).to eq(
              ['4-5 Days', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(174)).to eq(
              ['6-14 Days', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(175)).to eq(
              ['2 Weeks - 1 Month', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(176)).to eq(
              ['More than 1 Month', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )

            expect(workbook_grouped.sheet(0).row(201)).to eq(
              [
                'Incident Statistics - Incidents of Rape, Time Elapsed between Incident and Report Date'
              ] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(202)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(203)).to eq(
              ['0-3 Days', 0, 0, 1, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(204)).to eq(
              ['4-5 Days', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(205)).to eq(
              ['6-14 Days', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(206)).to eq(
              ['2 Weeks - 1 Month', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(207)).to eq(
              ['More than 1 Month', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )

            expect(workbook_grouped.sheet(0).row(232)).to match_array(
              [
                'Incident Statistics - Incidents of Rape, Time Elapsed (Health Service or Referral)'
              ] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(233)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(234)).to eq(['0-3 Days', 0, 0, 1, 0, 0] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(235)).to eq(['4-5 Days', 0, 0, 0, 0, 0] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(236)).to eq(['6-14 Days', 0, 0, 0, 0, 0] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(237)).to eq(
              ['2 Weeks - 1 Month', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(238)).to eq(
              ['More than 1 Month', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )

            expect(workbook_grouped.sheet(0).row(263)).to match_array(
              ['Incident Statistics - Incident Location'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(264)).to match_array(
              year_range('Type of place where the incident took place')
            )
            expect(workbook_grouped.sheet(0).row(265)).to match_array(
              ['Bush/Forest', 0, 0, 1, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(266)).to match_array(
              ['Garden/Cultivated Field', 0, 0, 1, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(267)).to match_array(
              ['School', 0, 0, 1, 0, 0] + empty_columns_for_rows
            )

            expect(workbook_grouped.sheet(0).row(292)).to match_array(
              ['Perpetrator Statistics - Number of Primary Perpetrators'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(293)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(294)).to match_array([1, 0, 0, 1, 0, 0] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(295)).to match_array([2, 0, 0, 1, 0, 0] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(296)).to match_array([3, 0, 0, 1, 0, 0] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(297)).to match_array(
              ['More than 3', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(298)).to match_array(
              ['Unknown', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )

            expect(workbook_grouped.sheet(0).row(323)).to match_array(
              ['Perpetrator Statistics - Alleged Perpetrator - Survivor Relationship'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(324)).to match_array(
              year_range('Alleged perpetrator relationship with survivor')
            )
            expect(workbook_grouped.sheet(0).row(325)).to match_array(
              ['Primary Caregiver', 0, 0, 3, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(326)).to match_array(
              ['Other', 0, 0, 1, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(327)).to match_array(
              ['No relation', 0, 0, 2, 0, 0] + empty_columns_for_rows
            )

            expect(workbook_grouped.sheet(0).row(352)).to match_array(
              ['Perpetrator Statistics - Alleged Primary Perpetrators Age Group'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(353)).to match_array(year_range('Age group of alleged perpetrator'))
            expect(workbook_grouped.sheet(0).row(354)).to match_array(
              ['0-11', 0, 0, 3, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(355)).to match_array(['12-17', 0, 0, 2, 0, 0] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(356)).to match_array(['18-25', 0, 0, 1, 0, 0] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(357)).to match_array(['26-40', 0, 0, 0, 0, 0] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(358)).to match_array(['41-60', 0, 0, 0, 0, 0] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(359)).to match_array(['61+', 0, 0, 0, 0, 0] + empty_columns_for_rows)

            expect(workbook_grouped.sheet(0).row(385)).to match_array(
              ['Perpetrator Statistics - Alleged Primary Perpetrator Occupation'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(386)).to match_array(
              year_range('Main occupation of alleged perpetrator')
            )
            expect(workbook_grouped.sheet(0).row(387)).to match_array(
              ['Occupation 1', 0, 0, 2, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(388)).to match_array(
              ['Occupation 2', 0, 0, 2, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(389)).to match_array(
              ['Unknown', 0, 0, 1, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(390)).to match_array(
              ['Incomplete Data', 0, 0, 1, 0, 0] + empty_columns_for_rows
            )

            expect(workbook_grouped.sheet(0).row(415)).to match_array(
              [
                'Referral Statistics - ' \
                'Number of incidents for which your organisation is the first point of contact'
              ] + empty_columns_for_title
            )

            expect(workbook_grouped.sheet(0).row(417)).to match_array(
              ['Referral Statistics - Incidents Referred From Other Service Providers'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(418)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(419)).to match_array(
              ['Incidents', 0, 0, 1, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(444)).to match_array(
              [
                'Referral Statistics - Number of Services Provided for Incidents'
              ] + empty_columns_for_title
            )

            expect(workbook_grouped.sheet(0).row(445)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(446)).to match_array(
              ['Safe House/Safe Shelter Referral', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(447)).to match_array(
              ['Health/Medical Referral', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(448)).to match_array(
              ['Psychosocial/Counseling Services', 0, 0, 1, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(449)).to match_array(
              ['Legal Assistance Services', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(450)).to match_array(
              ['Police or Other Type of Security Services', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(451)).to match_array(
              ['Livelihoods Services', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(452)).to match_array(
              ['Child Protection Services', 0, 0, 0, 0, 0] + empty_columns_for_rows
            )

            expect(workbook_grouped.sheet(0).row(477)).to match_array(
              ['Referral Statistics - New Incident Referrals to Other Service Providers'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(478)).to match_array(
              [
                nil, '2022-Apr', nil, nil, nil, '2022-May', nil, nil, nil, '2022-Jun', nil, nil, nil,
                '2022-Jul', nil, nil, nil, '2022-Aug', nil, nil, nil
              ]
            )
            expect(workbook_grouped.sheet(0).row(479)).to match_array(
              [nil] + subcolumns + subcolumns + subcolumns + subcolumns + subcolumns
            )
            expect(workbook_grouped.sheet(0).row(480)).to match_array(
              ['Safe House/Safe Shelter Referral', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            )
            expect(workbook_grouped.sheet(0).row(481)).to match_array(
              ['Health/Medical Referral', 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0]
            )
            expect(workbook_grouped.sheet(0).row(482)).to match_array(
              ['Psychosocial/Counseling Services', 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            )
            expect(workbook_grouped.sheet(0).row(483)).to match_array(
              ['Legal Assistance Services', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            )
            expect(workbook_grouped.sheet(0).row(484)).to match_array(
              ['Police or Other Type of Security Services', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            )
            expect(workbook_grouped.sheet(0).row(485)).to match_array(
              ['Livelihoods Services', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            )
            expect(workbook_grouped.sheet(0).row(486)).to match_array(
              ['Child Protection Services', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            )
          end
        end
      end

      context 'when is year' do
        let(:workbook_grouped) do
          data = ManagedReport.list[Permission::GBV_STATISTICS_REPORT].export(
            nil,
            [
              SearchFilters::DateRange.new(
                field_name: 'incident_date',
                from: Date.today - 1.year,
                to: Date.today.end_of_year
              ),
              SearchFilters::Value.new(
                field_name: 'grouped_by',
                value: 'year'
              )
            ],
            { output_to_file: false }
          )

          Roo::Spreadsheet.open(StringIO.new(data), extension: :xlsx)
        end

        let(:empty_columns_for_rows) { [nil, nil, nil, nil, nil, nil] }

        let(:empty_columns_for_title) { [nil, nil, nil, nil, nil, nil, nil, nil] }

        let(:subcolumns) { ['Referred', 'Service provided by your agency', 'Service unavailable', 'Total'] }

        def year_range(title = nil)
          [title, Date.today.last_year.year, Date.today.year] + empty_columns_for_rows
        end

        context 'GBV Statistics subreport' do
          it 'prints subreport headers' do
            expect(workbook_grouped.sheet(0).row(1)).to match_array(['GBV Statistics'] + empty_columns_for_title)
          end

          it 'prints report params' do
            result =
              '<html><b>View By: </b>Year / <b>Date Range: </b>Custom / ' \
              "<b>From: </b>#{(Date.today - 1.year).strftime('%Y-%m-%d')} / " \
              "<b>To: </b>#{Date.today.end_of_year.strftime('%Y-%m-%d')} / <b>Date: </b>Date of Incident / </html>"

            expect(workbook_grouped.sheet(0).row(2)).to match_array([result] + empty_columns_for_title)
          end

          it 'prints indicator tables' do
            expect(workbook_grouped.sheet(0).row(5)).to match_array(
              ['General Statistics'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(6)).to match_array(year_range)

            expect(workbook_grouped.sheet(0).row(7)).to match_array(
              ['New GBV Incidents Reported', 0, 3] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(8)).to match_array(
              ['Number of Incidents Reported by Survivors with Prior GBV Incidents', 0, 1] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(11)).to match_array(
              ['Survivor Statistics - Sex of survivors'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(13)).to match_array(
              ['Survivor Statistics - Age of survivors'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(14)).to match_array(year_range('Age of survivors'))
            expect(workbook_grouped.sheet(0).row(15)).to match_array(
              ['Children - 17 Yrs & Younger', nil, nil] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(16)).to match_array(
              ['0-11 Yrs Old', 0, 3] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(17)).to match_array(
              ['12-17 Yrs Old', 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(18)).to match_array(
              ['Adults - 18 Yrs & Older', nil, nil] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(19)).to match_array(
              ['Elderly (50 & Older)', 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(20)).to match_array(
              ['Adolescent (10-19)', 0, 0] + empty_columns_for_rows
            )

            expect(workbook_grouped.sheet(0).row(45)).to eq(
              ['Survivor Statistics - Marital Status of Survivors'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(47)).to eq(
              ['Survivor Statistics - Displacement Status at Time of Report'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(49)).to eq(
              ['Survivor Statistics - Stage of Displacement at Time of Incident'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(51)).to eq(
              ['Survivor Statistics - Vulnerable Populations'] + empty_columns_for_title
            )

            expect(workbook_grouped.sheet(0).row(53)).to eq(
              ['Survivor Statistics - Number of Incidents of Sexual Violence Reported'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(54)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(55)).to match_array(
              ['Incidents', 0, 3] + empty_columns_for_rows
            )

            expect(workbook_grouped.sheet(0).row(80)).to eq(
              ['Incident Statistics - Type of GBV'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(81)).to match_array(year_range('Type of incident violence'))
            expect(workbook_grouped.sheet(0).row(82)).to match_array(
              ['Rape', 0, 1] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(83)).to match_array(
              ['Sexual Assault', 0, 1] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(84)).to match_array(
              ['Forced Marriage', 0, 1] + empty_columns_for_rows
            )

            expect(workbook_grouped.sheet(0).row(109)).to eq(
              ['Incident Statistics - Incident Time of Day'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(110)).to match_array(
              year_range('Time of day that the incident took place')
            )
            expect(workbook_grouped.sheet(0).row(111)).to eq(
              ['Morning (sunrise to noon)', 0, 1] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(112)).to eq(
              ['Afternoon (noon to sunset)', 0, 1] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(113)).to eq(
              ['Evening/Night (sunset to sunrise)', 0, 1] + empty_columns_for_rows
            )

            expect(workbook_grouped.sheet(0).row(138)).to eq(
              ['Incident Statistics - Case Context'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(139)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(140)).to eq(
              ['Intimate Partner Violence', 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(141)).to eq(
              ['Child Sexual Abuse', 0, 2] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(142)).to eq(
              ['Early Marriage', 0, 1] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(143)).to eq(
              ['Possible Sexual Exploitation', 0, 1] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(144)).to eq(
              ['Possible Sexual Slavery', 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(145)).to eq(
              ['Harmful Traditional Practice', 0, 0] + empty_columns_for_rows
            )

            expect(workbook_grouped.sheet(0).row(170)).to eq(
              ['Incident Statistics - Time Between Incident and Report Date'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(171)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(172)).to eq(['0-3 Days', 0, 3] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(173)).to eq(['4-5 Days', 0, 0] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(174)).to eq(['6-14 Days', 0, 0] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(175)).to eq(['2 Weeks - 1 Month', 0, 0] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(176)).to eq(['More than 1 Month', 0, 0] + empty_columns_for_rows)

            expect(workbook_grouped.sheet(0).row(201)).to eq(
              [
                'Incident Statistics - Incidents of Rape, Time Elapsed between Incident and Report Date'
              ] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(202)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(203)).to eq(['0-3 Days', 0, 1] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(204)).to eq(['4-5 Days', 0, 0] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(205)).to eq(['6-14 Days', 0, 0] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(206)).to eq(['2 Weeks - 1 Month', 0, 0] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(207)).to eq(['More than 1 Month', 0, 0] + empty_columns_for_rows)

            expect(workbook_grouped.sheet(0).row(232)).to match_array(
              [
                'Incident Statistics - Incidents of Rape, Time Elapsed (Health Service or Referral)'
              ] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(233)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(234)).to eq(['0-3 Days', 0, 1] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(235)).to eq(['4-5 Days', 0, 0] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(236)).to eq(['6-14 Days', 0, 0] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(237)).to eq(['2 Weeks - 1 Month', 0, 0] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(238)).to eq(['More than 1 Month', 0, 0] + empty_columns_for_rows)

            expect(workbook_grouped.sheet(0).row(263)).to match_array(
              ['Incident Statistics - Incident Location'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(264)).to match_array(
              year_range('Type of place where the incident took place')
            )
            expect(workbook_grouped.sheet(0).row(265)).to match_array(
              ['Bush/Forest', 0, 1] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(266)).to match_array(
              ['Garden/Cultivated Field', 0, 1] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(267)).to match_array(
              ['School', 0, 1] + empty_columns_for_rows
            )

            expect(workbook_grouped.sheet(0).row(292)).to match_array(
              ['Perpetrator Statistics - Number of Primary Perpetrators'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(293)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(294)).to match_array([1, 0, 1] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(295)).to match_array([2, 0, 1] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(296)).to match_array([3, 0, 1] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(297)).to match_array(['More than 3', 0, 0] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(298)).to match_array(['Unknown', 0, 0] + empty_columns_for_rows)

            expect(workbook_grouped.sheet(0).row(323)).to match_array(
              ['Perpetrator Statistics - Alleged Perpetrator - Survivor Relationship'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(324)).to match_array(
              year_range('Alleged perpetrator relationship with survivor')
            )
            expect(workbook_grouped.sheet(0).row(325)).to match_array(
              ['Primary Caregiver', 0, 3] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(326)).to match_array(['Other', 0, 1] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(327)).to match_array(['No relation', 0, 2] + empty_columns_for_rows)

            expect(workbook_grouped.sheet(0).row(352)).to match_array(
              ['Perpetrator Statistics - Alleged Primary Perpetrators Age Group'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(353)).to match_array(year_range('Age group of alleged perpetrator'))
            expect(workbook_grouped.sheet(0).row(354)).to match_array(['0-11', 0, 3] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(355)).to match_array(['12-17', 0, 2] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(356)).to match_array(['18-25', 0, 1] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(357)).to match_array(['26-40', 0, 0] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(358)).to match_array(['41-60', 0, 0] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(359)).to match_array(['61+', 0, 0] + empty_columns_for_rows)

            expect(workbook_grouped.sheet(0).row(385)).to match_array(
              ['Perpetrator Statistics - Alleged Primary Perpetrator Occupation'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(386)).to match_array(
              year_range('Main occupation of alleged perpetrator')
            )
            expect(workbook_grouped.sheet(0).row(387)).to match_array(['Occupation 1', 0, 2] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(388)).to match_array(['Occupation 2', 0, 2] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(389)).to match_array(['Unknown', 0, 1] + empty_columns_for_rows)
            expect(workbook_grouped.sheet(0).row(390)).to match_array(
              ['Incomplete Data', 0, 1] + empty_columns_for_rows
            )

            expect(workbook_grouped.sheet(0).row(415)).to match_array(
              [
                'Referral Statistics - ' \
                'Number of incidents for which your organisation is the first point of contact',
              ] + empty_columns_for_title
            )

            expect(workbook_grouped.sheet(0).row(417)).to match_array(
              ['Referral Statistics - Incidents Referred From Other Service Providers'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(418)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(419)).to match_array(
              ['Incidents', 0, 1] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(444)).to match_array(
              ['Referral Statistics - Number of Services Provided for Incidents'] +  empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(445)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(446)).to eq(
              ['Safe House/Safe Shelter Referral', 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(447)).to eq(
              ['Health/Medical Referral', 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(448)).to eq(
              ['Psychosocial/Counseling Services', 0, 1] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(449)).to eq(
              ['Legal Assistance Services', 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(450)).to eq(
              ['Police or Other Type of Security Services', 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(451)).to eq(
              ['Livelihoods Services', 0, 0] + empty_columns_for_rows
            )
            expect(workbook_grouped.sheet(0).row(452)).to eq(
              ['Child Protection Services', 0, 0] + empty_columns_for_rows
            )

            expect(workbook_grouped.sheet(0).row(477)).to match_array(
              ['Referral Statistics - New Incident Referrals to Other Service Providers'] + empty_columns_for_title
            )
            expect(workbook_grouped.sheet(0).row(478)).to match_array([nil, 2021, nil, nil, nil, 2022, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(479)).to eq([nil] + subcolumns + subcolumns)
            expect(workbook_grouped.sheet(0).row(480)).to eq(
              ['Safe House/Safe Shelter Referral', 0, 0, 0, 0, 0, 0, 0, 0]
            )
            expect(workbook_grouped.sheet(0).row(481)).to eq(
              ['Health/Medical Referral', 0, 0, 0, 0, 1, 0, 1, 2]
            )
            expect(workbook_grouped.sheet(0).row(482)).to eq(
              ['Psychosocial/Counseling Services', 0, 0, 0, 0, 0, 1, 0, 1]
            )
            expect(workbook_grouped.sheet(0).row(483)).to eq(
              ['Legal Assistance Services', 0, 0, 0, 0, 0, 0, 0, 0]
            )
            expect(workbook_grouped.sheet(0).row(484)).to eq(
              ['Police or Other Type of Security Services', 0, 0, 0, 0, 0, 0, 0, 0]
            )
            expect(workbook_grouped.sheet(0).row(485)).to eq(
              ['Livelihoods Services', 0, 0, 0, 0, 0, 0, 0, 0]
            )
            expect(workbook_grouped.sheet(0).row(486)).to eq(
              ['Child Protection Services', 0, 0, 0, 0, 0, 0, 0, 0]
            )
          end
        end
      end

      context 'when is quarter' do
        let(:workbook_grouped) do
          data = ManagedReport.list[Permission::GBV_STATISTICS_REPORT].export(
            nil,
            [
              SearchFilters::DateRange.new(
                field_name: 'incident_date',
                from: Date.today.beginning_of_quarter,
                to: Date.today.end_of_quarter
              ),
              SearchFilters::Value.new(
                field_name: 'grouped_by',
                value: 'quarter'
              )
            ],
            { output_to_file: false }
          )

          Roo::Spreadsheet.open(StringIO.new(data), extension: :xlsx)
        end

        def quarter_range(title = nil)
          [title, "#{Date.today.year}-Q#{(Date.today.month / 3.0).ceil}", nil, nil, nil]
        end

        context 'Incidents subreport' do
          it 'prints subreport headers' do
            expect(workbook_grouped.sheet(0).row(1)).to match_array(['GBV Statistics', nil, nil, nil, nil])
          end

          it 'prints report params' do
            result = '<html><b>View By: </b>Quarter / <b>Date Range: </b>This Quarter / ' \
                     '<b>Date: </b>Date of Incident / </html>'

            expect(workbook_grouped.sheet(0).row(2)).to match_array([result, nil, nil, nil, nil])
          end

          it 'prints indicator tables' do
            expect(workbook_grouped.sheet(0).row(5)).to match_array(
              ['General Statistics', nil, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(6)).to match_array(quarter_range)
            expect(workbook_grouped.sheet(0).row(7)).to match_array(
              ['New GBV Incidents Reported', 3, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(8)).to match_array(
              ['Number of Incidents Reported by Survivors with Prior GBV Incidents', 1, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(11)).to match_array(
              ['Survivor Statistics - Sex of survivors', nil, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(13)).to match_array(
              ['Survivor Statistics - Age of survivors', nil, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(14)).to match_array(quarter_range('Age of survivors'))
            expect(workbook_grouped.sheet(0).row(15)).to match_array(['Children - 17 Yrs & Younger', nil, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(16)).to match_array(['0-11 Yrs Old', 3, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(17)).to match_array(['12-17 Yrs Old', 0, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(18)).to match_array(['Adults - 18 Yrs & Older', nil, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(19)).to match_array(['Elderly (50 & Older)', 0, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(20)).to match_array(['Adolescent (10-19)', 0, nil, nil, nil])

            expect(workbook_grouped.sheet(0).row(45)).to eq(
              ['Survivor Statistics - Marital Status of Survivors', nil, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(47)).to eq(
              ['Survivor Statistics - Displacement Status at Time of Report', nil, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(49)).to eq(
              ['Survivor Statistics - Stage of Displacement at Time of Incident', nil, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(51)).to eq(
              ['Survivor Statistics - Vulnerable Populations', nil, nil, nil, nil]
            )

            expect(workbook_grouped.sheet(0).row(53)).to eq(
              ['Survivor Statistics - Number of Incidents of Sexual Violence Reported', nil, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(54)).to match_array(quarter_range)
            expect(workbook_grouped.sheet(0).row(55)).to match_array(['Incidents', 3, nil, nil, nil])

            expect(workbook_grouped.sheet(0).row(80)).to eq(['Incident Statistics - Type of GBV', nil, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(81)).to match_array(quarter_range('Type of incident violence'))
            expect(workbook_grouped.sheet(0).row(82)).to match_array(['Rape', 1, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(83)).to match_array(['Sexual Assault', 1, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(84)).to match_array(['Forced Marriage', 1, nil, nil, nil])

            expect(workbook_grouped.sheet(0).row(109)).to eq(
              ['Incident Statistics - Incident Time of Day', nil, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(110)).to match_array(
              quarter_range('Time of day that the incident took place')
            )
            expect(workbook_grouped.sheet(0).row(111)).to eq(['Morning (sunrise to noon)', 1, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(112)).to eq(['Afternoon (noon to sunset)', 1, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(113)).to eq(['Evening/Night (sunset to sunrise)', 1, nil, nil, nil])

            expect(workbook_grouped.sheet(0).row(138)).to eq(
              ['Incident Statistics - Case Context', nil, nil, nil, nil]

            )
            expect(workbook_grouped.sheet(0).row(139)).to match_array(quarter_range)
            expect(workbook_grouped.sheet(0).row(140)).to eq(['Intimate Partner Violence', 0, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(141)).to eq(['Child Sexual Abuse', 2, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(142)).to eq(['Early Marriage', 1, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(143)).to eq(['Possible Sexual Exploitation', 1, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(144)).to eq(['Possible Sexual Slavery', 0, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(145)).to eq(['Harmful Traditional Practice', 0, nil, nil, nil])

            expect(workbook_grouped.sheet(0).row(170)).to eq(
              ['Incident Statistics - Time Between Incident and Report Date', nil, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(171)).to match_array(quarter_range)
            expect(workbook_grouped.sheet(0).row(172)).to eq(['0-3 Days', 3, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(173)).to eq(['4-5 Days', 0, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(174)).to eq(['6-14 Days', 0, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(175)).to eq(['2 Weeks - 1 Month', 0, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(176)).to eq(['More than 1 Month', 0, nil, nil, nil])

            expect(workbook_grouped.sheet(0).row(201)).to eq(
              [
                'Incident Statistics - Incidents of Rape, Time Elapsed between Incident and Report Date',
                nil, nil, nil, nil
              ]
            )
            expect(workbook_grouped.sheet(0).row(202)).to match_array(quarter_range)
            expect(workbook_grouped.sheet(0).row(203)).to eq(['0-3 Days', 1, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(204)).to eq(['4-5 Days', 0, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(205)).to eq(['6-14 Days', 0, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(206)).to eq(['2 Weeks - 1 Month', 0, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(207)).to eq(['More than 1 Month', 0, nil, nil, nil])

            expect(workbook_grouped.sheet(0).row(232)).to match_array(
              [
                'Incident Statistics - Incidents of Rape, Time Elapsed (Health Service or Referral)',
                nil, nil, nil, nil
              ]
            )
            expect(workbook_grouped.sheet(0).row(233)).to match_array(quarter_range)
            expect(workbook_grouped.sheet(0).row(234)).to match_array(['0-3 Days', 1, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(235)).to eq(['4-5 Days', 0, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(236)).to eq(['6-14 Days', 0, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(237)).to eq(['2 Weeks - 1 Month', 0, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(238)).to eq(['More than 1 Month', 0, nil, nil, nil])

            expect(workbook_grouped.sheet(0).row(263)).to match_array(
              ['Incident Statistics - Incident Location', nil, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(264)).to match_array(quarter_range('Type of place where the incident took place'))
            expect(workbook_grouped.sheet(0).row(265)).to match_array(['Bush/Forest', 1, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(266)).to match_array(['Garden/Cultivated Field', 1, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(267)).to match_array(['School', 1, nil, nil, nil])

            expect(workbook_grouped.sheet(0).row(292)).to match_array(
              ['Perpetrator Statistics - Number of Primary Perpetrators', nil, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(293)).to match_array(quarter_range)
            expect(workbook_grouped.sheet(0).row(294)).to match_array([1, 1, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(295)).to match_array([2, 1, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(296)).to match_array([3, 1, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(297)).to match_array(['More than 3', 0, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(298)).to match_array(['Unknown', 0, nil, nil, nil])

            expect(workbook_grouped.sheet(0).row(323)).to match_array(
              ['Perpetrator Statistics - Alleged Perpetrator - Survivor Relationship', nil, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(324)).to match_array(
              quarter_range('Alleged perpetrator relationship with survivor')
            )
            expect(workbook_grouped.sheet(0).row(325)).to match_array(['Primary Caregiver', 3, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(326)).to match_array(['Other', 1, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(327)).to match_array(['No relation', 2, nil, nil, nil])

            expect(workbook_grouped.sheet(0).row(352)).to match_array(
              ['Perpetrator Statistics - Alleged Primary Perpetrators Age Group', nil, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(353)).to match_array(
              quarter_range('Age group of alleged perpetrator')
            )
            expect(workbook_grouped.sheet(0).row(354)).to match_array(['0-11', 3, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(355)).to match_array(['12-17', 2, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(356)).to match_array(['18-25', 1, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(357)).to match_array(['26-40', 0, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(358)).to match_array(['41-60', 0, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(359)).to match_array(['61+', 0, nil, nil, nil])

            expect(workbook_grouped.sheet(0).row(385)).to match_array(
              ['Perpetrator Statistics - Alleged Primary Perpetrator Occupation', nil, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(386)).to match_array(
              quarter_range('Main occupation of alleged perpetrator')
            )
            expect(workbook_grouped.sheet(0).row(387)).to match_array(['Occupation 1', 2, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(388)).to match_array(['Occupation 2', 2, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(389)).to match_array(['Unknown', 1, nil, nil, nil])
            expect(workbook_grouped.sheet(0).row(390)).to match_array(['Incomplete Data', 1, nil, nil, nil])

            expect(workbook_grouped.sheet(0).row(415)).to match_array(
              [
                'Referral Statistics - ' \
                'Number of incidents for which your organisation is the first point of contact',
                nil, nil, nil, nil
              ]
            )

            expect(workbook_grouped.sheet(0).row(417)).to match_array(
              ['Referral Statistics - Incidents Referred From Other Service Providers', nil, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(418)).to match_array(quarter_range)
            expect(workbook_grouped.sheet(0).row(419)).to match_array(
              ['Incidents', 1, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(444)).to match_array(
              [
                'Referral Statistics - Number of Services Provided for Incidents',
                nil, nil, nil, nil
              ]
            )
            expect(workbook_grouped.sheet(0).row(445)).to match_array(quarter_range)
            expect(workbook_grouped.sheet(0).row(446)).to match_array(
              ['Safe House/Safe Shelter Referral', 0, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(447)).to match_array(
              ['Health/Medical Referral', 0, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(448)).to match_array(
              ['Psychosocial/Counseling Services', 1, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(449)).to match_array(
              ['Legal Assistance Services', 0, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(450)).to match_array(
              ['Police or Other Type of Security Services', 0, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(451)).to match_array(
              ['Livelihoods Services', 0, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(452)).to match_array(
              ['Child Protection Services', 0, nil, nil, nil]
            )

            expect(workbook_grouped.sheet(0).row(477)).to match_array(
              ['Referral Statistics - New Incident Referrals to Other Service Providers', nil, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(478)).to match_array(quarter_range)
            expect(workbook_grouped.sheet(0).row(479)).to match_array(
              [nil, 'Referred', 'Service provided by your agency', 'Service unavailable', 'Total']
            )
            expect(workbook_grouped.sheet(0).row(480)).to match_array(['Safe House/Safe Shelter Referral', 0, 0 ,0, 0])
            expect(workbook_grouped.sheet(0).row(481)).to match_array(['Health/Medical Referral', 1, 0, 1, 2])
            expect(workbook_grouped.sheet(0).row(482)).to match_array(['Psychosocial/Counseling Services', 0, 1, 0, 1])
            expect(workbook_grouped.sheet(0).row(483)).to match_array(['Legal Assistance Services', 0, 0, 0, 0])
            expect(workbook_grouped.sheet(0).row(484)).to match_array(
              ['Police or Other Type of Security Services', 0, 0, 0, 0]
            )
            expect(workbook_grouped.sheet(0).row(485)).to match_array(['Livelihoods Services', 0, 0, 0, 0])
            expect(workbook_grouped.sheet(0).row(486)).to match_array(['Child Protection Services', 0, 0, 0, 0])
          end
        end
      end

      context 'when indicators_subcolumns is present' do
        before(:each) do
          Lookup.create_or_update!(
            unique_id: 'lookup-violation-tally-options',
            name_en: 'Violation Tally Options',
            lookup_values_en: [
              { id: 'boys', display_text: 'Boys' },
              { id: 'girls', display_text: 'Girls' },
              { id: 'unknown', display_text: 'Unknown' },
              { id: 'total', display_text: 'Total' }
            ].map(&:with_indifferent_access)
          )

          Lookup.create_or_update!(
            unique_id: 'lookup-armed-force-group-or-other-party',
            name_en: 'Armed Force Group Or Other Party',
            lookup_values: [
              { id: 'armed_force_1', display_text: 'Armed Force 1' },
              { id: 'armed_group_1', display_text: 'Armed Group 1' },
              { id: 'other_party_1', display_text: 'Other Party 1' },
              { id: 'unknown', display_text: 'Unknown' }
            ].map(&:with_indifferent_access)
          )

          Lookup.create_or_update!(
            unique_id: 'lookup-attack-type',
            name_en: 'Attack Type',
            lookup_values_en: [
              { id: 'aerial_attack', display_text: 'Aerial attack' },
              { id: 'arson', display_text: 'Arson' },
              { id: 'suicide_attack', display_text: 'Suicide attack' },
              { id: 'other', display_text: 'Other' }
            ].map(&:with_indifferent_access)
          )

          Lookup.create_or_update!(
            unique_id: 'lookup-gender-unknown-total',
            name_en: 'Violation Tally Options',
            lookup_values_en: [
              { id: 'male', display_text: 'Male' },
              { id: 'female', display_text: 'Female' },
              { id: 'unknown', display_text: 'Unknown' }
            ].map(&:with_indifferent_access)
          )

          incident1 = Incident.create!(
            data: { incident_date: Date.new(2022, 5, 8), status: 'open', consent_reporting: 'true' }
          )
          incident2 = Incident.create!(
            data: { incident_date: Date.new(2022, 2, 8), status: 'open', consent_reporting: 'true' }
          )
          incident3 = Incident.create!(
            data: { incident_date: Date.new(2022, 3, 18), status: 'open', consent_reporting: 'true' }
          )
          incident4 = Incident.create!(
            data: { incident_date: Date.new(2022, 4, 28), status: 'open', consent_reporting: 'true' }
          )

          violation1 = Violation.create!(
            data: {
              type: 'killing', attack_type: 'arson',
              ctfmr_verified_date: Date.new(2022, 5, 8),
              violation_tally: { boys: 1, girls: 1, unknown: 1, total: 3 }
            },
            incident_id: incident1.id
          )

          violation2 = Violation.create!(
            data: {
              type: 'killing', attack_type: 'aerial_attack',
              ctfmr_verified_date: Date.new(2022, 2, 8),
              violation_tally: { boys: 1, girls: 1, unknown: 1, total: 3 }
            },
            incident_id: incident2.id
          )

          violation3 = Violation.create!(
            data: {
              type: 'killing', attack_type: 'aerial_attack',
              ctfmr_verified_date: Date.new(2022, 3, 18),
              violation_tally: { boys: 1, girls: 1, unknown: 4, total: 6 }
            },
            incident_id: incident3.id
          )

          violation4 = Violation.create!(
            data: {
              type: 'killing', attack_type: 'suicide_attack',
              ctfmr_verified_date: Date.new(2022, 4, 28),
              violation_tally: { boys: 3, girls: 1, unknown: 1, total: 5 }
            },
            incident_id: incident4.id
          )

          violation1.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_force_1' })]
          violation2.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_force_1' })]
          violation3.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_group_1' })]
          violation4.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'other_party_1' })]
          Role.create!(
            name: 'All Role 1',
            unique_id: 'all-role-1',
            group_permission: Permission::ALL,
            permissions: [
              Permission.new(
                resource: Permission::MANAGED_REPORT,
                actions: [
                  Permission::VIOLATION_REPORT
                ]
              )
            ]
          )
          Agency.create!(name: 'Agency 1', agency_code: 'agency1', unique_id: 'agency1')
        end
        let(:all_user) do
          User.create!(
            full_name: 'all User',
            user_name: 'all_user',
            email: 'all_user@localhost.com',
            agency_id: Agency.first.id,
            role: Role.first
          )
        end

        let(:workbook_grouped) do
          data = ManagedReport.list[Permission::VIOLATION_REPORT].export(
            all_user,
            [
              SearchFilters::DateRange.new(
                field_name: 'incident_date',
                from: Date.new(2022, 2, 1),
                to: Date.new(2022, 6, 30)
              ),
              SearchFilters::Value.new(
                field_name: 'grouped_by',
                value: 'quarter'
              )
            ],
            { output_to_file: false }
          )

          Roo::Spreadsheet.open(StringIO.new(data), extension: :xlsx)
        end

        context 'killing subreport' do
          it 'print subrerport headers' do
            expect(workbook_grouped.sheet(0).row(1).compact.first).to eq('Killing of Children')
          end

          it 'print indicator without subcolumns' do
            expect(workbook_grouped.sheet(0).row(5).compact.first).to eq('Children')
            expect(workbook_grouped.sheet(0).row(6)[0..2]).to match_array([nil, '2022-Q1', '2022-Q2'])
            expect(workbook_grouped.sheet(0).row(7)[0..2]).to match_array(['Boys', 2, 4])
            expect(workbook_grouped.sheet(0).row(8)[0..2]).to match_array(['Girls', 2, 2])
            expect(workbook_grouped.sheet(0).row(9)[0..2]).to match_array(['Unknown', 5, 2])
            expect(workbook_grouped.sheet(0).row(10)[0..2]).to match_array(['Total', 9, 8])
          end

          it 'print indicators with subcolumns' do
            expect(workbook_grouped.sheet(0).row(37).compact.first).to eq('Number of Children by Perpetrators')
            expect(workbook_grouped.sheet(0).row(38)).to match_array(
              [nil, '2022-Q1', nil, nil, nil, '2022-Q2', nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(39)).to match_array(
              [nil, 'Boys', 'Girls', 'Unknown', 'Total', 'Boys', 'Girls', 'Unknown', 'Total']
            )
            expect(workbook_grouped.sheet(0).row(40)).to match_array(['Armed Force 1', 1, 1, 1, 3, 1, 1, 1, 3])
            expect(workbook_grouped.sheet(0).row(41)).to match_array(['Armed Group 1', 1, 1, 4, 6, 0, 0, 0, 0])
            expect(workbook_grouped.sheet(0).row(42)).to match_array(['Other Party 1', 0, 0, 0, 0, 3, 1, 1, 5])
          end
        end
      end
    end

    context 'all subreport' do
      let(:workbook_all) do
        data = ManagedReport.list[Permission::GBV_STATISTICS_REPORT].export(
          nil,
          [
            SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: Date.today - 1.year,
              to: Date.today.end_of_year
            ),
            SearchFilters::Value.new(
              field_name: 'grouped_by',
              value: 'year'
            )
          ],
          { output_to_file: false }
        )
        Roo::Spreadsheet.open(StringIO.new(data), extension: :xlsx)
      end

      it 'should export all the sheets' do
        expect(workbook_all.sheets.size).to eq(1)
      end

      it 'should export the excel' do
        expect(workbook_all.sheets.size).to eq(1)
        expect(workbook_all.sheets).to match_array(['GBV Statistics'])
      end

      it 'prints subreports headers' do
        expect(workbook_all.sheet(0).row(1)).to match_array(
          ['GBV Statistics',  nil, nil, nil, nil, nil, nil, nil, nil]
        )
      end
    end

    context 'order' do
      let(:workbook) do
        data = ManagedReport.list[Permission::GBV_STATISTICS_REPORT].export(
          nil,
          [
            SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: Date.today.beginning_of_quarter,
              to: Date.today.end_of_quarter
            )
          ],
          { output_to_file: false }
        )
        Roo::Spreadsheet.open(StringIO.new(data), extension: :xlsx)
      end

      it 'should export indicators in the correct order' do
        expect(workbook.sheet(0).row(5).at(0)).to eq('General Statistics')
        expect(workbook.sheet(0).row(7).at(0)).to eq('New GBV Incidents Reported')
        expect(workbook.sheet(0).row(8).at(0)).to eq('Number of Incidents Reported by Survivors with Prior GBV Incidents')
        expect(workbook.sheet(0).row(11).at(0)).to eq('Survivor Statistics - Sex of survivors')
        expect(workbook.sheet(0).row(41).at(0)).to eq('Survivor Statistics - Age of survivors')
        expect(workbook.sheet(0).row(74).at(0)).to eq('Survivor Statistics - Marital Status of Survivors')
        expect(workbook.sheet(0).row(101).at(0)).to eq('Survivor Statistics - Displacement Status at Time of Report')
        expect(workbook.sheet(0).row(128).at(0)).to eq(
          'Survivor Statistics - Stage of Displacement at Time of Incident'
        )
        expect(workbook.sheet(0).row(155).at(0)).to eq('Survivor Statistics - Vulnerable Populations')
        expect(workbook.sheet(0).row(183).at(0)).to eq(
          'Survivor Statistics - Number of Incidents of Sexual Violence Reported'
        )
        expect(workbook.sheet(0).row(211).at(0)).to eq('Incident Statistics - Type of GBV')
        expect(workbook.sheet(0).row(241).at(0)).to eq('Incident Statistics - Incident Time of Day')
        expect(workbook.sheet(0).row(271).at(0)).to eq('Incident Statistics - Case Context')
        expect(workbook.sheet(0).row(304).at(0)).to eq(
          'Incident Statistics - Time Between Incident and Report Date'
        )
        expect(workbook.sheet(0).row(336).at(0)).to eq(
          'Incident Statistics - Incidents of Rape, Time Elapsed between Incident and Report Date'
        )
        expect(workbook.sheet(0).row(368).at(0)).to eq(
          'Incident Statistics - Incidents of Rape, Time Elapsed (Health Service or Referral)'
        )
        expect(workbook.sheet(0).row(400).at(0)).to eq('Incident Statistics - Incident Location')
        expect(workbook.sheet(0).row(430).at(0)).to eq('Perpetrator Statistics - Number of Primary Perpetrators')
        expect(workbook.sheet(0).row(462).at(0)).to eq(
          'Perpetrator Statistics - Alleged Perpetrator - Survivor Relationship'
        )
        expect(workbook.sheet(0).row(492).at(0)).to eq(
          'Perpetrator Statistics - Alleged Primary Perpetrators Age Group'
        )
        expect(workbook.sheet(0).row(526).at(0)).to eq(
          'Perpetrator Statistics - Alleged Primary Perpetrator Occupation'
        )
        expect(workbook.sheet(0).row(557).at(0)).to eq(
          'Referral Statistics - Number of incidents for which your organisation is the first point of contact'
        )
        expect(workbook.sheet(0).row(585).at(0)).to eq(
          'Referral Statistics - Incidents Referred From Other Service Providers'
        )
        expect(workbook.sheet(0).row(613).at(0)).to eq(
          'Referral Statistics - Number of Services Provided for Incidents'
        )
        expect(workbook.sheet(0).row(647).at(0)).to eq(
          'Referral Statistics - New Incident Referrals to Other Service Providers'
        )
      end
    end

    describe 'when there is no data' do
      let(:workbook_no_data) do
        data = ManagedReport.list[Permission::GBV_STATISTICS_REPORT].export(
          nil,
          [
            SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: Date.today + 1.month,
              to: Date.today + 2.month
            ),
            SearchFilters::Value.new(
              field_name: 'grouped_by',
              value: 'month'
            )
          ],
          { output_to_file: false }
        )

        Roo::Spreadsheet.open(StringIO.new(data), extension: :xlsx)
      end

      context 'should render report' do
        it 'prints subreport headers' do
          expect(workbook_no_data.sheet(0).row(1)).to match_array(['GBV Statistics'])
        end

        it 'prints report params' do
          result =
            '<html><b>View By: </b>Month / <b>Date Range: </b>Custom / ' \
            "<b>From: </b>#{(Date.today + 1.month).strftime('%Y-%m-%d')} / " \
            "<b>To: </b>#{(Date.today + 2.month).strftime('%Y-%m-%d')} / <b>Date: </b>Date of Incident / </html>"

          expect(workbook_no_data.sheet(0).row(2)).to match_array([result])
        end

        it 'prints indicator tables' do
          expect(workbook_no_data.sheet(0).row(7)).to match_array(
            ['New GBV Incidents Reported']
          )
          expect(workbook_no_data.sheet(0).row(8)).to match_array(
            ['Number of Incidents Reported by Survivors with Prior GBV Incidents']
          )
          expect(workbook_no_data.sheet(0).row(13).at(0)).to eq('Survivor Statistics - Age of survivors')
          expect(workbook_no_data.sheet(0).row(15).at(0)).to eq('Survivor Statistics - Marital Status of Survivors')
          expect(workbook_no_data.sheet(0).row(17).at(0)).to eq(
            'Survivor Statistics - Displacement Status at Time of Report'
          )
          expect(workbook_no_data.sheet(0).row(19).at(0)).to eq(
            'Survivor Statistics - Stage of Displacement at Time of Incident'
          )
          expect(workbook_no_data.sheet(0).row(21).at(0)).to eq('Survivor Statistics - Vulnerable Populations')
          expect(workbook_no_data.sheet(0).row(23).at(0)).to eq(
            'Survivor Statistics - Number of Incidents of Sexual Violence Reported'
          )
          expect(workbook_no_data.sheet(0).row(25).at(0)).to eq('Incident Statistics - Type of GBV')
          expect(workbook_no_data.sheet(0).row(27).at(0)).to eq('Incident Statistics - Incident Time of Day')
          expect(workbook_no_data.sheet(0).row(29).at(0)).to eq('Incident Statistics - Case Context')
          expect(workbook_no_data.sheet(0).row(31).at(0)).to eq(
            'Incident Statistics - Time Between Incident and Report Date'
          )
          expect(workbook_no_data.sheet(0).row(33).at(0)).to eq(
            'Incident Statistics - Incidents of Rape, Time Elapsed between Incident and Report Date'
          )
          expect(workbook_no_data.sheet(0).row(35).at(0)).to eq(
            'Incident Statistics - Incidents of Rape, Time Elapsed (Health Service or Referral)'
          )
          expect(workbook_no_data.sheet(0).row(37).at(0)).to eq('Incident Statistics - Incident Location')
          expect(workbook_no_data.sheet(0).row(39).at(0)).to eq(
            'Perpetrator Statistics - Number of Primary Perpetrators'
          )
          expect(workbook_no_data.sheet(0).row(41).at(0)).to eq(
            'Perpetrator Statistics - Alleged Perpetrator - Survivor Relationship'
          )
          expect(workbook_no_data.sheet(0).row(43).at(0)).to eq(
            'Perpetrator Statistics - Alleged Primary Perpetrators Age Group'
          )
          expect(workbook_no_data.sheet(0).row(45).at(0)).to eq(
            'Perpetrator Statistics - Alleged Primary Perpetrator Occupation'
          )
          expect(workbook_no_data.sheet(0).row(47).at(0)).to eq(
            'Referral Statistics - Number of incidents for which your organisation is the first point of contact'
          )
          expect(workbook_no_data.sheet(0).row(49).at(0)).to eq(
            'Referral Statistics - Incidents Referred From Other Service Providers'
          )
          expect(workbook_no_data.sheet(0).row(51).at(0)).to eq(
            'Referral Statistics - Number of Services Provided for Incidents'
          )
          expect(workbook_no_data.sheet(0).row(53).at(0)).to eq(
            'Referral Statistics - New Incident Referrals to Other Service Providers'
          )
        end
      end
    end
  end

  context 'when is a export of GHN' do
    let(:workbook) do
      data = ManagedReport.list[Permission::GHN_REPORT].export(
        nil,
        [
          SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
          SearchFilters::DateRange.new(
            field_name: 'ghn_date_filter',
            from: '2022-01-01',
            to: '2022-06-10'
          )
        ],
        { output_to_file: false }
      )

      Roo::Spreadsheet.open(StringIO.new(data), extension: :xlsx)
    end

    before do
      incident0 = Incident.create!(
        data: {
          incident_date: Date.new(2022, 4, 23),
          date_of_first_report: Date.new(2022, 4, 23),
          status: 'open',
          module_id: 'primeromodule-mrm'
        }
      )
      incident1 = Incident.create!(
        data: {
          incident_date: Date.new(2022, 6, 4),
          date_of_first_report: Date.new(2022, 6, 4),
          status: 'open',
          module_id: 'primeromodule-mrm'
        }
      )

      violation1 = Violation.create!(
        data: {
          type: 'killing',
          ctfmr_verified: 'verified',
          ctfmr_verified_date: Date.new(2022, 4, 23),
          violation_tally: { boys: 2, girls: 0, unknown: 2, total: 4 }
        },
        incident_id: incident0.id
      )

      violation2 = Violation.create!(
        data: { type: 'abduction', ctfmr_verified: 'verified',
                ctfmr_verified_date: Date.new(2022, 6, 4),
                violation_tally: { boys: 1, girls: 2, unknown: 5, total: 8 } },
        incident_id: incident1.id
      )

      Violation.create!(
        data: {
          type: 'maiming',
          ctfmr_verified: 'report_pending_verification',
          violation_tally: { boys: 2, girls: 3, unknown: 2, total: 7 }
        },
        incident_id: incident0.id
      )

      Violation.create!(
        data: { type: 'attack_on_schools', ctfmr_verified: 'report_pending_verification',
                violation_tally: { boys: 3, girls: 4, unknown: 5, total: 12 } },
        incident_id: incident0.id
      )

      Violation.create!(
        data: { type: 'attack_on_schools', ctfmr_verified: 'verified',
                ctfmr_verified_date: Date.new(2022, 4, 23),
                violation_tally: { boys: 3, girls: 4, unknown: 5, total: 12 } },
        incident_id: incident0.id
      )

      violation1.individual_victims = [
        IndividualVictim.create!(data: { individual_sex: 'male', individual_age: 9,
                                         individual_multiple_violations: 'true',
                                         unique_id: '8b79234d-6d22-47b6-a7ad-927207676667' })
      ]

      violation2.individual_victims = [
        IndividualVictim.create!(data: { individual_sex: 'male', individual_age: 12 }),
        IndividualVictim.create!(data: { individual_age: 3,
                                         individual_multiple_violations: 'true',
                                         unique_id: '858a003b-1b21-4fe0-abbf-9cb39d3a6d80' })
      ]

      violation1.save!
      violation2.save!
    end

    it 'should export the excel' do
      expect(workbook.sheets.size).to eq(1)
    end

    it 'prints subreport headers' do
      expect(workbook.sheet(0).row(1)).to eq(['Global Horizontal Note', nil, nil, nil, nil])
    end

    it 'prints report params' do
      expect(workbook.sheet(0).row(2)).to eq(
        [
          '<html><b>View By: </b>Quarter / <b>Date Range: </b>Custom / <b>From: </b>2022-01-01 / <b>To: </b>2022-06-10 / </html>',
          nil,
          nil,
          nil,
          nil
        ]
      )
    end

    it 'prints indicator tables' do
      expect(workbook.sheet(0).row(5)).to eq(['Verified Information - Victims', nil, nil, nil, nil])
      expect(workbook.sheet(0).row(6)).to eq([nil, 'Boys', 'Girls', 'Unknown', 'Total'])
      expect(workbook.sheet(0).row(7)).to eq(['Abduction', 1, 2, 5, 8])
      expect(workbook.sheet(0).row(8)).to eq(['Attacks on school(s)', 3, 4, 5, 12])
      expect(workbook.sheet(0).row(9)).to eq(['Killing of Children', 2, 0, 2, 4])

      expect(workbook.sheet(0).row(34)).to eq(['Verified Information - Violations', nil, nil, nil, nil])
      expect(workbook.sheet(0).row(35)).to eq([nil, 'Total', nil, nil, nil])
      expect(workbook.sheet(0).row(36)).to eq(['Attacks on school(s)', 1, nil, nil, nil])

      expect(workbook.sheet(0).row(116)).to eq(['Unverified Information - Victims', nil, nil, nil, nil])
      expect(workbook.sheet(0).row(117)).to eq([nil, 'Boys', 'Girls', 'Unknown', 'Total'])
      expect(workbook.sheet(0).row(118)).to eq(['Attacks on school(s)', 3, 4, 5, 12])
      expect(workbook.sheet(0).row(119)).to eq(['Maiming of Children', 2, 3, 2, 7])

      expect(workbook.sheet(0).row(144)).to eq(['Unverified Information - Violations', nil, nil, nil, nil])
      expect(workbook.sheet(0).row(145)).to eq([nil, 'Total', nil, nil, nil])
      expect(workbook.sheet(0).row(146)).to eq(['Attacks on school(s)', 1, nil, nil, nil])

      expect(workbook.sheet(0).row(173)).to eq([nil, 'Associated Violations', nil, nil, nil])
      expect(workbook.sheet(0).row(174)).to eq(['d3a6d80 - 3', 'Abduction', nil, nil, nil])
      expect(workbook.sheet(0).row(175)).to eq(['7676667 - 9', 'Killing of Children', nil, nil, nil])
    end
  end

  context 'when is a export of TSFV Workflow' do
    let(:workbook) do
      data = ManagedReport.list[Permission::WORKFLOW_REPORT].export(
        nil,
        [
          SearchFilters::Value.new(field_name: 'grouped_by', value: 'week'),
          SearchFilters::ValueList.new(field_name: 'status', values: %w[open closed]),
          SearchFilters::Value.new(field_name: 'workflow', value: 'new'),
          SearchFilters::Value.new(field_name: 'by', value: 'owned_by_groups'),
          SearchFilters::Value.new(field_name: 'owned_by_groups', value: 'usergroup-group-1'),
          SearchFilters::DateRange.new(
            field_name: 'registration_date',
            from: '2023-04-30',
            to: '2023-05-19'
          )
        ],
        { output_to_file: false }
      )

      Roo::Spreadsheet.open(StringIO.new(data), extension: :xlsx)
    end

    let(:case1) do
      Child.create!(
        data: {
          registration_date: '2023-05-02', sex: 'female', age: 5, status: 'open', workflow: 'closed',
          created_by_groups: ['usergroup-group-2'], owned_by_groups: ['usergroup-group-1']
        }
      )
    end
    let(:case2) do
      Child.create!(
        data: {
          registration_date: '2023-05-03', sex: 'male', age: 2, status: 'open', workflow: 'new',
          created_by_groups: ['usergroup-group-2'], owned_by_groups: ['usergroup-group-1']
        }
      )
    end

    let(:case3) do
      Child.create!(
        data: {
          registration_date: '2023-05-10', sex: 'male', age: 5, status: 'open', workflow: 'service_implemented',
          created_by_groups: ['usergroup-group-2'], owned_by_groups: ['usergroup-group-1']
        }
      )
    end

    let(:case4) do
      Child.create!(
        data: {
          registration_date: '2023-05-19', sex: 'female', age: 14, workflow: 'new',
          created_by_groups: ['usergroup-group-2'], owned_by_groups: ['usergroup-group-1']
        }
      )
    end

    let(:incident1) do
      Incident.create!(incident_case_id: case2.id)
    end

    let(:incident2) do
      Incident.create!(incident_case_id: case2.id)
    end

    let(:incident3) do
      Incident.create!(incident_case_id: case4.id)
    end

    before do
      case1
      case2
      case3
      case4
      incident1
      incident2
      incident3
    end

    it 'should export the excel' do
      expect(workbook.sheets.size).to eq(2)
    end

    it 'prints subreport headers' do
      expect(workbook.sheet(0).row(1)).to eq(
        ['Workflow - Cases', nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil]
      )
      expect(workbook.sheet(1).row(1)).to eq(
        [
          'Workflow - Incidents', nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil,
          nil, nil, nil, nil, nil, nil, nil
        ]
      )
    end

    it 'prints report params' do
      expect(workbook.sheet(0).row(2)).to eq(
        [
          '<html><b>View By: </b>Week / <b>Date Range: </b>Custom / <b>From: </b>2023-04-30 / <b>To: </b>2023-05-19 / '\
          '<b>Date: </b>Registration Date / <b>Status: </b>Open,Closed / <b>Workflow Status: </b>New / ' \
          '<b>By: </b>User Groups of record owner / <b>User Group: </b>Group 1</html>',
          nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil
        ]
      )
      expect(workbook.sheet(1).row(2)).to eq(
        [
          '<html><b>View By: </b>Week / <b>Date Range: </b>Custom / <b>From: </b>2023-04-30 / <b>To: </b>2023-05-19 / '\
          '<b>Date: </b>Registration Date / <b>Status: </b>Open,Closed / <b>Workflow Status: </b>New / ' \
          '<b>By: </b>User Groups of record owner / <b>User Group: </b>Group 1</html>',
          nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil
        ]
      )
    end

    it 'prints indicator tables' do
      expect(workbook.sheet(0).row(5)).to eq(
        [
          'Total Number of Cases by Sex and Age', nil, nil, nil, nil, nil, nil, nil, nil, nil, nil,
          nil, nil, nil, nil, nil, nil, nil, nil
        ]
      )
      expect(workbook.sheet(0).row(6)).to eq(
        [
          nil, '2023-Apr-30 - 2023-May-06', nil, nil, nil, nil, nil,
          '2023-May-07 - 2023-May-13', nil, nil, nil, nil, nil,
          '2023-May-14 - 2023-May-20', nil, nil, nil, nil, nil
        ]
      )
      expect(workbook.sheet(0).row(7)).to eq(
        [
          nil,
          '0 - 4', '5 - 11', '12 - 17', '18 - 59', '60+', 'Total',
          '0 - 4', '5 - 11', '12 - 17', '18 - 59', '60+', 'Total',
          '0 - 4', '5 - 11', '12 - 17', '18 - 59', '60+', 'Total'
        ]
      )
      expect(workbook.sheet(0).row(8)).to eq(
        ['Male', 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      )
      expect(workbook.sheet(0).row(9)).to eq(
        ['Female', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1]
      )
      expect(workbook.sheet(0).row(10)).to eq(
        ['Total', 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1]
      )
      expect(workbook.sheet(1).row(5)).to eq(
        [
          'Total Number of Incidents by Sex and Age', nil, nil, nil, nil, nil, nil, nil, nil, nil, nil,
          nil, nil, nil, nil, nil, nil, nil, nil
        ]
      )
      expect(workbook.sheet(1).row(6)).to eq(
        [
          nil, '2023-Apr-30 - 2023-May-06', nil, nil, nil, nil, nil,
          '2023-May-07 - 2023-May-13', nil, nil, nil, nil, nil,
          '2023-May-14 - 2023-May-20', nil, nil, nil, nil, nil
        ]
      )
      expect(workbook.sheet(1).row(7)).to eq(
        [
          nil,
          '0 - 4', '5 - 11', '12 - 17', '18 - 59', '60+', 'Total',
          '0 - 4', '5 - 11', '12 - 17', '18 - 59', '60+', 'Total',
          '0 - 4', '5 - 11', '12 - 17', '18 - 59', '60+', 'Total'
        ]
      )
      expect(workbook.sheet(1).row(8)).to eq(
        ['Male', 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      )
      expect(workbook.sheet(1).row(9)).to eq(
        ['Female', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1]
      )
      expect(workbook.sheet(1).row(10)).to eq(
        ['Total', 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1]
      )
    end
  end

  context 'when is a export of TSFV Violence Type' do
    let(:workbook) do
      data = ManagedReport.list[Permission::VIOLENCE_TYPE_REPORT].export(
        nil,
        [
          SearchFilters::Value.new(field_name: 'grouped_by', value: 'week'),
          SearchFilters::ValueList.new(field_name: 'status', values: %w[open closed]),
          SearchFilters::Value.new(field_name: 'cp_incident_violence_type', value: 'forced_marriage'),
          SearchFilters::Value.new(field_name: 'by', value: 'owned_by_groups'),
          SearchFilters::Value.new(field_name: 'owned_by_groups', value: 'usergroup-group-1'),
          SearchFilters::DateRange.new(
            field_name: 'registration_date',
            from: '2023-04-30',
            to: '2023-05-13'
          )
        ],
        { output_to_file: false }
      )

      Roo::Spreadsheet.open(StringIO.new(data), extension: :xlsx)
    end

    let(:case1) do
      Child.create!(
        data: {
          registration_date: '2023-05-02', sex: 'female', age: 5, status: 'open',
          created_by_groups: ['usergroup-group-2'], owned_by_groups: ['usergroup-group-1']
        }
      )
    end
    let(:case2) do
      Child.create!(
        data: {
          registration_date: '2023-05-12', sex: 'male', age: 2, status: 'open',
          created_by_groups: ['usergroup-group-2'], owned_by_groups: ['usergroup-group-1']
        }
      )
    end

    let(:incident1) do
      Incident.create!(incident_case_id: case1.id, data: { cp_incident_violence_type: 'sexual_assault' })
    end

    let(:incident2) do
      Incident.create!(incident_case_id: case2.id, data: { cp_incident_violence_type: 'forced_marriage' })
    end

    let(:incident3) do
      Incident.create!(incident_case_id: case2.id, data: { cp_incident_violence_type: 'forced_marriage' })
    end

    before do
      case1
      case2
      incident1
      incident2
      incident3
    end

    it 'should export the excel' do
      expect(workbook.sheets.size).to eq(2)
    end

    it 'prints subreport headers' do
      expect(workbook.sheet(0).row(1)).to eq(
        ['Type of Violence - Cases', nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil]
      )

      expect(workbook.sheet(1).row(1)).to eq(
        ['Type of Violence - Incidents', nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil]
      )
    end

    it 'prints report params' do
      expect(workbook.sheet(0).row(2)).to eq(
        [
          '<html><b>View By: </b>Week / <b>Date Range: </b>Custom / ' \
          '<b>From: </b>2023-04-30 / <b>To: </b>2023-05-13 / ' \
          '<b>Date: </b>Registration Date / <b>Status: </b>Open,Closed / <b>Type of Violence: </b>Forced Marriage / ' \
          '<b>By: </b>User Groups of record owner / <b>User Group: </b>Group 1</html>',
          nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil
        ]
      )

      expect(workbook.sheet(1).row(2)).to eq(
        [
          '<html><b>View By: </b>Week / <b>Date Range: </b>Custom / ' \
          '<b>From: </b>2023-04-30 / <b>To: </b>2023-05-13 / ' \
          '<b>Date: </b>Registration Date / <b>Status: </b>Open,Closed / <b>Type of Violence: </b>Forced Marriage / ' \
          '<b>By: </b>User Groups of record owner / <b>User Group: </b>Group 1</html>',
          nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil
        ]
      )
    end

    it 'prints indicator tables' do
      expect(workbook.sheet(0).row(5)).to eq(
        ['Total Number of Cases by Sex and Age', nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil]
      )
      expect(workbook.sheet(0).row(6)).to eq(
        [
          nil, '2023-Apr-30 - 2023-May-06', nil, nil, nil, nil, nil,
          '2023-May-07 - 2023-May-13', nil, nil, nil, nil, nil
        ]
      )
      expect(workbook.sheet(0).row(7)).to eq(
        [
          nil,
          '0 - 4', '5 - 11', '12 - 17', '18 - 59', '60+', 'Total',
          '0 - 4', '5 - 11', '12 - 17', '18 - 59', '60+', 'Total'
        ]
      )
      expect(workbook.sheet(0).row(8)).to eq(
        ['Male', 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
      )
      expect(workbook.sheet(0).row(9)).to eq(
        ['Total', 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
      )

      expect(workbook.sheet(1).row(5)).to eq(
        ['Total Number of Incidents by Sex and Age', nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil]
      )
      expect(workbook.sheet(1).row(6)).to eq(
        [
          nil, '2023-Apr-30 - 2023-May-06', nil, nil, nil, nil, nil,
          '2023-May-07 - 2023-May-13', nil, nil, nil, nil, nil
        ]
      )
      expect(workbook.sheet(1).row(7)).to eq(
        [
          nil,
          '0 - 4', '5 - 11', '12 - 17', '18 - 59', '60+', 'Total',
          '0 - 4', '5 - 11', '12 - 17', '18 - 59', '60+', 'Total'
        ]
      )
      expect(workbook.sheet(1).row(8)).to eq(
        ['Male', 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2]
      )
      expect(workbook.sheet(1).row(9)).to eq(
        ['Total', 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2]
      )
    end
  end
end
