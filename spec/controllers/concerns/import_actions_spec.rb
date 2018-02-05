require 'rails_helper'

describe ImportActions, type: :controller do

  controller(ApplicationController) do
    include ImportActions

    def model_class
      Child
    end

    def redirect_to *args
      super(:action => :index, :controller => :home)
    end
  end

  before do
    routes.draw {
      post 'import_file' => 'anonymous#import_file'
    }
  end

  it 'allows imports from users with the import permission' do
    permission_import = Permission.new(resource: Permission::CASE, actions: [Permission::IMPORT])
    Role.create(id: 'importer', name: 'importer', permissions_list: [permission_import], group_permission: Permission::GROUP)

    @user = User.new(:user_name => 'importing_user', :role_ids => ['importer'])
    @session = fake_login @user

    post :import_file
    response.status.should_not == 403
  end

  it 'does not allow imports from users without the import permission' do
    permission_no_import = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
    Role.create(id: 'nonimporter', name: 'nonimporter', permissions_list: [permission_no_import], group_permission: Permission::GROUP)

    @user = User.new(:user_name => 'nonimporting_user', :role_ids => ['nonimporter'])
    @session = fake_login @user

    post :import_file
    response.status.should == 403
  end
end
