# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'rails_helper'

describe Search::SearchQuery do
  let(:record_class) { Child }

  describe '#build' do
    context 'when skip_attachments is false' do
      it 'loads all default relationships including attachments' do
        search_query = described_class.new(record_class)
        result = search_query.build(false)

        includes_values = result.includes_values
        expect(includes_values).to include(:alerts, :active_flags)
        expect(includes_values.any? { |v| v.is_a?(Hash) && v.key?(:attachments) }).to be true
        expect(includes_values.any? { |v| v.is_a?(Hash) && v.key?(:current_photos) }).to be true
      end
    end

    context 'when skip_attachments is true' do
      it 'only loads alerts and active_flags' do
        search_query = described_class.new(record_class)
        result = search_query.build(true)

        includes_values = result.includes_values
        expect(includes_values).to contain_exactly(:alerts, :active_flags)
        expect(includes_values.any? { |v| v.is_a?(Hash) && v.key?(:attachments) }).to be false
        expect(includes_values.any? { |v| v.is_a?(Hash) && v.key?(:current_photos) }).to be false
      end
    end

    context 'when skip_attachments is not provided' do
      it 'defaults to loading all relationships' do
        search_query = described_class.new(record_class)
        result = search_query.build

        includes_values = result.includes_values
        expect(includes_values).to include(:alerts, :active_flags)
        expect(includes_values.any? { |v| v.is_a?(Hash) && v.key?(:attachments) }).to be true
      end
    end

    context 'with filters applied' do
      it 'applies filters correctly when skip_attachments is true' do
        filter = SearchFilters::TextValue.new(field_name: 'sex', value: 'female')
        search_query = described_class.new(record_class)
        search_query.with_filters([filter])
        result = search_query.build(true)

        includes_values = result.includes_values
        expect(includes_values).to contain_exactly(:alerts, :active_flags)
        expect(result.where_clause.send(:predicates)).not_to be_empty
      end
    end
  end
end
