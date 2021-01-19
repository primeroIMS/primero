# frozen_string_literal: true

# AssessmentStatus
#
# Kpi for tracking the percentage of classes with a completed survivor
# assessment form.
class Kpi::AssessmentStatus < Kpi::Search
  def search
    @search ||= Child.search do
      with :status, Record::STATUS_OPEN
      with :created_at, from..to
      with :owned_by_groups, owned_by_groups
      with :owned_by_agency_id, owned_by_agency_id

      facet :completed_survivor_assessment, only: true
    end
  end

  def to_json(*_args)
    {
      data: {
        completed: nan_safe_divide(
          search.facet(:completed_survivor_assessment).rows.count,
          search.total
        )
      }
    }
  end

  private

  # This handles cases where 0% of something exists as in normal
  # ruby floating point math that is 0 / total which is Float::NaN
  # where we are looking for 0.
  def nan_safe_divide(numerator, denominator)
    return 0 if numerator.zero?

    numerator / denominator.to_f
  end
end
