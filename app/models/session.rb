# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Override the ActiveRecord::SessionStore::Session.
# This deactivates sessions by removing the Warden user key and marking them as "expired". Expired sessions persist
# in the database. This allows the user to log out during the execution of a long-running request. If that request
# returns a session cookie, the cookie will no longer represent an active session.
# Unfortunately the default ActiveRecord::SessionStore behavior is to recreate sessions that have been deleted if
# its session id is still being used by an ongoing request.
class Session < ActiveRecord::SessionStore::Session
  store_accessor :data, :ip_address, :user_agent
  before_save :ensure_expired

  def destroy
    self.expired = true
    data # This ensures that the ActiveRecord::SessionStore::Session is properly deserialized & loaded
    save!
  end

  def ensure_expired
    return unless expired

    data.delete('warden.user.user.key')
  end

  def self.find_by_session_id(session_id)
    Session.uncached do
      where(session_id:).take
    end
  end

  def self.list_by_user_id(user_id)
    return Session.none unless user_id.present?

    path_query = ActiveRecord::Base.sanitize_sql_array(['(@ == %s)', user_id])

    where("data @? '$.\"warden.user.user.key\" ? #{path_query}'")
  end
end
