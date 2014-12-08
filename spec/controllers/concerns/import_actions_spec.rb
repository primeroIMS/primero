require 'spec_helper'

describe ImportActions, type: :controller do

  controller(ApplicationController) do
    include ImportActions

    def model_class
      Child
    end

    def index
    end
  end

  before do
    routes.draw {
      post 'import_file' => 'anonymous#import_file'
      get '/index' => 'anonymous#index'
    }
  end

  it 'allows imports from users with the import permission' do
    Role.create(:id => 'importer', :name => 'importer', :permissions => [
                                                       Permission::IMPORT,
                                                       Permission::CASE,
                                                       Permission::GROUP,
                                                     ])

    @user = User.new(:user_name => 'importing_user', :role_ids => ['importer'])
    @session = fake_login @user

    post :import_file
    require 'pry'; binding.pry
    response
  end
end
