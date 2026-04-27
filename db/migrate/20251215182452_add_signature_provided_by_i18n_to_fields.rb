# frozen_string_literal: true

class AddSignatureProvidedByI18nToFields < ActiveRecord::Migration[8.0]
  def change
    add_column :fields, :signature_provided_by_label_i18n, :jsonb
  end
end
