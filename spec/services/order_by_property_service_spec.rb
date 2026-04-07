# frozen_string_literal: true

require 'rails_helper'

describe OrderByPropertyService do
  describe 'build_order_query' do
    it 'should return an order clause for a class with a localized property' do
      expect(OrderByPropertyService.build_order_query(Agency, order_by: 'name', order: 'desc')).to eq(
        'LOWER(name_i18n ->> \'en\') desc'
      )
    end

    it 'should return an Arel query if the property is not localized but it is case insensitive' do
      expect(OrderByPropertyService.build_order_query(Role, order_by: 'name', order: 'asc').to_sql).to eq(
        'LOWER("roles"."name") ASC'
      )
    end

    it 'should return a hash if the property is not localized ant is not case insensitive' do
      expect(OrderByPropertyService.build_order_query(Role, order_by: 'unique_id', order: 'asc')).to eq(
        'unique_id' => 'asc'
      )
    end

    it 'should default to asc if the order direction is not valid' do
      expect(OrderByPropertyService.build_order_query(Agency, order_by: 'name', order: 'invalid')).to eq(
        'LOWER(name_i18n ->> \'en\') asc'
      )
    end
  end
end
