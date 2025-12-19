# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'rails_helper'

describe 'identity_providers' do
  describe 'use_identity_provider' do
    it 'defaults to false if not defined' do
      expect(Rails.configuration.x.idp.use_identity_provider).to eq(false)
    end
  end
end
