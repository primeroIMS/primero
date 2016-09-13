module IAReferralDerivedFields
  extend ActiveSupport::Concern

  def ia_latest_external_referral
    referral = []
    transitions = self.try(:transitions)
    if transitions.present?
      # Check if it should be first or last
      latest_referral = transitions.select do |transition|
        transition.type == Transition::TYPE_REFERRAL && transition.is_remote == true
      end.first
      # Expected result is either one or zero element array
      referral = [latest_referral]
    end
    referral
  end

end
