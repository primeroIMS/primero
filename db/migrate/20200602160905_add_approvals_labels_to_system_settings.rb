# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class AddApprovalsLabelsToSystemSettings < ActiveRecord::Migration[5.2]
  def change
    add_column :system_settings, :approvals_labels_i18n, :jsonb
  end
end
