(function ($) {

    _.extend(Backbone.Validation.patterns, {
        date_mm_dd_yyyy: /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/((19|20)\d{2})\s*((0[1-9]|1[0-2]):(0[0-9]|[1-5][0-9])\s*[aApP][mM])?\s*$/,
    });

    _.extend(Backbone.Validation.messages, {
        date_mm_dd_yyyy: 'Invalid date. Must be in format mm/dd/yyyy'
    });

    _.extend(Backbone.Validation.attributeLoaders, {
        validatable: function(view) {
            return _.map(view.$('input.validatable'), function(input) { 
                return input.getAttribute('id'); 
            } );
        }
    });

    _.extend(Backbone.Validation.validators, {
        valid_date: function(value, attr, customValue, model) {
            if (value && value.isBefore(moment())) {
                return "Date can't be in the past";
            }
            else if (value) {
                var fn = Backbone.Validation.validators.pattern;
                return fn(value.format('MM/DD/YYYY hh:mm a'), attr, 'date_mm_dd_yyyy', model);
            }
        }
    });

    Backbone.Validation.configure({
        selector: 'id',
        attributes: 'validatable'
    });
})(jQuery);
