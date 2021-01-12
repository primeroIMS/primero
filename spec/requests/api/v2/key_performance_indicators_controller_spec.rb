# frozen_string_literal: true

require 'rails_helper'

# Most of the tests after the HTTP status should be moved into unit tests.
describe Api::V2::KeyPerformanceIndicatorsController, type: :request do
  def form(id, fields)
    FormSection.create_or_update!(
      unique_id: id,
      parent_form: 'case',
      name_en: id.to_s.split('_').map(&:capitalize).join(' '),
      description_en: id.to_s.split('_').map(&:capitalize).join(' '),
      fields: fields
    )
  end

  def field(id, config = {})
    Field.new(config.merge(
                name: id,
                display_name_en: id.to_s.split('_').map(&:capitalize).join(' ')
              ))
  end

  before(:each) do
    clean_data(Lookup, Location, Agency, Role, UserGroup, User, Child, FormSection)

    @uk = Location.create!(
      location_code: 'GBR',
      name: 'United Kingdom',
      placename: 'United Kingdom',
      type: 'Country',
      hierarchy_path: 'GBR',
      admin_level: 0
    )
    @england = Location.create!(
      location_code: '01',
      name: 'England',
      placename: 'England',
      type: 'Region',
      hierarchy_path: 'GBR.01',
      admin_level: 1
    )
    @london = Location.create!(
      location_code: '41',
      name: 'London',
      placename: 'London',
      type: 'County',
      hierarchy_path: 'GBR.01.41',
      admin_level: 2
    )

    @unicef = Agency.create!(agency_code: 'UNICEF', name: 'UNICEF')
    @gbv_manager = Role.create!(name: 'GBV Manager', permissions: [
                                  Permission.new(
                                    resource: Permission::KPI,
                                    actions: Permission::RESOURCE_ACTIONS[Permission::KPI]
                                  )
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

  describe 'GET /api/v2/kpis/number_of_cases', search: true do
    with 'a valid active case' do
      it 'should show one case in the last month in London' do
        Child.new_with_user(@primero_kpi, {}).save!
        Sunspot.commit

        sign_in(@primero_kpi)

        get '/api/v2/kpis/number_of_cases', params: {
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
end
