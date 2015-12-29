AssembleApp.Views.Timepicker = Backbone.View.extend({
  initialize: function() {

    this.template = Handlebars.compile($('#time-picker-view-template').html());

    function timeObjects(times) {
      return _.map(times, function(i) { return { name: i, value: i}; });
    }

    var times = [],
        i;

    for(i=0; i<13; i++) { times.push(i); }
    this.hourSelect = new AssembleApp.Views.CustomSelectView({
      collection: new Backbone.Collection(timeObjects(times))
    });

    for(i=13; i<31; i++) { times.push(i); }
    this.minuteSelect = new AssembleApp.Views.CustomSelectView({
      collection: new Backbone.Collection(timeObjects(times))
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