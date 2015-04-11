(function ($) {
  AssembleApp.Collections.Loadable = Backbone.Collection.extend({
    page: 2,

    isLoading: false,

    initialize: function(models, options) {
      options || (options = {})
      this.fetchOptions = options.fetchOptions;
    },

    fetch_next_page: function() { 
      if(!this.isLoading) {
        this.isLoading = true;

        this.fetch({
          data: _.extend((this.fetchOptions || {}), { page: this.page }),
          remove: false,
          silent: true,
          success: _.bind(function() { this.page++; }, this),
          complete: _.bind(this.fetch_next_completed, this)
        });

        this.trigger("fetching_next");
      };
    },

    fetch_next_completed: function() {
      this.isLoading = false;
      this.trigger("fetching_next_complete");
    }
  });
}(jQuery));