class BulkExport < ApplicationRecord

  include Indexable

  PROCESSING = 'job.status.processing' #The job is still running
  TERMINATED = 'job.status.terminated' #The job terminated due to an error
  COMPLETE = 'job.status.complete'     #The job completed successfully
  ARCHIVED = 'job.status.archived'     #The job's files have been cleaned up

  EXPORT_DIR = File.join(Rails.root,'tmp','export')
  FileUtils.mkdir_p EXPORT_DIR

  ARCHIVE_CUTOFF = 30.days.ago

  searchable auto_index: self.auto_index? do
    time :started_on
    time :completed_on
    string :status, as: 'status_sci'
    string :owned_by, as: 'owned_by_sci'
    string :format, as: 'format_sci'
  end

  def model_class
    @model_class ||= Record.model_from_name(self.record_type)
  end

  def exporter_type
    @exporter_type ||= Exporters::active_exporters_for_model(self.model_class)
    .select{|e| e.id == self.format.to_s}.first
  end

  def owner
    @owner ||= User.find_by_user_name(self.owned_by)
  end

  #Override accessors for values populated from the controller indifferent access
  def filters
    self['filters'].with_indifferent_access if self['filters'].present?
  end

  def order
    self['order'].with_indifferent_access if self['order'].present?
  end

  def match_criteria
    self['match_criteria'].with_indifferent_access if self['match_criteria'].present?
  end

  def custom_export_params
    self['custom_export_params'].with_indifferent_access if self['custom_export_params'].present?
  end

  def mark_started
    self.status = PROCESSING
    self.started_on = DateTime.now
    #TODO: Log this
    self.save
  end

  def mark_completed
    self.status = COMPLETE
    self.completed_on = DateTime.now
    self.password = nil # TODO: yes yes, I know
    #TODO: Log this
    self.save
  end

  def mark_terminated
    self.status = TERMINATED
    self.password = nil
    self.save
  end

  def archive
    self.status = ARCHIVED
    if self.stored_file_name.present? && File.exist?(self.stored_file_name)
      begin
        File.delete(self.stored_file_name)
      rescue
        Rails.logger.warn("Archiving #{self.stored_file_name}: File missing!")
      end
    end
  end

  def stored_file_name
    if self.file_name.present?
      File.join(EXPORT_DIR,"#{self.id}_#{self.file_name}")
    end
  end

  def encrypted_file_name
    name = stored_file_name
    name = "#{name}.zip" if name.present?
    return name
  end

  def process_records_in_batches(batch_size=500, &block)
    #TODO: this is a good candidate for multithreading
    #TODO: Right now this is duplicated code with what appears in the record_actions controller concern
    pagination_ops = {:page => 1, :per_page => batch_size}
    begin
      managed_user_names = []
      managed_user_groups = []

      if self.owner.group_permission?(Permission::ALL)
        managed_user_groups = [Searchable::ALL_FILTER]
        managed_user_names = [Searchable::ALL_FILTER]
      elsif self.owner.group_permission?(Permission::GROUP)
        managed_user_groups = self.owner.user_group_ids
        # In the absence of user groups, a user should at least export his own records.
        managed_user_names = [self.owner.user_name]
      else
        managed_user_names = [self.owner.user_name]
      end

      search = self.model_class.list_records(
        self.filters, self.order, pagination_ops,
        managed_user_names, self.query, self.match_criteria,
        managed_user_groups
      )
      results = search.results
      yield(results)
      #Set again the values of the pagination variable because the method modified the variable.
      pagination_ops[:page] = results.next_page
      pagination_ops[:per_page] = batch_size
    end until results.next_page.nil?
  end

  def encrypt_export_file
    #TODO: Add an else statement that throws an error if the file is empty!
    #TODO: This code is currently duplicated in the application controller
    if File.size? self.stored_file_name
      encrypt = password ? Zip::TraditionalEncrypter.new(password) : nil
      Zip::OutputStream.open(self.encrypted_file_name, encrypt) do |out|
        out.put_next_entry(File.basename(self.stored_file_name))
        out.write open(self.stored_file_name).read
      end

      File.delete self.stored_file_name
    end
  end

  def job
    BulkExportJob
  end

end
