require 'spec_helper'

describe 'admin/index.html.erb' do

  let(:permissions) { [] }
  let(:user) { stub_model User, :id => 'test_id', :user_name => 'test_user', :permissions => permissions }

  subject do
    controller.stub :current_user => user
    view.stub :current_user => user
    render
  end

  describe 'without permissions' do
    let(:permissions) { [] }
    it { should_not have_tag 'a' }
  end

  # PRIMERO-72
  # Removed System Settings content as part of demo cleanup
  # TODO add test back when functionality is added back
  describe 'with system settings permission' do
    let(:permissions) { [Permission::SYSTEM] }
    xit { should have_link 'Admin Contact Information', :href => edit_contact_information_path(:administrator) }
  end

  # PRIMERO-72
  # Removed System Settings content as part of demo cleanup
  # TODO add test back when functionality is added back
  describe 'with manage forms permisssion' do
    let(:permissions) { [Permission::SYSTEM] }
    xit { should have_link 'Highlight Fields', :href => highlight_fields_path }
  end

  # PRIMERO-72
  # Removed System Settings content as part of demo cleanup
  # TODO add test back when functionality is added back
  describe 'with manage replications permission' do
    let(:permissions) { [Permission::SYSTEM] }
    xit { should have_link 'Manage Server Synchronisation Users', :href => system_users_path }
  end

end
