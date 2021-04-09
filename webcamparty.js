// Mapeando uma imagem em Three.js

import * as THREE from './resources/three.js/r126/build/three.module.js';

var texture;
var renderer;
var scene;
var camera;
var video;
var changePattern = 0
var matShader = null;
var clock = 0.0;
var dir = 0.0;

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
	
	// Plane
	var planeGeometry 	= new THREE.PlaneBufferGeometry();        

	const texture 		= new THREE.VideoTexture( video );

  const uniform = {
    uSampler 		: 	{ 	type: "t", 	value:texture },
    clock 				: 	{ 	type: "float", value:clock },
    changePattern : { type: "int", value: changePattern }
  };

   
  matShader = new THREE.ShaderMaterial( {
    uniforms		: uniform,
    vertexShader	: document.getElementById( 'party-vs' ).textContent,
    fragmentShader	: document.getElementById( 'party-fs' ).textContent
  } );
  matShader.uniforms.enable = 0.0;
	var plane 			= new THREE.Mesh( planeGeometry, matShader );

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
		
	renderer.clear();
	animate();
};

function fStream( stream ) {
	// apply the stream to the video element used in the texture
	video.srcObject = stream;
	video.play();
} 


function videoError ( error ) {
	console.error( 'Unable to access the camera/webcam.', error ); 
}; 

function animate() {
  clock += dir;
  if(clock >= 1.0){
    dir = -0.01
    changePattern = (changePattern + 1) % 3
  }
  if(clock <= 0.0){
    dir = 0.01
    changePattern = (changePattern + 1) % 3
  }
  matShader.uniforms.clock.value = clock
  matShader.uniforms.changePattern.value = changePattern
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
};

main();

