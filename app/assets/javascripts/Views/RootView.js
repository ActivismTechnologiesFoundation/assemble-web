(function ($) {

  AssembleApp.Views.RootView = Backbone.View.extend({
    el: $("#landing-top-level-view"),

    events: {
      'submit .zipcode-form' : 'navigateToEvents',
      'keyup .zipcode-form input': 'validate'
    },

    initialize: function(options) {
      this.template = Handlebars.compile($('#landing-top-level-view-template').html());
      this.render();
    },

    validate: function(event) {
      event.preventDefault();

      var $input = $(event.currentTarget);
      $input.val($input.val().match(/^(\d{0,5}).*$/)[1]);
    },

    render: function() {
      var data = {};
      this.$el.html(this.template(data));
    }, 

    navigateToEvents: function(event) {
      event.preventDefault();

      var zipcode = this.$('.zipcode-form input').val();
      superagent
        .get('/api/zipcodes/validate')
        .query({zipcode: zipcode })
        .end(function(error, response){
          if(!error && response.body.valid) {
            window.location.assign("/events");
          }
          else {
            AssembleApp.Views.FlashView.showError(
              "Unfortunately we haven't reached your area yet."
            );
          }
        });
    }

  });

})(jQuery);