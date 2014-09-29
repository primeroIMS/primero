require 'spec_helper'

describe ChildRiskLevelFollowUp do
  before :each do
    Child.all.each { |form| form.destroy }
  end

  def create_sample_child(registration_date, risk_level, flags = [])
    Child.create!(:registration_date => registration_date,
                          :risk_level => risk_level,
                          :system_generated_followup => true, :flags => flags)
  end

  def generate_flag(risk_level, date)
    flags = []
    flag_date = date
    (1..ChildRiskLevelFollowUp.followup_count(risk_level)).each do
      flags << Flag.new(:message => I18n.t("messages.system_generated_followup_flag"),
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
          flag.message.should eq(I18n.t("messages.system_generated_followup_flag"))
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
            flag.message.should eq(I18n.t("messages.system_generated_followup_flag"))
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
            flag.message.should eq(I18n.t("messages.system_generated_followup_flag"))
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
          flag.message.should eq(I18n.t("messages.system_generated_followup_flag"))
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
            flag.message.should eq(I18n.t("messages.system_generated_followup_flag"))
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
            flag.message.should eq(I18n.t("messages.system_generated_followup_flag"))
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
          flag.message.should eq(I18n.t("messages.system_generated_followup_flag"))
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
            flag.message.should eq(I18n.t("messages.system_generated_followup_flag"))
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
            flag.message.should eq(I18n.t("messages.system_generated_followup_flag"))
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
      db_child_low.flags[1].unflag_message.should eq(I18n.t("messages.system_generated_followup_unflag"))
      #Check the last one was the created flag
      db_child_low.flags[3].message.should eq(I18n.t("messages.system_generated_followup_flag"))
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
      db_child_medium.flags[1].unflag_message.should eq(I18n.t("messages.system_generated_followup_unflag"))
      #Check the last one was the created flag
      db_child_medium.flags[4].message.should eq(I18n.t("messages.system_generated_followup_flag"))
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
      db_child_high.flags[1].unflag_message.should eq(I18n.t("messages.system_generated_followup_unflag"))
      #Check the last one was the created flag
      db_child_high.flags[6].message.should eq(I18n.t("messages.system_generated_followup_flag"))
      db_child_high.flags[6].system_generated_followup.should eq(true)
      db_child_high.flags[6].removed.should eq(nil)
      db_child_high.flags[6].unflag_message.should eq(nil)
      #The new flag is one week from the last flag.
      db_child_high.flags[6].date.should eq(db_child_high.flags[4].date + 1.week)
    end
  end

end
