require 'rails_helper'

describe Task do

  before :each do
    SystemSettings.destroy_all
    @system_settings = SystemSettings.create(default_locale: "en", due_date_from_appointment_date: true)
    SystemSettings.stub(:current).and_return(SystemSettings.first)
  end

  describe "create" do

    it "creates Assessment task" do
      child = create(:child, assessment_due_date: Date.tomorrow)
      task = Task.from_case(child).first

      expect(task.type).to eq('assessment')
    end

    it "doesn't create an Assessment task if already started" do
      child = build(:child, assessment_due_date: Date.tomorrow, assessment_requested_on: Date.today)
      child.stub(:calculate_workflow).and_return({})
      child.save!
      tasks = Task.from_case(child)

      expect(tasks).to be_empty
    end

    it "creates Case Plan task" do
      child = create(:child, case_plan_due_date: Date.tomorrow)
      task = Task.from_case(child).first

      expect(task.type).to eq('case_plan')
    end

    it "doesn't create an Case Plan task if already started" do
      child = build(:child, case_plan_due_date: Date.tomorrow, date_case_plan: Date.today)
      child.stub(:calculate_workflow).and_return({})
      child.save!
      tasks = Task.from_case(child)

      expect(tasks).to be_empty
    end

    it "creates a Followup task" do
      child = create(:child, followup_subform_section: [{followup_needed_by_date: Date.tomorrow}])
      task = Task.from_case(child).first

      expect(task.type).to eq('follow_up')
    end

    it "doesn't create a Followup task if Followup already took place" do
      child = create(:child, followup_subform_section: [{followup_needed_by_date: Date.tomorrow, followup_date: Date.today}])
      tasks = Task.from_case(child)

      expect(tasks).to be_empty
    end

    it "creates a Service task" do
      child = create(:child, services_section: [{service_appointment_date: Date.tomorrow}])
      task = Task.from_case(child).first

      expect(task.type).to eq('service')
    end

    it "doesn't create a Followup task if Followup already took place" do
      child = build(:child, services_section: [{service_appointment_date: Date.tomorrow, service_implemented_day_time: Date.today}])
      child.stub(:calculate_workflow).and_return({})
      child.save!
      tasks = Task.from_case(child)

      expect(tasks).to be_empty
    end
  end

  describe "sort order" do
    it "sorts by due date" do
      case1 = create(:child, assessment_due_date: Date.yesterday)
      case2 = create(:child, assessment_due_date: Date.tomorrow)
      case3 = create(:child, assessment_due_date: 7.days.from_now)
      case4 = create(:child, assessment_due_date: 10.days.from_now)
      tasks = Task.from_case([case3, case2, case4, case1])

      expect(tasks.map(&:case_id)).to eq([case1, case2, case3, case4].map(&:case_id_display))
    end
  end

end
