require 'rails_helper'

describe ChildRiskLevelFollowUp do
  before :each do
    FormSection.all.all.each { |form| form.destroy }
    fields = [
        Field.new({"name" => "risk_level",
                   "type" => "select_box",
                   "display_name_all" => "Risk Level",
                   "option_strings_text_all" => ["option1", "option2"]
                  }),
        Field.new({"name" => "system_generated_followup",
                   "type" => "tick_box",
                   "display_name_all" => "system generated followup"
                  }),
        Field.new({"name" => "child_status",
                   "type" => "select_box",
                   "option_strings_text_all" => ["option1", "option2"],
                   "display_name_all" => "Child Status"
                  }),
        Field.new({"name" => "registration_date",
                   "type" => "date_field",
                   "display_name_all" => "Registration Date"
                  })
      ]
    form = FormSection.new(
      :unique_id => "form_section_test_for_risk_level_follow_up",
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
    Child.all.each { |form| form.destroy }
  end

  def create_sample_child(registration_date, risk_level, flags = [],
                          child_status = I18n.t("followup_reminders.child_status_open"),
                          record_state = true)
    Child.create!(:registration_date => registration_date,
                          :risk_level => risk_level,
                          :system_generated_followup => true, :flags => flags,
                          :child_status => child_status,
                          :record_state => record_state)
  end

  def generate_flag(risk_level, date)
    flags = []
    flag_date = date
    (1..ChildRiskLevelFollowUp.followup_count(risk_level)).each do
      flags << Flag.new(:message => ChildRiskLevelFollowUp::FOLLOWUP_MESSAGE,
                        :date => flag_date,
                        :created_at => Date.today,
                        :system_generated_followup => true)
      flag_date += ChildRiskLevelFollowUp.interval(risk_level)
    end
    flags
  end

  describe "Create follow up reminders" do
    describe "at current date" do
      describe "for registration date at current date" do
        it "should generate follow up flags for low risk level" do
          risk_level = ChildRiskLevelFollowUp::LOW_RISK_LEVEL
          today = Date.today
          child = create_sample_child(today, risk_level)

          #Invoke method to generate or expire follow up.
          ChildRiskLevelFollowUp.process_followup_reminders

          child_db = Child.get(child.id)
          child_db.flags.length.should eq(1)
          flag = child_db.flags.first
          flag.message.should eq(ChildRiskLevelFollowUp::FOLLOWUP_MESSAGE)
          #Flag will start in the current date.
          flag.date.should eq(today + ChildRiskLevelFollowUp.interval(risk_level))
        end

        it "should generate follow up flags for medium risk level" do
          risk_level = ChildRiskLevelFollowUp::MEDIUM_RISK_LEVEL
          today = Date.today
          child = create_sample_child(today, risk_level)

          #Invoke method to generate or expire follow up.
          ChildRiskLevelFollowUp.process_followup_reminders

          child_db = Child.get(child.id)
          child_db.flags.length.should eq(2)
          #Flag will start in the current date.
          flag_date = today
          child_db.flags.each do |flag|
            flag_date += ChildRiskLevelFollowUp.interval(risk_level)
            flag.message.should eq(ChildRiskLevelFollowUp::FOLLOWUP_MESSAGE)
            flag.date.should eq(flag_date)
          end
        end

        it "should generate follow up flags for high risk level" do
          risk_level = ChildRiskLevelFollowUp::HIGH_RISK_LEVEL
          today = Date.today
          child = create_sample_child(today, risk_level)

          #Invoke method to generate or expire follow up.
          ChildRiskLevelFollowUp.process_followup_reminders

          child_db = Child.get(child.id)
          child_db.flags.length.should eq(4)
          #Flag will start in the current date.
          flag_date = today
          child_db.flags.each do |flag|
            flag_date += ChildRiskLevelFollowUp.interval(risk_level)
            flag.message.should eq(ChildRiskLevelFollowUp::FOLLOWUP_MESSAGE)
            flag.date.should eq(flag_date)
          end
        end
      end

      describe "for registration date before expiration window (2 weeks ago)" do
        it "should generate follow up flags for low risk level" do
          risk_level = ChildRiskLevelFollowUp::LOW_RISK_LEVEL
          registration_date = Date.today - 3.weeks
          child = create_sample_child(registration_date, risk_level)

          #Invoke method to generate or expire follow up.
          ChildRiskLevelFollowUp.process_followup_reminders

          child_db = Child.get(child.id)
          child_db.flags.length.should eq(1)
          flag = child_db.flags.first
          flag.message.should eq(ChildRiskLevelFollowUp::FOLLOWUP_MESSAGE)
          #Flag will start in the current date.
          flag_day = Date.today + ChildRiskLevelFollowUp.interval(risk_level)
          flag.date.should eq(flag_day)
        end

        it "should generate follow up flags for medium risk level" do
          risk_level = ChildRiskLevelFollowUp::MEDIUM_RISK_LEVEL
          registration_date = Date.today - 3.weeks
          child = create_sample_child(registration_date, risk_level)

          #Invoke method to generate or expire follow up.
          ChildRiskLevelFollowUp.process_followup_reminders

          child_db = Child.get(child.id)
          child_db.flags.length.should eq(2)
          #Flag will start in the current date.
          flag_date = Date.today
          child_db.flags.each do |flag|
            flag_date += ChildRiskLevelFollowUp.interval(risk_level)
            flag.message.should eq(ChildRiskLevelFollowUp::FOLLOWUP_MESSAGE)
            flag.date.should eq(flag_date)
          end
        end

        it "should generate follow up flags for high risk level" do
          risk_level = ChildRiskLevelFollowUp::HIGH_RISK_LEVEL
          registration_date = Date.today - 3.weeks
          child = create_sample_child(registration_date, risk_level)

          #Invoke method to generate or expire follow up.
          ChildRiskLevelFollowUp.process_followup_reminders

          child_db = Child.get(child.id)
          child_db.flags.length.should eq(4)
          #Flag will start in the current date.
          flag_date = Date.today
          child_db.flags.each do |flag|
            flag_date += ChildRiskLevelFollowUp.interval(risk_level)
            flag.message.should eq(ChildRiskLevelFollowUp::FOLLOWUP_MESSAGE)
            flag.date.should eq(flag_date)
          end
        end
      end
    end

    describe "at registration date" do
      describe "for registration date in the expiration window (2 weeks ago)" do
        it "should generate follow up flags for low risk level" do
          risk_level = ChildRiskLevelFollowUp::LOW_RISK_LEVEL
          registration_date = Date.today - 1.week
          child = create_sample_child(registration_date, risk_level)

          #Invoke method to generate or expire follow up.
          ChildRiskLevelFollowUp.process_followup_reminders

          child_db = Child.get(child.id)
          child_db.flags.length.should eq(1)
          flag = child_db.flags.first
          flag.message.should eq(ChildRiskLevelFollowUp::FOLLOWUP_MESSAGE)
          #Flag will start in the registration date.
          flag_date = registration_date + ChildRiskLevelFollowUp.interval(risk_level)
          flag.date.should eq(flag_date)
        end

        it "should generate follow up flags for medium risk level" do
          risk_level = ChildRiskLevelFollowUp::MEDIUM_RISK_LEVEL
          registration_date = Date.today - 1.week
          child = create_sample_child(registration_date, risk_level)

          #Invoke method to generate or expire follow up.
          ChildRiskLevelFollowUp.process_followup_reminders

          child_db = Child.get(child.id)
          child_db.flags.length.should eq(2)
          #Flag will start in the registration date.
          flag_date = registration_date
          child_db.flags.each do |flag|
            flag_date += ChildRiskLevelFollowUp.interval(risk_level)
            flag.message.should eq(ChildRiskLevelFollowUp::FOLLOWUP_MESSAGE)
            flag.date.should eq(flag_date)
          end
        end

        it "should generate follow up flags for high risk level" do
          risk_level = ChildRiskLevelFollowUp::HIGH_RISK_LEVEL
          registration_date = Date.today - 1.week
          child = create_sample_child(registration_date, risk_level)

          #Invoke method to generate or expire follow up.
          ChildRiskLevelFollowUp.process_followup_reminders

          child_db = Child.get(child.id)
          child_db.flags.length.should eq(4)
          #Flag will start in the registration date.
          flag_date = registration_date
          child_db.flags.each do |flag|
            flag_date += ChildRiskLevelFollowUp.interval(risk_level)
            flag.message.should eq(ChildRiskLevelFollowUp::FOLLOWUP_MESSAGE)
            flag.date.should eq(flag_date)
          end
        end
      end
    end
  end

  describe "Expire follow up reminders and create new one" do
    it "should do for low risk level" do
      flags = [Flag.new(:message => "Flagged for some reason - 1")]
      flags.concat(generate_flag(ChildRiskLevelFollowUp::LOW_RISK_LEVEL, Date.today - 2.weeks))
      flags << Flag.new(:message => "Flagged for some reason - 2")
      child_low = create_sample_child(Date.today - 1.month, ChildRiskLevelFollowUp::LOW_RISK_LEVEL, flags)

      #Invoke method to generate or expire follow up.
      ChildRiskLevelFollowUp.process_followup_reminders

      db_child_low = Child.get(child_low.id)
      #2 existing flag + 1 expired + 1 new reminder flag.
      db_child_low.flags.length.should eq(4)
      #Check the existing flags was the expired.
      db_child_low.flags[1].removed.should eq(true)
      db_child_low.flags[1].unflag_message.should eq(ChildRiskLevelFollowUp::EXPIRED_MESSAGE)
      #Check the last one was the created flag
      db_child_low.flags[3].message.should eq(ChildRiskLevelFollowUp::FOLLOWUP_MESSAGE)
      db_child_low.flags[3].system_generated_followup.should eq(true)
      db_child_low.flags[3].removed.should eq(nil)
      db_child_low.flags[3].unflag_message.should eq(nil)
      #The new flag is one month from the last flag.
      db_child_low.flags[3].date.should eq(db_child_low.flags[1].date + 1.month)
    end

    it "should do for medium risk level" do
      flags = [Flag.new(:message => "Flagged for some reason - 1")]
      flags.concat(generate_flag(ChildRiskLevelFollowUp::MEDIUM_RISK_LEVEL, Date.today - 2.weeks))
      flags << Flag.new(:message => "Flagged for some reason - 2")
      child_medium = create_sample_child(Date.today - 1.month, ChildRiskLevelFollowUp::MEDIUM_RISK_LEVEL, flags)

      #Invoke method to generate or expire follow up.
      ChildRiskLevelFollowUp.process_followup_reminders

      db_child_medium = Child.get(child_medium.id)
      #2 existing flag + 1 expired + 1 valid + 1 new
      db_child_medium.flags.length.should eq(5)
      #Check the existing flags was the expired.
      db_child_medium.flags[1].removed.should eq(true)
      db_child_medium.flags[1].unflag_message.should eq(ChildRiskLevelFollowUp::EXPIRED_MESSAGE)
      #Check the last one was the created flag
      db_child_medium.flags[4].message.should eq(ChildRiskLevelFollowUp::FOLLOWUP_MESSAGE)
      db_child_medium.flags[4].system_generated_followup.should eq(true)
      db_child_medium.flags[4].removed.should eq(nil)
      db_child_medium.flags[4].unflag_message.should eq(nil)
      #The new flag is 2 weeks from the last flag.
      db_child_medium.flags[4].date.should eq(db_child_medium.flags[2].date + 2.weeks)
    end

    it "should do for high risk level" do
      flags = [Flag.new(:message => "Flagged for some reason - 1")]
      flags.concat(generate_flag(ChildRiskLevelFollowUp::HIGH_RISK_LEVEL, Date.today - 2.weeks))
      flags << Flag.new(:message => "Flagged for some reason - 2")
      child_high = create_sample_child(Date.today - 1.month, ChildRiskLevelFollowUp::HIGH_RISK_LEVEL, flags)

      #Invoke method to generate or expire follow up.
      ChildRiskLevelFollowUp.process_followup_reminders

      db_child_high = Child.get(child_high.id)
      #2 existing flag + 1 expired + 3 valid + 1 new
      db_child_high.flags.length.should eq(7)
      #Check the existing flags was the expired.
      db_child_high.flags[1].removed.should eq(true)
      db_child_high.flags[1].unflag_message.should eq(ChildRiskLevelFollowUp::EXPIRED_MESSAGE)
      #Check the last one was the created flag
      db_child_high.flags[6].message.should eq(ChildRiskLevelFollowUp::FOLLOWUP_MESSAGE)
      db_child_high.flags[6].system_generated_followup.should eq(true)
      db_child_high.flags[6].removed.should eq(nil)
      db_child_high.flags[6].unflag_message.should eq(nil)
      #The new flag is one week from the last flag.
      db_child_high.flags[6].date.should eq(db_child_high.flags[4].date + 1.week)
    end
  end

  shared_examples_for "Cancel by case status" do |case_status|
    [ChildRiskLevelFollowUp::HIGH_RISK_LEVEL,
     ChildRiskLevelFollowUp::MEDIUM_RISK_LEVEL,
     ChildRiskLevelFollowUp::LOW_RISK_LEVEL].each do |risk_level|
      it "should cancel #{risk_level.downcase} follow up for #{case_status.downcase} cases" do
        flags = [Flag.new(:message => "Flagged for some reason - 1")]
        flags.concat(generate_flag(risk_level, Date.today - 2.weeks))
        flags << Flag.new(:message => "Flagged for some reason - 2")
        child = create_sample_child(Date.today - 1.month, risk_level, flags, case_status)

        #Invoke method to generate or cancel follow up.
        ChildRiskLevelFollowUp.process_followup_reminders

        db_child = Child.get(child.id)
        db_child.flags.length.should eq(2 + ChildRiskLevelFollowUp::followup_count(risk_level))
        i = 1
        ending = 2 + ChildRiskLevelFollowUp::followup_count(risk_level)
        db_child.flags.each do |flag|
          if (i >= 2 and i <= (ending - 1))
            flag.unflag_message.should eq(ChildRiskLevelFollowUp::CANCELLED_MESSAGE)
            flag.system_generated_followup.should eq(true)
            flag.removed.should eq(true)
          end
          i = i + 1
        end
      end
    end
  end

  shared_examples_for "Cancel for invalid records" do |case_status|
    [ChildRiskLevelFollowUp::HIGH_RISK_LEVEL,
     ChildRiskLevelFollowUp::MEDIUM_RISK_LEVEL,
     ChildRiskLevelFollowUp::LOW_RISK_LEVEL].each do |risk_level|
      it "should cancel #{risk_level.downcase} follow up for #{case_status.downcase} cases" do
        flags = [Flag.new(:message => "Flagged for some reason - 1")]
        flags.concat(generate_flag(risk_level, Date.today - 2.weeks))
        flags << Flag.new(:message => "Flagged for some reason - 2")
        child = create_sample_child(Date.today - 1.month, risk_level, flags, case_status, false)

        #Invoke method to generate or cancel follow up.
        ChildRiskLevelFollowUp.process_followup_reminders

        db_child = Child.get(child.id)
        db_child.flags.length.should eq(2 + ChildRiskLevelFollowUp::followup_count(risk_level))
        i = 1
        ending = 2 + ChildRiskLevelFollowUp::followup_count(risk_level)
        db_child.flags.each do |flag|
          if (i >= 2 and i <= (ending - 1))
            flag.unflag_message.should eq(ChildRiskLevelFollowUp::CANCELLED_MESSAGE)
            flag.system_generated_followup.should eq(true)
            flag.removed.should eq(true)
          end
          i = i + 1
        end
      end
    end
  end

  describe "Cancel followup reminders" do
    it_behaves_like "Cancel by case status", ChildRiskLevelFollowUp::CHILD_STATUS_CLOSED
    it_behaves_like "Cancel by case status", ChildRiskLevelFollowUp::CHILD_STATUS_TRANSFERRED
    it_behaves_like "Cancel by case status", ChildRiskLevelFollowUp::CHILD_STATUS_DUPLICATE

    it_behaves_like "Cancel for invalid records", ChildRiskLevelFollowUp::CHILD_STATUS_OPEN
    it_behaves_like "Cancel for invalid records", ChildRiskLevelFollowUp::CHILD_STATUS_CLOSED
    it_behaves_like "Cancel for invalid records", ChildRiskLevelFollowUp::CHILD_STATUS_TRANSFERRED
    it_behaves_like "Cancel for invalid records", ChildRiskLevelFollowUp::CHILD_STATUS_DUPLICATE
  end

end
