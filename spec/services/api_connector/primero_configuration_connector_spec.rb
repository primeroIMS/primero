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

  describe 'When SystemSettings.primero_promote_config is present and ENV are set' do
    before do
      system_settings = instance_double(
        'SystemSettings', primero_promote_config: [
          { tls: 'true', host: 'foo.bar', port: '443',
            basic_auth_secret: 'PRIMERO_PROMOTE_CONFIG_PROD_BASIC_AUTH' }.with_indifferent_access,
          { tls: 'true', host: 'some.url', port: '443', basic_auth_secret: 'RANDOM_ENV' }.with_indifferent_access
        ]
      )
      allow(SystemSettings).to receive(:current).and_return(system_settings)
      stub_const('ENV',
                 ENV.to_hash.merge(
                   {
                     'PRIMERO_PROMOTE_CONFIG_PROD_BASIC_AUTH' => 'random:passwd',
                     'PRIMERO_PROMOTE_CONFIG_PROD_HOST' => 'local.net',
                     'PRIMERO_PROMOTE_CONFIG_PROD_PORT' => '443',
                     'PRIMERO_PROMOTE_CONFIG_PROD_TLS' => 'true'
                   }
                 ))
    end

    describe '.build_connectors' do
      it 'return an array of PrimeroConfigurationConnector' do
        result = ApiConnector::PrimeroConfigurationConnector.build_connectors(prefix: 'PRIMERO_PROMOTE_CONFIG_PROD_')
        expect(result.map(&:class)).to match_array([ApiConnector::PrimeroConfigurationConnector,
                                                    ApiConnector::PrimeroConfigurationConnector])
      end
    end

    describe '.config_connectors' do
      it 'array should include only valid config' do
        result = ApiConnector::PrimeroConfigurationConnector.config_connectors(prefix: 'PRIMERO_PROMOTE_CONFIG_PROD_')
        expect(result.map { |hash| hash['host'] }).not_to include('some.url')
        expect(result.map { |hash| hash['basic_auth'] }).to match_array(['random:passwd', 'random:passwd'])
      end
    end

    describe '.hosts_config' do
      it 'return only host with basic_auth' do
        result = ApiConnector::PrimeroConfigurationConnector.hosts_config(prefix: 'PRIMERO_PROMOTE_CONFIG_PROD_')
        expect(result.map { |hash| hash['host'] }).to match_array(['foo.bar', 'local.net', 'some.url'])
      end
    end

    describe '.config_connector_from_env' do
      it 'return a hash from ENV' do
        result = ApiConnector::PrimeroConfigurationConnector.config_connector_from_env(
          prefix: 'PRIMERO_PROMOTE_CONFIG_PROD_'
        )
        expected_hash = { 'host' => 'local.net', 'tls' => 'true', 'basic_auth' => 'random:passwd', 'port' => '443' }

        expect(result).to contain_exactly(expected_hash)
      end
    end
  end
end
