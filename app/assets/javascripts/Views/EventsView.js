(function ($) {

  AssembleApp.Views.EventsView = Backbone.View.extend({
    el: $("#events-top-level-view"),

    initialize: function() {
      this.template = Handlebars.compile($("#events-top-level-view-template").html());
      this.eventsCollection = new AssembleApp.Collections.Events();

      this.eventsListView = new AssembleApp.Views.ListView({
        collection: this.eventsCollection,
        view: AssembleApp.Views.EventListCellView,
        type: "event"
      });

      this.render();

      this.eventsCollection.fetch({reset: true});//{success: _.bind(function(response){console.log(response)}, this)});
    },

    render: function() {
      var data = {};

      this.$el.html(this.template(data));

      this.assign(this.eventsListView, "#events-list");

      return this.$el;
    },

    assign: function(view, selector) {
      view.setElement(this.$(selector)).render();
    }

  });

  AssembleApp.Views.EventListCellView = Backbone.View.extend({
    tagName: "li",

    className: "event-cell",

    initialize: function(){
      this.template = Handlebars.compile($("#event-list-cell-view-template").html());
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    }
  });

})(jQuery);
