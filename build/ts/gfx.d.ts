/// <reference path="base.d.ts" />
/// <reference path="tools.d.ts" />
/// <reference path="gfx-base.d.ts" />
declare module Shumway.GFX.WebGL {
    import Matrix3D = Geometry.Matrix3D;
    var SHADER_ROOT: string;
    class WebGLContext {
        private static MAX_SURFACES;
        gl: WebGLRenderingContext;
        private _canvas;
        private _options;
        private _w;
        private _h;
        private _programCache;
        private _maxSurfaces;
        private _maxSurfaceSize;
        _backgroundColor: Color;
        private _geometry;
        private _tmpVertices;
        private _fillColor;
        _surfaceRegionCache: any;
        modelViewProjectionMatrix: Matrix3D;
        surfaces: WebGLSurface[];
        fillStyle: any;
        private _surfaceRegionAllocator;
        constructor(canvas: HTMLCanvasElement, options: WebGLRendererOptions);
        setBlendMode(value: BlendMode): void;
        setBlendOptions(): void;
        static glSupportedBlendMode(value: BlendMode): boolean;
        create2DProjectionMatrix(): Matrix3D;
        createPerspectiveMatrix(cameraDistance: number, fov: number, angle: number): Matrix3D;
        private discardCachedImages();
        cacheImage(image: any): WebGLSurfaceRegion;
        allocateSurfaceRegion(w: number, h: number, discardCache?: boolean): WebGLSurfaceRegion;
        updateSurfaceRegion(image: any, surfaceRegion: WebGLSurfaceRegion): void;
        _resize(): void;
        private _initializeProgram(program);
        private _createShaderFromFile(file);
        createProgramFromFiles(vertex: string, fragment: string): any;
        private _createProgram(shaders);
        private _createShader(shaderType, shaderSource);
        private _createTexture(w, h);
        private _createFramebuffer(texture);
        private _queryProgramAttributesAndUniforms(program);
        target: WebGLSurface;
        clear(color?: Color): void;
        clearTextureRegion(surfaceRegion: WebGLSurfaceRegion, color?: Color): void;
        sizeOf(type: any): number;
    }
}
declare module Shumway.GFX.WebGL {
    class BufferWriter extends Shumway.ArrayUtilities.ArrayWriter {
        ensureVertexCapacity(count: number): void;
        writeVertex(x: number, y: number): void;
        writeVertexUnsafe(x: number, y: number): void;
        writeVertex3D(x: number, y: number, z: number): void;
        writeVertex3DUnsafe(x: number, y: number, z: number): void;
        writeTriangleElements(a: number, b: number, c: number): void;
        ensureColorCapacity(count: number): void;
        writeColorFloats(r: number, g: number, b: number, a: number): void;
        writeColorFloatsUnsafe(r: number, g: number, b: number, a: number): void;
        writeColor(r: number, g: number, b: number, a: number): void;
        writeColorUnsafe(r: number, g: number, b: number, a: number): void;
        writeRandomColor(): void;
    }
    class WebGLAttribute {
        name: string;
        size: number;
        type: number;
        normalized: boolean;
        offset: number;
        constructor(name: string, size: number, type: number, normalized?: boolean);
    }
    class WebGLAttributeList {
        attributes: WebGLAttribute[];
        size: number;
        constructor(attributes: WebGLAttribute[]);
        initialize(context: WebGLContext): void;
    }
    class WebGLGeometry {
        array: BufferWriter;
        buffer: WebGLBuffer;
        elementArray: BufferWriter;
        elementBuffer: WebGLBuffer;
        context: WebGLContext;
        triangleCount: number;
        private _elementOffset;
        elementOffset: number;
        constructor(context: WebGLContext);
        addQuad(): void;
        resetElementOffset(): void;
        reset(): void;
        uploadBuffers(): void;
    }
    class Vertex extends Geometry.Point3D {
        constructor(x: number, y: number, z: number);
        static createEmptyVertices<T extends Vertex>(type: new (x: number, y: number, z: number) => T, count: number): T[];
    }
    enum WebGLBlendFactor {
        ZERO = 0,
        ONE = 1,
        SRC_COLOR = 768,
        ONE_MINUS_SRC_COLOR = 769,
        DST_COLOR = 774,
        ONE_MINUS_DST_COLOR = 775,
        SRC_ALPHA = 770,
        ONE_MINUS_SRC_ALPHA = 771,
        DST_ALPHA = 772,
        ONE_MINUS_DST_ALPHA = 773,
        SRC_ALPHA_SATURATE = 776,
        CONSTANT_COLOR = 32769,
        ONE_MINUS_CONSTANT_COLOR = 32770,
        CONSTANT_ALPHA = 32771,
        ONE_MINUS_CONSTANT_ALPHA = 32772,
    }
}
declare module Shumway.GFX.WebGL {
    class WebGLSurface implements ISurface {
        w: number;
        h: number;
        texture: WebGLTexture;
        framebuffer: WebGLFramebuffer;
        private _regionAllocator;
        constructor(w: number, h: number, texture: WebGLTexture);
        allocate(w: number, h: number): WebGLSurfaceRegion;
        free(surfaceRegion: WebGLSurfaceRegion): void;
    }
    class WebGLSurfaceRegion implements ILinkedListNode {
        region: RegionAllocator.Region;
        surface: WebGLSurface;
        next: WebGLSurfaceRegion;
        previous: WebGLSurfaceRegion;
        constructor(surface: WebGLSurface, region: RegionAllocator.Region);
    }
}
declare module Shumway.GFX.WebGL {
    var TILE_SIZE: number;
    var MIN_UNTILED_SIZE: number;
    import Stage = Shumway.GFX.Stage;
    class WebGLRendererOptions extends RendererOptions {
        maxSurfaces: number;
        maxSurfaceSize: number;
        perspectiveCamera: boolean;
        perspectiveCameraDistance: number;
        perspectiveCameraFOV: number;
        perspectiveCameraAngle: number;
        animateZoom: boolean;
        disableSurfaceUploads: boolean;
        frameSpacing: number;
        ignoreColorMatrix: boolean;
        drawTiles: boolean;
        drawSurfaces: boolean;
        drawSurface: number;
        premultipliedAlpha: boolean;
        unpackPremultiplyAlpha: boolean;
        showTemporaryCanvases: boolean;
        sourceBlendFactor: WebGLBlendFactor;
        destinationBlendFactor: WebGLBlendFactor;
    }
    class WebGLRenderer extends Renderer {
        _options: WebGLRendererOptions;
        _context: WebGLContext;
        private _brush;
        private _stencilBrush;
        private _tmpVertices;
        private _scratchCanvas;
        private _scratchCanvasContext;
        private _dynamicScratchCanvas;
        private _dynamicScratchCanvasContext;
        private _uploadCanvas;
        private _uploadCanvasContext;
        private _clipStack;
        private _canvas;
        constructor(container: HTMLDivElement, stage: Stage, options?: WebGLRendererOptions);
        private _cachedTiles;
        resize(): void;
        private _updateSize();
        private _cacheImageCallback(oldSurfaceRegion, src, srcBounds);
        private _enterClip(clip, matrix, brush, viewport);
        private _leaveClip(clip, matrix, brush, viewport);
        private _renderFrame(root, matrix, brush, viewport, depth?);
        private _renderSurfaces(brush);
        render(): void;
    }
}
declare module Shumway.GFX.WebGL {
    import Color = Shumway.Color;
    import Point = Geometry.Point;
    import Matrix = Geometry.Matrix;
    import Rectangle = Geometry.Rectangle;
    class WebGLBrush {
        _target: WebGLSurface;
        _context: WebGLContext;
        _geometry: WebGLGeometry;
        constructor(context: WebGLContext, geometry: WebGLGeometry, target: WebGLSurface);
        reset(): void;
        flush(): void;
        target: WebGLSurface;
    }
    enum WebGLCombinedBrushKind {
        FillColor = 0,
        FillTexture = 1,
        FillTextureWithColorMatrix = 2,
    }
    class WebGLCombinedBrushVertex extends Vertex {
        static attributeList: WebGLAttributeList;
        static initializeAttributeList(context: any): void;
        kind: WebGLCombinedBrushKind;
        color: Color;
        sampler: number;
        coordinate: Point;
        constructor(x: number, y: number, z: number);
        writeTo(geometry: WebGLGeometry): void;
    }
    class WebGLCombinedBrush extends WebGLBrush {
        private static _tmpVertices;
        private _program;
        private _surfaces;
        private _colorMatrix;
        private _blendMode;
        private static _depth;
        constructor(context: WebGLContext, geometry: WebGLGeometry, target?: WebGLSurface);
        reset(): void;
        drawImage(src: WebGLSurfaceRegion, dstRectangle: Rectangle, color: Color, colorMatrix: ColorMatrix, matrix: Matrix, depth?: number, blendMode?: BlendMode): boolean;
        fillRectangle(rectangle: Rectangle, color: Color, matrix: Matrix, depth?: number): void;
        flush(): void;
    }
}
declare module Shumway.GFX.Canvas2D {
    function notifyReleaseChanged(): void;
}
declare module Shumway.GFX.Canvas2D {
    import Rectangle = Shumway.GFX.Geometry.Rectangle;
    class Filters {
        static _svgBlurFilter: Element;
        static _svgDropshadowFilterBlur: Element;
        static _svgDropshadowFilterFlood: Element;
        static _svgDropshadowFilterOffset: Element;
        static _svgColorMatrixFilter: Element;
        static _svgFiltersAreSupported: boolean;
        private static _prepareSVGFilters();
        static _applyColorMatrixFilter(context: CanvasRenderingContext2D, colorMatrix: ColorMatrix): void;
        static _applyFilters(ratio: number, context: CanvasRenderingContext2D, filters: Filter[]): void;
        static _removeFilters(context: CanvasRenderingContext2D): void;
        static _applyColorMatrix(context: CanvasRenderingContext2D, colorMatrix: ColorMatrix): void;
    }
    class Canvas2DSurfaceRegion implements ISurfaceRegion {
        surface: Canvas2DSurface;
        region: RegionAllocator.Region;
        w: number;
        h: number;
        private static _copyCanvasContext;
        constructor(surface: Canvas2DSurface, region: RegionAllocator.Region, w: number, h: number);
        free(): void;
        private static _ensureCopyCanvasSize(w, h);
        draw(source: Canvas2DSurfaceRegion, x: number, y: number, w: number, h: number, blendMode: BlendMode): void;
        context: CanvasRenderingContext2D;
        resetTransform(): void;
        reset(): void;
        fill(fillStyle: any): void;
        clear(rectangle?: Rectangle): void;
    }
    class Canvas2DSurface implements ISurface {
        w: number;
        h: number;
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        private _regionAllocator;
        constructor(canvas: HTMLCanvasElement, regionAllocator?: RegionAllocator.IRegionAllocator);
        allocate(w: number, h: number): Canvas2DSurfaceRegion;
        free(surfaceRegion: Canvas2DSurfaceRegion): void;
    }
}
declare module Shumway.GFX.Canvas2D {
    import Rectangle = Shumway.GFX.Geometry.Rectangle;
    import Matrix = Shumway.GFX.Geometry.Matrix;
    import BlendMode = Shumway.GFX.BlendMode;
    class MipMapLevel {
        surfaceRegion: ISurfaceRegion;
        scale: number;
        constructor(surfaceRegion: ISurfaceRegion, scale: number);
    }
    class MipMap {
        private _node;
        private _size;
        private _levels;
        private _renderer;
        private _surfaceRegionAllocator;
        constructor(renderer: Canvas2DRenderer, node: Node, surfaceRegionAllocator: SurfaceRegionAllocator.ISurfaceRegionAllocator, size: number);
        getLevel(matrix: Matrix): MipMapLevel;
    }
    enum FillRule {
        NonZero = 0,
        EvenOdd = 1,
    }
    class Canvas2DRendererOptions extends RendererOptions {
        snapToDevicePixels: boolean;
        imageSmoothing: boolean;
        blending: boolean;
        debugLayers: boolean;
        masking: boolean;
        filters: boolean;
        cacheShapes: boolean;
        cacheShapesMaxSize: number;
        cacheShapesThreshold: number;
        alpha: boolean;
    }
    enum RenderFlags {
        None = 0,
        IgnoreNextLayer = 1,
        RenderMask = 2,
        IgnoreMask = 4,
        PaintStencil = 8,
        PaintClip = 16,
        IgnoreRenderable = 32,
        IgnoreNextRenderWithCache = 64,
        CacheShapes = 256,
        PaintFlashing = 512,
        PaintBounds = 1024,
        PaintDirtyRegion = 2048,
        ImageSmoothing = 4096,
        PixelSnapping = 8192,
    }
    class RenderState extends State {
        static allocationCount: number;
        private static _dirtyStack;
        clip: Rectangle;
        clipList: Rectangle[];
        flags: RenderFlags;
        target: Canvas2DSurfaceRegion;
        matrix: Matrix;
        colorMatrix: ColorMatrix;
        options: Canvas2DRendererOptions;
        constructor(target: Canvas2DSurfaceRegion);
        set(state: RenderState): void;
        clone(): RenderState;
        static allocate(): RenderState;
        free(): void;
        transform(transform: Transform): RenderState;
        hasFlags(flags: RenderFlags): boolean;
        removeFlags(flags: RenderFlags): void;
        toggleFlags(flags: RenderFlags, on: boolean): void;
    }
    class FrameInfo {
        private _count;
        private _enterTime;
        shapes: number;
        groups: number;
        culledNodes: number;
        enter(state: RenderState): void;
        leave(): void;
    }
    class Canvas2DRenderer extends Renderer {
        protected _options: Canvas2DRendererOptions;
        context: CanvasRenderingContext2D;
        private _target;
        private static _initializedCaches;
        private static _surfaceCache;
        private static _shapeCache;
        private _visited;
        private _frameInfo;
        private _fontSize;
        private _layers;
        constructor(container: HTMLDivElement | HTMLCanvasElement, stage: Stage, options?: Canvas2DRendererOptions);
        private _addLayer(name);
        private _backgroundVideoLayer;
        private _createTarget(canvas);
        private _onStageBoundsChanged(canvas);
        private static _prepareSurfaceAllocators();
        render(): void;
        renderNode(node: Node, clip: Rectangle, matrix: Matrix): void;
        renderNodeWithState(node: Node, state: RenderState): void;
        private _renderWithCache(node, state);
        private _intersectsClipList(node, state);
        visitGroup(node: Group, state: RenderState): void;
        private static _debugPoints;
        _renderDebugInfo(node: Node, state: RenderState): void;
        visitStage(node: Stage, state: RenderState): void;
        visitShape(node: Shape, state: RenderState): void;
        visitRenderableVideo(node: RenderableVideo, state: RenderState): void;
        visitRenderable(node: Renderable, state: RenderState, ratio?: number): void;
        _renderLayer(node: Node, state: RenderState): void;
        _renderWithMask(node: Node, mask: Node, blendMode: BlendMode, stencil: boolean, state: RenderState): void;
        private _renderStageToTarget(target, node, clip);
        private _renderToTemporarySurface(node, state, clip, excludeSurface);
        private _allocateSurface(w, h, excludeSurface);
        screenShot(bounds: Rectangle, stageContent: boolean): ScreenShot;
    }
}
declare module Shumway.GFX {
    import Point = Geometry.Point;
    import Rectangle = Geometry.Rectangle;
    import DisplayParameters = Shumway.Remoting.DisplayParameters;
    interface IState {
        onMouseUp(easel: Easel, event: MouseEvent): any;
        onMouseDown(easel: Easel, event: MouseEvent): any;
        onMouseMove(easel: Easel, event: MouseEvent): any;
        onMouseClick(easel: Easel, event: MouseEvent): any;
        onKeyUp(easel: Easel, event: KeyboardEvent): any;
        onKeyDown(easel: Easel, event: KeyboardEvent): any;
        onKeyPress(easel: Easel, event: KeyboardEvent): any;
    }
    class UIState implements IState {
        onMouseUp(easel: Easel, event: MouseEvent): void;
        onMouseDown(easel: Easel, event: MouseEvent): void;
        onMouseMove(easel: Easel, event: MouseEvent): void;
        onMouseWheel(easel: Easel, event: any): void;
        onMouseClick(easel: Easel, event: MouseEvent): void;
        onKeyUp(easel: Easel, event: KeyboardEvent): void;
        onKeyDown(easel: Easel, event: KeyboardEvent): void;
        onKeyPress(easel: Easel, event: KeyboardEvent): void;
    }
    class Easel {
        private _stage;
        private _worldView;
        private _world;
        private _options;
        private _container;
        private _renderer;
        private _disableHiDPI;
        private _state;
        private _persistentState;
        paused: boolean;
        viewport: Rectangle;
        transparent: boolean;
        private _selectedNodes;
        private _eventListeners;
        private _fps;
        private _fullScreen;
        constructor(container: HTMLDivElement, disableHiDPI?: boolean, backgroundColor?: number);
        private _listenForContainerSizeChanges();
        private _onContainerSizeChanged();
        addEventListener(type: string, listener: any): void;
        private _dispatchEvent(type);
        private _enterRenderLoop();
        state: UIState;
        cursor: string;
        private _render();
        render(): void;
        world: Group;
        worldView: Group;
        stage: Stage;
        options: Canvas2D.Canvas2DRendererOptions;
        getDisplayParameters(): DisplayParameters;
        toggleOption(name: string): void;
        getOption(name: string): any;
        getRatio(): number;
        private _containerWidth;
        private _containerHeight;
        queryNodeUnderMouse(event: MouseEvent): Node;
        selectNodeUnderMouse(event: MouseEvent): void;
        getMousePosition(event: MouseEvent, coordinateSpace: Node): Point;
        getMouseWorldPosition(event: MouseEvent): Point;
        private _onMouseDown(event);
        private _onMouseUp(event);
        private _onMouseMove(event);
        screenShot(bounds: Rectangle, stageContent: boolean): ScreenShot;
    }
}
declare module Shumway.GFX {
    import Matrix = Shumway.GFX.Geometry.Matrix;
    enum Layout {
        Simple = 0,
    }
    class TreeRendererOptions extends RendererOptions {
        layout: Layout;
    }
    class TreeRenderer extends Renderer {
        _options: TreeRendererOptions;
        _canvas: HTMLCanvasElement;
        _context: CanvasRenderingContext2D;
        layout: any;
        constructor(container: HTMLDivElement, stage: Stage, options?: TreeRendererOptions);
        private _listenForContainerSizeChanges();
        private _getRatio();
        private _onContainerSizeChanged();
        private _containerWidth;
        private _containerHeight;
        render(): void;
        _renderNodeSimple(context: CanvasRenderingContext2D, root: Node, transform: Matrix): void;
    }
}
declare module Shumway.Remoting.GFX {
    import Group = Shumway.GFX.Group;
    import Renderable = Shumway.GFX.Renderable;
    import RenderableBitmap = Shumway.GFX.RenderableBitmap;
    import RenderableVideo = Shumway.GFX.RenderableVideo;
    import IVideoPlaybackEventSerializer = Shumway.GFX.IVideoPlaybackEventSerializer;
    import RenderableText = Shumway.GFX.RenderableText;
    import Node = Shumway.GFX.Node;
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    import Stage = Shumway.GFX.Stage;
    import Point = Shumway.GFX.Geometry.Point;
    import IDataInput = Shumway.ArrayUtilities.IDataInput;
    import IDataOutput = Shumway.ArrayUtilities.IDataOutput;
    class GFXChannelSerializer {
        output: IDataOutput;
        outputAssets: any[];
        writeMouseEvent(event: MouseEvent, point: Point): void;
        writeKeyboardEvent(event: KeyboardEvent): void;
        writeFocusEvent(type: FocusEventType): void;
    }
    class GFXChannelDeserializerContext implements IVideoPlaybackEventSerializer {
        stage: Stage;
        _nodes: Node[];
        private _assets;
        _easelHost: Shumway.GFX.EaselHost;
        private _canvas;
        private _context;
        constructor(easelHost: Shumway.GFX.EaselHost, root: Group, transparent: boolean);
        _registerAsset(id: number, symbolId: number, asset: Renderable): void;
        _makeNode(id: number): Node;
        _getAsset(id: number): Renderable;
        _getBitmapAsset(id: number): RenderableBitmap;
        _getVideoAsset(id: number): RenderableVideo;
        _getTextAsset(id: number): RenderableText;
        registerFont(syncId: number, data: any, resolve: (data: any) => void): void;
        registerImage(syncId: number, symbolId: number, data: any, resolve: (data: any) => void): void;
        registerVideo(syncId: number): void;
        _decodeImage(type: ImageType, data: Uint8Array, oncomplete: (data: any) => void): RenderableBitmap;
        sendVideoPlaybackEvent(assetId: number, eventType: VideoPlaybackEvent, data: any): void;
    }
    class GFXChannelDeserializer {
        input: IDataInput;
        inputAssets: any[];
        output: DataBuffer;
        context: GFXChannelDeserializerContext;
        private static _temporaryReadMatrix;
        private static _temporaryReadRectangle;
        private static _temporaryReadColorMatrix;
        private static _temporaryReadColorMatrixIdentity;
        read(): void;
        private _readMatrix();
        private _readRectangle();
        private _readColorMatrix();
        private _readAsset();
        private _readUpdateGraphics();
        private _readUpdateBitmapData();
        private _readUpdateTextContent();
        private _writeLineMetrics(line);
        private _readUpdateStage();
        private _readUpdateNetStream();
        private _readFilters(node);
        private _readUpdateFrame();
        private _readDrawToBitmap();
        private _readRequestBitmapData();
    }
}
declare module Shumway.GFX {
    import Easel = Shumway.GFX.Easel;
    import Stage = Shumway.GFX.Stage;
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    import VideoControlEvent = Shumway.Remoting.VideoControlEvent;
    import VideoPlaybackEvent = Shumway.Remoting.VideoPlaybackEvent;
    import DisplayParameters = Shumway.Remoting.DisplayParameters;
    class EaselHost {
        private static _mouseEvents;
        private static _keyboardEvents;
        private _easel;
        private _group;
        private _context;
        private _content;
        private _fullscreen;
        constructor(easel: Easel);
        onSendUpdates(update: DataBuffer, asssets: Array<DataBuffer>): void;
        easel: Easel;
        stage: Stage;
        content: Group;
        cursor: string;
        fullscreen: boolean;
        private _mouseEventListener(event);
        private _keyboardEventListener(event);
        _addEventListeners(): void;
        private _sendFocusEvent(type);
        private _addFocusEventListeners();
        private _resizeEventListener();
        onDisplayParameters(params: DisplayParameters): void;
        processUpdates(updates: DataBuffer, assets: Array<DataBuffer>, output?: DataBuffer): void;
        processVideoControl(id: number, eventType: VideoControlEvent, data: any): any;
        processRegisterFontOrImage(syncId: number, symbolId: number, type: string, data: any, resolve: (data: any) => void): void;
        processFSCommand(command: string, args: string): void;
        processFrame(): void;
        onVideoPlaybackEvent(id: number, eventType: VideoPlaybackEvent, data: any): void;
        sendVideoPlaybackEvent(id: number, eventType: VideoPlaybackEvent, data: any): void;
    }
}
declare module Shumway.GFX.Window {
    import Easel = Shumway.GFX.Easel;
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    import TimelineBuffer = Shumway.Tools.Profiler.TimelineBuffer;
    import VideoPlaybackEvent = Shumway.Remoting.VideoPlaybackEvent;
    import DisplayParameters = Shumway.Remoting.DisplayParameters;
    class WindowEaselHost extends EaselHost {
        private _timelineRequests;
        private _window;
        private _playerWindow;
        constructor(easel: Easel, playerWindow: any, window: any);
        onSendUpdates(updates: DataBuffer, assets: Array<DataBuffer>): void;
        onDisplayParameters(params: DisplayParameters): void;
        onVideoPlaybackEvent(id: number, eventType: VideoPlaybackEvent, data: any): void;
        requestTimeline(type: string, cmd: string): Promise<TimelineBuffer>;
        private _sendRegisterFontOrImageResponse(requestId, result);
        private onWindowMessage(data, async?);
    }
}
declare module Shumway.Player.Test {
    class FakeSyncWorker {
        static instance: FakeSyncWorker;
        addEventListener(type: string, listener: any, useCapture?: boolean): void;
        removeEventListener(type: string, listener: any, useCapture?: boolean): void;
        postMessage(message: any, ports?: any): void;
        postSyncMessage(message: any, ports?: any): any;
    }
}
declare module Shumway.GFX.Test {
    import Easel = Shumway.GFX.Easel;
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    import TimelineBuffer = Shumway.Tools.Profiler.TimelineBuffer;
    import VideoPlaybackEvent = Shumway.Remoting.VideoPlaybackEvent;
    import DisplayParameters = Shumway.Remoting.DisplayParameters;
    class TestEaselHost extends EaselHost {
        private _worker;
        constructor(easel: Easel);
        onSendUpdates(updates: DataBuffer, assets: Array<DataBuffer>): void;
        onDisplayParameters(params: DisplayParameters): void;
        onVideoPlaybackEvent(id: number, eventType: VideoPlaybackEvent, data: any): void;
        requestTimeline(type: string, cmd: string): Promise<TimelineBuffer>;
        private _sendRegisterFontOrImageResponse(requestId, result);
        _onWorkerMessage(e: any, async?: boolean): any;
        private _onSyncWorkerMessage(e);
    }
}
declare module Shumway.GFX.Test {
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    enum MovieRecordType {
        None = 0,
        PlayerCommand = 1,
        PlayerCommandAsync = 2,
        Frame = 3,
        FontOrImage = 4,
        FSCommand = 5,
    }
    class MovieRecorder {
        private _recording;
        private _recordingStarted;
        private _stopped;
        private _maxRecordingSize;
        constructor(maxRecordingSize: number);
        stop(): void;
        getRecording(): Blob;
        dump(): void;
        private _createRecord(type, buffer);
        recordPlayerCommand(async: boolean, updates: Uint8Array, assets: any[]): void;
        recordFrame(): void;
        recordFontOrImage(syncId: number, symbolId: number, assetType: string, data: any): void;
        recordFSCommand(command: string, args: string): void;
    }
    class MovieRecordParser {
        private _buffer;
        currentTimestamp: number;
        currentType: MovieRecordType;
        currentData: DataBuffer;
        constructor(data: Uint8Array);
        readNextRecord(): MovieRecordType;
        parsePlayerCommand(): any;
        parseFSCommand(): any;
        parseFontOrImage(): any;
        dump(): void;
    }
}
declare module Shumway.GFX.Test {
    import Easel = Shumway.GFX.Easel;
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    import TimelineBuffer = Shumway.Tools.Profiler.TimelineBuffer;
    import VideoPlaybackEvent = Shumway.Remoting.VideoPlaybackEvent;
    import DisplayParameters = Shumway.Remoting.DisplayParameters;
    class PlaybackEaselHost extends EaselHost {
        private _parser;
        private _lastTimestamp;
        constructor(easel: Easel);
        private playUrl(url);
        private playBytes(data);
        onSendUpdates(updates: DataBuffer, assets: Array<DataBuffer>): void;
        onDisplayParameters(params: DisplayParameters): void;
        onVideoPlaybackEvent(id: number, eventType: VideoPlaybackEvent, data: any): void;
        requestTimeline(type: string, cmd: string): Promise<TimelineBuffer>;
        private _parseNext();
        private _runRecord();
    }
}
declare module Shumway.GFX.Test {
    class RecordingEaselHost extends TestEaselHost {
        private _recorder;
        recorder: MovieRecorder;
        constructor(easel: Easel, recordingLimit?: number);
        _onWorkerMessage(e: any, async?: boolean): any;
    }
}
interface WebGLActiveInfo {
    location: any;
}
interface WebGLProgram extends WebGLObject {
    uniforms: any;
    attributes: any;
}
