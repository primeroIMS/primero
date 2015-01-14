module Referable
  extend ActiveSupport::Concern
  include Sunspot::Rails::Searchable

  included do
    property :referrals, [Referral], :default => []

    
    def add_referral(referred_to_user, referred_to_user_agency, service, notes, is_remote, is_remote_primero, user_name)
      referral = Referral.new(
                    :referred_to_user,
                    :referred_to_user_agency,
                    :referred_by => user_name, 
                    :notes => notes, 
                    :service => service, 
                    :created_at => DateTime.now)
      self.referrals << referral
      referral
    end
  end

end
