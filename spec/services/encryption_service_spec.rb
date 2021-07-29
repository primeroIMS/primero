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

    it 'will produce a UTF8 ciphertext string that can be converted to valid JSON' do
      text = 'This is a secret'
      ciphertext = service.encrypt(text)
      expect(ciphertext.to_json).to be
    end

    context "no password it's passed in" do
      it 'will return nil for encrypt method' do
        expect(service.encrypt(nil)).to be_nil
      end

      it 'will return nil for decrypt method' do
        expect(service.decrypt(nil)).to be_nil
      end
    end
  end

  context 'a weak key is defined in the environment' do
    let(:service) do
      allow(ENV).to receive(:[])
      allow(ENV).to receive(:fetch)
      allow(ENV).to receive(:fetch).with('PRIMERO_MESSAGE_SECRET').and_return(':(')
      EncryptionService.clone
    end

    it 'raises an error on encryption attempt' do
      expect { service.encrypt('Some secret') }.to raise_error(Errors::MisconfiguredEncryptionError)
    end
  end
end
