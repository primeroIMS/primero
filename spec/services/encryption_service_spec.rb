# frozen_string_literal: true

require 'rails_helper'

describe EncryptionService do
  context 'valid secret key' do
    let(:service) do
      allow(ENV).to receive(:fetch)
      allow(ENV).to receive(:fetch).with('PRIMERO_MESSAGE_SECRET').and_return('aVnNTxSI1EZmiG1dW6Z_I9fbQCbZB3Po')
      EncryptionService.clone
    end

    it 'will encrypt a secret' do
      # Not testing actual encryption here!
      text = 'This is a secret thing'
      ciphertext = service.encrypt(text)
      expect(ciphertext).not_to eq(text)
    end

    it 'will decrypt a secret it encrypted before with the same key' do
      text = 'This is a secret thing'
      ciphertext = service.encrypt(text)
      expect(service.decrypt(ciphertext)).to eq(text)
    end
  end

  context 'no key defined in the environment' do
    let(:service) do
      EncryptionService.clone
    end

    it 'raises an error on encryption attempt' do
      # TODO: Rspec is not picking up the re-raised Errors::MisconfiguredEncryptionError
      expect { service.encrypt('Some secret') }.to raise_error(KeyError)
    end
  end

  context 'a weak key is defined in the environment' do
    let(:service) do
      allow(ENV).to receive(:[])
      allow(ENV).to receive(:fetch).with('PRIMERO_MESSAGE_SECRET').and_return(':(')
      EncryptionService.clone
    end

    it 'raises an error on encryption attempt' do
      # TODO: Rspec is not picking up the re-raised Errors::MisconfiguredEncryptionError
      expect { service.encrypt('Some secret') }.to raise_error(RbNaCl::LengthError)
    end
  end
end