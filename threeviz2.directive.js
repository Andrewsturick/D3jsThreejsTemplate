angular.module('inspinia')
    .directive('threeViztwo', function(d3Service, THREEService, dataPrepService, $rootScope){
      return {
        restrict: "EA",
        scope: {
          data:"@"
        },
        link: function(scope, el, attr){
          var camera, scene, renderer, controls, spotLight;

          //must be done since firebase arrays have weird properties when passed into scope?
          scope.data = attr.data
          scope.sizeParam = "Volume";
          scope.colorParam = "PercentChange"
          scope.yParam = "LastTradePriceOnly"
          function init(){
            var dimensions = {
              height: window.innerHeight,
              width: window.innerWidth
            }

            //scene init
            scene = new THREE.Scene();
            //camera init
            camera = new THREE.PerspectiveCamera(45, dimensions.width/dimensions.height, 1, 100000)
            camera.position.z = -5000;
            camera.position.y = 5000;
            camera.lookAt
            scene.add(camera)
            //renderer init
            renderer = new THREE.WebGLRenderer()
            renderer.setClearColor(0xdddddd, 1.0)
            renderer.setSize(dimensions.width,dimensions.height)
            renderer.shadowMapEnabled = true;
            //controls init
            controls = new THREE.OrbitControls( camera );
            controls.addEventListener( 'change', renderer.render );
            //append to DOM
            document.getElementById('threejsd3').appendChild(renderer.domElement)

            spotLight = new THREE.SpotLight( 0xffffff );
            spotLight.castShadow= true;
            spotLight.position.set( 1000, 10000,10000);
            scene.add( spotLight );

          }



















          //json stringify firebase objects as they change
          scope.$watch(function(){
            return scope.data
          }, function(n,o){
            if(n && o){
              scope.data = angular.fromJson(n);
              addObjectsToScene(scope.data)

            }
          })
          //when threejs is loaded, initialize threejs functions
          $rootScope.$on('threejsLoaded', function(event, data){
            init();
            animate();
          })

          //animation
          function animate(){
            requestAnimationFrame(animate)
            renderer.render(scene, camera)
            controls.update();

          }
        }
      }
    })
