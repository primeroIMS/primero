# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::IntakeLookupsController, type: :request do
  before do
    clean_data(Lookup)

    @lookup_one = Lookup.create!(
      unique_id: 'lookup-intake-one',
      name_i18n: { en: 'Intake One' },
      lookup_values_i18n: [{ id: 'one', display_text: { en: 'One' } }]
    )
    @lookup_two = Lookup.create!(
      unique_id: 'lookup-intake-two',
      name_i18n: { en: 'Intake Two' },
      lookup_values_i18n: [{ id: 'two', display_text: { en: 'Two' } }]
    )
  end

  after do
    clean_data(Lookup)
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/intakes/:id/lookups' do
    around do |example|
      Rack::Attack.enabled = false
      example.run
    ensure
      Rack::Attack.enabled = true
    end

    it 'returns a paginated public list of lookups' do
      get '/api/v2/intakes/intake-stream/lookups', params: { per: 1 }

      expect(response).to have_http_status(:ok)
      expect(json['data'].size).to eq(1)
      expect(json['data'].first['unique_id']).to be_in([@lookup_one.unique_id, @lookup_two.unique_id])
      expect(json['metadata']).to include('total' => 2, 'per' => 1, 'page' => 1)
    end
  end
end
