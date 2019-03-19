require 'rails_helper'

def stub_out_saved_search_get(mock_saved_search = double(SavedSearch))
  SavedSearch.should_receive(:find_by_id).with(anything).and_return( mock_saved_search )
  mock_saved_search
end

describe SavedSearchesController, :type => :controller do
  before :each do
    SavedSearch.all.each(&:destroy)
    SavedSearch.any_instance.stub(:permitted_properties).and_return(SavedSearch.attribute_names)
    @user = User.new(:user_name => 'zuul')
    @session = fake_admin_login @user
  end

  def mock_saved_search(stubs={})
    @mock_saved_search ||= mock_model(SavedSearch, stubs).as_null_object
  end

  describe '#authorizations' do
    describe 'collection' do
      before do
        Ability.any_instance.stub(:can?).with(anything, SavedSearch).and_return(false)
      end

      it "GET index" do
        get :index
        expect(response).to be_forbidden
      end

      it "POST create" do
        @controller.current_ability.should_receive(:can?).with(:create, SavedSearch).and_return(false)
        post :create
        response.status.should == 403
      end
    end

    describe 'member' do
      it "GET show" do
        @controller.current_ability.should_receive(:can?).with(:read, @saved_search_arg).and_return(false)
        get :show, params: {:id => '123123123'}
        response.status.should == 403
      end

      it "GET destroy" do
        @controller.current_ability.should_receive(:can?).with(:write, @saved_search_arg).and_return(false)
        get :destroy, params: {:id => '123123123'}
        response.status.should == 403
      end
    end
  end

  describe 'GET' do
    context 'delete' do
      it 'deletes a saved search' do
        @request.env['HTTP_REFERER'] = '/'
        saved_search = SavedSearch.create!(name: 'saved_search_delete', user_name: 'zuul')
        expect(SavedSearch.find_by_id(saved_search.id)).to be_present
        delete(:destroy, params: {id: saved_search.id})
        response.status.should_not == 403
        expect(SavedSearch.find_by_id(saved_search.id)).not_to be_present
      end
    end
  end
end
