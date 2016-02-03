module Matchable
  extend ActiveSupport::Concern

  included do

    #This method controls trace matching logic
    def build_match(match={}, params)
      phonetic_fields = { name_ph: match[:name], name_nickname_ph: match[:name_nickname] }

      # The score property will give more weight to that field during matching.
      # TODO: Figure out if we need to make certain fields more relevant than others.
      #
      # In Child Model
      # def self.match_boost_fields
      #   [
      #       {field: 'ethnicity', match: 'ethnicity', boost: 0.5},
      #       {field: 'sub_ethnicity_1', match: 'ethnicity', boost: 0.5},
      #       {field: 'sub_ethnicity_2', match: 'ethnicity', boost: 0.5},
      #       {field: 'date_of_birth', match: 'date_of_birth', boost: 0.5, date:true}
      #   ]
      # end

      params[:bq] = boost_query_fields(match, true)

      params[:q] = if phonetic_fields.values.any?{|m| m.present?}
                     phonetic_fields.compact.map{|k, v| "#{k}:(#{v})"}.join(' OR ')
                   else
                     boost_query_fields(match, false)
                   end

      params[:defType] = "edismax"
      params
    end

    def boost_query_fields(match, include_boost)
      fields = build_boost_fields_with_match_value(match).map do |k, v|
        if v[:value].present?
          value = v[:value].is_a?(Array) ? v[:value].join(' OR ') : v[:value]
          if v[:score].present? && include_boost.present?
            v[:date].present? ? "#{k}:[#{value}]^#{v[:boost]}" : "#{k}:(#{value})^#{v[:boost]}"
          else
            v[:date].present? ? "#{k}:[#{value}]" : "#{k}:(#{value})"
          end
        end
      end
      fields.compact.join(' OR ')
    end

    def build_boost_fields_with_match_value(match)
      fields = {}
      self.match_boost_fields.each do |bf|
        field = SolrUtils.indexed_field_name(self, bf[:field])
        if field.present?
          # This may have to change if matching on a single date and not a range.
          value = match[bf[:match].to_sym]
          if bf[:date].present? && value.present?
            # To satisfy solr, dates needed to formated to utc iso8601
            to = (value + 2.years).to_time.utc.iso8601
            from = (value - 2.years).to_time.utc.iso8601
            fields[field] = {value: "#{from} TO #{to}", boost: bf[:boost], date: bf[:date]}
          else
            fields[field] = {value: value, boost: bf[:boost]}
          end
        end
      end
      fields
    end
  end
end