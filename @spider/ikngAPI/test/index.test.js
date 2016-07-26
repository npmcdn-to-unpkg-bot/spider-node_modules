'use strict';

require('../lib/index');
require('angular-mocks/ngMock');

describe('ik.ngAPI', function() {
   var $httpBackend, ikngAPI, authRequestHandler;

   beforeEach(angular.mock.module('ik.ngAPI'));
   beforeEach(angular.mock.module(function(ikngAPIProvider){
    ikngAPIProvider.config({
      host: '/'
    });
  }));

  beforeEach(inject(function($injector) {
   $httpBackend = $injector.get('$httpBackend');
   ikngAPI = $injector.get('ikngAPI')('api');

   $httpBackend
   .whenGET(/^\/api\/user\?*/)
   .respond({name: 'get'});

   $httpBackend
   .whenPOST(/^\/api\/user\?*/)
   .respond({name: 'post'});

  }));

  afterEach(function() {
   $httpBackend.verifyNoOutstandingExpectation();
   $httpBackend.verifyNoOutstandingRequest();
  });

  it('should name is get', function() {
    ikngAPI
    .new('user')
    .get()
    .then(function(data){
      expect(data.name).toBe('get');
    });
    $httpBackend.flush();
  });

  it('should name is post', function() {
    ikngAPI
    .new('user')
    .post()
    .then(function(data){
      expect(data.name).toBe('post');
    });
    $httpBackend.flush();
  });

});