# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
class AddSignatureProvidedByI18nToFields < ActiveRecord::Migration[8.0]
  def change
    add_column :fields, :signature_provided_by_label_i18n, :jsonb
  end
end
