import {Display} from "./Display.js";
export class Vector {
  constructor(_x, _y) {
    this.display = Display.Instance;
    this.x = _x;
    this.y = _y;
  }
  static Add(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  }
  static Sub(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }
  static Length(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }
  static LengthSquared(v) {
    return v.x * v.x + v.y * v.y;
  }
  static Normalize(v) {
    let magnitude = Vector.Length(v);
    return new Vector(v.x / magnitude, v.y / magnitude);
  }
  static Rotate(v, angle) {
    let x = v.x * Math.cos(angle) - v.y * Math.sin(angle);
    let y = v.x * Math.sin(angle) + v.y * Math.cos(angle);
    return new Vector(x, y);
  }
  static Scale(v, scalar) {
    return new Vector(v.x * scalar, v.y * scalar);
  }
  static VectorScale(v1, v2) {
    return new Vector(v1.x * v2.x, v1.y * v2.y);
  }
  static ToGraph(v) {
    return new GraphPoint((v.x - (v.display.screenWidth / 2 + v.display.originTranslationVector.x)) / v.display.unitToPixel, (v.y - (v.display.screenHeight / 2 - v.display.originTranslationVector.y)) / v.display.unitToPixel * -1);
  }
}
export class GraphPoint {
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  constructor(__x, __y) {
    this._x = __x;
    this._y = __y;
    this.display = Display.Instance;
  }
  ToScreen() {
    return new Vector(this._x * this.display.unitToPixel + this.display.screenWidth / 2 + this.display.originTranslationVector.x, -this._y * this.display.unitToPixel + this.display.screenHeight / 2 - this.display.originTranslationVector.y);
  }
}
export class FluidParticle {
  get lifeTime() {
    return this._lifeTime;
  }
  constructor(_position, __lifeTime) {
    this.position = _position;
    this.trailPositions = [_position];
    this._lifeTime = __lifeTime;
    this.display = Display.Instance;
  }
  Update(deltaTime) {
    this._lifeTime -= deltaTime;
    let graphVector = this.display.FieldLogic(this.position);
    let unscaledDisplacement = Vector.Sub(graphVector.end.ToScreen(), graphVector.start.ToScreen());
    let particleVelocity = Math.log(Vector.Length(unscaledDisplacement) + 1) * this.display.fluidParticleMaxVelocity;
    let displacement = Vector.Scale(Vector.Normalize(unscaledDisplacement), particleVelocity * deltaTime);
    this.position = Vector.ToGraph(Vector.Add(this.position.ToScreen(), displacement));
    if (this.trailPositions.length >= this.display.fluidParticleTrailLength) {
      this.trailPositions.shift();
    }
    this.trailPositions.push(this.position);
  }
  Draw() {
    this.display.DrawParticle(this, "#2b2b2b");
  }
}
export class FluidParticleManager {
  get minX() {
    return -(this.display.screenWidth / 2 + this.display.originTranslationVector.x) / this.display.unitToPixel;
  }
  get maxX() {
    return (this.display.screenWidth / 2 - this.display.originTranslationVector.x) / this.display.unitToPixel;
  }
  get minY() {
    return -(this.display.screenHeight / 2 + this.display.originTranslationVector.y) / this.display.unitToPixel;
  }
  get maxY() {
    return (this.display.screenHeight / 2 - this.display.originTranslationVector.y) / this.display.unitToPixel;
  }
  constructor() {
    this.display = Display.Instance;
    this.particles = [];
  }
  RandomParticleGeneration() {
    while (this.particles.length < this.display.fluidParticleCount) {
      let randomX = Math.random() * (this.maxX - this.minX) + this.minX;
      let randomY = Math.random() * (this.maxY - this.minY) + this.minY;
      let randomLifeTime = Math.random() * this.display.fluidParticleLifeTime;
      let randomGraphPoint = new GraphPoint(randomX, randomY);
      this.particles.push(new FluidParticle(randomGraphPoint, randomLifeTime));
    }
  }
  Update(deltaTime) {
    this.RandomParticleGeneration();
    this.particles.forEach((particle) => {
      particle.Update(deltaTime);
      if (particle.position.x < this.minX || particle.position.x > this.maxX || particle.position.y < this.minY || particle.position.y > this.maxY) {
        this.particles.splice(this.particles.indexOf(particle), 1);
      }
      if (particle.lifeTime <= 0) {
        this.particles.splice(this.particles.indexOf(particle), 1);
      }
      particle.Draw();
    });
  }
}
export class GraphVector {
  constructor(_start, _end) {
    this.start = _start;
    this.end = _end;
    this.display = Display.Instance;
  }
  static Length(graphVector) {
    return Vector.Length(Vector.Sub(graphVector.end.ToScreen(), graphVector.start.ToScreen())) / graphVector.display.unitToPixel;
  }
}
console.log("VECTOR FILE WORKS");
