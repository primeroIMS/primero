require 'rails_helper'

describe AuditLogsController do
  before do
    SystemSettings.all.each &:destroy
    SystemSettings.create(default_locale: "en",
                          primary_age_range: "primary", age_ranges: {"primary" => [1..2,3..4]})
  end

  context 'when user has permission' do
    before do
      fake_login_as(Permission::AUDIT_LOG, [Permission::MANAGE])
    end

    describe "GET #index" do
      subject { get :index }

      it "renders the index template" do
        expect(subject).to render_template(:index)
        expect(subject).to render_template("index")
        expect(subject).to render_template("audit_logs/index")
      end

      it "does not render a different template" do
        expect(subject).to_not render_template("audit_logs/show")
      end

      context 'when there are audit logs' do
        before do
          AuditLog.all.each(&:destroy)
          DateTime.stub(:now).and_return(3.days.ago)
          @audit_log1 = AuditLog.create!(user_name: 'tester_one', action_name: 'create', record_id: 111, record_type: 'case')
          DateTime.stub(:now).and_return(2.days.ago)
          @audit_log2 = AuditLog.create!(user_name: 'tester_two', action_name: 'update', record_id: 222, record_type: 'incident')
          DateTime.stub(:now).and_return(1.day.ago)
          @audit_log3 = AuditLog.create!(user_name: 'tester_three', action_name: 'destroy', record_id: 333, record_type: 'tracing_request')
        end
        it "assign all audit logs to the view, ordered by the newest first" do
          get :index
          expect(assigns(:audit_logs)).to eq([@audit_log3, @audit_log2, @audit_log1])
        end
      end
    end
  end

  context 'when user does not have permission' do
    before do
      fake_login_as(Permission::CASE, [Permission::MANAGE])
    end

    describe "GET #index" do
      subject { get :index }

      it "does not render the index template" do
        expect(subject).to_not render_template(:index)
        expect(response.code).to eq("403")
      end

      it "does not render a different template" do
        expect(subject).to_not render_template("audit_logs/show")
      end
    end
  end
end
