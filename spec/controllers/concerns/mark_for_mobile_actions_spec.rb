require 'rails_helper'

describe MarkForMobileActions, type: :controller do
  controller(ApplicationController) do
    include MarkForMobileActions

    def model_class
      Child
    end
  end

  before do
    routes.draw {
      post 'mark_for_mobile' => 'anonymous#mark_for_mobile'
    }

    Role.all.each &:destroy
    User.all.each &:destroy
  end

  describe 'mark for mobile' do
    context 'as user without permission' do
      before do
        @permission_case_read = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
        Role.create(id: 'non-syncable', name: 'non syncable', permissions_list: [@permission_case_read], group_permission: Permission::GROUP)
        @user = User.new(:user_name => 'non_sync_user', :role_ids => ['non-syncable'])
        @session = fake_login @user
      end

      it 'does not allow marking as mobile' do
        post :mark_for_mobile
        expect(response.status).to eq(403)
      end
    end

    context 'as user with permission' do
      before do
        @permission_case_read_sync = Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::SYNC_MOBILE])
        Role.create(id: 'syncable', name: 'non syncable', permissions_list: [@permission_case_read_sync], group_permission: Permission::GROUP)
        @user = User.create(:user_name => 'sync_user', :role_ids => ['syncable'])
        @session = fake_login @user
      end

      context 'passing no ids' do
        it 'returns error no selected records' do
          @expected = {
                  :success => false,
                  :message => 'No records selected'
          }.to_json

          post :mark_for_mobile
          expect(response.body).to eq(@expected)
        end
      end

      context 'passing ids' do
        before do
          User.stub(:find_by_user_name).and_return(@user)
          @case1 = Child.create(:name => 'Test Case 1', :short_id => 'aaa111', :marked_for_mobile => false)
          @case2 = Child.create(:name => 'Test Case 2', :short_id => 'bbb222', :marked_for_mobile => false)
          @case3 = Child.create(:name => 'Test Case 3', :short_id => 'ccc333')
        end

        it 'marks as mobile when 1 id is passed' do
          @expected = {
                  :success => true,
                  :message => 'Case  successfully marked as mobile'
                  #:message => 'Case aaa111 successfully marked as mobile'
          }.to_json

          post :mark_for_mobile, :mobile_value => 'true', :id => @case1.id
          expect(response.body).to eq(@expected)
        end

        it 'marks as mobile when multiple ids are passed' do
          @expected = {
                  :success => true,
                  :message => '2 Record(s) successfully marked as mobile'
          }.to_json

          post :mark_for_mobile, :mobile_value => 'true', :selected_records => [@case1.id, @case2.id].join(',')
          expect(response.body).to eq(@expected)
        end

        it 'unmarks as mobile when 1 id is passed' do
          @expected = {
                  :success => true,
                  :message => 'Case  successfully unmarked as mobile'
                  #:message => 'Case aaa111 successfully marked as mobile'
          }.to_json

          post :mark_for_mobile, :mobile_value => 'false', :id => @case1.id
          expect(response.body).to eq(@expected)
        end

        it 'unmarks as mobile when multiple ids are passed' do
          @expected = {
                  :success => true,
                  :message => '2 Record(s) successfully unmarked as mobile'
          }.to_json

          post :mark_for_mobile, :mobile_value => 'false', :selected_records => [@case1.id, @case2.id].join(',')
          expect(response.body).to eq(@expected)
        end

        it 'marks as mobile when mark_for_mobile attribute does not exist' do
          @expected = {
                  :success => true,
                  :message => '1 Record(s) successfully marked as mobile'
          }.to_json

          post :mark_for_mobile, :mobile_value => 'true', :selected_records => [@case3.id].join(',')
          expect(response.body).to eq(@expected)
        end
      end
    end
  end
end
