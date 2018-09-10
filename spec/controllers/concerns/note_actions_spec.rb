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
        @notes_user = User.create(:user_name => 'note_user', :role_ids => ['add_note_permission'])
        @session = fake_login @notes_user
      end

      context 'passing no ids' do
        it 'returns error no selected records' do
          post :add_note
          expect(response.status).not_to eq(403)
          expect(flash[:notice]).to eq('No records selected')
        end
      end

      context 'passing ids' do
        before do
          User.stub(:find_by_user_name).and_return(@notes_user)
          @case1 = Child.create(:name => 'Test Case 1', :short_id => 'aaa111', :owned_by => @notes_user.user_name, :marked_for_mobile => false, :notes_section => [])
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
