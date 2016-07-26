'use strict';

// @require ./index.styl

module.exports = {
  url         : '<%= routeUrl %>',
  template    : __inline('./index.html'),
  data        : {
    pageName: '<%= routePageName %>'
  },
  controllerAs: 'vm',
  controller  : Controller
};

// @ngInject
function Controller() {
  var vm;

  vm = this;
  init();

  function init() {
    vm.text = 'hello <%= routePageName %>';
  }
}