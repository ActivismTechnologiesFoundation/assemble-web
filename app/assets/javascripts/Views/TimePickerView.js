AssembleApp.Views.Timepicker = Backbone.View.extend({
  initialize: function() {

    this.template = Handlebars.compile($('#time-picker-view-template').html());

    var times = [];
    for(var i=0; i<60; i++) { times.push({ name: i, value: i}); }

    this.hourSelect = new AssembleApp.Views.CustomSelectView({
      collection: new Backbone.Collection(times.slice(1, 13))
    });

    this.minuteSelect = new AssembleApp.Views.CustomSelectView({
      collection: new Backbone.Collection(times)
    });

  },

  render: function() {
    var data = {};

    this.$el.html(this.template(data));

    this.hourSelect.setElement(this.$('.hour')).render();
    this.minuteSelect.setElement(this.$('.minute')).render();

    return this.$el;
  }
});