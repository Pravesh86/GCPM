(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Input = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Input.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.Input = new App.View.Input({
        el: '#title',
        options: {
          name: 'title',
          class: '',
          inputClass: '-large',
          type: 'text',
          placeholder: 'Project Title_'
        }
      });
    },

    setInputValue: function(input) {
      var value = input.$el.find('input')[0].value;
      var obj = {};
      obj[input.options.name] = value;

      this.state.set(obj);
    },

    render: function() {
      this.Input.render();
    },

    render: function(){
      this.Input.render();
    },

    setState: function(state, options) {
      this.state.set(state, options);
    },

    setElement: function(el) {
      this.Input.setElement(el);
    },

    getElement: function() {
      return this.Input.$el;
    }

  });

})(this.App);
