import {Vector, GraphVector, GraphPoint, FluidParticleManager} from "./Vector.js";
export class Display {
  static get Instance() {
    return this.instance;
  }
  get halfScreen() {
    return new Vector(this.screenWidth / 2, this.screenHeight / 2);
  }
  get maxMagnitudeVector() {
    return (this.unitToPixel - this.unitIntervals / 4) / this.unitIntervals;
  }
  constructor(_graphics) {
    this.graphics = _graphics;
    this.screenWidth = 800;
    this.screenHeight = 480;
    this.unitToPixel = 80;
    this.unitIntervals = 1;
    this.precisionDP = 1;
    this.epsilon = Math.pow(10, -this.precisionDP);
    this.c = 1;
    this.originTranslationVector = new Vector(0, 0);
    this.displayRangeX = [];
    this.displayRangeY = [];
    this.displayRange = [];
    this.FindDisplayRange();
    this.fluidParticleManager = new FluidParticleManager();
    this.fluidParticleMaxVelocity = 8;
    this.fluidParticleCount = 500;
    this.fluidParticleLifeTime = 10;
    this.fluidParticleTrailLength = 20;
    this.fluidParticleTrailOptimizer = 4;
  }
  static Initialize(_graphics) {
    this.instance = new Display(_graphics);
  }
  TranslateOrigin(translation) {
    this.originTranslationVector = Vector.Add(this.originTranslationVector, translation);
  }
  FindDisplayRange() {
    this.displayRangeX.length = 0;
    this.displayRangeY.length = 0;
    let xRange = Math.ceil(this.screenWidth / 2 / this.unitToPixel);
    let yRange = Math.ceil(this.screenHeight / 2 / this.unitToPixel);
    this.displayRange[0] = -xRange - Math.floor(this.originTranslationVector.x / this.unitToPixel) - 1;
    this.displayRange[1] = xRange - Math.ceil(this.originTranslationVector.x / this.unitToPixel) + 1;
    this.displayRange[2] = -yRange - Math.floor(this.originTranslationVector.y / this.unitToPixel) - 1;
    this.displayRange[3] = yRange - Math.ceil(this.originTranslationVector.y / this.unitToPixel) + 1;
    for (let i = 0; i <= this.displayRange[1]; i += 1 / this.unitIntervals) {
      if (i > -(this.screenWidth / 2 + this.originTranslationVector.x) / this.unitToPixel && i < (this.screenWidth / 2 - this.originTranslationVector.x) / this.unitToPixel) {
        this.displayRangeX.push(i);
      }
    }
    for (let i = 0; i >= this.displayRange[0]; i -= 1 / this.unitIntervals) {
      if (i > -(this.screenWidth / 2 + this.originTranslationVector.x) / this.unitToPixel && i < (this.screenWidth / 2 - this.originTranslationVector.x) / this.unitToPixel) {
        this.displayRangeX.unshift(i);
      }
    }
    for (let i = 0; i <= this.displayRange[3]; i += 1 / this.unitIntervals) {
      if (i > -(this.screenHeight / 2 + this.originTranslationVector.y) / this.unitToPixel && i < (this.screenHeight / 2 - this.originTranslationVector.y) / this.unitToPixel) {
        this.displayRangeY.push(i);
      }
    }
    for (let i = 0; i >= this.displayRange[2]; i -= 1 / this.unitIntervals) {
      if (i > -(this.screenHeight / 2 + this.originTranslationVector.y) / this.unitToPixel && i < (this.screenHeight / 2 - this.originTranslationVector.y) / this.unitToPixel) {
        this.displayRangeY.unshift(i);
      }
    }
  }
  PlotField() {
    this.FindDisplayRange();
    let maxMagnitude = 0;
    let validVectors = [];
    this.displayRangeX.forEach((x) => {
      this.displayRangeY.forEach((y) => {
        let resulatantField = this.FieldLogic(new GraphPoint(x, y));
        validVectors.push(resulatantField);
        let magnitude = GraphVector.Length(resulatantField) * this.unitToPixel;
        if (maxMagnitude < magnitude) {
          maxMagnitude = magnitude;
        }
      });
    });
    validVectors.forEach((validVector) => {
      this.DrawArrowLogScale(validVector, maxMagnitude, 5, "#2b2b2b");
    });
  }
  FieldLogic(graphPoint) {
    let x = graphPoint.x;
    let y = graphPoint.y;
    let r = new Vector(x, y);
    let fieldX = (x - 1) / Vector.LengthSquared(Vector.Sub(r, new Vector(1, 0))) - (x + 1) / Vector.LengthSquared(Vector.Add(r, new Vector(1, 0)));
    let fieldY = y / Vector.LengthSquared(Vector.Sub(r, new Vector(1, 0))) - y / Vector.LengthSquared(Vector.Add(r, new Vector(1, 0)));
    return new GraphVector(new GraphPoint(x, y), new GraphPoint(x + fieldX, y + fieldY));
  }
  PlotPolarField() {
    this.FindDisplayRange();
    let maxMagnitude = 0;
    let validVectors = [];
    this.displayRangeX.forEach((x) => {
      this.displayRangeY.forEach((y) => {
        let r = Vector.Length(new Vector(x, y));
        let theta = this.thetaCalculator(x, y);
        let fieldR = 2 / (r * r * r) * 2 * Math.cos(theta);
        let fieldTheta = 2 / (r * r * r) * Math.sin(theta);
        let resulatantField = Vector.Add(Vector.Scale(Vector.Normalize(new Vector(x, y)), fieldR), Vector.Scale(Vector.Rotate(Vector.Normalize(new Vector(x, y)), Math.PI / 2), fieldTheta));
        let fieldX = resulatantField.x;
        let fieldY = resulatantField.y;
        let magnitude = Vector.Length(new Vector(fieldX, fieldY)) * this.unitToPixel;
        if (maxMagnitude < magnitude) {
          maxMagnitude = magnitude;
        }
        validVectors.push(new GraphVector(new GraphPoint(x, y), new GraphPoint(x + fieldX, y + fieldY)));
      });
    });
    validVectors.forEach((validVector) => {
      this.DrawArrowLogScale(validVector, maxMagnitude, 5, "#2b2b2b");
    });
  }
  InitializeFluidField() {
    this.fluidParticleManager = new FluidParticleManager();
  }
  PlotFluidField(deltaTime) {
    this.fluidParticleManager.Update(deltaTime);
  }
  thetaCalculator(x, y) {
    if (y >= 0 && x >= 0)
      return Math.atan(y / x);
    else if (y >= 0 && x < 0)
      return Math.PI - Math.atan(y / -x);
    else if (y < 0 && x < 0)
      return Math.atan(-y / -x) + Math.PI;
    else if (y < 0 && x >= 0)
      return 2 * Math.PI - Math.atan(-y / x);
    else {
      console.log("ThetaCalculatorMalfunction");
      return 0;
    }
  }
  DrawLine(start, end, width, color, alpha = 1) {
    this.graphics.moveTo(start.x, start.y);
    this.graphics.lineTo(end.x, end.y);
    this.graphics.stroke({color, width, alpha});
  }
  DrawArrowRelativeScale(vector, maxMagnitude, width, color) {
    let start = vector.start.ToScreen();
    let relativeScale = this.maxMagnitudeVector / maxMagnitude;
    let unscaledDisplacement = Vector.Sub(vector.end.ToScreen(), start);
    let end = Vector.Add(Vector.Scale(unscaledDisplacement, relativeScale), start);
    let displacement = Vector.Sub(end, start);
    let arrowLength = Vector.Length(displacement) * 0.2;
    let arrowWidth = arrowLength * 0.5;
    let arrowDisplacement = Vector.Scale(Vector.Normalize(Vector.Rotate(displacement, Math.PI / 2)), arrowLength / 2);
    let arrowStart = Vector.Add(Vector.Sub(end, Vector.Scale(Vector.Normalize(displacement), arrowWidth / 2)), arrowDisplacement);
    let arrowEnd = Vector.Sub(Vector.Sub(end, Vector.Scale(Vector.Normalize(displacement), arrowWidth / 2)), arrowDisplacement);
    console.log(start);
    this.DrawLine(start, end, width, color);
    this.DrawLine(arrowStart, arrowEnd, arrowWidth, "#ff0000");
  }
  DrawArrowLogScale(vector, maxMagnitude, width, color) {
    let start = vector.start.ToScreen();
    let unscaledDisplacement = Vector.Sub(vector.end.ToScreen(), start);
    let logScale = Math.log(Vector.Length(unscaledDisplacement) + 1) / Math.log(maxMagnitude + 1) * this.maxMagnitudeVector;
    let end = Vector.Add(Vector.Scale(Vector.Normalize(unscaledDisplacement), logScale), start);
    let displacement = Vector.Sub(end, start);
    let arrowLength = Vector.Length(displacement) * 0.4;
    let arrowWidth = arrowLength * 0.5;
    let arrowDisplacement = Vector.Scale(Vector.Normalize(Vector.Rotate(displacement, Math.PI / 2)), arrowLength / 2);
    let arrowStart = Vector.Add(Vector.Sub(end, Vector.Scale(Vector.Normalize(displacement), arrowWidth / 2)), arrowDisplacement);
    let arrowEnd = Vector.Sub(Vector.Sub(end, Vector.Scale(Vector.Normalize(displacement), arrowWidth / 2)), arrowDisplacement);
    this.DrawLine(start, end, width, color);
    this.DrawLine(arrowStart, arrowEnd, arrowWidth, "#ff0000");
  }
  DrawPoint(point, radius, color) {
    let screenPoint = point.ToScreen();
    this.graphics.circle(screenPoint.x, screenPoint.y, radius);
    this.graphics.fill(color);
  }
  DrawParticle(particle, color) {
    this.DrawPoint(particle.position, 1, color);
    for (let i = particle.trailPositions.length - 1; i >= this.fluidParticleTrailOptimizer; i -= this.fluidParticleTrailOptimizer) {
      this.DrawLine(particle.trailPositions[i].ToScreen(), particle.trailPositions[i - this.fluidParticleTrailOptimizer].ToScreen(), 1, color, i / particle.trailPositions.length);
    }
  }
  ClearScreen() {
    this.graphics.clear();
  }
}
console.log("DISPLAY FILE WORKS");
