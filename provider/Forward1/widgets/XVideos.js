var freeGlobal = 'object' == typeof global && global && global.Object === Object && global;
const _freeGlobal = freeGlobal;
var freeSelf = 'object' == typeof self && self && self.Object === Object && self;
var root = _freeGlobal || freeSelf || Function('return this')();
const _root = root;
var Symbol = _root.Symbol;
const _Symbol = Symbol;
function arrayMap(array, iteratee) {
    var index = -1, length = null == array ? 0 : array.length, result = Array(length);
    while(++index < length)result[index] = iteratee(array[index], index, array);
    return result;
}
const _arrayMap = arrayMap;
var isArray_isArray = Array.isArray;
const isArray = isArray_isArray;
var objectProto = Object.prototype;
var _getRawTag_hasOwnProperty = objectProto.hasOwnProperty;
var nativeObjectToString = objectProto.toString;
var symToStringTag = _Symbol ? _Symbol.toStringTag : void 0;
function getRawTag(value) {
    var isOwn = _getRawTag_hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
    try {
        value[symToStringTag] = void 0;
        var unmasked = true;
    } catch (e) {}
    var result = nativeObjectToString.call(value);
    if (unmasked) if (isOwn) value[symToStringTag] = tag;
    else delete value[symToStringTag];
    return result;
}
const _getRawTag = getRawTag;
var _objectToString_objectProto = Object.prototype;
var _objectToString_nativeObjectToString = _objectToString_objectProto.toString;
function objectToString(value) {
    return _objectToString_nativeObjectToString.call(value);
}
const _objectToString = objectToString;
var nullTag = '[object Null]', undefinedTag = '[object Undefined]';
var _baseGetTag_symToStringTag = _Symbol ? _Symbol.toStringTag : void 0;
function baseGetTag(value) {
    if (null == value) return void 0 === value ? undefinedTag : nullTag;
    return _baseGetTag_symToStringTag && _baseGetTag_symToStringTag in Object(value) ? _getRawTag(value) : _objectToString(value);
}
const _baseGetTag = baseGetTag;
function isObjectLike(value) {
    return null != value && 'object' == typeof value;
}
const lodash_es_isObjectLike = isObjectLike;
var symbolTag = '[object Symbol]';
function isSymbol_isSymbol(value) {
    return 'symbol' == typeof value || lodash_es_isObjectLike(value) && _baseGetTag(value) == symbolTag;
}
const isSymbol = isSymbol_isSymbol;
var INFINITY = 1 / 0;
var symbolProto = _Symbol ? _Symbol.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
function baseToString(value) {
    if ('string' == typeof value) return value;
    if (isArray(value)) return _arrayMap(value, baseToString) + '';
    if (isSymbol(value)) return symbolToString ? symbolToString.call(value) : '';
    var result = value + '';
    return '0' == result && 1 / value == -INFINITY ? '-0' : result;
}
const _baseToString = baseToString;
function toString_toString(value) {
    return null == value ? '' : _baseToString(value);
}
const lodash_es_toString = toString_toString;
function basePropertyOf(object) {
    return function(key) {
        return null == object ? void 0 : object[key];
    };
}
const _basePropertyOf = basePropertyOf;
var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
};
var unescapeHtmlChar = _basePropertyOf(htmlUnescapes);
const _unescapeHtmlChar = unescapeHtmlChar;
var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g, reHasEscapedHtml = RegExp(reEscapedHtml.source);
function unescape_unescape(string) {
    string = lodash_es_toString(string);
    return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, _unescapeHtmlChar) : string;
}
const lodash_es_unescape = unescape_unescape;
function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
}
const _listCacheClear = listCacheClear;
function eq(value, other) {
    return value === other || value !== value && other !== other;
}
const lodash_es_eq = eq;
function assocIndexOf(array, key) {
    var length = array.length;
    while(length--)if (lodash_es_eq(array[length][0], key)) return length;
    return -1;
}
const _assocIndexOf = assocIndexOf;
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete(key) {
    var data = this.__data__, index = _assocIndexOf(data, key);
    if (index < 0) return false;
    var lastIndex = data.length - 1;
    if (index == lastIndex) data.pop();
    else splice.call(data, index, 1);
    --this.size;
    return true;
}
const _listCacheDelete = listCacheDelete;
function listCacheGet(key) {
    var data = this.__data__, index = _assocIndexOf(data, key);
    return index < 0 ? void 0 : data[index][1];
}
const _listCacheGet = listCacheGet;
function listCacheHas(key) {
    return _assocIndexOf(this.__data__, key) > -1;
}
const _listCacheHas = listCacheHas;
function listCacheSet(key, value) {
    var data = this.__data__, index = _assocIndexOf(data, key);
    if (index < 0) {
        ++this.size;
        data.push([
            key,
            value
        ]);
    } else data[index][1] = value;
    return this;
}
const _listCacheSet = listCacheSet;
function ListCache(entries) {
    var index = -1, length = null == entries ? 0 : entries.length;
    this.clear();
    while(++index < length){
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}
ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;
const _ListCache = ListCache;
function stackClear() {
    this.__data__ = new _ListCache;
    this.size = 0;
}
const _stackClear = stackClear;
function stackDelete(key) {
    var data = this.__data__, result = data['delete'](key);
    this.size = data.size;
    return result;
}
const _stackDelete = stackDelete;
function stackGet(key) {
    return this.__data__.get(key);
}
const _stackGet = stackGet;
function stackHas(key) {
    return this.__data__.has(key);
}
const _stackHas = stackHas;
function isObject(value) {
    var type = typeof value;
    return null != value && ('object' == type || 'function' == type);
}
const lodash_es_isObject = isObject;
var asyncTag = '[object AsyncFunction]', funcTag = '[object Function]', genTag = '[object GeneratorFunction]', proxyTag = '[object Proxy]';
function isFunction_isFunction(value) {
    if (!lodash_es_isObject(value)) return false;
    var tag = _baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
const isFunction = isFunction_isFunction;
var coreJsData = _root["__core-js_shared__"];
const _coreJsData = coreJsData;
var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
    return uid ? 'Symbol(src)_1.' + uid : '';
}();
function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
}
const _isMasked = isMasked;
var funcProto = Function.prototype;
var funcToString = funcProto.toString;
function toSource(func) {
    if (null != func) {
        try {
            return funcToString.call(func);
        } catch (e) {}
        try {
            return func + '';
        } catch (e) {}
    }
    return '';
}
const _toSource = toSource;
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var _baseIsNative_funcProto = Function.prototype, _baseIsNative_objectProto = Object.prototype;
var _baseIsNative_funcToString = _baseIsNative_funcProto.toString;
var _baseIsNative_hasOwnProperty = _baseIsNative_objectProto.hasOwnProperty;
var reIsNative = RegExp('^' + _baseIsNative_funcToString.call(_baseIsNative_hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
function baseIsNative(value) {
    if (!lodash_es_isObject(value) || _isMasked(value)) return false;
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(_toSource(value));
}
const _baseIsNative = baseIsNative;
function getValue(object, key) {
    return null == object ? void 0 : object[key];
}
const _getValue = getValue;
function getNative(object, key) {
    var value = _getValue(object, key);
    return _baseIsNative(value) ? value : void 0;
}
const _getNative = getNative;
var Map = _getNative(_root, 'Map');
const _Map = Map;
var nativeCreate = _getNative(Object, 'create');
const _nativeCreate = nativeCreate;
function hashClear() {
    this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
    this.size = 0;
}
const _hashClear = hashClear;
function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
}
const _hashDelete = hashDelete;
var HASH_UNDEFINED = '__lodash_hash_undefined__';
var _hashGet_objectProto = Object.prototype;
var _hashGet_hasOwnProperty = _hashGet_objectProto.hasOwnProperty;
function hashGet(key) {
    var data = this.__data__;
    if (_nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
    }
    return _hashGet_hasOwnProperty.call(data, key) ? data[key] : void 0;
}
const _hashGet = hashGet;
var _hashHas_objectProto = Object.prototype;
var _hashHas_hasOwnProperty = _hashHas_objectProto.hasOwnProperty;
function hashHas(key) {
    var data = this.__data__;
    return _nativeCreate ? void 0 !== data[key] : _hashHas_hasOwnProperty.call(data, key);
}
const _hashHas = hashHas;
var _hashSet_HASH_UNDEFINED = '__lodash_hash_undefined__';
function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = _nativeCreate && void 0 === value ? _hashSet_HASH_UNDEFINED : value;
    return this;
}
const _hashSet = hashSet;
function Hash(entries) {
    var index = -1, length = null == entries ? 0 : entries.length;
    this.clear();
    while(++index < length){
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}
Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;
const _Hash = Hash;
function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
        hash: new _Hash,
        map: new (_Map || _ListCache),
        string: new _Hash
    };
}
const _mapCacheClear = mapCacheClear;
function isKeyable(value) {
    var type = typeof value;
    return 'string' == type || 'number' == type || 'symbol' == type || 'boolean' == type ? '__proto__' !== value : null === value;
}
const _isKeyable = isKeyable;
function getMapData(map, key) {
    var data = map.__data__;
    return _isKeyable(key) ? data['string' == typeof key ? 'string' : 'hash'] : data.map;
}
const _getMapData = getMapData;
function mapCacheDelete(key) {
    var result = _getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
}
const _mapCacheDelete = mapCacheDelete;
function mapCacheGet(key) {
    return _getMapData(this, key).get(key);
}
const _mapCacheGet = mapCacheGet;
function mapCacheHas(key) {
    return _getMapData(this, key).has(key);
}
const _mapCacheHas = mapCacheHas;
function mapCacheSet(key, value) {
    var data = _getMapData(this, key), size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
}
const _mapCacheSet = mapCacheSet;
function MapCache(entries) {
    var index = -1, length = null == entries ? 0 : entries.length;
    this.clear();
    while(++index < length){
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}
MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;
const _MapCache = MapCache;
var LARGE_ARRAY_SIZE = 200;
function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof _ListCache) {
        var pairs = data.__data__;
        if (!_Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
            pairs.push([
                key,
                value
            ]);
            this.size = ++data.size;
            return this;
        }
        data = this.__data__ = new _MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
}
const _stackSet = stackSet;
function Stack(entries) {
    var data = this.__data__ = new _ListCache(entries);
    this.size = data.size;
}
Stack.prototype.clear = _stackClear;
Stack.prototype['delete'] = _stackDelete;
Stack.prototype.get = _stackGet;
Stack.prototype.has = _stackHas;
Stack.prototype.set = _stackSet;
const _Stack = Stack;
var defineProperty = function() {
    try {
        var func = _getNative(Object, 'defineProperty');
        func({}, '', {});
        return func;
    } catch (e) {}
}();
const _defineProperty = defineProperty;
function baseAssignValue(object, key, value) {
    if ('__proto__' == key && _defineProperty) _defineProperty(object, key, {
        configurable: true,
        enumerable: true,
        value: value,
        writable: true
    });
    else object[key] = value;
}
const _baseAssignValue = baseAssignValue;
function assignMergeValue(object, key, value) {
    if (void 0 !== value && !lodash_es_eq(object[key], value) || void 0 === value && !(key in object)) _baseAssignValue(object, key, value);
}
const _assignMergeValue = assignMergeValue;
function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
        var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
        while(length--){
            var key = props[fromRight ? length : ++index];
            if (false === iteratee(iterable[key], key, iterable)) break;
        }
        return object;
    };
}
const _createBaseFor = createBaseFor;
var baseFor = _createBaseFor();
const _baseFor = baseFor;
var freeExports = 'object' == typeof exports && exports && !exports.nodeType && exports;
var freeModule = freeExports && 'object' == typeof module && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var Buffer = moduleExports ? _root.Buffer : void 0, allocUnsafe = Buffer ? Buffer.allocUnsafe : void 0;
function cloneBuffer(buffer, isDeep) {
    if (isDeep) return buffer.slice();
    var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
    buffer.copy(result);
    return result;
}
const _cloneBuffer = cloneBuffer;
var Uint8Array = _root.Uint8Array;
const _Uint8Array = Uint8Array;
function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
    return result;
}
const _cloneArrayBuffer = cloneArrayBuffer;
function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
const _cloneTypedArray = cloneTypedArray;
function copyArray(source, array) {
    var index = -1, length = source.length;
    array || (array = Array(length));
    while(++index < length)array[index] = source[index];
    return array;
}
const _copyArray = copyArray;
var objectCreate = Object.create;
var baseCreate = function() {
    function object() {}
    return function(proto) {
        if (!lodash_es_isObject(proto)) return {};
        if (objectCreate) return objectCreate(proto);
        object.prototype = proto;
        var result = new object;
        object.prototype = void 0;
        return result;
    };
}();
const _baseCreate = baseCreate;
function overArg(func, transform) {
    return function(arg) {
        return func(transform(arg));
    };
}
const _overArg = overArg;
var getPrototype = _overArg(Object.getPrototypeOf, Object);
const _getPrototype = getPrototype;
var _isPrototype_objectProto = Object.prototype;
function isPrototype(value) {
    var Ctor = value && value.constructor, proto = 'function' == typeof Ctor && Ctor.prototype || _isPrototype_objectProto;
    return value === proto;
}
const _isPrototype = isPrototype;
function initCloneObject(object) {
    return 'function' != typeof object.constructor || _isPrototype(object) ? {} : _baseCreate(_getPrototype(object));
}
const _initCloneObject = initCloneObject;
var argsTag = '[object Arguments]';
function baseIsArguments(value) {
    return lodash_es_isObjectLike(value) && _baseGetTag(value) == argsTag;
}
const _baseIsArguments = baseIsArguments;
var isArguments_objectProto = Object.prototype;
var isArguments_hasOwnProperty = isArguments_objectProto.hasOwnProperty;
var propertyIsEnumerable = isArguments_objectProto.propertyIsEnumerable;
var isArguments_isArguments = _baseIsArguments(function() {
    return arguments;
}()) ? _baseIsArguments : function(value) {
    return lodash_es_isObjectLike(value) && isArguments_hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
};
const isArguments = isArguments_isArguments;
var MAX_SAFE_INTEGER = 9007199254740991;
function isLength(value) {
    return 'number' == typeof value && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
const lodash_es_isLength = isLength;
function isArrayLike_isArrayLike(value) {
    return null != value && lodash_es_isLength(value.length) && !isFunction(value);
}
const isArrayLike = isArrayLike_isArrayLike;
function isArrayLikeObject_isArrayLikeObject(value) {
    return lodash_es_isObjectLike(value) && isArrayLike(value);
}
const isArrayLikeObject = isArrayLikeObject_isArrayLikeObject;
function stubFalse_stubFalse() {
    return false;
}
const stubFalse = stubFalse_stubFalse;
var isBuffer_freeExports = 'object' == typeof exports && exports && !exports.nodeType && exports;
var isBuffer_freeModule = isBuffer_freeExports && 'object' == typeof module && module && !module.nodeType && module;
var isBuffer_moduleExports = isBuffer_freeModule && isBuffer_freeModule.exports === isBuffer_freeExports;
var isBuffer_Buffer = isBuffer_moduleExports ? _root.Buffer : void 0;
var nativeIsBuffer = isBuffer_Buffer ? isBuffer_Buffer.isBuffer : void 0;
var isBuffer = nativeIsBuffer || stubFalse;
const lodash_es_isBuffer = isBuffer;
var objectTag = '[object Object]';
var isPlainObject_funcProto = Function.prototype, isPlainObject_objectProto = Object.prototype;
var isPlainObject_funcToString = isPlainObject_funcProto.toString;
var isPlainObject_hasOwnProperty = isPlainObject_objectProto.hasOwnProperty;
var objectCtorString = isPlainObject_funcToString.call(Object);
function isPlainObject(value) {
    if (!lodash_es_isObjectLike(value) || _baseGetTag(value) != objectTag) return false;
    var proto = _getPrototype(value);
    if (null === proto) return true;
    var Ctor = isPlainObject_hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    return 'function' == typeof Ctor && Ctor instanceof Ctor && isPlainObject_funcToString.call(Ctor) == objectCtorString;
}
const lodash_es_isPlainObject = isPlainObject;
var _baseIsTypedArray_argsTag = '[object Arguments]', arrayTag = '[object Array]', boolTag = '[object Boolean]', dateTag = '[object Date]', errorTag = '[object Error]', _baseIsTypedArray_funcTag = '[object Function]', mapTag = '[object Map]', numberTag = '[object Number]', _baseIsTypedArray_objectTag = '[object Object]', regexpTag = '[object RegExp]', setTag = '[object Set]', stringTag = '[object String]', weakMapTag = '[object WeakMap]';
var arrayBufferTag = '[object ArrayBuffer]', dataViewTag = '[object DataView]', float32Tag = '[object Float32Array]', float64Tag = '[object Float64Array]', int8Tag = '[object Int8Array]', int16Tag = '[object Int16Array]', int32Tag = '[object Int32Array]', uint8Tag = '[object Uint8Array]', uint8ClampedTag = '[object Uint8ClampedArray]', uint16Tag = '[object Uint16Array]', uint32Tag = '[object Uint32Array]';
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[_baseIsTypedArray_argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[_baseIsTypedArray_funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[_baseIsTypedArray_objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
function baseIsTypedArray(value) {
    return lodash_es_isObjectLike(value) && lodash_es_isLength(value.length) && !!typedArrayTags[_baseGetTag(value)];
}
const _baseIsTypedArray = baseIsTypedArray;
function baseUnary(func) {
    return function(value) {
        return func(value);
    };
}
const _baseUnary = baseUnary;
var _nodeUtil_freeExports = 'object' == typeof exports && exports && !exports.nodeType && exports;
var _nodeUtil_freeModule = _nodeUtil_freeExports && 'object' == typeof module && module && !module.nodeType && module;
var _nodeUtil_moduleExports = _nodeUtil_freeModule && _nodeUtil_freeModule.exports === _nodeUtil_freeExports;
var freeProcess = _nodeUtil_moduleExports && _freeGlobal.process;
var nodeUtil = function() {
    try {
        var types = _nodeUtil_freeModule && _nodeUtil_freeModule.require && _nodeUtil_freeModule.require('util').types;
        if (types) return types;
        return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
}();
const _nodeUtil = nodeUtil;
var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;
var isTypedArray_isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;
const isTypedArray = isTypedArray_isTypedArray;
function safeGet(object, key) {
    if ('constructor' === key && 'function' == typeof object[key]) return;
    if ('__proto__' == key) return;
    return object[key];
}
const _safeGet = safeGet;
var _assignValue_objectProto = Object.prototype;
var _assignValue_hasOwnProperty = _assignValue_objectProto.hasOwnProperty;
function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(_assignValue_hasOwnProperty.call(object, key) && lodash_es_eq(objValue, value)) || void 0 === value && !(key in object)) _baseAssignValue(object, key, value);
}
const _assignValue = assignValue;
function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});
    var index = -1, length = props.length;
    while(++index < length){
        var key = props[index];
        var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
        if (void 0 === newValue) newValue = source[key];
        if (isNew) _baseAssignValue(object, key, newValue);
        else _assignValue(object, key, newValue);
    }
    return object;
}
const _copyObject = copyObject;
function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while(++index < n)result[index] = iteratee(index);
    return result;
}
const _baseTimes = baseTimes;
var _isIndex_MAX_SAFE_INTEGER = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
    var type = typeof value;
    length = null == length ? _isIndex_MAX_SAFE_INTEGER : length;
    return !!length && ('number' == type || 'symbol' != type && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}
