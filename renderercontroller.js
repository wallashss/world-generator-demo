
window.addEventListener("load", function()
{
	 initRenderer();
});

var renderer = undefined;


function initRenderer()
{
	let viewController = document.getElementById("view_controller");
	
	// Init renderer	
	let canvas = document.getElementById("canvas");

	let vertexScript = document.getElementById("vertex-shader");
	let fragmentScript = document.getElementById("fragment-shader");
	
	let vertexSource = vertexScript.childNodes[0].nodeValue;
	let fragmentSource = fragmentScript.childNodes[0].nodeValue;
	
	renderer = new Renderer();
	renderer.setBackgroundColor(0, 0, 0);
	renderer.load(canvas, vertexSource, fragmentSource);

	// Initialize cameracontroller
	let cameraController = new CameraController();
	cameraController.installCamera(canvas, function(viewMatrix, dt)
	{
		renderer.setViewMatrix(viewMatrix);
		renderer.draw(dt);
	});	
	

	// Scene Controller
	let sceneController = new SceneController();
	
	let goToCenter = function()	
	{
		let size =  sceneController.getSize();
		let center = sceneController.getCenter();
		let eye = vec3.fromValues(center[0], center[1], center[2] - size[2] - 1);
		let up = vec3.fromValues(0.0, 1.0, 0.0);

		cameraController.setVelocity(Math.min(Math.min(size[0], size[1]), size[2]));
		cameraController.setCamera(eye, center, up);
	}
	window.addEventListener("keypress", function(e)
	{
		if(e.key === "E" || e.key === "e")
		{
			cameraController.setExamineMode();
		}
		else if(e.key === "F" || e.key === "f")
		{
			cameraController.setFlyMode();
		}
		else if(e.key === "R" || e.key === "r")
		{
			goToCenter();
			cameraController.setExamineMode();
		}
	});

	let planetmesh = generateSphereMesh(16);

	renderer.addObject(planetmesh.vertices, planetmesh.elements, [1, 1, 1, 1], "default");

	let img = document.getElementById("world-texture");
	img.onload = function(e)
	{
		renderer.addTexture("default", img);
	}
	// renderer.addObject( [
	// 		 1.0,  0.0,  0.0, 	0.0, 0.0, -1.0,		0.0, 0.0,
	// 		 0.0, 1.0,  0.0,	0.0, 0.0, -1.0,		0.0, 0.0,
	// 		 0.0, 0.0,  0.0,	0.0, 0.0, -1.0,		0.0, 0.0
	// 	], [0, 1, 2]);
	// Init obj uploader
	

	// Upload texture
	// let imgUploader = document.getElementById("img_file");
	
	// imgUploader.addEventListener("change", function(e)
	// {
	// 	let files = e.target.files;
	// 	let file = files[0];		
	// 	let reader = new FileReader();
		
	// 	reader.onload = function(e)
	// 	{
	// 		let img = new Image();
	// 		img.width = "150";
	// 		img.height = "150";
	// 		img.src = e.target.result;
			
	// 		img.onload = function(e)
	// 		{
	// 			renderer.addTexture("default", img);
	// 			viewController.appendChild(img);
	// 		}
	// 		// let obj = objreader.readObjects(e.target.result);
	// 	};
		
	// 	reader.readAsDataURL(file);
	// });
	
	// let button = document.getElementById("animate_button");
// 	button.addEventListener("click", function()
// 	{
// 		// UGLIEST EVER =D
// 		if(button.value == "Start")
// 		{
// 			button.value = "Stop";
// 			renderer.startAnimation();
// 		}
// 		else
// 		{
// 			button.value = "Start"; // =DDDDD
// 			renderer.stopAnimation();
// 		}
// 	});
}