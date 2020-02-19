# frozen_string_literal: true

class CreateAttachments < ActiveRecord::Migration[5.2]
  def change
    drop_table :attachment_images, if_exists: true
    drop_table :attachment_audios, if_exists: true
    drop_table :attachment_documents, if_exists: true

    create_table :attachments do |t|
      t.string     :attachment_type
      t.references :record, polymorphic: true, type: :uuid
      t.string     :field_name, index: true
      t.string     :description
      t.date       :date
      t.string     :comments
      t.boolean    :is_current, null: false, default: false
      t.jsonb      :metadata
    end
  end
end