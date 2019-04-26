class Agency < ApplicationRecord

  #include LogoUploader #TODO Rplace with ActiveStorage
  # include Memoizable #TODO: We may pull this out or have a more polite way of caching
  include LocalizableJsonProperty
  include Configuration

  localize_properties :name, :description

  validates :agency_code, presence: { message: 'errors.models.agency.code_present' }
  validate :validate_name_in_english

  class << self
    alias :old_all :all
    alias :by_all :all
    alias :list_by_all :all

    def all
      old_all
    end
    # memoize_in_prod :all
    # memoize_in_prod :list_by_all

    #TODO: Consider moving this to a shared concern
    def enabled(is_enabled=true)
      where(disabled: !is_enabled)
    end

    #This method returns a list of id / display_text value pairs
    #It is used to create the select options list for Agency fields
    def all_names
      enabled.map{|r| {id: r.id, display_text: r.name}.with_indifferent_access}
    end
    # memoize_in_prod :all_names

    def retrieve_logo_ids
      # self.by_order.select{|l| l.logo_enabled == true }
      #     .collect{ |a| { id: a.id, filename: a['logo_key'] } unless a['logo_key'].nil? }.flatten.compact
      #TODO: This will need to be re-implemented with the ActiveStorage library. Not sure that this will still need to be cached.
      []
    end
    # memoize_in_prod :retrieve_logo_ids

    def display_text(agency_id, opts={})
      locale = (opts[:locale].present? ? opts[:locale] : I18n.locale)
      agency = Agency.find_by_id(agency_id)
      value = (agency.present? ? agency.name(locale) : '')
    end
    # memoize_in_prod :display_text
  end

  #TODO: Temprary method until we get ActiveStorage working
  def logo
    nil
  end

  def validate_name_in_english
    return true if self.name_en.present?
    errors.add(:name, 'errors.models.agency.name_present')
    return false
  end
end
