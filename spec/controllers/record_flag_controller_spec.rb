require 'rails_helper'

describe RecordFlagController, :type => :controller do
  before :all do
    @created_at = DateTime.now
    @unflagged_at = @created_at
  end

  before :each do |example|
    Incident.any_instance.stub(:field_definitions).and_return([])
    TracingRequest.any_instance.stub(:field_definitions).and_return([])
    FormSection.all.all.each { |form| form.destroy }
    fields = [
        Field.new({"name" => "child_status",
                   "type" => "text_field",
                   "display_name_all" => "Child Status"
                  })]
    form = FormSection.new(
      :unique_id => "form_section_test",
      :parent_form=>"case",
      "visible" => true,
      :order_form_group => 50,
      :order => 15,
      :order_subform => 0,
      :form_group_name => "Form Section Test",
      "editable" => true,
      "name_all" => "Form Section Test",
      "description_all" => "Form Section Test",
      :fields => fields
        )
    form.save!
    Child.any_instance.stub(:field_definitions).and_return(fields)
    Child.refresh_form_properties

    unless example.metadata[:skip_session]
      @user = User.new(:user_name => 'fakeadmin')
      @session = fake_admin_login @user
      User.stub(:find_by_user_name).and_return(@user)
    end

    @date_time = DateTime.parse("2015/10/23 14:54:55 -0400").strftime("%Y/%m/%d %H:%M:%S %z")
    Clock.stub(:now).and_return(@date_time)
    DateTime.stub(:now).and_return(@created_at)
  end

  after :each do
    Child.remove_form_properties
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

    it "should return the controller path" do
      path = send("#{model.name.underscore.downcase}_flag_path", record)
      path.should eq(expected_path)
    end

    it "should flag the record with all parameters" do
      post :flag, :id => record.id, :model_class => "#{model.name}", :flag_message => "#{model.name} Testing Flag", :flag_date => "15-Jul-2014"
      JSON.parse(response.body).except('unique_id').except('id').should eq({"message" => "#{model.name} Testing Flag", "date" => "2014/07/15",
        "flagged_by" => "#{@user.user_name}", "removed" => nil,
        "created_at"=> DateTime.now.strftime('%Y/%m/%d %H:%M:%S %z'), "system_generated_followup"=>false,
        "unflag_message" => nil, "unflagged_by" => nil, "unflagged_date" => nil})
      record_db = model.get(record.id)
      record_db.flag.should eq(true)
      flag = record_db.flags.last
      flag.message.should eq("#{model.name} Testing Flag")
      flag.flagged_by.should eq(@user.user_name)
      flag.date.strftime("%Y/%m/%d").should eq("2014/07/15")
    end

    it "should flag the record with empty date parameter" do
      post :flag, :id => record.id, :model_class => "#{model.name}", :flag_message => "#{model.name} Testing Flag", :flag_date => ""
      JSON.parse(response.body).except('unique_id').except('id').should eq({"message" => "#{model.name} Testing Flag", "date" => nil,
        "flagged_by" => "#{@user.user_name}", "removed" => nil,
        "created_at"=>DateTime.now.strftime("%Y/%m/%d %H:%M:%S %z"), "system_generated_followup"=>false,
        "unflag_message" => nil, "unflagged_by" => nil, "unflagged_date" => nil})
      record_db = model.get(record.id)
      expect(record_db.flag).to be_truthy
      flag = record_db.flags.last
      expect(flag.message).to eq("#{model.name} Testing Flag")
      expect(flag.flagged_by).to eq(@user.user_name)
      expect(flag.date).to be_nil
    end

    it "should flag the record with no date parameter" do
      post :flag, :id => record.id, :model_class => "#{model.name}", :flag_message => "#{model.name} Testing Flag"
      JSON.parse(response.body).except('unique_id').except('id').should eq({"message" => "#{model.name} Testing Flag", "date" => nil,
       "flagged_by" => "#{@user.user_name}", "removed" => nil,
       "created_at"=>DateTime.now.strftime("%Y/%m/%d %H:%M:%S %z"), "system_generated_followup"=>false,
        "unflag_message" => nil, "unflagged_by" => nil, "unflagged_date" => nil})
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
      JSON.parse(response.body).except('unique_id').except('id').should eq({"message" => "#{model.name} Testing Flag 1", "date" => "2014/07/15",
        "flagged_by" => "#{@user.user_name}", "removed" => nil,
        "created_at"=>DateTime.now.strftime("%Y/%m/%d %H:%M:%S %z"), "system_generated_followup"=>false,
        "unflag_message" => nil, "unflagged_by" => nil, "unflagged_date" => nil})

      post :flag, :id => record.id, :model_class => "#{model.name}", :flag_message => "#{model.name} Testing Flag 2", :flag_date => "16-Jul-2014"
      JSON.parse(response.body).except('unique_id').except('id').should eq({"message" => "#{model.name} Testing Flag 2", "date" => "2014/07/16",
        "flagged_by" => "#{@user.user_name}", "removed" => nil,
        "created_at"=>DateTime.now.strftime("%Y/%m/%d %H:%M:%S %z"), "system_generated_followup"=>false,
        "unflag_message" => nil, "unflagged_by" => nil, "unflagged_date" => nil})

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

      post :unflag, :id => record.id, :model_class => "#{model.name}", :flag_message => "#{model.name} Flag 2", :flag_index => 1, :unflag_message => 'unflagging due to reason'
      JSON.parse(response.body).except('unique_id').except('id').should eq({"message" => "#{model.name} Flag 2", "date" => nil,
        "flagged_by" => nil, "unflag_message" => "unflagging due to reason", "removed" => true,
        "created_at"=>nil, "system_generated_followup"=>false, "unflagged_by" => "fakeadmin", "unflagged_date" => @unflagged_at.strftime("%Y/%m/%d")})

      record_db = model.get(record.id)
      record_db.flag.should eq(true)
      record_db.flags.length.should eq(3)
      record_db.flags[0].message.should eq("#{model.name} Flag 1")
      record_db.flags[1].message.should eq("#{model.name} Flag 2")
      record_db.flags[1].unflag_message.should eq("unflagging due to reason")
      record_db.flags[1].removed.should eq(true)
    end

    it "should remove flag from record" do
      record.flags = [Flag.new(:message => "#{model.name} Flag 1"), Flag.new(:message => "#{model.name} Flag 2"), Flag.new(:message => "#{model.name} Flag 3")]
      record.save

      post :unflag, :id => record.id, :model_class => "#{model.name}", :flag_message => "#{model.name} Flag 2", :flag_index => 1, :unflag_message => "unflagging due to reason2"
      JSON.parse(response.body).except('unique_id').except('id').should eq({"message" => "#{model.name} Flag 2", "date" => nil,
        "flagged_by" => nil, "unflag_message" => "unflagging due to reason2", "removed" => true,
        "created_at"=>nil, "system_generated_followup"=>false, "unflagged_by" => "fakeadmin", "unflagged_date" => @unflagged_at.strftime("%Y/%m/%d")})

      post :unflag, :id => record.id, :model_class => "#{model.name}", :flag_message => "#{model.name} Flag 1", :flag_index => 0, :unflag_message => "unflagging due to reason1"
      JSON.parse(response.body).except('unique_id').except('id').should eq({"message" => "#{model.name} Flag 1", "date" => nil,
        "flagged_by" => nil, "unflag_message" => "unflagging due to reason1", "removed" => true,
        "created_at"=>nil, "system_generated_followup"=>false, "unflagged_by" => "fakeadmin", "unflagged_date" => @unflagged_at.strftime("%Y/%m/%d")})

      post :unflag, :id => record.id, :model_class => "#{model.name}", :flag_message => "#{model.name} Flag 3", :flag_index => 2, :unflag_message => "unflagging due to reason3"
      JSON.parse(response.body).except('unique_id').except('id').should eq({"message" => "#{model.name} Flag 3", "date" => nil,
        "flagged_by" => nil, "unflag_message" => "unflagging due to reason3", "removed" => true,
        "created_at"=>nil, "system_generated_followup"=>false, "unflagged_by" => "fakeadmin", "unflagged_date" => @unflagged_at.strftime("%Y/%m/%d")})

      record_db = model.get(record.id)
      record_db.flags.length.should eq(3)
      record_db.flag.should eq(false)
      record_db.flags[0].unflag_message.should eq("unflagging due to reason1")
      record_db.flags[0].removed.should eq(true)
      record_db.flags[1].unflag_message.should eq("unflagging due to reason2")
      record_db.flags[1].removed.should eq(true)
      record_db.flags[2].unflag_message.should eq("unflagging due to reason3")
      record_db.flags[2].removed.should eq(true)
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

  shared_examples_for "Flagging multiple records" do
    it "should flag multiple records" do
      # Flag the first 30 records.
      records = children.take 30
      post :flag_records, :model_class => model.name, :selected_records => records, :flag_message => "Multiple records flagging test", :flag_date => Date.today, :apply_to_all => false
      JSON.parse(response.body).should eq({"success" => true, "error_message" => "", "reload_page" => true})
      records.each do |id|
        record = model.get id
        record.flags.count.should eq(1)
        record.flag.should eq(true)
      end
      (children - records).each do |id|
        record = model.get id
        record.flag.should eq(false)
      end

      # Apply a filter and flag all the records
      post :flag_records, :model_class => model.name, :flag_message => "Multiple records flagging test", :flag_date => Date.today, :apply_to_all => "true", "scope"=>{"flag"=>"single||flag"}
      JSON.parse(response.body).should eq({"success" => true, "error_message" => "", "reload_page" => true})
      records.each do |id|
        record = model.get id
        record.flags.count.should eq(2)
        record.flag.should eq(true)
      end
      (children - records).each do |id|
        record = model.get id
        record.flag.should eq(false)
      end
    end
  end

  describe "Child", search: true do
    before :each do
      @child = create_record(Child, @user, {"child_status" => "Open"})
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

    it_behaves_like "Flagging multiple records" do
      let(:model) { Child }
      let(:children) do
        children = []
        50.times {children << create_record(Child, @user, {"child_status" => "Open"})}
        children.map {|child| child.id}
      end
    end
  end

  describe "Incident", search: true do
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

  describe "TracingRequest", search: true do
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
