# frozen_string_literal: true

class AddReferralNoteFromProvider < ActiveRecord::Migration[5.2]
  def change
    add_column :transitions, :note_on_referral_from_provider, :text
  end
end
