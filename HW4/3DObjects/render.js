/**
 * Created by Hans Dulimarta.
 */
var modelMat = mat4.create();
var canvas, paramGroup;
var currSelection = 0;
var currRotationAxis = "rotx";
var posAttr, colAttr, modelUnif;
var gl;
var obj;

function main() {
  canvas = document.getElementById("gl-canvas");

  /* setup event listener for drop-down menu */
  var menu = document.getElementById("menu");
  menu.addEventListener("change", menuSelected);

  /* setup click listener for th "insert" button */
  var button = document.getElementById("insert");
  button.addEventListener("click", createObject);

  /* setup click listener for the radio buttons (axis of rotation) */
  var radioGroup = document.getElementsByName("rotateGroup");
  for (var r of radioGroup) {
    r.addEventListener('click', rbClicked);
  }

  paramGroup = document.getElementsByClassName("param-group");
  paramGroup[0].hidden = false;

  /* setup window resize listener */
  window.addEventListener('resize', resizeWindow);

  gl = WebGLUtils.create3DContext(canvas, null);
  ShaderUtils.loadFromFile(gl, "vshader.glsl", "fshader.glsl")
  .then (prog => {

    /* put all one-time initialization logic here */
    gl.useProgram (prog);
    gl.clearColor (0, 0, 0, 1);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    /* the vertex shader defines TWO attribute vars and ONE uniform var */
    posAttr = gl.getAttribLocation (prog, "vertexPos");
    colAttr = gl.getAttribLocation (prog, "vertexCol");
    modelUnif = gl.getUniformLocation (prog, "modelCF");
    gl.enableVertexAttribArray (posAttr);
    gl.enableVertexAttribArray (colAttr);

    /* calculate viewport */
    resizeWindow();

    /* initiate the render loop */
    render();
  });
}

function drawScene() {
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  /* in the following three cases we rotate the coordinate frame by 1 degree */
  switch (currRotationAxis) {
    case "rotx":
      mat4.rotateX(modelMat, modelMat, Math.PI / 180);
      break;
    case "roty":
      mat4.rotateY(modelMat, modelMat, Math.PI / 180);
      break;
    case "rotz":
      mat4.rotateZ(modelMat, modelMat, Math.PI / 180);
  }

  if (obj) {
    obj.draw(posAttr, colAttr, modelUnif, modelMat);
  }
}

function render() {
  drawScene();
  requestAnimationFrame(render);
}

function createObject() {
  obj = null;
  mat4.identity(modelMat);
  switch (currSelection) {
    case 0:
      height = document.getElementById("cone-height").valueAsNumber;
      radiusBottom = document.getElementById("cone-radius").valueAsNumber;
      div = document.getElementById("cone-subdiv").valueAsNumber;
      vertStacks = document.getElementById("vert-stacks").valueAsNumber;
      //console.log ("Cone radius: " + radiusBottom + " height: " + height + " sub division: " + subDiv + " vertical stacks: " + vertStacks);
      obj = new Cone(gl, radiusBottom, height, div, vertStacks);
      break;
    case 1:
      /* TODO: obtain user input parameters and create the object */
      height = document.getElementById("trunc-cone-height").valueAsNumber;
      radiusBottom = document.getElementById("trunc-cone-radius-bottom").valueAsNumber;
      radiusTop = document.getElementById("trunc-cone-radius-top").valueAsNumber;
      div = document.getElementById("trunc-cone-subdiv").valueAsNumber;
      vertStacks = document.getElementById("trunc-cone-stacks").valueAsNumber;
      //console.log ("Cylinder radius bottom: " + radiusBottom + " radius top:" + radiusTop + " height: " + height + " sub division: " + subDiv + " stacks: " + vertStacks);
      obj = new TruncCone(gl, radiusBottom, radiusTop, height, div, vertStacks);
      break;
    case 2:
      /* TODO: obtain user input parameters and create the object */
      size = document.getElementById("cube-size").valueAsNumber;
      div = document.getElementById("cube-subdiv").valueAsNumber;
      obj = new Cube(gl, size, div);
      break;
    case 3:
      /* TODO: obtain user input parameters and create the object */
      radiusBottom = document.getElementById("sphere-radius").valueAsNumber;
      latLines = document.getElementById("sphere-lat").valueAsNumber;
      longLines = document.getElementById("sphere-long").valueAsNumber;
      console.log ("Sphere radius: " + radiusBottom + " lat lines: " + latLines + " long lines: " + longLines);
      obj = new Sphere(gl, radiusBottom, latLines, longLines);
      break;
      case 6:
        /* TODO: obtain user input parameters and create the object */
          innerRadius = document.getElementById("ring-outer-radius").valueAsNumber;
          outerRadius = document.getElementById("ring-inner-radius").valueAsNumber;
          vertStacks = document.getElementById("ring-stacks").valueAsNumber;
          height = document.getElementById("ring-height").valueAsNumber;
          divs = document.getElementById("ring-subdiv").valueAsNumber;
          //console.log ("Sphere radius: " + radiusBottom + " lat lines: " + latLines + " long lines: " + longLines);
          obj = new Ring(gl, innerRadius, outerRadius, height, vertStacks, divs);
          break;
  }
}

function resizeWindow() {
  var w = 0.98 * window.innerWidth;
  var h = 0.6 * window.innerHeight;
  var size = Math.min(0.98 * window.innerWidth, 0.65 * window.innerHeight);
  /* keep a square viewport */
  canvas.width = size;
  canvas.height = size;
  gl.viewport(0, 0, size, size);
}

function menuSelected(ev) {
  var sel = ev.currentTarget.selectedIndex;
  paramGroup[currSelection].hidden = true;
  paramGroup[sel].hidden = false;
  currSelection = sel;
  console.log("New selection is ", currSelection);
}

function rbClicked(ev) {
  currRotationAxis = ev.currentTarget.value;
  console.log(ev);
}