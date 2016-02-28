'use strict';

/**
 * @ngdoc function
 * @name weatherAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the weatherAppApp
 */

 angular.module('weatherAppApp')
 .factory('weatherService', ['$http', '$q', function($http, $q){
 	console.log("Hello 1"); 
	function getWeather(postcode, country){
		var deferred = $q.defer();
		
		$http.get('http://api.openweathermap.org/data/2.5/weather?zip='+ postcode +',' + country +'&appid=44db6a862fba0b067b1930da0d769e98')
		.success(function(data){
			deferred.resolve(data);
		})
		.error(function(err){
			console.log('Error in fetching weather');
			deferred.reject(err);
		});
		return deferred.promise;
	}
	return {
		getWeather: getWeather
	};
}])

 .factory('geoLocationFactory', ['$q',function($q){
 	function getLocation(){
 		var deferred =$q.defer();
 		navigator.geolocation.getCurrentPosition(
 			function(result){
 				deferred.resolve(result);
 			},
 			function(err){
 				deferred.reject(err);
 			}
 		);
 		return deferred.promise;
 	}
 	return{
 	 getLocation: getLocation 
 	};
 	
 }])

 .factory('geoWeatherFactory', ['$http', '$q', function($http, $q){
 	function showWeather(lat,lon){
 	var deferred = $q.defer();
 
        $http.get('http://api.openweathermap.org/data/2.5/weather?lat='+lat+ '&lon='+lon+'&appid=44db6a862fba0b067b1930da0d769e98')
     .success(function(result){
     	deferred.resolve(result);
     })
     .error(function(err){
     	deferred.reject(err);
     });
     return deferred.promise;	
 	}
 
 	return{
 		showWeather: showWeather
 	};

 }])

.service('formShowHide', [function(){

    this.setFormShow = function(){
     return true;
    };

    this.setFormHide = function(){
    	return false;
    };

  }]);
  

angular.module('weatherAppApp')
  .controller('MainCtrl', ['$scope','geoLocationFactory','geoWeatherFactory', 'weatherService','formShowHide', function ($scope, geoLocationFactory, geoWeatherFactory, weatherService, formShowHide) {
    /*this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];*/
 
    $scope.formShow = formShowHide.setFormHide();
    
    //geoWeatherFactory.showWeather();
    function showPosition(){
     geoLocationFactory.getLocation().then(function(position){
     	geoWeatherFactory.showWeather(position.coords.latitude,position.coords.longitude).then(function(result){
     		$scope.forecast = result;
     		console.log($scope.forecast.main.temp);
     	})
     $scope.formShow = formShowHide.setFormHide();

     });
     $scope.formShow = formShowHide.setFormShow();
     $scope.findWeather = function(postcode, country){
    	$scope.forcaste ='';
    	$scope.place = '';
    	$scope.formShow = formShowHide.setFormHide();
    	fetchWeather(postcode, country);


    };
 }

 function fetchWeather(postcode, country){
    	weatherService.getWeather(postcode, country).then(function(result){
    		$scope.weatherForecast = result.weather;
    		$scope.forecast = result;
    		$scope.place = $scope.forecast.name;
    	});
    }
    showPosition(); 	 

  }]);

