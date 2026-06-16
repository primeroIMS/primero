# frozen_string_literal: true

class EnablePlpgsqlExtension < ActiveRecord::Migration[8.1]
  def change
    enable_extension 'plpgsql'
  end
end
