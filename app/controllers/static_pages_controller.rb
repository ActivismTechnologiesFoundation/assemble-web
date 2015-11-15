class StaticPagesController < ApplicationController
  def landing_page
  end

  def about
    redirect_to events_path
  end

  def terms_of_service
    redirect_to events_path
  end

  def privacy_policy
    redirect_to events_path
  end

  def contact
    redirect_to events_path
  end
end
