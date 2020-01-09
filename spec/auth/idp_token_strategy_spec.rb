require 'rails_helper'

describe IdpTokenStrategy do

  describe '.authenticate!' do

    it 'passes the strategy on valid JWT token' do
      user = double('User')
      token = instance_double('IdpToken', valid?: true, user: user)
      allow(IdpToken).to receive(:build).and_return(token)

      strategy = IdpTokenStrategy.new({})
      strategy.authenticate!
      expect(strategy.successful?).to be_truthy
    end

    it 'fails the strategy on an invalid JWT token' do
      token = instance_double('IdpToken', valid?: false, user: nil)
      allow(IdpToken).to receive(:build).and_return(token)

      strategy = IdpTokenStrategy.new({})
      strategy.authenticate!
      expect(strategy.successful?).to be_falsey
    end

    it 'fails the strategy for a valid JWT token with no corresponding Primero user' do
      token = instance_double('IdpToken', valid?: true, user: nil)
      allow(IdpToken).to receive(:build).and_return(token)

      strategy = IdpTokenStrategy.new({})
      strategy.authenticate!
      expect(strategy.successful?).to be_falsey
    end

  end

end