const _isIndex = isIndex;
var _arrayLikeKeys_objectProto = Object.prototype;
var _arrayLikeKeys_hasOwnProperty = _arrayLikeKeys_objectProto.hasOwnProperty;
function arrayLikeKeys(value, inherited) {
    var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && lodash_es_isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? _baseTimes(value.length, String) : [], length = result.length;
    for(var key in value)if ((inherited || _arrayLikeKeys_hasOwnProperty.call(value, key)) && !(skipIndexes && ('length' == key || isBuff && ('offset' == key || 'parent' == key) || isType && ('buffer' == key || 'byteLength' == key || 'byteOffset' == key) || _isIndex(key, length)))) result.push(key);
    return result;
}
const _arrayLikeKeys = arrayLikeKeys;
function nativeKeysIn(object) {
    var result = [];
    if (null != object) for(var key in Object(object))result.push(key);
    return result;
}
const _nativeKeysIn = nativeKeysIn;
var _baseKeysIn_objectProto = Object.prototype;
var _baseKeysIn_hasOwnProperty = _baseKeysIn_objectProto.hasOwnProperty;
function baseKeysIn(object) {
    if (!lodash_es_isObject(object)) return _nativeKeysIn(object);
    var isProto = _isPrototype(object), result = [];
    for(var key in object)if (!('constructor' == key && (isProto || !_baseKeysIn_hasOwnProperty.call(object, key)))) result.push(key);
    return result;
}
const _baseKeysIn = baseKeysIn;
function keysIn(object) {
    return isArrayLike(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
}
const lodash_es_keysIn = keysIn;
function toPlainObject(value) {
    return _copyObject(value, lodash_es_keysIn(value));
}
const lodash_es_toPlainObject = toPlainObject;
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
    var objValue = _safeGet(object, key), srcValue = _safeGet(source, key), stacked = stack.get(srcValue);
    if (stacked) return void _assignMergeValue(object, key, stacked);
    var newValue = customizer ? customizer(objValue, srcValue, key + '', object, source, stack) : void 0;
    var isCommon = void 0 === newValue;
    if (isCommon) {
        var isArr = isArray(srcValue), isBuff = !isArr && lodash_es_isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
        newValue = srcValue;
        if (isArr || isBuff || isTyped) if (isArray(objValue)) newValue = objValue;
        else if (isArrayLikeObject(objValue)) newValue = _copyArray(objValue);
        else if (isBuff) {
            isCommon = false;
            newValue = _cloneBuffer(srcValue, true);
        } else if (isTyped) {
            isCommon = false;
            newValue = _cloneTypedArray(srcValue, true);
        } else newValue = [];
        else if (lodash_es_isPlainObject(srcValue) || isArguments(srcValue)) {
            newValue = objValue;
            if (isArguments(objValue)) newValue = lodash_es_toPlainObject(objValue);
            else if (!lodash_es_isObject(objValue) || isFunction(objValue)) newValue = _initCloneObject(srcValue);
        } else isCommon = false;
    }
    if (isCommon) {
        stack.set(srcValue, newValue);
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
        stack['delete'](srcValue);
    }
    _assignMergeValue(object, key, newValue);
}
const _baseMergeDeep = baseMergeDeep;
function baseMerge(object, source, srcIndex, customizer, stack) {
    if (object === source) return;
    _baseFor(source, function(srcValue, key) {
        stack || (stack = new _Stack);
        if (lodash_es_isObject(srcValue)) _baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
        else {
            var newValue = customizer ? customizer(_safeGet(object, key), srcValue, key + '', object, source, stack) : void 0;
            if (void 0 === newValue) newValue = srcValue;
            _assignMergeValue(object, key, newValue);
        }
    }, lodash_es_keysIn);
}
const _baseMerge = baseMerge;
function identity(value) {
    return value;
}
const lodash_es_identity = identity;
function apply(func, thisArg, args) {
    switch(args.length){
        case 0:
            return func.call(thisArg);
        case 1:
            return func.call(thisArg, args[0]);
        case 2:
            return func.call(thisArg, args[0], args[1]);
        case 3:
            return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
}
const _apply = apply;
var nativeMax = Math.max;
function overRest(func, start, transform) {
    start = nativeMax(void 0 === start ? func.length - 1 : start, 0);
    return function() {
        var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
        while(++index < length)array[index] = args[start + index];
        index = -1;
        var otherArgs = Array(start + 1);
        while(++index < start)otherArgs[index] = args[index];
        otherArgs[start] = transform(array);
        return _apply(func, this, otherArgs);
    };
}
const _overRest = overRest;
function constant(value) {
    return function() {
        return value;
    };
}
const lodash_es_constant = constant;
var baseSetToString = _defineProperty ? function(func, string) {
    return _defineProperty(func, 'toString', {
        configurable: true,
        enumerable: false,
        value: lodash_es_constant(string),
        writable: true
    });
} : lodash_es_identity;
const _baseSetToString = baseSetToString;
var HOT_COUNT = 800, HOT_SPAN = 16;
var nativeNow = Date.now;
function shortOut(func) {
    var count = 0, lastCalled = 0;
    return function() {
        var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
        lastCalled = stamp;
        if (remaining > 0) {
            if (++count >= HOT_COUNT) return arguments[0];
        } else count = 0;
        return func.apply(void 0, arguments);
    };
}
const _shortOut = shortOut;
var setToString = _shortOut(_baseSetToString);
const _setToString = setToString;
function baseRest(func, start) {
    return _setToString(_overRest(func, start, lodash_es_identity), func + '');
}
const _baseRest = baseRest;
function isIterateeCall(value, index, object) {
    if (!lodash_es_isObject(object)) return false;
    var type = typeof index;
    if ('number' == type ? isArrayLike(object) && _isIndex(index, object.length) : 'string' == type && index in object) return lodash_es_eq(object[index], value);
    return false;
}
const _isIterateeCall = isIterateeCall;
function createAssigner(assigner) {
    return _baseRest(function(object, sources) {
        var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
        customizer = assigner.length > 3 && 'function' == typeof customizer ? (length--, customizer) : void 0;
        if (guard && _isIterateeCall(sources[0], sources[1], guard)) {
            customizer = length < 3 ? void 0 : customizer;
            length = 1;
        }
        object = Object(object);
        while(++index < length){
            var source = sources[index];
            if (source) assigner(object, source, index, customizer);
        }
        return object;
    });
}
const _createAssigner = createAssigner;
var merge = _createAssigner(function(object, source, srcIndex) {
    _baseMerge(object, source, srcIndex);
});
const lodash_es_merge = merge;
function _define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
const DEFAULT_HEADERS = {
    'Accept-Language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7'
};
class WidgetAPI {
    async get(url, options) {
        let baseOptions = {
            headers: DEFAULT_HEADERS
        };
        if (this.getDefaultOptions) try {
            const defaultOptions = await this.getDefaultOptions();
            baseOptions = lodash_es_merge(baseOptions, defaultOptions);
        } catch (error) {
            console.warn("获取默认配置失败，使用基础配置:", error);
        }
        const finalOptions = lodash_es_merge(baseOptions, options);
        try {
            const resp = await Widget.http.get(url, finalOptions);
            if (!resp || 200 !== resp.statusCode) throw new Error(`7}2}1}5}: ${(null == resp ? void 0 : resp.statusCode) || "未知错误"}`);
            return resp.data;
        } catch (error) {
            throw new Error(`1}C}7}2}1}5}: ${error instanceof Error ? error.message : "未知错误"}`);
        }
    }
    async getHtml(url, options) {
        const resp = await this.get(url, options);
        return Widget.html.load(resp);
    }
    constructor(getDefaultOptions){
        _define_property(this, "getDefaultOptions", void 0);
        this.getDefaultOptions = getDefaultOptions;
    }
}
async function getStorageItem(key) {
    return Promise.race([
        Widget.storage.getItem(key),
        new Promise((_, reject)=>setTimeout(()=>reject(new Error('timeout')), 1000))
    ]);
}
async function setStorageItem(key, value) {
    return Promise.race([
        Widget.storage.setItem(key, value),
        new Promise((_, reject)=>setTimeout(()=>reject(new Error('timeout')), 1000))
    ]);
}
const BASE_URL = 'https://www.xvideos.com';
const widgetAPI = new WidgetAPI(async ()=>{
    try {
        const sessionToken = await getStorageItem('xvideos.session_token');
        console.log('sessionToken', sessionToken);
        return {
            headers: {
                Cookie: `session_token=${sessionToken}`
            }
        };
    } catch (error) {
        console.error("获取默认配置失败，使用基础配置:", error);
        return {};
    }
});
WidgetMetadata = {
    id: 'XVideos',
    title: 'XVideos',
    description: 'XVideos 视频资源浏览模块，支持最新、热门、分类、标签、频道和明星筛选',
    version: "1.0.0",
    requiredVersion: '0.0.1',
    author: "网络|EL",
    site: 'https://www.xvideos.com',
    detailCacheDuration: 3600,
    modules: [
        {
            id: 'xvideos.new',
            title: "最新",
            description: "XVideos 最新视频",
            functionName: 'getNewList',
            params: [
                {
                    name: 'page',
                    title: "页码",
                    type: 'page',
                    value: '0'
                }
            ]
        },
        {
            id: 'xvideos.best',
            title: "热门",
            description: "XVideos 热门视频",
            functionName: 'getBestList',
            params: [
                {
                    name: 'mode',
                    title: "类型",
                    type: 'input',
                    value: 'free',
                    placeholders: [
                        { title: '免费', value: 'free' },
                        { title: 'RED视频', value: 'red' }
                    ]
                },
                {
                    name: 'archive',
                    title: "月份",
                    type: 'input',
                    value: '2026-04',
                    placeholders: [
                        { title: '2026-04', value: '2026-04' },
                        { title: '2026-03', value: '2026-03' },
                        { title: '2026-02', value: '2026-02' },
                        { title: '2026-01', value: '2026-01' },
                        { title: '2025-12', value: '2025-12' },
                        { title: '2025-11', value: '2025-11' },
                        { title: '2025-10', value: '2025-10' },
                        { title: '2025-09', value: '2025-09' },
                        { title: '2025-08', value: '2025-08' },
                        { title: '2025-07', value: '2025-07' },
                        { title: '2025-06', value: '2025-06' },
                        { title: '2025-05', value: '2025-05' },
                        { title: '2025-04', value: '2025-04' },
                        { title: '2025-03', value: '2025-03' },
                        { title: '2025-02', value: '2025-02' },
                        { title: '2025-01', value: '2025-01' },
                        { title: '2024-12', value: '2024-12' },
                        { title: '2024-11', value: '2024-11' },
                        { title: '2024-10', value: '2024-10' },
                        { title: '2024-09', value: '2024-09' },
                        { title: '2024-08', value: '2024-08' },
                        { title: '2024-07', value: '2024-07' },
                        { title: '2024-06', value: '2024-06' },
                        { title: '2024-05', value: '2024-05' },
                        { title: '2024-04', value: '2024-04' },
                        { title: '2024-03', value: '2024-03' },
                        { title: '2024-02', value: '2024-02' },
                        { title: '2024-01', value: '2024-01' },
                        { title: '2023-12', value: '2023-12' },
                        { title: '2023-11', value: '2023-11' },
                        { title: '2023-10', value: '2023-10' },
                        { title: '2023-09', value: '2023-09' },
                        { title: '2023-08', value: '2023-08' },
                        { title: '2023-07', value: '2023-07' },
                        { title: '2023-06', value: '2023-06' },
                        { title: '2023-05', value: '2023-05' },
                        { title: '2023-04', value: '2023-04' },
                        { title: '2023-03', value: '2023-03' },
                        { title: '2023-02', value: '2023-02' },
                        { title: '2023-01', value: '2023-01' },
                        { title: '2022-12', value: '2022-12' },
                        { title: '2022-11', value: '2022-11' },
                        { title: '2022-10', value: '2022-10' },
                        { title: '2022-09', value: '2022-09' },
                        { title: '2022-08', value: '2022-08' },
                        { title: '2022-07', value: '2022-07' },
                        { title: '2022-06', value: '2022-06' },
                        { title: '2022-05', value: '2022-05' },
                        { title: '2022-04', value: '2022-04' },
                        { title: '2022-03', value: '2022-03' },
                        { title: '2022-02', value: '2022-02' },
                        { title: '2022-01', value: '2022-01' },
                        { title: '2021-12', value: '2021-12' },
                        { title: '2021-11', value: '2021-11' },
                        { title: '2021-10', value: '2021-10' },
                        { title: '2021-09', value: '2021-09' },
                        { title: '2021-08', value: '2021-08' },
                        { title: '2021-07', value: '2021-07' },
                        { title: '2021-06', value: '2021-06' },
                        { title: '2021-05', value: '2021-05' },
                        { title: '2021-04', value: '2021-04' },
                        { title: '2021-03', value: '2021-03' },
                        { title: '2021-02', value: '2021-02' },
                        { title: '2021-01', value: '2021-01' },
                        { title: '2020-12', value: '2020-12' },
                        { title: '2020-11', value: '2020-11' },
                        { title: '2020-10', value: '2020-10' },
                        { title: '2020-09', value: '2020-09' },
                        { title: '2020-08', value: '2020-08' },
                        { title: '2020-07', value: '2020-07' },
                        { title: '2020-06', value: '2020-06' },
                        { title: '2020-05', value: '2020-05' },
                        { title: '2020-04', value: '2020-04' },
                        { title: '2020-03', value: '2020-03' },
                        { title: '2020-02', value: '2020-02' },
                        { title: '2020-01', value: '2020-01' },
                        { title: '2019-12', value: '2019-12' },
                        { title: '2019-11', value: '2019-11' },
                        { title: '2019-10', value: '2019-10' },
                        { title: '2019-09', value: '2019-09' },
                        { title: '2019-08', value: '2019-08' },
                        { title: '2019-07', value: '2019-07' },
                        { title: '2019-06', value: '2019-06' },
                        { title: '2019-05', value: '2019-05' },
                        { title: '2019-04', value: '2019-04' },
                        { title: '2019-03', value: '2019-03' },
                        { title: '2019-02', value: '2019-02' },
                        { title: '2019-01', value: '2019-01' },
                        { title: '2018-12', value: '2018-12' },
                        { title: '2018-11', value: '2018-11' },
                        { title: '2018-10', value: '2018-10' },
                        { title: '2018-09', value: '2018-09' },
                        { title: '2018-08', value: '2018-08' },
                        { title: '2018-07', value: '2018-07' },
                        { title: '2018-06', value: '2018-06' },
                        { title: '2018-05', value: '2018-05' },
                        { title: '2018-04', value: '2018-04' },
                        { title: '2018-03', value: '2018-03' },
                        { title: '2018-02', value: '2018-02' },
                        { title: '2018-01', value: '2018-01' },
                        { title: '2017-12', value: '2017-12' },
                        { title: '2017-11', value: '2017-11' },
                        { title: '2017-10', value: '2017-10' },
                        { title: '2017-09', value: '2017-09' },
                        { title: '2017-08', value: '2017-08' },
                        { title: '2017-07', value: '2017-07' },
                        { title: '2017-06', value: '2017-06' },
                        { title: '2017-05', value: '2017-05' },
                        { title: '2017-04', value: '2017-04' },
                        { title: '2017-03', value: '2017-03' },
                        { title: '2017-02', value: '2017-02' },
                        { title: '2017-01', value: '2017-01' },
                        { title: '2016-12', value: '2016-12' },
                        { title: '2016-11', value: '2016-11' },
                        { title: '2016-10', value: '2016-10' },
                        { title: '2016-09', value: '2016-09' },
                        { title: '2016-08', value: '2016-08' },
                        { title: '2016-07', value: '2016-07' },
                        { title: '2016-06', value: '2016-06' },
                        { title: '2016-05', value: '2016-05' },
                        { title: '2016-04', value: '2016-04' },
                        { title: '2016-03', value: '2016-03' },
                        { title: '2016-02', value: '2016-02' },
                        { title: '2016-01', value: '2016-01' },
                        { title: '2015-12', value: '2015-12' },
                        { title: '2015-11', value: '2015-11' },
                        { title: '2015-10', value: '2015-10' },
                        { title: '2015-09', value: '2015-09' },
                        { title: '2015-08', value: '2015-08' },
                        { title: '2015-07', value: '2015-07' },
                        { title: '2015-06', value: '2015-06' },
                        { title: '2015-05', value: '2015-05' },
                        { title: '2015-04', value: '2015-04' },
                        { title: '2015-03', value: '2015-03' },
                        { title: '2015-02', value: '2015-02' },
                        { title: '2015-01', value: '2015-01' },
                        { title: '2014-12', value: '2014-12' },
                        { title: '2014-11', value: '2014-11' },
                        { title: '2014-10', value: '2014-10' },
                        { title: '2014-09', value: '2014-09' },
                        { title: '2014-08', value: '2014-08' },
                        { title: '2014-07', value: '2014-07' },
                        { title: '2014-06', value: '2014-06' },
                        { title: '2014-05', value: '2014-05' },
                        { title: '2014-04', value: '2014-04' },
                        { title: '2014-03', value: '2014-03' },
                        { title: '2014-02', value: '2014-02' },
                        { title: '2014-01', value: '2014-01' },
                        { title: '2013-12', value: '2013-12' },
                        { title: '2013-11', value: '2013-11' },
                        { title: '2013-10', value: '2013-10' },
                        { title: '2013-09', value: '2013-09' },
                        { title: '2013-08', value: '2013-08' },
                        { title: '2013-07', value: '2013-07' }
                    ]
                },
                {
                    name: 'page',
                    title: "页码",
                    type: 'page',
                    value: '0'
                }
            ]
        },
        {
            id: 'xvideos.category',
            title: "分类",
            description: "XVideos 分类视频",
            functionName: 'getCategoryList',
            params: [
                {
                    name: 'category',
                    title: "分类",
                    type: 'input',
                    value: '',
                    placeholders: [
                        { title: '中文色情', value: 'lang/chinese' },
                        { title: 'AI', value: 'c/AI-239' },
                        { title: '业余', value: 'c/Amateur-65' },
                        { title: '肛交', value: 'c/Anal-12' },
                        { title: '阿拉伯', value: 'c/Arab-159' },
                        { title: '亚洲', value: 'c/Asian_Woman-32' },
                        { title: 'ASMR', value: 'c/ASMR-229' },
                        { title: '臀部', value: 'c/Ass-14' },
                        { title: '双性恋', value: 'c/Bi_Sexual-62' },
                        { title: '大屁股', value: 'c/Big_Ass-24' },
                        { title: '大鸡巴', value: 'c/Big_Cock-34' },
                        { title: '大胸', value: 'c/Big_Tits-23' },
                        { title: '黑人', value: 'c/Black_Woman-30' },
                        { title: '金发', value: 'c/Blonde-20' },
                        { title: '口交', value: 'c/Blowjob-15' },
                        { title: '黑发', value: 'c/Brunette-25' },
                        { title: '摄像头色情', value: 'c/Cam_Porn-58' },
                        { title: '中出', value: 'c/Creampie-40' },
                        { title: '绿帽/热妻', value: 'c/Cuckold-237' },
                        { title: '射精', value: 'c/Cumshot-18' },
                        { title: '女王调教', value: 'c/Femdom-235' },
                        { title: '拳交', value: 'c/Fisting-165' },
                        { title: '混乱家庭', value: 'c/Fucked_Up_Family-81' },
                        { title: '群交', value: 'c/Gangbang-69' },
                        { title: '扩张', value: 'c/Gapes-167' },
                        { title: '跨种族', value: 'c/Interracial-27' },
                        { title: '拉丁裔', value: 'c/Latina-16' },
                        { title: '女同性恋', value: 'c/Lesbian-26' },
                        { title: '情趣内衣', value: 'c/Lingerie-83' },
                        { title: '熟女', value: 'c/Mature-38' },
                        { title: '美艳人妻', value: 'c/Milf-19' },
                        { title: '涂油', value: 'c/Oiled-22' },
                        { title: '红发', value: 'c/Redhead-31' },
                        { title: '单人/自慰', value: 'c/Solo_and_Masturbation-33' },
                        { title: '潮喷', value: 'c/Squirting-56' },
                        { title: '丝袜', value: 'c/Stockings-28' },
                        { title: '青少年', value: 'c/Teen-13' }
                    ]
                },
                {
                    name: 'page',
                    title: "页码",
                    type: 'page',
                    value: '0'
                }
            ]
        },
        {
            id: 'xvideos.tag',
            title: "标签",
            description: "XVideos 标签视频",
            functionName: 'getTagList',
            params: [
                {
                    name: 'tag',
                    title: "标签",
                    type: 'input',
                    value: '',
                    placeholders: [
                        { title: '业余', value: 'amateur' },
                        { title: '亚洲', value: 'asian' },
                        { title: '最佳', value: 'best' },
                        { title: '口交', value: 'blowjob' },
                        { title: '情侣', value: 'couple' },
                        { title: '中出', value: 'creampie' },
                        { title: '女孩', value: 'girls' },
                        { title: '熟女', value: 'milf' },
                        { title: '阴部', value: 'pussy' },
                        { title: '少女', value: 'teen' },
                        { title: '丝袜', value: 'stockings' },
                        { title: '女性', value: 'woman' },
                        { title: '日本', value: 'japanese' },
                        { title: '中文', value: 'chinese' },
                        { title: '浓稠分泌', value: 'creamy' },
                        { title: '香港', value: 'hong-kong' },
                        { title: '中国', value: 'china' },
                        { title: '韩国', value: 'korea' },
                        { title: '泰国', value: 'thai' },
                        { title: '角色扮演', value: 'cosplay' },
                        { title: '游戏', value: 'game' },
                        { title: 'ASMR', value: 'ASMR-229' },
                        { title: 'Roblox', value: 'roblox' },
                        { title: '电影', value: 'movie' },
                        { title: '日本人妻', value: 'japanese-wife' },
                        { title: '肛交', value: 'anal' },
                        { title: '臀部', value: 'ass' },
                        { title: '肥臀', value: 'big-ass' },
                        { title: '大胸', value: 'big-tits' },
                        { title: '大鸡巴', value: 'big-cock' },
                        { title: '直播', value: 'cam' },
                        { title: '射精时刻', value: 'cumshot' },
                        { title: '后入式', value: 'doggystyle' },
                        { title: '拳交', value: 'fisting' },
                        { title: '跨种族', value: 'interracial' },
                        { title: '情趣内衣', value: 'lingerie' },
                        { title: '涂油', value: 'oiled' },
                        { title: '红发', value: 'redhead' },
                        { title: '潮喷', value: 'squirting' },
                        { title: '拉丁裔', value: 'latina' },
                        { title: '阿拉伯', value: 'arab' },
                        { title: '黑人', value: 'black' },
                        { title: '女上位', value: 'femdom' },
                        { title: '扩张', value: 'gapes' },
                        { title: '熟女', value: 'mature' },
                        { title: '按摩', value: 'massage' }
                    ]
                },
                {
                    name: 'page',
                    title: "页码",
                    type: 'page',
                    value: '0'
                }
            ]
        },
        {
            id: 'xvideos.channel',
            title: "频道",
            description: "XVideos 频道",
            functionName: 'getChannelList',
            params: [
                {
                    name: 'channel',
                    title: "频道",
                    type: 'input',
                    value: '',
                    placeholders: [
                        {
                            title: 'AsiaM',
                            value: 'asiam'
                        },
                        {
                            title: 'Vixen',
                            value: 'vixen-1'
                        },

                        {
                            title: 'Tushy',
                            value: 'tushy_com'
                        },
                        {
                            title: 'AV Jiali',
                            value: 'av-jiali'
                        },


                        {
                            title: 'Japan HDV',
                            value: 'japan-hdv'
                        },
                        {
                            title: 'Jav HD',
                            value: 'javhd'
                        },
                        {
                            title: 'Caribbeancom',
                            value: 'caribbeancom'
                        },
                        {
                            title: 'Hisidepon',
                            value: 'hisidepon'
                        },

                        {
                            title: 'MOON FORCE',
                            value: 'moonforce'
                        },
                        {
                            title: 'Mya Mya',
                            value: 'myanma_porn'
                        },
                        {
                            title: 'Zzzgirlxxx',
                            value: 'zzzgirlxxx'
                        },
                        {
                            title: 'Guodong Media',
                            value: 'guodong_media'
                        },

                        {
                            title: 'YOSUGA',
                            value: 'yosuga'
                        },
                        {
                            title: 'Momoka',
                            value: 'japanese31'
                        },
                        {
                            title: 'Raptor Inc',
                            value: 'raptor_inc'
                        },
                        {
                            title: 'Girls of HEL',
                            value: 'girlsofhel_official'
                        },
                        {
                            title: 'Armadillo',
                            value: 'shiroutotv'
                        },
                        {
                            title: '1pondo',
                            value: 'ipondo'
                        },
                        {
                            title: 'Swaglive',
                            value: 'swaglive'
                        },
                        {
                            title: 'NIKSINDIAN',
                            value: 'niks_indian'
                        },

                        {
                            title: 'S Cute Official',
                            value: 's-cute-official'
                        },

                        {
                            title: 'Japaneserxrx',
                            value: 'japaneserxrx'
                        },

                        {
                            title: 'JapBliss',
                            value: 'japbliss'
                        },
                        {
                            title: 'Hey Milf',
                            value: 'heymilf'
                        },
                        {
                            title: 'Tenshigao',
                            value: 'tenshigao'
                        },
                        {
                            title: 'AV 69',
                            value: 'av69tv'
                        },
                        {
                            title: 'Jukujosukidesu',
                            value: 'jukujosukidesu'
                        },
                        {
                            title: 'Schoolgirls HD',
                            value: 'schoolgirlshd'
                        },
                        {
                            title: 'PrivateSociety',
                            value: 'privatesociety'
                        },
                        {
                            title: 'Dogfart Network',
                            value: 'dogfartnetwork'
                        },
                        {
                            title: 'Jav HD',
                            value: 'javhd'
                        },
                        {
                            title: 'PutaLocura Oficial',
                            value: 'putalocura_oficial'
                        },
                        {
                            title: 'Net Video Girls',
                            value: 'netvideogirls'
                        },
                        {
                            title: 'Japan HDV',
                            value: 'japan-hdv'
                        },
                        {
                            title: 'Sara Jay',
                            value: 'sara-jay'
                        },
                        {
                            title: 'Caribbeancom',
                            value: 'caribbeancom'
                        },
                        {
                            title: 'Pervcity',
                            value: 'pervcity'
                        },
                        {
                            title: 'MadeInCanarias',
                            value: 'madeincanarias'
                        },
                        {
                            title: 'BangBros 18',
                            value: 'bangbros-18'
                        },
                        {
                            title: 'Exposed Latinas',
                            value: 'exposedlatinas'
                        },
                        {
                            title: 'Oldje',
                            value: 'cindyca'
                        },
                        {
                            title: 'New Sensations',
                            value: 'newsensations'
                        },
                        {
                            title: 'CamSoda',
                            value: 'camsoda'
                        },
                        {
                            title: 'Moms Teach Sex',
                            value: 'momsteachsex'
                        },
                        {
                            title: 'Primal Fetish',
                            value: 'primalfetish'
                        },
                        {
                            title: 'Backroom Casting Couch',
                            value: 'backroomcastingcouch'
                        },
                        {
                            title: 'Mandy Flores',
                            value: 'mandy-flores'
                        },
                        {
                            title: 'Step Siblings Caught',
                            value: 'step-siblings-caught'
                        },
                        {
                            title: 'Digital Playground',
                            value: 'digital-playground'
                        },
                        {
                            title: 'ShopLyfter',
                            value: 'shoplyfter'
                        },
                        {
                            title: '21Naturals',
                            value: '21naturals'
                        },
                        {
                            title: 'Perv Mom',
                            value: 'perv-mom'
                        },
                        {
                            title: 'Sis Loves Me',
                            value: 'sis-loves-me'
                        },
                        {
                            title: 'Fake Hub',
                            value: 'fake-hub'
                        },
                        {
                            title: 'Net Video Girls',
                            value: 'net-video-girls'
                        },
                        {
                            title: 'Japan HDV',
                            value: 'japan-hdv'
                        },
                        {
                            title: 'Caribbeancom',
                            value: 'caribbeancom'
                        },
                        {
                            title: 'Emuyumi Couple',
                            value: 'emuyumi-couple'
                        },
                        {
                            title: 'Monger In Asia',
                            value: 'monger-in-asia'
                        },
                        {
                            title: 'All Japanese Pass',
                            value: 'alljapanesepass'
                        },
                        {
                            title: 'AV Stockings',
                            value: 'avstockings'
                        },
                        {
                            title: 'Asians Bondage',
                            value: 'asians-bondage'
                        },
                        {
                            title: 'Eagle MILF',
                            value: 'eagle-milf'
                        },
                        {
                            title: 'PETERS',
                            value: 'peters-1'
                        }
                    ]
                },
                {
                    name: 'page',
                    title: "页码",
                    type: 'page',
                    value: '0'
                }
            ]
        },
        {
            id: 'xvideos.pornstars',
            title: "明星",
            description: "XVideos 色情明星",
            functionName: 'getPornstarsList',
            params: [
                {
                    name: 'pornstar',
                    title: "色情明星",
                    type: 'input',
                    placeholders: [
                        { title: 'Su Chang', value: 'su-chang-model' },
                        { title: 'Yui Hatano', value: 'yui-hatano-1' },
                        { title: 'Sweetie Fox', value: 'sweetie-fox1' },
                        { title: 'Riley Reid', value: 'riley-reid-1-model' },
                        { title: 'Anissa Miller', value: 'anissa-miller-model' },
                        { title: 'Keila Bassi', value: 'keilabassi77-model' },
                        { title: 'Lana Rhoades', value: 'lana-rhoades' },
                        { title: 'Hot Pearl', value: 'hot-pearl2' },
                        { title: 'Leana Lovings', value: 'leana-lovings' },
                        { title: 'Skye Young', value: 'skye-young2' },
                        { title: 'Lilibet Saunders', value: 'lilibet-saunders-model' },
                        { title: 'Shrooms Q', value: 'shrooms-q-model' },
                        { title: 'Nicole Murkovski', value: 'nicole-murkovski1' },
                        { title: 'Molly Little', value: 'molly-little' },
                        { title: 'Melody Marks', value: 'melody-marks' },
                        { title: 'Emily Willis', value: 'emily-willis' },
                        { title: 'Gabbie Carter', value: 'gabbie-carter' },
                        { title: 'Lia Lin', value: 'lia-lin' },
                        { title: 'Vale Nappi', value: 'vale_nappi3' },
                        { title: 'Dylann Vox', value: 'dylann-vox' },
                        { title: 'Stella Cox', value: 'stella-cox' },
                        { title: 'Eva Elfie', value: 'eva_elfie-model' },
                        { title: 'Gia Paige', value: 'gia-paige' },
                        { title: 'Bunny Colby', value: 'bunny-colby' },
                        { title: 'Ruka Kanae', value: 'ruka-kanae' },
                        { title: 'Ruka Kanae', value: 'ruka-kanae' }
                    ]
                },
                {
                    name: 'page',
                    title: "页码",
                    type: 'page',
                    value: '0'
                }
            ]
        }
    ]
};
const generateVideoPreviewUrl = (thumbnailUrl)=>`${thumbnailUrl.substring(0, thumbnailUrl.lastIndexOf('/')).replace(/\/thumbs(169)?(xnxx)?((l*)|(poster))\//, '/videopreview/').replace(/(-[0-9]+)_([0-9]+)/, '_$2$1')}_169.mp4`;
const formatUrl = (url)=>{
    if (url.startsWith('//')) return `https:${url}`;
    if (url.startsWith('/')) return `${BASE_URL}${url}`;
    return url;
};
const formatXVideosItem = (item)=>{
    const url = formatUrl(item.u);
    const childItem = {
        id: url,
        type: 'url',
        mediaType: 'movie',
        link: url,
        title: lodash_es_unescape(item.tf || item.t),
        backdropPath: item.i,
        previewUrl: generateVideoPreviewUrl(item.i)
    };
    return childItem;
};
async function getNewList(params) {
    try {
        const currentRegion = await getStorageItem('xvideos.region');
        if (currentRegion !== params.region) {
            setStorageItem('xvideos.region', params.region);
            const resp = await Widget.http.get(`${BASE_URL}/change-country/${params.region}`);
            if (resp.headers['set-cookie']) {
                const cookies = resp.headers['set-cookie'].split(';');
                for (const cookie of cookies){
                    const [key, value] = cookie.split('=');
                    if ('session_token' === key) {
                        setStorageItem('xvideos.session_token', value);
                        break;
                    }
                }
            }
        }
    } catch (error) {}
    const page = params.page ? Number.parseInt(params.page) : 0;
    let url = `${BASE_URL}/`;
    if (page > 0) url += `new/${page}`;
    const $ = await widgetAPI.getHtml(url);
    const list = Array.from($('#content .thumb-block:not(.thumb-ad)')).map((el)=>{
        const $el = $(el);
        const $title = $el.find('.title a');
        let link = $title.attr('href');
        if (!link) return null;
        link = formatUrl(link);
        const backdropPath = $el.find('.thumb img').attr('data-src');
        const title = $title.text().trim();
        const result = {
            id: link,
            type: 'url',
            mediaType: 'movie',
            link,
            title,
            backdropPath
        };
        if (backdropPath) result.previewUrl = generateVideoPreviewUrl(backdropPath);
        return result;
    });
    return list.filter((item)=>null !== item);
}
function parsePage(params) {
    return params.page ? Number.parseInt(params.page) : 0;
}
async function getChannelList(params) {
    const page = parsePage(params);
    try {
        const resp = await widgetAPI.get(`${BASE_URL}/channels/${params.channel}/videos/best/${page}`);
        const list = resp.videos.map(formatXVideosItem);
        return list;
    } catch (error) {
        console.error("频道视频加载失败", error);
        return [];
    }
}
async function getPornstarsList(params) {
    const page = parsePage(params);
    try {
        const resp = await widgetAPI.get(`${BASE_URL}/pornstars/${params.pornstar}/videos/best/${page}`);
        const list = resp.videos.map(formatXVideosItem);
        return list;
    } catch (error) {
        console.error("色情明星视频加载失败", error);
        return [];
    }
}
let cachedBestArchive = '';
async function getBestArchive() {
    if (cachedBestArchive) return cachedBestArchive;
    try {
        const $ = await widgetAPI.getHtml(`${BASE_URL}/best`);
        const links = $('a[href^="/best/"]')
            .toArray()
            .map((el)=>$(el).attr('href'))
            .filter(Boolean);
        const href = links.find((link)=>/^\/best\/\d{4}-\d{2}$/.test(link || '')) || '';
        cachedBestArchive = href.replace(/^\//, '').replace(/\/$/, '');
        return cachedBestArchive;
    } catch (error) {
        console.error("热门归档解析失败", error);
        return '';
    }
}
async function getBestList(params) {
    const page = parsePage(params);
    const archive = params.archive || '';
    const mode = (params.mode || 'free').toLowerCase();
    try {
        let url = `${BASE_URL}/best`;
        if (archive) {
            url = mode === 'red' ? `${BASE_URL}/best-of-red/${archive}` : `${BASE_URL}/best/${archive}`;
            if (page > 0) url += `/${page}`;
        } else if (page > 0) {
            const bestArchive = await getBestArchive();
            if (bestArchive) url = `${BASE_URL}/best/${bestArchive}/${page}`;
        }
        const $ = await widgetAPI.getHtml(url);
        const blocks = $('#content .thumb-block:not(.thumb-ad), .thumb-block:not(.thumb-ad)');
        const list = Array.from(blocks).map((el)=>{
            const $el = $(el);
            const $title = $el.find('.title a').first();
            let link = $title.attr('href');
            if (!link) return null;
            link = formatUrl(link);
            const backdropPath = $el.find('.thumb img').attr('data-src') || $el.find('.thumb img').attr('src');
            const title = $title.text().trim();
            const result = { id: link, type: 'url', mediaType: 'movie', link, title, backdropPath };
            if (backdropPath) result.previewUrl = generateVideoPreviewUrl(backdropPath);
            return result;
        });
        const filtered = list.filter((item)=>null !== item);
        if (filtered.length) return filtered;
        const fallbackLinks = $('a[href^="/video."]').toArray();
        return fallbackLinks.map((el)=>{
            const $el = $(el);
            const link = formatUrl($el.attr('href'));
            const title = $el.text().trim();
            if (!link) return null;
            return {
                id: link,
                type: 'url',
                mediaType: 'movie',
                link,
                title: title || link
            };
        }).filter((item)=>null !== item);
    } catch (error) {
        console.error("热门视频加载失败", error);
        return [];
    }
}
async function getCategoryList(params) {
    const page = parsePage(params);
    try {
        const categoryPath = params.category || '';
        const url = categoryPath.startsWith('lang/') || categoryPath.startsWith('gay') || categoryPath.startsWith('shemale')
            ? `${BASE_URL}/${categoryPath}`
            : `${BASE_URL}/${categoryPath}`;
        const finalUrl = page > 0 && categoryPath.startsWith('c/') ? `${url}/${page}` : url;
        const $ = await widgetAPI.getHtml(finalUrl);
        const list = Array.from($('#content .thumb-block:not(.thumb-ad)')).map((el)=>{
            const $el = $(el);
            const $title = $el.find('.title a');
            let link = $title.attr('href');
            if (!link) return null;
            link = formatUrl(link);
            const backdropPath = $el.find('.thumb img').attr('data-src');
            const title = $title.text().trim();
            const result = { id: link, type: 'url', mediaType: 'movie', link, title, backdropPath };
            if (backdropPath) result.previewUrl = generateVideoPreviewUrl(backdropPath);
            return result;
        });
        return list.filter((item)=>null !== item);
    } catch (error) {
        console.error("分类视频加载失败", error);
        return [];
    }
}
async function getTagList(params) {
    const page = parsePage(params);
    try {
        const url = `${BASE_URL}/tags/${params.tag}${page > 0 ? `/${page}` : ''}`;
        const $ = await widgetAPI.getHtml(url);
        const list = Array.from($('#content .thumb-block:not(.thumb-ad)')).map((el)=>{
            const $el = $(el);
            const $title = $el.find('.title a');
            let link = $title.attr('href');
            if (!link) return null;
            link = formatUrl(link);
            const backdropPath = $el.find('.thumb img').attr('data-src');
            const title = $title.text().trim();
            const result = { id: link, type: 'url', mediaType: 'movie', link, title, backdropPath };
            if (backdropPath) result.previewUrl = generateVideoPreviewUrl(backdropPath);
            return result;
        });
        return list.filter((item)=>null !== item);
    } catch (error) {
        console.error("标签视频加载失败", error);
        return [];
    }
}
const VIDEO_URL_KEYWORDS = [
    'html5player.setVideoUrlHigh',
    'html5player.setVideoHLS',
    'html5player.setVideoUrlLow'
];
async function loadDetail(url) {
    try {
        const $ = await widgetAPI.getHtml(url);
        const script = $("script").filter((_, el)=>{
            const text = $(el).text();
            return VIDEO_URL_KEYWORDS.some((keyword)=>text.includes(keyword));
        });
        let videoUrl = '';
        for (const keyword of VIDEO_URL_KEYWORDS){
            var _script_text_match;
            videoUrl = (null == (_script_text_match = script.text().match(new RegExp(`${keyword}\\('(.*?)'`))) ? void 0 : _script_text_match[1]) || '';
            if (videoUrl) break;
        }
        const ldJson = $('script[type="application/ld+json"]').text();
        const ldJsonData = JSON.parse(ldJson);
        videoUrl || (videoUrl = ldJsonData.contentUrl);
        if (!videoUrl) throw new Error("未找到视频资源");
        const result = {
            id: url,
            type: 'detail',
            mediaType: 'movie',
            link: url,
            videoUrl,
            title: ldJsonData.name,
            description: ldJsonData.description,
            backdropPath: ldJsonData.thumbnailUrl[0],
            releaseDate: ldJsonData.uploadDate
        };
        try {
            var _videoRelated_text_match;
            const videoRelated = $("script").filter((_, el)=>{
                const text = $(el).text();
                return text.includes('var video_related=');
            });
            const videoRelatedData = null == (_videoRelated_text_match = videoRelated.text().match(/video_related=\[(.*?)\];/)) ? void 0 : _videoRelated_text_match[1];
            if (videoRelatedData) {
                const videoRelatedList = JSON.parse(`[${videoRelatedData}]`);
                result.childItems = videoRelatedList.map(formatXVideosItem);
            }
        } catch (error) {
            console.error("视频相关视频加载失败", error);
        }
        return result;
    } catch (error) {
        console.error("视频详情加载失败", error);
        return null;
    }
}
;
