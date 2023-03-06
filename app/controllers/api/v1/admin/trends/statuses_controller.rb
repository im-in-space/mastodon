# frozen_string_literal: true

class Api::V1::Admin::Trends::StatusesController < Api::V1::Trends::StatusesController
  include Authorization

  before_action -> { authorize_if_got_token! :'admin:read' }

  after_action :verify_authorized, only: :batch

  def batch
    authorize %i[admin status], :review?

    @form = Trends::StatusBatch.new(trends_status_batch_params.merge(current_account: current_account, action: action_from_button))
    @form.save

    render_empty
  end

  private

  def enabled?
    super || current_user&.can?(:manage_taxonomies)
  end

  def trends_status_batch_params
    params.require(:trends_status_batch).permit(:action, status_ids: [])
  end

  def action_from_button
    if params[:approve]
      'approve'
    elsif params[:approve_accounts]
      'approve_accounts'
    elsif params[:reject]
      'reject'
    elsif params[:reject_accounts]
      'reject_accounts'
    end
  end

  def statuses_from_trends
    if current_user&.can?(:manage_taxonomies)
      Trends.statuses.query
    else
      super
    end
  end
end
