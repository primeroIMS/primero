require 'rails_helper'

describe LoggerActions, type: :controller do

  controller(ApplicationController) do
    include LoggerActions

    def model_class
      Child
    end

    def index
      #Stub
    end

    def show
      #Stub
    end

    def edit
      #Stub
    end

    def update
      #Stub
    end

    def new
      #Stub
    end

    def create
      #Stub
    end


  end

  before do
    Role.all.each &:destroy
    @case3 = build :child, :unique_identifier => "1234"
    User.stub(:find_by_user_name).and_return(@user)
    case_permission = Permission.new(resource: Permission::CASE, actions: [Permission::WRITE, Permission::CREATE])
    Role.create(id: 'tester', name: 'tester', permissions_list: [case_permission], group_permission: Permission::GROUP)
    @user = User.new(:user_name => 'test_user', :role_ids => ['tester'])
    @session = fake_login @user
    controller.stub :render
  end

  it 'logs a veiw message' do
    expect(Rails.logger).to receive(:info).with("Viewing case '#{@case3.id}' by user '#{@user.user_name}'")
    get :show, :id => @case3.id
  end

  it 'logs an edit message' do
    expect(Rails.logger).to receive(:info).with("Editing case '#{@case3.id}' by user '#{@user.user_name}'")
    get :edit, :id => @case3.id
  end

  it 'logs an update message' do
    params_child = {"name" => 'update'}
    expect(Rails.logger).to receive(:info).with("Updating case '#{@case3.id}' by user '#{@user.user_name}'")
    put :update, :id => @case3.id, :child => params_child
  end

  it 'does not log a new message' do
    expect(Rails.logger).not_to receive(:info).with(anything)
    get :new
  end

  it 'logs a create message' do
    case1 = build :child, :unique_identifier => "4567"
    expect(Rails.logger).to receive(:info).with("Creating case by user '#{@user.user_name}'")
    post :create, :child => {:unique_identifier => case1.unique_identifier, :base_revision => case1._rev, :name => 'new_name'}
  end

  it 'does not log an index message' do
    expect(Rails.logger).not_to receive(:info).with(anything)
    get :index
  end
end
