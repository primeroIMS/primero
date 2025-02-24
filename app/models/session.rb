# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Model for Session
class Session < ActiveRecord::SessionStore::Session
  store_accessor :data, :ip_address, :user_agent

  def self.find_by_user_id(user_id)
    where("(data #>> '{warden.user.user.key, 0, 0}')::int = ?", user_id)
  end
end
