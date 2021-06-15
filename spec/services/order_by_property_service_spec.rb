# frozen_string_literal: true

require 'rails_helper'

describe OrderByPropertyService do
  describe 'build_order_query' do
    it 'should return an order clause for a class with a localized property' do
      expect(OrderByPropertyService.build_order_query(Agency, order_by: 'name', order: 'desc')).to eq(
        'name_i18n ->> \'en\' desc'
      )
    end

    it 'should return a hash if the property is not localized' do
      expect(OrderByPropertyService.build_order_query(Role, order_by: 'name', order: 'asc')).to eq(
        name: :asc
      )
    end

    it 'should default to asc if the order direction is not valid' do
      expect(OrderByPropertyService.build_order_query(Agency, order_by: 'name', order: 'invalid')).to eq(
        'name_i18n ->> \'en\' asc'
      )
    end
  end
end
