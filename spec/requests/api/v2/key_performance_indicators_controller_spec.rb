require 'rails_helper'

describe Api::V2::KeyPerformanceIndicatorsController, type: :request do
  before(:each) do
    clean_data(Location, Agency, Role, UserGroup, User, Child)

    @uk = Location.create!(location_code: 'GBR', name: 'United Kingdom', placename: 'United Kingdom', type: 'Country', hierarchy_path: 'GBR', admin_level: 0)
    @england = Location.create!(location_code: '01', name: 'England', placename: 'England', type: 'Region', hierarchy_path: 'GBR.01', admin_level: 1)
    @london = Location.create!(location_code: '41', name: 'London', placename: 'London', type: 'County', hierarchy_path: 'GBR.01.41', admin_level: 2)

    @unicef = Agency.create!(agency_code: 'UNICEF', name: 'UNICEF')
    @gbv_manager = Role.create!(name: 'GBV Manager', permissions: [
      Permission.new()
    ])
    @primero_gbv_group = UserGroup.create!(name: 'Primero GBV')

    @primero_kpi = User.new(
      user_name: 'primero_kpi',
      agency: @unicef,
      role: @gbv_manager,
      user_groups: [@primero_gbv_group],
      location: @london.location_code
    )
    @primero_kpi.save(validate: false)

    Sunspot.commit
  end

  let(:json) { JSON.parse(response.body, symbolize_names: true) }

  describe 'GET /api/v2/key_performance_indicators/number_of_cases', search: true do
    with 'a valid active case' do
      it "should show one case in the last month in London" do
        child = Child.new_with_user(@primero_kpi, {}).save!
        Sunspot.commit

        sign_in(@primero_kpi)

        get '/api/v2/key_performance_indicators/number_of_cases', params: {
          from: Date.today - 31,
          to: Date.today + 1
        }

        expect(response).to have_http_status(200)
        expect(json[:data][0]).to be
        expect(json[:data][0][:reporting_site]).to eq(@london.placename)
        expect(json[:data][0][json[:dates].last.to_sym]).to eq(1)
      end
    end
  end

  describe 'GET /api/v2/key_performance_indicators/number_of_incidents', search: true do
    with 'a valid incident dated 6 days ago' do
      it "shows 1 incident in the last month in London" do
        incident = Incident.new_with_user(@primero_kpi, {
          incident_date: Date.today.prev_day(6)
        }).save!
        Sunspot.commit

        sign_in(@primero_kpi)

        get '/api/v2/key_performance_indicators/number_of_incidents', params: {
          from: Date.today - 31,
          to: Date.today + 1
        }

        expect(response).to have_http_status(200)
        expect(json[:data][0]).to be
        expect(json[:data][0][:reporting_site]).to eq(@london.placename)
        expect(json[:data][0][json[:dates].last.to_sym]).to eq(1)
      end
    end
  end

  describe 'GET /api/v2/key_performance_indicators/reporting_delay', search: true do
    with 'a valid incident dated 6 days ago' do
      it 'shows 1 incident in the 6-14days range' do
        incident = Incident.new_with_user(@primero_kpi, {
          incident_date: Date.today.prev_day(6)
        }).save!
        Sunspot.commit

        sign_in(@primero_kpi)

        get '/api/v2/key_performance_indicators/reporting_delay', params: {
          from: Date.today - 31,
          to: Date.today + 1
        }

        expect(response).to have_http_status(200)
        expect(json[:data]).to be
        result = json[:data].
          select { |result| result[:total_incidents] > 0 }.
          first

        expect(result[:delay]).to eql('6-14days')
        expect(result[:total_incidents]).to eql(1)
        expect(result[:percentage]).to eql(1.0)
      end
    end
  end

  describe 'GET /api/v2/key_performance_indicators/assessment_status', search: true do
    with '1 case with a filled out survivor assessment form' do
      it 'shows an asssessment status of 100%' do
        child = Child.new_with_user(@primero_kpi, {
          "survivor_assessment_form" => [{
            'assessment_emotional_state_start' => 'Overwhelmed',
            'assessment_emotional_state_end' => 'Resilient',
            'assessment_presenting_problem' => 'Anxiety',
            'assessment_main_concerns' => 'Poor sales',
            'assessment_current_situation' => 'Poor'
          }]
        }).save!
        Sunspot.commit

        sign_in(@primero_kpi)

        get '/api/v2/key_performance_indicators/assessment_status', params: {
          from: Date.today - 31,
          to: Date.today + 1
        }

        expect(response).to have_http_status(200)
        expect(json[:data][:completed]).to eql(1.0)
      end
    end
  end
end
