# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Model for Session
class Session < ActiveRecord::SessionStore::Session
  store_accessor :data, :ip_address, :user_agent

  def self.list_by_user_id(user_id)
    return Session.none unless user_id.present?

    path_query = ActiveRecord::Base.sanitize_sql_array(['(@ == %s)', user_id])

    where("data @? '$.\"warden.user.user.key\" ? #{path_query}'")
  end
end
