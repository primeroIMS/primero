# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe TransferActivityLog do
  before :each do
    clean_data(
      Alert, User, Role, PrimeroModule, PrimeroProgram, FormSection, UserGroup, SavedSearch, Child, RecordHistory
    )

    @program = PrimeroProgram.create!(
      unique_id: 'primeroprogram-primero',
      name: 'Primero',
      description: 'Default Primero Program'
    )

    @form1 = FormSection.create!(name: 'form1')

    @cp = PrimeroModule.create!(
      unique_id: 'primeromodule-cp',
      name: 'CP',
      description: 'Child Protection',
      associated_record_types: %w[case tracing_request incident],
      primero_program: @program,
      form_sections: [@form1]
    )

    @group1 = UserGroup.create!(name: 'Group1')

    @child = Child.create!(
      data: { record_state: true, status: 'open', owned_by: 'foo', last_updated_by: 'bar' }
    )

    RecordHistory.create!(
      record: @child,
      record_changes: {
        transfer_status: { from: Transition::STATUS_INPROGRESS, to: Transition::STATUS_ACCEPTED },
        owned_by: { from: 'foo', to: 'other' }
      },
      datetime: '2021-10-14T14:10:05Z'
    )
    RecordHistory.create!(
      record: @child,
      record_changes: {
        transfer_status: { from: Transition::STATUS_INPROGRESS, to: Transition::STATUS_REJECTED },
        assigned_user_names: { from: %w[foo other], to: ['foo'] }
      },
      datetime: '2021-10-14T13:10:05Z'
    )
  end

  after :each do
    clean_data(
      Alert, User, Role, PrimeroModule, PrimeroProgram, FormSection, UserGroup, SavedSearch, Child, RecordHistory
    )
  end

  it 'returns an empty list if the user does not have an activity_log permission' do
    empty_role = Role.new(permissions: [], primero_modules: [@cp])
    empty_role.save(validate: false)

    user1 = User.new(user_name: 'user1', user_groups: [@group1], location: 'CTY')
    user1.role = empty_role
    user1.save(validate: false)

    expect(TransferActivityLog.list(user1)).to be_empty
  end

  it 'returns the transfer activities for the user' do
    permission = Permission.new(
      resource: Permission::ACTIVITY_LOG, actions: [Permission::TRANSFER]
    )
    role = Role.new(permissions: [permission], primero_modules: [@cp])
    role.save(validate: false)

    foo = User.new(user_name: 'foo', user_groups: [@group1], location: 'CTY')
    foo.role = role
    foo.save(validate: false)

    activities = TransferActivityLog.list(foo)

    expect(activities.size).to eq(2)
    expect(activities.map { |activity| activity.data[:status][:to] }).to eq(
      [Transition::STATUS_ACCEPTED, Transition::STATUS_REJECTED]
    )
  end
end
