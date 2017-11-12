
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
	renderer.setBackgroundColor(0, 0, 0, 1);
	renderer.load(canvas, vertexSource, fragmentSource);

	// Initialize cameracontroller
	let cameraController = new CameraController();
	cameraController.installCamera(canvas, function(viewMatrix, dt)
	{
		renderer.setViewMatrix(viewMatrix);
		renderer.draw(dt);
	});	
	
	
	let goToCenter = function()	
	{
		let eye = vec3.fromValues(0, 0, 2);
		let center = vec3.fromValues(0, 0, 0);
		let up = vec3.fromValues(0.0, 1.0, 0.0);

		cameraController.setCamera(eye, center, up);
	}
	goToCenter();
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

	let planetmesh = generateSphereMesh(128);

	renderer.addObject(planetmesh.vertices, planetmesh.elements, [1, 1, 1, 1], "default");

	let img = document.getElementById("world-texture");
	img.onload = function(e)
	{
		renderer.addTexture("default", img);
	}
}
