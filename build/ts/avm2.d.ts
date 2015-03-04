/// <reference path="base.d.ts" />
/// <reference path="tools.d.ts" />
declare module Shumway.AVM2 {
    var timelineBuffer: Tools.Profiler.TimelineBuffer;
    var counter: Metrics.Counter;
    function countTimeline(name: string, value?: number): void;
    function enterTimeline(name: string, data?: any): void;
    function leaveTimeline(data?: any): void;
}
declare module Shumway.AVM2 {
    var Errors: {
        InvokeOnIncompatibleObjectError: {
            code: number;
            message: string;
        };
        CallOfNonFunctionError: {
            code: number;
            message: string;
        };
        ConvertNullToObjectError: {
            code: number;
            message: string;
        };
        ConvertUndefinedToObjectError: {
            code: number;
            message: string;
        };
        ClassNotFoundError: {
            code: number;
            message: string;
        };
        CheckTypeFailedError: {
            code: number;
            message: string;
        };
        WrongArgumentCountError: {
            code: number;
            message: string;
        };
        ConstWriteError: {
            code: number;
            message: string;
        };
        XMLOnlyWorksWithOneItemLists: {
            code: number;
            message: string;
        };
        XMLAssignmentToIndexedXMLNotAllowed: {
            code: number;
            message: string;
        };
        XMLMarkupMustBeWellFormed: {
            code: number;
            message: string;
        };
        XMLAssigmentOneItemLists: {
            code: number;
            message: string;
        };
        XMLNamespaceWithPrefixAndNoURI: {
            code: number;
            message: string;
        };
        OutOfRangeError: {
            code: number;
            message: string;
        };
        VectorFixedError: {
            code: number;
            message: string;
        };
        JSONCyclicStructure: {
            code: number;
            message: string;
        };
        JSONInvalidReplacer: {
            code: number;
            message: string;
        };
        JSONInvalidParseInput: {
            code: number;
            message: string;
        };
        InvalidRangeError: {
            code: number;
            message: string;
        };
        NullArgumentError: {
            code: number;
            message: string;
        };
        InvalidArgumentError: {
            code: number;
            message: string;
        };
        InvalidParamError: {
            code: number;
            message: string;
        };
        ParamRangeError: {
            code: number;
            message: string;
        };
        NullPointerError: {
            code: number;
            message: string;
        };
        InvalidEnumError: {
            code: number;
            message: string;
        };
        CantInstantiateError: {
            code: number;
            message: string;
        };
        InvalidBitmapData: {
            code: number;
            message: string;
        };
        EOFError: {
            code: number;
            message: string;
            fqn: string;
        };
        CompressedDataError: {
            code: number;
            message: string;
            fqn: string;
        };
        ProxyGetPropertyError: {
            code: number;
            message: string;
        };
        ProxySetPropertyError: {
            code: number;
            message: string;
        };
        ProxyCallPropertyError: {
            code: number;
            message: string;
        };
        ProxyHasPropertyError: {
            code: number;
            message: string;
        };
        ProxyDeletePropertyError: {
            code: number;
            message: string;
        };
        ProxyGetDescendantsError: {
            code: number;
            message: string;
        };
        ProxyNextNameIndexError: {
            code: number;
            message: string;
        };
        ProxyNextNameError: {
            code: number;
            message: string;
        };
        ProxyNextValueError: {
            code: number;
            message: string;
        };
        TooFewArgumentsError: {
            code: number;
            message: string;
        };
        SocketConnectError: {
            code: number;
            message: string;
        };
        CantAddSelfError: {
            code: number;
            message: string;
        };
        NotAChildError: {
            code: number;
            message: string;
        };
        DelayRangeError: {
            code: number;
            message: string;
        };
        ExternalInterfaceNotAvailableError: {
            code: number;
            message: string;
        };
        InvalidLoaderMethodError: {
            code: number;
            message: string;
        };
        InvalidStageMethodError: {
            code: number;
            message: string;
        };
        LoadingObjectNotSWFError: {
            code: number;
            message: string;
        };
        LoadingObjectNotInitializedError: {
            code: number;
            message: string;
        };
        DecodeParamError: {
            code: number;
            message: string;
        };
        SceneNotFoundError: {
            code: number;
            message: string;
        };
        FrameLabelNotFoundError: {
            code: number;
            message: string;
        };
        InvalidLoaderInfoMethodError: {
            code: number;
            message: string;
        };
        CantAddParentError: {
            code: number;
            message: string;
        };
        ObjectWithStringsParamError: {
            code: number;
            message: string;
        };
    };
    function getErrorMessage(index: number): string;
    function getErrorInfo(index: number): {
        code: number;
        message: string;
        typeName: string;
    };
    function formatErrorMessage(error: any, ...args: any[]): string;
    function translateErrorMessage(error: any): any;
}
declare module Shumway.AVM2.ABC {
    class AbcStream {
        private static _resultBuffer;
        private _bytes;
        private _view;
        private _position;
        constructor(bytes: Uint8Array);
        private static _getResultBuffer(length);
        position: number;
        remaining(): number;
        seek(position: number): void;
        readU8(): number;
        readU8s(count: number): Uint8Array;
        readS8(): number;
        readU32(): number;
        readU30(): number;
        readU30Unsafe(): number;
        readS16(): number;
        readS32(): number;
        readWord(): number;
        readS24(): number;
        readDouble(): number;
        readUTFString(length: any): string;
    }
}
declare module Shumway.AVM2.ABC {
    class Parameter {
        name: string;
        type: Multiname;
        value: any;
        optional: boolean;
        isUsed: boolean;
        constructor(name: string, type: Multiname, value: any, optional: boolean);
    }
    class Trait {
        name: Multiname;
        abc: AbcFile;
        holder: Info;
        hasDefaultValue: boolean;
        value: any;
        kind: TRAIT;
        attributes: number;
        slotId: number;
        dispId: number;
        typeName: Multiname;
        methodInfo: MethodInfo;
        classInfo: ClassInfo;
        metadata: any;
        trace: (writer: IndentingWriter) => void;
        constructor(abc: AbcFile, stream: AbcStream, holder: Info);
        isSlot(): boolean;
        isConst(): boolean;
        isMethod(): boolean;
        isClass(): boolean;
        isGetter(): boolean;
        isSetter(): boolean;
        isAccessor(): boolean;
        isMethodOrAccessor(): boolean;
        isProtected(): boolean;
        kindName(): string;
        isOverride(): number;
        isFinal(): number;
        toString(): string;
        static parseTraits(abc: AbcFile, stream: AbcStream, holder: Info): Trait[];
    }
    class Info {
        abc: AbcFile;
        index: number;
        hash: number;
        traits: any[];
        trace: (writer: IndentingWriter) => void;
        constructor(abc: AbcFile, index: number, hash: Hashes);
    }
    class MethodInfo extends Info {
        static parseParameterNames: boolean;
        flags: number;
        name: Multiname;
        displayName: string;
        parameters: Parameter[];
        returnType: Multiname;
        holder: Info;
        maxStack: number;
        localCount: number;
        initScopeDepth: number;
        maxScopeDepth: number;
        code: Uint8Array;
        exceptions: any[];
        freeMethod: Function;
        cachedMethodOrTrampoline: Function;
        cachedMemoizer: Runtime.IMemoizer;
        classScope: Runtime.Scope;
        lastBoundMethod: {
            scope: Shumway.AVM2.Runtime.Scope;
            boundMethod: Function;
        };
        activationPrototype: Object;
        analysis: Analysis;
        hasBody: boolean;
        isInstanceInitializer: boolean;
        isClassInitializer: boolean;
        isScriptInitializer: boolean;
        isMethod: boolean;
        isGetter: boolean;
        isSetter: boolean;
        private static _getParameterName(i);
        constructor(abc: AbcFile, index: number, stream: AbcStream);
        toString(): string;
        hasOptional(): boolean;
        needsActivation(): boolean;
        needsRest(): boolean;
        needsArguments(): boolean;
        isNative(): boolean;
        isClassMember(): boolean;
        isInstanceMember(): boolean;
        isScriptMember(): boolean;
        hasSetsDxns(): boolean;
        static parseException(abc: any, stream: any): {
            start: any;
            end: any;
            target: any;
            typeNameIndex: any;
            typeName: any;
            varName: any;
        };
        static parseBody(abc: AbcFile, stream: AbcStream): void;
        hasExceptions(): boolean;
        trace: (writer: IndentingWriter) => void;
    }
    class InstanceInfo extends Info {
        runtimeId: number;
        name: Multiname;
        superName: Multiname;
        protectedNs: Namespace;
        flags: number;
        interfaces: Multiname[];
        init: MethodInfo;
        classInfo: ClassInfo;
        traits: Trait[];
        static nextID: number;
        constructor(abc: AbcFile, index: number, stream: AbcStream);
        toString(): string;
        isFinal(): boolean;
        isSealed(): boolean;
        isInterface(): boolean;
    }
    enum Hashes {
        AbcMask = 65535,
        KindMask = 458752,
        ClassInfo = 0,
        InstanceInfo = 65536,
        MethodInfo = 131072,
        ScriptInfo = 196608,
        NamespaceSet = 262144,
        IndexOffset = 19,
    }
    class ClassInfo extends Info {
        metadata: any;
        runtimeId: number;
        init: MethodInfo;
        instanceInfo: InstanceInfo;
        defaultValue: any;
        native: any;
        classObject: Shumway.AVM2.AS.ASClass;
        static nextID: number;
        constructor(abc: AbcFile, index: number, stream: AbcStream);
        static getDefaultValue(qn: any): any;
        toString(): string;
    }
    class ScriptInfo extends Info {
        runtimeId: number;
        hash: number;
        init: MethodInfo;
        name: string;
        traits: Trait[];
        global: Shumway.AVM2.Runtime.Global;
        loaded: boolean;
        executed: boolean;
        executing: boolean;
        constructor(abc: AbcFile, index: number, stream: AbcStream);
        toString(): string;
    }
    class AbcFile {
        name: string;
        hash: number;
        constantPool: ConstantPool;
        methods: MethodInfo[];
        metadata: MetaDataInfo[];
        instances: InstanceInfo[];
        classes: ClassInfo[];
        scripts: ScriptInfo[];
        env: any;
        applicationDomain: Shumway.AVM2.Runtime.ApplicationDomain;
        trace: (writer: IndentingWriter) => void;
        constructor(bytes: Uint8Array, name: string, hash?: number);
        private static _checkMagic(stream);
        lastScript: ScriptInfo;
        static attachHolder(mi: MethodInfo, holder: Info): void;
        toString(): string;
        getConstant(hash: number): any;
    }
    class Namespace {
        private static _publicPrefix;
        private static _kinds;
        private static _MIN_API_MARK;
        private static _MAX_API_MARK;
        kind: number;
        uri: string;
        prefix: string;
        qualifiedName: string;
        constructor(kind: CONSTANT, uri?: string, prefix?: string, uniqueURIHash?: number);
        private _buildNamespace(uniqueURIHash?);
        private static _knownURIs;
        private static _hashNamespace(kind, uri, prefix);
        private static _mangledNamespaceCache;
        private static _mangledNamespaceMap;
        private static _qualifyNamespace(kind, uri, prefix);
        static fromQualifiedName(qn: string): Namespace;
        static kindFromString(str: string): CONSTANT;
        static createNamespace(uri: string, prefix?: string): Namespace;
        static parse(constantPool: ConstantPool, stream: AbcStream, hash: number): Namespace;
        isPublic(): boolean;
        isProtected(): boolean;
        isPrivate(): boolean;
        isPackageInternal(): boolean;
        isUnique(): boolean;
        isDynamic(): boolean;
        getURI(): string;
        toString(): string;
        clone(): Namespace;
        isEqualTo(other: Namespace): boolean;
        inNamespaceSet(set: Namespace[]): boolean;
        getAccessModifier(): string;
        getQualifiedName(): string;
        static PUBLIC: Namespace;
        static PROTECTED: Namespace;
        static PROXY: Namespace;
        static VECTOR: Namespace;
        static VECTOR_PACKAGE: Namespace;
        static BUILTIN: Namespace;
        private static _simpleNameCache;
        static fromSimpleName(simpleName: any): Namespace[];
    }
    class Multiname {
        static ATTRIBUTE: number;
        static RUNTIME_NAMESPACE: number;
        static RUNTIME_NAME: number;
        private static _nextID;
        namespaces: Namespace[];
        name: string;
        flags: number;
        runtimeId: number;
        typeParameter: Multiname;
        qualifiedName: any;
        private _qualifiedNameCache;
        private static _publicQualifiedNameCache;
        constructor(namespaces: Namespace[], name: string, flags: number);
        static parse(constantPool: ConstantPool, stream: AbcStream, multinames: Multiname[], typeNamePatches: any[], multinameIndex: number): any;
        static isMultiname(mn: any): boolean;
        static needsResolution(mn: any): boolean;
        static isQName(mn: any): boolean;
        static isRuntimeName(mn: any): boolean;
        static isRuntimeNamespace(mn: any): boolean;
        static isRuntime(mn: any): boolean;
        static getQualifiedName(mn: any): any;
        static qualifyName(namespace: any, name: any): string;
        static stripPublicQualifier(qn: any): string;
        static fromQualifiedName(qn: any): Multiname;
        static getNameFromPublicQualifiedName(qn: any): string;
        static getFullQualifiedName(mn: any): string;
        static getPublicQualifiedName(name: any): any;
        static isPublicQualifiedName(qn: any): boolean;
        static getAccessModifier(mn: any): string;
        static isNumeric(mn: any): boolean;
        static getName(mn: Multiname): string;
        static isAnyName(mn: any): boolean;
        private static _simpleNameCache;
        static fromSimpleName(simpleName: string): Multiname;
        getQName(index: number): Multiname;
        hasQName(qn: any): boolean;
        isAttribute(): boolean;
        isAnyName(): boolean;
        isAnyNamespace(): boolean;
        isRuntimeName(): boolean;
        isRuntimeNamespace(): boolean;
        isRuntime(): boolean;
        isQName(): boolean;
        isSimpleStatic(): boolean;
        hasTypeParameter(): boolean;
        getName(): any;
        getOriginalName(): string;
        getNamespace(): Namespace;
        nameToString(): string;
        hasObjectName(): boolean;
        toString(): string;
        static Int: any;
        static Uint: any;
        static Class: any;
        static Array: any;
        static Object: any;
        static String: any;
        static Number: any;
        static Boolean: any;
        static Function: any;
        static XML: any;
        static XMLList: any;
        static TO_STRING: any;
        static VALUE_OF: any;
        static TEMPORARY: Multiname;
    }
    class MetaDataInfo {
        name: string;
        value: {
            key: string;
            value: string[];
        }[];
        trace: (writer: IndentingWriter) => void;
        constructor(abc: AbcFile, stream: AbcStream);
        toString(): string;
    }
    enum CONSTANT {
        Undefined = 0,
        Utf8 = 1,
        Float = 2,
        Int = 3,
        UInt = 4,
        PrivateNs = 5,
        Double = 6,
        QName = 7,
        Namespace = 8,
        Multiname = 9,
        False = 10,
        True = 11,
        Null = 12,
        QNameA = 13,
        MultinameA = 14,
        RTQName = 15,
        RTQNameA = 16,
        RTQNameL = 17,
        RTQNameLA = 18,
        NameL = 19,
        NameLA = 20,
        NamespaceSet = 21,
        PackageNamespace = 22,
        PackageInternalNs = 23,
        ProtectedNamespace = 24,
        ExplicitNamespace = 25,
        StaticProtectedNs = 26,
        MultinameL = 27,
        MultinameLA = 28,
        TypeName = 29,
        ClassSealed = 1,
        ClassFinal = 2,
        ClassInterface = 4,
        ClassProtectedNs = 8,
    }
    enum METHOD {
        Arguments = 1,
        Activation = 2,
        Needrest = 4,
        HasOptional = 8,
        IgnoreRest = 16,
        Native = 32,
        Setsdxns = 64,
        HasParamNames = 128,
        HasBody = 256,
        InstanceInitializer = 512,
        ClassInitializer = 1024,
        ScriptInitializer = 2048,
        MethodTrait = 4096,
        GetterTrait = 8192,
        SetterTrait = 16384,
    }
    enum TRAIT {
        Slot = 0,
        Method = 1,
        Getter = 2,
        Setter = 3,
        Class = 4,
        Function = 5,
        Const = 6,
    }
    var MethodTypeFlagByTraitKind: {
        1: METHOD;
        2: METHOD;
        3: METHOD;
    };
    enum ATTR {
        Final = 1,
        Override = 2,
        Metadata = 4,
    }
    enum SORT {
        CASEINSENSITIVE = 1,
        DESCENDING = 2,
        UNIQUESORT = 4,
        RETURNINDEXEDARRAY = 8,
        NUMERIC = 16,
    }
    class ConstantPool {
        static _nextNamespaceSetID: number;
        ints: number[];
        uints: number[];
        doubles: number[];
        strings: string[];
        multinames: Multiname[];
        namespaces: Namespace[];
        namespaceSets: Namespace[][];
        trace: (writer: IndentingWriter) => void;
        constructor(stream: AbcStream, abc: AbcFile);
        getValue(kind: CONSTANT, index: number): any;
    }
}
declare module Shumway.AVM2.ABC {
}
declare module Shumway.AVM2 {
    import AbcStream = Shumway.AVM2.ABC.AbcStream;
    import MethodInfo = Shumway.AVM2.ABC.MethodInfo;
    enum OP {
        bkpt = 1,
        nop = 2,
        getsuper = 4,
        setsuper = 5,
        dxns = 6,
        dxnslate = 7,
        kill = 8,
        label = 9,
        lf32x4 = 10,
        sf32x4 = 11,
        ifnlt = 12,
        ifnle = 13,
        ifngt = 14,
        ifnge = 15,
        jump = 16,
        iftrue = 17,
        iffalse = 18,
        ifeq = 19,
        ifne = 20,
        iflt = 21,
        ifle = 22,
        ifgt = 23,
        ifge = 24,
        ifstricteq = 25,
        ifstrictne = 26,
        lookupswitch = 27,
        pushwith = 28,
        popscope = 29,
        nextname = 30,
        hasnext = 31,
        pushnull = 32,
        pushundefined = 33,
        pushfloat = 34,
        nextvalue = 35,
        pushbyte = 36,
        pushshort = 37,
        pushtrue = 38,
        pushfalse = 39,
        pushnan = 40,
        pop = 41,
        dup = 42,
        swap = 43,
        pushstring = 44,
        pushint = 45,
        pushuint = 46,
        pushdouble = 47,
        pushscope = 48,
        pushnamespace = 49,
        hasnext2 = 50,
        li8 = 53,
        li16 = 54,
        li32 = 55,
        lf32 = 56,
        lf64 = 57,
        si8 = 58,
        si16 = 59,
        si32 = 60,
        sf32 = 61,
        sf64 = 62,
        newfunction = 64,
        call = 65,
        construct = 66,
        callmethod = 67,
        callstatic = 68,
        callsuper = 69,
        callproperty = 70,
        returnvoid = 71,
        returnvalue = 72,
        constructsuper = 73,
        constructprop = 74,
        callsuperid = 75,
        callproplex = 76,
        callinterface = 77,
        callsupervoid = 78,
        callpropvoid = 79,
        sxi1 = 80,
        sxi8 = 81,
        sxi16 = 82,
        applytype = 83,
        pushfloat4 = 84,
        newobject = 85,
        newarray = 86,
        newactivation = 87,
        newclass = 88,
        getdescendants = 89,
        newcatch = 90,
        findpropstrict = 93,
        findproperty = 94,
        finddef = 95,
        getlex = 96,
        setproperty = 97,
        getlocal = 98,
        setlocal = 99,
        getglobalscope = 100,
        getscopeobject = 101,
        getproperty = 102,
        getouterscope = 103,
        initproperty = 104,
        setpropertylate = 105,
        deleteproperty = 106,
        deletepropertylate = 107,
        getslot = 108,
        setslot = 109,
        getglobalslot = 110,
        setglobalslot = 111,
        convert_s = 112,
        esc_xelem = 113,
        esc_xattr = 114,
        convert_i = 115,
        convert_u = 116,
        convert_d = 117,
        convert_b = 118,
        convert_o = 119,
        checkfilter = 120,
        convert_f = 121,
        unplus = 122,
        convert_f4 = 123,
        coerce = 128,
        coerce_b = 129,
        coerce_a = 130,
        coerce_i = 131,
        coerce_d = 132,
        coerce_s = 133,
        astype = 134,
        astypelate = 135,
        coerce_u = 136,
        coerce_o = 137,
        negate = 144,
        increment = 145,
        inclocal = 146,
        decrement = 147,
        declocal = 148,
        not = 150,
        bitnot = 151,
        add = 160,
        subtract = 161,
        multiply = 162,
        divide = 163,
        modulo = 164,
        lshift = 165,
        rshift = 166,
        urshift = 167,
        bitand = 168,
        bitor = 169,
        bitxor = 170,
        equals = 171,
        strictequals = 172,
        lessthan = 173,
        lessequals = 174,
        greaterthan = 175,
        greaterequals = 176,
        istype = 178,
        istypelate = 179,
        increment_i = 192,
        decrement_i = 193,
        inclocal_i = 194,
        declocal_i = 195,
        negate_i = 196,
        add_i = 197,
        subtract_i = 198,
        multiply_i = 199,
        getlocal0 = 208,
        getlocal1 = 209,
        getlocal2 = 210,
        getlocal3 = 211,
        setlocal0 = 212,
        setlocal1 = 213,
        setlocal2 = 214,
        setlocal3 = 215,
        invalid = 237,
        debug = 239,
        debugline = 240,
        debugfile = 241,
        bkptline = 242,
        timestamp = 243,
        throw = 3,
        typeof = 149,
        instanceof = 177,
        in = 180,
    }
    interface OpcodeOperandDescription {
        name: string;
        size: OpcodeSize;
        type: string;
    }
    interface OpcodeDescription {
        canThrow: boolean;
        operands: OpcodeOperandDescription[];
    }
    var opcodeTable: OpcodeDescription[];
    enum OpcodeSize {
        u08 = 0,
        s08 = 1,
        s16 = 2,
        s24 = 3,
        u30 = 4,
        u32 = 5,
    }
    function opcodeName(op: any): string;
    class BytecodePool {
        private static _pool;
        static get(stream: AbcStream): Bytecode;
        static release(bc: Bytecode): void;
        static releaseList(list: Bytecode[]): void;
    }
    class Bytecode {
        ti: Verifier.TypeInformation;
        pc: number;
        op: number;
        position: number;
        canThrow: boolean;
        offsets: number[];
        target: Bytecode;
        targets: Bytecode[];
        level: number;
        relooperBlock: number;
        bid: number;
        succs: Bytecode[];
        preds: Bytecode[];
        dominatees: Bytecode[];
        dominator: Bytecode;
        end: Bytecode;
        region: Compiler.IR.Region;
        spbacks: BlockSet;
        bdo: number;
        hasCatches: boolean;
        verifierEntryState: Verifier.State;
        index: number;
        object: number;
        argCount: number;
        offset: number;
        value: number;
        constructor(code: any);
        parse(code: AbcStream): Bytecode;
        isBlockEnd(): boolean;
        makeBlockHead(id: any): any;
        trace(writer: any): void;
        toString(abc: any): string;
    }
    interface BytecodeVisitor {
        (bytecode: Bytecode): void;
    }
    class BlockSet extends Shumway.BitSets.Uint32ArrayBitSet {
        blockById: Shumway.Map<Bytecode>;
        constructor(length: number, blockById: Shumway.Map<Bytecode>);
        forEachBlock(fn: BytecodeVisitor): void;
        choose(): Bytecode;
        members(): Bytecode[];
        setBlocks(bs: Bytecode[]): void;
    }
    class Analysis {
        methodInfo: MethodInfo;
        blocks: Bytecode[];
        bytecodes: Bytecode[];
        boundBlockSet: any;
        markedLoops: boolean;
        analyzedControlFlow: boolean;
        constructor(methodInfo: MethodInfo);
        makeBlockSetFactory(length: number, blockById: Shumway.Map<Bytecode>): void;
        accessLocal(index: number): void;
        getInvalidTarget(cache: any, offset: any): any;
        normalizeBytecode(): void;
        analyzeControlFlow(): boolean;
        detectBasicBlocks(): void;
        normalizeReachableBlocks(): void;
        computeDominance(): void;
        markLoops(): boolean;
    }
}
declare var Bytecode: typeof Shumway.AVM2.Bytecode;
declare var Analysis: typeof Shumway.AVM2.Analysis;
declare module Shumway.AVM2 {
    module Runtime {
        var traceExecution: any;
        var traceCallExecution: any;
        var traceFunctions: any;
        var traceClasses: any;
        var traceDomain: any;
        var debuggerMode: any;
        var globalMultinameAnalysis: any;
        var codeCaching: any;
        var compilerEnableExceptions: any;
        var compilerMaximumMethodSize: any;
        enum ExecutionMode {
            INTERPRET = 1,
            COMPILE = 2,
        }
    }
    module Compiler {
        var options: any;
        var traceLevel: any;
        var breakFilter: any;
        var compileFilter: any;
        var enableDirtyLocals: any;
        var useBaseline: any;
        var baselineDebugLevel: any;
    }
    module Verifier {
        var options: any;
        var enabled: any;
        var traceLevel: any;
    }
}
import Namespace = Shumway.AVM2.ABC.Namespace;
interface IProtocol {
    asGetProperty: (namespaces: Namespace[], name: any, flags: number) => any;
    asGetNumericProperty: (name: number) => any;
    asGetPublicProperty: (name: any) => any;
    asGetResolvedStringProperty: (name: string) => any;
    asSetProperty: (namespaces: Namespace[], name: any, flags: number, value: any) => void;
    asSetNumericProperty: (name: number, value: any) => void;
    asSetPublicProperty: (name: any, value: any) => void;
    asDefineProperty: (namespaces: Namespace[], name: any, flags: number, descriptor: PropertyDescriptor) => void;
    asDefinePublicProperty: (name: any, descriptor: PropertyDescriptor) => void;
    asGetPropertyDescriptor: (namespaces: Namespace[], name: any, flags: number) => PropertyDescriptor;
    asCallProperty: (namespaces: Namespace[], name: any, flags: number, isLex: boolean, args: any[]) => any;
    asCallSuper: (scope, namespaces: Namespace[], name: any, flags: number, args: any[]) => any;
    asGetSuper: (scope, namespaces: Namespace[], name: any, flags: number) => any;
    asSetSuper: (scope, namespaces: Namespace[], name: any, flags: number, value: any) => void;
    asCallPublicProperty: (name: any, args: any[]) => any;
    asCallResolvedStringProperty: (resolved: any, isLex: boolean, args: any[]) => any;
    asConstructProperty: (namespaces: Namespace[], name: any, flags: number, args: any[]) => any;
    asHasProperty: (namespaces: Namespace[], name: any, flags: number) => boolean;
    asHasOwnProperty: (namespaces: Namespace[], name: any, flags: number) => boolean;
    asHasPropertyInternal: (namespaces: Namespace[], name: any, flags: number) => boolean;
    asPropertyIsEnumerable: (namespaces: Namespace[], name: any, flags: number) => boolean;
    asHasTraitProperty: (namespaces: Namespace[], name: any, flags: number) => boolean;
    asDeleteProperty: (namespaces: Namespace[], name: any, flags: number) => boolean;
    asHasNext2: (hasNext2Info: Shumway.AVM2.Runtime.HasNext2Info) => void;
    asNextName: (index: number) => any;
    asNextValue: (index: number) => any;
    asNextNameIndex: (index: number) => number;
    asGetEnumerableKeys: () => any[];
}
interface Object extends IProtocol {
    hash: number;
    runtimeId: number;
    resolutionMap: Shumway.Map<Shumway.Map<string>>;
    bindings: Shumway.AVM2.Runtime.Bindings;
    getNamespaceResolutionMap: any;
    resolveMultinameProperty: (namespaces: Namespace[], name: any, flags: number) => any;
    class: Shumway.AVM2.AS.ASClass;
    asEnumerableKeys: any[];
    asLazyInitializer: Shumway.AVM2.Runtime.LazyInitializer;
    asBindings: any;
    asLength: number;
    asSlots: Shumway.AVM2.Runtime.SlotInfoMap;
    asIsNativePrototype: boolean;
    asOpenMethods: Shumway.Map<Function>;
    asIsClass: boolean;
    asDefaultNamespace: Namespace;
}
interface Function {
    asCall(thisArg: any, ...argArray: any[]): any;
    asApply(thisArg: any, argArray?: any): any;
}
declare module Shumway.AVM2.Runtime {
    var sealConstTraits: boolean;
    var useAsAdd: boolean;
    import Map = Shumway.Map;
    import Multiname = Shumway.AVM2.ABC.Multiname;
    import Namespace = Shumway.AVM2.ABC.Namespace;
    import MethodInfo = Shumway.AVM2.ABC.MethodInfo;
    import ScriptInfo = Shumway.AVM2.ABC.ScriptInfo;
    import SORT = Shumway.AVM2.ABC.SORT;
    import Trait = Shumway.AVM2.ABC.Trait;
    import IndentingWriter = Shumway.IndentingWriter;
    var VM_SLOTS: string;
    var VM_LENGTH: string;
    var VM_BINDINGS: string;
    var VM_NATIVE_PROTOTYPE_FLAG: string;
    var VM_OPEN_METHODS: string;
    var VM_OPEN_METHOD_PREFIX: string;
    var VM_MEMOIZER_PREFIX: string;
    var VM_OPEN_SET_METHOD_PREFIX: string;
    var VM_OPEN_GET_METHOD_PREFIX: string;
    var SAVED_SCOPE_NAME: string;
    var VM_METHOD_OVERRIDES: any;
    function isNativePrototype(object: any): any;
    var traitsWriter: IndentingWriter;
    var callWriter: IndentingWriter;
    interface IPatchTarget {
        object: Object;
        get?: string;
        set?: string;
        name?: string;
    }
    function patch(patchTargets: IPatchTarget[], value: Function): void;
    function applyMethodTrait(qn: string, object: Object, binding: Binding, isScriptBinding: boolean): void;
    function getNamespaceResolutionMap(namespaces: Namespace[]): Map<string>;
    function resolveMultinameProperty(namespaces: Namespace[], name: string, flags: number): any;
    function asGetPublicProperty(name: any): any;
    function asGetProperty(namespaces: Namespace[], name: any, flags: number): any;
    function asGetResolvedStringProperty(resolved: any): any;
    function asCallResolvedStringProperty(resolved: any, isLex: boolean, args: any[]): any;
    function asSetPublicProperty(name: any, value: any): void;
    function asToString(): string;
    function asSetProperty(namespaces: Namespace[], name: any, flags: number, value: any): void;
    function asDefinePublicProperty(name: any, descriptor: PropertyDescriptor): void;
    function asDefineProperty(namespaces: Namespace[], name: any, flags: number, descriptor: PropertyDescriptor): void;
    function asGetPropertyDescriptor(namespaces: Namespace[], name: any, flags: number): PropertyDescriptor;
    function asCallPublicProperty(name: any, args: any[]): any;
    function asCallProperty(namespaces: Namespace[], name: any, flags: number, isLex: boolean, args: any[]): any;
    function asCallSuper(scope: any, namespaces: Namespace[], name: any, flags: number, args: any[]): any;
    function asSetSuper(scope: any, namespaces: Namespace[], name: any, flags: number, value: any): void;
    function asGetSuper(scope: any, namespaces: Namespace[], name: any, flags: number): any;
    function construct(cls: Shumway.AVM2.AS.ASClass, args: any[]): any;
    function asConstructProperty(namespaces: Namespace[], name: any, flags: number, args: any[]): any;
    function asHasProperty(namespaces: Namespace[], name: any, flags: number): boolean;
    function asHasOwnProperty(namespaces: Namespace[], name: any, flags: number): any;
    function asPropertyIsEnumerable(namespaces: Namespace[], name: any, flags: number): boolean;
    function asDeleteProperty(namespaces: Namespace[], name: any, flags: number): boolean;
    function asHasTraitProperty(namespaces: Namespace[], name: any, flags: number): any;
    function asGetNumericProperty(i: number): any;
    function asSetNumericProperty(i: number, v: string): void;
    function asGetDescendants(namespaces: Namespace[], name: any, flags: number): void;
    function asNextNameIndex(index: number): number;
    function asNextName(index: number): any;
    function asNextValue(index: number): any;
    function asHasNext2(hasNext2Info: HasNext2Info): void;
    function asGetEnumerableKeys(): any[];
    function asTypeOf(x: any): string;
    function publicizeProperties(object: any): void;
    function asGetSlot(object: any, index: any): any;
    function asSetSlot(object: any, index: any, value: any): void;
    function asCheckVectorSetNumericProperty(i: any, length: any, fixed: any): void;
    function asCheckVectorGetNumericProperty(i: any, length: any): void;
    function checkNullParameter(argument: any, name: string): void;
    function checkParameterType(argument: any, name: string, type: Shumway.AVM2.AS.ASClass): void;
    function throwError(className: string, error: any, replacement1?: any, replacement2?: any, replacement3?: any, replacement4?: any): void;
    function translateError(domain: any, error: any): any;
    function asIsInstanceOf(type: any, value: any): any;
    function asIsType(type: any, value: any): any;
    function asAsType(type: any, value: any): any;
    function escapeXMLAttribute(value: any): string;
    function escapeXMLElement(value: any): string;
    function asEquals(left: any, right: any): boolean;
    function asCoerceByMultiname(methodInfo: MethodInfo, multiname: any, value: any): any;
    function asCoerce(type: Shumway.AVM2.AS.ASClass, value: any): any;
    function asCoerceString(x: any): string;
    function asCoerceInt(x: any): number;
    function asCoerceUint(x: any): number;
    function asCoerceNumber(x: any): number;
    function asCoerceBoolean(x: any): boolean;
    function asCoerceObject(x: any): any;
    function asDefaultCompareFunction(a: any, b: any): number;
    function asCompare(a: any, b: any, options: SORT, compareFunction?: any): number;
    function asAdd(l: any, r: any): any;
    function getDescendants(object: any, mn: any): any;
    function checkFilter(value: any): any;
    function initializeGlobalObject(global: any): void;
    function nameInTraits(object: any, qn: any): any;
    function CatchScopeObject(domain: any, trait: any): void;
    class Global {
        scriptInfo: ScriptInfo;
        scriptBindings: ScriptBindings;
        constructor(script: ScriptInfo);
        toString(): string;
        isExecuted(): boolean;
        isExecuting(): boolean;
        ensureExecuted(): void;
    }
    class LazyInitializer {
        private _target;
        private _resolved;
        static create(target: Object): LazyInitializer;
        private _isLazyInitializer;
        constructor(target: Object);
        resolve(): Object;
    }
    function forEachPublicProperty(object: any, fn: any, self?: any): void;
    function wrapJSObject(object: any): any;
    function asCreateActivation(methodInfo: MethodInfo): Object;
    class GlobalMultinameResolver {
        private static hasNonDynamicNamespaces;
        private static wasResolved;
        private static updateTraits(traits);
        static loadAbc(abc: any): void;
        static resolveMultiname(multiname: any): Multiname;
    }
    class ActivationInfo {
        methodInfo: MethodInfo;
        constructor(methodInfo: MethodInfo);
    }
    class HasNext2Info {
        object: Object;
        index: number;
        constructor(object: Object, index: number);
    }
    function sliceArguments(args: any, offset?: number, callee?: any): any;
    function canCompile(mi: any): boolean;
    function shouldCompile(mi: any): boolean;
    function forceCompile(mi: any): boolean;
    var CODE_CACHE: any;
    function searchCodeCache(methodInfo: any): any;
    function createInterpretedFunction(methodInfo: any, scope: any, hasDynamicScope: any): any;
    function debugName(value: any): any;
    function createCompiledFunction(methodInfo: any, scope: any, hasDynamicScope: any, breakpoint: any, deferCompilation: any): any;
    function createFunction(mi: MethodInfo, scope: any, hasDynamicScope: any, breakpoint: any, useInterpreter?: boolean): any;
    function ensureFunctionIsInitialized(methodInfo: MethodInfo): void;
    function getTraitFunction(trait: Trait, scope: Scope, natives: any): any;
    function createClass(classInfo: any, baseClass: any, scope: any): AS.ASClass;
    function sealConstantTraits(object: any, traits: any): void;
    function applyType(methodInfo: MethodInfo, factory: Shumway.AVM2.AS.ASClass, types: any): AS.ASClass;
    function createName(namespaces: Namespace[], name: string, flags: number): Multiname;
}
declare var throwError: (className: string, error: any, replacement1?: any, replacement2?: any, replacement3?: any, replacement4?: any) => void;
import CC = Shumway.AVM2.Runtime.CODE_CACHE;
declare var HasNext2Info: typeof Shumway.AVM2.Runtime.HasNext2Info;
declare var asCreateActivation: typeof Shumway.AVM2.Runtime.asCreateActivation;
declare var asIsInstanceOf: typeof Shumway.AVM2.Runtime.asIsInstanceOf;
declare var asIsType: typeof Shumway.AVM2.Runtime.asIsType;
declare var asAsType: typeof Shumway.AVM2.Runtime.asAsType;
declare var asEquals: typeof Shumway.AVM2.Runtime.asEquals;
declare var asTypeOf: typeof Shumway.AVM2.Runtime.asTypeOf;
declare var asCoerceByMultiname: typeof Shumway.AVM2.Runtime.asCoerceByMultiname;
declare var asCoerce: typeof Shumway.AVM2.Runtime.asCoerce;
declare var asCoerceString: typeof Shumway.AVM2.Runtime.asCoerceString;
declare var asCoerceInt: typeof Shumway.AVM2.Runtime.asCoerceInt;
declare var asCoerceUint: typeof Shumway.AVM2.Runtime.asCoerceUint;
declare var asCoerceNumber: typeof Shumway.AVM2.Runtime.asCoerceNumber;
declare var asCoerceBoolean: typeof Shumway.AVM2.Runtime.asCoerceBoolean;
declare var asCoerceObject: typeof Shumway.AVM2.Runtime.asCoerceObject;
declare var asCompare: typeof Shumway.AVM2.Runtime.asCompare;
declare var asAdd: typeof Shumway.AVM2.Runtime.asAdd;
declare var applyType: typeof Shumway.AVM2.Runtime.applyType;
declare var escapeXMLAttribute: typeof Shumway.AVM2.Runtime.escapeXMLAttribute;
declare var escapeXMLElement: typeof Shumway.AVM2.Runtime.escapeXMLElement;
declare var asGetSlot: typeof Shumway.AVM2.Runtime.asGetSlot;
declare var asSetSlot: typeof Shumway.AVM2.Runtime.asSetSlot;
declare var asHasNext2: typeof Shumway.AVM2.Runtime.asHasNext2;
declare var getDescendants: typeof Shumway.AVM2.Runtime.getDescendants;
declare var checkFilter: typeof Shumway.AVM2.Runtime.checkFilter;
declare var sliceArguments: typeof Shumway.AVM2.Runtime.sliceArguments;
declare var createClass: typeof Shumway.AVM2.Runtime.createClass;
declare var createFunction: typeof Shumway.AVM2.Runtime.createFunction;
declare var createName: typeof Shumway.AVM2.Runtime.createName;
declare module Shumway.AVM2.Runtime {
    import Namespace = Shumway.AVM2.ABC.Namespace;
    import MethodInfo = Shumway.AVM2.ABC.MethodInfo;
    class Scope {
        parent: Scope;
        global: Scope;
        object: any;
        isWith: boolean;
        cache: any;
        constructor(parent: Scope, object: any, isWith?: boolean);
        findDepth(object: any): number;
        getScopeObjects(): any[];
        findScopeProperty(namespaces: Namespace[], name: any, flags: number, method: MethodInfo, strict: boolean, scopeOnly: boolean): any;
    }
    function bindFreeMethodScope(methodInfo: MethodInfo, scope: Scope): any;
}
declare var Scope: typeof Shumway.AVM2.Runtime.Scope;
declare module Shumway.AVM2.Runtime {
    import MethodInfo = Shumway.AVM2.ABC.MethodInfo;
    import ClassInfo = Shumway.AVM2.ABC.ClassInfo;
    import InstanceInfo = Shumway.AVM2.ABC.InstanceInfo;
    import ScriptInfo = Shumway.AVM2.ABC.ScriptInfo;
    import ApplicationDomain = Shumway.AVM2.Runtime.ApplicationDomain;
    import Trait = Shumway.AVM2.ABC.Trait;
    class Binding {
        trait: Trait;
        static SET_PREFIX: string;
        static GET_PREFIX: string;
        static KEY_PREFIX_LENGTH: number;
        natives: any;
        scope: any;
        constructor(trait: Trait);
        static getKey(qn: any, trait: Trait): any;
        toString(): string;
    }
    class SlotInfo {
        name: string;
        isConst: boolean;
        type: any;
        trait: Trait;
        constructor(name: string, isConst: boolean, type: any, trait: Trait);
    }
    class SlotInfoMap {
        byID: Shumway.Map<SlotInfo>;
        byQN: Shumway.Map<SlotInfo>;
        constructor();
    }
    class Bindings {
        map: Shumway.Map<Binding>;
        slots: Trait[];
        nextSlotId: number;
        natives: any;
        constructor();
        assignNextSlot(trait: Trait): void;
        trace(writer: Shumway.IndentingWriter): void;
        applyTo(domain: ApplicationDomain, object: any, append?: boolean): void;
    }
    class ActivationBindings extends Bindings {
        methodInfo: MethodInfo;
        constructor(methodInfo: any);
    }
    class CatchBindings extends Bindings {
        constructor(scope: any, trait: any);
    }
    class ScriptBindings extends Bindings {
        scriptInfo: ScriptInfo;
        scope: any;
        constructor(scriptInfo: ScriptInfo, scope: Scope);
    }
    class ClassBindings extends Bindings {
        classInfo: ClassInfo;
        scope: any;
        natives: any;
        constructor(classInfo: any, scope: any, natives: any);
    }
    class InstanceBindings extends Bindings {
        instanceInfo: InstanceInfo;
        parent: InstanceBindings;
        scope: any;
        natives: any;
        implementedInterfaces: Shumway.Map<Shumway.AVM2.AS.ASClass>;
        constructor(parent: any, instanceInfo: any, scope: any, natives: any);
        private extend(parent);
        toString(): string;
    }
}
import Binding = Shumway.AVM2.Runtime.Binding;
import Bindings = Shumway.AVM2.Runtime.Bindings;
import ActivationBindings = Shumway.AVM2.Runtime.ActivationBindings;
import CatchBindings = Shumway.AVM2.Runtime.CatchBindings;
import ScriptBindings = Shumway.AVM2.Runtime.ScriptBindings;
import ClassBindings = Shumway.AVM2.Runtime.ClassBindings;
import InstanceBindings = Shumway.AVM2.Runtime.InstanceBindings;
declare module Shumway.AVM2 {
    var XRegExp: any;
}
interface Object {
    __proto__: Object;
}
declare module Shumway.AVM2.AS {
    import Trait = Shumway.AVM2.ABC.Trait;
    import ClassInfo = Shumway.AVM2.ABC.ClassInfo;
    import ApplicationDomain = Shumway.AVM2.Runtime.ApplicationDomain;
    import Scope = Shumway.AVM2.Runtime.Scope;
    import IndentingWriter = Shumway.IndentingWriter;
    import ClassBindings = Shumway.AVM2.Runtime.ClassBindings;
    import InstanceBindings = Shumway.AVM2.Runtime.InstanceBindings;
    class ASObject {
        static baseClass: typeof ASClass;
        static classInfo: ClassInfo;
        static instanceConstructor: any;
        static instanceConstructorNoInitialize: any;
        static initializer: any;
        static defaultInitializerArgument: any;
        static initializers: any;
        static classInitializer: any;
        static callableConstructor: any;
        static classBindings: ClassBindings;
        static instanceBindings: InstanceBindings;
        static interfaceBindings: InstanceBindings;
        static classSymbols: string[];
        static instanceSymbols: string[];
        static staticNatives: any[];
        static instanceNatives: any[];
        static traitsPrototype: Object;
        static dynamicPrototype: Object;
        static typeScriptPrototype: Object;
        static defaultValue: any;
        static native_prototype: Object;
        static implementedInterfaces: Shumway.Map<ASClass>;
        static isInterface: () => boolean;
        static applyType: (type: ASClass) => ASClass;
        static protocol: IProtocol;
        static call: (thisArg: any, ...argArray: any[]) => any;
        static apply: (thisArg: any, argArray?: any) => any;
        static init(): void;
        static morphIntoASClass(classInfo: ClassInfo): void;
        static create(self: ASClass, baseClass: ASClass, instanceConstructor: any): void;
        static initializeFrom(value: any): any;
        static coerce: (value: any) => any;
        static isInstanceOf: (value: any) => boolean;
        static isType: (value: any) => boolean;
        static isSubtypeOf: (value: ASClass) => boolean;
        static asCall(self: any, ...argArray: any[]): any;
        static asApply(self: any, argArray?: any): any;
        static verify(): void;
        static trace(writer: IndentingWriter): void;
        static getQualifiedClassName(): string;
        static _setPropertyIsEnumerable(o: any, V: string, enumerable?: boolean): void;
        static _init(): void;
        static defineProperty: (o: any, p: string, attributes: PropertyDescriptor) => any;
        static native_isPrototypeOf: (V: Object) => boolean;
        static native_hasOwnProperty: (V: string) => boolean;
        static native_propertyIsEnumerable: (V: string) => boolean;
        static setPropertyIsEnumerable: (V: string, enumerable: boolean) => boolean;
        toString(): any;
        valueOf(): any;
        native_isPrototypeOf(V: Object): boolean;
        native_hasOwnProperty(name: string): boolean;
        native_propertyIsEnumerable(name: string): boolean;
        setPropertyIsEnumerable(name: string, enumerable: boolean): void;
    }
    class ASNative extends ASObject {
        static baseClass: typeof ASClass;
        static classInfo: ClassInfo;
        static instanceConstructor: any;
        static callableConstructor: any;
        static classBindings: ClassBindings;
        static instanceBindings: InstanceBindings;
        static staticNatives: any[];
        static instanceNatives: any[];
        static traitsPrototype: Object;
        static dynamicPrototype: Object;
        static defaultValue: any;
    }
    class ASClass extends ASObject {
        static instanceConstructor: any;
        static staticNatives: any[];
        static instanceNatives: any[];
        static classInitializer: any;
        static configureBuiltinPrototype(self: ASClass, baseClass: ASClass): void;
        static configurePrototype(self: ASClass, baseClass: ASClass): void;
        static create(self: ASClass, baseClass: ASClass, instanceConstructor: any): void;
        initializeFrom(value: any): any;
        static runInitializers(self: Object, argument: any): void;
        static configureInitializers(self: ASClass): void;
        static runClassInitializer(self: ASClass): void;
        static linkSymbols(self: ASClass): void;
        classInfo: ClassInfo;
        baseClass: ASClass;
        instanceConstructor: new (...args) => any;
        instanceConstructorNoInitialize: new (...args) => any;
        initializer: (...args) => any;
        defaultInitializerArgument: any;
        classInitializer: (...args) => any;
        initializers: Array<(...args) => any>;
        callableConstructor: new (...args) => any;
        staticNatives: Object[];
        instanceNatives: Object[];
        classBindings: ClassBindings;
        instanceBindings: InstanceBindings;
        classSymbols: string[];
        instanceSymbols: string[];
        interfaceBindings: InstanceBindings;
        traitsPrototype: Object;
        dynamicPrototype: Object;
        typeScriptPrototype: Object;
        implementedInterfaces: Shumway.Map<ASClass>;
        defaultValue: any;
        protocol: IProtocol;
        prototype: Object;
        constructor(classInfo: ClassInfo);
        morphIntoASClass(classInfo: ClassInfo): void;
        native_prototype: Object;
        asCall(self: any, cls: ASClass): any;
        asApply(self: any, argArray?: any): any;
        applyType(type: ASClass): ASClass;
        isInstanceOf(value: any): boolean;
        isType(value: any): boolean;
        isSubtypeOf(value: ASClass): boolean;
        coerce(value: any): any;
        isInterface(): boolean;
        getQualifiedClassName(): string;
        verify(): void;
        private static labelCounter;
        static labelObject(o: any): any;
        trace(writer: IndentingWriter): void;
    }
    class ASFunction extends ASObject {
        static baseClass: typeof ASClass;
        static classInfo: ClassInfo;
        static instanceConstructor: any;
        static classBindings: ClassBindings;
        static instanceBindings: InstanceBindings;
        static staticNatives: any[];
        static instanceNatives: any[];
        static classInitializer: any;
        constructor();
        native_prototype: Object;
        native_length: number;
        asCall: (self?, args?: any) => any;
        asApply: (self?, args?: any[]) => any;
        toString(): string;
    }
    class ASBoolean extends ASObject {
        static instanceConstructor: any;
        static callableConstructor: any;
        static classBindings: ClassBindings;
        static instanceBindings: InstanceBindings;
        static classInfo: ClassInfo;
        static staticNatives: any[];
        static instanceNatives: any[];
        static coerce: (value: any) => boolean;
        static classInitializer: any;
        constructor(input: any);
    }
    class ASMethodClosure extends ASFunction {
        static staticNatives: any[];
        static instanceNatives: any[];
        static instanceConstructor: any;
        constructor(self: any, fn: any);
        native_prototype: Object;
        toString(): string;
    }
    class ASNumber extends ASObject {
        static instanceConstructor: any;
        static callableConstructor: any;
        static classBindings: ClassBindings;
        static instanceBindings: InstanceBindings;
        static classInfo: ClassInfo;
        static staticNatives: any[];
        static instanceNatives: any[];
        static defaultValue: any;
        static coerce: (value: any) => number;
        static classInitializer: any;
        static initializeDynamicMethods(): void;
        constructor(input: any);
    }
    class ASInt extends ASObject {
        static instanceConstructor: any;
        static callableConstructor: any;
        static classBindings: ClassBindings;
        static instanceBindings: InstanceBindings;
        static classInfo: ClassInfo;
        static staticNatives: any[];
        static instanceNatives: any[];
        static defaultValue: any;
        static coerce: (value: any) => number;
        static classInitializer: any;
        constructor(value: any);
        static asCall(self: any, arg0: any): any;
        static asApply(self: any, argArray?: any): any;
        static isInstanceOf(value: any): boolean;
        static isType(value: any): boolean;
    }
    class ASUint extends ASObject {
        static instanceConstructor: any;
        static callableConstructor: any;
        static classBindings: ClassBindings;
        static instanceBindings: InstanceBindings;
        static classInfo: ClassInfo;
        static staticNatives: any[];
        static instanceNatives: any[];
        static defaultValue: any;
        static coerce: (value: any) => number;
        static classInitializer: any;
        constructor(value: any);
        static asCall(self: any, arg0: any): any;
        static asApply(self: any, argArray?: any): any;
        static isInstanceOf(value: any): boolean;
        static isType(value: any): boolean;
    }
    class ASString extends ASObject {
        static instanceConstructor: any;
        static callableConstructor: any;
        static classBindings: ClassBindings;
        static instanceBindings: InstanceBindings;
        static classInfo: ClassInfo;
        static staticNatives: any[];
        static instanceNatives: any[];
        static coerce: (value: any) => string;
        static classInitializer: any;
        native_length: number;
        constructor(input: any);
        match(re: any): any;
        search(re: any): number;
        toUpperCase(): any;
        toLocaleUpperCase(): any;
    }
    function arraySort(o: any, args: any): any;
    class ASArray extends ASObject {
        static instanceConstructor: any;
        static staticNatives: any[];
        static instanceNatives: any[];
        static classInitializer: any;
        constructor(input: any);
        static CACHE_NUMERIC_COMPARATORS: boolean;
        static numericComparatorCache: any;
        toLocaleString(): string;
        splice(): any[];
        every(callback: Function, thisObject: any): boolean;
        filter(callback: Function, thisObject: any): any[];
        sort(): any;
        sortOn(names: any, options: any): any;
        native_length: number;
    }
    class ASVector<T> extends ASNative {
        static staticNatives: any[];
        static instanceNatives: any[];
        static instanceConstructor: any;
        static callableConstructor: any;
        newThisType(): ASVector<T>;
    }
    class ASJSON extends ASObject {
        static instanceConstructor: any;
        static staticNatives: any[];
        static instanceNatives: any[];
        static parse(text: string, reviver: Function): any;
        static stringify(value: any, replacer?: any, space?: any): string;
        private static computePropertyList(r);
        static transformJSValueToAS(value: any, deep: boolean): any;
        static transformASValueToJS(value: any, deep: boolean): any;
        private static stringifySpecializedToString(value, replacerArray, replacerFunction, gap);
    }
    class ASError extends ASNative {
        static instanceConstructor: any;
        static staticNatives: any[];
        static instanceNatives: any[];
        static getErrorMessage: typeof getErrorMessage;
        static throwError(type: typeof ASError, id: number): void;
        static classInitializer: any;
        constructor(msg: any, id: any);
        message: string;
        name: string;
        _errorID: number;
        toString(): string;
        errorID: number;
        getStackTrace(): string;
    }
    class ASDefinitionError extends ASError {
        static classInitializer: any;
    }
    class ASEvalError extends ASError {
        static classInitializer: any;
    }
    class ASRangeError extends ASError {
        static classInitializer: any;
    }
    class ASReferenceError extends ASError {
        static classInitializer: any;
    }
    class ASSecurityError extends ASError {
        static classInitializer: any;
    }
    class ASSyntaxError extends ASError {
        static classInitializer: any;
    }
    class ASTypeError extends ASError {
        static classInitializer: any;
    }
    class ASURIError extends ASError {
        static classInitializer: any;
    }
    class ASVerifyError extends ASError {
        static classInitializer: any;
    }
    class ASUninitializedError extends ASError {
        static classInitializer: any;
    }
    class ASArgumentError extends ASError {
        static classInitializer: any;
    }
    class ASIOError extends ASError {
        static classInitializer: any;
    }
    class ASEOFError extends ASError {
        static classInitializer: any;
    }
    class ASMemoryError extends ASError {
        static classInitializer: any;
    }
    class ASIllegalOperationError extends ASError {
        static classInitializer: any;
    }
    class ASRegExp extends ASObject {
        static instanceConstructor: any;
        static staticNatives: any[];
        static instanceNatives: any[];
        static classInitializer: any;
        constructor(input: any);
        ecmaToString(): string;
        source: string;
        global: boolean;
        ignoreCase: boolean;
        multiline: boolean;
        native_source: string;
        native_global: boolean;
        native_ignoreCase: boolean;
        native_multiline: boolean;
        native_lastIndex: number;
        native_dotall: boolean;
        native_extended: boolean;
        exec(s?: string): any;
        test(s?: string): boolean;
    }
    class ASMath extends ASNative {
        static staticNatives: any[];
        static classInitializer: any;
    }
    class ASDate extends ASNative {
        static staticNatives: any[];
        static instanceNatives: any[];
        static instanceConstructor: any;
        static classInitializer: any;
        constructor(input: any);
        fullYear: number;
        month: number;
        date: number;
        hours: number;
        minutes: number;
        seconds: number;
        milliseconds: number;
        fullYearUTC: number;
        monthUTC: number;
        dateUTC: number;
        hoursUTC: number;
        minutesUTC: number;
        secondsUTC: number;
        millisecondsUTC: number;
        time: number;
        timezoneOffset: number;
        day: number;
        dayUTC: number;
    }
    function initialize(domain: ApplicationDomain): void;
    function registerNativeClass(name: string, cls: ASClass): void;
    function registerNativeFunction(name: string, fn: Function): void;
    function createInterface(classInfo: ClassInfo): ASClass;
    function createClass(classInfo: ClassInfo, baseClass: ASClass, scope: Scope): ASClass;
    function getMethodOrAccessorNative(trait: Trait, natives: Object[]): any;
    function escapeNativeName(name: string): string;
    module Natives {
        var String: any;
        var Function: any;
        var Boolean: any;
        var Number: any;
        var Date: any;
        var ASObject: typeof AS.ASObject;
        var ASFunction: typeof AS.ASFunction;
        function print(expression: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any): void;
        function debugBreak(v: any): void;
        function bugzilla(n: any): boolean;
        var decodeURI: (encodedURI: string) => string;
        var decodeURIComponent: (encodedURIComponent: string) => string;
        var encodeURI: (uri: string) => string;
        var encodeURIComponent: (uriComponent: string) => string;
        var isNaN: (number: number) => boolean;
        var isFinite: (number: number) => boolean;
        var parseInt: (s: string, radix?: number) => number;
        var parseFloat: (string: string) => number;
        var escape: (x: any) => any;
        var unescape: (x: any) => any;
        var isXMLName: (x: any) => boolean;
        var notImplemented: (x: any) => void;
        function getQualifiedClassName(value: any): string;
        function getQualifiedSuperclassName(value: any): string;
        function getDefinitionByName(name: string): ASClass;
        function describeType(value: any, flags: number): ASXML;
        function describeTypeJSON(value: any, flags: number): any;
    }
    function getNative(path: string): Function;
}
declare module Shumway.AVM2.AS {
    import HasNext2Info = Shumway.AVM2.Runtime.HasNext2Info;
    class GenericVector extends ASVector<Object> {
        static CASEINSENSITIVE: number;
        static DESCENDING: number;
        static UNIQUESORT: number;
        static RETURNINDEXEDARRAY: number;
        static NUMERIC: number;
        static instanceConstructor: any;
        static staticNatives: any[];
        static instanceNatives: any[];
        static classInitializer: any;
        newThisType(): GenericVector;
        static defaultCompareFunction(a: any, b: any): number;
        static compare(a: any, b: any, options: any, compareFunction: any): number;
        private _fixed;
        private _buffer;
        private _type;
        private _defaultValue;
        constructor(length?: number, fixed?: boolean, type?: ASClass);
        static applyType(type: ASClass): ASClass;
        private _fill(index, length, value);
        toString(): string;
        toLocaleString(): string;
        sort(sortBehavior?: any): any[];
        every(callback: Function, thisObject: Object): boolean;
        filter(callback: any, thisObject: any): GenericVector;
        some(callback: any, thisObject: any): boolean;
        forEach(callback: any, thisObject: any): void;
        join(separator?: string): string;
        indexOf(searchElement: any, fromIndex?: number): number;
        lastIndexOf(searchElement: any, fromIndex?: number): number;
        map(callback: any, thisObject: any): GenericVector;
        push(arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any, arg6?: any, arg7?: any, arg8?: any): void;
        pop(): any;
        concat(): any;
        reverse(): GenericVector;
        _coerce(v: any): any;
        shift(): any;
        unshift(): void;
        slice(start?: number, end?: number): GenericVector;
        splice(start: number, deleteCount_: number): GenericVector;
        length: number;
        fixed: boolean;
        _checkFixed(): void;
        asNextName(index: number): any;
        asNextValue(index: number): any;
        asNextNameIndex(index: number): number;
        asHasProperty(namespaces: any, name: any, flags: any): any;
        asGetNumericProperty(i: any): any;
        asSetNumericProperty(i: any, v: any): void;
        asHasNext2(hasNext2Info: HasNext2Info): void;
    }
}
declare module Shumway.AVM2.AS {
    import HasNext2Info = Shumway.AVM2.Runtime.HasNext2Info;
    class Int32Vector extends ASVector<ASInt> {
        static EXTRA_CAPACITY: number;
        static INITIAL_CAPACITY: number;
        static DEFAULT_VALUE: number;
        static DESCENDING: number;
        static UNIQUESORT: number;
        static RETURNINDEXEDARRAY: number;
        static instanceConstructor: any;
        static staticNatives: any[];
        static instanceNatives: any[];
        static callableConstructor: any;
        static classInitializer: any;
        newThisType(): Int32Vector;
        private _fixed;
        private _buffer;
        private _length;
        private _offset;
        constructor(length?: number, fixed?: boolean);
        static callable(object: any): any;
        internalToString(): string;
        toString(): string;
        toLocaleString(): string;
        _view(): Int32Array;
        _ensureCapacity(length: any): void;
        concat(): Int32Vector;
        every(callback: any, thisObject: any): boolean;
        filter(callback: any, thisObject: any): Int32Vector;
        some(callback: any, thisObject: any): boolean;
        forEach(callback: any, thisObject: any): void;
        join(separator?: string): string;
        indexOf(searchElement: any, fromIndex?: number): number;
        lastIndexOf(searchElement: any, fromIndex?: number): number;
        map(callback: any, thisObject: any): Int32Vector;
        push(arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any, arg6?: any, arg7?: any, arg8?: any): void;
        pop(): number;
        reverse(): Int32Vector;
        sort(sortBehavior?: any): any;
        shift(): number;
        unshift(): void;
        slice(start?: number, end?: number): Int32Vector;
        splice(start: number, deleteCount_: number): Int32Vector;
        _slide(distance: any): void;
        length: number;
        fixed: boolean;
        _checkFixed(): void;
        asGetNumericProperty(i: any): number;
        asSetNumericProperty(i: any, v: any): void;
        asHasProperty(namespaces: any, name: any, flags: any): any;
        asNextName(index: number): any;
        asNextValue(index: number): any;
        asNextNameIndex(index: number): number;
        asHasNext2(hasNext2Info: HasNext2Info): void;
    }
}
declare module Shumway.AVM2.AS {
    import HasNext2Info = Shumway.AVM2.Runtime.HasNext2Info;
    class Uint32Vector extends ASVector<ASInt> {
        static EXTRA_CAPACITY: number;
        static INITIAL_CAPACITY: number;
        static DEFAULT_VALUE: number;
        static DESCENDING: number;
        static UNIQUESORT: number;
        static RETURNINDEXEDARRAY: number;
        static instanceConstructor: any;
        static staticNatives: any[];
        static instanceNatives: any[];
        static callableConstructor: any;
        static classInitializer: any;
        newThisType(): Uint32Vector;
        private _fixed;
        private _buffer;
        private _length;
        private _offset;
        constructor(length?: number, fixed?: boolean);
        static callable(object: any): any;
        internalToString(): string;
        toString(): string;
        toLocaleString(): string;
        _view(): Uint32Array;
        _ensureCapacity(length: any): void;
        concat(): Uint32Vector;
        every(callback: any, thisObject: any): boolean;
        filter(callback: any, thisObject: any): Uint32Vector;
        some(callback: any, thisObject: any): boolean;
        forEach(callback: any, thisObject: any): void;
        join(separator?: string): string;
        indexOf(searchElement: any, fromIndex?: number): number;
        lastIndexOf(searchElement: any, fromIndex?: number): number;
        map(callback: any, thisObject: any): Uint32Vector;
        push(arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any, arg6?: any, arg7?: any, arg8?: any): void;
        pop(): number;
        reverse(): Uint32Vector;
        sort(sortBehavior?: any): any;
        shift(): number;
        unshift(): void;
        slice(start?: number, end?: number): Uint32Vector;
        splice(start: number, deleteCount_: number): Uint32Vector;
        _slide(distance: any): void;
        length: number;
        fixed: boolean;
        _checkFixed(): void;
        asGetNumericProperty(i: any): number;
        asSetNumericProperty(i: any, v: any): void;
        asHasProperty(namespaces: any, name: any, flags: any): any;
        asNextName(index: number): any;
        asNextValue(index: number): any;
        asNextNameIndex(index: number): number;
        asHasNext2(hasNext2Info: HasNext2Info): void;
    }
}
declare module Shumway.AVM2.AS {
    import HasNext2Info = Shumway.AVM2.Runtime.HasNext2Info;
    class Float64Vector extends ASVector<ASInt> {
        static EXTRA_CAPACITY: number;
        static INITIAL_CAPACITY: number;
        static DEFAULT_VALUE: number;
        static DESCENDING: number;
        static UNIQUESORT: number;
        static RETURNINDEXEDARRAY: number;
        static instanceConstructor: any;
        static staticNatives: any[];
        static instanceNatives: any[];
        static callableConstructor: any;
        static classInitializer: any;
        newThisType(): Float64Vector;
        private _fixed;
        private _buffer;
        private _length;
        private _offset;
        constructor(length?: number, fixed?: boolean);
        static callable(object: any): any;
        internalToString(): string;
        toString(): string;
        toLocaleString(): string;
        _view(): Float64Array;
        _ensureCapacity(length: any): void;
        concat(): Float64Vector;
        every(callback: any, thisObject: any): boolean;
        filter(callback: any, thisObject: any): Float64Vector;
        some(callback: any, thisObject: any): boolean;
        forEach(callback: any, thisObject: any): void;
        join(separator?: string): string;
        indexOf(searchElement: any, fromIndex?: number): number;
        lastIndexOf(searchElement: any, fromIndex?: number): number;
        map(callback: any, thisObject: any): Float64Vector;
        push(arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any, arg6?: any, arg7?: any, arg8?: any): void;
        pop(): number;
        reverse(): Float64Vector;
        sort(sortBehavior?: any): any;
        shift(): number;
        unshift(): void;
        slice(start?: number, end?: number): Float64Vector;
        splice(start: number, deleteCount_: number): Float64Vector;
        _slide(distance: any): void;
        length: number;
        fixed: boolean;
        _checkFixed(): void;
        asGetNumericProperty(i: any): number;
        asSetNumericProperty(i: any, v: any): void;
        asHasProperty(namespaces: any, name: any, flags: any): any;
        asNextName(index: number): any;
        asNextValue(index: number): any;
        asNextNameIndex(index: number): number;
        asHasNext2(hasNext2Info: HasNext2Info): void;
    }
}
declare module Shumway.AVM2.AS {
    import Multiname = Shumway.AVM2.ABC.Multiname;
    function escapeElementValue(s: string): string;
    function escapeAttributeValue(s: string): string;
    function isXMLName(v: any): boolean;
    class ASNamespace extends ASObject implements XMLType {
        static staticNatives: any[];
        static instanceNatives: any[];
        static instanceConstructor: any;
        static classInitializer: any;
        private _ns;
        static callableConstructor: any;
        constructor(a?: any, b?: any);
        equals(other: any): boolean;
        prefix: any;
        uri: string;
        toString(): string;
        valueOf(): string;
    }
    class ASQName extends ASNative implements XMLType {
        static classInitializer: any;
        static callableConstructor: any;
        name: Multiname;
        static fromMultiname(mn: Multiname): ASQName;
        constructor(nameOrNS_?: any, name_?: any, isAttribute?: boolean);
        equals(other: any): boolean;
        localName: string;
        uri: string;
        setUri(uri: string): void;
        ecmaToString(): string;
        toString(): string;
        valueOf(): ASQName;
        prefix: string;
        getNamespace(inScopeNamespaces?: ASNamespace[]): ASNamespace;
        flags: number;
    }
    enum ASXMLKind {
        Unknown = 0,
        Element = 1,
        Attribute = 2,
        Text = 3,
        Comment = 4,
        ProcessingInstruction = 5,
    }
    interface XMLType {
        equals(other: any): boolean;
    }
    class ASXML extends ASNative implements XMLType {
        static instanceConstructor: any;
        static classInitializer: any;
        static callableConstructor: any;
        static native_settings(): Object;
        static native_setSettings(o: any): void;
        static native_defaultSettings(): Object;
        static defaultNamespace: string;
        private static _flags;
        private static _prettyIndent;
        _attributes: ASXML[];
        _inScopeNamespaces: ASNamespace[];
        _kind: ASXMLKind;
        _name: ASQName;
        _value: any;
        _parent: ASXML;
        _children: ASXML[];
        constructor(value?: any);
        valueOf(): ASXML;
        equals(other: any): boolean;
        init(kind: number, uri: any, name: any, prefix: any): ASXML;
        _deepEquals(V: XMLType): boolean;
        _deepCopy(): ASXML;
        resolveValue(): ASXML;
        _addInScopeNamespaces(ns: any): void;
        static ignoreComments: boolean;
        static ignoreProcessingInstructions: boolean;
        static ignoreWhitespace: boolean;
        static prettyPrinting: boolean;
        static prettyIndent: number;
        toString(): string;
        native_hasOwnProperty(P: string): boolean;
        native_propertyIsEnumerable(P?: any): boolean;
        addNamespace(ns: any): ASXML;
        appendChild(child: any): ASXML;
        attribute(arg: any): ASXMLList;
        attributes(): ASXMLList;
        child(propertyName: any): ASXMLList;
        childIndex(): number;
        children(): ASXMLList;
        comments(): ASXMLList;
        contains(value: any): boolean;
        copy(): ASXML;
        descendants(name_?: any): ASXMLList;
        elements(name?: any): ASXMLList;
        hasComplexContent(): boolean;
        hasSimpleContent(): boolean;
        inScopeNamespaces(): ASNamespace[];
        private _inScopeNamespacesImpl(internalUse);
        insertChildAfter(child1: any, child2: any): any;
        insertChildBefore(child1: any, child2: any): any;
        length(): number;
        localName(): Object;
        name(): Object;
        namespace(prefix?: string): any;
        namespaceDeclarations(): any[];
        nodeKind(): string;
        normalize(): ASXML;
        private removeByIndex(index);
        parent(): any;
        processingInstructions(name?: any): ASXMLList;
        processingInstructionsInto(name: any, localName: string, list: ASXMLList): ASXMLList;
        prependChild(value: any): ASXML;
        removeNamespace(ns: any): ASXML;
        replace(p: any, v: any): ASXML;
        setChildren(value: any): ASXML;
        setLocalName(name: any): void;
        setName(name_: any): void;
        setNamespace(ns: any): void;
        text(): ASXMLList;
        toXMLString(): string;
        toJSON(k: string): string;
        static isTraitsOrDynamicPrototype(value: any): boolean;
        asGetEnumerableKeys(): any;
        setProperty(p: any, isAttribute: any, v: any): void;
        asSetProperty(namespaces: Namespace[], name: any, flags: number, value: any): any;
        getProperty(mn: any, isAttribute: boolean): any;
        asGetNumericProperty(name: number): any;
        asSetNumericProperty(name: number, value: any): void;
        asGetProperty(namespaces: Namespace[], name: any, flags: number): any;
        hasProperty(mn: any, isAttribute: boolean, isMethod: boolean): boolean;
        deleteProperty(mn: Multiname, isAttribute: boolean): boolean;
        asHasProperty(namespaces: Namespace[], name: any, flags: number): any;
        _asDeleteProperty(namespaces: Namespace[], name: any, flags: number): any;
        asHasPropertyInternal(namespaces: Namespace[], name: any, flags: number): any;
        asCallProperty(namespaces: Namespace[], name: any, flags: number, isLex: boolean, args: any[]): any;
        _delete(key: any, isMethod: any): void;
        deleteByIndex(p: number): void;
        insert(p: any, v: any): void;
        addInScopeNamespace(ns: ASNamespace): void;
        descendantsInto(name: ASQName, xl: ASXMLList): ASXMLList;
    }
    class ASXMLList extends ASNative implements XMLType {
        static instanceConstructor: any;
        static classInitializer: any;
        static callableConstructor: any;
        static addXML(left: ASXMLList, right: ASXMLList): ASXMLList;
        _children: ASXML[];
        _targetObject: any;
        _targetProperty: ASQName;
        constructor(value?: any);
        static createList(targetObject?: AS.ASXML, targetProperty?: AS.ASQName): ASXMLList;
        valueOf(): ASXMLList;
        equals(other: any): boolean;
        toString(): string;
        _deepCopy(): ASXMLList;
        _shallowCopy(): ASXMLList;
        native_hasOwnProperty(P: string): boolean;
        native_propertyIsEnumerable(P: any): boolean;
        attribute(arg: any): ASXMLList;
        attributes(): ASXMLList;
        child(propertyName: any): ASXMLList;
        children(): ASXMLList;
        descendants(name_: any): ASXMLList;
        comments(): ASXMLList;
        contains(value: any): boolean;
        copy(): ASXMLList;
        elements(name?: any): ASXMLList;
        hasComplexContent(): boolean;
        hasSimpleContent(): boolean;
        length(): number;
        name(): Object;
        normalize(): ASXMLList;
        parent(): any;
        processingInstructions(name?: any): ASXMLList;
        text(): ASXMLList;
        toXMLString(): string;
        toJSON(k: string): string;
        addNamespace(ns: any): ASXML;
        appendChild(child: any): ASXML;
        append(V: any): void;
        childIndex(): number;
        inScopeNamespaces(): any[];
        insertChildAfter(child1: any, child2: any): any;
        insertChildBefore(child1: any, child2: any): any;
        nodeKind(): string;
        namespace(prefix: string): any;
        localName(): Object;
        namespaceDeclarations(): any[];
        prependChild(value: any): ASXML;
        removeNamespace(ns: any): ASXML;
        replace(propertyName: any, value: any): ASXML;
        setChildren(value: any): ASXML;
        setLocalName(name: any): void;
        setName(name: any): void;
        setNamespace(ns: any): void;
        static isTraitsOrDynamicPrototype(value: any): boolean;
        asGetEnumerableKeys(): any;
        getProperty(mn: any, isAttribute: any): any;
        asGetNumericProperty(name: number): any;
        asSetNumericProperty(name: number, value: any): void;
        asGetProperty(namespaces: Namespace[], name: any, flags: number): any;
        hasProperty(mn: any, isAttribute: any): boolean;
        asHasProperty(namespaces: Namespace[], name: any, flags: number): any;
        asHasPropertyInternal(namespaces: Namespace[], name: any, flags: number): boolean;
        resolveValue(): ASXMLList;
        setProperty(mn: any, isAttribute: any, value: any): void;
        asSetProperty(namespaces: Namespace[], name: any, flags: number, value: any): any;
        _asDeleteProperty(namespaces: Namespace[], name: any, flags: number): boolean;
        private removeByIndex(index);
        asCallProperty(namespaces: Namespace[], name: any, flags: number, isLex: boolean, args: any[]): any;
    }
}
declare module Shumway.AVM2.AS {
    function describeTypeJSON(o: any, flags: number): any;
    function describeType(value: any, flags: number): ASXML;
}
declare module Shumway.AVM2.AS {
    import Namespace = Shumway.AVM2.ABC.Namespace;
    module flash.utils {
        class Dictionary extends ASNative {
            static classInitializer: any;
            static isTraitsOrDynamicPrototype(value: any): boolean;
            static protocol: IProtocol;
            private map;
            private keys;
            private weakKeys;
            private primitiveMap;
            constructor(weakKeys?: boolean);
            static makePrimitiveKey(key: any): any;
            toJSON(): string;
            asGetNumericProperty(name: number): any;
            asSetNumericProperty(name: number, value: any): void;
            asGetProperty(namespaces: Namespace[], name: any, flags: number): any;
            asSetProperty(namespaces: Namespace[], name: any, flags: number, value: any): any;
            asHasProperty(namespaces: Namespace[], name: any, flags: number): any;
            asDeleteProperty(namespaces: Namespace[], name: any, flags: number): any;
            asGetEnumerableKeys(): any;
        }
        var OriginalDictionary: typeof Dictionary;
    }
}
declare module Shumway.AVM2.AS {
    import Namespace = Shumway.AVM2.ABC.Namespace;
    module flash.utils {
        class Proxy extends ASNative {
            static protocol: IProtocol;
            native_getProperty(name: any): void;
            native_setProperty(): void;
            native_callProperty(): void;
            native_hasProperty(): void;
            native_deleteProperty(): void;
            native_getDescendants(): void;
            native_nextNameIndex(): void;
            native_nextName(): void;
            native_nextValue(): void;
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
        }
        var OriginalProxy: typeof Proxy;
    }
}
declare module Shumway.AVM2.AS {
    module flash.net {
        class ObjectEncoding extends ASNative {
            static AMF0: number;
            static AMF3: number;
            static DEFAULT: number;
            static dynamicPropertyWriter: any;
        }
    }
    module flash.utils {
        interface IDataInput {
            readBytes: (bytes: flash.utils.ByteArray, offset?: number, length?: number) => void;
            readBoolean: () => boolean;
            readByte: () => number;
            readUnsignedByte: () => number;
            readShort: () => number;
            readUnsignedShort: () => number;
            readInt: () => number;
            readUnsignedInt: () => number;
            readFloat: () => number;
            readDouble: () => number;
            readMultiByte: (length: number, charSet: string) => string;
            readUTF: () => string;
            readUTFBytes: (length: number) => string;
            bytesAvailable: number;
            readObject: () => any;
            objectEncoding: number;
            endian: string;
        }
        interface IDataOutput {
            writeBytes: (bytes: flash.utils.ByteArray, offset?: number, length?: number) => void;
            writeBoolean: (value: boolean) => void;
            writeByte: (value: number) => void;
            writeShort: (value: number) => void;
            writeInt: (value: number) => void;
            writeUnsignedInt: (value: number) => void;
            writeFloat: (value: number) => void;
            writeDouble: (value: number) => void;
            writeMultiByte: (value: string, charSet: string) => void;
            writeUTF: (value: string) => void;
            writeUTFBytes: (value: string) => void;
            writeObject: (object: any) => void;
            objectEncoding: number;
            endian: string;
        }
        class ByteArray extends ASNative implements IDataInput, IDataOutput {
            static instanceConstructor: any;
            static staticNatives: any[];
            static instanceNatives: any[];
            static callableConstructor: any;
            static classInitializer: any;
            static initializer: (source: any) => void;
            static protocol: IProtocol;
            private static INITIAL_SIZE;
            private static _defaultObjectEncoding;
            static defaultObjectEncoding: number;
            constructor();
            toJSON(): string;
            private _buffer;
            private _length;
            private _position;
            private _littleEndian;
            private _objectEncoding;
            private _bitBuffer;
            private _bitLength;
            private _resetViews;
            asGetNumericProperty: (name: number) => number;
            asSetNumericProperty: (name: number, value: number) => void;
            readBytes: (bytes: flash.utils.ByteArray, offset?: number, length?: number) => void;
            readBoolean: () => boolean;
            readByte: () => number;
            readUnsignedByte: () => number;
            readShort: () => number;
            readUnsignedShort: () => number;
            readInt: () => number;
            readUnsignedInt: () => number;
            readFloat: () => number;
            readDouble: () => number;
            readMultiByte: (length: number, charSet: string) => string;
            readUTF: () => string;
            readUTFBytes: (length: number) => string;
            bytesAvailable: number;
            readObject(): any;
            writeBytes: (bytes: flash.utils.ByteArray, offset?: number, length?: number) => void;
            writeBoolean: (value: boolean) => void;
            writeByte: (value: number) => void;
            writeShort: (value: number) => void;
            writeInt: (value: number) => void;
            writeUnsignedInt: (value: number) => void;
            writeFloat: (value: number) => void;
            writeDouble: (value: number) => void;
            writeMultiByte: (value: string, charSet: string) => void;
            writeUTF: (value: string) => void;
            writeUTFBytes: (value: string) => void;
            writeObject(object: any): void;
            objectEncoding: number;
            endian: string;
            readRawBytes: () => Int8Array;
            writeRawBytes: (bytes: Uint8Array) => void;
            position: number;
            length: number;
        }
        var OriginalByteArray: typeof ByteArray;
        class CompressionAlgorithm extends ASNative {
            static classInitializer: any;
            static initializer: any;
            static classSymbols: string[];
            static instanceSymbols: string[];
            constructor();
            static ZLIB: string;
            static DEFLATE: string;
            static LZMA: string;
        }
    }
}
declare module Shumway.AVM2.AS {
    module flash.system {
        class IME extends ASNative {
            constructor();
            static enabled: boolean;
            static conversionMode: string;
            static setCompositionString(composition: string): void;
            static doConversion(): void;
            static compositionSelectionChanged(start: number, end: number): void;
            static compositionAbandoned(): void;
            static isSupported: boolean;
        }
        class System extends ASNative {
            private static _useCodePage;
            static ime: flash.system.IME;
            static setClipboard(string: string): void;
            static totalMemoryNumber: number;
            static freeMemory: number;
            static privateMemory: number;
            static useCodePage: boolean;
            static vmVersion: string;
            static pause(): void;
            static resume(): void;
            static exit(code: number): void;
            static gc(): void;
            static pauseForGCIfCollectionImminent(imminence?: number): void;
            static disposeXML(node: ASXML): void;
            static swfVersion: number;
            static apiVersion: number;
            static getArgv(): any[];
            static getRunmode(): string;
        }
        var OriginalSystem: typeof System;
    }
}
declare module Shumway.AVM2.Verifier {
    import Multiname = Shumway.AVM2.ABC.Multiname;
    import Trait = Shumway.AVM2.ABC.Trait;
    import Info = Shumway.AVM2.ABC.Info;
    import MethodInfo = Shumway.AVM2.ABC.MethodInfo;
    import Scope = Shumway.AVM2.Runtime.Scope;
    class VerifierError {
        message: string;
        name: string;
        constructor(message?: string);
    }
    class TypeInformation {
        type: Type;
        baseClass: any;
        object: any;
        scopeDepth: number;
        trait: Trait;
        noCoercionNeeded: boolean;
        noCallSuperNeeded: boolean;
    }
    class Type {
        static Any: AtomType;
        static Null: AtomType;
        static Void: AtomType;
        static Undefined: AtomType;
        static Int: TraitsType;
        static Uint: TraitsType;
        static Class: TraitsType;
        static Array: TraitsType;
        static Object: TraitsType;
        static String: TraitsType;
        static Number: TraitsType;
        static Boolean: TraitsType;
        static Function: TraitsType;
        static XML: TraitsType;
        static XMLList: TraitsType;
        static QName: TraitsType;
        static Namespace: TraitsType;
        static Dictionary: TraitsType;
        static _cache: {
            byQN: Map<Type>;
            byHash: Map<Type>;
        };
        static from(info: Info, domain: ApplicationDomain): Type;
        static fromSimpleName(name: string, domain: ApplicationDomain): TraitsType;
        static fromName(mn: Multiname, domain: ApplicationDomain): Type;
        private static _typesInitialized;
        static initializeTypes(domain: ApplicationDomain): void;
        equals(other: Type): boolean;
        canBeXML(): boolean;
        isStrictComparableWith(other: Type): boolean;
        merge(other: Type): Type;
        instanceType(): Type;
        classType(): Type;
        super(): Type;
        applyType(parameter: Type): any;
        getTrait(mn: Type, isSetter: boolean, followSuperType: boolean): Trait;
        isNumeric(): boolean;
        isString(): boolean;
        isScriptInfo(): boolean;
        isClassInfo(): boolean;
        isInstanceInfo(): boolean;
        isMethodInfo(): boolean;
        isTraitsType(): boolean;
        isParameterizedType(): boolean;
        isMethodType(): boolean;
        isMultinameType(): boolean;
        isConstantType(): boolean;
        isSubtypeOf(other: Type): boolean;
        asTraitsType(): TraitsType;
        asMethodType(): MethodType;
        asMultinameType(): MultinameType;
        asConstantType(): ConstantType;
        getConstantValue(): any;
        asParameterizedType(): ParameterizedType;
    }
    class AtomType extends Type {
        name: string;
        symbol: string;
        constructor(name: string, symbol: string);
        toString(): string;
        instanceType(): Type;
    }
    class TraitsType extends Type {
        info: Info;
        domain: ApplicationDomain;
        _cachedType: Type;
        constructor(info: Info, domain: ApplicationDomain);
        instanceType(): TraitsType;
        classType(): TraitsType;
        super(): TraitsType;
        findTraitByName(traits: Trait[], mn: any, isSetter: boolean): any;
        getTrait(mn: Type, isSetter: boolean, followSuperType: boolean): Trait;
        getTraitAt(slotId: number): any;
        equals(other: Type): boolean;
        merge(other: Type): Type;
        isScriptInfo(): boolean;
        isClassInfo(): boolean;
        isMethodInfo(): boolean;
        isInstanceInfo(): boolean;
        isInstanceOrClassInfo(): boolean;
        applyType(parameter: Type): ParameterizedType;
        private _getInfoName();
        toString(): string;
    }
    class MethodType extends TraitsType {
        methodInfo: MethodInfo;
        constructor(methodInfo: MethodInfo, domain: ApplicationDomain);
        toString(): string;
        returnType(): Type;
    }
    class MultinameType extends Type {
        namespaces: Type[];
        name: Type;
        flags: number;
        constructor(namespaces: Type[], name: Type, flags: number);
        toString(): string;
    }
    class ParameterizedType extends TraitsType {
        type: TraitsType;
        parameter: Type;
        constructor(type: TraitsType, parameter: Type);
    }
    class ConstantType extends Type {
        value: any;
        constructor(value: any);
        toString(): string;
        static from(value: any): ConstantType;
        static fromArray(array: any[]): ConstantType[];
    }
    class State {
        static id: number;
        id: number;
        originalId: number;
        stack: Type[];
        scope: Type[];
        local: Type[];
        constructor();
        clone(): State;
        trace(writer: IndentingWriter): void;
        toString(): string;
        equals(other: State): boolean;
        private static _arrayEquals(a, b);
        isSubset(other: State): boolean;
        private static _arraySubset(a, b);
        merge(other: State): void;
        private static _mergeArrays(a, b);
    }
    class Verifier {
        private _prepareScopeObjects(methodInfo, scope);
        verifyMethod(methodInfo: MethodInfo, scope: Scope): void;
    }
}
declare module Shumway.AVM2.Compiler.IR {
    interface NodeVisitor {
        (node: Node): void;
    }
    interface BlockVisitor {
        (block: Block): void;
    }
    enum Flags {
        NumericProperty = 1,
        RESOLVED = 2,
        PRISTINE = 4,
        IS_METHOD = 8,
        AS_CALL = 16,
    }
    class Node {
        abstract: boolean;
        private static _nextID;
        static getNextID(): number;
        id: number;
        control: Control;
        nodeName: string;
        variable: Variable;
        mustFloat: boolean;
        shouldFloat: boolean;
        shouldNotFloat: boolean;
        constructor();
        compile: (cx) => void;
        visitInputs(visitor: NodeVisitor): void;
        static startNumbering(): void;
        static stopNumbering(): void;
        toString(brief?: boolean): any;
        visitInputsNoConstants(visitor: NodeVisitor): void;
        replaceInput(oldInput: Node, newInput: Node): number;
    }
    class Control extends Node {
        constructor();
    }
    class Region extends Control {
        entryState: any;
        predecessors: Control[];
        constructor(control: Control);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Start extends Region {
        scope: Node;
        constructor();
        visitInputs(visitor: NodeVisitor): void;
    }
    class End extends Control {
        control: Control;
        constructor(control: Control);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Stop extends End {
        store: Store;
        argument: Value;
        constructor(control: Control, store: Store, argument: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class If extends End {
        predicate: Value;
        constructor(control: Control, predicate: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Switch extends End {
        determinant: Value;
        constructor(control: any, determinant: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Jump extends End {
        constructor(control: any);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Value extends Node {
        ty: Shumway.AVM2.Verifier.Type;
        constructor();
    }
    class Store extends Value {
        constructor();
    }
    class StoreDependent extends Value {
        control: Control;
        store: Store;
        loads: Node[];
        constructor(control: Control, store: Store);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Call extends StoreDependent {
        callee: Value;
        object: Value;
        args: Value[];
        flags: number;
        constructor(control: Control, store: Store, callee: Value, object: Value, args: Value[], flags: number);
        visitInputs(visitor: NodeVisitor): void;
    }
    class New extends StoreDependent {
        callee: Value;
        args: Value[];
        constructor(control: Control, store: Store, callee: Value, args: Value[]);
        visitInputs(visitor: NodeVisitor): void;
    }
    class GetProperty extends StoreDependent {
        object: Value;
        name: Value;
        constructor(control: Control, store: Store, object: Value, name: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class SetProperty extends StoreDependent {
        object: Value;
        name: Value;
        value: Value;
        constructor(control: Control, store: Store, object: Value, name: Value, value: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class DeleteProperty extends StoreDependent {
        object: Value;
        name: Value;
        constructor(control: any, store: any, object: Value, name: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class CallProperty extends StoreDependent {
        object: Value;
        name: Value;
        args: Value[];
        flags: number;
        constructor(control: Control, store: Store, object: Value, name: Value, args: Value[], flags: number);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Phi extends Value {
        control: Control;
        isLoop: boolean;
        sealed: boolean;
        args: Value[];
        constructor(control: Control, value: Value);
        visitInputs(visitor: NodeVisitor): void;
        seal(): void;
        pushValue(x: Value): void;
    }
    class Variable extends Value {
        name: string;
        constructor(name: string);
    }
    class Copy extends Value {
        argument: Value;
        constructor(argument: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Move extends Value {
        to: Variable;
        from: Value;
        constructor(to: Variable, from: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    enum ProjectionType {
        CASE = 0,
        TRUE = 1,
        FALSE = 2,
        STORE = 3,
        SCOPE = 4,
    }
    class Projection extends Value {
        argument: Node;
        type: ProjectionType;
        selector: Constant;
        constructor(argument: Node, type: ProjectionType, selector?: Constant);
        visitInputs(visitor: NodeVisitor): void;
        project(): Node;
    }
    class Latch extends Value {
        control: Control;
        condition: Value;
        left: Value;
        right: Value;
        constructor(control: Control, condition: Value, left: Value, right: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Operator {
        name: string;
        evaluate: Function;
        isBinary: boolean;
        not: Operator;
        static byName: Shumway.Map<Operator>;
        constructor(name: string, evaluate: Function, isBinary: boolean);
        static ADD: Operator;
        static SUB: Operator;
        static MUL: Operator;
        static DIV: Operator;
        static MOD: Operator;
        static AND: Operator;
        static OR: Operator;
        static XOR: Operator;
        static LSH: Operator;
        static RSH: Operator;
        static URSH: Operator;
        static SEQ: Operator;
        static SNE: Operator;
        static EQ: Operator;
        static NE: Operator;
        static LE: Operator;
        static GT: Operator;
        static LT: Operator;
        static GE: Operator;
        static PLUS: Operator;
        static NEG: Operator;
        static TRUE: Operator;
        static FALSE: Operator;
        static TYPE_OF: Operator;
        static BITWISE_NOT: Operator;
        static AS_ADD: Operator;
        static linkOpposites(a: Operator, b: Operator): void;
        static fromName(name: string): Operator;
    }
    class Binary extends Value {
        operator: Operator;
        left: Value;
        right: Value;
        constructor(operator: Operator, left: Value, right: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Unary extends Value {
        operator: Operator;
        argument: Value;
        constructor(operator: Operator, argument: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Constant extends Value {
        value: any;
        constructor(value: any);
    }
    class GlobalProperty extends Value {
        name: string;
        constructor(name: string);
    }
    class This extends Value {
        control: Control;
        constructor(control: Control);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Throw extends Value {
        control: Control;
        argument: Value;
        constructor(control: Control, argument: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Arguments extends Value {
        control: Control;
        constructor(control: Control);
        visitInputs(visitor: NodeVisitor): void;
    }
    class Parameter extends Value {
        control: Control;
        index: number;
        name: string;
        constructor(control: Control, index: number, name: string);
        visitInputs(visitor: NodeVisitor): void;
    }
    class NewArray extends Value {
        control: Control;
        elements: Value[];
        constructor(control: Control, elements: Value[]);
        visitInputs(visitor: NodeVisitor): void;
    }
    class NewObject extends Value {
        control: Control;
        properties: KeyValuePair[];
        constructor(control: Control, properties: KeyValuePair[]);
        visitInputs(visitor: NodeVisitor): void;
    }
    class KeyValuePair extends Value {
        key: Value;
        value: Value;
        constructor(key: Value, value: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    function nameOf(node: any): any;
}
declare module Shumway.AVM2.Compiler.IR {
    import IndentingWriter = Shumway.IndentingWriter;
    function isNotPhi(phi: any): boolean;
    function isPhi(phi: any): boolean;
    function isScope(scope: any): boolean;
    function isMultinameConstant(node: any): boolean;
    function isMultiname(name: any): boolean;
    function isStore(store: any): boolean;
    function isConstant(constant: any): boolean;
    function isControlOrNull(control: any): boolean;
    function isStoreOrNull(store: any): boolean;
    function isControl(control: any): boolean;
    function isValueOrNull(value: any): boolean;
    function isValue(value: any): boolean;
    function isProjection(node: any, type: any): boolean;
    var Null: Constant;
    var Undefined: Constant;
    var True: Constant;
    var False: Constant;
    class Block {
        id: number;
        rpo: number;
        name: string;
        phis: Phi[];
        nodes: Node[];
        region: Node;
        dominator: Block;
        successors: Block[];
        predecessors: Block[];
        compile: (cx, state) => void;
        dominatees: Block[];
        npredecessors: number;
        level: number;
        frontier: any;
        constructor(id: number, start?: Region, end?: Node);
        pushSuccessorAt(successor: Block, index: number, pushPredecessor?: boolean): void;
        pushSuccessor(successor: Block, pushPredecessor?: boolean): void;
        pushPredecessor(predecessor: Block): void;
        visitNodes(fn: NodeVisitor): void;
        visitSuccessors(fn: BlockVisitor): void;
        visitPredecessors(fn: BlockVisitor): void;
        append(node: Node): void;
        toString(): string;
        trace(writer: IndentingWriter): void;
    }
    class DFG {
        exit: Node;
        start: Node;
        constructor(exit: Node);
        buildCFG(): CFG;
        static preOrderDepthFirstSearch(root: any, visitChildren: any, pre: any): void;
        static postOrderDepthFirstSearch(root: any, visitChildren: any, post: any): void;
        forEachInPreOrderDepthFirstSearch(visitor: any): void;
        forEach(visitor: any, postOrder: boolean): void;
        traceMetrics(writer: IndentingWriter): void;
        trace(writer: IndentingWriter): void;
    }
    class Uses {
        entries: any[];
        constructor();
        addUse(def: any, use: any): void;
        trace(writer: any): void;
        replace(def: any, value: any): boolean;
        updateUses(def: any, value: any, useEntries: any, writer: any): boolean;
    }
    class CFG {
        dfg: DFG;
        exit: Block;
        root: Block;
        order: Block[];
        blocks: Block[];
        nextBlockID: number;
        blockNames: Shumway.Map<Block>;
        setConstructor: any;
        constructor();
        static fromDFG(dfg: any): CFG;
        buildRootAndExit(): void;
        fromString(list: any, rootName: any): void;
        buildBlock(start: any, end: any): Block;
        createBlockSet(): any;
        computeReversePostOrder(): any[];
        depthFirstSearch(preFn: any, postFn?: any): void;
        computeDominators(apply: any): Int32Array;
        computeLoops(): void;
        computeUses(): Uses;
        verify(): void;
        optimizePhis(): void;
        splitCriticalEdges(): number;
        allocateVariables(): void;
        scheduleEarly(): void;
        trace(writer: IndentingWriter): void;
    }
    class PeepholeOptimizer {
        foldUnary(node: any, truthy?: any): any;
        foldBinary(node: any, truthy?: any): any;
        fold(node: any, truthy?: any): any;
    }
}
declare module Shumway.AVM2.Compiler {
    import MethodInfo = Shumway.AVM2.ABC.MethodInfo;
    import Scope = Shumway.AVM2.Runtime.Scope;
    function compileMethod(methodInfo: MethodInfo, scope: Scope, hasDynamicScope: any): Backend.Compilation;
}
declare module Shumway.AVM2.Compiler {
    import AbcFile = Shumway.AVM2.ABC.AbcFile;
    function compileAbc(abc: AbcFile, writer: IndentingWriter): void;
}
declare module Shumway.AVM2.Compiler.AST {
    function escapeString(str: any): any;
    class Node {
        type: string;
        toSource(precedence: number): string;
    }
    class Statement extends Node {
        type: string;
    }
    class Expression extends Node {
        type: string;
    }
    class Program extends Node {
        body: Node[];
        type: string;
        constructor(body: Node[]);
    }
    class EmptyStatement extends Statement {
        type: string;
    }
    class BlockStatement extends Statement {
        body: Statement[];
        type: string;
        end: IR.Node;
        constructor(body: Statement[]);
        toSource(precedence: number): string;
    }
    class ExpressionStatement extends Statement {
        expression: Expression;
        type: string;
        constructor(expression: Expression);
        toSource(precedence: number): string;
    }
    class IfStatement extends Statement {
        test: Expression;
        consequent: Statement;
        alternate: Statement;
        type: string;
        constructor(test: Expression, consequent: Statement, alternate: Statement);
        toSource(precedence: number): string;
    }
    class LabeledStatement extends Statement {
        label: Identifier;
        body: Statement;
        type: string;
        constructor(label: Identifier, body: Statement);
    }
    class BreakStatement extends Statement {
        label: Identifier;
        type: string;
        constructor(label: Identifier);
        toSource(precedence: number): string;
    }
    class ContinueStatement extends Statement {
        label: Identifier;
        type: string;
        constructor(label: Identifier);
        toSource(precedence: number): string;
    }
    class WithStatement extends Statement {
        object: Expression;
        body: Statement;
        type: string;
        constructor(object: Expression, body: Statement);
    }
    class SwitchStatement extends Statement {
        discriminant: Expression;
        cases: SwitchCase[];
        lexical: boolean;
        type: string;
        constructor(discriminant: Expression, cases: SwitchCase[], lexical: boolean);
        toSource(precedence: number): string;
    }
    class ReturnStatement extends Statement {
        argument: Expression;
        type: string;
        constructor(argument: Expression);
        toSource(precedence: number): string;
    }
    class ThrowStatement extends Statement {
        argument: Expression;
        type: string;
        constructor(argument: Expression);
        toSource(precedence: number): string;
    }
    class TryStatement extends Statement {
        block: BlockStatement;
        handlers: CatchClause;
        guardedHandlers: CatchClause[];
        finalizer: BlockStatement;
        type: string;
        constructor(block: BlockStatement, handlers: CatchClause, guardedHandlers: CatchClause[], finalizer: BlockStatement);
    }
    class WhileStatement extends Statement {
        test: Expression;
        body: Statement;
        type: string;
        constructor(test: Expression, body: Statement);
        toSource(precedence: number): string;
    }
    class DoWhileStatement extends Statement {
        body: Statement;
        test: Expression;
        type: string;
        constructor(body: Statement, test: Expression);
    }
    class ForStatement extends Statement {
        init: Node;
        test: Expression;
        update: Expression;
        body: Statement;
        type: string;
        constructor(init: Node, test: Expression, update: Expression, body: Statement);
    }
    class ForInStatement extends Statement {
        left: Node;
        right: Expression;
        body: Statement;
        each: boolean;
        type: string;
        constructor(left: Node, right: Expression, body: Statement, each: boolean);
    }
    class DebuggerStatement extends Statement {
        type: string;
    }
    class Declaration extends Statement {
        type: string;
    }
    class FunctionDeclaration extends Declaration {
        id: Identifier;
        params: Node[];
        defaults: Expression[];
        rest: Identifier;
        body: BlockStatement;
        generator: boolean;
        expression: boolean;
        type: string;
        constructor(id: Identifier, params: Node[], defaults: Expression[], rest: Identifier, body: BlockStatement, generator: boolean, expression: boolean);
    }
    class VariableDeclaration extends Declaration {
        declarations: VariableDeclarator[];
        kind: string;
        type: string;
        constructor(declarations: VariableDeclarator[], kind: string);
        toSource(precedence: number): string;
    }
    class VariableDeclarator extends Node {
        id: Node;
        init: Node;
        type: string;
        constructor(id: Node, init?: Node);
        toSource(precedence: number): string;
    }
    class Identifier extends Expression {
        name: string;
        type: string;
        constructor(name: string);
        toSource(precedence: number): string;
    }
    class Literal extends Expression {
        value: any;
        type: string;
        constructor(value: any);
        toSource(precedence: number): string;
    }
    class ThisExpression extends Expression {
        type: string;
        toSource(precedence: number): string;
    }
    class ArrayExpression extends Expression {
        elements: Expression[];
        type: string;
        constructor(elements: Expression[]);
        toSource(precedence: number): string;
    }
    class ObjectExpression extends Expression {
        properties: Property[];
        type: string;
        constructor(properties: Property[]);
        toSource(precedence: number): string;
    }
    class FunctionExpression extends Expression {
        id: Identifier;
        params: Node[];
        defaults: Expression[];
        rest: Identifier;
        body: BlockStatement;
        generator: boolean;
        expression: boolean;
        type: string;
        constructor(id: Identifier, params: Node[], defaults: Expression[], rest: Identifier, body: BlockStatement, generator: boolean, expression: boolean);
    }
    class SequenceExpression extends Expression {
        expressions: Expression[];
        type: string;
        constructor(expressions: Expression[]);
    }
    class UnaryExpression extends Expression {
        operator: string;
        prefix: boolean;
        argument: Expression;
        type: string;
        constructor(operator: string, prefix: boolean, argument: Expression);
        toSource(precedence: number): string;
    }
    class BinaryExpression extends Expression {
        operator: string;
        left: Expression;
        right: Expression;
        type: string;
        constructor(operator: string, left: Expression, right: Expression);
        toSource(precedence: number): string;
    }
    class AssignmentExpression extends Expression {
        operator: string;
        left: Expression;
        right: Expression;
        type: string;
        constructor(operator: string, left: Expression, right: Expression);
        toSource(precedence: number): string;
    }
    class UpdateExpression extends Expression {
        operator: string;
        argument: Expression;
        prefix: boolean;
        type: string;
        constructor(operator: string, argument: Expression, prefix: boolean);
    }
    class LogicalExpression extends BinaryExpression {
        type: string;
        constructor(operator: string, left: Expression, right: Expression);
    }
    class ConditionalExpression extends Expression {
        test: Expression;
        consequent: Expression;
        alternate: Expression;
        type: string;
        constructor(test: Expression, consequent: Expression, alternate: Expression);
        toSource(precedence: number): string;
    }
    class NewExpression extends Expression {
        callee: Expression;
        type: string;
        arguments: Expression[];
        constructor(callee: Expression, _arguments: Expression[]);
        toSource(precedence: number): string;
    }
    class CallExpression extends Expression {
        callee: Expression;
        type: string;
        arguments: Expression[];
        constructor(callee: Expression, _arguments: Expression[]);
        toSource(precedence: number): string;
    }
    class MemberExpression extends Expression {
        object: Expression;
        property: Node;
        computed: boolean;
        type: string;
        constructor(object: Expression, property: Node, computed: boolean);
        toSource(precedence: number): string;
    }
    class Property extends Node {
        key: Node;
        value: Expression;
        kind: string;
        type: string;
        constructor(key: Node, value: Expression, kind: string);
        toSource(precedence: number): string;
    }
    class SwitchCase extends Node {
        test: Expression;
        consequent: Statement[];
        type: string;
        constructor(test: Expression, consequent: Statement[]);
        toSource(precedence: number): string;
    }
    class CatchClause extends Node {
        param: Node;
        guard: Expression;
        body: BlockStatement;
        type: string;
        constructor(param: Node, guard: Expression, body: BlockStatement);
    }
}
declare module Shumway.AVM2.Compiler.IR {
    class ASScope extends Value {
        parent: ASScope;
        object: Value;
        isWith: boolean;
        constructor(parent: ASScope, object: Value, isWith: boolean);
        visitInputs(visitor: NodeVisitor): void;
    }
    class ASMultiname extends Value {
        namespaces: Value;
        name: Value;
        flags: Value;
        constructor(namespaces: Value, name: Value, flags: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class ASCallProperty extends CallProperty {
        isLex: boolean;
        constructor(control: Control, store: Store, object: Value, name: Value, args: Value[], flags: number, isLex: boolean);
    }
    class ASCallSuper extends CallProperty {
        scope: ASScope;
        constructor(control: Control, store: Store, object: Value, name: Value, args: Value[], flags: number, scope: ASScope);
        visitInputs(visitor: NodeVisitor): void;
    }
    class ASNew extends New {
        constructor(control: Control, store: Store, callee: Value, args: Value[]);
    }
    class ASGetProperty extends GetProperty {
        flags: number;
        constructor(control: Control, store: Store, object: Value, name: Value, flags: number);
    }
    class ASGetDescendants extends GetProperty {
        constructor(control: Control, store: Store, object: Value, name: Value);
    }
    class ASHasProperty extends GetProperty {
        constructor(control: Control, store: Store, object: Value, name: Value);
    }
    class ASGetSlot extends GetProperty {
        constructor(control: Control, store: Store, object: Value, name: Value);
    }
    class ASGetSuper extends GetProperty {
        scope: ASScope;
        constructor(control: Control, store: Store, object: Value, name: Value, scope: ASScope);
        visitInputs(visitor: NodeVisitor): void;
    }
    class ASSetProperty extends SetProperty {
        flags: number;
        constructor(control: Control, store: Store, object: Value, name: Value, value: Value, flags: number);
    }
    class ASSetSlot extends SetProperty {
        constructor(control: Control, store: Store, object: Value, name: Value, value: Value);
    }
    class ASSetSuper extends SetProperty {
        scope: Value;
        constructor(control: Control, store: Store, object: Value, name: Value, value: Value, scope: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class ASDeleteProperty extends DeleteProperty {
        constructor(control: Control, store: Store, object: Value, name: Value);
    }
    class ASFindProperty extends StoreDependent {
        scope: ASScope;
        name: Value;
        methodInfo: Constant;
        strict: boolean;
        constructor(control: Control, store: Store, scope: ASScope, name: Value, methodInfo: Constant, strict: boolean);
        visitInputs(visitor: NodeVisitor): void;
    }
    class ASGlobal extends Value {
        control: Control;
        scope: Value;
        constructor(control: Control, scope: Value);
        visitInputs(visitor: NodeVisitor): void;
    }
    class ASNewActivation extends Value {
        methodInfo: Constant;
        constructor(methodInfo: Constant);
    }
    class ASNewHasNext2 extends Value {
        constructor();
    }
}
declare module Shumway.AVM2.Compiler.Looper {
    import CFG = Compiler.IR.CFG;
    import Block = Compiler.IR.Block;
    import BlockVisitor = Compiler.IR.BlockVisitor;
    module Control {
        enum Kind {
            SEQ = 1,
            LOOP = 2,
            IF = 3,
            CASE = 4,
            SWITCH = 5,
            LABEL_CASE = 6,
            LABEL_SWITCH = 7,
            EXIT = 8,
            BREAK = 9,
            CONTINUE = 10,
            TRY = 11,
            CATCH = 12,
        }
        class ControlNode {
            kind: Kind;
            constructor(kind: Kind);
            compile: (cx: Backend.Context) => Compiler.AST.Node;
        }
        class Seq extends ControlNode {
            body: any;
            constructor(body: any);
            trace(writer: any): void;
            first(): any;
            slice(begin: any, end: any): Seq;
        }
        class Loop extends ControlNode {
            body: any;
            constructor(body: any);
            trace(writer: any): void;
        }
        class If extends ControlNode {
            cond: any;
            then: any;
            nothingThrownLabel: any;
            negated: boolean;
            else: any;
            constructor(cond: any, then: any, els: any, nothingThrownLabel?: any);
            trace(writer: any): void;
        }
        class Case extends ControlNode {
            index: any;
            body: any;
            constructor(index: any, body: any);
            trace(writer: any): void;
        }
        class Switch extends ControlNode {
            determinant: any;
            cases: any;
            nothingThrownLabel: any;
            constructor(determinant: any, cases: any, nothingThrownLabel?: any);
            trace(writer: any): void;
        }
        class LabelCase extends ControlNode {
            labels: any;
            body: any;
            constructor(labels: any, body: any);
            trace(writer: any): void;
        }
        class LabelSwitch extends ControlNode {
            cases: any;
            labelMap: any;
            constructor(cases: any);
            trace(writer: any): void;
        }
        class Exit extends ControlNode {
            label: any;
            constructor(label: any);
            trace(writer: any): void;
        }
        class Break extends ControlNode {
            label: any;
            head: any;
            constructor(label: any, head: any);
            trace(writer: any): void;
        }
        class Continue extends ControlNode {
            label: any;
            head: any;
            necessary: boolean;
            constructor(label: any, head: any);
            trace(writer: any): void;
        }
        class Try extends ControlNode {
            body: any;
            catches: any;
            nothingThrownLabel: boolean;
            constructor(body: any, catches: any);
            trace(writer: any): void;
        }
        class Catch extends ControlNode {
            varName: any;
            typeName: any;
            body: any;
            constructor(varName: any, typeName: any, body: any);
            trace(writer: any): void;
        }
    }
    class BlockSet extends Shumway.BitSets.Uint32ArrayBitSet {
        blockById: Shumway.Map<Block>;
        constructor(length: number, blockById: Shumway.Map<Block>);
        forEachBlock(fn: BlockVisitor): void;
        choose(): Block;
        members(): Block[];
        setBlocks(bs: Block[]): void;
    }
    class Analysis {
        blocks: Block[];
        boundBlockSet: any;
        analyzedControlFlow: boolean;
        markedLoops: boolean;
        hasExceptions: boolean;
        restructuredControlFlow: boolean;
        controlTree: Control.ControlNode;
        constructor(cfg: CFG);
        makeBlockSetFactory(length: number, blockById: Block[]): void;
        normalizeReachableBlocks(root: any): void;
        computeDominance(): void;
        computeFrontiers(): void;
        analyzeControlFlow(): boolean;
        markLoops(): boolean;
        induceControlTree(): void;
        restructureControlFlow(): boolean;
    }
    function analyze(cfg: CFG): Control.ControlNode;
}
declare module Shumway.AVM2.Compiler.Backend {
    import AST = Shumway.AVM2.Compiler.AST;
    import Variable = IR.Variable;
    class Context {
        label: Variable;
        variables: any[];
        constants: any[];
        lazyConstants: any[];
        parameters: any[];
        useConstant(constant: IR.Constant): number;
        useVariable(variable: IR.Variable): number;
        useParameter(parameter: IR.Parameter): IR.Parameter;
        compileLabelBody(node: any): any[];
        compileBreak(node: any): AST.BlockStatement;
        compileContinue(node: any): AST.BlockStatement;
        compileExit(node: any): AST.BlockStatement;
        compileIf(node: any): any;
        compileSwitch(node: any): any;
        compileLabelSwitch(node: any): AST.IfStatement;
        compileLoop(node: any): AST.WhileStatement;
        compileSequence(node: any): AST.BlockStatement;
        compileBlock(block: any): AST.BlockStatement;
    }
    class Compilation {
        parameters: string[];
        body: string;
        constants: any[];
        lazyConstants: any[];
        static id: number;
        constructor(parameters: string[], body: string, constants: any[], lazyConstants: any[]);
        C(index: number): any;
    }
    function generate(cfg: any): Compilation;
}
declare module Shumway.AVM2.Compiler {
    import AbcFile = ABC.AbcFile;
    import MethodInfo = ABC.MethodInfo;
    import Scope = Runtime.Scope;
    function baselineCompileMethod(methodInfo: MethodInfo, scope: Scope, hasDynamicScope: boolean, globalMiName: string): {
        body: string;
        parameters: string[];
    };
    function baselineCompileABCs(libs: AbcFile[], abcs: AbcFile[]): void;
}
declare module Shumway.SWF {
    function enterTimeline(name: string, data?: any): void;
    function leaveTimeline(data?: any): void;
}
declare module Shumway.AVM2.Runtime {
    import AbcFile = Shumway.AVM2.ABC.AbcFile;
    import Multiname = Shumway.AVM2.ABC.Multiname;
    import Callback = Shumway.Callback;
    function executeScript(script: any): void;
    function ensureScriptIsExecuted(script: any, reason: string): void;
    enum Glue {
        PUBLIC_PROPERTIES = 1,
        PUBLIC_METHODS = 2,
        ALL,
    }
    var playerglobalLoadedPromise: any;
    var playerglobal: any;
    class AVM2 {
        systemDomain: ApplicationDomain;
        applicationDomain: ApplicationDomain;
        findDefiningAbc: (mn: Multiname) => AbcFile;
        exception: any;
        exceptions: any[];
        globals: Map<any>;
        builtinsLoaded: boolean;
        static instance: AVM2;
        static initialize(sysMode: ExecutionMode, appMode: ExecutionMode): void;
        constructor(sysMode: ExecutionMode, appMode: ExecutionMode);
        static currentAbc(): any;
        static currentDomain(): any;
        static isPlayerglobalLoaded(): boolean;
        static loadPlayerglobal(): Promise<any>;
    }
    class ApplicationDomain {
        vm: AVM2;
        abcs: AbcFile[];
        loadedAbcs: any;
        loadedClasses: any;
        classCache: any;
        scriptCache: any;
        classInfoCache: any;
        base: ApplicationDomain;
        allowNatives: boolean;
        mode: ExecutionMode;
        onMessage: Callback;
        system: any;
        constructor(vm: AVM2, base: ApplicationDomain, mode: ExecutionMode, allowNatives: boolean);
        static passthroughCallable(f: any): {
            call: ($this: any) => any;
            apply: ($this: any, args: any) => any;
        };
        static coerceCallable(type: any): {
            call: ($this: any, value: any) => any;
            apply: ($this: any, args: any) => any;
        };
        getType(multiname: Multiname): any;
        getProperty(multiname: Multiname, strict: boolean, execute: boolean): any;
        getClass(simpleName: string, strict?: boolean): Shumway.AVM2.AS.ASClass;
        findDomainProperty(multiname: Multiname, strict: boolean, execute: boolean): any;
        findClassInfo(mn: any): any;
        findClassInfoSlow(mn: any, originalQn: any): any;
        findDefiningScript(mn: any, execute: any): any;
        findDefiningScriptSlow(mn: any, execute: any): any;
        compileAbc(abc: any, writer: any): void;
        executeAbc(abc: AbcFile): void;
        loadAbc(abc: AbcFile): void;
        broadcastMessage(type: any, message: any, origin: any): void;
        traceLoadedClasses(lastOnly: any): void;
    }
    class SecurityDomain {
        compartment: any;
        systemDomain: ApplicationDomain;
        applicationDomain: ApplicationDomain;
        constructor(compartmentPath: string);
        initializeShell(sysMode: any, appMode: any): void;
    }
}
declare var Glue: typeof Shumway.AVM2.Runtime.Glue;
import ApplicationDomain = Shumway.AVM2.Runtime.ApplicationDomain;
import AVM2 = Shumway.AVM2.Runtime.AVM2;
import EXECUTION_MODE = Shumway.AVM2.Runtime.ExecutionMode;
declare module Shumway.AVM2.Runtime {
    import MethodInfo = Shumway.AVM2.ABC.MethodInfo;
    import Trait = Shumway.AVM2.ABC.Trait;
    function getMethodOverrideKey(methodInfo: any): any;
    function checkMethodOverrides(methodInfo: MethodInfo): any;
    function checkCommonMethodPatterns(methodInfo: MethodInfo): () => void;
    interface ITrampoline extends Function {
        trigger: () => void;
        isTrampoline: boolean;
        debugName: string;
        patchTargets: Shumway.AVM2.Runtime.IPatchTarget[];
    }
    interface IMemoizer extends Function {
        isMemoizer: boolean;
        debugName: string;
    }
    function makeTrampoline(trait: Trait, scope: Scope, natives: any, patchTargets: IPatchTarget[], parameterLength: number, description: string): ITrampoline;
    function makeMemoizer(qn: any, target: any): IMemoizer;
}
declare module Shumway.AVM2 {
    class Interpreter {
        static interpretMethod($this: any, method: any, savedScope: any, methodArgs: any): any;
    }
}
declare module Shumway.AVM2.Runtime {
}
declare module Shumway.AVM2 {
    import ByteArray = Shumway.AVM2.AS.flash.utils.ByteArray;
    enum AMF0Marker {
        NUMBER = 0,
        BOOLEAN = 1,
        STRING = 2,
        OBJECT = 3,
        NULL = 5,
        UNDEFINED = 6,
        REFERENCE = 7,
        ECMA_ARRAY = 8,
        OBJECT_END = 9,
        STRICT_ARRAY = 10,
        DATE = 11,
        LONG_STRING = 12,
        XML = 15,
        TYPED_OBJECT = 16,
        AVMPLUS = 17,
    }
    class AMF0 {
        static write(ba: ByteArray, obj: any): void;
        static read(ba: ByteArray): any;
    }
    enum AMF3Marker {
        UNDEFINED = 0,
        NULL = 1,
        FALSE = 2,
        TRUE = 3,
        INTEGER = 4,
        DOUBLE = 5,
        STRING = 6,
        XML_DOC = 7,
        DATE = 8,
        ARRAY = 9,
        OBJECT = 10,
        XML = 11,
        BYTEARRAY = 12,
        VECTOR_INT = 13,
        VECTOR_UINT = 14,
        VECTOR_DOUBLE = 15,
        VECTOR_OBJECT = 16,
        DICTIONARY = 17,
    }
    var aliasesCache: {
        classes: WeakMap<{}, {}>;
        names: any;
    };
    class AMF3 {
        static write(ba: ByteArray, object: any): void;
        static read(ba: ByteArray): any;
    }
}
