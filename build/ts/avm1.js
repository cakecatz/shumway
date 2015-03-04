var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var ActionsDataStream = (function () {
            function ActionsDataStream(array, swfVersion) {
                this.array = array;
                this.position = 0;
                this.end = array.length;
                this.readANSI = swfVersion < 6;
                var buffer = new ArrayBuffer(4);
                (new Int32Array(buffer))[0] = 1;
                if (!(new Uint8Array(buffer))[0]) {
                    throw new Error("big-endian platform");
                }
            }
            ActionsDataStream.prototype.readUI8 = function () {
                return this.array[this.position++];
            };
            ActionsDataStream.prototype.readUI16 = function () {
                var position = this.position, array = this.array;
                var value = (array[position + 1] << 8) | array[position];
                this.position = position + 2;
                return value;
            };
            ActionsDataStream.prototype.readSI16 = function () {
                var position = this.position, array = this.array;
                var value = (array[position + 1] << 8) | array[position];
                this.position = position + 2;
                return value < 0x8000 ? value : (value - 0x10000);
            };
            ActionsDataStream.prototype.readInteger = function () {
                var position = this.position, array = this.array;
                var value = array[position] | (array[position + 1] << 8) | (array[position + 2] << 16) | (array[position + 3] << 24);
                this.position = position + 4;
                return value;
            };
            ActionsDataStream.prototype.readFloat = function () {
                var position = this.position;
                var array = this.array;
                var buffer = new ArrayBuffer(4);
                var bytes = new Uint8Array(buffer);
                bytes[0] = array[position];
                bytes[1] = array[position + 1];
                bytes[2] = array[position + 2];
                bytes[3] = array[position + 3];
                this.position = position + 4;
                return (new Float32Array(buffer))[0];
            };
            ActionsDataStream.prototype.readDouble = function () {
                var position = this.position;
                var array = this.array;
                var buffer = new ArrayBuffer(8);
                var bytes = new Uint8Array(buffer);
                bytes[4] = array[position];
                bytes[5] = array[position + 1];
                bytes[6] = array[position + 2];
                bytes[7] = array[position + 3];
                bytes[0] = array[position + 4];
                bytes[1] = array[position + 5];
                bytes[2] = array[position + 6];
                bytes[3] = array[position + 7];
                this.position = position + 8;
                return (new Float64Array(buffer))[0];
            };
            ActionsDataStream.prototype.readBoolean = function () {
                return !!this.readUI8();
            };
            ActionsDataStream.prototype.readANSIString = function () {
                var value = '';
                var ch;
                while ((ch = this.readUI8())) {
                    value += String.fromCharCode(ch);
                }
                return value;
            };
            ActionsDataStream.prototype.readUTF8String = function () {
                var value = '';
                var ch;
                while ((ch = this.readUI8())) {
                    if (ch < 0x80) {
                        value += String.fromCharCode(ch);
                        continue;
                    }
                    if ((ch & 0xC0) === 0x80) {
                        value += String.fromCharCode(ch);
                        continue;
                    }
                    var lastPosition = this.position - 1;
                    var currentPrefix = 0xC0;
                    var validBits = 5;
                    do {
                        var mask = (currentPrefix >> 1) | 0x80;
                        if ((ch & mask) === currentPrefix) {
                            break;
                        }
                        currentPrefix = mask;
                        --validBits;
                    } while (validBits >= 0);
                    var code = (ch & ((1 << validBits) - 1));
                    for (var i = 5; i >= validBits; --i) {
                        ch = this.readUI8();
                        if ((ch & 0xC0) !== 0x80) {
                            var skipToPosition = this.position - 1;
                            this.position = lastPosition;
                            while (this.position < skipToPosition) {
                                value += String.fromCharCode(this.readUI8());
                            }
                            continue;
                        }
                        code = (code << 6) | (ch & 0x3F);
                    }
                    if (code >= 0x10000) {
                        value += String.fromCharCode((((code - 0x10000) >> 10) & 0x3FF) | 0xD800, (code & 0x3FF) | 0xDC00);
                    }
                    else {
                        value += String.fromCharCode(code);
                    }
                }
                return value;
            };
            ActionsDataStream.prototype.readString = function () {
                return this.readANSI ? this.readANSIString() : this.readUTF8String();
            };
            ActionsDataStream.prototype.readBytes = function (length) {
                var position = this.position;
                var remaining = Math.max(this.end - position, 0);
                if (remaining < length) {
                    length = remaining;
                }
                var subarray = this.array.subarray(position, position + length);
                this.position = position + length;
                return subarray;
            };
            return ActionsDataStream;
        })();
        AVM1.ActionsDataStream = ActionsDataStream;
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var ActionsDataStream = Shumway.AVM1.ActionsDataStream;
        (function (ActionCode) {
            ActionCode[ActionCode["None"] = 0x00] = "None";
            ActionCode[ActionCode["ActionGotoFrame"] = 0x81] = "ActionGotoFrame";
            ActionCode[ActionCode["ActionGetURL"] = 0x83] = "ActionGetURL";
            ActionCode[ActionCode["ActionNextFrame"] = 0x04] = "ActionNextFrame";
            ActionCode[ActionCode["ActionPreviousFrame"] = 0x05] = "ActionPreviousFrame";
            ActionCode[ActionCode["ActionPlay"] = 0x06] = "ActionPlay";
            ActionCode[ActionCode["ActionStop"] = 0x07] = "ActionStop";
            ActionCode[ActionCode["ActionToggleQuality"] = 0x08] = "ActionToggleQuality";
            ActionCode[ActionCode["ActionStopSounds"] = 0x09] = "ActionStopSounds";
            ActionCode[ActionCode["ActionWaitForFrame"] = 0x8A] = "ActionWaitForFrame";
            ActionCode[ActionCode["ActionSetTarget"] = 0x8B] = "ActionSetTarget";
            ActionCode[ActionCode["ActionGoToLabel"] = 0x8C] = "ActionGoToLabel";
            ActionCode[ActionCode["ActionPush"] = 0x96] = "ActionPush";
            ActionCode[ActionCode["ActionPop"] = 0x17] = "ActionPop";
            ActionCode[ActionCode["ActionAdd"] = 0x0A] = "ActionAdd";
            ActionCode[ActionCode["ActionSubtract"] = 0x0B] = "ActionSubtract";
            ActionCode[ActionCode["ActionMultiply"] = 0x0C] = "ActionMultiply";
            ActionCode[ActionCode["ActionDivide"] = 0x0D] = "ActionDivide";
            ActionCode[ActionCode["ActionEquals"] = 0x0E] = "ActionEquals";
            ActionCode[ActionCode["ActionLess"] = 0x0F] = "ActionLess";
            ActionCode[ActionCode["ActionAnd"] = 0x10] = "ActionAnd";
            ActionCode[ActionCode["ActionOr"] = 0x11] = "ActionOr";
            ActionCode[ActionCode["ActionNot"] = 0x12] = "ActionNot";
            ActionCode[ActionCode["ActionStringEquals"] = 0x13] = "ActionStringEquals";
            ActionCode[ActionCode["ActionStringLength"] = 0x14] = "ActionStringLength";
            ActionCode[ActionCode["ActionMBStringLength"] = 0x31] = "ActionMBStringLength";
            ActionCode[ActionCode["ActionStringAdd"] = 0x21] = "ActionStringAdd";
            ActionCode[ActionCode["ActionStringExtract"] = 0x15] = "ActionStringExtract";
            ActionCode[ActionCode["ActionMBStringExtract"] = 0x35] = "ActionMBStringExtract";
            ActionCode[ActionCode["ActionStringLess"] = 0x29] = "ActionStringLess";
            ActionCode[ActionCode["ActionToInteger"] = 0x18] = "ActionToInteger";
            ActionCode[ActionCode["ActionCharToAscii"] = 0x32] = "ActionCharToAscii";
            ActionCode[ActionCode["ActionMBCharToAscii"] = 0x36] = "ActionMBCharToAscii";
            ActionCode[ActionCode["ActionAsciiToChar"] = 0x33] = "ActionAsciiToChar";
            ActionCode[ActionCode["ActionMBAsciiToChar"] = 0x37] = "ActionMBAsciiToChar";
            ActionCode[ActionCode["ActionJump"] = 0x99] = "ActionJump";
            ActionCode[ActionCode["ActionIf"] = 0x9D] = "ActionIf";
            ActionCode[ActionCode["ActionCall"] = 0x9E] = "ActionCall";
            ActionCode[ActionCode["ActionGetVariable"] = 0x1C] = "ActionGetVariable";
            ActionCode[ActionCode["ActionSetVariable"] = 0x1D] = "ActionSetVariable";
            ActionCode[ActionCode["ActionGetURL2"] = 0x9A] = "ActionGetURL2";
            ActionCode[ActionCode["ActionGotoFrame2"] = 0x9F] = "ActionGotoFrame2";
            ActionCode[ActionCode["ActionSetTarget2"] = 0x20] = "ActionSetTarget2";
            ActionCode[ActionCode["ActionGetProperty"] = 0x22] = "ActionGetProperty";
            ActionCode[ActionCode["ActionSetProperty"] = 0x23] = "ActionSetProperty";
            ActionCode[ActionCode["ActionCloneSprite"] = 0x24] = "ActionCloneSprite";
            ActionCode[ActionCode["ActionRemoveSprite"] = 0x25] = "ActionRemoveSprite";
            ActionCode[ActionCode["ActionStartDrag"] = 0x27] = "ActionStartDrag";
            ActionCode[ActionCode["ActionEndDrag"] = 0x28] = "ActionEndDrag";
            ActionCode[ActionCode["ActionWaitForFrame2"] = 0x8D] = "ActionWaitForFrame2";
            ActionCode[ActionCode["ActionTrace"] = 0x26] = "ActionTrace";
            ActionCode[ActionCode["ActionGetTime"] = 0x34] = "ActionGetTime";
            ActionCode[ActionCode["ActionRandomNumber"] = 0x30] = "ActionRandomNumber";
            ActionCode[ActionCode["ActionCallFunction"] = 0x3D] = "ActionCallFunction";
            ActionCode[ActionCode["ActionCallMethod"] = 0x52] = "ActionCallMethod";
            ActionCode[ActionCode["ActionConstantPool"] = 0x88] = "ActionConstantPool";
            ActionCode[ActionCode["ActionDefineFunction"] = 0x9B] = "ActionDefineFunction";
            ActionCode[ActionCode["ActionDefineLocal"] = 0x3C] = "ActionDefineLocal";
            ActionCode[ActionCode["ActionDefineLocal2"] = 0x41] = "ActionDefineLocal2";
            ActionCode[ActionCode["ActionDelete"] = 0x3A] = "ActionDelete";
            ActionCode[ActionCode["ActionDelete2"] = 0x3B] = "ActionDelete2";
            ActionCode[ActionCode["ActionEnumerate"] = 0x46] = "ActionEnumerate";
            ActionCode[ActionCode["ActionEquals2"] = 0x49] = "ActionEquals2";
            ActionCode[ActionCode["ActionGetMember"] = 0x4E] = "ActionGetMember";
            ActionCode[ActionCode["ActionInitArray"] = 0x42] = "ActionInitArray";
            ActionCode[ActionCode["ActionInitObject"] = 0x43] = "ActionInitObject";
            ActionCode[ActionCode["ActionNewMethod"] = 0x53] = "ActionNewMethod";
            ActionCode[ActionCode["ActionNewObject"] = 0x40] = "ActionNewObject";
            ActionCode[ActionCode["ActionSetMember"] = 0x4F] = "ActionSetMember";
            ActionCode[ActionCode["ActionTargetPath"] = 0x45] = "ActionTargetPath";
            ActionCode[ActionCode["ActionWith"] = 0x94] = "ActionWith";
            ActionCode[ActionCode["ActionToNumber"] = 0x4A] = "ActionToNumber";
            ActionCode[ActionCode["ActionToString"] = 0x4B] = "ActionToString";
            ActionCode[ActionCode["ActionTypeOf"] = 0x44] = "ActionTypeOf";
            ActionCode[ActionCode["ActionAdd2"] = 0x47] = "ActionAdd2";
            ActionCode[ActionCode["ActionLess2"] = 0x48] = "ActionLess2";
            ActionCode[ActionCode["ActionModulo"] = 0x3F] = "ActionModulo";
            ActionCode[ActionCode["ActionBitAnd"] = 0x60] = "ActionBitAnd";
            ActionCode[ActionCode["ActionBitLShift"] = 0x63] = "ActionBitLShift";
            ActionCode[ActionCode["ActionBitOr"] = 0x61] = "ActionBitOr";
            ActionCode[ActionCode["ActionBitRShift"] = 0x64] = "ActionBitRShift";
            ActionCode[ActionCode["ActionBitURShift"] = 0x65] = "ActionBitURShift";
            ActionCode[ActionCode["ActionBitXor"] = 0x62] = "ActionBitXor";
            ActionCode[ActionCode["ActionDecrement"] = 0x51] = "ActionDecrement";
            ActionCode[ActionCode["ActionIncrement"] = 0x50] = "ActionIncrement";
            ActionCode[ActionCode["ActionPushDuplicate"] = 0x4C] = "ActionPushDuplicate";
            ActionCode[ActionCode["ActionReturn"] = 0x3E] = "ActionReturn";
            ActionCode[ActionCode["ActionStackSwap"] = 0x4D] = "ActionStackSwap";
            ActionCode[ActionCode["ActionStoreRegister"] = 0x87] = "ActionStoreRegister";
            ActionCode[ActionCode["ActionInstanceOf"] = 0x54] = "ActionInstanceOf";
            ActionCode[ActionCode["ActionEnumerate2"] = 0x55] = "ActionEnumerate2";
            ActionCode[ActionCode["ActionStrictEquals"] = 0x66] = "ActionStrictEquals";
            ActionCode[ActionCode["ActionGreater"] = 0x67] = "ActionGreater";
            ActionCode[ActionCode["ActionStringGreater"] = 0x68] = "ActionStringGreater";
            ActionCode[ActionCode["ActionDefineFunction2"] = 0x8E] = "ActionDefineFunction2";
            ActionCode[ActionCode["ActionExtends"] = 0x69] = "ActionExtends";
            ActionCode[ActionCode["ActionCastOp"] = 0x2B] = "ActionCastOp";
            ActionCode[ActionCode["ActionImplementsOp"] = 0x2C] = "ActionImplementsOp";
            ActionCode[ActionCode["ActionTry"] = 0x8F] = "ActionTry";
            ActionCode[ActionCode["ActionThrow"] = 0x2A] = "ActionThrow";
            ActionCode[ActionCode["ActionFSCommand2"] = 0x2D] = "ActionFSCommand2";
            ActionCode[ActionCode["ActionStrictMode"] = 0x89] = "ActionStrictMode";
        })(AVM1.ActionCode || (AVM1.ActionCode = {}));
        var ActionCode = AVM1.ActionCode;
        var ParsedPushRegisterAction = (function () {
            function ParsedPushRegisterAction(registerNumber) {
                this.registerNumber = registerNumber;
            }
            return ParsedPushRegisterAction;
        })();
        AVM1.ParsedPushRegisterAction = ParsedPushRegisterAction;
        var ParsedPushConstantAction = (function () {
            function ParsedPushConstantAction(constantIndex) {
                this.constantIndex = constantIndex;
            }
            return ParsedPushConstantAction;
        })();
        AVM1.ParsedPushConstantAction = ParsedPushConstantAction;
        (function (ArgumentAssignmentType) {
            ArgumentAssignmentType[ArgumentAssignmentType["None"] = 0] = "None";
            ArgumentAssignmentType[ArgumentAssignmentType["Argument"] = 1] = "Argument";
            ArgumentAssignmentType[ArgumentAssignmentType["This"] = 2] = "This";
            ArgumentAssignmentType[ArgumentAssignmentType["Arguments"] = 4] = "Arguments";
            ArgumentAssignmentType[ArgumentAssignmentType["Super"] = 8] = "Super";
            ArgumentAssignmentType[ArgumentAssignmentType["Global"] = 16] = "Global";
            ArgumentAssignmentType[ArgumentAssignmentType["Parent"] = 32] = "Parent";
            ArgumentAssignmentType[ArgumentAssignmentType["Root"] = 64] = "Root";
        })(AVM1.ArgumentAssignmentType || (AVM1.ArgumentAssignmentType = {}));
        var ArgumentAssignmentType = AVM1.ArgumentAssignmentType;
        var ActionsDataParser = (function () {
            function ActionsDataParser(actionsData, swfVersion) {
                this._actionsData = actionsData;
                this.dataId = actionsData.id;
                this._stream = new ActionsDataStream(actionsData.bytes, swfVersion);
            }
            Object.defineProperty(ActionsDataParser.prototype, "position", {
                get: function () {
                    return this._stream.position;
                },
                set: function (value) {
                    this._stream.position = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ActionsDataParser.prototype, "eof", {
                get: function () {
                    return this._stream.position >= this._stream.end;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ActionsDataParser.prototype, "length", {
                get: function () {
                    return this._stream.end;
                },
                enumerable: true,
                configurable: true
            });
            ActionsDataParser.prototype.readNext = function () {
                var stream = this._stream;
                var currentPosition = stream.position;
                var actionCode = stream.readUI8();
                var length = actionCode >= 0x80 ? stream.readUI16() : 0;
                var nextPosition = stream.position + length;
                var args = null;
                switch (actionCode | 0) {
                    case 129 /* ActionGotoFrame */:
                        var frame = stream.readUI16();
                        var nextActionCode = stream.readUI8();
                        var play = false;
                        if (nextActionCode !== 0x06 && nextActionCode !== 0x07) {
                            stream.position--;
                        }
                        else {
                            nextPosition++;
                            play = nextActionCode === 0x06;
                        }
                        args = [frame, play];
                        break;
                    case 131 /* ActionGetURL */:
                        var urlString = stream.readString();
                        var targetString = stream.readString();
                        args = [urlString, targetString];
                        break;
                    case 138 /* ActionWaitForFrame */:
                        var frame = stream.readUI16();
                        var count = stream.readUI8();
                        args = [frame, count];
                        break;
                    case 139 /* ActionSetTarget */:
                        var targetName = stream.readString();
                        args = [targetName];
                        break;
                    case 140 /* ActionGoToLabel */:
                        var label = stream.readString();
                        var nextActionCode = stream.readUI8();
                        var play = false;
                        if (nextActionCode !== 0x06 && nextActionCode !== 0x07) {
                            stream.position--;
                        }
                        else {
                            nextPosition++;
                            play = nextActionCode === 0x06;
                        }
                        args = [label, play];
                        break;
                    case 150 /* ActionPush */:
                        var type, value;
                        args = [];
                        while (stream.position < nextPosition) {
                            type = stream.readUI8();
                            switch (type | 0) {
                                case 0:
                                    value = stream.readString();
                                    break;
                                case 1:
                                    value = stream.readFloat();
                                    break;
                                case 2:
                                    value = null;
                                    break;
                                case 3:
                                    value = void (0);
                                    break;
                                case 4:
                                    value = new ParsedPushRegisterAction(stream.readUI8());
                                    break;
                                case 5:
                                    value = stream.readBoolean();
                                    break;
                                case 6:
                                    value = stream.readDouble();
                                    break;
                                case 7:
                                    value = stream.readInteger();
                                    break;
                                case 8:
                                    value = new ParsedPushConstantAction(stream.readUI8());
                                    break;
                                case 9:
                                    value = new ParsedPushConstantAction(stream.readUI16());
                                    break;
                                default:
                                    console.error('Unknown value type: ' + type);
                                    stream.position = nextPosition;
                                    continue;
                            }
                            args.push(value);
                        }
                        break;
                    case 153 /* ActionJump */:
                        var offset = stream.readSI16();
                        args = [offset];
                        break;
                    case 157 /* ActionIf */:
                        var offset = stream.readSI16();
                        args = [offset];
                        break;
                    case 154 /* ActionGetURL2 */:
                        var flags = stream.readUI8();
                        args = [flags];
                        break;
                    case 159 /* ActionGotoFrame2 */:
                        var flags = stream.readUI8();
                        args = [flags];
                        if (!!(flags & 2)) {
                            args.push(stream.readUI16());
                        }
                        break;
                    case 141 /* ActionWaitForFrame2 */:
                        var count = stream.readUI8();
                        args = [count];
                        break;
                    case 136 /* ActionConstantPool */:
                        var count = stream.readUI16();
                        var constantPool = [];
                        for (var i = 0; i < count; i++) {
                            constantPool.push(stream.readString());
                        }
                        args = [constantPool];
                        break;
                    case 155 /* ActionDefineFunction */:
                        var functionName = stream.readString();
                        var count = stream.readUI16();
                        var functionParams = [];
                        for (var i = 0; i < count; i++) {
                            functionParams.push(stream.readString());
                        }
                        var codeSize = stream.readUI16();
                        nextPosition += codeSize;
                        var functionBody = new AVM1.AVM1ActionsData(stream.readBytes(codeSize), this.dataId + '_f' + stream.position, this._actionsData);
                        args = [functionBody, functionName, functionParams];
                        break;
                    case 148 /* ActionWith */:
                        var codeSize = stream.readUI16();
                        nextPosition += codeSize;
                        var withBody = new AVM1.AVM1ActionsData(stream.readBytes(codeSize), this.dataId + '_w' + stream.position, this._actionsData);
                        args = [withBody];
                        break;
                    case 135 /* ActionStoreRegister */:
                        var register = stream.readUI8();
                        args = [register];
                        break;
                    case 142 /* ActionDefineFunction2 */:
                        var functionName = stream.readString();
                        var count = stream.readUI16();
                        var registerCount = stream.readUI8();
                        var flags = stream.readUI16();
                        var registerAllocation = [];
                        var functionParams = [];
                        for (var i = 0; i < count; i++) {
                            var register = stream.readUI8();
                            var paramName = stream.readString();
                            functionParams.push(paramName);
                            if (register) {
                                registerAllocation[register] = {
                                    type: 1 /* Argument */,
                                    name: paramName,
                                    index: i
                                };
                            }
                        }
                        var j = 1;
                        if (flags & 0x0001) {
                            registerAllocation[j++] = { type: 2 /* This */ };
                        }
                        if (flags & 0x0004) {
                            registerAllocation[j++] = { type: 4 /* Arguments */ };
                        }
                        if (flags & 0x0010) {
                            registerAllocation[j++] = { type: 8 /* Super */ };
                        }
                        if (flags & 0x0040) {
                            registerAllocation[j++] = { type: 64 /* Root */ };
                        }
                        if (flags & 0x0080) {
                            registerAllocation[j++] = { type: 32 /* Parent */ };
                        }
                        if (flags & 0x0100) {
                            registerAllocation[j++] = { type: 16 /* Global */ };
                        }
                        var suppressArguments = 0;
                        if (flags & 0x0002) {
                            suppressArguments |= 2 /* This */;
                        }
                        if (flags & 0x0008) {
                            suppressArguments |= 4 /* Arguments */;
                        }
                        if (flags & 0x0020) {
                            suppressArguments |= 8 /* Super */;
                        }
                        var codeSize = stream.readUI16();
                        nextPosition += codeSize;
                        var functionBody = new AVM1.AVM1ActionsData(stream.readBytes(codeSize), this.dataId + '_f' + stream.position, this._actionsData);
                        args = [functionBody, functionName, functionParams, registerCount, registerAllocation, suppressArguments];
                        break;
                    case 143 /* ActionTry */:
                        var flags = stream.readUI8();
                        var catchIsRegisterFlag = !!(flags & 4);
                        var finallyBlockFlag = !!(flags & 2);
                        var catchBlockFlag = !!(flags & 1);
                        var trySize = stream.readUI16();
                        var catchSize = stream.readUI16();
                        var finallySize = stream.readUI16();
                        var catchTarget = catchIsRegisterFlag ? stream.readUI8() : stream.readString();
                        nextPosition += trySize + catchSize + finallySize;
                        var tryBody = new AVM1.AVM1ActionsData(stream.readBytes(trySize), this.dataId + '_t' + stream.position, this._actionsData);
                        var catchBody = new AVM1.AVM1ActionsData(stream.readBytes(catchSize), this.dataId + '_c' + stream.position, this._actionsData);
                        var finallyBody = new AVM1.AVM1ActionsData(stream.readBytes(finallySize), this.dataId + '_z' + stream.position, this._actionsData);
                        args = [catchIsRegisterFlag, catchTarget, tryBody, catchBlockFlag, catchBody, finallyBlockFlag, finallyBody];
                        break;
                    case 137 /* ActionStrictMode */:
                        var mode = stream.readUI8();
                        args = [mode];
                        break;
                }
                stream.position = nextPosition;
                return {
                    position: currentPosition,
                    actionCode: actionCode,
                    actionName: ActionNamesMap[actionCode],
                    args: args
                };
            };
            ActionsDataParser.prototype.skip = function (count) {
                var stream = this._stream;
                while (count > 0 && stream.position < stream.end) {
                    var actionCode = stream.readUI8();
                    var length = actionCode >= 0x80 ? stream.readUI16() : 0;
                    stream.position += length;
                    count--;
                }
            };
            return ActionsDataParser;
        })();
        AVM1.ActionsDataParser = ActionsDataParser;
        var ActionNamesMap = {
            0x00: 'EOA',
            0x04: 'ActionNextFrame',
            0x05: 'ActionPreviousFrame',
            0x06: 'ActionPlay',
            0x07: 'ActionStop',
            0x08: 'ActionToggleQuality',
            0x09: 'ActionStopSounds',
            0x0A: 'ActionAdd',
            0x0B: 'ActionSubtract',
            0x0C: 'ActionMultiply',
            0x0D: 'ActionDivide',
            0x0E: 'ActionEquals',
            0x0F: 'ActionLess',
            0x10: 'ActionAnd',
            0x11: 'ActionOr',
            0x12: 'ActionNot',
            0x13: 'ActionStringEquals',
            0x14: 'ActionStringLength',
            0x15: 'ActionStringExtract',
            0x17: 'ActionPop',
            0x18: 'ActionToInteger',
            0x1C: 'ActionGetVariable',
            0x1D: 'ActionSetVariable',
            0x20: 'ActionSetTarget2',
            0x21: 'ActionStringAdd',
            0x22: 'ActionGetProperty',
            0x23: 'ActionSetProperty',
            0x24: 'ActionCloneSprite',
            0x25: 'ActionRemoveSprite',
            0x26: 'ActionTrace',
            0x27: 'ActionStartDrag',
            0x28: 'ActionEndDrag',
            0x29: 'ActionStringLess',
            0x2A: 'ActionThrow',
            0x2B: 'ActionCastOp',
            0x2C: 'ActionImplementsOp',
            0x2D: 'ActionFSCommand2',
            0x30: 'ActionRandomNumber',
            0x31: 'ActionMBStringLength',
            0x32: 'ActionCharToAscii',
            0x33: 'ActionAsciiToChar',
            0x34: 'ActionGetTime',
            0x35: 'ActionMBStringExtract',
            0x36: 'ActionMBCharToAscii',
            0x37: 'ActionMBAsciiToChar',
            0x3A: 'ActionDelete',
            0x3B: 'ActionDelete2',
            0x3C: 'ActionDefineLocal',
            0x3D: 'ActionCallFunction',
            0x3E: 'ActionReturn',
            0x3F: 'ActionModulo',
            0x40: 'ActionNewObject',
            0x41: 'ActionDefineLocal2',
            0x42: 'ActionInitArray',
            0x43: 'ActionInitObject',
            0x44: 'ActionTypeOf',
            0x45: 'ActionTargetPath',
            0x46: 'ActionEnumerate',
            0x47: 'ActionAdd2',
            0x48: 'ActionLess2',
            0x49: 'ActionEquals2',
            0x4A: 'ActionToNumber',
            0x4B: 'ActionToString',
            0x4C: 'ActionPushDuplicate',
            0x4D: 'ActionStackSwap',
            0x4E: 'ActionGetMember',
            0x4F: 'ActionSetMember',
            0x50: 'ActionIncrement',
            0x51: 'ActionDecrement',
            0x52: 'ActionCallMethod',
            0x53: 'ActionNewMethod',
            0x54: 'ActionInstanceOf',
            0x55: 'ActionEnumerate2',
            0x60: 'ActionBitAnd',
            0x61: 'ActionBitOr',
            0x62: 'ActionBitXor',
            0x63: 'ActionBitLShift',
            0x64: 'ActionBitRShift',
            0x65: 'ActionBitURShift',
            0x66: 'ActionStrictEquals',
            0x67: 'ActionGreater',
            0x68: 'ActionStringGreater',
            0x69: 'ActionExtends',
            0x81: 'ActionGotoFrame',
            0x83: 'ActionGetURL',
            0x87: 'ActionStoreRegister',
            0x88: 'ActionConstantPool',
            0x89: 'ActionStrictMode',
            0x8A: 'ActionWaitForFrame',
            0x8B: 'ActionSetTarget',
            0x8C: 'ActionGoToLabel',
            0x8D: 'ActionWaitForFrame2',
            0x8E: 'ActionDefineFunction2',
            0x8F: 'ActionTry',
            0x94: 'ActionWith',
            0x96: 'ActionPush',
            0x99: 'ActionJump',
            0x9A: 'ActionGetURL2',
            0x9B: 'ActionDefineFunction',
            0x9D: 'ActionIf',
            0x9E: 'ActionCall',
            0x9F: 'ActionGotoFrame2'
        };
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var ActionsDataAnalyzer = (function () {
            function ActionsDataAnalyzer() {
                this.parentResults = null;
                this.registersLimit = 0;
            }
            ActionsDataAnalyzer.prototype.analyze = function (parser) {
                var actions = [];
                var labels = [0];
                var processedLabels = [true];
                var constantPoolFound = false;
                var singleConstantPoolAt0 = null;
                var queue = [0];
                while (queue.length > 0) {
                    var position = queue.shift();
                    if (actions[position]) {
                        continue;
                    }
                    parser.position = position;
                    while (!parser.eof && !actions[position]) {
                        var action = parser.readNext();
                        if (action.actionCode === 0) {
                            break;
                        }
                        var nextPosition = parser.position;
                        var item = {
                            action: action,
                            next: nextPosition,
                            conditionalJumpTo: -1
                        };
                        var jumpPosition = 0;
                        var branching = false;
                        var nonConditionalBranching = false;
                        switch (action.actionCode) {
                            case 138 /* ActionWaitForFrame */:
                            case 141 /* ActionWaitForFrame2 */:
                                branching = true;
                                var skipCount = action.actionCode === 138 /* ActionWaitForFrame */ ? action.args[1] : action.args[0];
                                parser.skip(skipCount);
                                jumpPosition = parser.position;
                                parser.position = nextPosition;
                                break;
                            case 153 /* ActionJump */:
                                nonConditionalBranching = true;
                                branching = true;
                                jumpPosition = nextPosition + action.args[0];
                                break;
                            case 157 /* ActionIf */:
                                branching = true;
                                jumpPosition = nextPosition + action.args[0];
                                break;
                            case 42 /* ActionThrow */:
                            case 62 /* ActionReturn */:
                            case 0 /* None */:
                                nonConditionalBranching = true;
                                branching = true;
                                jumpPosition = parser.length;
                                break;
                            case 136 /* ActionConstantPool */:
                                if (constantPoolFound) {
                                    singleConstantPoolAt0 = null;
                                    break;
                                }
                                constantPoolFound = true;
                                if (position === 0) {
                                    singleConstantPoolAt0 = action.args[0];
                                }
                                break;
                        }
                        if (branching) {
                            if (jumpPosition < 0 || jumpPosition > parser.length) {
                                console.error('jump outside the action block;');
                                jumpPosition = parser.length;
                            }
                            if (nonConditionalBranching) {
                                item.next = jumpPosition;
                            }
                            else {
                                item.conditionalJumpTo = jumpPosition;
                            }
                            if (!processedLabels[jumpPosition]) {
                                labels.push(jumpPosition);
                                queue.push(jumpPosition);
                                processedLabels[jumpPosition] = true;
                            }
                        }
                        actions[position] = item;
                        if (nonConditionalBranching) {
                            break;
                        }
                        position = nextPosition;
                    }
                }
                var blocks = [];
                labels.forEach(function (position) {
                    if (!actions[position]) {
                        return;
                    }
                    var items = [];
                    var lastPosition = position;
                    do {
                        var item = actions[lastPosition];
                        items.push(item);
                        lastPosition = item.next;
                    } while (!processedLabels[lastPosition] && actions[lastPosition]);
                    blocks.push({
                        label: position,
                        items: items,
                        jump: lastPosition
                    });
                });
                var singleConstantPool = null;
                if (constantPoolFound) {
                    singleConstantPool = singleConstantPoolAt0;
                }
                else if (this.parentResults) {
                    singleConstantPool = this.parentResults.singleConstantPool;
                }
                return {
                    actions: actions,
                    blocks: blocks,
                    dataId: parser.dataId,
                    singleConstantPool: singleConstantPool,
                    registersLimit: this.registersLimit
                };
            };
            return ActionsDataAnalyzer;
        })();
        AVM1.ActionsDataAnalyzer = ActionsDataAnalyzer;
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var assert = Shumway.Debug.assert;
        var AVM1ActionsData = (function () {
            function AVM1ActionsData(bytes, id, parent) {
                if (parent === void 0) { parent = null; }
                this.bytes = bytes;
                this.id = id;
                this.parent = parent;
                release || assert(bytes instanceof Uint8Array);
            }
            return AVM1ActionsData;
        })();
        AVM1.AVM1ActionsData = AVM1ActionsData;
        var AVM1Context = (function () {
            function AVM1Context() {
                this.root = null;
                this.globals = null;
            }
            AVM1Context.prototype.flushPendingScripts = function () {
            };
            AVM1Context.prototype.addAsset = function (className, symbolId, symbolProps) {
            };
            AVM1Context.prototype.registerClass = function (className, theClass) {
            };
            AVM1Context.prototype.getAsset = function (className) {
                return undefined;
            };
            AVM1Context.prototype.resolveTarget = function (target) {
            };
            AVM1Context.prototype.resolveLevel = function (level) {
            };
            AVM1Context.prototype.addToPendingScripts = function (fn) {
            };
            AVM1Context.prototype.registerEventPropertyObserver = function (propertyName, observer) {
            };
            AVM1Context.prototype.unregisterEventPropertyObserver = function (propertyName, observer) {
            };
            AVM1Context.prototype.enterContext = function (fn, defaultTarget) {
            };
            AVM1Context.prototype.executeActions = function (actionsData, scopeObj) {
            };
            AVM1Context.instance = null;
            return AVM1Context;
        })();
        AVM1.AVM1Context = AVM1Context;
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var forEachPublicProperty = Shumway.AVM2.Runtime.forEachPublicProperty;
        var construct = Shumway.AVM2.Runtime.construct;
        var isNumeric = Shumway.isNumeric;
        var isFunction = Shumway.isFunction;
        var notImplemented = Shumway.Debug.notImplemented;
        var asCoerceString = Shumway.AVM2.Runtime.asCoerceString;
        var sliceArguments = Shumway.AVM2.Runtime.sliceArguments;
        var Option = Shumway.Options.Option;
        var OptionSet = Shumway.Options.OptionSet;
        var Telemetry = Shumway.Telemetry;
        var assert = Shumway.Debug.assert;
        var shumwayOptions = Shumway.Settings.shumwayOptions;
        var avm1Options = shumwayOptions.register(new OptionSet("AVM1"));
        AVM1.avm1TraceEnabled = avm1Options.register(new Option("t1", "traceAvm1", "boolean", false, "trace AVM1 execution"));
        AVM1.avm1ErrorsEnabled = avm1Options.register(new Option("e1", "errorsAvm1", "boolean", false, "fail on AVM1 warnings and errors"));
        AVM1.avm1TimeoutDisabled = avm1Options.register(new Option("ha1", "nohangAvm1", "boolean", false, "disable fail on AVM1 hang"));
        AVM1.avm1CompilerEnabled = avm1Options.register(new Option("ca1", "compileAvm1", "boolean", true, "compiles AVM1 code"));
        AVM1.avm1DebuggerEnabled = avm1Options.register(new Option("da1", "debugAvm1", "boolean", false, "allows AVM1 code debugging"));
        AVM1.Debugger = {
            pause: false,
            breakpoints: {}
        };
        function avm1Warn(message, arg1, arg2, arg3, arg4) {
            if (AVM1.avm1ErrorsEnabled.value) {
                try {
                    throw new Error(message);
                }
                catch (e) {
                }
            }
            console.warn.apply(console, arguments);
        }
        var MAX_AVM1_HANG_TIMEOUT = 1000;
        var CHECK_AVM1_HANG_EVERY = 1000;
        var MAX_AVM1_ERRORS_LIMIT = 1000;
        var MAX_AVM1_STACK_LIMIT = 256;
        var as2IdentifiersDictionary = [
            "addCallback",
            "addListener",
            "addProperty",
            "addRequestHeader",
            "AsBroadcaster",
            "attachAudio",
            "attachMovie",
            "attachSound",
            "attachVideo",
            "beginFill",
            "beginGradientFill",
            "blendMode",
            "blockIndent",
            "broadcastMessage",
            "cacheAsBitmap",
            "CASEINSENSITIVE",
            "charAt",
            "charCodeAt",
            "checkPolicyFile",
            "clearInterval",
            "clearRequestHeaders",
            "concat",
            "createEmptyMovieClip",
            "curveTo",
            "DESCENDING",
            "displayState",
            "duplicateMovieClip",
            "E",
            "endFill",
            "exactSettings",
            "fromCharCode",
            "fullScreenSourceRect",
            "getBounds",
            "getBytesLoaded",
            "getBytesTotal",
            "getDate",
            "getDay",
            "getDepth",
            "getDepth",
            "getDuration",
            "getFullYear",
            "getHours",
            "getLocal",
            "getMilliseconds",
            "getMinutes",
            "getMonth",
            "getNewTextFormat",
            "getPan",
            "getPosition",
            "getRGB",
            "getSeconds",
            "getSize",
            "getTextFormat",
            "getTime",
            "getTimezoneOffset",
            "getTransform",
            "getUTCDate",
            "getUTCDay",
            "getUTCFullYear",
            "getUTCHours",
            "getUTCMilliseconds",
            "getUTCMinutes",
            "getUTCMonth",
            "getUTCSeconds",
            "getUTCYear",
            "getVolume",
            "getYear",
            "globalToLocal",
            "gotoAndPlay",
            "gotoAndStop",
            "hasAccessibility",
            "hasAudio",
            "hasAudioEncoder",
            "hasEmbeddedVideo",
            "hasIME",
            "hasMP3",
            "hasOwnProperty",
            "hasPrinting",
            "hasScreenBroadcast",
            "hasScreenPlayback",
            "hasStreamingAudio",
            "hasStreamingVideo",
            "hasVideoEncoder",
            "hitTest",
            "indexOf",
            "isActive",
            "isDebugger",
            "isFinite",
            "isNaN",
            "isPropertyEnumerable",
            "isPrototypeOf",
            "lastIndexOf",
            "leftMargin",
            "letterSpacing",
            "lineStyle",
            "lineTo",
            "LN10",
            "LN10E",
            "LN2",
            "LN2E",
            "loadSound",
            "localFileReadDisable",
            "localToGlobal",
            "MAX_VALUE",
            "MIN_VALUE",
            "moveTo",
            "NaN",
            "NEGATIVE_INFINITY",
            "nextFrame",
            "NUMERIC",
            "onChanged",
            "onData",
            "onDragOut",
            "onDragOver",
            "onEnterFrame",
            "onFullScreen",
            "onKeyDown",
            "onKeyUp",
            "onKillFocus",
            "onLoad",
            "onMouseDown",
            "onMouseMove",
            "onMouseUp",
            "onPress",
            "onRelease",
            "onReleaseOutside",
            "onResize",
            "onResize",
            "onRollOut",
            "onRollOver",
            "onScroller",
            "onSetFocus",
            "onStatus",
            "onSync",
            "onUnload",
            "parseFloat",
            "parseInt",
            "PI",
            "pixelAspectRatio",
            "playerType",
            "POSITIVE_INFINITY",
            "prevFrame",
            "registerClass",
            "removeListener",
            "removeMovieClip",
            "removeTextField",
            "replaceSel",
            "RETURNINDEXEDARRAY",
            "rightMargin",
            "scale9Grid",
            "scaleMode",
            "screenColor",
            "screenDPI",
            "screenResolutionX",
            "screenResolutionY",
            "serverString",
            "setClipboard",
            "setDate",
            "setDuration",
            "setFps",
            "setFullYear",
            "setHours",
            "setInterval",
            "setMask",
            "setMilliseconds",
            "setMinutes",
            "setMonth",
            "setNewTextFormat",
            "setPan",
            "setPosition",
            "setRGB",
            "setSeconds",
            "setTextFormat",
            "setTime",
            "setTimeout",
            "setTransform",
            "setTransform",
            "setUTCDate",
            "setUTCFullYear",
            "setUTCHours",
            "setUTCMilliseconds",
            "setUTCMinutes",
            "setUTCMonth",
            "setUTCSeconds",
            "setVolume",
            "setYear",
            "showMenu",
            "showRedrawRegions",
            "sortOn",
            "SQRT1_2",
            "SQRT2",
            "startDrag",
            "stopDrag",
            "swapDepths",
            "tabEnabled",
            "tabIndex",
            "tabIndex",
            "tabStops",
            "toLowerCase",
            "toString",
            "toUpperCase",
            "trackAsMenu",
            "UNIQUESORT",
            "updateAfterEvent",
            "updateProperties",
            "useCodepage",
            "useHandCursor",
            "UTC",
            "valueOf"
        ];
        var as2IdentifiersCaseMap = null;
        var AVM1ScopeListItem = (function () {
            function AVM1ScopeListItem(scope, next) {
                this.scope = scope;
                this.next = next;
            }
            AVM1ScopeListItem.prototype.create = function (scope) {
                return new AVM1ScopeListItem(scope, this);
            };
            return AVM1ScopeListItem;
        })();
        var AVM1FunctionClosure = (function (_super) {
            __extends(AVM1FunctionClosure, _super);
            function AVM1FunctionClosure() {
                _super.call(this);
                this.asSetPublicProperty('toString', this.toString);
            }
            AVM1FunctionClosure.prototype.toString = function () {
                return this;
            };
            return AVM1FunctionClosure;
        })(Shumway.AVM2.AS.ASObject);
        var AVM1CallFrame = (function () {
            function AVM1CallFrame(previousFrame, currentThis, fn, args) {
                this.previousFrame = previousFrame;
                this.currentThis = currentThis;
                this.fn = fn;
                this.args = args;
                this.inSequence = !previousFrame ? false : (previousFrame.calleeThis === currentThis && previousFrame.calleeFn === fn);
                this.resetCallee();
            }
            AVM1CallFrame.prototype.setCallee = function (thisArg, superArg, fn, args) {
                this.calleeThis = thisArg;
                this.calleeSuper = superArg;
                this.calleeFn = fn;
                this.calleeArgs = args;
            };
            AVM1CallFrame.prototype.resetCallee = function () {
                this.calleeThis = null;
                this.calleeSuper = null;
                this.calleeFn = null;
            };
            return AVM1CallFrame;
        })();
        var AVM1ContextImpl = (function (_super) {
            __extends(AVM1ContextImpl, _super);
            function AVM1ContextImpl(loaderInfo) {
                _super.call(this);
                this.loaderInfo = loaderInfo;
                var GlobalsClass = AVM1.Lib.AVM1Globals.createAVM1Class();
                this.globals = new GlobalsClass(this);
                this.initialScope = new AVM1ScopeListItem(this.globals, null);
                this.assets = {};
                this.assetsSymbols = [];
                this.assetsClasses = [];
                this.isActive = false;
                this.executionProhibited = false;
                this.abortExecutionAt = 0;
                this.stackDepth = 0;
                this.frame = null;
                this.isTryCatchListening = false;
                this.errorsIgnored = 0;
                this.deferScriptExecution = true;
                this.pendingScripts = [];
                this.eventObservers = Object.create(null);
                var context = this;
                this.utils = {
                    hasProperty: function (obj, name) {
                        var result;
                        context.enterContext(function () {
                            result = as2HasProperty(obj, name);
                        }, obj);
                        return result;
                    },
                    getProperty: function (obj, name) {
                        var result;
                        context.enterContext(function () {
                            result = as2GetProperty(obj, name);
                        }, obj);
                        return result;
                    },
                    setProperty: function (obj, name, value) {
                        context.enterContext(function () {
                            as2SetProperty(obj, name, value);
                        }, obj);
                    }
                };
            }
            AVM1ContextImpl.prototype.addAsset = function (className, symbolId, symbolProps) {
                release || Shumway.Debug.assert(typeof className === 'string' && !isNaN(symbolId));
                this.assets[className.toLowerCase()] = symbolId;
                this.assetsSymbols[symbolId] = symbolProps;
            };
            AVM1ContextImpl.prototype.registerClass = function (className, theClass) {
                className = asCoerceString(className);
                if (className === null) {
                    avm1Warn('Cannot register class for symbol: className is missing');
                    return null;
                }
                var symbolId = this.assets[className.toLowerCase()];
                if (symbolId === undefined) {
                    avm1Warn('Cannot register ' + className + ' class for symbol');
                    return;
                }
                this.assetsClasses[symbolId] = theClass;
            };
            AVM1ContextImpl.prototype.getAsset = function (className) {
                className = asCoerceString(className);
                if (className === null) {
                    return undefined;
                }
                var symbolId = this.assets[className.toLowerCase()];
                if (symbolId === undefined) {
                    return undefined;
                }
                var symbol = this.assetsSymbols[symbolId];
                if (!symbol) {
                    symbol = this.loaderInfo.getSymbolById(symbolId);
                    if (!symbol) {
                        Shumway.Debug.warning("Symbol " + symbolId + " is not defined.");
                        return undefined;
                    }
                    this.assetsSymbols[symbolId] = symbol;
                }
                return {
                    symbolId: symbolId,
                    symbolProps: symbol,
                    theClass: this.assetsClasses[symbolId]
                };
            };
            AVM1ContextImpl.prototype.resolveTarget = function (target) {
                var currentTarget = this.currentTarget || this.defaultTarget;
                if (!target) {
                    target = currentTarget;
                }
                else if (typeof target === 'string') {
                    target = lookupAVM1Children(target, currentTarget, this.resolveLevel(0));
                }
                if (typeof target !== 'object' || target === null || !('_as3Object' in target)) {
                    throw new Error('Invalid AVM1 target object: ' + Object.prototype.toString.call(target));
                }
                return target;
            };
            AVM1ContextImpl.prototype.resolveLevel = function (level) {
                if (level === 0) {
                    return this.root;
                }
                return undefined;
            };
            AVM1ContextImpl.prototype.addToPendingScripts = function (fn) {
                if (!this.deferScriptExecution) {
                    fn();
                    return;
                }
                this.pendingScripts.push(fn);
            };
            AVM1ContextImpl.prototype.flushPendingScripts = function () {
                var scripts = this.pendingScripts;
                while (scripts.length) {
                    scripts.shift()();
                }
                this.deferScriptExecution = false;
            };
            AVM1ContextImpl.prototype.pushCallFrame = function (thisArg, fn, args) {
                var nextFrame = new AVM1CallFrame(this.frame, thisArg, fn, args);
                this.frame = nextFrame;
                return nextFrame;
            };
            AVM1ContextImpl.prototype.popCallFrame = function () {
                var previousFrame = this.frame.previousFrame;
                this.frame = previousFrame;
                return previousFrame;
            };
            AVM1ContextImpl.prototype.enterContext = function (fn, defaultTarget) {
                if (this === AVM1.AVM1Context.instance && this.isActive && this.defaultTarget === defaultTarget && this.currentTarget === null) {
                    fn();
                    this.currentTarget = null;
                    return;
                }
                var savedContext = AVM1.AVM1Context.instance;
                var savedIsActive = this.isActive;
                var savedDefaultTarget = this.defaultTarget;
                var savedCurrentTarget = this.currentTarget;
                var caughtError;
                try {
                    AVM1.AVM1Context.instance = this;
                    if (!savedIsActive) {
                        this.abortExecutionAt = AVM1.avm1TimeoutDisabled.value ? Number.MAX_VALUE : Date.now() + MAX_AVM1_HANG_TIMEOUT;
                        this.errorsIgnored = 0;
                        this.isActive = true;
                    }
                    this.defaultTarget = defaultTarget;
                    this.currentTarget = null;
                    fn();
                }
                catch (e) {
                    caughtError = e;
                }
                this.defaultTarget = savedDefaultTarget;
                this.currentTarget = savedCurrentTarget;
                this.isActive = savedIsActive;
                AVM1.AVM1Context.instance = savedContext;
                if (caughtError) {
                    throw caughtError;
                }
            };
            AVM1ContextImpl.prototype.executeActions = function (actionsData, scopeObj) {
                executeActions(actionsData, this, scopeObj);
            };
            AVM1ContextImpl.prototype.registerEventPropertyObserver = function (propertyName, observer) {
                var observers = this.eventObservers[propertyName];
                if (!observers) {
                    observers = [];
                    this.eventObservers[propertyName] = observers;
                }
                observers.push(observer);
            };
            AVM1ContextImpl.prototype.unregisterEventPropertyObserver = function (propertyName, observer) {
                var observers = this.eventObservers[propertyName];
                if (!observers) {
                    return;
                }
                var j = observers.indexOf(observer);
                if (j < 0) {
                    return;
                }
                observers.splice(j, 1);
            };
            AVM1ContextImpl.prototype.broadcastEventPropertyChange = function (propertyName) {
                var observers = this.eventObservers[propertyName];
                if (!observers) {
                    return;
                }
                observers.forEach(function (observer) { return observer.onEventPropertyModified(propertyName); });
            };
            return AVM1ContextImpl;
        })(AVM1.AVM1Context);
        AVM1.AVM1Context.create = function (loaderInfo) {
            return new AVM1ContextImpl(loaderInfo);
        };
        var AVM1Error = (function () {
            function AVM1Error(error) {
                this.error = error;
            }
            return AVM1Error;
        })();
        var AVM1CriticalError = (function (_super) {
            __extends(AVM1CriticalError, _super);
            function AVM1CriticalError(message, error) {
                _super.call(this, message);
                this.error = error;
            }
            return AVM1CriticalError;
        })(Error);
        function isAVM1MovieClip(obj) {
            return typeof obj === 'object' && obj && obj instanceof AVM1.Lib.AVM1MovieClip;
        }
        function as2GetType(v) {
            if (v === null) {
                return 'null';
            }
            var type = typeof v;
            if (type === 'function') {
                return 'object';
            }
            if (type === 'object' && isAVM1MovieClip(v)) {
                return 'movieclip';
            }
            return type;
        }
        function as2ToPrimitive(value) {
            return as2GetType(value) !== 'object' ? value : value.valueOf();
        }
        function as2GetCurrentSwfVersion() {
            return AVM1.AVM1Context.instance.loaderInfo.swfVersion;
        }
        function as2ToAddPrimitive(value) {
            if (as2GetType(value) !== 'object') {
                return value;
            }
            if (value instanceof Date && as2GetCurrentSwfVersion() >= 6) {
                return value.toString();
            }
            else {
                return value.valueOf();
            }
        }
        function as2ToBoolean(value) {
            switch (as2GetType(value)) {
                default:
                case 'undefined':
                case 'null':
                    return false;
                case 'boolean':
                    return value;
                case 'number':
                    return value !== 0 && !isNaN(value);
                case 'string':
                    return value.length !== 0;
                case 'movieclip':
                case 'object':
                    return true;
            }
        }
        function as2ToNumber(value) {
            value = as2ToPrimitive(value);
            switch (as2GetType(value)) {
                case 'undefined':
                case 'null':
                    return as2GetCurrentSwfVersion() >= 7 ? NaN : 0;
                case 'boolean':
                    return value ? 1 : +0;
                case 'number':
                    return value;
                case 'string':
                    if (value === '' && as2GetCurrentSwfVersion() < 5) {
                        return 0;
                    }
                    return +value;
                default:
                    return as2GetCurrentSwfVersion() >= 5 ? NaN : 0;
            }
        }
        function as2ToInteger(value) {
            var result = as2ToNumber(value);
            if (isNaN(result)) {
                return 0;
            }
            if (!isFinite(result) || result === 0) {
                return result;
            }
            return (result < 0 ? -1 : 1) * Math.abs(result) | 0;
        }
        function as2ToInt32(value) {
            var result = as2ToNumber(value);
            return (isNaN(result) || !isFinite(result) || result === 0) ? 0 : (result | 0);
        }
        function as2ToString(value) {
            switch (as2GetType(value)) {
                case 'undefined':
                    return as2GetCurrentSwfVersion() >= 7 ? 'undefined' : '';
                case 'null':
                    return 'null';
                case 'boolean':
                    return value ? 'true' : 'false';
                case 'number':
                    return value.toString();
                case 'string':
                    return value;
                case 'movieclip':
                    return value.__targetPath;
                case 'object':
                    if (typeof value === 'function' && value.asGetPublicProperty('toString') === Shumway.AVM2.AS.ASFunction.traitsPrototype.asGetPublicProperty('toString')) {
                        return '[type Function]';
                    }
                    var result = value.asCallPublicProperty('toString', null);
                    if (typeof result === 'string') {
                        return result;
                    }
                    return typeof value === 'function' ? '[type Function]' : '[type Object]';
            }
        }
        function as2Compare(x, y) {
            var x2 = as2ToPrimitive(x);
            var y2 = as2ToPrimitive(y);
            if (typeof x2 === 'string' && typeof y2 === 'string') {
            }
            else {
                var xn = as2ToNumber(x2), yn = as2ToNumber(y2);
                return isNaN(xn) || isNaN(yn) ? undefined : xn < yn;
            }
        }
        function as2InstanceOf(obj, constructor) {
            if (Shumway.isNullOrUndefined(obj) || Shumway.isNullOrUndefined(constructor)) {
                return false;
            }
            if (constructor === Shumway.AVM2.AS.ASString) {
                return typeof obj === 'string';
            }
            else if (constructor === Shumway.AVM2.AS.ASNumber) {
                return typeof obj === 'number';
            }
            else if (constructor === Shumway.AVM2.AS.ASBoolean) {
                return typeof obj === 'boolean';
            }
            else if (constructor === Shumway.AVM2.AS.ASArray) {
                return Array.isArray(obj);
            }
            else if (constructor === Shumway.AVM2.AS.ASFunction) {
                return typeof obj === 'function';
            }
            else if (constructor === Shumway.AVM2.AS.ASObject) {
                return typeof obj === 'object';
            }
            var baseProto = constructor.asGetPublicProperty('prototype');
            if (!baseProto) {
                return false;
            }
            var proto = obj;
            while (proto) {
                if (proto === baseProto) {
                    return true;
                }
                proto = proto.asGetPublicProperty('__proto__');
            }
            return false;
        }
        var __resolvePropertyResult = {
            link: undefined,
            name: null
        };
        function avm1EnumerateProperties(obj, fn, thisArg) {
            var processed = Object.create(null);
            do {
                forEachPublicProperty(obj, function (name) {
                    if (processed[name]) {
                        return;
                    }
                    fn.call(thisArg, obj, name);
                    processed[name] = true;
                });
                obj = obj.asGetPublicProperty('__proto__');
            } while (obj);
        }
        function avm1CheckLinkProperty(obj, name) {
            do {
                if (obj.asHasProperty(undefined, name, 0)) {
                    __resolvePropertyResult.link = obj;
                    __resolvePropertyResult.name = name;
                    return __resolvePropertyResult;
                }
                obj = obj.asGetPublicProperty('__proto__');
            } while (obj);
            return null;
        }
        function avm1ResolveProperty(obj, name, normalize) {
            if (Shumway.isNullOrUndefined(obj)) {
                avm1Warn("AVM1 warning: cannot look up member '" + name + "' on undefined object");
                return null;
            }
            var result;
            obj = Object(obj);
            if ((result = avm1CheckLinkProperty(obj, name)) !== null) {
                return result;
            }
            if (isNumeric(name) || as2GetCurrentSwfVersion() > 6) {
                if (normalize) {
                    __resolvePropertyResult.link = obj;
                    __resolvePropertyResult.name = name;
                    return __resolvePropertyResult;
                }
                return null;
            }
            var lowerCaseName = name.toLowerCase();
            if ((result = avm1CheckLinkProperty(obj, lowerCaseName)) !== null) {
                return result;
            }
            if (as2IdentifiersCaseMap === null) {
                as2IdentifiersCaseMap = Object.create(null);
                as2IdentifiersDictionary.forEach(function (key) {
                    as2IdentifiersCaseMap[key.toLowerCase()] = key;
                });
            }
            var normalizedName = as2IdentifiersCaseMap[lowerCaseName] || null;
            if (normalizedName && (result = avm1CheckLinkProperty(obj, normalizedName)) !== null) {
                return result;
            }
            var foundName = null, foundLink = null;
            avm1EnumerateProperties(obj, function (link, name) {
                if (foundName === null && name.toLowerCase() === lowerCaseName) {
                    foundLink = link;
                    foundName = name;
                }
            }, null);
            if (foundName) {
                __resolvePropertyResult.link = foundLink;
                __resolvePropertyResult.name = foundName;
                return __resolvePropertyResult;
            }
            if (normalize) {
                __resolvePropertyResult.link = obj;
                __resolvePropertyResult.name = normalizedName || name;
                return __resolvePropertyResult;
            }
            return null;
        }
        function as2ResolveProperty(obj, name, normalize) {
            var resolved = avm1ResolveProperty(obj, name, normalize);
            return resolved ? resolved.name : null;
        }
        function as2HasProperty(obj, name) {
            return !!avm1ResolveProperty(obj, name, false);
        }
        function as2GetProperty(obj, name) {
            var resolved = avm1ResolveProperty(obj, name, false);
            return resolved ? resolved.link.asGetPublicProperty(resolved.name) : undefined;
        }
        function as2SetProperty(obj, name, value) {
            var resolved = avm1ResolveProperty(obj, name, true);
            if (!resolved) {
                return;
            }
            var definition = resolved.link.asGetPropertyDescriptor(undefined, resolved.name, 0);
            if (definition && !('value' in definition)) {
                resolved.link.asSetPublicProperty(resolved.name, value);
            }
            else {
                obj.asSetPublicProperty(resolved.name, value);
            }
            as2SyncEvents(resolved.name);
        }
        function as2SyncEvents(name) {
            if (name[0] !== 'o' || name[1] !== 'n') {
                return;
            }
            AVM1.AVM1Context.instance.broadcastEventPropertyChange(name);
        }
        function as2CastError(ex) {
            if (typeof InternalError !== 'undefined' && ex instanceof InternalError && ex.message === 'too much recursion') {
                return new AVM1CriticalError('long running script -- AVM1 recursion limit is reached');
            }
            return ex;
        }
        function as2SetupInternalProperties(obj, proto, ctor) {
            obj.asSetPublicProperty('__proto__', proto);
            obj.asDefinePublicProperty('__constructor__', {
                value: ctor,
                writable: true,
                enumerable: false,
                configurable: false
            });
        }
        function as2Construct(ctor, args) {
            var result;
            if (isAvm2Class(ctor)) {
                result = construct(ctor, args);
                as2SetupInternalProperties(result, ctor.asGetPublicProperty('prototype'), ctor);
            }
            else if (isFunction(ctor)) {
                var proto = ctor.asGetPublicProperty('prototype');
                while (proto && !proto.initAVM1ObjectInstance) {
                    proto = proto.asGetPublicProperty('__proto__');
                }
                result = proto ? Object.create(proto) : {};
                as2SetupInternalProperties(result, ctor.asGetPublicProperty('prototype'), ctor);
                if (proto) {
                    proto.initAVM1ObjectInstance.call(result, AVM1.AVM1Context.instance);
                }
                ctor.apply(result, args);
            }
            else {
                return undefined;
            }
            return result;
        }
        function as2Enumerate(obj, fn, thisArg) {
            avm1EnumerateProperties(obj, function (link, name) { return fn.call(thisArg, name); });
        }
        function as2ResolveSuperProperty(frame, propertyName) {
            if (as2GetCurrentSwfVersion() < 6) {
                return null;
            }
            var resolved;
            var proto = (frame.inSequence && frame.previousFrame.calleeSuper);
            if (!proto) {
                resolved = avm1ResolveProperty(frame.currentThis, propertyName, false);
                if (!resolved) {
                    return null;
                }
                proto = resolved.link;
            }
            proto = proto.asGetPublicProperty('__proto__');
            if (!proto) {
                return null;
            }
            resolved = avm1ResolveProperty(proto, propertyName, false);
            if (!resolved) {
                return null;
            }
            return {
                target: resolved.link,
                name: resolved.name,
                obj: resolved.link.asGetPublicProperty(resolved.name)
            };
        }
        function isAvm2Class(obj) {
            return obj instanceof Shumway.AVM2.AS.ASClass;
        }
        function executeActions(actionsData, as2Context, scope) {
            var context = as2Context;
            if (context.executionProhibited) {
                return;
            }
            var actionTracer = ActionTracerFactory.get();
            var registers = [];
            registers.length = 4;
            var scopeContainer = context.initialScope.create(scope);
            var caughtError;
            context.pushCallFrame(scope, null, null);
            actionTracer.message('ActionScript Execution Starts');
            actionTracer.indent();
            context.enterContext(function () {
                try {
                    interpretActions(actionsData, scopeContainer, [], registers);
                }
                catch (e) {
                    caughtError = as2CastError(e);
                }
            }, scope);
            if (caughtError instanceof AVM1CriticalError) {
                context.executionProhibited = true;
                console.error('Disabling AVM1 execution');
            }
            context.popCallFrame();
            actionTracer.unindent();
            actionTracer.message('ActionScript Execution Stops');
            if (caughtError) {
                throw caughtError;
            }
        }
        AVM1.executeActions = executeActions;
        function lookupAVM1Children(targetPath, defaultTarget, root) {
            var path = targetPath.split(/[\/.]/g);
            if (path[path.length - 1] === '') {
                path.pop();
            }
            var obj = defaultTarget;
            if (path[0] === '' || path[0] === '_level0' || path[0] === '_root') {
                obj = root;
                path.shift();
            }
            while (path.length > 0) {
                var prevObj = obj;
                obj = obj.__lookupChild(path[0]);
                if (!obj) {
                    avm1Warn(path[0] + ' (expr ' + targetPath + ') is not found in ' + prevObj._target);
                    return {};
                }
                path.shift();
            }
            return obj;
        }
        var AVM1Object = (function (_super) {
            __extends(AVM1Object, _super);
            function AVM1Object() {
                _super.apply(this, arguments);
            }
            return AVM1Object;
        })(Shumway.AVM2.AS.ASObject);
        function createBuiltinType(obj, args) {
            if (obj === Array) {
                var result = args;
                if (args.length == 1 && typeof args[0] === 'number') {
                    result = [];
                    result.length = args[0];
                }
                return result;
            }
            if (obj === Boolean || obj === Number || obj === String || obj === Function) {
                return obj.apply(null, args);
            }
            if (obj === Date) {
                switch (args.length) {
                    case 0:
                        return new Date();
                    case 1:
                        return new Date(args[0]);
                    default:
                        return new Date(args[0], args[1], args.length > 2 ? args[2] : 1, args.length > 3 ? args[3] : 0, args.length > 4 ? args[4] : 0, args.length > 5 ? args[5] : 0, args.length > 6 ? args[6] : 0);
                }
            }
            if (obj === Object) {
                return new AVM1Object();
            }
            return undefined;
        }
        var AVM1SuperWrapper = (function () {
            function AVM1SuperWrapper(callFrame) {
                this.callFrame = callFrame;
            }
            return AVM1SuperWrapper;
        })();
        function fixArgsCount(numArgs, maxAmount) {
            if (isNaN(numArgs) || numArgs < 0) {
                avm1Warn('Invalid amount of arguments: ' + numArgs);
                return 0;
            }
            numArgs |= 0;
            if (numArgs > maxAmount) {
                avm1Warn('Truncating amount of arguments: from ' + numArgs + ' to ' + maxAmount);
                return maxAmount;
            }
            return numArgs;
        }
        function avm1ReadFunctionArgs(stack) {
            var numArgs = +stack.pop();
            numArgs = fixArgsCount(numArgs, stack.length);
            var args = [];
            for (var i = 0; i < numArgs; i++) {
                args.push(stack.pop());
            }
            return args;
        }
        function avm1SetTarget(ectx, targetPath) {
            var currentContext = ectx.context;
            var _global = ectx.global;
            if (!targetPath) {
                currentContext.currentTarget = null;
                return;
            }
            try {
                var currentTarget = lookupAVM1Children(targetPath, currentContext.currentTarget || currentContext.defaultTarget, currentContext.resolveLevel(0));
                currentContext.currentTarget = currentTarget;
            }
            catch (e) {
                currentContext.currentTarget = null;
                throw e;
            }
        }
        function isGlobalObject(obj) {
            return obj === this;
        }
        function avm1DefineFunction(ectx, actionsData, functionName, parametersNames, registersCount, registersAllocation, suppressArguments) {
            var currentContext = ectx.context;
            var _global = ectx.global;
            var scopeContainer = ectx.scopeContainer;
            var scope = ectx.scope;
            var actionTracer = ectx.actionTracer;
            var defaultTarget = currentContext.defaultTarget;
            var constantPool = ectx.constantPool;
            var skipArguments = null;
            var registersAllocationCount = !registersAllocation ? 0 : registersAllocation.length;
            for (var i = 0; i < registersAllocationCount; i++) {
                var registerAllocation = registersAllocation[i];
                if (registerAllocation && registerAllocation.type === 1 /* Argument */) {
                    if (!skipArguments) {
                        skipArguments = [];
                    }
                    skipArguments[registersAllocation[i].index] = true;
                }
            }
            var registersLength = Math.min(registersCount, 255);
            registersLength = Math.max(registersLength, registersAllocationCount + 1);
            var cachedRegisters = [];
            var MAX_CACHED_REGISTERS = 10;
            function createRegisters() {
                if (cachedRegisters.length > 0) {
                    return cachedRegisters.pop();
                }
                var registers = [];
                registers.length = registersLength;
                return registers;
            }
            function disposeRegisters(registers) {
                if (cachedRegisters.length > MAX_CACHED_REGISTERS) {
                    return;
                }
                cachedRegisters.push(registers);
            }
            var fn = (function () {
                if (currentContext.executionProhibited) {
                    return;
                }
                var newScopeContainer;
                var newScope = new AVM1FunctionClosure();
                var thisArg = isGlobalObject(this) ? scope : this;
                var argumentsClone;
                var supperWrapper;
                var frame = currentContext.pushCallFrame(thisArg, fn, arguments);
                if (!(suppressArguments & 4 /* Arguments */)) {
                    argumentsClone = sliceArguments(arguments, 0);
                    newScope.asSetPublicProperty('arguments', argumentsClone);
                }
                if (!(suppressArguments & 2 /* This */)) {
                    newScope.asSetPublicProperty('this', thisArg);
                }
                if (!(suppressArguments & 8 /* Super */)) {
                    supperWrapper = new AVM1SuperWrapper(frame);
                    newScope.asSetPublicProperty('super', supperWrapper);
                }
                newScopeContainer = scopeContainer.create(newScope);
                var i;
                var registers = createRegisters();
                for (i = 0; i < registersAllocationCount; i++) {
                    var registerAllocation = registersAllocation[i];
                    if (registerAllocation) {
                        switch (registerAllocation.type) {
                            case 1 /* Argument */:
                                registers[i] = arguments[registerAllocation.index];
                                break;
                            case 2 /* This */:
                                registers[i] = thisArg;
                                break;
                            case 4 /* Arguments */:
                                argumentsClone = argumentsClone || sliceArguments(arguments, 0);
                                registers[i] = argumentsClone;
                                break;
                            case 8 /* Super */:
                                supperWrapper = supperWrapper || new AVM1SuperWrapper(frame);
                                registers[i] = supperWrapper;
                                break;
                            case 16 /* Global */:
                                registers[i] = _global;
                                break;
                            case 32 /* Parent */:
                                registers[i] = scope.asGetPublicProperty('_parent');
                                break;
                            case 64 /* Root */:
                                registers[i] = currentContext.resolveLevel(0);
                                break;
                        }
                    }
                }
                for (i = 0; i < arguments.length || i < parametersNames.length; i++) {
                    if (skipArguments && skipArguments[i]) {
                        continue;
                    }
                    newScope.asSetPublicProperty(parametersNames[i], arguments[i]);
                }
                var result;
                var caughtError;
                actionTracer.indent();
                if (++currentContext.stackDepth >= MAX_AVM1_STACK_LIMIT) {
                    throw new AVM1CriticalError('long running script -- AVM1 recursion limit is reached');
                }
                currentContext.enterContext(function () {
                    try {
                        result = interpretActions(actionsData, newScopeContainer, constantPool, registers);
                    }
                    catch (e) {
                        caughtError = e;
                    }
                }, defaultTarget);
                currentContext.stackDepth--;
                currentContext.popCallFrame();
                actionTracer.unindent();
                disposeRegisters(registers);
                if (caughtError) {
                    throw caughtError;
                }
                return result;
            });
            var fnObj = fn;
            fnObj.instanceConstructor = fn;
            fnObj.debugName = 'avm1 ' + (functionName || '<function>');
            if (functionName) {
                fnObj.name = functionName;
            }
            return fn;
        }
        function avm1DeleteProperty(ectx, propertyName) {
            var scopeContainer = ectx.scopeContainer;
            for (var p = scopeContainer; p; p = p.next) {
                var resolved = avm1ResolveProperty(p.scope, propertyName, false);
                if (resolved) {
                    resolved.link.asSetPublicProperty(resolved.name, undefined);
                    return resolved.link.asDeleteProperty(undefined, resolved.name, 0);
                }
            }
            return false;
        }
        var __resolveVariableResult = {
            obj: null,
            link: null,
            name: null
        };
        function avm1VariableNameHasPath(variableName) {
            return variableName && (variableName.indexOf('.') >= 0 || variableName.indexOf(':') >= 0);
        }
        function avm1ResolveVariableName(ectx, variableName, normalize) {
            var _global = ectx.global;
            var currentContext = ectx.context;
            var obj, name, i, resolved;
            if (variableName.indexOf(':') >= 0) {
                var currentTarget = currentContext.currentTarget || currentContext.defaultTarget;
                var parts = variableName.split(':');
                obj = lookupAVM1Children(parts[0], currentTarget, currentContext.resolveLevel(0));
                if (!obj) {
                    avm1Warn(parts[0] + ' is undefined');
                    return null;
                }
                name = parts[1];
            }
            else if (variableName.indexOf('.') >= 0) {
                var objPath = variableName.split('.');
                name = objPath.pop();
                obj = _global;
                for (i = 0; i < objPath.length; i++) {
                    resolved = avm1ResolveProperty(obj, objPath[i], false);
                    obj = resolved && resolved.link.asGetPublicProperty(resolved.name);
                    if (!obj) {
                        avm1Warn(objPath.slice(0, i + 1) + ' is undefined');
                        return null;
                    }
                }
            }
            else {
                release || Shumway.Debug.assert(false, 'AVM1 variable has no path');
            }
            resolved = avm1ResolveProperty(obj, name, normalize);
            if (resolved) {
                __resolveVariableResult.obj = obj;
                __resolveVariableResult.link = resolved.link;
                __resolveVariableResult.name = resolved.name;
                return __resolveVariableResult;
            }
            else {
                return null;
            }
        }
        function avm1ResolveGetVariable(ectx, variableName) {
            if (avm1VariableNameHasPath(variableName)) {
                return avm1ResolveVariableName(ectx, variableName, false);
            }
            var scopeContainer = ectx.scopeContainer;
            var currentContext = ectx.context;
            var currentTarget = currentContext.currentTarget || currentContext.defaultTarget;
            var scope = ectx.scope;
            var resolved;
            resolved = avm1ResolveProperty(scope, variableName, false);
            if (resolved) {
                __resolveVariableResult.obj = scope;
                __resolveVariableResult.link = resolved.link;
                __resolveVariableResult.name = resolved.name;
                return __resolveVariableResult;
            }
            for (var p = scopeContainer; p; p = p.next) {
                resolved = avm1ResolveProperty(p.scope, variableName, false);
                if (resolved) {
                    __resolveVariableResult.obj = p.scope;
                    __resolveVariableResult.link = resolved.link;
                    __resolveVariableResult.name = resolved.name;
                    return __resolveVariableResult;
                }
            }
            resolved = avm1ResolveProperty(currentTarget, variableName, false);
            if (resolved) {
                __resolveVariableResult.obj = currentTarget;
                __resolveVariableResult.link = resolved.link;
                __resolveVariableResult.name = resolved.name;
                return __resolveVariableResult;
            }
            if (variableName === 'this') {
                scope.asDefinePublicProperty('this', {
                    value: currentTarget,
                    configurable: true
                });
                __resolveVariableResult.obj = scope;
                __resolveVariableResult.link = scope;
                __resolveVariableResult.name = 'this';
                return __resolveVariableResult;
            }
            return null;
        }
        function avm1ResolveSetVariable(ectx, variableName) {
            if (avm1VariableNameHasPath(variableName)) {
                return avm1ResolveVariableName(ectx, variableName, true);
            }
            var scopeContainer = ectx.scopeContainer;
            var currentContext = ectx.context;
            var currentTarget = currentContext.currentTarget || currentContext.defaultTarget;
            var scope = ectx.scope;
            if (currentContext.currentTarget) {
                __resolveVariableResult.obj = currentTarget;
                __resolveVariableResult.link = currentTarget;
                __resolveVariableResult.name = variableName;
                return __resolveVariableResult;
            }
            var resolved;
            resolved = avm1ResolveProperty(scope, variableName, false);
            if (resolved) {
                __resolveVariableResult.obj = scope;
                __resolveVariableResult.link = resolved.link;
                __resolveVariableResult.name = resolved.name;
                return __resolveVariableResult;
            }
            for (var p = scopeContainer; p.next; p = p.next) {
                resolved = avm1ResolveProperty(p.scope, variableName, false);
                if (resolved) {
                    __resolveVariableResult.obj = p.scope;
                    __resolveVariableResult.link = resolved.link;
                    __resolveVariableResult.name = resolved.name;
                    return __resolveVariableResult;
                }
            }
            __resolveVariableResult.obj = currentTarget;
            __resolveVariableResult.link = currentTarget;
            __resolveVariableResult.name = variableName;
            return __resolveVariableResult;
        }
        function avm1ProcessWith(ectx, obj, withBlock) {
            var scopeContainer = ectx.scopeContainer;
            var constantPool = ectx.constantPool;
            var registers = ectx.registers;
            var newScopeContainer = scopeContainer.create(Object(obj));
            interpretActions(withBlock, newScopeContainer, constantPool, registers);
        }
        function avm1ProcessTry(ectx, catchIsRegisterFlag, finallyBlockFlag, catchBlockFlag, catchTarget, tryBlock, catchBlock, finallyBlock) {
            var currentContext = ectx.context;
            var scopeContainer = ectx.scopeContainer;
            var scope = ectx.scope;
            var constantPool = ectx.constantPool;
            var registers = ectx.registers;
            var savedTryCatchState = currentContext.isTryCatchListening;
            var caughtError;
            try {
                currentContext.isTryCatchListening = true;
                interpretActions(tryBlock, scopeContainer, constantPool, registers);
            }
            catch (e) {
                currentContext.isTryCatchListening = savedTryCatchState;
                if (!catchBlockFlag || !(e instanceof AVM1Error)) {
                    caughtError = e;
                }
                else {
                    if (typeof catchTarget === 'string') {
                        scope.asSetPublicProperty(catchTarget, e.error);
                    }
                    else {
                        registers[catchTarget] = e.error;
                    }
                    interpretActions(catchBlock, scopeContainer, constantPool, registers);
                }
            }
            currentContext.isTryCatchListening = savedTryCatchState;
            if (finallyBlockFlag) {
                interpretActions(finallyBlock, scopeContainer, constantPool, registers);
            }
            if (caughtError) {
                throw caughtError;
            }
        }
        function avm1_0x81_ActionGotoFrame(ectx, args) {
            var _global = ectx.global;
            var frame = args[0];
            var play = args[1];
            if (play) {
                _global.gotoAndPlay(frame + 1);
            }
            else {
                _global.gotoAndStop(frame + 1);
            }
        }
        function avm1_0x83_ActionGetURL(ectx, args) {
            var _global = ectx.global;
            var urlString = args[0];
            var targetString = args[1];
            _global.getURL(urlString, targetString);
        }
        function avm1_0x04_ActionNextFrame(ectx) {
            var _global = ectx.global;
            _global.nextFrame();
        }
        function avm1_0x05_ActionPreviousFrame(ectx) {
            var _global = ectx.global;
            _global.prevFrame();
        }
        function avm1_0x06_ActionPlay(ectx) {
            var _global = ectx.global;
            _global.play();
        }
        function avm1_0x07_ActionStop(ectx) {
            var _global = ectx.global;
            _global.stop();
        }
        function avm1_0x08_ActionToggleQuality(ectx) {
            var _global = ectx.global;
            _global.toggleHighQuality();
        }
        function avm1_0x09_ActionStopSounds(ectx) {
            var _global = ectx.global;
            _global.stopAllSounds();
        }
        function avm1_0x8A_ActionWaitForFrame(ectx, args) {
            var _global = ectx.global;
            var frame = args[0];
            var count = args[1];
            return !_global.ifFrameLoaded(frame);
        }
        function avm1_0x8B_ActionSetTarget(ectx, args) {
            var targetName = args[0];
            avm1SetTarget(ectx, targetName);
        }
        function avm1_0x8C_ActionGoToLabel(ectx, args) {
            var _global = ectx.global;
            var label = args[0];
            var play = args[1];
            if (play) {
                _global.gotoAndPlay(label);
            }
            else {
                _global.gotoAndStop(label);
            }
        }
        function avm1_0x96_ActionPush(ectx, args) {
            var registers = ectx.registers;
            var constantPool = ectx.constantPool;
            var stack = ectx.stack;
            args.forEach(function (value) {
                if (value instanceof AVM1.ParsedPushConstantAction) {
                    stack.push(constantPool[value.constantIndex]);
                }
                else if (value instanceof AVM1.ParsedPushRegisterAction) {
                    var registerNumber = value.registerNumber;
                    if (registerNumber < 0 || registerNumber >= registers.length) {
                        stack.push(undefined);
                    }
                    else {
                        stack.push(registers[registerNumber]);
                    }
                }
                else {
                    stack.push(value);
                }
            });
        }
        function avm1_0x17_ActionPop(ectx) {
            var stack = ectx.stack;
            stack.pop();
        }
        function avm1_0x0A_ActionAdd(ectx) {
            var stack = ectx.stack;
            var a = as2ToNumber(stack.pop());
            var b = as2ToNumber(stack.pop());
            stack.push(a + b);
        }
        function avm1_0x0B_ActionSubtract(ectx) {
            var stack = ectx.stack;
            var a = as2ToNumber(stack.pop());
            var b = as2ToNumber(stack.pop());
            stack.push(b - a);
        }
        function avm1_0x0C_ActionMultiply(ectx) {
            var stack = ectx.stack;
            var a = as2ToNumber(stack.pop());
            var b = as2ToNumber(stack.pop());
            stack.push(a * b);
        }
        function avm1_0x0D_ActionDivide(ectx) {
            var stack = ectx.stack;
            var isSwfVersion5 = ectx.isSwfVersion5;
            var a = as2ToNumber(stack.pop());
            var b = as2ToNumber(stack.pop());
            var c = b / a;
            stack.push(isSwfVersion5 ? c : isFinite(c) ? c : '#ERROR#');
        }
        function avm1_0x0E_ActionEquals(ectx) {
            var stack = ectx.stack;
            var isSwfVersion5 = ectx.isSwfVersion5;
            var a = as2ToNumber(stack.pop());
            var b = as2ToNumber(stack.pop());
            var f = a == b;
            stack.push(isSwfVersion5 ? f : f ? 1 : 0);
        }
        function avm1_0x0F_ActionLess(ectx) {
            var stack = ectx.stack;
            var isSwfVersion5 = ectx.isSwfVersion5;
            var a = as2ToNumber(stack.pop());
            var b = as2ToNumber(stack.pop());
            var f = b < a;
            stack.push(isSwfVersion5 ? f : f ? 1 : 0);
        }
        function avm1_0x10_ActionAnd(ectx) {
            var stack = ectx.stack;
            var isSwfVersion5 = ectx.isSwfVersion5;
            var a = as2ToBoolean(stack.pop());
            var b = as2ToBoolean(stack.pop());
            var f = a && b;
            stack.push(isSwfVersion5 ? f : f ? 1 : 0);
        }
        function avm1_0x11_ActionOr(ectx) {
            var stack = ectx.stack;
            var isSwfVersion5 = ectx.isSwfVersion5;
            var a = as2ToBoolean(stack.pop());
            var b = as2ToBoolean(stack.pop());
            var f = a || b;
            stack.push(isSwfVersion5 ? f : f ? 1 : 0);
        }
        function avm1_0x12_ActionNot(ectx) {
            var stack = ectx.stack;
            var isSwfVersion5 = ectx.isSwfVersion5;
            var f = !as2ToBoolean(stack.pop());
            stack.push(isSwfVersion5 ? f : f ? 1 : 0);
        }
        function avm1_0x13_ActionStringEquals(ectx) {
            var stack = ectx.stack;
            var isSwfVersion5 = ectx.isSwfVersion5;
            var sa = as2ToString(stack.pop());
            var sb = as2ToString(stack.pop());
            var f = sa == sb;
            stack.push(isSwfVersion5 ? f : f ? 1 : 0);
        }
        function avm1_0x14_ActionStringLength(ectx) {
            var stack = ectx.stack;
            var _global = ectx.global;
            var sa = as2ToString(stack.pop());
            stack.push(_global.length_(sa));
        }
        function avm1_0x31_ActionMBStringLength(ectx) {
            var stack = ectx.stack;
            var _global = ectx.global;
            var sa = as2ToString(stack.pop());
            stack.push(_global.length_(sa));
        }
        function avm1_0x21_ActionStringAdd(ectx) {
            var stack = ectx.stack;
            var sa = as2ToString(stack.pop());
            var sb = as2ToString(stack.pop());
            stack.push(sb + sa);
        }
        function avm1_0x15_ActionStringExtract(ectx) {
            var stack = ectx.stack;
            var _global = ectx.global;
            var count = stack.pop();
            var index = stack.pop();
            var value = as2ToString(stack.pop());
            stack.push(_global.substring(value, index, count));
        }
        function avm1_0x35_ActionMBStringExtract(ectx) {
            var stack = ectx.stack;
            var _global = ectx.global;
            var count = stack.pop();
            var index = stack.pop();
            var value = as2ToString(stack.pop());
            stack.push(_global.mbsubstring(value, index, count));
        }
        function avm1_0x29_ActionStringLess(ectx) {
            var stack = ectx.stack;
            var isSwfVersion5 = ectx.isSwfVersion5;
            var sa = as2ToString(stack.pop());
            var sb = as2ToString(stack.pop());
            var f = sb < sa;
            stack.push(isSwfVersion5 ? f : f ? 1 : 0);
        }
        function avm1_0x18_ActionToInteger(ectx) {
            var stack = ectx.stack;
            var _global = ectx.global;
            stack.push(_global.int(stack.pop()));
        }
        function avm1_0x32_ActionCharToAscii(ectx) {
            var stack = ectx.stack;
            var _global = ectx.global;
            var ch = stack.pop();
            var charCode = _global.ord(ch);
            stack.push(charCode);
        }
        function avm1_0x36_ActionMBCharToAscii(ectx) {
            var stack = ectx.stack;
            var _global = ectx.global;
            var ch = stack.pop();
            var charCode = _global.mbord(ch);
            stack.push(charCode);
        }
        function avm1_0x33_ActionAsciiToChar(ectx) {
            var stack = ectx.stack;
            var _global = ectx.global;
            var charCode = +stack.pop();
            var ch = _global.chr(charCode);
            stack.push(ch);
        }
        function avm1_0x37_ActionMBAsciiToChar(ectx) {
            var stack = ectx.stack;
            var _global = ectx.global;
            var charCode = +stack.pop();
            var ch = _global.mbchr(charCode);
            stack.push(ch);
        }
        function avm1_0x99_ActionJump(ectx, args) {
        }
        function avm1_0x9D_ActionIf(ectx, args) {
            var stack = ectx.stack;
            var offset = args[0];
            return !!stack.pop();
        }
        function avm1_0x9E_ActionCall(ectx) {
            var stack = ectx.stack;
            var _global = ectx.global;
            var label = stack.pop();
            _global.call(label);
        }
        function avm1_0x1C_ActionGetVariable(ectx) {
            var stack = ectx.stack;
            var variableName = '' + stack.pop();
            var sp = stack.length;
            stack.push(undefined);
            var resolved = avm1ResolveGetVariable(ectx, variableName);
            stack[sp] = resolved ? resolved.link.asGetPublicProperty(resolved.name) : undefined;
        }
        function avm1_0x1D_ActionSetVariable(ectx) {
            var stack = ectx.stack;
            var value = stack.pop();
            var variableName = '' + stack.pop();
            var resolved = avm1ResolveSetVariable(ectx, variableName);
            if (resolved) {
                resolved.link.asSetPublicProperty(resolved.name, value);
                as2SyncEvents(resolved.name);
            }
        }
        function avm1_0x9A_ActionGetURL2(ectx, args) {
            var _global = ectx.global;
            var stack = ectx.stack;
            var flags = args[0];
            var target = stack.pop();
            var url = stack.pop();
            var sendVarsMethod;
            if (flags & 1) {
                sendVarsMethod = 'GET';
            }
            else if (flags & 2) {
                sendVarsMethod = 'POST';
            }
            var loadTargetFlag = flags & 1 << 6;
            var loadVariablesFlag = flags & 1 << 7;
            if (loadVariablesFlag) {
                _global.loadVariables(url, target, sendVarsMethod);
            }
            else if (!loadTargetFlag) {
                _global.getURL(url, target, sendVarsMethod);
            }
            else {
                _global.loadMovie(url, target, sendVarsMethod);
            }
        }
        function avm1_0x9F_ActionGotoFrame2(ectx, args) {
            var _global = ectx.global;
            var stack = ectx.stack;
            var flags = args[0];
            var gotoParams = [stack.pop()];
            if (!!(flags & 2)) {
                gotoParams.push(args[1]);
            }
            var gotoMethod = !!(flags & 1) ? _global.gotoAndPlay : _global.gotoAndStop;
            gotoMethod.apply(_global, gotoParams);
        }
        function avm1_0x20_ActionSetTarget2(ectx) {
            var stack = ectx.stack;
            var target = stack.pop();
            avm1SetTarget(ectx, target);
        }
        function avm1_0x22_ActionGetProperty(ectx) {
            var _global = ectx.global;
            var stack = ectx.stack;
            var index = stack.pop();
            var target = stack.pop();
            var sp = stack.length;
            stack.push(undefined);
            stack[sp] = _global.getAVM1Property(target, index);
        }
        function avm1_0x23_ActionSetProperty(ectx) {
            var _global = ectx.global;
            var stack = ectx.stack;
            var value = stack.pop();
            var index = stack.pop();
            var target = stack.pop();
            _global.setAVM1Property(target, index, value);
        }
        function avm1_0x24_ActionCloneSprite(ectx) {
            var _global = ectx.global;
            var stack = ectx.stack;
            var depth = stack.pop();
            var target = stack.pop();
            var source = stack.pop();
            _global.duplicateMovieClip(source, target, depth);
        }
        function avm1_0x25_ActionRemoveSprite(ectx) {
            var _global = ectx.global;
            var stack = ectx.stack;
            var target = stack.pop();
            _global.removeMovieClip(target);
        }
        function avm1_0x27_ActionStartDrag(ectx) {
            var _global = ectx.global;
            var stack = ectx.stack;
            var target = stack.pop();
            var lockcenter = stack.pop();
            var constrain = !stack.pop() ? null : {
                y2: stack.pop(),
                x2: stack.pop(),
                y1: stack.pop(),
                x1: stack.pop()
            };
            var dragParams = [target, lockcenter];
            if (constrain) {
                dragParams = dragParams.concat(constrain.x1, constrain.y1, constrain.x2, constrain.y2);
            }
            _global.startDrag.apply(_global, dragParams);
        }
        function avm1_0x28_ActionEndDrag(ectx) {
            var _global = ectx.global;
            _global.stopDrag();
        }
        function avm1_0x8D_ActionWaitForFrame2(ectx, args) {
            var _global = ectx.global;
            var stack = ectx.stack;
            var count = args[0];
            var frame = stack.pop();
            return !_global.ifFrameLoaded(frame);
        }
        function avm1_0x26_ActionTrace(ectx) {
            var _global = ectx.global;
            var stack = ectx.stack;
            var value = stack.pop();
            _global.trace(value === undefined ? 'undefined' : as2ToString(value));
        }
        function avm1_0x34_ActionGetTime(ectx) {
            var _global = ectx.global;
            var stack = ectx.stack;
            stack.push(_global.getTimer());
        }
        function avm1_0x30_ActionRandomNumber(ectx) {
            var _global = ectx.global;
            var stack = ectx.stack;
            stack.push(_global.random(stack.pop()));
        }
        function avm1_0x3D_ActionCallFunction(ectx) {
            var stack = ectx.stack;
            var functionName = stack.pop();
            var args = avm1ReadFunctionArgs(stack);
            var sp = stack.length;
            stack.push(undefined);
            var resolved = avm1ResolveGetVariable(ectx, functionName);
            var fn = resolved ? resolved.link.asGetPublicProperty(resolved.name) : undefined;
            if (!(fn instanceof Function)) {
                avm1Warn("AVM1 warning: function '" + functionName + (fn ? "' is not callable" : "' is undefined"));
                return;
            }
            release || assert(stack.length === sp + 1);
            stack[sp] = fn.apply(resolved.obj || null, args);
        }
        function avm1_0x52_ActionCallMethod(ectx) {
            var stack = ectx.stack;
            var methodName = stack.pop();
            var obj = stack.pop();
            var args = avm1ReadFunctionArgs(stack);
            var target;
            var sp = stack.length;
            stack.push(undefined);
            if (Shumway.isNullOrUndefined(obj)) {
                avm1Warn("AVM1 warning: method '" + methodName + "' can't be called on undefined object");
                return;
            }
            var frame = ectx.context.frame;
            var superArg, fn;
            if (Shumway.isNullOrUndefined(methodName) || methodName === '') {
                if (obj instanceof AVM1SuperWrapper) {
                    var superFrame = obj.callFrame;
                    var resolvedSuper = as2ResolveSuperProperty(superFrame, '__constructor__');
                    if (resolvedSuper) {
                        superArg = resolvedSuper.target;
                        fn = resolvedSuper.obj;
                        target = superFrame.currentThis;
                    }
                }
                else {
                    fn = obj;
                    target = obj;
                }
                if (isFunction(fn)) {
                    frame.setCallee(target, superArg, fn, args);
                    stack[sp] = fn.apply(target, args);
                    frame.resetCallee();
                }
                else {
                    avm1Warn("AVM1 warning: obj '" + obj + (obj ? "' is not callable" : "' is undefined"));
                }
                release || assert(stack.length === sp + 1);
                return;
            }
            if (obj instanceof AVM1SuperWrapper) {
                var superFrame = obj.callFrame;
                var resolvedSuper = as2ResolveSuperProperty(superFrame, methodName);
                if (resolvedSuper) {
                    superArg = resolvedSuper.target;
                    fn = resolvedSuper.obj;
                    target = superFrame.currentThis;
                }
            }
            else {
                fn = as2GetProperty(obj, methodName);
                target = obj;
            }
            if (!isFunction(fn)) {
                avm1Warn("AVM1 warning: method '" + methodName + "' on object", obj, (Shumway.isNullOrUndefined(fn) ? "is undefined" : "is not callable"));
                return;
            }
            release || assert(stack.length === sp + 1);
            frame.setCallee(target, superArg, fn, args);
            stack[sp] = fn.apply(target, args);
            frame.resetCallee();
        }
        function avm1_0x88_ActionConstantPool(ectx, args) {
            var constantPool = args[0];
            ectx.constantPool = constantPool;
        }
        function avm1_0x9B_ActionDefineFunction(ectx, args) {
            var stack = ectx.stack;
            var scope = ectx.scope;
            var functionBody = args[0];
            var functionName = args[1];
            var functionParams = args[2];
            var fn = avm1DefineFunction(ectx, functionBody, functionName, functionParams, 4, null, 0);
            if (functionName) {
                scope.asSetPublicProperty(functionName, fn);
            }
            else {
                stack.push(fn);
            }
        }
        function avm1_0x3C_ActionDefineLocal(ectx) {
            var stack = ectx.stack;
            var scope = ectx.scope;
            var value = stack.pop();
            var name = stack.pop();
            scope.asSetPublicProperty(name, value);
        }
        function avm1_0x41_ActionDefineLocal2(ectx) {
            var stack = ectx.stack;
            var scope = ectx.scope;
            var name = stack.pop();
            scope.asSetPublicProperty(name, undefined);
        }
        function avm1_0x3A_ActionDelete(ectx) {
            var stack = ectx.stack;
            var name = stack.pop();
            var obj = stack.pop();
            stack.push(obj.asDeleteProperty(undefined, name, 0));
            as2SyncEvents(name);
        }
        function avm1_0x3B_ActionDelete2(ectx) {
            var stack = ectx.stack;
            var name = stack.pop();
            var result = avm1DeleteProperty(ectx, name);
            stack.push(result);
            as2SyncEvents(name);
        }
        function avm1_0x46_ActionEnumerate(ectx) {
            var stack = ectx.stack;
            var objectName = stack.pop();
            stack.push(null);
            var resolved = avm1ResolveGetVariable(ectx, objectName);
            var obj = resolved ? resolved.link.asGetPublicProperty(resolved.name) : undefined;
            if (Shumway.isNullOrUndefined(obj)) {
                return;
            }
            as2Enumerate(obj, function (name) {
                stack.push(name);
            }, null);
        }
        function avm1_0x49_ActionEquals2(ectx) {
            var stack = ectx.stack;
            var a = stack.pop();
            var b = stack.pop();
            stack.push(a == b);
        }
        function avm1_0x4E_ActionGetMember(ectx) {
            var stack = ectx.stack;
            var name = stack.pop();
            var obj = stack.pop();
            stack.push(undefined);
            if (Shumway.isNullOrUndefined(obj)) {
                avm1Warn("AVM1 warning: cannot get member '" + name + "' on undefined object");
                return;
            }
            if (obj instanceof AVM1SuperWrapper) {
                var superFrame = obj.callFrame;
                var resolvedSuper = as2ResolveSuperProperty(superFrame, name);
                if (resolvedSuper) {
                    stack[stack.length - 1] = resolvedSuper.obj;
                }
                return;
            }
            stack[stack.length - 1] = as2GetProperty(obj, name);
        }
        function avm1_0x42_ActionInitArray(ectx) {
            var stack = ectx.stack;
            var obj = avm1ReadFunctionArgs(stack);
            stack.push(obj);
        }
        function avm1_0x43_ActionInitObject(ectx) {
            var stack = ectx.stack;
            var count = +stack.pop();
            count = fixArgsCount(count, stack.length >> 1);
            var obj = {};
            as2SetupInternalProperties(obj, null, AVM1Object);
            for (var i = 0; i < count; i++) {
                var value = stack.pop();
                var name = stack.pop();
                obj.asSetPublicProperty(name, value);
            }
            stack.push(obj);
        }
        function avm1_0x53_ActionNewMethod(ectx) {
            var stack = ectx.stack;
            var methodName = stack.pop();
            var obj = stack.pop();
            var args = avm1ReadFunctionArgs(stack);
            var sp = stack.length;
            stack.push(undefined);
            if (Shumway.isNullOrUndefined(obj)) {
                avm1Warn("AVM1 warning: method '" + methodName + "' can't be constructed on undefined object");
                return;
            }
            var ctor;
            if (Shumway.isNullOrUndefined(methodName) || methodName === '') {
                ctor = obj;
            }
            else {
                var resolvedName = as2ResolveProperty(obj, methodName, false);
                ctor = obj.asGetPublicProperty(resolvedName);
            }
            var result = as2Construct(ctor, args);
            if (result === undefined) {
                avm1Warn("AVM1 warning: method '" + methodName + "' on object", obj, "is not constructible");
            }
            stack[sp] = result;
            release || assert(stack.length === sp + 1);
        }
        function avm1_0x40_ActionNewObject(ectx) {
            var stack = ectx.stack;
            var objectName = stack.pop();
            var args = avm1ReadFunctionArgs(stack);
            var sp = stack.length;
            stack.push(undefined);
            var resolved = avm1ResolveGetVariable(ectx, objectName);
            var obj = resolved ? resolved.link.asGetPublicProperty(resolved.name) : undefined;
            var result = createBuiltinType(obj, args);
            if (result === undefined) {
                result = as2Construct(obj, args);
                if (result === undefined) {
                    avm1Warn("AVM1 warning: object '" + objectName + (obj ? "' is not constructible" : "' is undefined"));
                }
            }
            release || assert(stack.length === sp + 1);
            stack[sp] = result;
        }
        function avm1_0x4F_ActionSetMember(ectx) {
            var stack = ectx.stack;
            var value = stack.pop();
            var name = stack.pop();
            var obj = stack.pop();
            if (Shumway.isNullOrUndefined(obj)) {
                avm1Warn("AVM1 warning: cannot set member '" + name + "' on undefined object");
                return;
            }
            if (obj instanceof AVM1SuperWrapper) {
                avm1Warn("AVM1 warning: cannot set member '" + name + "' on super");
                return;
            }
            as2SetProperty(obj, name, value);
        }
        function avm1_0x45_ActionTargetPath(ectx) {
            var stack = ectx.stack;
            var obj = stack.pop();
            stack.push(as2GetType(obj) === 'movieclip' ? obj._target : void (0));
        }
        function avm1_0x94_ActionWith(ectx, args) {
            var stack = ectx.stack;
            var withBody = args[0];
            var obj = stack.pop();
            avm1ProcessWith(ectx, obj, withBody);
        }
        function avm1_0x4A_ActionToNumber(ectx) {
            var stack = ectx.stack;
            stack.push(as2ToNumber(stack.pop()));
        }
        function avm1_0x4B_ActionToString(ectx) {
            var stack = ectx.stack;
            stack.push(as2ToString(stack.pop()));
        }
        function avm1_0x44_ActionTypeOf(ectx) {
            var stack = ectx.stack;
            var obj = stack.pop();
            var result = as2GetType(obj);
            stack.push(result);
        }
        function avm1_0x47_ActionAdd2(ectx) {
            var stack = ectx.stack;
            var a = as2ToAddPrimitive(stack.pop());
            var b = as2ToAddPrimitive(stack.pop());
            if (typeof a === 'string' || typeof b === 'string') {
                stack.push(as2ToString(b) + as2ToString(a));
            }
            else {
                stack.push(as2ToNumber(b) + as2ToNumber(a));
            }
        }
        function avm1_0x48_ActionLess2(ectx) {
            var stack = ectx.stack;
            var a = stack.pop();
            var b = stack.pop();
            stack.push(as2Compare(b, a));
        }
        function avm1_0x3F_ActionModulo(ectx) {
            var stack = ectx.stack;
            var a = as2ToNumber(stack.pop());
            var b = as2ToNumber(stack.pop());
            stack.push(b % a);
        }
        function avm1_0x60_ActionBitAnd(ectx) {
            var stack = ectx.stack;
            var a = as2ToInt32(stack.pop());
            var b = as2ToInt32(stack.pop());
            stack.push(b & a);
        }
        function avm1_0x63_ActionBitLShift(ectx) {
            var stack = ectx.stack;
            var a = as2ToInt32(stack.pop());
            var b = as2ToInt32(stack.pop());
            stack.push(b << a);
        }
        function avm1_0x61_ActionBitOr(ectx) {
            var stack = ectx.stack;
            var a = as2ToInt32(stack.pop());
            var b = as2ToInt32(stack.pop());
            stack.push(b | a);
        }
        function avm1_0x64_ActionBitRShift(ectx) {
            var stack = ectx.stack;
            var a = as2ToInt32(stack.pop());
            var b = as2ToInt32(stack.pop());
            stack.push(b >> a);
        }
        function avm1_0x65_ActionBitURShift(ectx) {
            var stack = ectx.stack;
            var a = as2ToInt32(stack.pop());
            var b = as2ToInt32(stack.pop());
            stack.push(b >>> a);
        }
        function avm1_0x62_ActionBitXor(ectx) {
            var stack = ectx.stack;
            var a = as2ToInt32(stack.pop());
            var b = as2ToInt32(stack.pop());
            stack.push(b ^ a);
        }
        function avm1_0x51_ActionDecrement(ectx) {
            var stack = ectx.stack;
            var a = as2ToNumber(stack.pop());
            a--;
            stack.push(a);
        }
        function avm1_0x50_ActionIncrement(ectx) {
            var stack = ectx.stack;
            var a = as2ToNumber(stack.pop());
            a++;
            stack.push(a);
        }
        function avm1_0x4C_ActionPushDuplicate(ectx) {
            var stack = ectx.stack;
            stack.push(stack[stack.length - 1]);
        }
        function avm1_0x3E_ActionReturn(ectx) {
            ectx.isEndOfActions = true;
        }
        function avm1_0x4D_ActionStackSwap(ectx) {
            var stack = ectx.stack;
            stack.push(stack.pop(), stack.pop());
        }
        function avm1_0x87_ActionStoreRegister(ectx, args) {
            var stack = ectx.stack;
            var registers = ectx.registers;
            var register = args[0];
            if (register < 0 || register >= registers.length) {
                return;
            }
            registers[register] = stack[stack.length - 1];
        }
        function avm1_0x54_ActionInstanceOf(ectx) {
            var stack = ectx.stack;
            var constr = stack.pop();
            var obj = stack.pop();
            stack.push(as2InstanceOf(obj, constr));
        }
        function avm1_0x55_ActionEnumerate2(ectx) {
            var stack = ectx.stack;
            var obj = stack.pop();
            stack.push(null);
            if (Shumway.isNullOrUndefined(obj)) {
                avm1Warn("AVM1 warning: cannot iterate over undefined object");
                return;
            }
            as2Enumerate(obj, function (name) {
                stack.push(name);
            }, null);
        }
        function avm1_0x66_ActionStrictEquals(ectx) {
            var stack = ectx.stack;
            var a = stack.pop();
            var b = stack.pop();
            stack.push(b === a);
        }
        function avm1_0x67_ActionGreater(ectx) {
            var stack = ectx.stack;
            var a = stack.pop();
            var b = stack.pop();
            stack.push(as2Compare(a, b));
        }
        function avm1_0x68_ActionStringGreater(ectx) {
            var stack = ectx.stack;
            var isSwfVersion5 = ectx.isSwfVersion5;
            var sa = as2ToString(stack.pop());
            var sb = as2ToString(stack.pop());
            var f = sb > sa;
            stack.push(isSwfVersion5 ? f : f ? 1 : 0);
        }
        function avm1_0x8E_ActionDefineFunction2(ectx, args) {
            var stack = ectx.stack;
            var scope = ectx.scope;
            var functionBody = args[0];
            var functionName = args[1];
            var functionParams = args[2];
            var registerCount = args[3];
            var registerAllocation = args[4];
            var suppressArguments = args[5];
            var fn = avm1DefineFunction(ectx, functionBody, functionName, functionParams, registerCount, registerAllocation, suppressArguments);
            if (functionName) {
                scope.asSetPublicProperty(functionName, fn);
            }
            else {
                stack.push(fn);
            }
        }
        function avm1_0x69_ActionExtends(ectx) {
            var stack = ectx.stack;
            var constrSuper = stack.pop();
            var constr = stack.pop();
            var prototype = constr.asGetPublicProperty('prototype');
            var prototypeSuper = constrSuper.asGetPublicProperty('prototype');
            prototype.asSetPublicProperty('__proto__', prototypeSuper);
            prototype.asSetPublicProperty('__constructor__', constrSuper);
        }
        function avm1_0x2B_ActionCastOp(ectx) {
            var stack = ectx.stack;
            var obj = stack.pop();
            var constr = stack.pop();
            stack.push(as2InstanceOf(obj, constr) ? obj : null);
        }
        function avm1_0x2C_ActionImplementsOp(ectx) {
            var stack = ectx.stack;
            var constr = stack.pop();
            var count = +stack.pop();
            fixArgsCount(count, stack.length);
            var interfaces = [];
            for (var i = 0; i < count; i++) {
                interfaces.push(stack.pop());
            }
            constr._as2Interfaces = interfaces;
        }
        function avm1_0x8F_ActionTry(ectx, args) {
            var catchIsRegisterFlag = args[0];
            var catchTarget = args[1];
            var tryBody = args[2];
            var catchBlockFlag = args[3];
            var catchBody = args[4];
            var finallyBlockFlag = args[5];
            var finallyBody = args[6];
            avm1ProcessTry(ectx, catchIsRegisterFlag, finallyBlockFlag, catchBlockFlag, catchTarget, tryBody, catchBody, finallyBody);
        }
        function avm1_0x2A_ActionThrow(ectx) {
            var stack = ectx.stack;
            var obj = stack.pop();
            throw new AVM1Error(obj);
        }
        function avm1_0x2D_ActionFSCommand2(ectx) {
            var stack = ectx.stack;
            var _global = ectx.global;
            var args = avm1ReadFunctionArgs(stack);
            var sp = stack.length;
            stack.push(undefined);
            var result = _global.fscommand.apply(null, args);
            stack[sp] = result;
        }
        function avm1_0x89_ActionStrictMode(ectx, args) {
            var mode = args[0];
        }
        function wrapAvm1Error(fn) {
            return function avm1ErrorWrapper(executionContext, args) {
                var currentContext;
                try {
                    fn(executionContext, args);
                    executionContext.recoveringFromError = false;
                }
                catch (e) {
                    currentContext = executionContext.context;
                    e = as2CastError(e);
                    if (e instanceof AVM1CriticalError) {
                        throw e;
                    }
                    if (e instanceof AVM1Error) {
                        throw e;
                    }
                    Telemetry.instance.reportTelemetry({ topic: 'error', error: 1 /* AVM1_ERROR */ });
                    if (!executionContext.recoveringFromError) {
                        if (currentContext.errorsIgnored++ >= MAX_AVM1_ERRORS_LIMIT) {
                            throw new AVM1CriticalError('long running script -- AVM1 errors limit is reached');
                        }
                        console.log(typeof e);
                        console.log(Object.getPrototypeOf(e));
                        console.log(Object.getPrototypeOf(Object.getPrototypeOf(e)));
                        console.error('AVM1 error: ' + e);
                        var avm2 = Shumway.AVM2.Runtime.AVM2;
                        avm2.instance.exceptions.push({ source: 'avm1', message: e.message, stack: e.stack });
                        executionContext.recoveringFromError = true;
                    }
                }
            };
        }
        function generateActionCalls() {
            var wrap;
            if (!AVM1.avm1ErrorsEnabled.value) {
                wrap = wrapAvm1Error;
            }
            else {
                wrap = function (fn) {
                    return fn;
                };
            }
            return {
                ActionGotoFrame: wrap(avm1_0x81_ActionGotoFrame),
                ActionGetURL: wrap(avm1_0x83_ActionGetURL),
                ActionNextFrame: wrap(avm1_0x04_ActionNextFrame),
                ActionPreviousFrame: wrap(avm1_0x05_ActionPreviousFrame),
                ActionPlay: wrap(avm1_0x06_ActionPlay),
                ActionStop: wrap(avm1_0x07_ActionStop),
                ActionToggleQuality: wrap(avm1_0x08_ActionToggleQuality),
                ActionStopSounds: wrap(avm1_0x09_ActionStopSounds),
                ActionWaitForFrame: wrap(avm1_0x8A_ActionWaitForFrame),
                ActionSetTarget: wrap(avm1_0x8B_ActionSetTarget),
                ActionGoToLabel: wrap(avm1_0x8C_ActionGoToLabel),
                ActionPush: wrap(avm1_0x96_ActionPush),
                ActionPop: wrap(avm1_0x17_ActionPop),
                ActionAdd: wrap(avm1_0x0A_ActionAdd),
                ActionSubtract: wrap(avm1_0x0B_ActionSubtract),
                ActionMultiply: wrap(avm1_0x0C_ActionMultiply),
                ActionDivide: wrap(avm1_0x0D_ActionDivide),
                ActionEquals: wrap(avm1_0x0E_ActionEquals),
                ActionLess: wrap(avm1_0x0F_ActionLess),
                ActionAnd: wrap(avm1_0x10_ActionAnd),
                ActionOr: wrap(avm1_0x11_ActionOr),
                ActionNot: wrap(avm1_0x12_ActionNot),
                ActionStringEquals: wrap(avm1_0x13_ActionStringEquals),
                ActionStringLength: wrap(avm1_0x14_ActionStringLength),
                ActionMBStringLength: wrap(avm1_0x31_ActionMBStringLength),
                ActionStringAdd: wrap(avm1_0x21_ActionStringAdd),
                ActionStringExtract: wrap(avm1_0x15_ActionStringExtract),
                ActionMBStringExtract: wrap(avm1_0x35_ActionMBStringExtract),
                ActionStringLess: wrap(avm1_0x29_ActionStringLess),
                ActionToInteger: wrap(avm1_0x18_ActionToInteger),
                ActionCharToAscii: wrap(avm1_0x32_ActionCharToAscii),
                ActionMBCharToAscii: wrap(avm1_0x36_ActionMBCharToAscii),
                ActionAsciiToChar: wrap(avm1_0x33_ActionAsciiToChar),
                ActionMBAsciiToChar: wrap(avm1_0x37_ActionMBAsciiToChar),
                ActionJump: wrap(avm1_0x99_ActionJump),
                ActionIf: wrap(avm1_0x9D_ActionIf),
                ActionCall: wrap(avm1_0x9E_ActionCall),
                ActionGetVariable: wrap(avm1_0x1C_ActionGetVariable),
                ActionSetVariable: wrap(avm1_0x1D_ActionSetVariable),
                ActionGetURL2: wrap(avm1_0x9A_ActionGetURL2),
                ActionGotoFrame2: wrap(avm1_0x9F_ActionGotoFrame2),
                ActionSetTarget2: wrap(avm1_0x20_ActionSetTarget2),
                ActionGetProperty: wrap(avm1_0x22_ActionGetProperty),
                ActionSetProperty: wrap(avm1_0x23_ActionSetProperty),
                ActionCloneSprite: wrap(avm1_0x24_ActionCloneSprite),
                ActionRemoveSprite: wrap(avm1_0x25_ActionRemoveSprite),
                ActionStartDrag: wrap(avm1_0x27_ActionStartDrag),
                ActionEndDrag: wrap(avm1_0x28_ActionEndDrag),
                ActionWaitForFrame2: wrap(avm1_0x8D_ActionWaitForFrame2),
                ActionTrace: wrap(avm1_0x26_ActionTrace),
                ActionGetTime: wrap(avm1_0x34_ActionGetTime),
                ActionRandomNumber: wrap(avm1_0x30_ActionRandomNumber),
                ActionCallFunction: wrap(avm1_0x3D_ActionCallFunction),
                ActionCallMethod: wrap(avm1_0x52_ActionCallMethod),
                ActionConstantPool: wrap(avm1_0x88_ActionConstantPool),
                ActionDefineFunction: wrap(avm1_0x9B_ActionDefineFunction),
                ActionDefineLocal: wrap(avm1_0x3C_ActionDefineLocal),
                ActionDefineLocal2: wrap(avm1_0x41_ActionDefineLocal2),
                ActionDelete: wrap(avm1_0x3A_ActionDelete),
                ActionDelete2: wrap(avm1_0x3B_ActionDelete2),
                ActionEnumerate: wrap(avm1_0x46_ActionEnumerate),
                ActionEquals2: wrap(avm1_0x49_ActionEquals2),
                ActionGetMember: wrap(avm1_0x4E_ActionGetMember),
                ActionInitArray: wrap(avm1_0x42_ActionInitArray),
                ActionInitObject: wrap(avm1_0x43_ActionInitObject),
                ActionNewMethod: wrap(avm1_0x53_ActionNewMethod),
                ActionNewObject: wrap(avm1_0x40_ActionNewObject),
                ActionSetMember: wrap(avm1_0x4F_ActionSetMember),
                ActionTargetPath: wrap(avm1_0x45_ActionTargetPath),
                ActionWith: wrap(avm1_0x94_ActionWith),
                ActionToNumber: wrap(avm1_0x4A_ActionToNumber),
                ActionToString: wrap(avm1_0x4B_ActionToString),
                ActionTypeOf: wrap(avm1_0x44_ActionTypeOf),
                ActionAdd2: wrap(avm1_0x47_ActionAdd2),
                ActionLess2: wrap(avm1_0x48_ActionLess2),
                ActionModulo: wrap(avm1_0x3F_ActionModulo),
                ActionBitAnd: wrap(avm1_0x60_ActionBitAnd),
                ActionBitLShift: wrap(avm1_0x63_ActionBitLShift),
                ActionBitOr: wrap(avm1_0x61_ActionBitOr),
                ActionBitRShift: wrap(avm1_0x64_ActionBitRShift),
                ActionBitURShift: wrap(avm1_0x65_ActionBitURShift),
                ActionBitXor: wrap(avm1_0x62_ActionBitXor),
                ActionDecrement: wrap(avm1_0x51_ActionDecrement),
                ActionIncrement: wrap(avm1_0x50_ActionIncrement),
                ActionPushDuplicate: wrap(avm1_0x4C_ActionPushDuplicate),
                ActionReturn: wrap(avm1_0x3E_ActionReturn),
                ActionStackSwap: wrap(avm1_0x4D_ActionStackSwap),
                ActionStoreRegister: wrap(avm1_0x87_ActionStoreRegister),
                ActionInstanceOf: wrap(avm1_0x54_ActionInstanceOf),
                ActionEnumerate2: wrap(avm1_0x55_ActionEnumerate2),
                ActionStrictEquals: wrap(avm1_0x66_ActionStrictEquals),
                ActionGreater: wrap(avm1_0x67_ActionGreater),
                ActionStringGreater: wrap(avm1_0x68_ActionStringGreater),
                ActionDefineFunction2: wrap(avm1_0x8E_ActionDefineFunction2),
                ActionExtends: wrap(avm1_0x69_ActionExtends),
                ActionCastOp: wrap(avm1_0x2B_ActionCastOp),
                ActionImplementsOp: wrap(avm1_0x2C_ActionImplementsOp),
                ActionTry: wrap(avm1_0x8F_ActionTry),
                ActionThrow: wrap(avm1_0x2A_ActionThrow),
                ActionFSCommand2: wrap(avm1_0x2D_ActionFSCommand2),
                ActionStrictMode: wrap(avm1_0x89_ActionStrictMode)
            };
        }
        function interpretAction(executionContext, parsedAction) {
            var stack = executionContext.stack;
            var actionCode = parsedAction.actionCode;
            var args = parsedAction.args;
            var actionTracer = executionContext.actionTracer;
            actionTracer.print(parsedAction, stack);
            var shallBranch = false;
            switch (actionCode | 0) {
                case 129 /* ActionGotoFrame */:
                    avm1_0x81_ActionGotoFrame(executionContext, args);
                    break;
                case 131 /* ActionGetURL */:
                    avm1_0x83_ActionGetURL(executionContext, args);
                    break;
                case 4 /* ActionNextFrame */:
                    avm1_0x04_ActionNextFrame(executionContext);
                    break;
                case 5 /* ActionPreviousFrame */:
                    avm1_0x05_ActionPreviousFrame(executionContext);
                    break;
                case 6 /* ActionPlay */:
                    avm1_0x06_ActionPlay(executionContext);
                    break;
                case 7 /* ActionStop */:
                    avm1_0x07_ActionStop(executionContext);
                    break;
                case 8 /* ActionToggleQuality */:
                    avm1_0x08_ActionToggleQuality(executionContext);
                    break;
                case 9 /* ActionStopSounds */:
                    avm1_0x09_ActionStopSounds(executionContext);
                    break;
                case 138 /* ActionWaitForFrame */:
                    shallBranch = avm1_0x8A_ActionWaitForFrame(executionContext, args);
                    break;
                case 139 /* ActionSetTarget */:
                    avm1_0x8B_ActionSetTarget(executionContext, args);
                    break;
                case 140 /* ActionGoToLabel */:
                    avm1_0x8C_ActionGoToLabel(executionContext, args);
                    break;
                case 150 /* ActionPush */:
                    avm1_0x96_ActionPush(executionContext, args);
                    break;
                case 23 /* ActionPop */:
                    avm1_0x17_ActionPop(executionContext);
                    break;
                case 10 /* ActionAdd */:
                    avm1_0x0A_ActionAdd(executionContext);
                    break;
                case 11 /* ActionSubtract */:
                    avm1_0x0B_ActionSubtract(executionContext);
                    break;
                case 12 /* ActionMultiply */:
                    avm1_0x0C_ActionMultiply(executionContext);
                    break;
                case 13 /* ActionDivide */:
                    avm1_0x0D_ActionDivide(executionContext);
                    break;
                case 14 /* ActionEquals */:
                    avm1_0x0E_ActionEquals(executionContext);
                    break;
                case 15 /* ActionLess */:
                    avm1_0x0F_ActionLess(executionContext);
                    break;
                case 16 /* ActionAnd */:
                    avm1_0x10_ActionAnd(executionContext);
                    break;
                case 17 /* ActionOr */:
                    avm1_0x11_ActionOr(executionContext);
                    break;
                case 18 /* ActionNot */:
                    avm1_0x12_ActionNot(executionContext);
                    break;
                case 19 /* ActionStringEquals */:
                    avm1_0x13_ActionStringEquals(executionContext);
                    break;
                case 20 /* ActionStringLength */:
                    avm1_0x14_ActionStringLength(executionContext);
                    break;
                case 49 /* ActionMBStringLength */:
                    avm1_0x31_ActionMBStringLength(executionContext);
                    break;
                case 33 /* ActionStringAdd */:
                    avm1_0x21_ActionStringAdd(executionContext);
                    break;
                case 21 /* ActionStringExtract */:
                    avm1_0x15_ActionStringExtract(executionContext);
                    break;
                case 53 /* ActionMBStringExtract */:
                    avm1_0x35_ActionMBStringExtract(executionContext);
                    break;
                case 41 /* ActionStringLess */:
                    avm1_0x29_ActionStringLess(executionContext);
                    break;
                case 24 /* ActionToInteger */:
                    avm1_0x18_ActionToInteger(executionContext);
                    break;
                case 50 /* ActionCharToAscii */:
                    avm1_0x32_ActionCharToAscii(executionContext);
                    break;
                case 54 /* ActionMBCharToAscii */:
                    avm1_0x36_ActionMBCharToAscii(executionContext);
                    break;
                case 51 /* ActionAsciiToChar */:
                    avm1_0x33_ActionAsciiToChar(executionContext);
                    break;
                case 55 /* ActionMBAsciiToChar */:
                    avm1_0x37_ActionMBAsciiToChar(executionContext);
                    break;
                case 153 /* ActionJump */:
                    avm1_0x99_ActionJump(executionContext, args);
                    break;
                case 157 /* ActionIf */:
                    shallBranch = avm1_0x9D_ActionIf(executionContext, args);
                    break;
                case 158 /* ActionCall */:
                    avm1_0x9E_ActionCall(executionContext);
                    break;
                case 28 /* ActionGetVariable */:
                    avm1_0x1C_ActionGetVariable(executionContext);
                    break;
                case 29 /* ActionSetVariable */:
                    avm1_0x1D_ActionSetVariable(executionContext);
                    break;
                case 154 /* ActionGetURL2 */:
                    avm1_0x9A_ActionGetURL2(executionContext, args);
                    break;
                case 159 /* ActionGotoFrame2 */:
                    avm1_0x9F_ActionGotoFrame2(executionContext, args);
                    break;
                case 32 /* ActionSetTarget2 */:
                    avm1_0x20_ActionSetTarget2(executionContext);
                    break;
                case 34 /* ActionGetProperty */:
                    avm1_0x22_ActionGetProperty(executionContext);
                    break;
                case 35 /* ActionSetProperty */:
                    avm1_0x23_ActionSetProperty(executionContext);
                    break;
                case 36 /* ActionCloneSprite */:
                    avm1_0x24_ActionCloneSprite(executionContext);
                    break;
                case 37 /* ActionRemoveSprite */:
                    avm1_0x25_ActionRemoveSprite(executionContext);
                    break;
                case 39 /* ActionStartDrag */:
                    avm1_0x27_ActionStartDrag(executionContext);
                    break;
                case 40 /* ActionEndDrag */:
                    avm1_0x28_ActionEndDrag(executionContext);
                    break;
                case 141 /* ActionWaitForFrame2 */:
                    shallBranch = avm1_0x8D_ActionWaitForFrame2(executionContext, args);
                    break;
                case 38 /* ActionTrace */:
                    avm1_0x26_ActionTrace(executionContext);
                    break;
                case 52 /* ActionGetTime */:
                    avm1_0x34_ActionGetTime(executionContext);
                    break;
                case 48 /* ActionRandomNumber */:
                    avm1_0x30_ActionRandomNumber(executionContext);
                    break;
                case 61 /* ActionCallFunction */:
                    avm1_0x3D_ActionCallFunction(executionContext);
                    break;
                case 82 /* ActionCallMethod */:
                    avm1_0x52_ActionCallMethod(executionContext);
                    break;
                case 136 /* ActionConstantPool */:
                    avm1_0x88_ActionConstantPool(executionContext, args);
                    break;
                case 155 /* ActionDefineFunction */:
                    avm1_0x9B_ActionDefineFunction(executionContext, args);
                    break;
                case 60 /* ActionDefineLocal */:
                    avm1_0x3C_ActionDefineLocal(executionContext);
                    break;
                case 65 /* ActionDefineLocal2 */:
                    avm1_0x41_ActionDefineLocal2(executionContext);
                    break;
                case 58 /* ActionDelete */:
                    avm1_0x3A_ActionDelete(executionContext);
                    break;
                case 59 /* ActionDelete2 */:
                    avm1_0x3B_ActionDelete2(executionContext);
                    break;
                case 70 /* ActionEnumerate */:
                    avm1_0x46_ActionEnumerate(executionContext);
                    break;
                case 73 /* ActionEquals2 */:
                    avm1_0x49_ActionEquals2(executionContext);
                    break;
                case 78 /* ActionGetMember */:
                    avm1_0x4E_ActionGetMember(executionContext);
                    break;
                case 66 /* ActionInitArray */:
                    avm1_0x42_ActionInitArray(executionContext);
                    break;
                case 67 /* ActionInitObject */:
                    avm1_0x43_ActionInitObject(executionContext);
                    break;
                case 83 /* ActionNewMethod */:
                    avm1_0x53_ActionNewMethod(executionContext);
                    break;
                case 64 /* ActionNewObject */:
                    avm1_0x40_ActionNewObject(executionContext);
                    break;
                case 79 /* ActionSetMember */:
                    avm1_0x4F_ActionSetMember(executionContext);
                    break;
                case 69 /* ActionTargetPath */:
                    avm1_0x45_ActionTargetPath(executionContext);
                    break;
                case 148 /* ActionWith */:
                    avm1_0x94_ActionWith(executionContext, args);
                    break;
                case 74 /* ActionToNumber */:
                    avm1_0x4A_ActionToNumber(executionContext);
                    break;
                case 75 /* ActionToString */:
                    avm1_0x4B_ActionToString(executionContext);
                    break;
                case 68 /* ActionTypeOf */:
                    avm1_0x44_ActionTypeOf(executionContext);
                    break;
                case 71 /* ActionAdd2 */:
                    avm1_0x47_ActionAdd2(executionContext);
                    break;
                case 72 /* ActionLess2 */:
                    avm1_0x48_ActionLess2(executionContext);
                    break;
                case 63 /* ActionModulo */:
                    avm1_0x3F_ActionModulo(executionContext);
                    break;
                case 96 /* ActionBitAnd */:
                    avm1_0x60_ActionBitAnd(executionContext);
                    break;
                case 99 /* ActionBitLShift */:
                    avm1_0x63_ActionBitLShift(executionContext);
                    break;
                case 97 /* ActionBitOr */:
                    avm1_0x61_ActionBitOr(executionContext);
                    break;
                case 100 /* ActionBitRShift */:
                    avm1_0x64_ActionBitRShift(executionContext);
                    break;
                case 101 /* ActionBitURShift */:
                    avm1_0x65_ActionBitURShift(executionContext);
                    break;
                case 98 /* ActionBitXor */:
                    avm1_0x62_ActionBitXor(executionContext);
                    break;
                case 81 /* ActionDecrement */:
                    avm1_0x51_ActionDecrement(executionContext);
                    break;
                case 80 /* ActionIncrement */:
                    avm1_0x50_ActionIncrement(executionContext);
                    break;
                case 76 /* ActionPushDuplicate */:
                    avm1_0x4C_ActionPushDuplicate(executionContext);
                    break;
                case 62 /* ActionReturn */:
                    avm1_0x3E_ActionReturn(executionContext);
                    break;
                case 77 /* ActionStackSwap */:
                    avm1_0x4D_ActionStackSwap(executionContext);
                    break;
                case 135 /* ActionStoreRegister */:
                    avm1_0x87_ActionStoreRegister(executionContext, args);
                    break;
                case 84 /* ActionInstanceOf */:
                    avm1_0x54_ActionInstanceOf(executionContext);
                    break;
                case 85 /* ActionEnumerate2 */:
                    avm1_0x55_ActionEnumerate2(executionContext);
                    break;
                case 102 /* ActionStrictEquals */:
                    avm1_0x66_ActionStrictEquals(executionContext);
                    break;
                case 103 /* ActionGreater */:
                    avm1_0x67_ActionGreater(executionContext);
                    break;
                case 104 /* ActionStringGreater */:
                    avm1_0x68_ActionStringGreater(executionContext);
                    break;
                case 142 /* ActionDefineFunction2 */:
                    avm1_0x8E_ActionDefineFunction2(executionContext, args);
                    break;
                case 105 /* ActionExtends */:
                    avm1_0x69_ActionExtends(executionContext);
                    break;
                case 43 /* ActionCastOp */:
                    avm1_0x2B_ActionCastOp(executionContext);
                    break;
                case 44 /* ActionImplementsOp */:
                    avm1_0x2C_ActionImplementsOp(executionContext);
                    break;
                case 143 /* ActionTry */:
                    avm1_0x8F_ActionTry(executionContext, args);
                    break;
                case 42 /* ActionThrow */:
                    avm1_0x2A_ActionThrow(executionContext);
                    break;
                case 45 /* ActionFSCommand2 */:
                    avm1_0x2D_ActionFSCommand2(executionContext);
                    break;
                case 137 /* ActionStrictMode */:
                    avm1_0x89_ActionStrictMode(executionContext, args);
                    break;
                case 0 /* None */:
                    executionContext.isEndOfActions = true;
                    break;
                default:
                    throw new Error('Unknown action code: ' + actionCode);
            }
            return shallBranch;
        }
        function interpretActionWithRecovery(executionContext, parsedAction) {
            var currentContext;
            var result;
            try {
                result = interpretAction(executionContext, parsedAction);
                executionContext.recoveringFromError = false;
            }
            catch (e) {
                currentContext = executionContext.context;
                e = as2CastError(e);
                if ((AVM1.avm1ErrorsEnabled.value && !currentContext.isTryCatchListening) || e instanceof AVM1CriticalError) {
                    throw e;
                }
                if (e instanceof AVM1Error) {
                    throw e;
                }
                Telemetry.instance.reportTelemetry({ topic: 'error', error: 1 /* AVM1_ERROR */ });
                if (!executionContext.recoveringFromError) {
                    if (currentContext.errorsIgnored++ >= MAX_AVM1_ERRORS_LIMIT) {
                        throw new AVM1CriticalError('long running script -- AVM1 errors limit is reached');
                    }
                    console.error('AVM1 error: ' + e);
                    var avm2 = Shumway.AVM2.Runtime.AVM2;
                    avm2.instance.exceptions.push({ source: 'avm1', message: e.message, stack: e.stack });
                    executionContext.recoveringFromError = true;
                }
            }
            return result;
        }
        function interpretActions(actionsData, scopeContainer, constantPool, registers) {
            var currentContext = AVM1.AVM1Context.instance;
            if (!actionsData.ir) {
                var parser = new AVM1.ActionsDataParser(actionsData, currentContext.loaderInfo.swfVersion);
                var analyzer = new AVM1.ActionsDataAnalyzer();
                analyzer.registersLimit = registers.length;
                analyzer.parentResults = actionsData.parent && actionsData.parent.ir;
                actionsData.ir = analyzer.analyze(parser);
                if (AVM1.avm1CompilerEnabled.value) {
                    try {
                        var c = new ActionsDataCompiler();
                        actionsData.ir.compiled = c.generate(actionsData.ir);
                    }
                    catch (e) {
                        console.error('Unable to compile AVM1 function: ' + e);
                    }
                }
            }
            var ir = actionsData.ir;
            var compiled = ir.compiled;
            var stack = [];
            var isSwfVersion5 = currentContext.loaderInfo.swfVersion >= 5;
            var actionTracer = ActionTracerFactory.get();
            var scope = scopeContainer.scope;
            var executionContext = {
                context: currentContext,
                global: currentContext.globals,
                scopeContainer: scopeContainer,
                scope: scope,
                actionTracer: actionTracer,
                constantPool: constantPool,
                registers: registers,
                stack: stack,
                frame: null,
                isSwfVersion5: isSwfVersion5,
                recoveringFromError: false,
                isEndOfActions: false
            };
            if (scope._as3Object && scope._as3Object._deferScriptExecution) {
                currentContext.deferScriptExecution = true;
            }
            if (compiled) {
                return compiled(executionContext);
            }
            var instructionsExecuted = 0;
            var abortExecutionAt = currentContext.abortExecutionAt;
            if (AVM1.avm1DebuggerEnabled.value && (AVM1.Debugger.pause || AVM1.Debugger.breakpoints[ir.dataId])) {
                debugger;
            }
            var position = 0;
            var nextAction = ir.actions[position];
            while (nextAction && !executionContext.isEndOfActions) {
                if (instructionsExecuted++ % CHECK_AVM1_HANG_EVERY === 0 && Date.now() >= abortExecutionAt) {
                    throw new AVM1CriticalError('long running script -- AVM1 instruction hang timeout');
                }
                var shallBranch = interpretActionWithRecovery(executionContext, nextAction.action);
                if (shallBranch) {
                    position = nextAction.conditionalJumpTo;
                }
                else {
                    position = nextAction.next;
                }
                nextAction = ir.actions[position];
            }
            return stack.pop();
        }
        var ActionsDataCompiler = (function () {
            function ActionsDataCompiler() {
                if (!ActionsDataCompiler.cachedCalls) {
                    ActionsDataCompiler.cachedCalls = generateActionCalls();
                }
            }
            ActionsDataCompiler.prototype.convertArgs = function (args, id, res, ir) {
                var parts = [];
                for (var i = 0; i < args.length; i++) {
                    var arg = args[i];
                    if (typeof arg === 'object' && arg !== null && !Array.isArray(arg)) {
                        if (arg instanceof AVM1.ParsedPushConstantAction) {
                            if (ir.singleConstantPool) {
                                var constant = ir.singleConstantPool[arg.constantIndex];
                                parts.push(constant === undefined ? 'undefined' : JSON.stringify(constant));
                            }
                            else {
                                var hint = '';
                                var currentConstantPool = res.constantPool;
                                if (currentConstantPool) {
                                    var constant = currentConstantPool[arg.constantIndex];
                                    hint = constant === undefined ? 'undefined' : JSON.stringify(constant);
                                    hint = hint.indexOf('*/') >= 0 ? '' : ' /* ' + hint + ' */';
                                }
                                parts.push('constantPool[' + arg.constantIndex + ']' + hint);
                            }
                        }
                        else if (arg instanceof AVM1.ParsedPushRegisterAction) {
                            var registerNumber = arg.registerNumber;
                            if (registerNumber < 0 || registerNumber >= ir.registersLimit) {
                                parts.push('undefined');
                            }
                            else {
                                parts.push('registers[' + registerNumber + ']');
                            }
                        }
                        else if (arg instanceof AVM1.AVM1ActionsData) {
                            var resName = 'code_' + id + '_' + i;
                            res[resName] = arg;
                            parts.push('res.' + resName);
                        }
                        else {
                            notImplemented('Unknown AVM1 action argument type');
                        }
                    }
                    else if (arg === undefined) {
                        parts.push('undefined');
                    }
                    else {
                        parts.push(JSON.stringify(arg));
                    }
                }
                return parts.join(',');
            };
            ActionsDataCompiler.prototype.convertAction = function (item, id, res, indexInBlock, ir) {
                switch (item.action.actionCode) {
                    case 153 /* ActionJump */:
                    case 62 /* ActionReturn */:
                        return '';
                    case 136 /* ActionConstantPool */:
                        res.constantPool = item.action.args[0];
                        return '  constantPool = [' + this.convertArgs(item.action.args[0], id, res, ir) + '];\n' + '  ectx.constantPool = constantPool;\n';
                    case 150 /* ActionPush */:
                        return '  stack.push(' + this.convertArgs(item.action.args, id, res, ir) + ');\n';
                    case 135 /* ActionStoreRegister */:
                        var registerNumber = item.action.args[0];
                        if (registerNumber < 0 || registerNumber >= ir.registersLimit) {
                            return '';
                        }
                        return '  registers[' + registerNumber + '] = stack[stack.length - 1];\n';
                    case 138 /* ActionWaitForFrame */:
                    case 141 /* ActionWaitForFrame2 */:
                        return '  if (calls.' + item.action.actionName + '(ectx,[' + this.convertArgs(item.action.args, id, res, ir) + '])) { position = ' + item.conditionalJumpTo + '; ' + 'checkTimeAfter -= ' + (indexInBlock + 1) + '; break; }\n';
                    case 157 /* ActionIf */:
                        return '  if (!!stack.pop()) { position = ' + item.conditionalJumpTo + '; ' + 'checkTimeAfter -= ' + (indexInBlock + 1) + '; break; }\n';
                    default:
                        var result = '  calls.' + item.action.actionName + '(ectx' + (item.action.args ? ',[' + this.convertArgs(item.action.args, id, res, ir) + ']' : '') + ');\n';
                        return result;
                }
            };
            ActionsDataCompiler.prototype.checkAvm1Timeout = function (ectx) {
                if (Date.now() >= ectx.context.abortExecutionAt) {
                    throw new AVM1CriticalError('long running script -- AVM1 instruction hang timeout');
                }
            };
            ActionsDataCompiler.prototype.generate = function (ir) {
                var _this = this;
                var blocks = ir.blocks;
                var res = {};
                var uniqueId = 0;
                var debugName = ir.dataId;
                var fn = 'return function avm1gen_' + debugName + '(ectx) {\n' + 'var position = 0;\n' + 'var checkTimeAfter = 0;\n' + 'var constantPool = ectx.constantPool, registers = ectx.registers, stack = ectx.stack;\n';
                if (AVM1.avm1DebuggerEnabled.value) {
                    fn += '/* Running ' + debugName + ' */ ' + 'if (Shumway.AVM1.Debugger.pause || Shumway.AVM1.Debugger.breakpoints.' + debugName + ') { debugger; }\n';
                }
                fn += 'while (!ectx.isEndOfActions) {\n' + 'if (checkTimeAfter <= 0) { checkTimeAfter = ' + CHECK_AVM1_HANG_EVERY + '; checkTimeout(ectx); }\n' + 'switch(position) {\n';
                blocks.forEach(function (b) {
                    fn += ' case ' + b.label + ':\n';
                    b.items.forEach(function (item, index) {
                        fn += _this.convertAction(item, uniqueId++, res, index, ir);
                    });
                    fn += '  position = ' + b.jump + ';\n' + '  checkTimeAfter -= ' + b.items.length + ';\n' + '  break;\n';
                });
                fn += ' default: ectx.isEndOfActions = true; break;\n}\n}\n' + 'return stack.pop();};';
                fn += '//# sourceURL=avm1gen-' + debugName;
                return (new Function('calls', 'res', 'checkTimeout', fn))(ActionsDataCompiler.cachedCalls, res, this.checkAvm1Timeout);
            };
            return ActionsDataCompiler;
        })();
        var ActionTracerFactory = (function () {
            function ActionTracerFactory() {
            }
            ActionTracerFactory.get = function () {
                return AVM1.avm1TraceEnabled.value ? ActionTracerFactory.tracer : ActionTracerFactory.nullTracer;
            };
            ActionTracerFactory.tracer = (function () {
                var indentation = 0;
                return {
                    print: function (parsedAction, stack) {
                        var position = parsedAction.position;
                        var actionCode = parsedAction.actionCode;
                        var actionName = parsedAction.actionName;
                        var stackDump = [];
                        for (var q = 0; q < stack.length; q++) {
                            var item = stack[q];
                            if (item && typeof item === 'object') {
                                var constr = item.asGetPublicProperty('__constructor__');
                                stackDump.push('[' + (constr ? constr.name : 'Object') + ']');
                            }
                            else {
                                stackDump.push(item);
                            }
                        }
                        var indent = new Array(indentation + 1).join('..');
                        console.log('AVM1 trace: ' + indent + position + ': ' + actionName + '(' + actionCode.toString(16) + '), ' + 'stack=' + stackDump);
                    },
                    indent: function () {
                        indentation++;
                    },
                    unindent: function () {
                        indentation--;
                    },
                    message: function (msg) {
                        console.log('AVM1 trace: ------- ' + msg);
                    }
                };
            })();
            ActionTracerFactory.nullTracer = {
                print: function (parsedAction, stack) {
                },
                indent: function () {
                },
                unindent: function () {
                },
                message: function (msg) {
                }
            };
            return ActionTracerFactory;
        })();
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var Lib;
        (function (Lib) {
            var flash = Shumway.AVM2.AS.flash;
            var AVM1EventHandler = (function () {
                function AVM1EventHandler(propertyName, eventName, argsConverter) {
                    if (argsConverter === void 0) { argsConverter = null; }
                    this.propertyName = propertyName;
                    this.eventName = eventName;
                    this.argsConverter = argsConverter;
                }
                AVM1EventHandler.prototype.onBind = function (target) {
                };
                AVM1EventHandler.prototype.onUnbind = function (target) {
                };
                return AVM1EventHandler;
            })();
            Lib.AVM1EventHandler = AVM1EventHandler;
            var AVM1NativeObject = (function () {
                function AVM1NativeObject() {
                }
                Object.defineProperty(AVM1NativeObject.prototype, "context", {
                    get: function () {
                        return this._context;
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1NativeObject.prototype.initAVM1ObjectInstance = function (context) {
                    release || Shumway.Debug.assert(context);
                    this._context = context;
                };
                return AVM1NativeObject;
            })();
            Lib.AVM1NativeObject = AVM1NativeObject;
            var AVM1SymbolBase = (function (_super) {
                __extends(AVM1SymbolBase, _super);
                function AVM1SymbolBase() {
                    _super.apply(this, arguments);
                }
                Object.defineProperty(AVM1SymbolBase.prototype, "isAVM1Instance", {
                    get: function () {
                        return !!this._as3Object;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1SymbolBase.prototype, "as3Object", {
                    get: function () {
                        return this._as3Object;
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1SymbolBase.prototype.initAVM1SymbolInstance = function (context, as3Object) {
                    this.initAVM1ObjectInstance(context);
                    release || Shumway.Debug.assert(as3Object);
                    this._as3Object = as3Object;
                };
                AVM1SymbolBase.prototype.bindEvents = function (events, autoUnbind) {
                    if (autoUnbind === void 0) { autoUnbind = true; }
                    this._events = events;
                    var eventsMap = Object.create(null);
                    this._eventsMap = eventsMap;
                    this._eventsListeners = Object.create(null);
                    var observer = this;
                    var context = this.context;
                    events.forEach(function (event) {
                        eventsMap[event.propertyName] = event;
                        context.registerEventPropertyObserver(event.propertyName, observer);
                        observer._updateEvent(event);
                    });
                    if (autoUnbind) {
                        observer.as3Object.addEventListener('removedFromStage', function removedHandler() {
                            observer.as3Object.removeEventListener('removedFromStage', removedHandler);
                            observer.unbindEvents();
                        });
                    }
                };
                AVM1SymbolBase.prototype.unbindEvents = function () {
                    var events = this._events;
                    var observer = this;
                    var context = this.context;
                    events.forEach(function (event) {
                        context.unregisterEventPropertyObserver(event.propertyName, observer);
                        observer._removeEventListener(event);
                    });
                    this._events = null;
                    this._eventsMap = null;
                    this._eventsListeners = null;
                };
                AVM1SymbolBase.prototype.updateAllEvents = function () {
                    this._events.forEach(function (event) {
                        this._updateEvent(event);
                    }, this);
                };
                AVM1SymbolBase.prototype._updateEvent = function (event) {
                    if (avm1HasEventProperty(this.context, this, event.propertyName)) {
                        this._addEventListener(event);
                    }
                    else {
                        this._removeEventListener(event);
                    }
                };
                AVM1SymbolBase.prototype._addEventListener = function (event) {
                    var listener = this._eventsListeners[event.propertyName];
                    if (!listener) {
                        listener = function avm1EventHandler() {
                            var args = event.argsConverter ? event.argsConverter.apply(null, arguments) : null;
                            avm1BroadcastEvent(this.context, this, event.propertyName, args);
                        }.bind(this);
                        this.as3Object.addEventListener(event.eventName, listener);
                        event.onBind(this);
                        this._eventsListeners[event.propertyName] = listener;
                    }
                };
                AVM1SymbolBase.prototype._removeEventListener = function (event) {
                    var listener = this._eventsListeners[event.propertyName];
                    if (listener) {
                        event.onUnbind(this);
                        this.as3Object.removeEventListener(event.eventName, listener);
                        this._eventsListeners[event.propertyName] = null;
                    }
                };
                AVM1SymbolBase.prototype.onEventPropertyModified = function (propertyName) {
                    var event = this._eventsMap[propertyName];
                    this._updateEvent(event);
                };
                return AVM1SymbolBase;
            })(AVM1NativeObject);
            Lib.AVM1SymbolBase = AVM1SymbolBase;
            function avm1HasEventProperty(context, target, propertyName) {
                if (context.utils.hasProperty(target, propertyName)) {
                    return true;
                }
                var _listeners = context.utils.getProperty(target, '_listeners');
                if (!_listeners) {
                    return false;
                }
                return _listeners.some(function (listener) {
                    return context.utils.hasProperty(listener, propertyName);
                });
            }
            Lib.avm1HasEventProperty = avm1HasEventProperty;
            function avm1BroadcastEvent(context, target, propertyName, args) {
                if (args === void 0) { args = null; }
                var handler = context.utils.getProperty(target, propertyName);
                if (Shumway.isFunction(handler)) {
                    handler.apply(target, args);
                }
                var _listeners = context.utils.getProperty(this, '_listeners');
                if (Array.isArray(_listeners)) {
                    _listeners.forEach(function (listener) {
                        var handlerOnListener = context.utils.getProperty(listener, propertyName);
                        if (Shumway.isFunction(handlerOnListener)) {
                            handlerOnListener.apply(target, args);
                        }
                    });
                }
            }
            Lib.avm1BroadcastEvent = avm1BroadcastEvent;
            var AVM1Utils = (function () {
                function AVM1Utils() {
                }
                AVM1Utils.addProperty = function (obj, propertyName, getter, setter, enumerable) {
                    if (enumerable === void 0) { enumerable = true; }
                    obj.asDefinePublicProperty(propertyName, {
                        get: getter,
                        set: setter || undefined,
                        enumerable: enumerable,
                        configurable: true
                    });
                };
                AVM1Utils.resolveTarget = function (target_mc) {
                    if (target_mc === void 0) { target_mc = undefined; }
                    return AVM1.AVM1Context.instance.resolveTarget(target_mc);
                };
                AVM1Utils.resolveMovieClip = function (target) {
                    if (target === void 0) { target = undefined; }
                    return target ? AVM1.AVM1Context.instance.resolveTarget(target) : undefined;
                };
                AVM1Utils.resolveLevel = function (level) {
                    level = +level;
                    return AVM1.AVM1Context.instance.resolveLevel(level);
                };
                Object.defineProperty(AVM1Utils, "currentStage", {
                    get: function () {
                        return AVM1.AVM1Context.instance.root.as3Object.stage;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Utils, "swfVersion", {
                    get: function () {
                        return AVM1.AVM1Context.instance.loaderInfo.swfVersion;
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1Utils.getTarget = function (mc) {
                    var nativeObject = mc.as3Object;
                    if (nativeObject === nativeObject.root) {
                        return '/';
                    }
                    var path = '';
                    do {
                        path = '/' + nativeObject.name + path;
                        nativeObject = nativeObject.parent;
                    } while (nativeObject !== nativeObject.root);
                    return path;
                };
                return AVM1Utils;
            })();
            Lib.AVM1Utils = AVM1Utils;
            function createAVM1Object(ctor, nativeObject, context) {
                var proto = ctor.prototype;
                while (proto && !proto.initAVM1SymbolInstance) {
                    proto = proto.asGetPublicProperty('__proto__');
                }
                release || Shumway.Debug.assert(proto);
                var avm1Object = Object.create(proto);
                avm1Object.asSetPublicProperty('__proto__', ctor.asGetPublicProperty('prototype'));
                avm1Object.asDefinePublicProperty('__constructor__', {
                    value: ctor,
                    writable: true,
                    enumerable: false,
                    configurable: false
                });
                nativeObject._as2Object = avm1Object;
                avm1Object.initAVM1SymbolInstance(context, nativeObject);
                ctor.call(avm1Object);
                return avm1Object;
            }
            function getAVM1Object(as3Object, context) {
                if (!as3Object) {
                    return null;
                }
                if (as3Object._as2Object) {
                    return as3Object._as2Object;
                }
                if (flash.display.MovieClip.isType(as3Object)) {
                    if (as3Object._avm1SymbolClass) {
                        return createAVM1Object(as3Object._avm1SymbolClass, as3Object, context);
                    }
                    return createAVM1Object(context.globals.MovieClip, as3Object, context);
                }
                if (flash.display.SimpleButton.isType(as3Object)) {
                    return createAVM1Object(context.globals.Button, as3Object, context);
                }
                if (flash.text.TextField.isType(as3Object)) {
                    return createAVM1Object(context.globals.TextField, as3Object, context);
                }
                if (flash.display.BitmapData.isType(as3Object)) {
                    return new as3Object;
                }
                return null;
            }
            Lib.getAVM1Object = getAVM1Object;
            function wrapAVM1Object(obj, members) {
                var wrap;
                if (typeof obj === 'function') {
                    wrap = function () {
                        return obj.apply(this, arguments);
                    };
                    Object.getOwnPropertyNames(obj).forEach(function (name) {
                        if (wrap.hasOwnProperty(name)) {
                            return;
                        }
                        Object.defineProperty(wrap, name, Object.getOwnPropertyDescriptor(obj, name));
                    });
                }
                else {
                    Shumway.Debug.assert(typeof obj === 'object' && obj !== null);
                    wrap = Object.create(obj);
                }
                if (!members) {
                    return wrap;
                }
                members.forEach(function (memberName) {
                    var definedAs = memberName;
                    var i = memberName.indexOf('=>');
                    if (i >= 0) {
                        definedAs = memberName.substring(0, i);
                        memberName = memberName.substring(i + 2);
                    }
                    var getter = function () {
                        return this[memberName];
                    };
                    var setter = function (value) {
                        this[memberName] = value;
                    };
                    wrap.asDefinePublicProperty(definedAs, {
                        get: getter,
                        set: setter,
                        enumerable: false,
                        configurable: true
                    });
                });
                return wrap;
            }
            Lib.wrapAVM1Object = wrapAVM1Object;
            function wrapAVM1Class(fn, staticMembers, members) {
                var wrappedFn = wrapAVM1Object(fn, staticMembers);
                var prototype = fn.prototype;
                var wrappedPrototype = wrapAVM1Object(prototype, members);
                wrappedFn.asSetPublicProperty('prototype', wrappedPrototype);
                return wrappedFn;
            }
            Lib.wrapAVM1Class = wrapAVM1Class;
            var isAvm1ObjectMethodsInstalled = false;
            function installObjectMethods() {
                if (isAvm1ObjectMethodsInstalled) {
                    return;
                }
                isAvm1ObjectMethodsInstalled = true;
                var c = Shumway.AVM2.AS.ASObject, p = c.asGetPublicProperty('prototype');
                c.asSetPublicProperty('registerClass', function registerClass(name, theClass) {
                    AVM1.AVM1Context.instance.registerClass(name, theClass);
                });
                p.asDefinePublicProperty('addProperty', {
                    value: function addProperty(name, getter, setter) {
                        if (typeof name !== 'string' || name === '') {
                            return false;
                        }
                        if (typeof getter !== 'function') {
                            return false;
                        }
                        if (typeof setter !== 'function' && setter !== null) {
                            return false;
                        }
                        this.asDefinePublicProperty(name, {
                            get: getter,
                            set: setter || undefined,
                            configurable: true,
                            enumerable: true
                        });
                        return true;
                    },
                    writable: false,
                    enumerable: false,
                    configurable: false
                });
                Object.defineProperty(p, '__proto__avm1', {
                    value: null,
                    writable: true,
                    enumerable: false
                });
                p.asDefinePublicProperty('__proto__', {
                    get: function () {
                        return this.__proto__avm1;
                    },
                    set: function (proto) {
                        if (proto === this.__proto__avm1) {
                            return;
                        }
                        if (!proto) {
                            this.__proto__avm1 = null;
                            return;
                        }
                        var p = proto;
                        while (p) {
                            if (p === this) {
                                return;
                            }
                            p = p.__proto__avm1;
                        }
                        this.__proto__avm1 = proto;
                    },
                    enumerable: false,
                    configurable: false
                });
            }
            Lib.installObjectMethods = installObjectMethods;
            function initializeAVM1Object(as3Object, context, placeObjectTag) {
                var instanceAVM1 = getAVM1Object(as3Object, context);
                release || Shumway.Debug.assert(instanceAVM1);
                if (placeObjectTag.variableName) {
                    instanceAVM1.asSetPublicProperty('variable', placeObjectTag.variableName);
                }
                var events = placeObjectTag.events;
                if (!events) {
                    return;
                }
                for (var j = 0; j < events.length; j++) {
                    var swfEvent = events[j];
                    var actionsData;
                    if (swfEvent.actionsData) {
                        actionsData = new AVM1.AVM1ActionsData(swfEvent.actionsData, 's' + placeObjectTag.symbolId + 'e' + j);
                        swfEvent.actionsData = null;
                        swfEvent.compiled = actionsData;
                    }
                    else {
                        actionsData = swfEvent.compiled;
                    }
                    release || Shumway.Debug.assert(actionsData);
                    var handler = clipEventHandler.bind(null, actionsData, instanceAVM1);
                    var flags = swfEvent.flags;
                    for (var eventFlag in ClipEventMappings) {
                        eventFlag |= 0;
                        if (!(flags & (eventFlag | 0))) {
                            continue;
                        }
                        var eventName = ClipEventMappings[eventFlag];
                        switch (eventFlag) {
                            case 2048 /* Release */:
                            case 4096 /* ReleaseOutside */:
                            case 8192 /* RollOver */:
                            case 16384 /* RollOut */:
                                as3Object.buttonMode = true;
                        }
                        as3Object.addEventListener(eventName, handler);
                    }
                }
            }
            Lib.initializeAVM1Object = initializeAVM1Object;
            function clipEventHandler(actionsData, receiver) {
                return receiver.context.executeActions(actionsData, receiver);
            }
            var AVM1ClipEvents = Shumway.SWF.Parser.AVM1ClipEvents;
            var ClipEventMappings = Object.create(null);
            ClipEventMappings[1 /* Load */] = 'load';
            ClipEventMappings[2 /* EnterFrame */] = 'frameConstructed';
            ClipEventMappings[4 /* Unload */] = 'unload';
            ClipEventMappings[8 /* MouseMove */] = 'mouseMove';
            ClipEventMappings[16 /* MouseDown */] = 'mouseDown';
            ClipEventMappings[32 /* MouseUp */] = 'mouseUp';
            ClipEventMappings[64 /* KeyDown */] = 'keyDown';
            ClipEventMappings[128 /* KeyUp */] = 'keyUp';
            ClipEventMappings[256 /* Data */] = { toString: function () {
                Shumway.Debug.warning('Data ClipEvent not implemented');
            } };
            ClipEventMappings[512 /* Initialize */] = 'initialize';
            ClipEventMappings[1024 /* Press */] = 'mouseDown';
            ClipEventMappings[2048 /* Release */] = 'click';
            ClipEventMappings[4096 /* ReleaseOutside */] = 'releaseOutside';
            ClipEventMappings[8192 /* RollOver */] = 'mouseOver';
            ClipEventMappings[16384 /* RollOut */] = 'mouseOut';
            ClipEventMappings[32768 /* DragOver */] = { toString: function () {
                Shumway.Debug.warning('DragOver ClipEvent not implemented');
            } };
            ClipEventMappings[65536 /* DragOut */] = { toString: function () {
                Shumway.Debug.warning('DragOut ClipEvent not implemented');
            } };
            ClipEventMappings[131072 /* KeyPress */] = { toString: function () {
                Shumway.Debug.warning('KeyPress ClipEvent not implemented');
            } };
            ClipEventMappings[262144 /* Construct */] = 'construct';
        })(Lib = AVM1.Lib || (AVM1.Lib = {}));
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var Lib;
        (function (Lib) {
            var notImplemented = Shumway.Debug.notImplemented;
            var somewhatImplemented = Shumway.Debug.somewhatImplemented;
            var forEachPublicProperty = Shumway.AVM2.Runtime.forEachPublicProperty;
            var assert = Shumway.Debug.assert;
            var flash = Shumway.AVM2.AS.flash;
            var _escape = jsGlobal.escape;
            var _internalTimeouts = [];
            var AVM1Globals = (function () {
                function AVM1Globals(context) {
                    this.fscommand = flash.system.FSCommand._fscommand;
                    this.getTimer = Shumway.AVM2.AS.FlashUtilScript_getTimer;
                    this.NaN = Number.NaN;
                    this.Infinity = Number.POSITIVE_INFINITY;
                    this.isFinite = isFinite;
                    this.isNaN = isNaN;
                    this.parseFloat = parseFloat;
                    this.parseInt = parseInt;
                    this.Object = Shumway.AVM2.AS.ASObject;
                    this.Function = Shumway.AVM2.AS.ASFunction;
                    this.Array = Shumway.AVM2.AS.ASArray;
                    this.Number = Shumway.AVM2.AS.ASNumber;
                    this.Math = Shumway.AVM2.AS.ASMath;
                    this.Boolean = Shumway.AVM2.AS.ASBoolean;
                    this.Date = Shumway.AVM2.AS.ASDate;
                    this.RegExp = Shumway.AVM2.AS.ASRegExp;
                    this.String = Shumway.AVM2.AS.ASString;
                    this.undefined = undefined;
                    this.MovieClip = Lib.AVM1MovieClip.createAVM1Class();
                    this.AsBroadcaster = Lib.AVM1Broadcaster.createAVM1Class();
                    this.System = Lib.AVM1System.createAVM1Class();
                    this.Stage = Lib.AVM1Stage.createAVM1Class();
                    this.Button = Lib.AVM1Button.createAVM1Class();
                    this.TextField = Lib.AVM1TextField.createAVM1Class();
                    this.Color = Lib.AVM1Color.createAVM1Class();
                    this.Key = Lib.AVM1Key.createAVM1Class();
                    this.Mouse = Lib.AVM1Mouse.createAVM1Class();
                    this.MovieClipLoader = Lib.AVM1MovieClipLoader.createAVM1Class();
                    this.Sound = Lib.AVM1Sound.createAVM1Class();
                    this.SharedObject = flash.net.SharedObject;
                    this.ContextMenu = flash.ui.ContextMenu;
                    this.ContextMenuItem = flash.ui.ContextMenuItem;
                    this.TextFormat = Lib.AVM1TextFormat.createAVM1Class();
                    AVM1Globals.instance = this;
                    this._global = this;
                    var classes = ['Object', 'Function', 'Array', 'Number', 'Math', 'Boolean', 'Date', 'RegExp', 'String'];
                    classes.forEach(function (className) {
                        Shumway.AVM2.Runtime.AVM2.instance.systemDomain.getClass(className);
                    });
                    var swfVersion = context.loaderInfo.swfVersion;
                    if (swfVersion >= 8) {
                        this._initializeFlashObject();
                    }
                    this.AsBroadcaster.initializeWithContext(this.Stage, context);
                    this.AsBroadcaster.initializeWithContext(this.Key, context);
                    this.AsBroadcaster.initializeWithContext(this.Mouse, context);
                }
                AVM1Globals.createAVM1Class = function () {
                    return Lib.wrapAVM1Class(AVM1Globals, [], ['_global', 'flash', 'ASSetPropFlags', 'call', 'chr', 'clearInterval', 'clearTimeout', 'duplicateMovieClip', 'fscommand', 'escape', 'unescape', 'getTimer', 'getURL', 'getVersion', 'gotoAndPlay', 'gotoAndStop', 'ifFrameLoaded', 'int', 'length=>length_', 'loadMovie', 'loadMovieNum', 'loadVariables', 'loadVariablesNum', 'mbchr', 'mblength', 'mbord', 'mbsubstring', 'nextFrame', 'nextScene', 'ord', 'play', 'prevFrame', 'prevScene', 'print', 'printAsBitmap', 'printAsBitmapNum', 'printNum', 'random', 'removeMovieClip', 'setInterval', 'setTimeout', 'showRedrawRegions', 'startDrag', 'stop', 'stopDrag', 'substring', 'targetPath', 'toggleHighQuality', 'trace', 'unloadMovie', 'unloadMovieNum', 'updateAfterEvent', 'NaN', 'Infinity', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'undefined', 'Object', 'Function', 'Array', 'Number', 'Math', 'Boolean', 'Date', 'RegExp', 'String', 'MovieClip', 'AsBroadcaster', 'System', 'Stage', 'Button', 'TextField', 'Color', 'Key', 'Mouse', 'MovieClipLoader', 'Sound', 'SharedObject', 'ContextMenu', 'ContextMenuItem', 'TextFormat', 'toString', '$asfunction=>asfunction']);
                };
                AVM1Globals.prototype.asfunction = function (link) {
                    notImplemented('AVM1Globals.$asfunction');
                };
                AVM1Globals.prototype.ASSetPropFlags = function (obj, children, flags, allowFalse) {
                };
                AVM1Globals.prototype.call = function (frame) {
                    var nativeTarget = Lib.AVM1Utils.resolveTarget();
                    var as3Object = nativeTarget.as3Object;
                    var frameNum = as3Object._getAbsFrameNumber(frame, null);
                    if (frameNum === undefined) {
                        return;
                    }
                    as3Object.callFrame(frameNum);
                };
                AVM1Globals.prototype.chr = function (number) {
                    return String.fromCharCode(number);
                };
                AVM1Globals.prototype.clearInterval = function (id) {
                    var internalId = _internalTimeouts[id - 1];
                    if (internalId) {
                        clearInterval(internalId);
                        delete _internalTimeouts[id - 1];
                    }
                };
                AVM1Globals.prototype.clearTimeout = function (id) {
                    var internalId = _internalTimeouts[id - 1];
                    if (internalId) {
                        clearTimeout(internalId);
                        delete _internalTimeouts[id - 1];
                    }
                };
                AVM1Globals.prototype.duplicateMovieClip = function (target, newname, depth) {
                    var nativeTarget = Lib.AVM1Utils.resolveTarget(target);
                    nativeTarget.duplicateMovieClip(newname, depth, null);
                };
                AVM1Globals.prototype.getAVM1Property = function (target, index) {
                    var nativeTarget = Lib.AVM1Utils.resolveTarget(target);
                    return nativeTarget[PropertiesIndexMap[index]];
                };
                AVM1Globals.prototype.getURL = function (url, target, method) {
                    var request = new flash.net.URLRequest(String(url));
                    if (method) {
                        request.method = method;
                    }
                    if (typeof target === 'string' && target.indexOf('_level') === 0) {
                        this.loadMovieNum(url, +target.substr(6), method);
                        return;
                    }
                    Shumway.AVM2.AS.FlashNetScript_navigateToURL(request, target);
                };
                AVM1Globals.prototype.getVersion = function () {
                    return flash.system.Capabilities.version;
                };
                AVM1Globals.prototype._addToPendingScripts = function (subject, fn, args) {
                    if (args === void 0) { args = null; }
                    release || assert(fn, 'invalid function in _addToPendingScripts');
                    var currentContext = AVM1.AVM1Context.instance;
                    var defaultTarget = currentContext.resolveTarget(undefined);
                    currentContext.addToPendingScripts(function () {
                        currentContext.enterContext(function () {
                            try {
                                fn.apply(subject, args);
                            }
                            catch (ex) {
                                console.error('AVM1 pending script error: ' + ex.message);
                            }
                        }, defaultTarget);
                    });
                };
                AVM1Globals.prototype.escape = function (str) {
                    var result = encodeURIComponent(str);
                    return result.replace(/!|'|\(|\)|\*|-|\.|_|~/g, function (char) {
                        switch (char) {
                            case '*':
                                return '%2A';
                            case '-':
                                return '%2D';
                            case '.':
                                return '%2E';
                            case '_':
                                return '%5F';
                            default:
                                return _escape(char);
                        }
                    });
                };
                AVM1Globals.prototype.unescape = function (str) {
                    return decodeURIComponent(str);
                };
                AVM1Globals.prototype.gotoAndPlay = function (scene, frame) {
                    var nativeTarget = Lib.AVM1Utils.resolveTarget();
                    if (arguments.length < 2) {
                        this._addToPendingScripts(nativeTarget, nativeTarget.gotoAndPlay, [arguments[0]]);
                    }
                    else {
                        this._addToPendingScripts(nativeTarget, nativeTarget.gotoAndPlay, [arguments[1], arguments[0]]);
                    }
                };
                AVM1Globals.prototype.gotoAndStop = function (scene, frame) {
                    var nativeTarget = Lib.AVM1Utils.resolveTarget();
                    if (arguments.length < 2) {
                        this._addToPendingScripts(nativeTarget, nativeTarget.gotoAndStop, [arguments[0]]);
                    }
                    else {
                        this._addToPendingScripts(nativeTarget, nativeTarget.gotoAndStop, [arguments[1], arguments[0]]);
                    }
                };
                AVM1Globals.prototype.ifFrameLoaded = function (scene, frame) {
                    var nativeTarget = Lib.AVM1Utils.resolveTarget();
                    var frameNum = arguments.length < 2 ? arguments[0] : arguments[1];
                    var framesLoaded = nativeTarget._framesloaded;
                    var totalFrames = nativeTarget._totalframes;
                    return Math.min(frameNum + 1, totalFrames) <= framesLoaded;
                };
                AVM1Globals.prototype.int = function (value) {
                    return value | 0;
                };
                AVM1Globals.prototype.length_ = function (expression) {
                    return ('' + expression).length;
                };
                AVM1Globals.prototype.loadMovie = function (url, target, method) {
                    if (url && url.toLowerCase().indexOf('fscommand:') === 0) {
                        this.fscommand(url.substring('fscommand:'.length), target);
                        return;
                    }
                    var loadLevel = typeof target === 'string' && target.indexOf('_level') === 0;
                    var levelNumber;
                    if (loadLevel) {
                        var levelStr = target.charAt(6);
                        levelNumber = parseInt(levelStr, 10);
                        loadLevel = levelNumber.toString() === levelStr;
                    }
                    var loader = new flash.display.Loader();
                    if (loadLevel) {
                        this._setLevel(levelNumber, loader);
                        var request = new flash.net.URLRequest(url);
                        if (method) {
                            request.method = method;
                        }
                        loader.load(request);
                    }
                    else {
                        var nativeTarget = Lib.AVM1Utils.resolveTarget(target);
                        nativeTarget.loadMovie(url, method);
                    }
                };
                AVM1Globals.prototype._setLevel = function (level, loader) {
                    level = level >>> 0;
                };
                AVM1Globals.prototype.loadMovieNum = function (url, level, method) {
                    if (url && url.toLowerCase().indexOf('fscommand:') === 0) {
                        return this.fscommand(url.substring('fscommand:'.length));
                    }
                    var loader = new flash.display.Loader();
                    this._setLevel(level, loader);
                    var request = new flash.net.URLRequest(url);
                    if (method) {
                        request.method = method;
                    }
                    loader.load(request);
                };
                AVM1Globals.prototype.loadVariables = function (url, target, method) {
                    if (method === void 0) { method = ''; }
                    var nativeTarget = Lib.AVM1Utils.resolveTarget(target);
                    this._loadVariables(nativeTarget, url, method);
                };
                AVM1Globals.prototype.loadVariablesNum = function (url, level, method) {
                    if (method === void 0) { method = ''; }
                    var nativeTarget = Lib.AVM1Utils.resolveLevel(level);
                    this._loadVariables(nativeTarget, url, method);
                };
                AVM1Globals.prototype._loadVariables = function (nativeTarget, url, method) {
                    var request = new flash.net.URLRequest(url);
                    if (method) {
                        request.method = method;
                    }
                    var context = AVM1.AVM1Context.instance;
                    var loader = new flash.net.URLLoader(request);
                    loader._ignoreDecodeErrors = true;
                    loader.dataFormat = 'variables';
                    function completeHandler(event) {
                        loader.removeEventListener(flash.events.Event.COMPLETE, completeHandler);
                        release || Shumway.Debug.assert(typeof loader.data === 'object');
                        forEachPublicProperty(loader.data, function (key, value) {
                            context.utils.setProperty(nativeTarget, key, value);
                        });
                        if (nativeTarget instanceof Lib.AVM1MovieClip) {
                            Lib.avm1BroadcastEvent(context, nativeTarget, 'onData');
                        }
                    }
                    loader.addEventListener(flash.events.Event.COMPLETE, completeHandler);
                };
                AVM1Globals.prototype.mbchr = function (number) {
                    return String.fromCharCode(number);
                };
                AVM1Globals.prototype.mblength = function (expression) {
                    return ('' + expression).length;
                };
                AVM1Globals.prototype.mbord = function (character) {
                    return ('' + character).charCodeAt(0);
                };
                AVM1Globals.prototype.mbsubstring = function (value, index, count) {
                    if (index !== (0 | index) || count !== (0 | count)) {
                        return '';
                    }
                    return ('' + value).substr(index, count);
                };
                AVM1Globals.prototype.nextFrame = function () {
                    var nativeTarget = Lib.AVM1Utils.resolveTarget();
                    this._addToPendingScripts(nativeTarget, nativeTarget.nextFrame);
                };
                AVM1Globals.prototype.nextScene = function () {
                    var nativeTarget = Lib.AVM1Utils.resolveTarget();
                    this._addToPendingScripts(nativeTarget, nativeTarget.nextScene);
                };
                AVM1Globals.prototype.ord = function (character) {
                    return ('' + character).charCodeAt(0);
                };
                AVM1Globals.prototype.play = function () {
                    var nativeTarget = Lib.AVM1Utils.resolveTarget();
                    nativeTarget.play();
                };
                AVM1Globals.prototype.prevFrame = function () {
                    var nativeTarget = Lib.AVM1Utils.resolveTarget();
                    this._addToPendingScripts(nativeTarget, nativeTarget.prevFrame);
                };
                AVM1Globals.prototype.prevScene = function () {
                    var nativeTarget = Lib.AVM1Utils.resolveTarget();
                    this._addToPendingScripts(nativeTarget, nativeTarget.prevScene);
                };
                AVM1Globals.prototype.print = function (target, boundingBox) {
                    notImplemented('AVM1Globals.print');
                };
                AVM1Globals.prototype.printAsBitmap = function (target, boundingBox) {
                    notImplemented('AVM1Globals.printAsBitmap');
                };
                AVM1Globals.prototype.printAsBitmapNum = function (level, boundingBox) {
                    notImplemented('AVM1Globals.printAsBitmapNum');
                };
                AVM1Globals.prototype.printNum = function (level, bondingBox) {
                    notImplemented('AVM1Globals.printNum');
                };
                AVM1Globals.prototype.random = function (value) {
                    return 0 | (Math.random() * (0 | value));
                };
                AVM1Globals.prototype.removeMovieClip = function (target) {
                    var nativeTarget = Lib.AVM1Utils.resolveTarget(target);
                    nativeTarget.removeMovieClip();
                };
                AVM1Globals.prototype.setInterval = function () {
                    if (arguments.length < 2) {
                        return undefined;
                    }
                    var args = [];
                    if (typeof arguments[0] === 'function') {
                        args = arguments;
                    }
                    else {
                        if (arguments.length < 3) {
                            return undefined;
                        }
                        var obj = arguments[0];
                        var funName = arguments[1];
                        if (!(obj && typeof obj === 'object' && typeof funName === 'string')) {
                            return undefined;
                        }
                        args[0] = function () {
                            obj.asCallPublicProperty(funName, arguments);
                        };
                        for (var i = 2; i < arguments.length; i++) {
                            args.push(arguments[i]);
                        }
                    }
                    args[1] |= 0;
                    var internalId = setInterval.apply(null, args);
                    return _internalTimeouts.push(internalId);
                };
                AVM1Globals.prototype.setAVM1Property = function (target, index, value) {
                    var nativeTarget = Lib.AVM1Utils.resolveTarget(target);
                    nativeTarget[PropertiesIndexMap[index]] = value;
                };
                AVM1Globals.prototype.setTimeout = function () {
                    if (arguments.length < 2 || typeof arguments[0] !== 'function') {
                        return undefined;
                    }
                    arguments[1] |= 0;
                    var internalId = setTimeout.apply(null, arguments);
                    return _internalTimeouts.push(internalId);
                };
                AVM1Globals.prototype.showRedrawRegions = function (enable, color) {
                    notImplemented('AVM1Globals.showRedrawRegions');
                };
                AVM1Globals.prototype.startDrag = function (target, lock, left, top, right, bottom) {
                    var nativeTarget = Lib.AVM1Utils.resolveTarget(target);
                    nativeTarget.startDrag(lock, arguments.length < 3 ? null : new flash.geom.Rectangle(left, top, right - left, bottom - top));
                };
                AVM1Globals.prototype.stop = function () {
                    var nativeTarget = Lib.AVM1Utils.resolveTarget();
                    nativeTarget.stop();
                };
                AVM1Globals.prototype.stopAllSounds = function () {
                    flash.media.SoundMixer.stopAll();
                };
                AVM1Globals.prototype.stopDrag = function (target) {
                    var nativeTarget = Lib.AVM1Utils.resolveTarget(target);
                    nativeTarget.stopDrag();
                };
                AVM1Globals.prototype.substring = function (value, index, count) {
                    return this.mbsubstring(value, index, count);
                };
                AVM1Globals.prototype.targetPath = function (target) {
                    var nativeTarget = Lib.AVM1Utils.resolveTarget(target);
                    return nativeTarget._target;
                };
                AVM1Globals.prototype.toggleHighQuality = function () {
                    notImplemented('AVM1Globals.toggleHighQuality');
                };
                AVM1Globals.prototype.trace = function (expression) {
                    Shumway.AVM2.AS.Natives.print(expression);
                };
                AVM1Globals.prototype.unloadMovie = function (target) {
                    var nativeTarget = Lib.AVM1Utils.resolveTarget(target);
                    nativeTarget.unloadMovie();
                };
                AVM1Globals.prototype.unloadMovieNum = function (level) {
                    var nativeTarget = Lib.AVM1Utils.resolveLevel(level);
                    nativeTarget.unloadMovie();
                };
                AVM1Globals.prototype.updateAfterEvent = function () {
                    somewhatImplemented('AVM1Globals.updateAfterEvent');
                };
                AVM1Globals.prototype._initializeFlashObject = function () {
                    this.flash = {};
                    this.flash.asSetPublicProperty('_MovieClip', this.MovieClip);
                    var display = {};
                    display.asSetPublicProperty('BitmapData', Lib.AVM1BitmapData.createAVM1Class());
                    this.flash.asSetPublicProperty('display', display);
                    var external = {};
                    external.asSetPublicProperty('ExternalInterface', Lib.AVM1ExternalInterface.createAVM1Class());
                    this.flash.asSetPublicProperty('external', external);
                    var filters = {};
                    this.flash.asSetPublicProperty('filters', filters);
                    var geom = {};
                    geom.asSetPublicProperty('ColorTransform', flash.geom.ColorTransform);
                    geom.asSetPublicProperty('Matrix', flash.geom.Matrix);
                    geom.asSetPublicProperty('Point', flash.geom.Point);
                    geom.asSetPublicProperty('Rectangle', flash.geom.Rectangle);
                    geom.asSetPublicProperty('Transform', Lib.AVM1Transform.createAVM1Class());
                    this.flash.asSetPublicProperty('geom', geom);
                    var text = {};
                    this.flash.asSetPublicProperty('text', text);
                };
                AVM1Globals.prototype.toString = function () {
                    return '[type Object]';
                };
                return AVM1Globals;
            })();
            Lib.AVM1Globals = AVM1Globals;
            var PropertiesIndexMap = [
                '_x',
                '_y',
                '_xscale',
                '_yscale',
                '_currentframe',
                '_totalframes',
                '_alpha',
                '_visible',
                '_width',
                '_height',
                '_rotation',
                '_target',
                '_framesloaded',
                '_name',
                '_droptarget',
                '_url',
                '_highquality',
                '_focusrect',
                '_soundbuftime',
                '_quality',
                '_xmouse',
                '_ymouse'
            ];
        })(Lib = AVM1.Lib || (AVM1.Lib = {}));
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var Lib;
        (function (Lib) {
            function _updateAllSymbolEvents(symbolInstance) {
                if (!symbolInstance.isAVM1Instance) {
                    return;
                }
                symbolInstance.updateAllEvents();
            }
            var AVM1Broadcaster = (function () {
                function AVM1Broadcaster() {
                }
                AVM1Broadcaster.setAVM1Context = function (context) {
                    this._context = context;
                };
                AVM1Broadcaster.createAVM1Class = function () {
                    return Lib.wrapAVM1Class(AVM1Broadcaster, ['initialize'], []);
                };
                AVM1Broadcaster.initialize = function (obj) {
                    AVM1Broadcaster.initializeWithContext(obj, AVM1.AVM1Context.instance);
                };
                AVM1Broadcaster.initializeWithContext = function (obj, context) {
                    obj.asSetPublicProperty('_listeners', []);
                    obj.asSetPublicProperty('broadcastMessage', function broadcastMessage(eventName) {
                        var args = [];
                        for (var _i = 1; _i < arguments.length; _i++) {
                            args[_i - 1] = arguments[_i];
                        }
                        Lib.avm1BroadcastEvent(context, this, eventName, args);
                    });
                    obj.asSetPublicProperty('addListener', function addListener(listener) {
                        var listeners = context.utils.getProperty(this, '_listeners');
                        listeners.push(listener);
                        _updateAllSymbolEvents(this);
                    });
                    obj.asSetPublicProperty('removeListener', function removeListener(listener) {
                        var listeners = context.utils.getProperty(this, '_listeners');
                        var i = listeners.indexOf(listener);
                        if (i < 0) {
                            return false;
                        }
                        listeners.splice(i, 1);
                        _updateAllSymbolEvents(this);
                        return true;
                    });
                };
                return AVM1Broadcaster;
            })();
            Lib.AVM1Broadcaster = AVM1Broadcaster;
        })(Lib = AVM1.Lib || (AVM1.Lib = {}));
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var Lib;
        (function (Lib) {
            var AVM1Key = (function () {
                function AVM1Key() {
                }
                AVM1Key.createAVM1Class = function () {
                    return Lib.wrapAVM1Class(AVM1Key, ['DOWN', 'LEFT', 'RIGHT', 'UP', 'isDown'], []);
                };
                AVM1Key._bind = function (stage, context) {
                    stage.addEventListener('keyDown', function (e) {
                        var keyCode = e.asGetPublicProperty('keyCode');
                        AVM1Key._lastKeyCode = keyCode;
                        AVM1Key._keyStates[keyCode] = 1;
                        context.globals.Key.asCallPublicProperty('broadcastMessage', ['onKeyDown']);
                    }, false);
                    stage.addEventListener('keyUp', function (e) {
                        var keyCode = e.asGetPublicProperty('keyCode');
                        AVM1Key._lastKeyCode = keyCode;
                        delete AVM1Key._keyStates[keyCode];
                        context.globals.Key.asCallPublicProperty('broadcastMessage', ['onKeyUp']);
                    }, false);
                };
                AVM1Key.isDown = function (code) {
                    return !!AVM1Key._keyStates[code];
                };
                AVM1Key.DOWN = 40;
                AVM1Key.LEFT = 37;
                AVM1Key.RIGHT = 39;
                AVM1Key.UP = 38;
                AVM1Key._keyStates = [];
                AVM1Key._lastKeyCode = 0;
                return AVM1Key;
            })();
            Lib.AVM1Key = AVM1Key;
        })(Lib = AVM1.Lib || (AVM1.Lib = {}));
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var Lib;
        (function (Lib) {
            var AVM1Mouse = (function () {
                function AVM1Mouse() {
                }
                AVM1Mouse.createAVM1Class = function () {
                    return Lib.wrapAVM1Class(AVM1Mouse, ['show', 'hide'], []);
                };
                AVM1Mouse._bind = function (stage, context) {
                    stage.addEventListener('mouseDown', function (e) {
                        context.globals.Mouse.asCallPublicProperty('broadcastMessage', ['onMouseDown']);
                    }, false);
                    stage.addEventListener('mouseMove', function (e) {
                        context.globals.Mouse.asCallPublicProperty('broadcastMessage', ['onMouseMove']);
                    }, false);
                    stage.addEventListener('mouseOut', function (e) {
                        context.globals.Mouse.asCallPublicProperty('broadcastMessage', ['onMouseMove']);
                    }, false);
                    stage.addEventListener('mouseUp', function (e) {
                        context.globals.Mouse.asCallPublicProperty('broadcastMessage', ['onMouseUp']);
                    }, false);
                };
                AVM1Mouse.hide = function () {
                };
                AVM1Mouse.show = function () {
                };
                return AVM1Mouse;
            })();
            Lib.AVM1Mouse = AVM1Mouse;
        })(Lib = AVM1.Lib || (AVM1.Lib = {}));
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var Lib;
        (function (Lib) {
            var AVM1Stage = (function () {
                function AVM1Stage() {
                }
                AVM1Stage.createAVM1Class = function () {
                    return Lib.wrapAVM1Class(AVM1Stage, ['align', 'displayState', 'fullScreenSourceRect', 'height', 'scaleMode', 'showMenu', 'width'], []);
                };
                Object.defineProperty(AVM1Stage, "align", {
                    get: function () {
                        return Lib.AVM1Utils.currentStage.align;
                    },
                    set: function (value) {
                        Lib.AVM1Utils.currentStage.align = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Stage, "displayState", {
                    get: function () {
                        return Lib.AVM1Utils.currentStage.displayState;
                    },
                    set: function (value) {
                        Lib.AVM1Utils.currentStage.displayState = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Stage, "fullScreenSourceRect", {
                    get: function () {
                        return Lib.AVM1Utils.currentStage.fullScreenSourceRect;
                    },
                    set: function (value) {
                        Lib.AVM1Utils.currentStage.fullScreenSourceRect = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Stage, "height", {
                    get: function () {
                        return Lib.AVM1Utils.currentStage.stageHeight;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Stage, "scaleMode", {
                    get: function () {
                        return Lib.AVM1Utils.currentStage.scaleMode;
                    },
                    set: function (value) {
                        Lib.AVM1Utils.currentStage.scaleMode = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Stage, "showMenu", {
                    get: function () {
                        return Lib.AVM1Utils.currentStage.showDefaultContextMenu;
                    },
                    set: function (value) {
                        Lib.AVM1Utils.currentStage.showDefaultContextMenu = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Stage, "width", {
                    get: function () {
                        return Lib.AVM1Utils.currentStage.stageWidth;
                    },
                    enumerable: true,
                    configurable: true
                });
                return AVM1Stage;
            })();
            Lib.AVM1Stage = AVM1Stage;
        })(Lib = AVM1.Lib || (AVM1.Lib = {}));
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var Lib;
        (function (Lib) {
            var flash = Shumway.AVM2.AS.flash;
            var assert = Shumway.Debug.assert;
            var Multiname = Shumway.AVM2.ABC.Multiname;
            var resolveMultinameProperty = Shumway.AVM2.Runtime.resolveMultinameProperty;
            var _asGetProperty = Object.prototype.asGetProperty;
            var _asSetProperty = Object.prototype.asSetProperty;
            var _asCallProperty = Object.prototype.asCallProperty;
            var _asHasProperty = Object.prototype.asHasProperty;
            var _asHasOwnProperty = Object.prototype.asHasOwnProperty;
            var _asHasTraitProperty = Object.prototype.asHasTraitProperty;
            var _asDeleteProperty = Object.prototype.asDeleteProperty;
            var _asGetEnumerableKeys = Object.prototype.asGetEnumerableKeys;
            var AVM1MovieClipButtonModeEvent = (function (_super) {
                __extends(AVM1MovieClipButtonModeEvent, _super);
                function AVM1MovieClipButtonModeEvent(propertyName, eventName, argsConverter) {
                    if (argsConverter === void 0) { argsConverter = null; }
                    _super.call(this, propertyName, eventName, argsConverter);
                    this.propertyName = propertyName;
                    this.eventName = eventName;
                    this.argsConverter = argsConverter;
                }
                AVM1MovieClipButtonModeEvent.prototype.onBind = function (target) {
                    var mc = target;
                    mc.as3Object.buttonMode = true;
                };
                return AVM1MovieClipButtonModeEvent;
            })(Lib.AVM1EventHandler);
            var AVM1MovieClip = (function (_super) {
                __extends(AVM1MovieClip, _super);
                function AVM1MovieClip() {
                    _super.call(this);
                }
                AVM1MovieClip.createAVM1Class = function () {
                    return Lib.wrapAVM1Class(AVM1MovieClip, [], ['_alpha', 'attachAudio', 'attachBitmap', 'attachMovie', 'beginFill', 'beginBitmapFill', 'beginGradientFill', 'blendMode', 'cacheAsBitmap', '_callFrame', 'clear', 'createEmptyMovieClip', 'createTextField', '_currentframe', 'curveTo', '_droptarget', 'duplicateMovieClip', 'enabled', 'endFill', 'filters', '_framesloaded', 'focusEnabled', '_focusrect', 'forceSmothing', 'getBounds', 'getBytesLoaded', 'getBytesTotal', 'getDepth', 'getInstanceAtDepth', 'getNextHighestDepth', 'getRect', 'getSWFVersion', 'getTextSnapshot', 'getURL', 'globalToLocal', 'gotoAndPlay', 'gotoAndStop', '_height', '_highquality', 'hitArea', 'hitTest', 'lineGradientStyle', 'listStyle', 'lineTo', 'loadMovie', 'loadVariables', 'localToGlobal', '_lockroot', 'menu', 'moveTo', '_name', 'nextFrame', 'opaqueBackground', '_parent', 'play', 'prevFrame', '_quality', 'removeMovieClip', '_rotation', 'scale9Grid', 'scrollRect', 'setMask', '_soundbuftime', 'startDrag', 'stop', 'stopDrag', 'swapDepths', 'tabChildren', 'tabEnabled', 'tabIndex', '_target', '_totalframes', 'trackAsMenu', 'transform', 'toString', 'unloadMovie', '_url', 'useHandCursor', '_visible', '_width', '_x', '_xmouse', '_xscale', '_y', '_ymouse', '_yscale']);
                };
                Object.defineProperty(AVM1MovieClip.prototype, "graphics", {
                    get: function () {
                        return this.as3Object.graphics;
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1MovieClip.prototype.initAVM1SymbolInstance = function (context, as3Object) {
                    _super.prototype.initAVM1SymbolInstance.call(this, context, as3Object);
                    this._frameScripts = null;
                    this._boundExecuteFrameScripts = null;
                    this._initEventsHandlers();
                };
                AVM1MovieClip.prototype.__lookupChild = function (id) {
                    if (id == '.') {
                        return this;
                    }
                    else if (id == '..') {
                        return Lib.getAVM1Object(this.as3Object.parent, this.context);
                    }
                    else {
                        return Lib.getAVM1Object(this._lookupChildByName(id), this.context);
                    }
                };
                AVM1MovieClip.prototype._lookupChildByName = function (name) {
                    name = asCoerceString(name);
                    return this.as3Object._lookupChildByName(name);
                };
                Object.defineProperty(AVM1MovieClip.prototype, "__targetPath", {
                    get: function () {
                        var target = this._target;
                        var prefix = '_level0';
                        return target != '/' ? prefix + target.replace(/\//g, '.') : prefix;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "_alpha", {
                    get: function () {
                        return this.as3Object.alpha;
                    },
                    set: function (value) {
                        this.as3Object.alpha = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1MovieClip.prototype.attachAudio = function (id) {
                    throw 'Not implemented: attachAudio';
                };
                AVM1MovieClip.prototype._constructMovieClipSymbol = function (symbolId, name) {
                    var symbol = AVM1.AVM1Context.instance.getAsset(symbolId);
                    if (!symbol) {
                        return undefined;
                    }
                    var props = Object.create(symbol.symbolProps);
                    props.avm1Name = name;
                    props.avm1SymbolClass = symbol.theClass;
                    var mc = flash.display.MovieClip.initializeFrom(props);
                    flash.display.MovieClip.instanceConstructorNoInitialize.call(mc);
                    return mc;
                };
                AVM1MovieClip.prototype.attachMovie = function (symbolId, name, depth, initObject) {
                    var mc = this._constructMovieClipSymbol(symbolId, name);
                    if (!mc) {
                        return undefined;
                    }
                    var as2mc = this._insertChildAtDepth(mc, depth);
                    for (var i in initObject) {
                        as2mc[i] = initObject[i];
                    }
                    return as2mc;
                };
                AVM1MovieClip.prototype.beginFill = function (color, alpha) {
                    this.graphics.beginFill(color, alpha);
                };
                AVM1MovieClip.prototype.beginBitmapFill = function (bmp, matrix, repeat, smoothing) {
                    if (!(bmp instanceof flash.display.BitmapData)) {
                        return;
                    }
                    this.graphics.beginBitmapFill(bmp, matrix, repeat, smoothing);
                };
                AVM1MovieClip.prototype.beginGradientFill = function (fillType, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod, focalPointRatio) {
                    this.graphics.beginGradientFill(fillType, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod, focalPointRatio);
                };
                Object.defineProperty(AVM1MovieClip.prototype, "blendMode", {
                    get: function () {
                        return this.as3Object.blendMode;
                    },
                    set: function (value) {
                        this.as3Object.blendMode = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "cacheAsBitmap", {
                    get: function () {
                        return this.as3Object.cacheAsBitmap;
                    },
                    set: function (value) {
                        this.as3Object.cacheAsBitmap = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1MovieClip.prototype._callFrame = function (frame) {
                    var nativeAS3Object = this.as3Object;
                    nativeAS3Object._callFrame(frame);
                };
                AVM1MovieClip.prototype.clear = function () {
                    this.graphics.clear();
                };
                AVM1MovieClip.prototype._insertChildAtDepth = function (mc, depth) {
                    var nativeAS3Object = this.as3Object;
                    nativeAS3Object.addTimelineObjectAtDepth(mc, Math.min(nativeAS3Object.numChildren, depth));
                    if (flash.display.Bitmap.isType(mc)) {
                        return null;
                    }
                    var as2mc = Lib.getAVM1Object(mc, this.context);
                    return as2mc;
                };
                AVM1MovieClip.prototype.createEmptyMovieClip = function (name, depth) {
                    var mc = new flash.display.MovieClip();
                    mc.name = name;
                    return this._insertChildAtDepth(mc, depth);
                };
                AVM1MovieClip.prototype.createTextField = function (name, depth, x, y, width, height) {
                    var text = new flash.text.TextField();
                    text.name = name;
                    text.x = x;
                    text.y = y;
                    text.width = width;
                    text.height = height;
                    return this._insertChildAtDepth(text, depth);
                };
                Object.defineProperty(AVM1MovieClip.prototype, "_currentframe", {
                    get: function () {
                        return this.as3Object.currentFrame;
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1MovieClip.prototype.curveTo = function (controlX, controlY, anchorX, anchorY) {
                    this.graphics.curveTo(controlX, controlY, anchorX, anchorY);
                };
                Object.defineProperty(AVM1MovieClip.prototype, "_droptarget", {
                    get: function () {
                        return this.as3Object.dropTarget;
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1MovieClip.prototype._duplicate = function (name, depth, initObject) {
                    var nativeAS3Object = this.as3Object;
                    nativeAS3Object._duplicate(name, depth, initObject);
                };
                AVM1MovieClip.prototype.duplicateMovieClip = function (name, depth, initObject) {
                    var mc = this._duplicate(name, +depth, initObject);
                    return Lib.getAVM1Object(mc, this.context);
                };
                Object.defineProperty(AVM1MovieClip.prototype, "enabled", {
                    get: function () {
                        return this.as3Object.enabled;
                    },
                    set: function (value) {
                        this.as3Object.enabled = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1MovieClip.prototype.endFill = function () {
                    this.graphics.endFill();
                };
                Object.defineProperty(AVM1MovieClip.prototype, "filters", {
                    get: function () {
                        throw 'Not implemented: get$filters';
                    },
                    set: function (value) {
                        throw 'Not implemented: set$filters';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "focusEnabled", {
                    get: function () {
                        throw 'Not implemented: get$focusEnabled';
                    },
                    set: function (value) {
                        throw 'Not implemented: set$focusEnabled';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "_focusrect", {
                    get: function () {
                        throw 'Not implemented: get$_focusrect';
                    },
                    set: function (value) {
                        throw 'Not implemented: set$_focusrect';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "forceSmoothing", {
                    get: function () {
                        throw 'Not implemented: get$forceSmoothing';
                    },
                    set: function (value) {
                        throw 'Not implemented: set$forceSmoothing';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "_framesloaded", {
                    get: function () {
                        return this.as3Object.framesLoaded;
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1MovieClip.prototype.getBounds = function (bounds) {
                    var obj = bounds.as3Object;
                    if (!obj) {
                        throw 'Unsupported bounds type';
                    }
                    return this.as3Object.getBounds(obj);
                };
                AVM1MovieClip.prototype.getBytesLoaded = function () {
                    var loaderInfo = this.as3Object.loaderInfo;
                    return loaderInfo.bytesLoaded;
                };
                AVM1MovieClip.prototype.getBytesTotal = function () {
                    var loaderInfo = this.as3Object.loaderInfo;
                    return loaderInfo.bytesTotal;
                };
                AVM1MovieClip.prototype.getDepth = function () {
                    return this.as3Object._depth;
                };
                AVM1MovieClip.prototype.getInstanceAtDepth = function (depth) {
                    var nativeObject = this.as3Object;
                    for (var i = 0, numChildren = nativeObject.numChildren; i < numChildren; i++) {
                        var child = nativeObject._lookupChildByIndex(i);
                        if (child && child._depth === depth) {
                            if (flash.display.Bitmap.isType(child)) {
                                return this;
                            }
                            return Lib.getAVM1Object(child, this.context);
                        }
                    }
                    return null;
                };
                AVM1MovieClip.prototype.getNextHighestDepth = function () {
                    var nativeObject = this.as3Object;
                    var maxDepth = 0;
                    for (var i = 0, numChildren = nativeObject.numChildren; i < numChildren; i++) {
                        var child = nativeObject._lookupChildByIndex(i);
                        if (child._depth > maxDepth) {
                            maxDepth = child._depth;
                        }
                    }
                    return maxDepth + 1;
                };
                AVM1MovieClip.prototype.getRect = function (bounds) {
                    throw 'Not implemented: getRect';
                };
                AVM1MovieClip.prototype.getSWFVersion = function () {
                    var loaderInfo = this.as3Object.loaderInfo;
                    return loaderInfo.swfVersion;
                };
                AVM1MovieClip.prototype.getTextSnapshot = function () {
                    throw 'Not implemented: getTextSnapshot';
                };
                AVM1MovieClip.prototype.getURL = function (url, window, method) {
                    var request = new flash.net.URLRequest(url);
                    if (method) {
                        request.method = method;
                    }
                    Shumway.AVM2.AS.FlashNetScript_navigateToURL(request, window);
                };
                AVM1MovieClip.prototype.globalToLocal = function (pt) {
                    var tmp = this.as3Object.globalToLocal(new flash.geom.Point(pt.asGetPublicProperty('x'), pt.asGetPublicProperty('y')));
                    pt.asSetPublicProperty('x', tmp.x);
                    pt.asSetPublicProperty('y', tmp.y);
                };
                AVM1MovieClip.prototype.gotoAndPlay = function (frame) {
                    return this.as3Object.gotoAndPlay(frame);
                };
                AVM1MovieClip.prototype.gotoAndStop = function (frame) {
                    return this.as3Object.gotoAndStop(frame);
                };
                Object.defineProperty(AVM1MovieClip.prototype, "_height", {
                    get: function () {
                        return this.as3Object.height;
                    },
                    set: function (value) {
                        if (isNaN(value)) {
                            return;
                        }
                        this.as3Object.height = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "_highquality", {
                    get: function () {
                        return 1;
                    },
                    set: function (value) {
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "hitArea", {
                    get: function () {
                        throw 'Not implemented: get$hitArea';
                    },
                    set: function (value) {
                        throw 'Not implemented: set$hitArea';
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1MovieClip.prototype.hitTest = function (x, y, shapeFlag) {
                    if (x instanceof AVM1MovieClip) {
                        return this.as3Object.hitTestObject(x.as3Object);
                    }
                    else {
                        return this.as3Object.hitTestPoint(x, y, shapeFlag);
                    }
                };
                AVM1MovieClip.prototype.lineGradientStyle = function (fillType, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod, focalPointRatio) {
                    this.graphics.lineGradientStyle(fillType, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod, focalPointRatio);
                };
                AVM1MovieClip.prototype.lineStyle = function (thickness, rgb, alpha, pixelHinting, noScale, capsStyle, jointStyle, miterLimit) {
                    this.graphics.lineStyle(thickness, rgb, alpha, pixelHinting, noScale, capsStyle, jointStyle, miterLimit);
                };
                AVM1MovieClip.prototype.lineTo = function (x, y) {
                    this.graphics.lineTo(x, y);
                };
                AVM1MovieClip.prototype.loadMovie = function (url, method) {
                    var loader = new flash.display.Loader();
                    var request = new flash.net.URLRequest(url);
                    if (method) {
                        request.method = method;
                    }
                    loader.load(request);
                    function completeHandler(event) {
                        loader.removeEventListener(flash.events.Event.COMPLETE, completeHandler);
                        var parent = this.as3Object.parent;
                        var depth = parent.getChildIndex(this.as3Object);
                        parent.removeChild(this.as3Object);
                        parent.addChildAt(loader.content, depth);
                    }
                    loader.addEventListener(flash.events.Event.COMPLETE, completeHandler);
                };
                AVM1MovieClip.prototype.loadVariables = function (url, method) {
                    this.context.globals._loadVariables(this, url, method);
                };
                AVM1MovieClip.prototype.localToGlobal = function (pt) {
                    var tmp = this.as3Object.localToGlobal(new flash.geom.Point(pt.asGetPublicProperty('x'), pt.asGetPublicProperty('y')));
                    pt.asSetPublicProperty('x', tmp.x);
                    pt.asSetPublicProperty('y', tmp.y);
                };
                Object.defineProperty(AVM1MovieClip.prototype, "_lockroot", {
                    get: function () {
                        throw 'Not implemented: get$_lockroot';
                    },
                    set: function (value) {
                        throw 'Not implemented: set$_lockroot';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "menu", {
                    get: function () {
                        return this.as3Object.contextMenu;
                    },
                    set: function (value) {
                        this.as3Object.contextMenu = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1MovieClip.prototype.moveTo = function (x, y) {
                    this.graphics.moveTo(x, y);
                };
                Object.defineProperty(AVM1MovieClip.prototype, "_name", {
                    get: function () {
                        return this.as3Object.name;
                    },
                    set: function (value) {
                        this.as3Object.name = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1MovieClip.prototype.nextFrame = function () {
                    this.as3Object.nextFrame();
                };
                AVM1MovieClip.prototype.nextScene = function () {
                    this.as3Object.nextScene();
                };
                Object.defineProperty(AVM1MovieClip.prototype, "opaqueBackground", {
                    get: function () {
                        return this.as3Object.opaqueBackground;
                    },
                    set: function (value) {
                        this.as3Object.opaqueBackground = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "_parent", {
                    get: function () {
                        var parent = Lib.getAVM1Object(this.as3Object.parent, this.context);
                        return parent || undefined;
                    },
                    set: function (value) {
                        throw 'Not implemented: set$_parent';
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1MovieClip.prototype.play = function () {
                    this.as3Object.play();
                };
                AVM1MovieClip.prototype.prevFrame = function () {
                    this.as3Object.prevFrame();
                };
                AVM1MovieClip.prototype.prevScene = function () {
                    this.as3Object.prevScene();
                };
                Object.defineProperty(AVM1MovieClip.prototype, "_quality", {
                    get: function () {
                        return 'HIGH';
                    },
                    set: function (value) {
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1MovieClip.prototype.removeMovieClip = function () {
                    var parent = this._parent.as3Object;
                    parent.removeChild(this.as3Object);
                };
                Object.defineProperty(AVM1MovieClip.prototype, "_rotation", {
                    get: function () {
                        return this.as3Object.rotation;
                    },
                    set: function (value) {
                        this.as3Object.rotation = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "scale9Grid", {
                    get: function () {
                        throw 'Not implemented: get$scale9Grid';
                    },
                    set: function (value) {
                        throw 'Not implemented: set$scale9Grid';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "scrollRect", {
                    get: function () {
                        throw 'Not implemented: get$scrollRect';
                    },
                    set: function (value) {
                        throw 'Not implemented: set$scrollRect';
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1MovieClip.prototype.setMask = function (mc) {
                    var nativeObject = this.as3Object;
                    var mask = Lib.AVM1Utils.resolveMovieClip(mc);
                    if (mask) {
                        nativeObject.mask = mask.as3Object;
                    }
                };
                Object.defineProperty(AVM1MovieClip.prototype, "_soundbuftime", {
                    get: function () {
                        throw 'Not implemented: get$_soundbuftime';
                    },
                    set: function (value) {
                        throw 'Not implemented: set$_soundbuftime';
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1MovieClip.prototype.startDrag = function (lock, left, top, right, bottom) {
                    this.as3Object.startDrag(lock, arguments.length < 3 ? null : new flash.geom.Rectangle(left, top, right - left, bottom - top));
                };
                AVM1MovieClip.prototype.stop = function () {
                    return this.as3Object.stop();
                };
                AVM1MovieClip.prototype.stopDrag = function () {
                    return this.as3Object.stopDrag();
                };
                AVM1MovieClip.prototype.swapDepths = function (target) {
                    var child1 = this.as3Object;
                    var child2 = typeof target === 'number' ? Lib.AVM1Utils.resolveLevel(Number(target)).as3Object : Lib.AVM1Utils.resolveTarget(target).as3Object;
                    if (child1.parent !== child2.parent) {
                        return;
                    }
                    child1.parent.swapChildren(child1, child2);
                };
                Object.defineProperty(AVM1MovieClip.prototype, "tabChildren", {
                    get: function () {
                        return this.as3Object.tabChildren;
                    },
                    set: function (value) {
                        this.as3Object.tabChildren = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "tabEnabled", {
                    get: function () {
                        return this.as3Object.tabEnabled;
                    },
                    set: function (value) {
                        this.as3Object.tabEnabled = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "tabIndex", {
                    get: function () {
                        return this.as3Object.tabIndex;
                    },
                    set: function (value) {
                        this.as3Object.tabIndex = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "_target", {
                    get: function () {
                        var nativeObject = this.as3Object;
                        if (nativeObject === nativeObject.root) {
                            return '/';
                        }
                        var path = '';
                        do {
                            path = '/' + nativeObject.name + path;
                            nativeObject = nativeObject.parent;
                        } while (nativeObject !== nativeObject.root);
                        return path;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "_totalframes", {
                    get: function () {
                        return this.as3Object.totalFrames;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "trackAsMenu", {
                    get: function () {
                        throw 'Not implemented: get$trackAsMenu';
                    },
                    set: function (value) {
                        throw 'Not implemented: set$trackAsMenu';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "transform", {
                    get: function () {
                        throw 'Not implemented: get$transform';
                    },
                    set: function (value) {
                        throw 'Not implemented: set$transform';
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1MovieClip.prototype.toString = function () {
                    return this.as3Object.toString();
                };
                AVM1MovieClip.prototype.unloadMovie = function () {
                    var nativeObject = this.as3Object;
                    var loader = nativeObject.loaderInfo.loader;
                    if (loader.parent) {
                        loader.parent.removeChild(loader);
                    }
                    nativeObject.stop();
                };
                Object.defineProperty(AVM1MovieClip.prototype, "_url", {
                    get: function () {
                        return this.as3Object.loaderInfo.url;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "useHandCursor", {
                    get: function () {
                        return this.as3Object.useHandCursor;
                    },
                    set: function (value) {
                        this.as3Object.useHandCursor = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "_visible", {
                    get: function () {
                        return this.as3Object.visible;
                    },
                    set: function (value) {
                        this.as3Object.visible = +value !== 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "_width", {
                    get: function () {
                        return this.as3Object.width;
                    },
                    set: function (value) {
                        if (isNaN(value)) {
                            return;
                        }
                        this.as3Object.width = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "_x", {
                    get: function () {
                        return this.as3Object.x;
                    },
                    set: function (value) {
                        if (isNaN(value)) {
                            return;
                        }
                        this.as3Object.x = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "_xmouse", {
                    get: function () {
                        return this.as3Object.mouseX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "_xscale", {
                    get: function () {
                        return this.as3Object.scaleX * 100;
                    },
                    set: function (value) {
                        if (isNaN(value)) {
                            return;
                        }
                        this.as3Object.scaleX = value / 100;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "_y", {
                    get: function () {
                        return this.as3Object.y;
                    },
                    set: function (value) {
                        if (isNaN(value)) {
                            return;
                        }
                        this.as3Object.y = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "_ymouse", {
                    get: function () {
                        return this.as3Object.mouseY;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1MovieClip.prototype, "_yscale", {
                    get: function () {
                        return this.as3Object.scaleY * 100;
                    },
                    set: function (value) {
                        if (isNaN(value)) {
                            return;
                        }
                        this.as3Object.scaleY = value / 100;
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1MovieClip.prototype._resolveLevelNProperty = function (name) {
                    if (name === '_root' || name === '_level0') {
                        return AVM1.AVM1Context.instance.resolveLevel(0);
                    }
                    else if (name.indexOf('_level') === 0) {
                        var level = name.substring(6), levelNum = level | 0;
                        if (levelNum > 0 && level == levelNum) {
                            return AVM1.AVM1Context.instance.resolveLevel(levelNum);
                        }
                    }
                    return null;
                };
                AVM1MovieClip.prototype.asGetProperty = function (namespaces, name, flags) {
                    if (_asHasProperty.call(this, namespaces, name, flags)) {
                        return _asGetProperty.call(this, namespaces, name, flags);
                    }
                    if (typeof name === 'string' && name[0] === '_') {
                        var level = this._resolveLevelNProperty(name);
                        if (level) {
                            return level;
                        }
                    }
                    var resolved = resolveMultinameProperty(namespaces, name, flags);
                    if (Multiname.isPublicQualifiedName(resolved) && this.isAVM1Instance) {
                        return this.__lookupChild(Multiname.getNameFromPublicQualifiedName(resolved));
                    }
                    return undefined;
                };
                AVM1MovieClip.prototype.asHasProperty = function (namespaces, name, flags) {
                    if (_asHasProperty.call(this, namespaces, name, flags)) {
                        return true;
                    }
                    if (typeof name === 'string' && name[0] === '_') {
                        var level = this._resolveLevelNProperty(name);
                        if (level) {
                            return true;
                        }
                    }
                    var resolved = resolveMultinameProperty(namespaces, name, flags);
                    if (Multiname.isPublicQualifiedName(resolved) && this.isAVM1Instance) {
                        return !!this.__lookupChild(Multiname.getNameFromPublicQualifiedName(resolved));
                    }
                    return false;
                };
                AVM1MovieClip.prototype.asGetEnumerableKeys = function () {
                    var keys = _asGetEnumerableKeys.call(this);
                    if (!this.isAVM1Instance) {
                        return keys;
                    }
                    var as3MovieClip = this.as3Object;
                    for (var i = 0, length = as3MovieClip._children.length; i < length; i++) {
                        var child = as3MovieClip._children[i];
                        var name = child.name;
                        if (!_asHasProperty.call(this, undefined, name, 0)) {
                            keys.push(Multiname.getPublicQualifiedName(name));
                        }
                    }
                    return keys;
                };
                AVM1MovieClip.prototype.addFrameActionBlocks = function (frameIndex, frameData) {
                    var initActionBlocks = frameData.initActionBlocks;
                    var actionBlocks = frameData.actionBlocks;
                    if (initActionBlocks) {
                        this._addInitActionBlocks(frameIndex, initActionBlocks);
                    }
                    if (actionBlocks) {
                        for (var i = 0; i < actionBlocks.length; i++) {
                            this.addFrameScript(frameIndex, actionBlocks[i]);
                        }
                    }
                };
                AVM1MovieClip.prototype.addFrameScript = function (frameIndex, actionsBlock) {
                    var frameScripts = this._frameScripts;
                    if (!frameScripts) {
                        release || assert(!this._boundExecuteFrameScripts);
                        this._boundExecuteFrameScripts = this._executeFrameScripts.bind(this);
                        frameScripts = this._frameScripts = [];
                    }
                    var scripts = frameScripts[frameIndex + 1];
                    if (!scripts) {
                        scripts = frameScripts[frameIndex + 1] = [];
                        this.as3Object.addFrameScript(frameIndex, this._boundExecuteFrameScripts);
                    }
                    var actionsData = new AVM1.AVM1ActionsData(actionsBlock, 'f' + frameIndex + 'i' + scripts.length);
                    scripts.push(actionsData);
                };
                AVM1MovieClip.prototype._addInitActionBlocks = function (frameIndex, actionsBlocks) {
                    var avm2MovieClip = this.as3Object;
                    var self = this;
                    function listener(e) {
                        if (avm2MovieClip.currentFrame !== frameIndex + 1) {
                            return;
                        }
                        avm2MovieClip.removeEventListener('enterFrame', listener);
                        var avm1Context = self.context;
                        for (var i = 0; i < actionsBlocks.length; i++) {
                            var actionsData = new AVM1.AVM1ActionsData(actionsBlocks[i].actionsData, 'f' + frameIndex + 'i' + i);
                            avm1Context.executeActions(actionsData, self);
                        }
                    }
                    avm2MovieClip.addEventListener('enterFrame', listener);
                };
                AVM1MovieClip.prototype._executeFrameScripts = function () {
                    var context = this.context;
                    var scripts = this._frameScripts[this.as3Object.currentFrame];
                    release || assert(scripts && scripts.length);
                    for (var i = 0; i < scripts.length; i++) {
                        var actionsData = scripts[i];
                        context.executeActions(actionsData, this);
                    }
                };
                AVM1MovieClip.prototype._initEventsHandlers = function () {
                    this.bindEvents([
                        new Lib.AVM1EventHandler('onData', 'data'),
                        new Lib.AVM1EventHandler('onDragOut', 'dragOut'),
                        new Lib.AVM1EventHandler('onDragOver', 'dragOver'),
                        new Lib.AVM1EventHandler('onEnterFrame', 'enterFrame'),
                        new Lib.AVM1EventHandler('onKeyDown', 'keyDown'),
                        new Lib.AVM1EventHandler('onKeyUp', 'keyUp'),
                        new Lib.AVM1EventHandler('onKillFocus', 'focusOut', function (e) {
                            return [e.relatedObject];
                        }),
                        new Lib.AVM1EventHandler('onLoad', 'load'),
                        new Lib.AVM1EventHandler('onMouseDown', 'mouseDown'),
                        new Lib.AVM1EventHandler('onMouseUp', 'mouseUp'),
                        new AVM1MovieClipButtonModeEvent('onPress', 'mouseDown'),
                        new AVM1MovieClipButtonModeEvent('onRelease', 'mouseUp'),
                        new AVM1MovieClipButtonModeEvent('onReleaseOutside', 'releaseOutside'),
                        new AVM1MovieClipButtonModeEvent('onRollOut', 'mouseOut'),
                        new AVM1MovieClipButtonModeEvent('onRollOver', 'mouseOver'),
                        new Lib.AVM1EventHandler('onSetFocus', 'focusIn', function (e) {
                            return [e.relatedObject];
                        }),
                        new Lib.AVM1EventHandler('onUnload', 'unload')
                    ]);
                };
                return AVM1MovieClip;
            })(Lib.AVM1SymbolBase);
            Lib.AVM1MovieClip = AVM1MovieClip;
        })(Lib = AVM1.Lib || (AVM1.Lib = {}));
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var Lib;
        (function (Lib) {
            var somewhatImplemented = Shumway.Debug.somewhatImplemented;
            var StateTransitions;
            (function (StateTransitions) {
                StateTransitions[StateTransitions["IdleToOverUp"] = 0x001] = "IdleToOverUp";
                StateTransitions[StateTransitions["OverUpToIdle"] = 0x002] = "OverUpToIdle";
                StateTransitions[StateTransitions["OverUpToOverDown"] = 0x004] = "OverUpToOverDown";
                StateTransitions[StateTransitions["OverDownToOverUp"] = 0x008] = "OverDownToOverUp";
                StateTransitions[StateTransitions["OverDownToOutDown"] = 0x010] = "OverDownToOutDown";
                StateTransitions[StateTransitions["OutDownToOverDown"] = 0x020] = "OutDownToOverDown";
                StateTransitions[StateTransitions["OutDownToIdle"] = 0x040] = "OutDownToIdle";
                StateTransitions[StateTransitions["IdleToOverDown"] = 0x080] = "IdleToOverDown";
                StateTransitions[StateTransitions["OverDownToIdle"] = 0x100] = "OverDownToIdle";
            })(StateTransitions || (StateTransitions = {}));
            var AVM1KeyCodeMap = [-1, 37, 39, 36, 35, 45, 46, -1, 8, -1, -1, -1, -1, 13, 38, 40, 33, 34, 9, 27];
            var AVM1Button = (function (_super) {
                __extends(AVM1Button, _super);
                function AVM1Button() {
                    _super.apply(this, arguments);
                }
                AVM1Button.createAVM1Class = function () {
                    return Lib.wrapAVM1Class(AVM1Button, [], ['_alpha', 'blendMode', 'cacheAsBitmap', 'enabled', 'filters', '_focusrect', 'getDepth', '_height', '_highquality', 'menu', '_name', '_parent', '_quality', '_rotation', 'scale9Grid', '_soundbuftime', 'tabEnabled', 'tabIndex', '_target', 'trackAsMenu', '_url', 'useHandCursor', '_visible', '_width', '_x', '_xmouse', '_xscale', '_y', '_ymouse', '_yscale']);
                };
                AVM1Button.prototype.initAVM1SymbolInstance = function (context, as3Object) {
                    _super.prototype.initAVM1SymbolInstance.call(this, context, as3Object);
                    var nativeButton = this._as3Object;
                    if (!nativeButton._symbol || !nativeButton._symbol.data.buttonActions) {
                        this._initEventsHandlers();
                        return;
                    }
                    nativeButton.buttonMode = true;
                    nativeButton.addEventListener('addedToStage', this._addListeners.bind(this));
                    nativeButton.addEventListener('removedFromStage', this._removeListeners.bind(this));
                    var requiredListeners = this._requiredListeners = Object.create(null);
                    var actions = this._actions = nativeButton._symbol.data.buttonActions;
                    for (var i = 0; i < actions.length; i++) {
                        var action = actions[i];
                        if (!action.actionsBlock) {
                            action.actionsBlock = new AVM1.AVM1ActionsData(action.actionsData, 's' + nativeButton._symbol.id + 'e' + i);
                        }
                        if (action.keyCode) {
                            requiredListeners['keyDown'] = this._keyDownHandler.bind(this);
                            continue;
                        }
                        var type;
                        switch (action.stateTransitionFlags) {
                            case 64 /* OutDownToIdle */:
                                type = 'releaseOutside';
                                break;
                            case 1 /* IdleToOverUp */:
                                type = 'rollOver';
                                break;
                            case 2 /* OverUpToIdle */:
                                type = 'rollOut';
                                break;
                            case 4 /* OverUpToOverDown */:
                                type = 'mouseDown';
                                break;
                            case 8 /* OverDownToOverUp */:
                                type = 'mouseUp';
                                break;
                            case 16 /* OverDownToOutDown */:
                            case 32 /* OutDownToOverDown */:
                                somewhatImplemented('AVM1 drag over/out button actions');
                                break;
                            case 128 /* IdleToOverDown */:
                            case 256 /* OverDownToIdle */:
                                somewhatImplemented('AVM1 drag trackAsMenu over/out button actions');
                                break;
                            default:
                                console.warn('Unknown AVM1 button action type: ' + action.stateTransitionFlags);
                                continue;
                        }
                        requiredListeners[type] = this._mouseEventHandler.bind(this, action.stateTransitionFlags);
                    }
                    this._initEventsHandlers();
                };
                Object.defineProperty(AVM1Button.prototype, "_alpha", {
                    get: function () {
                        return this._as3Object.alpha;
                    },
                    set: function (value) {
                        this._as3Object.alpha = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "blendMode", {
                    get: function () {
                        return this._as3Object.blendMode;
                    },
                    set: function (value) {
                        this._as3Object.blendMode = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "cacheAsBitmap", {
                    get: function () {
                        return this._as3Object.cacheAsBitmap;
                    },
                    set: function (value) {
                        this._as3Object.cacheAsBitmap = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "enabled", {
                    get: function () {
                        return this._as3Object.enabled;
                    },
                    set: function (value) {
                        this._as3Object.enabled = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "filters", {
                    get: function () {
                        throw 'Not implemented: get$filters';
                    },
                    set: function (value) {
                        throw 'Not implemented: set$filters';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "_focusrect", {
                    get: function () {
                        throw 'Not implemented: get$_focusrect';
                    },
                    set: function (value) {
                        throw 'Not implemented: set$_focusrect';
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1Button.prototype.getDepth = function () {
                    return this._as3Object._clipDepth;
                };
                Object.defineProperty(AVM1Button.prototype, "_height", {
                    get: function () {
                        return this._as3Object.height;
                    },
                    set: function (value) {
                        if (isNaN(value)) {
                            return;
                        }
                        this._as3Object.height = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "_highquality", {
                    get: function () {
                        return 1;
                    },
                    set: function (value) {
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "menu", {
                    get: function () {
                        return this._as3Object.contextMenu;
                    },
                    set: function (value) {
                        this._as3Object.contextMenu = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "_name", {
                    get: function () {
                        return this._as3Object.contextMenu;
                    },
                    set: function (value) {
                        this._as3Object.contextMenu = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "_parent", {
                    get: function () {
                        return Lib.getAVM1Object(this._as3Object.parent, this.context);
                    },
                    set: function (value) {
                        throw 'Not implemented: set$_parent';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "_quality", {
                    get: function () {
                        return 'HIGH';
                    },
                    set: function (value) {
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "_rotation", {
                    get: function () {
                        return this._as3Object.rotation;
                    },
                    set: function (value) {
                        this._as3Object.rotation = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "scale9Grid", {
                    get: function () {
                        throw 'Not implemented: get$scale9Grid';
                    },
                    set: function (value) {
                        throw 'Not implemented: set$scale9Grid';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "_soundbuftime", {
                    get: function () {
                        throw 'Not implemented: get$_soundbuftime';
                    },
                    set: function (value) {
                        throw 'Not implemented: set$_soundbuftime';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "tabEnabled", {
                    get: function () {
                        return this._as3Object.tabEnabled;
                    },
                    set: function (value) {
                        this._as3Object.tabEnabled = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "tabIndex", {
                    get: function () {
                        return this._as3Object.tabIndex;
                    },
                    set: function (value) {
                        this._as3Object.tabIndex = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "_target", {
                    get: function () {
                        return Lib.AVM1Utils.getTarget(this);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "trackAsMenu", {
                    get: function () {
                        throw 'Not implemented: get$trackAsMenu';
                    },
                    set: function (value) {
                        throw 'Not implemented: set$trackAsMenu';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "_url", {
                    get: function () {
                        return this._as3Object.loaderInfo.url;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "useHandCursor", {
                    get: function () {
                        return this._as3Object.useHandCursor;
                    },
                    set: function (value) {
                        this._as3Object.useHandCursor = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "_visible", {
                    get: function () {
                        return this._as3Object.visible;
                    },
                    set: function (value) {
                        this._as3Object.visible = +value !== 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "_width", {
                    get: function () {
                        return this._as3Object.width;
                    },
                    set: function (value) {
                        if (isNaN(value)) {
                            return;
                        }
                        this._as3Object.width = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "_x", {
                    get: function () {
                        return this._as3Object.x;
                    },
                    set: function (value) {
                        if (isNaN(value)) {
                            return;
                        }
                        this._as3Object.x = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "_xmouse", {
                    get: function () {
                        return this._as3Object.mouseX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "_xscale", {
                    get: function () {
                        return this._as3Object.scaleX;
                    },
                    set: function (value) {
                        if (isNaN(value)) {
                            return;
                        }
                        this._as3Object.scaleX = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "_y", {
                    get: function () {
                        return this._as3Object.y;
                    },
                    set: function (value) {
                        if (isNaN(value)) {
                            return;
                        }
                        this._as3Object.y = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "_ymouse", {
                    get: function () {
                        return this._as3Object.mouseY;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Button.prototype, "_yscale", {
                    get: function () {
                        return this._as3Object.scaleY;
                    },
                    set: function (value) {
                        if (isNaN(value)) {
                            return;
                        }
                        this._as3Object.scaleY = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1Button.prototype._addListeners = function () {
                    for (var type in this._requiredListeners) {
                        var target = type === 'keyDown' ? this._as3Object.stage : this._as3Object;
                        target.addEventListener(type, this._requiredListeners[type]);
                    }
                };
                AVM1Button.prototype._removeListeners = function () {
                    for (var type in this._requiredListeners) {
                        var target = type === 'keyDown' ? this._as3Object.stage : this._as3Object;
                        target.removeEventListener(type, this._requiredListeners[type]);
                    }
                };
                AVM1Button.prototype._keyDownHandler = function (event) {
                    var actions = this._actions;
                    for (var i = 0; i < actions.length; i++) {
                        var action = actions[i];
                        if (!action.keyCode) {
                            continue;
                        }
                        if ((action.keyCode < 32 && AVM1KeyCodeMap[action.keyCode] === event.asGetPublicProperty('keyCode')) || action.keyCode === event.asGetPublicProperty('charCode')) {
                            this._runAction(action);
                        }
                    }
                };
                AVM1Button.prototype._mouseEventHandler = function (type) {
                    var actions = this._actions;
                    for (var i = 0; i < actions.length; i++) {
                        var action = actions[i];
                        if (action.stateTransitionFlags === type) {
                            this._runAction(action);
                        }
                    }
                };
                AVM1Button.prototype._runAction = function (action) {
                    var avm1Context = this._as3Object.loaderInfo._avm1Context;
                    avm1Context.executeActions(action.actionsBlock, Lib.getAVM1Object(this._as3Object._parent, this.context));
                };
                AVM1Button.prototype._initEventsHandlers = function () {
                    this.bindEvents([
                        new Lib.AVM1EventHandler('onDragOut', 'dragOut'),
                        new Lib.AVM1EventHandler('onDragOver', 'dragOver'),
                        new Lib.AVM1EventHandler('onKeyDown', 'keyDown'),
                        new Lib.AVM1EventHandler('onKeyUp', 'keyUp'),
                        new Lib.AVM1EventHandler('onKillFocus', 'focusOut', function (e) {
                            return [e.relatedObject];
                        }),
                        new Lib.AVM1EventHandler('onLoad', 'load'),
                        new Lib.AVM1EventHandler('onMouseDown', 'mouseDown'),
                        new Lib.AVM1EventHandler('onMouseUp', 'mouseUp'),
                        new Lib.AVM1EventHandler('onPress', 'mouseDown'),
                        new Lib.AVM1EventHandler('onRelease', 'mouseUp'),
                        new Lib.AVM1EventHandler('onReleaseOutside', 'releaseOutside'),
                        new Lib.AVM1EventHandler('onRollOut', 'mouseOut'),
                        new Lib.AVM1EventHandler('onRollOver', 'mouseOver'),
                        new Lib.AVM1EventHandler('onSetFocus', 'focusIn', function (e) {
                            return [e.relatedObject];
                        })
                    ]);
                };
                return AVM1Button;
            })(Lib.AVM1SymbolBase);
            Lib.AVM1Button = AVM1Button;
        })(Lib = AVM1.Lib || (AVM1.Lib = {}));
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var Lib;
        (function (Lib) {
            var AVM1TextField = (function (_super) {
                __extends(AVM1TextField, _super);
                function AVM1TextField() {
                    _super.apply(this, arguments);
                }
                AVM1TextField.createAVM1Class = function () {
                    return Lib.wrapAVM1Class(AVM1TextField, [], ['_alpha', 'antiAliasType', 'autoSize', 'background', 'backgroundColor', 'border', 'borderColor', 'bottomScroll', 'condenseWhite', 'embedFonts', 'getNewTextFormat', 'getTextFormat', '_height', '_highquality', 'hscroll', 'html', 'htmlText', 'length', 'maxChars', 'maxhscroll', 'maxscroll', 'multiline', '_name', '_parent', 'password', '_quality', '_rotation', 'scroll', 'selectable', 'setNewTextFormat', 'setTextFormat', '_soundbuftime', 'tabEnabled', 'tabIndex', '_target', 'text', 'textColor', 'textHeight', 'textWidth', 'type', '_url', '_visible', '_width', 'wordWrap', '_x', '_xmouse', '_xscale', '_y', '_ymouse', '_yscale']);
                };
                AVM1TextField.prototype.initAVM1SymbolInstance = function (context, as3Object) {
                    _super.prototype.initAVM1SymbolInstance.call(this, context, as3Object);
                    this._variable = '';
                    this._exitFrameHandler = null;
                    if (as3Object._symbol) {
                        this.variable = as3Object._symbol.variableName || '';
                    }
                    this._initEventsHandlers();
                };
                Object.defineProperty(AVM1TextField.prototype, "_alpha", {
                    get: function () {
                        return this._as3Object.alpha;
                    },
                    set: function (value) {
                        this._as3Object.alpha = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "antiAliasType", {
                    get: function () {
                        return this._as3Object.antiAliasType;
                    },
                    set: function (value) {
                        this._as3Object.antiAliasType = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "autoSize", {
                    get: function () {
                        return this._as3Object.autoSize;
                    },
                    set: function (value) {
                        if (value === true) {
                            value = "left";
                        }
                        else if (value === false) {
                            value = "none";
                        }
                        this._as3Object.autoSize = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "background", {
                    get: function () {
                        return this._as3Object.background;
                    },
                    set: function (value) {
                        this._as3Object.background = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "backgroundColor", {
                    get: function () {
                        return this._as3Object.backgroundColor;
                    },
                    set: function (value) {
                        this._as3Object.backgroundColor = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "border", {
                    get: function () {
                        return this._as3Object.border;
                    },
                    set: function (value) {
                        this._as3Object.border = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "borderColor", {
                    get: function () {
                        return this._as3Object.borderColor;
                    },
                    set: function (value) {
                        this._as3Object.borderColor = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "bottomScroll", {
                    get: function () {
                        return this._as3Object.bottomScrollV;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "condenseWhite", {
                    get: function () {
                        return this._as3Object.condenseWhite;
                    },
                    set: function (value) {
                        this._as3Object.condenseWhite = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "embedFonts", {
                    get: function () {
                        return this._as3Object.embedFonts;
                    },
                    set: function (value) {
                        this._as3Object.embedFonts = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1TextField.prototype.getNewTextFormat = function () {
                    return this._as3Object.defaultTextFormat;
                };
                AVM1TextField.prototype.getTextFormat = function () {
                    return this._as3Object.getTextFormat;
                };
                Object.defineProperty(AVM1TextField.prototype, "_height", {
                    get: function () {
                        return this._as3Object.height;
                    },
                    set: function (value) {
                        if (isNaN(value)) {
                            return;
                        }
                        this._as3Object.height = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "_highquality", {
                    get: function () {
                        return 1;
                    },
                    set: function (value) {
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "hscroll", {
                    get: function () {
                        return this._as3Object.scrollH;
                    },
                    set: function (value) {
                        this._as3Object.scrollH = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "html", {
                    get: function () {
                        throw 'Not implemented: get$_html';
                    },
                    set: function (value) {
                        throw 'Not implemented: set$_html';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "htmlText", {
                    get: function () {
                        return this._as3Object.htmlText;
                    },
                    set: function (value) {
                        this._as3Object.htmlText = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "length", {
                    get: function () {
                        return this._as3Object.length;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "maxChars", {
                    get: function () {
                        return this._as3Object.maxChars;
                    },
                    set: function (value) {
                        this._as3Object.maxChars = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "maxhscroll", {
                    get: function () {
                        return this._as3Object.maxScrollH;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "maxscroll", {
                    get: function () {
                        return this._as3Object.maxScrollV;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "multiline", {
                    get: function () {
                        return this._as3Object.multiline;
                    },
                    set: function (value) {
                        this._as3Object.multiline = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "_name", {
                    get: function () {
                        return this.as3Object._name;
                    },
                    set: function (value) {
                        this.as3Object._name = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "_parent", {
                    get: function () {
                        return this._as3Object.parent;
                    },
                    set: function (value) {
                        throw 'Not implemented: set$_parent';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "password", {
                    get: function () {
                        return this._as3Object.displayAsPassword;
                    },
                    set: function (value) {
                        this._as3Object.displayAsPassword = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "_quality", {
                    get: function () {
                        return 'HIGH';
                    },
                    set: function (value) {
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "_rotation", {
                    get: function () {
                        return this._as3Object.rotation;
                    },
                    set: function (value) {
                        this._as3Object.rotation = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "scroll", {
                    get: function () {
                        return this._as3Object.scrollV;
                    },
                    set: function (value) {
                        this._as3Object.scrollV = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "selectable", {
                    get: function () {
                        return this._as3Object.selectable;
                    },
                    set: function (value) {
                        this._as3Object.selectable = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1TextField.prototype.setNewTextFormat = function (value) {
                    this._as3Object.defaultTextFormat = value;
                };
                AVM1TextField.prototype.setTextFormat = function () {
                    this._as3Object.setTextFormat.apply(this._as3Object, arguments);
                };
                Object.defineProperty(AVM1TextField.prototype, "_soundbuftime", {
                    get: function () {
                        throw 'Not implemented: get$_soundbuftime';
                    },
                    set: function (value) {
                        throw 'Not implemented: set$_soundbuftime';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "tabEnabled", {
                    get: function () {
                        return this._as3Object.tabEnabled;
                    },
                    set: function (value) {
                        this._as3Object.tabEnabled = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "tabIndex", {
                    get: function () {
                        return this._as3Object.tabIndex;
                    },
                    set: function (value) {
                        this._as3Object.tabIndex = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "_target", {
                    get: function () {
                        return Lib.AVM1Utils.getTarget(this);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "text", {
                    get: function () {
                        return this._as3Object.text;
                    },
                    set: function (value) {
                        this._as3Object.text = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "textColor", {
                    get: function () {
                        return this._as3Object.textColor;
                    },
                    set: function (value) {
                        this._as3Object.textColor = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "textHeight", {
                    get: function () {
                        return this._as3Object.textHeight;
                    },
                    set: function (value) {
                        throw 'Not supported: set$textHeight';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "textWidth", {
                    get: function () {
                        return this._as3Object.textWidth;
                    },
                    set: function (value) {
                        throw 'Not supported: set$textWidth';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "type", {
                    get: function () {
                        return this._as3Object.type;
                    },
                    set: function (value) {
                        this._as3Object.type = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "_url", {
                    get: function () {
                        return this._as3Object.loaderInfo.url;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "variable", {
                    get: function () {
                        return this._variable;
                    },
                    set: function (name) {
                        if (name === this._variable) {
                            return;
                        }
                        var instance = this.as3Object;
                        if (this._exitFrameHandler && !name) {
                            instance.removeEventListener('exitFrame', this._exitFrameHandler);
                            this._exitFrameHandler = null;
                        }
                        this._variable = name;
                        if (!this._exitFrameHandler && name) {
                            this._exitFrameHandler = this._onAS3ObjectExitFrame.bind(this);
                            instance.addEventListener('exitFrame', this._exitFrameHandler);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1TextField.prototype._onAS3ObjectExitFrame = function () {
                    this._syncTextFieldValue(this.as3Object, this._variable);
                };
                AVM1TextField.prototype._syncTextFieldValue = function (instance, name) {
                    var clip;
                    var hasPath = name.indexOf('.') >= 0 || name.indexOf(':') >= 0;
                    var avm1ContextUtils = this.context.utils;
                    if (hasPath) {
                        var targetPath = name.split(/[.:\/]/g);
                        name = targetPath.pop();
                        if (targetPath[0] == '_root' || targetPath[0] === '') {
                            if (instance.root === null) {
                                return;
                            }
                            clip = Lib.getAVM1Object(instance.root, this.context);
                            targetPath.shift();
                            if (targetPath[0] === '') {
                                targetPath.shift();
                            }
                        }
                        else {
                            clip = Lib.getAVM1Object(instance._parent, this.context);
                        }
                        while (targetPath.length > 0) {
                            var childName = targetPath.shift();
                            clip = avm1ContextUtils.getProperty(clip, childName);
                            if (!clip) {
                                return;
                            }
                        }
                    }
                    else {
                        clip = Lib.getAVM1Object(instance._parent, this.context);
                    }
                    if (!avm1ContextUtils.hasProperty(clip, name)) {
                        avm1ContextUtils.setProperty(clip, name, instance.text);
                    }
                    instance.text = '' + avm1ContextUtils.getProperty(clip, name);
                };
                Object.defineProperty(AVM1TextField.prototype, "_visible", {
                    get: function () {
                        return this._as3Object.visible;
                    },
                    set: function (value) {
                        this._as3Object.visible = +value !== 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "_width", {
                    get: function () {
                        return this._as3Object.width;
                    },
                    set: function (value) {
                        if (isNaN(value)) {
                            return;
                        }
                        this._as3Object.width = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "wordWrap", {
                    get: function () {
                        return this._as3Object.wordWrap;
                    },
                    set: function (value) {
                        this._as3Object.wordWrap = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "_x", {
                    get: function () {
                        return this._as3Object.x;
                    },
                    set: function (value) {
                        if (isNaN(value)) {
                            return;
                        }
                        this._as3Object.x = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "_xmouse", {
                    get: function () {
                        return this._as3Object.mouseX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "_xscale", {
                    get: function () {
                        return this._as3Object.scaleX;
                    },
                    set: function (value) {
                        if (isNaN(value)) {
                            return;
                        }
                        this._as3Object.scaleX = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "_y", {
                    get: function () {
                        return this._as3Object.y;
                    },
                    set: function (value) {
                        if (isNaN(value)) {
                            return;
                        }
                        this._as3Object.y = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "_ymouse", {
                    get: function () {
                        return this._as3Object.mouseY;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1TextField.prototype, "_yscale", {
                    get: function () {
                        return this._as3Object.scaleY;
                    },
                    set: function (value) {
                        if (isNaN(value)) {
                            return;
                        }
                        this._as3Object.scaleY = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1TextField.prototype._initEventsHandlers = function () {
                    this.bindEvents([
                        new Lib.AVM1EventHandler('onDragOut', 'dragOut'),
                        new Lib.AVM1EventHandler('onDragOver', 'dragOver'),
                        new Lib.AVM1EventHandler('onKeyDown', 'keyDown'),
                        new Lib.AVM1EventHandler('onKeyUp', 'keyUp'),
                        new Lib.AVM1EventHandler('onKillFocus', 'focusOut', function (e) {
                            return [e.relatedObject];
                        }),
                        new Lib.AVM1EventHandler('onLoad', 'load'),
                        new Lib.AVM1EventHandler('onMouseDown', 'mouseDown'),
                        new Lib.AVM1EventHandler('onMouseUp', 'mouseUp'),
                        new Lib.AVM1EventHandler('onPress', 'mouseDown'),
                        new Lib.AVM1EventHandler('onRelease', 'mouseUp'),
                        new Lib.AVM1EventHandler('onReleaseOutside', 'releaseOutside'),
                        new Lib.AVM1EventHandler('onRollOut', 'mouseOut'),
                        new Lib.AVM1EventHandler('onRollOver', 'mouseOver'),
                        new Lib.AVM1EventHandler('onSetFocus', 'focusIn', function (e) {
                            return [e.relatedObject];
                        })
                    ]);
                };
                return AVM1TextField;
            })(Lib.AVM1SymbolBase);
            Lib.AVM1TextField = AVM1TextField;
        })(Lib = AVM1.Lib || (AVM1.Lib = {}));
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var Lib;
        (function (Lib) {
            var flash = Shumway.AVM2.AS.flash;
            var AVM1Color = (function () {
                function AVM1Color(target_mc) {
                    this._target = Lib.AVM1Utils.resolveTarget(target_mc);
                }
                AVM1Color.createAVM1Class = function () {
                    return Lib.wrapAVM1Class(AVM1Color, [], ['getRGB', 'getTransform', 'setRGB', 'setTransform']);
                };
                AVM1Color.prototype.getRGB = function () {
                    var transform = this.getTransform();
                    return transform.asGetPublicProperty('color');
                };
                AVM1Color.prototype.getTransform = function () {
                    return this._target.as3Object.transform.colorTransform;
                };
                AVM1Color.prototype.setRGB = function (offset) {
                    var transform = new flash.geom.ColorTransform();
                    transform.asSetPublicProperty('color', offset);
                    this.setTransform(transform);
                };
                AVM1Color.prototype.setTransform = function (transform) {
                    this._target.as3Object.transform.colorTransform = transform;
                };
                return AVM1Color;
            })();
            Lib.AVM1Color = AVM1Color;
        })(Lib = AVM1.Lib || (AVM1.Lib = {}));
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var Lib;
        (function (Lib) {
            var flash = Shumway.AVM2.AS.flash;
            var AVM1Transform = (function () {
                function AVM1Transform(target_mc) {
                    this._target = Lib.AVM1Utils.resolveTarget(target_mc);
                }
                AVM1Transform.createAVM1Class = function () {
                    return Lib.wrapAVM1Class(AVM1Transform, [], ['matrix', 'concatenatedMatrix', 'colorTransform', 'pixelBounds']);
                };
                Object.defineProperty(AVM1Transform.prototype, "matrix", {
                    get: function () {
                        return this._target.as3Object.transform.matrix;
                    },
                    set: function (value) {
                        if (value instanceof flash.geom.Matrix) {
                            this._target.as3Object.transform.matrix = value;
                            return;
                        }
                        if (value == null) {
                            return;
                        }
                        var m = this.matrix;
                        if (value.asHasProperty(undefined, 'a', 0)) {
                            m.a = value.asGetPublicProperty('a');
                        }
                        if (value.asHasProperty(undefined, 'b', 0)) {
                            m.b = value.asGetPublicProperty('b');
                        }
                        if (value.asHasProperty(undefined, 'c', 0)) {
                            m.c = value.asGetPublicProperty('c');
                        }
                        if (value.asHasProperty(undefined, 'd', 0)) {
                            m.d = value.asGetPublicProperty('d');
                        }
                        if (value.asHasProperty(undefined, 'tx', 0)) {
                            m.tx = value.asGetPublicProperty('tx');
                        }
                        if (value.asHasProperty(undefined, 'ty', 0)) {
                            m.ty = value.asGetPublicProperty('ty');
                        }
                        this._target.as3Object.transform.matrix = m;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Transform.prototype, "concatenatedMatrix", {
                    get: function () {
                        return this._target.as3Object.transform.concatenatedMatrix;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Transform.prototype, "colorTransform", {
                    get: function () {
                        return this._target.as3Object.transform.colorTransform;
                    },
                    set: function (value) {
                        this._target.as3Object.transform.colorTransform = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1Transform.prototype, "pixelBounds", {
                    get: function () {
                        return this._target.as3Object.pixelBounds;
                    },
                    enumerable: true,
                    configurable: true
                });
                return AVM1Transform;
            })();
            Lib.AVM1Transform = AVM1Transform;
        })(Lib = AVM1.Lib || (AVM1.Lib = {}));
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var Lib;
        (function (Lib) {
            var notImplemented = Shumway.Debug.notImplemented;
            var _asGetProperty = Object.prototype.asGetProperty;
            var _asSetProperty = Object.prototype.asSetProperty;
            var _asCallProperty = Object.prototype.asCallProperty;
            var _asHasProperty = Object.prototype.asHasProperty;
            var _asHasOwnProperty = Object.prototype.asHasOwnProperty;
            var _asHasTraitProperty = Object.prototype.asHasTraitProperty;
            var _asDeleteProperty = Object.prototype.asDeleteProperty;
            var AVM1Proxy = (function (_super) {
                __extends(AVM1Proxy, _super);
                function AVM1Proxy() {
                    false && _super.call(this);
                }
                AVM1Proxy.prototype.setTarget = function (target) {
                    this._target = target;
                };
                AVM1Proxy.prototype._isInternalProperty = function (namespaces, name, flags) {
                    if (!this._target) {
                        return true;
                    }
                    if (namespaces) {
                        return true;
                    }
                    if (name === '__proto__' || name === '__constructor__') {
                        return true;
                    }
                    return false;
                };
                AVM1Proxy.prototype.asGetProperty = function (namespaces, name, flags) {
                    var self = this;
                    if (this._isInternalProperty(namespaces, name, flags)) {
                        return _asGetProperty.call(self, namespaces, name, flags);
                    }
                    return this._target.asGetPublicProperty(name);
                };
                AVM1Proxy.prototype.asGetNumericProperty = function (name) {
                    return this._target.asGetNumericProperty(name);
                };
                AVM1Proxy.prototype.asSetNumericProperty = function (name, value) {
                    return this._target.asSetNumericProperty(name, value);
                };
                AVM1Proxy.prototype.asSetProperty = function (namespaces, name, flags, value) {
                    var self = this;
                    if (this._isInternalProperty(namespaces, name, flags)) {
                        _asSetProperty.call(self, namespaces, name, flags, value);
                        return;
                    }
                    return this._target.asSetPublicProperty(name, value);
                };
                AVM1Proxy.prototype.asCallProperty = function (namespaces, name, flags, isLex, args) {
                    var self = this;
                    if (this._isInternalProperty(namespaces, name, flags)) {
                        return _asCallProperty.call(self, namespaces, name, flags, false, args);
                    }
                    return this._target.asCallPublicProperty(name, args);
                };
                AVM1Proxy.prototype.asHasProperty = function (namespaces, name, flags) {
                    var self = this;
                    if (this._isInternalProperty(namespaces, name, flags)) {
                        return _asHasProperty.call(self, namespaces, name, flags);
                    }
                    return this._target.asHasProperty(undefined, name, 0);
                };
                AVM1Proxy.prototype.asHasOwnProperty = function (namespaces, name, flags) {
                    var self = this;
                    if (this._isInternalProperty(namespaces, name, flags)) {
                        return _asHasOwnProperty.call(self, namespaces, name, flags);
                    }
                    return this._target.asHasOwnProperty(undefined, name, 0);
                };
                AVM1Proxy.prototype.asDeleteProperty = function (namespaces, name, flags) {
                    var self = this;
                    if (_asHasTraitProperty.call(self, namespaces, name, flags)) {
                        return _asDeleteProperty.call(self, namespaces, name, flags);
                    }
                    notImplemented("AVM1Proxy asDeleteProperty");
                    return false;
                };
                AVM1Proxy.prototype.asNextName = function (index) {
                    notImplemented("AVM1Proxy asNextName");
                };
                AVM1Proxy.prototype.asNextValue = function (index) {
                    notImplemented("AVM1Proxy asNextValue");
                };
                AVM1Proxy.prototype.asNextNameIndex = function (index) {
                    notImplemented("AVM1Proxy asNextNameIndex");
                    return;
                };
                AVM1Proxy.prototype.proxyNativeMethod = function (name) {
                    var boundMethod = this._target[name].bind(this._target);
                    this._target.asSetPublicProperty(name, boundMethod);
                };
                AVM1Proxy.wrap = function (cls, natives) {
                    var wrapped = function () {
                        var nativeThis = Object.create(cls.prototype);
                        Lib.AVM1TextFormat.apply(nativeThis, arguments);
                        var proxy = this;
                        proxy.setTarget(nativeThis);
                        if (natives && natives.methods) {
                            natives.methods.forEach(proxy.proxyNativeMethod, proxy);
                        }
                    };
                    wrapped.prototype = AVM1Proxy.prototype;
                    return wrapped;
                };
                return AVM1Proxy;
            })(Shumway.AVM2.AS.ASObject);
            Lib.AVM1Proxy = AVM1Proxy;
        })(Lib = AVM1.Lib || (AVM1.Lib = {}));
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var Lib;
        (function (Lib) {
            var flash = Shumway.AVM2.AS.flash;
            var asCoerceString = Shumway.AVM2.Runtime.asCoerceString;
            var AVM1TextFormat = (function (_super) {
                __extends(AVM1TextFormat, _super);
                function AVM1TextFormat(font, size, color, bold, italic, underline, url, target, align, leftMargin, rightMargin, indent, leading) {
                    false && _super.call(this, font, size, color, bold, italic, underline, url, target, align, leftMargin, rightMargin, indent, leading);
                    flash.text.TextFormat.apply(this, arguments);
                }
                AVM1TextFormat.createAVM1Class = function () {
                    return Lib.AVM1Proxy.wrap(AVM1TextFormat, {
                        methods: ['getTextExtent']
                    });
                };
                AVM1TextFormat.prototype.getTextExtent = function (text, width) {
                    text = asCoerceString(text);
                    width = +width;
                    var measureTextField = AVM1TextFormat._measureTextField;
                    if (!measureTextField) {
                        measureTextField = new flash.text.TextField();
                        measureTextField.multiline = true;
                        AVM1TextFormat._measureTextField = measureTextField;
                    }
                    if (!isNaN(width) && width > 0) {
                        measureTextField.width = width + 4;
                        measureTextField.wordWrap = true;
                    }
                    else {
                        measureTextField.wordWrap = false;
                    }
                    measureTextField.defaultTextFormat = this;
                    measureTextField.text = text;
                    var result = {};
                    var textWidth = measureTextField.textWidth;
                    var textHeight = measureTextField.textHeight;
                    result.asSetPublicProperty('width', textWidth);
                    result.asSetPublicProperty('height', textHeight);
                    result.asSetPublicProperty('textFieldWidth', textWidth + 4);
                    result.asSetPublicProperty('textFieldHeight', textHeight + 4);
                    var metrics = measureTextField.getLineMetrics(0);
                    result.asSetPublicProperty('ascent', metrics.asGetPublicProperty('ascent'));
                    result.asSetPublicProperty('descent', metrics.asGetPublicProperty('descent'));
                    return result;
                };
                return AVM1TextFormat;
            })(flash.text.TextFormat);
            Lib.AVM1TextFormat = AVM1TextFormat;
        })(Lib = AVM1.Lib || (AVM1.Lib = {}));
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var Lib;
        (function (Lib) {
            var flash = Shumway.AVM2.AS.flash;
            var AVM1BitmapData = (function (_super) {
                __extends(AVM1BitmapData, _super);
                function AVM1BitmapData() {
                    _super.apply(this, arguments);
                }
                AVM1BitmapData.createAVM1Class = function () {
                    var wrapped = Lib.AVM1Proxy.wrap(AVM1BitmapData, null);
                    wrapped.asSetPublicProperty('loadBitmap', AVM1BitmapData.loadBitmap);
                    return wrapped;
                };
                AVM1BitmapData.loadBitmap = function (symbolId) {
                    symbolId = asCoerceString(symbolId);
                    var symbol = AVM1.AVM1Context.instance.getAsset(symbolId);
                    if (symbol && symbol.symbolProps instanceof flash.display.BitmapSymbol) {
                        var bitmap = AVM1BitmapData.initializeFrom(symbol);
                        bitmap.class.instanceConstructorNoInitialize.call(bitmap);
                        return bitmap;
                    }
                    return null;
                };
                return AVM1BitmapData;
            })(flash.display.BitmapData);
            Lib.AVM1BitmapData = AVM1BitmapData;
        })(Lib = AVM1.Lib || (AVM1.Lib = {}));
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var Lib;
        (function (Lib) {
            var flash = Shumway.AVM2.AS.flash;
            var AVM1ExternalInterface = (function () {
                function AVM1ExternalInterface() {
                }
                AVM1ExternalInterface.createAVM1Class = function () {
                    return Lib.wrapAVM1Class(AVM1ExternalInterface, ['available', 'addCallback', 'call'], []);
                };
                Object.defineProperty(AVM1ExternalInterface, "available", {
                    get: function () {
                        return flash.external.ExternalInterface.asGetPublicProperty('available');
                    },
                    enumerable: true,
                    configurable: true
                });
                AVM1ExternalInterface.addCallback = function (methodName, instance, method) {
                    try {
                        flash.external.ExternalInterface.asCallPublicProperty('addCallback', [methodName, function () {
                            return method.apply(instance, arguments);
                        }]);
                        return true;
                    }
                    catch (e) {
                    }
                    return false;
                };
                AVM1ExternalInterface.call = function (methodName) {
                    var args = Array.prototype.slice.call(arguments, 0);
                    return flash.external.ExternalInterface.asCallPublicProperty('call', args);
                };
                return AVM1ExternalInterface;
            })();
            Lib.AVM1ExternalInterface = AVM1ExternalInterface;
        })(Lib = AVM1.Lib || (AVM1.Lib = {}));
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var Lib;
        (function (Lib) {
            var flash = Shumway.AVM2.AS.flash;
            var AVM1Sound = (function (_super) {
                __extends(AVM1Sound, _super);
                function AVM1Sound(target_mc) {
                    _super.call(this);
                    this._target = Lib.AVM1Utils.resolveTarget(target_mc);
                    this._sound = null;
                    this._channel = null;
                    this._linkageID = null;
                }
                AVM1Sound.createAVM1Class = function () {
                    return Lib.wrapAVM1Class(AVM1Sound, [], ['attachSound', 'duration', 'getBytesLoaded', 'getBytesTotal', 'getPan', 'setPan', 'getTransform', 'setTransform', 'getVolume', 'setVolume', 'start', 'stop']);
                };
                AVM1Sound.prototype.attachSound = function (id) {
                    var symbol = this.context.getAsset(id);
                    if (!symbol) {
                        return;
                    }
                    var props = Object.create(symbol.symbolProps);
                    var sound = flash.media.Sound.initializeFrom(props);
                    flash.media.Sound.instanceConstructorNoInitialize.call(sound);
                    this._linkageID = id;
                    this._sound = sound;
                };
                AVM1Sound.prototype.loadSound = function (url, isStreaming) {
                };
                AVM1Sound.prototype.getBytesLoaded = function () {
                    return 0;
                };
                AVM1Sound.prototype.getBytesTotal = function () {
                    return 0;
                };
                AVM1Sound.prototype.getPan = function () {
                    var transform = this._channel && this._channel.soundTransform;
                    return transform ? transform.asGetPublicProperty('pan') * 100 : 0;
                };
                AVM1Sound.prototype.setPan = function (value) {
                    var transform = this._channel && this._channel.soundTransform;
                    if (transform) {
                        transform.asSetPublicProperty('pan', value / 100);
                        this._channel.soundTransform = transform;
                    }
                };
                AVM1Sound.prototype.getTransform = function () {
                    return null;
                };
                AVM1Sound.prototype.setTransform = function (transformObject) {
                };
                AVM1Sound.prototype.getVolume = function () {
                    var transform = this._channel && this._channel.soundTransform;
                    return transform ? transform.asGetPublicProperty('volume') * 100 : 0;
                };
                AVM1Sound.prototype.setVolume = function (value) {
                    var transform = this._channel && this._channel.soundTransform;
                    if (transform) {
                        transform.asSetPublicProperty('volume', value / 100);
                        this._channel.soundTransform = transform;
                    }
                };
                AVM1Sound.prototype.start = function (secondOffset, loops) {
                    if (!this._sound) {
                        return;
                    }
                    secondOffset = isNaN(secondOffset) || secondOffset < 0 ? 0 : +secondOffset;
                    loops = isNaN(loops) || loops < 1 ? 1 : Math.floor(loops);
                    this._stopSoundChannel();
                    this._channel = this._sound.play(secondOffset, loops - 1);
                };
                AVM1Sound.prototype._stopSoundChannel = function () {
                    if (!this._channel) {
                        return;
                    }
                    this._channel.stop();
                    this._channel = null;
                };
                AVM1Sound.prototype.stop = function (linkageID) {
                    if (!linkageID || linkageID === this._linkageID) {
                        this._stopSoundChannel();
                    }
                };
                return AVM1Sound;
            })(Lib.AVM1NativeObject);
            Lib.AVM1Sound = AVM1Sound;
        })(Lib = AVM1.Lib || (AVM1.Lib = {}));
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var Lib;
        (function (Lib) {
            var flash = Shumway.AVM2.AS.flash;
            var AVM1System = (function () {
                function AVM1System() {
                }
                AVM1System.createAVM1Class = function () {
                    return Lib.wrapAVM1Class(AVM1System, ['capabilities', 'security'], []);
                };
                Object.defineProperty(AVM1System, "capabilities", {
                    get: function () {
                        return flash.system.Capabilities;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AVM1System, "security", {
                    get: function () {
                        return flash.system.Security;
                    },
                    enumerable: true,
                    configurable: true
                });
                return AVM1System;
            })();
            Lib.AVM1System = AVM1System;
        })(Lib = AVM1.Lib || (AVM1.Lib = {}));
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var AVM1;
    (function (AVM1) {
        var Lib;
        (function (Lib) {
            var flash = Shumway.AVM2.AS.flash;
            var AVM1MovieClipLoader = (function () {
                function AVM1MovieClipLoader() {
                    this._loader = new flash.display.Loader();
                }
                AVM1MovieClipLoader.createAVM1Class = function () {
                    return Lib.wrapAVM1Class(AVM1MovieClipLoader, [], ['loadClip', 'unloadClip', 'getProgress']);
                };
                AVM1MovieClipLoader.prototype.initAVM1ObjectInstance = function (context) {
                };
                AVM1MovieClipLoader.prototype.loadClip = function (url, target) {
                    this._target = typeof target === 'number' ? Lib.AVM1Utils.resolveLevel(target) : Lib.AVM1Utils.resolveTarget(target);
                    this._target.as3Object.addChild(this._loader);
                    this._loader.contentLoaderInfo.addEventListener(flash.events.Event.OPEN, this.openHandler.bind(this));
                    this._loader.contentLoaderInfo.addEventListener(flash.events.ProgressEvent.PROGRESS, this.progressHandler.bind(this));
                    this._loader.contentLoaderInfo.addEventListener(flash.events.IOErrorEvent.IO_ERROR, this.ioErrorHandler.bind(this));
                    this._loader.contentLoaderInfo.addEventListener(flash.events.Event.COMPLETE, this.completeHandler.bind(this));
                    this._loader.contentLoaderInfo.addEventListener(flash.events.Event.INIT, this.initHandler.bind(this));
                    this._loader.load(new flash.net.URLRequest(url));
                    return true;
                };
                AVM1MovieClipLoader.prototype.unloadClip = function (target) {
                    var nativeTarget = typeof target === 'number' ? Lib.AVM1Utils.resolveLevel(target) : Lib.AVM1Utils.resolveTarget(target);
                    nativeTarget.as3Object.removeChild(this._loader);
                    return true;
                };
                AVM1MovieClipLoader.prototype.getProgress = function (target) {
                    return this._loader.contentLoaderInfo.bytesLoaded;
                };
                AVM1MovieClipLoader.prototype._broadcastMessage = function (message, args) {
                    if (args === void 0) { args = null; }
                    Lib.avm1BroadcastEvent(this._target.context, this, message, args);
                };
                AVM1MovieClipLoader.prototype.openHandler = function (event) {
                    this._broadcastMessage('onLoadStart', [this._target]);
                };
                AVM1MovieClipLoader.prototype.progressHandler = function (event) {
                    this._broadcastMessage('onLoadProgress', [this._target, event.bytesLoaded, event.bytesTotal]);
                };
                AVM1MovieClipLoader.prototype.ioErrorHandler = function (event) {
                    this._broadcastMessage('onLoadError', [this._target, event.errorID, 501]);
                };
                AVM1MovieClipLoader.prototype.completeHandler = function (event) {
                    this._broadcastMessage('onLoadComplete', [this._target]);
                };
                AVM1MovieClipLoader.prototype.initHandler = function (event) {
                    var exitFrameCallback = function () {
                        this._target.as3Object.removeEventListener(flash.events.Event.EXIT_FRAME, exitFrameCallback);
                        this._broadcastMessage('onLoadInit', [this._target]);
                    }.bind(this);
                    this._target.as3Object.addEventListener(flash.events.Event.EXIT_FRAME, exitFrameCallback);
                };
                return AVM1MovieClipLoader;
            })();
            Lib.AVM1MovieClipLoader = AVM1MovieClipLoader;
        })(Lib = AVM1.Lib || (AVM1.Lib = {}));
    })(AVM1 = Shumway.AVM1 || (Shumway.AVM1 = {}));
})(Shumway || (Shumway = {}));
//# sourceMappingURL=avm1.js.map