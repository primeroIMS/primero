# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

Rails.application.config.session_store :active_record_store, key: '_app_session', expire_after: 1.hour
ActiveRecord::SessionStore::Session.serializer = :null
