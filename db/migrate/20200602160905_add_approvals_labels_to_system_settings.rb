# frozen_string_literal: true

class AddApprovalsLabelsToSystemSettings < ActiveRecord::Migration[5.2]
  def change
    add_column :system_settings, :approvals_labels_i18n, :jsonb
  end
end
