require 'csv'

module Exporters
  class CSVListViewExporter < BaseExporter
    class << self
      def id
        'list_view_csv'
      end

      def mime_type
        'csv'
      end

      def supported_models
        [Child, Incident, TracingRequest]
      end
    end

    def build_field_map(model_name, current_user)
      field_map = {}
      properties = ApplicationController.helpers.build_list_field_by_model(model_name, current_user)

      properties[:fields].each do |key, value|
        if properties[:type] == "incident" && value == "violations"
          field_map.merge!({ key => ->(c) { c.violations_list(true).join(", ") } })
        elsif properties[:type] == "incident" && value == "incident_date_derived"
          field_map.merge!({ key => ->(c) { c.incident_date_to_export } })
        elsif properties[:type] == "tracing_request" && value == "tracing_names"
          field_map.merge!({ key => ->(c) { c.tracing_names.join(", ") } })
        else
          field_map.merge!({ key => value })
        end
      end
      field_map
    end

    def export(models, properties, current_user, params)
      field_map = build_field_map(models.first.class.name, current_user)

      csv_list = CSV.generate do |rows|
        # @called_first_time is a trick for batching purposes,
        # so that headers are saved only once 
        rows << field_map.keys if @called_first_time.nil?
        @called_first_time ||= true

        models.each do |model|
          rows << field_map.map do |_, generator|
            return generator.call(model) if generator.is_a?(Proc)
            field = properties.select { |p| generator.eql?(p.try(:name)) }.first
            if generator.is_a?(Array)
              self.class.translate_value(field.first, model.value_for_attr_keys(field))
            else
              self.class.translate_value(field, CSVListViewExporter.to_exported_value(model.try(generator.to_sym)))
            end
          end
        end
      end
      self.buffer.write(csv_list)
    end

    # TODO: These methods have to be overriden in order to use Header model
    def build_list_field_by_model(model_name, user)
      #Necessary when calling this method from csv_exporter_list_view
      if @current_user != user
        @is_admin ||= user.admin?
        @is_manager ||= user.is_manager?
        @is_cp ||= user.has_module?(PrimeroModule::CP)
        @is_gbv ||= user.has_module?(PrimeroModule::GBV)
        @is_mrm ||= user.has_module?(PrimeroModule::MRM)
      end

      #list_view_header returns the columns that are showed in the index page.
      model = model_name.underscore
      model = "case" if model == "child"
      list_view_fields = { :type => model, :fields => {} }
      list_view_header(model).each do |header|
        if header[:title].present? && header[:sort_title].present?
          list_view_fields[:fields].merge!({ header[:title].titleize => header[:sort_title] })
        end
      end
      list_view_fields
    end

    def list_view_header(record)
      case record
        when "case"
          list_view_header_case
        when "incident"
          list_view_header_incident
        when "tracing_request"
          list_view_header_tracing_request
        when "report"
          list_view_header_report
        when "potential_match"
          list_view_header_potential_match
        when "duplicate"
          list_view_header_duplicate
        when "bulk_export"
          list_view_header_bulk_export
        when "task"
          list_view_header_task
        when "audit_log"
          list_view_audit_log
        when "user"
          list_view_header_user
        when "agency"
          list_view_agency
        when "user_group"
          list_view_user_group
        else
          []
      end
    end
    private

    def list_view_header_case
      header_list = []
      header_list << {title: '', sort_title: 'select'}
      header_list << {title: 'id', sort_title: 'short_id'}
      header_list << {title: 'name', sort_title: 'sortable_name'} if (@is_cp && !@is_manager && !@id_search.present?)
      header_list << {title: 'survivor_code', sort_title: 'survivor_code_no'} if (@is_gbv && !@is_manager)
      header_list << {title: 'age', sort_title: 'age'} if @is_cp || @id_search.present?
      header_list << {title: 'sex', sort_title: 'sex'} if @is_cp || @id_search.present?
      header_list << {title: 'registration_date', sort_title: 'registration_date'} if @is_cp && !@id_search.present?
      header_list << {title: 'case_opening_date', sort_title: 'created_at'} if @is_gbv && !@id_search.present?
      header_list << {title: 'photo', sort_title: 'photo'} if @is_cp && !@id_search.present? && FormSection.has_photo_form
      header_list << {title: 'social_worker', sort_title: 'owned_by'} if @is_manager && !@id_search.present?
      header_list << {title: 'owned_by', sort_title: 'owned_by'} if @is_cp && @id_search.present?
      header_list << {title: 'owned_by_agency', sort_title: 'owned_by_agency'} if @is_cp && @id_search.present?
      header_list << {title: '', sort_title: 'view'} if @id_search.present? && @can_display_view_page

      return header_list
    end

    def list_view_header_incident
      header_list = []

      header_list << {title: '', sort_title: 'select'}
      #TODO - do I need to handle Incident Code???
      header_list << {title: 'id', sort_title: 'short_id'}

      header_list << {title: 'date_of_interview', sort_title: 'date_of_first_report'} if @is_gbv || @is_cp
      header_list << {title: 'date_of_incident', sort_title: 'incident_date_derived'}
      header_list << {title: 'violence_type', sort_title: 'gbv_sexual_violence_type'} if @is_gbv || @is_cp
      header_list << {title: 'incident_location', sort_title: 'incident_location'} if @is_mrm
      header_list << {title: 'violations', sort_title: 'violations'} if @is_mrm
      header_list << {title: 'social_worker', sort_title: 'owned_by'} if @is_manager

      return header_list
    end

    def list_view_header_tracing_request
      return [
          {title: '', sort_title: 'select'},
          {title: 'id', sort_title: 'short_id'},
          {title: 'name_of_inquirer', sort_title: 'relation_name'},
          {title: 'date_of_inquiry', sort_title: 'inquiry_date'},
          {title: 'tracing_requests', sort_title: 'tracing_names'}
      ]
    end

    def list_view_header_report
      [
        #{title: '', sort_title: 'select'},
        {title: 'name', sort_title: 'name'},
        {title: 'description', sort_title: 'description'},
        {title: '', sort_title: ''},
      ]
    end

    def list_view_header_potential_match
      [
        {title: 'inquirer_id', sort_title: 'tracing_request_id'},
        {title: 'tr_id', sort_title: 'tr_subform_id'},
        {title: 'child_id', sort_title: 'child_id'},
        {title: 'average_rating', sort_title: 'average_rating'},
      ]
    end

    def list_view_header_duplicate
      [
        #TODO
      ]
    end

    def list_view_header_bulk_export
      [
        #{title: '', sort_title: 'select'},
        {title: 'file_name', sort_title: 'file_name'},
        {title: 'record_type', sort_title: 'record_type'},
        {title: 'started_on', sort_title: 'started_on'}
      ]
    end

    def list_view_header_task
      [
        #{title: '', sort_title: 'select'},
        {title: 'id', sort_title: 'case_id'},
        {title: 'priority', sort_title: 'priority'},
        {title: 'type', sort_title: 'type'},
        {title: 'due_date', sort_title: 'due_date'}
      ]
    end

    def list_view_audit_log
      [
        {title: 'timestamp', sort_title: 'timestamp'},
        {title: 'user_name', sort_title: 'user_name'},
        {title: 'action', sort_title: 'action_name'},
        {title: 'description', sort_title: 'description'},
        {title: 'record_owner', sort_title: 'record_owner'}
      ]
    end

    def list_view_agency
      [
        {title: 'agency.name', sort_title: 'agency.name'},
        {title: 'description', sort_title: 'description'},
      ]
    end

    def list_view_header_user
      [
        {title: 'full_name', sort_title: 'full_name'},
        {title: 'user_name', sort_title: 'user_name'},
        {title: 'position', sort_title: 'position'},
        {title: 'agency', sort_title: 'agency'}
      ]
    end

    def list_view_user_group
      [
        {title: 'user_group.name', sort_title: 'user_group.name'},
        {title: 'description', sort_title: 'description'},
      ]
    end

    def visible_filter_field?(field_name)
      field = @filter_fields[field_name]
      field.present? && field.visible?
    end

  end
end
