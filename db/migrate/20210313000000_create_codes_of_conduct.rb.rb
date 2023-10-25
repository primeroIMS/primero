# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class CreateCodesOfConduct < ActiveRecord::Migration[5.2]
  def change
    create_table :codes_of_conduct do |t|
      t.datetime 'created_on'
      t.string 'created_by'
      t.string 'title'
      t.text 'content'
    end
  end
end
