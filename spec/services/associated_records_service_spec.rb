# frozen_string_literal: true

require 'rails_helper'

describe AssociatedRecordsService do
  describe 'update user_groups if update_user_groups is true', search: true do
    before do
      clean_data(User, Role, Agency, UserGroup, Child)
      @agency1 = Agency.create!(name: 'Agency 1', agency_code: 'agency1')
      @agency2 = Agency.create!(name: 'Agency 2', agency_code: 'agency2')
      @group1 = UserGroup.create!(name: 'group 1')
      @group2 = UserGroup.create!(name: 'group 2')
      @associated_user = User.new(
        full_name: 'User Test', user_name: 'user_test', password: 'a12345678',
        password_confirmation: 'a12345678', email: 'user_test@localhost.com',
        agency_id: @agency1.id, role: @role_admin, user_groups: [@group1]
      )
      @associated_user.save(validate: false)
      @current_user = User.new(
        full_name: 'Admin User', user_name: 'user_admin', password: 'a12345678',
        password_confirmation: 'a12345678', email: 'user_admin@localhost.com',
        agency_id: @agency1.id, role: @role_admin, user_groups: [@group1]
      )
      @current_user.save(validate: false)
      @child1 = Child.new_with_user(@current_user, name: 'Child 1', assigned_user_names: [@associated_user.user_name])
      @child2 = Child.new_with_user(@current_user, name: 'Child 2', assigned_user_names: [@associated_user.user_name])
      @child3 = Child.new_with_user(@current_user, name: 'Child 3')
      [@child1, @child2, @child3].each(&:save!)
      Sunspot.commit
    end

    it 'should update the associated_user_groups of the records' do
      @associated_user.user_groups = [@group2]
      @associated_user.save(validate: false)

      AssociatedRecordsService.new(
        user: @associated_user, update_user_groups: true, model: Child
      ).update_associated_records

      expect(@child1.reload.associated_user_groups).to include(@group1.unique_id, @group2.unique_id)
      expect(@child2.reload.associated_user_groups).to include(@group1.unique_id, @group2.unique_id)
      expect(@child3.reload.associated_user_groups).to include(@group1.unique_id)
    end

    after do
      clean_data(User, Role, Agency, UserGroup, Child)
    end
  end

  describe 'update agencies in the cases where the user is assigned', search: true do
    before do
      clean_data(User, Role, Agency, UserGroup, Child)
      @agency1 = Agency.create!(name: 'Agency 1', agency_code: 'agency1')
      @agency2 = Agency.create!(name: 'Agency 2', agency_code: 'agency2')
      @associated_user = User.new(
        full_name: 'User Test', user_name: 'user_test', password: 'a12345678',
        password_confirmation: 'a12345678', email: 'user_test@localhost.com',
        agency: @agency1
      )
      @associated_user.save(validate: false)
      @current_user = User.new(
        full_name: 'Admin User', user_name: 'user_admin', password: 'a12345678',
        password_confirmation: 'a12345678', email: 'user_admin@localhost.com',
        agency: @agency1
      )
      @current_user.save(validate: false)
      @child1 = Child.new_with_user(@current_user, name: 'Child 1', assigned_user_names: [@associated_user.user_name])
      @child2 = Child.new_with_user(@current_user, name: 'Child 2', assigned_user_names: [@associated_user.user_name])
      @child3 = Child.new_with_user(@current_user, name: 'Child 3')
      [@child1, @child2, @child3].each(&:save!)
      Sunspot.commit
    end

    it 'should update the associated_user_agencies of the records' do
      @associated_user.agency = @agency2
      @associated_user.save(validate: false)

      AssociatedRecordsService.new(
        user: @associated_user, update_agencies: true, model: Child
      ).update_associated_records

      expect(@child1.reload.associated_user_agencies).to include(@agency1.unique_id, @agency2.unique_id)
      expect(@child2.reload.associated_user_agencies).to include(@agency1.unique_id, @agency2.unique_id)
      expect(@child3.reload.associated_user_agencies).to include(@agency1.unique_id)
    end

    after do
      clean_data(User, Role, Agency, UserGroup, Child)
    end
  end
end
