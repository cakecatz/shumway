/// <reference path="base.d.ts" />
/// <reference path="tools.d.ts" />
interface CanvasRenderingContext2D {
    filter: string;
    globalColorMatrix: Shumway.GFX.ColorMatrix;
    flashStroke(path: Path2D, lineScaleMode: Shumway.LineScaleMode): any;
}
interface CanvasGradient {
    _template: any;
}
declare module Shumway.GFX {
    enum TraceLevel {
        None = 0,
        Brief = 1,
        Verbose = 2,
    }
    var frameCounter: Metrics.Counter;
    var traceLevel: TraceLevel;
    var writer: IndentingWriter;
    function frameCount(name: any): void;
    var timelineBuffer: Tools.Profiler.TimelineBuffer;
    function enterTimeline(name: string, data?: any): void;
    function leaveTimeline(name?: string, data?: any): void;
    class Path {
        private _commands;
        private _commandPosition;
        private _data;
        private _dataPosition;
        private static _arrayBufferPool;
        static _apply(path: Path, context: CanvasRenderingContext2D): void;
        constructor(arg: any);
        private _ensureCommandCapacity(length);
        private _ensureDataCapacity(length);
        private _writeCommand(command);
        private _writeData(a, b, c?, d?, e?, f?);
        closePath(): void;
        moveTo(x: number, y: number): void;
        lineTo(x: number, y: number): void;
        quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
        bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
        rect(x: number, y: number, width: number, height: number): void;
        arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean): void;
        addPath(path: Path, transformation?: SVGMatrix): void;
    }
}
declare module Shumway.GFX {
    interface ISurface {
        w: number;
        h: number;
        allocate(w: number, h: number): ISurfaceRegion;
        free(surfaceRegion: ISurfaceRegion): any;
    }
    interface ISurfaceRegion {
        surface: ISurface;
        region: RegionAllocator.Region;
    }
    class ScreenShot {
        dataURL: string;
        w: number;
        h: number;
        constructor(dataURL: string, w: number, h: number);
    }
}
declare module Shumway {
    interface ILinkedListNode {
        next: ILinkedListNode;
        previous: ILinkedListNode;
    }
    class LRUList<T extends ILinkedListNode> {
        private _head;
        private _tail;
        private _count;
        count: number;
        head: T;
        constructor();
        private _unshift(node);
        private _remove(node);
        use(node: T): void;
        pop(): T;
        visit(callback: (T) => boolean, forward?: boolean): void;
    }
    function getScaleX(matrix: SVGMatrix): number;
    function getScaleY(matrix: SVGMatrix): number;
}
declare module Shumway.GFX {
    var imageUpdateOption: any;
    var imageConvertOption: any;
    var stageOptions: any;
    var forcePaint: any;
    var ignoreViewport: any;
    var viewportLoupeDiameter: any;
    var disableClipping: any;
    var debugClipping: any;
    var hud: any;
    var perspectiveCamera: any;
    var perspectiveCameraFOV: any;
    var perspectiveCameraDistance: any;
    var perspectiveCameraAngle: any;
    var perspectiveCameraAngleRotate: any;
    var perspectiveCameraSpacing: any;
    var perspectiveCameraSpacingInflate: any;
    var drawTiles: any;
    var drawSurfaces: any;
    var drawSurface: any;
    var drawElements: any;
    var disableSurfaceUploads: any;
    var premultipliedAlpha: any;
    var unpackPremultiplyAlpha: any;
    var sourceBlendFactor: any;
    var destinationBlendFactor: any;
    var clipDirtyRegions: any;
    var clipCanvas: any;
    var cull: any;
    var snapToDevicePixels: any;
    var imageSmoothing: any;
    var masking: any;
    var blending: any;
    var debugLayers: any;
    var filters: any;
    var cacheShapes: any;
    var cacheShapesMaxSize: any;
    var cacheShapesThreshold: any;
}
declare module Shumway.GFX.Geometry {
    function radianToDegrees(r: any): number;
    function degreesToRadian(d: any): number;
    function quadraticBezier(from: number, cp: number, to: number, t: number): number;
    function quadraticBezierExtreme(from: number, cp: number, to: number): number;
    function cubicBezier(from: number, cp: number, cp2: number, to: number, t: any): number;
    function cubicBezierExtremes(from: number, cp: number, cp2: number, to: any): number[];
    class Point {
        x: number;
        y: number;
        constructor(x: number, y: number);
        setElements(x: number, y: number): Point;
        set(other: Point): Point;
        dot(other: Point): number;
        squaredLength(): number;
        distanceTo(other: Point): number;
        sub(other: Point): Point;
        mul(value: number): Point;
        clone(): Point;
        toString(digits?: number): string;
        inTriangle(a: Point, b: Point, c: Point): boolean;
        static createEmpty(): Point;
        static createEmptyPoints(count: number): Point[];
    }
    class Point3D {
        x: number;
        y: number;
        z: number;
        constructor(x: number, y: number, z: number);
        setElements(x: number, y: number, z: number): Point3D;
        set(other: Point3D): Point3D;
        dot(other: Point3D): number;
        cross(other: Point3D): Point3D;
        squaredLength(): number;
        sub(other: Point3D): Point3D;
        mul(value: number): Point3D;
        normalize(): Point3D;
        clone(): Point3D;
        toString(digits?: number): string;
        static createEmpty(): Point3D;
        static createEmptyPoints(count: number): Point3D[];
    }
    class Rectangle {
        static allocationCount: number;
        x: number;
        y: number;
        w: number;
        h: number;
        private static _temporary;
        private static _dirtyStack;
        constructor(x: number, y: number, w: number, h: number);
        setElements(x: number, y: number, w: number, h: number): void;
        set(other: Rectangle): void;
        contains(other: Rectangle): boolean;
        containsPoint(point: Point): boolean;
        isContained(others: Rectangle[]): boolean;
        isSmallerThan(other: Rectangle): boolean;
        isLargerThan(other: Rectangle): boolean;
        union(other: Rectangle): void;
        isEmpty(): boolean;
        setEmpty(): void;
        intersect(other: Rectangle): Rectangle;
        intersects(other: Rectangle): boolean;
        intersectsTransformedAABB(other: Rectangle, matrix: Matrix): boolean;
        intersectsTranslated(other: Rectangle, tx: number, ty: number): boolean;
        area(): number;
        clone(): Rectangle;
        static allocate(): Rectangle;
        free(): void;
        snap(): Rectangle;
        scale(x: number, y: number): Rectangle;
        offset(x: number, y: number): Rectangle;
        resize(w: number, h: number): Rectangle;
        expand(w: number, h: number): Rectangle;
        getCenter(): Point;
        getAbsoluteBounds(): Rectangle;
        toString(digits?: number): string;
        static createEmpty(): Rectangle;
        static createSquare(size: number): Rectangle;
        static createMaxI16(): Rectangle;
        setMaxI16(): void;
        getCorners(points: Point[]): void;
    }
    class OBB {
        axes: Point[];
        corners: Point[];
        origins: number[];
        constructor(corners: Point[]);
        getBounds(): Rectangle;
        static getBounds(points: any): Rectangle;
        intersects(other: OBB): boolean;
        private intersectsOneWay(other);
    }
    enum MatrixType {
        Unknown = 0,
        Identity = 1,
        Translation = 2,
    }
    class Matrix {
        static allocationCount: number;
        private _data;
        private _type;
        private static _dirtyStack;
        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;
        private static _svg;
        constructor(a: number, b: number, c: number, d: number, tx: number, ty: number);
        setElements(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        set(other: Matrix): void;
        emptyArea(query: Rectangle): boolean;
        infiniteArea(query: Rectangle): boolean;
        isEqual(other: Matrix): boolean;
        clone(): Matrix;
        static allocate(): Matrix;
        free(): void;
        transform(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix;
        transformRectangle(rectangle: Rectangle, points: Point[]): void;
        isTranslationOnly(): boolean;
        transformRectangleAABB(rectangle: Rectangle): void;
        scale(x: number, y: number): Matrix;
        scaleClone(x: number, y: number): Matrix;
        rotate(angle: number): Matrix;
        concat(other: Matrix): Matrix;
        concatClone(other: Matrix): Matrix;
        preMultiply(other: Matrix): void;
        translate(x: number, y: number): Matrix;
        setIdentity(): void;
        isIdentity(): boolean;
        transformPoint(point: Point): void;
        transformPoints(points: Point[]): void;
        deltaTransformPoint(point: Point): void;
        inverse(result: Matrix): void;
        getTranslateX(): number;
        getTranslateY(): number;
        getScaleX(): number;
        getScaleY(): number;
        getScale(): number;
        getAbsoluteScaleX(): number;
        getAbsoluteScaleY(): number;
        getRotation(): number;
        isScaleOrRotation(): boolean;
        toString(digits?: number): string;
        toWebGLMatrix(): Float32Array;
        toCSSTransform(): string;
        static createIdentity(): Matrix;
        static multiply: (dst: Matrix, src: Matrix) => void;
        toSVGMatrix(): SVGMatrix;
        snap(): boolean;
        static createIdentitySVGMatrix(): SVGMatrix;
        static createSVGMatrixFromArray(array: number[]): SVGMatrix;
    }
    class Matrix3D {
        private _m;
        constructor(m: number[]);
        asWebGLMatrix(): Float32Array;
        static createCameraLookAt(cameraPosition: Point3D, target: Point3D, up: Point3D): Matrix3D;
        static createLookAt(cameraPosition: Point3D, target: Point3D, up: Point3D): Matrix3D;
        mul(point: Point3D): Point3D;
        static create2DProjection(width: any, height: any, depth: any): Matrix3D;
        static createPerspective(fieldOfViewInRadians: any, aspectRatio: any, near: any, far: any): Matrix3D;
        static createIdentity(): Matrix3D;
        static createTranslation(tx: number, ty: number, tz: number): Matrix3D;
        static createXRotation(angleInRadians: number): Matrix3D;
        static createYRotation(angleInRadians: number): Matrix3D;
        static createZRotation(angleInRadians: number): Matrix3D;
        static createScale(sx: number, sy: number, sz: number): Matrix3D;
        static createMultiply(a: Matrix3D, b: Matrix3D): Matrix3D;
        static createInverse(a: Matrix3D): Matrix3D;
    }
    class DirtyRegion {
        private static tmpRectangle;
        private grid;
        private w;
        private h;
        private c;
        private r;
        private size;
        private sizeInBits;
        constructor(w: any, h: any, sizeInBits?: number);
        clear(): void;
        getBounds(): Rectangle;
        addDirtyRectangle(rectangle: Rectangle): void;
        gatherRegions(regions: Rectangle[]): void;
        gatherOptimizedRegions(regions: Rectangle[]): void;
        getDirtyRatio(): number;
        render(context: CanvasRenderingContext2D, options?: any): void;
    }
    module DirtyRegion {
        class Cell {
            region: Rectangle;
            bounds: Rectangle;
            constructor(region: Rectangle);
            clear(): void;
        }
    }
    class Tile {
        x: number;
        y: number;
        index: number;
        scale: number;
        bounds: Rectangle;
        cachedSurfaceRegion: ISurfaceRegion;
        color: Shumway.Color;
        private _obb;
        private static corners;
        getOBB(): OBB;
        constructor(index: number, x: number, y: number, w: number, h: number, scale: number);
    }
    class TileCache {
        w: number;
        h: number;
        tileW: number;
        tileH: number;
        rows: number;
        scale: number;
        columns: number;
        tiles: Tile[];
        private static _points;
        constructor(w: number, h: number, tileW: number, tileH: number, scale: number);
        getTiles(query: Rectangle, transform: Matrix): Tile[];
        private getFewTiles(query, transform, precise?);
        private getManyTiles(query, transform);
    }
    class RenderableTileCache {
        private _source;
        private _cacheLevels;
        private _tileSize;
        private _minUntiledSize;
        constructor(source: Renderable, tileSize: number, minUntiledSize: number);
        private _getTilesAtScale(query, transform, scratchBounds);
        fetchTiles(query: Rectangle, transform: Matrix, scratchContext: CanvasRenderingContext2D, cacheImageCallback: (old: ISurfaceRegion, src: CanvasRenderingContext2D, srcBounds: Rectangle) => ISurfaceRegion): Tile[];
        private _getTileBounds(tiles);
        private _cacheTiles(scratchContext, uncachedTiles, cacheImageCallback, scratchBounds, maxRecursionDepth?);
    }
}
declare module Shumway.GFX {
    module RegionAllocator {
        class Region extends Geometry.Rectangle {
            allocator: IRegionAllocator;
            allocated: boolean;
        }
        interface IRegionAllocator {
            allocate(w: number, h: number): Region;
            free(region: Region): any;
        }
        class CompactAllocator implements IRegionAllocator {
            static RANDOM_ORIENTATION: boolean;
            static MAX_DEPTH: number;
            private _root;
            constructor(w: number, h: number);
            allocate(w: number, h: number): Region;
            free(region: Region): void;
        }
        class GridAllocator implements IRegionAllocator {
            private _sizeW;
            private _sizeH;
            private _rows;
            private _columns;
            private _freeList;
            private _index;
            private _total;
            constructor(w: number, h: number, sizeW: number, sizeH: number);
            allocate(w: number, h: number): Region;
            free(region: Region): void;
        }
        class GridCell extends RegionAllocator.Region {
            index: number;
            constructor(x: number, y: number, w: number, h: number);
        }
        class BucketCell extends RegionAllocator.Region {
            region: RegionAllocator.Region;
            constructor(x: any, y: any, w: any, h: any, region: any);
        }
        class BucketAllocator implements IRegionAllocator {
            private _w;
            private _h;
            private _filled;
            private _buckets;
            constructor(w: number, h: number);
            allocate(w: number, h: number): Region;
            free(region: BucketCell): void;
        }
    }
    module SurfaceRegionAllocator {
        interface ISurfaceRegionAllocator {
            surfaces: ISurface[];
            addSurface(surface: ISurface): any;
            allocate(w: number, h: number, excludeSurface: ISurface): ISurfaceRegion;
            free(region: ISurfaceRegion): any;
        }
        class SimpleAllocator implements ISurfaceRegionAllocator {
            private _createSurface;
            private _surfaces;
            surfaces: ISurface[];
            constructor(createSurface: (w: number, h: number) => ISurface);
            private _createNewSurface(w, h);
            addSurface(surface: ISurface): void;
            allocate(w: number, h: number, excludeSurface: ISurface): ISurfaceRegion;
            free(region: ISurfaceRegion): void;
        }
    }
}
declare module Shumway.GFX {
    import Rectangle = Geometry.Rectangle;
    import Matrix = Geometry.Matrix;
    import DirtyRegion = Geometry.DirtyRegion;
    import Filter = Shumway.GFX.Filter;
    enum BlendMode {
        Normal = 1,
        Layer = 2,
        Multiply = 3,
        Screen = 4,
        Lighten = 5,
        Darken = 6,
        Difference = 7,
        Add = 8,
        Subtract = 9,
        Invert = 10,
        Alpha = 11,
        Erase = 12,
        Overlay = 13,
        HardLight = 14,
    }
    enum NodeFlags {
        None = 0,
        BoundsAutoCompute = 2,
        IsMask = 4,
        Dirty = 16,
        InvalidBounds = 256,
        InvalidConcatenatedMatrix = 512,
        InvalidInvertedConcatenatedMatrix = 1024,
        InvalidConcatenatedColorMatrix = 2048,
        UpOnAddedOrRemoved,
        UpOnMoved,
        DownOnAddedOrRemoved,
        DownOnMoved,
        UpOnColorMatrixChanged,
        DownOnColorMatrixChanged,
        Visible = 65536,
        UpOnInvalidate,
        Default,
        CacheAsBitmap = 131072,
        PixelSnapping = 262144,
        ImageSmoothing = 524288,
        Dynamic = 1048576,
        Scalable = 2097152,
        Tileable = 4194304,
        Transparent = 32768,
    }
    enum NodeType {
        Node = 1,
        Shape = 3,
        Group = 5,
        Stage = 13,
        Renderable = 33,
    }
    enum NodeEventType {
        None = 0,
        OnStageBoundsChanged = 1,
        RemovedFromStage = 2,
    }
    class NodeVisitor {
        visitNode(node: Node, state: State): void;
        visitShape(node: Shape, state: State): void;
        visitGroup(node: Group, state: State): void;
        visitStage(node: Stage, state: State): void;
        visitRenderable(node: Renderable, state: State): void;
    }
    class State {
        constructor();
    }
    class PreRenderState extends State {
        private static _dirtyStack;
        matrix: Matrix;
        depth: number;
        constructor();
        transform(transform: Transform): PreRenderState;
        static allocate(): PreRenderState;
        clone(): PreRenderState;
        set(state: PreRenderState): void;
        free(): void;
    }
    class PreRenderVisitor extends NodeVisitor {
        isDirty: boolean;
        private _dirtyRegion;
        start(node: Group, dirtyRegion: DirtyRegion): void;
        visitGroup(node: Group, state: PreRenderState): void;
        visitNode(node: Node, state: PreRenderState): void;
    }
    class TracingNodeVisitor extends NodeVisitor {
        writer: IndentingWriter;
        constructor(writer: IndentingWriter);
        visitNode(node: Node, state: State): void;
        visitShape(node: Shape, state: State): void;
        visitGroup(node: Group, state: State): void;
        visitStage(node: Stage, state: State): void;
    }
    class Node {
        private static _path;
        private static _nextId;
        protected _id: number;
        id: number;
        protected _type: NodeType;
        _flags: NodeFlags;
        _index: number;
        _parent: Group;
        protected _clip: number;
        protected _layer: Layer;
        protected _transform: Transform;
        depth: number;
        protected _eventListeners: {
            type: NodeEventType;
            listener: (node: Node, type?: NodeEventType) => void;
        }[];
        protected _dispatchEvent(type: NodeEventType): void;
        addEventListener(type: NodeEventType, listener: (node: Node, type?: NodeEventType) => void): void;
        removeEventListener(type: NodeEventType, listener: (node: Node, type?: NodeEventType) => void): void;
        protected _properties: {
            [name: string]: any;
        };
        properties: {
            [name: string]: any;
        };
        protected _bounds: Rectangle;
        constructor();
        reset(): void;
        clip: number;
        parent: Node;
        getTransformedBounds(target: Node): Rectangle;
        _markCurrentBoundsAsDirtyRegion(): void;
        getStage(withDirtyRegion?: boolean): Stage;
        getChildren(clone?: boolean): Node[];
        getBounds(clone?: boolean): Rectangle;
        setBounds(value: Rectangle): void;
        clone(): Node;
        setFlags(flags: NodeFlags): void;
        hasFlags(flags: NodeFlags): boolean;
        hasAnyFlags(flags: NodeFlags): boolean;
        removeFlags(flags: NodeFlags): void;
        toggleFlags(flags: NodeFlags, on: boolean): void;
        _propagateFlagsUp(flags: NodeFlags): void;
        _propagateFlagsDown(flags: NodeFlags): void;
        isAncestor(node: Node): boolean;
        static _getAncestors(node: Node, last: Node): Node[];
        _findClosestAncestor(flags: NodeFlags, on: boolean): Node;
        isType(type: NodeType): boolean;
        isTypeOf(type: NodeType): boolean;
        isLeaf(): boolean;
        isLinear(): boolean;
        getTransformMatrix(clone?: boolean): Matrix;
        getTransform(): Transform;
        getLayer(): Layer;
        visit(visitor: NodeVisitor, state: State): void;
        invalidate(): void;
        toString(bounds?: boolean): string;
    }
    class Group extends Node {
        protected _children: Node[];
        constructor();
        getChildren(clone?: boolean): Node[];
        childAt(index: number): Node;
        child: Node;
        groupChild: Group;
        addChild(node: Node): void;
        removeChildAt(index: number): void;
        clearChildren(): void;
        _propagateFlagsDown(flags: NodeFlags): void;
        getBounds(clone?: boolean): Rectangle;
    }
    class Transform {
        protected _node: Node;
        protected _matrix: Matrix;
        protected _colorMatrix: ColorMatrix;
        protected _concatenatedMatrix: Matrix;
        protected _invertedConcatenatedMatrix: Matrix;
        protected _concatenatedColorMatrix: ColorMatrix;
        constructor(node: Node);
        setMatrix(value: Matrix): void;
        setColorMatrix(value: ColorMatrix): void;
        getMatrix(clone?: boolean): Matrix;
        hasColorMatrix(): boolean;
        getColorMatrix(clone?: boolean): ColorMatrix;
        getConcatenatedMatrix(clone?: boolean): Matrix;
        getInvertedConcatenatedMatrix(clone?: boolean): Matrix;
        toString(): string;
    }
    class Layer {
        protected _node: Node;
        protected _blendMode: BlendMode;
        protected _mask: Node;
        protected _filters: Filter[];
        constructor(node: Node);
        filters: Filter[];
        blendMode: BlendMode;
        mask: Node;
        toString(): string;
    }
    class Shape extends Node {
        private _source;
        ratio: number;
        constructor(source: Renderable);
        getBounds(clone?: boolean): Rectangle;
        source: Renderable;
        _propagateFlagsDown(flags: NodeFlags): void;
        getChildren(clone?: boolean): Node[];
    }
    import StageAlignFlags = Shumway.Remoting.StageAlignFlags;
    import StageScaleMode = Shumway.Remoting.StageScaleMode;
    class RendererOptions {
        debug: boolean;
        paintRenderable: boolean;
        paintBounds: boolean;
        paintDirtyRegion: boolean;
        paintFlashing: boolean;
        paintViewport: boolean;
        clear: boolean;
    }
    enum Backend {
        Canvas2D = 0,
        WebGL = 1,
        Both = 2,
        DOM = 3,
        SVG = 4,
    }
    class Renderer extends NodeVisitor {
        protected _viewport: Rectangle;
        protected _options: RendererOptions;
        protected _container: HTMLDivElement | HTMLCanvasElement;
        protected _stage: Stage;
        protected _devicePixelRatio: number;
        constructor(container: HTMLDivElement | HTMLCanvasElement, stage: Stage, options: RendererOptions);
        viewport: Rectangle;
        render(): void;
        resize(): void;
        screenShot(bounds: Rectangle, stageContent: boolean): ScreenShot;
    }
    class Stage extends Group {
        private _dirtyRegion;
        dirtyRegion: DirtyRegion;
        private _align;
        private _scaleMode;
        private _content;
        color: Color;
        private static DEFAULT_SCALE;
        private static DEFAULT_ALIGN;
        private _preVisitor;
        constructor(w: number, h: number, trackDirtyRegion?: boolean);
        setBounds(value: Rectangle): void;
        content: Group;
        readyToRender(): boolean;
        align: StageAlignFlags;
        scaleMode: StageScaleMode;
        private _updateContentMatrix();
    }
}
declare module Shumway.GFX {
    import Rectangle = Geometry.Rectangle;
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    import VideoPlaybackEvent = Shumway.Remoting.VideoPlaybackEvent;
    import VideoControlEvent = Shumway.Remoting.VideoControlEvent;
    class Renderable extends Node {
        private _parents;
        private _renderableParents;
        parents: Shape[];
        addParent(frame: Shape): void;
        willRender(): boolean;
        addRenderableParent(renderable: Renderable): void;
        wrap(): Shape;
        invalidate(): void;
        private _invalidateEventListeners;
        addInvalidateEventListener(listener: (renderable: Renderable) => void): void;
        getBounds(clone?: boolean): Shumway.GFX.Geometry.Rectangle;
        getChildren(clone?: boolean): Node[];
        _propagateFlagsUp(flags: NodeFlags): void;
        constructor();
        render(context: CanvasRenderingContext2D, ratio: number, cullBounds?: Shumway.GFX.Geometry.Rectangle, paintClip?: boolean, paintpaintStencil?: boolean): void;
    }
    class CustomRenderable extends Renderable {
        constructor(bounds: Rectangle, render: (context: CanvasRenderingContext2D, ratio: number, cullBounds: Shumway.GFX.Geometry.Rectangle) => void);
    }
    interface IVideoPlaybackEventSerializer {
        sendVideoPlaybackEvent(assetId: number, eventType: VideoPlaybackEvent, data: any): void;
    }
    enum RenderableVideoState {
        Idle = 1,
        Playing = 2,
        Paused = 3,
        Ended = 4,
    }
    class RenderableVideo extends Renderable {
        _flags: number;
        private _video;
        private _videoEventHandler;
        private _assetId;
        private _eventSerializer;
        private _lastTimeInvalidated;
        private _lastPausedTime;
        private _seekHappening;
        private _pauseHappening;
        private _isDOMElement;
        private _state;
        static _renderableVideos: RenderableVideo[];
        constructor(assetId: number, eventSerializer: IVideoPlaybackEventSerializer);
        video: HTMLVideoElement;
        state: RenderableVideoState;
        play(): void;
        pause(): void;
        private _handleVideoEvent(evt);
        private _notifyNetStream(eventType, data);
        processControlRequest(type: VideoControlEvent, data: any): any;
        checkForUpdate(): void;
        static checkForVideoUpdates(): void;
        render(context: CanvasRenderingContext2D, ratio: number, cullBounds: Rectangle): void;
    }
    class RenderableBitmap extends Renderable {
        _flags: number;
        properties: {
            [name: string]: any;
        };
        _canvas: HTMLCanvasElement;
        _context: CanvasRenderingContext2D;
        _imageData: ImageData;
        private _sourceImage;
        private fillStyle;
        static FromDataBuffer(type: ImageType, dataBuffer: DataBuffer, bounds: Rectangle): RenderableBitmap;
        static FromNode(source: Node, matrix: Shumway.GFX.Geometry.Matrix, colorMatrix: Shumway.GFX.ColorMatrix, blendMode: number, clipRect: Rectangle): RenderableBitmap;
        static FromImage(image: HTMLImageElement, width: number, height: number): RenderableBitmap;
        updateFromDataBuffer(type: ImageType, dataBuffer: DataBuffer): void;
        readImageData(output: DataBuffer): void;
        constructor(source: any, bounds: Rectangle);
        render(context: CanvasRenderingContext2D, ratio: number, cullBounds: Rectangle): void;
        drawNode(source: Node, matrix: Shumway.GFX.Geometry.Matrix, colorMatrix: Shumway.GFX.ColorMatrix, blendMode: number, clip: Rectangle): void;
        private _initializeSourceCanvas(source);
        private _ensureSourceCanvas();
        private imageData;
        renderSource: any;
        private _renderFallback(context);
    }
    enum PathType {
        Fill = 0,
        Stroke = 1,
        StrokeFill = 2,
    }
    class StyledPath {
        type: PathType;
        style: any;
        smoothImage: boolean;
        strokeProperties: StrokeProperties;
        path: Path2D;
        constructor(type: PathType, style: any, smoothImage: boolean, strokeProperties: StrokeProperties);
    }
    class StrokeProperties {
        thickness: number;
        scaleMode: LineScaleMode;
        capsStyle: string;
        jointsStyle: string;
        miterLimit: number;
        constructor(thickness: number, scaleMode: LineScaleMode, capsStyle: string, jointsStyle: string, miterLimit: number);
    }
    class RenderableShape extends Renderable {
        _flags: NodeFlags;
        properties: {
            [name: string]: any;
        };
        private fillStyle;
        private _paths;
        protected _id: number;
        protected _pathData: ShapeData;
        protected _textures: RenderableBitmap[];
        protected static LINE_CAPS_STYLES: string[];
        protected static LINE_JOINTS_STYLES: string[];
        constructor(id: number, pathData: ShapeData, textures: RenderableBitmap[], bounds: Rectangle);
        update(pathData: ShapeData, textures: RenderableBitmap[], bounds: Rectangle): void;
        render(context: CanvasRenderingContext2D, ratio: number, cullBounds: Rectangle, paintClip?: boolean, paintStencil?: boolean): void;
        protected _deserializePaths(data: ShapeData, context: CanvasRenderingContext2D, ratio: number): StyledPath[];
        private _createPath(type, style, smoothImage, strokeProperties, x, y);
        private _readMatrix(data);
        private _readGradient(styles, context);
        private _readBitmap(styles, context);
        protected _renderFallback(context: CanvasRenderingContext2D): void;
    }
    class RenderableMorphShape extends RenderableShape {
        _flags: NodeFlags;
        private _morphPaths;
        protected _deserializePaths(data: ShapeData, context: CanvasRenderingContext2D, ratio: number): StyledPath[];
        private _createMorphPath(type, ratio, style, smoothImage, strokeProperties, x, y);
        private _readMorphMatrix(data, morphData, ratio);
        private _readMorphGradient(styles, morphStyles, ratio, context);
        private _readMorphBitmap(styles, morphStyles, ratio, context);
    }
    class TextLine {
        private static _measureContext;
        x: number;
        y: number;
        width: number;
        ascent: number;
        descent: number;
        leading: number;
        align: number;
        runs: TextRun[];
        addRun(font: string, fillStyle: string, text: string, underline: boolean): void;
        wrap(maxWidth: number): TextLine[];
    }
    class TextRun {
        font: string;
        fillStyle: string;
        text: string;
        width: number;
        underline: boolean;
        constructor(font?: string, fillStyle?: string, text?: string, width?: number, underline?: boolean);
    }
    class RenderableText extends Renderable {
        _flags: number;
        properties: {
            [name: string]: any;
        };
        private _textBounds;
        private _textRunData;
        private _plainText;
        private _backgroundColor;
        private _borderColor;
        private _matrix;
        private _coords;
        private _scrollV;
        private _scrollH;
        textRect: Rectangle;
        lines: TextLine[];
        constructor(bounds: any);
        setBounds(bounds: any): void;
        setContent(plainText: string, textRunData: DataBuffer, matrix: Shumway.GFX.Geometry.Matrix, coords: DataBuffer): void;
        setStyle(backgroundColor: number, borderColor: number, scrollV: number, scrollH: number): void;
        reflow(autoSize: number, wordWrap: boolean): void;
        private static absoluteBoundPoints;
        private static roundBoundPoints(points);
        render(context: CanvasRenderingContext2D): void;
        private _renderChars(context);
        private _renderLines(context);
    }
    class Label extends Renderable {
        _flags: NodeFlags;
        properties: {
            [name: string]: any;
        };
        private _text;
        text: string;
        constructor(w: number, h: number);
        render(context: CanvasRenderingContext2D, ratio: number, cullBounds?: Rectangle): void;
    }
}
declare module Shumway.GFX {
    class Filter {
    }
    class BlurFilter extends Filter {
        blurX: number;
        blurY: number;
        quality: number;
        constructor(blurX: number, blurY: number, quality: number);
    }
    class DropshadowFilter extends Filter {
        alpha: number;
        angle: number;
        blurX: number;
        blurY: number;
        color: number;
        distance: number;
        hideObject: boolean;
        inner: boolean;
        knockout: boolean;
        quality: number;
        strength: number;
        constructor(alpha: number, angle: number, blurX: number, blurY: number, color: number, distance: number, hideObject: boolean, inner: boolean, knockout: boolean, quality: number, strength: number);
    }
    class GlowFilter extends Filter {
        alpha: number;
        blurX: number;
        blurY: number;
        color: number;
        inner: boolean;
        knockout: boolean;
        quality: number;
        strength: number;
        constructor(alpha: number, blurX: number, blurY: number, color: number, inner: boolean, knockout: boolean, quality: number, strength: number);
    }
    enum ColorMatrixType {
        Unknown = 0,
        Identity = 1,
    }
    class ColorMatrix {
        private _data;
        private _type;
        constructor(data: any);
        clone(): ColorMatrix;
        set(other: ColorMatrix): void;
        toWebGLMatrix(): Float32Array;
        asWebGLMatrix(): Float32Array;
        asWebGLVector(): Float32Array;
        isIdentity(): boolean;
        static createIdentity(): ColorMatrix;
        setMultipliersAndOffsets(redMultiplier: number, greenMultiplier: number, blueMultiplier: number, alphaMultiplier: number, redOffset: number, greenOffset: number, blueOffset: number, alphaOffset: number): void;
        transformRGBA(rgba: number): number;
        multiply(other: ColorMatrix): void;
        alphaMultiplier: number;
        hasOnlyAlphaMultiplier(): boolean;
        equals(other: ColorMatrix): boolean;
        toSVGFilterMatrix(): string;
    }
}
interface CanvasPattern {
    setTransform: (matrix: SVGMatrix) => void;
}
interface CanvasGradient {
    setTransform: (matrix: SVGMatrix) => void;
}
interface CanvasRenderingContext2D {
    stackDepth: number;
    fill(path: Path2D, fillRule?: string): void;
    clip(path: Path2D, fillRule?: string): void;
    stroke(path: Path2D): void;
    imageSmoothingEnabled: boolean;
    mozImageSmoothingEnabled: boolean;
    fillRule: string;
    mozFillRule: string;
    enterBuildingClippingRegion(): any;
    leaveBuildingClippingRegion(): any;
}
declare class Path2D {
    constructor();
    constructor(path: Path2D);
    constructor(paths: Path2D[], fillRule?: string);
    constructor(d: any);
    addPath(path: Path2D, transform?: SVGMatrix): void;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
    rect(x: number, y: number, w: number, h: number): void;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    closePath(): void;
}
