/// <reference path="avm2.d.ts" />
/// <reference path="../../src/avm1/flash.d.ts" />
declare module Shumway.AVM1 {
    class ActionsDataStream {
        private array;
        position: number;
        end: number;
        private readANSI;
        constructor(array: any, swfVersion: any);
        readUI8(): number;
        readUI16(): number;
        readSI16(): number;
        readInteger(): number;
        readFloat(): number;
        readDouble(): number;
        readBoolean(): boolean;
        readANSIString(): string;
        readUTF8String(): string;
        readString(): string;
        readBytes(length: any): Uint8Array;
    }
}
declare module Shumway.AVM1 {
    enum ActionCode {
        None = 0,
        ActionGotoFrame = 129,
        ActionGetURL = 131,
        ActionNextFrame = 4,
        ActionPreviousFrame = 5,
        ActionPlay = 6,
        ActionStop = 7,
        ActionToggleQuality = 8,
        ActionStopSounds = 9,
        ActionWaitForFrame = 138,
        ActionSetTarget = 139,
        ActionGoToLabel = 140,
        ActionPush = 150,
        ActionPop = 23,
        ActionAdd = 10,
        ActionSubtract = 11,
        ActionMultiply = 12,
        ActionDivide = 13,
        ActionEquals = 14,
        ActionLess = 15,
        ActionAnd = 16,
        ActionOr = 17,
        ActionNot = 18,
        ActionStringEquals = 19,
        ActionStringLength = 20,
        ActionMBStringLength = 49,
        ActionStringAdd = 33,
        ActionStringExtract = 21,
        ActionMBStringExtract = 53,
        ActionStringLess = 41,
        ActionToInteger = 24,
        ActionCharToAscii = 50,
        ActionMBCharToAscii = 54,
        ActionAsciiToChar = 51,
        ActionMBAsciiToChar = 55,
        ActionJump = 153,
        ActionIf = 157,
        ActionCall = 158,
        ActionGetVariable = 28,
        ActionSetVariable = 29,
        ActionGetURL2 = 154,
        ActionGotoFrame2 = 159,
        ActionSetTarget2 = 32,
        ActionGetProperty = 34,
        ActionSetProperty = 35,
        ActionCloneSprite = 36,
        ActionRemoveSprite = 37,
        ActionStartDrag = 39,
        ActionEndDrag = 40,
        ActionWaitForFrame2 = 141,
        ActionTrace = 38,
        ActionGetTime = 52,
        ActionRandomNumber = 48,
        ActionCallFunction = 61,
        ActionCallMethod = 82,
        ActionConstantPool = 136,
        ActionDefineFunction = 155,
        ActionDefineLocal = 60,
        ActionDefineLocal2 = 65,
        ActionDelete = 58,
        ActionDelete2 = 59,
        ActionEnumerate = 70,
        ActionEquals2 = 73,
        ActionGetMember = 78,
        ActionInitArray = 66,
        ActionInitObject = 67,
        ActionNewMethod = 83,
        ActionNewObject = 64,
        ActionSetMember = 79,
        ActionTargetPath = 69,
        ActionWith = 148,
        ActionToNumber = 74,
        ActionToString = 75,
        ActionTypeOf = 68,
        ActionAdd2 = 71,
        ActionLess2 = 72,
        ActionModulo = 63,
        ActionBitAnd = 96,
        ActionBitLShift = 99,
        ActionBitOr = 97,
        ActionBitRShift = 100,
        ActionBitURShift = 101,
        ActionBitXor = 98,
        ActionDecrement = 81,
        ActionIncrement = 80,
        ActionPushDuplicate = 76,
        ActionReturn = 62,
        ActionStackSwap = 77,
        ActionStoreRegister = 135,
        ActionInstanceOf = 84,
        ActionEnumerate2 = 85,
        ActionStrictEquals = 102,
        ActionGreater = 103,
        ActionStringGreater = 104,
        ActionDefineFunction2 = 142,
        ActionExtends = 105,
        ActionCastOp = 43,
        ActionImplementsOp = 44,
        ActionTry = 143,
        ActionThrow = 42,
        ActionFSCommand2 = 45,
        ActionStrictMode = 137,
    }
    class ParsedPushRegisterAction {
        registerNumber: number;
        constructor(registerNumber: number);
    }
    class ParsedPushConstantAction {
        constantIndex: number;
        constructor(constantIndex: number);
    }
    interface ParsedAction {
        position: number;
        actionCode: number;
        actionName: string;
        args: any[];
    }
    interface ArgumentAssignment {
        type: ArgumentAssignmentType;
        name?: string;
        index?: number;
    }
    enum ArgumentAssignmentType {
        None = 0,
        Argument = 1,
        This = 2,
        Arguments = 4,
        Super = 8,
        Global = 16,
        Parent = 32,
        Root = 64,
    }
    class ActionsDataParser {
        dataId: string;
        private _stream;
        private _actionsData;
        constructor(actionsData: AVM1ActionsData, swfVersion: number);
        position: number;
        eof: boolean;
        length: number;
        readNext(): ParsedAction;
        skip(count: any): void;
    }
}
declare module Shumway.AVM1 {
    interface ActionCodeBlock {
        label: number;
        items: ActionCodeBlockItem[];
        jump: number;
    }
    interface ActionCodeBlockItem {
        action: ParsedAction;
        next: number;
        conditionalJumpTo: number;
    }
    interface AnalyzerResults {
        actions: ActionCodeBlockItem[];
        blocks: ActionCodeBlock[];
        dataId: string;
        singleConstantPool: any[];
        registersLimit: number;
    }
    class ActionsDataAnalyzer {
        parentResults: AnalyzerResults;
        registersLimit: number;
        constructor();
        analyze(parser: ActionsDataParser): AnalyzerResults;
    }
}
declare module Shumway.AVM1 {
    import AVM1MovieClip = Lib.AVM1MovieClip;
    import AVM1Globals = Lib.AVM1Globals;
    class AVM1ActionsData {
        bytes: Uint8Array;
        id: string;
        parent: AVM1ActionsData;
        ir: any;
        constructor(bytes: Uint8Array, id: string, parent?: AVM1ActionsData);
    }
    interface AVM1ExportedSymbol {
        symbolId: number;
        symbolProps: any;
        theClass: any;
    }
    interface IAVM1RuntimeUtils {
        hasProperty(obj: any, name: any): any;
        getProperty(obj: any, name: any): any;
        setProperty(obj: any, name: any, value: any): any;
    }
    interface IAVM1EventPropertyObserver {
        onEventPropertyModified(name: string): any;
    }
    class AVM1Context {
        static instance: AVM1Context;
        root: AVM1MovieClip;
        loaderInfo: Shumway.AVM2.AS.flash.display.LoaderInfo;
        globals: AVM1Globals;
        constructor();
        utils: IAVM1RuntimeUtils;
        static create: (loaderInfo: Shumway.AVM2.AS.flash.display.LoaderInfo) => AVM1Context;
        flushPendingScripts(): void;
        addAsset(className: string, symbolId: number, symbolProps: any): void;
        registerClass(className: string, theClass: any): void;
        getAsset(className: string): AVM1ExportedSymbol;
        resolveTarget(target: any): any;
        resolveLevel(level: number): any;
        addToPendingScripts(fn: any): void;
        registerEventPropertyObserver(propertyName: string, observer: IAVM1EventPropertyObserver): void;
        unregisterEventPropertyObserver(propertyName: string, observer: IAVM1EventPropertyObserver): void;
        enterContext(fn: Function, defaultTarget: any): void;
        executeActions(actionsData: AVM1ActionsData, scopeObj: any): void;
    }
}
declare module Shumway.AVM1 {
    var avm1TraceEnabled: any;
    var avm1ErrorsEnabled: any;
    var avm1TimeoutDisabled: any;
    var avm1CompilerEnabled: any;
    var avm1DebuggerEnabled: any;
    var Debugger: {
        pause: boolean;
        breakpoints: {};
    };
    function executeActions(actionsData: AVM1ActionsData, as2Context: AVM1Context, scope: any): void;
}
declare module Shumway.AVM1.Lib {
    import flash = Shumway.AVM2.AS.flash;
    interface IAVM1SymbolBase {
        isAVM1Instance: boolean;
        as3Object: flash.display.DisplayObject;
        context: AVM1Context;
        initAVM1SymbolInstance(context: AVM1Context, as3Object: flash.display.DisplayObject): any;
        updateAllEvents(): any;
    }
    class AVM1EventHandler {
        propertyName: string;
        eventName: string;
        argsConverter: Function;
        constructor(propertyName: string, eventName: string, argsConverter?: Function);
        onBind(target: IAVM1SymbolBase): void;
        onUnbind(target: IAVM1SymbolBase): void;
    }
    class AVM1NativeObject {
        _context: AVM1Context;
        context: AVM1Context;
        initAVM1ObjectInstance(context: AVM1Context): void;
    }
    class AVM1SymbolBase<T extends flash.display.DisplayObject> extends AVM1NativeObject implements IAVM1SymbolBase, IAVM1EventPropertyObserver {
        isAVM1Instance: boolean;
        _as3Object: T;
        as3Object: T;
        initAVM1SymbolInstance(context: AVM1Context, as3Object: T): void;
        private _eventsMap;
        private _events;
        private _eventsListeners;
        bindEvents(events: AVM1EventHandler[], autoUnbind?: boolean): void;
        unbindEvents(): void;
        updateAllEvents(): void;
        private _updateEvent(event);
        private _addEventListener(event);
        private _removeEventListener(event);
        onEventPropertyModified(propertyName: any): void;
    }
    function avm1HasEventProperty(context: AVM1Context, target: any, propertyName: string): boolean;
    function avm1BroadcastEvent(context: AVM1Context, target: any, propertyName: string, args?: any[]): void;
    class AVM1Utils {
        static addProperty(obj: any, propertyName: string, getter: () => any, setter: (v: any) => any, enumerable?: boolean): any;
        static resolveTarget<T extends IAVM1SymbolBase>(target_mc?: any): T;
        static resolveMovieClip<T extends IAVM1SymbolBase>(target?: any): T;
        static resolveLevel(level: number): AVM1MovieClip;
        static currentStage: flash.display.Stage;
        static swfVersion: number;
        static getTarget(mc: IAVM1SymbolBase): string;
    }
    function getAVM1Object(as3Object: any, context: AVM1Context): any;
    function wrapAVM1Object<T>(obj: T, members: string[]): T;
    function wrapAVM1Class<T>(fn: T, staticMembers: string[], members: string[]): T;
    function installObjectMethods(): any;
    function initializeAVM1Object(as3Object: any, context: AVM1Context, placeObjectTag: any): void;
}
declare module Shumway.AVM1.Lib {
    import flash = Shumway.AVM2.AS.flash;
    import ASObject = Shumway.AVM2.AS.ASObject;
    import ASFunction = Shumway.AVM2.AS.ASFunction;
    class AVM1Globals {
        static createAVM1Class(): typeof AVM1Globals;
        static instance: AVM1Globals;
        _global: AVM1Globals;
        flash: any;
        constructor(context: AVM1Context);
        asfunction(link: any): void;
        ASSetPropFlags(obj: any, children: any, flags: any, allowFalse: any): any;
        call(frame: any): void;
        chr(number: any): string;
        clearInterval(id: number): void;
        clearTimeout(id: number): void;
        duplicateMovieClip(target: any, newname: any, depth: any): void;
        fscommand: typeof AVM2.AS.flash.system.FSCommand._fscommand;
        getAVM1Property(target: any, index: any): any;
        getTimer: typeof AVM2.AS.FlashUtilScript_getTimer;
        getURL(url: any, target?: any, method?: any): void;
        getVersion(): string;
        _addToPendingScripts(subject: any, fn: Function, args?: any[]): any;
        escape(str: string): string;
        unescape(str: string): string;
        gotoAndPlay(scene: any, frame?: any): void;
        gotoAndStop(scene: any, frame?: any): void;
        ifFrameLoaded(scene: any, frame?: any): boolean;
        int(value: any): number;
        length_(expression: any): number;
        loadMovie(url: string, target: any, method: string): void;
        _setLevel(level: number, loader: flash.display.Loader): any;
        loadMovieNum(url: any, level: any, method: any): void;
        loadVariables(url: string, target: any, method?: string): void;
        loadVariablesNum(url: string, level: number, method?: string): void;
        _loadVariables(nativeTarget: IAVM1SymbolBase, url: string, method: string): void;
        mbchr(number: any): string;
        mblength(expression: any): number;
        mbord(character: any): number;
        mbsubstring(value: any, index: any, count: any): string;
        nextFrame(): void;
        nextScene(): void;
        ord(character: any): number;
        play(): void;
        prevFrame(): void;
        prevScene(): void;
        print(target: any, boundingBox: any): void;
        printAsBitmap(target: any, boundingBox: any): void;
        printAsBitmapNum(level: any, boundingBox: any): void;
        printNum(level: any, bondingBox: any): void;
        random(value: any): number;
        removeMovieClip(target: any): void;
        setInterval(): any;
        setAVM1Property(target: any, index: any, value: any): void;
        setTimeout(): number;
        showRedrawRegions(enable: any, color: any): void;
        startDrag(target: any, lock: any, left: any, top: any, right: any, bottom: any): void;
        stop(): void;
        stopAllSounds(): void;
        stopDrag(target?: any): void;
        substring(value: any, index: any, count: any): string;
        targetPath(target: any): string;
        toggleHighQuality(): void;
        trace(expression: any): any;
        unloadMovie(target: any): void;
        unloadMovieNum(level: any): void;
        updateAfterEvent(): void;
        NaN: number;
        Infinity: number;
        isFinite: (n: number) => boolean;
        isNaN: (n: number) => boolean;
        parseFloat: (str: string) => number;
        parseInt: (s: string, radix?: number) => number;
        Object: typeof ASObject;
        Function: typeof ASFunction;
        Array: typeof AVM2.AS.ASArray;
        Number: typeof AVM2.AS.ASNumber;
        Math: typeof AVM2.AS.ASMath;
        Boolean: typeof AVM2.AS.ASBoolean;
        Date: typeof AVM2.AS.ASDate;
        RegExp: typeof AVM2.AS.ASRegExp;
        String: typeof AVM2.AS.ASString;
        undefined: any;
        MovieClip: typeof AVM1MovieClip;
        AsBroadcaster: typeof AVM1Broadcaster;
        System: typeof AVM1System;
        Stage: typeof AVM1Stage;
        Button: typeof AVM1Button;
        TextField: typeof AVM1TextField;
        Color: typeof AVM1Color;
        Key: typeof AVM1Key;
        Mouse: typeof AVM1Mouse;
        MovieClipLoader: typeof AVM1MovieClipLoader;
        Sound: typeof AVM1Sound;
        SharedObject: typeof AVM2.AS.flash.net.SharedObject;
        ContextMenu: typeof AVM2.AS.flash.ui.ContextMenu;
        ContextMenuItem: typeof AVM2.AS.flash.ui.ContextMenuItem;
        TextFormat: typeof AVM1TextFormat;
        private _initializeFlashObject();
        toString(): string;
    }
}
declare module Shumway.AVM1.Lib {
    class AVM1Broadcaster {
        private static _context;
        static setAVM1Context(context: AVM1Context): void;
        static createAVM1Class(): typeof AVM1Broadcaster;
        static initialize(obj: any): void;
        static initializeWithContext(obj: any, context: AVM1Context): void;
    }
}
declare module Shumway.AVM1.Lib {
    import flash = Shumway.AVM2.AS.flash;
    class AVM1Key {
        static DOWN: number;
        static LEFT: number;
        static RIGHT: number;
        static UP: number;
        private static _keyStates;
        private static _lastKeyCode;
        static createAVM1Class(): typeof AVM1Key;
        static _bind(stage: flash.display.Stage, context: AVM1Context): void;
        static isDown(code: any): boolean;
    }
}
declare module Shumway.AVM1.Lib {
    import flash = Shumway.AVM2.AS.flash;
    class AVM1Mouse {
        static createAVM1Class(): typeof AVM1Mouse;
        static _bind(stage: flash.display.Stage, context: AVM1Context): void;
        static hide(): void;
        static show(): void;
    }
}
declare module Shumway.AVM1.Lib {
    class AVM1Stage {
        static createAVM1Class(): typeof AVM1Stage;
        static align: string;
        static displayState: number;
        static fullScreenSourceRect: AVM2.AS.flash.geom.Rectangle;
        static height: number;
        static scaleMode: string;
        static showMenu: boolean;
        static width: number;
    }
}
declare module Shumway.AVM1.Lib {
    import flash = Shumway.AVM2.AS.flash;
    class AVM1MovieClip extends AVM1SymbolBase<flash.display.MovieClip> {
        static createAVM1Class(): typeof AVM1MovieClip;
        private _boundExecuteFrameScripts;
        private _frameScripts;
        constructor();
        private graphics;
        initAVM1SymbolInstance(context: AVM1Context, as3Object: flash.display.MovieClip): void;
        __lookupChild(id: string): any;
        private _lookupChildByName(name);
        __targetPath: string;
        _alpha: number;
        attachAudio(id: any): void;
        _constructMovieClipSymbol(symbolId: string, name: string): flash.display.MovieClip;
        attachMovie(symbolId: any, name: any, depth: any, initObject: any): AVM1SymbolBase<flash.display.MovieClip>;
        beginFill(color: any, alpha: any): void;
        beginBitmapFill(bmp: any, matrix: any, repeat: any, smoothing: any): void;
        beginGradientFill(fillType: any, colors: any, alphas: any, ratios: any, matrix: any, spreadMethod: any, interpolationMethod: any, focalPointRatio: any): void;
        blendMode: any;
        cacheAsBitmap: boolean;
        _callFrame(frame: any): any;
        clear(): void;
        private _insertChildAtDepth<T>(mc, depth);
        createEmptyMovieClip(name: any, depth: any): AVM1MovieClip;
        createTextField(name: any, depth: any, x: any, y: any, width: any, height: any): AVM1TextField;
        _currentframe: number;
        curveTo(controlX: any, controlY: any, anchorX: any, anchorY: any): void;
        _droptarget: flash.display.DisplayObject;
        private _duplicate(name, depth, initObject);
        duplicateMovieClip(name: any, depth: any, initObject: any): AVM1MovieClip;
        enabled: boolean;
        endFill(): void;
        filters: void;
        focusEnabled: void;
        _focusrect: void;
        forceSmoothing: void;
        _framesloaded: number;
        getBounds(bounds: any): flash.geom.Rectangle;
        getBytesLoaded(): number;
        getBytesTotal(): number;
        getDepth(): number;
        getInstanceAtDepth(depth: number): AVM1MovieClip;
        getNextHighestDepth(): number;
        getRect(bounds: any): void;
        getSWFVersion(): number;
        getTextSnapshot(): void;
        getURL(url: any, window: any, method: any): void;
        globalToLocal(pt: any): void;
        gotoAndPlay(frame: any): any;
        gotoAndStop(frame: any): any;
        _height: number;
        _highquality: number;
        hitArea: void;
        hitTest(x: any, y: any, shapeFlag: any): any;
        lineGradientStyle(fillType: any, colors: any, alphas: any, ratios: any, matrix: any, spreadMethod: any, interpolationMethod: any, focalPointRatio: any): void;
        lineStyle(thickness: any, rgb: any, alpha: any, pixelHinting: any, noScale: any, capsStyle: any, jointStyle: any, miterLimit: any): void;
        lineTo(x: any, y: any): void;
        loadMovie(url: string, method: string): void;
        loadVariables(url: string, method?: string): void;
        localToGlobal(pt: any): void;
        _lockroot: void;
        menu: any;
        moveTo(x: any, y: any): void;
        _name: string;
        nextFrame(): void;
        nextScene(): void;
        opaqueBackground: boolean;
        _parent: AVM1MovieClip;
        play(): void;
        prevFrame(): void;
        prevScene(): void;
        _quality: string;
        removeMovieClip(): void;
        _rotation: number;
        scale9Grid: void;
        scrollRect: void;
        setMask(mc: Object): void;
        _soundbuftime: void;
        startDrag(lock: any, left: any, top?: any, right?: any, bottom?: any): void;
        stop(): any;
        stopDrag(): any;
        swapDepths(target: Object): void;
        tabChildren: boolean;
        tabEnabled: boolean;
        tabIndex: number;
        _target: string;
        _totalframes: number;
        trackAsMenu: void;
        transform: void;
        toString(): any;
        unloadMovie(): void;
        _url: string;
        useHandCursor: boolean;
        _visible: boolean;
        _width: number;
        _x: number;
        _xmouse: number;
        _xscale: number;
        _y: number;
        _ymouse: number;
        _yscale: number;
        private _resolveLevelNProperty(name);
        asGetProperty(namespaces: Namespace[], name: any, flags: number): any;
        asHasProperty(namespaces: Namespace[], name: any, flags: number): boolean;
        asGetEnumerableKeys(): any;
        addFrameActionBlocks(frameIndex: number, frameData: any): void;
        addFrameScript(frameIndex: number, actionsBlock: Uint8Array): void;
        private _addInitActionBlocks(frameIndex, actionsBlocks);
        private _executeFrameScripts();
        private _initEventsHandlers();
    }
}
declare module Shumway.AVM1.Lib {
    import flash = Shumway.AVM2.AS.flash;
    class AVM1Button extends AVM1SymbolBase<flash.display.SimpleButton> {
        private _requiredListeners;
        private _actions;
        static createAVM1Class(): typeof AVM1Button;
        initAVM1SymbolInstance(context: AVM1Context, as3Object: flash.display.SimpleButton): void;
        _alpha: number;
        blendMode: any;
        cacheAsBitmap: boolean;
        enabled: boolean;
        filters: void;
        _focusrect: void;
        getDepth(): any;
        _height: number;
        _highquality: number;
        menu: any;
        _name: any;
        _parent: any;
        _quality: string;
        _rotation: number;
        scale9Grid: void;
        _soundbuftime: void;
        tabEnabled: boolean;
        tabIndex: number;
        _target: string;
        trackAsMenu: void;
        _url: string;
        useHandCursor: boolean;
        _visible: boolean;
        _width: number;
        _x: number;
        _xmouse: number;
        _xscale: number;
        _y: number;
        _ymouse: number;
        _yscale: number;
        private _addListeners();
        private _removeListeners();
        private _keyDownHandler(event);
        private _mouseEventHandler(type);
        private _runAction(action);
        private _initEventsHandlers();
    }
}
declare module Shumway.AVM1.Lib {
    import flash = Shumway.AVM2.AS.flash;
    class AVM1TextField extends AVM1SymbolBase<flash.text.TextField> {
        static createAVM1Class(): typeof AVM1TextField;
        private _variable;
        private _exitFrameHandler;
        initAVM1SymbolInstance(context: AVM1Context, as3Object: flash.text.TextField): void;
        _alpha: number;
        antiAliasType: any;
        autoSize: any;
        background: any;
        backgroundColor: any;
        border: any;
        borderColor: any;
        bottomScroll: any;
        condenseWhite: boolean;
        embedFonts: boolean;
        getNewTextFormat(): flash.text.TextFormat;
        getTextFormat(): Function;
        _height: number;
        _highquality: number;
        hscroll: number;
        html: void;
        htmlText: string;
        length: number;
        maxChars: number;
        maxhscroll: number;
        maxscroll: number;
        multiline: boolean;
        _name: string;
        _parent: flash.display.DisplayObjectContainer;
        password: boolean;
        _quality: string;
        _rotation: number;
        scroll: number;
        selectable: boolean;
        setNewTextFormat(value: any): void;
        setTextFormat(): void;
        _soundbuftime: void;
        tabEnabled: boolean;
        tabIndex: number;
        _target: string;
        text: string;
        textColor: any;
        textHeight: number;
        textWidth: number;
        type: any;
        _url: string;
        variable: any;
        private _onAS3ObjectExitFrame();
        private _syncTextFieldValue(instance, name);
        _visible: boolean;
        _width: number;
        wordWrap: boolean;
        _x: number;
        _xmouse: number;
        _xscale: number;
        _y: number;
        _ymouse: number;
        _yscale: number;
        private _initEventsHandlers();
    }
}
declare module Shumway.AVM1.Lib {
    class AVM1Color {
        static createAVM1Class(): typeof AVM1Color;
        private _target;
        constructor(target_mc: any);
        getRGB(): any;
        getTransform(): any;
        setRGB(offset: any): void;
        setTransform(transform: any): void;
    }
}
declare module Shumway.AVM1.Lib {
    import flash = Shumway.AVM2.AS.flash;
    class AVM1Transform {
        static createAVM1Class(): typeof AVM1Transform;
        private _target;
        constructor(target_mc: any);
        matrix: any;
        concatenatedMatrix: flash.geom.Matrix;
        colorTransform: flash.geom.ColorTransform;
        pixelBounds: flash.geom.Rectangle;
    }
}
declare module Shumway.AVM1.Lib {
    class AVM1Proxy<T> extends Shumway.AVM2.AS.ASObject {
        private _target;
        constructor();
        setTarget(target: T): void;
        private _isInternalProperty(namespaces, name, flags);
        asGetProperty(namespaces: Namespace[], name: any, flags: number): any;
        asGetNumericProperty(name: number): any;
        asSetNumericProperty(name: number, value: any): void;
        asSetProperty(namespaces: Namespace[], name: any, flags: number, value: any): void;
        asCallProperty(namespaces: Namespace[], name: any, flags: number, isLex: boolean, args: any[]): any;
        asHasProperty(namespaces: Namespace[], name: any, flags: number): any;
        asHasOwnProperty(namespaces: Namespace[], name: any, flags: number): any;
        asDeleteProperty(namespaces: Namespace[], name: any, flags: number): any;
        asNextName(index: number): any;
        asNextValue(index: number): any;
        asNextNameIndex(index: number): number;
        proxyNativeMethod(name: string): void;
        static wrap<T>(cls: T, natives: {
            methods?: string[];
        }): any;
    }
}
declare module Shumway.AVM1.Lib {
    import flash = Shumway.AVM2.AS.flash;
    class AVM1TextFormat extends flash.text.TextFormat {
        static createAVM1Class(): typeof AVM1TextFormat;
        constructor(font?: string, size?: number, color?: number, bold?: boolean, italic?: boolean, underline?: boolean, url?: string, target?: string, align?: string, leftMargin?: number, rightMargin?: number, indent?: number, leading?: number);
        private static _measureTextField;
        getTextExtent(text: string, width?: number): {};
    }
}
declare module Shumway.AVM1.Lib {
    import flash = Shumway.AVM2.AS.flash;
    class AVM1BitmapData extends flash.display.BitmapData {
        static createAVM1Class(): typeof AVM1BitmapData;
        static loadBitmap(symbolId: string): flash.display.BitmapData;
    }
}
declare module Shumway.AVM1.Lib {
    class AVM1ExternalInterface {
        static createAVM1Class(): typeof AVM1ExternalInterface;
        static available: Boolean;
        static addCallback(methodName: string, instance: any, method: Function): boolean;
        static call(methodName: string): any;
    }
}
declare module Shumway.AVM1.Lib {
    class AVM1Sound extends AVM1NativeObject {
        static createAVM1Class(): typeof AVM1Sound;
        private _target;
        private _sound;
        private _channel;
        private _linkageID;
        constructor(target_mc: any);
        attachSound(id: string): void;
        loadSound(url: string, isStreaming: boolean): void;
        getBytesLoaded(): number;
        getBytesTotal(): number;
        getPan(): number;
        setPan(value: number): void;
        getTransform(): any;
        setTransform(transformObject: any): void;
        getVolume(): number;
        setVolume(value: number): void;
        start(secondOffset?: number, loops?: number): void;
        private _stopSoundChannel();
        stop(linkageID?: string): void;
    }
}
declare module Shumway.AVM1.Lib {
    import flash = Shumway.AVM2.AS.flash;
    class AVM1System {
        static createAVM1Class(): typeof AVM1System;
        static capabilities: typeof flash.system.Capabilities;
        static security: typeof flash.system.Security;
    }
}
declare module Shumway.AVM1.Lib {
    class AVM1MovieClipLoader {
        static createAVM1Class(): typeof AVM1MovieClipLoader;
        initAVM1ObjectInstance(context: AVM1Context): void;
        private _loader;
        private _target;
        constructor();
        loadClip(url: string, target: any): Boolean;
        unloadClip(target: any): Boolean;
        getProgress(target: any): number;
        private _broadcastMessage(message, args?);
        private openHandler(event);
        private progressHandler(event);
        private ioErrorHandler(event);
        private completeHandler(event);
        private initHandler(event);
    }
}
