require 'rails_helper'

describe Task do

  before :all do
    FormSection.all.each &:destroy
    Lookup.all.each &:destroy
    SystemSettings.all.each &:destroy
    SystemSettings.create(default_locale: "en")

    create(:form_section,
      fields: [
        build(:field, name: 'risk_level'),
        build(:field, name: 'assessment_due_date', type: Field::DATE_FIELD),
        build(:field, name: 'assessment_requested_on', type: Field::DATE_FIELD),
        build(:field, name: 'case_plan_due_date', type: Field::DATE_FIELD),
        build(:field, name: 'date_case_plan', type: Field::DATE_FIELD),
        build(:subform_field, name: 'followup_subform_section', unique_id: 'followup_subform_section', fields: [
          build(:field, name: 'followup_type'),
          build(:field, name: 'followup_needed_by_date', type: Field::DATE_FIELD),
          build(:field, name: 'followup_date', type: Field::DATE_FIELD),
        ]),
        build(:subform_field, name: 'services_section', unique_id: 'services_section', fields: [
          build(:field, name: 'service_type'),
          build(:field, name: 'service_response_timeframe'),
          build(:field, name: 'service_response_day_time'),
          build(:field, name: 'service_appointment_date', type: Field::DATE_FIELD),
          build(:field, name: 'service_implemented_day_time', type: Field::DATE_FIELD),
          build(:field, name: 'service_response_day_time', type: Field::DATE_FIELD, selected_value: 'now'),
          build(:field, name: 'service_response_timeframe', type: Field::SELECT_BOX,
                option_strings_text_en: [
                  { id: '1_hour', display_text: "One hour" },
                  { id: '3_hours', display_text: "Three hours" },
                  { id: '1_day', display_text: "One day" },
                  { id: '3_days', display_text: "Three days" }].map(&:with_indifferent_access)),
        ])
      ]
    )

    create_lookup('lookup-followup-type', [
      { id: 'followup1', display_text: 'Followup1' },
      { id: 'followup2', display_text: 'Followup2' },
      { id: 'followup3', display_text: 'Followup3' }
    ])

    create_lookup('lookup-service-type', [
      { id: 'service1', display_text: 'Service1' },
      { id: 'service2', display_text: 'Service2' },
      { id: 'service3', display_text: 'Service3' }
    ])

    Child.refresh_form_properties
  end

  before :each do
    Child.any_instance.stub(:calculate_workflow){}
  end

  describe "create" do

    it "creates Assessment task" do
      child = create(:child, assessment_due_date: Date.tomorrow)
      task = Task.from_case(child).first

      expect(task.type).to eq('assessment')
    end

    it "doesn't create an Assessment task if already started" do
      child = create(:child, assessment_due_date: Date.tomorrow, assessment_requested_on: Date.today)
      tasks = Task.from_case(child)

      expect(tasks).to be_empty
    end

    it "creates Case Plan task" do
      child = create(:child, case_plan_due_date: Date.tomorrow)
      task = Task.from_case(child).first

      expect(task.type).to eq('case_plan')
    end

    it "doesn't create an Case Plan task if already started" do
      child = create(:child, case_plan_due_date: Date.tomorrow, date_case_plan: Date.today)
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

    describe 'service task' do
      before do
        @date_time = DateTime.parse("2017/11/01 12:54:55 -0400")
        DateTime.stub(:now).and_return(@date_time)
      end

      context 'when due_date_from_appointment_date is true' do
        before do
          SystemSettings.any_instance.stub(:due_date_from_appointment_date).and_return(true)
        end

        context 'and appointment date is set' do
          it "creates a Service task" do
            child = create(:child, services_section: [{service_response_day_time: @date_time,
                                                       service_appointment_date: Date.tomorrow}])
            tasks = Task.from_case(child)
            expect(tasks).not_to be_empty
            expect(tasks.first.type).to eq('service')
          end
        end

        context 'and appointment date is not set' do
          it "does not create a Service task" do
            child = create(:child, services_section: [{service_response_day_time: @date_time,
                                                       service_response_timeframe: '1_hour'}])
            tasks = Task.from_case(child)
            expect(tasks).to be_empty
          end
        end

        context 'when service has been implemented' do
          it "does not create a Service task" do
            child = create(:child, services_section: [{service_response_day_time: @date_time,
                                                       service_appointment_date: Date.tomorrow,
                                                       service_implemented_day_time: Date.today}])
            tasks = Task.from_case(child)
            expect(tasks).to be_empty
          end
        end
      end

      context 'when due_date_from_appointment_date is false' do
        before do
          SystemSettings.any_instance.stub(:due_date_from_appointment_date).and_return(false)
        end

        context 'when timeframe is set' do
          it "creates a Service task" do
            child = create(:child, services_section: [{service_response_day_time: @date_time,
                                                       service_response_timeframe: '1_hour'}])
            tasks = Task.from_case(child)
            expect(tasks).not_to be_empty
            expect(tasks.first.type).to eq('service')
          end
        end

        context 'when timeframe is not set' do
          it "does not create a Service task" do
            child = create(:child, services_section: [{service_response_day_time: @date_time,
                                                       service_appointment_date: Date.tomorrow}])
            tasks = Task.from_case(child)
            expect(tasks).to be_empty
          end
        end

        context 'when service has been implemented' do
          it "does not create a Service task" do
            child = create(:child, services_section: [{service_response_day_time: @date_time,
                                                       service_response_timeframe: '1_hour',
                                                       service_implemented_day_time: Date.today}])
            tasks = Task.from_case(child)
            expect(tasks).to be_empty
          end
        end
      end
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