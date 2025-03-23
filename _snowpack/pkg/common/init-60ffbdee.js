import { extensions, ResizePlugin, TickerPlugin, GraphicsPipe, GraphicsContextSystem, MeshPipe, GlParticleContainerPipe, GpuParticleContainerPipe, CanvasTextSystem, CanvasTextPipe, BitmapTextPipe, HTMLTextSystem, HTMLTextPipe, TilingSpritePipe, NineSliceSpritePipe, FilterSystem, FilterPipe } from '../pixijs.js';

extensions.add(ResizePlugin);
extensions.add(TickerPlugin);

extensions.add(GraphicsPipe);
extensions.add(GraphicsContextSystem);

extensions.add(MeshPipe);

extensions.add(GlParticleContainerPipe);
extensions.add(GpuParticleContainerPipe);

extensions.add(CanvasTextSystem);
extensions.add(CanvasTextPipe);

extensions.add(BitmapTextPipe);

extensions.add(HTMLTextSystem);
extensions.add(HTMLTextPipe);

extensions.add(TilingSpritePipe);

extensions.add(NineSliceSpritePipe);

extensions.add(FilterSystem);
extensions.add(FilterPipe);
