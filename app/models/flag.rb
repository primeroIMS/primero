class Flag
  include CouchRest::Model::Embeddable
  include PrimeroModel

  validate :validate_record

  property :date, Date
  property :message, String
  property :flagged_by, String

  private

  def validate_record
    errors.add(:message, I18n.t("errors.models.flags.message")) unless self.message.present?
    unless self.date.blank? || self.date.is_a?(Date)
      begin
        Date.parse(self.date)
      rescue
        errors.add(:date, I18n.t("errors.models.flags.date"))
      end
    end
  end
end
