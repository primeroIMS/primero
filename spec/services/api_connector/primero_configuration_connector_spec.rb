# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe ApiConnector::PrimeroConfigurationConnector do
  let(:configuration_hash) do
    {
      'id' => SecureRandom.uuid, 'name' => 'Test', 'description' => 'Test',
      'version' => SecureRandom.uuid, 'primero_version' => 'v2.6.0', 'data' => {}
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
          receive(:post).with('/api/v2/configurations', { data: configuration_hash })
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

  describe '.params' do
    context 'return a structure of params for PrimeroConfiguration' do
      before do
        @configuration_params = configuration_hash.merge({ 'random_key' => 'random_value', 'foo' => 'bar' })
      end

      it 'show params with an expected structure' do
        result = connector.params(configuration)
        expect(result.keys).to match_array([:data])
        expect(result[:data].keys).to match_array(configuration_hash.keys)
      end
    end
  end
end
