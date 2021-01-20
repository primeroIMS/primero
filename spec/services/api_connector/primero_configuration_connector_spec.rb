# frozen_string_literal: true

require 'rails_helper'

describe ApiConnector::PrimeroConfigurationConnector do
  let(:configuration_hash) do
    {
      'id' => SecureRandom.uuid, 'name' => 'Test', 'description' => 'Test',
      'version' => SecureRandom.uuid, 'data' => {}
    }
  end
  let(:configuration) { PrimeroConfiguration.new(configuration_hash) }
  let(:connection) { double('connection') }
  let(:connector) do
    c = ApiConnector::PrimeroConfigurationConnector.new
    (c.connection = connection) && c
  end

  describe '.sync' do
    context 'the target server doesnt have this config record' do
      before do
        expect(connection).to(
          receive(:get).with("/api/v2/configurations/#{configuration.id}")
                       .and_return([404, {}])
        )
      end

      it 'creates a new config record' do
        expect(connection).to(
          receive(:post).with('/api/v2/configurations', data: configuration_hash)
                        .and_return([200, {}])
        )
        result = connector.sync(configuration)
        expect(result[:status]).to eq(200)
      end
    end

    context 'the target server already has this config record' do
      before do
        expect(connection).to(
          receive(:get).with("/api/v2/configurations/#{configuration.id}")
                       .and_return([200, {}])
        )
      end

      it 'does nothing' do
        result = connector.sync(configuration)
        expect(result).to eq({})
      end
    end
  end
end
