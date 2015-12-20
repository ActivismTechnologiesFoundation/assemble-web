class StaticPagesController < ApplicationController
  def landing_page
  end

  def about
    @page = 'about'
    render :static_page
  end

  def terms_of_service
    @page = 'terms_of_service'

    render :static_page
  end

  def privacy_policy
    @page = 'privacy_policy'

    render :static_page
  end

  def contact
    @page = 'contact'

    render :static_page
  end
end
