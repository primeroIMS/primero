# frozen_string_literal: true

require 'rails_helper'

describe ConfigYamlLoader do
  describe '.exclude_unsubstituted_envvars' do
    it 'compacts away any unsubstituted environment variables in a hash' do
      unsubstituted = {
        hash: {
          a: 'a',
          b: '$B'
        },
        array: [1, 2, '$THREE'],
        c: 'c',
        d: '$D'
      }
      compacted = {
        hash: { a: 'a' },
        array: [1, 2],
        c: 'c'
      }
      expect(ConfigYamlLoader.exclude_unsubstituted_envvars(unsubstituted)).to eq(compacted)
    end
  end

  describe '.load' do
    it 'loads a hash from a valid yaml and discards unsubsututed values' do
      compacted = {
        delivery_method: 'smtp',
        smtp_conf: {
          address: 'test.sample.com',
          port: 25,
          domain: 'test.primero.org'
        },
        notifications: {
          host: 'test.primero.org'
        },
        default_options: {
          from: 'notifier@test.primero.org'
        }
      }
      expect(ConfigYamlLoader.load(Rails.root.join('spec', 'resources', 'mailers.yml'))).to eq(compacted)
    end
  end
end
