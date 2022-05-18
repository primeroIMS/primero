# frozen_string_literal: true

require 'rails_helper'

describe Exporters::ManagedReportExporter do
  before do
    clean_data(Lookup, Incident)

    SystemSettings.stub(:primary_age_ranges).and_return([0..5, 6..11, 12..17, 18..AgeRange::MAX])

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
        { id: '0_3_days', display_text: '0-3 Days' }
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

    Incident.create!(
      data: {
        gbv_sexual_violence_type: 'forced_marriage',
        incident_date: Date.today,
        module_id: 'primeromodule-gbv',
        incident_timeofday: 'morning',
        incident_location_type: 'forest',
        age: 3,
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
    Incident.create!(
      data: {
        gbv_sexual_violence_type: 'sexual_assault',
        incident_date: Date.today,
        module_id: 'primeromodule-gbv',
        incident_timeofday: 'evening_night',
        incident_location_type: 'garden',
        age: 7,
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
        gbv_previous_incidents: true,
        incident_timeofday: 'afternoon',
        incident_location_type: 'school',
        age: 5,
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
        expect(workbook.sheets.size).to eq(3)
      end

      describe 'Incidents subreport' do
        it 'prints subreport headers' do
          expect(workbook.sheet(0).row(1)).to eq(['Incidents', nil])
        end

        it 'prints report params' do
          expect(workbook.sheet(0).row(2)).to eq(
            [
              '<html><b>Date Range: </b>This Quarter / <b>Date: </b>Date of Incident / </html>',
              nil
            ]
          )
        end

        it 'prints indicator tables' do
          expect(workbook.sheet(0).row(5)).to eq(['Incidents', nil])
          expect(workbook.sheet(0).row(6)).to eq([nil, 'Total'])
          expect(workbook.sheet(0).row(7)).to eq(['Number of GBV Incidents Reported', 3])
          expect(workbook.sheet(0).row(8)).to eq(['Number of Incidents of Sexual Violence Reported', 3])
          expect(workbook.sheet(0).row(9)).to eq(
            ['Number of Incidents Reported by Survivors with Prior GBV Incidents', 1]
          )

          expect(workbook.sheet(0).row(12)).to eq(['Incident Type', nil])
          expect(workbook.sheet(0).row(13)).to eq([nil, 'Total'])
          expect(workbook.sheet(0).row(14)).to eq(['Forced Marriage', 1])
          expect(workbook.sheet(0).row(15)).to eq(['Rape', 1])
          expect(workbook.sheet(0).row(16)).to eq(['Sexual Assault', 1])

          expect(workbook.sheet(0).row(42)).to eq(['Incident Time of Day', nil])
          expect(workbook.sheet(0).row(43)).to eq([nil, 'Total'])
          expect(workbook.sheet(0).row(44)).to eq(['Afternoon (noon to sunset)', 1])
          expect(workbook.sheet(0).row(45)).to eq(['Evening/Night (sunset to sunrise)', 1])
          expect(workbook.sheet(0).row(46)).to eq(['Morning (sunrise to noon)', 1])

          expect(workbook.sheet(0).row(72)).to eq(['Time Between Incident and Report Date', nil])
          expect(workbook.sheet(0).row(73)).to eq([nil, 'Total'])
          expect(workbook.sheet(0).row(74)).to eq(['0-3 Days', 3])

          expect(workbook.sheet(0).row(100)).to eq(
            ['Incidents of Rape, Time Elapsed between Incident and Report Date', nil]
          )
          expect(workbook.sheet(0).row(101)).to eq([nil, 'Total'])
          expect(workbook.sheet(0).row(102)).to eq(['0-3 Days', 1])

          expect(workbook.sheet(0).row(128)).to eq(['Incident Location', nil])
          expect(workbook.sheet(0).row(129)).to eq([nil, 'Total'])
          expect(workbook.sheet(0).row(130)).to eq(['Bush/Forest', 1])
          expect(workbook.sheet(0).row(131)).to eq(['Garden/Cultivated Field', 1])
          expect(workbook.sheet(0).row(132)).to eq(['School', 1])
        end
      end

      describe 'Perpetrators subreport' do
        it 'prints subreport headers' do
          expect(workbook.sheet(1).row(1)).to eq(['Perpetrators', nil])
        end

        it 'prints report params' do
          expect(workbook.sheet(1).row(2)).to eq(
            [
              '<html><b>Date Range: </b>This Quarter / <b>Date: </b>Date of Incident / </html>',
              nil
            ]
          )
        end

        it 'prints indicator tables' do
          expect(workbook.sheet(1).row(5)).to eq(['Number of Perpetrators', nil])
          expect(workbook.sheet(1).row(6)).to eq([nil, 'Total'])
          expect(workbook.sheet(1).row(7)).to eq([1, 1])
          expect(workbook.sheet(1).row(8)).to eq([2, 1])
          expect(workbook.sheet(1).row(9)).to eq([3, 1])

          expect(workbook.sheet(1).row(35)).to eq(['Alleged Primary Perpetrator’s Relationship to Survivor', nil])
          expect(workbook.sheet(1).row(36)).to eq([nil, 'Total'])
          expect(workbook.sheet(1).row(37)).to eq(['No relation', 2])
          expect(workbook.sheet(1).row(38)).to eq(['Other', 1])
          expect(workbook.sheet(1).row(39)).to eq(['Primary Caregiver', 3])

          expect(workbook.sheet(1).row(65)).to eq(['Alleged Primary Perpetrators Age Group', nil])
          expect(workbook.sheet(1).row(66)).to eq([nil, 'Total'])
          expect(workbook.sheet(1).row(67)).to eq(['0-11', 3])
          expect(workbook.sheet(1).row(68)).to eq(['12-17', 2])
          expect(workbook.sheet(1).row(69)).to eq(['18-25', 1])

          expect(workbook.sheet(1).row(95)).to eq(['Alleged Primary Perpetrator Occupation', nil])
          expect(workbook.sheet(1).row(96)).to eq([nil, 'Total'])
          expect(workbook.sheet(1).row(97)).to eq(['Occupation 1', 3])
          expect(workbook.sheet(1).row(98)).to eq(['Occupation 2', 2])
          expect(workbook.sheet(1).row(99)).to eq(['Unknown', 1])
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

        context 'Incidents subreport' do
          it 'prints subreport headers' do
            expect(workbook_grouped.sheet(0).row(1)).to match_array(['Incidents', nil, nil, nil, nil, nil])
          end

          it 'prints report params' do
            result = '<html><b>View By: </b>Month / <b>Date Range: </b>Custom / '\
            "<b>From: </b>#{(Date.today - 2.month).strftime('%Y-%m-%d')} / "\
            "<b>To: </b>#{(Date.today + 2.month).strftime('%Y-%m-%d')} / <b>Date: </b>Date of Incident / </html>"

            expect(workbook_grouped.sheet(0).row(2)).to match_array([result, nil, nil, nil, nil, nil])
          end

          it 'prints indicator tables' do
            year_range = [
              nil, (Date.today - 2.month).strftime('%Y-%b'), (Date.today - 1.month).strftime('%Y-%b'),
              Date.today.strftime('%Y-%b'), (Date.today + 1.month).strftime('%Y-%b'),
              (Date.today + 2.month).strftime('%Y-%b')
            ]

            expect(workbook_grouped.sheet(0).row(5)).to match_array(
              ['Incidents', nil, nil, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(6)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(7)).to match_array(
              ['Number of GBV Incidents Reported', 0, 0, 3, 0, 0]
            )
            expect(workbook_grouped.sheet(0).row(8)).to match_array(
              ['Number of Incidents Reported by Survivors with Prior GBV Incidents', 0, 0, 1, 0, 0]
            )
            expect(workbook_grouped.sheet(0).row(9)).to match_array(
              ['Number of Incidents of Sexual Violence Reported', 0, 0, 3, 0, 0]
            )

            expect(workbook_grouped.sheet(0).row(12)).to match_array(
              ['Incident Type', nil, nil, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(13)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(14)).to match_array(['Rape', 0, 0, 1, 0, 0])
            expect(workbook_grouped.sheet(0).row(15)).to match_array(
              ['Sexual Assault', 0, 0, 1, 0, 0]
            )
            expect(workbook_grouped.sheet(0).row(16)).to match_array(
              ['Forced Marriage', 0, 0, 1, 0, 0]
            )

            expect(workbook_grouped.sheet(0).row(41)).to match_array(
              ['Incident Time of Day', nil, nil, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(42)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(43)).to match_array(
              ['Morning (sunrise to noon)', 0, 0, 1, 0, 0]
            )
            expect(workbook_grouped.sheet(0).row(44)).to match_array(
              ['Afternoon (noon to sunset)', 0, 0, 1, 0, 0]
            )
            expect(workbook_grouped.sheet(0).row(45)).to match_array(
              ['Evening/Night (sunset to sunrise)', 0, 0, 1, 0, 0]
            )

            expect(workbook_grouped.sheet(0).row(70)).to match_array(
              ['Time Between Incident and Report Date', nil, nil, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(71)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(72)).to match_array(['0-3 Days', 0, 0, 3, 0, 0])

            expect(workbook_grouped.sheet(0).row(97)).to match_array(
              [
                'Incidents of Rape, Time Elapsed between Incident and Report Date',
                nil, nil, nil, nil, nil
              ]
            )
            expect(workbook_grouped.sheet(0).row(98)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(99)).to match_array(['0-3 Days', 0, 0, 1, 0, 0])

            expect(workbook_grouped.sheet(0).row(124)).to match_array(
              ['Incident Location', nil, nil, nil, nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(125)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(126)).to match_array(['Bush/Forest', 0, 0, 1, 0, 0])
            expect(workbook_grouped.sheet(0).row(127)).to match_array(
              ['Garden/Cultivated Field', 0, 0, 1, 0, 0]
            )
            expect(workbook_grouped.sheet(0).row(128)).to match_array(['School', 0, 0, 1, 0, 0])
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

        context 'Incidents subreport' do
          it 'prints subreport headers' do
            expect(workbook_grouped.sheet(0).row(1)).to match_array(['Incidents', nil, nil])
          end

          it 'prints report params' do
            result = '<html><b>View By: </b>Year / <b>Date Range: </b>Custom / '\
            "<b>From: </b>#{(Date.today - 1.year).strftime('%Y-%m-%d')} / "\
            "<b>To: </b>#{(Date.today.end_of_year).strftime('%Y-%m-%d')} / <b>Date: </b>Date of Incident / </html>"

            expect(workbook_grouped.sheet(0).row(2)).to match_array([result, nil, nil])
          end

          it 'prints indicator tables' do
            year_range = [
              nil, Date.today.last_year.year, Date.today.year
            ]

            expect(workbook_grouped.sheet(0).row(5)).to match_array(
              ['Incidents', nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(6)).to match_array(year_range)

            expect(workbook_grouped.sheet(0).row(7)).to match_array(
              ['Number of GBV Incidents Reported', 0, 3]
            )
            expect(workbook_grouped.sheet(0).row(8)).to match_array(
              ['Number of Incidents Reported by Survivors with Prior GBV Incidents', 0, 1]
            )
            expect(workbook_grouped.sheet(0).row(9)).to match_array(
              ['Number of Incidents of Sexual Violence Reported', 0, 3]
            )

            expect(workbook_grouped.sheet(0).row(12)).to match_array(
              ['Incident Type', nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(13)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(14)).to match_array(['Rape', 0, 1])
            expect(workbook_grouped.sheet(0).row(15)).to match_array(
              ['Sexual Assault', 0, 1]
            )
            expect(workbook_grouped.sheet(0).row(16)).to match_array(
              ['Forced Marriage', 0, 1]
            )

            expect(workbook_grouped.sheet(0).row(41)).to match_array(
              ['Incident Time of Day', nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(42)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(43)).to match_array(
              ['Morning (sunrise to noon)', 0, 1]
            )
            expect(workbook_grouped.sheet(0).row(44)).to match_array(
              ['Afternoon (noon to sunset)', 0, 1]
            )
            expect(workbook_grouped.sheet(0).row(45)).to match_array(
              ['Evening/Night (sunset to sunrise)', 0, 1]
            )

            expect(workbook_grouped.sheet(0).row(70)).to match_array(
              ['Time Between Incident and Report Date', nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(71)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(72)).to match_array(['0-3 Days', 0, 3])

            expect(workbook_grouped.sheet(0).row(97)).to match_array(
              [
                'Incidents of Rape, Time Elapsed between Incident and Report Date',
                nil, nil
              ]
            )
            expect(workbook_grouped.sheet(0).row(98)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(99)).to match_array(['0-3 Days', 0, 1])

            expect(workbook_grouped.sheet(0).row(124)).to match_array(
              ['Incident Location', nil, nil]
            )
            expect(workbook_grouped.sheet(0).row(125)).to match_array(year_range)
            expect(workbook_grouped.sheet(0).row(126)).to match_array(['Bush/Forest', 0, 1])
            expect(workbook_grouped.sheet(0).row(127)).to match_array(
              ['Garden/Cultivated Field', 0, 1]
            )
            expect(workbook_grouped.sheet(0).row(128)).to match_array(['School', 0, 1])
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

        context 'Incidents subreport' do
          it 'prints subreport headers' do
            expect(workbook_grouped.sheet(0).row(1)).to match_array(['Incidents', nil])
          end

          it 'prints report params' do
            result = '<html><b>View By: </b>Quarter / <b>Date Range: </b>This Quarter / '\
            '<b>Date: </b>Date of Incident / </html>'

            expect(workbook_grouped.sheet(0).row(2)).to match_array([result, nil])
          end

          it 'prints indicator tables' do
            quarter_range = [nil, "#{Date.today.year}-Q#{(Date.today.month / 3.0).ceil}"]

            expect(workbook_grouped.sheet(0).row(5)).to match_array(
              ['Incidents', nil]
            )
            expect(workbook_grouped.sheet(0).row(6)).to match_array(quarter_range)

            expect(workbook_grouped.sheet(0).row(7)).to match_array(
              ['Number of GBV Incidents Reported', 3]
            )
            expect(workbook_grouped.sheet(0).row(8)).to match_array(
              ['Number of Incidents Reported by Survivors with Prior GBV Incidents', 1]
            )
            expect(workbook_grouped.sheet(0).row(9)).to match_array(
              ['Number of Incidents of Sexual Violence Reported', 3]
            )

            expect(workbook_grouped.sheet(0).row(12)).to match_array(
              ['Incident Type', nil]
            )
            expect(workbook_grouped.sheet(0).row(13)).to match_array(quarter_range)
            expect(workbook_grouped.sheet(0).row(14)).to match_array(['Rape', 1])
            expect(workbook_grouped.sheet(0).row(15)).to match_array(
              ['Sexual Assault', 1]
            )
            expect(workbook_grouped.sheet(0).row(16)).to match_array(
              ['Forced Marriage', 1]
            )

            expect(workbook_grouped.sheet(0).row(41)).to match_array(
              ['Incident Time of Day', nil]
            )
            expect(workbook_grouped.sheet(0).row(42)).to match_array(quarter_range)
            expect(workbook_grouped.sheet(0).row(43)).to match_array(
              ['Morning (sunrise to noon)', 1]
            )
            expect(workbook_grouped.sheet(0).row(44)).to match_array(
              ['Afternoon (noon to sunset)', 1]
            )
            expect(workbook_grouped.sheet(0).row(45)).to match_array(
              ['Evening/Night (sunset to sunrise)', 1]
            )

            expect(workbook_grouped.sheet(0).row(70)).to match_array(
              ['Time Between Incident and Report Date', nil]
            )
            expect(workbook_grouped.sheet(0).row(71)).to match_array(quarter_range)
            expect(workbook_grouped.sheet(0).row(72)).to match_array(['0-3 Days', 3])

            expect(workbook_grouped.sheet(0).row(97)).to match_array(
              [
                'Incidents of Rape, Time Elapsed between Incident and Report Date',
                nil
              ]
            )
            expect(workbook_grouped.sheet(0).row(98)).to match_array(quarter_range)
            expect(workbook_grouped.sheet(0).row(99)).to match_array(['0-3 Days', 1])

            expect(workbook_grouped.sheet(0).row(124)).to match_array(
              ['Incident Location', nil]
            )
            expect(workbook_grouped.sheet(0).row(125)).to match_array(quarter_range)
            expect(workbook_grouped.sheet(0).row(126)).to match_array(['Bush/Forest', 1])
            expect(workbook_grouped.sheet(0).row(127)).to match_array(
              ['Garden/Cultivated Field', 1]
            )
            expect(workbook_grouped.sheet(0).row(128)).to match_array(['School', 1])
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
        expect(workbook_all.sheets.size).to eq(3)
      end

      it 'should export the excel' do
        expect(workbook_all.sheets.size).to eq(3)
        expect(workbook_all.sheets).to match_array(%w[Incidents Perpetrators Survivors])
      end

      it 'prints subreports headers' do
        expect(workbook_all.sheet(0).row(1)).to match_array(['Incidents', nil, nil])
        expect(workbook_all.sheet(1).row(1)).to match_array(['Perpetrators', nil, nil])
        expect(workbook_all.sheet(2).row(1)).to match_array(['Survivors', nil, nil])
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
          expect(workbook_no_data.sheet(0).row(1)).to match_array(['Incidents'])
        end

        it 'prints report params' do
          result = '<html><b>View By: </b>Month / <b>Date Range: </b>Custom / '\
          "<b>From: </b>#{(Date.today + 1.month).strftime('%Y-%m-%d')} / "\
          "<b>To: </b>#{(Date.today + 2.month).strftime('%Y-%m-%d')} / <b>Date: </b>Date of Incident / </html>"

          expect(workbook_no_data.sheet(0).row(2)).to match_array([result])
        end

        it 'prints indicator tables' do
          expect(workbook_no_data.sheet(0).row(7)).to match_array(
            ['Number of GBV Incidents Reported']
          )
          expect(workbook_no_data.sheet(0).row(8)).to match_array(
            ['Number of Incidents Reported by Survivors with Prior GBV Incidents']
          )
          expect(workbook_no_data.sheet(0).row(9)).to match_array(
            ['Number of Incidents of Sexual Violence Reported']
          )

          expect(workbook_no_data.sheet(0).row(12)).to match_array(
            ['Incident Type']
          )

          expect(workbook_no_data.sheet(0).row(14)).to match_array(
            ['Incident Time of Day']
          )

          expect(workbook_no_data.sheet(0).row(16)).to match_array(
            ['Time Between Incident and Report Date']
          )
          expect(workbook_no_data.sheet(0).row(18)).to match_array(
            ['Incidents of Rape, Time Elapsed between Incident and Report Date']
          )
          expect(workbook_no_data.sheet(0).row(20)).to match_array(['Incident Location'])
        end
      end
    end
  end
end
