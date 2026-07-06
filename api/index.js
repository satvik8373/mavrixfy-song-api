import { createRequire } from "node:module";
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// node_modules/node-forge/lib/forge.js
var require_forge = __commonJS((exports, module) => {
  module.exports = {
    options: {
      usePureJavaScript: false
    }
  };
});

// node_modules/node-forge/lib/baseN.js
var require_baseN = __commonJS((exports, module) => {
  var api = {};
  module.exports = api;
  var _reverseAlphabets = {};
  api.encode = function(input2, alphabet, maxline) {
    if (typeof alphabet !== "string") {
      throw new TypeError('"alphabet" must be a string.');
    }
    if (maxline !== undefined && typeof maxline !== "number") {
      throw new TypeError('"maxline" must be a number.');
    }
    var output = "";
    if (!(input2 instanceof Uint8Array)) {
      output = _encodeWithByteBuffer(input2, alphabet);
    } else {
      var i = 0;
      var base = alphabet.length;
      var first = alphabet.charAt(0);
      var digits = [0];
      for (i = 0;i < input2.length; ++i) {
        for (var j = 0, carry = input2[i];j < digits.length; ++j) {
          carry += digits[j] << 8;
          digits[j] = carry % base;
          carry = carry / base | 0;
        }
        while (carry > 0) {
          digits.push(carry % base);
          carry = carry / base | 0;
        }
      }
      for (i = 0;input2[i] === 0 && i < input2.length - 1; ++i) {
        output += first;
      }
      for (i = digits.length - 1;i >= 0; --i) {
        output += alphabet[digits[i]];
      }
    }
    if (maxline) {
      var regex = new RegExp(".{1," + maxline + "}", "g");
      output = output.match(regex).join(`\r
`);
    }
    return output;
  };
  api.decode = function(input2, alphabet) {
    if (typeof input2 !== "string") {
      throw new TypeError('"input" must be a string.');
    }
    if (typeof alphabet !== "string") {
      throw new TypeError('"alphabet" must be a string.');
    }
    var table = _reverseAlphabets[alphabet];
    if (!table) {
      table = _reverseAlphabets[alphabet] = [];
      for (var i = 0;i < alphabet.length; ++i) {
        table[alphabet.charCodeAt(i)] = i;
      }
    }
    input2 = input2.replace(/\s/g, "");
    var base = alphabet.length;
    var first = alphabet.charAt(0);
    var bytes = [0];
    for (var i = 0;i < input2.length; i++) {
      var value = table[input2.charCodeAt(i)];
      if (value === undefined) {
        return;
      }
      for (var j = 0, carry = value;j < bytes.length; ++j) {
        carry += bytes[j] * base;
        bytes[j] = carry & 255;
        carry >>= 8;
      }
      while (carry > 0) {
        bytes.push(carry & 255);
        carry >>= 8;
      }
    }
    for (var k = 0;input2[k] === first && k < input2.length - 1; ++k) {
      bytes.push(0);
    }
    if (typeof Buffer !== "undefined") {
      return Buffer.from(bytes.reverse());
    }
    return new Uint8Array(bytes.reverse());
  };
  function _encodeWithByteBuffer(input2, alphabet) {
    var i = 0;
    var base = alphabet.length;
    var first = alphabet.charAt(0);
    var digits = [0];
    for (i = 0;i < input2.length(); ++i) {
      for (var j = 0, carry = input2.at(i);j < digits.length; ++j) {
        carry += digits[j] << 8;
        digits[j] = carry % base;
        carry = carry / base | 0;
      }
      while (carry > 0) {
        digits.push(carry % base);
        carry = carry / base | 0;
      }
    }
    var output = "";
    for (i = 0;input2.at(i) === 0 && i < input2.length() - 1; ++i) {
      output += first;
    }
    for (i = digits.length - 1;i >= 0; --i) {
      output += alphabet[digits[i]];
    }
    return output;
  }
});

// node_modules/node-forge/lib/util.js
var require_util = __commonJS((exports, module) => {
  var forge = require_forge();
  var baseN = require_baseN();
  var util3 = module.exports = forge.util = forge.util || {};
  (function() {
    if (typeof process !== "undefined" && process.nextTick && true) {
      util3.nextTick = process.nextTick;
      if (typeof setImmediate === "function") {
        util3.setImmediate = setImmediate;
      } else {
        util3.setImmediate = util3.nextTick;
      }
      return;
    }
    if (typeof setImmediate === "function") {
      util3.setImmediate = function() {
        return setImmediate.apply(undefined, arguments);
      };
      util3.nextTick = function(callback) {
        return setImmediate(callback);
      };
      return;
    }
    util3.setImmediate = function(callback) {
      setTimeout(callback, 0);
    };
    if (typeof window !== "undefined" && typeof window.postMessage === "function") {
      let handler2 = function(event) {
        if (event.source === window && event.data === msg) {
          event.stopPropagation();
          var copy = callbacks.slice();
          callbacks.length = 0;
          copy.forEach(function(callback) {
            callback();
          });
        }
      };
      var handler = handler2;
      var msg = "forge.setImmediate";
      var callbacks = [];
      util3.setImmediate = function(callback) {
        callbacks.push(callback);
        if (callbacks.length === 1) {
          window.postMessage(msg, "*");
        }
      };
      window.addEventListener("message", handler2, true);
    }
    if (typeof MutationObserver !== "undefined") {
      var now = Date.now();
      var attr = true;
      var div = document.createElement("div");
      var callbacks = [];
      new MutationObserver(function() {
        var copy = callbacks.slice();
        callbacks.length = 0;
        copy.forEach(function(callback) {
          callback();
        });
      }).observe(div, { attributes: true });
      var oldSetImmediate = util3.setImmediate;
      util3.setImmediate = function(callback) {
        if (Date.now() - now > 15) {
          now = Date.now();
          oldSetImmediate(callback);
        } else {
          callbacks.push(callback);
          if (callbacks.length === 1) {
            div.setAttribute("a", attr = !attr);
          }
        }
      };
    }
    util3.nextTick = util3.setImmediate;
  })();
  util3.isNodejs = typeof process !== "undefined" && process.versions && process.versions.node;
  util3.globalScope = function() {
    if (util3.isNodejs) {
      return global;
    }
    return typeof self === "undefined" ? window : self;
  }();
  util3.isArray = Array.isArray || function(x) {
    return Object.prototype.toString.call(x) === "[object Array]";
  };
  util3.isArrayBuffer = function(x) {
    return typeof ArrayBuffer !== "undefined" && x instanceof ArrayBuffer;
  };
  util3.isArrayBufferView = function(x) {
    return x && util3.isArrayBuffer(x.buffer) && x.byteLength !== undefined;
  };
  function _checkBitsParam(n) {
    if (!(n === 8 || n === 16 || n === 24 || n === 32)) {
      throw new Error("Only 8, 16, 24, or 32 bits supported: " + n);
    }
  }
  util3.ByteBuffer = ByteStringBuffer;
  function ByteStringBuffer(b) {
    this.data = "";
    this.read = 0;
    if (typeof b === "string") {
      this.data = b;
    } else if (util3.isArrayBuffer(b) || util3.isArrayBufferView(b)) {
      if (typeof Buffer !== "undefined" && b instanceof Buffer) {
        this.data = b.toString("binary");
      } else {
        var arr = new Uint8Array(b);
        try {
          this.data = String.fromCharCode.apply(null, arr);
        } catch (e) {
          for (var i = 0;i < arr.length; ++i) {
            this.putByte(arr[i]);
          }
        }
      }
    } else if (b instanceof ByteStringBuffer || typeof b === "object" && typeof b.data === "string" && typeof b.read === "number") {
      this.data = b.data;
      this.read = b.read;
    }
    this._constructedStringLength = 0;
  }
  util3.ByteStringBuffer = ByteStringBuffer;
  var _MAX_CONSTRUCTED_STRING_LENGTH = 4096;
  util3.ByteStringBuffer.prototype._optimizeConstructedString = function(x) {
    this._constructedStringLength += x;
    if (this._constructedStringLength > _MAX_CONSTRUCTED_STRING_LENGTH) {
      this.data.substr(0, 1);
      this._constructedStringLength = 0;
    }
  };
  util3.ByteStringBuffer.prototype.length = function() {
    return this.data.length - this.read;
  };
  util3.ByteStringBuffer.prototype.isEmpty = function() {
    return this.length() <= 0;
  };
  util3.ByteStringBuffer.prototype.putByte = function(b) {
    return this.putBytes(String.fromCharCode(b));
  };
  util3.ByteStringBuffer.prototype.fillWithByte = function(b, n) {
    b = String.fromCharCode(b);
    var d = this.data;
    while (n > 0) {
      if (n & 1) {
        d += b;
      }
      n >>>= 1;
      if (n > 0) {
        b += b;
      }
    }
    this.data = d;
    this._optimizeConstructedString(n);
    return this;
  };
  util3.ByteStringBuffer.prototype.putBytes = function(bytes) {
    this.data += bytes;
    this._optimizeConstructedString(bytes.length);
    return this;
  };
  util3.ByteStringBuffer.prototype.putString = function(str) {
    return this.putBytes(util3.encodeUtf8(str));
  };
  util3.ByteStringBuffer.prototype.putInt16 = function(i) {
    return this.putBytes(String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255));
  };
  util3.ByteStringBuffer.prototype.putInt24 = function(i) {
    return this.putBytes(String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255));
  };
  util3.ByteStringBuffer.prototype.putInt32 = function(i) {
    return this.putBytes(String.fromCharCode(i >> 24 & 255) + String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255));
  };
  util3.ByteStringBuffer.prototype.putInt16Le = function(i) {
    return this.putBytes(String.fromCharCode(i & 255) + String.fromCharCode(i >> 8 & 255));
  };
  util3.ByteStringBuffer.prototype.putInt24Le = function(i) {
    return this.putBytes(String.fromCharCode(i & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i >> 16 & 255));
  };
  util3.ByteStringBuffer.prototype.putInt32Le = function(i) {
    return this.putBytes(String.fromCharCode(i & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 24 & 255));
  };
  util3.ByteStringBuffer.prototype.putInt = function(i, n) {
    _checkBitsParam(n);
    var bytes = "";
    do {
      n -= 8;
      bytes += String.fromCharCode(i >> n & 255);
    } while (n > 0);
    return this.putBytes(bytes);
  };
  util3.ByteStringBuffer.prototype.putSignedInt = function(i, n) {
    if (i < 0) {
      i += 2 << n - 1;
    }
    return this.putInt(i, n);
  };
  util3.ByteStringBuffer.prototype.putBuffer = function(buffer) {
    return this.putBytes(buffer.getBytes());
  };
  util3.ByteStringBuffer.prototype.getByte = function() {
    return this.data.charCodeAt(this.read++);
  };
  util3.ByteStringBuffer.prototype.getInt16 = function() {
    var rval = this.data.charCodeAt(this.read) << 8 ^ this.data.charCodeAt(this.read + 1);
    this.read += 2;
    return rval;
  };
  util3.ByteStringBuffer.prototype.getInt24 = function() {
    var rval = this.data.charCodeAt(this.read) << 16 ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2);
    this.read += 3;
    return rval;
  };
  util3.ByteStringBuffer.prototype.getInt32 = function() {
    var rval = this.data.charCodeAt(this.read) << 24 ^ this.data.charCodeAt(this.read + 1) << 16 ^ this.data.charCodeAt(this.read + 2) << 8 ^ this.data.charCodeAt(this.read + 3);
    this.read += 4;
    return rval;
  };
  util3.ByteStringBuffer.prototype.getInt16Le = function() {
    var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8;
    this.read += 2;
    return rval;
  };
  util3.ByteStringBuffer.prototype.getInt24Le = function() {
    var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16;
    this.read += 3;
    return rval;
  };
  util3.ByteStringBuffer.prototype.getInt32Le = function() {
    var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16 ^ this.data.charCodeAt(this.read + 3) << 24;
    this.read += 4;
    return rval;
  };
  util3.ByteStringBuffer.prototype.getInt = function(n) {
    _checkBitsParam(n);
    var rval = 0;
    do {
      rval = (rval << 8) + this.data.charCodeAt(this.read++);
      n -= 8;
    } while (n > 0);
    return rval;
  };
  util3.ByteStringBuffer.prototype.getSignedInt = function(n) {
    var x = this.getInt(n);
    var max = 2 << n - 2;
    if (x >= max) {
      x -= max << 1;
    }
    return x;
  };
  util3.ByteStringBuffer.prototype.getBytes = function(count) {
    var rval;
    if (count) {
      count = Math.min(this.length(), count);
      rval = this.data.slice(this.read, this.read + count);
      this.read += count;
    } else if (count === 0) {
      rval = "";
    } else {
      rval = this.read === 0 ? this.data : this.data.slice(this.read);
      this.clear();
    }
    return rval;
  };
  util3.ByteStringBuffer.prototype.bytes = function(count) {
    return typeof count === "undefined" ? this.data.slice(this.read) : this.data.slice(this.read, this.read + count);
  };
  util3.ByteStringBuffer.prototype.at = function(i) {
    return this.data.charCodeAt(this.read + i);
  };
  util3.ByteStringBuffer.prototype.setAt = function(i, b) {
    this.data = this.data.substr(0, this.read + i) + String.fromCharCode(b) + this.data.substr(this.read + i + 1);
    return this;
  };
  util3.ByteStringBuffer.prototype.last = function() {
    return this.data.charCodeAt(this.data.length - 1);
  };
  util3.ByteStringBuffer.prototype.copy = function() {
    var c = util3.createBuffer(this.data);
    c.read = this.read;
    return c;
  };
  util3.ByteStringBuffer.prototype.compact = function() {
    if (this.read > 0) {
      this.data = this.data.slice(this.read);
      this.read = 0;
    }
    return this;
  };
  util3.ByteStringBuffer.prototype.clear = function() {
    this.data = "";
    this.read = 0;
    return this;
  };
  util3.ByteStringBuffer.prototype.truncate = function(count) {
    var len = Math.max(0, this.length() - count);
    this.data = this.data.substr(this.read, len);
    this.read = 0;
    return this;
  };
  util3.ByteStringBuffer.prototype.toHex = function() {
    var rval = "";
    for (var i = this.read;i < this.data.length; ++i) {
      var b = this.data.charCodeAt(i);
      if (b < 16) {
        rval += "0";
      }
      rval += b.toString(16);
    }
    return rval;
  };
  util3.ByteStringBuffer.prototype.toString = function() {
    return util3.decodeUtf8(this.bytes());
  };
  function DataBuffer(b, options) {
    options = options || {};
    this.read = options.readOffset || 0;
    this.growSize = options.growSize || 1024;
    var isArrayBuffer = util3.isArrayBuffer(b);
    var isArrayBufferView = util3.isArrayBufferView(b);
    if (isArrayBuffer || isArrayBufferView) {
      if (isArrayBuffer) {
        this.data = new DataView(b);
      } else {
        this.data = new DataView(b.buffer, b.byteOffset, b.byteLength);
      }
      this.write = "writeOffset" in options ? options.writeOffset : this.data.byteLength;
      return;
    }
    this.data = new DataView(new ArrayBuffer(0));
    this.write = 0;
    if (b !== null && b !== undefined) {
      this.putBytes(b);
    }
    if ("writeOffset" in options) {
      this.write = options.writeOffset;
    }
  }
  util3.DataBuffer = DataBuffer;
  util3.DataBuffer.prototype.length = function() {
    return this.write - this.read;
  };
  util3.DataBuffer.prototype.isEmpty = function() {
    return this.length() <= 0;
  };
  util3.DataBuffer.prototype.accommodate = function(amount, growSize) {
    if (this.length() >= amount) {
      return this;
    }
    growSize = Math.max(growSize || this.growSize, amount);
    var src = new Uint8Array(this.data.buffer, this.data.byteOffset, this.data.byteLength);
    var dst = new Uint8Array(this.length() + growSize);
    dst.set(src);
    this.data = new DataView(dst.buffer);
    return this;
  };
  util3.DataBuffer.prototype.putByte = function(b) {
    this.accommodate(1);
    this.data.setUint8(this.write++, b);
    return this;
  };
  util3.DataBuffer.prototype.fillWithByte = function(b, n) {
    this.accommodate(n);
    for (var i = 0;i < n; ++i) {
      this.data.setUint8(b);
    }
    return this;
  };
  util3.DataBuffer.prototype.putBytes = function(bytes, encoding) {
    if (util3.isArrayBufferView(bytes)) {
      var src = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      var len = src.byteLength - src.byteOffset;
      this.accommodate(len);
      var dst = new Uint8Array(this.data.buffer, this.write);
      dst.set(src);
      this.write += len;
      return this;
    }
    if (util3.isArrayBuffer(bytes)) {
      var src = new Uint8Array(bytes);
      this.accommodate(src.byteLength);
      var dst = new Uint8Array(this.data.buffer);
      dst.set(src, this.write);
      this.write += src.byteLength;
      return this;
    }
    if (bytes instanceof util3.DataBuffer || typeof bytes === "object" && typeof bytes.read === "number" && typeof bytes.write === "number" && util3.isArrayBufferView(bytes.data)) {
      var src = new Uint8Array(bytes.data.byteLength, bytes.read, bytes.length());
      this.accommodate(src.byteLength);
      var dst = new Uint8Array(bytes.data.byteLength, this.write);
      dst.set(src);
      this.write += src.byteLength;
      return this;
    }
    if (bytes instanceof util3.ByteStringBuffer) {
      bytes = bytes.data;
      encoding = "binary";
    }
    encoding = encoding || "binary";
    if (typeof bytes === "string") {
      var view;
      if (encoding === "hex") {
        this.accommodate(Math.ceil(bytes.length / 2));
        view = new Uint8Array(this.data.buffer, this.write);
        this.write += util3.binary.hex.decode(bytes, view, this.write);
        return this;
      }
      if (encoding === "base64") {
        this.accommodate(Math.ceil(bytes.length / 4) * 3);
        view = new Uint8Array(this.data.buffer, this.write);
        this.write += util3.binary.base64.decode(bytes, view, this.write);
        return this;
      }
      if (encoding === "utf8") {
        bytes = util3.encodeUtf8(bytes);
        encoding = "binary";
      }
      if (encoding === "binary" || encoding === "raw") {
        this.accommodate(bytes.length);
        view = new Uint8Array(this.data.buffer, this.write);
        this.write += util3.binary.raw.decode(view);
        return this;
      }
      if (encoding === "utf16") {
        this.accommodate(bytes.length * 2);
        view = new Uint16Array(this.data.buffer, this.write);
        this.write += util3.text.utf16.encode(view);
        return this;
      }
      throw new Error("Invalid encoding: " + encoding);
    }
    throw Error("Invalid parameter: " + bytes);
  };
  util3.DataBuffer.prototype.putBuffer = function(buffer) {
    this.putBytes(buffer);
    buffer.clear();
    return this;
  };
  util3.DataBuffer.prototype.putString = function(str) {
    return this.putBytes(str, "utf16");
  };
  util3.DataBuffer.prototype.putInt16 = function(i) {
    this.accommodate(2);
    this.data.setInt16(this.write, i);
    this.write += 2;
    return this;
  };
  util3.DataBuffer.prototype.putInt24 = function(i) {
    this.accommodate(3);
    this.data.setInt16(this.write, i >> 8 & 65535);
    this.data.setInt8(this.write, i >> 16 & 255);
    this.write += 3;
    return this;
  };
  util3.DataBuffer.prototype.putInt32 = function(i) {
    this.accommodate(4);
    this.data.setInt32(this.write, i);
    this.write += 4;
    return this;
  };
  util3.DataBuffer.prototype.putInt16Le = function(i) {
    this.accommodate(2);
    this.data.setInt16(this.write, i, true);
    this.write += 2;
    return this;
  };
  util3.DataBuffer.prototype.putInt24Le = function(i) {
    this.accommodate(3);
    this.data.setInt8(this.write, i >> 16 & 255);
    this.data.setInt16(this.write, i >> 8 & 65535, true);
    this.write += 3;
    return this;
  };
  util3.DataBuffer.prototype.putInt32Le = function(i) {
    this.accommodate(4);
    this.data.setInt32(this.write, i, true);
    this.write += 4;
    return this;
  };
  util3.DataBuffer.prototype.putInt = function(i, n) {
    _checkBitsParam(n);
    this.accommodate(n / 8);
    do {
      n -= 8;
      this.data.setInt8(this.write++, i >> n & 255);
    } while (n > 0);
    return this;
  };
  util3.DataBuffer.prototype.putSignedInt = function(i, n) {
    _checkBitsParam(n);
    this.accommodate(n / 8);
    if (i < 0) {
      i += 2 << n - 1;
    }
    return this.putInt(i, n);
  };
  util3.DataBuffer.prototype.getByte = function() {
    return this.data.getInt8(this.read++);
  };
  util3.DataBuffer.prototype.getInt16 = function() {
    var rval = this.data.getInt16(this.read);
    this.read += 2;
    return rval;
  };
  util3.DataBuffer.prototype.getInt24 = function() {
    var rval = this.data.getInt16(this.read) << 8 ^ this.data.getInt8(this.read + 2);
    this.read += 3;
    return rval;
  };
  util3.DataBuffer.prototype.getInt32 = function() {
    var rval = this.data.getInt32(this.read);
    this.read += 4;
    return rval;
  };
  util3.DataBuffer.prototype.getInt16Le = function() {
    var rval = this.data.getInt16(this.read, true);
    this.read += 2;
    return rval;
  };
  util3.DataBuffer.prototype.getInt24Le = function() {
    var rval = this.data.getInt8(this.read) ^ this.data.getInt16(this.read + 1, true) << 8;
    this.read += 3;
    return rval;
  };
  util3.DataBuffer.prototype.getInt32Le = function() {
    var rval = this.data.getInt32(this.read, true);
    this.read += 4;
    return rval;
  };
  util3.DataBuffer.prototype.getInt = function(n) {
    _checkBitsParam(n);
    var rval = 0;
    do {
      rval = (rval << 8) + this.data.getInt8(this.read++);
      n -= 8;
    } while (n > 0);
    return rval;
  };
  util3.DataBuffer.prototype.getSignedInt = function(n) {
    var x = this.getInt(n);
    var max = 2 << n - 2;
    if (x >= max) {
      x -= max << 1;
    }
    return x;
  };
  util3.DataBuffer.prototype.getBytes = function(count) {
    var rval;
    if (count) {
      count = Math.min(this.length(), count);
      rval = this.data.slice(this.read, this.read + count);
      this.read += count;
    } else if (count === 0) {
      rval = "";
    } else {
      rval = this.read === 0 ? this.data : this.data.slice(this.read);
      this.clear();
    }
    return rval;
  };
  util3.DataBuffer.prototype.bytes = function(count) {
    return typeof count === "undefined" ? this.data.slice(this.read) : this.data.slice(this.read, this.read + count);
  };
  util3.DataBuffer.prototype.at = function(i) {
    return this.data.getUint8(this.read + i);
  };
  util3.DataBuffer.prototype.setAt = function(i, b) {
    this.data.setUint8(i, b);
    return this;
  };
  util3.DataBuffer.prototype.last = function() {
    return this.data.getUint8(this.write - 1);
  };
  util3.DataBuffer.prototype.copy = function() {
    return new util3.DataBuffer(this);
  };
  util3.DataBuffer.prototype.compact = function() {
    if (this.read > 0) {
      var src = new Uint8Array(this.data.buffer, this.read);
      var dst = new Uint8Array(src.byteLength);
      dst.set(src);
      this.data = new DataView(dst);
      this.write -= this.read;
      this.read = 0;
    }
    return this;
  };
  util3.DataBuffer.prototype.clear = function() {
    this.data = new DataView(new ArrayBuffer(0));
    this.read = this.write = 0;
    return this;
  };
  util3.DataBuffer.prototype.truncate = function(count) {
    this.write = Math.max(0, this.length() - count);
    this.read = Math.min(this.read, this.write);
    return this;
  };
  util3.DataBuffer.prototype.toHex = function() {
    var rval = "";
    for (var i = this.read;i < this.data.byteLength; ++i) {
      var b = this.data.getUint8(i);
      if (b < 16) {
        rval += "0";
      }
      rval += b.toString(16);
    }
    return rval;
  };
  util3.DataBuffer.prototype.toString = function(encoding) {
    var view = new Uint8Array(this.data, this.read, this.length());
    encoding = encoding || "utf8";
    if (encoding === "binary" || encoding === "raw") {
      return util3.binary.raw.encode(view);
    }
    if (encoding === "hex") {
      return util3.binary.hex.encode(view);
    }
    if (encoding === "base64") {
      return util3.binary.base64.encode(view);
    }
    if (encoding === "utf8") {
      return util3.text.utf8.decode(view);
    }
    if (encoding === "utf16") {
      return util3.text.utf16.decode(view);
    }
    throw new Error("Invalid encoding: " + encoding);
  };
  util3.createBuffer = function(input2, encoding) {
    encoding = encoding || "raw";
    if (input2 !== undefined && encoding === "utf8") {
      input2 = util3.encodeUtf8(input2);
    }
    return new util3.ByteBuffer(input2);
  };
  util3.fillString = function(c, n) {
    var s = "";
    while (n > 0) {
      if (n & 1) {
        s += c;
      }
      n >>>= 1;
      if (n > 0) {
        c += c;
      }
    }
    return s;
  };
  util3.xorBytes = function(s1, s2, n) {
    var s3 = "";
    var b = "";
    var t = "";
    var i = 0;
    var c = 0;
    for (;n > 0; --n, ++i) {
      b = s1.charCodeAt(i) ^ s2.charCodeAt(i);
      if (c >= 10) {
        s3 += t;
        t = "";
        c = 0;
      }
      t += String.fromCharCode(b);
      ++c;
    }
    s3 += t;
    return s3;
  };
  util3.hexToBytes = function(hex) {
    var rval = "";
    var i = 0;
    if (hex.length & true) {
      i = 1;
      rval += String.fromCharCode(parseInt(hex[0], 16));
    }
    for (;i < hex.length; i += 2) {
      rval += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return rval;
  };
  util3.bytesToHex = function(bytes) {
    return util3.createBuffer(bytes).toHex();
  };
  util3.int32ToBytes = function(i) {
    return String.fromCharCode(i >> 24 & 255) + String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255);
  };
  var _base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var _base64Idx = [
    62,
    -1,
    -1,
    -1,
    63,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    -1,
    -1,
    -1,
    64,
    -1,
    -1,
    -1,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51
  ];
  var _base58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  util3.encode64 = function(input2, maxline) {
    var line = "";
    var output = "";
    var chr1, chr2, chr3;
    var i = 0;
    while (i < input2.length) {
      chr1 = input2.charCodeAt(i++);
      chr2 = input2.charCodeAt(i++);
      chr3 = input2.charCodeAt(i++);
      line += _base64.charAt(chr1 >> 2);
      line += _base64.charAt((chr1 & 3) << 4 | chr2 >> 4);
      if (isNaN(chr2)) {
        line += "==";
      } else {
        line += _base64.charAt((chr2 & 15) << 2 | chr3 >> 6);
        line += isNaN(chr3) ? "=" : _base64.charAt(chr3 & 63);
      }
      if (maxline && line.length > maxline) {
        output += line.substr(0, maxline) + `\r
`;
        line = line.substr(maxline);
      }
    }
    output += line;
    return output;
  };
  util3.decode64 = function(input2) {
    input2 = input2.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    var output = "";
    var enc1, enc2, enc3, enc4;
    var i = 0;
    while (i < input2.length) {
      enc1 = _base64Idx[input2.charCodeAt(i++) - 43];
      enc2 = _base64Idx[input2.charCodeAt(i++) - 43];
      enc3 = _base64Idx[input2.charCodeAt(i++) - 43];
      enc4 = _base64Idx[input2.charCodeAt(i++) - 43];
      output += String.fromCharCode(enc1 << 2 | enc2 >> 4);
      if (enc3 !== 64) {
        output += String.fromCharCode((enc2 & 15) << 4 | enc3 >> 2);
        if (enc4 !== 64) {
          output += String.fromCharCode((enc3 & 3) << 6 | enc4);
        }
      }
    }
    return output;
  };
  util3.encodeUtf8 = function(str) {
    return unescape(encodeURIComponent(str));
  };
  util3.decodeUtf8 = function(str) {
    return decodeURIComponent(escape(str));
  };
  util3.binary = {
    raw: {},
    hex: {},
    base64: {},
    base58: {},
    baseN: {
      encode: baseN.encode,
      decode: baseN.decode
    }
  };
  util3.binary.raw.encode = function(bytes) {
    return String.fromCharCode.apply(null, bytes);
  };
  util3.binary.raw.decode = function(str, output, offset) {
    var out = output;
    if (!out) {
      out = new Uint8Array(str.length);
    }
    offset = offset || 0;
    var j = offset;
    for (var i = 0;i < str.length; ++i) {
      out[j++] = str.charCodeAt(i);
    }
    return output ? j - offset : out;
  };
  util3.binary.hex.encode = util3.bytesToHex;
  util3.binary.hex.decode = function(hex, output, offset) {
    var out = output;
    if (!out) {
      out = new Uint8Array(Math.ceil(hex.length / 2));
    }
    offset = offset || 0;
    var i = 0, j = offset;
    if (hex.length & 1) {
      i = 1;
      out[j++] = parseInt(hex[0], 16);
    }
    for (;i < hex.length; i += 2) {
      out[j++] = parseInt(hex.substr(i, 2), 16);
    }
    return output ? j - offset : out;
  };
  util3.binary.base64.encode = function(input2, maxline) {
    var line = "";
    var output = "";
    var chr1, chr2, chr3;
    var i = 0;
    while (i < input2.byteLength) {
      chr1 = input2[i++];
      chr2 = input2[i++];
      chr3 = input2[i++];
      line += _base64.charAt(chr1 >> 2);
      line += _base64.charAt((chr1 & 3) << 4 | chr2 >> 4);
      if (isNaN(chr2)) {
        line += "==";
      } else {
        line += _base64.charAt((chr2 & 15) << 2 | chr3 >> 6);
        line += isNaN(chr3) ? "=" : _base64.charAt(chr3 & 63);
      }
      if (maxline && line.length > maxline) {
        output += line.substr(0, maxline) + `\r
`;
        line = line.substr(maxline);
      }
    }
    output += line;
    return output;
  };
  util3.binary.base64.decode = function(input2, output, offset) {
    var out = output;
    if (!out) {
      out = new Uint8Array(Math.ceil(input2.length / 4) * 3);
    }
    input2 = input2.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    offset = offset || 0;
    var enc1, enc2, enc3, enc4;
    var i = 0, j = offset;
    while (i < input2.length) {
      enc1 = _base64Idx[input2.charCodeAt(i++) - 43];
      enc2 = _base64Idx[input2.charCodeAt(i++) - 43];
      enc3 = _base64Idx[input2.charCodeAt(i++) - 43];
      enc4 = _base64Idx[input2.charCodeAt(i++) - 43];
      out[j++] = enc1 << 2 | enc2 >> 4;
      if (enc3 !== 64) {
        out[j++] = (enc2 & 15) << 4 | enc3 >> 2;
        if (enc4 !== 64) {
          out[j++] = (enc3 & 3) << 6 | enc4;
        }
      }
    }
    return output ? j - offset : out.subarray(0, j);
  };
  util3.binary.base58.encode = function(input2, maxline) {
    return util3.binary.baseN.encode(input2, _base58, maxline);
  };
  util3.binary.base58.decode = function(input2, maxline) {
    return util3.binary.baseN.decode(input2, _base58, maxline);
  };
  util3.text = {
    utf8: {},
    utf16: {}
  };
  util3.text.utf8.encode = function(str, output, offset) {
    str = util3.encodeUtf8(str);
    var out = output;
    if (!out) {
      out = new Uint8Array(str.length);
    }
    offset = offset || 0;
    var j = offset;
    for (var i = 0;i < str.length; ++i) {
      out[j++] = str.charCodeAt(i);
    }
    return output ? j - offset : out;
  };
  util3.text.utf8.decode = function(bytes) {
    return util3.decodeUtf8(String.fromCharCode.apply(null, bytes));
  };
  util3.text.utf16.encode = function(str, output, offset) {
    var out = output;
    if (!out) {
      out = new Uint8Array(str.length * 2);
    }
    var view = new Uint16Array(out.buffer);
    offset = offset || 0;
    var j = offset;
    var k = offset;
    for (var i = 0;i < str.length; ++i) {
      view[k++] = str.charCodeAt(i);
      j += 2;
    }
    return output ? j - offset : out;
  };
  util3.text.utf16.decode = function(bytes) {
    return String.fromCharCode.apply(null, new Uint16Array(bytes.buffer));
  };
  util3.deflate = function(api, bytes, raw2) {
    bytes = util3.decode64(api.deflate(util3.encode64(bytes)).rval);
    if (raw2) {
      var start = 2;
      var flg = bytes.charCodeAt(1);
      if (flg & 32) {
        start = 6;
      }
      bytes = bytes.substring(start, bytes.length - 4);
    }
    return bytes;
  };
  util3.inflate = function(api, bytes, raw2) {
    var rval = api.inflate(util3.encode64(bytes)).rval;
    return rval === null ? null : util3.decode64(rval);
  };
  var _setStorageObject = function(api, id, obj) {
    if (!api) {
      throw new Error("WebStorage not available.");
    }
    var rval;
    if (obj === null) {
      rval = api.removeItem(id);
    } else {
      obj = util3.encode64(JSON.stringify(obj));
      rval = api.setItem(id, obj);
    }
    if (typeof rval !== "undefined" && rval.rval !== true) {
      var error = new Error(rval.error.message);
      error.id = rval.error.id;
      error.name = rval.error.name;
      throw error;
    }
  };
  var _getStorageObject = function(api, id) {
    if (!api) {
      throw new Error("WebStorage not available.");
    }
    var rval = api.getItem(id);
    if (api.init) {
      if (rval.rval === null) {
        if (rval.error) {
          var error = new Error(rval.error.message);
          error.id = rval.error.id;
          error.name = rval.error.name;
          throw error;
        }
        rval = null;
      } else {
        rval = rval.rval;
      }
    }
    if (rval !== null) {
      rval = JSON.parse(util3.decode64(rval));
    }
    return rval;
  };
  var _setItem = function(api, id, key, data) {
    var obj = _getStorageObject(api, id);
    if (obj === null) {
      obj = {};
    }
    obj[key] = data;
    _setStorageObject(api, id, obj);
  };
  var _getItem = function(api, id, key) {
    var rval = _getStorageObject(api, id);
    if (rval !== null) {
      rval = key in rval ? rval[key] : null;
    }
    return rval;
  };
  var _removeItem = function(api, id, key) {
    var obj = _getStorageObject(api, id);
    if (obj !== null && key in obj) {
      delete obj[key];
      var empty = true;
      for (var prop in obj) {
        empty = false;
        break;
      }
      if (empty) {
        obj = null;
      }
      _setStorageObject(api, id, obj);
    }
  };
  var _clearItems = function(api, id) {
    _setStorageObject(api, id, null);
  };
  var _callStorageFunction = function(func, args, location) {
    var rval = null;
    if (typeof location === "undefined") {
      location = ["web", "flash"];
    }
    var type;
    var done = false;
    var exception = null;
    for (var idx in location) {
      type = location[idx];
      try {
        if (type === "flash" || type === "both") {
          if (args[0] === null) {
            throw new Error("Flash local storage not available.");
          }
          rval = func.apply(this, args);
          done = type === "flash";
        }
        if (type === "web" || type === "both") {
          args[0] = localStorage;
          rval = func.apply(this, args);
          done = true;
        }
      } catch (ex) {
        exception = ex;
      }
      if (done) {
        break;
      }
    }
    if (!done) {
      throw exception;
    }
    return rval;
  };
  util3.setItem = function(api, id, key, data, location) {
    _callStorageFunction(_setItem, arguments, location);
  };
  util3.getItem = function(api, id, key, location) {
    return _callStorageFunction(_getItem, arguments, location);
  };
  util3.removeItem = function(api, id, key, location) {
    _callStorageFunction(_removeItem, arguments, location);
  };
  util3.clearItems = function(api, id, location) {
    _callStorageFunction(_clearItems, arguments, location);
  };
  util3.isEmpty = function(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  };
  util3.format = function(format) {
    var re = /%./g;
    var match2;
    var part;
    var argi = 0;
    var parts = [];
    var last = 0;
    while (match2 = re.exec(format)) {
      part = format.substring(last, re.lastIndex - 2);
      if (part.length > 0) {
        parts.push(part);
      }
      last = re.lastIndex;
      var code = match2[0][1];
      switch (code) {
        case "s":
        case "o":
          if (argi < arguments.length) {
            parts.push(arguments[argi++ + 1]);
          } else {
            parts.push("<?>");
          }
          break;
        case "%":
          parts.push("%");
          break;
        default:
          parts.push("<%" + code + "?>");
      }
    }
    parts.push(format.substring(last));
    return parts.join("");
  };
  util3.formatNumber = function(number, decimals, dec_point, thousands_sep) {
    var n = number, c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
    var d = dec_point === undefined ? "," : dec_point;
    var t = thousands_sep === undefined ? "." : thousands_sep, s = n < 0 ? "-" : "";
    var i = parseInt(n = Math.abs(+n || 0).toFixed(c), 10) + "";
    var j = i.length > 3 ? i.length % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  };
  util3.formatSize = function(size) {
    if (size >= 1073741824) {
      size = util3.formatNumber(size / 1073741824, 2, ".", "") + " GiB";
    } else if (size >= 1048576) {
      size = util3.formatNumber(size / 1048576, 2, ".", "") + " MiB";
    } else if (size >= 1024) {
      size = util3.formatNumber(size / 1024, 0) + " KiB";
    } else {
      size = util3.formatNumber(size, 0) + " bytes";
    }
    return size;
  };
  util3.bytesFromIP = function(ip) {
    if (ip.indexOf(".") !== -1) {
      return util3.bytesFromIPv4(ip);
    }
    if (ip.indexOf(":") !== -1) {
      return util3.bytesFromIPv6(ip);
    }
    return null;
  };
  util3.bytesFromIPv4 = function(ip) {
    ip = ip.split(".");
    if (ip.length !== 4) {
      return null;
    }
    var b = util3.createBuffer();
    for (var i = 0;i < ip.length; ++i) {
      var num = parseInt(ip[i], 10);
      if (isNaN(num)) {
        return null;
      }
      b.putByte(num);
    }
    return b.getBytes();
  };
  util3.bytesFromIPv6 = function(ip) {
    var blanks = 0;
    ip = ip.split(":").filter(function(e) {
      if (e.length === 0)
        ++blanks;
      return true;
    });
    var zeros = (8 - ip.length + blanks) * 2;
    var b = util3.createBuffer();
    for (var i = 0;i < 8; ++i) {
      if (!ip[i] || ip[i].length === 0) {
        b.fillWithByte(0, zeros);
        zeros = 0;
        continue;
      }
      var bytes = util3.hexToBytes(ip[i]);
      if (bytes.length < 2) {
        b.putByte(0);
      }
      b.putBytes(bytes);
    }
    return b.getBytes();
  };
  util3.bytesToIP = function(bytes) {
    if (bytes.length === 4) {
      return util3.bytesToIPv4(bytes);
    }
    if (bytes.length === 16) {
      return util3.bytesToIPv6(bytes);
    }
    return null;
  };
  util3.bytesToIPv4 = function(bytes) {
    if (bytes.length !== 4) {
      return null;
    }
    var ip = [];
    for (var i = 0;i < bytes.length; ++i) {
      ip.push(bytes.charCodeAt(i));
    }
    return ip.join(".");
  };
  util3.bytesToIPv6 = function(bytes) {
    if (bytes.length !== 16) {
      return null;
    }
    var ip = [];
    var zeroGroups = [];
    var zeroMaxGroup = 0;
    for (var i = 0;i < bytes.length; i += 2) {
      var hex = util3.bytesToHex(bytes[i] + bytes[i + 1]);
      while (hex[0] === "0" && hex !== "0") {
        hex = hex.substr(1);
      }
      if (hex === "0") {
        var last = zeroGroups[zeroGroups.length - 1];
        var idx = ip.length;
        if (!last || idx !== last.end + 1) {
          zeroGroups.push({ start: idx, end: idx });
        } else {
          last.end = idx;
          if (last.end - last.start > zeroGroups[zeroMaxGroup].end - zeroGroups[zeroMaxGroup].start) {
            zeroMaxGroup = zeroGroups.length - 1;
          }
        }
      }
      ip.push(hex);
    }
    if (zeroGroups.length > 0) {
      var group = zeroGroups[zeroMaxGroup];
      if (group.end - group.start > 0) {
        ip.splice(group.start, group.end - group.start + 1, "");
        if (group.start === 0) {
          ip.unshift("");
        }
        if (group.end === 7) {
          ip.push("");
        }
      }
    }
    return ip.join(":");
  };
  util3.estimateCores = function(options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    options = options || {};
    if ("cores" in util3 && !options.update) {
      return callback(null, util3.cores);
    }
    if (typeof navigator !== "undefined" && "hardwareConcurrency" in navigator && navigator.hardwareConcurrency > 0) {
      util3.cores = navigator.hardwareConcurrency;
      return callback(null, util3.cores);
    }
    if (typeof Worker === "undefined") {
      util3.cores = 1;
      return callback(null, util3.cores);
    }
    if (typeof Blob === "undefined") {
      util3.cores = 2;
      return callback(null, util3.cores);
    }
    var blobUrl = URL.createObjectURL(new Blob([
      "(",
      function() {
        self.addEventListener("message", function(e) {
          var st = Date.now();
          var et = st + 4;
          while (Date.now() < et)
            ;
          self.postMessage({ st, et });
        });
      }.toString(),
      ")()"
    ], { type: "application/javascript" }));
    sample([], 5, 16);
    function sample(max, samples, numWorkers) {
      if (samples === 0) {
        var avg = Math.floor(max.reduce(function(avg2, x) {
          return avg2 + x;
        }, 0) / max.length);
        util3.cores = Math.max(1, avg);
        URL.revokeObjectURL(blobUrl);
        return callback(null, util3.cores);
      }
      map(numWorkers, function(err, results) {
        max.push(reduce(numWorkers, results));
        sample(max, samples - 1, numWorkers);
      });
    }
    function map(numWorkers, callback2) {
      var workers = [];
      var results = [];
      for (var i = 0;i < numWorkers; ++i) {
        var worker = new Worker(blobUrl);
        worker.addEventListener("message", function(e) {
          results.push(e.data);
          if (results.length === numWorkers) {
            for (var i2 = 0;i2 < numWorkers; ++i2) {
              workers[i2].terminate();
            }
            callback2(null, results);
          }
        });
        workers.push(worker);
      }
      for (var i = 0;i < numWorkers; ++i) {
        workers[i].postMessage(i);
      }
    }
    function reduce(numWorkers, results) {
      var overlaps = [];
      for (var n = 0;n < numWorkers; ++n) {
        var r1 = results[n];
        var overlap = overlaps[n] = [];
        for (var i = 0;i < numWorkers; ++i) {
          if (n === i) {
            continue;
          }
          var r2 = results[i];
          if (r1.st > r2.st && r1.st < r2.et || r2.st > r1.st && r2.st < r1.et) {
            overlap.push(i);
          }
        }
      }
      return overlaps.reduce(function(max, overlap2) {
        return Math.max(max, overlap2.length);
      }, 0);
    }
  };
});

// node_modules/node-forge/lib/cipher.js
var require_cipher = __commonJS((exports, module) => {
  var forge = require_forge();
  require_util();
  module.exports = forge.cipher = forge.cipher || {};
  forge.cipher.algorithms = forge.cipher.algorithms || {};
  forge.cipher.createCipher = function(algorithm, key) {
    var api = algorithm;
    if (typeof api === "string") {
      api = forge.cipher.getAlgorithm(api);
      if (api) {
        api = api();
      }
    }
    if (!api) {
      throw new Error("Unsupported algorithm: " + algorithm);
    }
    return new forge.cipher.BlockCipher({
      algorithm: api,
      key,
      decrypt: false
    });
  };
  forge.cipher.createDecipher = function(algorithm, key) {
    var api = algorithm;
    if (typeof api === "string") {
      api = forge.cipher.getAlgorithm(api);
      if (api) {
        api = api();
      }
    }
    if (!api) {
      throw new Error("Unsupported algorithm: " + algorithm);
    }
    return new forge.cipher.BlockCipher({
      algorithm: api,
      key,
      decrypt: true
    });
  };
  forge.cipher.registerAlgorithm = function(name, algorithm) {
    name = name.toUpperCase();
    forge.cipher.algorithms[name] = algorithm;
  };
  forge.cipher.getAlgorithm = function(name) {
    name = name.toUpperCase();
    if (name in forge.cipher.algorithms) {
      return forge.cipher.algorithms[name];
    }
    return null;
  };
  var BlockCipher = forge.cipher.BlockCipher = function(options) {
    this.algorithm = options.algorithm;
    this.mode = this.algorithm.mode;
    this.blockSize = this.mode.blockSize;
    this._finish = false;
    this._input = null;
    this.output = null;
    this._op = options.decrypt ? this.mode.decrypt : this.mode.encrypt;
    this._decrypt = options.decrypt;
    this.algorithm.initialize(options);
  };
  BlockCipher.prototype.start = function(options) {
    options = options || {};
    var opts = {};
    for (var key in options) {
      opts[key] = options[key];
    }
    opts.decrypt = this._decrypt;
    this._finish = false;
    this._input = forge.util.createBuffer();
    this.output = options.output || forge.util.createBuffer();
    this.mode.start(opts);
  };
  BlockCipher.prototype.update = function(input2) {
    if (input2) {
      this._input.putBuffer(input2);
    }
    while (!this._op.call(this.mode, this._input, this.output, this._finish) && !this._finish) {}
    this._input.compact();
  };
  BlockCipher.prototype.finish = function(pad) {
    if (pad && (this.mode.name === "ECB" || this.mode.name === "CBC")) {
      this.mode.pad = function(input2) {
        return pad(this.blockSize, input2, false);
      };
      this.mode.unpad = function(output) {
        return pad(this.blockSize, output, true);
      };
    }
    var options = {};
    options.decrypt = this._decrypt;
    options.overflow = this._input.length() % this.blockSize;
    if (!this._decrypt && this.mode.pad) {
      if (!this.mode.pad(this._input, options)) {
        return false;
      }
    }
    this._finish = true;
    this.update();
    if (this._decrypt && this.mode.unpad) {
      if (!this.mode.unpad(this.output, options)) {
        return false;
      }
    }
    if (this.mode.afterFinish) {
      if (!this.mode.afterFinish(this.output, options)) {
        return false;
      }
    }
    return true;
  };
});

// node_modules/node-forge/lib/cipherModes.js
var require_cipherModes = __commonJS((exports, module) => {
  var forge = require_forge();
  require_util();
  forge.cipher = forge.cipher || {};
  var modes = module.exports = forge.cipher.modes = forge.cipher.modes || {};
  modes.ecb = function(options) {
    options = options || {};
    this.name = "ECB";
    this.cipher = options.cipher;
    this.blockSize = options.blockSize || 16;
    this._ints = this.blockSize / 4;
    this._inBlock = new Array(this._ints);
    this._outBlock = new Array(this._ints);
  };
  modes.ecb.prototype.start = function(options) {};
  modes.ecb.prototype.encrypt = function(input2, output, finish) {
    if (input2.length() < this.blockSize && !(finish && input2.length() > 0)) {
      return true;
    }
    for (var i = 0;i < this._ints; ++i) {
      this._inBlock[i] = input2.getInt32();
    }
    this.cipher.encrypt(this._inBlock, this._outBlock);
    for (var i = 0;i < this._ints; ++i) {
      output.putInt32(this._outBlock[i]);
    }
  };
  modes.ecb.prototype.decrypt = function(input2, output, finish) {
    if (input2.length() < this.blockSize && !(finish && input2.length() > 0)) {
      return true;
    }
    for (var i = 0;i < this._ints; ++i) {
      this._inBlock[i] = input2.getInt32();
    }
    this.cipher.decrypt(this._inBlock, this._outBlock);
    for (var i = 0;i < this._ints; ++i) {
      output.putInt32(this._outBlock[i]);
    }
  };
  modes.ecb.prototype.pad = function(input2, options) {
    var padding = input2.length() === this.blockSize ? this.blockSize : this.blockSize - input2.length();
    input2.fillWithByte(padding, padding);
    return true;
  };
  modes.ecb.prototype.unpad = function(output, options) {
    if (options.overflow > 0) {
      return false;
    }
    var len = output.length();
    var count = output.at(len - 1);
    if (count > this.blockSize << 2) {
      return false;
    }
    output.truncate(count);
    return true;
  };
  modes.cbc = function(options) {
    options = options || {};
    this.name = "CBC";
    this.cipher = options.cipher;
    this.blockSize = options.blockSize || 16;
    this._ints = this.blockSize / 4;
    this._inBlock = new Array(this._ints);
    this._outBlock = new Array(this._ints);
  };
  modes.cbc.prototype.start = function(options) {
    if (options.iv === null) {
      if (!this._prev) {
        throw new Error("Invalid IV parameter.");
      }
      this._iv = this._prev.slice(0);
    } else if (!("iv" in options)) {
      throw new Error("Invalid IV parameter.");
    } else {
      this._iv = transformIV(options.iv, this.blockSize);
      this._prev = this._iv.slice(0);
    }
  };
  modes.cbc.prototype.encrypt = function(input2, output, finish) {
    if (input2.length() < this.blockSize && !(finish && input2.length() > 0)) {
      return true;
    }
    for (var i = 0;i < this._ints; ++i) {
      this._inBlock[i] = this._prev[i] ^ input2.getInt32();
    }
    this.cipher.encrypt(this._inBlock, this._outBlock);
    for (var i = 0;i < this._ints; ++i) {
      output.putInt32(this._outBlock[i]);
    }
    this._prev = this._outBlock;
  };
  modes.cbc.prototype.decrypt = function(input2, output, finish) {
    if (input2.length() < this.blockSize && !(finish && input2.length() > 0)) {
      return true;
    }
    for (var i = 0;i < this._ints; ++i) {
      this._inBlock[i] = input2.getInt32();
    }
    this.cipher.decrypt(this._inBlock, this._outBlock);
    for (var i = 0;i < this._ints; ++i) {
      output.putInt32(this._prev[i] ^ this._outBlock[i]);
    }
    this._prev = this._inBlock.slice(0);
  };
  modes.cbc.prototype.pad = function(input2, options) {
    var padding = input2.length() === this.blockSize ? this.blockSize : this.blockSize - input2.length();
    input2.fillWithByte(padding, padding);
    return true;
  };
  modes.cbc.prototype.unpad = function(output, options) {
    if (options.overflow > 0) {
      return false;
    }
    var len = output.length();
    var count = output.at(len - 1);
    if (count > this.blockSize << 2) {
      return false;
    }
    output.truncate(count);
    return true;
  };
  modes.cfb = function(options) {
    options = options || {};
    this.name = "CFB";
    this.cipher = options.cipher;
    this.blockSize = options.blockSize || 16;
    this._ints = this.blockSize / 4;
    this._inBlock = null;
    this._outBlock = new Array(this._ints);
    this._partialBlock = new Array(this._ints);
    this._partialOutput = forge.util.createBuffer();
    this._partialBytes = 0;
  };
  modes.cfb.prototype.start = function(options) {
    if (!("iv" in options)) {
      throw new Error("Invalid IV parameter.");
    }
    this._iv = transformIV(options.iv, this.blockSize);
    this._inBlock = this._iv.slice(0);
    this._partialBytes = 0;
  };
  modes.cfb.prototype.encrypt = function(input2, output, finish) {
    var inputLength = input2.length();
    if (inputLength === 0) {
      return true;
    }
    this.cipher.encrypt(this._inBlock, this._outBlock);
    if (this._partialBytes === 0 && inputLength >= this.blockSize) {
      for (var i = 0;i < this._ints; ++i) {
        this._inBlock[i] = input2.getInt32() ^ this._outBlock[i];
        output.putInt32(this._inBlock[i]);
      }
      return;
    }
    var partialBytes = (this.blockSize - inputLength) % this.blockSize;
    if (partialBytes > 0) {
      partialBytes = this.blockSize - partialBytes;
    }
    this._partialOutput.clear();
    for (var i = 0;i < this._ints; ++i) {
      this._partialBlock[i] = input2.getInt32() ^ this._outBlock[i];
      this._partialOutput.putInt32(this._partialBlock[i]);
    }
    if (partialBytes > 0) {
      input2.read -= this.blockSize;
    } else {
      for (var i = 0;i < this._ints; ++i) {
        this._inBlock[i] = this._partialBlock[i];
      }
    }
    if (this._partialBytes > 0) {
      this._partialOutput.getBytes(this._partialBytes);
    }
    if (partialBytes > 0 && !finish) {
      output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
      this._partialBytes = partialBytes;
      return true;
    }
    output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
    this._partialBytes = 0;
  };
  modes.cfb.prototype.decrypt = function(input2, output, finish) {
    var inputLength = input2.length();
    if (inputLength === 0) {
      return true;
    }
    this.cipher.encrypt(this._inBlock, this._outBlock);
    if (this._partialBytes === 0 && inputLength >= this.blockSize) {
      for (var i = 0;i < this._ints; ++i) {
        this._inBlock[i] = input2.getInt32();
        output.putInt32(this._inBlock[i] ^ this._outBlock[i]);
      }
      return;
    }
    var partialBytes = (this.blockSize - inputLength) % this.blockSize;
    if (partialBytes > 0) {
      partialBytes = this.blockSize - partialBytes;
    }
    this._partialOutput.clear();
    for (var i = 0;i < this._ints; ++i) {
      this._partialBlock[i] = input2.getInt32();
      this._partialOutput.putInt32(this._partialBlock[i] ^ this._outBlock[i]);
    }
    if (partialBytes > 0) {
      input2.read -= this.blockSize;
    } else {
      for (var i = 0;i < this._ints; ++i) {
        this._inBlock[i] = this._partialBlock[i];
      }
    }
    if (this._partialBytes > 0) {
      this._partialOutput.getBytes(this._partialBytes);
    }
    if (partialBytes > 0 && !finish) {
      output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
      this._partialBytes = partialBytes;
      return true;
    }
    output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
    this._partialBytes = 0;
  };
  modes.ofb = function(options) {
    options = options || {};
    this.name = "OFB";
    this.cipher = options.cipher;
    this.blockSize = options.blockSize || 16;
    this._ints = this.blockSize / 4;
    this._inBlock = null;
    this._outBlock = new Array(this._ints);
    this._partialOutput = forge.util.createBuffer();
    this._partialBytes = 0;
  };
  modes.ofb.prototype.start = function(options) {
    if (!("iv" in options)) {
      throw new Error("Invalid IV parameter.");
    }
    this._iv = transformIV(options.iv, this.blockSize);
    this._inBlock = this._iv.slice(0);
    this._partialBytes = 0;
  };
  modes.ofb.prototype.encrypt = function(input2, output, finish) {
    var inputLength = input2.length();
    if (input2.length() === 0) {
      return true;
    }
    this.cipher.encrypt(this._inBlock, this._outBlock);
    if (this._partialBytes === 0 && inputLength >= this.blockSize) {
      for (var i = 0;i < this._ints; ++i) {
        output.putInt32(input2.getInt32() ^ this._outBlock[i]);
        this._inBlock[i] = this._outBlock[i];
      }
      return;
    }
    var partialBytes = (this.blockSize - inputLength) % this.blockSize;
    if (partialBytes > 0) {
      partialBytes = this.blockSize - partialBytes;
    }
    this._partialOutput.clear();
    for (var i = 0;i < this._ints; ++i) {
      this._partialOutput.putInt32(input2.getInt32() ^ this._outBlock[i]);
    }
    if (partialBytes > 0) {
      input2.read -= this.blockSize;
    } else {
      for (var i = 0;i < this._ints; ++i) {
        this._inBlock[i] = this._outBlock[i];
      }
    }
    if (this._partialBytes > 0) {
      this._partialOutput.getBytes(this._partialBytes);
    }
    if (partialBytes > 0 && !finish) {
      output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
      this._partialBytes = partialBytes;
      return true;
    }
    output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
    this._partialBytes = 0;
  };
  modes.ofb.prototype.decrypt = modes.ofb.prototype.encrypt;
  modes.ctr = function(options) {
    options = options || {};
    this.name = "CTR";
    this.cipher = options.cipher;
    this.blockSize = options.blockSize || 16;
    this._ints = this.blockSize / 4;
    this._inBlock = null;
    this._outBlock = new Array(this._ints);
    this._partialOutput = forge.util.createBuffer();
    this._partialBytes = 0;
  };
  modes.ctr.prototype.start = function(options) {
    if (!("iv" in options)) {
      throw new Error("Invalid IV parameter.");
    }
    this._iv = transformIV(options.iv, this.blockSize);
    this._inBlock = this._iv.slice(0);
    this._partialBytes = 0;
  };
  modes.ctr.prototype.encrypt = function(input2, output, finish) {
    var inputLength = input2.length();
    if (inputLength === 0) {
      return true;
    }
    this.cipher.encrypt(this._inBlock, this._outBlock);
    if (this._partialBytes === 0 && inputLength >= this.blockSize) {
      for (var i = 0;i < this._ints; ++i) {
        output.putInt32(input2.getInt32() ^ this._outBlock[i]);
      }
    } else {
      var partialBytes = (this.blockSize - inputLength) % this.blockSize;
      if (partialBytes > 0) {
        partialBytes = this.blockSize - partialBytes;
      }
      this._partialOutput.clear();
      for (var i = 0;i < this._ints; ++i) {
        this._partialOutput.putInt32(input2.getInt32() ^ this._outBlock[i]);
      }
      if (partialBytes > 0) {
        input2.read -= this.blockSize;
      }
      if (this._partialBytes > 0) {
        this._partialOutput.getBytes(this._partialBytes);
      }
      if (partialBytes > 0 && !finish) {
        output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
        this._partialBytes = partialBytes;
        return true;
      }
      output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
      this._partialBytes = 0;
    }
    inc32(this._inBlock);
  };
  modes.ctr.prototype.decrypt = modes.ctr.prototype.encrypt;
  modes.gcm = function(options) {
    options = options || {};
    this.name = "GCM";
    this.cipher = options.cipher;
    this.blockSize = options.blockSize || 16;
    this._ints = this.blockSize / 4;
    this._inBlock = new Array(this._ints);
    this._outBlock = new Array(this._ints);
    this._partialOutput = forge.util.createBuffer();
    this._partialBytes = 0;
    this._R = 3774873600;
  };
  modes.gcm.prototype.start = function(options) {
    if (!("iv" in options)) {
      throw new Error("Invalid IV parameter.");
    }
    var iv = forge.util.createBuffer(options.iv);
    this._cipherLength = 0;
    var additionalData;
    if ("additionalData" in options) {
      additionalData = forge.util.createBuffer(options.additionalData);
    } else {
      additionalData = forge.util.createBuffer();
    }
    if ("tagLength" in options) {
      this._tagLength = options.tagLength;
    } else {
      this._tagLength = 128;
    }
    this._tag = null;
    if (options.decrypt) {
      this._tag = forge.util.createBuffer(options.tag).getBytes();
      if (this._tag.length !== this._tagLength / 8) {
        throw new Error("Authentication tag does not match tag length.");
      }
    }
    this._hashBlock = new Array(this._ints);
    this.tag = null;
    this._hashSubkey = new Array(this._ints);
    this.cipher.encrypt([0, 0, 0, 0], this._hashSubkey);
    this.componentBits = 4;
    this._m = this.generateHashTable(this._hashSubkey, this.componentBits);
    var ivLength = iv.length();
    if (ivLength === 12) {
      this._j0 = [iv.getInt32(), iv.getInt32(), iv.getInt32(), 1];
    } else {
      this._j0 = [0, 0, 0, 0];
      while (iv.length() > 0) {
        this._j0 = this.ghash(this._hashSubkey, this._j0, [iv.getInt32(), iv.getInt32(), iv.getInt32(), iv.getInt32()]);
      }
      this._j0 = this.ghash(this._hashSubkey, this._j0, [0, 0].concat(from64To32(ivLength * 8)));
    }
    this._inBlock = this._j0.slice(0);
    inc32(this._inBlock);
    this._partialBytes = 0;
    additionalData = forge.util.createBuffer(additionalData);
    this._aDataLength = from64To32(additionalData.length() * 8);
    var overflow = additionalData.length() % this.blockSize;
    if (overflow) {
      additionalData.fillWithByte(0, this.blockSize - overflow);
    }
    this._s = [0, 0, 0, 0];
    while (additionalData.length() > 0) {
      this._s = this.ghash(this._hashSubkey, this._s, [
        additionalData.getInt32(),
        additionalData.getInt32(),
        additionalData.getInt32(),
        additionalData.getInt32()
      ]);
    }
  };
  modes.gcm.prototype.encrypt = function(input2, output, finish) {
    var inputLength = input2.length();
    if (inputLength === 0) {
      return true;
    }
    this.cipher.encrypt(this._inBlock, this._outBlock);
    if (this._partialBytes === 0 && inputLength >= this.blockSize) {
      for (var i = 0;i < this._ints; ++i) {
        output.putInt32(this._outBlock[i] ^= input2.getInt32());
      }
      this._cipherLength += this.blockSize;
    } else {
      var partialBytes = (this.blockSize - inputLength) % this.blockSize;
      if (partialBytes > 0) {
        partialBytes = this.blockSize - partialBytes;
      }
      this._partialOutput.clear();
      for (var i = 0;i < this._ints; ++i) {
        this._partialOutput.putInt32(input2.getInt32() ^ this._outBlock[i]);
      }
      if (partialBytes <= 0 || finish) {
        if (finish) {
          var overflow = inputLength % this.blockSize;
          this._cipherLength += overflow;
          this._partialOutput.truncate(this.blockSize - overflow);
        } else {
          this._cipherLength += this.blockSize;
        }
        for (var i = 0;i < this._ints; ++i) {
          this._outBlock[i] = this._partialOutput.getInt32();
        }
        this._partialOutput.read -= this.blockSize;
      }
      if (this._partialBytes > 0) {
        this._partialOutput.getBytes(this._partialBytes);
      }
      if (partialBytes > 0 && !finish) {
        input2.read -= this.blockSize;
        output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
        this._partialBytes = partialBytes;
        return true;
      }
      output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
      this._partialBytes = 0;
    }
    this._s = this.ghash(this._hashSubkey, this._s, this._outBlock);
    inc32(this._inBlock);
  };
  modes.gcm.prototype.decrypt = function(input2, output, finish) {
    var inputLength = input2.length();
    if (inputLength < this.blockSize && !(finish && inputLength > 0)) {
      return true;
    }
    this.cipher.encrypt(this._inBlock, this._outBlock);
    inc32(this._inBlock);
    this._hashBlock[0] = input2.getInt32();
    this._hashBlock[1] = input2.getInt32();
    this._hashBlock[2] = input2.getInt32();
    this._hashBlock[3] = input2.getInt32();
    this._s = this.ghash(this._hashSubkey, this._s, this._hashBlock);
    for (var i = 0;i < this._ints; ++i) {
      output.putInt32(this._outBlock[i] ^ this._hashBlock[i]);
    }
    if (inputLength < this.blockSize) {
      this._cipherLength += inputLength % this.blockSize;
    } else {
      this._cipherLength += this.blockSize;
    }
  };
  modes.gcm.prototype.afterFinish = function(output, options) {
    var rval = true;
    if (options.decrypt && options.overflow) {
      output.truncate(this.blockSize - options.overflow);
    }
    this.tag = forge.util.createBuffer();
    var lengths = this._aDataLength.concat(from64To32(this._cipherLength * 8));
    this._s = this.ghash(this._hashSubkey, this._s, lengths);
    var tag = [];
    this.cipher.encrypt(this._j0, tag);
    for (var i = 0;i < this._ints; ++i) {
      this.tag.putInt32(this._s[i] ^ tag[i]);
    }
    this.tag.truncate(this.tag.length() % (this._tagLength / 8));
    if (options.decrypt && this.tag.bytes() !== this._tag) {
      rval = false;
    }
    return rval;
  };
  modes.gcm.prototype.multiply = function(x, y) {
    var z_i = [0, 0, 0, 0];
    var v_i = y.slice(0);
    for (var i = 0;i < 128; ++i) {
      var x_i = x[i / 32 | 0] & 1 << 31 - i % 32;
      if (x_i) {
        z_i[0] ^= v_i[0];
        z_i[1] ^= v_i[1];
        z_i[2] ^= v_i[2];
        z_i[3] ^= v_i[3];
      }
      this.pow(v_i, v_i);
    }
    return z_i;
  };
  modes.gcm.prototype.pow = function(x, out) {
    var lsb = x[3] & 1;
    for (var i = 3;i > 0; --i) {
      out[i] = x[i] >>> 1 | (x[i - 1] & 1) << 31;
    }
    out[0] = x[0] >>> 1;
    if (lsb) {
      out[0] ^= this._R;
    }
  };
  modes.gcm.prototype.tableMultiply = function(x) {
    var z = [0, 0, 0, 0];
    for (var i = 0;i < 32; ++i) {
      var idx = i / 8 | 0;
      var x_i = x[idx] >>> (7 - i % 8) * 4 & 15;
      var ah = this._m[i][x_i];
      z[0] ^= ah[0];
      z[1] ^= ah[1];
      z[2] ^= ah[2];
      z[3] ^= ah[3];
    }
    return z;
  };
  modes.gcm.prototype.ghash = function(h, y, x) {
    y[0] ^= x[0];
    y[1] ^= x[1];
    y[2] ^= x[2];
    y[3] ^= x[3];
    return this.tableMultiply(y);
  };
  modes.gcm.prototype.generateHashTable = function(h, bits) {
    var multiplier = 8 / bits;
    var perInt = 4 * multiplier;
    var size = 16 * multiplier;
    var m = new Array(size);
    for (var i = 0;i < size; ++i) {
      var tmp = [0, 0, 0, 0];
      var idx = i / perInt | 0;
      var shft = (perInt - 1 - i % perInt) * bits;
      tmp[idx] = 1 << bits - 1 << shft;
      m[i] = this.generateSubHashTable(this.multiply(tmp, h), bits);
    }
    return m;
  };
  modes.gcm.prototype.generateSubHashTable = function(mid, bits) {
    var size = 1 << bits;
    var half = size >>> 1;
    var m = new Array(size);
    m[half] = mid.slice(0);
    var i = half >>> 1;
    while (i > 0) {
      this.pow(m[2 * i], m[i] = []);
      i >>= 1;
    }
    i = 2;
    while (i < half) {
      for (var j = 1;j < i; ++j) {
        var m_i = m[i];
        var m_j = m[j];
        m[i + j] = [
          m_i[0] ^ m_j[0],
          m_i[1] ^ m_j[1],
          m_i[2] ^ m_j[2],
          m_i[3] ^ m_j[3]
        ];
      }
      i *= 2;
    }
    m[0] = [0, 0, 0, 0];
    for (i = half + 1;i < size; ++i) {
      var c = m[i ^ half];
      m[i] = [mid[0] ^ c[0], mid[1] ^ c[1], mid[2] ^ c[2], mid[3] ^ c[3]];
    }
    return m;
  };
  function transformIV(iv, blockSize) {
    if (typeof iv === "string") {
      iv = forge.util.createBuffer(iv);
    }
    if (forge.util.isArray(iv) && iv.length > 4) {
      var tmp = iv;
      iv = forge.util.createBuffer();
      for (var i = 0;i < tmp.length; ++i) {
        iv.putByte(tmp[i]);
      }
    }
    if (iv.length() < blockSize) {
      throw new Error("Invalid IV length; got " + iv.length() + " bytes and expected " + blockSize + " bytes.");
    }
    if (!forge.util.isArray(iv)) {
      var ints = [];
      var blocks = blockSize / 4;
      for (var i = 0;i < blocks; ++i) {
        ints.push(iv.getInt32());
      }
      iv = ints;
    }
    return iv;
  }
  function inc32(block) {
    block[block.length - 1] = block[block.length - 1] + 1 & 4294967295;
  }
  function from64To32(num) {
    return [num / 4294967296 | 0, num & 4294967295];
  }
});

// node_modules/node-forge/lib/aes.js
var require_aes = __commonJS((exports, module) => {
  var forge = require_forge();
  require_cipher();
  require_cipherModes();
  require_util();
  module.exports = forge.aes = forge.aes || {};
  forge.aes.startEncrypting = function(key, iv, output, mode) {
    var cipher = _createCipher({
      key,
      output,
      decrypt: false,
      mode
    });
    cipher.start(iv);
    return cipher;
  };
  forge.aes.createEncryptionCipher = function(key, mode) {
    return _createCipher({
      key,
      output: null,
      decrypt: false,
      mode
    });
  };
  forge.aes.startDecrypting = function(key, iv, output, mode) {
    var cipher = _createCipher({
      key,
      output,
      decrypt: true,
      mode
    });
    cipher.start(iv);
    return cipher;
  };
  forge.aes.createDecryptionCipher = function(key, mode) {
    return _createCipher({
      key,
      output: null,
      decrypt: true,
      mode
    });
  };
  forge.aes.Algorithm = function(name, mode) {
    if (!init) {
      initialize();
    }
    var self2 = this;
    self2.name = name;
    self2.mode = new mode({
      blockSize: 16,
      cipher: {
        encrypt: function(inBlock, outBlock) {
          return _updateBlock(self2._w, inBlock, outBlock, false);
        },
        decrypt: function(inBlock, outBlock) {
          return _updateBlock(self2._w, inBlock, outBlock, true);
        }
      }
    });
    self2._init = false;
  };
  forge.aes.Algorithm.prototype.initialize = function(options) {
    if (this._init) {
      return;
    }
    var key = options.key;
    var tmp;
    if (typeof key === "string" && (key.length === 16 || key.length === 24 || key.length === 32)) {
      key = forge.util.createBuffer(key);
    } else if (forge.util.isArray(key) && (key.length === 16 || key.length === 24 || key.length === 32)) {
      tmp = key;
      key = forge.util.createBuffer();
      for (var i = 0;i < tmp.length; ++i) {
        key.putByte(tmp[i]);
      }
    }
    if (!forge.util.isArray(key)) {
      tmp = key;
      key = [];
      var len = tmp.length();
      if (len === 16 || len === 24 || len === 32) {
        len = len >>> 2;
        for (var i = 0;i < len; ++i) {
          key.push(tmp.getInt32());
        }
      }
    }
    if (!forge.util.isArray(key) || !(key.length === 4 || key.length === 6 || key.length === 8)) {
      throw new Error("Invalid key parameter.");
    }
    var mode = this.mode.name;
    var encryptOp = ["CFB", "OFB", "CTR", "GCM"].indexOf(mode) !== -1;
    this._w = _expandKey(key, options.decrypt && !encryptOp);
    this._init = true;
  };
  forge.aes._expandKey = function(key, decrypt) {
    if (!init) {
      initialize();
    }
    return _expandKey(key, decrypt);
  };
  forge.aes._updateBlock = _updateBlock;
  registerAlgorithm("AES-ECB", forge.cipher.modes.ecb);
  registerAlgorithm("AES-CBC", forge.cipher.modes.cbc);
  registerAlgorithm("AES-CFB", forge.cipher.modes.cfb);
  registerAlgorithm("AES-OFB", forge.cipher.modes.ofb);
  registerAlgorithm("AES-CTR", forge.cipher.modes.ctr);
  registerAlgorithm("AES-GCM", forge.cipher.modes.gcm);
  function registerAlgorithm(name, mode) {
    var factory = function() {
      return new forge.aes.Algorithm(name, mode);
    };
    forge.cipher.registerAlgorithm(name, factory);
  }
  var init = false;
  var Nb = 4;
  var sbox;
  var isbox;
  var rcon;
  var mix;
  var imix;
  function initialize() {
    init = true;
    rcon = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
    var xtime = new Array(256);
    for (var i = 0;i < 128; ++i) {
      xtime[i] = i << 1;
      xtime[i + 128] = i + 128 << 1 ^ 283;
    }
    sbox = new Array(256);
    isbox = new Array(256);
    mix = new Array(4);
    imix = new Array(4);
    for (var i = 0;i < 4; ++i) {
      mix[i] = new Array(256);
      imix[i] = new Array(256);
    }
    var e = 0, ei = 0, e2, e4, e8, sx, sx2, me, ime;
    for (var i = 0;i < 256; ++i) {
      sx = ei ^ ei << 1 ^ ei << 2 ^ ei << 3 ^ ei << 4;
      sx = sx >> 8 ^ sx & 255 ^ 99;
      sbox[e] = sx;
      isbox[sx] = e;
      sx2 = xtime[sx];
      e2 = xtime[e];
      e4 = xtime[e2];
      e8 = xtime[e4];
      me = sx2 << 24 ^ sx << 16 ^ sx << 8 ^ (sx ^ sx2);
      ime = (e2 ^ e4 ^ e8) << 24 ^ (e ^ e8) << 16 ^ (e ^ e4 ^ e8) << 8 ^ (e ^ e2 ^ e8);
      for (var n = 0;n < 4; ++n) {
        mix[n][e] = me;
        imix[n][sx] = ime;
        me = me << 24 | me >>> 8;
        ime = ime << 24 | ime >>> 8;
      }
      if (e === 0) {
        e = ei = 1;
      } else {
        e = e2 ^ xtime[xtime[xtime[e2 ^ e8]]];
        ei ^= xtime[xtime[ei]];
      }
    }
  }
  function _expandKey(key, decrypt) {
    var w = key.slice(0);
    var temp, iNk = 1;
    var Nk = w.length;
    var Nr1 = Nk + 6 + 1;
    var end = Nb * Nr1;
    for (var i = Nk;i < end; ++i) {
      temp = w[i - 1];
      if (i % Nk === 0) {
        temp = sbox[temp >>> 16 & 255] << 24 ^ sbox[temp >>> 8 & 255] << 16 ^ sbox[temp & 255] << 8 ^ sbox[temp >>> 24] ^ rcon[iNk] << 24;
        iNk++;
      } else if (Nk > 6 && i % Nk === 4) {
        temp = sbox[temp >>> 24] << 24 ^ sbox[temp >>> 16 & 255] << 16 ^ sbox[temp >>> 8 & 255] << 8 ^ sbox[temp & 255];
      }
      w[i] = w[i - Nk] ^ temp;
    }
    if (decrypt) {
      var tmp;
      var m0 = imix[0];
      var m1 = imix[1];
      var m2 = imix[2];
      var m3 = imix[3];
      var wnew = w.slice(0);
      end = w.length;
      for (var i = 0, wi = end - Nb;i < end; i += Nb, wi -= Nb) {
        if (i === 0 || i === end - Nb) {
          wnew[i] = w[wi];
          wnew[i + 1] = w[wi + 3];
          wnew[i + 2] = w[wi + 2];
          wnew[i + 3] = w[wi + 1];
        } else {
          for (var n = 0;n < Nb; ++n) {
            tmp = w[wi + n];
            wnew[i + (3 & -n)] = m0[sbox[tmp >>> 24]] ^ m1[sbox[tmp >>> 16 & 255]] ^ m2[sbox[tmp >>> 8 & 255]] ^ m3[sbox[tmp & 255]];
          }
        }
      }
      w = wnew;
    }
    return w;
  }
  function _updateBlock(w, input2, output, decrypt) {
    var Nr = w.length / 4 - 1;
    var m0, m1, m2, m3, sub;
    if (decrypt) {
      m0 = imix[0];
      m1 = imix[1];
      m2 = imix[2];
      m3 = imix[3];
      sub = isbox;
    } else {
      m0 = mix[0];
      m1 = mix[1];
      m2 = mix[2];
      m3 = mix[3];
      sub = sbox;
    }
    var a, b, c, d, a2, b2, c2;
    a = input2[0] ^ w[0];
    b = input2[decrypt ? 3 : 1] ^ w[1];
    c = input2[2] ^ w[2];
    d = input2[decrypt ? 1 : 3] ^ w[3];
    var i = 3;
    for (var round = 1;round < Nr; ++round) {
      a2 = m0[a >>> 24] ^ m1[b >>> 16 & 255] ^ m2[c >>> 8 & 255] ^ m3[d & 255] ^ w[++i];
      b2 = m0[b >>> 24] ^ m1[c >>> 16 & 255] ^ m2[d >>> 8 & 255] ^ m3[a & 255] ^ w[++i];
      c2 = m0[c >>> 24] ^ m1[d >>> 16 & 255] ^ m2[a >>> 8 & 255] ^ m3[b & 255] ^ w[++i];
      d = m0[d >>> 24] ^ m1[a >>> 16 & 255] ^ m2[b >>> 8 & 255] ^ m3[c & 255] ^ w[++i];
      a = a2;
      b = b2;
      c = c2;
    }
    output[0] = sub[a >>> 24] << 24 ^ sub[b >>> 16 & 255] << 16 ^ sub[c >>> 8 & 255] << 8 ^ sub[d & 255] ^ w[++i];
    output[decrypt ? 3 : 1] = sub[b >>> 24] << 24 ^ sub[c >>> 16 & 255] << 16 ^ sub[d >>> 8 & 255] << 8 ^ sub[a & 255] ^ w[++i];
    output[2] = sub[c >>> 24] << 24 ^ sub[d >>> 16 & 255] << 16 ^ sub[a >>> 8 & 255] << 8 ^ sub[b & 255] ^ w[++i];
    output[decrypt ? 1 : 3] = sub[d >>> 24] << 24 ^ sub[a >>> 16 & 255] << 16 ^ sub[b >>> 8 & 255] << 8 ^ sub[c & 255] ^ w[++i];
  }
  function _createCipher(options) {
    options = options || {};
    var mode = (options.mode || "CBC").toUpperCase();
    var algorithm = "AES-" + mode;
    var cipher;
    if (options.decrypt) {
      cipher = forge.cipher.createDecipher(algorithm, options.key);
    } else {
      cipher = forge.cipher.createCipher(algorithm, options.key);
    }
    var start = cipher.start;
    cipher.start = function(iv, options2) {
      var output = null;
      if (options2 instanceof forge.util.ByteBuffer) {
        output = options2;
        options2 = {};
      }
      options2 = options2 || {};
      options2.output = output;
      options2.iv = iv;
      start.call(cipher, options2);
    };
    return cipher;
  }
});

// node_modules/node-forge/lib/oids.js
var require_oids = __commonJS((exports, module) => {
  var forge = require_forge();
  forge.pki = forge.pki || {};
  var oids = module.exports = forge.pki.oids = forge.oids = forge.oids || {};
  function _IN(id, name) {
    oids[id] = name;
    oids[name] = id;
  }
  function _I_(id, name) {
    oids[id] = name;
  }
  _IN("1.2.840.113549.1.1.1", "rsaEncryption");
  _IN("1.2.840.113549.1.1.4", "md5WithRSAEncryption");
  _IN("1.2.840.113549.1.1.5", "sha1WithRSAEncryption");
  _IN("1.2.840.113549.1.1.7", "RSAES-OAEP");
  _IN("1.2.840.113549.1.1.8", "mgf1");
  _IN("1.2.840.113549.1.1.9", "pSpecified");
  _IN("1.2.840.113549.1.1.10", "RSASSA-PSS");
  _IN("1.2.840.113549.1.1.11", "sha256WithRSAEncryption");
  _IN("1.2.840.113549.1.1.12", "sha384WithRSAEncryption");
  _IN("1.2.840.113549.1.1.13", "sha512WithRSAEncryption");
  _IN("1.3.101.112", "EdDSA25519");
  _IN("1.2.840.10040.4.3", "dsa-with-sha1");
  _IN("1.3.14.3.2.7", "desCBC");
  _IN("1.3.14.3.2.26", "sha1");
  _IN("1.3.14.3.2.29", "sha1WithRSASignature");
  _IN("2.16.840.1.101.3.4.2.1", "sha256");
  _IN("2.16.840.1.101.3.4.2.2", "sha384");
  _IN("2.16.840.1.101.3.4.2.3", "sha512");
  _IN("2.16.840.1.101.3.4.2.4", "sha224");
  _IN("2.16.840.1.101.3.4.2.5", "sha512-224");
  _IN("2.16.840.1.101.3.4.2.6", "sha512-256");
  _IN("1.2.840.113549.2.2", "md2");
  _IN("1.2.840.113549.2.5", "md5");
  _IN("1.2.840.113549.1.7.1", "data");
  _IN("1.2.840.113549.1.7.2", "signedData");
  _IN("1.2.840.113549.1.7.3", "envelopedData");
  _IN("1.2.840.113549.1.7.4", "signedAndEnvelopedData");
  _IN("1.2.840.113549.1.7.5", "digestedData");
  _IN("1.2.840.113549.1.7.6", "encryptedData");
  _IN("1.2.840.113549.1.9.1", "emailAddress");
  _IN("1.2.840.113549.1.9.2", "unstructuredName");
  _IN("1.2.840.113549.1.9.3", "contentType");
  _IN("1.2.840.113549.1.9.4", "messageDigest");
  _IN("1.2.840.113549.1.9.5", "signingTime");
  _IN("1.2.840.113549.1.9.6", "counterSignature");
  _IN("1.2.840.113549.1.9.7", "challengePassword");
  _IN("1.2.840.113549.1.9.8", "unstructuredAddress");
  _IN("1.2.840.113549.1.9.14", "extensionRequest");
  _IN("1.2.840.113549.1.9.20", "friendlyName");
  _IN("1.2.840.113549.1.9.21", "localKeyId");
  _IN("1.2.840.113549.1.9.22.1", "x509Certificate");
  _IN("1.2.840.113549.1.12.10.1.1", "keyBag");
  _IN("1.2.840.113549.1.12.10.1.2", "pkcs8ShroudedKeyBag");
  _IN("1.2.840.113549.1.12.10.1.3", "certBag");
  _IN("1.2.840.113549.1.12.10.1.4", "crlBag");
  _IN("1.2.840.113549.1.12.10.1.5", "secretBag");
  _IN("1.2.840.113549.1.12.10.1.6", "safeContentsBag");
  _IN("1.2.840.113549.1.5.13", "pkcs5PBES2");
  _IN("1.2.840.113549.1.5.12", "pkcs5PBKDF2");
  _IN("1.2.840.113549.1.12.1.1", "pbeWithSHAAnd128BitRC4");
  _IN("1.2.840.113549.1.12.1.2", "pbeWithSHAAnd40BitRC4");
  _IN("1.2.840.113549.1.12.1.3", "pbeWithSHAAnd3-KeyTripleDES-CBC");
  _IN("1.2.840.113549.1.12.1.4", "pbeWithSHAAnd2-KeyTripleDES-CBC");
  _IN("1.2.840.113549.1.12.1.5", "pbeWithSHAAnd128BitRC2-CBC");
  _IN("1.2.840.113549.1.12.1.6", "pbewithSHAAnd40BitRC2-CBC");
  _IN("1.2.840.113549.2.7", "hmacWithSHA1");
  _IN("1.2.840.113549.2.8", "hmacWithSHA224");
  _IN("1.2.840.113549.2.9", "hmacWithSHA256");
  _IN("1.2.840.113549.2.10", "hmacWithSHA384");
  _IN("1.2.840.113549.2.11", "hmacWithSHA512");
  _IN("1.2.840.113549.3.7", "des-EDE3-CBC");
  _IN("2.16.840.1.101.3.4.1.2", "aes128-CBC");
  _IN("2.16.840.1.101.3.4.1.22", "aes192-CBC");
  _IN("2.16.840.1.101.3.4.1.42", "aes256-CBC");
  _IN("2.5.4.3", "commonName");
  _IN("2.5.4.4", "surname");
  _IN("2.5.4.5", "serialNumber");
  _IN("2.5.4.6", "countryName");
  _IN("2.5.4.7", "localityName");
  _IN("2.5.4.8", "stateOrProvinceName");
  _IN("2.5.4.9", "streetAddress");
  _IN("2.5.4.10", "organizationName");
  _IN("2.5.4.11", "organizationalUnitName");
  _IN("2.5.4.12", "title");
  _IN("2.5.4.13", "description");
  _IN("2.5.4.15", "businessCategory");
  _IN("2.5.4.17", "postalCode");
  _IN("2.5.4.42", "givenName");
  _IN("2.5.4.65", "pseudonym");
  _IN("1.3.6.1.4.1.311.60.2.1.2", "jurisdictionOfIncorporationStateOrProvinceName");
  _IN("1.3.6.1.4.1.311.60.2.1.3", "jurisdictionOfIncorporationCountryName");
  _IN("2.16.840.1.113730.1.1", "nsCertType");
  _IN("2.16.840.1.113730.1.13", "nsComment");
  _I_("2.5.29.1", "authorityKeyIdentifier");
  _I_("2.5.29.2", "keyAttributes");
  _I_("2.5.29.3", "certificatePolicies");
  _I_("2.5.29.4", "keyUsageRestriction");
  _I_("2.5.29.5", "policyMapping");
  _I_("2.5.29.6", "subtreesConstraint");
  _I_("2.5.29.7", "subjectAltName");
  _I_("2.5.29.8", "issuerAltName");
  _I_("2.5.29.9", "subjectDirectoryAttributes");
  _I_("2.5.29.10", "basicConstraints");
  _I_("2.5.29.11", "nameConstraints");
  _I_("2.5.29.12", "policyConstraints");
  _I_("2.5.29.13", "basicConstraints");
  _IN("2.5.29.14", "subjectKeyIdentifier");
  _IN("2.5.29.15", "keyUsage");
  _I_("2.5.29.16", "privateKeyUsagePeriod");
  _IN("2.5.29.17", "subjectAltName");
  _IN("2.5.29.18", "issuerAltName");
  _IN("2.5.29.19", "basicConstraints");
  _I_("2.5.29.20", "cRLNumber");
  _I_("2.5.29.21", "cRLReason");
  _I_("2.5.29.22", "expirationDate");
  _I_("2.5.29.23", "instructionCode");
  _I_("2.5.29.24", "invalidityDate");
  _I_("2.5.29.25", "cRLDistributionPoints");
  _I_("2.5.29.26", "issuingDistributionPoint");
  _I_("2.5.29.27", "deltaCRLIndicator");
  _I_("2.5.29.28", "issuingDistributionPoint");
  _I_("2.5.29.29", "certificateIssuer");
  _I_("2.5.29.30", "nameConstraints");
  _IN("2.5.29.31", "cRLDistributionPoints");
  _IN("2.5.29.32", "certificatePolicies");
  _I_("2.5.29.33", "policyMappings");
  _I_("2.5.29.34", "policyConstraints");
  _IN("2.5.29.35", "authorityKeyIdentifier");
  _I_("2.5.29.36", "policyConstraints");
  _IN("2.5.29.37", "extKeyUsage");
  _I_("2.5.29.46", "freshestCRL");
  _I_("2.5.29.54", "inhibitAnyPolicy");
  _IN("1.3.6.1.4.1.11129.2.4.2", "timestampList");
  _IN("1.3.6.1.5.5.7.1.1", "authorityInfoAccess");
  _IN("1.3.6.1.5.5.7.3.1", "serverAuth");
  _IN("1.3.6.1.5.5.7.3.2", "clientAuth");
  _IN("1.3.6.1.5.5.7.3.3", "codeSigning");
  _IN("1.3.6.1.5.5.7.3.4", "emailProtection");
  _IN("1.3.6.1.5.5.7.3.8", "timeStamping");
});

// node_modules/node-forge/lib/asn1.js
var require_asn1 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_util();
  require_oids();
  var asn1 = module.exports = forge.asn1 = forge.asn1 || {};
  asn1.Class = {
    UNIVERSAL: 0,
    APPLICATION: 64,
    CONTEXT_SPECIFIC: 128,
    PRIVATE: 192
  };
  asn1.Type = {
    NONE: 0,
    BOOLEAN: 1,
    INTEGER: 2,
    BITSTRING: 3,
    OCTETSTRING: 4,
    NULL: 5,
    OID: 6,
    ODESC: 7,
    EXTERNAL: 8,
    REAL: 9,
    ENUMERATED: 10,
    EMBEDDED: 11,
    UTF8: 12,
    ROID: 13,
    SEQUENCE: 16,
    SET: 17,
    PRINTABLESTRING: 19,
    IA5STRING: 22,
    UTCTIME: 23,
    GENERALIZEDTIME: 24,
    BMPSTRING: 30
  };
  asn1.maxDepth = 256;
  asn1.create = function(tagClass, type, constructed, value, options) {
    if (forge.util.isArray(value)) {
      var tmp = [];
      for (var i = 0;i < value.length; ++i) {
        if (value[i] !== undefined) {
          tmp.push(value[i]);
        }
      }
      value = tmp;
    }
    var obj = {
      tagClass,
      type,
      constructed,
      composed: constructed || forge.util.isArray(value),
      value
    };
    if (options && "bitStringContents" in options) {
      obj.bitStringContents = options.bitStringContents;
      obj.original = asn1.copy(obj);
    }
    return obj;
  };
  asn1.copy = function(obj, options) {
    var copy;
    if (forge.util.isArray(obj)) {
      copy = [];
      for (var i = 0;i < obj.length; ++i) {
        copy.push(asn1.copy(obj[i], options));
      }
      return copy;
    }
    if (typeof obj === "string") {
      return obj;
    }
    copy = {
      tagClass: obj.tagClass,
      type: obj.type,
      constructed: obj.constructed,
      composed: obj.composed,
      value: asn1.copy(obj.value, options)
    };
    if (options && !options.excludeBitStringContents) {
      copy.bitStringContents = obj.bitStringContents;
    }
    return copy;
  };
  asn1.equals = function(obj1, obj2, options) {
    if (forge.util.isArray(obj1)) {
      if (!forge.util.isArray(obj2)) {
        return false;
      }
      if (obj1.length !== obj2.length) {
        return false;
      }
      for (var i = 0;i < obj1.length; ++i) {
        if (!asn1.equals(obj1[i], obj2[i])) {
          return false;
        }
      }
      return true;
    }
    if (typeof obj1 !== typeof obj2) {
      return false;
    }
    if (typeof obj1 === "string") {
      return obj1 === obj2;
    }
    var equal = obj1.tagClass === obj2.tagClass && obj1.type === obj2.type && obj1.constructed === obj2.constructed && obj1.composed === obj2.composed && asn1.equals(obj1.value, obj2.value);
    if (options && options.includeBitStringContents) {
      equal = equal && obj1.bitStringContents === obj2.bitStringContents;
    }
    return equal;
  };
  asn1.getBerValueLength = function(b) {
    var b2 = b.getByte();
    if (b2 === 128) {
      return;
    }
    var length;
    var longForm = b2 & 128;
    if (!longForm) {
      length = b2;
    } else {
      length = b.getInt((b2 & 127) << 3);
    }
    return length;
  };
  function _checkBufferLength(bytes, remaining, n) {
    if (n > remaining) {
      var error = new Error("Too few bytes to parse DER.");
      error.available = bytes.length();
      error.remaining = remaining;
      error.requested = n;
      throw error;
    }
  }
  var _getValueLength = function(bytes, remaining) {
    var b2 = bytes.getByte();
    remaining--;
    if (b2 === 128) {
      return;
    }
    var length;
    var longForm = b2 & 128;
    if (!longForm) {
      length = b2;
    } else {
      var longFormBytes = b2 & 127;
      _checkBufferLength(bytes, remaining, longFormBytes);
      length = bytes.getInt(longFormBytes << 3);
    }
    if (length < 0) {
      throw new Error("Negative length: " + length);
    }
    return length;
  };
  asn1.fromDer = function(bytes, options) {
    if (options === undefined) {
      options = {
        strict: true,
        parseAllBytes: true,
        decodeBitStrings: true
      };
    }
    if (typeof options === "boolean") {
      options = {
        strict: options,
        parseAllBytes: true,
        decodeBitStrings: true
      };
    }
    if (!("strict" in options)) {
      options.strict = true;
    }
    if (!("parseAllBytes" in options)) {
      options.parseAllBytes = true;
    }
    if (!("decodeBitStrings" in options)) {
      options.decodeBitStrings = true;
    }
    if (!("maxDepth" in options)) {
      options.maxDepth = asn1.maxDepth;
    }
    if (typeof bytes === "string") {
      bytes = forge.util.createBuffer(bytes);
    }
    var byteCount = bytes.length();
    var value = _fromDer(bytes, bytes.length(), 0, options);
    if (options.parseAllBytes && bytes.length() !== 0) {
      var error = new Error("Unparsed DER bytes remain after ASN.1 parsing.");
      error.byteCount = byteCount;
      error.remaining = bytes.length();
      throw error;
    }
    return value;
  };
  function _fromDer(bytes, remaining, depth, options) {
    if (depth >= options.maxDepth) {
      throw new Error("ASN.1 parsing error: Max depth exceeded.");
    }
    var start;
    _checkBufferLength(bytes, remaining, 2);
    var b1 = bytes.getByte();
    remaining--;
    var tagClass = b1 & 192;
    var type = b1 & 31;
    start = bytes.length();
    var length = _getValueLength(bytes, remaining);
    remaining -= start - bytes.length();
    if (length !== undefined && length > remaining) {
      if (options.strict) {
        var error = new Error("Too few bytes to read ASN.1 value.");
        error.available = bytes.length();
        error.remaining = remaining;
        error.requested = length;
        throw error;
      }
      length = remaining;
    }
    var value;
    var bitStringContents;
    var constructed = (b1 & 32) === 32;
    if (constructed) {
      value = [];
      if (length === undefined) {
        for (;; ) {
          _checkBufferLength(bytes, remaining, 2);
          if (bytes.bytes(2) === String.fromCharCode(0, 0)) {
            bytes.getBytes(2);
            remaining -= 2;
            break;
          }
          start = bytes.length();
          value.push(_fromDer(bytes, remaining, depth + 1, options));
          remaining -= start - bytes.length();
        }
      } else {
        while (length > 0) {
          start = bytes.length();
          value.push(_fromDer(bytes, length, depth + 1, options));
          remaining -= start - bytes.length();
          length -= start - bytes.length();
        }
      }
    }
    if (value === undefined && tagClass === asn1.Class.UNIVERSAL && type === asn1.Type.BITSTRING) {
      bitStringContents = bytes.bytes(length);
    }
    if (value === undefined && options.decodeBitStrings && tagClass === asn1.Class.UNIVERSAL && type === asn1.Type.BITSTRING && length > 1) {
      var savedRead = bytes.read;
      var savedRemaining = remaining;
      var unused = 0;
      if (type === asn1.Type.BITSTRING) {
        _checkBufferLength(bytes, remaining, 1);
        unused = bytes.getByte();
        remaining--;
      }
      if (unused === 0) {
        try {
          start = bytes.length();
          var subOptions = {
            strict: true,
            decodeBitStrings: true
          };
          var composed = _fromDer(bytes, remaining, depth + 1, subOptions);
          var used = start - bytes.length();
          remaining -= used;
          if (type == asn1.Type.BITSTRING) {
            used++;
          }
          var tc = composed.tagClass;
          if (used === length && (tc === asn1.Class.UNIVERSAL || tc === asn1.Class.CONTEXT_SPECIFIC)) {
            value = [composed];
          }
        } catch (ex) {}
      }
      if (value === undefined) {
        bytes.read = savedRead;
        remaining = savedRemaining;
      }
    }
    if (value === undefined) {
      if (length === undefined) {
        if (options.strict) {
          throw new Error("Non-constructed ASN.1 object of indefinite length.");
        }
        length = remaining;
      }
      if (type === asn1.Type.BMPSTRING) {
        value = "";
        for (;length > 0; length -= 2) {
          _checkBufferLength(bytes, remaining, 2);
          value += String.fromCharCode(bytes.getInt16());
          remaining -= 2;
        }
      } else {
        value = bytes.getBytes(length);
        remaining -= length;
      }
    }
    var asn1Options = bitStringContents === undefined ? null : {
      bitStringContents
    };
    return asn1.create(tagClass, type, constructed, value, asn1Options);
  }
  asn1.toDer = function(obj) {
    var bytes = forge.util.createBuffer();
    var b1 = obj.tagClass | obj.type;
    var value = forge.util.createBuffer();
    var useBitStringContents = false;
    if ("bitStringContents" in obj) {
      useBitStringContents = true;
      if (obj.original) {
        useBitStringContents = asn1.equals(obj, obj.original);
      }
    }
    if (useBitStringContents) {
      value.putBytes(obj.bitStringContents);
    } else if (obj.composed) {
      if (obj.constructed) {
        b1 |= 32;
      } else {
        value.putByte(0);
      }
      for (var i = 0;i < obj.value.length; ++i) {
        if (obj.value[i] !== undefined) {
          value.putBuffer(asn1.toDer(obj.value[i]));
        }
      }
    } else {
      if (obj.type === asn1.Type.BMPSTRING) {
        for (var i = 0;i < obj.value.length; ++i) {
          value.putInt16(obj.value.charCodeAt(i));
        }
      } else {
        if (obj.type === asn1.Type.INTEGER && obj.value.length > 1 && (obj.value.charCodeAt(0) === 0 && (obj.value.charCodeAt(1) & 128) === 0 || obj.value.charCodeAt(0) === 255 && (obj.value.charCodeAt(1) & 128) === 128)) {
          value.putBytes(obj.value.substr(1));
        } else {
          value.putBytes(obj.value);
        }
      }
    }
    bytes.putByte(b1);
    if (value.length() <= 127) {
      bytes.putByte(value.length() & 127);
    } else {
      var len = value.length();
      var lenBytes = "";
      do {
        lenBytes += String.fromCharCode(len & 255);
        len = len >>> 8;
      } while (len > 0);
      bytes.putByte(lenBytes.length | 128);
      for (var i = lenBytes.length - 1;i >= 0; --i) {
        bytes.putByte(lenBytes.charCodeAt(i));
      }
    }
    bytes.putBuffer(value);
    return bytes;
  };
  asn1.oidToDer = function(oid) {
    var values = oid.split(".");
    var bytes = forge.util.createBuffer();
    bytes.putByte(40 * parseInt(values[0], 10) + parseInt(values[1], 10));
    var last, valueBytes, value, b;
    for (var i = 2;i < values.length; ++i) {
      last = true;
      valueBytes = [];
      value = parseInt(values[i], 10);
      if (value > 4294967295) {
        throw new Error("OID value too large; max is 32-bits.");
      }
      do {
        b = value & 127;
        value = value >>> 7;
        if (!last) {
          b |= 128;
        }
        valueBytes.push(b);
        last = false;
      } while (value > 0);
      for (var n = valueBytes.length - 1;n >= 0; --n) {
        bytes.putByte(valueBytes[n]);
      }
    }
    return bytes;
  };
  asn1.derToOid = function(bytes) {
    var oid;
    if (typeof bytes === "string") {
      bytes = forge.util.createBuffer(bytes);
    }
    var b = bytes.getByte();
    oid = Math.floor(b / 40) + "." + b % 40;
    var value = 0;
    while (bytes.length() > 0) {
      if (value > 70368744177663) {
        throw new Error("OID value too large; max is 53-bits.");
      }
      b = bytes.getByte();
      value = value * 128;
      if (b & 128) {
        value += b & 127;
      } else {
        oid += "." + (value + b);
        value = 0;
      }
    }
    return oid;
  };
  asn1.utcTimeToDate = function(utc) {
    var date = new Date;
    var year = parseInt(utc.substr(0, 2), 10);
    year = year >= 50 ? 1900 + year : 2000 + year;
    var MM = parseInt(utc.substr(2, 2), 10) - 1;
    var DD = parseInt(utc.substr(4, 2), 10);
    var hh = parseInt(utc.substr(6, 2), 10);
    var mm = parseInt(utc.substr(8, 2), 10);
    var ss = 0;
    if (utc.length > 11) {
      var c = utc.charAt(10);
      var end = 10;
      if (c !== "+" && c !== "-") {
        ss = parseInt(utc.substr(10, 2), 10);
        end += 2;
      }
    }
    date.setUTCFullYear(year, MM, DD);
    date.setUTCHours(hh, mm, ss, 0);
    if (end) {
      c = utc.charAt(end);
      if (c === "+" || c === "-") {
        var hhoffset = parseInt(utc.substr(end + 1, 2), 10);
        var mmoffset = parseInt(utc.substr(end + 4, 2), 10);
        var offset = hhoffset * 60 + mmoffset;
        offset *= 60000;
        if (c === "+") {
          date.setTime(+date - offset);
        } else {
          date.setTime(+date + offset);
        }
      }
    }
    return date;
  };
  asn1.generalizedTimeToDate = function(gentime) {
    var date = new Date;
    var YYYY = parseInt(gentime.substr(0, 4), 10);
    var MM = parseInt(gentime.substr(4, 2), 10) - 1;
    var DD = parseInt(gentime.substr(6, 2), 10);
    var hh = parseInt(gentime.substr(8, 2), 10);
    var mm = parseInt(gentime.substr(10, 2), 10);
    var ss = parseInt(gentime.substr(12, 2), 10);
    var fff = 0;
    var offset = 0;
    var isUTC = false;
    if (gentime.charAt(gentime.length - 1) === "Z") {
      isUTC = true;
    }
    var end = gentime.length - 5, c = gentime.charAt(end);
    if (c === "+" || c === "-") {
      var hhoffset = parseInt(gentime.substr(end + 1, 2), 10);
      var mmoffset = parseInt(gentime.substr(end + 4, 2), 10);
      offset = hhoffset * 60 + mmoffset;
      offset *= 60000;
      if (c === "+") {
        offset *= -1;
      }
      isUTC = true;
    }
    if (gentime.charAt(14) === ".") {
      fff = parseFloat(gentime.substr(14), 10) * 1000;
    }
    if (isUTC) {
      date.setUTCFullYear(YYYY, MM, DD);
      date.setUTCHours(hh, mm, ss, fff);
      date.setTime(+date + offset);
    } else {
      date.setFullYear(YYYY, MM, DD);
      date.setHours(hh, mm, ss, fff);
    }
    return date;
  };
  asn1.dateToUtcTime = function(date) {
    if (typeof date === "string") {
      return date;
    }
    var rval = "";
    var format = [];
    format.push(("" + date.getUTCFullYear()).substr(2));
    format.push("" + (date.getUTCMonth() + 1));
    format.push("" + date.getUTCDate());
    format.push("" + date.getUTCHours());
    format.push("" + date.getUTCMinutes());
    format.push("" + date.getUTCSeconds());
    for (var i = 0;i < format.length; ++i) {
      if (format[i].length < 2) {
        rval += "0";
      }
      rval += format[i];
    }
    rval += "Z";
    return rval;
  };
  asn1.dateToGeneralizedTime = function(date) {
    if (typeof date === "string") {
      return date;
    }
    var rval = "";
    var format = [];
    format.push("" + date.getUTCFullYear());
    format.push("" + (date.getUTCMonth() + 1));
    format.push("" + date.getUTCDate());
    format.push("" + date.getUTCHours());
    format.push("" + date.getUTCMinutes());
    format.push("" + date.getUTCSeconds());
    for (var i = 0;i < format.length; ++i) {
      if (format[i].length < 2) {
        rval += "0";
      }
      rval += format[i];
    }
    rval += "Z";
    return rval;
  };
  asn1.integerToDer = function(x) {
    var rval = forge.util.createBuffer();
    if (x >= -128 && x < 128) {
      return rval.putSignedInt(x, 8);
    }
    if (x >= -32768 && x < 32768) {
      return rval.putSignedInt(x, 16);
    }
    if (x >= -8388608 && x < 8388608) {
      return rval.putSignedInt(x, 24);
    }
    if (x >= -2147483648 && x < 2147483648) {
      return rval.putSignedInt(x, 32);
    }
    var error = new Error("Integer too large; max is 32-bits.");
    error.integer = x;
    throw error;
  };
  asn1.derToInteger = function(bytes) {
    if (typeof bytes === "string") {
      bytes = forge.util.createBuffer(bytes);
    }
    var n = bytes.length() * 8;
    if (n > 32) {
      throw new Error("Integer too large; max is 32-bits.");
    }
    return bytes.getSignedInt(n);
  };
  asn1.validate = function(obj, v, capture, errors2) {
    var rval = false;
    if ((obj.tagClass === v.tagClass || typeof v.tagClass === "undefined") && (obj.type === v.type || typeof v.type === "undefined")) {
      if (obj.constructed === v.constructed || typeof v.constructed === "undefined") {
        rval = true;
        if (v.value && forge.util.isArray(v.value)) {
          var j = 0;
          for (var i = 0;rval && i < v.value.length; ++i) {
            var schemaItem = v.value[i];
            rval = !!schemaItem.optional;
            var objChild = obj.value[j];
            if (!objChild) {
              if (!schemaItem.optional) {
                rval = false;
                if (errors2) {
                  errors2.push("[" + v.name + "] " + 'Missing required element. Expected tag class "' + schemaItem.tagClass + '", type "' + schemaItem.type + '"');
                }
              }
              continue;
            }
            var schemaHasTag = typeof schemaItem.tagClass !== "undefined" && typeof schemaItem.type !== "undefined";
            if (schemaHasTag && (objChild.tagClass !== schemaItem.tagClass || objChild.type !== schemaItem.type)) {
              if (schemaItem.optional) {
                rval = true;
                continue;
              } else {
                rval = false;
                if (errors2) {
                  errors2.push("[" + v.name + "] " + "Tag mismatch. Expected (" + schemaItem.tagClass + "," + schemaItem.type + "), got (" + objChild.tagClass + "," + objChild.type + ")");
                }
                break;
              }
            }
            var childRval = asn1.validate(objChild, schemaItem, capture, errors2);
            if (childRval) {
              ++j;
              rval = true;
            } else if (schemaItem.optional) {
              rval = true;
            } else {
              rval = false;
              break;
            }
          }
        }
        if (rval && capture) {
          if (v.capture) {
            capture[v.capture] = obj.value;
          }
          if (v.captureAsn1) {
            capture[v.captureAsn1] = obj;
          }
          if (v.captureBitStringContents && "bitStringContents" in obj) {
            capture[v.captureBitStringContents] = obj.bitStringContents;
          }
          if (v.captureBitStringValue && "bitStringContents" in obj) {
            var value;
            if (obj.bitStringContents.length < 2) {
              capture[v.captureBitStringValue] = "";
            } else {
              var unused = obj.bitStringContents.charCodeAt(0);
              if (unused !== 0) {
                throw new Error("captureBitStringValue only supported for zero unused bits");
              }
              capture[v.captureBitStringValue] = obj.bitStringContents.slice(1);
            }
          }
        }
      } else if (errors2) {
        errors2.push("[" + v.name + "] " + 'Expected constructed "' + v.constructed + '", got "' + obj.constructed + '"');
      }
    } else if (errors2) {
      if (obj.tagClass !== v.tagClass) {
        errors2.push("[" + v.name + "] " + 'Expected tag class "' + v.tagClass + '", got "' + obj.tagClass + '"');
      }
      if (obj.type !== v.type) {
        errors2.push("[" + v.name + "] " + 'Expected type "' + v.type + '", got "' + obj.type + '"');
      }
    }
    return rval;
  };
  var _nonLatinRegex = /[^\\u0000-\\u00ff]/;
  asn1.prettyPrint = function(obj, level, indentation) {
    var rval = "";
    level = level || 0;
    indentation = indentation || 2;
    if (level > 0) {
      rval += `
`;
    }
    var indent = "";
    for (var i = 0;i < level * indentation; ++i) {
      indent += " ";
    }
    rval += indent + "Tag: ";
    switch (obj.tagClass) {
      case asn1.Class.UNIVERSAL:
        rval += "Universal:";
        break;
      case asn1.Class.APPLICATION:
        rval += "Application:";
        break;
      case asn1.Class.CONTEXT_SPECIFIC:
        rval += "Context-Specific:";
        break;
      case asn1.Class.PRIVATE:
        rval += "Private:";
        break;
    }
    if (obj.tagClass === asn1.Class.UNIVERSAL) {
      rval += obj.type;
      switch (obj.type) {
        case asn1.Type.NONE:
          rval += " (None)";
          break;
        case asn1.Type.BOOLEAN:
          rval += " (Boolean)";
          break;
        case asn1.Type.INTEGER:
          rval += " (Integer)";
          break;
        case asn1.Type.BITSTRING:
          rval += " (Bit string)";
          break;
        case asn1.Type.OCTETSTRING:
          rval += " (Octet string)";
          break;
        case asn1.Type.NULL:
          rval += " (Null)";
          break;
        case asn1.Type.OID:
          rval += " (Object Identifier)";
          break;
        case asn1.Type.ODESC:
          rval += " (Object Descriptor)";
          break;
        case asn1.Type.EXTERNAL:
          rval += " (External or Instance of)";
          break;
        case asn1.Type.REAL:
          rval += " (Real)";
          break;
        case asn1.Type.ENUMERATED:
          rval += " (Enumerated)";
          break;
        case asn1.Type.EMBEDDED:
          rval += " (Embedded PDV)";
          break;
        case asn1.Type.UTF8:
          rval += " (UTF8)";
          break;
        case asn1.Type.ROID:
          rval += " (Relative Object Identifier)";
          break;
        case asn1.Type.SEQUENCE:
          rval += " (Sequence)";
          break;
        case asn1.Type.SET:
          rval += " (Set)";
          break;
        case asn1.Type.PRINTABLESTRING:
          rval += " (Printable String)";
          break;
        case asn1.Type.IA5String:
          rval += " (IA5String (ASCII))";
          break;
        case asn1.Type.UTCTIME:
          rval += " (UTC time)";
          break;
        case asn1.Type.GENERALIZEDTIME:
          rval += " (Generalized time)";
          break;
        case asn1.Type.BMPSTRING:
          rval += " (BMP String)";
          break;
      }
    } else {
      rval += obj.type;
    }
    rval += `
`;
    rval += indent + "Constructed: " + obj.constructed + `
`;
    if (obj.composed) {
      var subvalues = 0;
      var sub = "";
      for (var i = 0;i < obj.value.length; ++i) {
        if (obj.value[i] !== undefined) {
          subvalues += 1;
          sub += asn1.prettyPrint(obj.value[i], level + 1, indentation);
          if (i + 1 < obj.value.length) {
            sub += ",";
          }
        }
      }
      rval += indent + "Sub values: " + subvalues + sub;
    } else {
      rval += indent + "Value: ";
      if (obj.type === asn1.Type.OID) {
        var oid = asn1.derToOid(obj.value);
        rval += oid;
        if (forge.pki && forge.pki.oids) {
          if (oid in forge.pki.oids) {
            rval += " (" + forge.pki.oids[oid] + ") ";
          }
        }
      }
      if (obj.type === asn1.Type.INTEGER) {
        try {
          rval += asn1.derToInteger(obj.value);
        } catch (ex) {
          rval += "0x" + forge.util.bytesToHex(obj.value);
        }
      } else if (obj.type === asn1.Type.BITSTRING) {
        if (obj.value.length > 1) {
          rval += "0x" + forge.util.bytesToHex(obj.value.slice(1));
        } else {
          rval += "(none)";
        }
        if (obj.value.length > 0) {
          var unused = obj.value.charCodeAt(0);
          if (unused == 1) {
            rval += " (1 unused bit shown)";
          } else if (unused > 1) {
            rval += " (" + unused + " unused bits shown)";
          }
        }
      } else if (obj.type === asn1.Type.OCTETSTRING) {
        if (!_nonLatinRegex.test(obj.value)) {
          rval += "(" + obj.value + ") ";
        }
        rval += "0x" + forge.util.bytesToHex(obj.value);
      } else if (obj.type === asn1.Type.UTF8) {
        try {
          rval += forge.util.decodeUtf8(obj.value);
        } catch (e) {
          if (e.message === "URI malformed") {
            rval += "0x" + forge.util.bytesToHex(obj.value) + " (malformed UTF8)";
          } else {
            throw e;
          }
        }
      } else if (obj.type === asn1.Type.PRINTABLESTRING || obj.type === asn1.Type.IA5String) {
        rval += obj.value;
      } else if (_nonLatinRegex.test(obj.value)) {
        rval += "0x" + forge.util.bytesToHex(obj.value);
      } else if (obj.value.length === 0) {
        rval += "[null]";
      } else {
        rval += obj.value;
      }
    }
    return rval;
  };
});

// node_modules/node-forge/lib/md.js
var require_md = __commonJS((exports, module) => {
  var forge = require_forge();
  module.exports = forge.md = forge.md || {};
  forge.md.algorithms = forge.md.algorithms || {};
});

// node_modules/node-forge/lib/hmac.js
var require_hmac = __commonJS((exports, module) => {
  var forge = require_forge();
  require_md();
  require_util();
  var hmac = module.exports = forge.hmac = forge.hmac || {};
  hmac.create = function() {
    var _key = null;
    var _md = null;
    var _ipadding = null;
    var _opadding = null;
    var ctx = {};
    ctx.start = function(md, key) {
      if (md !== null) {
        if (typeof md === "string") {
          md = md.toLowerCase();
          if (md in forge.md.algorithms) {
            _md = forge.md.algorithms[md].create();
          } else {
            throw new Error('Unknown hash algorithm "' + md + '"');
          }
        } else {
          _md = md;
        }
      }
      if (key === null) {
        key = _key;
      } else {
        if (typeof key === "string") {
          key = forge.util.createBuffer(key);
        } else if (forge.util.isArray(key)) {
          var tmp = key;
          key = forge.util.createBuffer();
          for (var i = 0;i < tmp.length; ++i) {
            key.putByte(tmp[i]);
          }
        }
        var keylen = key.length();
        if (keylen > _md.blockLength) {
          _md.start();
          _md.update(key.bytes());
          key = _md.digest();
        }
        _ipadding = forge.util.createBuffer();
        _opadding = forge.util.createBuffer();
        keylen = key.length();
        for (var i = 0;i < keylen; ++i) {
          var tmp = key.at(i);
          _ipadding.putByte(54 ^ tmp);
          _opadding.putByte(92 ^ tmp);
        }
        if (keylen < _md.blockLength) {
          var tmp = _md.blockLength - keylen;
          for (var i = 0;i < tmp; ++i) {
            _ipadding.putByte(54);
            _opadding.putByte(92);
          }
        }
        _key = key;
        _ipadding = _ipadding.bytes();
        _opadding = _opadding.bytes();
      }
      _md.start();
      _md.update(_ipadding);
    };
    ctx.update = function(bytes) {
      _md.update(bytes);
    };
    ctx.getMac = function() {
      var inner = _md.digest().bytes();
      _md.start();
      _md.update(_opadding);
      _md.update(inner);
      return _md.digest();
    };
    ctx.digest = ctx.getMac;
    return ctx;
  };
});

// node_modules/node-forge/lib/md5.js
var require_md5 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_md();
  require_util();
  var md5 = module.exports = forge.md5 = forge.md5 || {};
  forge.md.md5 = forge.md.algorithms.md5 = md5;
  md5.create = function() {
    if (!_initialized) {
      _init();
    }
    var _state = null;
    var _input = forge.util.createBuffer();
    var _w = new Array(16);
    var md = {
      algorithm: "md5",
      blockLength: 64,
      digestLength: 16,
      messageLength: 0,
      fullMessageLength: null,
      messageLengthSize: 8
    };
    md.start = function() {
      md.messageLength = 0;
      md.fullMessageLength = md.messageLength64 = [];
      var int32s = md.messageLengthSize / 4;
      for (var i = 0;i < int32s; ++i) {
        md.fullMessageLength.push(0);
      }
      _input = forge.util.createBuffer();
      _state = {
        h0: 1732584193,
        h1: 4023233417,
        h2: 2562383102,
        h3: 271733878
      };
      return md;
    };
    md.start();
    md.update = function(msg, encoding) {
      if (encoding === "utf8") {
        msg = forge.util.encodeUtf8(msg);
      }
      var len = msg.length;
      md.messageLength += len;
      len = [len / 4294967296 >>> 0, len >>> 0];
      for (var i = md.fullMessageLength.length - 1;i >= 0; --i) {
        md.fullMessageLength[i] += len[1];
        len[1] = len[0] + (md.fullMessageLength[i] / 4294967296 >>> 0);
        md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
        len[0] = len[1] / 4294967296 >>> 0;
      }
      _input.putBytes(msg);
      _update(_state, _w, _input);
      if (_input.read > 2048 || _input.length() === 0) {
        _input.compact();
      }
      return md;
    };
    md.digest = function() {
      var finalBlock = forge.util.createBuffer();
      finalBlock.putBytes(_input.bytes());
      var remaining = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize;
      var overflow = remaining & md.blockLength - 1;
      finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
      var bits, carry = 0;
      for (var i = md.fullMessageLength.length - 1;i >= 0; --i) {
        bits = md.fullMessageLength[i] * 8 + carry;
        carry = bits / 4294967296 >>> 0;
        finalBlock.putInt32Le(bits >>> 0);
      }
      var s2 = {
        h0: _state.h0,
        h1: _state.h1,
        h2: _state.h2,
        h3: _state.h3
      };
      _update(s2, _w, finalBlock);
      var rval = forge.util.createBuffer();
      rval.putInt32Le(s2.h0);
      rval.putInt32Le(s2.h1);
      rval.putInt32Le(s2.h2);
      rval.putInt32Le(s2.h3);
      return rval;
    };
    return md;
  };
  var _padding = null;
  var _g = null;
  var _r = null;
  var _k = null;
  var _initialized = false;
  function _init() {
    _padding = String.fromCharCode(128);
    _padding += forge.util.fillString(String.fromCharCode(0), 64);
    _g = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      1,
      6,
      11,
      0,
      5,
      10,
      15,
      4,
      9,
      14,
      3,
      8,
      13,
      2,
      7,
      12,
      5,
      8,
      11,
      14,
      1,
      4,
      7,
      10,
      13,
      0,
      3,
      6,
      9,
      12,
      15,
      2,
      0,
      7,
      14,
      5,
      12,
      3,
      10,
      1,
      8,
      15,
      6,
      13,
      4,
      11,
      2,
      9
    ];
    _r = [
      7,
      12,
      17,
      22,
      7,
      12,
      17,
      22,
      7,
      12,
      17,
      22,
      7,
      12,
      17,
      22,
      5,
      9,
      14,
      20,
      5,
      9,
      14,
      20,
      5,
      9,
      14,
      20,
      5,
      9,
      14,
      20,
      4,
      11,
      16,
      23,
      4,
      11,
      16,
      23,
      4,
      11,
      16,
      23,
      4,
      11,
      16,
      23,
      6,
      10,
      15,
      21,
      6,
      10,
      15,
      21,
      6,
      10,
      15,
      21,
      6,
      10,
      15,
      21
    ];
    _k = new Array(64);
    for (var i = 0;i < 64; ++i) {
      _k[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296);
    }
    _initialized = true;
  }
  function _update(s, w, bytes) {
    var t, a, b, c, d, f, r, i;
    var len = bytes.length();
    while (len >= 64) {
      a = s.h0;
      b = s.h1;
      c = s.h2;
      d = s.h3;
      for (i = 0;i < 16; ++i) {
        w[i] = bytes.getInt32Le();
        f = d ^ b & (c ^ d);
        t = a + f + _k[i] + w[i];
        r = _r[i];
        a = d;
        d = c;
        c = b;
        b += t << r | t >>> 32 - r;
      }
      for (;i < 32; ++i) {
        f = c ^ d & (b ^ c);
        t = a + f + _k[i] + w[_g[i]];
        r = _r[i];
        a = d;
        d = c;
        c = b;
        b += t << r | t >>> 32 - r;
      }
      for (;i < 48; ++i) {
        f = b ^ c ^ d;
        t = a + f + _k[i] + w[_g[i]];
        r = _r[i];
        a = d;
        d = c;
        c = b;
        b += t << r | t >>> 32 - r;
      }
      for (;i < 64; ++i) {
        f = c ^ (b | ~d);
        t = a + f + _k[i] + w[_g[i]];
        r = _r[i];
        a = d;
        d = c;
        c = b;
        b += t << r | t >>> 32 - r;
      }
      s.h0 = s.h0 + a | 0;
      s.h1 = s.h1 + b | 0;
      s.h2 = s.h2 + c | 0;
      s.h3 = s.h3 + d | 0;
      len -= 64;
    }
  }
});

// node_modules/node-forge/lib/pem.js
var require_pem = __commonJS((exports, module) => {
  var forge = require_forge();
  require_util();
  var pem = module.exports = forge.pem = forge.pem || {};
  pem.encode = function(msg, options) {
    options = options || {};
    var rval = "-----BEGIN " + msg.type + `-----\r
`;
    var header;
    if (msg.procType) {
      header = {
        name: "Proc-Type",
        values: [String(msg.procType.version), msg.procType.type]
      };
      rval += foldHeader(header);
    }
    if (msg.contentDomain) {
      header = { name: "Content-Domain", values: [msg.contentDomain] };
      rval += foldHeader(header);
    }
    if (msg.dekInfo) {
      header = { name: "DEK-Info", values: [msg.dekInfo.algorithm] };
      if (msg.dekInfo.parameters) {
        header.values.push(msg.dekInfo.parameters);
      }
      rval += foldHeader(header);
    }
    if (msg.headers) {
      for (var i = 0;i < msg.headers.length; ++i) {
        rval += foldHeader(msg.headers[i]);
      }
    }
    if (msg.procType) {
      rval += `\r
`;
    }
    rval += forge.util.encode64(msg.body, options.maxline || 64) + `\r
`;
    rval += "-----END " + msg.type + `-----\r
`;
    return rval;
  };
  pem.decode = function(str) {
    var rval = [];
    var rMessage = /\s*-----BEGIN ([A-Z0-9- ]+)-----\r?\n?([\x21-\x7e\s]+?(?:\r?\n\r?\n))?([:A-Za-z0-9+\/=\s]+?)-----END \1-----/g;
    var rHeader = /([\x21-\x7e]+):\s*([\x21-\x7e\s^:]+)/;
    var rCRLF = /\r?\n/;
    var match2;
    while (true) {
      match2 = rMessage.exec(str);
      if (!match2) {
        break;
      }
      var type = match2[1];
      if (type === "NEW CERTIFICATE REQUEST") {
        type = "CERTIFICATE REQUEST";
      }
      var msg = {
        type,
        procType: null,
        contentDomain: null,
        dekInfo: null,
        headers: [],
        body: forge.util.decode64(match2[3])
      };
      rval.push(msg);
      if (!match2[2]) {
        continue;
      }
      var lines = match2[2].split(rCRLF);
      var li = 0;
      while (match2 && li < lines.length) {
        var line = lines[li].replace(/\s+$/, "");
        for (var nl = li + 1;nl < lines.length; ++nl) {
          var next = lines[nl];
          if (!/\s/.test(next[0])) {
            break;
          }
          line += next;
          li = nl;
        }
        match2 = line.match(rHeader);
        if (match2) {
          var header = { name: match2[1], values: [] };
          var values = match2[2].split(",");
          for (var vi = 0;vi < values.length; ++vi) {
            header.values.push(ltrim(values[vi]));
          }
          if (!msg.procType) {
            if (header.name !== "Proc-Type") {
              throw new Error("Invalid PEM formatted message. The first " + 'encapsulated header must be "Proc-Type".');
            } else if (header.values.length !== 2) {
              throw new Error('Invalid PEM formatted message. The "Proc-Type" ' + "header must have two subfields.");
            }
            msg.procType = { version: values[0], type: values[1] };
          } else if (!msg.contentDomain && header.name === "Content-Domain") {
            msg.contentDomain = values[0] || "";
          } else if (!msg.dekInfo && header.name === "DEK-Info") {
            if (header.values.length === 0) {
              throw new Error('Invalid PEM formatted message. The "DEK-Info" ' + "header must have at least one subfield.");
            }
            msg.dekInfo = { algorithm: values[0], parameters: values[1] || null };
          } else {
            msg.headers.push(header);
          }
        }
        ++li;
      }
      if (msg.procType === "ENCRYPTED" && !msg.dekInfo) {
        throw new Error('Invalid PEM formatted message. The "DEK-Info" ' + 'header must be present if "Proc-Type" is "ENCRYPTED".');
      }
    }
    if (rval.length === 0) {
      throw new Error("Invalid PEM formatted message.");
    }
    return rval;
  };
  function foldHeader(header) {
    var rval = header.name + ": ";
    var values = [];
    var insertSpace = function(match2, $1) {
      return " " + $1;
    };
    for (var i = 0;i < header.values.length; ++i) {
      values.push(header.values[i].replace(/^(\S+\r\n)/, insertSpace));
    }
    rval += values.join(",") + `\r
`;
    var length = 0;
    var candidate = -1;
    for (var i = 0;i < rval.length; ++i, ++length) {
      if (length > 65 && candidate !== -1) {
        var insert = rval[candidate];
        if (insert === ",") {
          ++candidate;
          rval = rval.substr(0, candidate) + `\r
 ` + rval.substr(candidate);
        } else {
          rval = rval.substr(0, candidate) + `\r
` + insert + rval.substr(candidate + 1);
        }
        length = i - candidate - 1;
        candidate = -1;
        ++i;
      } else if (rval[i] === " " || rval[i] === "\t" || rval[i] === ",") {
        candidate = i;
      }
    }
    return rval;
  }
  function ltrim(str) {
    return str.replace(/^\s+/, "");
  }
});

// node_modules/node-forge/lib/des.js
var require_des = __commonJS((exports, module) => {
  var forge = require_forge();
  require_cipher();
  require_cipherModes();
  require_util();
  module.exports = forge.des = forge.des || {};
  forge.des.startEncrypting = function(key, iv, output, mode) {
    var cipher = _createCipher({
      key,
      output,
      decrypt: false,
      mode: mode || (iv === null ? "ECB" : "CBC")
    });
    cipher.start(iv);
    return cipher;
  };
  forge.des.createEncryptionCipher = function(key, mode) {
    return _createCipher({
      key,
      output: null,
      decrypt: false,
      mode
    });
  };
  forge.des.startDecrypting = function(key, iv, output, mode) {
    var cipher = _createCipher({
      key,
      output,
      decrypt: true,
      mode: mode || (iv === null ? "ECB" : "CBC")
    });
    cipher.start(iv);
    return cipher;
  };
  forge.des.createDecryptionCipher = function(key, mode) {
    return _createCipher({
      key,
      output: null,
      decrypt: true,
      mode
    });
  };
  forge.des.Algorithm = function(name, mode) {
    var self2 = this;
    self2.name = name;
    self2.mode = new mode({
      blockSize: 8,
      cipher: {
        encrypt: function(inBlock, outBlock) {
          return _updateBlock(self2._keys, inBlock, outBlock, false);
        },
        decrypt: function(inBlock, outBlock) {
          return _updateBlock(self2._keys, inBlock, outBlock, true);
        }
      }
    });
    self2._init = false;
  };
  forge.des.Algorithm.prototype.initialize = function(options) {
    if (this._init) {
      return;
    }
    var key = forge.util.createBuffer(options.key);
    if (this.name.indexOf("3DES") === 0) {
      if (key.length() !== 24) {
        throw new Error("Invalid Triple-DES key size: " + key.length() * 8);
      }
    }
    this._keys = _createKeys(key);
    this._init = true;
  };
  registerAlgorithm("DES-ECB", forge.cipher.modes.ecb);
  registerAlgorithm("DES-CBC", forge.cipher.modes.cbc);
  registerAlgorithm("DES-CFB", forge.cipher.modes.cfb);
  registerAlgorithm("DES-OFB", forge.cipher.modes.ofb);
  registerAlgorithm("DES-CTR", forge.cipher.modes.ctr);
  registerAlgorithm("3DES-ECB", forge.cipher.modes.ecb);
  registerAlgorithm("3DES-CBC", forge.cipher.modes.cbc);
  registerAlgorithm("3DES-CFB", forge.cipher.modes.cfb);
  registerAlgorithm("3DES-OFB", forge.cipher.modes.ofb);
  registerAlgorithm("3DES-CTR", forge.cipher.modes.ctr);
  function registerAlgorithm(name, mode) {
    var factory = function() {
      return new forge.des.Algorithm(name, mode);
    };
    forge.cipher.registerAlgorithm(name, factory);
  }
  var spfunction1 = [16843776, 0, 65536, 16843780, 16842756, 66564, 4, 65536, 1024, 16843776, 16843780, 1024, 16778244, 16842756, 16777216, 4, 1028, 16778240, 16778240, 66560, 66560, 16842752, 16842752, 16778244, 65540, 16777220, 16777220, 65540, 0, 1028, 66564, 16777216, 65536, 16843780, 4, 16842752, 16843776, 16777216, 16777216, 1024, 16842756, 65536, 66560, 16777220, 1024, 4, 16778244, 66564, 16843780, 65540, 16842752, 16778244, 16777220, 1028, 66564, 16843776, 1028, 16778240, 16778240, 0, 65540, 66560, 0, 16842756];
  var spfunction2 = [-2146402272, -2147450880, 32768, 1081376, 1048576, 32, -2146435040, -2147450848, -2147483616, -2146402272, -2146402304, -2147483648, -2147450880, 1048576, 32, -2146435040, 1081344, 1048608, -2147450848, 0, -2147483648, 32768, 1081376, -2146435072, 1048608, -2147483616, 0, 1081344, 32800, -2146402304, -2146435072, 32800, 0, 1081376, -2146435040, 1048576, -2147450848, -2146435072, -2146402304, 32768, -2146435072, -2147450880, 32, -2146402272, 1081376, 32, 32768, -2147483648, 32800, -2146402304, 1048576, -2147483616, 1048608, -2147450848, -2147483616, 1048608, 1081344, 0, -2147450880, 32800, -2147483648, -2146435040, -2146402272, 1081344];
  var spfunction3 = [520, 134349312, 0, 134348808, 134218240, 0, 131592, 134218240, 131080, 134217736, 134217736, 131072, 134349320, 131080, 134348800, 520, 134217728, 8, 134349312, 512, 131584, 134348800, 134348808, 131592, 134218248, 131584, 131072, 134218248, 8, 134349320, 512, 134217728, 134349312, 134217728, 131080, 520, 131072, 134349312, 134218240, 0, 512, 131080, 134349320, 134218240, 134217736, 512, 0, 134348808, 134218248, 131072, 134217728, 134349320, 8, 131592, 131584, 134217736, 134348800, 134218248, 520, 134348800, 131592, 8, 134348808, 131584];
  var spfunction4 = [8396801, 8321, 8321, 128, 8396928, 8388737, 8388609, 8193, 0, 8396800, 8396800, 8396929, 129, 0, 8388736, 8388609, 1, 8192, 8388608, 8396801, 128, 8388608, 8193, 8320, 8388737, 1, 8320, 8388736, 8192, 8396928, 8396929, 129, 8388736, 8388609, 8396800, 8396929, 129, 0, 0, 8396800, 8320, 8388736, 8388737, 1, 8396801, 8321, 8321, 128, 8396929, 129, 1, 8192, 8388609, 8193, 8396928, 8388737, 8193, 8320, 8388608, 8396801, 128, 8388608, 8192, 8396928];
  var spfunction5 = [256, 34078976, 34078720, 1107296512, 524288, 256, 1073741824, 34078720, 1074266368, 524288, 33554688, 1074266368, 1107296512, 1107820544, 524544, 1073741824, 33554432, 1074266112, 1074266112, 0, 1073742080, 1107820800, 1107820800, 33554688, 1107820544, 1073742080, 0, 1107296256, 34078976, 33554432, 1107296256, 524544, 524288, 1107296512, 256, 33554432, 1073741824, 34078720, 1107296512, 1074266368, 33554688, 1073741824, 1107820544, 34078976, 1074266368, 256, 33554432, 1107820544, 1107820800, 524544, 1107296256, 1107820800, 34078720, 0, 1074266112, 1107296256, 524544, 33554688, 1073742080, 524288, 0, 1074266112, 34078976, 1073742080];
  var spfunction6 = [536870928, 541065216, 16384, 541081616, 541065216, 16, 541081616, 4194304, 536887296, 4210704, 4194304, 536870928, 4194320, 536887296, 536870912, 16400, 0, 4194320, 536887312, 16384, 4210688, 536887312, 16, 541065232, 541065232, 0, 4210704, 541081600, 16400, 4210688, 541081600, 536870912, 536887296, 16, 541065232, 4210688, 541081616, 4194304, 16400, 536870928, 4194304, 536887296, 536870912, 16400, 536870928, 541081616, 4210688, 541065216, 4210704, 541081600, 0, 541065232, 16, 16384, 541065216, 4210704, 16384, 4194320, 536887312, 0, 541081600, 536870912, 4194320, 536887312];
  var spfunction7 = [2097152, 69206018, 67110914, 0, 2048, 67110914, 2099202, 69208064, 69208066, 2097152, 0, 67108866, 2, 67108864, 69206018, 2050, 67110912, 2099202, 2097154, 67110912, 67108866, 69206016, 69208064, 2097154, 69206016, 2048, 2050, 69208066, 2099200, 2, 67108864, 2099200, 67108864, 2099200, 2097152, 67110914, 67110914, 69206018, 69206018, 2, 2097154, 67108864, 67110912, 2097152, 69208064, 2050, 2099202, 69208064, 2050, 67108866, 69208066, 69206016, 2099200, 0, 2, 69208066, 0, 2099202, 69206016, 2048, 67108866, 67110912, 2048, 2097154];
  var spfunction8 = [268439616, 4096, 262144, 268701760, 268435456, 268439616, 64, 268435456, 262208, 268697600, 268701760, 266240, 268701696, 266304, 4096, 64, 268697600, 268435520, 268439552, 4160, 266240, 262208, 268697664, 268701696, 4160, 0, 0, 268697664, 268435520, 268439552, 266304, 262144, 266304, 262144, 268701696, 4096, 64, 268697664, 4096, 266304, 268439552, 64, 268435520, 268697600, 268697664, 268435456, 262144, 268439616, 0, 268701760, 262208, 268435520, 268697600, 268439552, 268439616, 0, 268701760, 266240, 266240, 4160, 4160, 262208, 268435456, 268701696];
  function _createKeys(key) {
    var pc2bytes0 = [0, 4, 536870912, 536870916, 65536, 65540, 536936448, 536936452, 512, 516, 536871424, 536871428, 66048, 66052, 536936960, 536936964], pc2bytes1 = [0, 1, 1048576, 1048577, 67108864, 67108865, 68157440, 68157441, 256, 257, 1048832, 1048833, 67109120, 67109121, 68157696, 68157697], pc2bytes2 = [0, 8, 2048, 2056, 16777216, 16777224, 16779264, 16779272, 0, 8, 2048, 2056, 16777216, 16777224, 16779264, 16779272], pc2bytes3 = [0, 2097152, 134217728, 136314880, 8192, 2105344, 134225920, 136323072, 131072, 2228224, 134348800, 136445952, 139264, 2236416, 134356992, 136454144], pc2bytes4 = [0, 262144, 16, 262160, 0, 262144, 16, 262160, 4096, 266240, 4112, 266256, 4096, 266240, 4112, 266256], pc2bytes5 = [0, 1024, 32, 1056, 0, 1024, 32, 1056, 33554432, 33555456, 33554464, 33555488, 33554432, 33555456, 33554464, 33555488], pc2bytes6 = [0, 268435456, 524288, 268959744, 2, 268435458, 524290, 268959746, 0, 268435456, 524288, 268959744, 2, 268435458, 524290, 268959746], pc2bytes7 = [0, 65536, 2048, 67584, 536870912, 536936448, 536872960, 536938496, 131072, 196608, 133120, 198656, 537001984, 537067520, 537004032, 537069568], pc2bytes8 = [0, 262144, 0, 262144, 2, 262146, 2, 262146, 33554432, 33816576, 33554432, 33816576, 33554434, 33816578, 33554434, 33816578], pc2bytes9 = [0, 268435456, 8, 268435464, 0, 268435456, 8, 268435464, 1024, 268436480, 1032, 268436488, 1024, 268436480, 1032, 268436488], pc2bytes10 = [0, 32, 0, 32, 1048576, 1048608, 1048576, 1048608, 8192, 8224, 8192, 8224, 1056768, 1056800, 1056768, 1056800], pc2bytes11 = [0, 16777216, 512, 16777728, 2097152, 18874368, 2097664, 18874880, 67108864, 83886080, 67109376, 83886592, 69206016, 85983232, 69206528, 85983744], pc2bytes12 = [0, 4096, 134217728, 134221824, 524288, 528384, 134742016, 134746112, 16, 4112, 134217744, 134221840, 524304, 528400, 134742032, 134746128], pc2bytes13 = [0, 4, 256, 260, 0, 4, 256, 260, 1, 5, 257, 261, 1, 5, 257, 261];
    var iterations = key.length() > 8 ? 3 : 1;
    var keys = [];
    var shifts = [0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0];
    var n = 0, tmp;
    for (var j = 0;j < iterations; j++) {
      var left = key.getInt32();
      var right = key.getInt32();
      tmp = (left >>> 4 ^ right) & 252645135;
      right ^= tmp;
      left ^= tmp << 4;
      tmp = (right >>> -16 ^ left) & 65535;
      left ^= tmp;
      right ^= tmp << -16;
      tmp = (left >>> 2 ^ right) & 858993459;
      right ^= tmp;
      left ^= tmp << 2;
      tmp = (right >>> -16 ^ left) & 65535;
      left ^= tmp;
      right ^= tmp << -16;
      tmp = (left >>> 1 ^ right) & 1431655765;
      right ^= tmp;
      left ^= tmp << 1;
      tmp = (right >>> 8 ^ left) & 16711935;
      left ^= tmp;
      right ^= tmp << 8;
      tmp = (left >>> 1 ^ right) & 1431655765;
      right ^= tmp;
      left ^= tmp << 1;
      tmp = left << 8 | right >>> 20 & 240;
      left = right << 24 | right << 8 & 16711680 | right >>> 8 & 65280 | right >>> 24 & 240;
      right = tmp;
      for (var i = 0;i < shifts.length; ++i) {
        if (shifts[i]) {
          left = left << 2 | left >>> 26;
          right = right << 2 | right >>> 26;
        } else {
          left = left << 1 | left >>> 27;
          right = right << 1 | right >>> 27;
        }
        left &= -15;
        right &= -15;
        var lefttmp = pc2bytes0[left >>> 28] | pc2bytes1[left >>> 24 & 15] | pc2bytes2[left >>> 20 & 15] | pc2bytes3[left >>> 16 & 15] | pc2bytes4[left >>> 12 & 15] | pc2bytes5[left >>> 8 & 15] | pc2bytes6[left >>> 4 & 15];
        var righttmp = pc2bytes7[right >>> 28] | pc2bytes8[right >>> 24 & 15] | pc2bytes9[right >>> 20 & 15] | pc2bytes10[right >>> 16 & 15] | pc2bytes11[right >>> 12 & 15] | pc2bytes12[right >>> 8 & 15] | pc2bytes13[right >>> 4 & 15];
        tmp = (righttmp >>> 16 ^ lefttmp) & 65535;
        keys[n++] = lefttmp ^ tmp;
        keys[n++] = righttmp ^ tmp << 16;
      }
    }
    return keys;
  }
  function _updateBlock(keys, input2, output, decrypt) {
    var iterations = keys.length === 32 ? 3 : 9;
    var looping;
    if (iterations === 3) {
      looping = decrypt ? [30, -2, -2] : [0, 32, 2];
    } else {
      looping = decrypt ? [94, 62, -2, 32, 64, 2, 30, -2, -2] : [0, 32, 2, 62, 30, -2, 64, 96, 2];
    }
    var tmp;
    var left = input2[0];
    var right = input2[1];
    tmp = (left >>> 4 ^ right) & 252645135;
    right ^= tmp;
    left ^= tmp << 4;
    tmp = (left >>> 16 ^ right) & 65535;
    right ^= tmp;
    left ^= tmp << 16;
    tmp = (right >>> 2 ^ left) & 858993459;
    left ^= tmp;
    right ^= tmp << 2;
    tmp = (right >>> 8 ^ left) & 16711935;
    left ^= tmp;
    right ^= tmp << 8;
    tmp = (left >>> 1 ^ right) & 1431655765;
    right ^= tmp;
    left ^= tmp << 1;
    left = left << 1 | left >>> 31;
    right = right << 1 | right >>> 31;
    for (var j = 0;j < iterations; j += 3) {
      var endloop = looping[j + 1];
      var loopinc = looping[j + 2];
      for (var i = looping[j];i != endloop; i += loopinc) {
        var right1 = right ^ keys[i];
        var right2 = (right >>> 4 | right << 28) ^ keys[i + 1];
        tmp = left;
        left = right;
        right = tmp ^ (spfunction2[right1 >>> 24 & 63] | spfunction4[right1 >>> 16 & 63] | spfunction6[right1 >>> 8 & 63] | spfunction8[right1 & 63] | spfunction1[right2 >>> 24 & 63] | spfunction3[right2 >>> 16 & 63] | spfunction5[right2 >>> 8 & 63] | spfunction7[right2 & 63]);
      }
      tmp = left;
      left = right;
      right = tmp;
    }
    left = left >>> 1 | left << 31;
    right = right >>> 1 | right << 31;
    tmp = (left >>> 1 ^ right) & 1431655765;
    right ^= tmp;
    left ^= tmp << 1;
    tmp = (right >>> 8 ^ left) & 16711935;
    left ^= tmp;
    right ^= tmp << 8;
    tmp = (right >>> 2 ^ left) & 858993459;
    left ^= tmp;
    right ^= tmp << 2;
    tmp = (left >>> 16 ^ right) & 65535;
    right ^= tmp;
    left ^= tmp << 16;
    tmp = (left >>> 4 ^ right) & 252645135;
    right ^= tmp;
    left ^= tmp << 4;
    output[0] = left;
    output[1] = right;
  }
  function _createCipher(options) {
    options = options || {};
    var mode = (options.mode || "CBC").toUpperCase();
    var algorithm = "DES-" + mode;
    var cipher;
    if (options.decrypt) {
      cipher = forge.cipher.createDecipher(algorithm, options.key);
    } else {
      cipher = forge.cipher.createCipher(algorithm, options.key);
    }
    var start = cipher.start;
    cipher.start = function(iv, options2) {
      var output = null;
      if (options2 instanceof forge.util.ByteBuffer) {
        output = options2;
        options2 = {};
      }
      options2 = options2 || {};
      options2.output = output;
      options2.iv = iv;
      start.call(cipher, options2);
    };
    return cipher;
  }
});

// node_modules/node-forge/lib/pbkdf2.js
var require_pbkdf2 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_hmac();
  require_md();
  require_util();
  var pkcs5 = forge.pkcs5 = forge.pkcs5 || {};
  var crypto2;
  if (forge.util.isNodejs && !forge.options.usePureJavaScript) {
    crypto2 = __require("crypto");
  }
  module.exports = forge.pbkdf2 = pkcs5.pbkdf2 = function(p, s, c, dkLen, md, callback) {
    if (typeof md === "function") {
      callback = md;
      md = null;
    }
    if (forge.util.isNodejs && !forge.options.usePureJavaScript && crypto2.pbkdf2 && (md === null || typeof md !== "object") && (crypto2.pbkdf2Sync.length > 4 || (!md || md === "sha1"))) {
      if (typeof md !== "string") {
        md = "sha1";
      }
      p = Buffer.from(p, "binary");
      s = Buffer.from(s, "binary");
      if (!callback) {
        if (crypto2.pbkdf2Sync.length === 4) {
          return crypto2.pbkdf2Sync(p, s, c, dkLen).toString("binary");
        }
        return crypto2.pbkdf2Sync(p, s, c, dkLen, md).toString("binary");
      }
      if (crypto2.pbkdf2Sync.length === 4) {
        return crypto2.pbkdf2(p, s, c, dkLen, function(err2, key) {
          if (err2) {
            return callback(err2);
          }
          callback(null, key.toString("binary"));
        });
      }
      return crypto2.pbkdf2(p, s, c, dkLen, md, function(err2, key) {
        if (err2) {
          return callback(err2);
        }
        callback(null, key.toString("binary"));
      });
    }
    if (typeof md === "undefined" || md === null) {
      md = "sha1";
    }
    if (typeof md === "string") {
      if (!(md in forge.md.algorithms)) {
        throw new Error("Unknown hash algorithm: " + md);
      }
      md = forge.md[md].create();
    }
    var hLen = md.digestLength;
    if (dkLen > 4294967295 * hLen) {
      var err = new Error("Derived key is too long.");
      if (callback) {
        return callback(err);
      }
      throw err;
    }
    var len = Math.ceil(dkLen / hLen);
    var r = dkLen - (len - 1) * hLen;
    var prf = forge.hmac.create();
    prf.start(md, p);
    var dk = "";
    var xor, u_c, u_c1;
    if (!callback) {
      for (var i = 1;i <= len; ++i) {
        prf.start(null, null);
        prf.update(s);
        prf.update(forge.util.int32ToBytes(i));
        xor = u_c1 = prf.digest().getBytes();
        for (var j = 2;j <= c; ++j) {
          prf.start(null, null);
          prf.update(u_c1);
          u_c = prf.digest().getBytes();
          xor = forge.util.xorBytes(xor, u_c, hLen);
          u_c1 = u_c;
        }
        dk += i < len ? xor : xor.substr(0, r);
      }
      return dk;
    }
    var i = 1, j;
    function outer() {
      if (i > len) {
        return callback(null, dk);
      }
      prf.start(null, null);
      prf.update(s);
      prf.update(forge.util.int32ToBytes(i));
      xor = u_c1 = prf.digest().getBytes();
      j = 2;
      inner();
    }
    function inner() {
      if (j <= c) {
        prf.start(null, null);
        prf.update(u_c1);
        u_c = prf.digest().getBytes();
        xor = forge.util.xorBytes(xor, u_c, hLen);
        u_c1 = u_c;
        ++j;
        return forge.util.setImmediate(inner);
      }
      dk += i < len ? xor : xor.substr(0, r);
      ++i;
      outer();
    }
    outer();
  };
});

// node_modules/node-forge/lib/sha256.js
var require_sha256 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_md();
  require_util();
  var sha2562 = module.exports = forge.sha256 = forge.sha256 || {};
  forge.md.sha256 = forge.md.algorithms.sha256 = sha2562;
  sha2562.create = function() {
    if (!_initialized) {
      _init();
    }
    var _state = null;
    var _input = forge.util.createBuffer();
    var _w = new Array(64);
    var md = {
      algorithm: "sha256",
      blockLength: 64,
      digestLength: 32,
      messageLength: 0,
      fullMessageLength: null,
      messageLengthSize: 8
    };
    md.start = function() {
      md.messageLength = 0;
      md.fullMessageLength = md.messageLength64 = [];
      var int32s = md.messageLengthSize / 4;
      for (var i = 0;i < int32s; ++i) {
        md.fullMessageLength.push(0);
      }
      _input = forge.util.createBuffer();
      _state = {
        h0: 1779033703,
        h1: 3144134277,
        h2: 1013904242,
        h3: 2773480762,
        h4: 1359893119,
        h5: 2600822924,
        h6: 528734635,
        h7: 1541459225
      };
      return md;
    };
    md.start();
    md.update = function(msg, encoding) {
      if (encoding === "utf8") {
        msg = forge.util.encodeUtf8(msg);
      }
      var len = msg.length;
      md.messageLength += len;
      len = [len / 4294967296 >>> 0, len >>> 0];
      for (var i = md.fullMessageLength.length - 1;i >= 0; --i) {
        md.fullMessageLength[i] += len[1];
        len[1] = len[0] + (md.fullMessageLength[i] / 4294967296 >>> 0);
        md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
        len[0] = len[1] / 4294967296 >>> 0;
      }
      _input.putBytes(msg);
      _update(_state, _w, _input);
      if (_input.read > 2048 || _input.length() === 0) {
        _input.compact();
      }
      return md;
    };
    md.digest = function() {
      var finalBlock = forge.util.createBuffer();
      finalBlock.putBytes(_input.bytes());
      var remaining = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize;
      var overflow = remaining & md.blockLength - 1;
      finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
      var next, carry;
      var bits = md.fullMessageLength[0] * 8;
      for (var i = 0;i < md.fullMessageLength.length - 1; ++i) {
        next = md.fullMessageLength[i + 1] * 8;
        carry = next / 4294967296 >>> 0;
        bits += carry;
        finalBlock.putInt32(bits >>> 0);
        bits = next >>> 0;
      }
      finalBlock.putInt32(bits);
      var s2 = {
        h0: _state.h0,
        h1: _state.h1,
        h2: _state.h2,
        h3: _state.h3,
        h4: _state.h4,
        h5: _state.h5,
        h6: _state.h6,
        h7: _state.h7
      };
      _update(s2, _w, finalBlock);
      var rval = forge.util.createBuffer();
      rval.putInt32(s2.h0);
      rval.putInt32(s2.h1);
      rval.putInt32(s2.h2);
      rval.putInt32(s2.h3);
      rval.putInt32(s2.h4);
      rval.putInt32(s2.h5);
      rval.putInt32(s2.h6);
      rval.putInt32(s2.h7);
      return rval;
    };
    return md;
  };
  var _padding = null;
  var _initialized = false;
  var _k = null;
  function _init() {
    _padding = String.fromCharCode(128);
    _padding += forge.util.fillString(String.fromCharCode(0), 64);
    _k = [
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ];
    _initialized = true;
  }
  function _update(s, w, bytes) {
    var t1, t2, s0, s1, ch, maj, i, a, b, c, d, e, f, g, h;
    var len = bytes.length();
    while (len >= 64) {
      for (i = 0;i < 16; ++i) {
        w[i] = bytes.getInt32();
      }
      for (;i < 64; ++i) {
        t1 = w[i - 2];
        t1 = (t1 >>> 17 | t1 << 15) ^ (t1 >>> 19 | t1 << 13) ^ t1 >>> 10;
        t2 = w[i - 15];
        t2 = (t2 >>> 7 | t2 << 25) ^ (t2 >>> 18 | t2 << 14) ^ t2 >>> 3;
        w[i] = t1 + w[i - 7] + t2 + w[i - 16] | 0;
      }
      a = s.h0;
      b = s.h1;
      c = s.h2;
      d = s.h3;
      e = s.h4;
      f = s.h5;
      g = s.h6;
      h = s.h7;
      for (i = 0;i < 64; ++i) {
        s1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
        ch = g ^ e & (f ^ g);
        s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
        maj = a & b | c & (a ^ b);
        t1 = h + s1 + ch + _k[i] + w[i];
        t2 = s0 + maj;
        h = g;
        g = f;
        f = e;
        e = d + t1 >>> 0;
        d = c;
        c = b;
        b = a;
        a = t1 + t2 >>> 0;
      }
      s.h0 = s.h0 + a | 0;
      s.h1 = s.h1 + b | 0;
      s.h2 = s.h2 + c | 0;
      s.h3 = s.h3 + d | 0;
      s.h4 = s.h4 + e | 0;
      s.h5 = s.h5 + f | 0;
      s.h6 = s.h6 + g | 0;
      s.h7 = s.h7 + h | 0;
      len -= 64;
    }
  }
});

// node_modules/node-forge/lib/prng.js
var require_prng = __commonJS((exports, module) => {
  var forge = require_forge();
  require_util();
  var _crypto = null;
  if (forge.util.isNodejs && !forge.options.usePureJavaScript && !process.versions["node-webkit"]) {
    _crypto = __require("crypto");
  }
  var prng = module.exports = forge.prng = forge.prng || {};
  prng.create = function(plugin) {
    var ctx = {
      plugin,
      key: null,
      seed: null,
      time: null,
      reseeds: 0,
      generated: 0,
      keyBytes: ""
    };
    var md = plugin.md;
    var pools = new Array(32);
    for (var i = 0;i < 32; ++i) {
      pools[i] = md.create();
    }
    ctx.pools = pools;
    ctx.pool = 0;
    ctx.generate = function(count, callback) {
      if (!callback) {
        return ctx.generateSync(count);
      }
      var cipher = ctx.plugin.cipher;
      var increment = ctx.plugin.increment;
      var formatKey = ctx.plugin.formatKey;
      var formatSeed = ctx.plugin.formatSeed;
      var b = forge.util.createBuffer();
      ctx.key = null;
      generate();
      function generate(err) {
        if (err) {
          return callback(err);
        }
        if (b.length() >= count) {
          return callback(null, b.getBytes(count));
        }
        if (ctx.generated > 1048575) {
          ctx.key = null;
        }
        if (ctx.key === null) {
          return forge.util.nextTick(function() {
            _reseed(generate);
          });
        }
        var bytes = cipher(ctx.key, ctx.seed);
        ctx.generated += bytes.length;
        b.putBytes(bytes);
        ctx.key = formatKey(cipher(ctx.key, increment(ctx.seed)));
        ctx.seed = formatSeed(cipher(ctx.key, ctx.seed));
        forge.util.setImmediate(generate);
      }
    };
    ctx.generateSync = function(count) {
      var cipher = ctx.plugin.cipher;
      var increment = ctx.plugin.increment;
      var formatKey = ctx.plugin.formatKey;
      var formatSeed = ctx.plugin.formatSeed;
      ctx.key = null;
      var b = forge.util.createBuffer();
      while (b.length() < count) {
        if (ctx.generated > 1048575) {
          ctx.key = null;
        }
        if (ctx.key === null) {
          _reseedSync();
        }
        var bytes = cipher(ctx.key, ctx.seed);
        ctx.generated += bytes.length;
        b.putBytes(bytes);
        ctx.key = formatKey(cipher(ctx.key, increment(ctx.seed)));
        ctx.seed = formatSeed(cipher(ctx.key, ctx.seed));
      }
      return b.getBytes(count);
    };
    function _reseed(callback) {
      if (ctx.pools[0].messageLength >= 32) {
        _seed();
        return callback();
      }
      var needed = 32 - ctx.pools[0].messageLength << 5;
      ctx.seedFile(needed, function(err, bytes) {
        if (err) {
          return callback(err);
        }
        ctx.collect(bytes);
        _seed();
        callback();
      });
    }
    function _reseedSync() {
      if (ctx.pools[0].messageLength >= 32) {
        return _seed();
      }
      var needed = 32 - ctx.pools[0].messageLength << 5;
      ctx.collect(ctx.seedFileSync(needed));
      _seed();
    }
    function _seed() {
      ctx.reseeds = ctx.reseeds === 4294967295 ? 0 : ctx.reseeds + 1;
      var md2 = ctx.plugin.md.create();
      md2.update(ctx.keyBytes);
      var _2powK = 1;
      for (var k = 0;k < 32; ++k) {
        if (ctx.reseeds % _2powK === 0) {
          md2.update(ctx.pools[k].digest().getBytes());
          ctx.pools[k].start();
        }
        _2powK = _2powK << 1;
      }
      ctx.keyBytes = md2.digest().getBytes();
      md2.start();
      md2.update(ctx.keyBytes);
      var seedBytes = md2.digest().getBytes();
      ctx.key = ctx.plugin.formatKey(ctx.keyBytes);
      ctx.seed = ctx.plugin.formatSeed(seedBytes);
      ctx.generated = 0;
    }
    function defaultSeedFile(needed) {
      var getRandomValues = null;
      var globalScope = forge.util.globalScope;
      var _crypto2 = globalScope.crypto || globalScope.msCrypto;
      if (_crypto2 && _crypto2.getRandomValues) {
        getRandomValues = function(arr) {
          return _crypto2.getRandomValues(arr);
        };
      }
      var b = forge.util.createBuffer();
      if (getRandomValues) {
        while (b.length() < needed) {
          var count = Math.max(1, Math.min(needed - b.length(), 65536) / 4);
          var entropy = new Uint32Array(Math.floor(count));
          try {
            getRandomValues(entropy);
            for (var i2 = 0;i2 < entropy.length; ++i2) {
              b.putInt32(entropy[i2]);
            }
          } catch (e) {
            if (!(typeof QuotaExceededError !== "undefined" && e instanceof QuotaExceededError)) {
              throw e;
            }
          }
        }
      }
      if (b.length() < needed) {
        var hi, lo, next;
        var seed = Math.floor(Math.random() * 65536);
        while (b.length() < needed) {
          lo = 16807 * (seed & 65535);
          hi = 16807 * (seed >> 16);
          lo += (hi & 32767) << 16;
          lo += hi >> 15;
          lo = (lo & 2147483647) + (lo >> 31);
          seed = lo & 4294967295;
          for (var i2 = 0;i2 < 3; ++i2) {
            next = seed >>> (i2 << 3);
            next ^= Math.floor(Math.random() * 256);
            b.putByte(next & 255);
          }
        }
      }
      return b.getBytes(needed);
    }
    if (_crypto) {
      ctx.seedFile = function(needed, callback) {
        _crypto.randomBytes(needed, function(err, bytes) {
          if (err) {
            return callback(err);
          }
          callback(null, bytes.toString());
        });
      };
      ctx.seedFileSync = function(needed) {
        return _crypto.randomBytes(needed).toString();
      };
    } else {
      ctx.seedFile = function(needed, callback) {
        try {
          callback(null, defaultSeedFile(needed));
        } catch (e) {
          callback(e);
        }
      };
      ctx.seedFileSync = defaultSeedFile;
    }
    ctx.collect = function(bytes) {
      var count = bytes.length;
      for (var i2 = 0;i2 < count; ++i2) {
        ctx.pools[ctx.pool].update(bytes.substr(i2, 1));
        ctx.pool = ctx.pool === 31 ? 0 : ctx.pool + 1;
      }
    };
    ctx.collectInt = function(i2, n) {
      var bytes = "";
      for (var x = 0;x < n; x += 8) {
        bytes += String.fromCharCode(i2 >> x & 255);
      }
      ctx.collect(bytes);
    };
    ctx.registerWorker = function(worker) {
      if (worker === self) {
        ctx.seedFile = function(needed, callback) {
          function listener2(e) {
            var data = e.data;
            if (data.forge && data.forge.prng) {
              self.removeEventListener("message", listener2);
              callback(data.forge.prng.err, data.forge.prng.bytes);
            }
          }
          self.addEventListener("message", listener2);
          self.postMessage({ forge: { prng: { needed } } });
        };
      } else {
        var listener = function(e) {
          var data = e.data;
          if (data.forge && data.forge.prng) {
            ctx.seedFile(data.forge.prng.needed, function(err, bytes) {
              worker.postMessage({ forge: { prng: { err, bytes } } });
            });
          }
        };
        worker.addEventListener("message", listener);
      }
    };
    return ctx;
  };
});

// node_modules/node-forge/lib/random.js
var require_random = __commonJS((exports, module) => {
  var forge = require_forge();
  require_aes();
  require_sha256();
  require_prng();
  require_util();
  (function() {
    if (forge.random && forge.random.getBytes) {
      module.exports = forge.random;
      return;
    }
    (function(jQuery2) {
      var prng_aes = {};
      var _prng_aes_output = new Array(4);
      var _prng_aes_buffer = forge.util.createBuffer();
      prng_aes.formatKey = function(key2) {
        var tmp = forge.util.createBuffer(key2);
        key2 = new Array(4);
        key2[0] = tmp.getInt32();
        key2[1] = tmp.getInt32();
        key2[2] = tmp.getInt32();
        key2[3] = tmp.getInt32();
        return forge.aes._expandKey(key2, false);
      };
      prng_aes.formatSeed = function(seed) {
        var tmp = forge.util.createBuffer(seed);
        seed = new Array(4);
        seed[0] = tmp.getInt32();
        seed[1] = tmp.getInt32();
        seed[2] = tmp.getInt32();
        seed[3] = tmp.getInt32();
        return seed;
      };
      prng_aes.cipher = function(key2, seed) {
        forge.aes._updateBlock(key2, seed, _prng_aes_output, false);
        _prng_aes_buffer.putInt32(_prng_aes_output[0]);
        _prng_aes_buffer.putInt32(_prng_aes_output[1]);
        _prng_aes_buffer.putInt32(_prng_aes_output[2]);
        _prng_aes_buffer.putInt32(_prng_aes_output[3]);
        return _prng_aes_buffer.getBytes();
      };
      prng_aes.increment = function(seed) {
        ++seed[3];
        return seed;
      };
      prng_aes.md = forge.md.sha256;
      function spawnPrng() {
        var ctx = forge.prng.create(prng_aes);
        ctx.getBytes = function(count, callback) {
          return ctx.generate(count, callback);
        };
        ctx.getBytesSync = function(count) {
          return ctx.generate(count);
        };
        return ctx;
      }
      var _ctx = spawnPrng();
      var getRandomValues = null;
      var globalScope = forge.util.globalScope;
      var _crypto = globalScope.crypto || globalScope.msCrypto;
      if (_crypto && _crypto.getRandomValues) {
        getRandomValues = function(arr) {
          return _crypto.getRandomValues(arr);
        };
      }
      if (forge.options.usePureJavaScript || !forge.util.isNodejs && !getRandomValues) {
        if (typeof window === "undefined" || window.document === undefined) {}
        _ctx.collectInt(+new Date, 32);
        if (typeof navigator !== "undefined") {
          var _navBytes = "";
          for (var key in navigator) {
            try {
              if (typeof navigator[key] == "string") {
                _navBytes += navigator[key];
              }
            } catch (e) {}
          }
          _ctx.collect(_navBytes);
          _navBytes = null;
        }
        if (jQuery2) {
          jQuery2().mousemove(function(e) {
            _ctx.collectInt(e.clientX, 16);
            _ctx.collectInt(e.clientY, 16);
          });
          jQuery2().keypress(function(e) {
            _ctx.collectInt(e.charCode, 8);
          });
        }
      }
      if (!forge.random) {
        forge.random = _ctx;
      } else {
        for (var key in _ctx) {
          forge.random[key] = _ctx[key];
        }
      }
      forge.random.createInstance = spawnPrng;
      module.exports = forge.random;
    })(typeof jQuery !== "undefined" ? jQuery : null);
  })();
});

// node_modules/node-forge/lib/rc2.js
var require_rc2 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_util();
  var piTable = [
    217,
    120,
    249,
    196,
    25,
    221,
    181,
    237,
    40,
    233,
    253,
    121,
    74,
    160,
    216,
    157,
    198,
    126,
    55,
    131,
    43,
    118,
    83,
    142,
    98,
    76,
    100,
    136,
    68,
    139,
    251,
    162,
    23,
    154,
    89,
    245,
    135,
    179,
    79,
    19,
    97,
    69,
    109,
    141,
    9,
    129,
    125,
    50,
    189,
    143,
    64,
    235,
    134,
    183,
    123,
    11,
    240,
    149,
    33,
    34,
    92,
    107,
    78,
    130,
    84,
    214,
    101,
    147,
    206,
    96,
    178,
    28,
    115,
    86,
    192,
    20,
    167,
    140,
    241,
    220,
    18,
    117,
    202,
    31,
    59,
    190,
    228,
    209,
    66,
    61,
    212,
    48,
    163,
    60,
    182,
    38,
    111,
    191,
    14,
    218,
    70,
    105,
    7,
    87,
    39,
    242,
    29,
    155,
    188,
    148,
    67,
    3,
    248,
    17,
    199,
    246,
    144,
    239,
    62,
    231,
    6,
    195,
    213,
    47,
    200,
    102,
    30,
    215,
    8,
    232,
    234,
    222,
    128,
    82,
    238,
    247,
    132,
    170,
    114,
    172,
    53,
    77,
    106,
    42,
    150,
    26,
    210,
    113,
    90,
    21,
    73,
    116,
    75,
    159,
    208,
    94,
    4,
    24,
    164,
    236,
    194,
    224,
    65,
    110,
    15,
    81,
    203,
    204,
    36,
    145,
    175,
    80,
    161,
    244,
    112,
    57,
    153,
    124,
    58,
    133,
    35,
    184,
    180,
    122,
    252,
    2,
    54,
    91,
    37,
    85,
    151,
    49,
    45,
    93,
    250,
    152,
    227,
    138,
    146,
    174,
    5,
    223,
    41,
    16,
    103,
    108,
    186,
    201,
    211,
    0,
    230,
    207,
    225,
    158,
    168,
    44,
    99,
    22,
    1,
    63,
    88,
    226,
    137,
    169,
    13,
    56,
    52,
    27,
    171,
    51,
    255,
    176,
    187,
    72,
    12,
    95,
    185,
    177,
    205,
    46,
    197,
    243,
    219,
    71,
    229,
    165,
    156,
    119,
    10,
    166,
    32,
    104,
    254,
    127,
    193,
    173
  ];
  var s = [1, 2, 3, 5];
  var rol = function(word, bits) {
    return word << bits & 65535 | (word & 65535) >> 16 - bits;
  };
  var ror = function(word, bits) {
    return (word & 65535) >> bits | word << 16 - bits & 65535;
  };
  module.exports = forge.rc2 = forge.rc2 || {};
  forge.rc2.expandKey = function(key, effKeyBits) {
    if (typeof key === "string") {
      key = forge.util.createBuffer(key);
    }
    effKeyBits = effKeyBits || 128;
    var L = key;
    var T = key.length();
    var T1 = effKeyBits;
    var T8 = Math.ceil(T1 / 8);
    var TM = 255 >> (T1 & 7);
    var i;
    for (i = T;i < 128; i++) {
      L.putByte(piTable[L.at(i - 1) + L.at(i - T) & 255]);
    }
    L.setAt(128 - T8, piTable[L.at(128 - T8) & TM]);
    for (i = 127 - T8;i >= 0; i--) {
      L.setAt(i, piTable[L.at(i + 1) ^ L.at(i + T8)]);
    }
    return L;
  };
  var createCipher = function(key, bits, encrypt) {
    var _finish = false, _input = null, _output = null, _iv = null;
    var mixRound, mashRound;
    var i, j, K = [];
    key = forge.rc2.expandKey(key, bits);
    for (i = 0;i < 64; i++) {
      K.push(key.getInt16Le());
    }
    if (encrypt) {
      mixRound = function(R) {
        for (i = 0;i < 4; i++) {
          R[i] += K[j] + (R[(i + 3) % 4] & R[(i + 2) % 4]) + (~R[(i + 3) % 4] & R[(i + 1) % 4]);
          R[i] = rol(R[i], s[i]);
          j++;
        }
      };
      mashRound = function(R) {
        for (i = 0;i < 4; i++) {
          R[i] += K[R[(i + 3) % 4] & 63];
        }
      };
    } else {
      mixRound = function(R) {
        for (i = 3;i >= 0; i--) {
          R[i] = ror(R[i], s[i]);
          R[i] -= K[j] + (R[(i + 3) % 4] & R[(i + 2) % 4]) + (~R[(i + 3) % 4] & R[(i + 1) % 4]);
          j--;
        }
      };
      mashRound = function(R) {
        for (i = 3;i >= 0; i--) {
          R[i] -= K[R[(i + 3) % 4] & 63];
        }
      };
    }
    var runPlan = function(plan) {
      var R = [];
      for (i = 0;i < 4; i++) {
        var val = _input.getInt16Le();
        if (_iv !== null) {
          if (encrypt) {
            val ^= _iv.getInt16Le();
          } else {
            _iv.putInt16Le(val);
          }
        }
        R.push(val & 65535);
      }
      j = encrypt ? 0 : 63;
      for (var ptr = 0;ptr < plan.length; ptr++) {
        for (var ctr = 0;ctr < plan[ptr][0]; ctr++) {
          plan[ptr][1](R);
        }
      }
      for (i = 0;i < 4; i++) {
        if (_iv !== null) {
          if (encrypt) {
            _iv.putInt16Le(R[i]);
          } else {
            R[i] ^= _iv.getInt16Le();
          }
        }
        _output.putInt16Le(R[i]);
      }
    };
    var cipher = null;
    cipher = {
      start: function(iv, output) {
        if (iv) {
          if (typeof iv === "string") {
            iv = forge.util.createBuffer(iv);
          }
        }
        _finish = false;
        _input = forge.util.createBuffer();
        _output = output || new forge.util.createBuffer;
        _iv = iv;
        cipher.output = _output;
      },
      update: function(input2) {
        if (!_finish) {
          _input.putBuffer(input2);
        }
        while (_input.length() >= 8) {
          runPlan([
            [5, mixRound],
            [1, mashRound],
            [6, mixRound],
            [1, mashRound],
            [5, mixRound]
          ]);
        }
      },
      finish: function(pad) {
        var rval = true;
        if (encrypt) {
          if (pad) {
            rval = pad(8, _input, !encrypt);
          } else {
            var padding = _input.length() === 8 ? 8 : 8 - _input.length();
            _input.fillWithByte(padding, padding);
          }
        }
        if (rval) {
          _finish = true;
          cipher.update();
        }
        if (!encrypt) {
          rval = _input.length() === 0;
          if (rval) {
            if (pad) {
              rval = pad(8, _output, !encrypt);
            } else {
              var len = _output.length();
              var count = _output.at(len - 1);
              if (count > len) {
                rval = false;
              } else {
                _output.truncate(count);
              }
            }
          }
        }
        return rval;
      }
    };
    return cipher;
  };
  forge.rc2.startEncrypting = function(key, iv, output) {
    var cipher = forge.rc2.createEncryptionCipher(key, 128);
    cipher.start(iv, output);
    return cipher;
  };
  forge.rc2.createEncryptionCipher = function(key, bits) {
    return createCipher(key, bits, true);
  };
  forge.rc2.startDecrypting = function(key, iv, output) {
    var cipher = forge.rc2.createDecryptionCipher(key, 128);
    cipher.start(iv, output);
    return cipher;
  };
  forge.rc2.createDecryptionCipher = function(key, bits) {
    return createCipher(key, bits, false);
  };
});

// node_modules/node-forge/lib/jsbn.js
var require_jsbn = __commonJS((exports, module) => {
  var forge = require_forge();
  module.exports = forge.jsbn = forge.jsbn || {};
  var dbits;
  var canary = 244837814094590;
  var j_lm = (canary & 16777215) == 15715070;
  function BigInteger(a, b, c) {
    this.data = [];
    if (a != null)
      if (typeof a == "number")
        this.fromNumber(a, b, c);
      else if (b == null && typeof a != "string")
        this.fromString(a, 256);
      else
        this.fromString(a, b);
  }
  forge.jsbn.BigInteger = BigInteger;
  function nbi() {
    return new BigInteger(null);
  }
  function am1(i, x, w, j, c, n) {
    while (--n >= 0) {
      var v = x * this.data[i++] + w.data[j] + c;
      c = Math.floor(v / 67108864);
      w.data[j++] = v & 67108863;
    }
    return c;
  }
  function am2(i, x, w, j, c, n) {
    var xl = x & 32767, xh = x >> 15;
    while (--n >= 0) {
      var l = this.data[i] & 32767;
      var h = this.data[i++] >> 15;
      var m = xh * l + h * xl;
      l = xl * l + ((m & 32767) << 15) + w.data[j] + (c & 1073741823);
      c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
      w.data[j++] = l & 1073741823;
    }
    return c;
  }
  function am3(i, x, w, j, c, n) {
    var xl = x & 16383, xh = x >> 14;
    while (--n >= 0) {
      var l = this.data[i] & 16383;
      var h = this.data[i++] >> 14;
      var m = xh * l + h * xl;
      l = xl * l + ((m & 16383) << 14) + w.data[j] + c;
      c = (l >> 28) + (m >> 14) + xh * h;
      w.data[j++] = l & 268435455;
    }
    return c;
  }
  if (typeof navigator === "undefined") {
    BigInteger.prototype.am = am3;
    dbits = 28;
  } else if (j_lm && navigator.appName == "Microsoft Internet Explorer") {
    BigInteger.prototype.am = am2;
    dbits = 30;
  } else if (j_lm && navigator.appName != "Netscape") {
    BigInteger.prototype.am = am1;
    dbits = 26;
  } else {
    BigInteger.prototype.am = am3;
    dbits = 28;
  }
  BigInteger.prototype.DB = dbits;
  BigInteger.prototype.DM = (1 << dbits) - 1;
  BigInteger.prototype.DV = 1 << dbits;
  var BI_FP = 52;
  BigInteger.prototype.FV = Math.pow(2, BI_FP);
  BigInteger.prototype.F1 = BI_FP - dbits;
  BigInteger.prototype.F2 = 2 * dbits - BI_FP;
  var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
  var BI_RC = new Array;
  var rr;
  var vv;
  rr = 48;
  for (vv = 0;vv <= 9; ++vv)
    BI_RC[rr++] = vv;
  rr = 97;
  for (vv = 10;vv < 36; ++vv)
    BI_RC[rr++] = vv;
  rr = 65;
  for (vv = 10;vv < 36; ++vv)
    BI_RC[rr++] = vv;
  function int2char(n) {
    return BI_RM.charAt(n);
  }
  function intAt(s, i) {
    var c = BI_RC[s.charCodeAt(i)];
    return c == null ? -1 : c;
  }
  function bnpCopyTo(r) {
    for (var i = this.t - 1;i >= 0; --i)
      r.data[i] = this.data[i];
    r.t = this.t;
    r.s = this.s;
  }
  function bnpFromInt(x) {
    this.t = 1;
    this.s = x < 0 ? -1 : 0;
    if (x > 0)
      this.data[0] = x;
    else if (x < -1)
      this.data[0] = x + this.DV;
    else
      this.t = 0;
  }
  function nbv(i) {
    var r = nbi();
    r.fromInt(i);
    return r;
  }
  function bnpFromString(s, b) {
    var k;
    if (b == 16)
      k = 4;
    else if (b == 8)
      k = 3;
    else if (b == 256)
      k = 8;
    else if (b == 2)
      k = 1;
    else if (b == 32)
      k = 5;
    else if (b == 4)
      k = 2;
    else {
      this.fromRadix(s, b);
      return;
    }
    this.t = 0;
    this.s = 0;
    var i = s.length, mi = false, sh = 0;
    while (--i >= 0) {
      var x = k == 8 ? s[i] & 255 : intAt(s, i);
      if (x < 0) {
        if (s.charAt(i) == "-")
          mi = true;
        continue;
      }
      mi = false;
      if (sh == 0)
        this.data[this.t++] = x;
      else if (sh + k > this.DB) {
        this.data[this.t - 1] |= (x & (1 << this.DB - sh) - 1) << sh;
        this.data[this.t++] = x >> this.DB - sh;
      } else
        this.data[this.t - 1] |= x << sh;
      sh += k;
      if (sh >= this.DB)
        sh -= this.DB;
    }
    if (k == 8 && (s[0] & 128) != 0) {
      this.s = -1;
      if (sh > 0)
        this.data[this.t - 1] |= (1 << this.DB - sh) - 1 << sh;
    }
    this.clamp();
    if (mi)
      BigInteger.ZERO.subTo(this, this);
  }
  function bnpClamp() {
    var c = this.s & this.DM;
    while (this.t > 0 && this.data[this.t - 1] == c)
      --this.t;
  }
  function bnToString(b) {
    if (this.s < 0)
      return "-" + this.negate().toString(b);
    var k;
    if (b == 16)
      k = 4;
    else if (b == 8)
      k = 3;
    else if (b == 2)
      k = 1;
    else if (b == 32)
      k = 5;
    else if (b == 4)
      k = 2;
    else
      return this.toRadix(b);
    var km = (1 << k) - 1, d, m = false, r = "", i = this.t;
    var p = this.DB - i * this.DB % k;
    if (i-- > 0) {
      if (p < this.DB && (d = this.data[i] >> p) > 0) {
        m = true;
        r = int2char(d);
      }
      while (i >= 0) {
        if (p < k) {
          d = (this.data[i] & (1 << p) - 1) << k - p;
          d |= this.data[--i] >> (p += this.DB - k);
        } else {
          d = this.data[i] >> (p -= k) & km;
          if (p <= 0) {
            p += this.DB;
            --i;
          }
        }
        if (d > 0)
          m = true;
        if (m)
          r += int2char(d);
      }
    }
    return m ? r : "0";
  }
  function bnNegate() {
    var r = nbi();
    BigInteger.ZERO.subTo(this, r);
    return r;
  }
  function bnAbs() {
    return this.s < 0 ? this.negate() : this;
  }
  function bnCompareTo(a) {
    var r = this.s - a.s;
    if (r != 0)
      return r;
    var i = this.t;
    r = i - a.t;
    if (r != 0)
      return this.s < 0 ? -r : r;
    while (--i >= 0)
      if ((r = this.data[i] - a.data[i]) != 0)
        return r;
    return 0;
  }
  function nbits(x) {
    var r = 1, t;
    if ((t = x >>> 16) != 0) {
      x = t;
      r += 16;
    }
    if ((t = x >> 8) != 0) {
      x = t;
      r += 8;
    }
    if ((t = x >> 4) != 0) {
      x = t;
      r += 4;
    }
    if ((t = x >> 2) != 0) {
      x = t;
      r += 2;
    }
    if ((t = x >> 1) != 0) {
      x = t;
      r += 1;
    }
    return r;
  }
  function bnBitLength() {
    if (this.t <= 0)
      return 0;
    return this.DB * (this.t - 1) + nbits(this.data[this.t - 1] ^ this.s & this.DM);
  }
  function bnpDLShiftTo(n, r) {
    var i;
    for (i = this.t - 1;i >= 0; --i)
      r.data[i + n] = this.data[i];
    for (i = n - 1;i >= 0; --i)
      r.data[i] = 0;
    r.t = this.t + n;
    r.s = this.s;
  }
  function bnpDRShiftTo(n, r) {
    for (var i = n;i < this.t; ++i)
      r.data[i - n] = this.data[i];
    r.t = Math.max(this.t - n, 0);
    r.s = this.s;
  }
  function bnpLShiftTo(n, r) {
    var bs = n % this.DB;
    var cbs = this.DB - bs;
    var bm = (1 << cbs) - 1;
    var ds = Math.floor(n / this.DB), c = this.s << bs & this.DM, i;
    for (i = this.t - 1;i >= 0; --i) {
      r.data[i + ds + 1] = this.data[i] >> cbs | c;
      c = (this.data[i] & bm) << bs;
    }
    for (i = ds - 1;i >= 0; --i)
      r.data[i] = 0;
    r.data[ds] = c;
    r.t = this.t + ds + 1;
    r.s = this.s;
    r.clamp();
  }
  function bnpRShiftTo(n, r) {
    r.s = this.s;
    var ds = Math.floor(n / this.DB);
    if (ds >= this.t) {
      r.t = 0;
      return;
    }
    var bs = n % this.DB;
    var cbs = this.DB - bs;
    var bm = (1 << bs) - 1;
    r.data[0] = this.data[ds] >> bs;
    for (var i = ds + 1;i < this.t; ++i) {
      r.data[i - ds - 1] |= (this.data[i] & bm) << cbs;
      r.data[i - ds] = this.data[i] >> bs;
    }
    if (bs > 0)
      r.data[this.t - ds - 1] |= (this.s & bm) << cbs;
    r.t = this.t - ds;
    r.clamp();
  }
  function bnpSubTo(a, r) {
    var i = 0, c = 0, m = Math.min(a.t, this.t);
    while (i < m) {
      c += this.data[i] - a.data[i];
      r.data[i++] = c & this.DM;
      c >>= this.DB;
    }
    if (a.t < this.t) {
      c -= a.s;
      while (i < this.t) {
        c += this.data[i];
        r.data[i++] = c & this.DM;
        c >>= this.DB;
      }
      c += this.s;
    } else {
      c += this.s;
      while (i < a.t) {
        c -= a.data[i];
        r.data[i++] = c & this.DM;
        c >>= this.DB;
      }
      c -= a.s;
    }
    r.s = c < 0 ? -1 : 0;
    if (c < -1)
      r.data[i++] = this.DV + c;
    else if (c > 0)
      r.data[i++] = c;
    r.t = i;
    r.clamp();
  }
  function bnpMultiplyTo(a, r) {
    var x = this.abs(), y = a.abs();
    var i = x.t;
    r.t = i + y.t;
    while (--i >= 0)
      r.data[i] = 0;
    for (i = 0;i < y.t; ++i)
      r.data[i + x.t] = x.am(0, y.data[i], r, i, 0, x.t);
    r.s = 0;
    r.clamp();
    if (this.s != a.s)
      BigInteger.ZERO.subTo(r, r);
  }
  function bnpSquareTo(r) {
    var x = this.abs();
    var i = r.t = 2 * x.t;
    while (--i >= 0)
      r.data[i] = 0;
    for (i = 0;i < x.t - 1; ++i) {
      var c = x.am(i, x.data[i], r, 2 * i, 0, 1);
      if ((r.data[i + x.t] += x.am(i + 1, 2 * x.data[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
        r.data[i + x.t] -= x.DV;
        r.data[i + x.t + 1] = 1;
      }
    }
    if (r.t > 0)
      r.data[r.t - 1] += x.am(i, x.data[i], r, 2 * i, 0, 1);
    r.s = 0;
    r.clamp();
  }
  function bnpDivRemTo(m, q, r) {
    var pm = m.abs();
    if (pm.t <= 0)
      return;
    var pt = this.abs();
    if (pt.t < pm.t) {
      if (q != null)
        q.fromInt(0);
      if (r != null)
        this.copyTo(r);
      return;
    }
    if (r == null)
      r = nbi();
    var y = nbi(), ts = this.s, ms = m.s;
    var nsh = this.DB - nbits(pm.data[pm.t - 1]);
    if (nsh > 0) {
      pm.lShiftTo(nsh, y);
      pt.lShiftTo(nsh, r);
    } else {
      pm.copyTo(y);
      pt.copyTo(r);
    }
    var ys = y.t;
    var y0 = y.data[ys - 1];
    if (y0 == 0)
      return;
    var yt = y0 * (1 << this.F1) + (ys > 1 ? y.data[ys - 2] >> this.F2 : 0);
    var d1 = this.FV / yt, d2 = (1 << this.F1) / yt, e = 1 << this.F2;
    var i = r.t, j = i - ys, t = q == null ? nbi() : q;
    y.dlShiftTo(j, t);
    if (r.compareTo(t) >= 0) {
      r.data[r.t++] = 1;
      r.subTo(t, r);
    }
    BigInteger.ONE.dlShiftTo(ys, t);
    t.subTo(y, y);
    while (y.t < ys)
      y.data[y.t++] = 0;
    while (--j >= 0) {
      var qd = r.data[--i] == y0 ? this.DM : Math.floor(r.data[i] * d1 + (r.data[i - 1] + e) * d2);
      if ((r.data[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
        y.dlShiftTo(j, t);
        r.subTo(t, r);
        while (r.data[i] < --qd)
          r.subTo(t, r);
      }
    }
    if (q != null) {
      r.drShiftTo(ys, q);
      if (ts != ms)
        BigInteger.ZERO.subTo(q, q);
    }
    r.t = ys;
    r.clamp();
    if (nsh > 0)
      r.rShiftTo(nsh, r);
    if (ts < 0)
      BigInteger.ZERO.subTo(r, r);
  }
  function bnMod(a) {
    var r = nbi();
    this.abs().divRemTo(a, null, r);
    if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
      a.subTo(r, r);
    return r;
  }
  function Classic(m) {
    this.m = m;
  }
  function cConvert(x) {
    if (x.s < 0 || x.compareTo(this.m) >= 0)
      return x.mod(this.m);
    else
      return x;
  }
  function cRevert(x) {
    return x;
  }
  function cReduce(x) {
    x.divRemTo(this.m, null, x);
  }
  function cMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r);
  }
  function cSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r);
  }
  Classic.prototype.convert = cConvert;
  Classic.prototype.revert = cRevert;
  Classic.prototype.reduce = cReduce;
  Classic.prototype.mulTo = cMulTo;
  Classic.prototype.sqrTo = cSqrTo;
  function bnpInvDigit() {
    if (this.t < 1)
      return 0;
    var x = this.data[0];
    if ((x & 1) == 0)
      return 0;
    var y = x & 3;
    y = y * (2 - (x & 15) * y) & 15;
    y = y * (2 - (x & 255) * y) & 255;
    y = y * (2 - ((x & 65535) * y & 65535)) & 65535;
    y = y * (2 - x * y % this.DV) % this.DV;
    return y > 0 ? this.DV - y : -y;
  }
  function Montgomery(m) {
    this.m = m;
    this.mp = m.invDigit();
    this.mpl = this.mp & 32767;
    this.mph = this.mp >> 15;
    this.um = (1 << m.DB - 15) - 1;
    this.mt2 = 2 * m.t;
  }
  function montConvert(x) {
    var r = nbi();
    x.abs().dlShiftTo(this.m.t, r);
    r.divRemTo(this.m, null, r);
    if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
      this.m.subTo(r, r);
    return r;
  }
  function montRevert(x) {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r;
  }
  function montReduce(x) {
    while (x.t <= this.mt2)
      x.data[x.t++] = 0;
    for (var i = 0;i < this.m.t; ++i) {
      var j = x.data[i] & 32767;
      var u0 = j * this.mpl + ((j * this.mph + (x.data[i] >> 15) * this.mpl & this.um) << 15) & x.DM;
      j = i + this.m.t;
      x.data[j] += this.m.am(0, u0, x, i, 0, this.m.t);
      while (x.data[j] >= x.DV) {
        x.data[j] -= x.DV;
        x.data[++j]++;
      }
    }
    x.clamp();
    x.drShiftTo(this.m.t, x);
    if (x.compareTo(this.m) >= 0)
      x.subTo(this.m, x);
  }
  function montSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r);
  }
  function montMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r);
  }
  Montgomery.prototype.convert = montConvert;
  Montgomery.prototype.revert = montRevert;
  Montgomery.prototype.reduce = montReduce;
  Montgomery.prototype.mulTo = montMulTo;
  Montgomery.prototype.sqrTo = montSqrTo;
  function bnpIsEven() {
    return (this.t > 0 ? this.data[0] & 1 : this.s) == 0;
  }
  function bnpExp(e, z) {
    if (e > 4294967295 || e < 1)
      return BigInteger.ONE;
    var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e) - 1;
    g.copyTo(r);
    while (--i >= 0) {
      z.sqrTo(r, r2);
      if ((e & 1 << i) > 0)
        z.mulTo(r2, g, r);
      else {
        var t = r;
        r = r2;
        r2 = t;
      }
    }
    return z.revert(r);
  }
  function bnModPowInt(e, m) {
    var z;
    if (e < 256 || m.isEven())
      z = new Classic(m);
    else
      z = new Montgomery(m);
    return this.exp(e, z);
  }
  BigInteger.prototype.copyTo = bnpCopyTo;
  BigInteger.prototype.fromInt = bnpFromInt;
  BigInteger.prototype.fromString = bnpFromString;
  BigInteger.prototype.clamp = bnpClamp;
  BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
  BigInteger.prototype.drShiftTo = bnpDRShiftTo;
  BigInteger.prototype.lShiftTo = bnpLShiftTo;
  BigInteger.prototype.rShiftTo = bnpRShiftTo;
  BigInteger.prototype.subTo = bnpSubTo;
  BigInteger.prototype.multiplyTo = bnpMultiplyTo;
  BigInteger.prototype.squareTo = bnpSquareTo;
  BigInteger.prototype.divRemTo = bnpDivRemTo;
  BigInteger.prototype.invDigit = bnpInvDigit;
  BigInteger.prototype.isEven = bnpIsEven;
  BigInteger.prototype.exp = bnpExp;
  BigInteger.prototype.toString = bnToString;
  BigInteger.prototype.negate = bnNegate;
  BigInteger.prototype.abs = bnAbs;
  BigInteger.prototype.compareTo = bnCompareTo;
  BigInteger.prototype.bitLength = bnBitLength;
  BigInteger.prototype.mod = bnMod;
  BigInteger.prototype.modPowInt = bnModPowInt;
  BigInteger.ZERO = nbv(0);
  BigInteger.ONE = nbv(1);
  function bnClone() {
    var r = nbi();
    this.copyTo(r);
    return r;
  }
  function bnIntValue() {
    if (this.s < 0) {
      if (this.t == 1)
        return this.data[0] - this.DV;
      else if (this.t == 0)
        return -1;
    } else if (this.t == 1)
      return this.data[0];
    else if (this.t == 0)
      return 0;
    return (this.data[1] & (1 << 32 - this.DB) - 1) << this.DB | this.data[0];
  }
  function bnByteValue() {
    return this.t == 0 ? this.s : this.data[0] << 24 >> 24;
  }
  function bnShortValue() {
    return this.t == 0 ? this.s : this.data[0] << 16 >> 16;
  }
  function bnpChunkSize(r) {
    return Math.floor(Math.LN2 * this.DB / Math.log(r));
  }
  function bnSigNum() {
    if (this.s < 0)
      return -1;
    else if (this.t <= 0 || this.t == 1 && this.data[0] <= 0)
      return 0;
    else
      return 1;
  }
  function bnpToRadix(b) {
    if (b == null)
      b = 10;
    if (this.signum() == 0 || b < 2 || b > 36)
      return "0";
    var cs = this.chunkSize(b);
    var a = Math.pow(b, cs);
    var d = nbv(a), y = nbi(), z = nbi(), r = "";
    this.divRemTo(d, y, z);
    while (y.signum() > 0) {
      r = (a + z.intValue()).toString(b).substr(1) + r;
      y.divRemTo(d, y, z);
    }
    return z.intValue().toString(b) + r;
  }
  function bnpFromRadix(s, b) {
    this.fromInt(0);
    if (b == null)
      b = 10;
    var cs = this.chunkSize(b);
    var d = Math.pow(b, cs), mi = false, j = 0, w = 0;
    for (var i = 0;i < s.length; ++i) {
      var x = intAt(s, i);
      if (x < 0) {
        if (s.charAt(i) == "-" && this.signum() == 0)
          mi = true;
        continue;
      }
      w = b * w + x;
      if (++j >= cs) {
        this.dMultiply(d);
        this.dAddOffset(w, 0);
        j = 0;
        w = 0;
      }
    }
    if (j > 0) {
      this.dMultiply(Math.pow(b, j));
      this.dAddOffset(w, 0);
    }
    if (mi)
      BigInteger.ZERO.subTo(this, this);
  }
  function bnpFromNumber(a, b, c) {
    if (typeof b == "number") {
      if (a < 2)
        this.fromInt(1);
      else {
        this.fromNumber(a, c);
        if (!this.testBit(a - 1))
          this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
        if (this.isEven())
          this.dAddOffset(1, 0);
        while (!this.isProbablePrime(b)) {
          this.dAddOffset(2, 0);
          if (this.bitLength() > a)
            this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
        }
      }
    } else {
      var x = new Array, t = a & 7;
      x.length = (a >> 3) + 1;
      b.nextBytes(x);
      if (t > 0)
        x[0] &= (1 << t) - 1;
      else
        x[0] = 0;
      this.fromString(x, 256);
    }
  }
  function bnToByteArray() {
    var i = this.t, r = new Array;
    r[0] = this.s;
    var p = this.DB - i * this.DB % 8, d, k = 0;
    if (i-- > 0) {
      if (p < this.DB && (d = this.data[i] >> p) != (this.s & this.DM) >> p)
        r[k++] = d | this.s << this.DB - p;
      while (i >= 0) {
        if (p < 8) {
          d = (this.data[i] & (1 << p) - 1) << 8 - p;
          d |= this.data[--i] >> (p += this.DB - 8);
        } else {
          d = this.data[i] >> (p -= 8) & 255;
          if (p <= 0) {
            p += this.DB;
            --i;
          }
        }
        if ((d & 128) != 0)
          d |= -256;
        if (k == 0 && (this.s & 128) != (d & 128))
          ++k;
        if (k > 0 || d != this.s)
          r[k++] = d;
      }
    }
    return r;
  }
  function bnEquals(a) {
    return this.compareTo(a) == 0;
  }
  function bnMin(a) {
    return this.compareTo(a) < 0 ? this : a;
  }
  function bnMax(a) {
    return this.compareTo(a) > 0 ? this : a;
  }
  function bnpBitwiseTo(a, op, r) {
    var i, f, m = Math.min(a.t, this.t);
    for (i = 0;i < m; ++i)
      r.data[i] = op(this.data[i], a.data[i]);
    if (a.t < this.t) {
      f = a.s & this.DM;
      for (i = m;i < this.t; ++i)
        r.data[i] = op(this.data[i], f);
      r.t = this.t;
    } else {
      f = this.s & this.DM;
      for (i = m;i < a.t; ++i)
        r.data[i] = op(f, a.data[i]);
      r.t = a.t;
    }
    r.s = op(this.s, a.s);
    r.clamp();
  }
  function op_and(x, y) {
    return x & y;
  }
  function bnAnd(a) {
    var r = nbi();
    this.bitwiseTo(a, op_and, r);
    return r;
  }
  function op_or(x, y) {
    return x | y;
  }
  function bnOr(a) {
    var r = nbi();
    this.bitwiseTo(a, op_or, r);
    return r;
  }
  function op_xor(x, y) {
    return x ^ y;
  }
  function bnXor(a) {
    var r = nbi();
    this.bitwiseTo(a, op_xor, r);
    return r;
  }
  function op_andnot(x, y) {
    return x & ~y;
  }
  function bnAndNot(a) {
    var r = nbi();
    this.bitwiseTo(a, op_andnot, r);
    return r;
  }
  function bnNot() {
    var r = nbi();
    for (var i = 0;i < this.t; ++i)
      r.data[i] = this.DM & ~this.data[i];
    r.t = this.t;
    r.s = ~this.s;
    return r;
  }
  function bnShiftLeft(n) {
    var r = nbi();
    if (n < 0)
      this.rShiftTo(-n, r);
    else
      this.lShiftTo(n, r);
    return r;
  }
  function bnShiftRight(n) {
    var r = nbi();
    if (n < 0)
      this.lShiftTo(-n, r);
    else
      this.rShiftTo(n, r);
    return r;
  }
  function lbit(x) {
    if (x == 0)
      return -1;
    var r = 0;
    if ((x & 65535) == 0) {
      x >>= 16;
      r += 16;
    }
    if ((x & 255) == 0) {
      x >>= 8;
      r += 8;
    }
    if ((x & 15) == 0) {
      x >>= 4;
      r += 4;
    }
    if ((x & 3) == 0) {
      x >>= 2;
      r += 2;
    }
    if ((x & 1) == 0)
      ++r;
    return r;
  }
  function bnGetLowestSetBit() {
    for (var i = 0;i < this.t; ++i)
      if (this.data[i] != 0)
        return i * this.DB + lbit(this.data[i]);
    if (this.s < 0)
      return this.t * this.DB;
    return -1;
  }
  function cbit(x) {
    var r = 0;
    while (x != 0) {
      x &= x - 1;
      ++r;
    }
    return r;
  }
  function bnBitCount() {
    var r = 0, x = this.s & this.DM;
    for (var i = 0;i < this.t; ++i)
      r += cbit(this.data[i] ^ x);
    return r;
  }
  function bnTestBit(n) {
    var j = Math.floor(n / this.DB);
    if (j >= this.t)
      return this.s != 0;
    return (this.data[j] & 1 << n % this.DB) != 0;
  }
  function bnpChangeBit(n, op) {
    var r = BigInteger.ONE.shiftLeft(n);
    this.bitwiseTo(r, op, r);
    return r;
  }
  function bnSetBit(n) {
    return this.changeBit(n, op_or);
  }
  function bnClearBit(n) {
    return this.changeBit(n, op_andnot);
  }
  function bnFlipBit(n) {
    return this.changeBit(n, op_xor);
  }
  function bnpAddTo(a, r) {
    var i = 0, c = 0, m = Math.min(a.t, this.t);
    while (i < m) {
      c += this.data[i] + a.data[i];
      r.data[i++] = c & this.DM;
      c >>= this.DB;
    }
    if (a.t < this.t) {
      c += a.s;
      while (i < this.t) {
        c += this.data[i];
        r.data[i++] = c & this.DM;
        c >>= this.DB;
      }
      c += this.s;
    } else {
      c += this.s;
      while (i < a.t) {
        c += a.data[i];
        r.data[i++] = c & this.DM;
        c >>= this.DB;
      }
      c += a.s;
    }
    r.s = c < 0 ? -1 : 0;
    if (c > 0)
      r.data[i++] = c;
    else if (c < -1)
      r.data[i++] = this.DV + c;
    r.t = i;
    r.clamp();
  }
  function bnAdd(a) {
    var r = nbi();
    this.addTo(a, r);
    return r;
  }
  function bnSubtract(a) {
    var r = nbi();
    this.subTo(a, r);
    return r;
  }
  function bnMultiply(a) {
    var r = nbi();
    this.multiplyTo(a, r);
    return r;
  }
  function bnSquare() {
    var r = nbi();
    this.squareTo(r);
    return r;
  }
  function bnDivide(a) {
    var r = nbi();
    this.divRemTo(a, r, null);
    return r;
  }
  function bnRemainder(a) {
    var r = nbi();
    this.divRemTo(a, null, r);
    return r;
  }
  function bnDivideAndRemainder(a) {
    var q = nbi(), r = nbi();
    this.divRemTo(a, q, r);
    return new Array(q, r);
  }
  function bnpDMultiply(n) {
    this.data[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
    ++this.t;
    this.clamp();
  }
  function bnpDAddOffset(n, w) {
    if (n == 0)
      return;
    while (this.t <= w)
      this.data[this.t++] = 0;
    this.data[w] += n;
    while (this.data[w] >= this.DV) {
      this.data[w] -= this.DV;
      if (++w >= this.t)
        this.data[this.t++] = 0;
      ++this.data[w];
    }
  }
  function NullExp() {}
  function nNop(x) {
    return x;
  }
  function nMulTo(x, y, r) {
    x.multiplyTo(y, r);
  }
  function nSqrTo(x, r) {
    x.squareTo(r);
  }
  NullExp.prototype.convert = nNop;
  NullExp.prototype.revert = nNop;
  NullExp.prototype.mulTo = nMulTo;
  NullExp.prototype.sqrTo = nSqrTo;
  function bnPow(e) {
    return this.exp(e, new NullExp);
  }
  function bnpMultiplyLowerTo(a, n, r) {
    var i = Math.min(this.t + a.t, n);
    r.s = 0;
    r.t = i;
    while (i > 0)
      r.data[--i] = 0;
    var j;
    for (j = r.t - this.t;i < j; ++i)
      r.data[i + this.t] = this.am(0, a.data[i], r, i, 0, this.t);
    for (j = Math.min(a.t, n);i < j; ++i)
      this.am(0, a.data[i], r, i, 0, n - i);
    r.clamp();
  }
  function bnpMultiplyUpperTo(a, n, r) {
    --n;
    var i = r.t = this.t + a.t - n;
    r.s = 0;
    while (--i >= 0)
      r.data[i] = 0;
    for (i = Math.max(n - this.t, 0);i < a.t; ++i)
      r.data[this.t + i - n] = this.am(n - i, a.data[i], r, 0, 0, this.t + i - n);
    r.clamp();
    r.drShiftTo(1, r);
  }
  function Barrett(m) {
    this.r2 = nbi();
    this.q3 = nbi();
    BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
    this.mu = this.r2.divide(m);
    this.m = m;
  }
  function barrettConvert(x) {
    if (x.s < 0 || x.t > 2 * this.m.t)
      return x.mod(this.m);
    else if (x.compareTo(this.m) < 0)
      return x;
    else {
      var r = nbi();
      x.copyTo(r);
      this.reduce(r);
      return r;
    }
  }
  function barrettRevert(x) {
    return x;
  }
  function barrettReduce(x) {
    x.drShiftTo(this.m.t - 1, this.r2);
    if (x.t > this.m.t + 1) {
      x.t = this.m.t + 1;
      x.clamp();
    }
    this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
    this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
    while (x.compareTo(this.r2) < 0)
      x.dAddOffset(1, this.m.t + 1);
    x.subTo(this.r2, x);
    while (x.compareTo(this.m) >= 0)
      x.subTo(this.m, x);
  }
  function barrettSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r);
  }
  function barrettMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r);
  }
  Barrett.prototype.convert = barrettConvert;
  Barrett.prototype.revert = barrettRevert;
  Barrett.prototype.reduce = barrettReduce;
  Barrett.prototype.mulTo = barrettMulTo;
  Barrett.prototype.sqrTo = barrettSqrTo;
  function bnModPow(e, m) {
    var i = e.bitLength(), k, r = nbv(1), z;
    if (i <= 0)
      return r;
    else if (i < 18)
      k = 1;
    else if (i < 48)
      k = 3;
    else if (i < 144)
      k = 4;
    else if (i < 768)
      k = 5;
    else
      k = 6;
    if (i < 8)
      z = new Classic(m);
    else if (m.isEven())
      z = new Barrett(m);
    else
      z = new Montgomery(m);
    var g = new Array, n = 3, k1 = k - 1, km = (1 << k) - 1;
    g[1] = z.convert(this);
    if (k > 1) {
      var g2 = nbi();
      z.sqrTo(g[1], g2);
      while (n <= km) {
        g[n] = nbi();
        z.mulTo(g2, g[n - 2], g[n]);
        n += 2;
      }
    }
    var j = e.t - 1, w, is1 = true, r2 = nbi(), t;
    i = nbits(e.data[j]) - 1;
    while (j >= 0) {
      if (i >= k1)
        w = e.data[j] >> i - k1 & km;
      else {
        w = (e.data[j] & (1 << i + 1) - 1) << k1 - i;
        if (j > 0)
          w |= e.data[j - 1] >> this.DB + i - k1;
      }
      n = k;
      while ((w & 1) == 0) {
        w >>= 1;
        --n;
      }
      if ((i -= n) < 0) {
        i += this.DB;
        --j;
      }
      if (is1) {
        g[w].copyTo(r);
        is1 = false;
      } else {
        while (n > 1) {
          z.sqrTo(r, r2);
          z.sqrTo(r2, r);
          n -= 2;
        }
        if (n > 0)
          z.sqrTo(r, r2);
        else {
          t = r;
          r = r2;
          r2 = t;
        }
        z.mulTo(r2, g[w], r);
      }
      while (j >= 0 && (e.data[j] & 1 << i) == 0) {
        z.sqrTo(r, r2);
        t = r;
        r = r2;
        r2 = t;
        if (--i < 0) {
          i = this.DB - 1;
          --j;
        }
      }
    }
    return z.revert(r);
  }
  function bnGCD(a) {
    var x = this.s < 0 ? this.negate() : this.clone();
    var y = a.s < 0 ? a.negate() : a.clone();
    if (x.compareTo(y) < 0) {
      var t = x;
      x = y;
      y = t;
    }
    var i = x.getLowestSetBit(), g = y.getLowestSetBit();
    if (g < 0)
      return x;
    if (i < g)
      g = i;
    if (g > 0) {
      x.rShiftTo(g, x);
      y.rShiftTo(g, y);
    }
    while (x.signum() > 0) {
      if ((i = x.getLowestSetBit()) > 0)
        x.rShiftTo(i, x);
      if ((i = y.getLowestSetBit()) > 0)
        y.rShiftTo(i, y);
      if (x.compareTo(y) >= 0) {
        x.subTo(y, x);
        x.rShiftTo(1, x);
      } else {
        y.subTo(x, y);
        y.rShiftTo(1, y);
      }
    }
    if (g > 0)
      y.lShiftTo(g, y);
    return y;
  }
  function bnpModInt(n) {
    if (n <= 0)
      return 0;
    var d = this.DV % n, r = this.s < 0 ? n - 1 : 0;
    if (this.t > 0)
      if (d == 0)
        r = this.data[0] % n;
      else
        for (var i = this.t - 1;i >= 0; --i)
          r = (d * r + this.data[i]) % n;
    return r;
  }
  function bnModInverse(m) {
    if (this.signum() == 0) {
      return BigInteger.ZERO;
    }
    var ac = m.isEven();
    if (this.isEven() && ac || m.signum() == 0)
      return BigInteger.ZERO;
    var u = m.clone(), v = this.clone();
    var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
    while (u.signum() != 0) {
      while (u.isEven()) {
        u.rShiftTo(1, u);
        if (ac) {
          if (!a.isEven() || !b.isEven()) {
            a.addTo(this, a);
            b.subTo(m, b);
          }
          a.rShiftTo(1, a);
        } else if (!b.isEven())
          b.subTo(m, b);
        b.rShiftTo(1, b);
      }
      while (v.isEven()) {
        v.rShiftTo(1, v);
        if (ac) {
          if (!c.isEven() || !d.isEven()) {
            c.addTo(this, c);
            d.subTo(m, d);
          }
          c.rShiftTo(1, c);
        } else if (!d.isEven())
          d.subTo(m, d);
        d.rShiftTo(1, d);
      }
      if (u.compareTo(v) >= 0) {
        u.subTo(v, u);
        if (ac)
          a.subTo(c, a);
        b.subTo(d, b);
      } else {
        v.subTo(u, v);
        if (ac)
          c.subTo(a, c);
        d.subTo(b, d);
      }
    }
    if (v.compareTo(BigInteger.ONE) != 0)
      return BigInteger.ZERO;
    if (d.compareTo(m) >= 0)
      return d.subtract(m);
    if (d.signum() < 0)
      d.addTo(m, d);
    else
      return d;
    if (d.signum() < 0)
      return d.add(m);
    else
      return d;
  }
  var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
  var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
  function bnIsProbablePrime(t) {
    var i, x = this.abs();
    if (x.t == 1 && x.data[0] <= lowprimes[lowprimes.length - 1]) {
      for (i = 0;i < lowprimes.length; ++i)
        if (x.data[0] == lowprimes[i])
          return true;
      return false;
    }
    if (x.isEven())
      return false;
    i = 1;
    while (i < lowprimes.length) {
      var m = lowprimes[i], j = i + 1;
      while (j < lowprimes.length && m < lplim)
        m *= lowprimes[j++];
      m = x.modInt(m);
      while (i < j)
        if (m % lowprimes[i++] == 0)
          return false;
    }
    return x.millerRabin(t);
  }
  function bnpMillerRabin(t) {
    var n1 = this.subtract(BigInteger.ONE);
    var k = n1.getLowestSetBit();
    if (k <= 0)
      return false;
    var r = n1.shiftRight(k);
    var prng = bnGetPrng();
    var a;
    for (var i = 0;i < t; ++i) {
      do {
        a = new BigInteger(this.bitLength(), prng);
      } while (a.compareTo(BigInteger.ONE) <= 0 || a.compareTo(n1) >= 0);
      var y = a.modPow(r, this);
      if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
        var j = 1;
        while (j++ < k && y.compareTo(n1) != 0) {
          y = y.modPowInt(2, this);
          if (y.compareTo(BigInteger.ONE) == 0)
            return false;
        }
        if (y.compareTo(n1) != 0)
          return false;
      }
    }
    return true;
  }
  function bnGetPrng() {
    return {
      nextBytes: function(x) {
        for (var i = 0;i < x.length; ++i) {
          x[i] = Math.floor(Math.random() * 256);
        }
      }
    };
  }
  BigInteger.prototype.chunkSize = bnpChunkSize;
  BigInteger.prototype.toRadix = bnpToRadix;
  BigInteger.prototype.fromRadix = bnpFromRadix;
  BigInteger.prototype.fromNumber = bnpFromNumber;
  BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
  BigInteger.prototype.changeBit = bnpChangeBit;
  BigInteger.prototype.addTo = bnpAddTo;
  BigInteger.prototype.dMultiply = bnpDMultiply;
  BigInteger.prototype.dAddOffset = bnpDAddOffset;
  BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
  BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
  BigInteger.prototype.modInt = bnpModInt;
  BigInteger.prototype.millerRabin = bnpMillerRabin;
  BigInteger.prototype.clone = bnClone;
  BigInteger.prototype.intValue = bnIntValue;
  BigInteger.prototype.byteValue = bnByteValue;
  BigInteger.prototype.shortValue = bnShortValue;
  BigInteger.prototype.signum = bnSigNum;
  BigInteger.prototype.toByteArray = bnToByteArray;
  BigInteger.prototype.equals = bnEquals;
  BigInteger.prototype.min = bnMin;
  BigInteger.prototype.max = bnMax;
  BigInteger.prototype.and = bnAnd;
  BigInteger.prototype.or = bnOr;
  BigInteger.prototype.xor = bnXor;
  BigInteger.prototype.andNot = bnAndNot;
  BigInteger.prototype.not = bnNot;
  BigInteger.prototype.shiftLeft = bnShiftLeft;
  BigInteger.prototype.shiftRight = bnShiftRight;
  BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
  BigInteger.prototype.bitCount = bnBitCount;
  BigInteger.prototype.testBit = bnTestBit;
  BigInteger.prototype.setBit = bnSetBit;
  BigInteger.prototype.clearBit = bnClearBit;
  BigInteger.prototype.flipBit = bnFlipBit;
  BigInteger.prototype.add = bnAdd;
  BigInteger.prototype.subtract = bnSubtract;
  BigInteger.prototype.multiply = bnMultiply;
  BigInteger.prototype.divide = bnDivide;
  BigInteger.prototype.remainder = bnRemainder;
  BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
  BigInteger.prototype.modPow = bnModPow;
  BigInteger.prototype.modInverse = bnModInverse;
  BigInteger.prototype.pow = bnPow;
  BigInteger.prototype.gcd = bnGCD;
  BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
  BigInteger.prototype.square = bnSquare;
});

// node_modules/node-forge/lib/sha1.js
var require_sha1 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_md();
  require_util();
  var sha1 = module.exports = forge.sha1 = forge.sha1 || {};
  forge.md.sha1 = forge.md.algorithms.sha1 = sha1;
  sha1.create = function() {
    if (!_initialized) {
      _init();
    }
    var _state = null;
    var _input = forge.util.createBuffer();
    var _w = new Array(80);
    var md = {
      algorithm: "sha1",
      blockLength: 64,
      digestLength: 20,
      messageLength: 0,
      fullMessageLength: null,
      messageLengthSize: 8
    };
    md.start = function() {
      md.messageLength = 0;
      md.fullMessageLength = md.messageLength64 = [];
      var int32s = md.messageLengthSize / 4;
      for (var i = 0;i < int32s; ++i) {
        md.fullMessageLength.push(0);
      }
      _input = forge.util.createBuffer();
      _state = {
        h0: 1732584193,
        h1: 4023233417,
        h2: 2562383102,
        h3: 271733878,
        h4: 3285377520
      };
      return md;
    };
    md.start();
    md.update = function(msg, encoding) {
      if (encoding === "utf8") {
        msg = forge.util.encodeUtf8(msg);
      }
      var len = msg.length;
      md.messageLength += len;
      len = [len / 4294967296 >>> 0, len >>> 0];
      for (var i = md.fullMessageLength.length - 1;i >= 0; --i) {
        md.fullMessageLength[i] += len[1];
        len[1] = len[0] + (md.fullMessageLength[i] / 4294967296 >>> 0);
        md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
        len[0] = len[1] / 4294967296 >>> 0;
      }
      _input.putBytes(msg);
      _update(_state, _w, _input);
      if (_input.read > 2048 || _input.length() === 0) {
        _input.compact();
      }
      return md;
    };
    md.digest = function() {
      var finalBlock = forge.util.createBuffer();
      finalBlock.putBytes(_input.bytes());
      var remaining = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize;
      var overflow = remaining & md.blockLength - 1;
      finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
      var next, carry;
      var bits = md.fullMessageLength[0] * 8;
      for (var i = 0;i < md.fullMessageLength.length - 1; ++i) {
        next = md.fullMessageLength[i + 1] * 8;
        carry = next / 4294967296 >>> 0;
        bits += carry;
        finalBlock.putInt32(bits >>> 0);
        bits = next >>> 0;
      }
      finalBlock.putInt32(bits);
      var s2 = {
        h0: _state.h0,
        h1: _state.h1,
        h2: _state.h2,
        h3: _state.h3,
        h4: _state.h4
      };
      _update(s2, _w, finalBlock);
      var rval = forge.util.createBuffer();
      rval.putInt32(s2.h0);
      rval.putInt32(s2.h1);
      rval.putInt32(s2.h2);
      rval.putInt32(s2.h3);
      rval.putInt32(s2.h4);
      return rval;
    };
    return md;
  };
  var _padding = null;
  var _initialized = false;
  function _init() {
    _padding = String.fromCharCode(128);
    _padding += forge.util.fillString(String.fromCharCode(0), 64);
    _initialized = true;
  }
  function _update(s, w, bytes) {
    var t, a, b, c, d, e, f, i;
    var len = bytes.length();
    while (len >= 64) {
      a = s.h0;
      b = s.h1;
      c = s.h2;
      d = s.h3;
      e = s.h4;
      for (i = 0;i < 16; ++i) {
        t = bytes.getInt32();
        w[i] = t;
        f = d ^ b & (c ^ d);
        t = (a << 5 | a >>> 27) + f + e + 1518500249 + t;
        e = d;
        d = c;
        c = (b << 30 | b >>> 2) >>> 0;
        b = a;
        a = t;
      }
      for (;i < 20; ++i) {
        t = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
        t = t << 1 | t >>> 31;
        w[i] = t;
        f = d ^ b & (c ^ d);
        t = (a << 5 | a >>> 27) + f + e + 1518500249 + t;
        e = d;
        d = c;
        c = (b << 30 | b >>> 2) >>> 0;
        b = a;
        a = t;
      }
      for (;i < 32; ++i) {
        t = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
        t = t << 1 | t >>> 31;
        w[i] = t;
        f = b ^ c ^ d;
        t = (a << 5 | a >>> 27) + f + e + 1859775393 + t;
        e = d;
        d = c;
        c = (b << 30 | b >>> 2) >>> 0;
        b = a;
        a = t;
      }
      for (;i < 40; ++i) {
        t = w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32];
        t = t << 2 | t >>> 30;
        w[i] = t;
        f = b ^ c ^ d;
        t = (a << 5 | a >>> 27) + f + e + 1859775393 + t;
        e = d;
        d = c;
        c = (b << 30 | b >>> 2) >>> 0;
        b = a;
        a = t;
      }
      for (;i < 60; ++i) {
        t = w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32];
        t = t << 2 | t >>> 30;
        w[i] = t;
        f = b & c | d & (b ^ c);
        t = (a << 5 | a >>> 27) + f + e + 2400959708 + t;
        e = d;
        d = c;
        c = (b << 30 | b >>> 2) >>> 0;
        b = a;
        a = t;
      }
      for (;i < 80; ++i) {
        t = w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32];
        t = t << 2 | t >>> 30;
        w[i] = t;
        f = b ^ c ^ d;
        t = (a << 5 | a >>> 27) + f + e + 3395469782 + t;
        e = d;
        d = c;
        c = (b << 30 | b >>> 2) >>> 0;
        b = a;
        a = t;
      }
      s.h0 = s.h0 + a | 0;
      s.h1 = s.h1 + b | 0;
      s.h2 = s.h2 + c | 0;
      s.h3 = s.h3 + d | 0;
      s.h4 = s.h4 + e | 0;
      len -= 64;
    }
  }
});

// node_modules/node-forge/lib/pkcs1.js
var require_pkcs1 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_util();
  require_random();
  require_sha1();
  var pkcs1 = module.exports = forge.pkcs1 = forge.pkcs1 || {};
  pkcs1.encode_rsa_oaep = function(key, message, options) {
    var label;
    var seed;
    var md;
    var mgf1Md;
    if (typeof options === "string") {
      label = options;
      seed = arguments[3] || undefined;
      md = arguments[4] || undefined;
    } else if (options) {
      label = options.label || undefined;
      seed = options.seed || undefined;
      md = options.md || undefined;
      if (options.mgf1 && options.mgf1.md) {
        mgf1Md = options.mgf1.md;
      }
    }
    if (!md) {
      md = forge.md.sha1.create();
    } else {
      md.start();
    }
    if (!mgf1Md) {
      mgf1Md = md;
    }
    var keyLength = Math.ceil(key.n.bitLength() / 8);
    var maxLength = keyLength - 2 * md.digestLength - 2;
    if (message.length > maxLength) {
      var error = new Error("RSAES-OAEP input message length is too long.");
      error.length = message.length;
      error.maxLength = maxLength;
      throw error;
    }
    if (!label) {
      label = "";
    }
    md.update(label, "raw");
    var lHash = md.digest();
    var PS = "";
    var PS_length = maxLength - message.length;
    for (var i = 0;i < PS_length; i++) {
      PS += "\x00";
    }
    var DB = lHash.getBytes() + PS + "\x01" + message;
    if (!seed) {
      seed = forge.random.getBytes(md.digestLength);
    } else if (seed.length !== md.digestLength) {
      var error = new Error("Invalid RSAES-OAEP seed. The seed length must " + "match the digest length.");
      error.seedLength = seed.length;
      error.digestLength = md.digestLength;
      throw error;
    }
    var dbMask = rsa_mgf1(seed, keyLength - md.digestLength - 1, mgf1Md);
    var maskedDB = forge.util.xorBytes(DB, dbMask, DB.length);
    var seedMask = rsa_mgf1(maskedDB, md.digestLength, mgf1Md);
    var maskedSeed = forge.util.xorBytes(seed, seedMask, seed.length);
    return "\x00" + maskedSeed + maskedDB;
  };
  pkcs1.decode_rsa_oaep = function(key, em, options) {
    var label;
    var md;
    var mgf1Md;
    if (typeof options === "string") {
      label = options;
      md = arguments[3] || undefined;
    } else if (options) {
      label = options.label || undefined;
      md = options.md || undefined;
      if (options.mgf1 && options.mgf1.md) {
        mgf1Md = options.mgf1.md;
      }
    }
    var keyLength = Math.ceil(key.n.bitLength() / 8);
    if (em.length !== keyLength) {
      var error = new Error("RSAES-OAEP encoded message length is invalid.");
      error.length = em.length;
      error.expectedLength = keyLength;
      throw error;
    }
    if (md === undefined) {
      md = forge.md.sha1.create();
    } else {
      md.start();
    }
    if (!mgf1Md) {
      mgf1Md = md;
    }
    if (keyLength < 2 * md.digestLength + 2) {
      throw new Error("RSAES-OAEP key is too short for the hash function.");
    }
    if (!label) {
      label = "";
    }
    md.update(label, "raw");
    var lHash = md.digest().getBytes();
    var y = em.charAt(0);
    var maskedSeed = em.substring(1, md.digestLength + 1);
    var maskedDB = em.substring(1 + md.digestLength);
    var seedMask = rsa_mgf1(maskedDB, md.digestLength, mgf1Md);
    var seed = forge.util.xorBytes(maskedSeed, seedMask, maskedSeed.length);
    var dbMask = rsa_mgf1(seed, keyLength - md.digestLength - 1, mgf1Md);
    var db = forge.util.xorBytes(maskedDB, dbMask, maskedDB.length);
    var lHashPrime = db.substring(0, md.digestLength);
    var error = y !== "\x00";
    for (var i = 0;i < md.digestLength; ++i) {
      error |= lHash.charAt(i) !== lHashPrime.charAt(i);
    }
    var in_ps = 1;
    var index = md.digestLength;
    for (var j = md.digestLength;j < db.length; j++) {
      var code = db.charCodeAt(j);
      var is_0 = code & 1 ^ 1;
      var error_mask = in_ps ? 65534 : 0;
      error |= code & error_mask;
      in_ps = in_ps & is_0;
      index += in_ps;
    }
    if (error || db.charCodeAt(index) !== 1) {
      throw new Error("Invalid RSAES-OAEP padding.");
    }
    return db.substring(index + 1);
  };
  function rsa_mgf1(seed, maskLength, hash) {
    if (!hash) {
      hash = forge.md.sha1.create();
    }
    var t = "";
    var count = Math.ceil(maskLength / hash.digestLength);
    for (var i = 0;i < count; ++i) {
      var c = String.fromCharCode(i >> 24 & 255, i >> 16 & 255, i >> 8 & 255, i & 255);
      hash.start();
      hash.update(seed + c);
      t += hash.digest().getBytes();
    }
    return t.substring(0, maskLength);
  }
});

// node_modules/node-forge/lib/prime.js
var require_prime = __commonJS((exports, module) => {
  var forge = require_forge();
  require_util();
  require_jsbn();
  require_random();
  (function() {
    if (forge.prime) {
      module.exports = forge.prime;
      return;
    }
    var prime = module.exports = forge.prime = forge.prime || {};
    var BigInteger = forge.jsbn.BigInteger;
    var GCD_30_DELTA = [6, 4, 2, 4, 2, 4, 6, 2];
    var THIRTY = new BigInteger(null);
    THIRTY.fromInt(30);
    var op_or = function(x, y) {
      return x | y;
    };
    prime.generateProbablePrime = function(bits, options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      options = options || {};
      var algorithm = options.algorithm || "PRIMEINC";
      if (typeof algorithm === "string") {
        algorithm = { name: algorithm };
      }
      algorithm.options = algorithm.options || {};
      var prng = options.prng || forge.random;
      var rng = {
        nextBytes: function(x) {
          var b = prng.getBytesSync(x.length);
          for (var i = 0;i < x.length; ++i) {
            x[i] = b.charCodeAt(i);
          }
        }
      };
      if (algorithm.name === "PRIMEINC") {
        return primeincFindPrime(bits, rng, algorithm.options, callback);
      }
      throw new Error("Invalid prime generation algorithm: " + algorithm.name);
    };
    function primeincFindPrime(bits, rng, options, callback) {
      if ("workers" in options) {
        return primeincFindPrimeWithWorkers(bits, rng, options, callback);
      }
      return primeincFindPrimeWithoutWorkers(bits, rng, options, callback);
    }
    function primeincFindPrimeWithoutWorkers(bits, rng, options, callback) {
      var num = generateRandom(bits, rng);
      var deltaIdx = 0;
      var mrTests = getMillerRabinTests(num.bitLength());
      if ("millerRabinTests" in options) {
        mrTests = options.millerRabinTests;
      }
      var maxBlockTime = 10;
      if ("maxBlockTime" in options) {
        maxBlockTime = options.maxBlockTime;
      }
      _primeinc(num, bits, rng, deltaIdx, mrTests, maxBlockTime, callback);
    }
    function _primeinc(num, bits, rng, deltaIdx, mrTests, maxBlockTime, callback) {
      var start = +new Date;
      do {
        if (num.bitLength() > bits) {
          num = generateRandom(bits, rng);
        }
        if (num.isProbablePrime(mrTests)) {
          return callback(null, num);
        }
        num.dAddOffset(GCD_30_DELTA[deltaIdx++ % 8], 0);
      } while (maxBlockTime < 0 || +new Date - start < maxBlockTime);
      forge.util.setImmediate(function() {
        _primeinc(num, bits, rng, deltaIdx, mrTests, maxBlockTime, callback);
      });
    }
    function primeincFindPrimeWithWorkers(bits, rng, options, callback) {
      if (typeof Worker === "undefined") {
        return primeincFindPrimeWithoutWorkers(bits, rng, options, callback);
      }
      var num = generateRandom(bits, rng);
      var numWorkers = options.workers;
      var workLoad = options.workLoad || 100;
      var range = workLoad * 30 / 8;
      var workerScript = options.workerScript || "forge/prime.worker.js";
      if (numWorkers === -1) {
        return forge.util.estimateCores(function(err, cores) {
          if (err) {
            cores = 2;
          }
          numWorkers = cores - 1;
          generate();
        });
      }
      generate();
      function generate() {
        numWorkers = Math.max(1, numWorkers);
        var workers = [];
        for (var i = 0;i < numWorkers; ++i) {
          workers[i] = new Worker(workerScript);
        }
        var running = numWorkers;
        for (var i = 0;i < numWorkers; ++i) {
          workers[i].addEventListener("message", workerMessage);
        }
        var found = false;
        function workerMessage(e) {
          if (found) {
            return;
          }
          --running;
          var data = e.data;
          if (data.found) {
            for (var i2 = 0;i2 < workers.length; ++i2) {
              workers[i2].terminate();
            }
            found = true;
            return callback(null, new BigInteger(data.prime, 16));
          }
          if (num.bitLength() > bits) {
            num = generateRandom(bits, rng);
          }
          var hex = num.toString(16);
          e.target.postMessage({
            hex,
            workLoad
          });
          num.dAddOffset(range, 0);
        }
      }
    }
    function generateRandom(bits, rng) {
      var num = new BigInteger(bits, rng);
      var bits1 = bits - 1;
      if (!num.testBit(bits1)) {
        num.bitwiseTo(BigInteger.ONE.shiftLeft(bits1), op_or, num);
      }
      num.dAddOffset(31 - num.mod(THIRTY).byteValue(), 0);
      return num;
    }
    function getMillerRabinTests(bits) {
      if (bits <= 100)
        return 27;
      if (bits <= 150)
        return 18;
      if (bits <= 200)
        return 15;
      if (bits <= 250)
        return 12;
      if (bits <= 300)
        return 9;
      if (bits <= 350)
        return 8;
      if (bits <= 400)
        return 7;
      if (bits <= 500)
        return 6;
      if (bits <= 600)
        return 5;
      if (bits <= 800)
        return 4;
      if (bits <= 1250)
        return 3;
      return 2;
    }
  })();
});

// node_modules/node-forge/lib/rsa.js
var require_rsa = __commonJS((exports, module) => {
  var forge = require_forge();
  require_asn1();
  require_jsbn();
  require_oids();
  require_pkcs1();
  require_prime();
  require_random();
  require_util();
  if (typeof BigInteger === "undefined") {
    BigInteger = forge.jsbn.BigInteger;
  }
  var BigInteger;
  var _crypto = forge.util.isNodejs ? __require("crypto") : null;
  var asn1 = forge.asn1;
  var util3 = forge.util;
  forge.pki = forge.pki || {};
  module.exports = forge.pki.rsa = forge.rsa = forge.rsa || {};
  var pki = forge.pki;
  var GCD_30_DELTA = [6, 4, 2, 4, 2, 4, 6, 2];
  var privateKeyValidator = {
    name: "PrivateKeyInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "PrivateKeyInfo.version",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "privateKeyVersion"
    }, {
      name: "PrivateKeyInfo.privateKeyAlgorithm",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "AlgorithmIdentifier.algorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: "privateKeyOid"
      }]
    }, {
      name: "PrivateKeyInfo",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OCTETSTRING,
      constructed: false,
      capture: "privateKey"
    }]
  };
  var rsaPrivateKeyValidator = {
    name: "RSAPrivateKey",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "RSAPrivateKey.version",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "privateKeyVersion"
    }, {
      name: "RSAPrivateKey.modulus",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "privateKeyModulus"
    }, {
      name: "RSAPrivateKey.publicExponent",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "privateKeyPublicExponent"
    }, {
      name: "RSAPrivateKey.privateExponent",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "privateKeyPrivateExponent"
    }, {
      name: "RSAPrivateKey.prime1",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "privateKeyPrime1"
    }, {
      name: "RSAPrivateKey.prime2",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "privateKeyPrime2"
    }, {
      name: "RSAPrivateKey.exponent1",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "privateKeyExponent1"
    }, {
      name: "RSAPrivateKey.exponent2",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "privateKeyExponent2"
    }, {
      name: "RSAPrivateKey.coefficient",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "privateKeyCoefficient"
    }]
  };
  var rsaPublicKeyValidator = {
    name: "RSAPublicKey",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "RSAPublicKey.modulus",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "publicKeyModulus"
    }, {
      name: "RSAPublicKey.exponent",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "publicKeyExponent"
    }]
  };
  var publicKeyValidator = forge.pki.rsa.publicKeyValidator = {
    name: "SubjectPublicKeyInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    captureAsn1: "subjectPublicKeyInfo",
    value: [{
      name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "AlgorithmIdentifier.algorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: "publicKeyOid"
      }]
    }, {
      name: "SubjectPublicKeyInfo.subjectPublicKey",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.BITSTRING,
      constructed: false,
      value: [{
        name: "SubjectPublicKeyInfo.subjectPublicKey.RSAPublicKey",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        optional: true,
        captureAsn1: "rsaPublicKey"
      }]
    }]
  };
  var digestInfoValidator = {
    name: "DigestInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "DigestInfo.DigestAlgorithm",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "DigestInfo.DigestAlgorithm.algorithmIdentifier",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: "algorithmIdentifier"
      }, {
        name: "DigestInfo.DigestAlgorithm.parameters",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.NULL,
        capture: "parameters",
        optional: true,
        constructed: false
      }]
    }, {
      name: "DigestInfo.digest",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OCTETSTRING,
      constructed: false,
      capture: "digest"
    }]
  };
  var emsaPkcs1v15encode = function(md) {
    var oid;
    if (md.algorithm in pki.oids) {
      oid = pki.oids[md.algorithm];
    } else {
      var error = new Error("Unknown message digest algorithm.");
      error.algorithm = md.algorithm;
      throw error;
    }
    var oidBytes = asn1.oidToDer(oid).getBytes();
    var digestInfo = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
    var digestAlgorithm = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
    digestAlgorithm.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, oidBytes));
    digestAlgorithm.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, ""));
    var digest = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, md.digest().getBytes());
    digestInfo.value.push(digestAlgorithm);
    digestInfo.value.push(digest);
    return asn1.toDer(digestInfo).getBytes();
  };
  var _modPow = function(x, key, pub) {
    if (pub) {
      return x.modPow(key.e, key.n);
    }
    if (!key.p || !key.q) {
      return x.modPow(key.d, key.n);
    }
    if (!key.dP) {
      key.dP = key.d.mod(key.p.subtract(BigInteger.ONE));
    }
    if (!key.dQ) {
      key.dQ = key.d.mod(key.q.subtract(BigInteger.ONE));
    }
    if (!key.qInv) {
      key.qInv = key.q.modInverse(key.p);
    }
    var r;
    do {
      r = new BigInteger(forge.util.bytesToHex(forge.random.getBytes(key.n.bitLength() / 8)), 16);
    } while (r.compareTo(key.n) >= 0 || !r.gcd(key.n).equals(BigInteger.ONE));
    x = x.multiply(r.modPow(key.e, key.n)).mod(key.n);
    var xp = x.mod(key.p).modPow(key.dP, key.p);
    var xq = x.mod(key.q).modPow(key.dQ, key.q);
    while (xp.compareTo(xq) < 0) {
      xp = xp.add(key.p);
    }
    var y = xp.subtract(xq).multiply(key.qInv).mod(key.p).multiply(key.q).add(xq);
    y = y.multiply(r.modInverse(key.n)).mod(key.n);
    return y;
  };
  pki.rsa.encrypt = function(m, key, bt) {
    var pub = bt;
    var eb;
    var k = Math.ceil(key.n.bitLength() / 8);
    if (bt !== false && bt !== true) {
      pub = bt === 2;
      eb = _encodePkcs1_v1_5(m, key, bt);
    } else {
      eb = forge.util.createBuffer();
      eb.putBytes(m);
    }
    var x = new BigInteger(eb.toHex(), 16);
    var y = _modPow(x, key, pub);
    var yhex = y.toString(16);
    var ed = forge.util.createBuffer();
    var zeros = k - Math.ceil(yhex.length / 2);
    while (zeros > 0) {
      ed.putByte(0);
      --zeros;
    }
    ed.putBytes(forge.util.hexToBytes(yhex));
    return ed.getBytes();
  };
  pki.rsa.decrypt = function(ed, key, pub, ml) {
    var k = Math.ceil(key.n.bitLength() / 8);
    if (ed.length !== k) {
      var error = new Error("Encrypted message length is invalid.");
      error.length = ed.length;
      error.expected = k;
      throw error;
    }
    var y = new BigInteger(forge.util.createBuffer(ed).toHex(), 16);
    if (y.compareTo(key.n) >= 0) {
      throw new Error("Encrypted message is invalid.");
    }
    var x = _modPow(y, key, pub);
    var xhex = x.toString(16);
    var eb = forge.util.createBuffer();
    var zeros = k - Math.ceil(xhex.length / 2);
    while (zeros > 0) {
      eb.putByte(0);
      --zeros;
    }
    eb.putBytes(forge.util.hexToBytes(xhex));
    if (ml !== false) {
      return _decodePkcs1_v1_5(eb.getBytes(), key, pub);
    }
    return eb.getBytes();
  };
  pki.rsa.createKeyPairGenerationState = function(bits, e, options) {
    if (typeof bits === "string") {
      bits = parseInt(bits, 10);
    }
    bits = bits || 2048;
    options = options || {};
    var prng = options.prng || forge.random;
    var rng = {
      nextBytes: function(x) {
        var b = prng.getBytesSync(x.length);
        for (var i = 0;i < x.length; ++i) {
          x[i] = b.charCodeAt(i);
        }
      }
    };
    var algorithm = options.algorithm || "PRIMEINC";
    var rval;
    if (algorithm === "PRIMEINC") {
      rval = {
        algorithm,
        state: 0,
        bits,
        rng,
        eInt: e || 65537,
        e: new BigInteger(null),
        p: null,
        q: null,
        qBits: bits >> 1,
        pBits: bits - (bits >> 1),
        pqState: 0,
        num: null,
        keys: null
      };
      rval.e.fromInt(rval.eInt);
    } else {
      throw new Error("Invalid key generation algorithm: " + algorithm);
    }
    return rval;
  };
  pki.rsa.stepKeyPairGenerationState = function(state, n) {
    if (!("algorithm" in state)) {
      state.algorithm = "PRIMEINC";
    }
    var THIRTY = new BigInteger(null);
    THIRTY.fromInt(30);
    var deltaIdx = 0;
    var op_or = function(x, y) {
      return x | y;
    };
    var t1 = +new Date;
    var t2;
    var total = 0;
    while (state.keys === null && (n <= 0 || total < n)) {
      if (state.state === 0) {
        var bits = state.p === null ? state.pBits : state.qBits;
        var bits1 = bits - 1;
        if (state.pqState === 0) {
          state.num = new BigInteger(bits, state.rng);
          if (!state.num.testBit(bits1)) {
            state.num.bitwiseTo(BigInteger.ONE.shiftLeft(bits1), op_or, state.num);
          }
          state.num.dAddOffset(31 - state.num.mod(THIRTY).byteValue(), 0);
          deltaIdx = 0;
          ++state.pqState;
        } else if (state.pqState === 1) {
          if (state.num.bitLength() > bits) {
            state.pqState = 0;
          } else if (state.num.isProbablePrime(_getMillerRabinTests(state.num.bitLength()))) {
            ++state.pqState;
          } else {
            state.num.dAddOffset(GCD_30_DELTA[deltaIdx++ % 8], 0);
          }
        } else if (state.pqState === 2) {
          state.pqState = state.num.subtract(BigInteger.ONE).gcd(state.e).compareTo(BigInteger.ONE) === 0 ? 3 : 0;
        } else if (state.pqState === 3) {
          state.pqState = 0;
          if (state.p === null) {
            state.p = state.num;
          } else {
            state.q = state.num;
          }
          if (state.p !== null && state.q !== null) {
            ++state.state;
          }
          state.num = null;
        }
      } else if (state.state === 1) {
        if (state.p.compareTo(state.q) < 0) {
          state.num = state.p;
          state.p = state.q;
          state.q = state.num;
        }
        ++state.state;
      } else if (state.state === 2) {
        state.p1 = state.p.subtract(BigInteger.ONE);
        state.q1 = state.q.subtract(BigInteger.ONE);
        state.phi = state.p1.multiply(state.q1);
        ++state.state;
      } else if (state.state === 3) {
        if (state.phi.gcd(state.e).compareTo(BigInteger.ONE) === 0) {
          ++state.state;
        } else {
          state.p = null;
          state.q = null;
          state.state = 0;
        }
      } else if (state.state === 4) {
        state.n = state.p.multiply(state.q);
        if (state.n.bitLength() === state.bits) {
          ++state.state;
        } else {
          state.q = null;
          state.state = 0;
        }
      } else if (state.state === 5) {
        var d = state.e.modInverse(state.phi);
        state.keys = {
          privateKey: pki.rsa.setPrivateKey(state.n, state.e, d, state.p, state.q, d.mod(state.p1), d.mod(state.q1), state.q.modInverse(state.p)),
          publicKey: pki.rsa.setPublicKey(state.n, state.e)
        };
      }
      t2 = +new Date;
      total += t2 - t1;
      t1 = t2;
    }
    return state.keys !== null;
  };
  pki.rsa.generateKeyPair = function(bits, e, options, callback) {
    if (arguments.length === 1) {
      if (typeof bits === "object") {
        options = bits;
        bits = undefined;
      } else if (typeof bits === "function") {
        callback = bits;
        bits = undefined;
      }
    } else if (arguments.length === 2) {
      if (typeof bits === "number") {
        if (typeof e === "function") {
          callback = e;
          e = undefined;
        } else if (typeof e !== "number") {
          options = e;
          e = undefined;
        }
      } else {
        options = bits;
        callback = e;
        bits = undefined;
        e = undefined;
      }
    } else if (arguments.length === 3) {
      if (typeof e === "number") {
        if (typeof options === "function") {
          callback = options;
          options = undefined;
        }
      } else {
        callback = options;
        options = e;
        e = undefined;
      }
    }
    options = options || {};
    if (bits === undefined) {
      bits = options.bits || 2048;
    }
    if (e === undefined) {
      e = options.e || 65537;
    }
    if (!forge.options.usePureJavaScript && !options.prng && bits >= 256 && bits <= 16384 && (e === 65537 || e === 3)) {
      if (callback) {
        if (_detectNodeCrypto("generateKeyPair")) {
          return _crypto.generateKeyPair("rsa", {
            modulusLength: bits,
            publicExponent: e,
            publicKeyEncoding: {
              type: "spki",
              format: "pem"
            },
            privateKeyEncoding: {
              type: "pkcs8",
              format: "pem"
            }
          }, function(err, pub, priv) {
            if (err) {
              return callback(err);
            }
            callback(null, {
              privateKey: pki.privateKeyFromPem(priv),
              publicKey: pki.publicKeyFromPem(pub)
            });
          });
        }
        if (_detectSubtleCrypto("generateKey") && _detectSubtleCrypto("exportKey")) {
          return util3.globalScope.crypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: bits,
            publicExponent: _intToUint8Array(e),
            hash: { name: "SHA-256" }
          }, true, ["sign", "verify"]).then(function(pair) {
            return util3.globalScope.crypto.subtle.exportKey("pkcs8", pair.privateKey);
          }).then(undefined, function(err) {
            callback(err);
          }).then(function(pkcs8) {
            if (pkcs8) {
              var privateKey = pki.privateKeyFromAsn1(asn1.fromDer(forge.util.createBuffer(pkcs8)));
              callback(null, {
                privateKey,
                publicKey: pki.setRsaPublicKey(privateKey.n, privateKey.e)
              });
            }
          });
        }
        if (_detectSubtleMsCrypto("generateKey") && _detectSubtleMsCrypto("exportKey")) {
          var genOp = util3.globalScope.msCrypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: bits,
            publicExponent: _intToUint8Array(e),
            hash: { name: "SHA-256" }
          }, true, ["sign", "verify"]);
          genOp.oncomplete = function(e2) {
            var pair = e2.target.result;
            var exportOp = util3.globalScope.msCrypto.subtle.exportKey("pkcs8", pair.privateKey);
            exportOp.oncomplete = function(e3) {
              var pkcs8 = e3.target.result;
              var privateKey = pki.privateKeyFromAsn1(asn1.fromDer(forge.util.createBuffer(pkcs8)));
              callback(null, {
                privateKey,
                publicKey: pki.setRsaPublicKey(privateKey.n, privateKey.e)
              });
            };
            exportOp.onerror = function(err) {
              callback(err);
            };
          };
          genOp.onerror = function(err) {
            callback(err);
          };
          return;
        }
      } else {
        if (_detectNodeCrypto("generateKeyPairSync")) {
          var keypair = _crypto.generateKeyPairSync("rsa", {
            modulusLength: bits,
            publicExponent: e,
            publicKeyEncoding: {
              type: "spki",
              format: "pem"
            },
            privateKeyEncoding: {
              type: "pkcs8",
              format: "pem"
            }
          });
          return {
            privateKey: pki.privateKeyFromPem(keypair.privateKey),
            publicKey: pki.publicKeyFromPem(keypair.publicKey)
          };
        }
      }
    }
    var state = pki.rsa.createKeyPairGenerationState(bits, e, options);
    if (!callback) {
      pki.rsa.stepKeyPairGenerationState(state, 0);
      return state.keys;
    }
    _generateKeyPair(state, options, callback);
  };
  pki.setRsaPublicKey = pki.rsa.setPublicKey = function(n, e) {
    var key = {
      n,
      e
    };
    key.encrypt = function(data, scheme, schemeOptions) {
      if (typeof scheme === "string") {
        scheme = scheme.toUpperCase();
      } else if (scheme === undefined) {
        scheme = "RSAES-PKCS1-V1_5";
      }
      if (scheme === "RSAES-PKCS1-V1_5") {
        scheme = {
          encode: function(m, key2, pub) {
            return _encodePkcs1_v1_5(m, key2, 2).getBytes();
          }
        };
      } else if (scheme === "RSA-OAEP" || scheme === "RSAES-OAEP") {
        scheme = {
          encode: function(m, key2) {
            return forge.pkcs1.encode_rsa_oaep(key2, m, schemeOptions);
          }
        };
      } else if (["RAW", "NONE", "NULL", null].indexOf(scheme) !== -1) {
        scheme = { encode: function(e3) {
          return e3;
        } };
      } else if (typeof scheme === "string") {
        throw new Error('Unsupported encryption scheme: "' + scheme + '".');
      }
      var e2 = scheme.encode(data, key, true);
      return pki.rsa.encrypt(e2, key, true);
    };
    key.verify = function(digest, signature, scheme, options) {
      if (typeof scheme === "string") {
        scheme = scheme.toUpperCase();
      } else if (scheme === undefined) {
        scheme = "RSASSA-PKCS1-V1_5";
      }
      if (options === undefined) {
        options = {
          _parseAllDigestBytes: true,
          _skipPaddingChecks: false
        };
      }
      if (!("_parseAllDigestBytes" in options)) {
        options._parseAllDigestBytes = true;
      }
      if (!("_skipPaddingChecks" in options)) {
        options._skipPaddingChecks = false;
      }
      if (scheme === "RSASSA-PKCS1-V1_5") {
        scheme = {
          verify: function(digest2, d2) {
            d2 = _decodePkcs1_v1_5(d2, key, true, undefined, options);
            var obj = asn1.fromDer(d2, {
              parseAllBytes: options._parseAllDigestBytes
            });
            var capture = {};
            var errors2 = [];
            if (!asn1.validate(obj, digestInfoValidator, capture, errors2) || obj.value.length !== 2) {
              var error = new Error("ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 " + "DigestInfo value.");
              error.errors = errors2;
              throw error;
            }
            var oid = asn1.derToOid(capture.algorithmIdentifier);
            if (!(oid === forge.oids.md2 || oid === forge.oids.md5 || oid === forge.oids.sha1 || oid === forge.oids.sha224 || oid === forge.oids.sha256 || oid === forge.oids.sha384 || oid === forge.oids.sha512 || oid === forge.oids["sha512-224"] || oid === forge.oids["sha512-256"])) {
              var error = new Error("Unknown RSASSA-PKCS1-v1_5 DigestAlgorithm identifier.");
              error.oid = oid;
              throw error;
            }
            if (oid === forge.oids.md2 || oid === forge.oids.md5) {
              if (!("parameters" in capture)) {
                throw new Error("ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 " + "DigestInfo value. " + "Missing algorithm identifier NULL parameters.");
              }
            }
            return digest2 === capture.digest;
          }
        };
      } else if (scheme === "NONE" || scheme === "NULL" || scheme === null) {
        scheme = {
          verify: function(digest2, d2) {
            d2 = _decodePkcs1_v1_5(d2, key, true, undefined, options);
            return digest2 === d2;
          }
        };
      }
      var d = pki.rsa.decrypt(signature, key, true, false);
      return scheme.verify(digest, d, key.n.bitLength());
    };
    return key;
  };
  pki.setRsaPrivateKey = pki.rsa.setPrivateKey = function(n, e, d, p, q, dP, dQ, qInv) {
    var key = {
      n,
      e,
      d,
      p,
      q,
      dP,
      dQ,
      qInv
    };
    key.decrypt = function(data, scheme, schemeOptions) {
      if (typeof scheme === "string") {
        scheme = scheme.toUpperCase();
      } else if (scheme === undefined) {
        scheme = "RSAES-PKCS1-V1_5";
      }
      var d2 = pki.rsa.decrypt(data, key, false, false);
      if (scheme === "RSAES-PKCS1-V1_5") {
        scheme = { decode: _decodePkcs1_v1_5 };
      } else if (scheme === "RSA-OAEP" || scheme === "RSAES-OAEP") {
        scheme = {
          decode: function(d3, key2) {
            return forge.pkcs1.decode_rsa_oaep(key2, d3, schemeOptions);
          }
        };
      } else if (["RAW", "NONE", "NULL", null].indexOf(scheme) !== -1) {
        scheme = { decode: function(d3) {
          return d3;
        } };
      } else {
        throw new Error('Unsupported encryption scheme: "' + scheme + '".');
      }
      return scheme.decode(d2, key, false);
    };
    key.sign = function(md, scheme) {
      var bt = false;
      if (typeof scheme === "string") {
        scheme = scheme.toUpperCase();
      }
      if (scheme === undefined || scheme === "RSASSA-PKCS1-V1_5") {
        scheme = { encode: emsaPkcs1v15encode };
        bt = 1;
      } else if (scheme === "NONE" || scheme === "NULL" || scheme === null) {
        scheme = { encode: function() {
          return md;
        } };
        bt = 1;
      }
      var d2 = scheme.encode(md, key.n.bitLength());
      return pki.rsa.encrypt(d2, key, bt);
    };
    return key;
  };
  pki.wrapRsaPrivateKey = function(rsaKey) {
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(0).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.rsaEncryption).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, asn1.toDer(rsaKey).getBytes())
    ]);
  };
  pki.privateKeyFromAsn1 = function(obj) {
    var capture = {};
    var errors2 = [];
    if (asn1.validate(obj, privateKeyValidator, capture, errors2)) {
      obj = asn1.fromDer(forge.util.createBuffer(capture.privateKey));
    }
    capture = {};
    errors2 = [];
    if (!asn1.validate(obj, rsaPrivateKeyValidator, capture, errors2)) {
      var error = new Error("Cannot read private key. " + "ASN.1 object does not contain an RSAPrivateKey.");
      error.errors = errors2;
      throw error;
    }
    var n, e, d, p, q, dP, dQ, qInv;
    n = forge.util.createBuffer(capture.privateKeyModulus).toHex();
    e = forge.util.createBuffer(capture.privateKeyPublicExponent).toHex();
    d = forge.util.createBuffer(capture.privateKeyPrivateExponent).toHex();
    p = forge.util.createBuffer(capture.privateKeyPrime1).toHex();
    q = forge.util.createBuffer(capture.privateKeyPrime2).toHex();
    dP = forge.util.createBuffer(capture.privateKeyExponent1).toHex();
    dQ = forge.util.createBuffer(capture.privateKeyExponent2).toHex();
    qInv = forge.util.createBuffer(capture.privateKeyCoefficient).toHex();
    return pki.setRsaPrivateKey(new BigInteger(n, 16), new BigInteger(e, 16), new BigInteger(d, 16), new BigInteger(p, 16), new BigInteger(q, 16), new BigInteger(dP, 16), new BigInteger(dQ, 16), new BigInteger(qInv, 16));
  };
  pki.privateKeyToAsn1 = pki.privateKeyToRSAPrivateKey = function(key) {
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(0).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.n)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.e)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.d)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.p)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.q)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.dP)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.dQ)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.qInv))
    ]);
  };
  pki.publicKeyFromAsn1 = function(obj) {
    var capture = {};
    var errors2 = [];
    if (asn1.validate(obj, publicKeyValidator, capture, errors2)) {
      var oid = asn1.derToOid(capture.publicKeyOid);
      if (oid !== pki.oids.rsaEncryption) {
        var error = new Error("Cannot read public key. Unknown OID.");
        error.oid = oid;
        throw error;
      }
      obj = capture.rsaPublicKey;
    }
    errors2 = [];
    if (!asn1.validate(obj, rsaPublicKeyValidator, capture, errors2)) {
      var error = new Error("Cannot read public key. " + "ASN.1 object does not contain an RSAPublicKey.");
      error.errors = errors2;
      throw error;
    }
    var n = forge.util.createBuffer(capture.publicKeyModulus).toHex();
    var e = forge.util.createBuffer(capture.publicKeyExponent).toHex();
    return pki.setRsaPublicKey(new BigInteger(n, 16), new BigInteger(e, 16));
  };
  pki.publicKeyToAsn1 = pki.publicKeyToSubjectPublicKeyInfo = function(key) {
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.rsaEncryption).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, [
        pki.publicKeyToRSAPublicKey(key)
      ])
    ]);
  };
  pki.publicKeyToRSAPublicKey = function(key) {
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.n)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.e))
    ]);
  };
  function _encodePkcs1_v1_5(m, key, bt) {
    var eb = forge.util.createBuffer();
    var k = Math.ceil(key.n.bitLength() / 8);
    if (m.length > k - 11) {
      var error = new Error("Message is too long for PKCS#1 v1.5 padding.");
      error.length = m.length;
      error.max = k - 11;
      throw error;
    }
    eb.putByte(0);
    eb.putByte(bt);
    var padNum = k - 3 - m.length;
    var padByte;
    if (bt === 0 || bt === 1) {
      padByte = bt === 0 ? 0 : 255;
      for (var i = 0;i < padNum; ++i) {
        eb.putByte(padByte);
      }
    } else {
      while (padNum > 0) {
        var numZeros = 0;
        var padBytes = forge.random.getBytes(padNum);
        for (var i = 0;i < padNum; ++i) {
          padByte = padBytes.charCodeAt(i);
          if (padByte === 0) {
            ++numZeros;
          } else {
            eb.putByte(padByte);
          }
        }
        padNum = numZeros;
      }
    }
    eb.putByte(0);
    eb.putBytes(m);
    return eb;
  }
  function _decodePkcs1_v1_5(em, key, pub, ml, options) {
    var k = Math.ceil(key.n.bitLength() / 8);
    var eb = forge.util.createBuffer(em);
    var first = eb.getByte();
    var bt = eb.getByte();
    if (first !== 0 || pub && bt !== 0 && bt !== 1 || !pub && bt !== 2 || pub && bt === 0 && typeof ml === "undefined") {
      throw new Error("Encryption block is invalid.");
    }
    var padNum = 0;
    if (bt === 0) {
      padNum = k - 3 - ml;
      for (var i = 0;i < padNum; ++i) {
        if (eb.getByte() !== 0) {
          throw new Error("Encryption block is invalid.");
        }
      }
    } else if (bt === 1) {
      padNum = 0;
      while (eb.length() > 1) {
        if (eb.getByte() !== 255) {
          --eb.read;
          break;
        }
        ++padNum;
      }
      if (padNum < 8 && !(options ? options._skipPaddingChecks : false)) {
        throw new Error("Encryption block is invalid.");
      }
    } else if (bt === 2) {
      padNum = 0;
      while (eb.length() > 1) {
        if (eb.getByte() === 0) {
          --eb.read;
          break;
        }
        ++padNum;
      }
      if (padNum < 8 && !(options ? options._skipPaddingChecks : false)) {
        throw new Error("Encryption block is invalid.");
      }
    }
    var zero = eb.getByte();
    if (zero !== 0 || padNum !== k - 3 - eb.length()) {
      throw new Error("Encryption block is invalid.");
    }
    return eb.getBytes();
  }
  function _generateKeyPair(state, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    options = options || {};
    var opts = {
      algorithm: {
        name: options.algorithm || "PRIMEINC",
        options: {
          workers: options.workers || 2,
          workLoad: options.workLoad || 100,
          workerScript: options.workerScript
        }
      }
    };
    if ("prng" in options) {
      opts.prng = options.prng;
    }
    generate();
    function generate() {
      getPrime(state.pBits, function(err, num) {
        if (err) {
          return callback(err);
        }
        state.p = num;
        if (state.q !== null) {
          return finish(err, state.q);
        }
        getPrime(state.qBits, finish);
      });
    }
    function getPrime(bits, callback2) {
      forge.prime.generateProbablePrime(bits, opts, callback2);
    }
    function finish(err, num) {
      if (err) {
        return callback(err);
      }
      state.q = num;
      if (state.p.compareTo(state.q) < 0) {
        var tmp = state.p;
        state.p = state.q;
        state.q = tmp;
      }
      if (state.p.subtract(BigInteger.ONE).gcd(state.e).compareTo(BigInteger.ONE) !== 0) {
        state.p = null;
        generate();
        return;
      }
      if (state.q.subtract(BigInteger.ONE).gcd(state.e).compareTo(BigInteger.ONE) !== 0) {
        state.q = null;
        getPrime(state.qBits, finish);
        return;
      }
      state.p1 = state.p.subtract(BigInteger.ONE);
      state.q1 = state.q.subtract(BigInteger.ONE);
      state.phi = state.p1.multiply(state.q1);
      if (state.phi.gcd(state.e).compareTo(BigInteger.ONE) !== 0) {
        state.p = state.q = null;
        generate();
        return;
      }
      state.n = state.p.multiply(state.q);
      if (state.n.bitLength() !== state.bits) {
        state.q = null;
        getPrime(state.qBits, finish);
        return;
      }
      var d = state.e.modInverse(state.phi);
      state.keys = {
        privateKey: pki.rsa.setPrivateKey(state.n, state.e, d, state.p, state.q, d.mod(state.p1), d.mod(state.q1), state.q.modInverse(state.p)),
        publicKey: pki.rsa.setPublicKey(state.n, state.e)
      };
      callback(null, state.keys);
    }
  }
  function _bnToBytes(b) {
    var hex = b.toString(16);
    if (hex[0] >= "8") {
      hex = "00" + hex;
    }
    var bytes = forge.util.hexToBytes(hex);
    if (bytes.length > 1 && (bytes.charCodeAt(0) === 0 && (bytes.charCodeAt(1) & 128) === 0 || bytes.charCodeAt(0) === 255 && (bytes.charCodeAt(1) & 128) === 128)) {
      return bytes.substr(1);
    }
    return bytes;
  }
  function _getMillerRabinTests(bits) {
    if (bits <= 100)
      return 27;
    if (bits <= 150)
      return 18;
    if (bits <= 200)
      return 15;
    if (bits <= 250)
      return 12;
    if (bits <= 300)
      return 9;
    if (bits <= 350)
      return 8;
    if (bits <= 400)
      return 7;
    if (bits <= 500)
      return 6;
    if (bits <= 600)
      return 5;
    if (bits <= 800)
      return 4;
    if (bits <= 1250)
      return 3;
    return 2;
  }
  function _detectNodeCrypto(fn) {
    return forge.util.isNodejs && typeof _crypto[fn] === "function";
  }
  function _detectSubtleCrypto(fn) {
    return typeof util3.globalScope !== "undefined" && typeof util3.globalScope.crypto === "object" && typeof util3.globalScope.crypto.subtle === "object" && typeof util3.globalScope.crypto.subtle[fn] === "function";
  }
  function _detectSubtleMsCrypto(fn) {
    return typeof util3.globalScope !== "undefined" && typeof util3.globalScope.msCrypto === "object" && typeof util3.globalScope.msCrypto.subtle === "object" && typeof util3.globalScope.msCrypto.subtle[fn] === "function";
  }
  function _intToUint8Array(x) {
    var bytes = forge.util.hexToBytes(x.toString(16));
    var buffer = new Uint8Array(bytes.length);
    for (var i = 0;i < bytes.length; ++i) {
      buffer[i] = bytes.charCodeAt(i);
    }
    return buffer;
  }
});

// node_modules/node-forge/lib/pbe.js
var require_pbe = __commonJS((exports, module) => {
  var forge = require_forge();
  require_aes();
  require_asn1();
  require_des();
  require_md();
  require_oids();
  require_pbkdf2();
  require_pem();
  require_random();
  require_rc2();
  require_rsa();
  require_util();
  if (typeof BigInteger === "undefined") {
    BigInteger = forge.jsbn.BigInteger;
  }
  var BigInteger;
  var asn1 = forge.asn1;
  var pki = forge.pki = forge.pki || {};
  module.exports = pki.pbe = forge.pbe = forge.pbe || {};
  var oids = pki.oids;
  var encryptedPrivateKeyValidator = {
    name: "EncryptedPrivateKeyInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "EncryptedPrivateKeyInfo.encryptionAlgorithm",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "AlgorithmIdentifier.algorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: "encryptionOid"
      }, {
        name: "AlgorithmIdentifier.parameters",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        captureAsn1: "encryptionParams"
      }]
    }, {
      name: "EncryptedPrivateKeyInfo.encryptedData",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OCTETSTRING,
      constructed: false,
      capture: "encryptedData"
    }]
  };
  var PBES2AlgorithmsValidator = {
    name: "PBES2Algorithms",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "PBES2Algorithms.keyDerivationFunc",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "PBES2Algorithms.keyDerivationFunc.oid",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: "kdfOid"
      }, {
        name: "PBES2Algorithms.params",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "PBES2Algorithms.params.salt",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OCTETSTRING,
          constructed: false,
          capture: "kdfSalt"
        }, {
          name: "PBES2Algorithms.params.iterationCount",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "kdfIterationCount"
        }, {
          name: "PBES2Algorithms.params.keyLength",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          optional: true,
          capture: "keyLength"
        }, {
          name: "PBES2Algorithms.params.prf",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          optional: true,
          value: [{
            name: "PBES2Algorithms.params.prf.algorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "prfOid"
          }]
        }]
      }]
    }, {
      name: "PBES2Algorithms.encryptionScheme",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "PBES2Algorithms.encryptionScheme.oid",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: "encOid"
      }, {
        name: "PBES2Algorithms.encryptionScheme.iv",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OCTETSTRING,
        constructed: false,
        capture: "encIv"
      }]
    }]
  };
  var pkcs12PbeParamsValidator = {
    name: "pkcs-12PbeParams",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "pkcs-12PbeParams.salt",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OCTETSTRING,
      constructed: false,
      capture: "salt"
    }, {
      name: "pkcs-12PbeParams.iterations",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "iterations"
    }]
  };
  pki.encryptPrivateKeyInfo = function(obj, password, options) {
    options = options || {};
    options.saltSize = options.saltSize || 8;
    options.count = options.count || 2048;
    options.algorithm = options.algorithm || "aes128";
    options.prfAlgorithm = options.prfAlgorithm || "sha1";
    var salt = forge.random.getBytesSync(options.saltSize);
    var count = options.count;
    var countBytes = asn1.integerToDer(count);
    var dkLen;
    var encryptionAlgorithm;
    var encryptedData;
    if (options.algorithm.indexOf("aes") === 0 || options.algorithm === "des") {
      var ivLen, encOid, cipherFn;
      switch (options.algorithm) {
        case "aes128":
          dkLen = 16;
          ivLen = 16;
          encOid = oids["aes128-CBC"];
          cipherFn = forge.aes.createEncryptionCipher;
          break;
        case "aes192":
          dkLen = 24;
          ivLen = 16;
          encOid = oids["aes192-CBC"];
          cipherFn = forge.aes.createEncryptionCipher;
          break;
        case "aes256":
          dkLen = 32;
          ivLen = 16;
          encOid = oids["aes256-CBC"];
          cipherFn = forge.aes.createEncryptionCipher;
          break;
        case "des":
          dkLen = 8;
          ivLen = 8;
          encOid = oids["desCBC"];
          cipherFn = forge.des.createEncryptionCipher;
          break;
        default:
          var error = new Error("Cannot encrypt private key. Unknown encryption algorithm.");
          error.algorithm = options.algorithm;
          throw error;
      }
      var prfAlgorithm = "hmacWith" + options.prfAlgorithm.toUpperCase();
      var md = prfAlgorithmToMessageDigest(prfAlgorithm);
      var dk = forge.pkcs5.pbkdf2(password, salt, count, dkLen, md);
      var iv = forge.random.getBytesSync(ivLen);
      var cipher = cipherFn(dk);
      cipher.start(iv);
      cipher.update(asn1.toDer(obj));
      cipher.finish();
      encryptedData = cipher.output.getBytes();
      var params = createPbkdf2Params(salt, countBytes, dkLen, prfAlgorithm);
      encryptionAlgorithm = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(oids["pkcs5PBES2"]).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(oids["pkcs5PBKDF2"]).getBytes()),
            params
          ]),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(encOid).getBytes()),
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, iv)
          ])
        ])
      ]);
    } else if (options.algorithm === "3des") {
      dkLen = 24;
      var saltBytes = new forge.util.ByteBuffer(salt);
      var dk = pki.pbe.generatePkcs12Key(password, saltBytes, 1, count, dkLen);
      var iv = pki.pbe.generatePkcs12Key(password, saltBytes, 2, count, dkLen);
      var cipher = forge.des.createEncryptionCipher(dk);
      cipher.start(iv);
      cipher.update(asn1.toDer(obj));
      cipher.finish();
      encryptedData = cipher.output.getBytes();
      encryptionAlgorithm = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, salt),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, countBytes.getBytes())
        ])
      ]);
    } else {
      var error = new Error("Cannot encrypt private key. Unknown encryption algorithm.");
      error.algorithm = options.algorithm;
      throw error;
    }
    var rval = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      encryptionAlgorithm,
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, encryptedData)
    ]);
    return rval;
  };
  pki.decryptPrivateKeyInfo = function(obj, password) {
    var rval = null;
    var capture = {};
    var errors2 = [];
    if (!asn1.validate(obj, encryptedPrivateKeyValidator, capture, errors2)) {
      var error = new Error("Cannot read encrypted private key. " + "ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
      error.errors = errors2;
      throw error;
    }
    var oid = asn1.derToOid(capture.encryptionOid);
    var cipher = pki.pbe.getCipher(oid, capture.encryptionParams, password);
    var encrypted = forge.util.createBuffer(capture.encryptedData);
    cipher.update(encrypted);
    if (cipher.finish()) {
      rval = asn1.fromDer(cipher.output);
    }
    return rval;
  };
  pki.encryptedPrivateKeyToPem = function(epki, maxline) {
    var msg = {
      type: "ENCRYPTED PRIVATE KEY",
      body: asn1.toDer(epki).getBytes()
    };
    return forge.pem.encode(msg, { maxline });
  };
  pki.encryptedPrivateKeyFromPem = function(pem) {
    var msg = forge.pem.decode(pem)[0];
    if (msg.type !== "ENCRYPTED PRIVATE KEY") {
      var error = new Error("Could not convert encrypted private key from PEM; " + 'PEM header type is "ENCRYPTED PRIVATE KEY".');
      error.headerType = msg.type;
      throw error;
    }
    if (msg.procType && msg.procType.type === "ENCRYPTED") {
      throw new Error("Could not convert encrypted private key from PEM; " + "PEM is encrypted.");
    }
    return asn1.fromDer(msg.body);
  };
  pki.encryptRsaPrivateKey = function(rsaKey, password, options) {
    options = options || {};
    if (!options.legacy) {
      var rval = pki.wrapRsaPrivateKey(pki.privateKeyToAsn1(rsaKey));
      rval = pki.encryptPrivateKeyInfo(rval, password, options);
      return pki.encryptedPrivateKeyToPem(rval);
    }
    var algorithm;
    var iv;
    var dkLen;
    var cipherFn;
    switch (options.algorithm) {
      case "aes128":
        algorithm = "AES-128-CBC";
        dkLen = 16;
        iv = forge.random.getBytesSync(16);
        cipherFn = forge.aes.createEncryptionCipher;
        break;
      case "aes192":
        algorithm = "AES-192-CBC";
        dkLen = 24;
        iv = forge.random.getBytesSync(16);
        cipherFn = forge.aes.createEncryptionCipher;
        break;
      case "aes256":
        algorithm = "AES-256-CBC";
        dkLen = 32;
        iv = forge.random.getBytesSync(16);
        cipherFn = forge.aes.createEncryptionCipher;
        break;
      case "3des":
        algorithm = "DES-EDE3-CBC";
        dkLen = 24;
        iv = forge.random.getBytesSync(8);
        cipherFn = forge.des.createEncryptionCipher;
        break;
      case "des":
        algorithm = "DES-CBC";
        dkLen = 8;
        iv = forge.random.getBytesSync(8);
        cipherFn = forge.des.createEncryptionCipher;
        break;
      default:
        var error = new Error("Could not encrypt RSA private key; unsupported " + 'encryption algorithm "' + options.algorithm + '".');
        error.algorithm = options.algorithm;
        throw error;
    }
    var dk = forge.pbe.opensslDeriveBytes(password, iv.substr(0, 8), dkLen);
    var cipher = cipherFn(dk);
    cipher.start(iv);
    cipher.update(asn1.toDer(pki.privateKeyToAsn1(rsaKey)));
    cipher.finish();
    var msg = {
      type: "RSA PRIVATE KEY",
      procType: {
        version: "4",
        type: "ENCRYPTED"
      },
      dekInfo: {
        algorithm,
        parameters: forge.util.bytesToHex(iv).toUpperCase()
      },
      body: cipher.output.getBytes()
    };
    return forge.pem.encode(msg);
  };
  pki.decryptRsaPrivateKey = function(pem, password) {
    var rval = null;
    var msg = forge.pem.decode(pem)[0];
    if (msg.type !== "ENCRYPTED PRIVATE KEY" && msg.type !== "PRIVATE KEY" && msg.type !== "RSA PRIVATE KEY") {
      var error = new Error("Could not convert private key from PEM; PEM header type " + 'is not "ENCRYPTED PRIVATE KEY", "PRIVATE KEY", or "RSA PRIVATE KEY".');
      error.headerType = error;
      throw error;
    }
    if (msg.procType && msg.procType.type === "ENCRYPTED") {
      var dkLen;
      var cipherFn;
      switch (msg.dekInfo.algorithm) {
        case "DES-CBC":
          dkLen = 8;
          cipherFn = forge.des.createDecryptionCipher;
          break;
        case "DES-EDE3-CBC":
          dkLen = 24;
          cipherFn = forge.des.createDecryptionCipher;
          break;
        case "AES-128-CBC":
          dkLen = 16;
          cipherFn = forge.aes.createDecryptionCipher;
          break;
        case "AES-192-CBC":
          dkLen = 24;
          cipherFn = forge.aes.createDecryptionCipher;
          break;
        case "AES-256-CBC":
          dkLen = 32;
          cipherFn = forge.aes.createDecryptionCipher;
          break;
        case "RC2-40-CBC":
          dkLen = 5;
          cipherFn = function(key) {
            return forge.rc2.createDecryptionCipher(key, 40);
          };
          break;
        case "RC2-64-CBC":
          dkLen = 8;
          cipherFn = function(key) {
            return forge.rc2.createDecryptionCipher(key, 64);
          };
          break;
        case "RC2-128-CBC":
          dkLen = 16;
          cipherFn = function(key) {
            return forge.rc2.createDecryptionCipher(key, 128);
          };
          break;
        default:
          var error = new Error("Could not decrypt private key; unsupported " + 'encryption algorithm "' + msg.dekInfo.algorithm + '".');
          error.algorithm = msg.dekInfo.algorithm;
          throw error;
      }
      var iv = forge.util.hexToBytes(msg.dekInfo.parameters);
      var dk = forge.pbe.opensslDeriveBytes(password, iv.substr(0, 8), dkLen);
      var cipher = cipherFn(dk);
      cipher.start(iv);
      cipher.update(forge.util.createBuffer(msg.body));
      if (cipher.finish()) {
        rval = cipher.output.getBytes();
      } else {
        return rval;
      }
    } else {
      rval = msg.body;
    }
    if (msg.type === "ENCRYPTED PRIVATE KEY") {
      rval = pki.decryptPrivateKeyInfo(asn1.fromDer(rval), password);
    } else {
      rval = asn1.fromDer(rval);
    }
    if (rval !== null) {
      rval = pki.privateKeyFromAsn1(rval);
    }
    return rval;
  };
  pki.pbe.generatePkcs12Key = function(password, salt, id, iter, n, md) {
    var j, l;
    if (typeof md === "undefined" || md === null) {
      if (!("sha1" in forge.md)) {
        throw new Error('"sha1" hash algorithm unavailable.');
      }
      md = forge.md.sha1.create();
    }
    var u = md.digestLength;
    var v = md.blockLength;
    var result = new forge.util.ByteBuffer;
    var passBuf = new forge.util.ByteBuffer;
    if (password !== null && password !== undefined) {
      for (l = 0;l < password.length; l++) {
        passBuf.putInt16(password.charCodeAt(l));
      }
      passBuf.putInt16(0);
    }
    var p = passBuf.length();
    var s = salt.length();
    var D = new forge.util.ByteBuffer;
    D.fillWithByte(id, v);
    var Slen = v * Math.ceil(s / v);
    var S = new forge.util.ByteBuffer;
    for (l = 0;l < Slen; l++) {
      S.putByte(salt.at(l % s));
    }
    var Plen = v * Math.ceil(p / v);
    var P = new forge.util.ByteBuffer;
    for (l = 0;l < Plen; l++) {
      P.putByte(passBuf.at(l % p));
    }
    var I = S;
    I.putBuffer(P);
    var c = Math.ceil(n / u);
    for (var i = 1;i <= c; i++) {
      var buf = new forge.util.ByteBuffer;
      buf.putBytes(D.bytes());
      buf.putBytes(I.bytes());
      for (var round = 0;round < iter; round++) {
        md.start();
        md.update(buf.getBytes());
        buf = md.digest();
      }
      var B = new forge.util.ByteBuffer;
      for (l = 0;l < v; l++) {
        B.putByte(buf.at(l % u));
      }
      var k = Math.ceil(s / v) + Math.ceil(p / v);
      var Inew = new forge.util.ByteBuffer;
      for (j = 0;j < k; j++) {
        var chunk = new forge.util.ByteBuffer(I.getBytes(v));
        var x = 511;
        for (l = B.length() - 1;l >= 0; l--) {
          x = x >> 8;
          x += B.at(l) + chunk.at(l);
          chunk.setAt(l, x & 255);
        }
        Inew.putBuffer(chunk);
      }
      I = Inew;
      result.putBuffer(buf);
    }
    result.truncate(result.length() - n);
    return result;
  };
  pki.pbe.getCipher = function(oid, params, password) {
    switch (oid) {
      case pki.oids["pkcs5PBES2"]:
        return pki.pbe.getCipherForPBES2(oid, params, password);
      case pki.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
      case pki.oids["pbewithSHAAnd40BitRC2-CBC"]:
        return pki.pbe.getCipherForPKCS12PBE(oid, params, password);
      default:
        var error = new Error("Cannot read encrypted PBE data block. Unsupported OID.");
        error.oid = oid;
        error.supportedOids = [
          "pkcs5PBES2",
          "pbeWithSHAAnd3-KeyTripleDES-CBC",
          "pbewithSHAAnd40BitRC2-CBC"
        ];
        throw error;
    }
  };
  pki.pbe.getCipherForPBES2 = function(oid, params, password) {
    var capture = {};
    var errors2 = [];
    if (!asn1.validate(params, PBES2AlgorithmsValidator, capture, errors2)) {
      var error = new Error("Cannot read password-based-encryption algorithm " + "parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
      error.errors = errors2;
      throw error;
    }
    oid = asn1.derToOid(capture.kdfOid);
    if (oid !== pki.oids["pkcs5PBKDF2"]) {
      var error = new Error("Cannot read encrypted private key. " + "Unsupported key derivation function OID.");
      error.oid = oid;
      error.supportedOids = ["pkcs5PBKDF2"];
      throw error;
    }
    oid = asn1.derToOid(capture.encOid);
    if (oid !== pki.oids["aes128-CBC"] && oid !== pki.oids["aes192-CBC"] && oid !== pki.oids["aes256-CBC"] && oid !== pki.oids["des-EDE3-CBC"] && oid !== pki.oids["desCBC"]) {
      var error = new Error("Cannot read encrypted private key. " + "Unsupported encryption scheme OID.");
      error.oid = oid;
      error.supportedOids = [
        "aes128-CBC",
        "aes192-CBC",
        "aes256-CBC",
        "des-EDE3-CBC",
        "desCBC"
      ];
      throw error;
    }
    var salt = capture.kdfSalt;
    var count = forge.util.createBuffer(capture.kdfIterationCount);
    count = count.getInt(count.length() << 3);
    var dkLen;
    var cipherFn;
    switch (pki.oids[oid]) {
      case "aes128-CBC":
        dkLen = 16;
        cipherFn = forge.aes.createDecryptionCipher;
        break;
      case "aes192-CBC":
        dkLen = 24;
        cipherFn = forge.aes.createDecryptionCipher;
        break;
      case "aes256-CBC":
        dkLen = 32;
        cipherFn = forge.aes.createDecryptionCipher;
        break;
      case "des-EDE3-CBC":
        dkLen = 24;
        cipherFn = forge.des.createDecryptionCipher;
        break;
      case "desCBC":
        dkLen = 8;
        cipherFn = forge.des.createDecryptionCipher;
        break;
    }
    var md = prfOidToMessageDigest(capture.prfOid);
    var dk = forge.pkcs5.pbkdf2(password, salt, count, dkLen, md);
    var iv = capture.encIv;
    var cipher = cipherFn(dk);
    cipher.start(iv);
    return cipher;
  };
  pki.pbe.getCipherForPKCS12PBE = function(oid, params, password) {
    var capture = {};
    var errors2 = [];
    if (!asn1.validate(params, pkcs12PbeParamsValidator, capture, errors2)) {
      var error = new Error("Cannot read password-based-encryption algorithm " + "parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
      error.errors = errors2;
      throw error;
    }
    var salt = forge.util.createBuffer(capture.salt);
    var count = forge.util.createBuffer(capture.iterations);
    count = count.getInt(count.length() << 3);
    var dkLen, dIvLen, cipherFn;
    switch (oid) {
      case pki.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
        dkLen = 24;
        dIvLen = 8;
        cipherFn = forge.des.startDecrypting;
        break;
      case pki.oids["pbewithSHAAnd40BitRC2-CBC"]:
        dkLen = 5;
        dIvLen = 8;
        cipherFn = function(key2, iv2) {
          var cipher = forge.rc2.createDecryptionCipher(key2, 40);
          cipher.start(iv2, null);
          return cipher;
        };
        break;
      default:
        var error = new Error("Cannot read PKCS #12 PBE data block. Unsupported OID.");
        error.oid = oid;
        throw error;
    }
    var md = prfOidToMessageDigest(capture.prfOid);
    var key = pki.pbe.generatePkcs12Key(password, salt, 1, count, dkLen, md);
    md.start();
    var iv = pki.pbe.generatePkcs12Key(password, salt, 2, count, dIvLen, md);
    return cipherFn(key, iv);
  };
  pki.pbe.opensslDeriveBytes = function(password, salt, dkLen, md) {
    if (typeof md === "undefined" || md === null) {
      if (!("md5" in forge.md)) {
        throw new Error('"md5" hash algorithm unavailable.');
      }
      md = forge.md.md5.create();
    }
    if (salt === null) {
      salt = "";
    }
    var digests = [hash(md, password + salt)];
    for (var length = 16, i = 1;length < dkLen; ++i, length += 16) {
      digests.push(hash(md, digests[i - 1] + password + salt));
    }
    return digests.join("").substr(0, dkLen);
  };
  function hash(md, bytes) {
    return md.start().update(bytes).digest().getBytes();
  }
  function prfOidToMessageDigest(prfOid) {
    var prfAlgorithm;
    if (!prfOid) {
      prfAlgorithm = "hmacWithSHA1";
    } else {
      prfAlgorithm = pki.oids[asn1.derToOid(prfOid)];
      if (!prfAlgorithm) {
        var error = new Error("Unsupported PRF OID.");
        error.oid = prfOid;
        error.supported = [
          "hmacWithSHA1",
          "hmacWithSHA224",
          "hmacWithSHA256",
          "hmacWithSHA384",
          "hmacWithSHA512"
        ];
        throw error;
      }
    }
    return prfAlgorithmToMessageDigest(prfAlgorithm);
  }
  function prfAlgorithmToMessageDigest(prfAlgorithm) {
    var factory = forge.md;
    switch (prfAlgorithm) {
      case "hmacWithSHA224":
        factory = forge.md.sha512;
      case "hmacWithSHA1":
      case "hmacWithSHA256":
      case "hmacWithSHA384":
      case "hmacWithSHA512":
        prfAlgorithm = prfAlgorithm.substr(8).toLowerCase();
        break;
      default:
        var error = new Error("Unsupported PRF algorithm.");
        error.algorithm = prfAlgorithm;
        error.supported = [
          "hmacWithSHA1",
          "hmacWithSHA224",
          "hmacWithSHA256",
          "hmacWithSHA384",
          "hmacWithSHA512"
        ];
        throw error;
    }
    if (!factory || !(prfAlgorithm in factory)) {
      throw new Error("Unknown hash algorithm: " + prfAlgorithm);
    }
    return factory[prfAlgorithm].create();
  }
  function createPbkdf2Params(salt, countBytes, dkLen, prfAlgorithm) {
    var params = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, salt),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, countBytes.getBytes())
    ]);
    if (prfAlgorithm !== "hmacWithSHA1") {
      params.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, forge.util.hexToBytes(dkLen.toString(16))), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids[prfAlgorithm]).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
      ]));
    }
    return params;
  }
});

// node_modules/node-forge/lib/pkcs7asn1.js
var require_pkcs7asn1 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_asn1();
  require_util();
  var asn1 = forge.asn1;
  var p7v = module.exports = forge.pkcs7asn1 = forge.pkcs7asn1 || {};
  forge.pkcs7 = forge.pkcs7 || {};
  forge.pkcs7.asn1 = p7v;
  var contentInfoValidator = {
    name: "ContentInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "ContentInfo.ContentType",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OID,
      constructed: false,
      capture: "contentType"
    }, {
      name: "ContentInfo.content",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 0,
      constructed: true,
      optional: true,
      captureAsn1: "content"
    }]
  };
  p7v.contentInfoValidator = contentInfoValidator;
  var encryptedContentInfoValidator = {
    name: "EncryptedContentInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "EncryptedContentInfo.contentType",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OID,
      constructed: false,
      capture: "contentType"
    }, {
      name: "EncryptedContentInfo.contentEncryptionAlgorithm",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "EncryptedContentInfo.contentEncryptionAlgorithm.algorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: "encAlgorithm"
      }, {
        name: "EncryptedContentInfo.contentEncryptionAlgorithm.parameter",
        tagClass: asn1.Class.UNIVERSAL,
        captureAsn1: "encParameter"
      }]
    }, {
      name: "EncryptedContentInfo.encryptedContent",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 0,
      capture: "encryptedContent",
      captureAsn1: "encryptedContentAsn1"
    }]
  };
  p7v.envelopedDataValidator = {
    name: "EnvelopedData",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "EnvelopedData.Version",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "version"
    }, {
      name: "EnvelopedData.RecipientInfos",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SET,
      constructed: true,
      captureAsn1: "recipientInfos"
    }].concat(encryptedContentInfoValidator)
  };
  p7v.encryptedDataValidator = {
    name: "EncryptedData",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "EncryptedData.Version",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "version"
    }].concat(encryptedContentInfoValidator)
  };
  var signerValidator = {
    name: "SignerInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "SignerInfo.version",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false
    }, {
      name: "SignerInfo.issuerAndSerialNumber",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "SignerInfo.issuerAndSerialNumber.issuer",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        captureAsn1: "issuer"
      }, {
        name: "SignerInfo.issuerAndSerialNumber.serialNumber",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "serial"
      }]
    }, {
      name: "SignerInfo.digestAlgorithm",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "SignerInfo.digestAlgorithm.algorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: "digestAlgorithm"
      }, {
        name: "SignerInfo.digestAlgorithm.parameter",
        tagClass: asn1.Class.UNIVERSAL,
        constructed: false,
        captureAsn1: "digestParameter",
        optional: true
      }]
    }, {
      name: "SignerInfo.authenticatedAttributes",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 0,
      constructed: true,
      optional: true,
      capture: "authenticatedAttributes"
    }, {
      name: "SignerInfo.digestEncryptionAlgorithm",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      capture: "signatureAlgorithm"
    }, {
      name: "SignerInfo.encryptedDigest",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OCTETSTRING,
      constructed: false,
      capture: "signature"
    }, {
      name: "SignerInfo.unauthenticatedAttributes",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 1,
      constructed: true,
      optional: true,
      capture: "unauthenticatedAttributes"
    }]
  };
  p7v.signedDataValidator = {
    name: "SignedData",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [
      {
        name: "SignedData.Version",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "version"
      },
      {
        name: "SignedData.DigestAlgorithms",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SET,
        constructed: true,
        captureAsn1: "digestAlgorithms"
      },
      contentInfoValidator,
      {
        name: "SignedData.Certificates",
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 0,
        optional: true,
        captureAsn1: "certificates"
      },
      {
        name: "SignedData.CertificateRevocationLists",
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 1,
        optional: true,
        captureAsn1: "crls"
      },
      {
        name: "SignedData.SignerInfos",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SET,
        capture: "signerInfos",
        optional: true,
        value: [signerValidator]
      }
    ]
  };
  p7v.recipientInfoValidator = {
    name: "RecipientInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "RecipientInfo.version",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "version"
    }, {
      name: "RecipientInfo.issuerAndSerial",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "RecipientInfo.issuerAndSerial.issuer",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        captureAsn1: "issuer"
      }, {
        name: "RecipientInfo.issuerAndSerial.serialNumber",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "serial"
      }]
    }, {
      name: "RecipientInfo.keyEncryptionAlgorithm",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "RecipientInfo.keyEncryptionAlgorithm.algorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: "encAlgorithm"
      }, {
        name: "RecipientInfo.keyEncryptionAlgorithm.parameter",
        tagClass: asn1.Class.UNIVERSAL,
        constructed: false,
        captureAsn1: "encParameter",
        optional: true
      }]
    }, {
      name: "RecipientInfo.encryptedKey",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OCTETSTRING,
      constructed: false,
      capture: "encKey"
    }]
  };
});

// node_modules/node-forge/lib/mgf1.js
var require_mgf1 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_util();
  forge.mgf = forge.mgf || {};
  var mgf1 = module.exports = forge.mgf.mgf1 = forge.mgf1 = forge.mgf1 || {};
  mgf1.create = function(md) {
    var mgf = {
      generate: function(seed, maskLen) {
        var t = new forge.util.ByteBuffer;
        var len = Math.ceil(maskLen / md.digestLength);
        for (var i = 0;i < len; i++) {
          var c = new forge.util.ByteBuffer;
          c.putInt32(i);
          md.start();
          md.update(seed + c.getBytes());
          t.putBuffer(md.digest());
        }
        t.truncate(t.length() - maskLen);
        return t.getBytes();
      }
    };
    return mgf;
  };
});

// node_modules/node-forge/lib/mgf.js
var require_mgf = __commonJS((exports, module) => {
  var forge = require_forge();
  require_mgf1();
  module.exports = forge.mgf = forge.mgf || {};
  forge.mgf.mgf1 = forge.mgf1;
});

// node_modules/node-forge/lib/pss.js
var require_pss = __commonJS((exports, module) => {
  var forge = require_forge();
  require_random();
  require_util();
  var pss = module.exports = forge.pss = forge.pss || {};
  pss.create = function(options) {
    if (arguments.length === 3) {
      options = {
        md: arguments[0],
        mgf: arguments[1],
        saltLength: arguments[2]
      };
    }
    var hash = options.md;
    var mgf = options.mgf;
    var hLen = hash.digestLength;
    var salt_ = options.salt || null;
    if (typeof salt_ === "string") {
      salt_ = forge.util.createBuffer(salt_);
    }
    var sLen;
    if ("saltLength" in options) {
      sLen = options.saltLength;
    } else if (salt_ !== null) {
      sLen = salt_.length();
    } else {
      throw new Error("Salt length not specified or specific salt not given.");
    }
    if (salt_ !== null && salt_.length() !== sLen) {
      throw new Error("Given salt length does not match length of given salt.");
    }
    var prng = options.prng || forge.random;
    var pssobj = {};
    pssobj.encode = function(md, modBits) {
      var i;
      var emBits = modBits - 1;
      var emLen = Math.ceil(emBits / 8);
      var mHash = md.digest().getBytes();
      if (emLen < hLen + sLen + 2) {
        throw new Error("Message is too long to encrypt.");
      }
      var salt;
      if (salt_ === null) {
        salt = prng.getBytesSync(sLen);
      } else {
        salt = salt_.bytes();
      }
      var m_ = new forge.util.ByteBuffer;
      m_.fillWithByte(0, 8);
      m_.putBytes(mHash);
      m_.putBytes(salt);
      hash.start();
      hash.update(m_.getBytes());
      var h = hash.digest().getBytes();
      var ps = new forge.util.ByteBuffer;
      ps.fillWithByte(0, emLen - sLen - hLen - 2);
      ps.putByte(1);
      ps.putBytes(salt);
      var db = ps.getBytes();
      var maskLen = emLen - hLen - 1;
      var dbMask = mgf.generate(h, maskLen);
      var maskedDB = "";
      for (i = 0;i < maskLen; i++) {
        maskedDB += String.fromCharCode(db.charCodeAt(i) ^ dbMask.charCodeAt(i));
      }
      var mask = 65280 >> 8 * emLen - emBits & 255;
      maskedDB = String.fromCharCode(maskedDB.charCodeAt(0) & ~mask) + maskedDB.substr(1);
      return maskedDB + h + String.fromCharCode(188);
    };
    pssobj.verify = function(mHash, em, modBits) {
      var i;
      var emBits = modBits - 1;
      var emLen = Math.ceil(emBits / 8);
      em = em.substr(-emLen);
      if (emLen < hLen + sLen + 2) {
        throw new Error("Inconsistent parameters to PSS signature verification.");
      }
      if (em.charCodeAt(emLen - 1) !== 188) {
        throw new Error("Encoded message does not end in 0xBC.");
      }
      var maskLen = emLen - hLen - 1;
      var maskedDB = em.substr(0, maskLen);
      var h = em.substr(maskLen, hLen);
      var mask = 65280 >> 8 * emLen - emBits & 255;
      if ((maskedDB.charCodeAt(0) & mask) !== 0) {
        throw new Error("Bits beyond keysize not zero as expected.");
      }
      var dbMask = mgf.generate(h, maskLen);
      var db = "";
      for (i = 0;i < maskLen; i++) {
        db += String.fromCharCode(maskedDB.charCodeAt(i) ^ dbMask.charCodeAt(i));
      }
      db = String.fromCharCode(db.charCodeAt(0) & ~mask) + db.substr(1);
      var checkLen = emLen - hLen - sLen - 2;
      for (i = 0;i < checkLen; i++) {
        if (db.charCodeAt(i) !== 0) {
          throw new Error("Leftmost octets not zero as expected");
        }
      }
      if (db.charCodeAt(checkLen) !== 1) {
        throw new Error("Inconsistent PSS signature, 0x01 marker not found");
      }
      var salt = db.substr(-sLen);
      var m_ = new forge.util.ByteBuffer;
      m_.fillWithByte(0, 8);
      m_.putBytes(mHash);
      m_.putBytes(salt);
      hash.start();
      hash.update(m_.getBytes());
      var h_ = hash.digest().getBytes();
      return h === h_;
    };
    return pssobj;
  };
});

// node_modules/node-forge/lib/x509.js
var require_x509 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_aes();
  require_asn1();
  require_des();
  require_md();
  require_mgf();
  require_oids();
  require_pem();
  require_pss();
  require_rsa();
  require_util();
  var asn1 = forge.asn1;
  var pki = module.exports = forge.pki = forge.pki || {};
  var oids = pki.oids;
  var _shortNames = {};
  _shortNames["CN"] = oids["commonName"];
  _shortNames["commonName"] = "CN";
  _shortNames["C"] = oids["countryName"];
  _shortNames["countryName"] = "C";
  _shortNames["L"] = oids["localityName"];
  _shortNames["localityName"] = "L";
  _shortNames["ST"] = oids["stateOrProvinceName"];
  _shortNames["stateOrProvinceName"] = "ST";
  _shortNames["O"] = oids["organizationName"];
  _shortNames["organizationName"] = "O";
  _shortNames["OU"] = oids["organizationalUnitName"];
  _shortNames["organizationalUnitName"] = "OU";
  _shortNames["E"] = oids["emailAddress"];
  _shortNames["emailAddress"] = "E";
  var publicKeyValidator = forge.pki.rsa.publicKeyValidator;
  var x509CertificateValidator = {
    name: "Certificate",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "Certificate.TBSCertificate",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      captureAsn1: "tbsCertificate",
      value: [
        {
          name: "Certificate.TBSCertificate.version",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 0,
          constructed: true,
          optional: true,
          value: [{
            name: "Certificate.TBSCertificate.version.integer",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.INTEGER,
            constructed: false,
            capture: "certVersion"
          }]
        },
        {
          name: "Certificate.TBSCertificate.serialNumber",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "certSerialNumber"
        },
        {
          name: "Certificate.TBSCertificate.signature",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "Certificate.TBSCertificate.signature.algorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "certinfoSignatureOid"
          }, {
            name: "Certificate.TBSCertificate.signature.parameters",
            tagClass: asn1.Class.UNIVERSAL,
            optional: true,
            captureAsn1: "certinfoSignatureParams"
          }]
        },
        {
          name: "Certificate.TBSCertificate.issuer",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          captureAsn1: "certIssuer"
        },
        {
          name: "Certificate.TBSCertificate.validity",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "Certificate.TBSCertificate.validity.notBefore (utc)",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.UTCTIME,
            constructed: false,
            optional: true,
            capture: "certValidity1UTCTime"
          }, {
            name: "Certificate.TBSCertificate.validity.notBefore (generalized)",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.GENERALIZEDTIME,
            constructed: false,
            optional: true,
            capture: "certValidity2GeneralizedTime"
          }, {
            name: "Certificate.TBSCertificate.validity.notAfter (utc)",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.UTCTIME,
            constructed: false,
            optional: true,
            capture: "certValidity3UTCTime"
          }, {
            name: "Certificate.TBSCertificate.validity.notAfter (generalized)",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.GENERALIZEDTIME,
            constructed: false,
            optional: true,
            capture: "certValidity4GeneralizedTime"
          }]
        },
        {
          name: "Certificate.TBSCertificate.subject",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          captureAsn1: "certSubject"
        },
        publicKeyValidator,
        {
          name: "Certificate.TBSCertificate.issuerUniqueID",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 1,
          constructed: true,
          optional: true,
          value: [{
            name: "Certificate.TBSCertificate.issuerUniqueID.id",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.BITSTRING,
            constructed: false,
            captureBitStringValue: "certIssuerUniqueId"
          }]
        },
        {
          name: "Certificate.TBSCertificate.subjectUniqueID",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 2,
          constructed: true,
          optional: true,
          value: [{
            name: "Certificate.TBSCertificate.subjectUniqueID.id",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.BITSTRING,
            constructed: false,
            captureBitStringValue: "certSubjectUniqueId"
          }]
        },
        {
          name: "Certificate.TBSCertificate.extensions",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 3,
          constructed: true,
          captureAsn1: "certExtensions",
          optional: true
        }
      ]
    }, {
      name: "Certificate.signatureAlgorithm",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "Certificate.signatureAlgorithm.algorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: "certSignatureOid"
      }, {
        name: "Certificate.TBSCertificate.signature.parameters",
        tagClass: asn1.Class.UNIVERSAL,
        optional: true,
        captureAsn1: "certSignatureParams"
      }]
    }, {
      name: "Certificate.signatureValue",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.BITSTRING,
      constructed: false,
      captureBitStringValue: "certSignature"
    }]
  };
  var rsassaPssParameterValidator = {
    name: "rsapss",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "rsapss.hashAlgorithm",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 0,
      constructed: true,
      value: [{
        name: "rsapss.hashAlgorithm.AlgorithmIdentifier",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Class.SEQUENCE,
        constructed: true,
        optional: true,
        value: [{
          name: "rsapss.hashAlgorithm.AlgorithmIdentifier.algorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: "hashOid"
        }]
      }]
    }, {
      name: "rsapss.maskGenAlgorithm",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 1,
      constructed: true,
      value: [{
        name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Class.SEQUENCE,
        constructed: true,
        optional: true,
        value: [{
          name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.algorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: "maskGenOid"
        }, {
          name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params.algorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "maskGenHashOid"
          }]
        }]
      }]
    }, {
      name: "rsapss.saltLength",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 2,
      optional: true,
      value: [{
        name: "rsapss.saltLength.saltLength",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Class.INTEGER,
        constructed: false,
        capture: "saltLength"
      }]
    }, {
      name: "rsapss.trailerField",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 3,
      optional: true,
      value: [{
        name: "rsapss.trailer.trailer",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Class.INTEGER,
        constructed: false,
        capture: "trailer"
      }]
    }]
  };
  var certificationRequestInfoValidator = {
    name: "CertificationRequestInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    captureAsn1: "certificationRequestInfo",
    value: [
      {
        name: "CertificationRequestInfo.integer",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "certificationRequestInfoVersion"
      },
      {
        name: "CertificationRequestInfo.subject",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        captureAsn1: "certificationRequestInfoSubject"
      },
      publicKeyValidator,
      {
        name: "CertificationRequestInfo.attributes",
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 0,
        constructed: true,
        optional: true,
        capture: "certificationRequestInfoAttributes",
        value: [{
          name: "CertificationRequestInfo.attributes",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "CertificationRequestInfo.attributes.type",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false
          }, {
            name: "CertificationRequestInfo.attributes.value",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SET,
            constructed: true
          }]
        }]
      }
    ]
  };
  var certificationRequestValidator = {
    name: "CertificationRequest",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    captureAsn1: "csr",
    value: [
      certificationRequestInfoValidator,
      {
        name: "CertificationRequest.signatureAlgorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "CertificationRequest.signatureAlgorithm.algorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: "csrSignatureOid"
        }, {
          name: "CertificationRequest.signatureAlgorithm.parameters",
          tagClass: asn1.Class.UNIVERSAL,
          optional: true,
          captureAsn1: "csrSignatureParams"
        }]
      },
      {
        name: "CertificationRequest.signature",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.BITSTRING,
        constructed: false,
        captureBitStringValue: "csrSignature"
      }
    ]
  };
  pki.RDNAttributesAsArray = function(rdn, md) {
    var rval = [];
    var set, attr, obj;
    for (var si = 0;si < rdn.value.length; ++si) {
      set = rdn.value[si];
      for (var i = 0;i < set.value.length; ++i) {
        obj = {};
        attr = set.value[i];
        obj.type = asn1.derToOid(attr.value[0].value);
        obj.value = attr.value[1].value;
        obj.valueTagClass = attr.value[1].type;
        if (obj.type in oids) {
          obj.name = oids[obj.type];
          if (obj.name in _shortNames) {
            obj.shortName = _shortNames[obj.name];
          }
        }
        if (md) {
          md.update(obj.type);
          md.update(obj.value);
        }
        rval.push(obj);
      }
    }
    return rval;
  };
  pki.CRIAttributesAsArray = function(attributes) {
    var rval = [];
    for (var si = 0;si < attributes.length; ++si) {
      var seq = attributes[si];
      var type = asn1.derToOid(seq.value[0].value);
      var values = seq.value[1].value;
      for (var vi = 0;vi < values.length; ++vi) {
        var obj = {};
        obj.type = type;
        obj.value = values[vi].value;
        obj.valueTagClass = values[vi].type;
        if (obj.type in oids) {
          obj.name = oids[obj.type];
          if (obj.name in _shortNames) {
            obj.shortName = _shortNames[obj.name];
          }
        }
        if (obj.type === oids.extensionRequest) {
          obj.extensions = [];
          for (var ei = 0;ei < obj.value.length; ++ei) {
            obj.extensions.push(pki.certificateExtensionFromAsn1(obj.value[ei]));
          }
        }
        rval.push(obj);
      }
    }
    return rval;
  };
  function _getAttribute(obj, options) {
    if (typeof options === "string") {
      options = { shortName: options };
    }
    var rval = null;
    var attr;
    for (var i = 0;rval === null && i < obj.attributes.length; ++i) {
      attr = obj.attributes[i];
      if (options.type && options.type === attr.type) {
        rval = attr;
      } else if (options.name && options.name === attr.name) {
        rval = attr;
      } else if (options.shortName && options.shortName === attr.shortName) {
        rval = attr;
      }
    }
    return rval;
  }
  var _readSignatureParameters = function(oid, obj, fillDefaults) {
    var params = {};
    if (oid !== oids["RSASSA-PSS"]) {
      return params;
    }
    if (fillDefaults) {
      params = {
        hash: {
          algorithmOid: oids["sha1"]
        },
        mgf: {
          algorithmOid: oids["mgf1"],
          hash: {
            algorithmOid: oids["sha1"]
          }
        },
        saltLength: 20
      };
    }
    var capture = {};
    var errors2 = [];
    if (!asn1.validate(obj, rsassaPssParameterValidator, capture, errors2)) {
      var error = new Error("Cannot read RSASSA-PSS parameter block.");
      error.errors = errors2;
      throw error;
    }
    if (capture.hashOid !== undefined) {
      params.hash = params.hash || {};
      params.hash.algorithmOid = asn1.derToOid(capture.hashOid);
    }
    if (capture.maskGenOid !== undefined) {
      params.mgf = params.mgf || {};
      params.mgf.algorithmOid = asn1.derToOid(capture.maskGenOid);
      params.mgf.hash = params.mgf.hash || {};
      params.mgf.hash.algorithmOid = asn1.derToOid(capture.maskGenHashOid);
    }
    if (capture.saltLength !== undefined) {
      params.saltLength = capture.saltLength.charCodeAt(0);
    }
    return params;
  };
  var _createSignatureDigest = function(options) {
    switch (oids[options.signatureOid]) {
      case "sha1WithRSAEncryption":
      case "sha1WithRSASignature":
        return forge.md.sha1.create();
      case "md5WithRSAEncryption":
        return forge.md.md5.create();
      case "sha256WithRSAEncryption":
        return forge.md.sha256.create();
      case "sha384WithRSAEncryption":
        return forge.md.sha384.create();
      case "sha512WithRSAEncryption":
        return forge.md.sha512.create();
      case "RSASSA-PSS":
        return forge.md.sha256.create();
      default:
        var error = new Error("Could not compute " + options.type + " digest. " + "Unknown signature OID.");
        error.signatureOid = options.signatureOid;
        throw error;
    }
  };
  var _verifySignature = function(options) {
    var cert = options.certificate;
    var scheme;
    switch (cert.signatureOid) {
      case oids.sha1WithRSAEncryption:
      case oids.sha1WithRSASignature:
        break;
      case oids["RSASSA-PSS"]:
        var hash, mgf;
        hash = oids[cert.signatureParameters.mgf.hash.algorithmOid];
        if (hash === undefined || forge.md[hash] === undefined) {
          var error = new Error("Unsupported MGF hash function.");
          error.oid = cert.signatureParameters.mgf.hash.algorithmOid;
          error.name = hash;
          throw error;
        }
        mgf = oids[cert.signatureParameters.mgf.algorithmOid];
        if (mgf === undefined || forge.mgf[mgf] === undefined) {
          var error = new Error("Unsupported MGF function.");
          error.oid = cert.signatureParameters.mgf.algorithmOid;
          error.name = mgf;
          throw error;
        }
        mgf = forge.mgf[mgf].create(forge.md[hash].create());
        hash = oids[cert.signatureParameters.hash.algorithmOid];
        if (hash === undefined || forge.md[hash] === undefined) {
          var error = new Error("Unsupported RSASSA-PSS hash function.");
          error.oid = cert.signatureParameters.hash.algorithmOid;
          error.name = hash;
          throw error;
        }
        scheme = forge.pss.create(forge.md[hash].create(), mgf, cert.signatureParameters.saltLength);
        break;
    }
    return cert.publicKey.verify(options.md.digest().getBytes(), options.signature, scheme);
  };
  pki.certificateFromPem = function(pem, computeHash, strict) {
    var msg = forge.pem.decode(pem)[0];
    if (msg.type !== "CERTIFICATE" && msg.type !== "X509 CERTIFICATE" && msg.type !== "TRUSTED CERTIFICATE") {
      var error = new Error("Could not convert certificate from PEM; PEM header type " + 'is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".');
      error.headerType = msg.type;
      throw error;
    }
    if (msg.procType && msg.procType.type === "ENCRYPTED") {
      throw new Error("Could not convert certificate from PEM; PEM is encrypted.");
    }
    var obj = asn1.fromDer(msg.body, strict);
    return pki.certificateFromAsn1(obj, computeHash);
  };
  pki.certificateToPem = function(cert, maxline) {
    var msg = {
      type: "CERTIFICATE",
      body: asn1.toDer(pki.certificateToAsn1(cert)).getBytes()
    };
    return forge.pem.encode(msg, { maxline });
  };
  pki.publicKeyFromPem = function(pem) {
    var msg = forge.pem.decode(pem)[0];
    if (msg.type !== "PUBLIC KEY" && msg.type !== "RSA PUBLIC KEY") {
      var error = new Error("Could not convert public key from PEM; PEM header " + 'type is not "PUBLIC KEY" or "RSA PUBLIC KEY".');
      error.headerType = msg.type;
      throw error;
    }
    if (msg.procType && msg.procType.type === "ENCRYPTED") {
      throw new Error("Could not convert public key from PEM; PEM is encrypted.");
    }
    var obj = asn1.fromDer(msg.body);
    return pki.publicKeyFromAsn1(obj);
  };
  pki.publicKeyToPem = function(key, maxline) {
    var msg = {
      type: "PUBLIC KEY",
      body: asn1.toDer(pki.publicKeyToAsn1(key)).getBytes()
    };
    return forge.pem.encode(msg, { maxline });
  };
  pki.publicKeyToRSAPublicKeyPem = function(key, maxline) {
    var msg = {
      type: "RSA PUBLIC KEY",
      body: asn1.toDer(pki.publicKeyToRSAPublicKey(key)).getBytes()
    };
    return forge.pem.encode(msg, { maxline });
  };
  pki.getPublicKeyFingerprint = function(key, options) {
    options = options || {};
    var md = options.md || forge.md.sha1.create();
    var type = options.type || "RSAPublicKey";
    var bytes;
    switch (type) {
      case "RSAPublicKey":
        bytes = asn1.toDer(pki.publicKeyToRSAPublicKey(key)).getBytes();
        break;
      case "SubjectPublicKeyInfo":
        bytes = asn1.toDer(pki.publicKeyToAsn1(key)).getBytes();
        break;
      default:
        throw new Error('Unknown fingerprint type "' + options.type + '".');
    }
    md.start();
    md.update(bytes);
    var digest = md.digest();
    if (options.encoding === "hex") {
      var hex = digest.toHex();
      if (options.delimiter) {
        return hex.match(/.{2}/g).join(options.delimiter);
      }
      return hex;
    } else if (options.encoding === "binary") {
      return digest.getBytes();
    } else if (options.encoding) {
      throw new Error('Unknown encoding "' + options.encoding + '".');
    }
    return digest;
  };
  pki.certificationRequestFromPem = function(pem, computeHash, strict) {
    var msg = forge.pem.decode(pem)[0];
    if (msg.type !== "CERTIFICATE REQUEST") {
      var error = new Error("Could not convert certification request from PEM; " + 'PEM header type is not "CERTIFICATE REQUEST".');
      error.headerType = msg.type;
      throw error;
    }
    if (msg.procType && msg.procType.type === "ENCRYPTED") {
      throw new Error("Could not convert certification request from PEM; " + "PEM is encrypted.");
    }
    var obj = asn1.fromDer(msg.body, strict);
    return pki.certificationRequestFromAsn1(obj, computeHash);
  };
  pki.certificationRequestToPem = function(csr, maxline) {
    var msg = {
      type: "CERTIFICATE REQUEST",
      body: asn1.toDer(pki.certificationRequestToAsn1(csr)).getBytes()
    };
    return forge.pem.encode(msg, { maxline });
  };
  pki.createCertificate = function() {
    var cert = {};
    cert.version = 2;
    cert.serialNumber = "00";
    cert.signatureOid = null;
    cert.signature = null;
    cert.siginfo = {};
    cert.siginfo.algorithmOid = null;
    cert.validity = {};
    cert.validity.notBefore = new Date;
    cert.validity.notAfter = new Date;
    cert.issuer = {};
    cert.issuer.getField = function(sn) {
      return _getAttribute(cert.issuer, sn);
    };
    cert.issuer.addField = function(attr) {
      _fillMissingFields([attr]);
      cert.issuer.attributes.push(attr);
    };
    cert.issuer.attributes = [];
    cert.issuer.hash = null;
    cert.subject = {};
    cert.subject.getField = function(sn) {
      return _getAttribute(cert.subject, sn);
    };
    cert.subject.addField = function(attr) {
      _fillMissingFields([attr]);
      cert.subject.attributes.push(attr);
    };
    cert.subject.attributes = [];
    cert.subject.hash = null;
    cert.extensions = [];
    cert.publicKey = null;
    cert.md = null;
    cert.setSubject = function(attrs, uniqueId) {
      _fillMissingFields(attrs);
      cert.subject.attributes = attrs;
      delete cert.subject.uniqueId;
      if (uniqueId) {
        cert.subject.uniqueId = uniqueId;
      }
      cert.subject.hash = null;
    };
    cert.setIssuer = function(attrs, uniqueId) {
      _fillMissingFields(attrs);
      cert.issuer.attributes = attrs;
      delete cert.issuer.uniqueId;
      if (uniqueId) {
        cert.issuer.uniqueId = uniqueId;
      }
      cert.issuer.hash = null;
    };
    cert.setExtensions = function(exts) {
      for (var i = 0;i < exts.length; ++i) {
        _fillMissingExtensionFields(exts[i], { cert });
      }
      cert.extensions = exts;
    };
    cert.getExtension = function(options) {
      if (typeof options === "string") {
        options = { name: options };
      }
      var rval = null;
      var ext;
      for (var i = 0;rval === null && i < cert.extensions.length; ++i) {
        ext = cert.extensions[i];
        if (options.id && ext.id === options.id) {
          rval = ext;
        } else if (options.name && ext.name === options.name) {
          rval = ext;
        }
      }
      return rval;
    };
    cert.sign = function(key, md) {
      cert.md = md || forge.md.sha1.create();
      var algorithmOid = oids[cert.md.algorithm + "WithRSAEncryption"];
      if (!algorithmOid) {
        var error = new Error("Could not compute certificate digest. " + "Unknown message digest algorithm OID.");
        error.algorithm = cert.md.algorithm;
        throw error;
      }
      cert.signatureOid = cert.siginfo.algorithmOid = algorithmOid;
      cert.tbsCertificate = pki.getTBSCertificate(cert);
      var bytes = asn1.toDer(cert.tbsCertificate);
      cert.md.update(bytes.getBytes());
      cert.signature = key.sign(cert.md);
    };
    cert.verify = function(child) {
      var rval = false;
      if (!cert.issued(child)) {
        var issuer = child.issuer;
        var subject = cert.subject;
        var error = new Error("The parent certificate did not issue the given child " + "certificate; the child certificate's issuer does not match the " + "parent's subject.");
        error.expectedIssuer = subject.attributes;
        error.actualIssuer = issuer.attributes;
        throw error;
      }
      var md = child.md;
      if (md === null) {
        md = _createSignatureDigest({
          signatureOid: child.signatureOid,
          type: "certificate"
        });
        var tbsCertificate = child.tbsCertificate || pki.getTBSCertificate(child);
        var bytes = asn1.toDer(tbsCertificate);
        md.update(bytes.getBytes());
      }
      if (md !== null) {
        rval = _verifySignature({
          certificate: cert,
          md,
          signature: child.signature
        });
      }
      return rval;
    };
    cert.isIssuer = function(parent) {
      var rval = false;
      var i = cert.issuer;
      var s = parent.subject;
      if (i.hash && s.hash) {
        rval = i.hash === s.hash;
      } else if (i.attributes.length === s.attributes.length) {
        rval = true;
        var iattr, sattr;
        for (var n = 0;rval && n < i.attributes.length; ++n) {
          iattr = i.attributes[n];
          sattr = s.attributes[n];
          if (iattr.type !== sattr.type || iattr.value !== sattr.value) {
            rval = false;
          }
        }
      }
      return rval;
    };
    cert.issued = function(child) {
      return child.isIssuer(cert);
    };
    cert.generateSubjectKeyIdentifier = function() {
      return pki.getPublicKeyFingerprint(cert.publicKey, { type: "RSAPublicKey" });
    };
    cert.verifySubjectKeyIdentifier = function() {
      var oid = oids["subjectKeyIdentifier"];
      for (var i = 0;i < cert.extensions.length; ++i) {
        var ext = cert.extensions[i];
        if (ext.id === oid) {
          var ski = cert.generateSubjectKeyIdentifier().getBytes();
          return forge.util.hexToBytes(ext.subjectKeyIdentifier) === ski;
        }
      }
      return false;
    };
    return cert;
  };
  pki.certificateFromAsn1 = function(obj, computeHash) {
    var capture = {};
    var errors2 = [];
    if (!asn1.validate(obj, x509CertificateValidator, capture, errors2)) {
      var error = new Error("Cannot read X.509 certificate. " + "ASN.1 object is not an X509v3 Certificate.");
      error.errors = errors2;
      throw error;
    }
    var oid = asn1.derToOid(capture.publicKeyOid);
    if (oid !== pki.oids.rsaEncryption) {
      throw new Error("Cannot read public key. OID is not RSA.");
    }
    var cert = pki.createCertificate();
    cert.version = capture.certVersion ? capture.certVersion.charCodeAt(0) : 0;
    var serial = forge.util.createBuffer(capture.certSerialNumber);
    cert.serialNumber = serial.toHex();
    cert.signatureOid = forge.asn1.derToOid(capture.certSignatureOid);
    cert.signatureParameters = _readSignatureParameters(cert.signatureOid, capture.certSignatureParams, true);
    cert.siginfo.algorithmOid = forge.asn1.derToOid(capture.certinfoSignatureOid);
    cert.siginfo.parameters = _readSignatureParameters(cert.siginfo.algorithmOid, capture.certinfoSignatureParams, false);
    cert.signature = capture.certSignature;
    var validity = [];
    if (capture.certValidity1UTCTime !== undefined) {
      validity.push(asn1.utcTimeToDate(capture.certValidity1UTCTime));
    }
    if (capture.certValidity2GeneralizedTime !== undefined) {
      validity.push(asn1.generalizedTimeToDate(capture.certValidity2GeneralizedTime));
    }
    if (capture.certValidity3UTCTime !== undefined) {
      validity.push(asn1.utcTimeToDate(capture.certValidity3UTCTime));
    }
    if (capture.certValidity4GeneralizedTime !== undefined) {
      validity.push(asn1.generalizedTimeToDate(capture.certValidity4GeneralizedTime));
    }
    if (validity.length > 2) {
      throw new Error("Cannot read notBefore/notAfter validity times; more " + "than two times were provided in the certificate.");
    }
    if (validity.length < 2) {
      throw new Error("Cannot read notBefore/notAfter validity times; they " + "were not provided as either UTCTime or GeneralizedTime.");
    }
    cert.validity.notBefore = validity[0];
    cert.validity.notAfter = validity[1];
    cert.tbsCertificate = capture.tbsCertificate;
    if (computeHash) {
      cert.md = _createSignatureDigest({
        signatureOid: cert.signatureOid,
        type: "certificate"
      });
      var bytes = asn1.toDer(cert.tbsCertificate);
      cert.md.update(bytes.getBytes());
    }
    var imd = forge.md.sha1.create();
    var ibytes = asn1.toDer(capture.certIssuer);
    imd.update(ibytes.getBytes());
    cert.issuer.getField = function(sn) {
      return _getAttribute(cert.issuer, sn);
    };
    cert.issuer.addField = function(attr) {
      _fillMissingFields([attr]);
      cert.issuer.attributes.push(attr);
    };
    cert.issuer.attributes = pki.RDNAttributesAsArray(capture.certIssuer);
    if (capture.certIssuerUniqueId) {
      cert.issuer.uniqueId = capture.certIssuerUniqueId;
    }
    cert.issuer.hash = imd.digest().toHex();
    var smd = forge.md.sha1.create();
    var sbytes = asn1.toDer(capture.certSubject);
    smd.update(sbytes.getBytes());
    cert.subject.getField = function(sn) {
      return _getAttribute(cert.subject, sn);
    };
    cert.subject.addField = function(attr) {
      _fillMissingFields([attr]);
      cert.subject.attributes.push(attr);
    };
    cert.subject.attributes = pki.RDNAttributesAsArray(capture.certSubject);
    if (capture.certSubjectUniqueId) {
      cert.subject.uniqueId = capture.certSubjectUniqueId;
    }
    cert.subject.hash = smd.digest().toHex();
    if (capture.certExtensions) {
      cert.extensions = pki.certificateExtensionsFromAsn1(capture.certExtensions);
    } else {
      cert.extensions = [];
    }
    cert.publicKey = pki.publicKeyFromAsn1(capture.subjectPublicKeyInfo);
    return cert;
  };
  pki.certificateExtensionsFromAsn1 = function(exts) {
    var rval = [];
    for (var i = 0;i < exts.value.length; ++i) {
      var extseq = exts.value[i];
      for (var ei = 0;ei < extseq.value.length; ++ei) {
        rval.push(pki.certificateExtensionFromAsn1(extseq.value[ei]));
      }
    }
    return rval;
  };
  pki.certificateExtensionFromAsn1 = function(ext) {
    var e = {};
    e.id = asn1.derToOid(ext.value[0].value);
    e.critical = false;
    if (ext.value[1].type === asn1.Type.BOOLEAN) {
      e.critical = ext.value[1].value.charCodeAt(0) !== 0;
      e.value = ext.value[2].value;
    } else {
      e.value = ext.value[1].value;
    }
    if (e.id in oids) {
      e.name = oids[e.id];
      if (e.name === "keyUsage") {
        var ev = asn1.fromDer(e.value);
        var b2 = 0;
        var b3 = 0;
        if (ev.value.length > 1) {
          b2 = ev.value.charCodeAt(1);
          b3 = ev.value.length > 2 ? ev.value.charCodeAt(2) : 0;
        }
        e.digitalSignature = (b2 & 128) === 128;
        e.nonRepudiation = (b2 & 64) === 64;
        e.keyEncipherment = (b2 & 32) === 32;
        e.dataEncipherment = (b2 & 16) === 16;
        e.keyAgreement = (b2 & 8) === 8;
        e.keyCertSign = (b2 & 4) === 4;
        e.cRLSign = (b2 & 2) === 2;
        e.encipherOnly = (b2 & 1) === 1;
        e.decipherOnly = (b3 & 128) === 128;
      } else if (e.name === "basicConstraints") {
        var ev = asn1.fromDer(e.value);
        if (ev.value.length > 0 && ev.value[0].type === asn1.Type.BOOLEAN) {
          e.cA = ev.value[0].value.charCodeAt(0) !== 0;
        } else {
          e.cA = false;
        }
        var value = null;
        if (ev.value.length > 0 && ev.value[0].type === asn1.Type.INTEGER) {
          value = ev.value[0].value;
        } else if (ev.value.length > 1) {
          value = ev.value[1].value;
        }
        if (value !== null) {
          e.pathLenConstraint = asn1.derToInteger(value);
        }
      } else if (e.name === "extKeyUsage") {
        var ev = asn1.fromDer(e.value);
        for (var vi = 0;vi < ev.value.length; ++vi) {
          var oid = asn1.derToOid(ev.value[vi].value);
          if (oid in oids) {
            e[oids[oid]] = true;
          } else {
            e[oid] = true;
          }
        }
      } else if (e.name === "nsCertType") {
        var ev = asn1.fromDer(e.value);
        var b2 = 0;
        if (ev.value.length > 1) {
          b2 = ev.value.charCodeAt(1);
        }
        e.client = (b2 & 128) === 128;
        e.server = (b2 & 64) === 64;
        e.email = (b2 & 32) === 32;
        e.objsign = (b2 & 16) === 16;
        e.reserved = (b2 & 8) === 8;
        e.sslCA = (b2 & 4) === 4;
        e.emailCA = (b2 & 2) === 2;
        e.objCA = (b2 & 1) === 1;
      } else if (e.name === "subjectAltName" || e.name === "issuerAltName") {
        e.altNames = [];
        var gn;
        var ev = asn1.fromDer(e.value);
        for (var n = 0;n < ev.value.length; ++n) {
          gn = ev.value[n];
          var altName = {
            type: gn.type,
            value: gn.value
          };
          e.altNames.push(altName);
          switch (gn.type) {
            case 1:
            case 2:
            case 6:
              break;
            case 7:
              altName.ip = forge.util.bytesToIP(gn.value);
              break;
            case 8:
              altName.oid = asn1.derToOid(gn.value);
              break;
            default:
          }
        }
      } else if (e.name === "subjectKeyIdentifier") {
        var ev = asn1.fromDer(e.value);
        e.subjectKeyIdentifier = forge.util.bytesToHex(ev.value);
      }
    }
    return e;
  };
  pki.certificationRequestFromAsn1 = function(obj, computeHash) {
    var capture = {};
    var errors2 = [];
    if (!asn1.validate(obj, certificationRequestValidator, capture, errors2)) {
      var error = new Error("Cannot read PKCS#10 certificate request. " + "ASN.1 object is not a PKCS#10 CertificationRequest.");
      error.errors = errors2;
      throw error;
    }
    var oid = asn1.derToOid(capture.publicKeyOid);
    if (oid !== pki.oids.rsaEncryption) {
      throw new Error("Cannot read public key. OID is not RSA.");
    }
    var csr = pki.createCertificationRequest();
    csr.version = capture.csrVersion ? capture.csrVersion.charCodeAt(0) : 0;
    csr.signatureOid = forge.asn1.derToOid(capture.csrSignatureOid);
    csr.signatureParameters = _readSignatureParameters(csr.signatureOid, capture.csrSignatureParams, true);
    csr.siginfo.algorithmOid = forge.asn1.derToOid(capture.csrSignatureOid);
    csr.siginfo.parameters = _readSignatureParameters(csr.siginfo.algorithmOid, capture.csrSignatureParams, false);
    csr.signature = capture.csrSignature;
    csr.certificationRequestInfo = capture.certificationRequestInfo;
    if (computeHash) {
      csr.md = _createSignatureDigest({
        signatureOid: csr.signatureOid,
        type: "certification request"
      });
      var bytes = asn1.toDer(csr.certificationRequestInfo);
      csr.md.update(bytes.getBytes());
    }
    var smd = forge.md.sha1.create();
    csr.subject.getField = function(sn) {
      return _getAttribute(csr.subject, sn);
    };
    csr.subject.addField = function(attr) {
      _fillMissingFields([attr]);
      csr.subject.attributes.push(attr);
    };
    csr.subject.attributes = pki.RDNAttributesAsArray(capture.certificationRequestInfoSubject, smd);
    csr.subject.hash = smd.digest().toHex();
    csr.publicKey = pki.publicKeyFromAsn1(capture.subjectPublicKeyInfo);
    csr.getAttribute = function(sn) {
      return _getAttribute(csr, sn);
    };
    csr.addAttribute = function(attr) {
      _fillMissingFields([attr]);
      csr.attributes.push(attr);
    };
    csr.attributes = pki.CRIAttributesAsArray(capture.certificationRequestInfoAttributes || []);
    return csr;
  };
  pki.createCertificationRequest = function() {
    var csr = {};
    csr.version = 0;
    csr.signatureOid = null;
    csr.signature = null;
    csr.siginfo = {};
    csr.siginfo.algorithmOid = null;
    csr.subject = {};
    csr.subject.getField = function(sn) {
      return _getAttribute(csr.subject, sn);
    };
    csr.subject.addField = function(attr) {
      _fillMissingFields([attr]);
      csr.subject.attributes.push(attr);
    };
    csr.subject.attributes = [];
    csr.subject.hash = null;
    csr.publicKey = null;
    csr.attributes = [];
    csr.getAttribute = function(sn) {
      return _getAttribute(csr, sn);
    };
    csr.addAttribute = function(attr) {
      _fillMissingFields([attr]);
      csr.attributes.push(attr);
    };
    csr.md = null;
    csr.setSubject = function(attrs) {
      _fillMissingFields(attrs);
      csr.subject.attributes = attrs;
      csr.subject.hash = null;
    };
    csr.setAttributes = function(attrs) {
      _fillMissingFields(attrs);
      csr.attributes = attrs;
    };
    csr.sign = function(key, md) {
      csr.md = md || forge.md.sha1.create();
      var algorithmOid = oids[csr.md.algorithm + "WithRSAEncryption"];
      if (!algorithmOid) {
        var error = new Error("Could not compute certification request digest. " + "Unknown message digest algorithm OID.");
        error.algorithm = csr.md.algorithm;
        throw error;
      }
      csr.signatureOid = csr.siginfo.algorithmOid = algorithmOid;
      csr.certificationRequestInfo = pki.getCertificationRequestInfo(csr);
      var bytes = asn1.toDer(csr.certificationRequestInfo);
      csr.md.update(bytes.getBytes());
      csr.signature = key.sign(csr.md);
    };
    csr.verify = function() {
      var rval = false;
      var md = csr.md;
      if (md === null) {
        md = _createSignatureDigest({
          signatureOid: csr.signatureOid,
          type: "certification request"
        });
        var cri = csr.certificationRequestInfo || pki.getCertificationRequestInfo(csr);
        var bytes = asn1.toDer(cri);
        md.update(bytes.getBytes());
      }
      if (md !== null) {
        rval = _verifySignature({
          certificate: csr,
          md,
          signature: csr.signature
        });
      }
      return rval;
    };
    return csr;
  };
  function _dnToAsn1(obj) {
    var rval = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
    var attr, set;
    var attrs = obj.attributes;
    for (var i = 0;i < attrs.length; ++i) {
      attr = attrs[i];
      var value = attr.value;
      var valueTagClass = asn1.Type.PRINTABLESTRING;
      if ("valueTagClass" in attr) {
        valueTagClass = attr.valueTagClass;
        if (valueTagClass === asn1.Type.UTF8) {
          value = forge.util.encodeUtf8(value);
        }
      }
      set = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(attr.type).getBytes()),
          asn1.create(asn1.Class.UNIVERSAL, valueTagClass, false, value)
        ])
      ]);
      rval.value.push(set);
    }
    return rval;
  }
  function _fillMissingFields(attrs) {
    var attr;
    for (var i = 0;i < attrs.length; ++i) {
      attr = attrs[i];
      if (typeof attr.name === "undefined") {
        if (attr.type && attr.type in pki.oids) {
          attr.name = pki.oids[attr.type];
        } else if (attr.shortName && attr.shortName in _shortNames) {
          attr.name = pki.oids[_shortNames[attr.shortName]];
        }
      }
      if (typeof attr.type === "undefined") {
        if (attr.name && attr.name in pki.oids) {
          attr.type = pki.oids[attr.name];
        } else {
          var error = new Error("Attribute type not specified.");
          error.attribute = attr;
          throw error;
        }
      }
      if (typeof attr.shortName === "undefined") {
        if (attr.name && attr.name in _shortNames) {
          attr.shortName = _shortNames[attr.name];
        }
      }
      if (attr.type === oids.extensionRequest) {
        attr.valueConstructed = true;
        attr.valueTagClass = asn1.Type.SEQUENCE;
        if (!attr.value && attr.extensions) {
          attr.value = [];
          for (var ei = 0;ei < attr.extensions.length; ++ei) {
            attr.value.push(pki.certificateExtensionToAsn1(_fillMissingExtensionFields(attr.extensions[ei])));
          }
        }
      }
      if (typeof attr.value === "undefined") {
        var error = new Error("Attribute value not specified.");
        error.attribute = attr;
        throw error;
      }
    }
  }
  function _fillMissingExtensionFields(e, options) {
    options = options || {};
    if (typeof e.name === "undefined") {
      if (e.id && e.id in pki.oids) {
        e.name = pki.oids[e.id];
      }
    }
    if (typeof e.id === "undefined") {
      if (e.name && e.name in pki.oids) {
        e.id = pki.oids[e.name];
      } else {
        var error = new Error("Extension ID not specified.");
        error.extension = e;
        throw error;
      }
    }
    if (typeof e.value !== "undefined") {
      return e;
    }
    if (e.name === "keyUsage") {
      var unused = 0;
      var b2 = 0;
      var b3 = 0;
      if (e.digitalSignature) {
        b2 |= 128;
        unused = 7;
      }
      if (e.nonRepudiation) {
        b2 |= 64;
        unused = 6;
      }
      if (e.keyEncipherment) {
        b2 |= 32;
        unused = 5;
      }
      if (e.dataEncipherment) {
        b2 |= 16;
        unused = 4;
      }
      if (e.keyAgreement) {
        b2 |= 8;
        unused = 3;
      }
      if (e.keyCertSign) {
        b2 |= 4;
        unused = 2;
      }
      if (e.cRLSign) {
        b2 |= 2;
        unused = 1;
      }
      if (e.encipherOnly) {
        b2 |= 1;
        unused = 0;
      }
      if (e.decipherOnly) {
        b3 |= 128;
        unused = 7;
      }
      var value = String.fromCharCode(unused);
      if (b3 !== 0) {
        value += String.fromCharCode(b2) + String.fromCharCode(b3);
      } else if (b2 !== 0) {
        value += String.fromCharCode(b2);
      }
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, value);
    } else if (e.name === "basicConstraints") {
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
      if (e.cA) {
        e.value.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BOOLEAN, false, String.fromCharCode(255)));
      }
      if ("pathLenConstraint" in e) {
        e.value.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(e.pathLenConstraint).getBytes()));
      }
    } else if (e.name === "extKeyUsage") {
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
      var seq = e.value.value;
      for (var key in e) {
        if (e[key] !== true) {
          continue;
        }
        if (key in oids) {
          seq.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(oids[key]).getBytes()));
        } else if (key.indexOf(".") !== -1) {
          seq.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(key).getBytes()));
        }
      }
    } else if (e.name === "nsCertType") {
      var unused = 0;
      var b2 = 0;
      if (e.client) {
        b2 |= 128;
        unused = 7;
      }
      if (e.server) {
        b2 |= 64;
        unused = 6;
      }
      if (e.email) {
        b2 |= 32;
        unused = 5;
      }
      if (e.objsign) {
        b2 |= 16;
        unused = 4;
      }
      if (e.reserved) {
        b2 |= 8;
        unused = 3;
      }
      if (e.sslCA) {
        b2 |= 4;
        unused = 2;
      }
      if (e.emailCA) {
        b2 |= 2;
        unused = 1;
      }
      if (e.objCA) {
        b2 |= 1;
        unused = 0;
      }
      var value = String.fromCharCode(unused);
      if (b2 !== 0) {
        value += String.fromCharCode(b2);
      }
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, value);
    } else if (e.name === "subjectAltName" || e.name === "issuerAltName") {
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
      var altName;
      for (var n = 0;n < e.altNames.length; ++n) {
        altName = e.altNames[n];
        var value = altName.value;
        if (altName.type === 7 && altName.ip) {
          value = forge.util.bytesFromIP(altName.ip);
          if (value === null) {
            var error = new Error('Extension "ip" value is not a valid IPv4 or IPv6 address.');
            error.extension = e;
            throw error;
          }
        } else if (altName.type === 8) {
          if (altName.oid) {
            value = asn1.oidToDer(asn1.oidToDer(altName.oid));
          } else {
            value = asn1.oidToDer(value);
          }
        }
        e.value.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, altName.type, false, value));
      }
    } else if (e.name === "nsComment" && options.cert) {
      if (!/^[\x00-\x7F]*$/.test(e.comment) || e.comment.length < 1 || e.comment.length > 128) {
        throw new Error('Invalid "nsComment" content.');
      }
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.IA5STRING, false, e.comment);
    } else if (e.name === "subjectKeyIdentifier" && options.cert) {
      var ski = options.cert.generateSubjectKeyIdentifier();
      e.subjectKeyIdentifier = ski.toHex();
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, ski.getBytes());
    } else if (e.name === "authorityKeyIdentifier" && options.cert) {
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
      var seq = e.value.value;
      if (e.keyIdentifier) {
        var keyIdentifier = e.keyIdentifier === true ? options.cert.generateSubjectKeyIdentifier().getBytes() : e.keyIdentifier;
        seq.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, false, keyIdentifier));
      }
      if (e.authorityCertIssuer) {
        var authorityCertIssuer = [
          asn1.create(asn1.Class.CONTEXT_SPECIFIC, 4, true, [
            _dnToAsn1(e.authorityCertIssuer === true ? options.cert.issuer : e.authorityCertIssuer)
          ])
        ];
        seq.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, authorityCertIssuer));
      }
      if (e.serialNumber) {
        var serialNumber = forge.util.hexToBytes(e.serialNumber === true ? options.cert.serialNumber : e.serialNumber);
        seq.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, false, serialNumber));
      }
    } else if (e.name === "cRLDistributionPoints") {
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
      var seq = e.value.value;
      var subSeq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
      var fullNameGeneralNames = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, []);
      var altName;
      for (var n = 0;n < e.altNames.length; ++n) {
        altName = e.altNames[n];
        var value = altName.value;
        if (altName.type === 7 && altName.ip) {
          value = forge.util.bytesFromIP(altName.ip);
          if (value === null) {
            var error = new Error('Extension "ip" value is not a valid IPv4 or IPv6 address.');
            error.extension = e;
            throw error;
          }
        } else if (altName.type === 8) {
          if (altName.oid) {
            value = asn1.oidToDer(asn1.oidToDer(altName.oid));
          } else {
            value = asn1.oidToDer(value);
          }
        }
        fullNameGeneralNames.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, altName.type, false, value));
      }
      subSeq.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [fullNameGeneralNames]));
      seq.push(subSeq);
    }
    if (typeof e.value === "undefined") {
      var error = new Error("Extension value not specified.");
      error.extension = e;
      throw error;
    }
    return e;
  }
  function _signatureParametersToAsn1(oid, params) {
    switch (oid) {
      case oids["RSASSA-PSS"]:
        var parts = [];
        if (params.hash.algorithmOid !== undefined) {
          parts.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(params.hash.algorithmOid).getBytes()),
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
            ])
          ]));
        }
        if (params.mgf.algorithmOid !== undefined) {
          parts.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(params.mgf.algorithmOid).getBytes()),
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(params.mgf.hash.algorithmOid).getBytes()),
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
              ])
            ])
          ]));
        }
        if (params.saltLength !== undefined) {
          parts.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(params.saltLength).getBytes())
          ]));
        }
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, parts);
      default:
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "");
    }
  }
  function _CRIAttributesToAsn1(csr) {
    var rval = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, []);
    if (csr.attributes.length === 0) {
      return rval;
    }
    var attrs = csr.attributes;
    for (var i = 0;i < attrs.length; ++i) {
      var attr = attrs[i];
      var value = attr.value;
      var valueTagClass = asn1.Type.UTF8;
      if ("valueTagClass" in attr) {
        valueTagClass = attr.valueTagClass;
      }
      if (valueTagClass === asn1.Type.UTF8) {
        value = forge.util.encodeUtf8(value);
      }
      var valueConstructed = false;
      if ("valueConstructed" in attr) {
        valueConstructed = attr.valueConstructed;
      }
      var seq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(attr.type).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [
          asn1.create(asn1.Class.UNIVERSAL, valueTagClass, valueConstructed, value)
        ])
      ]);
      rval.value.push(seq);
    }
    return rval;
  }
  var jan_1_1950 = new Date("1950-01-01T00:00:00Z");
  var jan_1_2050 = new Date("2050-01-01T00:00:00Z");
  function _dateToAsn1(date) {
    if (date >= jan_1_1950 && date < jan_1_2050) {
      return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.UTCTIME, false, asn1.dateToUtcTime(date));
    } else {
      return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.GENERALIZEDTIME, false, asn1.dateToGeneralizedTime(date));
    }
  }
  pki.getTBSCertificate = function(cert) {
    var notBefore = _dateToAsn1(cert.validity.notBefore);
    var notAfter = _dateToAsn1(cert.validity.notAfter);
    var tbs = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(cert.version).getBytes())
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, forge.util.hexToBytes(cert.serialNumber)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(cert.siginfo.algorithmOid).getBytes()),
        _signatureParametersToAsn1(cert.siginfo.algorithmOid, cert.siginfo.parameters)
      ]),
      _dnToAsn1(cert.issuer),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        notBefore,
        notAfter
      ]),
      _dnToAsn1(cert.subject),
      pki.publicKeyToAsn1(cert.publicKey)
    ]);
    if (cert.issuer.uniqueId) {
      tbs.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, String.fromCharCode(0) + cert.issuer.uniqueId)
      ]));
    }
    if (cert.subject.uniqueId) {
      tbs.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, String.fromCharCode(0) + cert.subject.uniqueId)
      ]));
    }
    if (cert.extensions.length > 0) {
      tbs.value.push(pki.certificateExtensionsToAsn1(cert.extensions));
    }
    return tbs;
  };
  pki.getCertificationRequestInfo = function(csr) {
    var cri = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(csr.version).getBytes()),
      _dnToAsn1(csr.subject),
      pki.publicKeyToAsn1(csr.publicKey),
      _CRIAttributesToAsn1(csr)
    ]);
    return cri;
  };
  pki.distinguishedNameToAsn1 = function(dn) {
    return _dnToAsn1(dn);
  };
  pki.certificateToAsn1 = function(cert) {
    var tbsCertificate = cert.tbsCertificate || pki.getTBSCertificate(cert);
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      tbsCertificate,
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(cert.signatureOid).getBytes()),
        _signatureParametersToAsn1(cert.signatureOid, cert.signatureParameters)
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, String.fromCharCode(0) + cert.signature)
    ]);
  };
  pki.certificateExtensionsToAsn1 = function(exts) {
    var rval = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 3, true, []);
    var seq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
    rval.value.push(seq);
    for (var i = 0;i < exts.length; ++i) {
      seq.value.push(pki.certificateExtensionToAsn1(exts[i]));
    }
    return rval;
  };
  pki.certificateExtensionToAsn1 = function(ext) {
    var extseq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
    extseq.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(ext.id).getBytes()));
    if (ext.critical) {
      extseq.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BOOLEAN, false, String.fromCharCode(255)));
    }
    var value = ext.value;
    if (typeof ext.value !== "string") {
      value = asn1.toDer(value).getBytes();
    }
    extseq.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, value));
    return extseq;
  };
  pki.certificationRequestToAsn1 = function(csr) {
    var cri = csr.certificationRequestInfo || pki.getCertificationRequestInfo(csr);
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      cri,
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(csr.signatureOid).getBytes()),
        _signatureParametersToAsn1(csr.signatureOid, csr.signatureParameters)
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, String.fromCharCode(0) + csr.signature)
    ]);
  };
  pki.createCaStore = function(certs) {
    var caStore = {
      certs: {}
    };
    caStore.getIssuer = function(cert2) {
      var rval = getBySubject(cert2.issuer);
      return rval;
    };
    caStore.addCertificate = function(cert2) {
      if (typeof cert2 === "string") {
        cert2 = forge.pki.certificateFromPem(cert2);
      }
      ensureSubjectHasHash(cert2.subject);
      if (!caStore.hasCertificate(cert2)) {
        if (cert2.subject.hash in caStore.certs) {
          var tmp = caStore.certs[cert2.subject.hash];
          if (!forge.util.isArray(tmp)) {
            tmp = [tmp];
          }
          tmp.push(cert2);
          caStore.certs[cert2.subject.hash] = tmp;
        } else {
          caStore.certs[cert2.subject.hash] = cert2;
        }
      }
    };
    caStore.hasCertificate = function(cert2) {
      if (typeof cert2 === "string") {
        cert2 = forge.pki.certificateFromPem(cert2);
      }
      var match2 = getBySubject(cert2.subject);
      if (!match2) {
        return false;
      }
      if (!forge.util.isArray(match2)) {
        match2 = [match2];
      }
      var der1 = asn1.toDer(pki.certificateToAsn1(cert2)).getBytes();
      for (var i2 = 0;i2 < match2.length; ++i2) {
        var der2 = asn1.toDer(pki.certificateToAsn1(match2[i2])).getBytes();
        if (der1 === der2) {
          return true;
        }
      }
      return false;
    };
    caStore.listAllCertificates = function() {
      var certList = [];
      for (var hash in caStore.certs) {
        if (caStore.certs.hasOwnProperty(hash)) {
          var value = caStore.certs[hash];
          if (!forge.util.isArray(value)) {
            certList.push(value);
          } else {
            for (var i2 = 0;i2 < value.length; ++i2) {
              certList.push(value[i2]);
            }
          }
        }
      }
      return certList;
    };
    caStore.removeCertificate = function(cert2) {
      var result;
      if (typeof cert2 === "string") {
        cert2 = forge.pki.certificateFromPem(cert2);
      }
      ensureSubjectHasHash(cert2.subject);
      if (!caStore.hasCertificate(cert2)) {
        return null;
      }
      var match2 = getBySubject(cert2.subject);
      if (!forge.util.isArray(match2)) {
        result = caStore.certs[cert2.subject.hash];
        delete caStore.certs[cert2.subject.hash];
        return result;
      }
      var der1 = asn1.toDer(pki.certificateToAsn1(cert2)).getBytes();
      for (var i2 = 0;i2 < match2.length; ++i2) {
        var der2 = asn1.toDer(pki.certificateToAsn1(match2[i2])).getBytes();
        if (der1 === der2) {
          result = match2[i2];
          match2.splice(i2, 1);
        }
      }
      if (match2.length === 0) {
        delete caStore.certs[cert2.subject.hash];
      }
      return result;
    };
    function getBySubject(subject) {
      ensureSubjectHasHash(subject);
      return caStore.certs[subject.hash] || null;
    }
    function ensureSubjectHasHash(subject) {
      if (!subject.hash) {
        var md = forge.md.sha1.create();
        subject.attributes = pki.RDNAttributesAsArray(_dnToAsn1(subject), md);
        subject.hash = md.digest().toHex();
      }
    }
    if (certs) {
      for (var i = 0;i < certs.length; ++i) {
        var cert = certs[i];
        caStore.addCertificate(cert);
      }
    }
    return caStore;
  };
  pki.certificateError = {
    bad_certificate: "forge.pki.BadCertificate",
    unsupported_certificate: "forge.pki.UnsupportedCertificate",
    certificate_revoked: "forge.pki.CertificateRevoked",
    certificate_expired: "forge.pki.CertificateExpired",
    certificate_unknown: "forge.pki.CertificateUnknown",
    unknown_ca: "forge.pki.UnknownCertificateAuthority"
  };
  pki.verifyCertificateChain = function(caStore, chain, options) {
    if (typeof options === "function") {
      options = { verify: options };
    }
    options = options || {};
    chain = chain.slice(0);
    var certs = chain.slice(0);
    var validityCheckDate = options.validityCheckDate;
    if (typeof validityCheckDate === "undefined") {
      validityCheckDate = new Date;
    }
    var first = true;
    var error = null;
    var depth = 0;
    do {
      var cert = chain.shift();
      var parent = null;
      var selfSigned = false;
      if (validityCheckDate) {
        if (validityCheckDate < cert.validity.notBefore || validityCheckDate > cert.validity.notAfter) {
          error = {
            message: "Certificate is not valid yet or has expired.",
            error: pki.certificateError.certificate_expired,
            notBefore: cert.validity.notBefore,
            notAfter: cert.validity.notAfter,
            now: validityCheckDate
          };
        }
      }
      if (error === null) {
        parent = chain[0] || caStore.getIssuer(cert);
        if (parent === null) {
          if (cert.isIssuer(cert)) {
            selfSigned = true;
            parent = cert;
          }
        }
        if (parent) {
          var parents = parent;
          if (!forge.util.isArray(parents)) {
            parents = [parents];
          }
          var verified = false;
          while (!verified && parents.length > 0) {
            parent = parents.shift();
            try {
              verified = parent.verify(cert);
            } catch (ex) {}
          }
          if (!verified) {
            error = {
              message: "Certificate signature is invalid.",
              error: pki.certificateError.bad_certificate
            };
          }
        }
        if (error === null && (!parent || selfSigned) && !caStore.hasCertificate(cert)) {
          error = {
            message: "Certificate is not trusted.",
            error: pki.certificateError.unknown_ca
          };
        }
      }
      if (error === null && parent && !cert.isIssuer(parent)) {
        error = {
          message: "Certificate issuer is invalid.",
          error: pki.certificateError.bad_certificate
        };
      }
      if (error === null) {
        var se = {
          keyUsage: true,
          basicConstraints: true
        };
        for (var i = 0;error === null && i < cert.extensions.length; ++i) {
          var ext = cert.extensions[i];
          if (ext.critical && !(ext.name in se)) {
            error = {
              message: "Certificate has an unsupported critical extension.",
              error: pki.certificateError.unsupported_certificate
            };
          }
        }
      }
      if (error === null && (!first || chain.length === 0 && (!parent || selfSigned))) {
        var bcExt = cert.getExtension("basicConstraints");
        var keyUsageExt = cert.getExtension("keyUsage");
        if (keyUsageExt !== null) {
          if (!keyUsageExt.keyCertSign || bcExt === null) {
            error = {
              message: "Certificate keyUsage or basicConstraints conflict " + "or indicate that the certificate is not a CA. " + "If the certificate is the only one in the chain or " + "isn't the first then the certificate must be a " + "valid CA.",
              error: pki.certificateError.bad_certificate
            };
          }
        }
        if (error === null && bcExt === null) {
          error = {
            message: "Certificate is missing basicConstraints extension and cannot " + "be used as a CA.",
            error: pki.certificateError.bad_certificate
          };
        }
        if (error === null && bcExt !== null && !bcExt.cA) {
          error = {
            message: "Certificate basicConstraints indicates the certificate " + "is not a CA.",
            error: pki.certificateError.bad_certificate
          };
        }
        if (error === null && keyUsageExt !== null && "pathLenConstraint" in bcExt) {
          var pathLen = depth - 1;
          if (pathLen > bcExt.pathLenConstraint) {
            error = {
              message: "Certificate basicConstraints pathLenConstraint violated.",
              error: pki.certificateError.bad_certificate
            };
          }
        }
      }
      var vfd = error === null ? true : error.error;
      var ret = options.verify ? options.verify(vfd, depth, certs) : vfd;
      if (ret === true) {
        error = null;
      } else {
        if (vfd === true) {
          error = {
            message: "The application rejected the certificate.",
            error: pki.certificateError.bad_certificate
          };
        }
        if (ret || ret === 0) {
          if (typeof ret === "object" && !forge.util.isArray(ret)) {
            if (ret.message) {
              error.message = ret.message;
            }
            if (ret.error) {
              error.error = ret.error;
            }
          } else if (typeof ret === "string") {
            error.error = ret;
          }
        }
        throw error;
      }
      first = false;
      ++depth;
    } while (chain.length > 0);
    return true;
  };
});

// node_modules/node-forge/lib/pkcs12.js
var require_pkcs12 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_asn1();
  require_hmac();
  require_oids();
  require_pkcs7asn1();
  require_pbe();
  require_random();
  require_rsa();
  require_sha1();
  require_util();
  require_x509();
  var asn1 = forge.asn1;
  var pki = forge.pki;
  var p12 = module.exports = forge.pkcs12 = forge.pkcs12 || {};
  var contentInfoValidator = {
    name: "ContentInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "ContentInfo.contentType",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OID,
      constructed: false,
      capture: "contentType"
    }, {
      name: "ContentInfo.content",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      constructed: true,
      captureAsn1: "content"
    }]
  };
  var pfxValidator = {
    name: "PFX",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [
      {
        name: "PFX.version",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "version"
      },
      contentInfoValidator,
      {
        name: "PFX.macData",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        optional: true,
        captureAsn1: "mac",
        value: [{
          name: "PFX.macData.mac",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "PFX.macData.mac.digestAlgorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SEQUENCE,
            constructed: true,
            value: [{
              name: "PFX.macData.mac.digestAlgorithm.algorithm",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.OID,
              constructed: false,
              capture: "macAlgorithm"
            }, {
              name: "PFX.macData.mac.digestAlgorithm.parameters",
              optional: true,
              tagClass: asn1.Class.UNIVERSAL,
              captureAsn1: "macAlgorithmParameters"
            }]
          }, {
            name: "PFX.macData.mac.digest",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OCTETSTRING,
            constructed: false,
            capture: "macDigest"
          }]
        }, {
          name: "PFX.macData.macSalt",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OCTETSTRING,
          constructed: false,
          capture: "macSalt"
        }, {
          name: "PFX.macData.iterations",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          optional: true,
          capture: "macIterations"
        }]
      }
    ]
  };
  var safeBagValidator = {
    name: "SafeBag",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "SafeBag.bagId",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OID,
      constructed: false,
      capture: "bagId"
    }, {
      name: "SafeBag.bagValue",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      constructed: true,
      captureAsn1: "bagValue"
    }, {
      name: "SafeBag.bagAttributes",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SET,
      constructed: true,
      optional: true,
      capture: "bagAttributes"
    }]
  };
  var attributeValidator = {
    name: "Attribute",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "Attribute.attrId",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OID,
      constructed: false,
      capture: "oid"
    }, {
      name: "Attribute.attrValues",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SET,
      constructed: true,
      capture: "values"
    }]
  };
  var certBagValidator = {
    name: "CertBag",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "CertBag.certId",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OID,
      constructed: false,
      capture: "certId"
    }, {
      name: "CertBag.certValue",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      constructed: true,
      value: [{
        name: "CertBag.certValue[0]",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Class.OCTETSTRING,
        constructed: false,
        capture: "cert"
      }]
    }]
  };
  function _getBagsByAttribute(safeContents, attrName, attrValue, bagType) {
    var result = [];
    for (var i = 0;i < safeContents.length; i++) {
      for (var j = 0;j < safeContents[i].safeBags.length; j++) {
        var bag = safeContents[i].safeBags[j];
        if (bagType !== undefined && bag.type !== bagType) {
          continue;
        }
        if (attrName === null) {
          result.push(bag);
          continue;
        }
        if (bag.attributes[attrName] !== undefined && bag.attributes[attrName].indexOf(attrValue) >= 0) {
          result.push(bag);
        }
      }
    }
    return result;
  }
  p12.pkcs12FromAsn1 = function(obj, strict, password) {
    if (typeof strict === "string") {
      password = strict;
      strict = true;
    } else if (strict === undefined) {
      strict = true;
    }
    var capture = {};
    var errors2 = [];
    if (!asn1.validate(obj, pfxValidator, capture, errors2)) {
      var error = new Error("Cannot read PKCS#12 PFX. " + "ASN.1 object is not an PKCS#12 PFX.");
      error.errors = error;
      throw error;
    }
    var pfx = {
      version: capture.version.charCodeAt(0),
      safeContents: [],
      getBags: function(filter) {
        var rval = {};
        var localKeyId;
        if ("localKeyId" in filter) {
          localKeyId = filter.localKeyId;
        } else if ("localKeyIdHex" in filter) {
          localKeyId = forge.util.hexToBytes(filter.localKeyIdHex);
        }
        if (localKeyId === undefined && !("friendlyName" in filter) && "bagType" in filter) {
          rval[filter.bagType] = _getBagsByAttribute(pfx.safeContents, null, null, filter.bagType);
        }
        if (localKeyId !== undefined) {
          rval.localKeyId = _getBagsByAttribute(pfx.safeContents, "localKeyId", localKeyId, filter.bagType);
        }
        if ("friendlyName" in filter) {
          rval.friendlyName = _getBagsByAttribute(pfx.safeContents, "friendlyName", filter.friendlyName, filter.bagType);
        }
        return rval;
      },
      getBagsByFriendlyName: function(friendlyName, bagType) {
        return _getBagsByAttribute(pfx.safeContents, "friendlyName", friendlyName, bagType);
      },
      getBagsByLocalKeyId: function(localKeyId, bagType) {
        return _getBagsByAttribute(pfx.safeContents, "localKeyId", localKeyId, bagType);
      }
    };
    if (capture.version.charCodeAt(0) !== 3) {
      var error = new Error("PKCS#12 PFX of version other than 3 not supported.");
      error.version = capture.version.charCodeAt(0);
      throw error;
    }
    if (asn1.derToOid(capture.contentType) !== pki.oids.data) {
      var error = new Error("Only PKCS#12 PFX in password integrity mode supported.");
      error.oid = asn1.derToOid(capture.contentType);
      throw error;
    }
    var data = capture.content.value[0];
    if (data.tagClass !== asn1.Class.UNIVERSAL || data.type !== asn1.Type.OCTETSTRING) {
      throw new Error("PKCS#12 authSafe content data is not an OCTET STRING.");
    }
    data = _decodePkcs7Data(data);
    if (capture.mac) {
      var md = null;
      var macKeyBytes = 0;
      var macAlgorithm = asn1.derToOid(capture.macAlgorithm);
      switch (macAlgorithm) {
        case pki.oids.sha1:
          md = forge.md.sha1.create();
          macKeyBytes = 20;
          break;
        case pki.oids.sha256:
          md = forge.md.sha256.create();
          macKeyBytes = 32;
          break;
        case pki.oids.sha384:
          md = forge.md.sha384.create();
          macKeyBytes = 48;
          break;
        case pki.oids.sha512:
          md = forge.md.sha512.create();
          macKeyBytes = 64;
          break;
        case pki.oids.md5:
          md = forge.md.md5.create();
          macKeyBytes = 16;
          break;
      }
      if (md === null) {
        throw new Error("PKCS#12 uses unsupported MAC algorithm: " + macAlgorithm);
      }
      var macSalt = new forge.util.ByteBuffer(capture.macSalt);
      var macIterations = "macIterations" in capture ? parseInt(forge.util.bytesToHex(capture.macIterations), 16) : 1;
      var macKey = p12.generateKey(password, macSalt, 3, macIterations, macKeyBytes, md);
      var mac = forge.hmac.create();
      mac.start(md, macKey);
      mac.update(data.value);
      var macValue = mac.getMac();
      if (macValue.getBytes() !== capture.macDigest) {
        throw new Error("PKCS#12 MAC could not be verified. Invalid password?");
      }
    } else if (Array.isArray(obj.value) && obj.value.length > 2) {
      throw new Error("Invalid PKCS#12. macData field present but MAC was not validated.");
    }
    _decodeAuthenticatedSafe(pfx, data.value, strict, password);
    return pfx;
  };
  function _decodePkcs7Data(data) {
    if (data.composed || data.constructed) {
      var value = forge.util.createBuffer();
      for (var i = 0;i < data.value.length; ++i) {
        value.putBytes(data.value[i].value);
      }
      data.composed = data.constructed = false;
      data.value = value.getBytes();
    }
    return data;
  }
  function _decodeAuthenticatedSafe(pfx, authSafe, strict, password) {
    authSafe = asn1.fromDer(authSafe, strict);
    if (authSafe.tagClass !== asn1.Class.UNIVERSAL || authSafe.type !== asn1.Type.SEQUENCE || authSafe.constructed !== true) {
      throw new Error("PKCS#12 AuthenticatedSafe expected to be a " + "SEQUENCE OF ContentInfo");
    }
    for (var i = 0;i < authSafe.value.length; i++) {
      var contentInfo = authSafe.value[i];
      var capture = {};
      var errors2 = [];
      if (!asn1.validate(contentInfo, contentInfoValidator, capture, errors2)) {
        var error = new Error("Cannot read ContentInfo.");
        error.errors = errors2;
        throw error;
      }
      var obj = {
        encrypted: false
      };
      var safeContents = null;
      var data = capture.content.value[0];
      switch (asn1.derToOid(capture.contentType)) {
        case pki.oids.data:
          if (data.tagClass !== asn1.Class.UNIVERSAL || data.type !== asn1.Type.OCTETSTRING) {
            throw new Error("PKCS#12 SafeContents Data is not an OCTET STRING.");
          }
          safeContents = _decodePkcs7Data(data).value;
          break;
        case pki.oids.encryptedData:
          safeContents = _decryptSafeContents(data, password);
          obj.encrypted = true;
          break;
        default:
          var error = new Error("Unsupported PKCS#12 contentType.");
          error.contentType = asn1.derToOid(capture.contentType);
          throw error;
      }
      obj.safeBags = _decodeSafeContents(safeContents, strict, password);
      pfx.safeContents.push(obj);
    }
  }
  function _decryptSafeContents(data, password) {
    var capture = {};
    var errors2 = [];
    if (!asn1.validate(data, forge.pkcs7.asn1.encryptedDataValidator, capture, errors2)) {
      var error = new Error("Cannot read EncryptedContentInfo.");
      error.errors = errors2;
      throw error;
    }
    var oid = asn1.derToOid(capture.contentType);
    if (oid !== pki.oids.data) {
      var error = new Error("PKCS#12 EncryptedContentInfo ContentType is not Data.");
      error.oid = oid;
      throw error;
    }
    oid = asn1.derToOid(capture.encAlgorithm);
    var cipher = pki.pbe.getCipher(oid, capture.encParameter, password);
    var encryptedContentAsn1 = _decodePkcs7Data(capture.encryptedContentAsn1);
    var encrypted = forge.util.createBuffer(encryptedContentAsn1.value);
    cipher.update(encrypted);
    if (!cipher.finish()) {
      throw new Error("Failed to decrypt PKCS#12 SafeContents.");
    }
    return cipher.output.getBytes();
  }
  function _decodeSafeContents(safeContents, strict, password) {
    if (!strict && safeContents.length === 0) {
      return [];
    }
    safeContents = asn1.fromDer(safeContents, strict);
    if (safeContents.tagClass !== asn1.Class.UNIVERSAL || safeContents.type !== asn1.Type.SEQUENCE || safeContents.constructed !== true) {
      throw new Error("PKCS#12 SafeContents expected to be a SEQUENCE OF SafeBag.");
    }
    var res = [];
    for (var i = 0;i < safeContents.value.length; i++) {
      var safeBag = safeContents.value[i];
      var capture = {};
      var errors2 = [];
      if (!asn1.validate(safeBag, safeBagValidator, capture, errors2)) {
        var error = new Error("Cannot read SafeBag.");
        error.errors = errors2;
        throw error;
      }
      var bag = {
        type: asn1.derToOid(capture.bagId),
        attributes: _decodeBagAttributes(capture.bagAttributes)
      };
      res.push(bag);
      var validator2, decoder;
      var bagAsn1 = capture.bagValue.value[0];
      switch (bag.type) {
        case pki.oids.pkcs8ShroudedKeyBag:
          bagAsn1 = pki.decryptPrivateKeyInfo(bagAsn1, password);
          if (bagAsn1 === null) {
            throw new Error("Unable to decrypt PKCS#8 ShroudedKeyBag, wrong password?");
          }
        case pki.oids.keyBag:
          try {
            bag.key = pki.privateKeyFromAsn1(bagAsn1);
          } catch (e) {
            bag.key = null;
            bag.asn1 = bagAsn1;
          }
          continue;
        case pki.oids.certBag:
          validator2 = certBagValidator;
          decoder = function() {
            if (asn1.derToOid(capture.certId) !== pki.oids.x509Certificate) {
              var error2 = new Error("Unsupported certificate type, only X.509 supported.");
              error2.oid = asn1.derToOid(capture.certId);
              throw error2;
            }
            var certAsn1 = asn1.fromDer(capture.cert, strict);
            try {
              bag.cert = pki.certificateFromAsn1(certAsn1, true);
            } catch (e) {
              bag.cert = null;
              bag.asn1 = certAsn1;
            }
          };
          break;
        default:
          var error = new Error("Unsupported PKCS#12 SafeBag type.");
          error.oid = bag.type;
          throw error;
      }
      if (validator2 !== undefined && !asn1.validate(bagAsn1, validator2, capture, errors2)) {
        var error = new Error("Cannot read PKCS#12 " + validator2.name);
        error.errors = errors2;
        throw error;
      }
      decoder();
    }
    return res;
  }
  function _decodeBagAttributes(attributes) {
    var decodedAttrs = {};
    if (attributes !== undefined) {
      for (var i = 0;i < attributes.length; ++i) {
        var capture = {};
        var errors2 = [];
        if (!asn1.validate(attributes[i], attributeValidator, capture, errors2)) {
          var error = new Error("Cannot read PKCS#12 BagAttribute.");
          error.errors = errors2;
          throw error;
        }
        var oid = asn1.derToOid(capture.oid);
        if (pki.oids[oid] === undefined) {
          continue;
        }
        decodedAttrs[pki.oids[oid]] = [];
        for (var j = 0;j < capture.values.length; ++j) {
          decodedAttrs[pki.oids[oid]].push(capture.values[j].value);
        }
      }
    }
    return decodedAttrs;
  }
  p12.toPkcs12Asn1 = function(key, cert, password, options) {
    options = options || {};
    options.saltSize = options.saltSize || 8;
    options.count = options.count || 2048;
    options.algorithm = options.algorithm || options.encAlgorithm || "aes128";
    if (!("useMac" in options)) {
      options.useMac = true;
    }
    if (!("localKeyId" in options)) {
      options.localKeyId = null;
    }
    if (!("generateLocalKeyId" in options)) {
      options.generateLocalKeyId = true;
    }
    var localKeyId = options.localKeyId;
    var bagAttrs;
    if (localKeyId !== null) {
      localKeyId = forge.util.hexToBytes(localKeyId);
    } else if (options.generateLocalKeyId) {
      if (cert) {
        var pairedCert = forge.util.isArray(cert) ? cert[0] : cert;
        if (typeof pairedCert === "string") {
          pairedCert = pki.certificateFromPem(pairedCert);
        }
        var sha1 = forge.md.sha1.create();
        sha1.update(asn1.toDer(pki.certificateToAsn1(pairedCert)).getBytes());
        localKeyId = sha1.digest().getBytes();
      } else {
        localKeyId = forge.random.getBytes(20);
      }
    }
    var attrs = [];
    if (localKeyId !== null) {
      attrs.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.localKeyId).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, localKeyId)
        ])
      ]));
    }
    if ("friendlyName" in options) {
      attrs.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.friendlyName).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BMPSTRING, false, options.friendlyName)
        ])
      ]));
    }
    if (attrs.length > 0) {
      bagAttrs = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, attrs);
    }
    var contents = [];
    var chain = [];
    if (cert !== null) {
      if (forge.util.isArray(cert)) {
        chain = cert;
      } else {
        chain = [cert];
      }
    }
    var certSafeBags = [];
    for (var i = 0;i < chain.length; ++i) {
      cert = chain[i];
      if (typeof cert === "string") {
        cert = pki.certificateFromPem(cert);
      }
      var certBagAttrs = i === 0 ? bagAttrs : undefined;
      var certAsn1 = pki.certificateToAsn1(cert);
      var certSafeBag = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.certBag).getBytes()),
        asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.x509Certificate).getBytes()),
            asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, asn1.toDer(certAsn1).getBytes())
            ])
          ])
        ]),
        certBagAttrs
      ]);
      certSafeBags.push(certSafeBag);
    }
    if (certSafeBags.length > 0) {
      var certSafeContents = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, certSafeBags);
      var certCI = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.data).getBytes()),
        asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, asn1.toDer(certSafeContents).getBytes())
        ])
      ]);
      contents.push(certCI);
    }
    var keyBag = null;
    if (key !== null) {
      var pkAsn1 = pki.wrapRsaPrivateKey(pki.privateKeyToAsn1(key));
      if (password === null) {
        keyBag = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.keyBag).getBytes()),
          asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
            pkAsn1
          ]),
          bagAttrs
        ]);
      } else {
        keyBag = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.pkcs8ShroudedKeyBag).getBytes()),
          asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
            pki.encryptPrivateKeyInfo(pkAsn1, password, options)
          ]),
          bagAttrs
        ]);
      }
      var keySafeContents = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [keyBag]);
      var keyCI = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.data).getBytes()),
        asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, asn1.toDer(keySafeContents).getBytes())
        ])
      ]);
      contents.push(keyCI);
    }
    var safe = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, contents);
    var macData;
    if (options.useMac) {
      var sha1 = forge.md.sha1.create();
      var macSalt = new forge.util.ByteBuffer(forge.random.getBytes(options.saltSize));
      var count = options.count;
      var key = p12.generateKey(password, macSalt, 3, count, 20);
      var mac = forge.hmac.create();
      mac.start(sha1, key);
      mac.update(asn1.toDer(safe).getBytes());
      var macValue = mac.getMac();
      macData = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.sha1).getBytes()),
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
          ]),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, macValue.getBytes())
        ]),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, macSalt.getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(count).getBytes())
      ]);
    }
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(3).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.data).getBytes()),
        asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, asn1.toDer(safe).getBytes())
        ])
      ]),
      macData
    ]);
  };
  p12.generateKey = forge.pbe.generatePkcs12Key;
});

// node_modules/node-forge/lib/pki.js
var require_pki = __commonJS((exports, module) => {
  var forge = require_forge();
  require_asn1();
  require_oids();
  require_pbe();
  require_pem();
  require_pbkdf2();
  require_pkcs12();
  require_pss();
  require_rsa();
  require_util();
  require_x509();
  var asn1 = forge.asn1;
  var pki = module.exports = forge.pki = forge.pki || {};
  pki.pemToDer = function(pem) {
    var msg = forge.pem.decode(pem)[0];
    if (msg.procType && msg.procType.type === "ENCRYPTED") {
      throw new Error("Could not convert PEM to DER; PEM is encrypted.");
    }
    return forge.util.createBuffer(msg.body);
  };
  pki.privateKeyFromPem = function(pem) {
    var msg = forge.pem.decode(pem)[0];
    if (msg.type !== "PRIVATE KEY" && msg.type !== "RSA PRIVATE KEY") {
      var error = new Error("Could not convert private key from PEM; PEM " + 'header type is not "PRIVATE KEY" or "RSA PRIVATE KEY".');
      error.headerType = msg.type;
      throw error;
    }
    if (msg.procType && msg.procType.type === "ENCRYPTED") {
      throw new Error("Could not convert private key from PEM; PEM is encrypted.");
    }
    var obj = asn1.fromDer(msg.body);
    return pki.privateKeyFromAsn1(obj);
  };
  pki.privateKeyToPem = function(key, maxline) {
    var msg = {
      type: "RSA PRIVATE KEY",
      body: asn1.toDer(pki.privateKeyToAsn1(key)).getBytes()
    };
    return forge.pem.encode(msg, { maxline });
  };
  pki.privateKeyInfoToPem = function(pki2, maxline) {
    var msg = {
      type: "PRIVATE KEY",
      body: asn1.toDer(pki2).getBytes()
    };
    return forge.pem.encode(msg, { maxline });
  };
});

// node_modules/node-forge/lib/tls.js
var require_tls = __commonJS((exports, module) => {
  var forge = require_forge();
  require_asn1();
  require_hmac();
  require_md5();
  require_pem();
  require_pki();
  require_random();
  require_sha1();
  require_util();
  var prf_TLS1 = function(secret, label, seed, length) {
    var rval = forge.util.createBuffer();
    var idx = secret.length >> 1;
    var slen = idx + (secret.length & 1);
    var s1 = secret.substr(0, slen);
    var s2 = secret.substr(idx, slen);
    var ai = forge.util.createBuffer();
    var hmac = forge.hmac.create();
    seed = label + seed;
    var md5itr = Math.ceil(length / 16);
    var sha1itr = Math.ceil(length / 20);
    hmac.start("MD5", s1);
    var md5bytes = forge.util.createBuffer();
    ai.putBytes(seed);
    for (var i = 0;i < md5itr; ++i) {
      hmac.start(null, null);
      hmac.update(ai.getBytes());
      ai.putBuffer(hmac.digest());
      hmac.start(null, null);
      hmac.update(ai.bytes() + seed);
      md5bytes.putBuffer(hmac.digest());
    }
    hmac.start("SHA1", s2);
    var sha1bytes = forge.util.createBuffer();
    ai.clear();
    ai.putBytes(seed);
    for (var i = 0;i < sha1itr; ++i) {
      hmac.start(null, null);
      hmac.update(ai.getBytes());
      ai.putBuffer(hmac.digest());
      hmac.start(null, null);
      hmac.update(ai.bytes() + seed);
      sha1bytes.putBuffer(hmac.digest());
    }
    rval.putBytes(forge.util.xorBytes(md5bytes.getBytes(), sha1bytes.getBytes(), length));
    return rval;
  };
  var hmac_sha1 = function(key2, seqNum, record) {
    var hmac = forge.hmac.create();
    hmac.start("SHA1", key2);
    var b = forge.util.createBuffer();
    b.putInt32(seqNum[0]);
    b.putInt32(seqNum[1]);
    b.putByte(record.type);
    b.putByte(record.version.major);
    b.putByte(record.version.minor);
    b.putInt16(record.length);
    b.putBytes(record.fragment.bytes());
    hmac.update(b.getBytes());
    return hmac.digest().getBytes();
  };
  var deflate = function(c, record, s) {
    var rval = false;
    try {
      var bytes = c.deflate(record.fragment.getBytes());
      record.fragment = forge.util.createBuffer(bytes);
      record.length = bytes.length;
      rval = true;
    } catch (ex) {}
    return rval;
  };
  var inflate = function(c, record, s) {
    var rval = false;
    try {
      var bytes = c.inflate(record.fragment.getBytes());
      record.fragment = forge.util.createBuffer(bytes);
      record.length = bytes.length;
      rval = true;
    } catch (ex) {}
    return rval;
  };
  var readVector = function(b, lenBytes) {
    var len = 0;
    switch (lenBytes) {
      case 1:
        len = b.getByte();
        break;
      case 2:
        len = b.getInt16();
        break;
      case 3:
        len = b.getInt24();
        break;
      case 4:
        len = b.getInt32();
        break;
    }
    return forge.util.createBuffer(b.getBytes(len));
  };
  var writeVector = function(b, lenBytes, v) {
    b.putInt(v.length(), lenBytes << 3);
    b.putBuffer(v);
  };
  var tls = {};
  tls.Versions = {
    TLS_1_0: { major: 3, minor: 1 },
    TLS_1_1: { major: 3, minor: 2 },
    TLS_1_2: { major: 3, minor: 3 }
  };
  tls.SupportedVersions = [
    tls.Versions.TLS_1_1,
    tls.Versions.TLS_1_0
  ];
  tls.Version = tls.SupportedVersions[0];
  tls.MaxFragment = 16384 - 1024;
  tls.ConnectionEnd = {
    server: 0,
    client: 1
  };
  tls.PRFAlgorithm = {
    tls_prf_sha256: 0
  };
  tls.BulkCipherAlgorithm = {
    none: null,
    rc4: 0,
    des3: 1,
    aes: 2
  };
  tls.CipherType = {
    stream: 0,
    block: 1,
    aead: 2
  };
  tls.MACAlgorithm = {
    none: null,
    hmac_md5: 0,
    hmac_sha1: 1,
    hmac_sha256: 2,
    hmac_sha384: 3,
    hmac_sha512: 4
  };
  tls.CompressionMethod = {
    none: 0,
    deflate: 1
  };
  tls.ContentType = {
    change_cipher_spec: 20,
    alert: 21,
    handshake: 22,
    application_data: 23,
    heartbeat: 24
  };
  tls.HandshakeType = {
    hello_request: 0,
    client_hello: 1,
    server_hello: 2,
    certificate: 11,
    server_key_exchange: 12,
    certificate_request: 13,
    server_hello_done: 14,
    certificate_verify: 15,
    client_key_exchange: 16,
    finished: 20
  };
  tls.Alert = {};
  tls.Alert.Level = {
    warning: 1,
    fatal: 2
  };
  tls.Alert.Description = {
    close_notify: 0,
    unexpected_message: 10,
    bad_record_mac: 20,
    decryption_failed: 21,
    record_overflow: 22,
    decompression_failure: 30,
    handshake_failure: 40,
    bad_certificate: 42,
    unsupported_certificate: 43,
    certificate_revoked: 44,
    certificate_expired: 45,
    certificate_unknown: 46,
    illegal_parameter: 47,
    unknown_ca: 48,
    access_denied: 49,
    decode_error: 50,
    decrypt_error: 51,
    export_restriction: 60,
    protocol_version: 70,
    insufficient_security: 71,
    internal_error: 80,
    user_canceled: 90,
    no_renegotiation: 100
  };
  tls.HeartbeatMessageType = {
    heartbeat_request: 1,
    heartbeat_response: 2
  };
  tls.CipherSuites = {};
  tls.getCipherSuite = function(twoBytes) {
    var rval = null;
    for (var key2 in tls.CipherSuites) {
      var cs = tls.CipherSuites[key2];
      if (cs.id[0] === twoBytes.charCodeAt(0) && cs.id[1] === twoBytes.charCodeAt(1)) {
        rval = cs;
        break;
      }
    }
    return rval;
  };
  tls.handleUnexpected = function(c, record) {
    var ignore = !c.open && c.entity === tls.ConnectionEnd.client;
    if (!ignore) {
      c.error(c, {
        message: "Unexpected message. Received TLS record out of order.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.unexpected_message
        }
      });
    }
  };
  tls.handleHelloRequest = function(c, record, length) {
    if (!c.handshaking && c.handshakes > 0) {
      tls.queue(c, tls.createAlert(c, {
        level: tls.Alert.Level.warning,
        description: tls.Alert.Description.no_renegotiation
      }));
      tls.flush(c);
    }
    c.process();
  };
  tls.parseHelloMessage = function(c, record, length) {
    var msg = null;
    var client = c.entity === tls.ConnectionEnd.client;
    if (length < 38) {
      c.error(c, {
        message: client ? "Invalid ServerHello message. Message too short." : "Invalid ClientHello message. Message too short.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.illegal_parameter
        }
      });
    } else {
      var b = record.fragment;
      var remaining = b.length();
      msg = {
        version: {
          major: b.getByte(),
          minor: b.getByte()
        },
        random: forge.util.createBuffer(b.getBytes(32)),
        session_id: readVector(b, 1),
        extensions: []
      };
      if (client) {
        msg.cipher_suite = b.getBytes(2);
        msg.compression_method = b.getByte();
      } else {
        msg.cipher_suites = readVector(b, 2);
        msg.compression_methods = readVector(b, 1);
      }
      remaining = length - (remaining - b.length());
      if (remaining > 0) {
        var exts = readVector(b, 2);
        while (exts.length() > 0) {
          msg.extensions.push({
            type: [exts.getByte(), exts.getByte()],
            data: readVector(exts, 2)
          });
        }
        if (!client) {
          for (var i = 0;i < msg.extensions.length; ++i) {
            var ext = msg.extensions[i];
            if (ext.type[0] === 0 && ext.type[1] === 0) {
              var snl = readVector(ext.data, 2);
              while (snl.length() > 0) {
                var snType = snl.getByte();
                if (snType !== 0) {
                  break;
                }
                c.session.extensions.server_name.serverNameList.push(readVector(snl, 2).getBytes());
              }
            }
          }
        }
      }
      if (c.session.version) {
        if (msg.version.major !== c.session.version.major || msg.version.minor !== c.session.version.minor) {
          return c.error(c, {
            message: "TLS version change is disallowed during renegotiation.",
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.protocol_version
            }
          });
        }
      }
      if (client) {
        c.session.cipherSuite = tls.getCipherSuite(msg.cipher_suite);
      } else {
        var tmp = forge.util.createBuffer(msg.cipher_suites.bytes());
        while (tmp.length() > 0) {
          c.session.cipherSuite = tls.getCipherSuite(tmp.getBytes(2));
          if (c.session.cipherSuite !== null) {
            break;
          }
        }
      }
      if (c.session.cipherSuite === null) {
        return c.error(c, {
          message: "No cipher suites in common.",
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.handshake_failure
          },
          cipherSuite: forge.util.bytesToHex(msg.cipher_suite)
        });
      }
      if (client) {
        c.session.compressionMethod = msg.compression_method;
      } else {
        c.session.compressionMethod = tls.CompressionMethod.none;
      }
    }
    return msg;
  };
  tls.createSecurityParameters = function(c, msg) {
    var client = c.entity === tls.ConnectionEnd.client;
    var msgRandom = msg.random.bytes();
    var cRandom = client ? c.session.sp.client_random : msgRandom;
    var sRandom = client ? msgRandom : tls.createRandom().getBytes();
    c.session.sp = {
      entity: c.entity,
      prf_algorithm: tls.PRFAlgorithm.tls_prf_sha256,
      bulk_cipher_algorithm: null,
      cipher_type: null,
      enc_key_length: null,
      block_length: null,
      fixed_iv_length: null,
      record_iv_length: null,
      mac_algorithm: null,
      mac_length: null,
      mac_key_length: null,
      compression_algorithm: c.session.compressionMethod,
      pre_master_secret: null,
      master_secret: null,
      client_random: cRandom,
      server_random: sRandom
    };
  };
  tls.handleServerHello = function(c, record, length) {
    var msg = tls.parseHelloMessage(c, record, length);
    if (c.fail) {
      return;
    }
    if (msg.version.minor <= c.version.minor) {
      c.version.minor = msg.version.minor;
    } else {
      return c.error(c, {
        message: "Incompatible TLS version.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.protocol_version
        }
      });
    }
    c.session.version = c.version;
    var sessionId = msg.session_id.bytes();
    if (sessionId.length > 0 && sessionId === c.session.id) {
      c.expect = SCC;
      c.session.resuming = true;
      c.session.sp.server_random = msg.random.bytes();
    } else {
      c.expect = SCE;
      c.session.resuming = false;
      tls.createSecurityParameters(c, msg);
    }
    c.session.id = sessionId;
    c.process();
  };
  tls.handleClientHello = function(c, record, length) {
    var msg = tls.parseHelloMessage(c, record, length);
    if (c.fail) {
      return;
    }
    var sessionId = msg.session_id.bytes();
    var session = null;
    if (c.sessionCache) {
      session = c.sessionCache.getSession(sessionId);
      if (session === null) {
        sessionId = "";
      } else if (session.version.major !== msg.version.major || session.version.minor > msg.version.minor) {
        session = null;
        sessionId = "";
      }
    }
    if (sessionId.length === 0) {
      sessionId = forge.random.getBytes(32);
    }
    c.session.id = sessionId;
    c.session.clientHelloVersion = msg.version;
    c.session.sp = {};
    if (session) {
      c.version = c.session.version = session.version;
      c.session.sp = session.sp;
    } else {
      var version;
      for (var i = 1;i < tls.SupportedVersions.length; ++i) {
        version = tls.SupportedVersions[i];
        if (version.minor <= msg.version.minor) {
          break;
        }
      }
      c.version = { major: version.major, minor: version.minor };
      c.session.version = c.version;
    }
    if (session !== null) {
      c.expect = CCC;
      c.session.resuming = true;
      c.session.sp.client_random = msg.random.bytes();
    } else {
      c.expect = c.verifyClient !== false ? CCE : CKE;
      c.session.resuming = false;
      tls.createSecurityParameters(c, msg);
    }
    c.open = true;
    tls.queue(c, tls.createRecord(c, {
      type: tls.ContentType.handshake,
      data: tls.createServerHello(c)
    }));
    if (c.session.resuming) {
      tls.queue(c, tls.createRecord(c, {
        type: tls.ContentType.change_cipher_spec,
        data: tls.createChangeCipherSpec()
      }));
      c.state.pending = tls.createConnectionState(c);
      c.state.current.write = c.state.pending.write;
      tls.queue(c, tls.createRecord(c, {
        type: tls.ContentType.handshake,
        data: tls.createFinished(c)
      }));
    } else {
      tls.queue(c, tls.createRecord(c, {
        type: tls.ContentType.handshake,
        data: tls.createCertificate(c)
      }));
      if (!c.fail) {
        tls.queue(c, tls.createRecord(c, {
          type: tls.ContentType.handshake,
          data: tls.createServerKeyExchange(c)
        }));
        if (c.verifyClient !== false) {
          tls.queue(c, tls.createRecord(c, {
            type: tls.ContentType.handshake,
            data: tls.createCertificateRequest(c)
          }));
        }
        tls.queue(c, tls.createRecord(c, {
          type: tls.ContentType.handshake,
          data: tls.createServerHelloDone(c)
        }));
      }
    }
    tls.flush(c);
    c.process();
  };
  tls.handleCertificate = function(c, record, length) {
    if (length < 3) {
      return c.error(c, {
        message: "Invalid Certificate message. Message too short.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.illegal_parameter
        }
      });
    }
    var b = record.fragment;
    var msg = {
      certificate_list: readVector(b, 3)
    };
    var cert, asn1;
    var certs = [];
    try {
      while (msg.certificate_list.length() > 0) {
        cert = readVector(msg.certificate_list, 3);
        asn1 = forge.asn1.fromDer(cert);
        cert = forge.pki.certificateFromAsn1(asn1, true);
        certs.push(cert);
      }
    } catch (ex) {
      return c.error(c, {
        message: "Could not parse certificate list.",
        cause: ex,
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.bad_certificate
        }
      });
    }
    var client = c.entity === tls.ConnectionEnd.client;
    if ((client || c.verifyClient === true) && certs.length === 0) {
      c.error(c, {
        message: client ? "No server certificate provided." : "No client certificate provided.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.illegal_parameter
        }
      });
    } else if (certs.length === 0) {
      c.expect = client ? SKE : CKE;
    } else {
      if (client) {
        c.session.serverCertificate = certs[0];
      } else {
        c.session.clientCertificate = certs[0];
      }
      if (tls.verifyCertificateChain(c, certs)) {
        c.expect = client ? SKE : CKE;
      }
    }
    c.process();
  };
  tls.handleServerKeyExchange = function(c, record, length) {
    if (length > 0) {
      return c.error(c, {
        message: "Invalid key parameters. Only RSA is supported.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.unsupported_certificate
        }
      });
    }
    c.expect = SCR;
    c.process();
  };
  tls.handleClientKeyExchange = function(c, record, length) {
    if (length < 48) {
      return c.error(c, {
        message: "Invalid key parameters. Only RSA is supported.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.unsupported_certificate
        }
      });
    }
    var b = record.fragment;
    var msg = {
      enc_pre_master_secret: readVector(b, 2).getBytes()
    };
    var privateKey = null;
    if (c.getPrivateKey) {
      try {
        privateKey = c.getPrivateKey(c, c.session.serverCertificate);
        privateKey = forge.pki.privateKeyFromPem(privateKey);
      } catch (ex) {
        c.error(c, {
          message: "Could not get private key.",
          cause: ex,
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.internal_error
          }
        });
      }
    }
    if (privateKey === null) {
      return c.error(c, {
        message: "No private key set.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.internal_error
        }
      });
    }
    try {
      var sp = c.session.sp;
      sp.pre_master_secret = privateKey.decrypt(msg.enc_pre_master_secret);
      var version = c.session.clientHelloVersion;
      if (version.major !== sp.pre_master_secret.charCodeAt(0) || version.minor !== sp.pre_master_secret.charCodeAt(1)) {
        throw new Error("TLS version rollback attack detected.");
      }
    } catch (ex) {
      sp.pre_master_secret = forge.random.getBytes(48);
    }
    c.expect = CCC;
    if (c.session.clientCertificate !== null) {
      c.expect = CCV;
    }
    c.process();
  };
  tls.handleCertificateRequest = function(c, record, length) {
    if (length < 3) {
      return c.error(c, {
        message: "Invalid CertificateRequest. Message too short.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.illegal_parameter
        }
      });
    }
    var b = record.fragment;
    var msg = {
      certificate_types: readVector(b, 1),
      certificate_authorities: readVector(b, 2)
    };
    c.session.certificateRequest = msg;
    c.expect = SHD;
    c.process();
  };
  tls.handleCertificateVerify = function(c, record, length) {
    if (length < 2) {
      return c.error(c, {
        message: "Invalid CertificateVerify. Message too short.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.illegal_parameter
        }
      });
    }
    var b = record.fragment;
    b.read -= 4;
    var msgBytes = b.bytes();
    b.read += 4;
    var msg = {
      signature: readVector(b, 2).getBytes()
    };
    var verify = forge.util.createBuffer();
    verify.putBuffer(c.session.md5.digest());
    verify.putBuffer(c.session.sha1.digest());
    verify = verify.getBytes();
    try {
      var cert = c.session.clientCertificate;
      if (!cert.publicKey.verify(verify, msg.signature, "NONE")) {
        throw new Error("CertificateVerify signature does not match.");
      }
      c.session.md5.update(msgBytes);
      c.session.sha1.update(msgBytes);
    } catch (ex) {
      return c.error(c, {
        message: "Bad signature in CertificateVerify.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.handshake_failure
        }
      });
    }
    c.expect = CCC;
    c.process();
  };
  tls.handleServerHelloDone = function(c, record, length) {
    if (length > 0) {
      return c.error(c, {
        message: "Invalid ServerHelloDone message. Invalid length.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.record_overflow
        }
      });
    }
    if (c.serverCertificate === null) {
      var error = {
        message: "No server certificate provided. Not enough security.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.insufficient_security
        }
      };
      var depth = 0;
      var ret = c.verify(c, error.alert.description, depth, []);
      if (ret !== true) {
        if (ret || ret === 0) {
          if (typeof ret === "object" && !forge.util.isArray(ret)) {
            if (ret.message) {
              error.message = ret.message;
            }
            if (ret.alert) {
              error.alert.description = ret.alert;
            }
          } else if (typeof ret === "number") {
            error.alert.description = ret;
          }
        }
        return c.error(c, error);
      }
    }
    if (c.session.certificateRequest !== null) {
      record = tls.createRecord(c, {
        type: tls.ContentType.handshake,
        data: tls.createCertificate(c)
      });
      tls.queue(c, record);
    }
    record = tls.createRecord(c, {
      type: tls.ContentType.handshake,
      data: tls.createClientKeyExchange(c)
    });
    tls.queue(c, record);
    c.expect = SER;
    var callback = function(c2, signature) {
      if (c2.session.certificateRequest !== null && c2.session.clientCertificate !== null) {
        tls.queue(c2, tls.createRecord(c2, {
          type: tls.ContentType.handshake,
          data: tls.createCertificateVerify(c2, signature)
        }));
      }
      tls.queue(c2, tls.createRecord(c2, {
        type: tls.ContentType.change_cipher_spec,
        data: tls.createChangeCipherSpec()
      }));
      c2.state.pending = tls.createConnectionState(c2);
      c2.state.current.write = c2.state.pending.write;
      tls.queue(c2, tls.createRecord(c2, {
        type: tls.ContentType.handshake,
        data: tls.createFinished(c2)
      }));
      c2.expect = SCC;
      tls.flush(c2);
      c2.process();
    };
    if (c.session.certificateRequest === null || c.session.clientCertificate === null) {
      return callback(c, null);
    }
    tls.getClientSignature(c, callback);
  };
  tls.handleChangeCipherSpec = function(c, record) {
    if (record.fragment.getByte() !== 1) {
      return c.error(c, {
        message: "Invalid ChangeCipherSpec message received.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.illegal_parameter
        }
      });
    }
    var client = c.entity === tls.ConnectionEnd.client;
    if (c.session.resuming && client || !c.session.resuming && !client) {
      c.state.pending = tls.createConnectionState(c);
    }
    c.state.current.read = c.state.pending.read;
    if (!c.session.resuming && client || c.session.resuming && !client) {
      c.state.pending = null;
    }
    c.expect = client ? SFI : CFI;
    c.process();
  };
  tls.handleFinished = function(c, record, length) {
    var b = record.fragment;
    b.read -= 4;
    var msgBytes = b.bytes();
    b.read += 4;
    var vd = record.fragment.getBytes();
    b = forge.util.createBuffer();
    b.putBuffer(c.session.md5.digest());
    b.putBuffer(c.session.sha1.digest());
    var client = c.entity === tls.ConnectionEnd.client;
    var label = client ? "server finished" : "client finished";
    var sp = c.session.sp;
    var vdl = 12;
    var prf = prf_TLS1;
    b = prf(sp.master_secret, label, b.getBytes(), vdl);
    if (b.getBytes() !== vd) {
      return c.error(c, {
        message: "Invalid verify_data in Finished message.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.decrypt_error
        }
      });
    }
    c.session.md5.update(msgBytes);
    c.session.sha1.update(msgBytes);
    if (c.session.resuming && client || !c.session.resuming && !client) {
      tls.queue(c, tls.createRecord(c, {
        type: tls.ContentType.change_cipher_spec,
        data: tls.createChangeCipherSpec()
      }));
      c.state.current.write = c.state.pending.write;
      c.state.pending = null;
      tls.queue(c, tls.createRecord(c, {
        type: tls.ContentType.handshake,
        data: tls.createFinished(c)
      }));
    }
    c.expect = client ? SAD : CAD;
    c.handshaking = false;
    ++c.handshakes;
    c.peerCertificate = client ? c.session.serverCertificate : c.session.clientCertificate;
    tls.flush(c);
    c.isConnected = true;
    c.connected(c);
    c.process();
  };
  tls.handleAlert = function(c, record) {
    var b = record.fragment;
    var alert = {
      level: b.getByte(),
      description: b.getByte()
    };
    var msg;
    switch (alert.description) {
      case tls.Alert.Description.close_notify:
        msg = "Connection closed.";
        break;
      case tls.Alert.Description.unexpected_message:
        msg = "Unexpected message.";
        break;
      case tls.Alert.Description.bad_record_mac:
        msg = "Bad record MAC.";
        break;
      case tls.Alert.Description.decryption_failed:
        msg = "Decryption failed.";
        break;
      case tls.Alert.Description.record_overflow:
        msg = "Record overflow.";
        break;
      case tls.Alert.Description.decompression_failure:
        msg = "Decompression failed.";
        break;
      case tls.Alert.Description.handshake_failure:
        msg = "Handshake failure.";
        break;
      case tls.Alert.Description.bad_certificate:
        msg = "Bad certificate.";
        break;
      case tls.Alert.Description.unsupported_certificate:
        msg = "Unsupported certificate.";
        break;
      case tls.Alert.Description.certificate_revoked:
        msg = "Certificate revoked.";
        break;
      case tls.Alert.Description.certificate_expired:
        msg = "Certificate expired.";
        break;
      case tls.Alert.Description.certificate_unknown:
        msg = "Certificate unknown.";
        break;
      case tls.Alert.Description.illegal_parameter:
        msg = "Illegal parameter.";
        break;
      case tls.Alert.Description.unknown_ca:
        msg = "Unknown certificate authority.";
        break;
      case tls.Alert.Description.access_denied:
        msg = "Access denied.";
        break;
      case tls.Alert.Description.decode_error:
        msg = "Decode error.";
        break;
      case tls.Alert.Description.decrypt_error:
        msg = "Decrypt error.";
        break;
      case tls.Alert.Description.export_restriction:
        msg = "Export restriction.";
        break;
      case tls.Alert.Description.protocol_version:
        msg = "Unsupported protocol version.";
        break;
      case tls.Alert.Description.insufficient_security:
        msg = "Insufficient security.";
        break;
      case tls.Alert.Description.internal_error:
        msg = "Internal error.";
        break;
      case tls.Alert.Description.user_canceled:
        msg = "User canceled.";
        break;
      case tls.Alert.Description.no_renegotiation:
        msg = "Renegotiation not supported.";
        break;
      default:
        msg = "Unknown error.";
        break;
    }
    if (alert.description === tls.Alert.Description.close_notify) {
      return c.close();
    }
    c.error(c, {
      message: msg,
      send: false,
      origin: c.entity === tls.ConnectionEnd.client ? "server" : "client",
      alert
    });
    c.process();
  };
  tls.handleHandshake = function(c, record) {
    var b = record.fragment;
    var type = b.getByte();
    var length = b.getInt24();
    if (length > b.length()) {
      c.fragmented = record;
      record.fragment = forge.util.createBuffer();
      b.read -= 4;
      return c.process();
    }
    c.fragmented = null;
    b.read -= 4;
    var bytes = b.bytes(length + 4);
    b.read += 4;
    if (type in hsTable[c.entity][c.expect]) {
      if (c.entity === tls.ConnectionEnd.server && !c.open && !c.fail) {
        c.handshaking = true;
        c.session = {
          version: null,
          extensions: {
            server_name: {
              serverNameList: []
            }
          },
          cipherSuite: null,
          compressionMethod: null,
          serverCertificate: null,
          clientCertificate: null,
          md5: forge.md.md5.create(),
          sha1: forge.md.sha1.create()
        };
      }
      if (type !== tls.HandshakeType.hello_request && type !== tls.HandshakeType.certificate_verify && type !== tls.HandshakeType.finished) {
        c.session.md5.update(bytes);
        c.session.sha1.update(bytes);
      }
      hsTable[c.entity][c.expect][type](c, record, length);
    } else {
      tls.handleUnexpected(c, record);
    }
  };
  tls.handleApplicationData = function(c, record) {
    c.data.putBuffer(record.fragment);
    c.dataReady(c);
    c.process();
  };
  tls.handleHeartbeat = function(c, record) {
    var b = record.fragment;
    var type = b.getByte();
    var length = b.getInt16();
    var payload = b.getBytes(length);
    if (type === tls.HeartbeatMessageType.heartbeat_request) {
      if (c.handshaking || length > payload.length) {
        return c.process();
      }
      tls.queue(c, tls.createRecord(c, {
        type: tls.ContentType.heartbeat,
        data: tls.createHeartbeat(tls.HeartbeatMessageType.heartbeat_response, payload)
      }));
      tls.flush(c);
    } else if (type === tls.HeartbeatMessageType.heartbeat_response) {
      if (payload !== c.expectedHeartbeatPayload) {
        return c.process();
      }
      if (c.heartbeatReceived) {
        c.heartbeatReceived(c, forge.util.createBuffer(payload));
      }
    }
    c.process();
  };
  var SHE = 0;
  var SCE = 1;
  var SKE = 2;
  var SCR = 3;
  var SHD = 4;
  var SCC = 5;
  var SFI = 6;
  var SAD = 7;
  var SER = 8;
  var CHE = 0;
  var CCE = 1;
  var CKE = 2;
  var CCV = 3;
  var CCC = 4;
  var CFI = 5;
  var CAD = 6;
  var __ = tls.handleUnexpected;
  var R0 = tls.handleChangeCipherSpec;
  var R1 = tls.handleAlert;
  var R2 = tls.handleHandshake;
  var R3 = tls.handleApplicationData;
  var R4 = tls.handleHeartbeat;
  var ctTable = [];
  ctTable[tls.ConnectionEnd.client] = [
    [__, R1, R2, __, R4],
    [__, R1, R2, __, R4],
    [__, R1, R2, __, R4],
    [__, R1, R2, __, R4],
    [__, R1, R2, __, R4],
    [R0, R1, __, __, R4],
    [__, R1, R2, __, R4],
    [__, R1, R2, R3, R4],
    [__, R1, R2, __, R4]
  ];
  ctTable[tls.ConnectionEnd.server] = [
    [__, R1, R2, __, R4],
    [__, R1, R2, __, R4],
    [__, R1, R2, __, R4],
    [__, R1, R2, __, R4],
    [R0, R1, __, __, R4],
    [__, R1, R2, __, R4],
    [__, R1, R2, R3, R4],
    [__, R1, R2, __, R4]
  ];
  var H0 = tls.handleHelloRequest;
  var H1 = tls.handleServerHello;
  var H2 = tls.handleCertificate;
  var H3 = tls.handleServerKeyExchange;
  var H4 = tls.handleCertificateRequest;
  var H5 = tls.handleServerHelloDone;
  var H6 = tls.handleFinished;
  var hsTable = [];
  hsTable[tls.ConnectionEnd.client] = [
    [__, __, H1, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
    [H0, __, __, __, __, __, __, __, __, __, __, H2, H3, H4, H5, __, __, __, __, __, __],
    [H0, __, __, __, __, __, __, __, __, __, __, __, H3, H4, H5, __, __, __, __, __, __],
    [H0, __, __, __, __, __, __, __, __, __, __, __, __, H4, H5, __, __, __, __, __, __],
    [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, H5, __, __, __, __, __, __],
    [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
    [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, H6],
    [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
    [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __]
  ];
  var H7 = tls.handleClientHello;
  var H8 = tls.handleClientKeyExchange;
  var H9 = tls.handleCertificateVerify;
  hsTable[tls.ConnectionEnd.server] = [
    [__, H7, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
    [__, __, __, __, __, __, __, __, __, __, __, H2, __, __, __, __, __, __, __, __, __],
    [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, H8, __, __, __, __],
    [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, H9, __, __, __, __, __],
    [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
    [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, H6],
    [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
    [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __]
  ];
  tls.generateKeys = function(c, sp) {
    var prf = prf_TLS1;
    var random = sp.client_random + sp.server_random;
    if (!c.session.resuming) {
      sp.master_secret = prf(sp.pre_master_secret, "master secret", random, 48).bytes();
      sp.pre_master_secret = null;
    }
    random = sp.server_random + sp.client_random;
    var length = 2 * sp.mac_key_length + 2 * sp.enc_key_length;
    var tls10 = c.version.major === tls.Versions.TLS_1_0.major && c.version.minor === tls.Versions.TLS_1_0.minor;
    if (tls10) {
      length += 2 * sp.fixed_iv_length;
    }
    var km = prf(sp.master_secret, "key expansion", random, length);
    var rval = {
      client_write_MAC_key: km.getBytes(sp.mac_key_length),
      server_write_MAC_key: km.getBytes(sp.mac_key_length),
      client_write_key: km.getBytes(sp.enc_key_length),
      server_write_key: km.getBytes(sp.enc_key_length)
    };
    if (tls10) {
      rval.client_write_IV = km.getBytes(sp.fixed_iv_length);
      rval.server_write_IV = km.getBytes(sp.fixed_iv_length);
    }
    return rval;
  };
  tls.createConnectionState = function(c) {
    var client = c.entity === tls.ConnectionEnd.client;
    var createMode = function() {
      var mode = {
        sequenceNumber: [0, 0],
        macKey: null,
        macLength: 0,
        macFunction: null,
        cipherState: null,
        cipherFunction: function(record) {
          return true;
        },
        compressionState: null,
        compressFunction: function(record) {
          return true;
        },
        updateSequenceNumber: function() {
          if (mode.sequenceNumber[1] === 4294967295) {
            mode.sequenceNumber[1] = 0;
            ++mode.sequenceNumber[0];
          } else {
            ++mode.sequenceNumber[1];
          }
        }
      };
      return mode;
    };
    var state = {
      read: createMode(),
      write: createMode()
    };
    state.read.update = function(c2, record) {
      if (!state.read.cipherFunction(record, state.read)) {
        c2.error(c2, {
          message: "Could not decrypt record or bad MAC.",
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.bad_record_mac
          }
        });
      } else if (!state.read.compressFunction(c2, record, state.read)) {
        c2.error(c2, {
          message: "Could not decompress record.",
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.decompression_failure
          }
        });
      }
      return !c2.fail;
    };
    state.write.update = function(c2, record) {
      if (!state.write.compressFunction(c2, record, state.write)) {
        c2.error(c2, {
          message: "Could not compress record.",
          send: false,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.internal_error
          }
        });
      } else if (!state.write.cipherFunction(record, state.write)) {
        c2.error(c2, {
          message: "Could not encrypt record.",
          send: false,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.internal_error
          }
        });
      }
      return !c2.fail;
    };
    if (c.session) {
      var sp = c.session.sp;
      c.session.cipherSuite.initSecurityParameters(sp);
      sp.keys = tls.generateKeys(c, sp);
      state.read.macKey = client ? sp.keys.server_write_MAC_key : sp.keys.client_write_MAC_key;
      state.write.macKey = client ? sp.keys.client_write_MAC_key : sp.keys.server_write_MAC_key;
      c.session.cipherSuite.initConnectionState(state, c, sp);
      switch (sp.compression_algorithm) {
        case tls.CompressionMethod.none:
          break;
        case tls.CompressionMethod.deflate:
          state.read.compressFunction = inflate;
          state.write.compressFunction = deflate;
          break;
        default:
          throw new Error("Unsupported compression algorithm.");
      }
    }
    return state;
  };
  tls.createRandom = function() {
    var d = new Date;
    var utc = +d + d.getTimezoneOffset() * 60000;
    var rval = forge.util.createBuffer();
    rval.putInt32(utc);
    rval.putBytes(forge.random.getBytes(28));
    return rval;
  };
  tls.createRecord = function(c, options) {
    if (!options.data) {
      return null;
    }
    var record = {
      type: options.type,
      version: {
        major: c.version.major,
        minor: c.version.minor
      },
      length: options.data.length(),
      fragment: options.data
    };
    return record;
  };
  tls.createAlert = function(c, alert) {
    var b = forge.util.createBuffer();
    b.putByte(alert.level);
    b.putByte(alert.description);
    return tls.createRecord(c, {
      type: tls.ContentType.alert,
      data: b
    });
  };
  tls.createClientHello = function(c) {
    c.session.clientHelloVersion = {
      major: c.version.major,
      minor: c.version.minor
    };
    var cipherSuites = forge.util.createBuffer();
    for (var i = 0;i < c.cipherSuites.length; ++i) {
      var cs = c.cipherSuites[i];
      cipherSuites.putByte(cs.id[0]);
      cipherSuites.putByte(cs.id[1]);
    }
    var cSuites = cipherSuites.length();
    var compressionMethods = forge.util.createBuffer();
    compressionMethods.putByte(tls.CompressionMethod.none);
    var cMethods = compressionMethods.length();
    var extensions = forge.util.createBuffer();
    if (c.virtualHost) {
      var ext = forge.util.createBuffer();
      ext.putByte(0);
      ext.putByte(0);
      var serverName = forge.util.createBuffer();
      serverName.putByte(0);
      writeVector(serverName, 2, forge.util.createBuffer(c.virtualHost));
      var snList = forge.util.createBuffer();
      writeVector(snList, 2, serverName);
      writeVector(ext, 2, snList);
      extensions.putBuffer(ext);
    }
    var extLength = extensions.length();
    if (extLength > 0) {
      extLength += 2;
    }
    var sessionId = c.session.id;
    var length = sessionId.length + 1 + 2 + 4 + 28 + 2 + cSuites + 1 + cMethods + extLength;
    var rval = forge.util.createBuffer();
    rval.putByte(tls.HandshakeType.client_hello);
    rval.putInt24(length);
    rval.putByte(c.version.major);
    rval.putByte(c.version.minor);
    rval.putBytes(c.session.sp.client_random);
    writeVector(rval, 1, forge.util.createBuffer(sessionId));
    writeVector(rval, 2, cipherSuites);
    writeVector(rval, 1, compressionMethods);
    if (extLength > 0) {
      writeVector(rval, 2, extensions);
    }
    return rval;
  };
  tls.createServerHello = function(c) {
    var sessionId = c.session.id;
    var length = sessionId.length + 1 + 2 + 4 + 28 + 2 + 1;
    var rval = forge.util.createBuffer();
    rval.putByte(tls.HandshakeType.server_hello);
    rval.putInt24(length);
    rval.putByte(c.version.major);
    rval.putByte(c.version.minor);
    rval.putBytes(c.session.sp.server_random);
    writeVector(rval, 1, forge.util.createBuffer(sessionId));
    rval.putByte(c.session.cipherSuite.id[0]);
    rval.putByte(c.session.cipherSuite.id[1]);
    rval.putByte(c.session.compressionMethod);
    return rval;
  };
  tls.createCertificate = function(c) {
    var client = c.entity === tls.ConnectionEnd.client;
    var cert = null;
    if (c.getCertificate) {
      var hint;
      if (client) {
        hint = c.session.certificateRequest;
      } else {
        hint = c.session.extensions.server_name.serverNameList;
      }
      cert = c.getCertificate(c, hint);
    }
    var certList = forge.util.createBuffer();
    if (cert !== null) {
      try {
        if (!forge.util.isArray(cert)) {
          cert = [cert];
        }
        var asn1 = null;
        for (var i = 0;i < cert.length; ++i) {
          var msg = forge.pem.decode(cert[i])[0];
          if (msg.type !== "CERTIFICATE" && msg.type !== "X509 CERTIFICATE" && msg.type !== "TRUSTED CERTIFICATE") {
            var error = new Error("Could not convert certificate from PEM; PEM " + 'header type is not "CERTIFICATE", "X509 CERTIFICATE", or ' + '"TRUSTED CERTIFICATE".');
            error.headerType = msg.type;
            throw error;
          }
          if (msg.procType && msg.procType.type === "ENCRYPTED") {
            throw new Error("Could not convert certificate from PEM; PEM is encrypted.");
          }
          var der = forge.util.createBuffer(msg.body);
          if (asn1 === null) {
            asn1 = forge.asn1.fromDer(der.bytes(), false);
          }
          var certBuffer = forge.util.createBuffer();
          writeVector(certBuffer, 3, der);
          certList.putBuffer(certBuffer);
        }
        cert = forge.pki.certificateFromAsn1(asn1);
        if (client) {
          c.session.clientCertificate = cert;
        } else {
          c.session.serverCertificate = cert;
        }
      } catch (ex) {
        return c.error(c, {
          message: "Could not send certificate list.",
          cause: ex,
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.bad_certificate
          }
        });
      }
    }
    var length = 3 + certList.length();
    var rval = forge.util.createBuffer();
    rval.putByte(tls.HandshakeType.certificate);
    rval.putInt24(length);
    writeVector(rval, 3, certList);
    return rval;
  };
  tls.createClientKeyExchange = function(c) {
    var b = forge.util.createBuffer();
    b.putByte(c.session.clientHelloVersion.major);
    b.putByte(c.session.clientHelloVersion.minor);
    b.putBytes(forge.random.getBytes(46));
    var sp = c.session.sp;
    sp.pre_master_secret = b.getBytes();
    var key2 = c.session.serverCertificate.publicKey;
    b = key2.encrypt(sp.pre_master_secret);
    var length = b.length + 2;
    var rval = forge.util.createBuffer();
    rval.putByte(tls.HandshakeType.client_key_exchange);
    rval.putInt24(length);
    rval.putInt16(b.length);
    rval.putBytes(b);
    return rval;
  };
  tls.createServerKeyExchange = function(c) {
    var length = 0;
    var rval = forge.util.createBuffer();
    if (length > 0) {
      rval.putByte(tls.HandshakeType.server_key_exchange);
      rval.putInt24(length);
    }
    return rval;
  };
  tls.getClientSignature = function(c, callback) {
    var b = forge.util.createBuffer();
    b.putBuffer(c.session.md5.digest());
    b.putBuffer(c.session.sha1.digest());
    b = b.getBytes();
    c.getSignature = c.getSignature || function(c2, b2, callback2) {
      var privateKey = null;
      if (c2.getPrivateKey) {
        try {
          privateKey = c2.getPrivateKey(c2, c2.session.clientCertificate);
          privateKey = forge.pki.privateKeyFromPem(privateKey);
        } catch (ex) {
          c2.error(c2, {
            message: "Could not get private key.",
            cause: ex,
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.internal_error
            }
          });
        }
      }
      if (privateKey === null) {
        c2.error(c2, {
          message: "No private key set.",
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.internal_error
          }
        });
      } else {
        b2 = privateKey.sign(b2, null);
      }
      callback2(c2, b2);
    };
    c.getSignature(c, b, callback);
  };
  tls.createCertificateVerify = function(c, signature) {
    var length = signature.length + 2;
    var rval = forge.util.createBuffer();
    rval.putByte(tls.HandshakeType.certificate_verify);
    rval.putInt24(length);
    rval.putInt16(signature.length);
    rval.putBytes(signature);
    return rval;
  };
  tls.createCertificateRequest = function(c) {
    var certTypes = forge.util.createBuffer();
    certTypes.putByte(1);
    var cAs = forge.util.createBuffer();
    for (var key2 in c.caStore.certs) {
      var cert = c.caStore.certs[key2];
      var dn = forge.pki.distinguishedNameToAsn1(cert.subject);
      var byteBuffer = forge.asn1.toDer(dn);
      cAs.putInt16(byteBuffer.length());
      cAs.putBuffer(byteBuffer);
    }
    var length = 1 + certTypes.length() + 2 + cAs.length();
    var rval = forge.util.createBuffer();
    rval.putByte(tls.HandshakeType.certificate_request);
    rval.putInt24(length);
    writeVector(rval, 1, certTypes);
    writeVector(rval, 2, cAs);
    return rval;
  };
  tls.createServerHelloDone = function(c) {
    var rval = forge.util.createBuffer();
    rval.putByte(tls.HandshakeType.server_hello_done);
    rval.putInt24(0);
    return rval;
  };
  tls.createChangeCipherSpec = function() {
    var rval = forge.util.createBuffer();
    rval.putByte(1);
    return rval;
  };
  tls.createFinished = function(c) {
    var b = forge.util.createBuffer();
    b.putBuffer(c.session.md5.digest());
    b.putBuffer(c.session.sha1.digest());
    var client = c.entity === tls.ConnectionEnd.client;
    var sp = c.session.sp;
    var vdl = 12;
    var prf = prf_TLS1;
    var label = client ? "client finished" : "server finished";
    b = prf(sp.master_secret, label, b.getBytes(), vdl);
    var rval = forge.util.createBuffer();
    rval.putByte(tls.HandshakeType.finished);
    rval.putInt24(b.length());
    rval.putBuffer(b);
    return rval;
  };
  tls.createHeartbeat = function(type, payload, payloadLength) {
    if (typeof payloadLength === "undefined") {
      payloadLength = payload.length;
    }
    var rval = forge.util.createBuffer();
    rval.putByte(type);
    rval.putInt16(payloadLength);
    rval.putBytes(payload);
    var plaintextLength = rval.length();
    var paddingLength = Math.max(16, plaintextLength - payloadLength - 3);
    rval.putBytes(forge.random.getBytes(paddingLength));
    return rval;
  };
  tls.queue = function(c, record) {
    if (!record) {
      return;
    }
    if (record.fragment.length() === 0) {
      if (record.type === tls.ContentType.handshake || record.type === tls.ContentType.alert || record.type === tls.ContentType.change_cipher_spec) {
        return;
      }
    }
    if (record.type === tls.ContentType.handshake) {
      var bytes = record.fragment.bytes();
      c.session.md5.update(bytes);
      c.session.sha1.update(bytes);
      bytes = null;
    }
    var records;
    if (record.fragment.length() <= tls.MaxFragment) {
      records = [record];
    } else {
      records = [];
      var data = record.fragment.bytes();
      while (data.length > tls.MaxFragment) {
        records.push(tls.createRecord(c, {
          type: record.type,
          data: forge.util.createBuffer(data.slice(0, tls.MaxFragment))
        }));
        data = data.slice(tls.MaxFragment);
      }
      if (data.length > 0) {
        records.push(tls.createRecord(c, {
          type: record.type,
          data: forge.util.createBuffer(data)
        }));
      }
    }
    for (var i = 0;i < records.length && !c.fail; ++i) {
      var rec = records[i];
      var s = c.state.current.write;
      if (s.update(c, rec)) {
        c.records.push(rec);
      }
    }
  };
  tls.flush = function(c) {
    for (var i = 0;i < c.records.length; ++i) {
      var record = c.records[i];
      c.tlsData.putByte(record.type);
      c.tlsData.putByte(record.version.major);
      c.tlsData.putByte(record.version.minor);
      c.tlsData.putInt16(record.fragment.length());
      c.tlsData.putBuffer(c.records[i].fragment);
    }
    c.records = [];
    return c.tlsDataReady(c);
  };
  var _certErrorToAlertDesc = function(error) {
    switch (error) {
      case true:
        return true;
      case forge.pki.certificateError.bad_certificate:
        return tls.Alert.Description.bad_certificate;
      case forge.pki.certificateError.unsupported_certificate:
        return tls.Alert.Description.unsupported_certificate;
      case forge.pki.certificateError.certificate_revoked:
        return tls.Alert.Description.certificate_revoked;
      case forge.pki.certificateError.certificate_expired:
        return tls.Alert.Description.certificate_expired;
      case forge.pki.certificateError.certificate_unknown:
        return tls.Alert.Description.certificate_unknown;
      case forge.pki.certificateError.unknown_ca:
        return tls.Alert.Description.unknown_ca;
      default:
        return tls.Alert.Description.bad_certificate;
    }
  };
  var _alertDescToCertError = function(desc) {
    switch (desc) {
      case true:
        return true;
      case tls.Alert.Description.bad_certificate:
        return forge.pki.certificateError.bad_certificate;
      case tls.Alert.Description.unsupported_certificate:
        return forge.pki.certificateError.unsupported_certificate;
      case tls.Alert.Description.certificate_revoked:
        return forge.pki.certificateError.certificate_revoked;
      case tls.Alert.Description.certificate_expired:
        return forge.pki.certificateError.certificate_expired;
      case tls.Alert.Description.certificate_unknown:
        return forge.pki.certificateError.certificate_unknown;
      case tls.Alert.Description.unknown_ca:
        return forge.pki.certificateError.unknown_ca;
      default:
        return forge.pki.certificateError.bad_certificate;
    }
  };
  tls.verifyCertificateChain = function(c, chain) {
    try {
      var options = {};
      for (var key2 in c.verifyOptions) {
        options[key2] = c.verifyOptions[key2];
      }
      options.verify = function(vfd, depth, chain2) {
        var desc = _certErrorToAlertDesc(vfd);
        var ret = c.verify(c, vfd, depth, chain2);
        if (ret !== true) {
          if (typeof ret === "object" && !forge.util.isArray(ret)) {
            var error = new Error("The application rejected the certificate.");
            error.send = true;
            error.alert = {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.bad_certificate
            };
            if (ret.message) {
              error.message = ret.message;
            }
            if (ret.alert) {
              error.alert.description = ret.alert;
            }
            throw error;
          }
          if (ret !== vfd) {
            ret = _alertDescToCertError(ret);
          }
        }
        return ret;
      };
      forge.pki.verifyCertificateChain(c.caStore, chain, options);
    } catch (ex) {
      var err = ex;
      if (typeof err !== "object" || forge.util.isArray(err)) {
        err = {
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: _certErrorToAlertDesc(ex)
          }
        };
      }
      if (!("send" in err)) {
        err.send = true;
      }
      if (!("alert" in err)) {
        err.alert = {
          level: tls.Alert.Level.fatal,
          description: _certErrorToAlertDesc(err.error)
        };
      }
      c.error(c, err);
    }
    return !c.fail;
  };
  tls.createSessionCache = function(cache, capacity) {
    var rval = null;
    if (cache && cache.getSession && cache.setSession && cache.order) {
      rval = cache;
    } else {
      rval = {};
      rval.cache = cache || {};
      rval.capacity = Math.max(capacity || 100, 1);
      rval.order = [];
      for (var key2 in cache) {
        if (rval.order.length <= capacity) {
          rval.order.push(key2);
        } else {
          delete cache[key2];
        }
      }
      rval.getSession = function(sessionId) {
        var session = null;
        var key3 = null;
        if (sessionId) {
          key3 = forge.util.bytesToHex(sessionId);
        } else if (rval.order.length > 0) {
          key3 = rval.order[0];
        }
        if (key3 !== null && key3 in rval.cache) {
          session = rval.cache[key3];
          delete rval.cache[key3];
          for (var i in rval.order) {
            if (rval.order[i] === key3) {
              rval.order.splice(i, 1);
              break;
            }
          }
        }
        return session;
      };
      rval.setSession = function(sessionId, session) {
        if (rval.order.length === rval.capacity) {
          var key3 = rval.order.shift();
          delete rval.cache[key3];
        }
        var key3 = forge.util.bytesToHex(sessionId);
        rval.order.push(key3);
        rval.cache[key3] = session;
      };
    }
    return rval;
  };
  tls.createConnection = function(options) {
    var caStore = null;
    if (options.caStore) {
      if (forge.util.isArray(options.caStore)) {
        caStore = forge.pki.createCaStore(options.caStore);
      } else {
        caStore = options.caStore;
      }
    } else {
      caStore = forge.pki.createCaStore();
    }
    var cipherSuites = options.cipherSuites || null;
    if (cipherSuites === null) {
      cipherSuites = [];
      for (var key2 in tls.CipherSuites) {
        cipherSuites.push(tls.CipherSuites[key2]);
      }
    }
    var entity = options.server ? tls.ConnectionEnd.server : tls.ConnectionEnd.client;
    var sessionCache = options.sessionCache ? tls.createSessionCache(options.sessionCache) : null;
    var c = {
      version: { major: tls.Version.major, minor: tls.Version.minor },
      entity,
      sessionId: options.sessionId,
      caStore,
      sessionCache,
      cipherSuites,
      connected: options.connected,
      virtualHost: options.virtualHost || null,
      verifyClient: options.verifyClient || false,
      verify: options.verify || function(cn, vfd, dpth, cts) {
        return vfd;
      },
      verifyOptions: options.verifyOptions || {},
      getCertificate: options.getCertificate || null,
      getPrivateKey: options.getPrivateKey || null,
      getSignature: options.getSignature || null,
      input: forge.util.createBuffer(),
      tlsData: forge.util.createBuffer(),
      data: forge.util.createBuffer(),
      tlsDataReady: options.tlsDataReady,
      dataReady: options.dataReady,
      heartbeatReceived: options.heartbeatReceived,
      closed: options.closed,
      error: function(c2, ex) {
        ex.origin = ex.origin || (c2.entity === tls.ConnectionEnd.client ? "client" : "server");
        if (ex.send) {
          tls.queue(c2, tls.createAlert(c2, ex.alert));
          tls.flush(c2);
        }
        var fatal = ex.fatal !== false;
        if (fatal) {
          c2.fail = true;
        }
        options.error(c2, ex);
        if (fatal) {
          c2.close(false);
        }
      },
      deflate: options.deflate || null,
      inflate: options.inflate || null
    };
    c.reset = function(clearFail) {
      c.version = { major: tls.Version.major, minor: tls.Version.minor };
      c.record = null;
      c.session = null;
      c.peerCertificate = null;
      c.state = {
        pending: null,
        current: null
      };
      c.expect = c.entity === tls.ConnectionEnd.client ? SHE : CHE;
      c.fragmented = null;
      c.records = [];
      c.open = false;
      c.handshakes = 0;
      c.handshaking = false;
      c.isConnected = false;
      c.fail = !(clearFail || typeof clearFail === "undefined");
      c.input.clear();
      c.tlsData.clear();
      c.data.clear();
      c.state.current = tls.createConnectionState(c);
    };
    c.reset();
    var _update = function(c2, record) {
      var aligned = record.type - tls.ContentType.change_cipher_spec;
      var handlers = ctTable[c2.entity][c2.expect];
      if (aligned in handlers) {
        handlers[aligned](c2, record);
      } else {
        tls.handleUnexpected(c2, record);
      }
    };
    var _readRecordHeader = function(c2) {
      var rval = 0;
      var b = c2.input;
      var len = b.length();
      if (len < 5) {
        rval = 5 - len;
      } else {
        c2.record = {
          type: b.getByte(),
          version: {
            major: b.getByte(),
            minor: b.getByte()
          },
          length: b.getInt16(),
          fragment: forge.util.createBuffer(),
          ready: false
        };
        var compatibleVersion = c2.record.version.major === c2.version.major;
        if (compatibleVersion && c2.session && c2.session.version) {
          compatibleVersion = c2.record.version.minor === c2.version.minor;
        }
        if (!compatibleVersion) {
          c2.error(c2, {
            message: "Incompatible TLS version.",
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.protocol_version
            }
          });
        }
      }
      return rval;
    };
    var _readRecord = function(c2) {
      var rval = 0;
      var b = c2.input;
      var len = b.length();
      if (len < c2.record.length) {
        rval = c2.record.length - len;
      } else {
        c2.record.fragment.putBytes(b.getBytes(c2.record.length));
        b.compact();
        var s = c2.state.current.read;
        if (s.update(c2, c2.record)) {
          if (c2.fragmented !== null) {
            if (c2.fragmented.type === c2.record.type) {
              c2.fragmented.fragment.putBuffer(c2.record.fragment);
              c2.record = c2.fragmented;
            } else {
              c2.error(c2, {
                message: "Invalid fragmented record.",
                send: true,
                alert: {
                  level: tls.Alert.Level.fatal,
                  description: tls.Alert.Description.unexpected_message
                }
              });
            }
          }
          c2.record.ready = true;
        }
      }
      return rval;
    };
    c.handshake = function(sessionId) {
      if (c.entity !== tls.ConnectionEnd.client) {
        c.error(c, {
          message: "Cannot initiate handshake as a server.",
          fatal: false
        });
      } else if (c.handshaking) {
        c.error(c, {
          message: "Handshake already in progress.",
          fatal: false
        });
      } else {
        if (c.fail && !c.open && c.handshakes === 0) {
          c.fail = false;
        }
        c.handshaking = true;
        sessionId = sessionId || "";
        var session = null;
        if (sessionId.length > 0) {
          if (c.sessionCache) {
            session = c.sessionCache.getSession(sessionId);
          }
          if (session === null) {
            sessionId = "";
          }
        }
        if (sessionId.length === 0 && c.sessionCache) {
          session = c.sessionCache.getSession();
          if (session !== null) {
            sessionId = session.id;
          }
        }
        c.session = {
          id: sessionId,
          version: null,
          cipherSuite: null,
          compressionMethod: null,
          serverCertificate: null,
          certificateRequest: null,
          clientCertificate: null,
          sp: {},
          md5: forge.md.md5.create(),
          sha1: forge.md.sha1.create()
        };
        if (session) {
          c.version = session.version;
          c.session.sp = session.sp;
        }
        c.session.sp.client_random = tls.createRandom().getBytes();
        c.open = true;
        tls.queue(c, tls.createRecord(c, {
          type: tls.ContentType.handshake,
          data: tls.createClientHello(c)
        }));
        tls.flush(c);
      }
    };
    c.process = function(data) {
      var rval = 0;
      if (data) {
        c.input.putBytes(data);
      }
      if (!c.fail) {
        if (c.record !== null && c.record.ready && c.record.fragment.isEmpty()) {
          c.record = null;
        }
        if (c.record === null) {
          rval = _readRecordHeader(c);
        }
        if (!c.fail && c.record !== null && !c.record.ready) {
          rval = _readRecord(c);
        }
        if (!c.fail && c.record !== null && c.record.ready) {
          _update(c, c.record);
        }
      }
      return rval;
    };
    c.prepare = function(data) {
      tls.queue(c, tls.createRecord(c, {
        type: tls.ContentType.application_data,
        data: forge.util.createBuffer(data)
      }));
      return tls.flush(c);
    };
    c.prepareHeartbeatRequest = function(payload, payloadLength) {
      if (payload instanceof forge.util.ByteBuffer) {
        payload = payload.bytes();
      }
      if (typeof payloadLength === "undefined") {
        payloadLength = payload.length;
      }
      c.expectedHeartbeatPayload = payload;
      tls.queue(c, tls.createRecord(c, {
        type: tls.ContentType.heartbeat,
        data: tls.createHeartbeat(tls.HeartbeatMessageType.heartbeat_request, payload, payloadLength)
      }));
      return tls.flush(c);
    };
    c.close = function(clearFail) {
      if (!c.fail && c.sessionCache && c.session) {
        var session = {
          id: c.session.id,
          version: c.session.version,
          sp: c.session.sp
        };
        session.sp.keys = null;
        c.sessionCache.setSession(session.id, session);
      }
      if (c.open) {
        c.open = false;
        c.input.clear();
        if (c.isConnected || c.handshaking) {
          c.isConnected = c.handshaking = false;
          tls.queue(c, tls.createAlert(c, {
            level: tls.Alert.Level.warning,
            description: tls.Alert.Description.close_notify
          }));
          tls.flush(c);
        }
        c.closed(c);
      }
      c.reset(clearFail);
    };
    return c;
  };
  module.exports = forge.tls = forge.tls || {};
  for (key in tls) {
    if (typeof tls[key] !== "function") {
      forge.tls[key] = tls[key];
    }
  }
  var key;
  forge.tls.prf_tls1 = prf_TLS1;
  forge.tls.hmac_sha1 = hmac_sha1;
  forge.tls.createSessionCache = tls.createSessionCache;
  forge.tls.createConnection = tls.createConnection;
});

// node_modules/node-forge/lib/aesCipherSuites.js
var require_aesCipherSuites = __commonJS((exports, module) => {
  var forge = require_forge();
  require_aes();
  require_tls();
  var tls = module.exports = forge.tls;
  tls.CipherSuites["TLS_RSA_WITH_AES_128_CBC_SHA"] = {
    id: [0, 47],
    name: "TLS_RSA_WITH_AES_128_CBC_SHA",
    initSecurityParameters: function(sp) {
      sp.bulk_cipher_algorithm = tls.BulkCipherAlgorithm.aes;
      sp.cipher_type = tls.CipherType.block;
      sp.enc_key_length = 16;
      sp.block_length = 16;
      sp.fixed_iv_length = 16;
      sp.record_iv_length = 16;
      sp.mac_algorithm = tls.MACAlgorithm.hmac_sha1;
      sp.mac_length = 20;
      sp.mac_key_length = 20;
    },
    initConnectionState
  };
  tls.CipherSuites["TLS_RSA_WITH_AES_256_CBC_SHA"] = {
    id: [0, 53],
    name: "TLS_RSA_WITH_AES_256_CBC_SHA",
    initSecurityParameters: function(sp) {
      sp.bulk_cipher_algorithm = tls.BulkCipherAlgorithm.aes;
      sp.cipher_type = tls.CipherType.block;
      sp.enc_key_length = 32;
      sp.block_length = 16;
      sp.fixed_iv_length = 16;
      sp.record_iv_length = 16;
      sp.mac_algorithm = tls.MACAlgorithm.hmac_sha1;
      sp.mac_length = 20;
      sp.mac_key_length = 20;
    },
    initConnectionState
  };
  function initConnectionState(state, c, sp) {
    var client = c.entity === forge.tls.ConnectionEnd.client;
    state.read.cipherState = {
      init: false,
      cipher: forge.cipher.createDecipher("AES-CBC", client ? sp.keys.server_write_key : sp.keys.client_write_key),
      iv: client ? sp.keys.server_write_IV : sp.keys.client_write_IV
    };
    state.write.cipherState = {
      init: false,
      cipher: forge.cipher.createCipher("AES-CBC", client ? sp.keys.client_write_key : sp.keys.server_write_key),
      iv: client ? sp.keys.client_write_IV : sp.keys.server_write_IV
    };
    state.read.cipherFunction = decrypt_aes_cbc_sha1;
    state.write.cipherFunction = encrypt_aes_cbc_sha1;
    state.read.macLength = state.write.macLength = sp.mac_length;
    state.read.macFunction = state.write.macFunction = tls.hmac_sha1;
  }
  function encrypt_aes_cbc_sha1(record, s) {
    var rval = false;
    var mac = s.macFunction(s.macKey, s.sequenceNumber, record);
    record.fragment.putBytes(mac);
    s.updateSequenceNumber();
    var iv;
    if (record.version.minor === tls.Versions.TLS_1_0.minor) {
      iv = s.cipherState.init ? null : s.cipherState.iv;
    } else {
      iv = forge.random.getBytesSync(16);
    }
    s.cipherState.init = true;
    var cipher = s.cipherState.cipher;
    cipher.start({ iv });
    if (record.version.minor >= tls.Versions.TLS_1_1.minor) {
      cipher.output.putBytes(iv);
    }
    cipher.update(record.fragment);
    if (cipher.finish(encrypt_aes_cbc_sha1_padding)) {
      record.fragment = cipher.output;
      record.length = record.fragment.length();
      rval = true;
    }
    return rval;
  }
  function encrypt_aes_cbc_sha1_padding(blockSize, input2, decrypt) {
    if (!decrypt) {
      var padding = blockSize - input2.length() % blockSize;
      input2.fillWithByte(padding - 1, padding);
    }
    return true;
  }
  function decrypt_aes_cbc_sha1_padding(blockSize, output, decrypt) {
    var rval = true;
    if (decrypt) {
      var len = output.length();
      var paddingLength = output.last();
      for (var i = len - 1 - paddingLength;i < len - 1; ++i) {
        rval = rval && output.at(i) == paddingLength;
      }
      if (rval) {
        output.truncate(paddingLength + 1);
      }
    }
    return rval;
  }
  function decrypt_aes_cbc_sha1(record, s) {
    var rval = false;
    var iv;
    if (record.version.minor === tls.Versions.TLS_1_0.minor) {
      iv = s.cipherState.init ? null : s.cipherState.iv;
    } else {
      iv = record.fragment.getBytes(16);
    }
    s.cipherState.init = true;
    var cipher = s.cipherState.cipher;
    cipher.start({ iv });
    cipher.update(record.fragment);
    rval = cipher.finish(decrypt_aes_cbc_sha1_padding);
    var macLen = s.macLength;
    var mac = forge.random.getBytesSync(macLen);
    var len = cipher.output.length();
    if (len >= macLen) {
      record.fragment = cipher.output.getBytes(len - macLen);
      mac = cipher.output.getBytes(macLen);
    } else {
      record.fragment = cipher.output.getBytes();
    }
    record.fragment = forge.util.createBuffer(record.fragment);
    record.length = record.fragment.length();
    var mac2 = s.macFunction(s.macKey, s.sequenceNumber, record);
    s.updateSequenceNumber();
    rval = compareMacs(s.macKey, mac, mac2) && rval;
    return rval;
  }
  function compareMacs(key, mac1, mac2) {
    var hmac = forge.hmac.create();
    hmac.start("SHA1", key);
    hmac.update(mac1);
    mac1 = hmac.digest().getBytes();
    hmac.start(null, null);
    hmac.update(mac2);
    mac2 = hmac.digest().getBytes();
    return mac1 === mac2;
  }
});

// node_modules/node-forge/lib/sha512.js
var require_sha512 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_md();
  require_util();
  var sha512 = module.exports = forge.sha512 = forge.sha512 || {};
  forge.md.sha512 = forge.md.algorithms.sha512 = sha512;
  var sha384 = forge.sha384 = forge.sha512.sha384 = forge.sha512.sha384 || {};
  sha384.create = function() {
    return sha512.create("SHA-384");
  };
  forge.md.sha384 = forge.md.algorithms.sha384 = sha384;
  forge.sha512.sha256 = forge.sha512.sha256 || {
    create: function() {
      return sha512.create("SHA-512/256");
    }
  };
  forge.md["sha512/256"] = forge.md.algorithms["sha512/256"] = forge.sha512.sha256;
  forge.sha512.sha224 = forge.sha512.sha224 || {
    create: function() {
      return sha512.create("SHA-512/224");
    }
  };
  forge.md["sha512/224"] = forge.md.algorithms["sha512/224"] = forge.sha512.sha224;
  sha512.create = function(algorithm) {
    if (!_initialized) {
      _init();
    }
    if (typeof algorithm === "undefined") {
      algorithm = "SHA-512";
    }
    if (!(algorithm in _states)) {
      throw new Error("Invalid SHA-512 algorithm: " + algorithm);
    }
    var _state = _states[algorithm];
    var _h = null;
    var _input = forge.util.createBuffer();
    var _w = new Array(80);
    for (var wi = 0;wi < 80; ++wi) {
      _w[wi] = new Array(2);
    }
    var digestLength = 64;
    switch (algorithm) {
      case "SHA-384":
        digestLength = 48;
        break;
      case "SHA-512/256":
        digestLength = 32;
        break;
      case "SHA-512/224":
        digestLength = 28;
        break;
    }
    var md = {
      algorithm: algorithm.replace("-", "").toLowerCase(),
      blockLength: 128,
      digestLength,
      messageLength: 0,
      fullMessageLength: null,
      messageLengthSize: 16
    };
    md.start = function() {
      md.messageLength = 0;
      md.fullMessageLength = md.messageLength128 = [];
      var int32s = md.messageLengthSize / 4;
      for (var i = 0;i < int32s; ++i) {
        md.fullMessageLength.push(0);
      }
      _input = forge.util.createBuffer();
      _h = new Array(_state.length);
      for (var i = 0;i < _state.length; ++i) {
        _h[i] = _state[i].slice(0);
      }
      return md;
    };
    md.start();
    md.update = function(msg, encoding) {
      if (encoding === "utf8") {
        msg = forge.util.encodeUtf8(msg);
      }
      var len = msg.length;
      md.messageLength += len;
      len = [len / 4294967296 >>> 0, len >>> 0];
      for (var i = md.fullMessageLength.length - 1;i >= 0; --i) {
        md.fullMessageLength[i] += len[1];
        len[1] = len[0] + (md.fullMessageLength[i] / 4294967296 >>> 0);
        md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
        len[0] = len[1] / 4294967296 >>> 0;
      }
      _input.putBytes(msg);
      _update(_h, _w, _input);
      if (_input.read > 2048 || _input.length() === 0) {
        _input.compact();
      }
      return md;
    };
    md.digest = function() {
      var finalBlock = forge.util.createBuffer();
      finalBlock.putBytes(_input.bytes());
      var remaining = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize;
      var overflow = remaining & md.blockLength - 1;
      finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
      var next, carry;
      var bits = md.fullMessageLength[0] * 8;
      for (var i = 0;i < md.fullMessageLength.length - 1; ++i) {
        next = md.fullMessageLength[i + 1] * 8;
        carry = next / 4294967296 >>> 0;
        bits += carry;
        finalBlock.putInt32(bits >>> 0);
        bits = next >>> 0;
      }
      finalBlock.putInt32(bits);
      var h = new Array(_h.length);
      for (var i = 0;i < _h.length; ++i) {
        h[i] = _h[i].slice(0);
      }
      _update(h, _w, finalBlock);
      var rval = forge.util.createBuffer();
      var hlen;
      if (algorithm === "SHA-512") {
        hlen = h.length;
      } else if (algorithm === "SHA-384") {
        hlen = h.length - 2;
      } else {
        hlen = h.length - 4;
      }
      for (var i = 0;i < hlen; ++i) {
        rval.putInt32(h[i][0]);
        if (i !== hlen - 1 || algorithm !== "SHA-512/224") {
          rval.putInt32(h[i][1]);
        }
      }
      return rval;
    };
    return md;
  };
  var _padding = null;
  var _initialized = false;
  var _k = null;
  var _states = null;
  function _init() {
    _padding = String.fromCharCode(128);
    _padding += forge.util.fillString(String.fromCharCode(0), 128);
    _k = [
      [1116352408, 3609767458],
      [1899447441, 602891725],
      [3049323471, 3964484399],
      [3921009573, 2173295548],
      [961987163, 4081628472],
      [1508970993, 3053834265],
      [2453635748, 2937671579],
      [2870763221, 3664609560],
      [3624381080, 2734883394],
      [310598401, 1164996542],
      [607225278, 1323610764],
      [1426881987, 3590304994],
      [1925078388, 4068182383],
      [2162078206, 991336113],
      [2614888103, 633803317],
      [3248222580, 3479774868],
      [3835390401, 2666613458],
      [4022224774, 944711139],
      [264347078, 2341262773],
      [604807628, 2007800933],
      [770255983, 1495990901],
      [1249150122, 1856431235],
      [1555081692, 3175218132],
      [1996064986, 2198950837],
      [2554220882, 3999719339],
      [2821834349, 766784016],
      [2952996808, 2566594879],
      [3210313671, 3203337956],
      [3336571891, 1034457026],
      [3584528711, 2466948901],
      [113926993, 3758326383],
      [338241895, 168717936],
      [666307205, 1188179964],
      [773529912, 1546045734],
      [1294757372, 1522805485],
      [1396182291, 2643833823],
      [1695183700, 2343527390],
      [1986661051, 1014477480],
      [2177026350, 1206759142],
      [2456956037, 344077627],
      [2730485921, 1290863460],
      [2820302411, 3158454273],
      [3259730800, 3505952657],
      [3345764771, 106217008],
      [3516065817, 3606008344],
      [3600352804, 1432725776],
      [4094571909, 1467031594],
      [275423344, 851169720],
      [430227734, 3100823752],
      [506948616, 1363258195],
      [659060556, 3750685593],
      [883997877, 3785050280],
      [958139571, 3318307427],
      [1322822218, 3812723403],
      [1537002063, 2003034995],
      [1747873779, 3602036899],
      [1955562222, 1575990012],
      [2024104815, 1125592928],
      [2227730452, 2716904306],
      [2361852424, 442776044],
      [2428436474, 593698344],
      [2756734187, 3733110249],
      [3204031479, 2999351573],
      [3329325298, 3815920427],
      [3391569614, 3928383900],
      [3515267271, 566280711],
      [3940187606, 3454069534],
      [4118630271, 4000239992],
      [116418474, 1914138554],
      [174292421, 2731055270],
      [289380356, 3203993006],
      [460393269, 320620315],
      [685471733, 587496836],
      [852142971, 1086792851],
      [1017036298, 365543100],
      [1126000580, 2618297676],
      [1288033470, 3409855158],
      [1501505948, 4234509866],
      [1607167915, 987167468],
      [1816402316, 1246189591]
    ];
    _states = {};
    _states["SHA-512"] = [
      [1779033703, 4089235720],
      [3144134277, 2227873595],
      [1013904242, 4271175723],
      [2773480762, 1595750129],
      [1359893119, 2917565137],
      [2600822924, 725511199],
      [528734635, 4215389547],
      [1541459225, 327033209]
    ];
    _states["SHA-384"] = [
      [3418070365, 3238371032],
      [1654270250, 914150663],
      [2438529370, 812702999],
      [355462360, 4144912697],
      [1731405415, 4290775857],
      [2394180231, 1750603025],
      [3675008525, 1694076839],
      [1203062813, 3204075428]
    ];
    _states["SHA-512/256"] = [
      [573645204, 4230739756],
      [2673172387, 3360449730],
      [596883563, 1867755857],
      [2520282905, 1497426621],
      [2519219938, 2827943907],
      [3193839141, 1401305490],
      [721525244, 746961066],
      [246885852, 2177182882]
    ];
    _states["SHA-512/224"] = [
      [2352822216, 424955298],
      [1944164710, 2312950998],
      [502970286, 855612546],
      [1738396948, 1479516111],
      [258812777, 2077511080],
      [2011393907, 79989058],
      [1067287976, 1780299464],
      [286451373, 2446758561]
    ];
    _initialized = true;
  }
  function _update(s, w, bytes) {
    var t1_hi, t1_lo;
    var t2_hi, t2_lo;
    var s0_hi, s0_lo;
    var s1_hi, s1_lo;
    var ch_hi, ch_lo;
    var maj_hi, maj_lo;
    var a_hi, a_lo;
    var b_hi, b_lo;
    var c_hi, c_lo;
    var d_hi, d_lo;
    var e_hi, e_lo;
    var f_hi, f_lo;
    var g_hi, g_lo;
    var h_hi, h_lo;
    var i, hi, lo, w2, w7, w15, w16;
    var len = bytes.length();
    while (len >= 128) {
      for (i = 0;i < 16; ++i) {
        w[i][0] = bytes.getInt32() >>> 0;
        w[i][1] = bytes.getInt32() >>> 0;
      }
      for (;i < 80; ++i) {
        w2 = w[i - 2];
        hi = w2[0];
        lo = w2[1];
        t1_hi = ((hi >>> 19 | lo << 13) ^ (lo >>> 29 | hi << 3) ^ hi >>> 6) >>> 0;
        t1_lo = ((hi << 13 | lo >>> 19) ^ (lo << 3 | hi >>> 29) ^ (hi << 26 | lo >>> 6)) >>> 0;
        w15 = w[i - 15];
        hi = w15[0];
        lo = w15[1];
        t2_hi = ((hi >>> 1 | lo << 31) ^ (hi >>> 8 | lo << 24) ^ hi >>> 7) >>> 0;
        t2_lo = ((hi << 31 | lo >>> 1) ^ (hi << 24 | lo >>> 8) ^ (hi << 25 | lo >>> 7)) >>> 0;
        w7 = w[i - 7];
        w16 = w[i - 16];
        lo = t1_lo + w7[1] + t2_lo + w16[1];
        w[i][0] = t1_hi + w7[0] + t2_hi + w16[0] + (lo / 4294967296 >>> 0) >>> 0;
        w[i][1] = lo >>> 0;
      }
      a_hi = s[0][0];
      a_lo = s[0][1];
      b_hi = s[1][0];
      b_lo = s[1][1];
      c_hi = s[2][0];
      c_lo = s[2][1];
      d_hi = s[3][0];
      d_lo = s[3][1];
      e_hi = s[4][0];
      e_lo = s[4][1];
      f_hi = s[5][0];
      f_lo = s[5][1];
      g_hi = s[6][0];
      g_lo = s[6][1];
      h_hi = s[7][0];
      h_lo = s[7][1];
      for (i = 0;i < 80; ++i) {
        s1_hi = ((e_hi >>> 14 | e_lo << 18) ^ (e_hi >>> 18 | e_lo << 14) ^ (e_lo >>> 9 | e_hi << 23)) >>> 0;
        s1_lo = ((e_hi << 18 | e_lo >>> 14) ^ (e_hi << 14 | e_lo >>> 18) ^ (e_lo << 23 | e_hi >>> 9)) >>> 0;
        ch_hi = (g_hi ^ e_hi & (f_hi ^ g_hi)) >>> 0;
        ch_lo = (g_lo ^ e_lo & (f_lo ^ g_lo)) >>> 0;
        s0_hi = ((a_hi >>> 28 | a_lo << 4) ^ (a_lo >>> 2 | a_hi << 30) ^ (a_lo >>> 7 | a_hi << 25)) >>> 0;
        s0_lo = ((a_hi << 4 | a_lo >>> 28) ^ (a_lo << 30 | a_hi >>> 2) ^ (a_lo << 25 | a_hi >>> 7)) >>> 0;
        maj_hi = (a_hi & b_hi | c_hi & (a_hi ^ b_hi)) >>> 0;
        maj_lo = (a_lo & b_lo | c_lo & (a_lo ^ b_lo)) >>> 0;
        lo = h_lo + s1_lo + ch_lo + _k[i][1] + w[i][1];
        t1_hi = h_hi + s1_hi + ch_hi + _k[i][0] + w[i][0] + (lo / 4294967296 >>> 0) >>> 0;
        t1_lo = lo >>> 0;
        lo = s0_lo + maj_lo;
        t2_hi = s0_hi + maj_hi + (lo / 4294967296 >>> 0) >>> 0;
        t2_lo = lo >>> 0;
        h_hi = g_hi;
        h_lo = g_lo;
        g_hi = f_hi;
        g_lo = f_lo;
        f_hi = e_hi;
        f_lo = e_lo;
        lo = d_lo + t1_lo;
        e_hi = d_hi + t1_hi + (lo / 4294967296 >>> 0) >>> 0;
        e_lo = lo >>> 0;
        d_hi = c_hi;
        d_lo = c_lo;
        c_hi = b_hi;
        c_lo = b_lo;
        b_hi = a_hi;
        b_lo = a_lo;
        lo = t1_lo + t2_lo;
        a_hi = t1_hi + t2_hi + (lo / 4294967296 >>> 0) >>> 0;
        a_lo = lo >>> 0;
      }
      lo = s[0][1] + a_lo;
      s[0][0] = s[0][0] + a_hi + (lo / 4294967296 >>> 0) >>> 0;
      s[0][1] = lo >>> 0;
      lo = s[1][1] + b_lo;
      s[1][0] = s[1][0] + b_hi + (lo / 4294967296 >>> 0) >>> 0;
      s[1][1] = lo >>> 0;
      lo = s[2][1] + c_lo;
      s[2][0] = s[2][0] + c_hi + (lo / 4294967296 >>> 0) >>> 0;
      s[2][1] = lo >>> 0;
      lo = s[3][1] + d_lo;
      s[3][0] = s[3][0] + d_hi + (lo / 4294967296 >>> 0) >>> 0;
      s[3][1] = lo >>> 0;
      lo = s[4][1] + e_lo;
      s[4][0] = s[4][0] + e_hi + (lo / 4294967296 >>> 0) >>> 0;
      s[4][1] = lo >>> 0;
      lo = s[5][1] + f_lo;
      s[5][0] = s[5][0] + f_hi + (lo / 4294967296 >>> 0) >>> 0;
      s[5][1] = lo >>> 0;
      lo = s[6][1] + g_lo;
      s[6][0] = s[6][0] + g_hi + (lo / 4294967296 >>> 0) >>> 0;
      s[6][1] = lo >>> 0;
      lo = s[7][1] + h_lo;
      s[7][0] = s[7][0] + h_hi + (lo / 4294967296 >>> 0) >>> 0;
      s[7][1] = lo >>> 0;
      len -= 128;
    }
  }
});

// node_modules/node-forge/lib/asn1-validator.js
var require_asn1_validator = __commonJS((exports) => {
  var forge = require_forge();
  require_asn1();
  var asn1 = forge.asn1;
  exports.privateKeyValidator = {
    name: "PrivateKeyInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "PrivateKeyInfo.version",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "privateKeyVersion"
    }, {
      name: "PrivateKeyInfo.privateKeyAlgorithm",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "AlgorithmIdentifier.algorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: "privateKeyOid"
      }]
    }, {
      name: "PrivateKeyInfo",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OCTETSTRING,
      constructed: false,
      capture: "privateKey"
    }]
  };
  exports.publicKeyValidator = {
    name: "SubjectPublicKeyInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    captureAsn1: "subjectPublicKeyInfo",
    value: [
      {
        name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "AlgorithmIdentifier.algorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: "publicKeyOid"
        }]
      },
      {
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.BITSTRING,
        constructed: false,
        composed: true,
        captureBitStringValue: "ed25519PublicKey"
      }
    ]
  };
});

// node_modules/node-forge/lib/ed25519.js
var require_ed25519 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_jsbn();
  require_random();
  require_sha512();
  require_util();
  var asn1Validator = require_asn1_validator();
  var publicKeyValidator = asn1Validator.publicKeyValidator;
  var privateKeyValidator = asn1Validator.privateKeyValidator;
  if (typeof BigInteger === "undefined") {
    BigInteger = forge.jsbn.BigInteger;
  }
  var BigInteger;
  var ByteBuffer = forge.util.ByteBuffer;
  var NativeBuffer = typeof Buffer === "undefined" ? Uint8Array : Buffer;
  forge.pki = forge.pki || {};
  module.exports = forge.pki.ed25519 = forge.ed25519 = forge.ed25519 || {};
  var ed25519 = forge.ed25519;
  ed25519.constants = {};
  ed25519.constants.PUBLIC_KEY_BYTE_LENGTH = 32;
  ed25519.constants.PRIVATE_KEY_BYTE_LENGTH = 64;
  ed25519.constants.SEED_BYTE_LENGTH = 32;
  ed25519.constants.SIGN_BYTE_LENGTH = 64;
  ed25519.constants.HASH_BYTE_LENGTH = 64;
  ed25519.generateKeyPair = function(options) {
    options = options || {};
    var seed = options.seed;
    if (seed === undefined) {
      seed = forge.random.getBytesSync(ed25519.constants.SEED_BYTE_LENGTH);
    } else if (typeof seed === "string") {
      if (seed.length !== ed25519.constants.SEED_BYTE_LENGTH) {
        throw new TypeError('"seed" must be ' + ed25519.constants.SEED_BYTE_LENGTH + " bytes in length.");
      }
    } else if (!(seed instanceof Uint8Array)) {
      throw new TypeError('"seed" must be a node.js Buffer, Uint8Array, or a binary string.');
    }
    seed = messageToNativeBuffer({ message: seed, encoding: "binary" });
    var pk = new NativeBuffer(ed25519.constants.PUBLIC_KEY_BYTE_LENGTH);
    var sk = new NativeBuffer(ed25519.constants.PRIVATE_KEY_BYTE_LENGTH);
    for (var i = 0;i < 32; ++i) {
      sk[i] = seed[i];
    }
    crypto_sign_keypair(pk, sk);
    return { publicKey: pk, privateKey: sk };
  };
  ed25519.privateKeyFromAsn1 = function(obj) {
    var capture = {};
    var errors2 = [];
    var valid = forge.asn1.validate(obj, privateKeyValidator, capture, errors2);
    if (!valid) {
      var error = new Error("Invalid Key.");
      error.errors = errors2;
      throw error;
    }
    var oid = forge.asn1.derToOid(capture.privateKeyOid);
    var ed25519Oid = forge.oids.EdDSA25519;
    if (oid !== ed25519Oid) {
      throw new Error('Invalid OID "' + oid + '"; OID must be "' + ed25519Oid + '".');
    }
    var privateKey = capture.privateKey;
    var privateKeyBytes = messageToNativeBuffer({
      message: forge.asn1.fromDer(privateKey).value,
      encoding: "binary"
    });
    return { privateKeyBytes };
  };
  ed25519.publicKeyFromAsn1 = function(obj) {
    var capture = {};
    var errors2 = [];
    var valid = forge.asn1.validate(obj, publicKeyValidator, capture, errors2);
    if (!valid) {
      var error = new Error("Invalid Key.");
      error.errors = errors2;
      throw error;
    }
    var oid = forge.asn1.derToOid(capture.publicKeyOid);
    var ed25519Oid = forge.oids.EdDSA25519;
    if (oid !== ed25519Oid) {
      throw new Error('Invalid OID "' + oid + '"; OID must be "' + ed25519Oid + '".');
    }
    var publicKeyBytes = capture.ed25519PublicKey;
    if (publicKeyBytes.length !== ed25519.constants.PUBLIC_KEY_BYTE_LENGTH) {
      throw new Error("Key length is invalid.");
    }
    return messageToNativeBuffer({
      message: publicKeyBytes,
      encoding: "binary"
    });
  };
  ed25519.publicKeyFromPrivateKey = function(options) {
    options = options || {};
    var privateKey = messageToNativeBuffer({
      message: options.privateKey,
      encoding: "binary"
    });
    if (privateKey.length !== ed25519.constants.PRIVATE_KEY_BYTE_LENGTH) {
      throw new TypeError('"options.privateKey" must have a byte length of ' + ed25519.constants.PRIVATE_KEY_BYTE_LENGTH);
    }
    var pk = new NativeBuffer(ed25519.constants.PUBLIC_KEY_BYTE_LENGTH);
    for (var i = 0;i < pk.length; ++i) {
      pk[i] = privateKey[32 + i];
    }
    return pk;
  };
  ed25519.sign = function(options) {
    options = options || {};
    var msg = messageToNativeBuffer(options);
    var privateKey = messageToNativeBuffer({
      message: options.privateKey,
      encoding: "binary"
    });
    if (privateKey.length === ed25519.constants.SEED_BYTE_LENGTH) {
      var keyPair = ed25519.generateKeyPair({ seed: privateKey });
      privateKey = keyPair.privateKey;
    } else if (privateKey.length !== ed25519.constants.PRIVATE_KEY_BYTE_LENGTH) {
      throw new TypeError('"options.privateKey" must have a byte length of ' + ed25519.constants.SEED_BYTE_LENGTH + " or " + ed25519.constants.PRIVATE_KEY_BYTE_LENGTH);
    }
    var signedMsg = new NativeBuffer(ed25519.constants.SIGN_BYTE_LENGTH + msg.length);
    crypto_sign(signedMsg, msg, msg.length, privateKey);
    var sig = new NativeBuffer(ed25519.constants.SIGN_BYTE_LENGTH);
    for (var i = 0;i < sig.length; ++i) {
      sig[i] = signedMsg[i];
    }
    return sig;
  };
  ed25519.verify = function(options) {
    options = options || {};
    var msg = messageToNativeBuffer(options);
    if (options.signature === undefined) {
      throw new TypeError('"options.signature" must be a node.js Buffer, a Uint8Array, a forge ' + "ByteBuffer, or a binary string.");
    }
    var sig = messageToNativeBuffer({
      message: options.signature,
      encoding: "binary"
    });
    if (sig.length !== ed25519.constants.SIGN_BYTE_LENGTH) {
      throw new TypeError('"options.signature" must have a byte length of ' + ed25519.constants.SIGN_BYTE_LENGTH);
    }
    var publicKey = messageToNativeBuffer({
      message: options.publicKey,
      encoding: "binary"
    });
    if (publicKey.length !== ed25519.constants.PUBLIC_KEY_BYTE_LENGTH) {
      throw new TypeError('"options.publicKey" must have a byte length of ' + ed25519.constants.PUBLIC_KEY_BYTE_LENGTH);
    }
    var sm = new NativeBuffer(ed25519.constants.SIGN_BYTE_LENGTH + msg.length);
    var m = new NativeBuffer(ed25519.constants.SIGN_BYTE_LENGTH + msg.length);
    var i;
    for (i = 0;i < ed25519.constants.SIGN_BYTE_LENGTH; ++i) {
      sm[i] = sig[i];
    }
    for (i = 0;i < msg.length; ++i) {
      sm[i + ed25519.constants.SIGN_BYTE_LENGTH] = msg[i];
    }
    return crypto_sign_open(m, sm, sm.length, publicKey) >= 0;
  };
  function messageToNativeBuffer(options) {
    var message = options.message;
    if (message instanceof Uint8Array || message instanceof NativeBuffer) {
      return message;
    }
    var encoding = options.encoding;
    if (message === undefined) {
      if (options.md) {
        message = options.md.digest().getBytes();
        encoding = "binary";
      } else {
        throw new TypeError('"options.message" or "options.md" not specified.');
      }
    }
    if (typeof message === "string" && !encoding) {
      throw new TypeError('"options.encoding" must be "binary" or "utf8".');
    }
    if (typeof message === "string") {
      if (typeof Buffer !== "undefined") {
        return Buffer.from(message, encoding);
      }
      message = new ByteBuffer(message, encoding);
    } else if (!(message instanceof ByteBuffer)) {
      throw new TypeError('"options.message" must be a node.js Buffer, a Uint8Array, a forge ' + 'ByteBuffer, or a string with "options.encoding" specifying its ' + "encoding.");
    }
    var buffer = new NativeBuffer(message.length());
    for (var i = 0;i < buffer.length; ++i) {
      buffer[i] = message.at(i);
    }
    return buffer;
  }
  var gf0 = gf();
  var gf1 = gf([1]);
  var D = gf([
    30883,
    4953,
    19914,
    30187,
    55467,
    16705,
    2637,
    112,
    59544,
    30585,
    16505,
    36039,
    65139,
    11119,
    27886,
    20995
  ]);
  var D2 = gf([
    61785,
    9906,
    39828,
    60374,
    45398,
    33411,
    5274,
    224,
    53552,
    61171,
    33010,
    6542,
    64743,
    22239,
    55772,
    9222
  ]);
  var X = gf([
    54554,
    36645,
    11616,
    51542,
    42930,
    38181,
    51040,
    26924,
    56412,
    64982,
    57905,
    49316,
    21502,
    52590,
    14035,
    8553
  ]);
  var Y = gf([
    26200,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214
  ]);
  var L = new Float64Array([
    237,
    211,
    245,
    92,
    26,
    99,
    18,
    88,
    214,
    156,
    247,
    162,
    222,
    249,
    222,
    20,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    16
  ]);
  var I = gf([
    41136,
    18958,
    6951,
    50414,
    58488,
    44335,
    6150,
    12099,
    55207,
    15867,
    153,
    11085,
    57099,
    20417,
    9344,
    11139
  ]);
  function sha512(msg, msgLen) {
    var md = forge.md.sha512.create();
    var buffer = new ByteBuffer(msg);
    md.update(buffer.getBytes(msgLen), "binary");
    var hash = md.digest().getBytes();
    if (typeof Buffer !== "undefined") {
      return Buffer.from(hash, "binary");
    }
    var out = new NativeBuffer(ed25519.constants.HASH_BYTE_LENGTH);
    for (var i = 0;i < 64; ++i) {
      out[i] = hash.charCodeAt(i);
    }
    return out;
  }
  function crypto_sign_keypair(pk, sk) {
    var p = [gf(), gf(), gf(), gf()];
    var i;
    var d = sha512(sk, 32);
    d[0] &= 248;
    d[31] &= 127;
    d[31] |= 64;
    scalarbase(p, d);
    pack(pk, p);
    for (i = 0;i < 32; ++i) {
      sk[i + 32] = pk[i];
    }
    return 0;
  }
  function crypto_sign(sm, m, n, sk) {
    var i, j, x = new Float64Array(64);
    var p = [gf(), gf(), gf(), gf()];
    var d = sha512(sk, 32);
    d[0] &= 248;
    d[31] &= 127;
    d[31] |= 64;
    var smlen = n + 64;
    for (i = 0;i < n; ++i) {
      sm[64 + i] = m[i];
    }
    for (i = 0;i < 32; ++i) {
      sm[32 + i] = d[32 + i];
    }
    var r = sha512(sm.subarray(32), n + 32);
    reduce(r);
    scalarbase(p, r);
    pack(sm, p);
    for (i = 32;i < 64; ++i) {
      sm[i] = sk[i];
    }
    var h = sha512(sm, n + 64);
    reduce(h);
    for (i = 32;i < 64; ++i) {
      x[i] = 0;
    }
    for (i = 0;i < 32; ++i) {
      x[i] = r[i];
    }
    for (i = 0;i < 32; ++i) {
      for (j = 0;j < 32; j++) {
        x[i + j] += h[i] * d[j];
      }
    }
    modL(sm.subarray(32), x);
    return smlen;
  }
  function crypto_sign_open(m, sm, n, pk) {
    var i, mlen;
    var t = new NativeBuffer(32);
    var p = [gf(), gf(), gf(), gf()], q = [gf(), gf(), gf(), gf()];
    mlen = -1;
    if (n < 64) {
      return -1;
    }
    if (unpackneg(q, pk)) {
      return -1;
    }
    if (!_isCanonicalSignatureScalar(sm, 32)) {
      return -1;
    }
    for (i = 0;i < n; ++i) {
      m[i] = sm[i];
    }
    for (i = 0;i < 32; ++i) {
      m[i + 32] = pk[i];
    }
    var h = sha512(m, n);
    reduce(h);
    scalarmult(p, q, h);
    scalarbase(q, sm.subarray(32));
    add(p, q);
    pack(t, p);
    n -= 64;
    if (crypto_verify_32(sm, 0, t, 0)) {
      for (i = 0;i < n; ++i) {
        m[i] = 0;
      }
      return -1;
    }
    for (i = 0;i < n; ++i) {
      m[i] = sm[i + 64];
    }
    mlen = n;
    return mlen;
  }
  function _isCanonicalSignatureScalar(bytes, offset) {
    var i;
    for (i = 31;i >= 0; --i) {
      if (bytes[offset + i] < L[i]) {
        return true;
      }
      if (bytes[offset + i] > L[i]) {
        return false;
      }
    }
    return false;
  }
  function modL(r, x) {
    var carry, i, j, k;
    for (i = 63;i >= 32; --i) {
      carry = 0;
      for (j = i - 32, k = i - 12;j < k; ++j) {
        x[j] += carry - 16 * x[i] * L[j - (i - 32)];
        carry = x[j] + 128 >> 8;
        x[j] -= carry * 256;
      }
      x[j] += carry;
      x[i] = 0;
    }
    carry = 0;
    for (j = 0;j < 32; ++j) {
      x[j] += carry - (x[31] >> 4) * L[j];
      carry = x[j] >> 8;
      x[j] &= 255;
    }
    for (j = 0;j < 32; ++j) {
      x[j] -= carry * L[j];
    }
    for (i = 0;i < 32; ++i) {
      x[i + 1] += x[i] >> 8;
      r[i] = x[i] & 255;
    }
  }
  function reduce(r) {
    var x = new Float64Array(64);
    for (var i = 0;i < 64; ++i) {
      x[i] = r[i];
      r[i] = 0;
    }
    modL(r, x);
  }
  function add(p, q) {
    var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h = gf(), t = gf();
    Z(a, p[1], p[0]);
    Z(t, q[1], q[0]);
    M(a, a, t);
    A(b, p[0], p[1]);
    A(t, q[0], q[1]);
    M(b, b, t);
    M(c, p[3], q[3]);
    M(c, c, D2);
    M(d, p[2], q[2]);
    A(d, d, d);
    Z(e, b, a);
    Z(f, d, c);
    A(g, d, c);
    A(h, b, a);
    M(p[0], e, f);
    M(p[1], h, g);
    M(p[2], g, f);
    M(p[3], e, h);
  }
  function cswap(p, q, b) {
    for (var i = 0;i < 4; ++i) {
      sel25519(p[i], q[i], b);
    }
  }
  function pack(r, p) {
    var tx = gf(), ty = gf(), zi = gf();
    inv25519(zi, p[2]);
    M(tx, p[0], zi);
    M(ty, p[1], zi);
    pack25519(r, ty);
    r[31] ^= par25519(tx) << 7;
  }
  function pack25519(o, n) {
    var i, j, b;
    var m = gf(), t = gf();
    for (i = 0;i < 16; ++i) {
      t[i] = n[i];
    }
    car25519(t);
    car25519(t);
    car25519(t);
    for (j = 0;j < 2; ++j) {
      m[0] = t[0] - 65517;
      for (i = 1;i < 15; ++i) {
        m[i] = t[i] - 65535 - (m[i - 1] >> 16 & 1);
        m[i - 1] &= 65535;
      }
      m[15] = t[15] - 32767 - (m[14] >> 16 & 1);
      b = m[15] >> 16 & 1;
      m[14] &= 65535;
      sel25519(t, m, 1 - b);
    }
    for (i = 0;i < 16; i++) {
      o[2 * i] = t[i] & 255;
      o[2 * i + 1] = t[i] >> 8;
    }
  }
  function unpackneg(r, p) {
    var t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
    set25519(r[2], gf1);
    unpack25519(r[1], p);
    S(num, r[1]);
    M(den, num, D);
    Z(num, num, r[2]);
    A(den, r[2], den);
    S(den2, den);
    S(den4, den2);
    M(den6, den4, den2);
    M(t, den6, num);
    M(t, t, den);
    pow2523(t, t);
    M(t, t, num);
    M(t, t, den);
    M(t, t, den);
    M(r[0], t, den);
    S(chk, r[0]);
    M(chk, chk, den);
    if (neq25519(chk, num)) {
      M(r[0], r[0], I);
    }
    S(chk, r[0]);
    M(chk, chk, den);
    if (neq25519(chk, num)) {
      return -1;
    }
    if (par25519(r[0]) === p[31] >> 7) {
      Z(r[0], gf0, r[0]);
    }
    M(r[3], r[0], r[1]);
    return 0;
  }
  function unpack25519(o, n) {
    var i;
    for (i = 0;i < 16; ++i) {
      o[i] = n[2 * i] + (n[2 * i + 1] << 8);
    }
    o[15] &= 32767;
  }
  function pow2523(o, i) {
    var c = gf();
    var a;
    for (a = 0;a < 16; ++a) {
      c[a] = i[a];
    }
    for (a = 250;a >= 0; --a) {
      S(c, c);
      if (a !== 1) {
        M(c, c, i);
      }
    }
    for (a = 0;a < 16; ++a) {
      o[a] = c[a];
    }
  }
  function neq25519(a, b) {
    var c = new NativeBuffer(32);
    var d = new NativeBuffer(32);
    pack25519(c, a);
    pack25519(d, b);
    return crypto_verify_32(c, 0, d, 0);
  }
  function crypto_verify_32(x, xi, y, yi) {
    return vn(x, xi, y, yi, 32);
  }
  function vn(x, xi, y, yi, n) {
    var i, d = 0;
    for (i = 0;i < n; ++i) {
      d |= x[xi + i] ^ y[yi + i];
    }
    return (1 & d - 1 >>> 8) - 1;
  }
  function par25519(a) {
    var d = new NativeBuffer(32);
    pack25519(d, a);
    return d[0] & 1;
  }
  function scalarmult(p, q, s) {
    var b, i;
    set25519(p[0], gf0);
    set25519(p[1], gf1);
    set25519(p[2], gf1);
    set25519(p[3], gf0);
    for (i = 255;i >= 0; --i) {
      b = s[i / 8 | 0] >> (i & 7) & 1;
      cswap(p, q, b);
      add(q, p);
      add(p, p);
      cswap(p, q, b);
    }
  }
  function scalarbase(p, s) {
    var q = [gf(), gf(), gf(), gf()];
    set25519(q[0], X);
    set25519(q[1], Y);
    set25519(q[2], gf1);
    M(q[3], X, Y);
    scalarmult(p, q, s);
  }
  function set25519(r, a) {
    var i;
    for (i = 0;i < 16; i++) {
      r[i] = a[i] | 0;
    }
  }
  function inv25519(o, i) {
    var c = gf();
    var a;
    for (a = 0;a < 16; ++a) {
      c[a] = i[a];
    }
    for (a = 253;a >= 0; --a) {
      S(c, c);
      if (a !== 2 && a !== 4) {
        M(c, c, i);
      }
    }
    for (a = 0;a < 16; ++a) {
      o[a] = c[a];
    }
  }
  function car25519(o) {
    var i, v, c = 1;
    for (i = 0;i < 16; ++i) {
      v = o[i] + c + 65535;
      c = Math.floor(v / 65536);
      o[i] = v - c * 65536;
    }
    o[0] += c - 1 + 37 * (c - 1);
  }
  function sel25519(p, q, b) {
    var t, c = ~(b - 1);
    for (var i = 0;i < 16; ++i) {
      t = c & (p[i] ^ q[i]);
      p[i] ^= t;
      q[i] ^= t;
    }
  }
  function gf(init) {
    var i, r = new Float64Array(16);
    if (init) {
      for (i = 0;i < init.length; ++i) {
        r[i] = init[i];
      }
    }
    return r;
  }
  function A(o, a, b) {
    for (var i = 0;i < 16; ++i) {
      o[i] = a[i] + b[i];
    }
  }
  function Z(o, a, b) {
    for (var i = 0;i < 16; ++i) {
      o[i] = a[i] - b[i];
    }
  }
  function S(o, a) {
    M(o, a, a);
  }
  function M(o, a, b) {
    var v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
    v = a[0];
    t0 += v * b0;
    t1 += v * b1;
    t2 += v * b2;
    t3 += v * b3;
    t4 += v * b4;
    t5 += v * b5;
    t6 += v * b6;
    t7 += v * b7;
    t8 += v * b8;
    t9 += v * b9;
    t10 += v * b10;
    t11 += v * b11;
    t12 += v * b12;
    t13 += v * b13;
    t14 += v * b14;
    t15 += v * b15;
    v = a[1];
    t1 += v * b0;
    t2 += v * b1;
    t3 += v * b2;
    t4 += v * b3;
    t5 += v * b4;
    t6 += v * b5;
    t7 += v * b6;
    t8 += v * b7;
    t9 += v * b8;
    t10 += v * b9;
    t11 += v * b10;
    t12 += v * b11;
    t13 += v * b12;
    t14 += v * b13;
    t15 += v * b14;
    t16 += v * b15;
    v = a[2];
    t2 += v * b0;
    t3 += v * b1;
    t4 += v * b2;
    t5 += v * b3;
    t6 += v * b4;
    t7 += v * b5;
    t8 += v * b6;
    t9 += v * b7;
    t10 += v * b8;
    t11 += v * b9;
    t12 += v * b10;
    t13 += v * b11;
    t14 += v * b12;
    t15 += v * b13;
    t16 += v * b14;
    t17 += v * b15;
    v = a[3];
    t3 += v * b0;
    t4 += v * b1;
    t5 += v * b2;
    t6 += v * b3;
    t7 += v * b4;
    t8 += v * b5;
    t9 += v * b6;
    t10 += v * b7;
    t11 += v * b8;
    t12 += v * b9;
    t13 += v * b10;
    t14 += v * b11;
    t15 += v * b12;
    t16 += v * b13;
    t17 += v * b14;
    t18 += v * b15;
    v = a[4];
    t4 += v * b0;
    t5 += v * b1;
    t6 += v * b2;
    t7 += v * b3;
    t8 += v * b4;
    t9 += v * b5;
    t10 += v * b6;
    t11 += v * b7;
    t12 += v * b8;
    t13 += v * b9;
    t14 += v * b10;
    t15 += v * b11;
    t16 += v * b12;
    t17 += v * b13;
    t18 += v * b14;
    t19 += v * b15;
    v = a[5];
    t5 += v * b0;
    t6 += v * b1;
    t7 += v * b2;
    t8 += v * b3;
    t9 += v * b4;
    t10 += v * b5;
    t11 += v * b6;
    t12 += v * b7;
    t13 += v * b8;
    t14 += v * b9;
    t15 += v * b10;
    t16 += v * b11;
    t17 += v * b12;
    t18 += v * b13;
    t19 += v * b14;
    t20 += v * b15;
    v = a[6];
    t6 += v * b0;
    t7 += v * b1;
    t8 += v * b2;
    t9 += v * b3;
    t10 += v * b4;
    t11 += v * b5;
    t12 += v * b6;
    t13 += v * b7;
    t14 += v * b8;
    t15 += v * b9;
    t16 += v * b10;
    t17 += v * b11;
    t18 += v * b12;
    t19 += v * b13;
    t20 += v * b14;
    t21 += v * b15;
    v = a[7];
    t7 += v * b0;
    t8 += v * b1;
    t9 += v * b2;
    t10 += v * b3;
    t11 += v * b4;
    t12 += v * b5;
    t13 += v * b6;
    t14 += v * b7;
    t15 += v * b8;
    t16 += v * b9;
    t17 += v * b10;
    t18 += v * b11;
    t19 += v * b12;
    t20 += v * b13;
    t21 += v * b14;
    t22 += v * b15;
    v = a[8];
    t8 += v * b0;
    t9 += v * b1;
    t10 += v * b2;
    t11 += v * b3;
    t12 += v * b4;
    t13 += v * b5;
    t14 += v * b6;
    t15 += v * b7;
    t16 += v * b8;
    t17 += v * b9;
    t18 += v * b10;
    t19 += v * b11;
    t20 += v * b12;
    t21 += v * b13;
    t22 += v * b14;
    t23 += v * b15;
    v = a[9];
    t9 += v * b0;
    t10 += v * b1;
    t11 += v * b2;
    t12 += v * b3;
    t13 += v * b4;
    t14 += v * b5;
    t15 += v * b6;
    t16 += v * b7;
    t17 += v * b8;
    t18 += v * b9;
    t19 += v * b10;
    t20 += v * b11;
    t21 += v * b12;
    t22 += v * b13;
    t23 += v * b14;
    t24 += v * b15;
    v = a[10];
    t10 += v * b0;
    t11 += v * b1;
    t12 += v * b2;
    t13 += v * b3;
    t14 += v * b4;
    t15 += v * b5;
    t16 += v * b6;
    t17 += v * b7;
    t18 += v * b8;
    t19 += v * b9;
    t20 += v * b10;
    t21 += v * b11;
    t22 += v * b12;
    t23 += v * b13;
    t24 += v * b14;
    t25 += v * b15;
    v = a[11];
    t11 += v * b0;
    t12 += v * b1;
    t13 += v * b2;
    t14 += v * b3;
    t15 += v * b4;
    t16 += v * b5;
    t17 += v * b6;
    t18 += v * b7;
    t19 += v * b8;
    t20 += v * b9;
    t21 += v * b10;
    t22 += v * b11;
    t23 += v * b12;
    t24 += v * b13;
    t25 += v * b14;
    t26 += v * b15;
    v = a[12];
    t12 += v * b0;
    t13 += v * b1;
    t14 += v * b2;
    t15 += v * b3;
    t16 += v * b4;
    t17 += v * b5;
    t18 += v * b6;
    t19 += v * b7;
    t20 += v * b8;
    t21 += v * b9;
    t22 += v * b10;
    t23 += v * b11;
    t24 += v * b12;
    t25 += v * b13;
    t26 += v * b14;
    t27 += v * b15;
    v = a[13];
    t13 += v * b0;
    t14 += v * b1;
    t15 += v * b2;
    t16 += v * b3;
    t17 += v * b4;
    t18 += v * b5;
    t19 += v * b6;
    t20 += v * b7;
    t21 += v * b8;
    t22 += v * b9;
    t23 += v * b10;
    t24 += v * b11;
    t25 += v * b12;
    t26 += v * b13;
    t27 += v * b14;
    t28 += v * b15;
    v = a[14];
    t14 += v * b0;
    t15 += v * b1;
    t16 += v * b2;
    t17 += v * b3;
    t18 += v * b4;
    t19 += v * b5;
    t20 += v * b6;
    t21 += v * b7;
    t22 += v * b8;
    t23 += v * b9;
    t24 += v * b10;
    t25 += v * b11;
    t26 += v * b12;
    t27 += v * b13;
    t28 += v * b14;
    t29 += v * b15;
    v = a[15];
    t15 += v * b0;
    t16 += v * b1;
    t17 += v * b2;
    t18 += v * b3;
    t19 += v * b4;
    t20 += v * b5;
    t21 += v * b6;
    t22 += v * b7;
    t23 += v * b8;
    t24 += v * b9;
    t25 += v * b10;
    t26 += v * b11;
    t27 += v * b12;
    t28 += v * b13;
    t29 += v * b14;
    t30 += v * b15;
    t0 += 38 * t16;
    t1 += 38 * t17;
    t2 += 38 * t18;
    t3 += 38 * t19;
    t4 += 38 * t20;
    t5 += 38 * t21;
    t6 += 38 * t22;
    t7 += 38 * t23;
    t8 += 38 * t24;
    t9 += 38 * t25;
    t10 += 38 * t26;
    t11 += 38 * t27;
    t12 += 38 * t28;
    t13 += 38 * t29;
    t14 += 38 * t30;
    c = 1;
    v = t0 + c + 65535;
    c = Math.floor(v / 65536);
    t0 = v - c * 65536;
    v = t1 + c + 65535;
    c = Math.floor(v / 65536);
    t1 = v - c * 65536;
    v = t2 + c + 65535;
    c = Math.floor(v / 65536);
    t2 = v - c * 65536;
    v = t3 + c + 65535;
    c = Math.floor(v / 65536);
    t3 = v - c * 65536;
    v = t4 + c + 65535;
    c = Math.floor(v / 65536);
    t4 = v - c * 65536;
    v = t5 + c + 65535;
    c = Math.floor(v / 65536);
    t5 = v - c * 65536;
    v = t6 + c + 65535;
    c = Math.floor(v / 65536);
    t6 = v - c * 65536;
    v = t7 + c + 65535;
    c = Math.floor(v / 65536);
    t7 = v - c * 65536;
    v = t8 + c + 65535;
    c = Math.floor(v / 65536);
    t8 = v - c * 65536;
    v = t9 + c + 65535;
    c = Math.floor(v / 65536);
    t9 = v - c * 65536;
    v = t10 + c + 65535;
    c = Math.floor(v / 65536);
    t10 = v - c * 65536;
    v = t11 + c + 65535;
    c = Math.floor(v / 65536);
    t11 = v - c * 65536;
    v = t12 + c + 65535;
    c = Math.floor(v / 65536);
    t12 = v - c * 65536;
    v = t13 + c + 65535;
    c = Math.floor(v / 65536);
    t13 = v - c * 65536;
    v = t14 + c + 65535;
    c = Math.floor(v / 65536);
    t14 = v - c * 65536;
    v = t15 + c + 65535;
    c = Math.floor(v / 65536);
    t15 = v - c * 65536;
    t0 += c - 1 + 37 * (c - 1);
    c = 1;
    v = t0 + c + 65535;
    c = Math.floor(v / 65536);
    t0 = v - c * 65536;
    v = t1 + c + 65535;
    c = Math.floor(v / 65536);
    t1 = v - c * 65536;
    v = t2 + c + 65535;
    c = Math.floor(v / 65536);
    t2 = v - c * 65536;
    v = t3 + c + 65535;
    c = Math.floor(v / 65536);
    t3 = v - c * 65536;
    v = t4 + c + 65535;
    c = Math.floor(v / 65536);
    t4 = v - c * 65536;
    v = t5 + c + 65535;
    c = Math.floor(v / 65536);
    t5 = v - c * 65536;
    v = t6 + c + 65535;
    c = Math.floor(v / 65536);
    t6 = v - c * 65536;
    v = t7 + c + 65535;
    c = Math.floor(v / 65536);
    t7 = v - c * 65536;
    v = t8 + c + 65535;
    c = Math.floor(v / 65536);
    t8 = v - c * 65536;
    v = t9 + c + 65535;
    c = Math.floor(v / 65536);
    t9 = v - c * 65536;
    v = t10 + c + 65535;
    c = Math.floor(v / 65536);
    t10 = v - c * 65536;
    v = t11 + c + 65535;
    c = Math.floor(v / 65536);
    t11 = v - c * 65536;
    v = t12 + c + 65535;
    c = Math.floor(v / 65536);
    t12 = v - c * 65536;
    v = t13 + c + 65535;
    c = Math.floor(v / 65536);
    t13 = v - c * 65536;
    v = t14 + c + 65535;
    c = Math.floor(v / 65536);
    t14 = v - c * 65536;
    v = t15 + c + 65535;
    c = Math.floor(v / 65536);
    t15 = v - c * 65536;
    t0 += c - 1 + 37 * (c - 1);
    o[0] = t0;
    o[1] = t1;
    o[2] = t2;
    o[3] = t3;
    o[4] = t4;
    o[5] = t5;
    o[6] = t6;
    o[7] = t7;
    o[8] = t8;
    o[9] = t9;
    o[10] = t10;
    o[11] = t11;
    o[12] = t12;
    o[13] = t13;
    o[14] = t14;
    o[15] = t15;
  }
});

// node_modules/node-forge/lib/kem.js
var require_kem = __commonJS((exports, module) => {
  var forge = require_forge();
  require_util();
  require_random();
  require_jsbn();
  module.exports = forge.kem = forge.kem || {};
  var BigInteger = forge.jsbn.BigInteger;
  forge.kem.rsa = {};
  forge.kem.rsa.create = function(kdf, options) {
    options = options || {};
    var prng = options.prng || forge.random;
    var kem = {};
    kem.encrypt = function(publicKey, keyLength) {
      var byteLength = Math.ceil(publicKey.n.bitLength() / 8);
      var r;
      do {
        r = new BigInteger(forge.util.bytesToHex(prng.getBytesSync(byteLength)), 16).mod(publicKey.n);
      } while (r.compareTo(BigInteger.ONE) <= 0);
      r = forge.util.hexToBytes(r.toString(16));
      var zeros = byteLength - r.length;
      if (zeros > 0) {
        r = forge.util.fillString(String.fromCharCode(0), zeros) + r;
      }
      var encapsulation = publicKey.encrypt(r, "NONE");
      var key = kdf.generate(r, keyLength);
      return { encapsulation, key };
    };
    kem.decrypt = function(privateKey, encapsulation, keyLength) {
      var r = privateKey.decrypt(encapsulation, "NONE");
      return kdf.generate(r, keyLength);
    };
    return kem;
  };
  forge.kem.kdf1 = function(md, digestLength) {
    _createKDF(this, md, 0, digestLength || md.digestLength);
  };
  forge.kem.kdf2 = function(md, digestLength) {
    _createKDF(this, md, 1, digestLength || md.digestLength);
  };
  function _createKDF(kdf, md, counterStart, digestLength) {
    kdf.generate = function(x, length) {
      var key = new forge.util.ByteBuffer;
      var k = Math.ceil(length / digestLength) + counterStart;
      var c = new forge.util.ByteBuffer;
      for (var i = counterStart;i < k; ++i) {
        c.putInt32(i);
        md.start();
        md.update(x + c.getBytes());
        var hash = md.digest();
        key.putBytes(hash.getBytes(digestLength));
      }
      key.truncate(key.length() - length);
      return key.getBytes();
    };
  }
});

// node_modules/node-forge/lib/log.js
var require_log = __commonJS((exports, module) => {
  var forge = require_forge();
  require_util();
  module.exports = forge.log = forge.log || {};
  forge.log.levels = [
    "none",
    "error",
    "warning",
    "info",
    "debug",
    "verbose",
    "max"
  ];
  var sLevelInfo = {};
  var sLoggers = [];
  var sConsoleLogger = null;
  forge.log.LEVEL_LOCKED = 1 << 1;
  forge.log.NO_LEVEL_CHECK = 1 << 2;
  forge.log.INTERPOLATE = 1 << 3;
  for (i = 0;i < forge.log.levels.length; ++i) {
    level = forge.log.levels[i];
    sLevelInfo[level] = {
      index: i,
      name: level.toUpperCase()
    };
  }
  var level;
  var i;
  forge.log.logMessage = function(message) {
    var messageLevelIndex = sLevelInfo[message.level].index;
    for (var i2 = 0;i2 < sLoggers.length; ++i2) {
      var logger3 = sLoggers[i2];
      if (logger3.flags & forge.log.NO_LEVEL_CHECK) {
        logger3.f(message);
      } else {
        var loggerLevelIndex = sLevelInfo[logger3.level].index;
        if (messageLevelIndex <= loggerLevelIndex) {
          logger3.f(logger3, message);
        }
      }
    }
  };
  forge.log.prepareStandard = function(message) {
    if (!("standard" in message)) {
      message.standard = sLevelInfo[message.level].name + " [" + message.category + "] " + message.message;
    }
  };
  forge.log.prepareFull = function(message) {
    if (!("full" in message)) {
      var args = [message.message];
      args = args.concat([]);
      message.full = forge.util.format.apply(this, args);
    }
  };
  forge.log.prepareStandardFull = function(message) {
    if (!("standardFull" in message)) {
      forge.log.prepareStandard(message);
      message.standardFull = message.standard;
    }
  };
  if (true) {
    levels = ["error", "warning", "info", "debug", "verbose"];
    for (i = 0;i < levels.length; ++i) {
      (function(level2) {
        forge.log[level2] = function(category, message) {
          var args = Array.prototype.slice.call(arguments).slice(2);
          var msg = {
            timestamp: new Date,
            level: level2,
            category,
            message,
            arguments: args
          };
          forge.log.logMessage(msg);
        };
      })(levels[i]);
    }
  }
  var levels;
  var i;
  forge.log.makeLogger = function(logFunction) {
    var logger3 = {
      flags: 0,
      f: logFunction
    };
    forge.log.setLevel(logger3, "none");
    return logger3;
  };
  forge.log.setLevel = function(logger3, level2) {
    var rval = false;
    if (logger3 && !(logger3.flags & forge.log.LEVEL_LOCKED)) {
      for (var i2 = 0;i2 < forge.log.levels.length; ++i2) {
        var aValidLevel = forge.log.levels[i2];
        if (level2 == aValidLevel) {
          logger3.level = level2;
          rval = true;
          break;
        }
      }
    }
    return rval;
  };
  forge.log.lock = function(logger3, lock2) {
    if (typeof lock2 === "undefined" || lock2) {
      logger3.flags |= forge.log.LEVEL_LOCKED;
    } else {
      logger3.flags &= ~forge.log.LEVEL_LOCKED;
    }
  };
  forge.log.addLogger = function(logger3) {
    sLoggers.push(logger3);
  };
  if (typeof console !== "undefined" && "log" in console) {
    if (console.error && console.warn && console.info && console.debug) {
      levelHandlers = {
        error: console.error,
        warning: console.warn,
        info: console.info,
        debug: console.debug,
        verbose: console.debug
      };
      f = function(logger3, message) {
        forge.log.prepareStandard(message);
        var handler = levelHandlers[message.level];
        var args = [message.standard];
        args = args.concat(message["arguments"].slice());
        handler.apply(console, args);
      };
      logger2 = forge.log.makeLogger(f);
    } else {
      f = function(logger3, message) {
        forge.log.prepareStandardFull(message);
        console.log(message.standardFull);
      };
      logger2 = forge.log.makeLogger(f);
    }
    forge.log.setLevel(logger2, "debug");
    forge.log.addLogger(logger2);
    sConsoleLogger = logger2;
  } else {
    console = {
      log: function() {}
    };
  }
  var logger2;
  var levelHandlers;
  var f;
  if (sConsoleLogger !== null && typeof window !== "undefined" && window.location) {
    query = new URL(window.location.href).searchParams;
    if (query.has("console.level")) {
      forge.log.setLevel(sConsoleLogger, query.get("console.level").slice(-1)[0]);
    }
    if (query.has("console.lock")) {
      lock = query.get("console.lock").slice(-1)[0];
      if (lock == "true") {
        forge.log.lock(sConsoleLogger);
      }
    }
  }
  var query;
  var lock;
  forge.log.consoleLogger = sConsoleLogger;
});

// node_modules/node-forge/lib/md.all.js
var require_md_all = __commonJS((exports, module) => {
  module.exports = require_md();
  require_md5();
  require_sha1();
  require_sha256();
  require_sha512();
});

// node_modules/node-forge/lib/pkcs7.js
var require_pkcs7 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_aes();
  require_asn1();
  require_des();
  require_oids();
  require_pem();
  require_pkcs7asn1();
  require_random();
  require_util();
  require_x509();
  var asn1 = forge.asn1;
  var p7 = module.exports = forge.pkcs7 = forge.pkcs7 || {};
  p7.messageFromPem = function(pem) {
    var msg = forge.pem.decode(pem)[0];
    if (msg.type !== "PKCS7") {
      var error = new Error("Could not convert PKCS#7 message from PEM; PEM " + 'header type is not "PKCS#7".');
      error.headerType = msg.type;
      throw error;
    }
    if (msg.procType && msg.procType.type === "ENCRYPTED") {
      throw new Error("Could not convert PKCS#7 message from PEM; PEM is encrypted.");
    }
    var obj = asn1.fromDer(msg.body);
    return p7.messageFromAsn1(obj);
  };
  p7.messageToPem = function(msg, maxline) {
    var pemObj = {
      type: "PKCS7",
      body: asn1.toDer(msg.toAsn1()).getBytes()
    };
    return forge.pem.encode(pemObj, { maxline });
  };
  p7.messageFromAsn1 = function(obj) {
    var capture = {};
    var errors2 = [];
    if (!asn1.validate(obj, p7.asn1.contentInfoValidator, capture, errors2)) {
      var error = new Error("Cannot read PKCS#7 message. " + "ASN.1 object is not an PKCS#7 ContentInfo.");
      error.errors = errors2;
      throw error;
    }
    var contentType = asn1.derToOid(capture.contentType);
    var msg;
    switch (contentType) {
      case forge.pki.oids.envelopedData:
        msg = p7.createEnvelopedData();
        break;
      case forge.pki.oids.encryptedData:
        msg = p7.createEncryptedData();
        break;
      case forge.pki.oids.signedData:
        msg = p7.createSignedData();
        break;
      default:
        throw new Error("Cannot read PKCS#7 message. ContentType with OID " + contentType + " is not (yet) supported.");
    }
    msg.fromAsn1(capture.content.value[0]);
    return msg;
  };
  p7.createSignedData = function() {
    var msg = null;
    msg = {
      type: forge.pki.oids.signedData,
      version: 1,
      certificates: [],
      crls: [],
      signers: [],
      digestAlgorithmIdentifiers: [],
      contentInfo: null,
      signerInfos: [],
      fromAsn1: function(obj) {
        _fromAsn1(msg, obj, p7.asn1.signedDataValidator);
        msg.certificates = [];
        msg.crls = [];
        msg.digestAlgorithmIdentifiers = [];
        msg.contentInfo = null;
        msg.signerInfos = [];
        if (msg.rawCapture.certificates) {
          var certs = msg.rawCapture.certificates.value;
          for (var i = 0;i < certs.length; ++i) {
            msg.certificates.push(forge.pki.certificateFromAsn1(certs[i]));
          }
        }
      },
      toAsn1: function() {
        if (!msg.contentInfo) {
          msg.sign();
        }
        var certs = [];
        for (var i = 0;i < msg.certificates.length; ++i) {
          certs.push(forge.pki.certificateToAsn1(msg.certificates[i]));
        }
        var crls = [];
        var signedData = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(msg.version).getBytes()),
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, msg.digestAlgorithmIdentifiers),
            msg.contentInfo
          ])
        ]);
        if (certs.length > 0) {
          signedData.value[0].value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, certs));
        }
        if (crls.length > 0) {
          signedData.value[0].value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, crls));
        }
        signedData.value[0].value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, msg.signerInfos));
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(msg.type).getBytes()),
          signedData
        ]);
      },
      addSigner: function(signer) {
        var issuer = signer.issuer;
        var serialNumber = signer.serialNumber;
        if (signer.certificate) {
          var cert = signer.certificate;
          if (typeof cert === "string") {
            cert = forge.pki.certificateFromPem(cert);
          }
          issuer = cert.issuer.attributes;
          serialNumber = cert.serialNumber;
        }
        var key = signer.key;
        if (!key) {
          throw new Error("Could not add PKCS#7 signer; no private key specified.");
        }
        if (typeof key === "string") {
          key = forge.pki.privateKeyFromPem(key);
        }
        var digestAlgorithm = signer.digestAlgorithm || forge.pki.oids.sha1;
        switch (digestAlgorithm) {
          case forge.pki.oids.sha1:
          case forge.pki.oids.sha256:
          case forge.pki.oids.sha384:
          case forge.pki.oids.sha512:
          case forge.pki.oids.md5:
            break;
          default:
            throw new Error("Could not add PKCS#7 signer; unknown message digest algorithm: " + digestAlgorithm);
        }
        var authenticatedAttributes = signer.authenticatedAttributes || [];
        if (authenticatedAttributes.length > 0) {
          var contentType = false;
          var messageDigest = false;
          for (var i = 0;i < authenticatedAttributes.length; ++i) {
            var attr = authenticatedAttributes[i];
            if (!contentType && attr.type === forge.pki.oids.contentType) {
              contentType = true;
              if (messageDigest) {
                break;
              }
              continue;
            }
            if (!messageDigest && attr.type === forge.pki.oids.messageDigest) {
              messageDigest = true;
              if (contentType) {
                break;
              }
              continue;
            }
          }
          if (!contentType || !messageDigest) {
            throw new Error("Invalid signer.authenticatedAttributes. If " + "signer.authenticatedAttributes is specified, then it must " + "contain at least two attributes, PKCS #9 content-type and " + "PKCS #9 message-digest.");
          }
        }
        msg.signers.push({
          key,
          version: 1,
          issuer,
          serialNumber,
          digestAlgorithm,
          signatureAlgorithm: forge.pki.oids.rsaEncryption,
          signature: null,
          authenticatedAttributes,
          unauthenticatedAttributes: []
        });
      },
      sign: function(options) {
        options = options || {};
        if (typeof msg.content !== "object" || msg.contentInfo === null) {
          msg.contentInfo = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(forge.pki.oids.data).getBytes())
          ]);
          if ("content" in msg) {
            var content;
            if (msg.content instanceof forge.util.ByteBuffer) {
              content = msg.content.bytes();
            } else if (typeof msg.content === "string") {
              content = forge.util.encodeUtf8(msg.content);
            }
            if (options.detached) {
              msg.detachedContent = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, content);
            } else {
              msg.contentInfo.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, content)
              ]));
            }
          }
        }
        if (msg.signers.length === 0) {
          return;
        }
        var mds = addDigestAlgorithmIds();
        addSignerInfos(mds);
      },
      verify: function() {
        throw new Error("PKCS#7 signature verification not yet implemented.");
      },
      addCertificate: function(cert) {
        if (typeof cert === "string") {
          cert = forge.pki.certificateFromPem(cert);
        }
        msg.certificates.push(cert);
      },
      addCertificateRevokationList: function(crl) {
        throw new Error("PKCS#7 CRL support not yet implemented.");
      }
    };
    return msg;
    function addDigestAlgorithmIds() {
      var mds = {};
      for (var i = 0;i < msg.signers.length; ++i) {
        var signer = msg.signers[i];
        var oid = signer.digestAlgorithm;
        if (!(oid in mds)) {
          mds[oid] = forge.md[forge.pki.oids[oid]].create();
        }
        if (signer.authenticatedAttributes.length === 0) {
          signer.md = mds[oid];
        } else {
          signer.md = forge.md[forge.pki.oids[oid]].create();
        }
      }
      msg.digestAlgorithmIdentifiers = [];
      for (var oid in mds) {
        msg.digestAlgorithmIdentifiers.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(oid).getBytes()),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
        ]));
      }
      return mds;
    }
    function addSignerInfos(mds) {
      var content;
      if (msg.detachedContent) {
        content = msg.detachedContent;
      } else {
        content = msg.contentInfo.value[1];
        content = content.value[0];
      }
      if (!content) {
        throw new Error("Could not sign PKCS#7 message; there is no content to sign.");
      }
      var contentType = asn1.derToOid(msg.contentInfo.value[0].value);
      var bytes = asn1.toDer(content);
      bytes.getByte();
      asn1.getBerValueLength(bytes);
      bytes = bytes.getBytes();
      for (var oid in mds) {
        mds[oid].start().update(bytes);
      }
      var signingTime = new Date;
      for (var i = 0;i < msg.signers.length; ++i) {
        var signer = msg.signers[i];
        if (signer.authenticatedAttributes.length === 0) {
          if (contentType !== forge.pki.oids.data) {
            throw new Error("Invalid signer; authenticatedAttributes must be present " + "when the ContentInfo content type is not PKCS#7 Data.");
          }
        } else {
          signer.authenticatedAttributesAsn1 = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, []);
          var attrsAsn1 = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, []);
          for (var ai = 0;ai < signer.authenticatedAttributes.length; ++ai) {
            var attr = signer.authenticatedAttributes[ai];
            if (attr.type === forge.pki.oids.messageDigest) {
              attr.value = mds[signer.digestAlgorithm].digest();
            } else if (attr.type === forge.pki.oids.signingTime) {
              if (!attr.value) {
                attr.value = signingTime;
              }
            }
            attrsAsn1.value.push(_attributeToAsn1(attr));
            signer.authenticatedAttributesAsn1.value.push(_attributeToAsn1(attr));
          }
          bytes = asn1.toDer(attrsAsn1).getBytes();
          signer.md.start().update(bytes);
        }
        signer.signature = signer.key.sign(signer.md, "RSASSA-PKCS1-V1_5");
      }
      msg.signerInfos = _signersToAsn1(msg.signers);
    }
  };
  p7.createEncryptedData = function() {
    var msg = null;
    msg = {
      type: forge.pki.oids.encryptedData,
      version: 0,
      encryptedContent: {
        algorithm: forge.pki.oids["aes256-CBC"]
      },
      fromAsn1: function(obj) {
        _fromAsn1(msg, obj, p7.asn1.encryptedDataValidator);
      },
      decrypt: function(key) {
        if (key !== undefined) {
          msg.encryptedContent.key = key;
        }
        _decryptContent(msg);
      }
    };
    return msg;
  };
  p7.createEnvelopedData = function() {
    var msg = null;
    msg = {
      type: forge.pki.oids.envelopedData,
      version: 0,
      recipients: [],
      encryptedContent: {
        algorithm: forge.pki.oids["aes256-CBC"]
      },
      fromAsn1: function(obj) {
        var capture = _fromAsn1(msg, obj, p7.asn1.envelopedDataValidator);
        msg.recipients = _recipientsFromAsn1(capture.recipientInfos.value);
      },
      toAsn1: function() {
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(msg.type).getBytes()),
          asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(msg.version).getBytes()),
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, _recipientsToAsn1(msg.recipients)),
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, _encryptedContentToAsn1(msg.encryptedContent))
            ])
          ])
        ]);
      },
      findRecipient: function(cert) {
        var sAttr = cert.issuer.attributes;
        for (var i = 0;i < msg.recipients.length; ++i) {
          var r = msg.recipients[i];
          var rAttr = r.issuer;
          if (r.serialNumber !== cert.serialNumber) {
            continue;
          }
          if (rAttr.length !== sAttr.length) {
            continue;
          }
          var match2 = true;
          for (var j = 0;j < sAttr.length; ++j) {
            if (rAttr[j].type !== sAttr[j].type || rAttr[j].value !== sAttr[j].value) {
              match2 = false;
              break;
            }
          }
          if (match2) {
            return r;
          }
        }
        return null;
      },
      decrypt: function(recipient, privKey) {
        if (msg.encryptedContent.key === undefined && recipient !== undefined && privKey !== undefined) {
          switch (recipient.encryptedContent.algorithm) {
            case forge.pki.oids.rsaEncryption:
            case forge.pki.oids.desCBC:
              var key = privKey.decrypt(recipient.encryptedContent.content);
              msg.encryptedContent.key = forge.util.createBuffer(key);
              break;
            default:
              throw new Error("Unsupported asymmetric cipher, " + "OID " + recipient.encryptedContent.algorithm);
          }
        }
        _decryptContent(msg);
      },
      addRecipient: function(cert) {
        msg.recipients.push({
          version: 0,
          issuer: cert.issuer.attributes,
          serialNumber: cert.serialNumber,
          encryptedContent: {
            algorithm: forge.pki.oids.rsaEncryption,
            key: cert.publicKey
          }
        });
      },
      encrypt: function(key, cipher) {
        if (msg.encryptedContent.content === undefined) {
          cipher = cipher || msg.encryptedContent.algorithm;
          key = key || msg.encryptedContent.key;
          var keyLen, ivLen, ciphFn;
          switch (cipher) {
            case forge.pki.oids["aes128-CBC"]:
              keyLen = 16;
              ivLen = 16;
              ciphFn = forge.aes.createEncryptionCipher;
              break;
            case forge.pki.oids["aes192-CBC"]:
              keyLen = 24;
              ivLen = 16;
              ciphFn = forge.aes.createEncryptionCipher;
              break;
            case forge.pki.oids["aes256-CBC"]:
              keyLen = 32;
              ivLen = 16;
              ciphFn = forge.aes.createEncryptionCipher;
              break;
            case forge.pki.oids["des-EDE3-CBC"]:
              keyLen = 24;
              ivLen = 8;
              ciphFn = forge.des.createEncryptionCipher;
              break;
            default:
              throw new Error("Unsupported symmetric cipher, OID " + cipher);
          }
          if (key === undefined) {
            key = forge.util.createBuffer(forge.random.getBytes(keyLen));
          } else if (key.length() != keyLen) {
            throw new Error("Symmetric key has wrong length; " + "got " + key.length() + " bytes, expected " + keyLen + ".");
          }
          msg.encryptedContent.algorithm = cipher;
          msg.encryptedContent.key = key;
          msg.encryptedContent.parameter = forge.util.createBuffer(forge.random.getBytes(ivLen));
          var ciph = ciphFn(key);
          ciph.start(msg.encryptedContent.parameter.copy());
          ciph.update(msg.content);
          if (!ciph.finish()) {
            throw new Error("Symmetric encryption failed.");
          }
          msg.encryptedContent.content = ciph.output;
        }
        for (var i = 0;i < msg.recipients.length; ++i) {
          var recipient = msg.recipients[i];
          if (recipient.encryptedContent.content !== undefined) {
            continue;
          }
          switch (recipient.encryptedContent.algorithm) {
            case forge.pki.oids.rsaEncryption:
              recipient.encryptedContent.content = recipient.encryptedContent.key.encrypt(msg.encryptedContent.key.data);
              break;
            default:
              throw new Error("Unsupported asymmetric cipher, OID " + recipient.encryptedContent.algorithm);
          }
        }
      }
    };
    return msg;
  };
  function _recipientFromAsn1(obj) {
    var capture = {};
    var errors2 = [];
    if (!asn1.validate(obj, p7.asn1.recipientInfoValidator, capture, errors2)) {
      var error = new Error("Cannot read PKCS#7 RecipientInfo. " + "ASN.1 object is not an PKCS#7 RecipientInfo.");
      error.errors = errors2;
      throw error;
    }
    return {
      version: capture.version.charCodeAt(0),
      issuer: forge.pki.RDNAttributesAsArray(capture.issuer),
      serialNumber: forge.util.createBuffer(capture.serial).toHex(),
      encryptedContent: {
        algorithm: asn1.derToOid(capture.encAlgorithm),
        parameter: capture.encParameter ? capture.encParameter.value : undefined,
        content: capture.encKey
      }
    };
  }
  function _recipientToAsn1(obj) {
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(obj.version).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        forge.pki.distinguishedNameToAsn1({ attributes: obj.issuer }),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, forge.util.hexToBytes(obj.serialNumber))
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(obj.encryptedContent.algorithm).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, obj.encryptedContent.content)
    ]);
  }
  function _recipientsFromAsn1(infos) {
    var ret = [];
    for (var i = 0;i < infos.length; ++i) {
      ret.push(_recipientFromAsn1(infos[i]));
    }
    return ret;
  }
  function _recipientsToAsn1(recipients) {
    var ret = [];
    for (var i = 0;i < recipients.length; ++i) {
      ret.push(_recipientToAsn1(recipients[i]));
    }
    return ret;
  }
  function _signerToAsn1(obj) {
    var rval = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(obj.version).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        forge.pki.distinguishedNameToAsn1({ attributes: obj.issuer }),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, forge.util.hexToBytes(obj.serialNumber))
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(obj.digestAlgorithm).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
      ])
    ]);
    if (obj.authenticatedAttributesAsn1) {
      rval.value.push(obj.authenticatedAttributesAsn1);
    }
    rval.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(obj.signatureAlgorithm).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
    ]));
    rval.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, obj.signature));
    if (obj.unauthenticatedAttributes.length > 0) {
      var attrsAsn1 = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, []);
      for (var i = 0;i < obj.unauthenticatedAttributes.length; ++i) {
        var attr = obj.unauthenticatedAttributes[i];
        attrsAsn1.values.push(_attributeToAsn1(attr));
      }
      rval.value.push(attrsAsn1);
    }
    return rval;
  }
  function _signersToAsn1(signers) {
    var ret = [];
    for (var i = 0;i < signers.length; ++i) {
      ret.push(_signerToAsn1(signers[i]));
    }
    return ret;
  }
  function _attributeToAsn1(attr) {
    var value;
    if (attr.type === forge.pki.oids.contentType) {
      value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(attr.value).getBytes());
    } else if (attr.type === forge.pki.oids.messageDigest) {
      value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, attr.value.bytes());
    } else if (attr.type === forge.pki.oids.signingTime) {
      var jan_1_1950 = new Date("1950-01-01T00:00:00Z");
      var jan_1_2050 = new Date("2050-01-01T00:00:00Z");
      var date = attr.value;
      if (typeof date === "string") {
        var timestamp = Date.parse(date);
        if (!isNaN(timestamp)) {
          date = new Date(timestamp);
        } else if (date.length === 13) {
          date = asn1.utcTimeToDate(date);
        } else {
          date = asn1.generalizedTimeToDate(date);
        }
      }
      if (date >= jan_1_1950 && date < jan_1_2050) {
        value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.UTCTIME, false, asn1.dateToUtcTime(date));
      } else {
        value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.GENERALIZEDTIME, false, asn1.dateToGeneralizedTime(date));
      }
    }
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(attr.type).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [
        value
      ])
    ]);
  }
  function _encryptedContentToAsn1(ec) {
    return [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(forge.pki.oids.data).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(ec.algorithm).getBytes()),
        !ec.parameter ? undefined : asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, ec.parameter.getBytes())
      ]),
      asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, ec.content.getBytes())
      ])
    ];
  }
  function _fromAsn1(msg, obj, validator2) {
    var capture = {};
    var errors2 = [];
    if (!asn1.validate(obj, validator2, capture, errors2)) {
      var error = new Error("Cannot read PKCS#7 message. " + "ASN.1 object is not a supported PKCS#7 message.");
      error.errors = error;
      throw error;
    }
    var contentType = asn1.derToOid(capture.contentType);
    if (contentType !== forge.pki.oids.data) {
      throw new Error("Unsupported PKCS#7 message. " + "Only wrapped ContentType Data supported.");
    }
    if (capture.encryptedContent) {
      var content = "";
      if (forge.util.isArray(capture.encryptedContent)) {
        for (var i = 0;i < capture.encryptedContent.length; ++i) {
          if (capture.encryptedContent[i].type !== asn1.Type.OCTETSTRING) {
            throw new Error("Malformed PKCS#7 message, expecting encrypted " + "content constructed of only OCTET STRING objects.");
          }
          content += capture.encryptedContent[i].value;
        }
      } else {
        content = capture.encryptedContent;
      }
      msg.encryptedContent = {
        algorithm: asn1.derToOid(capture.encAlgorithm),
        parameter: forge.util.createBuffer(capture.encParameter.value),
        content: forge.util.createBuffer(content)
      };
    }
    if (capture.content) {
      var content = "";
      if (forge.util.isArray(capture.content)) {
        for (var i = 0;i < capture.content.length; ++i) {
          if (capture.content[i].type !== asn1.Type.OCTETSTRING) {
            throw new Error("Malformed PKCS#7 message, expecting " + "content constructed of only OCTET STRING objects.");
          }
          content += capture.content[i].value;
        }
      } else {
        content = capture.content;
      }
      msg.content = forge.util.createBuffer(content);
    }
    msg.version = capture.version.charCodeAt(0);
    msg.rawCapture = capture;
    return capture;
  }
  function _decryptContent(msg) {
    if (msg.encryptedContent.key === undefined) {
      throw new Error("Symmetric key not available.");
    }
    if (msg.content === undefined) {
      var ciph;
      switch (msg.encryptedContent.algorithm) {
        case forge.pki.oids["aes128-CBC"]:
        case forge.pki.oids["aes192-CBC"]:
        case forge.pki.oids["aes256-CBC"]:
          ciph = forge.aes.createDecryptionCipher(msg.encryptedContent.key);
          break;
        case forge.pki.oids["desCBC"]:
        case forge.pki.oids["des-EDE3-CBC"]:
          ciph = forge.des.createDecryptionCipher(msg.encryptedContent.key);
          break;
        default:
          throw new Error("Unsupported symmetric cipher, OID " + msg.encryptedContent.algorithm);
      }
      ciph.start(msg.encryptedContent.parameter);
      ciph.update(msg.encryptedContent.content);
      if (!ciph.finish()) {
        throw new Error("Symmetric decryption failed.");
      }
      msg.content = ciph.output;
    }
  }
});

// node_modules/node-forge/lib/ssh.js
var require_ssh = __commonJS((exports, module) => {
  var forge = require_forge();
  require_aes();
  require_hmac();
  require_md5();
  require_sha1();
  require_util();
  var ssh = module.exports = forge.ssh = forge.ssh || {};
  ssh.privateKeyToPutty = function(privateKey, passphrase, comment) {
    comment = comment || "";
    passphrase = passphrase || "";
    var algorithm = "ssh-rsa";
    var encryptionAlgorithm = passphrase === "" ? "none" : "aes256-cbc";
    var ppk = "PuTTY-User-Key-File-2: " + algorithm + `\r
`;
    ppk += "Encryption: " + encryptionAlgorithm + `\r
`;
    ppk += "Comment: " + comment + `\r
`;
    var pubbuffer = forge.util.createBuffer();
    _addStringToBuffer(pubbuffer, algorithm);
    _addBigIntegerToBuffer(pubbuffer, privateKey.e);
    _addBigIntegerToBuffer(pubbuffer, privateKey.n);
    var pub = forge.util.encode64(pubbuffer.bytes(), 64);
    var length = Math.floor(pub.length / 66) + 1;
    ppk += "Public-Lines: " + length + `\r
`;
    ppk += pub;
    var privbuffer = forge.util.createBuffer();
    _addBigIntegerToBuffer(privbuffer, privateKey.d);
    _addBigIntegerToBuffer(privbuffer, privateKey.p);
    _addBigIntegerToBuffer(privbuffer, privateKey.q);
    _addBigIntegerToBuffer(privbuffer, privateKey.qInv);
    var priv;
    if (!passphrase) {
      priv = forge.util.encode64(privbuffer.bytes(), 64);
    } else {
      var encLen = privbuffer.length() + 16 - 1;
      encLen -= encLen % 16;
      var padding = _sha1(privbuffer.bytes());
      padding.truncate(padding.length() - encLen + privbuffer.length());
      privbuffer.putBuffer(padding);
      var aeskey = forge.util.createBuffer();
      aeskey.putBuffer(_sha1("\x00\x00\x00\x00", passphrase));
      aeskey.putBuffer(_sha1("\x00\x00\x00\x01", passphrase));
      var cipher = forge.aes.createEncryptionCipher(aeskey.truncate(8), "CBC");
      cipher.start(forge.util.createBuffer().fillWithByte(0, 16));
      cipher.update(privbuffer.copy());
      cipher.finish();
      var encrypted = cipher.output;
      encrypted.truncate(16);
      priv = forge.util.encode64(encrypted.bytes(), 64);
    }
    length = Math.floor(priv.length / 66) + 1;
    ppk += `\r
Private-Lines: ` + length + `\r
`;
    ppk += priv;
    var mackey = _sha1("putty-private-key-file-mac-key", passphrase);
    var macbuffer = forge.util.createBuffer();
    _addStringToBuffer(macbuffer, algorithm);
    _addStringToBuffer(macbuffer, encryptionAlgorithm);
    _addStringToBuffer(macbuffer, comment);
    macbuffer.putInt32(pubbuffer.length());
    macbuffer.putBuffer(pubbuffer);
    macbuffer.putInt32(privbuffer.length());
    macbuffer.putBuffer(privbuffer);
    var hmac = forge.hmac.create();
    hmac.start("sha1", mackey);
    hmac.update(macbuffer.bytes());
    ppk += `\r
Private-MAC: ` + hmac.digest().toHex() + `\r
`;
    return ppk;
  };
  ssh.publicKeyToOpenSSH = function(key, comment) {
    var type = "ssh-rsa";
    comment = comment || "";
    var buffer = forge.util.createBuffer();
    _addStringToBuffer(buffer, type);
    _addBigIntegerToBuffer(buffer, key.e);
    _addBigIntegerToBuffer(buffer, key.n);
    return type + " " + forge.util.encode64(buffer.bytes()) + " " + comment;
  };
  ssh.privateKeyToOpenSSH = function(privateKey, passphrase) {
    if (!passphrase) {
      return forge.pki.privateKeyToPem(privateKey);
    }
    return forge.pki.encryptRsaPrivateKey(privateKey, passphrase, { legacy: true, algorithm: "aes128" });
  };
  ssh.getPublicKeyFingerprint = function(key, options) {
    options = options || {};
    var md = options.md || forge.md.md5.create();
    var type = "ssh-rsa";
    var buffer = forge.util.createBuffer();
    _addStringToBuffer(buffer, type);
    _addBigIntegerToBuffer(buffer, key.e);
    _addBigIntegerToBuffer(buffer, key.n);
    md.start();
    md.update(buffer.getBytes());
    var digest = md.digest();
    if (options.encoding === "hex") {
      var hex = digest.toHex();
      if (options.delimiter) {
        return hex.match(/.{2}/g).join(options.delimiter);
      }
      return hex;
    } else if (options.encoding === "binary") {
      return digest.getBytes();
    } else if (options.encoding) {
      throw new Error('Unknown encoding "' + options.encoding + '".');
    }
    return digest;
  };
  function _addBigIntegerToBuffer(buffer, val) {
    var hexVal = val.toString(16);
    if (hexVal[0] >= "8") {
      hexVal = "00" + hexVal;
    }
    var bytes = forge.util.hexToBytes(hexVal);
    buffer.putInt32(bytes.length);
    buffer.putBytes(bytes);
  }
  function _addStringToBuffer(buffer, val) {
    buffer.putInt32(val.length);
    buffer.putString(val);
  }
  function _sha1() {
    var sha = forge.md.sha1.create();
    var num = arguments.length;
    for (var i = 0;i < num; ++i) {
      sha.update(arguments[i]);
    }
    return sha.digest();
  }
});

// node_modules/node-forge/lib/index.js
var require_lib = __commonJS((exports, module) => {
  module.exports = require_forge();
  require_aes();
  require_aesCipherSuites();
  require_asn1();
  require_cipher();
  require_des();
  require_ed25519();
  require_hmac();
  require_kem();
  require_log();
  require_md_all();
  require_mgf1();
  require_pbkdf2();
  require_pem();
  require_pkcs1();
  require_pkcs12();
  require_pkcs7();
  require_pki();
  require_prime();
  require_prng();
  require_pss();
  require_random();
  require_rc2();
  require_ssh();
  require_tls();
  require_util();
});

// node_modules/hono/dist/adapter/vercel/handler.js
var handle = (app) => (req) => {
  return app.fetch(req);
};

// node_modules/@asteasolutions/zod-to-openapi/dist/index.cjs
function __rest(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s);i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
function isZodType(schema, typeName) {
  var _a;
  return ((_a = schema === null || schema === undefined ? undefined : schema._def) === null || _a === undefined ? undefined : _a.typeName) === typeName;
}
function isAnyZodType(schema) {
  return "_def" in schema;
}
function preserveMetadataFromModifier(zod, modifier) {
  const zodModifier = zod.ZodType.prototype[modifier];
  zod.ZodType.prototype[modifier] = function(...args) {
    const result = zodModifier.apply(this, args);
    result._def.openapi = this._def.openapi;
    return result;
  };
}
function extendZodWithOpenApi(zod) {
  if (typeof zod.ZodType.prototype.openapi !== "undefined") {
    return;
  }
  zod.ZodType.prototype.openapi = function(refOrOpenapi, metadata) {
    var _a, _b, _c, _d, _e, _f;
    const openapi = typeof refOrOpenapi === "string" ? metadata : refOrOpenapi;
    const _g = openapi !== null && openapi !== undefined ? openapi : {}, { param } = _g, restOfOpenApi = __rest(_g, ["param"]);
    const _internal = Object.assign(Object.assign({}, (_a = this._def.openapi) === null || _a === undefined ? undefined : _a._internal), typeof refOrOpenapi === "string" ? { refId: refOrOpenapi } : undefined);
    const resultMetadata = Object.assign(Object.assign(Object.assign({}, (_b = this._def.openapi) === null || _b === undefined ? undefined : _b.metadata), restOfOpenApi), ((_d = (_c = this._def.openapi) === null || _c === undefined ? undefined : _c.metadata) === null || _d === undefined ? undefined : _d.param) || param ? {
      param: Object.assign(Object.assign({}, (_f = (_e = this._def.openapi) === null || _e === undefined ? undefined : _e.metadata) === null || _f === undefined ? undefined : _f.param), param)
    } : undefined);
    const result = new this.constructor(Object.assign(Object.assign({}, this._def), { openapi: Object.assign(Object.assign({}, Object.keys(_internal).length > 0 ? { _internal } : undefined), Object.keys(resultMetadata).length > 0 ? { metadata: resultMetadata } : undefined) }));
    if (isZodType(this, "ZodObject")) {
      const originalExtend = this.extend;
      result.extend = function(...args) {
        var _a2, _b2, _c2, _d2, _e2, _f2, _g2;
        const extendedResult = originalExtend.apply(this, args);
        extendedResult._def.openapi = {
          _internal: {
            extendedFrom: ((_b2 = (_a2 = this._def.openapi) === null || _a2 === undefined ? undefined : _a2._internal) === null || _b2 === undefined ? undefined : _b2.refId) ? { refId: (_d2 = (_c2 = this._def.openapi) === null || _c2 === undefined ? undefined : _c2._internal) === null || _d2 === undefined ? undefined : _d2.refId, schema: this } : (_f2 = (_e2 = this._def.openapi) === null || _e2 === undefined ? undefined : _e2._internal) === null || _f2 === undefined ? undefined : _f2.extendedFrom
          },
          metadata: (_g2 = extendedResult._def.openapi) === null || _g2 === undefined ? undefined : _g2.metadata
        };
        return extendedResult;
      };
    }
    return result;
  };
  preserveMetadataFromModifier(zod, "optional");
  preserveMetadataFromModifier(zod, "nullable");
  preserveMetadataFromModifier(zod, "default");
  preserveMetadataFromModifier(zod, "transform");
  preserveMetadataFromModifier(zod, "refine");
  const zodDeepPartial = zod.ZodObject.prototype.deepPartial;
  zod.ZodObject.prototype.deepPartial = function() {
    const initialShape = this._def.shape();
    const result = zodDeepPartial.apply(this);
    const resultShape = result._def.shape();
    Object.entries(resultShape).forEach(([key, value]) => {
      var _a, _b;
      value._def.openapi = (_b = (_a = initialShape[key]) === null || _a === undefined ? undefined : _a._def) === null || _b === undefined ? undefined : _b.openapi;
    });
    result._def.openapi = undefined;
    return result;
  };
  const zodPick = zod.ZodObject.prototype.pick;
  zod.ZodObject.prototype.pick = function(...args) {
    const result = zodPick.apply(this, args);
    result._def.openapi = undefined;
    return result;
  };
  const zodOmit = zod.ZodObject.prototype.omit;
  zod.ZodObject.prototype.omit = function(...args) {
    const result = zodOmit.apply(this, args);
    result._def.openapi = undefined;
    return result;
  };
}
function isEqual(x, y) {
  if (x === null || x === undefined || y === null || y === undefined) {
    return x === y;
  }
  if (x === y || x.valueOf() === y.valueOf()) {
    return true;
  }
  if (Array.isArray(x)) {
    if (!Array.isArray(y)) {
      return false;
    }
    if (x.length !== y.length) {
      return false;
    }
  }
  if (!(x instanceof Object) || !(y instanceof Object)) {
    return false;
  }
  const keysX = Object.keys(x);
  return Object.keys(y).every((keyY) => keysX.indexOf(keyY) !== -1) && keysX.every((key) => isEqual(x[key], y[key]));
}

class ObjectSet {
  constructor() {
    this.buckets = new Map;
  }
  put(value) {
    const hashCode = this.hashCodeOf(value);
    const itemsByCode = this.buckets.get(hashCode);
    if (!itemsByCode) {
      this.buckets.set(hashCode, [value]);
      return;
    }
    const alreadyHasItem = itemsByCode.some((_) => isEqual(_, value));
    if (!alreadyHasItem) {
      itemsByCode.push(value);
    }
  }
  contains(value) {
    const hashCode = this.hashCodeOf(value);
    const itemsByCode = this.buckets.get(hashCode);
    if (!itemsByCode) {
      return false;
    }
    return itemsByCode.some((_) => isEqual(_, value));
  }
  values() {
    return [...this.buckets.values()].flat();
  }
  stats() {
    let totalBuckets = 0;
    let totalValues = 0;
    let collisions = 0;
    for (const bucket of this.buckets.values()) {
      totalBuckets += 1;
      totalValues += bucket.length;
      if (bucket.length > 1) {
        collisions += 1;
      }
    }
    const hashEffectiveness = totalBuckets / totalValues;
    return { totalBuckets, collisions, totalValues, hashEffectiveness };
  }
  hashCodeOf(object) {
    let hashCode = 0;
    if (Array.isArray(object)) {
      for (let i = 0;i < object.length; i++) {
        hashCode ^= this.hashCodeOf(object[i]) * i;
      }
      return hashCode;
    }
    if (typeof object === "string") {
      for (let i = 0;i < object.length; i++) {
        hashCode ^= object.charCodeAt(i) * i;
      }
      return hashCode;
    }
    if (typeof object === "number") {
      return object;
    }
    if (typeof object === "object") {
      for (const [key, value] of Object.entries(object)) {
        hashCode ^= this.hashCodeOf(key) + this.hashCodeOf(value !== null && value !== undefined ? value : "");
      }
    }
    return hashCode;
  }
}
function isUndefined(value) {
  return value === undefined;
}
function mapValues(object, mapper) {
  const result = {};
  Object.entries(object).forEach(([key, value]) => {
    result[key] = mapper(value);
  });
  return result;
}
function omit(object, keys) {
  const result = {};
  Object.entries(object).forEach(([key, value]) => {
    if (!keys.some((keyToOmit) => keyToOmit === key)) {
      result[key] = value;
    }
  });
  return result;
}
function omitBy(object, predicate) {
  const result = {};
  Object.entries(object).forEach(([key, value]) => {
    if (!predicate(value, key)) {
      result[key] = value;
    }
  });
  return result;
}
function compact(arr) {
  return arr.filter((elem) => !isUndefined(elem));
}
var objectEquals = isEqual;
function uniq(values) {
  const set = new ObjectSet;
  values.forEach((value) => set.put(value));
  return [...set.values()];
}
function isString(val) {
  return typeof val === "string";
}
class OpenAPIRegistry {
  constructor(parents) {
    this.parents = parents;
    this._definitions = [];
  }
  get definitions() {
    var _a, _b;
    const parentDefinitions = (_b = (_a = this.parents) === null || _a === undefined ? undefined : _a.flatMap((par) => par.definitions)) !== null && _b !== undefined ? _b : [];
    return [...parentDefinitions, ...this._definitions];
  }
  register(refId, zodSchema) {
    const schemaWithRefId = this.schemaWithRefId(refId, zodSchema);
    this._definitions.push({ type: "schema", schema: schemaWithRefId });
    return schemaWithRefId;
  }
  registerParameter(refId, zodSchema) {
    var _a, _b, _c;
    const schemaWithRefId = this.schemaWithRefId(refId, zodSchema);
    const currentMetadata = (_a = schemaWithRefId._def.openapi) === null || _a === undefined ? undefined : _a.metadata;
    const schemaWithMetadata = schemaWithRefId.openapi(Object.assign(Object.assign({}, currentMetadata), { param: Object.assign(Object.assign({}, currentMetadata === null || currentMetadata === undefined ? undefined : currentMetadata.param), { name: (_c = (_b = currentMetadata === null || currentMetadata === undefined ? undefined : currentMetadata.param) === null || _b === undefined ? undefined : _b.name) !== null && _c !== undefined ? _c : refId }) }));
    this._definitions.push({
      type: "parameter",
      schema: schemaWithMetadata
    });
    return schemaWithMetadata;
  }
  registerPath(route) {
    this._definitions.push({
      type: "route",
      route
    });
  }
  registerWebhook(webhook) {
    this._definitions.push({
      type: "webhook",
      webhook
    });
  }
  registerComponent(type, name, component) {
    this._definitions.push({
      type: "component",
      componentType: type,
      name,
      component
    });
    return {
      name,
      ref: { $ref: `#/components/${type}/${name}` }
    };
  }
  schemaWithRefId(refId, zodSchema) {
    return zodSchema.openapi(refId);
  }
}

class ZodToOpenAPIError {
  constructor(message) {
    this.message = message;
  }
}

class ConflictError extends ZodToOpenAPIError {
  constructor(message, data) {
    super(message);
    this.data = data;
  }
}

class MissingParameterDataError extends ZodToOpenAPIError {
  constructor(data) {
    super(`Missing parameter data, please specify \`${data.missingField}\` and other OpenAPI parameter props using the \`param\` field of \`ZodSchema.openapi\``);
    this.data = data;
  }
}
function enhanceMissingParametersError(action, paramsToAdd) {
  try {
    return action();
  } catch (error) {
    if (error instanceof MissingParameterDataError) {
      throw new MissingParameterDataError(Object.assign(Object.assign({}, error.data), paramsToAdd));
    }
    throw error;
  }
}

class UnknownZodTypeError extends ZodToOpenAPIError {
  constructor(data) {
    super(`Unknown zod object type, please specify \`type\` and other OpenAPI props using \`ZodSchema.openapi\`.`);
    this.data = data;
  }
}

class Metadata {
  static getMetadata(zodSchema) {
    var _a;
    const innerSchema = this.unwrapChained(zodSchema);
    const metadata = zodSchema._def.openapi ? zodSchema._def.openapi : innerSchema._def.openapi;
    const zodDescription = (_a = zodSchema.description) !== null && _a !== undefined ? _a : innerSchema.description;
    return {
      _internal: metadata === null || metadata === undefined ? undefined : metadata._internal,
      metadata: Object.assign({ description: zodDescription }, metadata === null || metadata === undefined ? undefined : metadata.metadata)
    };
  }
  static getInternalMetadata(zodSchema) {
    const innerSchema = this.unwrapChained(zodSchema);
    const openapi = zodSchema._def.openapi ? zodSchema._def.openapi : innerSchema._def.openapi;
    return openapi === null || openapi === undefined ? undefined : openapi._internal;
  }
  static getParamMetadata(zodSchema) {
    var _a, _b;
    const innerSchema = this.unwrapChained(zodSchema);
    const metadata = zodSchema._def.openapi ? zodSchema._def.openapi : innerSchema._def.openapi;
    const zodDescription = (_a = zodSchema.description) !== null && _a !== undefined ? _a : innerSchema.description;
    return {
      _internal: metadata === null || metadata === undefined ? undefined : metadata._internal,
      metadata: Object.assign(Object.assign({}, metadata === null || metadata === undefined ? undefined : metadata.metadata), {
        param: Object.assign({ description: zodDescription }, (_b = metadata === null || metadata === undefined ? undefined : metadata.metadata) === null || _b === undefined ? undefined : _b.param)
      })
    };
  }
  static buildSchemaMetadata(metadata) {
    return omitBy(omit(metadata, ["param"]), isUndefined);
  }
  static buildParameterMetadata(metadata) {
    return omitBy(metadata, isUndefined);
  }
  static applySchemaMetadata(initialData, metadata) {
    return omitBy(Object.assign(Object.assign({}, initialData), this.buildSchemaMetadata(metadata)), isUndefined);
  }
  static getRefId(zodSchema) {
    var _a;
    return (_a = this.getInternalMetadata(zodSchema)) === null || _a === undefined ? undefined : _a.refId;
  }
  static unwrapChained(schema) {
    return this.unwrapUntil(schema);
  }
  static getDefaultValue(zodSchema) {
    const unwrapped = this.unwrapUntil(zodSchema, "ZodDefault");
    return unwrapped === null || unwrapped === undefined ? undefined : unwrapped._def.defaultValue();
  }
  static unwrapUntil(schema, typeName) {
    if (typeName && isZodType(schema, typeName)) {
      return schema;
    }
    if (isZodType(schema, "ZodOptional") || isZodType(schema, "ZodNullable") || isZodType(schema, "ZodBranded")) {
      return this.unwrapUntil(schema.unwrap(), typeName);
    }
    if (isZodType(schema, "ZodDefault") || isZodType(schema, "ZodReadonly")) {
      return this.unwrapUntil(schema._def.innerType, typeName);
    }
    if (isZodType(schema, "ZodEffects")) {
      return this.unwrapUntil(schema._def.schema, typeName);
    }
    if (isZodType(schema, "ZodPipeline")) {
      return this.unwrapUntil(schema._def.in, typeName);
    }
    return typeName ? undefined : schema;
  }
  static isOptionalSchema(zodSchema) {
    return zodSchema.isOptional();
  }
}

class ArrayTransformer {
  transform(zodSchema, mapNullableType, mapItems) {
    var _a, _b;
    const itemType = zodSchema._def.type;
    return Object.assign(Object.assign({}, mapNullableType("array")), { items: mapItems(itemType), minItems: (_a = zodSchema._def.minLength) === null || _a === undefined ? undefined : _a.value, maxItems: (_b = zodSchema._def.maxLength) === null || _b === undefined ? undefined : _b.value });
  }
}

class BigIntTransformer {
  transform(mapNullableType) {
    return Object.assign(Object.assign({}, mapNullableType("string")), { pattern: `^d+$` });
  }
}

class DiscriminatedUnionTransformer {
  transform(zodSchema, isNullable, mapNullableOfArray, mapItem, generateSchemaRef) {
    const options = [...zodSchema.options.values()];
    const optionSchema = options.map(mapItem);
    if (isNullable) {
      return {
        oneOf: mapNullableOfArray(optionSchema, isNullable)
      };
    }
    return {
      oneOf: optionSchema,
      discriminator: this.mapDiscriminator(options, zodSchema.discriminator, generateSchemaRef)
    };
  }
  mapDiscriminator(zodObjects, discriminator, generateSchemaRef) {
    if (zodObjects.some((obj) => Metadata.getRefId(obj) === undefined)) {
      return;
    }
    const mapping = {};
    zodObjects.forEach((obj) => {
      var _a;
      const refId = Metadata.getRefId(obj);
      const value = (_a = obj.shape) === null || _a === undefined ? undefined : _a[discriminator];
      if (isZodType(value, "ZodEnum") || isZodType(value, "ZodNativeEnum")) {
        const keys = Object.values(value.enum).filter(isString);
        keys.forEach((enumValue) => {
          mapping[enumValue] = generateSchemaRef(refId);
        });
        return;
      }
      const literalValue = value === null || value === undefined ? undefined : value._def.value;
      if (typeof literalValue !== "string") {
        throw new Error(`Discriminator ${discriminator} could not be found in one of the values of a discriminated union`);
      }
      mapping[literalValue] = generateSchemaRef(refId);
    });
    return {
      propertyName: discriminator,
      mapping
    };
  }
}

class EnumTransformer {
  transform(zodSchema, mapNullableType) {
    return Object.assign(Object.assign({}, mapNullableType("string")), { enum: zodSchema._def.values });
  }
}

class IntersectionTransformer {
  transform(zodSchema, isNullable, mapNullableOfArray, mapItem) {
    const subtypes = this.flattenIntersectionTypes(zodSchema);
    const allOfSchema = {
      allOf: subtypes.map(mapItem)
    };
    if (isNullable) {
      return {
        anyOf: mapNullableOfArray([allOfSchema], isNullable)
      };
    }
    return allOfSchema;
  }
  flattenIntersectionTypes(schema) {
    if (!isZodType(schema, "ZodIntersection")) {
      return [schema];
    }
    const leftSubTypes = this.flattenIntersectionTypes(schema._def.left);
    const rightSubTypes = this.flattenIntersectionTypes(schema._def.right);
    return [...leftSubTypes, ...rightSubTypes];
  }
}

class LiteralTransformer {
  transform(zodSchema, mapNullableType) {
    return Object.assign(Object.assign({}, mapNullableType(typeof zodSchema._def.value)), { enum: [zodSchema._def.value] });
  }
}
function enumInfo(enumObject) {
  const keysExceptReverseMappings = Object.keys(enumObject).filter((key) => typeof enumObject[enumObject[key]] !== "number");
  const values = keysExceptReverseMappings.map((key) => enumObject[key]);
  const numericCount = values.filter((_) => typeof _ === "number").length;
  const type = numericCount === 0 ? "string" : numericCount === values.length ? "numeric" : "mixed";
  return { values, type };
}

class NativeEnumTransformer {
  transform(zodSchema, mapNullableType) {
    const { type, values } = enumInfo(zodSchema._def.values);
    if (type === "mixed") {
      throw new ZodToOpenAPIError("Enum has mixed string and number values, please specify the OpenAPI type manually");
    }
    return Object.assign(Object.assign({}, mapNullableType(type === "numeric" ? "integer" : "string")), { enum: values });
  }
}

class NumberTransformer {
  transform(zodSchema, mapNullableType, getNumberChecks) {
    return Object.assign(Object.assign({}, mapNullableType(zodSchema.isInt ? "integer" : "number")), getNumberChecks(zodSchema._def.checks));
  }
}

class ObjectTransformer {
  transform(zodSchema, defaultValue, mapNullableType, mapItem) {
    var _a;
    const extendedFrom = (_a = Metadata.getInternalMetadata(zodSchema)) === null || _a === undefined ? undefined : _a.extendedFrom;
    const required = this.requiredKeysOf(zodSchema);
    const properties = mapValues(zodSchema._def.shape(), mapItem);
    if (!extendedFrom) {
      return Object.assign(Object.assign(Object.assign(Object.assign({}, mapNullableType("object")), { properties, default: defaultValue }), required.length > 0 ? { required } : {}), this.generateAdditionalProperties(zodSchema, mapItem));
    }
    const parent = extendedFrom.schema;
    mapItem(parent);
    const keysRequiredByParent = this.requiredKeysOf(parent);
    const propsOfParent = mapValues(parent === null || parent === undefined ? undefined : parent._def.shape(), mapItem);
    const propertiesToAdd = Object.fromEntries(Object.entries(properties).filter(([key, type]) => {
      return !objectEquals(propsOfParent[key], type);
    }));
    const additionallyRequired = required.filter((prop) => !keysRequiredByParent.includes(prop));
    const objectData = Object.assign(Object.assign(Object.assign(Object.assign({}, mapNullableType("object")), { default: defaultValue, properties: propertiesToAdd }), additionallyRequired.length > 0 ? { required: additionallyRequired } : {}), this.generateAdditionalProperties(zodSchema, mapItem));
    return {
      allOf: [
        { $ref: `#/components/schemas/${extendedFrom.refId}` },
        objectData
      ]
    };
  }
  generateAdditionalProperties(zodSchema, mapItem) {
    const unknownKeysOption = zodSchema._def.unknownKeys;
    const catchallSchema = zodSchema._def.catchall;
    if (isZodType(catchallSchema, "ZodNever")) {
      if (unknownKeysOption === "strict") {
        return { additionalProperties: false };
      }
      return {};
    }
    return { additionalProperties: mapItem(catchallSchema) };
  }
  requiredKeysOf(objectSchema) {
    return Object.entries(objectSchema._def.shape()).filter(([_key, type]) => !Metadata.isOptionalSchema(type)).map(([key, _type]) => key);
  }
}

class RecordTransformer {
  transform(zodSchema, mapNullableType, mapItem) {
    const propertiesType = zodSchema._def.valueType;
    const keyType = zodSchema._def.keyType;
    const propertiesSchema = mapItem(propertiesType);
    if (isZodType(keyType, "ZodEnum") || isZodType(keyType, "ZodNativeEnum")) {
      const keys = Object.values(keyType.enum).filter(isString);
      const properties = keys.reduce((acc, curr) => Object.assign(Object.assign({}, acc), { [curr]: propertiesSchema }), {});
      return Object.assign(Object.assign({}, mapNullableType("object")), { properties });
    }
    return Object.assign(Object.assign({}, mapNullableType("object")), { additionalProperties: propertiesSchema });
  }
}

class StringTransformer {
  transform(zodSchema, mapNullableType) {
    var _a, _b, _c;
    const regexCheck = this.getZodStringCheck(zodSchema, "regex");
    const length = (_a = this.getZodStringCheck(zodSchema, "length")) === null || _a === undefined ? undefined : _a.value;
    const maxLength = Number.isFinite(zodSchema.minLength) ? (_b = zodSchema.minLength) !== null && _b !== undefined ? _b : undefined : undefined;
    const minLength = Number.isFinite(zodSchema.maxLength) ? (_c = zodSchema.maxLength) !== null && _c !== undefined ? _c : undefined : undefined;
    return Object.assign(Object.assign({}, mapNullableType("string")), {
      minLength: length !== null && length !== undefined ? length : maxLength,
      maxLength: length !== null && length !== undefined ? length : minLength,
      format: this.mapStringFormat(zodSchema),
      pattern: regexCheck === null || regexCheck === undefined ? undefined : regexCheck.regex.source
    });
  }
  mapStringFormat(zodString) {
    if (zodString.isUUID)
      return "uuid";
    if (zodString.isEmail)
      return "email";
    if (zodString.isURL)
      return "uri";
    if (zodString.isDate)
      return "date";
    if (zodString.isDatetime)
      return "date-time";
    if (zodString.isCUID)
      return "cuid";
    if (zodString.isCUID2)
      return "cuid2";
    if (zodString.isULID)
      return "ulid";
    if (zodString.isIP)
      return "ip";
    if (zodString.isEmoji)
      return "emoji";
    return;
  }
  getZodStringCheck(zodString, kind) {
    return zodString._def.checks.find((check) => {
      return check.kind === kind;
    });
  }
}

class TupleTransformer {
  constructor(versionSpecifics) {
    this.versionSpecifics = versionSpecifics;
  }
  transform(zodSchema, mapNullableType, mapItem) {
    const { items } = zodSchema._def;
    const schemas = items.map(mapItem);
    return Object.assign(Object.assign({}, mapNullableType("array")), this.versionSpecifics.mapTupleItems(schemas));
  }
}

class UnionTransformer {
  transform(zodSchema, mapNullableOfArray, mapItem) {
    const options = this.flattenUnionTypes(zodSchema);
    const schemas = options.map((schema) => {
      const optionToGenerate = this.unwrapNullable(schema);
      return mapItem(optionToGenerate);
    });
    return {
      anyOf: mapNullableOfArray(schemas)
    };
  }
  flattenUnionTypes(schema) {
    if (!isZodType(schema, "ZodUnion")) {
      return [schema];
    }
    const options = schema._def.options;
    return options.flatMap((option) => this.flattenUnionTypes(option));
  }
  unwrapNullable(schema) {
    if (isZodType(schema, "ZodNullable")) {
      return this.unwrapNullable(schema.unwrap());
    }
    return schema;
  }
}

class OpenApiTransformer {
  constructor(versionSpecifics) {
    this.versionSpecifics = versionSpecifics;
    this.objectTransformer = new ObjectTransformer;
    this.stringTransformer = new StringTransformer;
    this.numberTransformer = new NumberTransformer;
    this.bigIntTransformer = new BigIntTransformer;
    this.literalTransformer = new LiteralTransformer;
    this.enumTransformer = new EnumTransformer;
    this.nativeEnumTransformer = new NativeEnumTransformer;
    this.arrayTransformer = new ArrayTransformer;
    this.unionTransformer = new UnionTransformer;
    this.discriminatedUnionTransformer = new DiscriminatedUnionTransformer;
    this.intersectionTransformer = new IntersectionTransformer;
    this.recordTransformer = new RecordTransformer;
    this.tupleTransformer = new TupleTransformer(versionSpecifics);
  }
  transform(zodSchema, isNullable, mapItem, generateSchemaRef, defaultValue) {
    if (isZodType(zodSchema, "ZodNull")) {
      return this.versionSpecifics.nullType;
    }
    if (isZodType(zodSchema, "ZodUnknown") || isZodType(zodSchema, "ZodAny")) {
      return this.versionSpecifics.mapNullableType(undefined, isNullable);
    }
    if (isZodType(zodSchema, "ZodObject")) {
      return this.objectTransformer.transform(zodSchema, defaultValue, (_) => this.versionSpecifics.mapNullableType(_, isNullable), mapItem);
    }
    const schema = this.transformSchemaWithoutDefault(zodSchema, isNullable, mapItem, generateSchemaRef);
    return Object.assign(Object.assign({}, schema), { default: defaultValue });
  }
  transformSchemaWithoutDefault(zodSchema, isNullable, mapItem, generateSchemaRef) {
    if (isZodType(zodSchema, "ZodUnknown") || isZodType(zodSchema, "ZodAny")) {
      return this.versionSpecifics.mapNullableType(undefined, isNullable);
    }
    if (isZodType(zodSchema, "ZodString")) {
      return this.stringTransformer.transform(zodSchema, (schema) => this.versionSpecifics.mapNullableType(schema, isNullable));
    }
    if (isZodType(zodSchema, "ZodNumber")) {
      return this.numberTransformer.transform(zodSchema, (schema) => this.versionSpecifics.mapNullableType(schema, isNullable), (_) => this.versionSpecifics.getNumberChecks(_));
    }
    if (isZodType(zodSchema, "ZodBigInt")) {
      return this.bigIntTransformer.transform((schema) => this.versionSpecifics.mapNullableType(schema, isNullable));
    }
    if (isZodType(zodSchema, "ZodBoolean")) {
      return this.versionSpecifics.mapNullableType("boolean", isNullable);
    }
    if (isZodType(zodSchema, "ZodLiteral")) {
      return this.literalTransformer.transform(zodSchema, (schema) => this.versionSpecifics.mapNullableType(schema, isNullable));
    }
    if (isZodType(zodSchema, "ZodEnum")) {
      return this.enumTransformer.transform(zodSchema, (schema) => this.versionSpecifics.mapNullableType(schema, isNullable));
    }
    if (isZodType(zodSchema, "ZodNativeEnum")) {
      return this.nativeEnumTransformer.transform(zodSchema, (schema) => this.versionSpecifics.mapNullableType(schema, isNullable));
    }
    if (isZodType(zodSchema, "ZodArray")) {
      return this.arrayTransformer.transform(zodSchema, (_) => this.versionSpecifics.mapNullableType(_, isNullable), mapItem);
    }
    if (isZodType(zodSchema, "ZodTuple")) {
      return this.tupleTransformer.transform(zodSchema, (_) => this.versionSpecifics.mapNullableType(_, isNullable), mapItem);
    }
    if (isZodType(zodSchema, "ZodUnion")) {
      return this.unionTransformer.transform(zodSchema, (_) => this.versionSpecifics.mapNullableOfArray(_, isNullable), mapItem);
    }
    if (isZodType(zodSchema, "ZodDiscriminatedUnion")) {
      return this.discriminatedUnionTransformer.transform(zodSchema, isNullable, (_) => this.versionSpecifics.mapNullableOfArray(_, isNullable), mapItem, generateSchemaRef);
    }
    if (isZodType(zodSchema, "ZodIntersection")) {
      return this.intersectionTransformer.transform(zodSchema, isNullable, (_) => this.versionSpecifics.mapNullableOfArray(_, isNullable), mapItem);
    }
    if (isZodType(zodSchema, "ZodRecord")) {
      return this.recordTransformer.transform(zodSchema, (_) => this.versionSpecifics.mapNullableType(_, isNullable), mapItem);
    }
    if (isZodType(zodSchema, "ZodDate")) {
      return this.versionSpecifics.mapNullableType("string", isNullable);
    }
    const refId = Metadata.getRefId(zodSchema);
    throw new UnknownZodTypeError({
      currentSchema: zodSchema._def,
      schemaName: refId
    });
  }
}

class OpenAPIGenerator {
  constructor(definitions, versionSpecifics) {
    this.definitions = definitions;
    this.versionSpecifics = versionSpecifics;
    this.schemaRefs = {};
    this.paramRefs = {};
    this.pathRefs = {};
    this.rawComponents = [];
    this.openApiTransformer = new OpenApiTransformer(versionSpecifics);
    this.sortDefinitions();
  }
  generateDocumentData() {
    this.definitions.forEach((definition) => this.generateSingle(definition));
    return {
      components: this.buildComponents(),
      paths: this.pathRefs
    };
  }
  generateComponents() {
    this.definitions.forEach((definition) => this.generateSingle(definition));
    return {
      components: this.buildComponents()
    };
  }
  buildComponents() {
    var _a, _b;
    const rawComponents = {};
    this.rawComponents.forEach(({ componentType, name, component }) => {
      var _a2;
      (_a2 = rawComponents[componentType]) !== null && _a2 !== undefined || (rawComponents[componentType] = {});
      rawComponents[componentType][name] = component;
    });
    return Object.assign(Object.assign({}, rawComponents), { schemas: Object.assign(Object.assign({}, (_a = rawComponents.schemas) !== null && _a !== undefined ? _a : {}), this.schemaRefs), parameters: Object.assign(Object.assign({}, (_b = rawComponents.parameters) !== null && _b !== undefined ? _b : {}), this.paramRefs) });
  }
  sortDefinitions() {
    const generationOrder = [
      "schema",
      "parameter",
      "component",
      "route"
    ];
    this.definitions.sort((left, right) => {
      if (!("type" in left)) {
        if (!("type" in right)) {
          return 0;
        }
        return -1;
      }
      if (!("type" in right)) {
        return 1;
      }
      const leftIndex = generationOrder.findIndex((type) => type === left.type);
      const rightIndex = generationOrder.findIndex((type) => type === right.type);
      return leftIndex - rightIndex;
    });
  }
  generateSingle(definition) {
    if (!("type" in definition)) {
      this.generateSchemaWithRef(definition);
      return;
    }
    switch (definition.type) {
      case "parameter":
        this.generateParameterDefinition(definition.schema);
        return;
      case "schema":
        this.generateSchemaWithRef(definition.schema);
        return;
      case "route":
        this.generateSingleRoute(definition.route);
        return;
      case "component":
        this.rawComponents.push(definition);
        return;
    }
  }
  generateParameterDefinition(zodSchema) {
    const refId = Metadata.getRefId(zodSchema);
    const result = this.generateParameter(zodSchema);
    if (refId) {
      this.paramRefs[refId] = result;
    }
    return result;
  }
  getParameterRef(schemaMetadata, external) {
    var _a, _b, _c, _d, _e;
    const parameterMetadata = (_a = schemaMetadata === null || schemaMetadata === undefined ? undefined : schemaMetadata.metadata) === null || _a === undefined ? undefined : _a.param;
    const existingRef = ((_b = schemaMetadata === null || schemaMetadata === undefined ? undefined : schemaMetadata._internal) === null || _b === undefined ? undefined : _b.refId) ? this.paramRefs[(_c = schemaMetadata._internal) === null || _c === undefined ? undefined : _c.refId] : undefined;
    if (!((_d = schemaMetadata === null || schemaMetadata === undefined ? undefined : schemaMetadata._internal) === null || _d === undefined ? undefined : _d.refId) || !existingRef) {
      return;
    }
    if (parameterMetadata && existingRef.in !== parameterMetadata.in || (external === null || external === undefined ? undefined : external.in) && existingRef.in !== external.in) {
      throw new ConflictError(`Conflicting location for parameter ${existingRef.name}`, {
        key: "in",
        values: compact([
          existingRef.in,
          external === null || external === undefined ? undefined : external.in,
          parameterMetadata === null || parameterMetadata === undefined ? undefined : parameterMetadata.in
        ])
      });
    }
    if (parameterMetadata && existingRef.name !== parameterMetadata.name || (external === null || external === undefined ? undefined : external.name) && existingRef.name !== (external === null || external === undefined ? undefined : external.name)) {
      throw new ConflictError(`Conflicting names for parameter`, {
        key: "name",
        values: compact([
          existingRef.name,
          external === null || external === undefined ? undefined : external.name,
          parameterMetadata === null || parameterMetadata === undefined ? undefined : parameterMetadata.name
        ])
      });
    }
    return {
      $ref: `#/components/parameters/${(_e = schemaMetadata._internal) === null || _e === undefined ? undefined : _e.refId}`
    };
  }
  generateInlineParameters(zodSchema, location) {
    var _a;
    const metadata = Metadata.getMetadata(zodSchema);
    const parameterMetadata = (_a = metadata === null || metadata === undefined ? undefined : metadata.metadata) === null || _a === undefined ? undefined : _a.param;
    const referencedSchema = this.getParameterRef(metadata, { in: location });
    if (referencedSchema) {
      return [referencedSchema];
    }
    if (isZodType(zodSchema, "ZodObject")) {
      const propTypes = zodSchema._def.shape();
      const parameters = Object.entries(propTypes).map(([key, schema]) => {
        var _a2, _b;
        const innerMetadata = Metadata.getMetadata(schema);
        const referencedSchema2 = this.getParameterRef(innerMetadata, {
          in: location,
          name: key
        });
        if (referencedSchema2) {
          return referencedSchema2;
        }
        const innerParameterMetadata = (_a2 = innerMetadata === null || innerMetadata === undefined ? undefined : innerMetadata.metadata) === null || _a2 === undefined ? undefined : _a2.param;
        if ((innerParameterMetadata === null || innerParameterMetadata === undefined ? undefined : innerParameterMetadata.name) && innerParameterMetadata.name !== key) {
          throw new ConflictError(`Conflicting names for parameter`, {
            key: "name",
            values: [key, innerParameterMetadata.name]
          });
        }
        if ((innerParameterMetadata === null || innerParameterMetadata === undefined ? undefined : innerParameterMetadata.in) && innerParameterMetadata.in !== location) {
          throw new ConflictError(`Conflicting location for parameter ${(_b = innerParameterMetadata.name) !== null && _b !== undefined ? _b : key}`, {
            key: "in",
            values: [location, innerParameterMetadata.in]
          });
        }
        return this.generateParameter(schema.openapi({ param: { name: key, in: location } }));
      });
      return parameters;
    }
    if ((parameterMetadata === null || parameterMetadata === undefined ? undefined : parameterMetadata.in) && parameterMetadata.in !== location) {
      throw new ConflictError(`Conflicting location for parameter ${parameterMetadata.name}`, {
        key: "in",
        values: [location, parameterMetadata.in]
      });
    }
    return [
      this.generateParameter(zodSchema.openapi({ param: { in: location } }))
    ];
  }
  generateSimpleParameter(zodSchema) {
    var _a;
    const metadata = Metadata.getParamMetadata(zodSchema);
    const paramMetadata = (_a = metadata === null || metadata === undefined ? undefined : metadata.metadata) === null || _a === undefined ? undefined : _a.param;
    const required = !Metadata.isOptionalSchema(zodSchema) && !zodSchema.isNullable();
    const schema = this.generateSchemaWithRef(zodSchema);
    return Object.assign({
      schema,
      required
    }, paramMetadata ? Metadata.buildParameterMetadata(paramMetadata) : {});
  }
  generateParameter(zodSchema) {
    var _a;
    const metadata = Metadata.getMetadata(zodSchema);
    const paramMetadata = (_a = metadata === null || metadata === undefined ? undefined : metadata.metadata) === null || _a === undefined ? undefined : _a.param;
    const paramName = paramMetadata === null || paramMetadata === undefined ? undefined : paramMetadata.name;
    const paramLocation = paramMetadata === null || paramMetadata === undefined ? undefined : paramMetadata.in;
    if (!paramName) {
      throw new MissingParameterDataError({ missingField: "name" });
    }
    if (!paramLocation) {
      throw new MissingParameterDataError({
        missingField: "in",
        paramName
      });
    }
    const baseParameter = this.generateSimpleParameter(zodSchema);
    return Object.assign(Object.assign({}, baseParameter), { in: paramLocation, name: paramName });
  }
  generateSchemaWithMetadata(zodSchema) {
    var _a;
    const innerSchema = Metadata.unwrapChained(zodSchema);
    const metadata = Metadata.getMetadata(zodSchema);
    const defaultValue = Metadata.getDefaultValue(zodSchema);
    const result = ((_a = metadata === null || metadata === undefined ? undefined : metadata.metadata) === null || _a === undefined ? undefined : _a.type) ? { type: metadata === null || metadata === undefined ? undefined : metadata.metadata.type } : this.toOpenAPISchema(innerSchema, zodSchema.isNullable(), defaultValue);
    return (metadata === null || metadata === undefined ? undefined : metadata.metadata) ? Metadata.applySchemaMetadata(result, metadata.metadata) : omitBy(result, isUndefined);
  }
  constructReferencedOpenAPISchema(zodSchema) {
    var _a;
    const metadata = Metadata.getMetadata(zodSchema);
    const innerSchema = Metadata.unwrapChained(zodSchema);
    const defaultValue = Metadata.getDefaultValue(zodSchema);
    const isNullableSchema = zodSchema.isNullable();
    if ((_a = metadata === null || metadata === undefined ? undefined : metadata.metadata) === null || _a === undefined ? undefined : _a.type) {
      return this.versionSpecifics.mapNullableType(metadata.metadata.type, isNullableSchema);
    }
    return this.toOpenAPISchema(innerSchema, isNullableSchema, defaultValue);
  }
  generateSimpleSchema(zodSchema) {
    var _a;
    const metadata = Metadata.getMetadata(zodSchema);
    const refId = Metadata.getRefId(zodSchema);
    if (!refId || !this.schemaRefs[refId]) {
      return this.generateSchemaWithMetadata(zodSchema);
    }
    const schemaRef = this.schemaRefs[refId];
    const referenceObject = {
      $ref: this.generateSchemaRef(refId)
    };
    const newMetadata = omitBy(Metadata.buildSchemaMetadata((_a = metadata === null || metadata === undefined ? undefined : metadata.metadata) !== null && _a !== undefined ? _a : {}), (value, key) => value === undefined || objectEquals(value, schemaRef[key]));
    if (newMetadata.type) {
      return {
        allOf: [referenceObject, newMetadata]
      };
    }
    const newSchemaMetadata = omitBy(this.constructReferencedOpenAPISchema(zodSchema), (value, key) => value === undefined || objectEquals(value, schemaRef[key]));
    const appliedMetadata = Metadata.applySchemaMetadata(newSchemaMetadata, newMetadata);
    if (Object.keys(appliedMetadata).length > 0) {
      return {
        allOf: [referenceObject, appliedMetadata]
      };
    }
    return referenceObject;
  }
  generateSchemaWithRef(zodSchema) {
    const refId = Metadata.getRefId(zodSchema);
    const result = this.generateSimpleSchema(zodSchema);
    if (refId && this.schemaRefs[refId] === undefined) {
      this.schemaRefs[refId] = result;
      return { $ref: this.generateSchemaRef(refId) };
    }
    return result;
  }
  generateSchemaRef(refId) {
    return `#/components/schemas/${refId}`;
  }
  getRequestBody(requestBody) {
    if (!requestBody) {
      return;
    }
    const { content } = requestBody, rest = __rest(requestBody, ["content"]);
    const requestBodyContent = this.getBodyContent(content);
    return Object.assign(Object.assign({}, rest), { content: requestBodyContent });
  }
  getParameters(request) {
    if (!request) {
      return [];
    }
    const { headers } = request;
    const query = this.cleanParameter(request.query);
    const params = this.cleanParameter(request.params);
    const cookies = this.cleanParameter(request.cookies);
    const queryParameters = enhanceMissingParametersError(() => query ? this.generateInlineParameters(query, "query") : [], { location: "query" });
    const pathParameters = enhanceMissingParametersError(() => params ? this.generateInlineParameters(params, "path") : [], { location: "path" });
    const cookieParameters = enhanceMissingParametersError(() => cookies ? this.generateInlineParameters(cookies, "cookie") : [], { location: "cookie" });
    const headerParameters = enhanceMissingParametersError(() => {
      if (Array.isArray(headers)) {
        return headers.flatMap((header) => this.generateInlineParameters(header, "header"));
      }
      const cleanHeaders = this.cleanParameter(headers);
      return cleanHeaders ? this.generateInlineParameters(cleanHeaders, "header") : [];
    }, { location: "header" });
    return [
      ...pathParameters,
      ...queryParameters,
      ...headerParameters,
      ...cookieParameters
    ];
  }
  cleanParameter(schema) {
    if (!schema) {
      return;
    }
    return isZodType(schema, "ZodEffects") ? this.cleanParameter(schema._def.schema) : schema;
  }
  generatePath(route) {
    const { method, path, request, responses } = route, pathItemConfig = __rest(route, ["method", "path", "request", "responses"]);
    const generatedResponses = mapValues(responses, (response) => {
      return this.getResponse(response);
    });
    const parameters = enhanceMissingParametersError(() => this.getParameters(request), { route: `${method} ${path}` });
    const requestBody = this.getRequestBody(request === null || request === undefined ? undefined : request.body);
    const routeDoc = {
      [method]: Object.assign(Object.assign(Object.assign(Object.assign({}, pathItemConfig), parameters.length > 0 ? {
        parameters: [...pathItemConfig.parameters || [], ...parameters]
      } : {}), requestBody ? { requestBody } : {}), { responses: generatedResponses })
    };
    return routeDoc;
  }
  generateSingleRoute(route) {
    const routeDoc = this.generatePath(route);
    this.pathRefs[route.path] = Object.assign(Object.assign({}, this.pathRefs[route.path]), routeDoc);
    return routeDoc;
  }
  getResponse(response) {
    if (this.isReferenceObject(response)) {
      return response;
    }
    const { content, headers } = response, rest = __rest(response, ["content", "headers"]);
    const responseContent = content ? { content: this.getBodyContent(content) } : {};
    if (!headers) {
      return Object.assign(Object.assign({}, rest), responseContent);
    }
    const responseHeaders = isZodType(headers, "ZodObject") ? this.getResponseHeaders(headers) : headers;
    return Object.assign(Object.assign(Object.assign({}, rest), { headers: responseHeaders }), responseContent);
  }
  isReferenceObject(schema) {
    return "$ref" in schema;
  }
  getResponseHeaders(headers) {
    const schemaShape = headers._def.shape();
    const responseHeaders = mapValues(schemaShape, (_) => this.generateSimpleParameter(_));
    return responseHeaders;
  }
  getBodyContent(content) {
    return mapValues(content, (config) => {
      if (!config || !isAnyZodType(config.schema)) {
        return config;
      }
      const { schema: configSchema } = config, rest = __rest(config, ["schema"]);
      const schema = this.generateSchemaWithRef(configSchema);
      return Object.assign({ schema }, rest);
    });
  }
  toOpenAPISchema(zodSchema, isNullable, defaultValue) {
    return this.openApiTransformer.transform(zodSchema, isNullable, (_) => this.generateSchemaWithRef(_), (_) => this.generateSchemaRef(_), defaultValue);
  }
}

class OpenApiGeneratorV30Specifics {
  get nullType() {
    return { nullable: true };
  }
  mapNullableOfArray(objects, isNullable) {
    if (isNullable) {
      return [...objects, this.nullType];
    }
    return objects;
  }
  mapNullableType(type, isNullable) {
    return Object.assign(Object.assign({}, type ? { type } : undefined), isNullable ? this.nullType : undefined);
  }
  mapTupleItems(schemas) {
    const uniqueSchemas = uniq(schemas);
    return {
      items: uniqueSchemas.length === 1 ? uniqueSchemas[0] : { anyOf: uniqueSchemas },
      minItems: schemas.length,
      maxItems: schemas.length
    };
  }
  getNumberChecks(checks) {
    return Object.assign({}, ...checks.map((check) => {
      switch (check.kind) {
        case "min":
          return check.inclusive ? { minimum: Number(check.value) } : { minimum: Number(check.value), exclusiveMinimum: true };
        case "max":
          return check.inclusive ? { maximum: Number(check.value) } : { maximum: Number(check.value), exclusiveMaximum: true };
        default:
          return {};
      }
    }));
  }
}

class OpenApiGeneratorV3 {
  constructor(definitions) {
    const specifics = new OpenApiGeneratorV30Specifics;
    this.generator = new OpenAPIGenerator(definitions, specifics);
  }
  generateDocument(config) {
    const baseData = this.generator.generateDocumentData();
    return Object.assign(Object.assign({}, config), baseData);
  }
  generateComponents() {
    return this.generator.generateComponents();
  }
}

class OpenApiGeneratorV31Specifics {
  get nullType() {
    return { type: "null" };
  }
  mapNullableOfArray(objects, isNullable) {
    if (isNullable) {
      return [...objects, this.nullType];
    }
    return objects;
  }
  mapNullableType(type, isNullable) {
    if (!type) {
      return {};
    }
    if (isNullable) {
      return {
        type: Array.isArray(type) ? [...type, "null"] : [type, "null"]
      };
    }
    return {
      type
    };
  }
  mapTupleItems(schemas) {
    return {
      prefixItems: schemas
    };
  }
  getNumberChecks(checks) {
    return Object.assign({}, ...checks.map((check) => {
      switch (check.kind) {
        case "min":
          return check.inclusive ? { minimum: Number(check.value) } : { exclusiveMinimum: Number(check.value) };
        case "max":
          return check.inclusive ? { maximum: Number(check.value) } : { exclusiveMaximum: Number(check.value) };
        default:
          return {};
      }
    }));
  }
}
function isWebhookDefinition(definition) {
  return "type" in definition && definition.type === "webhook";
}

class OpenApiGeneratorV31 {
  constructor(definitions) {
    this.definitions = definitions;
    this.webhookRefs = {};
    const specifics = new OpenApiGeneratorV31Specifics;
    this.generator = new OpenAPIGenerator(this.definitions, specifics);
  }
  generateDocument(config) {
    const baseDocument = this.generator.generateDocumentData();
    this.definitions.filter(isWebhookDefinition).forEach((definition) => this.generateSingleWebhook(definition.webhook));
    return Object.assign(Object.assign(Object.assign({}, config), baseDocument), { webhooks: this.webhookRefs });
  }
  generateComponents() {
    return this.generator.generateComponents();
  }
  generateSingleWebhook(route) {
    const routeDoc = this.generator.generatePath(route);
    this.webhookRefs[route.path] = Object.assign(Object.assign({}, this.webhookRefs[route.path]), routeDoc);
    return routeDoc;
  }
}
var $OpenAPIRegistry = OpenAPIRegistry;
var $OpenApiGeneratorV3 = OpenApiGeneratorV3;
var $OpenApiGeneratorV31 = OpenApiGeneratorV31;
var $extendZodWithOpenApi = extendZodWithOpenApi;

// node_modules/hono/dist/utils/url.js
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match, index) => {
    const mark = `@${index}`;
    groups.push([mark, match]);
    return mark;
  });
  return { groups, path };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1;i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1;j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
  if (label === "*") {
    return "*";
  }
  const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match[1], new RegExp(`^${match[2]}(?=/${next})`)] : [label, match[1], new RegExp(`^${match[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
};
var tryDecode = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match) => {
      try {
        return decoder(match);
      } catch {
        return match;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (;i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? undefined : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
};
var _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? undefined : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(keyIndex + 1, valueIndex === -1 ? nextKeyIndex === -1 ? undefined : nextKeyIndex : valueIndex);
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? undefined : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/utils/cookie.js
var validCookieNameRegEx = /^[\w!#$%&'*.^`|~+-]+$/;
var validCookieValueRegEx = /^[ !#-:<-[\]-~]*$/;
var trimCookieWhitespace = (value) => {
  let start = 0;
  let end = value.length;
  while (start < end) {
    const charCode = value.charCodeAt(start);
    if (charCode !== 32 && charCode !== 9) {
      break;
    }
    start++;
  }
  while (end > start) {
    const charCode = value.charCodeAt(end - 1);
    if (charCode !== 32 && charCode !== 9) {
      break;
    }
    end--;
  }
  return start === 0 && end === value.length ? value : value.slice(start, end);
};
var parse = (cookie, name) => {
  if (name && cookie.indexOf(name) === -1) {
    return {};
  }
  const pairs = cookie.split(";");
  const parsedCookie = {};
  for (const pairStr of pairs) {
    const valueStartPos = pairStr.indexOf("=");
    if (valueStartPos === -1) {
      continue;
    }
    const cookieName = trimCookieWhitespace(pairStr.substring(0, valueStartPos));
    if (name && name !== cookieName || !validCookieNameRegEx.test(cookieName)) {
      continue;
    }
    let cookieValue = trimCookieWhitespace(pairStr.substring(valueStartPos + 1));
    if (cookieValue.startsWith('"') && cookieValue.endsWith('"')) {
      cookieValue = cookieValue.slice(1, -1);
    }
    if (validCookieValueRegEx.test(cookieValue)) {
      parsedCookie[cookieName] = cookieValue.indexOf("%") !== -1 ? tryDecode(cookieValue, decodeURIComponent_) : cookieValue;
      if (name) {
        break;
      }
    }
  }
  return parsedCookie;
};

// node_modules/hono/dist/helper/cookie/index.js
var getCookie = (c, key, prefix) => {
  const cookie = c.req.raw.headers.get("Cookie");
  if (typeof key === "string") {
    if (!cookie) {
      return;
    }
    let finalKey = key;
    if (prefix === "secure") {
      finalKey = "__Secure-" + key;
    } else if (prefix === "host") {
      finalKey = "__Host-" + key;
    }
    const obj2 = parse(cookie, finalKey);
    return obj2[finalKey];
  }
  if (!cookie) {
    return {};
  }
  const obj = parse(cookie);
  return obj;
};

// node_modules/hono/dist/http-exception.js
var HTTPException = class extends Error {
  res;
  status;
  constructor(status = 500, options) {
    super(options?.message, { cause: options?.cause });
    this.res = options?.res;
    this.status = status;
  }
  getResponse() {
    if (this.res) {
      const newResponse = new Response(this.res.body, {
        status: this.status,
        headers: this.res.headers
      });
      return newResponse;
    }
    return new Response(this.message, {
      status: this.status
    });
  }
};

// node_modules/hono/dist/utils/buffer.js
var bufferToFormData = (arrayBuffer, contentType) => {
  const response = new Response(arrayBuffer, {
    headers: {
      "Content-Type": contentType
    }
  });
  return response.formData();
};

// node_modules/hono/dist/validator/validator.js
var jsonRegex = /^application\/([a-z-\.]+\+)?json(;\s*[a-zA-Z0-9\-]+\=([^;]+))*$/;
var multipartRegex = /^multipart\/form-data(;\s?boundary=[a-zA-Z0-9'"()+_,\-./:=?]+)?$/;
var urlencodedRegex = /^application\/x-www-form-urlencoded(;\s*[a-zA-Z0-9\-]+\=([^;]+))*$/;
var validator = (target, validationFunc) => {
  return async (c, next) => {
    let value = {};
    const contentType = c.req.header("Content-Type");
    switch (target) {
      case "json":
        if (!contentType || !jsonRegex.test(contentType)) {
          break;
        }
        try {
          value = await c.req.json();
        } catch {
          const message = "Malformed JSON in request body";
          throw new HTTPException(400, { message });
        }
        break;
      case "form": {
        if (!contentType || !(multipartRegex.test(contentType) || urlencodedRegex.test(contentType))) {
          break;
        }
        let formData;
        if (c.req.bodyCache.formData) {
          formData = await c.req.bodyCache.formData;
        } else {
          try {
            const arrayBuffer = await c.req.arrayBuffer();
            formData = await bufferToFormData(arrayBuffer, contentType);
            c.req.bodyCache.formData = formData;
          } catch (e) {
            let message = "Malformed FormData request.";
            message += e instanceof Error ? ` ${e.message}` : ` ${String(e)}`;
            throw new HTTPException(400, { message });
          }
        }
        const form = /* @__PURE__ */ Object.create(null);
        formData.forEach((value2, key) => {
          if (key.endsWith("[]")) {
            (form[key] ??= []).push(value2);
          } else if (Array.isArray(form[key])) {
            form[key].push(value2);
          } else if (Object.hasOwn(form, key)) {
            form[key] = [form[key], value2];
          } else {
            form[key] = value2;
          }
        });
        value = form;
        break;
      }
      case "query":
        value = Object.fromEntries(Object.entries(c.req.queries()).map(([k, v]) => {
          return v.length === 1 ? [k, v[0]] : [k, v];
        }));
        break;
      case "param":
        value = c.req.param();
        break;
      case "header":
        value = c.req.header();
        break;
      case "cookie":
        value = getCookie(c);
        break;
    }
    const res = await validationFunc(value, c);
    if (res instanceof Response) {
      return res;
    }
    c.req.addValidatedData(target, res);
    return await next();
  };
};

// node_modules/@hono/zod-openapi/node_modules/@hono/zod-validator/dist/index.js
function zValidatorFunction(target, schema, hook, options) {
  return validator(target, async (value, c) => {
    let validatorValue = value;
    if (target === "header" && "_def" in schema || target === "header" && "_zod" in schema) {
      const schemaKeys = Object.keys("in" in schema ? schema.in.shape : schema.shape);
      const caseInsensitiveKeymap = Object.fromEntries(schemaKeys.map((key) => [key.toLowerCase(), key]));
      validatorValue = Object.fromEntries(Object.entries(value).map(([key, value$1]) => [caseInsensitiveKeymap[key] || key, value$1]));
    }
    const result = options && options.validationFunction ? await options.validationFunction(schema, validatorValue) : await schema.safeParseAsync(validatorValue);
    if (hook) {
      const hookResult = await hook({
        data: validatorValue,
        ...result,
        target
      }, c);
      if (hookResult) {
        if (hookResult instanceof Response)
          return hookResult;
        if ("response" in hookResult)
          return hookResult.response;
      }
    }
    if (!result.success)
      return c.json(result, 400);
    return result.data;
  });
}
var zValidator = zValidatorFunction;

// node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || undefined;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};

// node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// node_modules/hono/dist/utils/body.js
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
};
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
var handleParsingAllValues = (form, key, value) => {
  if (form[key] !== undefined) {
    if (Array.isArray(form[key])) {
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
};
var handleParsingNestedValues = (form, key, value) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};

// node_modules/hono/dist/request.js
var tryDecodeURIComponent = (str) => tryDecode(str, decodeURIComponent_);
var HonoRequest = class {
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== undefined) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? undefined;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw[key]();
  };
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  text() {
    return this.#cachedBody("text");
  }
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  blob() {
    return this.#cachedBody("blob");
  }
  formData() {
    return this.#cachedBody("formData");
  }
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var escapeRe = /[&<>'"]/;
var stringBufferToString = async (buffer, callbacks) => {
  let str = "";
  callbacks ||= [];
  const resolvedBuffer = await Promise.all(buffer);
  for (let i = resolvedBuffer.length - 1;; i--) {
    str += resolvedBuffer[i];
    i--;
    if (i < 0) {
      break;
    }
    let r = resolvedBuffer[i];
    if (typeof r === "object") {
      callbacks.push(...r.callbacks || []);
    }
    const isEscaped = r.isEscaped;
    r = await (typeof r === "object" ? r.toString() : r);
    if (typeof r === "object") {
      callbacks.push(...r.callbacks || []);
    }
    if (r.isEscaped ?? isEscaped) {
      str += r;
    } else {
      const buf = [str];
      escapeToBuffer(r, buf);
      str = buf[0];
    }
  }
  return raw(str, callbacks);
};
var escapeToBuffer = (str, buffer) => {
  const match = str.search(escapeRe);
  if (match === -1) {
    buffer[0] += str;
    return;
  }
  let escape2;
  let index;
  let lastIndex = 0;
  for (index = match;index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34:
        escape2 = "&quot;";
        break;
      case 39:
        escape2 = "&#39;";
        break;
      case 38:
        escape2 = "&amp;";
        break;
      case 60:
        escape2 = "&lt;";
        break;
      case 62:
        escape2 = "&gt;";
        break;
      default:
        continue;
    }
    buffer[0] += str.substring(lastIndex, index) + escape2;
    lastIndex = index + 1;
  }
  buffer[0] += str.substring(lastIndex, index);
};
var resolveCallbackSync = (str) => {
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return str;
  }
  const buffer = [str];
  const context = {};
  callbacks.forEach((c) => c({ phase: HtmlEscapedCallbackPhase.Stringify, buffer, context }));
  return buffer[0];
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then((res) => Promise.all(res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))).then(() => buffer[0]));
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
};
var createResponseInstance = (body, init) => new Response(body, init);
var Context = class {
  #rawRequest;
  #req;
  env = {};
  #var;
  finalized = false;
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers
    });
  }
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  setLayout = (layout) => this.#layout = layout;
  getLayout = () => this.#layout;
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  header = (name, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers;
    if (value === undefined) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  };
  status = (status) => {
    this.#status = status;
  };
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map;
    this.#var.set(key, value);
  };
  get = (key) => {
    return this.#var ? this.#var.get(key) : undefined;
  };
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers;
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, { status, headers: responseHeaders });
  }
  newResponse = (...args) => this.#newResponse(...args);
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  text = (text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(text, arg, setDefaultContentType(TEXT_PLAIN, headers));
  };
  json = (object, arg, headers) => {
    return this.#newResponse(JSON.stringify(object), arg, setDefaultContentType("application/json", headers));
  };
  html = (html, arg, headers) => {
    const res = (html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  };
  redirect = (location, status) => {
    const locationString = String(location);
    this.header("Location", !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString));
    return this.newResponse(null, status ?? 302);
  };
  notFound = () => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  };
};

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class _Hono {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  route(path, app) {
    const subApp = this.basePath(path);
    app.routes.map((r) => {
      let handler;
      if (app.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose([], app.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  notFound = (handler) => {
    this.#notFoundHandler = handler;
    return this;
  };
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = (request) => request;
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = undefined;
      try {
        executionContext = c.executionCtx;
      } catch {}
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { basePath: this._basePath, path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then((resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(new Request(/^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`, requestInit), Env, executionCtx);
  };
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, undefined, event.request.method));
    });
  };
};

// node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = (method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  };
  this.match = match2;
  return match2(method, path);
}

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node = class _Node {
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== undefined) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some((k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR)) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new _Node;
        if (name !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some((k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR)) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new _Node;
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  #context = { varIndex: 0 };
  #root = new Node;
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0;; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1;i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1;j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== undefined) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== undefined) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(path === "*" ? "" : `^${path.replace(/\/\*$|([.\\+*[^\]$()])/g, (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)")}$`);
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie;
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map((route) => [!/\*|\/:/.test(route[0]), ...route]).sort(([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length);
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length;i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (;paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length;i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length;j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length;k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path) {
  if (!middleware) {
    return;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return;
}
var RegExpRouter = class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach((p) => re.test(p) && routes[m][p].push([handler, paramCount]));
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length;i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = undefined;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]]));
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/reg-exp-router/prepared-router.js
var PreparedRegExpRouter = class {
  name = "PreparedRegExpRouter";
  #matchers;
  #relocateMap;
  constructor(matchers, relocateMap) {
    this.#matchers = matchers;
    this.#relocateMap = relocateMap;
  }
  #addWildcard(method, handlerData) {
    const matcher = this.#matchers[method];
    matcher[1].forEach((list) => list && list.push(handlerData));
    Object.values(matcher[2]).forEach((list) => list[0].push(handlerData));
  }
  #addPath(method, path, handler, indexes, map) {
    const matcher = this.#matchers[method];
    if (!map) {
      matcher[2][path][0].push([handler, {}]);
    } else {
      indexes.forEach((index) => {
        if (typeof index === "number") {
          matcher[1][index].push([handler, map]);
        } else {
          matcher[2][index || path][0].push([handler, map]);
        }
      });
    }
  }
  add(method, path, handler) {
    if (!this.#matchers[method]) {
      const all = this.#matchers[METHOD_NAME_ALL];
      const staticMap = {};
      for (const key in all[2]) {
        staticMap[key] = [all[2][key][0].slice(), emptyParam];
      }
      this.#matchers[method] = [
        all[0],
        all[1].map((list) => Array.isArray(list) ? list.slice() : 0),
        staticMap
      ];
    }
    if (path === "/*" || path === "*") {
      const handlerData = [handler, {}];
      if (method === METHOD_NAME_ALL) {
        for (const m in this.#matchers) {
          this.#addWildcard(m, handlerData);
        }
      } else {
        this.#addWildcard(method, handlerData);
      }
      return;
    }
    const data = this.#relocateMap[path];
    if (!data) {
      throw new Error(`Path ${path} is not registered`);
    }
    for (const [indexes, map] of data) {
      if (method === METHOD_NAME_ALL) {
        for (const m in this.#matchers) {
          this.#addPath(m, path, handler, indexes, map);
        }
      } else {
        this.#addPath(method, path, handler, indexes, map);
      }
    }
  }
  buildAllMatchers() {
    return this.#matchers;
  }
  match = match;
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (;i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length;i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = undefined;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var hasChildren = (children) => {
  for (const _ in children) {
    return true;
  }
  return false;
};
var Node2 = class _Node2 {
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length;i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new _Node2;
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length;i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== undefined) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length;i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0;i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length;j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length;k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          if (matcher instanceof RegExp) {
            if (partOffsets === null) {
              partOffsets = new Array(len);
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0;p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.substring(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (hasChildren(child.#children)) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(handlerSets, child.#children["*"], method, params, node.#params);
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2;
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length;i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter, new TrieRouter]
    });
  }
};

// node_modules/zod/v3/external.js
var exports_external = {};
__export(exports_external, {
  void: () => voidType,
  util: () => util,
  unknown: () => unknownType,
  union: () => unionType,
  undefined: () => undefinedType,
  tuple: () => tupleType,
  transformer: () => effectsType,
  symbol: () => symbolType,
  string: () => stringType,
  strictObject: () => strictObjectType,
  setErrorMap: () => setErrorMap,
  set: () => setType,
  record: () => recordType,
  quotelessJson: () => quotelessJson,
  promise: () => promiseType,
  preprocess: () => preprocessType,
  pipeline: () => pipelineType,
  ostring: () => ostring,
  optional: () => optionalType,
  onumber: () => onumber,
  oboolean: () => oboolean,
  objectUtil: () => objectUtil,
  object: () => objectType,
  number: () => numberType,
  nullable: () => nullableType,
  null: () => nullType,
  never: () => neverType,
  nativeEnum: () => nativeEnumType,
  nan: () => nanType,
  map: () => mapType,
  makeIssue: () => makeIssue,
  literal: () => literalType,
  lazy: () => lazyType,
  late: () => late,
  isValid: () => isValid,
  isDirty: () => isDirty,
  isAsync: () => isAsync,
  isAborted: () => isAborted,
  intersection: () => intersectionType,
  instanceof: () => instanceOfType,
  getParsedType: () => getParsedType,
  getErrorMap: () => getErrorMap,
  function: () => functionType,
  enum: () => enumType,
  effect: () => effectsType,
  discriminatedUnion: () => discriminatedUnionType,
  defaultErrorMap: () => en_default,
  datetimeRegex: () => datetimeRegex,
  date: () => dateType,
  custom: () => custom,
  coerce: () => coerce,
  boolean: () => booleanType,
  bigint: () => bigIntType,
  array: () => arrayType,
  any: () => anyType,
  addIssueToContext: () => addIssueToContext,
  ZodVoid: () => ZodVoid,
  ZodUnknown: () => ZodUnknown,
  ZodUnion: () => ZodUnion,
  ZodUndefined: () => ZodUndefined,
  ZodType: () => ZodType,
  ZodTuple: () => ZodTuple,
  ZodTransformer: () => ZodEffects,
  ZodSymbol: () => ZodSymbol,
  ZodString: () => ZodString,
  ZodSet: () => ZodSet,
  ZodSchema: () => ZodType,
  ZodRecord: () => ZodRecord,
  ZodReadonly: () => ZodReadonly,
  ZodPromise: () => ZodPromise,
  ZodPipeline: () => ZodPipeline,
  ZodParsedType: () => ZodParsedType,
  ZodOptional: () => ZodOptional,
  ZodObject: () => ZodObject,
  ZodNumber: () => ZodNumber,
  ZodNullable: () => ZodNullable,
  ZodNull: () => ZodNull,
  ZodNever: () => ZodNever,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNaN: () => ZodNaN,
  ZodMap: () => ZodMap,
  ZodLiteral: () => ZodLiteral,
  ZodLazy: () => ZodLazy,
  ZodIssueCode: () => ZodIssueCode,
  ZodIntersection: () => ZodIntersection,
  ZodFunction: () => ZodFunction,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodError: () => ZodError,
  ZodEnum: () => ZodEnum,
  ZodEffects: () => ZodEffects,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodDefault: () => ZodDefault,
  ZodDate: () => ZodDate,
  ZodCatch: () => ZodCatch,
  ZodBranded: () => ZodBranded,
  ZodBoolean: () => ZodBoolean,
  ZodBigInt: () => ZodBigInt,
  ZodArray: () => ZodArray,
  ZodAny: () => ZodAny,
  Schema: () => ZodType,
  ParseStatus: () => ParseStatus,
  OK: () => OK,
  NEVER: () => NEVER,
  INVALID: () => INVALID,
  EMPTY_PATH: () => EMPTY_PATH,
  DIRTY: () => DIRTY,
  BRAND: () => BRAND
});

// node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {};
  function assertIs(_arg) {}
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error;
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};

class ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
}
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}
// node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== undefined) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      ctx.schemaErrorMap,
      overrideMap,
      overrideMap === en_default ? undefined : en_default
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}

class ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
}
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
// node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// node_modules/zod/v3/types.js
class ParseInputLazyPath {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
}
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}

class ZodType {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus,
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(undefined).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}

class ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus;
    let ctx = undefined;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
}
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}

class ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = undefined;
    const status = new ParseStatus;
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
}
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};

class ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = undefined;
    const status = new ParseStatus;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
}
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};

class ZodBoolean extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};

class ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus;
    let ctx = undefined;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
}
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};

class ZodSymbol extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};

class ZodUndefined extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};

class ZodNull extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};

class ZodAny extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};

class ZodUnknown extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};

class ZodNever extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
}
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};

class ZodVoid extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};

class ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : undefined,
          maximum: tooBig ? def.exactLength.value : undefined,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}

class ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {} else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== undefined ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  extend(augmentation) {
    return new ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  merge(merging) {
    const merged = new ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  catchall(index) {
    return new ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
}
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};

class ZodUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = undefined;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
}
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [undefined];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [undefined, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};

class ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  static create(discriminator, options, params) {
    const optionsMap = new Map;
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
}
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0;index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}

class ZodIntersection extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
}
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};

class ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new ZodTuple({
      ...this._def,
      rest
    });
  }
}
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};

class ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
}

class ZodMap extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = new Map;
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = new Map;
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
}
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};

class ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = new Set;
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};

class ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
}

class ZodLazy extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
}
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};

class ZodLiteral extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
}
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}

class ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
}
ZodEnum.create = createZodEnum;

class ZodNativeEnum extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
}
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};

class ZodPromise extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
}
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};

class ZodEffects extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
}
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
class ZodOptional extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(undefined);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};

class ZodNullable extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};

class ZodDefault extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};

class ZodCatch extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
}
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};

class ZodNaN extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
}
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");

class ZodBranded extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
}

class ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
}

class ZodReadonly extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: (arg) => ZodString.create({ ...arg, coerce: true }),
  number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
  boolean: (arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  }),
  bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
  date: (arg) => ZodDate.create({ ...arg, coerce: true })
};
var NEVER = INVALID;
// node_modules/@hono/zod-openapi/dist/index.js
var OpenAPIHono = class _OpenAPIHono extends Hono2 {
  openAPIRegistry;
  defaultHook;
  constructor(init) {
    super(init);
    this.openAPIRegistry = new $OpenAPIRegistry;
    this.defaultHook = init?.defaultHook;
  }
  openapi = ({ middleware: routeMiddleware, hide, ...route }, handler, hook = this.defaultHook) => {
    if (!hide) {
      this.openAPIRegistry.registerPath(route);
    }
    const validators = [];
    if (route.request?.query) {
      const validator2 = zValidator("query", route.request.query, hook);
      validators.push(validator2);
    }
    if (route.request?.params) {
      const validator2 = zValidator("param", route.request.params, hook);
      validators.push(validator2);
    }
    if (route.request?.headers) {
      const validator2 = zValidator("header", route.request.headers, hook);
      validators.push(validator2);
    }
    if (route.request?.cookies) {
      const validator2 = zValidator("cookie", route.request.cookies, hook);
      validators.push(validator2);
    }
    const bodyContent = route.request?.body?.content;
    if (bodyContent) {
      for (const mediaType of Object.keys(bodyContent)) {
        if (!bodyContent[mediaType]) {
          continue;
        }
        const schema = bodyContent[mediaType]["schema"];
        if (!(schema instanceof ZodType)) {
          continue;
        }
        if (isJSONContentType(mediaType)) {
          const validator2 = zValidator("json", schema, hook);
          if (route.request?.body?.required) {
            validators.push(validator2);
          } else {
            const mw = async (c, next) => {
              if (c.req.header("content-type")) {
                if (isJSONContentType(c.req.header("content-type"))) {
                  return await validator2(c, next);
                }
              }
              c.req.addValidatedData("json", {});
              await next();
            };
            validators.push(mw);
          }
        }
        if (isFormContentType(mediaType)) {
          const validator2 = zValidator("form", schema, hook);
          if (route.request?.body?.required) {
            validators.push(validator2);
          } else {
            const mw = async (c, next) => {
              if (c.req.header("content-type")) {
                if (isFormContentType(c.req.header("content-type"))) {
                  return await validator2(c, next);
                }
              }
              c.req.addValidatedData("form", {});
              await next();
            };
            validators.push(mw);
          }
        }
      }
    }
    const middleware = routeMiddleware ? Array.isArray(routeMiddleware) ? routeMiddleware : [routeMiddleware] : [];
    this.on([route.method], route.path.replaceAll(/\/{(.+?)}/g, "/:$1"), ...middleware, ...validators, handler);
    return this;
  };
  getOpenAPIDocument = (config) => {
    const generator = new $OpenApiGeneratorV3(this.openAPIRegistry.definitions);
    const document2 = generator.generateDocument(config);
    return this._basePath ? addBasePathToDocument(document2, this._basePath) : document2;
  };
  getOpenAPI31Document = (config) => {
    const generator = new $OpenApiGeneratorV31(this.openAPIRegistry.definitions);
    const document2 = generator.generateDocument(config);
    return this._basePath ? addBasePathToDocument(document2, this._basePath) : document2;
  };
  doc = (path, configure) => {
    return this.get(path, (c) => {
      const config = typeof configure === "function" ? configure(c) : configure;
      try {
        const document2 = this.getOpenAPIDocument(config);
        return c.json(document2);
      } catch (e) {
        return c.json(e, 500);
      }
    });
  };
  doc31 = (path, configure) => {
    return this.get(path, (c) => {
      const config = typeof configure === "function" ? configure(c) : configure;
      try {
        const document2 = this.getOpenAPI31Document(config);
        return c.json(document2);
      } catch (e) {
        return c.json(e, 500);
      }
    });
  };
  route(path, app) {
    const pathForOpenAPI = path.replaceAll(/:([^\/]+)/g, "{$1}");
    super.route(path, app);
    if (!(app instanceof _OpenAPIHono)) {
      return this;
    }
    app.openAPIRegistry.definitions.forEach((def) => {
      switch (def.type) {
        case "component":
          return this.openAPIRegistry.registerComponent(def.componentType, def.name, def.component);
        case "route": {
          this.openAPIRegistry.registerPath({
            ...def.route,
            path: mergePath(pathForOpenAPI, app._basePath.replaceAll(/:([^\/]+)/g, "{$1}"), def.route.path)
          });
          return;
        }
        case "webhook": {
          this.openAPIRegistry.registerWebhook({
            ...def.webhook,
            path: mergePath(pathForOpenAPI, app._basePath.replaceAll(/:([^\/]+)/g, "{$1}"), def.webhook.path)
          });
          return;
        }
        case "schema":
          return this.openAPIRegistry.register(def.schema._def.openapi._internal.refId, def.schema);
        case "parameter":
          return this.openAPIRegistry.registerParameter(def.schema._def.openapi._internal.refId, def.schema);
        default: {
          const errorIfNotExhaustive = def;
          throw new Error(`Unknown registry type: ${errorIfNotExhaustive}`);
        }
      }
    });
    return this;
  }
  basePath(path) {
    return new _OpenAPIHono({ ...super.basePath(path), defaultHook: this.defaultHook });
  }
};
var createRoute = (routeConfig) => {
  const route = {
    ...routeConfig,
    getRoutingPath() {
      return routeConfig.path.replaceAll(/\/{(.+?)}/g, "/:$1");
    }
  };
  return Object.defineProperty(route, "getRoutingPath", { enumerable: false });
};
$extendZodWithOpenApi(exports_external);
function addBasePathToDocument(document2, basePath) {
  const updatedPaths = {};
  Object.keys(document2.paths).forEach((path) => {
    updatedPaths[mergePath(basePath.replaceAll(/:([^\/]+)/g, "{$1}"), path)] = document2.paths[path];
  });
  return {
    ...document2,
    paths: updatedPaths
  };
}
function isJSONContentType(contentType) {
  return /^application\/([a-z-\.]+\+)?json/.test(contentType);
}
function isFormContentType(contentType) {
  return contentType.startsWith("multipart/form-data") || contentType.startsWith("application/x-www-form-urlencoded");
}

// node_modules/@scalar/core/dist/libs/html-rendering/html-rendering.js
var addIndent = (str, spaces = 2, initialIndent = false) => {
  const indent = " ".repeat(spaces);
  const lines = str.split(`
`);
  return lines.map((line, index) => {
    if (index === 0 && !initialIndent) {
      return line;
    }
    return `${indent}${line}`;
  }).join(`
`);
};
var getStyles = (configuration, customTheme) => {
  const styles = [];
  if (configuration.customCss) {
    styles.push("/* Custom CSS */");
    styles.push(configuration.customCss);
  }
  if (!configuration.theme && customTheme) {
    styles.push("/* Custom Theme */");
    styles.push(customTheme);
  }
  if (styles.length === 0) {
    return "";
  }
  return `
    <style type="text/css">
      ${addIndent(styles.join(`

`), 6)}
    </style>`;
};
var getHtmlDocument = (givenConfiguration, customTheme = "") => {
  const { cdn, pageTitle, customCss, theme, ...rest } = givenConfiguration;
  const configuration = getConfiguration({
    ...rest,
    ...theme ? { theme } : {},
    customCss
  });
  const content = `<!doctype html>
<html>
  <head>
    <title>${pageTitle ?? "Scalar API Reference"}</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1" />${getStyles(configuration, customTheme)}
  </head>
  <body>
    <div id="app"></div>${getScriptTags(configuration, cdn)}
  </body>
</html>`;
  return content;
};
function getScriptTags(configuration, cdn) {
  const { tagsSorter, operationsSorter, generateHeadingSlug, generateModelSlug, generateTagSlug, generateOperationSlug, generateWebhookSlug, onLoaded, redirect, onSpecUpdate, onServerChange, ...restConfig } = configuration;
  const functionProps = [];
  const functionProperties = [
    { name: "tagsSorter", value: tagsSorter },
    { name: "operationsSorter", value: operationsSorter },
    { name: "generateHeadingSlug", value: generateHeadingSlug },
    { name: "generateModelSlug", value: generateModelSlug },
    { name: "generateTagSlug", value: generateTagSlug },
    { name: "generateOperationSlug", value: generateOperationSlug },
    { name: "generateWebhookSlug", value: generateWebhookSlug },
    { name: "onLoaded", value: onLoaded },
    { name: "redirect", value: redirect },
    { name: "onSpecUpdate", value: onSpecUpdate },
    { name: "onServerChange", value: onServerChange }
  ];
  functionProperties.forEach(({ name, value }) => {
    if (value && typeof value === "function") {
      functionProps.push(`"${name}": ${value.toString()}`);
    }
  });
  const configString = JSON.stringify(restConfig, null, 2).split(`
`).map((line, index) => index === 0 ? line : "      " + line).join(`
`).replace(/\s*}$/, "");
  const functionPropsString = functionProps.length ? `,
        ${functionProps.join(`,
        `)}
      }` : "}";
  return `
    <!-- Load the Script -->
    <script src="${cdn ?? "https://cdn.jsdelivr.net/npm/@scalar/api-reference"}"></script>

    <!-- Initialize the Scalar API Reference -->
    <script type="text/javascript">
      Scalar.createApiReference('#app', ${configString}${functionPropsString})
    </script>`;
}
var getConfiguration = (givenConfiguration) => {
  const configuration = {
    ...givenConfiguration
  };
  if (typeof configuration.content === "function") {
    configuration.content = configuration.content();
  }
  if (configuration.content && configuration.url) {
    delete configuration.content;
  }
  return configuration;
};
// node_modules/@scalar/hono-api-reference/dist/honoApiReference.js
var DEFAULT_CONFIGURATION = {
  _integration: "hono"
};
var customTheme = `
.light-mode {
  color-scheme: light;
  --scalar-color-1: #2a2f45;
  --scalar-color-2: #757575;
  --scalar-color-3: #8e8e8e;
  --scalar-color-disabled: #b4b1b1;
  --scalar-color-ghost: #a7a7a7;
  --scalar-color-accent: #0099ff;
  --scalar-background-1: #fff;
  --scalar-background-2: #f6f6f6;
  --scalar-background-3: #e7e7e7;
  --scalar-background-4: rgba(0, 0, 0, 0.06);
  --scalar-background-accent: #8ab4f81f;

  --scalar-border-color: rgba(0, 0, 0, 0.1);
  --scalar-scrollbar-color: rgba(0, 0, 0, 0.18);
  --scalar-scrollbar-color-active: rgba(0, 0, 0, 0.36);
  --scalar-lifted-brightness: 1;
  --scalar-backdrop-brightness: 1;

  --scalar-shadow-1: 0 1px 3px 0 rgba(0, 0, 0, 0.11);
  --scalar-shadow-2: rgba(0, 0, 0, 0.08) 0px 13px 20px 0px,
    rgba(0, 0, 0, 0.08) 0px 3px 8px 0px, #eeeeed 0px 0 0 1px;

  --scalar-button-1: rgb(49 53 56);
  --scalar-button-1-color: #fff;
  --scalar-button-1-hover: rgb(28 31 33);

  --scalar-color-green: #069061;
  --scalar-color-red: #ef0006;
  --scalar-color-yellow: #edbe20;
  --scalar-color-blue: #0082d0;
  --scalar-color-orange: #fb892c;
  --scalar-color-purple: #5203d1;
}

.dark-mode {
  color-scheme: dark;
  --scalar-color-1: rgba(255, 255, 245, .86);
  --scalar-color-2: rgba(255, 255, 245, .6);
  --scalar-color-3: rgba(255, 255, 245, .38);
  --scalar-color-disabled: rgba(255, 255, 245, .25);
  --scalar-color-ghost: rgba(255, 255, 245, .25);
  --scalar-color-accent: #e36002;
  --scalar-background-1: #1e1e20;
  --scalar-background-2: #2a2a2a;
  --scalar-background-3: #505053;
  --scalar-background-4: rgba(255, 255, 255, 0.06);
  --scalar-background-accent: #e360021f;

  --scalar-border-color: rgba(255, 255, 255, 0.1);
  --scalar-scrollbar-color: rgba(255, 255, 255, 0.24);
  --scalar-scrollbar-color-active: rgba(255, 255, 255, 0.48);
  --scalar-lifted-brightness: 1.45;
  --scalar-backdrop-brightness: 0.5;

  --scalar-shadow-1: 0 1px 3px 0 rgb(0, 0, 0, 0.1);
  --scalar-shadow-2: rgba(15, 15, 15, 0.2) 0px 3px 6px,
    rgba(15, 15, 15, 0.4) 0px 9px 24px, 0 0 0 1px rgba(255, 255, 255, 0.1);

  --scalar-button-1: #f6f6f6;
  --scalar-button-1-color: #000;
  --scalar-button-1-hover: #e7e7e7;

  --scalar-color-green: #3dd68c;
  --scalar-color-red: #f66f81;
  --scalar-color-yellow: #f9b44e;
  --scalar-color-blue: #5c73e7;
  --scalar-color-orange: #ff8d4d;
  --scalar-color-purple: #b191f9;
}
/* Sidebar */
.light-mode .t-doc__sidebar {
  --scalar-sidebar-background-1: var(--scalar-background-1);
  --scalar-sidebar-item-hover-color: currentColor;
  --scalar-sidebar-item-hover-background: var(--scalar-background-2);
  --scalar-sidebar-item-active-background: var(--scalar-background-accent);
  --scalar-sidebar-border-color: var(--scalar-border-color);
  --scalar-sidebar-color-1: var(--scalar-color-1);
  --scalar-sidebar-color-2: var(--scalar-color-2);
  --scalar-sidebar-color-active: var(--scalar-color-accent);
  --scalar-sidebar-search-background: var(--scalar-background-2);
  --scalar-sidebar-search-border-color: var(--scalar-sidebar-border-color);
  --scalar-sidebar-search-color: var(--scalar-color-3);
}

.dark-mode .sidebar {
  --scalar-sidebar-background-1: #161618;
  --scalar-sidebar-item-hover-color: var(--scalar-color-accent);
  --scalar-sidebar-item-hover-background: transparent;
  --scalar-sidebar-item-active-background: transparent;
  --scalar-sidebar-border-color: transparent;
  --scalar-sidebar-color-1: var(--scalar-color-1);
  --scalar-sidebar-color-2: var(--scalar-color-2);
  --scalar-sidebar-color-active: var(--scalar-color-accent);
  --scalar-sidebar-search-background: #252529;
  --scalar-sidebar-search-border-color: transparent;
  --scalar-sidebar-search-color: var(--scalar-color-3);
}
`;
var apiReference = (givenConfiguration) => {
  const configuration = {
    ...DEFAULT_CONFIGURATION,
    ...givenConfiguration
  };
  return async (c) => c.html(`${getHtmlDocument(configuration, customTheme)}`);
};
// node_modules/hono/dist/middleware/cors/index.js
var cors = (options) => {
  const opts = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: [],
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        if (opts.credentials) {
          return (origin) => origin || null;
        }
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return optsAllowMethods;
    } else if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    } else {
      return () => [];
    }
  })(opts.allowMethods);
  return async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*" || opts.credentials) {
        set("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*" || opts.credentials) {
      c.header("Vary", "Origin", { append: true });
    }
  };
};

// node_modules/hono/dist/utils/color.js
function getColorEnabled() {
  const { process: process2, Deno } = globalThis;
  const isNoColor = typeof Deno?.noColor === "boolean" ? Deno.noColor : process2 !== undefined ? "NO_COLOR" in process2?.env : false;
  return !isNoColor;
}
async function getColorEnabledAsync() {
  const { navigator: navigator2 } = globalThis;
  const cfWorkers = "cloudflare:workers";
  const isNoColor = navigator2 !== undefined && navigator2.userAgent === "Cloudflare-Workers" ? await (async () => {
    try {
      return "NO_COLOR" in ((await import(cfWorkers)).env ?? {});
    } catch {
      return false;
    }
  })() : !getColorEnabled();
  return !isNoColor;
}

// node_modules/hono/dist/middleware/logger/index.js
var humanize = (times) => {
  const [delimiter, separator] = [",", "."];
  const orderTimes = times.map((v) => v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter));
  return orderTimes.join(separator);
};
var time = (start) => {
  const delta = Date.now() - start;
  return humanize([delta < 1000 ? delta + "ms" : Math.round(delta / 1000) + "s"]);
};
var colorStatus = async (status) => {
  const colorEnabled = await getColorEnabledAsync();
  if (colorEnabled) {
    switch (status / 100 | 0) {
      case 5:
        return `\x1B[31m${status}\x1B[0m`;
      case 4:
        return `\x1B[33m${status}\x1B[0m`;
      case 3:
        return `\x1B[36m${status}\x1B[0m`;
      case 2:
        return `\x1B[32m${status}\x1B[0m`;
    }
  }
  return `${status}`;
};
async function log(fn, prefix, method, path, status = 0, elapsed) {
  const out = prefix === "<--" ? `${prefix} ${method} ${path}` : `${prefix} ${method} ${path} ${await colorStatus(status)} ${elapsed}`;
  fn(out);
}
var logger = (fn = console.log) => {
  return async function logger2(c, next) {
    const { method, url } = c.req;
    const path = url.slice(url.indexOf("/", 8));
    await log(fn, "<--", method, path);
    const start = Date.now();
    await next();
    await log(fn, "-->", method, path, c.res.status, time(start));
  };
};

// node_modules/hono/dist/middleware/pretty-json/index.js
var prettyJSON = (options) => {
  const targetQuery = options?.query ?? "pretty";
  return async function prettyJSON2(c, next) {
    const pretty = options?.force || c.req.query(targetQuery) || c.req.query(targetQuery) === "";
    await next();
    if (pretty && c.res.headers.get("Content-Type")?.startsWith("application/json")) {
      const obj = await c.res.json();
      c.res = new Response(JSON.stringify(obj, null, options?.space ?? 2), c.res);
    }
  };
};

// node_modules/hono/dist/jsx/constants.js
var DOM_RENDERER = /* @__PURE__ */ Symbol("RENDERER");
var DOM_ERROR_HANDLER = /* @__PURE__ */ Symbol("ERROR_HANDLER");
var DOM_INTERNAL_TAG = /* @__PURE__ */ Symbol("INTERNAL");
var PERMALINK = /* @__PURE__ */ Symbol("PERMALINK");

// node_modules/hono/dist/jsx/dom/utils.js
var setInternalTagFlag = (fn) => {
  fn[DOM_INTERNAL_TAG] = true;
  return fn;
};

// node_modules/hono/dist/jsx/dom/context.js
var createContextProviderFunction = (values) => ({ value, children }) => {
  if (!children) {
    return;
  }
  const props = {
    children: [
      {
        tag: setInternalTagFlag(() => {
          values.push(value);
        }),
        props: {}
      }
    ]
  };
  if (Array.isArray(children)) {
    props.children.push(...children.flat());
  } else {
    props.children.push(children);
  }
  props.children.push({
    tag: setInternalTagFlag(() => {
      values.pop();
    }),
    props: {}
  });
  const res = { tag: "", props, type: "" };
  res[DOM_ERROR_HANDLER] = (err) => {
    values.pop();
    throw err;
  };
  return res;
};

// node_modules/hono/dist/jsx/context.js
var globalContexts = [];
var createContext = (defaultValue) => {
  const values = [defaultValue];
  const context = (props) => {
    values.push(props.value);
    let string;
    try {
      string = props.children ? (Array.isArray(props.children) ? new JSXFragmentNode("", {}, props.children) : props.children).toString() : "";
    } catch (e) {
      values.pop();
      throw e;
    }
    if (string instanceof Promise) {
      return string.finally(() => values.pop()).then((resString) => raw(resString, resString.callbacks));
    } else {
      values.pop();
      return raw(string);
    }
  };
  context.values = values;
  context.Provider = context;
  context[DOM_RENDERER] = createContextProviderFunction(values);
  globalContexts.push(context);
  return context;
};
var useContext = (context) => {
  return context.values.at(-1);
};

// node_modules/hono/dist/jsx/intrinsic-element/common.js
var deDupeKeyMap = {
  title: [],
  script: ["src"],
  style: ["data-href"],
  link: ["href"],
  meta: ["name", "httpEquiv", "charset", "itemProp"]
};
var domRenderers = {};
var dataPrecedenceAttr = "data-precedence";
var isStylesheetLinkWithPrecedence = (props) => props.rel === "stylesheet" && ("precedence" in props);
var shouldDeDupeByKey = (tagName, supportSort) => {
  if (tagName === "link") {
    return supportSort;
  }
  return deDupeKeyMap[tagName].length > 0;
};

// node_modules/hono/dist/jsx/intrinsic-element/components.js
var exports_components = {};
__export(exports_components, {
  title: () => title,
  style: () => style,
  script: () => script,
  meta: () => meta,
  link: () => link,
  input: () => input,
  form: () => form,
  button: () => button
});

// node_modules/hono/dist/jsx/children.js
var toArray = (children) => Array.isArray(children) ? children : [children];

// node_modules/hono/dist/jsx/intrinsic-element/components.js
var metaTagMap = /* @__PURE__ */ new WeakMap;
var insertIntoHead = (tagName, tag, props, precedence) => ({ buffer, context }) => {
  if (!buffer) {
    return;
  }
  const map = metaTagMap.get(context) || {};
  metaTagMap.set(context, map);
  const tags = map[tagName] ||= [];
  let duped = false;
  const deDupeKeys = deDupeKeyMap[tagName];
  const deDupeByKey = shouldDeDupeByKey(tagName, precedence !== undefined);
  if (deDupeByKey) {
    LOOP:
      for (const [, tagProps] of tags) {
        if (tagName === "link" && !(tagProps.rel === "stylesheet" && tagProps[dataPrecedenceAttr] !== undefined)) {
          continue;
        }
        for (const key of deDupeKeys) {
          if ((tagProps?.[key] ?? null) === props?.[key]) {
            duped = true;
            break LOOP;
          }
        }
      }
  }
  if (duped) {
    buffer[0] = buffer[0].replaceAll(tag, "");
  } else if (deDupeByKey || tagName === "link") {
    tags.push([tag, props, precedence]);
  } else {
    tags.unshift([tag, props, precedence]);
  }
  if (buffer[0].indexOf("</head>") !== -1) {
    let insertTags;
    if (tagName === "link" || precedence !== undefined) {
      const precedences = [];
      insertTags = tags.map(([tag2, , tagPrecedence], index) => {
        if (tagPrecedence === undefined) {
          return [tag2, Number.MAX_SAFE_INTEGER, index];
        }
        let order = precedences.indexOf(tagPrecedence);
        if (order === -1) {
          precedences.push(tagPrecedence);
          order = precedences.length - 1;
        }
        return [tag2, order, index];
      }).sort((a, b) => a[1] - b[1] || a[2] - b[2]).map(([tag2]) => tag2);
    } else {
      insertTags = tags.map(([tag2]) => tag2);
    }
    insertTags.forEach((tag2) => {
      buffer[0] = buffer[0].replaceAll(tag2, "");
    });
    buffer[0] = buffer[0].replace(/(?=<\/head>)/, insertTags.join(""));
  }
};
var returnWithoutSpecialBehavior = (tag, children, props) => raw(new JSXNode(tag, props, toArray(children ?? [])).toString());
var documentMetadataTag = (tag, children, props, sort) => {
  if ("itemProp" in props) {
    return returnWithoutSpecialBehavior(tag, children, props);
  }
  let { precedence, blocking, ...restProps } = props;
  precedence = sort ? precedence ?? "" : undefined;
  if (sort) {
    restProps[dataPrecedenceAttr] = precedence;
  }
  const string = new JSXNode(tag, restProps, toArray(children || [])).toString();
  if (string instanceof Promise) {
    return string.then((resString) => raw(string, [
      ...resString.callbacks || [],
      insertIntoHead(tag, resString, restProps, precedence)
    ]));
  } else {
    return raw(string, [insertIntoHead(tag, string, restProps, precedence)]);
  }
};
var title = ({ children, ...props }) => {
  const nameSpaceContext = getNameSpaceContext();
  if (nameSpaceContext) {
    const context = useContext(nameSpaceContext);
    if (context === "svg" || context === "head") {
      return new JSXNode("title", props, toArray(children ?? []));
    }
  }
  return documentMetadataTag("title", children, props, false);
};
var script = ({
  children,
  ...props
}) => {
  const nameSpaceContext = getNameSpaceContext();
  if (["src", "async"].some((k) => !props[k]) || nameSpaceContext && useContext(nameSpaceContext) === "head") {
    return returnWithoutSpecialBehavior("script", children, props);
  }
  return documentMetadataTag("script", children, props, false);
};
var style = ({
  children,
  ...props
}) => {
  if (!["href", "precedence"].every((k) => (k in props))) {
    return returnWithoutSpecialBehavior("style", children, props);
  }
  props["data-href"] = props.href;
  delete props.href;
  return documentMetadataTag("style", children, props, true);
};
var link = ({ children, ...props }) => {
  if (["onLoad", "onError"].some((k) => (k in props)) || props.rel === "stylesheet" && (!("precedence" in props) || ("disabled" in props))) {
    return returnWithoutSpecialBehavior("link", children, props);
  }
  return documentMetadataTag("link", children, props, isStylesheetLinkWithPrecedence(props));
};
var meta = ({ children, ...props }) => {
  const nameSpaceContext = getNameSpaceContext();
  if (nameSpaceContext && useContext(nameSpaceContext) === "head") {
    return returnWithoutSpecialBehavior("meta", children, props);
  }
  return documentMetadataTag("meta", children, props, false);
};
var newJSXNode = (tag, { children, ...props }) => new JSXNode(tag, props, toArray(children ?? []));
var form = (props) => {
  if (typeof props.action === "function") {
    props.action = PERMALINK in props.action ? props.action[PERMALINK] : undefined;
  }
  return newJSXNode("form", props);
};
var formActionableElement = (tag, props) => {
  if (typeof props.formAction === "function") {
    props.formAction = PERMALINK in props.formAction ? props.formAction[PERMALINK] : undefined;
  }
  return newJSXNode(tag, props);
};
var input = (props) => formActionableElement("input", props);
var button = (props) => formActionableElement("button", props);

// node_modules/hono/dist/jsx/utils.js
var normalizeElementKeyMap = /* @__PURE__ */ new Map([
  ["className", "class"],
  ["htmlFor", "for"],
  ["crossOrigin", "crossorigin"],
  ["httpEquiv", "http-equiv"],
  ["itemProp", "itemprop"],
  ["fetchPriority", "fetchpriority"],
  ["noModule", "nomodule"],
  ["formAction", "formaction"]
]);
var normalizeIntrinsicElementKey = (key) => normalizeElementKeyMap.get(key) || key;
var invalidAttributeNameCharRe = /[\s"'<>/=`\\\x00-\x1f\x7f-\x9f]/;
var validAttributeNameCache = /* @__PURE__ */ new Set;
var validAttributeNameCacheMax = 1024;
var invalidTagNameCharRe = /^[!?]|[\s"'<>/=`\\\x00-\x1f\x7f-\x9f]/;
var validTagNameCache = /* @__PURE__ */ new Set;
var validTagNameCacheMax = 256;
var cacheValidName = (cache, max, name) => {
  if (cache.size >= max) {
    cache.clear();
  }
  cache.add(name);
};
var isValidTagName = (name) => {
  if (validTagNameCache.has(name)) {
    return true;
  }
  if (typeof name !== "string") {
    return false;
  }
  if (name.length === 0) {
    return true;
  }
  if (invalidTagNameCharRe.test(name)) {
    return false;
  }
  cacheValidName(validTagNameCache, validTagNameCacheMax, name);
  return true;
};
var isValidAttributeName = (name) => {
  if (validAttributeNameCache.has(name)) {
    return true;
  }
  const len = name.length;
  if (len === 0) {
    return false;
  }
  for (let i = 0;i < len; i++) {
    const c = name.charCodeAt(i);
    if (!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c === 45 || c === 95 || c === 46 || c === 58)) {
      if (!invalidAttributeNameCharRe.test(name)) {
        cacheValidName(validAttributeNameCache, validAttributeNameCacheMax, name);
        return true;
      } else {
        return false;
      }
    }
  }
  cacheValidName(validAttributeNameCache, validAttributeNameCacheMax, name);
  return true;
};
var invalidStylePropertyNameCharRe = /[\s"'():;\\/\[\]{}\x00-\x1f\x7f-\x9f]/;
var validStylePropertyNameCache = /* @__PURE__ */ new Set;
var validStylePropertyNameCacheMax = 1024;
var isValidStylePropertyName = (name) => {
  if (validStylePropertyNameCache.has(name)) {
    return true;
  }
  const len = name.length;
  if (len === 0) {
    return false;
  }
  for (let i = 0;i < len; i++) {
    const c = name.charCodeAt(i);
    if (!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c === 45 || c === 95)) {
      if (!invalidStylePropertyNameCharRe.test(name)) {
        cacheValidName(validStylePropertyNameCache, validStylePropertyNameCacheMax, name);
        return true;
      } else {
        return false;
      }
    }
  }
  cacheValidName(validStylePropertyNameCache, validStylePropertyNameCacheMax, name);
  return true;
};
var unsafeStyleValueCharRe = /[;"'\\/\[\](){}]/;
var hasUnsafeStyleValue = (value) => {
  if (!unsafeStyleValueCharRe.test(value)) {
    return false;
  }
  let quote = 0;
  const blockStack = [];
  for (let i = 0, len = value.length;i < len; i++) {
    const c = value.charCodeAt(i);
    if (c === 92) {
      if (i === len - 1) {
        return true;
      }
      i++;
    } else if (quote !== 0) {
      if (c === 10 || c === 12 || c === 13) {
        return true;
      }
      if (c === quote) {
        quote = 0;
      }
    } else if (c === 47 && value.charCodeAt(i + 1) === 42) {
      const end = value.indexOf("*/", i + 2);
      if (end === -1) {
        return true;
      }
      i = end + 1;
    } else if (c === 34 || c === 39) {
      quote = c;
    } else if (c === 40) {
      blockStack.push(41);
    } else if (c === 91) {
      blockStack.push(93);
    } else if (c === 123 || c === 125) {
      return true;
    } else if (c === 41 || c === 93) {
      if (blockStack[blockStack.length - 1] !== c) {
        return true;
      }
      blockStack.pop();
    } else if (c === 59 && blockStack.length === 0) {
      return true;
    }
  }
  return quote !== 0 || blockStack.length !== 0;
};
var styleObjectForEach = (style2, fn) => {
  for (const [k, v] of Object.entries(style2)) {
    const key = k[0] === "-" || !/[A-Z]/.test(k) ? k : k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
    if (!isValidStylePropertyName(key)) {
      continue;
    }
    if (v == null) {
      fn(key, null);
      continue;
    }
    let value;
    if (typeof v === "number") {
      value = !key.match(/^(?:a|border-im|column(?:-c|s)|flex(?:$|-[^b])|grid-(?:ar|[^a])|font-w|li|or|sca|st|ta|wido|z)|ty$/) ? `${v}px` : `${v}`;
    } else if (typeof v === "string") {
      if (hasUnsafeStyleValue(v)) {
        continue;
      }
      value = v;
    } else {
      continue;
    }
    fn(key, value);
  }
};

// node_modules/hono/dist/jsx/base.js
var nameSpaceContext = undefined;
var getNameSpaceContext = () => nameSpaceContext;
var toSVGAttributeName = (key) => /[A-Z]/.test(key) && key.match(/^(?:al|basel|clip(?:Path|Rule)$|co|do|fill|fl|fo|gl|let|lig|i|marker[EMS]|o|pai|pointe|sh|st[or]|text[^L]|tr|u|ve|w)/) ? key.replace(/([A-Z])/g, "-$1").toLowerCase() : key;
var emptyTags = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];
var booleanAttributes = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "download",
  "formnovalidate",
  "hidden",
  "inert",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
];
var childrenToStringToBuffer = (children, buffer) => {
  for (let i = 0, len = children.length;i < len; i++) {
    const child = children[i];
    if (typeof child === "string") {
      escapeToBuffer(child, buffer);
    } else if (typeof child === "boolean" || child === null || child === undefined) {
      continue;
    } else if (child instanceof JSXNode) {
      child.toStringToBuffer(buffer);
    } else if (typeof child === "number" || child.isEscaped) {
      buffer[0] += child;
    } else if (child instanceof Promise) {
      buffer.unshift("", child);
    } else {
      childrenToStringToBuffer(child, buffer);
    }
  }
};
var JSXNode = class {
  tag;
  props;
  key;
  children;
  isEscaped = true;
  localContexts;
  constructor(tag, props, children) {
    if (typeof tag !== "function" && !isValidTagName(tag)) {
      throw new Error(`Invalid JSX tag name: ${tag}`);
    }
    this.tag = tag;
    this.props = props;
    this.children = children;
  }
  get type() {
    return this.tag;
  }
  get ref() {
    return this.props.ref || null;
  }
  toString() {
    const buffer = [""];
    this.localContexts?.forEach(([context, value]) => {
      context.values.push(value);
    });
    try {
      this.toStringToBuffer(buffer);
    } finally {
      this.localContexts?.forEach(([context]) => {
        context.values.pop();
      });
    }
    return buffer.length === 1 ? "callbacks" in buffer ? resolveCallbackSync(raw(buffer[0], buffer.callbacks)).toString() : buffer[0] : stringBufferToString(buffer, buffer.callbacks);
  }
  toStringToBuffer(buffer) {
    const tag = this.tag;
    const props = this.props;
    let { children } = this;
    buffer[0] += `<${tag}`;
    const normalizeKey = tag === "svg" || nameSpaceContext && useContext(nameSpaceContext) === "svg" ? (key) => toSVGAttributeName(normalizeIntrinsicElementKey(key)) : (key) => normalizeIntrinsicElementKey(key);
    for (let [key, v] of Object.entries(props)) {
      key = normalizeKey(key);
      if (!isValidAttributeName(key)) {
        continue;
      }
      if (key === "children") {} else if (key === "style" && typeof v === "object") {
        let styleStr = "";
        styleObjectForEach(v, (property, value) => {
          if (value != null) {
            styleStr += `${styleStr ? ";" : ""}${property}:${value}`;
          }
        });
        buffer[0] += ' style="';
        escapeToBuffer(styleStr, buffer);
        buffer[0] += '"';
      } else if (typeof v === "string") {
        buffer[0] += ` ${key}="`;
        escapeToBuffer(v, buffer);
        buffer[0] += '"';
      } else if (v === null || v === undefined) {} else if (typeof v === "number" || v.isEscaped) {
        buffer[0] += ` ${key}="${v}"`;
      } else if (typeof v === "boolean" && booleanAttributes.includes(key)) {
        if (v) {
          buffer[0] += ` ${key}=""`;
        }
      } else if (key === "dangerouslySetInnerHTML") {
        if (children.length > 0) {
          throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
        }
        children = [raw(v.__html)];
      } else if (v instanceof Promise) {
        buffer[0] += ` ${key}="`;
        buffer.unshift('"', v);
      } else if (typeof v === "function") {
        if (!key.startsWith("on") && key !== "ref") {
          throw new Error(`Invalid prop '${key}' of type 'function' supplied to '${tag}'.`);
        }
      } else {
        buffer[0] += ` ${key}="`;
        escapeToBuffer(v.toString(), buffer);
        buffer[0] += '"';
      }
    }
    if (emptyTags.includes(tag) && children.length === 0) {
      buffer[0] += "/>";
      return;
    }
    buffer[0] += ">";
    childrenToStringToBuffer(children, buffer);
    buffer[0] += `</${tag}>`;
  }
};
var JSXFunctionNode = class extends JSXNode {
  toStringToBuffer(buffer) {
    const { children } = this;
    const props = { ...this.props };
    if (children.length) {
      props.children = children.length === 1 ? children[0] : children;
    }
    const res = this.tag.call(null, props);
    if (typeof res === "boolean" || res == null) {
      return;
    } else if (res instanceof Promise) {
      if (globalContexts.length === 0) {
        buffer.unshift("", res);
      } else {
        const currentContexts = globalContexts.map((c) => [c, c.values.at(-1)]);
        buffer.unshift("", res.then((childRes) => {
          if (childRes instanceof JSXNode) {
            childRes.localContexts = currentContexts;
          }
          return childRes;
        }));
      }
    } else if (res instanceof JSXNode) {
      res.toStringToBuffer(buffer);
    } else if (typeof res === "number" || res.isEscaped) {
      buffer[0] += res;
      if (res.callbacks) {
        buffer.callbacks ||= [];
        buffer.callbacks.push(...res.callbacks);
      }
    } else {
      escapeToBuffer(res, buffer);
    }
  }
};
var JSXFragmentNode = class extends JSXNode {
  toStringToBuffer(buffer) {
    childrenToStringToBuffer(this.children, buffer);
  }
};
var initDomRenderer = false;
var jsxFn = (tag, props, children) => {
  if (!initDomRenderer) {
    for (const k in domRenderers) {
      exports_components[k][DOM_RENDERER] = domRenderers[k];
    }
    initDomRenderer = true;
  }
  if (typeof tag === "function") {
    return new JSXFunctionNode(tag, props, children);
  } else if (exports_components[tag]) {
    return new JSXFunctionNode(exports_components[tag], props, children);
  } else if (tag === "svg" || tag === "head") {
    nameSpaceContext ||= createContext("");
    return new JSXNode(tag, props, [
      new JSXFunctionNode(nameSpaceContext, {
        value: tag
      }, children)
    ]);
  } else {
    return new JSXNode(tag, props, children);
  }
};
var Fragment = ({
  children
}) => {
  return new JSXFragmentNode("", {
    children
  }, Array.isArray(children) ? children : children ? [children] : []);
};

// node_modules/hono/dist/jsx/jsx-dev-runtime.js
function jsxDEV(tag, props, key) {
  let node;
  if (!props || !("children" in props)) {
    node = jsxFn(tag, props, []);
  } else {
    const children = props.children;
    node = Array.isArray(children) ? jsxFn(tag, props, children) : jsxFn(tag, props, [children]);
  }
  node.key = key;
  return node;
}

// src/pages/home.tsx
var Home = new Hono2;
var Meteors = ({ number }) => {
  return /* @__PURE__ */ jsxDEV(Fragment, {
    children: Array.from({ length: number || 20 }, (_, idx) => /* @__PURE__ */ jsxDEV("span", {
      class: "meteor animate-[meteorAnimation_3s_linear_infinite] absolute h-1 w-1 rounded-[9999px] shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
      style: {
        top: 0,
        left: `${Math.floor(Math.random() * (400 - -400) + -400)}px`,
        animationDelay: `${Math.random() * (0.8 - 0.2) + 0.2}s`,
        animationDuration: `${Math.floor(Math.random() * (10 - 2) + 2)}s`
      }
    }, idx, false, undefined, this))
  }, undefined, false, undefined, this);
};
Home.get("/", (c) => {
  const title2 = "Mavrixfy API";
  const description = "Mavrixfy API is a powerful music streaming platform built with TypeScript, providing programmatic access to a vast library of songs, albums, artists, playlists, and more.";
  return c.html(/* @__PURE__ */ jsxDEV("html", {
    children: [
      /* @__PURE__ */ jsxDEV("head", {
        children: [
          /* @__PURE__ */ jsxDEV("title", {
            children: "Mavrixfy API"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV("meta", {
            name: "viewport",
            content: "width=device-width, initial-scale=1"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV("meta", {
            charset: "utf-8"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV("meta", {
            name: "description",
            content: description
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV("meta", {
            property: "og:type",
            content: "website"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV("meta", {
            property: "og:url",
            content: "https://mavrixfy.site/"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV("meta", {
            property: "og:title",
            content: title2
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV("meta", {
            property: "og:description",
            content: description
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV("meta", {
            property: "twitter:card",
            content: "summary_large_image"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV("meta", {
            property: "twitter:url",
            content: "https://mavrixfy.site/"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV("meta", {
            property: "twitter:title",
            content: title2
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV("meta", {
            property: "twitter:description",
            content: description
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV("meta", {
            property: "og:image",
            content: "https://raw.githubusercontent.com/sumitkolhe/jiosaavn-api/main/assets/preview.jpg"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV("meta", {
            property: "twitter:image",
            content: "https://raw.githubusercontent.com/sumitkolhe/jiosaavn-api/main/assets/preview.jpg"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV("link", {
            rel: "icon",
            type: "image/x-icon",
            href: "https://raw.githubusercontent.com/sumitkolhe/jiosaavn-api/main/assets/favicon.ico"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV("link", {
            rel: "preconnect",
            href: "https://fonts.googleapis.com"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV("link", {
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossorigin: "anonymous"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV("link", {
            href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap",
            rel: "stylesheet"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV("script", {
            src: "https://cdn.tailwindcss.com"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV("style", {
            dangerouslySetInnerHTML: {
              __html: `
            * { font-family: 'Inter', sans-serif; } 
            @keyframes borderAnimation {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
            @keyframes meteorAnimation {
              0% { transform: rotate(215deg) translateX(0); opacity: 1; }
              70% { opacity: 1; }
              100% { transform: rotate(215deg) translateX(-500px); opacity: 0; }
            }
            .meteor::before {
              content: '';
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              width: 50px;
              height: 1px;
              background: linear-gradient(90deg, #64748b, transparent);
            }
            .animate-meteor-effect {
              animation-name: meteorAnimation;
            }`
            }
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsxDEV("body", {
        class: "bg-black mx-auto md:min-h-screen max-w-screen-lg flex flex-col",
        children: /* @__PURE__ */ jsxDEV("main", {
          class: "mx-auto my-auto flex flex-col space-y-8 px-4 pb-8 md:py-10 relative overflow-y-hidden overflow-x-hidden",
          children: [
            /* @__PURE__ */ jsxDEV(Meteors, {
              number: 15
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV("div", {
              class: "flex flex-row items-center space-x-4 ml-6",
              children: [
                /* @__PURE__ */ jsxDEV("svg", {
                  class: "sm:h-12 sm:w-12 h-8 w-8 shrink-0",
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 24 24",
                  children: [
                    /* @__PURE__ */ jsxDEV("path", {
                      fill: "#ff7d78",
                      d: "M3.172 3.464C2 4.93 2 7.286 2 12c0 4.714 0 7.071 1.172 8.535C4.343 22 6.229 22 10 22h3.376A4.25 4.25 0 0 1 17 16.007V12.25a2.25 2.25 0 0 1 4.5 0a.75.75 0 0 0 .5.707V12c0-4.714 0-7.071-1.172-8.536C19.657 2 17.771 2 14 2h-4C6.229 2 4.343 2 3.172 3.464",
                      opacity: ".5"
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsxDEV("path", {
                      fill: "#ff7d78",
                      "fill-rule": "evenodd",
                      d: "M8.25 12a3.75 3.75 0 1 1 7.5 0a3.75 3.75 0 0 1-7.5 0m11-.5a.75.75 0 0 1 .75.75a2.25 2.25 0 0 0 2.25 2.25a.75.75 0 0 1 0 1.5a3.734 3.734 0 0 1-2.25-.75v5a2.75 2.75 0 1 1-1.5-2.45v-5.55a.75.75 0 0 1 .75-.75m-.75 8.75a1.25 1.25 0 1 0-2.5 0a1.25 1.25 0 0 0 2.5 0",
                      "clip-rule": "evenodd"
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                /* @__PURE__ */ jsxDEV("p", {
                  class: "text-2xl md:text-4xl text-transparent font-bold leading-none bg-clip-text bg-gradient-to-r from-[#ff7d78] to-purple-600",
                  children: [
                    "Mavrixfy API",
                    /* @__PURE__ */ jsxDEV("span", {
                      class: "uppercase text-sm ml-3 text-gray-500 font-normal sm:hidden",
                      children: "Music Platform"
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                /* @__PURE__ */ jsxDEV("p", {
                  class: "hidden sm:block animate-[borderAnimation_3s_linear_infinite] rounded bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:400%_400%] p-1",
                  children: /* @__PURE__ */ jsxDEV("span", {
                    class: "block rounded px-1.5 py-0.5 text-xs text-white uppercase tracking-wider",
                    children: "Music Platform"
                  }, undefined, false, undefined, this)
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this),
            /* @__PURE__ */ jsxDEV("div", {
              class: "grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-2 sm:gap-0 relative grid-flow-row",
              children: [
                /* @__PURE__ */ jsxDEV("a", {
                  target: "_blank",
                  class: "p-4 sm:p-8 hover:bg-opacity-5 hover:bg-white rounded-lg duration-100 sm:col-span-4",
                  href: "/docs",
                  children: /* @__PURE__ */ jsxDEV("div", {
                    class: "flex flex-col",
                    children: [
                      /* @__PURE__ */ jsxDEV("span", {
                        class: "text-xs uppercase bg-opacity-15 rounded text-center max-w-fit px-2 py-1 font-bold tracking-wide bg-red-500 text-red-500",
                        children: "Get Started"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsxDEV("span", {
                        class: "text-neutral-200 font-bold text-lg sm:text-xl md:text-2xl mt-2",
                        children: "Explore the Docs"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsxDEV("div", {
                        class: "text-neutral-500 mt-2",
                        children: "Check out the documentation to learn how to use the Mavrixfy API."
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this)
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV("a", {
                  target: "_blank",
                  class: "p-4 sm:p-8 hover:bg-opacity-5 hover:bg-white rounded-lg duration-100 sm:col-span-4",
                  href: "https://github.com/sumitkolhe/jiosaavn-api",
                  children: /* @__PURE__ */ jsxDEV("div", {
                    class: "flex flex-col",
                    children: [
                      /* @__PURE__ */ jsxDEV("span", {
                        class: "text-xs uppercase bg-opacity-15 rounded text-center max-w-fit px-2 py-1 font-bold tracking-wide bg-green-500 text-green-500",
                        children: "Open Source"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsxDEV("span", {
                        class: "text-neutral-200 font-bold text-lg sm:text-xl md:text-2xl mt-2",
                        children: "Open Source"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsxDEV("div", {
                        class: "text-neutral-500 mt-2",
                        children: "Mavrixfy API is open-source. Check out the source code on github."
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this)
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV("a", {
                  target: "_blank",
                  class: "p-4 sm:p-8 hover:bg-opacity-5 hover:bg-white rounded-lg duration-100 sm:col-span-4",
                  href: "https://github.com/sumitkolhe/jiosaavn-api/issues",
                  children: /* @__PURE__ */ jsxDEV("div", {
                    class: "flex flex-col",
                    children: [
                      /* @__PURE__ */ jsxDEV("span", {
                        class: "text-xs uppercase bg-opacity-15 rounded text-center max-w-fit px-2 py-1 font-bold tracking-wide bg-violet-500 text-violet-500",
                        children: "Contribute"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsxDEV("span", {
                        class: "text-neutral-200 font-bold text-lg sm:text-xl md:text-2xl mt-2",
                        children: "Get Involved"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsxDEV("div", {
                        class: "text-neutral-500 mt-2",
                        children: "Encounter a bug or have a feature suggestion? Report it on GitHub or contribute by submitting a pull request."
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this)
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV("div", {
                  class: "p-4 sm:p-8 hover:bg-opacity-5 hover:bg-white rounded-lg duration-100 sm:col-span-4",
                  children: /* @__PURE__ */ jsxDEV("div", {
                    class: "flex flex-col",
                    children: [
                      /* @__PURE__ */ jsxDEV("span", {
                        class: "text-xs uppercase bg-opacity-15 rounded text-center max-w-fit px-2 py-1 font-bold tracking-wide bg-blue-500 text-blue-500",
                        children: "Contact"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsxDEV("span", {
                        class: "text-neutral-200 font-bold text-lg sm:text-xl md:text-2xl mt-2",
                        children: "Sumit Kolhe"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsxDEV("div", {
                        class: "text-neutral-500 mt-2",
                        children: [
                          "Have a question or need help? Reach out on",
                          " ",
                          /* @__PURE__ */ jsxDEV("a", {
                            href: "https://github.com/sumitkolhe",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "hover:underline text-indigo-500",
                            children: "GitHub"
                          }, undefined, false, undefined, this),
                          ",",
                          " ",
                          /* @__PURE__ */ jsxDEV("a", {
                            href: "https://twitter.com/thesumitkolhe",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "hover:underline text-sky-500",
                            children: "Twitter"
                          }, undefined, false, undefined, this),
                          ", or",
                          " ",
                          /* @__PURE__ */ jsxDEV("a", {
                            href: "https://t.me/sumitkolhe",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "hover:underline text-pink-500",
                            children: "Telegram."
                          }, undefined, false, undefined, this)
                        ]
                      }, undefined, true, undefined, this)
                    ]
                  }, undefined, true, undefined, this)
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this));
});

// src/app.ts
class App {
  app;
  constructor(routes) {
    this.app = new OpenAPIHono;
    this.initializeGlobalMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwaggerUI();
    this.initializeRouteFallback();
    this.initializeErrorHandler();
  }
  initializeRoutes(routes) {
    routes.forEach((route) => {
      route.initRoutes();
      this.app.route("/api", route.controller);
    });
    this.app.route("/", Home);
  }
  initializeGlobalMiddlewares() {
    this.app.use(logger());
    this.app.use(prettyJSON());
    this.app.use(cors());
  }
  initializeSwaggerUI() {
    this.app.doc31("/swagger", (c) => {
      const { protocol: urlProtocol, hostname, port } = new URL(c.req.url);
      const protocol = c.req.header("x-forwarded-proto") ? `${c.req.header("x-forwarded-proto")}:` : urlProtocol;
      return {
        openapi: "3.1.0",
        info: {
          version: "1.0.0",
          title: "JioSaavn API",
          description: `# Introduction 
        
JioSaavn API, accessible at [saavn.dev](https://saavn.dev), is an unofficial API that allows users to download high-quality songs from [JioSaavn](https://jiosaavn.com). 
        It offers a fast, reliable, and easy-to-use API for developers. 
`
        },
        servers: [{ url: `${protocol}//${hostname}${port ? `:${port}` : ""}`, description: "Current environment" }]
      };
    });
    this.app.get("/docs", apiReference({
      pageTitle: "JioSaavn API Documentation",
      theme: "deepSpace",
      isEditable: false,
      layout: "modern",
      darkMode: true,
      metaData: {
        applicationName: "JioSaavn API",
        author: "Sumit Kolhe",
        creator: "Sumit Kolhe",
        publisher: "Sumit Kolhe",
        robots: "index, follow",
        description: "JioSaavn API is an unofficial wrapper written in TypeScript for jiosaavn.com providing programmatic access to a vast library of songs, albums, artists, playlists, and more."
      },
      url: "/swagger"
    }));
  }
  initializeRouteFallback() {
    this.app.notFound((ctx) => {
      return ctx.json({ success: false, message: "route not found, check docs at https://saavn.dev/docs" }, 404);
    });
  }
  initializeErrorHandler() {
    this.app.onError((err, ctx) => {
      const error = err;
      return ctx.json({ success: false, message: error.message }, error.status || 500);
    });
  }
  getApp() {
    return this.app;
  }
}

// src/common/models/download.model.ts
var DownloadLinkModel = exports_external.object({
  quality: exports_external.string(),
  url: exports_external.string()
});

// src/modules/artists/models/artist-map.model.ts
var ArtistMapAPIResponseModel = exports_external.object({
  id: exports_external.string(),
  name: exports_external.string(),
  role: exports_external.string(),
  type: exports_external.string(),
  image: exports_external.string(),
  perma_url: exports_external.string()
});
var ArtistMapModel = exports_external.object({
  id: exports_external.string(),
  name: exports_external.string(),
  role: exports_external.string(),
  type: exports_external.string(),
  image: exports_external.array(DownloadLinkModel),
  url: exports_external.string()
});

// src/modules/songs/models/song.model.ts
var SongAPIResponseModel = exports_external.object({
  id: exports_external.string(),
  title: exports_external.string(),
  subtitle: exports_external.string(),
  header_desc: exports_external.string(),
  type: exports_external.string(),
  perma_url: exports_external.string(),
  image: exports_external.string(),
  language: exports_external.string(),
  year: exports_external.string(),
  play_count: exports_external.string(),
  explicit_content: exports_external.string(),
  list_count: exports_external.string(),
  list_type: exports_external.string(),
  list: exports_external.string(),
  more_info: exports_external.object({
    music: exports_external.string(),
    album_id: exports_external.string(),
    album: exports_external.string(),
    label: exports_external.string(),
    origin: exports_external.string(),
    is_dolby_content: exports_external.boolean(),
    "320kbps": exports_external.string(),
    encrypted_media_url: exports_external.string(),
    encrypted_cache_url: exports_external.string(),
    album_url: exports_external.string(),
    duration: exports_external.string(),
    rights: exports_external.object({
      code: exports_external.string(),
      cacheable: exports_external.string(),
      delete_cached_object: exports_external.string(),
      reason: exports_external.string()
    }),
    cache_state: exports_external.string(),
    has_lyrics: exports_external.string(),
    lyrics_snippet: exports_external.string(),
    starred: exports_external.string(),
    copyright_text: exports_external.string(),
    artistMap: exports_external.object({
      primary_artists: exports_external.array(ArtistMapAPIResponseModel),
      featured_artists: exports_external.array(ArtistMapAPIResponseModel),
      artists: exports_external.array(ArtistMapAPIResponseModel)
    }),
    release_date: exports_external.string(),
    label_url: exports_external.string(),
    vcode: exports_external.string(),
    vlink: exports_external.string(),
    triller_available: exports_external.boolean(),
    request_jiotune_flag: exports_external.boolean(),
    webp: exports_external.string(),
    lyrics_id: exports_external.string()
  })
});
var SongModel = exports_external.object({
  id: exports_external.string(),
  name: exports_external.string(),
  type: exports_external.string(),
  year: exports_external.string().nullable(),
  releaseDate: exports_external.string().nullable(),
  duration: exports_external.number().nullable(),
  label: exports_external.string().nullable(),
  explicitContent: exports_external.boolean(),
  playCount: exports_external.number().nullable(),
  language: exports_external.string(),
  hasLyrics: exports_external.boolean(),
  lyricsId: exports_external.string().nullable(),
  url: exports_external.string(),
  copyright: exports_external.string().nullable(),
  album: exports_external.object({
    id: exports_external.string().nullable(),
    name: exports_external.string().nullable(),
    url: exports_external.string().nullable()
  }),
  artists: exports_external.object({
    primary: exports_external.array(ArtistMapModel),
    featured: exports_external.array(ArtistMapModel),
    all: exports_external.array(ArtistMapModel)
  }),
  image: exports_external.array(DownloadLinkModel),
  downloadUrl: exports_external.array(DownloadLinkModel)
});

// src/modules/albums/models/album.model.ts
var AlbumAPIResponseModel = exports_external.object({
  id: exports_external.string(),
  title: exports_external.string(),
  subtitle: exports_external.string(),
  header_desc: exports_external.string(),
  type: exports_external.string(),
  perma_url: exports_external.string(),
  image: exports_external.string(),
  language: exports_external.string(),
  year: exports_external.string(),
  play_count: exports_external.string(),
  explicit_content: exports_external.string(),
  list_count: exports_external.string(),
  list_type: exports_external.string(),
  list: exports_external.array(SongAPIResponseModel),
  more_info: exports_external.object({
    artistMap: SongAPIResponseModel.shape.more_info.shape.artistMap,
    song_count: exports_external.string(),
    copyright_text: exports_external.string(),
    is_dolby_content: exports_external.boolean(),
    label_url: exports_external.string()
  })
});
var AlbumModel = exports_external.object({
  id: exports_external.string(),
  name: exports_external.string(),
  description: exports_external.string(),
  year: exports_external.number().nullable(),
  type: exports_external.string(),
  playCount: exports_external.number().nullable(),
  language: exports_external.string(),
  explicitContent: exports_external.boolean(),
  artists: exports_external.object(SongModel.shape.artists.shape),
  songCount: exports_external.number().nullable(),
  url: exports_external.string(),
  image: exports_external.array(DownloadLinkModel),
  songs: exports_external.array(SongModel).nullable()
});

// src/common/constants/endpoint.constant.ts
var Endpoints = {
  search: {
    all: "autocomplete.get",
    songs: "search.getResults",
    albums: "search.getAlbumResults",
    artists: "search.getArtistResults",
    playlists: "search.getPlaylistResults"
  },
  songs: {
    id: "song.getDetails",
    link: "webapi.get",
    suggestions: "webradio.getSong",
    lyrics: "lyrics.getLyrics",
    station: "webradio.createEntityStation"
  },
  albums: {
    id: "content.getAlbumDetails",
    link: "webapi.get"
  },
  artists: {
    id: "artist.getArtistPageDetails",
    link: "webapi.get",
    songs: "artist.getArtistMoreSong",
    albums: "artist.getArtistMoreAlbum"
  },
  playlists: {
    id: "playlist.getDetails",
    link: "webapi.get"
  },
  modules: "content.getBrowseModules",
  trending: "content.getTrending"
};

// src/common/constants/user-agents.constant.ts
var userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0",
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) obsidian/1.8.4 Chrome/130.0.6723.191 Electron/33.3.2 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:136.0) Gecko/20100101 Firefox/136.0",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 OPR/117.0.0.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) obsidian/1.8.3 Chrome/130.0.6723.191 Electron/33.3.2 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15",
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 YaBrowser/25.2.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/27.0 Chrome/125.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) obsidian/1.8.9 Chrome/132.0.6834.210 Electron/34.3.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1.1 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.58 Mobile Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/134.0.6998.99 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) obsidian/1.7.7 Chrome/128.0.6613.186 Electron/32.2.5 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.132 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
  "Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) obsidian/1.8.9 Chrome/132.0.6834.210 Electron/34.3.2 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) obsidian/1.8.9 Chrome/132.0.6834.210 Electron/34.3.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1.1 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) obsidian/1.6.5 Chrome/124.0.6367.243 Electron/30.1.2 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:135.0) Gecko/20100101 Firefox/135.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.92 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) obsidian/1.8.4 Chrome/130.0.6723.191 Electron/33.3.2 Safari/537.36",
  "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
];

// src/common/helpers/fetch.helper.ts
var useFetch = async ({ endpoint, params, context }) => {
  const url = new URL("https://www.jiosaavn.com/api.php");
  url.searchParams.append("__call", endpoint.toString());
  url.searchParams.append("_format", "json");
  url.searchParams.append("_marker", "0");
  url.searchParams.append("api_version", "4");
  url.searchParams.append("ctx", context || "web6dot0");
  Object.keys(params).forEach((key) => url.searchParams.append(key, String(params[key])));
  const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
  const controller = new AbortController;
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": randomUserAgent,
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        Cookie: "L=english; gdpr_acceptance=true; DL=english"
      },
      signal: controller.signal
    });
    const data = await response.json();
    return { data, ok: response.ok };
  } finally {
    clearTimeout(timeoutId);
  }
};

// src/common/helpers/link.helper.ts
var import_node_forge = __toESM(require_lib(), 1);
var createDownloadLinks = (encryptedMediaUrl) => {
  if (!encryptedMediaUrl)
    return [];
  const qualities = [
    { id: "_12", bitrate: "12kbps" },
    { id: "_48", bitrate: "48kbps" },
    { id: "_96", bitrate: "96kbps" },
    { id: "_160", bitrate: "160kbps" },
    { id: "_320", bitrate: "320kbps" }
  ];
  const key = "38346591";
  const iv = "00000000";
  const encrypted = import_node_forge.default.util.decode64(encryptedMediaUrl);
  const decipher = import_node_forge.default.cipher.createDecipher("DES-ECB", import_node_forge.default.util.createBuffer(key));
  decipher.start({ iv: import_node_forge.default.util.createBuffer(iv) });
  decipher.update(import_node_forge.default.util.createBuffer(encrypted));
  decipher.finish();
  const decryptedLink = decipher.output.getBytes();
  return qualities.map((quality) => ({
    quality: quality.bitrate,
    url: decryptedLink.replace("_96", quality.id)
  }));
};
var createImageLinks = (link2) => {
  if (!link2)
    return [];
  const qualities = ["50x50", "150x150", "500x500"];
  const qualityRegex = /150x150|50x50/;
  const protocolRegex = /^http:\/\//;
  return qualities.map((quality) => ({
    quality,
    url: link2.replace(qualityRegex, quality).replace(protocolRegex, "https://")
  }));
};

// src/modules/songs/helpers/song.helper.ts
var createSongPayload = (song) => ({
  id: song.id,
  name: song.title,
  type: song.type,
  year: song.year || null,
  releaseDate: song.more_info?.release_date || null,
  duration: song.more_info?.duration ? Number(song.more_info?.duration) : null,
  label: song.more_info?.label || null,
  explicitContent: song.explicit_content === "1",
  playCount: song.play_count ? Number(song.play_count) : null,
  language: song.language,
  hasLyrics: song.more_info?.has_lyrics === "true",
  lyricsId: song.more_info?.lyrics_id || null,
  url: song.perma_url,
  copyright: song.more_info?.copyright_text || null,
  album: {
    id: song.more_info?.album_id || null,
    name: song.more_info?.album || null,
    url: song.more_info?.album_url || null
  },
  artists: {
    primary: song.more_info?.artistMap?.primary_artists?.map(createArtistMapPayload),
    featured: song.more_info?.artistMap?.featured_artists?.map(createArtistMapPayload),
    all: song.more_info?.artistMap?.artists?.map(createArtistMapPayload)
  },
  image: createImageLinks(song.image),
  downloadUrl: createDownloadLinks(song.more_info?.encrypted_media_url)
});

// src/modules/artists/helpers/artist.helper.ts
var createArtistPayload = (artist) => ({
  id: artist.artistId || artist.id,
  name: artist.name,
  url: artist.urls?.overview || artist.perma_url,
  type: artist.type,
  followerCount: artist.follower_count ? Number(artist.follower_count) : null,
  fanCount: artist.fan_count || null,
  isVerified: artist.isVerified || null,
  dominantLanguage: artist.dominantLanguage || null,
  dominantType: artist.dominantType || null,
  bio: artist.bio ? JSON.parse(artist.bio) : null,
  dob: artist.dob || null,
  fb: artist.fb || null,
  twitter: artist.twitter || null,
  wiki: artist.wiki || null,
  availableLanguages: artist.availableLanguages || null,
  isRadioPresent: artist.isRadioPresent || null,
  image: createImageLinks(artist.image),
  topSongs: artist.topSongs?.map(createSongPayload) || null,
  topAlbums: artist.topAlbums?.map(createAlbumPayload) || null,
  singles: artist.singles?.map(createSongPayload) || null,
  similarArtists: artist.similarArtists?.map((similarArtist) => ({
    id: similarArtist.id,
    name: similarArtist.name,
    url: similarArtist.perma_url,
    image: createImageLinks(similarArtist.image_url),
    languages: similarArtist.languages ? JSON.parse(similarArtist.languages) : null,
    wiki: similarArtist.wiki,
    dob: similarArtist.dob,
    fb: similarArtist.fb,
    twitter: similarArtist.twitter,
    isRadioPresent: similarArtist.isRadioPresent,
    type: similarArtist.type,
    dominantType: similarArtist.dominantType,
    aka: similarArtist.aka,
    bio: similarArtist.bio ? JSON.parse(similarArtist.bio) : null,
    similarArtists: similarArtist.similar ? JSON.parse(similarArtist.similar) : null
  })) || null
});
var createArtistMapPayload = (artist) => ({
  id: artist.id,
  name: artist.name,
  role: artist.role,
  image: createImageLinks(artist.image),
  type: artist.type,
  url: artist.perma_url
});

// src/modules/albums/helpers/album.helper.ts
var createAlbumPayload = (album) => ({
  id: album.id,
  name: album.title,
  description: album.header_desc,
  type: album.type,
  year: album.year ? Number(album.year) : null,
  playCount: album.play_count ? Number(album.play_count) : null,
  language: album.language,
  explicitContent: album.explicit_content === "1",
  url: album.perma_url,
  songCount: album.more_info.song_count ? Number(album.more_info.song_count) : null,
  artists: {
    primary: album.more_info?.artistMap?.primary_artists?.map(createArtistMapPayload),
    featured: album.more_info?.artistMap?.featured_artists?.map(createArtistMapPayload),
    all: album.more_info?.artistMap?.artists?.map(createArtistMapPayload)
  },
  image: createImageLinks(album.image),
  songs: album.list && album.list?.map(createSongPayload) || null
});

// src/modules/albums/use-cases/get-album-by-id/get-album-by-id.use-case.ts
class GetAlbumByIdUseCase {
  constructor() {}
  async execute(id) {
    const { data } = await useFetch({
      endpoint: Endpoints.albums.id,
      params: { albumid: id }
    });
    if (!data)
      throw new HTTPException(404, { message: "album not found" });
    return createAlbumPayload(data);
  }
}

// src/modules/albums/use-cases/get-album-by-link/get-album-by-link.use-case.ts
class GetAlbumByLinkUseCase {
  constructor() {}
  async execute(token) {
    const { data } = await useFetch({
      endpoint: Endpoints.albums.link,
      params: {
        token,
        type: "album"
      }
    });
    if (!data)
      throw new HTTPException(404, { message: "album not found" });
    return createAlbumPayload(data);
  }
}

// src/modules/albums/services/album.service.ts
class AlbumService {
  getAlbumByIdUseCase;
  getAlbumByLinkUseCase;
  constructor() {
    this.getAlbumByIdUseCase = new GetAlbumByIdUseCase;
    this.getAlbumByLinkUseCase = new GetAlbumByLinkUseCase;
  }
  getAlbumById = (albumId) => {
    return this.getAlbumByIdUseCase.execute(albumId);
  };
  getAlbumByLink = (albumLink) => {
    return this.getAlbumByLinkUseCase.execute(albumLink);
  };
}

// src/modules/albums/controllers/album.controller.ts
class AlbumController {
  controller;
  albumService;
  constructor() {
    this.controller = new OpenAPIHono;
    this.albumService = new AlbumService;
  }
  initRoutes() {
    this.controller.openapi(createRoute({
      method: "get",
      path: "/albums",
      tags: ["Album"],
      summary: "Retrieve an album by ID or link",
      description: "Retrieve an album by providing either an ID or a direct link to the album on JioSaavn.",
      operationId: "getAlbumByIdOrLink",
      request: {
        query: exports_external.object({
          id: exports_external.string().optional().openapi({
            title: "Album ID",
            description: "The unique ID of the album",
            type: "string",
            example: "23241654",
            default: "23241654"
          }),
          link: exports_external.string().url().optional().transform((value) => value?.match(/jiosaavn\.com\/album\/[^/]+\/([^/]+)$/)?.[1]).openapi({
            title: "Album Link",
            description: "A direct link to the album on JioSaavn",
            type: "string",
            example: "https://www.jiosaavn.com/album/future-nostalgia/ITIyo-GDr7A_",
            default: "https://www.jiosaavn.com/album/future-nostalgia/ITIyo-GDr7A_"
          })
        })
      },
      responses: {
        200: {
          description: "Successful response with album details",
          content: {
            "application/json": {
              schema: exports_external.object({
                success: exports_external.boolean().openapi({
                  description: "Indicates the success status of the request.",
                  type: "boolean",
                  example: true
                }),
                data: AlbumModel.openapi({
                  title: "Album Details",
                  description: "The detailed information of the album."
                })
              })
            }
          }
        },
        400: { description: "Bad request due to missing or invalid query parameters." },
        404: { description: "The album could not be found with the provided ID or link." }
      }
    }), async (ctx) => {
      const { id, link: link2 } = ctx.req.valid("query");
      const response = link2 ? await this.albumService.getAlbumByLink(link2) : await this.albumService.getAlbumById(id);
      return ctx.json({ success: true, data: response });
    });
  }
}

// src/modules/search/models/search.model.ts
var SearchAPIResponseModel = exports_external.object({
  albums: exports_external.object({
    data: exports_external.array(exports_external.object({
      id: exports_external.string(),
      title: exports_external.string(),
      subtitle: exports_external.string(),
      type: exports_external.string(),
      image: exports_external.string(),
      perma_url: exports_external.string(),
      more_info: exports_external.object({
        music: exports_external.string(),
        ctr: exports_external.number(),
        year: exports_external.string(),
        is_movie: exports_external.string(),
        language: exports_external.string(),
        song_pids: exports_external.string()
      }),
      explicit_content: exports_external.string(),
      mini_obj: exports_external.boolean(),
      description: exports_external.string()
    })),
    position: exports_external.number()
  }),
  songs: exports_external.object({
    data: exports_external.array(exports_external.object({
      id: exports_external.string(),
      title: exports_external.string(),
      subtitle: exports_external.string(),
      type: exports_external.string(),
      image: exports_external.string(),
      perma_url: exports_external.string(),
      more_info: exports_external.object({
        album: exports_external.string(),
        ctr: exports_external.number(),
        score: exports_external.string().optional(),
        vcode: exports_external.string(),
        vlink: exports_external.string().optional(),
        primary_artists: exports_external.string(),
        singers: exports_external.string(),
        video_available: exports_external.boolean(),
        triller_available: exports_external.boolean(),
        language: exports_external.string()
      }),
      explicit_content: exports_external.string(),
      mini_obj: exports_external.boolean(),
      description: exports_external.string()
    })),
    position: exports_external.number()
  }),
  playlists: exports_external.object({
    data: exports_external.array(exports_external.object({
      id: exports_external.string(),
      title: exports_external.string(),
      subtitle: exports_external.string(),
      type: exports_external.string(),
      image: exports_external.string(),
      perma_url: exports_external.string(),
      more_info: exports_external.object({
        firstname: exports_external.string(),
        artist_name: exports_external.array(exports_external.string()),
        entity_type: exports_external.string(),
        entity_sub_type: exports_external.string(),
        video_available: exports_external.boolean(),
        is_dolby_content: exports_external.boolean(),
        sub_types: exports_external.any(),
        images: exports_external.any(),
        lastname: exports_external.string(),
        language: exports_external.string()
      }),
      explicit_content: exports_external.string(),
      mini_obj: exports_external.boolean(),
      description: exports_external.string()
    })),
    position: exports_external.number()
  }),
  artists: exports_external.object({
    data: exports_external.array(exports_external.object({
      id: exports_external.string(),
      title: exports_external.string(),
      image: exports_external.string(),
      extra: exports_external.string(),
      type: exports_external.string(),
      mini_obj: exports_external.boolean(),
      isRadioPresent: exports_external.boolean(),
      ctr: exports_external.number(),
      entity: exports_external.number(),
      description: exports_external.string(),
      position: exports_external.number()
    })),
    position: exports_external.number()
  }),
  topquery: exports_external.object({
    data: exports_external.array(exports_external.object({
      id: exports_external.string(),
      title: exports_external.string(),
      subtitle: exports_external.string(),
      type: exports_external.string(),
      image: exports_external.string(),
      perma_url: exports_external.string(),
      more_info: exports_external.object({
        album: exports_external.string(),
        ctr: exports_external.number(),
        score: exports_external.string().optional(),
        vcode: exports_external.string(),
        vlink: exports_external.string(),
        primary_artists: exports_external.string(),
        singers: exports_external.string(),
        video_available: exports_external.boolean(),
        triller_available: exports_external.boolean(),
        language: exports_external.string()
      }),
      explicit_content: exports_external.string().optional(),
      mini_obj: exports_external.boolean(),
      description: exports_external.string()
    })),
    position: exports_external.number()
  })
});
var SearchResponseModel = (model) => exports_external.object({
  results: model,
  position: exports_external.number()
});
var SearchModel = exports_external.object({
  albums: SearchResponseModel(exports_external.array(exports_external.object({
    id: exports_external.string(),
    title: exports_external.string(),
    image: exports_external.array(DownloadLinkModel),
    artist: exports_external.string(),
    url: exports_external.string(),
    type: exports_external.string(),
    description: exports_external.string(),
    year: exports_external.string(),
    language: exports_external.string(),
    songIds: exports_external.string()
  }))),
  songs: SearchResponseModel(exports_external.array(exports_external.object({
    id: exports_external.string(),
    title: exports_external.string(),
    image: exports_external.array(DownloadLinkModel),
    album: exports_external.string(),
    url: exports_external.string(),
    type: exports_external.string(),
    description: exports_external.string(),
    primaryArtists: exports_external.string(),
    singers: exports_external.string(),
    language: exports_external.string()
  }))),
  artists: SearchResponseModel(exports_external.array(exports_external.object({
    id: exports_external.string(),
    title: exports_external.string(),
    image: exports_external.array(DownloadLinkModel),
    type: exports_external.string(),
    description: exports_external.string(),
    position: exports_external.number()
  }))),
  playlists: SearchResponseModel(exports_external.array(exports_external.object({
    id: exports_external.string(),
    title: exports_external.string(),
    image: exports_external.array(DownloadLinkModel),
    url: exports_external.string(),
    language: exports_external.string(),
    type: exports_external.string(),
    description: exports_external.string()
  }))),
  topQuery: SearchResponseModel(exports_external.array(exports_external.object({
    id: exports_external.string(),
    title: exports_external.string(),
    image: exports_external.array(DownloadLinkModel),
    album: exports_external.string(),
    url: exports_external.string(),
    type: exports_external.string(),
    description: exports_external.string(),
    primaryArtists: exports_external.string(),
    singers: exports_external.string(),
    language: exports_external.string()
  })))
});

// src/modules/search/models/search-artist.model.ts
var SearchArtistAPIResponseModel = exports_external.object({
  total: exports_external.number(),
  start: exports_external.number(),
  results: exports_external.array(exports_external.object({
    name: exports_external.string(),
    id: exports_external.string(),
    ctr: exports_external.number(),
    entity: exports_external.number(),
    image: exports_external.string().url(),
    role: exports_external.string(),
    perma_url: exports_external.string().url(),
    type: exports_external.string(),
    mini_obj: exports_external.boolean(),
    isRadioPresent: exports_external.boolean(),
    is_followed: exports_external.boolean()
  }))
});
var SearchArtistModel = exports_external.object({
  total: exports_external.number(),
  start: exports_external.number(),
  results: exports_external.array(exports_external.object({
    id: exports_external.string(),
    name: exports_external.string(),
    role: exports_external.string(),
    type: exports_external.string(),
    image: exports_external.array(DownloadLinkModel),
    url: exports_external.string()
  }))
});

// src/modules/search/models/search-song.model.ts
var SearchSongAPIResponseModel = exports_external.object({
  total: exports_external.number(),
  start: exports_external.number(),
  results: exports_external.array(SongAPIResponseModel)
});
var SearchSongModel = exports_external.object({
  total: exports_external.number(),
  start: exports_external.number(),
  results: exports_external.array(SongModel)
});

// src/modules/search/models/search-album.model.ts
var SearchAlbumAPIResponseModel = exports_external.object({
  total: exports_external.number(),
  start: exports_external.number(),
  results: exports_external.array(exports_external.object({
    id: exports_external.string(),
    title: exports_external.string(),
    subtitle: exports_external.string(),
    header_desc: exports_external.string(),
    type: exports_external.string(),
    perma_url: exports_external.string(),
    image: exports_external.string(),
    language: exports_external.string(),
    year: exports_external.string(),
    play_count: exports_external.string(),
    explicit_content: exports_external.string(),
    list_count: exports_external.string(),
    list_type: exports_external.string(),
    list: exports_external.array(SongAPIResponseModel),
    more_info: exports_external.object({
      query: exports_external.string(),
      text: exports_external.string(),
      music: exports_external.string(),
      song_count: exports_external.string(),
      artistMap: SongAPIResponseModel.shape.more_info.shape.artistMap
    })
  }))
});
var SearchAlbumModel = exports_external.object({
  total: exports_external.number(),
  start: exports_external.number(),
  results: exports_external.array(exports_external.object({
    id: exports_external.string(),
    name: exports_external.string(),
    description: exports_external.string(),
    year: exports_external.number().nullable(),
    type: exports_external.string(),
    playCount: exports_external.number().nullable(),
    language: exports_external.string(),
    explicitContent: exports_external.boolean(),
    artists: exports_external.object(SongModel.shape.artists.shape),
    url: exports_external.string(),
    image: exports_external.array(DownloadLinkModel)
  }))
});

// src/modules/search/models/search-playlist.model.ts
var SearchPlaylistAPIResponseModel = exports_external.object({
  total: exports_external.number(),
  start: exports_external.number(),
  results: exports_external.array(exports_external.object({
    id: exports_external.string(),
    title: exports_external.string(),
    subtitle: exports_external.string(),
    type: exports_external.string(),
    image: exports_external.string(),
    perma_url: exports_external.string(),
    more_info: exports_external.object({
      uid: exports_external.string(),
      firstname: exports_external.string(),
      artist_name: exports_external.any(),
      entity_type: exports_external.string(),
      entity_sub_type: exports_external.string(),
      video_available: exports_external.boolean(),
      is_dolby_content: exports_external.any(),
      sub_types: exports_external.any(),
      images: exports_external.any(),
      lastname: exports_external.string(),
      song_count: exports_external.string(),
      language: exports_external.string()
    }),
    explicit_content: exports_external.string(),
    mini_obj: exports_external.boolean(),
    numsongs: exports_external.any()
  }))
});
var SearchPlaylistModel = exports_external.object({
  total: exports_external.number(),
  start: exports_external.number(),
  results: exports_external.array(exports_external.object({
    id: exports_external.string(),
    name: exports_external.string(),
    type: exports_external.string(),
    image: exports_external.array(DownloadLinkModel),
    url: exports_external.string(),
    songCount: exports_external.number().nullable(),
    language: exports_external.string(),
    explicitContent: exports_external.boolean()
  }))
});

// src/modules/search/helpers/search.helper.ts
var createSearchPayload = (search) => ({
  topQuery: {
    results: search?.topquery?.data.map((item) => {
      return {
        id: item?.id,
        title: item?.title,
        image: createImageLinks(item?.image),
        album: item?.more_info?.album,
        url: item?.perma_url,
        type: item?.type,
        language: item?.more_info?.language,
        description: item?.description,
        primaryArtists: item?.more_info?.primary_artists,
        singers: item?.more_info?.singers
      };
    }),
    position: search?.topquery?.position
  },
  songs: {
    results: search?.songs?.data.map((song) => {
      return {
        id: song?.id,
        title: song?.title,
        image: createImageLinks(song?.image),
        album: song?.more_info.album,
        url: song?.perma_url,
        type: song?.type,
        description: song?.description,
        primaryArtists: song?.more_info?.primary_artists,
        singers: song?.more_info?.singers,
        language: song?.more_info?.language
      };
    }),
    position: search.songs.position
  },
  albums: {
    results: search?.albums?.data.map((album) => {
      return {
        id: album?.id,
        title: album?.title,
        image: createImageLinks(album.image),
        artist: album?.more_info.music,
        url: album?.perma_url,
        type: album?.type,
        description: album?.description,
        year: album?.more_info?.year,
        songIds: album?.more_info?.song_pids,
        language: album?.more_info?.language
      };
    }),
    position: search?.albums?.position
  },
  artists: {
    results: search?.artists?.data.map((artist) => {
      return {
        id: artist?.id,
        title: artist?.title,
        image: createImageLinks(artist?.image),
        type: artist?.type,
        description: artist?.description,
        position: artist?.position
      };
    }),
    position: search?.artists?.position
  },
  playlists: {
    results: search?.playlists?.data.map((playlist) => {
      return {
        id: playlist?.id,
        title: playlist?.title,
        image: createImageLinks(playlist.image),
        url: playlist?.perma_url,
        type: playlist?.type,
        language: playlist?.more_info?.language,
        description: playlist?.description
      };
    }),
    position: search?.playlists?.position
  }
});
var createSearchPlaylistPayload = (playlist) => ({
  total: Number(playlist.total),
  start: Number(playlist.start),
  results: playlist.results.map((item) => ({
    id: item.id,
    name: item.title,
    type: item.type,
    image: createImageLinks(item.image),
    url: item.perma_url,
    songCount: item.more_info.song_count ? Number(item.more_info.song_count) : null,
    language: item.more_info.language,
    explicitContent: item.explicit_content === "1"
  }))
});
var createSearchAlbumPayload = (album) => ({
  total: Number(album.total),
  start: Number(album.start),
  results: album.results.map((item) => ({
    id: item.id,
    name: item.title,
    description: item.header_desc,
    url: item.perma_url,
    year: item.year ? Number(item.year) : null,
    type: item.type,
    playCount: item.play_count ? Number(item.play_count) : null,
    language: item.language,
    explicitContent: item.explicit_content === "1",
    artists: {
      primary: item.more_info?.artistMap?.primary_artists?.map(createArtistMapPayload),
      featured: item.more_info?.artistMap?.featured_artists?.map(createArtistMapPayload),
      all: item.more_info?.artistMap?.artists?.map(createArtistMapPayload)
    },
    image: createImageLinks(item.image)
  }))
});

// src/modules/search/use-cases/search-all/search-all.use-case.ts
class SearchAllUseCase {
  async execute(query) {
    const { data } = await useFetch({
      endpoint: Endpoints.search.all,
      params: { query }
    });
    if (!data)
      throw new HTTPException(404, { message: `no results found for ${query}` });
    return createSearchPayload(data);
  }
}

// src/modules/search/use-cases/search-albums/search-albums.use-case.ts
class SearchAlbumsUseCase {
  constructor() {}
  async execute({ query, limit, page }) {
    const { data } = await useFetch({
      endpoint: Endpoints.search.albums,
      params: {
        q: query,
        p: page,
        n: limit
      }
    });
    return createSearchAlbumPayload(data);
  }
}

// src/modules/search/use-cases/search-songs/search-songs.use-case.ts
class SearchSongsUseCase {
  constructor() {}
  async execute({ query, limit, page }) {
    const { data } = await useFetch({
      endpoint: Endpoints.search.songs,
      params: {
        q: query,
        p: page,
        n: limit
      }
    });
    return {
      total: data.total,
      start: data.start,
      results: data.results?.map(createSongPayload).slice(0, limit) || []
    };
  }
}

// src/modules/search/use-cases/search-artists/search-artists.use-case.ts
class SearchArtistsUseCase {
  constructor() {}
  async execute({ query, limit, page }) {
    const { data } = await useFetch({
      endpoint: Endpoints.search.artists,
      params: {
        q: query,
        p: page,
        n: limit
      }
    });
    if (!data)
      throw new HTTPException(404, { message: "artist not found" });
    return {
      total: data.total,
      start: data.start,
      results: data.results?.map(createArtistMapPayload).slice(0, limit) || []
    };
  }
}

// src/modules/search/use-cases/search-playlists/search-playlists.use-case.ts
class SearchPlaylistsUseCase {
  constructor() {}
  async execute({ query, limit, page }) {
    const { data } = await useFetch({
      endpoint: Endpoints.search.playlists,
      params: {
        q: query,
        p: page,
        n: limit
      }
    });
    if (!data)
      throw new HTTPException(404, { message: "playlist not found" });
    return createSearchPlaylistPayload(data);
  }
}

// src/modules/search/services/search.service.ts
class SearchService {
  searchAllUseCase;
  searchSongsUseCase;
  searchAlbumsUseCase;
  searchArtistsUseCase;
  searchPlaylistsUseCase;
  constructor() {
    this.searchAllUseCase = new SearchAllUseCase;
    this.searchSongsUseCase = new SearchSongsUseCase;
    this.searchAlbumsUseCase = new SearchAlbumsUseCase;
    this.searchArtistsUseCase = new SearchArtistsUseCase;
    this.searchPlaylistsUseCase = new SearchPlaylistsUseCase;
  }
  searchAll = (query) => {
    return this.searchAllUseCase.execute(query);
  };
  searchSongs = (args) => {
    return this.searchSongsUseCase.execute(args);
  };
  searchAlbums = (args) => {
    return this.searchAlbumsUseCase.execute(args);
  };
  searchArtists = (args) => {
    return this.searchArtistsUseCase.execute(args);
  };
  searchPlaylists = (args) => {
    return this.searchPlaylistsUseCase.execute(args);
  };
}

// src/modules/search/controllers/search.controller.ts
class SearchController {
  controller;
  searchService;
  constructor() {
    this.controller = new OpenAPIHono;
    this.searchService = new SearchService;
  }
  initRoutes() {
    this.controller.openapi(createRoute({
      method: "get",
      path: "/search",
      tags: ["Search"],
      summary: "Global search",
      description: "Search for songs, albums, artists, and playlists based on the provided query string.",
      operationId: "globalSearch",
      request: {
        query: exports_external.object({
          query: exports_external.string().openapi({
            title: "Search query",
            description: "Search query",
            type: "string",
            example: "Imagine Dragons"
          })
        })
      },
      responses: {
        200: {
          description: "Successful global search",
          content: {
            "application/json": {
              schema: exports_external.object({
                success: exports_external.boolean().openapi({
                  description: "Indicates whether the search was successful",
                  type: "boolean",
                  example: true
                }),
                data: SearchModel.openapi({
                  description: "Search results including songs, albums, artists, and playlists"
                })
              })
            }
          }
        }
      }
    }), async (ctx) => {
      const { query } = ctx.req.valid("query");
      const result = await this.searchService.searchAll(query);
      return ctx.json({ success: true, data: result });
    });
    this.controller.openapi(createRoute({
      method: "get",
      path: "/search/songs",
      tags: ["Search"],
      summary: "Search for songs",
      description: "Search for songs based on the provided query",
      operationId: "searchSongs",
      request: {
        query: exports_external.object({
          query: exports_external.string().openapi({
            title: "Search query",
            description: "Search query for songs",
            type: "string",
            example: "Believer"
          }),
          page: exports_external.string().pipe(exports_external.coerce.number()).optional().openapi({
            title: "Page Number",
            description: "The page number of the search results to retrieve",
            type: "integer",
            example: "0",
            default: "0"
          }),
          limit: exports_external.string().pipe(exports_external.coerce.number()).optional().openapi({
            title: "Limit",
            description: "Number of search results per page",
            type: "integer",
            example: "10",
            default: "10"
          })
        })
      },
      responses: {
        200: {
          description: "Successful response with song search results",
          content: {
            "application/json": {
              schema: exports_external.object({
                success: exports_external.boolean().openapi({
                  description: "Indicates whether the song search was successful",
                  type: "boolean",
                  example: true
                }),
                data: SearchSongModel.openapi({
                  description: "Search results for songs"
                })
              })
            }
          }
        }
      }
    }), async (ctx) => {
      const { query, page, limit } = ctx.req.valid("query");
      const result = await this.searchService.searchSongs({ query, page: page || 0, limit: limit || 10 });
      return ctx.json({ success: true, data: result });
    });
    this.controller.openapi(createRoute({
      method: "get",
      path: "/search/albums",
      tags: ["Search"],
      summary: "Search for albums",
      description: "Search for albums based on the provided query",
      operationId: "searchAlbums",
      request: {
        query: exports_external.object({
          query: exports_external.string().openapi({
            description: "Search query for albums",
            type: "string",
            example: "Evolve"
          }),
          page: exports_external.string().pipe(exports_external.coerce.number()).optional().openapi({
            description: "The page number of the search results to retrieve",
            type: "integer",
            example: "0",
            default: "0"
          }),
          limit: exports_external.string().pipe(exports_external.coerce.number()).optional().openapi({
            description: "The number of search results per page",
            type: "integer",
            example: "10",
            default: "10"
          })
        })
      },
      responses: {
        200: {
          description: "Successful response with album search results",
          content: {
            "application/json": {
              schema: exports_external.object({
                success: exports_external.boolean().openapi({
                  description: "Indicates whether the album search was successful",
                  type: "boolean",
                  example: true
                }),
                data: SearchAlbumModel.openapi({
                  description: "Search results for albums"
                })
              })
            }
          }
        }
      }
    }), async (ctx) => {
      const { query, page, limit } = ctx.req.valid("query");
      const result = await this.searchService.searchAlbums({ query, page: page || 0, limit: limit || 10 });
      return ctx.json({ success: true, data: result });
    });
    this.controller.openapi(createRoute({
      method: "get",
      path: "/search/artists",
      tags: ["Search"],
      summary: "Search for artists",
      description: "Search for artists based on the provided query",
      operationId: "searchArtists",
      request: {
        query: exports_external.object({
          query: exports_external.string().openapi({
            title: "Search query",
            description: "Search query for artists",
            type: "string",
            example: "Adele"
          }),
          page: exports_external.string().pipe(exports_external.coerce.number()).optional().openapi({
            title: "Page Number",
            description: "The page number of the search results to retrieve",
            type: "integer",
            example: "0",
            default: "0"
          }),
          limit: exports_external.string().pipe(exports_external.coerce.number()).optional().openapi({
            title: "Limit",
            description: "Number of search results per page",
            type: "integer",
            example: "10",
            default: "10"
          })
        })
      },
      responses: {
        200: {
          description: "Successful response with artist search results",
          content: {
            "application/json": {
              schema: exports_external.object({
                success: exports_external.boolean().openapi({
                  description: "Indicates whether the artist search was successful",
                  type: "boolean",
                  example: true
                }),
                data: SearchArtistModel.openapi({
                  description: "Search results for artists"
                })
              })
            }
          }
        }
      }
    }), async (ctx) => {
      const { query, page, limit } = ctx.req.valid("query");
      const result = await this.searchService.searchArtists({ query, page: page || 0, limit: limit || 10 });
      return ctx.json({ success: true, data: result });
    });
    this.controller.openapi(createRoute({
      method: "get",
      path: "/search/playlists",
      tags: ["Search"],
      summary: "Search for playlists",
      description: "Search for playlists based on the provided query",
      operationId: "searchPlaylists",
      request: {
        query: exports_external.object({
          query: exports_external.string().openapi({
            title: "Search query",
            description: "Search query for playlists",
            type: "string",
            example: "Indie"
          }),
          page: exports_external.string().pipe(exports_external.coerce.number()).optional().openapi({
            title: "Page Number",
            description: "The page number of the search results to retrieve",
            type: "integer",
            example: "0",
            default: "0"
          }),
          limit: exports_external.string().pipe(exports_external.coerce.number()).optional().openapi({
            title: "Limit",
            description: "Number of search results per page",
            type: "integer",
            example: "10",
            default: "10"
          })
        })
      },
      responses: {
        200: {
          description: "Successful response with playlist search results",
          content: {
            "application/json": {
              schema: exports_external.object({
                success: exports_external.boolean().openapi({
                  description: "Indicates whether the playlist search was successful",
                  type: "boolean",
                  example: true
                }),
                data: SearchPlaylistModel.openapi({
                  description: "Search results for playlist"
                })
              })
            }
          }
        }
      }
    }), async (ctx) => {
      const { query, page, limit } = ctx.req.valid("query");
      const result = await this.searchService.searchPlaylists({ query, page: page || 0, limit: limit || 10 });
      return ctx.json({ success: true, data: result });
    });
  }
}

// src/modules/songs/use-cases/get-song-by-id/get-song-by-id.use-case.ts
class GetSongByIdUseCase {
  constructor() {}
  async execute({ songIds }) {
    const { data } = await useFetch({
      endpoint: Endpoints.songs.id,
      params: {
        pids: songIds
      }
    });
    if (!data.songs?.length)
      throw new HTTPException(404, { message: "song not found" });
    const songs = data.songs.map((song) => createSongPayload(song));
    return songs;
  }
}

// src/modules/songs/use-cases/get-song-by-link/get-song-by-link.use-case.ts
class GetSongByLinkUseCase {
  constructor() {}
  async execute(token) {
    const { data } = await useFetch({
      endpoint: Endpoints.songs.link,
      params: { token, type: "song" }
    });
    if (!data.songs?.length)
      throw new HTTPException(404, { message: "song not found" });
    return data.songs.map((song) => createSongPayload(song));
  }
}

// src/modules/songs/use-cases/create-song-station/create-song-station.use-case.ts
class CreateSongStationUseCase {
  constructor() {}
  async execute(songId) {
    const encodedSongId = JSON.stringify([encodeURIComponent(songId)]);
    const { data, ok } = await useFetch({
      endpoint: Endpoints.songs.station,
      params: {
        entity_id: encodedSongId,
        entity_type: "queue"
      },
      context: "android" /* ANDROID */
    });
    if (!data || !ok || !data.stationid)
      throw new HTTPException(500, { message: "could not create station" });
    return data.stationid;
  }
}

// src/modules/songs/use-cases/get-song-suggestions/get-song-suggestions.use-case.ts
class GetSongSuggestionsUseCase {
  createSongStation;
  constructor() {
    this.createSongStation = new CreateSongStationUseCase;
  }
  async execute({ songId, limit }) {
    const stationId = await this.createSongStation.execute(songId);
    const { data, ok } = await useFetch({
      endpoint: Endpoints.songs.suggestions,
      params: {
        stationid: stationId,
        k: limit
      },
      context: "android" /* ANDROID */
    });
    if (!data || !ok) {
      throw new HTTPException(404, { message: `no suggestions found for the given song` });
    }
    const { stationid, ...suggestions } = data;
    return Object.values(suggestions).map((element) => element && createSongPayload(element.song)).filter(Boolean).slice(0, limit) || [];
  }
}

// src/modules/songs/services/song.service.ts
class SongService {
  getSongByIdUseCase;
  getSongByLinkUseCase;
  createSongStationUseCase;
  getSongSuggestionsUseCase;
  constructor() {
    this.getSongByIdUseCase = new GetSongByIdUseCase;
    this.getSongByLinkUseCase = new GetSongByLinkUseCase;
    this.createSongStationUseCase = new CreateSongStationUseCase;
    this.getSongSuggestionsUseCase = new GetSongSuggestionsUseCase;
  }
  getSongByIds = (args) => {
    return this.getSongByIdUseCase.execute(args);
  };
  getSongByLink = (token) => {
    return this.getSongByLinkUseCase.execute(token);
  };
  createSongStation = (songIds) => {
    return this.createSongStationUseCase.execute(songIds);
  };
  getSongSuggestions = (args) => {
    return this.getSongSuggestionsUseCase.execute(args);
  };
}

// src/modules/songs/controllers/song.controller.ts
class SongController {
  controller;
  static songClient;
  songService;
  constructor() {
    this.controller = new OpenAPIHono;
    this.songService = new SongService;
  }
  initRoutes() {
    this.controller.openapi(createRoute({
      method: "get",
      path: "/songs",
      tags: ["Songs"],
      summary: "Retrieve songs by ID or link",
      description: "Retrieve songs by a comma-separated list of IDs or by a direct link to the song on JioSaavn.",
      operationId: "getSongByIdsOrLink",
      request: {
        query: exports_external.object({
          ids: exports_external.string().optional().openapi({
            title: "Song IDs",
            description: "Comma-separated list of song IDs",
            type: "string",
            example: "3IoDK8qI,4IoDK8qI,5IoDK8qI"
          }),
          link: exports_external.string().url().optional().transform((value) => value?.match(/jiosaavn\.com\/song\/[^/]+\/([^/]+)$/)?.[1]).openapi({
            title: "Song Link",
            description: "A direct link to the song on JioSaavn",
            type: "string",
            example: "https://www.jiosaavn.com/song/houdini/OgwhbhtDRwM"
          })
        })
      },
      responses: {
        200: {
          description: "Successful response with song details",
          content: {
            "application/json": {
              schema: exports_external.object({
                success: exports_external.boolean().openapi({
                  description: "Indicates whether the request was successful",
                  type: "boolean",
                  example: true
                }),
                data: exports_external.array(SongModel).openapi({
                  title: "Song Details",
                  description: "Array of song details"
                })
              })
            }
          }
        },
        400: { description: "Bad request when query parameters are missing or invalid" },
        404: { description: "Song not found with the given ID or link" }
      }
    }), async (ctx) => {
      const { link: link2, ids } = ctx.req.valid("query");
      if (!link2 && !ids) {
        return ctx.json({ success: false, message: "Either song IDs or link is required" }, 400);
      }
      const response = link2 ? await this.songService.getSongByLink(link2) : await this.songService.getSongByIds({ songIds: ids });
      return ctx.json({ success: true, data: response });
    });
    this.controller.openapi(createRoute({
      method: "get",
      path: "/songs/{id}",
      tags: ["Songs"],
      summary: "Retrieve song by ID",
      description: "Retrieve a song by its ID. Optionally, include lyrics in the response.",
      operationId: "getSongById",
      request: {
        params: exports_external.object({
          id: exports_external.string().openapi({
            title: "Song ID",
            description: "ID of the song to retrieve",
            type: "string",
            example: "3IoDK8qI"
          })
        })
      },
      responses: {
        200: {
          description: "Successful response with song details",
          content: {
            "application/json": {
              schema: exports_external.object({
                success: exports_external.boolean().openapi({
                  description: "Indicates whether the request was successful",
                  type: "boolean",
                  example: true
                }),
                data: exports_external.array(SongModel).openapi({
                  description: "Array of songs"
                })
              })
            }
          }
        },
        400: { description: "Bad request when query parameters are missing or invalid" },
        404: { description: "Song not found for the given ID" }
      }
    }), async (ctx) => {
      const songId = ctx.req.param("id");
      const response = await this.songService.getSongByIds({ songIds: songId });
      return ctx.json({ success: true, data: response });
    });
    this.controller.openapi(createRoute({
      method: "get",
      path: "/songs/{id}/suggestions",
      tags: ["Songs"],
      summary: "Retrieve song suggestions",
      description: "Retrieve song suggestions based on the given song ID. This can be used to get similar songs to the one provided for infinite playback.",
      operationId: "getSongSuggestions",
      request: {
        params: exports_external.object({
          id: exports_external.string().openapi({
            description: "ID of the song to retrieve suggestions for",
            type: "string",
            example: "yDeAS8Eh"
          })
        }),
        query: exports_external.object({
          limit: exports_external.string().pipe(exports_external.coerce.number()).optional().openapi({
            description: "Limit the number of suggestions to retrieve",
            type: "number",
            title: "Limit",
            example: "10",
            default: "10"
          })
        })
      },
      responses: {
        200: {
          description: "Successful response with song suggestions",
          content: {
            "application/json": {
              schema: exports_external.object({
                success: exports_external.boolean().openapi({
                  description: "Indicates whether the request was successful",
                  type: "boolean",
                  example: true
                }),
                data: exports_external.array(SongModel).openapi({
                  description: "Array of song suggestions"
                })
              })
            }
          }
        }
      }
    }), async (ctx) => {
      const songId = ctx.req.param("id");
      const { limit } = ctx.req.valid("query");
      const suggestions = await this.songService.getSongSuggestions({ songId, limit: limit || 10 });
      return ctx.json({ success: true, data: suggestions });
    });
  }
}

// src/modules/artists/models/artist-album.model.ts
var ArtistAlbumAPIResponseModel = exports_external.object({
  artistId: exports_external.string(),
  name: exports_external.string(),
  subtitle: exports_external.string(),
  image: exports_external.string(),
  follower_count: exports_external.string(),
  type: exports_external.string(),
  isVerified: exports_external.boolean(),
  dominantLanguage: exports_external.string(),
  dominantType: exports_external.string(),
  topAlbums: exports_external.object({
    albums: exports_external.array(AlbumAPIResponseModel),
    total: exports_external.number()
  })
});
var ArtistAlbumModel = exports_external.object({
  total: exports_external.number(),
  albums: exports_external.array(AlbumModel)
});

// src/modules/artists/models/artist-song.model.ts
var ArtistSongAPIResponseModel = exports_external.object({
  artistId: exports_external.string(),
  name: exports_external.string(),
  subtitle: exports_external.string(),
  image: exports_external.string(),
  follower_count: exports_external.string(),
  type: exports_external.string(),
  isVerified: exports_external.boolean(),
  dominantLanguage: exports_external.string(),
  dominantType: exports_external.string(),
  topSongs: exports_external.object({
    songs: exports_external.array(SongAPIResponseModel),
    total: exports_external.number()
  })
});
var ArtistSongModel = exports_external.object({
  total: exports_external.number(),
  songs: exports_external.array(SongModel)
});

// src/modules/artists/models/artist.model.ts
var ArtistAPIResponseModel = exports_external.object({
  artistId: exports_external.string(),
  name: exports_external.string(),
  subtitle: exports_external.string(),
  image: exports_external.string(),
  follower_count: exports_external.string(),
  type: exports_external.string(),
  isVerified: exports_external.boolean(),
  dominantLanguage: exports_external.string(),
  dominantType: exports_external.string(),
  topSongs: exports_external.array(SongAPIResponseModel),
  topAlbums: exports_external.array(AlbumAPIResponseModel),
  singles: exports_external.array(SongAPIResponseModel),
  dedicated_artist_playlist: exports_external.array(exports_external.object({
    id: exports_external.string(),
    title: exports_external.string(),
    subtitle: exports_external.string(),
    type: exports_external.string(),
    image: exports_external.string(),
    perma_url: exports_external.string(),
    more_info: exports_external.object({
      uid: exports_external.string(),
      firstname: exports_external.string(),
      artist_name: exports_external.array(exports_external.string()),
      entity_type: exports_external.string(),
      entity_sub_type: exports_external.string(),
      video_available: exports_external.boolean(),
      is_dolby_content: exports_external.any(),
      sub_types: exports_external.any(),
      images: exports_external.any(),
      lastname: exports_external.string(),
      song_count: exports_external.string(),
      language: exports_external.string()
    }),
    explicit_content: exports_external.string(),
    mini_obj: exports_external.boolean(),
    numsongs: exports_external.number()
  })),
  featured_artist_playlist: exports_external.array(exports_external.object({
    id: exports_external.string(),
    title: exports_external.string(),
    subtitle: exports_external.string(),
    type: exports_external.string(),
    image: exports_external.string(),
    perma_url: exports_external.string(),
    more_info: exports_external.object({
      uid: exports_external.string(),
      firstname: exports_external.string(),
      artist_name: exports_external.any(),
      entity_type: exports_external.string(),
      entity_sub_type: exports_external.string(),
      video_available: exports_external.boolean(),
      is_dolby_content: exports_external.any(),
      sub_types: exports_external.any(),
      images: exports_external.any(),
      lastname: exports_external.string(),
      song_count: exports_external.string(),
      language: exports_external.string()
    }),
    explicit_content: exports_external.string(),
    mini_obj: exports_external.boolean(),
    numsongs: exports_external.number()
  })),
  similarArtists: exports_external.array(exports_external.object({
    _id: exports_external.string(),
    similar: exports_external.string(),
    languages: exports_external.string(),
    isVerified: exports_external.string(),
    image_url: exports_external.string(),
    wiki: exports_external.string(),
    roles: exports_external.string(),
    combine_artist_pages: exports_external.number(),
    webp: exports_external.boolean(),
    search_keywords: exports_external.string(),
    replace_with_primary_artists: exports_external.number(),
    twitter: exports_external.string(),
    dob: exports_external.string(),
    aka: exports_external.string(),
    name: exports_external.string(),
    primary_artist_id: exports_external.string(),
    id: exports_external.string(),
    fb: exports_external.string(),
    bio: exports_external.string(),
    perma_url: exports_external.string(),
    type: exports_external.string(),
    mini_obj: exports_external.boolean(),
    isRadioPresent: exports_external.boolean(),
    dominantType: exports_external.string()
  })),
  isRadioPresent: exports_external.boolean(),
  bio: exports_external.string(),
  dob: exports_external.string(),
  fb: exports_external.string(),
  twitter: exports_external.string(),
  wiki: exports_external.string(),
  urls: exports_external.object({
    albums: exports_external.string(),
    bio: exports_external.string(),
    comments: exports_external.string(),
    songs: exports_external.string(),
    overview: exports_external.string()
  }),
  availableLanguages: exports_external.array(exports_external.string()),
  fan_count: exports_external.string(),
  topEpisodes: exports_external.array(exports_external.any()),
  is_followed: exports_external.boolean()
}).extend({
  id: exports_external.string(),
  perma_url: exports_external.string()
});
var ArtistModel = exports_external.object({
  id: exports_external.string(),
  name: exports_external.string(),
  url: exports_external.string(),
  type: exports_external.string(),
  image: exports_external.array(DownloadLinkModel),
  followerCount: exports_external.number().nullable(),
  fanCount: exports_external.string().nullable(),
  isVerified: exports_external.boolean().nullable(),
  dominantLanguage: exports_external.string().nullable(),
  dominantType: exports_external.string().nullable(),
  bio: exports_external.array(exports_external.object({
    text: exports_external.string().nullable(),
    title: exports_external.string().nullable(),
    sequence: exports_external.number().nullable()
  })).nullable(),
  dob: exports_external.string().nullable(),
  fb: exports_external.string().nullable(),
  twitter: exports_external.string().nullable(),
  wiki: exports_external.string().nullable(),
  availableLanguages: exports_external.array(exports_external.string()),
  isRadioPresent: exports_external.boolean().nullable(),
  topSongs: exports_external.array(SongModel).nullable(),
  topAlbums: exports_external.array(AlbumModel).nullable(),
  singles: exports_external.array(SongModel).nullable(),
  similarArtists: exports_external.array(exports_external.object({
    id: exports_external.string(),
    name: exports_external.string(),
    url: exports_external.string(),
    image: exports_external.array(DownloadLinkModel),
    languages: exports_external.record(exports_external.string(), exports_external.string()).nullable(),
    wiki: exports_external.string(),
    dob: exports_external.string(),
    fb: exports_external.string(),
    twitter: exports_external.string(),
    isRadioPresent: exports_external.boolean(),
    type: exports_external.string(),
    dominantType: exports_external.string(),
    aka: exports_external.string(),
    bio: exports_external.string().nullable(),
    similarArtists: exports_external.array(exports_external.object({
      id: exports_external.string(),
      name: exports_external.string()
    })).nullable()
  })).nullable()
});

// src/modules/artists/use-cases/get-artist-by-id/get-artist-by-id.use-case.ts
class GetArtistByIdUseCase {
  constructor() {}
  async execute({ artistId, page, songCount, albumCount, sortBy, sortOrder }) {
    const { data } = await useFetch({
      endpoint: Endpoints.artists.id,
      params: {
        artistId,
        n_song: songCount,
        n_album: albumCount,
        page,
        sort_order: sortOrder,
        category: sortBy
      }
    });
    if (!data)
      throw new HTTPException(404, { message: "artist not found" });
    return createArtistPayload(data);
  }
}

// src/modules/artists/use-cases/get-artist-by-link/get-artist-by-link.use-case.ts
class GetArtistByLinkUseCase {
  constructor() {}
  async execute({ token, page, songCount, albumCount, sortBy, sortOrder }) {
    const { data } = await useFetch({
      endpoint: Endpoints.artists.link,
      params: {
        token,
        n_song: songCount,
        n_album: albumCount,
        page,
        sort_order: sortOrder,
        category: sortBy,
        type: "artist"
      }
    });
    if (!data)
      throw new HTTPException(404, { message: "artist not found" });
    return createArtistPayload(data);
  }
}

// src/modules/artists/use-cases/get-artist-songs/get-artist-songs.use-case.ts
class GetArtistSongsUseCase {
  constructor() {}
  async execute({ artistId, page, sortOrder, sortBy }) {
    const { data } = await useFetch({
      endpoint: Endpoints.artists.songs,
      params: {
        artistId,
        page,
        sort_order: sortOrder,
        category: sortBy
      }
    });
    if (!data)
      throw new HTTPException(404, { message: "artist songs not found" });
    return {
      total: data.topSongs.total,
      songs: data.topSongs.songs.map((song) => createSongPayload(song))
    };
  }
}

// src/modules/artists/use-cases/get-artist-albums/get-artist-albums.use-case.ts
class GetArtistAlbumsUseCase {
  constructor() {}
  async execute({ artistId, page, sortOrder, sortBy }) {
    const { data } = await useFetch({
      endpoint: Endpoints.artists.albums,
      params: {
        artistId,
        page,
        sort_order: sortOrder,
        category: sortBy
      }
    });
    if (!data)
      throw new HTTPException(404, { message: "artist albums not found" });
    return {
      total: data.topAlbums.total,
      albums: data.topAlbums.albums.map((album) => createAlbumPayload(album))
    };
  }
}

// src/modules/artists/services/artist.service.ts
class ArtistService {
  getArtistByIdUseCase;
  getArtistByLinkUseCase;
  getArtistSongsUseCase;
  getArtistAlbumsUseCase;
  constructor() {
    this.getArtistByIdUseCase = new GetArtistByIdUseCase;
    this.getArtistByLinkUseCase = new GetArtistByLinkUseCase;
    this.getArtistSongsUseCase = new GetArtistSongsUseCase;
    this.getArtistAlbumsUseCase = new GetArtistAlbumsUseCase;
  }
  getArtistById = (args) => {
    return this.getArtistByIdUseCase.execute(args);
  };
  getArtistByLink = (args) => {
    return this.getArtistByLinkUseCase.execute(args);
  };
  getArtistSongs = (args) => {
    return this.getArtistSongsUseCase.execute(args);
  };
  getArtistAlbums = (args) => {
    return this.getArtistAlbumsUseCase.execute(args);
  };
}

// src/modules/artists/controllers/artist.controller.ts
class ArtistController {
  controller;
  artistService;
  constructor() {
    this.controller = new OpenAPIHono;
    this.artistService = new ArtistService;
  }
  initRoutes() {
    this.controller.openapi(createRoute({
      method: "get",
      path: "/artists",
      tags: ["Artists"],
      summary: "Retrieve artists by ID or link",
      description: `Retrieve artists by ID or by a direct artist link.`,
      operationId: "getArtistByIdOrLink",
      request: {
        query: exports_external.object({
          id: exports_external.string().optional().openapi({
            title: "Artist ID",
            description: "Artist ID",
            type: "string",
            example: "1274170"
          }),
          link: exports_external.string().url().optional().transform((value) => value?.match(/jiosaavn\.com\/artist\/[^/]+\/([^/]+)$/)?.[1]).openapi({
            title: "Artist Link",
            description: "A direct link to the artist on JioSaavn",
            type: "string",
            example: "https://www.jiosaavn.com/artist/dua-lipa-songs/r-OWIKgpX2I_"
          }),
          page: exports_external.string().pipe(exports_external.coerce.number()).optional().openapi({
            title: "Page number",
            description: "page number",
            type: "number",
            example: "1"
          }),
          songCount: exports_external.string().pipe(exports_external.coerce.number()).optional().openapi({
            title: "Song count",
            description: "Number of songs to fetch",
            type: "number",
            example: "10"
          }),
          albumCount: exports_external.string().pipe(exports_external.coerce.number()).optional().openapi({
            title: "Album count",
            description: "Number of albums to fetch",
            type: "number",
            example: "10"
          }),
          sortBy: exports_external.enum(["popularity", "latest", "alphabetical"]).optional().openapi({
            title: "Sort by",
            description: "sort by",
            type: "string",
            example: "popularity"
          }),
          sortOrder: exports_external.enum(["asc", "desc"]).optional().openapi({
            title: "Sort order",
            description: "sort order",
            type: "string",
            example: "desc",
            default: "desc"
          })
        })
      },
      responses: {
        200: {
          description: "Successful response with artist details",
          content: {
            "application/json": {
              schema: exports_external.object({
                success: exports_external.boolean().openapi({
                  description: "Indicates whether the request was successful",
                  type: "boolean",
                  example: true
                }),
                data: ArtistModel.openapi({
                  description: "Artist details"
                })
              })
            }
          }
        }
      }
    }), async (ctx) => {
      const {
        link: link2,
        id,
        page = 0,
        sortBy = "popularity",
        sortOrder = "asc",
        songCount = 10,
        albumCount = 10
      } = ctx.req.valid("query");
      const response = link2 ? await this.artistService.getArtistByLink({ token: link2, page, songCount, albumCount, sortBy, sortOrder }) : await this.artistService.getArtistById({ artistId: id, page, songCount, albumCount, sortBy, sortOrder });
      return ctx.json({ success: true, data: response });
    });
    this.controller.openapi(createRoute({
      method: "get",
      path: "/artists/{id}",
      tags: ["Artists"],
      summary: "Retrieve artist by ID",
      description: "Retrieve artist by ID",
      operationId: "getArtistById",
      request: {
        params: exports_external.object({
          id: exports_external.string().openapi({
            title: "Artist ID",
            description: "ID of the artist to retrieve",
            type: "string",
            example: "1274170"
          })
        }),
        query: exports_external.object({
          page: exports_external.string().pipe(exports_external.coerce.number()).optional().openapi({
            title: "Page number",
            description: "The page number of the results to retrieve",
            type: "integer",
            example: "0"
          }),
          songCount: exports_external.string().pipe(exports_external.coerce.number()).optional().openapi({
            title: "Song count",
            description: "The number of songs to retrieve for the artist",
            type: "integer",
            example: "10"
          }),
          albumCount: exports_external.string().pipe(exports_external.coerce.number()).optional().openapi({
            title: "Album count",
            description: "The number of albums to retrieve for the artist",
            type: "integer",
            example: "10"
          }),
          sortBy: exports_external.enum(["popularity", "latest", "alphabetical"]).optional().openapi({
            title: "Sort by",
            description: "The field to sort the results by",
            type: "string",
            example: "popularity",
            enum: ["popularity", "latest", "alphabetical"]
          }),
          sortOrder: exports_external.enum(["asc", "desc"]).optional().openapi({
            title: "Sort order",
            description: "The order to sort the results by",
            type: "string",
            example: "desc",
            enum: ["asc", "desc"]
          })
        })
      },
      responses: {
        200: {
          description: "Successful response with artist details",
          content: {
            "application/json": {
              schema: exports_external.object({
                success: exports_external.boolean().openapi({
                  description: "Indicates whether the request was successful",
                  type: "boolean",
                  example: true
                }),
                data: ArtistModel
              })
            }
          }
        },
        404: {
          description: "Artist not found for the given ID"
        }
      }
    }), async (ctx) => {
      const artistId = ctx.req.param("id");
      const { page, sortBy, sortOrder, songCount, albumCount } = ctx.req.valid("query");
      const response = await this.artistService.getArtistById({
        artistId,
        page: page || 0,
        songCount: songCount || 10,
        albumCount: albumCount || 10,
        sortBy: sortBy || "popularity",
        sortOrder: sortOrder || "asc"
      });
      return ctx.json({ success: true, data: response });
    });
    this.controller.openapi(createRoute({
      method: "get",
      path: "/artists/{id}/songs",
      tags: ["Artists"],
      summary: `Retrieve artist's songs`,
      description: "Retrieve a list of songs for a given artist by their ID, with optional sorting and pagination.",
      operationId: "getArtistSongs",
      request: {
        params: exports_external.object({
          id: exports_external.string().openapi({
            description: "ID of the artist to retrieve the songs for",
            type: "string",
            example: "1274170",
            default: "1274170"
          })
        }),
        query: exports_external.object({
          page: exports_external.string().pipe(exports_external.coerce.number()).optional().openapi({
            description: "The page number of the results to retrieve",
            type: "number",
            example: "0",
            default: "0"
          }),
          sortBy: exports_external.enum(["popularity", "latest", "alphabetical"]).optional().openapi({
            description: "The criterion to sort the songs by",
            type: "string",
            example: "popularity",
            enum: ["popularity", "latest", "alphabetical"],
            default: "popularity"
          }),
          sortOrder: exports_external.enum(["asc", "desc"]).optional().openapi({
            description: "The order to sort the songs",
            type: "string",
            example: "desc",
            enum: ["asc", "desc"],
            default: "desc"
          })
        })
      },
      responses: {
        200: {
          description: "Successful response with a list of songs for the artist",
          content: {
            "application/json": {
              schema: exports_external.object({
                success: exports_external.boolean().openapi({
                  description: "Indicates whether the request was successful",
                  type: "boolean",
                  example: true
                }),
                data: ArtistSongModel.openapi({
                  description: "An array of songs associated with the artist"
                })
              })
            }
          }
        },
        404: {
          description: "Artist not found for the given ID"
        }
      }
    }), async (ctx) => {
      const artistId = ctx.req.param("id");
      const { page, sortBy, sortOrder } = ctx.req.valid("query");
      const response = await this.artistService.getArtistSongs({
        artistId,
        page: page || 0,
        sortBy: sortBy || "popularity",
        sortOrder: sortOrder || "desc"
      });
      return ctx.json({ success: true, data: response });
    });
    this.controller.openapi(createRoute({
      method: "get",
      path: "/artists/{id}/albums",
      tags: ["Artists"],
      summary: `Retrieve artist's albums`,
      description: "Retrieve a list of albums for a given artist by their ID, with optional sorting and pagination.",
      operationId: "getArtistAlbums",
      request: {
        params: exports_external.object({
          id: exports_external.string().openapi({
            description: "ID of the artist to retrieve the albums for",
            type: "string",
            example: "1274170",
            default: "1274170"
          })
        }),
        query: exports_external.object({
          page: exports_external.string().pipe(exports_external.coerce.number()).optional().openapi({
            description: "The page number of the results to retrieve",
            type: "number",
            example: "0",
            default: "0"
          }),
          sortBy: exports_external.enum(["popularity", "latest", "alphabetical"]).optional().openapi({
            description: "The criterion to sort the albums by",
            type: "string",
            example: "popularity",
            enum: ["popularity", "latest", "alphabetical"],
            default: "popularity"
          }),
          sortOrder: exports_external.enum(["asc", "desc"]).optional().openapi({
            description: "The order to sort the albums",
            type: "string",
            example: "desc",
            enum: ["asc", "desc"],
            default: "desc"
          })
        })
      },
      responses: {
        200: {
          description: "Successful response with a list of albums for the artist",
          content: {
            "application/json": {
              schema: exports_external.object({
                success: exports_external.boolean().openapi({
                  description: "Indicates whether the request was successful",
                  type: "boolean",
                  example: true
                }),
                data: ArtistAlbumModel.openapi({
                  description: "An array of albums associated with the artist"
                })
              })
            }
          }
        },
        404: {
          description: "Artist not found for the given ID"
        }
      }
    }), async (ctx) => {
      const artistId = ctx.req.param("id");
      const { page, sortBy, sortOrder } = ctx.req.valid("query");
      const response = await this.artistService.getArtistAlbums({
        artistId,
        page: page || 0,
        sortBy: sortBy || "popularity",
        sortOrder: sortOrder || "desc"
      });
      return ctx.json({ success: true, data: response });
    });
  }
}

// src/modules/playlists/models/playlist.model.ts
var PlaylistAPIResponseModel = exports_external.object({
  id: exports_external.string(),
  title: exports_external.string(),
  subtitle: exports_external.string(),
  header_desc: exports_external.string(),
  type: exports_external.string(),
  perma_url: exports_external.string(),
  image: exports_external.string(),
  language: exports_external.string(),
  year: exports_external.string(),
  play_count: exports_external.string(),
  explicit_content: exports_external.string(),
  list_count: exports_external.string(),
  list_type: exports_external.string(),
  list: exports_external.array(SongAPIResponseModel),
  more_info: exports_external.object({
    uid: exports_external.string(),
    is_dolby_content: exports_external.boolean(),
    subtype: exports_external.array(exports_external.string()).default([]),
    last_updated: exports_external.string(),
    username: exports_external.string(),
    firstname: exports_external.string(),
    lastname: exports_external.string(),
    is_followed: exports_external.string(),
    isFY: exports_external.boolean(),
    follower_count: exports_external.string(),
    fan_count: exports_external.string(),
    playlist_type: exports_external.string(),
    share: exports_external.string(),
    sub_types: exports_external.array(exports_external.string()),
    images: exports_external.array(exports_external.string()),
    H2: exports_external.string().nullable(),
    subheading: exports_external.string(),
    video_count: exports_external.string(),
    artists: exports_external.array(exports_external.object({
      id: exports_external.string(),
      name: exports_external.string(),
      role: exports_external.string(),
      image: exports_external.string(),
      type: exports_external.string(),
      perma_url: exports_external.string()
    }))
  })
}).extend({
  description: exports_external.string()
});
var PlaylistModel = exports_external.object({
  id: exports_external.string(),
  name: exports_external.string(),
  description: exports_external.string().nullable(),
  year: exports_external.number().nullable(),
  type: exports_external.string(),
  playCount: exports_external.number().nullable(),
  language: exports_external.string(),
  explicitContent: exports_external.boolean(),
  songCount: exports_external.number().nullable(),
  url: exports_external.string(),
  image: exports_external.array(DownloadLinkModel),
  songs: exports_external.array(SongModel).nullable(),
  artists: exports_external.array(ArtistMapModel).nullable()
});

// src/modules/playlists/helpers/playlist.helper.ts
var createPlaylistPayload = (playlist) => ({
  id: playlist.id,
  name: playlist.title,
  description: playlist.header_desc,
  type: playlist.type,
  year: playlist.year ? Number(playlist.year) : null,
  playCount: playlist.play_count ? Number(playlist.play_count) : null,
  language: playlist.language,
  explicitContent: playlist.explicit_content === "1",
  url: playlist.perma_url,
  songCount: playlist.list_count ? Number(playlist.list_count) : null,
  artists: playlist.more_info.artists?.map(createArtistMapPayload) || null,
  image: createImageLinks(playlist.image),
  songs: playlist.list && playlist.list?.map(createSongPayload) || null
});

// src/modules/playlists/use-cases/get-playlist-by-id/get-playlist-by-id.use-case.ts
class GetPlaylistByIdUseCase {
  constructor() {}
  async execute({ id, limit, page }) {
    const { data } = await useFetch({
      endpoint: Endpoints.playlists.id,
      params: {
        listid: id,
        n: limit,
        p: page
      }
    });
    if (!data)
      throw new HTTPException(404, { message: "playlist not found" });
    const playlist = createPlaylistPayload(data);
    return {
      ...playlist,
      songCount: playlist?.songs?.length || null,
      songs: playlist?.songs?.slice(0, limit) || []
    };
  }
}

// src/modules/playlists/use-cases/get-playlist-by-link/get-playlist-by-link.use-case.ts
class GetPlaylistByLinkUseCase {
  constructor() {}
  async execute({ token, limit, page }) {
    const { data } = await useFetch({
      endpoint: Endpoints.albums.link,
      params: {
        token,
        n: limit,
        p: page,
        type: "playlist"
      }
    });
    if (!data)
      throw new HTTPException(404, { message: "playlist not found" });
    const playlist = createPlaylistPayload(data);
    return {
      ...playlist,
      songCount: playlist?.songs?.length || null,
      songs: playlist?.songs?.slice(0, limit) || []
    };
  }
}

// src/modules/playlists/services/playlist.service.ts
class PlaylistService {
  getPlaylistByIdUseCase;
  getPlaylistByLinkUseCase;
  constructor() {
    this.getPlaylistByIdUseCase = new GetPlaylistByIdUseCase;
    this.getPlaylistByLinkUseCase = new GetPlaylistByLinkUseCase;
  }
  getPlaylistById = (args) => {
    return this.getPlaylistByIdUseCase.execute(args);
  };
  getPlaylistByLink = (args) => {
    return this.getPlaylistByLinkUseCase.execute(args);
  };
}

// src/modules/playlists/controllers/playlist.controller.ts
class PlaylistController {
  controller;
  playlistService;
  constructor() {
    this.controller = new OpenAPIHono;
    this.playlistService = new PlaylistService;
  }
  initRoutes() {
    this.controller.openapi(createRoute({
      method: "get",
      path: "/playlists",
      tags: ["Playlist"],
      summary: "Retrieve a playlist by ID or link",
      description: "Retrieve a playlist by providing either an ID or a direct link to the playlist on JioSaavn.",
      operationId: "getPlaylistByIdOrLink",
      request: {
        query: exports_external.object({
          id: exports_external.string().optional().openapi({
            title: "Playlist ID",
            description: "The unique ID of the playlist",
            type: "string",
            example: "82914609",
            default: "82914609"
          }),
          link: exports_external.string().url().optional().transform((value) => {
            const matches = value?.match(/(?:jiosaavn\.com|saavn\.com)\/(?:featured|s\/playlist)\/[^/]+\/([^/]+)$|\/([^/]+)$/);
            const filteredMatches = matches?.filter((each) => each !== undefined);
            return filteredMatches && filteredMatches[filteredMatches?.length - 1 || 0] || undefined;
          }).openapi({
            title: "Playlist Link",
            description: "A direct link to the playlist on JioSaavn",
            type: "string",
            example: "https://www.jiosaavn.com/featured/its-indie-english/AMoxtXyKHoU_",
            default: "https://www.jiosaavn.com/featured/its-indie-english/AMoxtXyKHoU_"
          }),
          page: exports_external.string().pipe(exports_external.coerce.number()).optional().openapi({
            title: "Page Number",
            description: "The page number of the songs to retrieve from the playlist",
            type: "integer",
            example: "0",
            default: "0"
          }),
          limit: exports_external.string().pipe(exports_external.coerce.number()).optional().openapi({
            title: "Limit",
            description: "Number of songs to retrieve per page",
            type: "integer",
            example: "10",
            default: "10"
          })
        })
      },
      responses: {
        200: {
          description: "Successful response with playlist details",
          content: {
            "application/json": {
              schema: exports_external.object({
                success: exports_external.boolean().openapi({
                  description: "Indicates the success status of the request.",
                  type: "boolean",
                  example: true
                }),
                data: PlaylistModel.openapi({
                  title: "Playlist Details",
                  description: "The detailed information of the playlist."
                })
              })
            }
          }
        },
        400: { description: "Bad request due to missing or invalid query parameters." },
        404: { description: "The playlist could not be found with the provided ID or link." }
      }
    }), async (ctx) => {
      const { id, link: link2, page, limit } = ctx.req.valid("query");
      if (!link2 && !id) {
        return ctx.json({ success: false, message: "Either playlist ID or link is required" }, 400);
      }
      const response = link2 ? await this.playlistService.getPlaylistByLink({
        token: link2,
        page: page || 0,
        limit: limit || 10
      }) : await this.playlistService.getPlaylistById({
        id,
        page: page || 0,
        limit: limit || 10
      });
      return ctx.json({ success: true, data: response });
    });
  }
}

// src/api/index.ts
var config = { runtime: "nodejs" };
var app = new App([
  new SearchController,
  new SongController,
  new AlbumController,
  new ArtistController,
  new PlaylistController
]).getApp();
var api_default = handle(app);
export {
  api_default as default,
  config
};
