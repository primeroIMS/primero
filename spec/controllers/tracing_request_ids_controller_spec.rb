require 'rails_helper'

describe TracingRequestIdsController do

  describe "routing" do
    it "should have a route retrieving all tracing request Id and Rev pairs" do
      {:get => "/tracing_requests-ids"}.should route_to(:controller => "tracing_request_ids", :action => "all")
    end
  end

  describe "get all" do
    before do
      TracingRequest.all.each &:destroy
      User.all.each &:destroy

      @user_1 = create(:user, user_name: 'User_One')
      @user_2 = create(:user, user_name: 'User_Two')
      @user_3 = create(:user, user_name: 'User_Three')

      #IMPORTANT - These DateTime stubs are needed for the last_update_date specs below
      DateTime.stub(:now).and_return(Time.utc(2016, "nov", 11, 0, 0, 0))
      @tracing_request_1 = create(:tracing_request, relation_name: 'c1', owned_by: @user_1.user_name, created_by: @user_1.user_name, marked_for_mobile: true)
      @tracing_request_2 = create(:tracing_request, relation_name: 'c2', owned_by: @user_1.user_name, created_by: @user_1.user_name)

      DateTime.stub(:now).and_return(Time.utc(2016, "sep", 12, 0, 0, 0))
      @tracing_request_3 = create(:tracing_request, relation_name: 'c3', owned_by: @user_2.user_name, created_by: @user_2.user_name, marked_for_mobile: true)

      DateTime.stub(:now).and_return(Time.utc(2016, "nov", 1, 0, 0, 0))
      @tracing_request_4 = create(:tracing_request, relation_name: 'c4', owned_by: @user_2.user_name, created_by: @user_2.user_name)

      DateTime.stub(:now).and_return(Time.utc(2016, "oct", 31, 0, 0, 0))
      @tracing_request_5 = create(:tracing_request, relation_name: 'c5', owned_by: @user_3.user_name, created_by: @user_3.user_name)

      fake_login @user_1
    end

    context 'with all managed users' do
      before do
        @user_1.stub(:managed_user_names).and_return([@user_1.user_name, @user_2.user_name, @user_3.user_name])
      end

      it 'returns all ids and revs' do
        get :all
        expect(response.status).to eq(200)
        ids = JSON.parse(response.body)
        expect(ids).to match_array([{'_id' => @tracing_request_1._id, '_rev' => @tracing_request_1._rev},
                                    {'_id' => @tracing_request_2._id, '_rev' => @tracing_request_2._rev},
                                    {'_id' => @tracing_request_3._id, '_rev' => @tracing_request_3._rev},
                                    {'_id' => @tracing_request_4._id, '_rev' => @tracing_request_4._rev},
                                    {'_id' => @tracing_request_5._id, '_rev' => @tracing_request_5._rev}])
      end

      context 'when passing mobile true' do
        it 'returns ids and revs for all mobile tracing requests' do
          get :all, params: { mobile: 'true' }
          expect(response.status).to eq(200)
          ids = JSON.parse(response.body)
          expect(ids).to match_array([{'_id' => @tracing_request_1._id, '_rev' => @tracing_request_1._rev},
                                       {'_id' => @tracing_request_3._id, '_rev' => @tracing_request_3._rev}])
        end
      end
    end

    context 'with 2 managed users' do
      before do
        @user_1.stub(:managed_user_names).and_return([@user_2.user_name, @user_3.user_name])
      end
      it 'returns all ids and revs for 2 users' do
        get :all
        expect(response.status).to eq(200)
        ids = JSON.parse(response.body)
        expect(ids).to match_array([{'_id' => @tracing_request_3._id, '_rev' => @tracing_request_3._rev},
                                    {'_id' => @tracing_request_4._id, '_rev' => @tracing_request_4._rev},
                                    {'_id' => @tracing_request_5._id, '_rev' => @tracing_request_5._rev}])
      end

      context 'when passing mobile true' do
        it 'returns ids and revs for all mobile tracing requests' do
          get :all, params: { mobile: 'true' }
          expect(response.status).to eq(200)
          ids = JSON.parse(response.body)
          expect(ids).to match_array([{'_id' => @tracing_request_3._id, '_rev' => @tracing_request_3._rev}])
        end
      end
    end

    context 'with 1 managed user' do
      before do
        @user_1.stub(:managed_user_names).and_return([@user_3.user_name])
      end
      it 'returns all ids and revs for 1 user' do
        get :all
        expect(response.status).to eq(200)
        ids = JSON.parse(response.body)
        expect(ids).to match_array([{'_id' => @tracing_request_5._id, '_rev' => @tracing_request_5._rev}])
      end

      context 'who has no mobile tracing requests' do
        context 'when passing mobile true' do
          it 'returns no ids and revs' do
            get :all, params: { mobile: 'true' }
            expect(response.status).to eq(200)
            ids = JSON.parse(response.body)
            expect(ids).to be_empty
          end
        end
      end

    end

    context 'with 0 managed users' do
      before do
        @user_1.stub(:managed_user_names).and_return([])
      end
      it 'returns no ids and revs' do
        get :all
        expect(response.status).to eq(200)
        ids = JSON.parse(response.body)
        expect(ids).to be_empty
      end

      context 'when passing mobile true' do
        it 'returns no ids and revs' do
          get :all, params: { mobile: 'true' }
          expect(response.status).to eq(200)
          ids = JSON.parse(response.body)
          expect(ids).to be_empty
        end
      end
    end

    context 'when passing last_update_date' do
      before do
        @user_1.stub(:managed_user_names).and_return([@user_1.user_name, @user_2.user_name, @user_3.user_name])
      end

      context 'that is less than the oldest record' do
        it 'returns all ids and revs' do
          get :all, params: { last_update: '2016-09-11 00:00:00UTC' }
          expect(response.status).to eq(200)
          ids = JSON.parse(response.body)
          expect(ids).to match_array([{'_id' => @tracing_request_1._id, '_rev' => @tracing_request_1._rev},
                                      {'_id' => @tracing_request_2._id, '_rev' => @tracing_request_2._rev},
                                      {'_id' => @tracing_request_3._id, '_rev' => @tracing_request_3._rev},
                                      {'_id' => @tracing_request_4._id, '_rev' => @tracing_request_4._rev},
                                      {'_id' => @tracing_request_5._id, '_rev' => @tracing_request_5._rev}])
        end
      end

      context 'that is greater than the newest record' do
        it 'returns no ids and revs' do
          get :all, params: { last_update: '2016-11-11 01:00:00UTC' }
          expect(response.status).to eq(200)
          ids = JSON.parse(response.body)
          expect(ids).to be_empty
        end
      end

      context 'that is greater than the oldest record and less than the newest record' do
        it 'returns some ids and revs' do
          get :all, params: { last_update: '2016-10-31 00:00:00UTC' }
          expect(response.status).to eq(200)
          ids = JSON.parse(response.body)
          expect(ids).to match_array([{'_id' => @tracing_request_1._id, '_rev' => @tracing_request_1._rev},
                                      {'_id' => @tracing_request_2._id, '_rev' => @tracing_request_2._rev},
                                      {'_id' => @tracing_request_4._id, '_rev' => @tracing_request_4._rev}])
        end
      end
    end
  end
end
