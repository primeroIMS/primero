# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
      expect do
        service.validate!('name' => 'Not valid')
      end.to raise_error(Errors::InvalidRecordJson, 'Invalid Record JSON')
    end
  end

  describe '.strong_params' do
    let(:schema) do
      {
        'type' => 'object',
        'properties' => {
          'id' => { 'type' => 'string', 'format' => 'regex', 'pattern' => '\\A[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\z' },
          "status"=>{"type"=>["string", "null"]},
          "name"=>{"type"=>["string", "null"]},
          "age"=>{"type"=>["integer", "null"], "minimum"=>-2147483648, "maximum"=>2147483647},
          "sex"=>{"type"=>["string", "null"]},
          "protection_concerns"=>{"type"=>["array", "null"], "items"=>{"type"=>"string"}},
          "registration_date"=>{"type"=>["date", "string", "null"], "format"=>"date"},
          "family_details_section" => {
            'type' => ['array', 'null'],
            'items' => {
              'type' => 'object',
              'properties' => {
                "relation_name"=>{"type"=>["string", "null"]},
                "relation"=>{"type"=>["string", "null"]},
                "relation_type"=>{"type"=>["string", "null"]},
                "relation_age"=>{"type"=>["integer", "null"], "minimum"=>-2147483648, "maximum"=>2147483647},
                "relation_is_caregiver"=>{"type"=>["boolean"]},
                "_destroy"=>{"type"=>["boolean", "null"]},
                "unique_id"=>{"type"=>"string", "format"=>"regex", "pattern"=>"\\A[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\z"}
              },
              "additionalProperties"=>false}
            }
        },
        'additionalProperties' => false
      }
    end
    let(:service) { RecordJsonValidatorService.new(schema:) }
    let(:strong_params) { service.strong_params }

    it 'converts the json schema into a string parameters hash' do
      expect(strong_params).to include(:id, :status, :name, :age, :sex, :registration_date)
      expect(strong_params).to include({ protection_concerns: [] })
      expect(strong_params).to include(
        { family_details_section: [:relation_name, :relation, :relation_type, :relation_age, :relation_is_caregiver, :_destroy, :unique_id] }
      )
    end
  end
end
