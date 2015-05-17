(function ($) {

  AssembleApp.Views.RootView = Backbone.View.extend({
    el: $("#landing-top-level-view"),

    events: {
      'click .get-started' : 'navigateToEvents'
    },

    initialize: function(options) {
      this.template = Handlebars.compile($('#landing-top-level-view-template').html());
      this.render();
    },

    render: function() {
      var data = {};
      this.$el.html(this.template(data));
    }, 

    navigateToEvents: function(event) {
      event.preventDefault();
      window.location.assign("/events");
    }

  });

})(jQuery);