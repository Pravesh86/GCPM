(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Specialities = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Specialities.prototype, {

    defaults: {
      multiple: true,
      name: 'specialities[]',
      label: 'Specialities',
      placeholder: 'All specialities',
      blank: null,
      addNew: false,
      select2Options: {
        // closeOnSelect: false
        // It solves the closing of the dropdown menu
        // It adds a lot of UX issues
        // - Scroll: On select, scroll will go to first highlighted choice => How to resolve the scroll issue https://github.com/select2/select2/issues/1672#issuecomment-240411031
        // - Click: On each click dropdown will appear and dissapear
      }
    },

    initialize: function(viewSettings) {
      this.state = new StateModel();
      this.specialities = new App.Collection.Specialities(); // @TODO
      this.options = _.extend({}, this.defaults, viewSettings || {});

      // Creating view
      this.select = new App.View.Select({
        el: '#specialities',
        options: this.options,
        state: this.state
      });

      this.setEvents();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.state.on('change', function() {
        App.trigger('Specialities:change', this.state.attributes);
      }, this);

      this.select.on('change', this.setState, this);
    },

    /**
     * Fetch specialities from API
     * @return {Promise}
     */
    fetchData: function() {
      return this.specialities.fetch().done(function() {
        var options = this.specialities.map(function(type) {
          return {
            name: type.attributes.name,
            value: type.attributes.id
          };
        });
        this.select.setOptions(options);
      }.bind(this));
    },

    render: function() {
      this.select.render();
    },

    /**
     * Method to set a new state
     * @param {Object} state
     */
    setState: function(state, options) {
      this.state.set(state, options);
    },

    setValue: function(values){
      this.select.$el.find("select").val(values).trigger("change");
    },

    setFetchedValues: function(values){
      var vals = values.map(function(elem){
        return elem.id;
      });
      this.select.$el.find("select").val(vals).trigger("change");
    },

    /**
     * Rebinding element, events and render again
     * @param {DOM|String} el
     */
    setElement: function(el) {
      this.select.setElement(el);
    },

    /**
     * Exposing DOM element
     * @return {DOM}
     */
    getElement: function() {
      return this.select.$el;
    }

  });

})(this.App);
