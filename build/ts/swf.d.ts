/// <reference path="base.d.ts" />
/// <reference path="tools.d.ts" />
declare module Shumway.SWF.Parser {
    function readSi8($bytes: any, $stream: any): any;
    function readSi16($bytes: any, $stream: any): any;
    function readSi32($bytes: any, $stream: any): any;
    function readUi8($bytes: any, $stream: any): any;
    function readUi16($bytes: any, $stream: any): any;
    function readUi32($bytes: any, $stream: any): any;
    function readFixed($bytes: any, $stream: any): number;
    function readFixed8($bytes: any, $stream: any): number;
    function readFloat16($bytes: any, $stream: any): number;
    function readFloat($bytes: any, $stream: any): any;
    function readDouble($bytes: any, $stream: any): any;
    function readEncodedU32($bytes: any, $stream: any): any;
    function readBool($bytes: any, $stream: any): boolean;
    function align($bytes: any, $stream: any): void;
    function readSb($bytes: any, $stream: any, size: any): number;
    function readUb($bytes: any, $stream: any, size: any): number;
    function readFb($bytes: any, $stream: any, size: any): number;
    function readString($bytes: any, $stream: any, length: any): string;
}
declare module Shumway.SWF.Parser.LowLevel {
    function defineImage($bytes: Uint8Array, $stream: Stream, $: any, swfVersion: any, tagCode: number, tagEnd: number, jpegTables: Uint8Array): any;
    function defineFont($bytes: any, $stream: any, $: any, swfVersion: any, tagCode: any): any;
    function soundStreamHead($bytes: any, $stream: any): any;
    function defineBitmap(bytes: any, stream: any, $: any, swfVersion: any, tagCode: number, tagEnd: number): any;
    function defineFont2($bytes: any, $stream: any, $: any, swfVersion: any, tagCode: any): any;
    function defineFont4($bytes: any, $stream: any, $: any, swfVersion: any, tagCode: any, tagEnd: any): any;
    function defineScene($bytes: any, $stream: any, $: any): any;
    function rgb($bytes: any, $stream: any): number;
    var tagHandlers: any;
    function readHeader($bytes: any, $stream: any): {
        frameRate: any;
        frameCount: any;
        bounds: Bounds;
    };
}
declare module Shumway.SWF.Parser {
    enum BitmapFormat {
        FORMAT_COLORMAPPED = 3,
        FORMAT_15BPP = 4,
        FORMAT_24BPP = 5,
    }
    function defineBitmap(tag: any): {
        definition: ImageDefinition;
        type: string;
    };
}
declare module Shumway.SWF.Parser {
    function defineButton(tag: any, dictionary: any): any;
}
declare module Shumway.SWF.Parser {
    function defineFont(tag: any): {
        type: string;
        id: any;
        name: any;
        bold: boolean;
        italic: boolean;
        codes: any;
        metrics: any;
        data: any;
        originalSize: boolean;
    };
}
declare module Shumway.SWF.Parser {
    function parseJpegChunks(image: any, bytes: Uint8Array, chunks: Uint8Array[]): Uint8Array[];
    function parsePngHeaders(image: any, bytes: Uint8Array): void;
    interface ImageDefinition {
        type: string;
        id: number;
        width: number;
        height: number;
        mimeType: string;
        data: Uint8Array;
        dataType?: ImageType;
        image: any;
    }
    interface DefineImageTag {
        id: number;
        imgData: Uint8Array;
        mimeType: string;
        alphaData: boolean;
        jpegTables: Uint8Array;
    }
    function defineImage(tag: DefineImageTag): ImageDefinition;
}
declare module Shumway.SWF.Parser {
    function defineLabel(tag: any): {
        type: string;
        id: any;
        fillBounds: any;
        matrix: any;
        tag: {
            hasText: boolean;
            initialText: string;
            html: boolean;
            readonly: boolean;
        };
        records: any;
        coords: any;
        static: boolean;
        require: any;
    };
}
declare module Shumway.SWF.Parser {
    function defineShape(tag: any): {
        type: string;
        id: any;
        fillBounds: any;
        lineBounds: any;
        morphFillBounds: any;
        morphLineBounds: any;
        shape: PlainObjectShapeData;
        transferables: ArrayBuffer[];
        require: any[];
    };
}
declare module Shumway.SWF.Parser {
    function defineSound(tag: any): {
        type: string;
        id: any;
        sampleRate: number;
        channels: number;
        pcm: any;
        packaged: any;
    };
    interface DecodedSound {
        streamId: number;
        samplesCount: number;
        pcm?: Float32Array;
        data?: Uint8Array;
        seek?: number;
    }
    class SoundStream {
        streamId: number;
        samplesCount: number;
        sampleRate: number;
        channels: number;
        format: any;
        currentSample: number;
        decode: (block: Uint8Array) => DecodedSound;
        constructor(samplesCount: any, sampleRate: any, channels: any);
        static FromTag(tag: any): SoundStream;
    }
}
declare module Shumway.SWF.Parser {
    function defineText(tag: any): {
        type: string;
        id: any;
        fillBounds: any;
        variableName: any;
        tag: any;
        bold: boolean;
        italic: boolean;
    };
}
declare module Shumway.SWF {
    var timelineBuffer: Tools.Profiler.TimelineBuffer;
    function enterTimeline(name: string, data?: any): void;
    function leaveTimeline(data?: any): void;
}
declare module Shumway.SWF {
    var parserOptions: any;
    var traceLevel: any;
}
declare module Shumway.JPEG {
    class JpegImage {
        width: number;
        height: number;
        jfif: {
            version: {
                major: number;
                minor: number;
            };
            densityUnits: number;
            xDensity: number;
            yDensity: number;
            thumbWidth: number;
            thumbHeight: number;
            thumbData: Uint8Array;
        };
        adobe: {
            version: number;
            flags0: number;
            flags1: number;
            transformCode: number;
        };
        components: any;
        numComponents: number;
        decodeTransform: boolean;
        colorTransform: boolean;
        parse(data: any): void;
        _getLinearizedBlockData(width: number, height: number): Uint8Array;
        _isColorConversionNeeded(): boolean;
        _convertYccToRgb(data: Uint8Array): Uint8Array;
        _convertYcckToRgb(data: Uint8Array): Uint8Array;
        _convertYcckToCmyk(data: Uint8Array): Uint8Array;
        _convertCmykToRgb(data: Uint8Array): Uint8Array;
        getData(width: number, height: number, forceRGBoutput: boolean): Uint8Array;
        copyToImageData(imageData: ImageData): void;
    }
}
declare module Shumway.SWF {
    var StreamNoDataError: {};
    class Stream {
        bytes: Uint8Array;
        pos: number;
        end: number;
        bitBuffer: number;
        bitLength: number;
        align: () => void;
        ensure: (size: number) => void;
        remaining: () => number;
        substream: (begin: number, end: number) => Stream;
        push: (data) => void;
        getUint16: (offset: number, le: boolean) => number;
        constructor(buffer: any, offset?: number, length?: number, maxLength?: number);
    }
}
declare module Shumway.SWF {
    var MP3WORKER_PATH: string;
    class MP3DecoderSession {
        private _sessionId;
        private _onworkermessageBound;
        private _worker;
        onframedata: (frameData: Uint8Array, channels: number, sampleRate: number, bitRate: number) => void;
        onid3tag: (tagData: any) => void;
        onclosed: () => void;
        onerror: (error: string) => void;
        constructor();
        private onworkermessage(e);
        pushAsync(data: any): void;
        close(): void;
        static processAll(data: Uint8Array): Promise<{
            data: Uint8Array;
            id3Tags: any;
        }>;
    }
}
declare module Shumway.SWF {
    import Parser = Shumway.SWF.Parser;
    class SWFFile {
        isCompressed: boolean;
        swfVersion: number;
        useAVM1: boolean;
        backgroundColor: number;
        bounds: Bounds;
        frameRate: number;
        frameCount: number;
        attributes: any;
        sceneAndFrameLabelData: any;
        bytesLoaded: number;
        bytesTotal: number;
        pendingUpdateDelays: number;
        framesLoaded: number;
        frames: SWFFrame[];
        abcBlocks: ABCBlock[];
        dictionary: DictionaryEntry[];
        fonts: {
            name: string;
            style: string;
            id: number;
        }[];
        data: Uint8Array;
        symbolClassesMap: string[];
        symbolClassesList: {
            id: number;
            className: string;
        }[];
        eagerlyParsedSymbolsMap: EagerlyParsedDictionaryEntry[];
        eagerlyParsedSymbolsList: EagerlyParsedDictionaryEntry[];
        private _uncompressedLength;
        private _uncompressedLoadedLength;
        private _dataView;
        private _dataStream;
        private _decompressor;
        private _jpegTables;
        private _endTagEncountered;
        private _loadStarted;
        private _lastScanPosition;
        private _currentFrameLabel;
        private _currentSoundStreamHead;
        private _currentSoundStreamBlock;
        private _currentControlTags;
        private _currentActionBlocks;
        private _currentInitActionBlocks;
        private _currentExports;
        constructor(initialBytes: Uint8Array, length: number);
        appendLoadedData(bytes: Uint8Array): void;
        finishLoading(): void;
        getSymbol(id: number): any;
        getParsedTag(unparsed: UnparsedTag): any;
        private readHeaderAndInitialize(initialBytes);
        private parseHeaderContents();
        private processFirstBatchOfDecompressedData(data);
        private processDecompressedData(data);
        private scanLoadedData();
        private scanTagsToOffset(endOffset, rootTimelineMode);
        parseNextTagHeader(target: UnparsedTag): boolean;
        private scanTag(tag, rootTimelineMode);
        parseSpriteTimeline(spriteTag: DictionaryEntry): any;
        private jumpToNextTag(currentTagLength);
        private emitTagSlopWarning(tag, tagEnd);
        private finishFrame();
        private setFileAttributes(tagLength);
        private setSceneAndFrameLabelData(tagLength);
        private addControlTag(tagCode, byteOffset, tagLength);
        private addLazySymbol(tagCode, byteOffset, tagLength);
        private decodeEmbeddedFont(unparsed);
        private registerEmbeddedFont(unparsed);
        private decodeEmbeddedImage(unparsed);
    }
    class SWFFrame {
        controlTags: UnparsedTag[];
        labelName: string;
        soundStreamHead: Parser.SoundStream;
        soundStreamBlock: Uint8Array;
        actionBlocks: Uint8Array[];
        initActionBlocks: InitActionBlock[];
        exports: SymbolExport[];
        constructor(controlTags?: UnparsedTag[], labelName?: string, soundStreamHead?: Parser.SoundStream, soundStreamBlock?: Uint8Array, actionBlocks?: Uint8Array[], initActionBlocks?: InitActionBlock[], exports?: SymbolExport[]);
    }
    class ABCBlock {
        name: string;
        flags: number;
        data: Uint8Array;
    }
    class InitActionBlock {
        spriteId: number;
        actionsData: Uint8Array;
    }
    class SymbolExport {
        symbolId: number;
        className: string;
        constructor(symbolId: number, className: string);
    }
    class UnparsedTag {
        tagCode: number;
        byteOffset: number;
        byteLength: number;
        constructor(tagCode: number, byteOffset: number, byteLength: number);
    }
    class DictionaryEntry extends UnparsedTag {
        id: number;
        constructor(id: number, tagCode: number, byteOffset: number, byteLength: number);
    }
    class EagerlyParsedDictionaryEntry extends DictionaryEntry {
        type: string;
        definition: Object;
        ready: boolean;
        constructor(id: number, unparsed: UnparsedTag, type: string, definition: any);
    }
    interface DisplayListTag {
        depth: number;
    }
    interface PlaceObjectTag extends DisplayListTag {
        flags: number;
        symbolId?: number;
        matrix?: any;
        cxform?: any;
        ratio?: number;
        name?: string;
        clipDepth?: number;
        filters?: any[];
        blendMode?: number;
        bmpCache?: number;
        visibility?: number;
    }
}
declare module Shumway {
    class ImageFile {
        data: Uint8Array;
        bytesLoaded: number;
        image: any;
        mimeType: string;
        type: number;
        width: number;
        height: number;
        constructor(header: Uint8Array, fileLength: number);
        bytesTotal: number;
        appendLoadedData(data: Uint8Array): void;
        private setMimetype();
    }
}
declare module Shumway {
    class LoadProgressUpdate {
        bytesLoaded: number;
        framesLoaded: number;
        constructor(bytesLoaded: number, framesLoaded: number);
    }
    interface ILoadListener {
        onLoadOpen: (any) => void;
        onLoadProgress: (update: LoadProgressUpdate) => void;
        onNewEagerlyParsedSymbols: (symbols: SWF.EagerlyParsedDictionaryEntry[], delta: number) => Promise<any>;
        onImageBytesLoaded: () => void;
        onLoadComplete: () => void;
        onLoadError: () => void;
    }
    class FileLoader {
        _file: any;
        private _listener;
        private _loadingServiceSession;
        private _delayedUpdatesPromise;
        private _lastDelayedUpdate;
        private _bytesLoaded;
        private _queuedInitialData;
        constructor(listener: ILoadListener);
        loadFile(request: any): void;
        abortLoad(): void;
        loadBytes(bytes: Uint8Array): void;
        processLoadOpen(): void;
        processNewData(data: Uint8Array, progressInfo: {
            bytesLoaded: number;
            bytesTotal: number;
        }): void;
        processError(error: any): void;
        processLoadClose(): void;
        private processSWFFileUpdate(file, previousEagerlyParsedSymbolsCount, previousFramesLoaded);
    }
}
