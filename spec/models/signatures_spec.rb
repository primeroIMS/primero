# frozen_string_literal: true

# Copyright (c) 2025 UNICEF. All rights reserved.

require 'rails_helper'

describe Signature do
  let(:user) { fake_user(user_name: 'test_user') }

  let(:child) do
    child = Child.new_with_user(user, name: 'Test Child')
    child.save! && child
  end

  describe '.new_with_user' do
    it 'creates a signature with the user name' do
      signature = Signature.new_with_user(
        user,
        record: child,
        field_name: 'signature',
        attachment_type: Signature::IMAGE,
        file_name: 'signature.jpg'
      )

      expect(signature.signature_created_by_user).to eq('test_user')
    end

    it 'passes params correctly to the new signature' do
      signature = Signature.new_with_user(
        user,
        record: child,
        field_name: 'consent_signature',
        attachment_type: Signature::IMAGE,
        file_name: 'consent.jpg'
      )

      expect(signature.record).to eq(child)
      expect(signature.field_name).to eq('consent_signature')
      expect(signature.file_name).to eq('consent.jpg')
    end
  end

  describe '#set_signature_metadata' do
    let(:signature) do
      Signature.new(
        record: child,
        field_name: 'signature',
        attachment_type: Signature::IMAGE,
        file_name: 'test_signature.jpg',
        attachment: attachment_base64('jorge.jpg')
      )
    end

    before do
      signature.attach!
    end

    it 'sets signature_provided_on to today\'s date' do
      expect(signature.signature_provided_on).to eq(Date.today)
    end

    it 'sets consent_provided to true' do
      expect(signature.consent_provided).to be true
    end
  end

  describe '#to_h_api' do
    let(:signature) do
      Signature.new_with_user(
        user,
        record: child,
        field_name: 'signature',
        attachment_type: Signature::IMAGE,
        file_name: 'test_signature.jpg',
        attachment: attachment_base64('jorge.jpg')
      )
    end

    before do
      signature.signature_provided_by = 'John Doe'
      signature.attach!
    end

    it 'returns a hash with expected keys' do
      hash = signature.to_h_api

      expect(hash).to include(:id, :field_name, :file_name, :signature_provided_on,
                              :signature_provided_by, :signature_created_by_user,
                              :attachment_url, :content_type)
    end

    it 'includes the correct values' do
      hash = signature.to_h_api

      expect(hash[:field_name]).to eq('signature')
      expect(hash[:file_name]).to eq('test_signature.jpg')
      expect(hash[:signature_provided_by]).to eq('John Doe')
      expect(hash[:signature_created_by_user]).to eq('test_user')
      expect(hash[:signature_provided_on]).to eq(Date.today)
    end
  end

  after(:each) do
    clean_data(Child, Signature, User)
  end
end
