module KPI
  # CaseLoad Search
  #
  # For cases created in a given range of months, looks at how many cases
  # each 'owner' (a User) has. This is aggregated into 4 bins for analysis.
  class CaseLoad < Search
    def search
      @search ||= Child.search do
        with :created_at, from..to

        facet :owned_by
      end
    end

    def data
      @data ||= [
        create_case_load(owners, '10cases', 0..10),
        create_case_load(owners, '20cases', 0..20),
        create_case_load(owners, '21-30cases', 21..30),
        create_case_load(owners, '30cases', 31..Float::INFINITY)
      ]
    end

    def to_json
      { data: data }
    end

    private

    def owners
      @owners ||= search.facet(:owned_by).rows
    end

    def create_case_load(owners, key, range)
      {
        case_load: key,
        percent: nan_safe_divide(
          owners.select { |owner| range.include?(owner.count) }.count,
          owners.count
        )
      }
    end

    # This handles cases where 0% of something exists as in normal
    # ruby floating point math that is 0 / total which is Float::NaN
    # where we are looking for 0.
    def nan_safe_divide(numerator, denominator)
      return 0 if numerator.zero?

      numerator / denominator.to_f
    end
  end
end
