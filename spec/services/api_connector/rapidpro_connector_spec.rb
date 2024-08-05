require 'rails_helper'

describe ApiConnector::RapidproConnector do
  let(:connection) { double('connection') }
  let(:connector) do
    c = ApiConnector::RapidproConnector.new
    (c.connection = connection) && c
  end

  describe '.send_message' do
    it 'calls the rapidpro broadcasts endpoint with the desired output' do
      expect(connection).to(
        receive(:post).with('/api/v2/broadcasts.json', { text: 'test message', urns: ['tel:+11234561234'] })
      )
      connector.send_message('tel:+11234561234', 'test message')
    end
  end
end
