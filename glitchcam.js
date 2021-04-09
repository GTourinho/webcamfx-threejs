import * as THREE from './resources/three.js/r126/build/three.module.js';
import { EffectComposer } 	from './resources/three.js/r126/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } 		from './resources/three.js/r126/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } 		from './resources/three.js/r126/examples/jsm/postprocessing/ShaderPass.js';
import { GlitchPass } 		from './resources/three.js/r126/examples/jsm/postprocessing/GlitchPass.js';
import { AfterimagePass } 		from './resources/three.js/r126/examples/jsm/postprocessing/AfterimagePass.js';
import { SMAAPass } 		from './resources/three.js/r126/examples/jsm/postprocessing/SMAAPass.js';
import { HalftonePass } 		from './resources/three.js/r126/examples/jsm/postprocessing/HalftonePass.js';

var texture;
var renderer;
var scene;
var camera;
var video;

function main() {
	scene 		= new THREE.Scene();
	renderer 	= new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( 1280, 720 );

	document.getElementById("WebGL-output").appendChild(renderer.domElement);	
	video 		= document.getElementById( 'video' );

	camera 		= new THREE.OrthographicCamera( -0.5, 0.5, 0.5, -0.5, -1.0, 1.0 );
	scene.add( camera );

	var planeGeometry 	= new THREE.PlaneBufferGeometry();      
	const texture 		= new THREE.VideoTexture( video );  
  var planeMat 		= new THREE.MeshBasicMaterial( { map:texture } );    
	var plane 			= new THREE.Mesh( planeGeometry, planeMat );  
	scene.add( plane );

	if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {
		const constraints = { video: 	{ 	width		: 1280, 
											height		: 720, 
											facingMode	: 'user' 
										} 
							};
		navigator.mediaDevices.getUserMedia( constraints ).then( fStream ).catch( videoError);
		}

	else 
		console.error( 'MediaDevices interface not available.' );

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);		
  composer.addPass(renderPass);
  const glitchPass = new GlitchPass();
  composer.addPass(glitchPass);
  const afterImagePass = new AfterimagePass();
  composer.addPass(afterImagePass);
  const smaaPass = new SMAAPass();
  composer.addPass(smaaPass);
  const halftonePass = new HalftonePass();
  halftonePass.renderToScreen = true;
  composer.addPass(halftonePass);

  
	animate();

  function animate() {

  composer.render();
  requestAnimationFrame( animate );
  };

};

function fStream( stream ) {
	video.srcObject = stream;
	video.play();
} 


function videoError ( error ) {
	console.error( 'Unable to access the camera/webcam.', error ); 
}; 



main();
