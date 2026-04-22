# frozen_string_literal: true

UserGroup.create_or_update!(
  unique_id: 'usergroup-primero-cp',
  name: 'Primero CP',
  description: 'Default Primero User Group for CP'
)

UserGroup.create_or_update!(
  unique_id: 'usergroup-primero-ftr',
  name: 'Primero FTR',
  description: 'Default Primero User Group for FTR'
)

UserGroup.create_or_update!(
  unique_id: 'usergroup-primero-cp-families',
  name: 'Primero CP with Families',
  description: 'Default user group for CP users with Families',
  agency_unique_ids: ['UNICEF']
)
