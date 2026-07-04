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
var freeGlobal = 'object' == typeof global && global && global.Object === Object && global;
const _freeGlobal = freeGlobal;
var freeSelf = 'object' == typeof self && self && self.Object === Object && self;
var root = _freeGlobal || freeSelf || Function('return this')();
const _root = root;
var Symbol = _root.Symbol;
const _Symbol = Symbol;
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
function isObject(value) {
    var type = typeof value;
    return null != value && ('object' == type || 'function' == type);
}
const lodash_es_isObject = isObject;
var asyncTag = '[object AsyncFunction]', funcTag = '[object Function]', genTag = '[object GeneratorFunction]', proxyTag = '[object Proxy]';
function isFunction(value) {
    if (!lodash_es_isObject(value)) return false;
    var tag = _baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
const lodash_es_isFunction = isFunction;
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
    var pattern = lodash_es_isFunction(value) ? reIsNative : reIsHostCtor;
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
function isObjectLike(value) {
    return null != value && 'object' == typeof value;
}
const lodash_es_isObjectLike = isObjectLike;
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
var isArray_isArray = Array.isArray;
const isArray = isArray_isArray;
var MAX_SAFE_INTEGER = 9007199254740991;
function isLength(value) {
    return 'number' == typeof value && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
const lodash_es_isLength = isLength;
function isArrayLike_isArrayLike(value) {
    return null != value && lodash_es_isLength(value.length) && !lodash_es_isFunction(value);
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
function keysIn_keysIn(object) {
    return isArrayLike(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
}
const keysIn = keysIn_keysIn;
function toPlainObject_toPlainObject(value) {
    return _copyObject(value, keysIn(value));
}
const toPlainObject = toPlainObject_toPlainObject;
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
            if (isArguments(objValue)) newValue = toPlainObject(objValue);
            else if (!lodash_es_isObject(objValue) || lodash_es_isFunction(objValue)) newValue = _initCloneObject(srcValue);
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
    }, keysIn);
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
            if (!resp || 200 !== resp.statusCode) throw new Error(`请求失败: ${(null == resp ? void 0 : resp.statusCode) || "未知错误"}`);
            return resp.data;
        } catch (error) {
            throw new Error(`网络请求失败: ${error instanceof Error ? error.message : "未知错误"}`);
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
const DEFAULT_BASE_URL = 'https://91porn.com';
const widgetAPI = new WidgetAPI();

const CATEGORY_MAP = {
    hot: { title: '当前最热', category: 'hot' },
    ori: { title: '原创', category: 'ori' },
    top: { title: '本月最热', category: 'top' },
    top_last: { title: '上月热门', category: 'top', extra: '&m=-1' },
    long: { title: '10分钟以上', category: 'long' },
    longer: { title: '20分钟以上', category: 'longer' },
    tf: { title: '收藏最多', category: 'tf' },
    rf: { title: '最近加精', category: 'rf' },
    hd: { title: '高清', category: 'hd' },
    md: { title: '本月讨论', category: 'md' },
    mf: { title: '本月收藏', category: 'mf' }
};

WidgetMetadata = {
    id: '91porn_makka',
    title: '91Porn',
    author: '𝙈𝙖𝙠𝙠𝙖𝙋𝙖𝙠𝙠𝙖|EL',
    description: '91Porn 分类浏览与全局搜索模块',
    version: '2.0.0',
    requiredVersion: '0.0.1',
    site: 'https://91porn.com',
    detailCacheDuration: 60,
    modules: [
        {
            id: '91porn.hot',
            title: '热门',
            description: '当前最热 / 本月最热 / 本月讨论 / 上月热门 / 最近加精',
            cacheDuration: 3600,
            requiresWebView: false,
            functionName: 'loadHotGroup',
            params: [
                { name: 'page', title: '页码', type: 'page', value: '1' },
                {
                    name: 'category',
                    title: '分类',
                    type: 'enumeration',
                    value: 'hot',
                    enumOptions: [
                        { value: 'hot', title: CATEGORY_MAP.hot.title },
                        { value: 'top', title: CATEGORY_MAP.top.title },
                        { value: 'md', title: CATEGORY_MAP.md.title },
                        { value: 'top_last', title: CATEGORY_MAP.top_last.title },
                        { value: 'rf', title: CATEGORY_MAP.rf.title }
                    ]
                }
            ]
        },
        {
            id: '91porn.ori',
            title: '原创',
            description: '91原创',
            cacheDuration: 3600,
            requiresWebView: false,
            functionName: 'loadOri',
            params: [{ name: 'page', title: '页码', type: 'page', value: '1' }]
        },
        {
            id: '91porn.tf',
            title: '收藏',
            description: '本月收藏 / 收藏最多',
            cacheDuration: 3600,
            requiresWebView: false,
            functionName: 'loadFavoritesGroup',
            params: [
                { name: 'page', title: '页码', type: 'page', value: '1' },
                {
                    name: 'category',
                    title: '分类',
                    type: 'enumeration',
                    value: 'tf',
                    enumOptions: [
                        { value: 'mf', title: CATEGORY_MAP.mf.title },
                        { value: 'tf', title: CATEGORY_MAP.tf.title }
                    ]
                }
            ]
        },
        {
            id: '91porn.long',
            title: '长视频',
            description: '10分钟以上 / 20分钟以上',
            cacheDuration: 3600,
            requiresWebView: false,
            functionName: 'loadLongGroup',
            params: [
                { name: 'page', title: '页码', type: 'page', value: '1' },
                {
                    name: 'category',
                    title: '分类',
                    type: 'enumeration',
                    value: 'long',
                    enumOptions: [
                        { value: 'long', title: CATEGORY_MAP.long.title },
                        { value: 'longer', title: CATEGORY_MAP.longer.title }
                    ]
                }
            ]
        },
        {
            id: '91porn.search',
            title: '搜索',
            description: '关键词搜索',
            cacheDuration: 3600,
            requiresWebView: false,
            functionName: 'searchList',
            params: [
                { name: 'keywords', title: '关键词', description: '输入关键词进行搜索', type: 'input', value: '' },
                { name: 'page', title: '页码', type: 'page', value: '1' }
            ]
        }
    ],
    search: {
        title: '全局搜索',
        functionName: 'searchGlobal',
        params: [
            { name: 'keyword', title: '关键词', description: '输入关键词进行全局搜索', type: 'input', value: '' },
            { name: 'page', title: '页码', type: 'page', value: '1' }
        ]
    }
};

function buildCategoryUrl(category, page = 1, extra = '') {
    return `${DEFAULT_BASE_URL}/v.php?category=${category}&viewtype=basic${extra}${page > 1 ? `&page=${page}` : ''}`;
}

function buildSearchUrl(keyword, page = 1) {
    return `${DEFAULT_BASE_URL}/v.php?viewtype=basic&keywords=${encodeURIComponent(keyword)}${page > 1 ? `&page=${page}` : ''}`;
}

function parseVideoCards($, options = {}) {
    return Array.from($('.videos-text-align'))
        .map((el) => parseVideoCard($(el), options))
        .filter(Boolean);
}

function parseVideoCard($el, options = {}) {
    if ($el.closest('.col-lg-8').length > 0) return null;
    const link = $el.find('a').attr('href');
    if (!link) return null;
    const backdropPath = $el.find('.img-responsive').attr('src');
    const item = {
        id: link,
        type: 'url',
        mediaType: 'movie',
        link,
        title: $el.find('.video-title').text().trim(),
        backdropPath
    };
    if (options.includeImageFields) {
        item.posterPath = backdropPath || '';
        item.image = backdropPath || '';
        item.coverUrl = backdropPath || '';
    }
    setCardDuration(item, $el);
    setCardPreview(item, backdropPath);
    setCardReleaseDate(item, $el);
    return item;
}

function setCardDuration(item, $el) {
    try {
        item.durationText = $el.find('.duration').text().trim();
    } catch (error) {}
}

function setCardPreview(item, backdropPath) {
    try {
        var _backdropPath_split_pop;
        const videoID = null == backdropPath ? void 0 : null == (_backdropPath_split_pop = backdropPath.split('/').pop()) ? void 0 : _backdropPath_split_pop.split('.').shift();
        if (videoID) item.previewUrl = `https://vthumb.killcovid2021.com/thumb/${videoID}.mp4`;
    } catch (error) {}
}

function setCardReleaseDate(item, $el) {
    try {
        const addTimeEl = $el.find('.info').filter((_, el)=>$(el).text().includes('添加时间'));
        const nextSibling = addTimeEl[0]?.nextSibling;
        const addTime = nextSibling && 'textContent' in nextSibling ? nextSibling.textContent : void 0;
        if (addTime && typeof addTime === 'string') item.releaseDate = addTime.trim();
    } catch (error) {}
}

async function getList(params = {}) {
    const page = params.page || 1;
    const keywords = (params.keywords || '').trim();
    const sortBy = params.sort_by || 'hot';
    const baseUrl = params.base_url || DEFAULT_BASE_URL;

    try {
        const url = keywords ? `${baseUrl}/v.php?viewtype=basic&page=${page}&keywords=${encodeURIComponent(keywords)}` : `${baseUrl}/v.php?category=${sortBy}&viewtype=basic&page=${page}`;
        const $ = await widgetAPI.getHtml(url);
        return parseVideoCards($);
    } catch (error) {
        console.error('视频列表加载失败', error);
        return [];
    }
}

async function loadCategory(params, categoryKey) {
    const cfg = CATEGORY_MAP[categoryKey];
    if (!cfg) return [];
    const page = params?.page || 1;
    try {
        const url = buildCategoryUrl(cfg.category, page, cfg.extra || '');
        const $ = await widgetAPI.getHtml(url);
        return parseVideoCards($);
    } catch (error) {
        console.error('视频列表加载失败', error);
        return [];
    }
}

function resolveCategoryKey(params, fallback) {
    return CATEGORY_MAP[params.category] ? params.category : fallback;
}

async function loadHotGroup(params = {}) {
    return loadCategory(params, resolveCategoryKey(params, 'hot'));
}

async function loadFavoritesGroup(params = {}) {
    return loadCategory(params, resolveCategoryKey(params, 'tf'));
}

async function loadLongGroup(params = {}) {
    return loadCategory(params, resolveCategoryKey(params, 'long'));
}

async function loadOri(params) { return loadCategory(params, 'ori'); }
async function loadHd(params) { return loadCategory(params, 'hd'); }

async function searchList(params = {}) {
    const keyword = (params.keywords || '').trim();
    if (!keyword) return [{ id: 'tip', type: 'text', title: '请输入关键词开始搜索' }];
    return getSearchResults(keyword, params.page || 1);
}

async function searchGlobal(params = {}) {
    const keyword = (params.keyword || '').trim();
    if (!keyword) return [{ id: 'tip', type: 'text', title: '请输入关键词开始全局搜索' }];
    return getSearchResults(keyword, params.page || 1);
}

async function getSearchResults(keyword, page = 1) {
    try {
        const url = buildSearchUrl(keyword, page);
        const $ = await widgetAPI.getHtml(url);
        return parseVideoCards($, { includeImageFields: true });
    } catch (error) {
        console.error('搜索失败', error);
        return [{ id: 'err', type: 'text', title: '搜索失败', subTitle: error.message }];
    }
}

function getDetailTitle($) {
    return $('#videodetails h4').first().text().trim();
}

function getVideoUrlAndPlayer($) {
    const player = $('#player_one');
    const script = player.find('script').text();
    const match = script.match(/strencode2\("(.*?)"\)/);
    const encoded = (match && match[1]) || '';
    const sourceHtml = decodeURIComponent(encoded);
    const $source = Widget.html.load(sourceHtml);
    return { player, videoUrl: $source('source').attr('src') || '' };
}

function applyDetailMeta($, detail) {
    try {
        const duration = $('#useraction').find('.info').filter((_, el)=>$(el).text().includes('时长')).find('.video-info-span').text().trim();
        if (duration) detail.durationText = duration;
    } catch (error) {}

    try {
        const releaseDate = $('.title-yakov').eq(0).text().trim();
        if (releaseDate) detail.releaseDate = releaseDate;
    } catch (error) {}

    try {
        const descHtml = $('#v_desc').html();
        if (descHtml) {
            detail.description = Widget.html.load(descHtml.replace(/<br\s*\/?>(?:)/g, '\n')).text();
        }
    } catch (error) {}
}

function parseRelatedItem($el) {
    const link = $el.find('a').attr('href');
    if (!link) return null;
    return {
        id: link,
        type: 'url',
        mediaType: 'movie',
        link,
        title: $el.find('.video-title').text().trim(),
        durationText: $el.find('.duration').text().trim(),
        backdropPath: $el.find('.img-responsive').attr('src')
    };
}

function parseRelatedItems($) {
    return Array.from($('.well')).map((el)=>parseRelatedItem($(el))).filter(Boolean);
}

async function loadDetail(url) {
    try {
        const $ = await widgetAPI.getHtml(url);
        const { player, videoUrl } = getVideoUrlAndPlayer($);
        if (!videoUrl) throw new Error('未找到视频资源');

        const detail = {
            id: url,
            type: 'detail',
            mediaType: 'movie',
            link: url,
            title: getDetailTitle($),
            backdropPath: player.attr('poster') || '',
            videoUrl
        };

        applyDetailMeta($, detail);
        detail.childItems = parseRelatedItems($);
        return detail;
    } catch (error) {
        console.error('视频详情加载失败', error);
        return null;
    }
}
