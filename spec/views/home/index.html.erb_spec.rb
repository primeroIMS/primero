require 'rails_helper'

describe "home/index.html.erb" do
  it "should display time for notifications in yyyy/mm/dd format for users who do not already exist" do
    mock_password_recovery_request = double("PasswordRecoveryRequest", :user_name =>'mjhasson', :created_at => Time.parse("Jan 31 2011"), :to_param => '123')
    assign(:notifications,[ mock_password_recovery_request ])

    view.stub(:can?).with(:update, User).and_return(true)

    render :template=>'home/_notifications'
    rendered.should be_include("mjhasson at 2011/01/31.")
  end

  it "should display time for notifications in yyyy/mm/dd format for users who do exist" do
    mock_password_recovery_request = double("PasswordRecoveryRequest", :user_name =>'jpretorius', :created_at => Time.parse("Jan 31 2011"), :to_param => '124')
    assign(:notifications, [ mock_password_recovery_request ])

    # to_param is because the CI build is failing when trying to generate named route for this mock object - CG Nov 24 2011
    mock_user = double("user", :user_name => 'jpretorius', :to_param => 'foo')
    User.stub(:find_by_user_name).and_return(mock_user)
    view.stub(:can?).with(:update, User).and_return(true)

    render :template=>'home/_notifications'
    rendered.should be_include("jpretorius")
    rendered.should be_include("at 2011/01/31.")
  end

  describe 'dashboards' do

    before do
      @user = double(User,
        user_name: 'admin_user',
        is_manager?: false,
        admin?: true,
        managed_user_names: [],
        modules: ['primeromodule_cp'],
        permissions: []
      )
      view.stub(:current_user).and_return(@user)
      view.stub(:can?).and_return(false) #TODO: maybe move when we have more tests
    end

    describe 'cases dashboard' do
      before do
        assign(:display_cases_dashboard, true)
      end

      it 'should display the protection concerns dashboard permission indicated' do
        assign(:display_protection_concerns, true)
        render
        expect(rendered).to include('dash_protection_concerns')
      end

      it 'should display the reporting location dashboard when permission indicated' do
        assign(:display_reporting_location, true)
        render
        expect(rendered).to include('dash_reporting_location')
      end

      it 'should display the caseworker dashboard if the user is a case worker and has case permissions' do
        assign(:display_case_worker_dashboard, true)
        render
        expect(rendered).to include('dash_case_worker')
      end

      describe 'matching results dashboard' do
        context 'when user has matching results permission' do
          before do
            assign(:match_stats, {})
            assign(:display_matching_results_dashboard, true)
          end

          it 'displays' do
            render
            expect(rendered).to include('dash_matching_results')
          end
        end

        context 'when user does not have matching results permission' do
          before do
            assign(:display_matching_results_dashboard, false)
          end

          it 'does not display' do
            render
            expect(rendered).not_to include('dash_matching_results')
          end
        end
      end
    end

  end
end
