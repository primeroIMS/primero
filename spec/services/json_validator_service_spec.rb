# frozen_string_literal: true

require 'rails_helper'

describe JsonValidatorService do
  let(:service) { RecordJsonValidatorService.new(schema_supplement: { 'name' => { 'type' => 'object' } }) }

  describe '.valid?' do
    it 'accepts valid hash' do
      expect(service.valid?('name' => { 'en' => 'Agenc1' })).to be_truthy
    end

    it 'does not accept valid value' do
      expect(service.valid?('name' => 'Not valid')).to be_falsey
    end
  end

  describe '.validate!' do
    it 'validate the hash' do
      expect(service.validate!('name' => { 'en' => 'Agenc1' })).to be_nil
    end

    it 'throws an exception when is not valid' do
      expect { service.validate!('name' => 'Not valid') }.to raise_error(Errors::InvalidRecordJson, 'Invalid Record JSON')
    end
  end
end
