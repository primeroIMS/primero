# frozen_string_literal: true

require 'rails_helper'

describe AssociatedRecordsService do
  describe 'update user_groups if update_user_groups is true', search: true do
    before do
      clean_data(User, Role, Agency, UserGroup, Child, Incident)
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
      @incident1 = Incident.new_with_user(@current_user, short_id: 'a1b2c3',
                                                         assigned_user_names: [@associated_user.user_name])
      [@child1, @child2, @child3, @incident1].each(&:save!)
    end

    it 'should update the associated_user_groups of the records' do
      @associated_user.user_groups = [@group2]
      @associated_user.save(validate: false)

      AssociatedRecordsService.new(
        user: @associated_user, update_user_groups: true, models: [Child, Incident]
      ).update_associated_records

      expect(@child1.reload.associated_user_groups).to include(@group1.unique_id, @group2.unique_id)
      expect(@child2.reload.associated_user_groups).to include(@group1.unique_id, @group2.unique_id)
      expect(@child3.reload.associated_user_groups).to include(@group1.unique_id)
      expect(@incident1.reload.associated_user_groups).to include(@group1.unique_id, @group2.unique_id)
    end

    after do
      clean_data(User, Role, Agency, UserGroup, Child, Incident)
    end
  end

  describe 'update agencies in the cases where the user is assigned', search: true do
    before do
      clean_data(User, Role, Agency, UserGroup, Child, Incident)
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
    end

    it 'should update the associated_user_agencies of the records' do
      @associated_user.agency = @agency2
      @associated_user.save(validate: false)

      AssociatedRecordsService.new(
        user: @associated_user, update_agencies: true, models: [Child]
      ).update_associated_records

      expect(@child1.reload.associated_user_agencies).to include(@agency1.unique_id, @agency2.unique_id)
      expect(@child2.reload.associated_user_agencies).to include(@agency1.unique_id, @agency2.unique_id)
      expect(@child3.reload.associated_user_agencies).to include(@agency1.unique_id)
    end

    after do
      clean_data(User, Role, Agency, UserGroup, Child, Incident)
    end
  end

  # TODO: Move this all to user_spec
  context 'Family' do
    before :each do
      clean_data(User, Role, Agency, UserGroup, Child, Family)
    end

    let!(:agency1) { Agency.create!(name: 'Agency 1', agency_code: 'agency1') }
    let!(:agency2) { Agency.create!(name: 'Agency 2', agency_code: 'agency2') }
    let!(:group1) { UserGroup.create!(name: 'group 1') }
    let!(:group2) { UserGroup.create!(name: 'group 2') }
    let!(:caseworker) do
      u = User.new(
        full_name: 'User Test', user_name: 'user_test', password: 'a12345678',
        password_confirmation: 'a12345678', email: 'user_test@localhost.com',
        agency_id: agency1.id, role: @role_admin, user_groups: [group1]
      )
      u.save(validate: false) && u
    end

    describe 'Caseworker who is the Family record owner' do
      let!(:family) do
        f = Family.new_with_user(caseworker, name: 'Family 1')
        f.save! && f
      end
      example 'agency change associates the new agency with the record' do
        caseworker.agency = agency2
        caseworker.save(validate: false)

        AssociatedRecordsService.new(
          user: caseworker, update_agencies: true, models: [Child, Incident, Family]
        ).update_associated_records

        expect(family.reload.associated_user_agencies).to match([agency2.unique_id])
      end

      example 'user group change associates the new user group with the record' do
        caseworker.user_groups = [group2]
        caseworker.save(validate: false)

        AssociatedRecordsService.new(
          user: caseworker, update_user_groups: true, models: [Child, Incident, Family]
        ).update_associated_records

        expect(family.reload.associated_user_groups).to match([group2.unique_id])
      end
    end

    describe 'Caseworker who is assigned/referred the family but is not the record owner' do
      let!(:group3) { UserGroup.create!(name: 'group 3') }
      let!(:caseworker2) do
        u = User.new(
          full_name: 'User Test 2', user_name: 'user_test2', password: 'a12345678',
          password_confirmation: 'a12345678', email: 'user_test2@localhost.com',
          agency_id: agency1.id, role: @role_admin, user_groups: [group2]
        )
        u.save(validate: false) && u
      end
      let!(:family) do
        x = Family.new_with_user(caseworker, name: 'Family 1')
        x.save! && x
      end
      let!(:case_with_family) do
        x = Child.new_with_user(caseworker2, name: 'Case with Family 1')
        x.family = family
        x.save! && x
      end

      example 'user group change associates the new user group and removes the old' do
        caseworker2.user_groups = [group3]
        caseworker2.save(validate: false)

        AssociatedRecordsService.new(
          user: caseworker2, update_user_groups: true, models: [Child, Incident, Family]
        ).update_associated_records

        expect(family.reload.associated_user_groups).to match([group1.unique_id, group3.unique_id])
      end
    end
  end
end
