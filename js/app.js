angular.module('website', ['ngAnimate', 'ngTouch'])
.controller('MainCtrl', function ($scope) {
        
  $scope.slides = [];
  var i;
  $http.get('/api/users/' + $stateParams.userId + '/journeys/' + $stateParams.journeyId + '/posts')
  .success(function(data) {
    for(i=0;i<data.length;i++) {
      $scope.slides.push({image: data[i]['hi_res_img'], description: data[i]['caption']});
    }

    console.log($scope.slides);

    $scope.direction = 'left';
    $scope.currentIndex = 0;

    $scope.setCurrentSlideIndex = function (index) {
      $scope.direction = (index < $scope.currentIndex) ? 'left' : 'right';
      $scope.currentIndex = index;
    };

    $scope.isCurrentSlideIndex = function (index) {
      return $scope.currentIndex === index;
    };

    // $scope.isInGroupOfThreeAroundIndex = function(index) {
    //   if (index < ($scope.currentIndex - 1) || index > ($scope.currentIndex + 1)) {
    //     return false;
    //   }
    // };

    $scope.prevSlide = function () {
      $scope.direction = 'left';
      $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
    };

    $scope.nextSlide = function () {
      $scope.direction = 'right';
      $scope.currentIndex = ($scope.currentIndex < ($scope.slides.length - 1)) ? ++$scope.currentIndex : 0;
    };
  });
}])

.animation('.slide-animation', ['TweenMax'], function (TweenMax) {
  return {
    beforeAddClass: function (element, className, done) {
      var scope = element.scope();

      if (className === 'ng-hide') {
        var finishPoint = element.parent().width();
        if(scope.direction !== 'right') {
            finishPoint = -finishPoint;
        }
        TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done });
      }
      else {
        done();
      }
    },
    removeClass: function (element, className, done) {
      var scope = element.scope();

      if (className === 'ng-hide') {
        element.removeClass('ng-hide');

        var startPoint = element.parent().width();
        if(scope.direction === 'right') {
            startPoint = -startPoint;
        }

        TweenMax.fromTo(element, 0.5, { left: startPoint }, {left: 0, onComplete: done });
      }
      else {
        done();
      }
    }
  };
});



