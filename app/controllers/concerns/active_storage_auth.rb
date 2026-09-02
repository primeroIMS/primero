# frozen_string_literal: true

# This concern is monkey patched into the public facing Rails
# ActiveStorage controllers, to prevent the most egregious unauthorized access.
module ActiveStorageAuth
  extend ActiveSupport::Concern

  included do
    rescue_from CanCan::AccessDenied do
      forbid!
    end
  end

  def forbid!
    render plain: 'Forbidden', status: 403
  end

  def authenticate_access!
    authenticate_user! unless public_attached_resource?
  end

  def authorize_blob!
    record = @blob&.attachments&.first&.record
    authorize!(:read, record) unless public_attached_resource?
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def public_attached_resource?
    @blob&.attachments&.all? do |att|
      (att.record_type == 'Agency' && %w[logo_full logo_icon terms_of_use].include?(att.name)) ||
        att.record_type == 'Theme' ||
        (att.record_type == 'SystemSettings' && att.record.public_locations_file == true)
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity
end
