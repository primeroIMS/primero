require 'rails_helper'

describe Api::V2::KeyPerformanceIndicatorsController, type: :request do
  describe 'GET /api/v2/key_performance_indicators/number_of_cases' do
    it 'renders test data appropriately' do
      login_for_test

      get '/api/v2/key_performance_indicators/number_of_cases'

      expect(response).to have_http_status(200)
    end
  end
end
