// Mapeando uma imagem em Three.js

import * as THREE from './resources/three.js/r126/build/three.module.js';

var texture;
var renderer;
var scene;
var camera;
var video;
const m = new THREE.Matrix4();
var puzzle = [0,1,2,3,4,5,6,7,8,9,10,11,-1,13,14,15];
var matShader = null;
var mouse = new THREE.Vector3();
var nullRow;
document.addEventListener( 'click',  onDocumentMouseDown, false);

function main() {
	scene 		= new THREE.Scene();
  puzzle = shuffleBase(puzzle);
  var emptyTile = -1;
  var nInversions = 0;
  for (var i = 0; i < 15; i++){
    if (puzzle[i] == emptyTile){
      continue;
    }
    for(var j = i+1; j < 16; j++){
      if(puzzle[j] < puzzle[i] && puzzle[j]!= emptyTile){
        nInversions++;
      }
    }
  }
  for(var i = 0; i < 16; i++){
    if(puzzle[i] == -1){
      nullRow = (i % 4)+1;
      console.log(nullRow);
    }
  }
  if(isSolvable(nInversions, nullRow)==false){
    puzzle = turnSolvable(puzzle);
  }
  m.fromArray(puzzle);
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
    currentMatrix     :   {   type: "mat4", value: m},
    uPixelSize		:	{ 	type: "v2", 
            value: new THREE.Vector2(1.0/1280.0, 1.0/720.0)}
  };

   
  matShader = new THREE.ShaderMaterial( {
    uniforms		: uniform,
    vertexShader	: document.getElementById( 'slidingpuzzle-vs' ).textContent,
    fragmentShader	: document.getElementById( 'slidingpuzzle-fs' ).textContent,
    
  } );
  matShader.uniforms.enable = 0.0;

	var plane = new THREE.Mesh( planeGeometry, matShader );

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
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
};

function shuffleBase(newArray) {
    for (var i = newArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = newArray[i];
        newArray[i] = newArray[j];
        newArray[j] = temp;
    }
    return newArray;
}
function onDocumentMouseDown( event ) {
  var rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ( ( event.clientX - rect.left ) / ( rect.width - rect.left ) );
  mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) + 1;
  if(mouse.x > 0 && mouse.y > 0 && mouse.x < 1 && mouse.y < 1){
    mouse.set(Math.floor(mouse.x / 0.25), Math.floor(mouse.y/0.25), 0);
    var clickedMatrix = mouse.x*4 + mouse.y;
    if(mouse.y > 0 && m.elements[clickedMatrix-1] == -1){
      [m.elements[clickedMatrix-1], m.elements[clickedMatrix]] = [m.elements[clickedMatrix], m.elements[clickedMatrix-1]];
    }
    else if(mouse.y < 3 && m.elements[clickedMatrix+1] == -1){
      [m.elements[clickedMatrix+1], m.elements[clickedMatrix]] = [m.elements[clickedMatrix], m.elements[clickedMatrix+1]];

    }
    else if(mouse.x > 0 && m.elements[clickedMatrix-4] == -1){
      [m.elements[clickedMatrix-4], m.elements[clickedMatrix]] = [m.elements[clickedMatrix], m.elements[clickedMatrix-4]];
    }
    else if(mouse.x < 3 && m.elements[clickedMatrix+4] == -1){
      [m.elements[clickedMatrix+4], m.elements[clickedMatrix]] = [m.elements[clickedMatrix], m.elements[clickedMatrix+4]];

    }
  }
  matShader.uniforms.currentMatrix.value = m;
}

function isSolvable(nInversions, nullRow){
    if (nullRow % 2 != 0){
      return (nInversions % 2 == 0);
    }
    else{
      return (nInversions % 2 != 0);
    }
}

function turnSolvable(puzzle){
    if(puzzle[0] != -1 && puzzle[1] != -1)
    {
        [puzzle[0], puzzle[1]] = [puzzle[1], puzzle[0]];
        return puzzle;
    }
    else
    {
        [puzzle[15], puzzle[14]] = [puzzle[14], puzzle[15]];
        return puzzle;
    }
}
main();

