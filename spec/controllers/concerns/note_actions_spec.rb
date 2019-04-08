#TODO: These have been refactored and moved to the ChildController. Fix tests

require 'rails_helper'

describe NoteActions, type: :controller do
  controller(ApplicationController) do
    include RecordActions
    include NoteActions

    def model_class
      Child
    end
  end

  before do
    routes.draw {
      post 'add_note' => 'anonymous#add_note'
    }

    Role.all.each &:destroy
    User.all.each &:destroy
  end

  describe 'add note' do
    context 'as user without permission' do
      before do
        @permission_case_read = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
        Role.create(id: 'no-permission', name: 'No Permission', permissions_list: [@permission_case_read], group_permission: Permission::GROUP)
        @user = User.new(:user_name => 'no_permission_user', :role_ids => ['no-permission'])
        @session = fake_login @user
      end

      it 'does not allow adding a note' do
        post :add_note
        expect(response.status).to eq(403)
      end
    end

    context 'as user with permission' do
      before do
        @permission_case_add_note = Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::ADD_NOTE])
        Role.create(id: 'add_note_permission', name: 'Can Add Note', permissions_list: [@permission_case_add_note], group_permission: Permission::GROUP)
        @notes_user = User.create(user_name: 'note_user', role_ids: ['add_note_permission'], user_group_ids: ['Test2'])
        @session = fake_login @notes_user
        User.stub(:find_by_user_name).and_return(@notes_user)
      end

      context 'passing no ids' do
        it 'does not allow adding a note' do
          post :add_note
          expect(response.status).to eq(403)
        end
      end

      context 'passing ids' do
        before do
          @case1 = Child.create(name: 'Test Case 1', notes_section: [])
        end

        context 'and user does not have access to the record' do
          it 'does not allow adding a note' do
            post :add_note, params: {id: @case1.id, subject: 'test subject', notes: 'test notes'}
            expect(response.status).to eq(403)
          end
        end

        context 'and user has access to the record' do
          before do
            Child.any_instance.stub(:associated_users).and_return([@notes_user])
          end

          #TODO - redirect_to show page is not working in this test... need to investigate
          xit 'adds a note' do
            post :add_note, params: {id: @case1.id, subject: 'test subject', notes: 'test notes'}
            #expect...
          end
        end

      end
    end
  end
end
