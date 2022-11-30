import { useEffect, useRef } from 'react';
import './App.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader';
function App() {
  const ref = useRef(null);
  useEffect(()=>{
 
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    scene.fog = new THREE.Fog( 0xa0a0a0, 10, 500 );

    const camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 500 );
    camera.position.set( - 50, 40, 50 );
    scene.add( camera );

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 100, 0 );
    scene.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( - 0, 40, 50 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = - 25;
    dirLight.shadow.camera.left = - 25;
    dirLight.shadow.camera.right = 25;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.set( 1024, 1024 );
    scene.add( dirLight );


    const renderer = new THREE.WebGLRenderer( { antialias: true , canvas:ref.current! } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild( renderer.domElement );
    const ground = new THREE.Mesh( new THREE.PlaneGeometry( 1000, 1000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    ground.rotation.x = - Math.PI / 2;
    ground.position.y = 11;
    ground.receiveShadow = true;
    scene.add( ground );
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 50;
    controls.maxDistance = 200;
    controls.enablePan = false;
    controls.target.set( 0, 20, 0 );

    const render= ()=> {
      controls.update();
      renderer.render( scene, camera );
    }
    const onWindowResize = ()=> {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );

      render();

    }


    const manager = new THREE.LoadingManager();

    const loader = new ThreeMFLoader( manager );
    loader.load( '/baoding.3MF', function ( object ) {

      // object.quaternion.setFromEuler( new THREE.Euler( - Math.PI / 2, 0, 0 ) ); 	// z-up conversion
      object.scale.set(0.01 , 0.01 , 0.01)
      object.traverse( function ( child ) {

        child.castShadow = true;

      } );

      scene.add( object );

    } );

    window.addEventListener( 'resize', onWindowResize );

    let id:number ;
		const animate = ()=> {

				id = requestAnimationFrame( animate );
				render();

		}
    animate();
    return ()=>{
      cancelAnimationFrame(id);
      window.removeEventListener('resize' , onWindowResize);

    }
  },[])
  

  return (
    <canvas style={{width:'100%', height:'100%'}} ref={ref}  className="App">
    </canvas>
  );
}

export default App;
