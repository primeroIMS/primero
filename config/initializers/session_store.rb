# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

Rails.application.reloader.to_prepare do
  ActionDispatch::Session::ActiveRecordStore.session_class = Session
end
native_session_timeout = ActiveRecord::Type::Integer.new.cast(ENV.fetch('PRIMERO_NATIVE_SESSION_TIMEOUT', nil)) || 60
Rails.application.config.native_session_timeout = native_session_timeout

if Rails.configuration.x.idp.use_identity_provider
  Rails.application.config.session_store :disabled
else
  Rails.application.config.session_store :active_record_store,
                                         key: '_app_session',
                                         expire_after: native_session_timeout.minute,
                                         same_site: 'Strict'
  ActiveRecord::SessionStore::Session.serializer = :null
end
