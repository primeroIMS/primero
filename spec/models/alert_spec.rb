# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Alert do
  describe 'duplicate alerts' do
    before :each do
      clean_data(Alert, Child)

      @child1 = Child.create!(data: { field_id: '0001' })
      @child2 = Child.create!(data: { field_id: '0001' })
      @child3 = Child.create!(data: { field_id: '0002' })
      Alert.create!(alert_for: DuplicateIdAlertable::DUPLICATE_FIELD, type: 'field_id', record: @child1)
      Alert.create!(alert_for: DuplicateIdAlertable::DUPLICATE_FIELD, type: 'field_id', record: @child3)
    end

    it 'remove duplicate alerts for records with the same value' do
      Alert.create!(alert_for: DuplicateIdAlertable::DUPLICATE_FIELD, type: 'field_id', record: @child2)

      expect(Alert.count).to eq(2)
      expect(Alert.all.map { |alert| alert.record.id }).to match_array([@child2.id, @child3.id])
    end
  end
end
