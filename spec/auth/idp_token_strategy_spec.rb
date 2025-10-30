# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe IdpTokenStrategy do
  describe '.authenticate!' do
    it 'passes the strategy on valid JWT token' do
      user = instance_double('User', disabled: false)
      token = instance_double('IdpToken', valid?: true, user:, blacklisted?: false, activate!: nil)
      allow(IdpToken).to receive(:build).and_return(token)

      strategy = IdpTokenStrategy.new({})
      strategy.authenticate!
      expect(strategy.successful?).to be_truthy
    end

    it 'fails the strategy on an invalid JWT token' do
      token = instance_double('IdpToken', valid?: false, user: nil, blacklisted?: false)
      allow(IdpToken).to receive(:build).and_return(token)

      strategy = IdpTokenStrategy.new({})
      strategy.authenticate!
      expect(strategy.successful?).to be_falsey
    end

    it 'fails the strategy on a valid blacklisted JWT token' do
      token = instance_double('IdpToken', valid?: true, user: nil, blacklisted?: true)
      allow(IdpToken).to receive(:build).and_return(token)

      strategy = IdpTokenStrategy.new({})
      strategy.authenticate!
      expect(strategy.successful?).to be_falsey
    end

    it 'fails the strategy for a valid JWT token with no corresponding Primero user' do
      token = instance_double('IdpToken', valid?: true, user: nil, blacklisted?: false)
      allow(IdpToken).to receive(:build).and_return(token)

      strategy = IdpTokenStrategy.new({})
      strategy.authenticate!
      expect(strategy.successful?).to be_falsey
    end

    it 'fails the strategy for a valid JWT token with a corresponding disabled Primero user' do
      user = instance_double('User', disabled: true)
      token = instance_double('IdpToken', valid?: true, user:, blacklisted?: false)
      allow(IdpToken).to receive(:build).and_return(token)

      strategy = IdpTokenStrategy.new({})
      strategy.authenticate!
      expect(strategy.successful?).to be_falsey
    end
  end
end
