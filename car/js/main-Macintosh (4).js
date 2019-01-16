var bmw, fbx, fbxParts, materialsLib, envMap;
var fbxParts = {
        body: [],
        rims:[],
        glass: [],
      };
var params = {
        projection: 'normal',
        autoRotate: true,
        reflectivity: 1.0,
        background: false,
        exposure: 1.0,
        gemColor: 'White',
        glassColor: 'White',
        rims: 'rims1'
      }

window.onload = function() {

var scene = new THREE.Scene();
scene.fog = new THREE.Fog( 0xdad8d5, 1000, 6000);
envMap = new THREE.CubeTextureLoader()
       .setPath( 'model/')
       .load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
scene.background = envMap;

envMapPol = new THREE.CubeTextureLoader()
       .setPath( 'model/')
       .load( [ 'TARMAC72.jpg']);
scene.ground = envMapPol;

var camera = new THREE.PerspectiveCamera( 65, window.innerWidth/window.innerHeight, 0.6, 10000 );

var renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xE9E9E9 );
renderer.shadowMap.enabled = true;
document.body.appendChild( renderer.domElement );

camera.position.set(600, 300, 1000);


/*scene.add( new THREE.AmbientLight( 0x666666 ) );*/

var hemiLight = new THREE.HemisphereLight( 0xdad8d5, 0x666666, 1,5 );
        hemiLight.position.set( 1000, 500, 1000 );
        scene.add( hemiLight );

var light = new THREE.DirectionalLight( 0xdfebff, 0.2 );
        light.position.set( 50, 200, 100 );
        light.position.multiplyScalar( 1.3 );
        light.castShadow = true;
        light.shadow.mapSize.width = 512;
        light.shadow.mapSize.height = 512;
        var d = 1000;
        light.shadow.camera.left = - d;
        light.shadow.camera.right = d;
        light.shadow.camera.top = d;
        light.shadow.camera.bottom = - d;
        light.shadow.camera.far = 1000;
        scene.add( light );


// GROUND
        var gt = new THREE.TextureLoader().load( "model/TARMAC2.jpg" , function ( map ) {
          map.wrapS = THREE.RepeatWrapping;
          map.wrapT = THREE.RepeatWrapping;
          map.anisotropy = 10;
          map.repeat.set( 80, 80 );
  } );
        var groundGeo = new THREE.PlaneBufferGeometry( 100000, 100000 );
        var groundMat = new THREE.MeshPhongMaterial( { color: 0xdad8d5, map: gt} );
        groundMat.color.setHSL( 0, 0, 0.60 );

        var ground = new THREE.Mesh( groundGeo, groundMat);
        ground.rotation.x = - Math.PI / 2;
        ground.position.y = 0;
        ground.castShadow = true;
        ground.receiveShadow = true;
        ground.material.envMap = envMap;
        scene.add( ground );
/*
var texture = new THREE.TextureLoader().load( 'model/shadow.png', function ( map ) {
          map.wrapS = THREE.RepeatWrapping;
          map.wrapT = THREE.RepeatWrapping;
 });
var texGeo = new THREE.PlaneBufferGeometry( 5000, 5000 );
        var texMat = new THREE.MeshPhongMaterial( { color: 0xdad8d5, map: texture} );
        texMat.color.setHSL( 100, 100, 100 );
                var tex = new THREE.Mesh( texGeo, texMat);
        tex.rotation.x = - Math.PI / 2;
        tex.position.y = 0;
        tex.castShadow = true;
        tex.receiveShadow = true;
        tex.material.envMap = envMap;
        scene.add( tex );
*/
//model
  var loader = new THREE.FBXLoader();

  loader.load('model/BMWallRims.fbx',
  function (fbx){
    bmw = fbx;

     fbx.traverse( function ( child ) {
            if ( child.isMesh ) {
              child.castShadow = true;
              child.receiveShadow = true;
              child.material.envMap = envMap;
              child.material.envMapPol = envMapPol;
              if(child.name == "body")
        {
          fbxParts.body = child;
        }
        if(child.name == "glass")
        {
          fbxParts.glass = child;
        }
            }
        if(child.name == "rims1")
        {
          fbxParts.rims1 = child;
          child.visible = false;
        }
        if(child.name == "rims2")
        {
          fbxParts.rims2 = child;

        }
     });
    scene.add(fbx);
  },
  function (xhr) {
    console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
  },
    function (err) {
    console.error( 'An error happened' );
  }
);

// controls
        var controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.maxPolarAngle = Math.PI * 0.5;
        controls.minDistance = 300;
        controls.maxDistance = 1000;//
        window.addEventListener( 'resize', onWindowResize, false );


var gui = new dat.GUI();
       var comboBox =  gui.add( params, 'gemColor', [ 'Blue', 'Green', 'Red', 'White', 'Black' ] );
       var comboBox2 =  gui.add( params, 'glassColor', [ 'White', 'Black' ] );
       var comboBox3 =  gui.add( params, 'rims', [ 'rims1', 'rims2' ] );
      gui.open();

    comboBox.onChange(function(value){
      var newColor = new THREE.Color( 0x000000 );
      switch ( value ) {
            case 'Blue': newColor = new THREE.Color( 0x4580ba ); break;
            case 'Red': newColor = new THREE.Color( 0xe82400 ); break;
            case 'Green': newColor = new THREE.Color( 0x6abb3c ); break;
            case 'White': newColor = new THREE.Color( 0xffffff ); break;
            case 'Black': newColor = new THREE.Color( 0x8d9197 ); break;
          };
      fbxParts.body.material.color = newColor;
      });

    comboBox2.onChange(function(value){
      var newColor2 = new THREE.Color( 0x000000 );
      switch ( value ) {
            case 'White': newColor2 = new THREE.Color( 0x4580ba ); break;
            case 'Black': newColor2 = new THREE.Color( 0x000000 ); break;
          };
      fbxParts.glass.material.color = newColor2;
      });

/*comboBox3.onChange(function(value){
      var newRims = new THREE.Object3D();
      switch ( value ) {
        case 'rims1': newRims = new THREE.Object3D(function hideContainer() {
fbxParts.rims2.getElementById('rims2').style.display = "none";
        }
function showConatainer() {
fbxParts.rims1.getElementById("rims1").style.display = "block";
}
        );

        case 'rims2': newRims = new THREE.Object3D(function hideContainer() {
fbxParts.rims1.getElementById('rims1').style.display = "none";
        });
     };
     fbxParts.rims2 = fbxParts.rims1 = newRims;
});*/
 //resetSliders('slider1');


        window.addEventListener( 'resize', onWindowResize, false );

animate();
function animate(){
  requestAnimationFrame(animate);
  scene.rotation.y+=0.002;
}
//
      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
      }


  var rendering = function () {
    requestAnimationFrame(rendering);
    controls.update();
  	renderer.render(scene, camera);
  };

  rendering();
};


