# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# This table is used by the native Primero authentication to store the jti claims
# of JWTs that are currently valid.
class AllowlistedJwt < ApplicationRecord
  self.table_name = 'whitelisted_jwts'
end
