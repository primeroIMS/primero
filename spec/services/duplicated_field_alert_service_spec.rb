# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
# frozen_string_literal: true

require 'rails_helper'

describe DuplicatedFieldAlertService do
  before :each do
    clean_data(Alert, Child)

    @child1 = Child.create!(data: { id_field: '0001' })
    @child2 = Child.create!(data: { id_field: '0001' })
    @child3 = Child.create!(data: { id_field: '0001' })
    @child4 = Child.create!(data: { id_field: '0002' })
    @child5 = Child.create!(data: { id_field: '0003' })
    @child6 = Child.create!(data: { id_field: '0002' })
  end

  describe 'duplicate_records' do
    it 'returns the records where the field value is duplicated' do
      expect(
        DuplicatedFieldAlertService.duplicate_records(@child1, 'id_field').ids
      ).to match_array([@child2.id, @child3.id])
    end

    it 'returns empty if there are no duplicated records' do
      expect(DuplicatedFieldAlertService.duplicate_records(@child5, 'id_field').ids).to be_empty
    end
  end

  describe 'duplicates_field' do
    it 'returns true if there are duplicated records' do
      expect(DuplicatedFieldAlertService.duplicates_field?(@child1, 'id_field')).to eq(true)
    end

    it 'returns false if there are no duplicated records' do
      expect(DuplicatedFieldAlertService.duplicates_field?(@child5, 'id_field')).to eq(false)
    end
  end

  describe 'duplicate_alerts' do
    before :each do
      @alert1 = Alert.create!(alert_for: DuplicateIdAlertable::DUPLICATE_FIELD, type: 'id_field', record: @child2)
    end

    it 'returns alerts for duplicated records' do
      expect(DuplicatedFieldAlertService.duplicate_alert(@child3, 'id_field').id).to eq(@alert1.id)
    end

    it 'returns nil if no duplicate field alerts were found' do
      expect(DuplicatedFieldAlertService.duplicate_alert(@child5, 'id_field')).to be_nil
    end
  end

  describe 'create_or_remove_alerts!' do
    it 'generate alerts for the duplicated fields in the record' do
      DuplicatedFieldAlertService.create_or_remove_alerts!(@child3, { 'id_field' => 'form_1' })

      expect(Alert.includes(:record).where(type: 'id_field').map do |alert|
               alert.record.id
             end).to match_array([@child3.id])
    end

    it 'removes the alert from the record if no longer duplicates the field' do
      Alert.create!(alert_for: DuplicateIdAlertable::DUPLICATE_FIELD, type: 'id_field', record: @child6)

      @child6.data['id_field'] = '0004'

      DuplicatedFieldAlertService.create_or_remove_alerts!(@child6, { 'id_field' => 'form_1' })

      expect(Alert.find_by(record_id: @child6.id)).to be_nil
    end
  end
end
