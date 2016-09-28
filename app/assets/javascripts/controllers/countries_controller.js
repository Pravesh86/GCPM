(function(App) {

  'use strict';

  App.Controller.Countries = function() {};

  _.extend(App.Controller.Countries.prototype, {

    index: function(params) {
      new App.Presenter.CountriesList(params);
      new App.Presenter.UserNav(params);
    },

    show: function(params) {
      new App.Presenter.Map(params);
      new App.Presenter.TabNav(params);
      new App.Presenter.Toolbar(params);
      new App.Presenter.Breadcrumbs(params);
      new App.Presenter.UserNav(params);
    }

  });

})(this.App);