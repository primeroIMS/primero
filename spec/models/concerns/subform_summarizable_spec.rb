# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe SubformSummarizable do
  let(:score_section) do
    FormSection.create!(
      unique_id: 'score_section',
      parent_form: 'case',
      name: 'Scores',
      fields: [
        Field.create!(name: 'score', display_name: 'Score', type: Field::NUMERIC_FIELD),
        Field.create!(name: 'score_date', display_name: 'Date', type: Field::DATE_FIELD)
      ]
    )
  end

  let(:score_form) do
    FormSection.create!(
      unique_id: 'score_form',
      name: 'Score Form',
      parent_form: 'case',
      form_group_id: 'm',
      fields: [
        Field.new(
          name: 'scores',
          type: 'subform',
          editable: true,
          subform_section: score_section,
          display_name_en: 'Scores',
          subform_sort_by: 'score_date'
        ),
        Field.create!(
          name: 'most_recent_score',
          display_name: 'Most Recent Score',
          type: Field::NUMERIC_FIELD,
          subform_summary: {
            subform_field_name: 'scores',
            first: {
              field_name: 'score',
              order_by: 'score_date',
              order: 'desc'
            }
          }
        )
      ]
    )
  end

  describe 'calculate_summary_fields' do
    before do
      clean_data(Field, FormSection, Child)

      score_form
    end

    it 'stores the most recent score in the parent form' do
      child = Child.create!(
        data: {
          scores: [
            { score: 10, score_date: Date.today - 10.days },
            { score: 15, score_date: Date.today - 5.days }
          ]
        }
      )

      expect(child.data['most_recent_score']).to eq(15)
    end
  end
end
