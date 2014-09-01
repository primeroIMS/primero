class Child < CouchRest::Model::Base
  use_database :child

  MAX_DOCUMENTS = 10
  CHILD_PREFERENCE_MAX = 3

  include RapidFTR::Model
  include RapidFTR::CouchRestRailsBackward

  include Record
  include Searchable
  include DocumentHelper

  include Ownable
  include PhotoUploader
  include AudioUploader

  property :nickname
  property :name
  property :hidden_name, TrueClass, :default => false
  property :case_id
  property :registration_date
  property :reunited, TrueClass
  property :flag, TrueClass
  property :investigated, TrueClass
  property :verified, TrueClass
  property :verified

  # validate :validate_has_at_least_one_field_value
  validate :validate_date_of_birth
  validate :validate_child_wishes
  validate :validate_documents_size
  validate :validate_documents_count
  validate :validate_documents_file_type

  def initialize *args
    self['photo_keys'] ||= []
    self.hidden_name ||= false
    self['document_keys'] ||= []
    arguments = args.first

    if arguments.is_a?(Hash) && arguments["current_photo_key"]
      self['current_photo_key'] = arguments["current_photo_key"]
      arguments.delete("current_photo_key")
    end

    self['histories'] = []
    super *args
  end


  design do
      view :by_protection_status_and_gender_and_ftr_status

      view :by_name,
              :map => "function(doc) {
                  if (doc['couchrest-type'] == 'Child')
                 {
                    if (!doc.hasOwnProperty('duplicate') || !doc['duplicate']) {
                      emit(doc['name'], doc);
                    }
                 }
              }"


      view :by_flag,
              :map => "function(doc) {
                    if (doc.hasOwnProperty('flag'))
                   {
                     if (!doc.hasOwnProperty('duplicate') || !doc['duplicate']) {
                       emit(doc['flag'],doc);
                     }
                   }
                }"


      view :by_ids_and_revs,
              :map => "function(doc) {
              if (doc['couchrest-type'] == 'Child'){
                emit(doc._id, {_id: doc._id, _rev: doc._rev});
              }
            }"
  end

  def self.fetch_all_ids_and_revs
    ids_and_revs = []
    all_rows = self.by_ids_and_revs({:include_docs => false})["rows"]
    all_rows.each do |row|
      ids_and_revs << row["value"]
    end
    ids_and_revs
  end

  def validate_has_at_least_one_field_value
    return true if field_definitions.any? { |field| is_filled_in?(field) }
    return true if !@file_name.nil? || !@audio_file_name.nil?
    return true if deprecated_fields && deprecated_fields.any? { |key, value| !value.nil? && value != [] && value != {} && !value.to_s.empty? }
    errors.add(:validate_has_at_least_one_field_value, I18n.t("errors.models.child.at_least_one_field"))
  end

  def validate_date_of_birth
    return true if self['date_of_birth'].blank?
    begin
      date_of_birth = Date.parse(self['date_of_birth'])
      raise if date_of_birth.year > Date.today.year
      return true
    rescue
      errors.add(:date_of_birth, I18n.t("errors.models.child.date_of_birth"))
      error_with_section(:date_of_birth, I18n.t("errors.models.child.date_of_birth"))
    end
  end

  def validate_documents_size
    return true if @documents.blank? || @documents.all? {|document| document.size < 10.megabytes }
    errors.add(:document, I18n.t("errors.models.child.document_size"))
    error_with_section(:upload_document, I18n.t("errors.models.child.document_size"))
  end

  def validate_documents_count
    return true if @documents.blank? || self['document_keys'].size <= MAX_DOCUMENTS
    errors.add(:document, I18n.t("errors.models.child.documents_count", :documents_count => MAX_DOCUMENTS))
    error_with_section(:upload_document, I18n.t("errors.models.child.documents_count", :documents_count => MAX_DOCUMENTS))
  end

  def validate_documents_file_type
    return true if @documents.blank? || @documents.all? { |document| !document.original_filename.ends_with? ".exe" }
    errors.add(:document, "errors.models.child.document_format")
    error_with_section(:upload_document, I18n.t("errors.models.child.document_format"))
  end

  def validate_child_wishes
    return true if self['child_preferences_section'].nil? || self['child_preferences_section'].size <= CHILD_PREFERENCE_MAX
    errors.add(:child_preferences_section, I18n.t("errors.models.child.wishes_preferences_count", :preferences_count => CHILD_PREFERENCE_MAX))
    error_with_section(:child_preferences_section, I18n.t("errors.models.child.wishes_preferences_count", :preferences_count => CHILD_PREFERENCE_MAX))
  end

  def to_s
    if self['name'].present?
      "#{self['name']} (#{self['unique_identifier']})"
    else
      self['unique_identifier']
    end
  end


  def self.search_field
    "name"
  end

  def self.view_by_field_list
    ['created_at', 'name', 'flag_at', 'reunited_at']
  end

  def self.flagged
    by_flag(:key => true)
  end

  def create_class_specific_fields(fields)
    self['case_id'] = self.case_id
    self['name'] = fields['name'] || self.name || ''
    self['registration_date'] ||= DateTime.now.strftime("%d-%b-%Y")
  end

  def case_id
    self['unique_identifier']
  end

  def sortable_name
    self['name']
  end

  def has_one_interviewer?
    user_names_after_deletion = self['histories'].map { |change| change['user_name'] }
    user_names_after_deletion.delete(self['created_by'])
    self['last_updated_by'].blank? || user_names_after_deletion.blank?
  end

  private

  def deprecated_fields
    system_fields = ["created_at",
                     "last_updated_at",
                     "last_updated_by",
                     "last_updated_by_full_name",
                     "posted_at",
                     "posted_from",
                     "_rev",
                     "_id",
                     "short_id",
                     "created_by",
                     "created_by_full_name",
                     "couchrest-type",
                     "histories",
                     "unique_identifier",
                     "current_photo_key",
                     "created_organisation",
                     "photo_keys"]
    existing_fields = system_fields + field_definitions.map { |x| x.name }
    self.reject { |k, v| existing_fields.include? k }
  end

end
