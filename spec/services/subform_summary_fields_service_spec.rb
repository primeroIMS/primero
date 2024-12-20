# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe SubformSummaryFieldsService do
  before :each do
    clean_data(Field, FormSection)
  end

  let(:service) { SubformSummaryFieldsService.new }

  let!(:form_section1) do
    score_section = FormSection.create!(
      unique_id: 'scores_section', parent_form: 'case', name_en: 'Scores', is_nested: true,
      fields: [
        Field.new(name: 'date', type: Field::DATE_FIELD, display_name_en: 'Date'),
        Field.new(name: 'score', type: Field::NUMERIC_FIELD, display_name_en: 'Score')
      ]
    )

    FormSection.create!(
      unique_id: 'form_section1', parent_form: 'case', name_en: 'form_section1',
      fields: [
        Field.new(name: 'name', type: Field::TEXT_FIELD, display_name_en: 'Name'),
        Field.new(name: 'age', type: Field::NUMERIC_FIELD, display_name_en: 'Age'),
        Field.new(name: 'sex', type: Field::SELECT_BOX, display_name_en: 'Sex'),
        Field.new(
          name: 'most_recent_score',
          type: Field::NUMERIC_FIELD,
          display_name_en: 'Most Recent Score',
          subform_summary: {
            subform_field_name: 'scores_section',
            first: {
              field_name: 'score',
              order_by: 'date',
              order: 'asc'
            }
          }
        ),
        Field.new(
          name: 'last_score',
          type: Field::NUMERIC_FIELD,
          display_name_en: 'Last Score',
          visible: false,
          subform_summary: {
            subform_field_name: 'scores_section',
            first: {
              field_name: 'score',
              order_by: 'date',
              order: 'asc'
            }
          }
        ),
        Field.new(name: 'scores_section', display_name_en: 'Scores', type: Field::SUBFORM, subform: score_section)
      ]
    )
  end

  it 'returns all the subform summary fields' do
    summary_fields = SubformSummaryFieldsService.instance.subform_summary_fields('case')

    expect(summary_fields.size).to eq(1)
    expect(summary_fields.map(&:name)).to match_array(%w[most_recent_score])
  end

  describe 'when with_cache?' do
    let(:service) { SubformSummaryFieldsService.new(true) }

    it 'returns all the subform summary fields' do
      summary_fields = SubformSummaryFieldsService.instance.subform_summary_fields('case')

      expect(summary_fields.size).to eq(1)
      expect(summary_fields.map(&:name)).to match_array(%w[most_recent_score])
    end
  end
end
