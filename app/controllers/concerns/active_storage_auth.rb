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
    authenticate_user! unless agency_logo?
  end

  def authorize_blob!
    record = @blob&.attachments&.first&.record
    authorize!(:read, record) unless agency_logo?
  end

  def agency_logo?
    @blob&.attachments&.all? do |att|
      att.record_type == 'Agency' && %w[logo_full logo_icon].include?(att.name)
    end
  end
end
