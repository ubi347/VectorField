import * as PIXI from "../_snowpack/pkg/pixijs.js";
import {Display} from "./Display.js";
import {Vector} from "./Vector.js";
import {UserInterface} from "./UserInterface.js";
document.body.style.backgroundColor = "#2b2b2b";
document.body.style.margin = "0px";
(async () => {
  const graphics = new PIXI.Graphics();
  Display.Initialize(graphics);
  const display = Display.Instance;
  const app = new PIXI.Application();
  await app.init({width: display.screenWidth, height: display.screenHeight, background: "#ffffff", sharedTicker: true});
  const userInterface = new UserInterface(app);
  document.body.appendChild(app.canvas);
  app.stage.addChild(graphics);
  display.InitializeFluidField();
  const Update = (deltaTime) => {
    Draw(deltaTime);
  };
  const Draw = (deltaTime) => {
    graphics.clear();
    display.DrawLine(new Vector(display.screenWidth / 2 + display.originTranslationVector.x, 0), new Vector(display.screenWidth / 2 + display.originTranslationVector.x, display.screenHeight), 1, "#2b2b2b");
    display.DrawLine(new Vector(0, display.screenHeight / 2 - display.originTranslationVector.y), new Vector(display.screenWidth, display.screenHeight / 2 - display.originTranslationVector.y), 1, "#2b2b2b");
    display.PlotFluidField(deltaTime);
    if (deltaTime > 0.1) {
      console.log("SLOW FRAME");
    }
  };
  const ticker = new PIXI.Ticker();
  ticker.add(() => Update(ticker.elapsedMS * 1e-3));
  ticker.start();
})();
console.log("GAME");
