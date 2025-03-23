import {Display} from "./Display.js";
import {Vector} from "./Vector.js";
export class UserInterface {
  constructor(_app) {
    this.app = _app;
    this.display = Display.Instance;
    this.mousePosition = new Vector(0, 0);
    this.mouseDown = false;
    this.mouseDragStart = new Vector(0, 0);
    document.body.addEventListener("keypress", (event) => {
      if (event.key == ".") {
        this.display.unitIntervals *= 2;
      }
      if (event.key == ",") {
        this.display.unitIntervals /= 2;
      }
      if (event.key == "p") {
        this.display.precisionDP += 1;
      }
      if (event.key == "o") {
        this.display.precisionDP -= 1;
      }
    });
    this.app.canvas.addEventListener("wheel", (event) => {
      if (event.deltaY > 0) {
        this.display.unitToPixel /= 2;
        let cursorAnchorPosition = Vector.VectorScale(Vector.Sub(this.mousePosition, this.display.halfScreen), new Vector(1, -1));
        this.display.TranslateOrigin(Vector.Scale(Vector.Sub(cursorAnchorPosition, this.display.originTranslationVector), 0.5));
      }
      if (event.deltaY < 0) {
        this.display.unitToPixel *= 2;
        let cursorAnchorPosition = Vector.VectorScale(Vector.Sub(this.mousePosition, this.display.halfScreen), new Vector(1, -1));
        this.display.TranslateOrigin(Vector.Sub(this.display.originTranslationVector, cursorAnchorPosition));
      }
    });
    this.app.canvas.addEventListener("mousemove", (event) => {
      this.mousePosition = new Vector(event.clientX, event.clientY);
      if (this.mouseDown) {
        this.display.TranslateOrigin(Vector.VectorScale(Vector.Sub(this.mousePosition, this.mouseDragStart), new Vector(1, -1)));
        this.mouseDragStart = this.mousePosition;
      }
    });
    this.app.canvas.addEventListener("mousedown", (event) => {
      this.mouseDown = true;
      this.mouseDragStart = this.mousePosition;
    });
    this.app.canvas.addEventListener("mouseup", (event) => {
      this.mouseDown = false;
    });
  }
}
