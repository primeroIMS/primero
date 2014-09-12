require 'spec_helper'

describe RecordFlagController do
  before :each do
    unless example.metadata[:skip_session]
      @user = User.new(:user_name => 'fakeadmin')
      @session = fake_admin_login @user
    end
  end

  def create_record(clazz, user, params = {})
    instance = clazz.new_with_user_name(@user, params)
    instance.save
    instance
  end

  shared_examples_for "Flagging" do
    it "should not flag the record with empty message parameter" do
      post :flag, :id => record.id, :model_class => "#{model.name}", :flag_message => "", :flag_date => ""
      JSON.parse(response.body).should eq({"error" => ["Flags is invalid", "Message Flags: message field is invalid"]})
      record_db = model.get(record.id)
      record_db.flags.count.should eq(0)
      record_db.flag.should eq(false)
    end

    it "should not flag the record with no parameters" do
      post :flag, :id => record.id, :model_class => "#{model.name}"
      JSON.parse(response.body).should eq({"error" => ["Flags is invalid", "Message Flags: message field is invalid"]})
      record_db = model.get(record.id)
      record_db.flags.count.should eq(0)
      record_db.flag.should eq(false)
    end

    it "should not flag the record with invalid date parameter" do
      post :flag, :id => record.id, :model_class => "#{model.name}", :flag_message => "Testing Flag", :flag_date => "21-21-2014"
      JSON.parse(response.body).should eq({"error" => ["Flags is invalid", "Date Flags: date field is invalid"]})
      record_db = model.get(record.id)
      record_db.flags.count.should eq(0)
      record_db.flag.should eq(false)
    end

    it "should return the controller path" do
      path = send("#{model.name.underscore.downcase}_flag_path", record)
      path.should eq(expected_path)
    end

    it "should flag the record with all parameters" do
      post :flag, :id => record.id, :model_class => "#{model.name}", :flag_message => "#{model.name} Testing Flag", :flag_date => "15-Jul-2014"
      JSON.parse(response.body).should eq({"message" => "#{model.name} Testing Flag", "date" => "2014/07/15", "flagged_by" => "#{@user.user_name}"})
      record_db = model.get(record.id)
      record_db.flag.should eq(true)
      flag = record_db.flags.last
      flag.message.should eq("#{model.name} Testing Flag")
      flag.flagged_by.should eq(@user.user_name)
      flag.date.strftime("%Y/%m/%d").should eq("2014/07/15")
    end

    it "should flag the record with empty date parameter" do
      post :flag, :id => record.id, :model_class => "#{model.name}", :flag_message => "#{model.name} Testing Flag", :flag_date => ""
      JSON.parse(response.body).should eq({"message" => "#{model.name} Testing Flag", "date" => "", "flagged_by" => "#{@user.user_name}"})
      record_db = model.get(record.id)
      record_db.flag.should eq(true)
      flag = record_db.flags.last
      flag.message.should eq("#{model.name} Testing Flag")
      flag.flagged_by.should eq(@user.user_name)
      flag.date.should eq("")
    end

    it "should flag the record with no date parameter" do
      post :flag, :id => record.id, :model_class => "#{model.name}", :flag_message => "#{model.name} Testing Flag"
      JSON.parse(response.body).should eq({"message" => "#{model.name} Testing Flag", "date" => nil, "flagged_by" => "#{@user.user_name}"})
      record_db = model.get(record.id)
      record_db.flag.should eq(true)
      flag = record_db.flags.last
      flag.message.should eq("#{model.name} Testing Flag")
      flag.flagged_by.should eq(@user.user_name)
      flag.date.should eq(nil)
    end
  end

  shared_examples_for "Flagging more than one time" do
    it "should add flag the record with flags already" do
      post :flag, :id => record.id, :model_class => "#{model.name}", :flag_message => "#{model.name} Testing Flag 1", :flag_date => "15-Jul-2014"
      JSON.parse(response.body).should eq({"message" => "#{model.name} Testing Flag 1", "date" => "2014/07/15", "flagged_by" => "#{@user.user_name}"})

      post :flag, :id => record.id, :model_class => "#{model.name}", :flag_message => "#{model.name} Testing Flag 2", :flag_date => "16-Jul-2014"
      JSON.parse(response.body).should eq({"message" => "#{model.name} Testing Flag 2", "date" => "2014/07/16", "flagged_by" => "#{@user.user_name}"})

      record_db = model.get(record.id)
      record_db.flag.should eq(true)
      record_db.flags.length.should eq(2)
      flag = record_db.flags.last
      flag.message.should eq("#{model.name} Testing Flag 2")
      flag.flagged_by.should eq(@user.user_name)
      flag.date.strftime("%Y/%m/%d").should eq("2014/07/16")
    end
  end

  shared_examples_for "Unflagging" do
    it "should remove flag from record" do
      record.flags = [Flag.new(:message => "#{model.name} Flag 1"), Flag.new(:message => "#{model.name} Flag 2"), Flag.new(:message => "#{model.name} Flag 3")]
      record.save

      post :unflag, :id => record.id, :model_class => "#{model.name}", :flag_message => "#{model.name} Flag 2", :flag_index => 1
      JSON.parse(response.body).should eq({"message" => "#{model.name} Flag 2", "date" => nil, "flagged_by" => nil})

      record_db = model.get(record.id)
      record_db.flag.should eq(true)
      record_db.flags.length.should eq(2)
      record_db.flags[0].message.should eq("#{model.name} Flag 1")
      record_db.flags[1].message.should eq("#{model.name} Flag 3")
    end

    it "should remove flag from record" do
      record.flags = [Flag.new(:message => "#{model.name} Flag 1"), Flag.new(:message => "#{model.name} Flag 2"), Flag.new(:message => "#{model.name} Flag 3")]
      record.save

      post :unflag, :id => record.id, :model_class => "#{model.name}", :flag_message => "#{model.name} Flag 2", :flag_index => 1
      JSON.parse(response.body).should eq({"message" => "#{model.name} Flag 2", "date" => nil, "flagged_by" => nil})

      post :unflag, :id => record.id, :model_class => "#{model.name}", :flag_message => "#{model.name} Flag 1", :flag_index => 0
      JSON.parse(response.body).should eq({"message" => "#{model.name} Flag 1", "date" => nil, "flagged_by" => nil})

      post :unflag, :id => record.id, :model_class => "#{model.name}", :flag_message => "#{model.name} Flag 3", :flag_index => 0
      JSON.parse(response.body).should eq({"message" => "#{model.name} Flag 3", "date" => nil, "flagged_by" => nil})

      record_db = model.get(record.id)
      record_db.flags.length.should eq(0)
      record_db.flag.should eq(false)
    end

    it "should not remove flag from record wrong index" do
      record.flags = [Flag.new(:message => "#{model.name} Flag 1"), Flag.new(:message => "#{model.name} Flag 2"), Flag.new(:message => "#{model.name} Flag 3")]
      record.save

      post :unflag, :id => record.id, :model_class => "#{model.name}", :flag_message => "#{model.name} Flag 1", :flag_index => 1
      JSON.parse(response.body).should eq({"error" => ["Flags: unable to remove the flag at the position 1"]})

      record_db = model.get(record.id)
      record_db.flag.should eq(true)
      record_db.flags.length.should eq(3)
      record_db.flags[0].message.should eq("#{model.name} Flag 1")
      record_db.flags[1].message.should eq("#{model.name} Flag 2")
      record_db.flags[2].message.should eq("#{model.name} Flag 3")
    end

    it "should return the controller path" do
      path = send("#{model.name.underscore.downcase}_unflag_path", record)
      path.should eq(expected_path)
    end
  end

  describe "Child" do
    before :each do
      @child = create_record(Child, @user)
    end

    it_behaves_like "Flagging" do
      let(:model) { Child }
      let(:expected_path) { "/cases/#{@child.id}/flag" }
      let(:record) { @child }
    end

    it_behaves_like "Flagging more than one time" do
      let(:model) { Child }
      let(:record) { @child }
    end

    it_behaves_like "Unflagging" do
      let(:model) { Child }
      let(:expected_path) { "/cases/#{@child.id}/unflag" }
      let(:record) { @child }
    end
  end

  describe "Incident" do
    before :each do
      @incident = create_record(Incident, @user)
    end

    it_behaves_like "Flagging" do
      let(:model) { Incident }
      let(:expected_path) { "/incidents/#{@incident.id}/flag" }
      let(:record) { @incident }
    end

    it_behaves_like "Flagging more than one time" do
      let(:model) { Incident }
      let(:record) { @incident }
    end

    it_behaves_like "Unflagging" do
      let(:model) { Incident }
      let(:expected_path) { "/incidents/#{@incident.id}/unflag" }
      let(:record) { @incident }
    end
  end

  describe "TracingRequest" do
    before :each do
      @tracing_request = create_record(TracingRequest, @user)
    end

    it_behaves_like "Flagging" do
      let(:model) { TracingRequest }
      let(:expected_path) { "/tracing_requests/#{@tracing_request.id}/flag" }
      let(:record) { @tracing_request }
    end

    it_behaves_like "Flagging more than one time" do
      let(:model) { TracingRequest }
      let(:record) { @tracing_request }
    end

    it_behaves_like "Unflagging" do
      let(:model) { TracingRequest }
      let(:expected_path) { "/tracing_requests/#{@tracing_request.id}/unflag" }
      let(:record) { @tracing_request }
    end
  end
end
