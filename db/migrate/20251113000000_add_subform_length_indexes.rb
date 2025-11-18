# frozen_string_literal: true

class AddSubformLengthIndexes < ActiveRecord::Migration[6.1]
  def change
    execute <<~SQL
      CREATE INDEX cases_services_section_length ON CASES (JSONB_ARRAY_LENGTH(data->'services_section'))
      WHERE JSONB_ARRAY_LENGTH(data->'services_section') > 0;

      CREATE INDEX cases_followup_subform_section_length ON CASES (JSONB_ARRAY_LENGTH(data->'followup_subform_section'))
      WHERE JSONB_ARRAY_LENGTH(data->'followup_subform_section') > 0;
    SQL
  end
end
