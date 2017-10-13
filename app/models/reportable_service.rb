class ReportableService

  def self.parent_record_type
    Child
  end

  def self.record_field_name
    'services_section'
  end

  def self.report_filters
    [
      {'attribute' => 'child_status', 'value' => [Record::STATUS_OPEN]},
      {'attribute' => 'record_state', 'value' => ['true']},
      {'attribute' => 'service_type', 'value' => 'not_null'},
      {'attribute' => 'service_appointment_date', 'constraint' => 'not_null'}
    ]
  end


  include ReportableNestedRecord

  searchable do
    extend ReportableNestedRecord::Searchable
    configure_searchable(ReportableService)

    time :service_due_date
  end

  def service_due_date
    @system_settings ||= SystemSettings.current
    created_on = object_value('service_response_day_time')
    timeframe = object_value('service_response_timeframe')
    appointment_date = object_value('service_appointment_date')
    appointment_time = object_value('service_appointment_time')

    if @system_settings.present? && created_on.present? && appointment_date.present?
      if @system_settings['due_date_from_appointment_date'].present?
        appointment_date_time = "#{appointment_date} #{appointment_time}"

        appointment_date_time_converted = DateTime.parse(appointment_date_time)
      elsif timeframe.present?
        converted_timeframe = convert_time(timeframe)
        converted_timeframe.present? ? created_on + converted_timeframe : nil
      end
    end
  end

  def convert_time(string)
    times = string.split('_')

    if times.size >= 2
      times[0].to_i.send(times[1])
    end
  end

  def id
    object_value('unique_id')
  end

end