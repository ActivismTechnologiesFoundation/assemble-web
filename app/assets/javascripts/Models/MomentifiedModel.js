
(function () {

    Backbone.MomentifiedModel = Backbone.Model.extend({
        constructor: function (attributes, options) {
            attributes || (attributes = {});
            options || (options = {});

            this.format || (this.format = options.format);

            this._momentify(attributes);

            arguments[0] = attributes;
            
            Backbone.Model.prototype.constructor.apply(this, arguments);
        }, 

        momentify_attributes: function(){
            this._momentify(this.attributes);
        },

        _momentify: function(attributes) {

            _.keys(attributes).forEach(_.bind(function (key) {
                var value = attributes[key];
                if (!!key.match(/_at$/) && !!value && !moment.isMoment(value)) {
                    if(this.format == "unix") {
                        attributes[key] = moment.unix(attributes[key]);
                    } else {
                        attributes[key] = moment(attributes[key]);
                    }

                }
            }, this));
        }
    });

})();
