let isSwiping = false;
let startX;
let startY;
let currentX = 0;
let currentY = 0;
let sensivity = 30 / 10000
let swipeDelta = [0, 0]
let viewPosition = [0, 0, -50]
let scale = [1.0, 1.0, 1.0]
let figureColor = [1.0, 1.0, 1.0]
let b = 1
let c = 1
let maxX = 9
let deltaX = 0.3
let deltaAngle = 12

let lightColor = [1.0, 1.0, 1.0]
let lightDirection = [0.0, -1.0, 1.0]
let lightIntensity = 0.4

let ambientColor = [0.0, 0.0, 0.0]
let shininess = 1

let canvas
let gl
let tex;
let textures = []
let currentTexture = 0
let centerUV = [0, 0]
let scaleUV = 1
let boxPosition = [0, 0, 0]

let eyeSeparation = 0.4;
let fov = 45.0;
let nearClipping = 10.0;
let convergence = 2000.0;
let parallax = 0.1;