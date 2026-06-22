"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@asteasolutions/zod-to-openapi/dist/index.cjs
var require_dist = __commonJS({
  "node_modules/@asteasolutions/zod-to-openapi/dist/index.cjs"(exports2) {
    "use strict";
    function __rest(s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
            t[p[i]] = s[p[i]];
        }
      return t;
    }
    function isZodType(schema, typeName) {
      var _a;
      return ((_a = schema === null || schema === void 0 ? void 0 : schema._def) === null || _a === void 0 ? void 0 : _a.typeName) === typeName;
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
    function extendZodWithOpenApi2(zod) {
      if (typeof zod.ZodType.prototype.openapi !== "undefined") {
        return;
      }
      zod.ZodType.prototype.openapi = function(refOrOpenapi, metadata) {
        var _a, _b, _c, _d, _e, _f;
        const openapi = typeof refOrOpenapi === "string" ? metadata : refOrOpenapi;
        const _g = openapi !== null && openapi !== void 0 ? openapi : {}, { param } = _g, restOfOpenApi = __rest(_g, ["param"]);
        const _internal = Object.assign(Object.assign({}, (_a = this._def.openapi) === null || _a === void 0 ? void 0 : _a._internal), typeof refOrOpenapi === "string" ? { refId: refOrOpenapi } : void 0);
        const resultMetadata = Object.assign(Object.assign(Object.assign({}, (_b = this._def.openapi) === null || _b === void 0 ? void 0 : _b.metadata), restOfOpenApi), ((_d = (_c = this._def.openapi) === null || _c === void 0 ? void 0 : _c.metadata) === null || _d === void 0 ? void 0 : _d.param) || param ? {
          param: Object.assign(Object.assign({}, (_f = (_e = this._def.openapi) === null || _e === void 0 ? void 0 : _e.metadata) === null || _f === void 0 ? void 0 : _f.param), param)
        } : void 0);
        const result = new this.constructor(Object.assign(Object.assign({}, this._def), { openapi: Object.assign(Object.assign({}, Object.keys(_internal).length > 0 ? { _internal } : void 0), Object.keys(resultMetadata).length > 0 ? { metadata: resultMetadata } : void 0) }));
        if (isZodType(this, "ZodObject")) {
          const originalExtend = this.extend;
          result.extend = function(...args) {
            var _a2, _b2, _c2, _d2, _e2, _f2, _g2;
            const extendedResult = originalExtend.apply(this, args);
            extendedResult._def.openapi = {
              _internal: {
                extendedFrom: ((_b2 = (_a2 = this._def.openapi) === null || _a2 === void 0 ? void 0 : _a2._internal) === null || _b2 === void 0 ? void 0 : _b2.refId) ? { refId: (_d2 = (_c2 = this._def.openapi) === null || _c2 === void 0 ? void 0 : _c2._internal) === null || _d2 === void 0 ? void 0 : _d2.refId, schema: this } : (_f2 = (_e2 = this._def.openapi) === null || _e2 === void 0 ? void 0 : _e2._internal) === null || _f2 === void 0 ? void 0 : _f2.extendedFrom
              },
              metadata: (_g2 = extendedResult._def.openapi) === null || _g2 === void 0 ? void 0 : _g2.metadata
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
          value._def.openapi = (_b = (_a = initialShape[key]) === null || _a === void 0 ? void 0 : _a._def) === null || _b === void 0 ? void 0 : _b.openapi;
        });
        result._def.openapi = void 0;
        return result;
      };
      const zodPick = zod.ZodObject.prototype.pick;
      zod.ZodObject.prototype.pick = function(...args) {
        const result = zodPick.apply(this, args);
        result._def.openapi = void 0;
        return result;
      };
      const zodOmit = zod.ZodObject.prototype.omit;
      zod.ZodObject.prototype.omit = function(...args) {
        const result = zodOmit.apply(this, args);
        result._def.openapi = void 0;
        return result;
      };
    }
    function isEqual(x, y) {
      if (x === null || x === void 0 || y === null || y === void 0) {
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
    var ObjectSet = class {
      constructor() {
        this.buckets = /* @__PURE__ */ new Map();
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
          for (let i = 0; i < object.length; i++) {
            hashCode ^= this.hashCodeOf(object[i]) * i;
          }
          return hashCode;
        }
        if (typeof object === "string") {
          for (let i = 0; i < object.length; i++) {
            hashCode ^= object.charCodeAt(i) * i;
          }
          return hashCode;
        }
        if (typeof object === "number") {
          return object;
        }
        if (typeof object === "object") {
          for (const [key, value] of Object.entries(object)) {
            hashCode ^= this.hashCodeOf(key) + this.hashCodeOf(value !== null && value !== void 0 ? value : "");
          }
        }
        return hashCode;
      }
    };
    function isUndefined(value) {
      return value === void 0;
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
      const set = new ObjectSet();
      values.forEach((value) => set.put(value));
      return [...set.values()];
    }
    function isString(val) {
      return typeof val === "string";
    }
    function getOpenApiMetadata(zodSchema) {
      var _a, _b;
      return omitBy((_b = (_a = zodSchema._def.openapi) === null || _a === void 0 ? void 0 : _a.metadata) !== null && _b !== void 0 ? _b : {}, isUndefined);
    }
    var OpenAPIRegistry2 = class {
      constructor(parents) {
        this.parents = parents;
        this._definitions = [];
      }
      get definitions() {
        var _a, _b;
        const parentDefinitions = (_b = (_a = this.parents) === null || _a === void 0 ? void 0 : _a.flatMap((par) => par.definitions)) !== null && _b !== void 0 ? _b : [];
        return [...parentDefinitions, ...this._definitions];
      }
      /**
       * Registers a new component schema under /components/schemas/${name}
       */
      register(refId, zodSchema) {
        const schemaWithRefId = this.schemaWithRefId(refId, zodSchema);
        this._definitions.push({ type: "schema", schema: schemaWithRefId });
        return schemaWithRefId;
      }
      /**
       * Registers a new parameter schema under /components/parameters/${name}
       */
      registerParameter(refId, zodSchema) {
        var _a, _b, _c;
        const schemaWithRefId = this.schemaWithRefId(refId, zodSchema);
        const currentMetadata = (_a = schemaWithRefId._def.openapi) === null || _a === void 0 ? void 0 : _a.metadata;
        const schemaWithMetadata = schemaWithRefId.openapi(Object.assign(Object.assign({}, currentMetadata), { param: Object.assign(Object.assign({}, currentMetadata === null || currentMetadata === void 0 ? void 0 : currentMetadata.param), { name: (_c = (_b = currentMetadata === null || currentMetadata === void 0 ? void 0 : currentMetadata.param) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : refId }) }));
        this._definitions.push({
          type: "parameter",
          schema: schemaWithMetadata
        });
        return schemaWithMetadata;
      }
      /**
       * Registers a new path that would be generated under paths:
       */
      registerPath(route) {
        this._definitions.push({
          type: "route",
          route
        });
      }
      /**
       * Registers a new webhook that would be generated under webhooks:
       */
      registerWebhook(webhook) {
        this._definitions.push({
          type: "webhook",
          webhook
        });
      }
      /**
       * Registers a raw OpenAPI component. Use this if you have a simple object instead of a Zod schema.
       *
       * @param type The component type, e.g. `schemas`, `responses`, `securitySchemes`, etc.
       * @param name The name of the object, it is the key under the component
       *             type in the resulting OpenAPI document
       * @param component The actual object to put there
       */
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
    };
    var ZodToOpenAPIError = class {
      constructor(message) {
        this.message = message;
      }
    };
    var ConflictError = class extends ZodToOpenAPIError {
      constructor(message, data) {
        super(message);
        this.data = data;
      }
    };
    var MissingParameterDataError = class extends ZodToOpenAPIError {
      constructor(data) {
        super(`Missing parameter data, please specify \`${data.missingField}\` and other OpenAPI parameter props using the \`param\` field of \`ZodSchema.openapi\``);
        this.data = data;
      }
    };
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
    var UnknownZodTypeError = class extends ZodToOpenAPIError {
      constructor(data) {
        super(`Unknown zod object type, please specify \`type\` and other OpenAPI props using \`ZodSchema.openapi\`.`);
        this.data = data;
      }
    };
    var Metadata = class {
      static getMetadata(zodSchema) {
        var _a;
        const innerSchema = this.unwrapChained(zodSchema);
        const metadata = zodSchema._def.openapi ? zodSchema._def.openapi : innerSchema._def.openapi;
        const zodDescription = (_a = zodSchema.description) !== null && _a !== void 0 ? _a : innerSchema.description;
        return {
          _internal: metadata === null || metadata === void 0 ? void 0 : metadata._internal,
          metadata: Object.assign({ description: zodDescription }, metadata === null || metadata === void 0 ? void 0 : metadata.metadata)
        };
      }
      static getInternalMetadata(zodSchema) {
        const innerSchema = this.unwrapChained(zodSchema);
        const openapi = zodSchema._def.openapi ? zodSchema._def.openapi : innerSchema._def.openapi;
        return openapi === null || openapi === void 0 ? void 0 : openapi._internal;
      }
      static getParamMetadata(zodSchema) {
        var _a, _b;
        const innerSchema = this.unwrapChained(zodSchema);
        const metadata = zodSchema._def.openapi ? zodSchema._def.openapi : innerSchema._def.openapi;
        const zodDescription = (_a = zodSchema.description) !== null && _a !== void 0 ? _a : innerSchema.description;
        return {
          _internal: metadata === null || metadata === void 0 ? void 0 : metadata._internal,
          metadata: Object.assign(Object.assign({}, metadata === null || metadata === void 0 ? void 0 : metadata.metadata), {
            // A description provided from .openapi() should be taken with higher precedence
            param: Object.assign({ description: zodDescription }, (_b = metadata === null || metadata === void 0 ? void 0 : metadata.metadata) === null || _b === void 0 ? void 0 : _b.param)
          })
        };
      }
      /**
       * A method that omits all custom keys added to the regular OpenAPI
       * metadata properties
       */
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
        return (_a = this.getInternalMetadata(zodSchema)) === null || _a === void 0 ? void 0 : _a.refId;
      }
      static unwrapChained(schema) {
        return this.unwrapUntil(schema);
      }
      static getDefaultValue(zodSchema) {
        const unwrapped = this.unwrapUntil(zodSchema, "ZodDefault");
        return unwrapped === null || unwrapped === void 0 ? void 0 : unwrapped._def.defaultValue();
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
        return typeName ? void 0 : schema;
      }
      static isOptionalSchema(zodSchema) {
        return zodSchema.isOptional();
      }
    };
    var ArrayTransformer = class {
      transform(zodSchema, mapNullableType, mapItems) {
        var _a, _b;
        const itemType = zodSchema._def.type;
        return Object.assign(Object.assign({}, mapNullableType("array")), { items: mapItems(itemType), minItems: (_a = zodSchema._def.minLength) === null || _a === void 0 ? void 0 : _a.value, maxItems: (_b = zodSchema._def.maxLength) === null || _b === void 0 ? void 0 : _b.value });
      }
    };
    var BigIntTransformer = class {
      transform(mapNullableType) {
        return Object.assign(Object.assign({}, mapNullableType("string")), { pattern: `^d+$` });
      }
    };
    var DiscriminatedUnionTransformer = class {
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
        if (zodObjects.some((obj) => Metadata.getRefId(obj) === void 0)) {
          return void 0;
        }
        const mapping = {};
        zodObjects.forEach((obj) => {
          var _a;
          const refId = Metadata.getRefId(obj);
          const value = (_a = obj.shape) === null || _a === void 0 ? void 0 : _a[discriminator];
          if (isZodType(value, "ZodEnum") || isZodType(value, "ZodNativeEnum")) {
            const keys = Object.values(value.enum).filter(isString);
            keys.forEach((enumValue) => {
              mapping[enumValue] = generateSchemaRef(refId);
            });
            return;
          }
          const literalValue = value === null || value === void 0 ? void 0 : value._def.value;
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
    };
    var EnumTransformer = class {
      transform(zodSchema, mapNullableType) {
        return Object.assign(Object.assign({}, mapNullableType("string")), { enum: zodSchema._def.values });
      }
    };
    var IntersectionTransformer = class {
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
    };
    var LiteralTransformer = class {
      transform(zodSchema, mapNullableType) {
        return Object.assign(Object.assign({}, mapNullableType(typeof zodSchema._def.value)), { enum: [zodSchema._def.value] });
      }
    };
    function enumInfo(enumObject) {
      const keysExceptReverseMappings = Object.keys(enumObject).filter((key) => typeof enumObject[enumObject[key]] !== "number");
      const values = keysExceptReverseMappings.map((key) => enumObject[key]);
      const numericCount = values.filter((_) => typeof _ === "number").length;
      const type = numericCount === 0 ? "string" : numericCount === values.length ? "numeric" : "mixed";
      return { values, type };
    }
    var NativeEnumTransformer = class {
      transform(zodSchema, mapNullableType) {
        const { type, values } = enumInfo(zodSchema._def.values);
        if (type === "mixed") {
          throw new ZodToOpenAPIError("Enum has mixed string and number values, please specify the OpenAPI type manually");
        }
        return Object.assign(Object.assign({}, mapNullableType(type === "numeric" ? "integer" : "string")), { enum: values });
      }
    };
    var NumberTransformer = class {
      transform(zodSchema, mapNullableType, getNumberChecks) {
        return Object.assign(Object.assign({}, mapNullableType(zodSchema.isInt ? "integer" : "number")), getNumberChecks(zodSchema._def.checks));
      }
    };
    var ObjectTransformer = class {
      transform(zodSchema, defaultValue, mapNullableType, mapItem) {
        var _a;
        const extendedFrom = (_a = Metadata.getInternalMetadata(zodSchema)) === null || _a === void 0 ? void 0 : _a.extendedFrom;
        const required = this.requiredKeysOf(zodSchema);
        const properties = mapValues(zodSchema._def.shape(), mapItem);
        if (!extendedFrom) {
          return Object.assign(Object.assign(Object.assign(Object.assign({}, mapNullableType("object")), { properties, default: defaultValue }), required.length > 0 ? { required } : {}), this.generateAdditionalProperties(zodSchema, mapItem));
        }
        const parent = extendedFrom.schema;
        mapItem(parent);
        const keysRequiredByParent = this.requiredKeysOf(parent);
        const propsOfParent = mapValues(parent === null || parent === void 0 ? void 0 : parent._def.shape(), mapItem);
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
    };
    var RecordTransformer = class {
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
    };
    var StringTransformer = class {
      transform(zodSchema, mapNullableType) {
        var _a, _b, _c;
        const regexCheck = this.getZodStringCheck(zodSchema, "regex");
        const length = (_a = this.getZodStringCheck(zodSchema, "length")) === null || _a === void 0 ? void 0 : _a.value;
        const maxLength = Number.isFinite(zodSchema.minLength) ? (_b = zodSchema.minLength) !== null && _b !== void 0 ? _b : void 0 : void 0;
        const minLength = Number.isFinite(zodSchema.maxLength) ? (_c = zodSchema.maxLength) !== null && _c !== void 0 ? _c : void 0 : void 0;
        return Object.assign(Object.assign({}, mapNullableType("string")), {
          // FIXME: https://github.com/colinhacks/zod/commit/d78047e9f44596a96d637abb0ce209cd2732d88c
          minLength: length !== null && length !== void 0 ? length : maxLength,
          maxLength: length !== null && length !== void 0 ? length : minLength,
          format: this.mapStringFormat(zodSchema),
          pattern: regexCheck === null || regexCheck === void 0 ? void 0 : regexCheck.regex.source
        });
      }
      /**
       * Attempts to map Zod strings to known formats
       * https://json-schema.org/understanding-json-schema/reference/string.html#built-in-formats
       */
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
        return void 0;
      }
      getZodStringCheck(zodString, kind) {
        return zodString._def.checks.find((check) => {
          return check.kind === kind;
        });
      }
    };
    var TupleTransformer = class {
      constructor(versionSpecifics) {
        this.versionSpecifics = versionSpecifics;
      }
      transform(zodSchema, mapNullableType, mapItem) {
        const { items } = zodSchema._def;
        const schemas = items.map(mapItem);
        return Object.assign(Object.assign({}, mapNullableType("array")), this.versionSpecifics.mapTupleItems(schemas));
      }
    };
    var UnionTransformer = class {
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
    };
    var OpenApiTransformer = class {
      constructor(versionSpecifics) {
        this.versionSpecifics = versionSpecifics;
        this.objectTransformer = new ObjectTransformer();
        this.stringTransformer = new StringTransformer();
        this.numberTransformer = new NumberTransformer();
        this.bigIntTransformer = new BigIntTransformer();
        this.literalTransformer = new LiteralTransformer();
        this.enumTransformer = new EnumTransformer();
        this.nativeEnumTransformer = new NativeEnumTransformer();
        this.arrayTransformer = new ArrayTransformer();
        this.unionTransformer = new UnionTransformer();
        this.discriminatedUnionTransformer = new DiscriminatedUnionTransformer();
        this.intersectionTransformer = new IntersectionTransformer();
        this.recordTransformer = new RecordTransformer();
        this.tupleTransformer = new TupleTransformer(versionSpecifics);
      }
      transform(zodSchema, isNullable, mapItem, generateSchemaRef, defaultValue) {
        if (isZodType(zodSchema, "ZodNull")) {
          return this.versionSpecifics.nullType;
        }
        if (isZodType(zodSchema, "ZodUnknown") || isZodType(zodSchema, "ZodAny")) {
          return this.versionSpecifics.mapNullableType(void 0, isNullable);
        }
        if (isZodType(zodSchema, "ZodObject")) {
          return this.objectTransformer.transform(
            zodSchema,
            defaultValue,
            // verified on TS level from input
            // verified on TS level from input
            (_) => this.versionSpecifics.mapNullableType(_, isNullable),
            mapItem
          );
        }
        const schema = this.transformSchemaWithoutDefault(zodSchema, isNullable, mapItem, generateSchemaRef);
        return Object.assign(Object.assign({}, schema), { default: defaultValue });
      }
      transformSchemaWithoutDefault(zodSchema, isNullable, mapItem, generateSchemaRef) {
        if (isZodType(zodSchema, "ZodUnknown") || isZodType(zodSchema, "ZodAny")) {
          return this.versionSpecifics.mapNullableType(void 0, isNullable);
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
    };
    var OpenAPIGenerator = class {
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
          (_a2 = rawComponents[componentType]) !== null && _a2 !== void 0 ? _a2 : rawComponents[componentType] = {};
          rawComponents[componentType][name] = component;
        });
        return Object.assign(Object.assign({}, rawComponents), { schemas: Object.assign(Object.assign({}, (_a = rawComponents.schemas) !== null && _a !== void 0 ? _a : {}), this.schemaRefs), parameters: Object.assign(Object.assign({}, (_b = rawComponents.parameters) !== null && _b !== void 0 ? _b : {}), this.paramRefs) });
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
        const parameterMetadata = (_a = schemaMetadata === null || schemaMetadata === void 0 ? void 0 : schemaMetadata.metadata) === null || _a === void 0 ? void 0 : _a.param;
        const existingRef = ((_b = schemaMetadata === null || schemaMetadata === void 0 ? void 0 : schemaMetadata._internal) === null || _b === void 0 ? void 0 : _b.refId) ? this.paramRefs[(_c = schemaMetadata._internal) === null || _c === void 0 ? void 0 : _c.refId] : void 0;
        if (!((_d = schemaMetadata === null || schemaMetadata === void 0 ? void 0 : schemaMetadata._internal) === null || _d === void 0 ? void 0 : _d.refId) || !existingRef) {
          return void 0;
        }
        if (parameterMetadata && existingRef.in !== parameterMetadata.in || (external === null || external === void 0 ? void 0 : external.in) && existingRef.in !== external.in) {
          throw new ConflictError(`Conflicting location for parameter ${existingRef.name}`, {
            key: "in",
            values: compact([
              existingRef.in,
              external === null || external === void 0 ? void 0 : external.in,
              parameterMetadata === null || parameterMetadata === void 0 ? void 0 : parameterMetadata.in
            ])
          });
        }
        if (parameterMetadata && existingRef.name !== parameterMetadata.name || (external === null || external === void 0 ? void 0 : external.name) && existingRef.name !== (external === null || external === void 0 ? void 0 : external.name)) {
          throw new ConflictError(`Conflicting names for parameter`, {
            key: "name",
            values: compact([
              existingRef.name,
              external === null || external === void 0 ? void 0 : external.name,
              parameterMetadata === null || parameterMetadata === void 0 ? void 0 : parameterMetadata.name
            ])
          });
        }
        return {
          $ref: `#/components/parameters/${(_e = schemaMetadata._internal) === null || _e === void 0 ? void 0 : _e.refId}`
        };
      }
      generateInlineParameters(zodSchema, location) {
        var _a;
        const metadata = Metadata.getMetadata(zodSchema);
        const parameterMetadata = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.metadata) === null || _a === void 0 ? void 0 : _a.param;
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
            const innerParameterMetadata = (_a2 = innerMetadata === null || innerMetadata === void 0 ? void 0 : innerMetadata.metadata) === null || _a2 === void 0 ? void 0 : _a2.param;
            if ((innerParameterMetadata === null || innerParameterMetadata === void 0 ? void 0 : innerParameterMetadata.name) && innerParameterMetadata.name !== key) {
              throw new ConflictError(`Conflicting names for parameter`, {
                key: "name",
                values: [key, innerParameterMetadata.name]
              });
            }
            if ((innerParameterMetadata === null || innerParameterMetadata === void 0 ? void 0 : innerParameterMetadata.in) && innerParameterMetadata.in !== location) {
              throw new ConflictError(`Conflicting location for parameter ${(_b = innerParameterMetadata.name) !== null && _b !== void 0 ? _b : key}`, {
                key: "in",
                values: [location, innerParameterMetadata.in]
              });
            }
            return this.generateParameter(schema.openapi({ param: { name: key, in: location } }));
          });
          return parameters;
        }
        if ((parameterMetadata === null || parameterMetadata === void 0 ? void 0 : parameterMetadata.in) && parameterMetadata.in !== location) {
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
        const paramMetadata = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.metadata) === null || _a === void 0 ? void 0 : _a.param;
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
        const paramMetadata = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.metadata) === null || _a === void 0 ? void 0 : _a.param;
        const paramName = paramMetadata === null || paramMetadata === void 0 ? void 0 : paramMetadata.name;
        const paramLocation = paramMetadata === null || paramMetadata === void 0 ? void 0 : paramMetadata.in;
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
        const result = ((_a = metadata === null || metadata === void 0 ? void 0 : metadata.metadata) === null || _a === void 0 ? void 0 : _a.type) ? { type: metadata === null || metadata === void 0 ? void 0 : metadata.metadata.type } : this.toOpenAPISchema(innerSchema, zodSchema.isNullable(), defaultValue);
        return (metadata === null || metadata === void 0 ? void 0 : metadata.metadata) ? Metadata.applySchemaMetadata(result, metadata.metadata) : omitBy(result, isUndefined);
      }
      /**
       * Same as above but applies nullable
       */
      constructReferencedOpenAPISchema(zodSchema) {
        var _a;
        const metadata = Metadata.getMetadata(zodSchema);
        const innerSchema = Metadata.unwrapChained(zodSchema);
        const defaultValue = Metadata.getDefaultValue(zodSchema);
        const isNullableSchema = zodSchema.isNullable();
        if ((_a = metadata === null || metadata === void 0 ? void 0 : metadata.metadata) === null || _a === void 0 ? void 0 : _a.type) {
          return this.versionSpecifics.mapNullableType(metadata.metadata.type, isNullableSchema);
        }
        return this.toOpenAPISchema(innerSchema, isNullableSchema, defaultValue);
      }
      /**
       * Generates an OpenAPI SchemaObject or a ReferenceObject with all the provided metadata applied
       */
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
        const newMetadata = omitBy(Metadata.buildSchemaMetadata((_a = metadata === null || metadata === void 0 ? void 0 : metadata.metadata) !== null && _a !== void 0 ? _a : {}), (value, key) => value === void 0 || objectEquals(value, schemaRef[key]));
        if (newMetadata.type) {
          return {
            allOf: [referenceObject, newMetadata]
          };
        }
        const newSchemaMetadata = omitBy(this.constructReferencedOpenAPISchema(zodSchema), (value, key) => value === void 0 || objectEquals(value, schemaRef[key]));
        const appliedMetadata = Metadata.applySchemaMetadata(newSchemaMetadata, newMetadata);
        if (Object.keys(appliedMetadata).length > 0) {
          return {
            allOf: [referenceObject, appliedMetadata]
          };
        }
        return referenceObject;
      }
      /**
       * Same as `generateSchema` but if the new schema is added into the
       * referenced schemas, it would return a ReferenceObject and not the
       * whole result.
       *
       * Should be used for nested objects, arrays, etc.
       */
      generateSchemaWithRef(zodSchema) {
        const refId = Metadata.getRefId(zodSchema);
        const result = this.generateSimpleSchema(zodSchema);
        if (refId && this.schemaRefs[refId] === void 0) {
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
          return void 0;
        }
        return isZodType(schema, "ZodEffects") ? this.cleanParameter(schema._def.schema) : schema;
      }
      generatePath(route) {
        const { method, path, request, responses } = route, pathItemConfig = __rest(route, ["method", "path", "request", "responses"]);
        const generatedResponses = mapValues(responses, (response) => {
          return this.getResponse(response);
        });
        const parameters = enhanceMissingParametersError(() => this.getParameters(request), { route: `${method} ${path}` });
        const requestBody = this.getRequestBody(request === null || request === void 0 ? void 0 : request.body);
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
        const responseHeaders = isZodType(headers, "ZodObject") ? this.getResponseHeaders(headers) : (
          // This is input data so it is okay to cast in the common generator
          // since this is the user's responsibility to keep it correct
          headers
        );
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
        return mapValues(content, (config2) => {
          if (!config2 || !isAnyZodType(config2.schema)) {
            return config2;
          }
          const { schema: configSchema } = config2, rest = __rest(config2, ["schema"]);
          const schema = this.generateSchemaWithRef(configSchema);
          return Object.assign({ schema }, rest);
        });
      }
      toOpenAPISchema(zodSchema, isNullable, defaultValue) {
        return this.openApiTransformer.transform(zodSchema, isNullable, (_) => this.generateSchemaWithRef(_), (_) => this.generateSchemaRef(_), defaultValue);
      }
    };
    var OpenApiGeneratorV30Specifics = class {
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
        return Object.assign(Object.assign({}, type ? { type } : void 0), isNullable ? this.nullType : void 0);
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
    };
    var OpenApiGeneratorV32 = class {
      constructor(definitions) {
        const specifics = new OpenApiGeneratorV30Specifics();
        this.generator = new OpenAPIGenerator(definitions, specifics);
      }
      generateDocument(config2) {
        const baseData = this.generator.generateDocumentData();
        return Object.assign(Object.assign({}, config2), baseData);
      }
      generateComponents() {
        return this.generator.generateComponents();
      }
    };
    var OpenApiGeneratorV31Specifics = class {
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
    };
    function isWebhookDefinition(definition) {
      return "type" in definition && definition.type === "webhook";
    }
    var OpenApiGeneratorV312 = class {
      constructor(definitions) {
        this.definitions = definitions;
        this.webhookRefs = {};
        const specifics = new OpenApiGeneratorV31Specifics();
        this.generator = new OpenAPIGenerator(this.definitions, specifics);
      }
      generateDocument(config2) {
        const baseDocument = this.generator.generateDocumentData();
        this.definitions.filter(isWebhookDefinition).forEach((definition) => this.generateSingleWebhook(definition.webhook));
        return Object.assign(Object.assign(Object.assign({}, config2), baseDocument), { webhooks: this.webhookRefs });
      }
      generateComponents() {
        return this.generator.generateComponents();
      }
      generateSingleWebhook(route) {
        const routeDoc = this.generator.generatePath(route);
        this.webhookRefs[route.path] = Object.assign(Object.assign({}, this.webhookRefs[route.path]), routeDoc);
        return routeDoc;
      }
    };
    exports2.OpenAPIRegistry = OpenAPIRegistry2;
    exports2.OpenApiGeneratorV3 = OpenApiGeneratorV32;
    exports2.OpenApiGeneratorV31 = OpenApiGeneratorV312;
    exports2.extendZodWithOpenApi = extendZodWithOpenApi2;
    exports2.getOpenApiMetadata = getOpenApiMetadata;
  }
});

// src/api/index.ts
var index_exports = {};
__export(index_exports, {
  config: () => config,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);

// node_modules/hono/dist/adapter/vercel/handler.js
var handle = (app2) => (req) => {
  return app2.fetch(req);
};

// node_modules/@hono/zod-openapi/dist/index.js
var import_zod_to_openapi = __toESM(require_dist(), 1);

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
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
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
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
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
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
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
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
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
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
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
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
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
      return void 0;
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
  /**
   * Creates an instance of `HTTPException`.
   * @param status - HTTP status code for the exception. Defaults to 500.
   * @param options - Additional options for the exception.
   */
  constructor(status = 500, options) {
    super(options?.message, { cause: options?.cause });
    this.res = options?.res;
    this.status = status;
  }
  /**
   * Returns the response object associated with the exception.
   * If a response object is not provided, a new response is created with the error message and status code.
   * @returns The response object.
   */
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
        const form2 = /* @__PURE__ */ Object.create(null);
        formData.forEach((value2, key) => {
          if (key.endsWith("[]")) {
            ;
            (form2[key] ??= []).push(value2);
          } else if (Array.isArray(form2[key])) {
            ;
            form2[key].push(value2);
          } else if (Object.hasOwn(form2, key)) {
            form2[key] = [form2[key], value2];
          } else {
            form2[key] = value2;
          }
        });
        value = form2;
        break;
      }
      case "query":
        value = Object.fromEntries(
          Object.entries(c.req.queries()).map(([k, v]) => {
            return v.length === 1 ? [k, v[0]] : [k, v];
          })
        );
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
        if (hookResult instanceof Response) return hookResult;
        if ("response" in hookResult) return hookResult.response;
      }
    }
    if (!result.success) return c.json(result, 400);
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
        handler = i === middleware.length && next || void 0;
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
  const form2 = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form2[key] = value;
    } else {
      handleParsingAllValues(form2, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form2).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form2, key, value);
        delete form2[key];
      }
    });
  }
  return form2;
}
var handleParsingAllValues = (form2, key, value) => {
  if (form2[key] !== void 0) {
    if (Array.isArray(form2[key])) {
      ;
      form2[key].push(value);
    } else {
      form2[key] = [form2[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form2[key] = value;
    } else {
      form2[key] = [value];
    }
  }
};
var handleParsingNestedValues = (form2, key, value) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form2;
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
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
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
      if (value !== void 0) {
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
      return this.raw.headers.get(name) ?? void 0;
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
    const { bodyCache, raw: raw2 } = this;
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
    return bodyCache[key] = raw2[key]();
  };
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
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
  for (let i = resolvedBuffer.length - 1; ; i--) {
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
  const match2 = str.search(escapeRe);
  if (match2 === -1) {
    buffer[0] += str;
    return;
  }
  let escape;
  let index;
  let lastIndex = 0;
  for (index = match2; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34:
        escape = "&quot;";
        break;
      case 39:
        escape = "&#39;";
        break;
      case 38:
        escape = "&amp;";
        break;
      case 60:
        escape = "&lt;";
        break;
      case 62:
        escape = "&gt;";
        break;
      default:
        continue;
    }
    buffer[0] += str.substring(lastIndex, index) + escape;
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
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
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
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
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
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
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
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
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
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = (layout) => this.#layout = layout;
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = () => this.#layout;
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = (name, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
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
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  };
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = (key) => {
    return this.#var ? this.#var.get(key) : void 0;
  };
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
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
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = (text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  };
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = (object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  };
  html = (html2, arg, headers) => {
    const res = (html22) => this.#newResponse(html22, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
    return typeof html2 === "object" ? resolveCallback(html2, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html2);
  };
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = (location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  };
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
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
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
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
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = (handler) => {
    this.#notFoundHandler = handler;
    return this;
  };
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
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
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
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
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} Env - env Object
   * @param {ExecutionContext} - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = (input2, requestInit, Env, executionCtx) => {
    if (input2 instanceof Request) {
      return this.fetch(requestInit ? new Request(input2, requestInit) : input2, Env, executionCtx);
    }
    input2 = input2.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input2) ? input2 : `http://localhost${mergePath("/", input2)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  };
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  };
};

// node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = ((method2, path2) => {
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
  });
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
      if (this.#index !== void 0) {
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
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new _Node();
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
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new _Node();
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
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
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
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
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
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
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
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
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
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
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
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
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
      ;
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
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
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
    this.#middleware = this.#routes = void 0;
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
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
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
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
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
      this.#routes = void 0;
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
    for (let i = 0, len = parts.length; i < len; i++) {
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
      curNode.#children[key] = new _Node2();
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
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
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
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
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
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
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
              for (let p = 0; p < len; p++) {
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
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  params,
                  node.#params
                );
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
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
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
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
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
    return void 0;
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
      // second overwrites first
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
var ZodError = class _ZodError extends Error {
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
    if (!(value instanceof _ZodError)) {
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
};
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
  if (issueData.message !== void 0) {
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
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
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
    return _ParseStatus.mergeObjectSync(status, syncPairs);
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
};
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
var ParseInputLazyPath = class {
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
};
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
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input2) {
    return getParsedType(input2.data);
  }
  _getOrReturnCtx(input2, ctx) {
    return ctx || {
      common: input2.parent.common,
      data: input2.data,
      parsedType: getParsedType(input2.data),
      schemaErrorMap: this._def.errorMap,
      path: input2.path,
      parent: input2.parent
    };
  }
  _processInputParams(input2) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input2.parent.common,
        data: input2.data,
        parsedType: getParsedType(input2.data),
        schemaErrorMap: this._def.errorMap,
        path: input2.path,
        parent: input2.parent
      }
    };
  }
  _parseSync(input2) {
    const result = this._parse(input2);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input2) {
    const result = this._parse(input2);
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
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
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
var ZodString = class _ZodString extends ZodType {
  _parse(input2) {
    if (this._def.coerce) {
      input2.data = String(input2.data);
    }
    const parsedType = this._getType(input2);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input2);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input2.data.length < check.value) {
          ctx = this._getOrReturnCtx(input2, ctx);
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
        if (input2.data.length > check.value) {
          ctx = this._getOrReturnCtx(input2, ctx);
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
        const tooBig = input2.data.length > check.value;
        const tooSmall = input2.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input2, ctx);
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
        if (!emailRegex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
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
        if (!emojiRegex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input2.data);
        } catch {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input2.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input2.data = input2.data.trim();
      } else if (check.kind === "includes") {
        if (!input2.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input2.data = input2.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input2.data = input2.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input2.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input2.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input2.data, check.version)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input2.data, check.alg)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input2.data, check.version)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
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
    return { status: status.value, value: input2.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
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
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
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
};
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
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input2) {
    if (this._def.coerce) {
      input2.data = Number(input2.data);
    }
    const parsedType = this._getType(input2);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input2);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input2.data < check.value : input2.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input2, ctx);
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
        const tooBig = check.inclusive ? input2.data > check.value : input2.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input2, ctx);
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
        if (floatSafeRemainder(input2.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input2, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input2.data)) {
          ctx = this._getOrReturnCtx(input2, ctx);
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
    return { status: status.value, value: input2.data };
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
    return new _ZodNumber({
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
    return new _ZodNumber({
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
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input2) {
    if (this._def.coerce) {
      try {
        input2.data = BigInt(input2.data);
      } catch {
        return this._getInvalidInput(input2);
      }
    }
    const parsedType = this._getType(input2);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input2);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input2.data < check.value : input2.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input2, ctx);
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
        const tooBig = check.inclusive ? input2.data > check.value : input2.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input2, ctx);
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
        if (input2.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input2, ctx);
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
    return { status: status.value, value: input2.data };
  }
  _getInvalidInput(input2) {
    const ctx = this._getOrReturnCtx(input2);
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
    return new _ZodBigInt({
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
    return new _ZodBigInt({
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
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input2) {
    if (this._def.coerce) {
      input2.data = Boolean(input2.data);
    }
    const parsedType = this._getType(input2);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input2);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input2.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input2) {
    if (this._def.coerce) {
      input2.data = new Date(input2.data);
    }
    const parsedType = this._getType(input2);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input2);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input2.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input2);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input2.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input2, ctx);
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
        if (input2.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input2, ctx);
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
      value: new Date(input2.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
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
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input2) {
    const parsedType = this._getType(input2);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input2);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input2.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input2) {
    const parsedType = this._getType(input2);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input2);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input2.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input2) {
    const parsedType = this._getType(input2);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input2);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input2.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input2) {
    return OK(input2.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input2) {
    return OK(input2.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input2) {
    const ctx = this._getOrReturnCtx(input2);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input2) {
    const parsedType = this._getType(input2);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input2);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input2.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input2) {
    const { ctx, status } = this._processInputParams(input2);
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
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
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
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
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
var ZodObject = class _ZodObject extends ZodType {
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
  _parse(input2) {
    const parsedType = this._getType(input2);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input2);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input2);
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
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
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
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
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
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
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
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
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
    return new _ZodObject({
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
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
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
    return new _ZodObject({
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
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
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
var ZodUnion = class extends ZodType {
  _parse(input2) {
    const { ctx } = this._processInputParams(input2);
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
      let dirty = void 0;
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
};
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
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
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
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input2) {
    const { ctx } = this._processInputParams(input2);
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
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
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
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
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
    for (let index = 0; index < a.length; index++) {
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
var ZodIntersection = class extends ZodType {
  _parse(input2) {
    const { status, ctx } = this._processInputParams(input2);
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
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input2) {
    const { status, ctx } = this._processInputParams(input2);
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
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
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
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input2) {
    const { status, ctx } = this._processInputParams(input2);
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
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input2) {
    const { status, ctx } = this._processInputParams(input2);
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
      const finalMap = /* @__PURE__ */ new Map();
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
      const finalMap = /* @__PURE__ */ new Map();
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
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input2) {
    const { status, ctx } = this._processInputParams(input2);
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
      const parsedSet = /* @__PURE__ */ new Set();
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
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
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
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input2) {
    const { ctx } = this._processInputParams(input2);
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
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
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
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input2) {
    const { ctx } = this._processInputParams(input2);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input2) {
    if (input2.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input2);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input2.data };
  }
  get value() {
    return this._def.value;
  }
};
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
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input2) {
    if (typeof input2.data !== "string") {
      const ctx = this._getOrReturnCtx(input2);
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
    if (!this._cache.has(input2.data)) {
      const ctx = this._getOrReturnCtx(input2);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input2.data);
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
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input2) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input2);
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
    if (!this._cache.has(input2.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input2.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input2) {
    const { ctx } = this._processInputParams(input2);
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
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input2) {
    const { status, ctx } = this._processInputParams(input2);
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
};
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
var ZodOptional = class extends ZodType {
  _parse(input2) {
    const parsedType = this._getType(input2);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input2);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input2) {
    const parsedType = this._getType(input2);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input2);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input2) {
    const { ctx } = this._processInputParams(input2);
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
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input2) {
    const { ctx } = this._processInputParams(input2);
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
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input2) {
    const parsedType = this._getType(input2);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input2);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input2.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = /* @__PURE__ */ Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input2) {
    const { ctx } = this._processInputParams(input2);
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
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input2) {
    const { status, ctx } = this._processInputParams(input2);
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
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input2) {
    const result = this._def.innerType._parse(input2);
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
};
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
  string: ((arg) => ZodString.create({ ...arg, coerce: true })),
  number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
  boolean: ((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  })),
  bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
  date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
};
var NEVER = INVALID;

// node_modules/@hono/zod-openapi/dist/index.js
var OpenAPIHono = class _OpenAPIHono extends Hono2 {
  openAPIRegistry;
  defaultHook;
  constructor(init) {
    super(init);
    this.openAPIRegistry = new import_zod_to_openapi.OpenAPIRegistry();
    this.defaultHook = init?.defaultHook;
  }
  /**
   *
   * @param {RouteConfig} route - The route definition which you create with `createRoute()`.
   * @param {Handler} handler - The handler. If you want to return a JSON object, you should specify the status code with `c.json()`.
   * @param {Hook} hook - Optional. The hook method defines what it should do after validation.
   * @example
   * app.openapi(
   *   route,
   *   (c) => {
   *     // ...
   *     return c.json(
   *       {
   *         age: 20,
   *         name: 'Young man',
   *       },
   *       200 // You should specify the status code even if it's 200.
   *     )
   *   },
   *  (result, c) => {
   *    if (!result.success) {
   *      return c.json(
   *        {
   *          code: 400,
   *          message: 'Custom Message',
   *        },
   *        400
   *      )
   *    }
   *  }
   *)
   */
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
    this.on(
      [route.method],
      route.path.replaceAll(/\/{(.+?)}/g, "/:$1"),
      ...middleware,
      ...validators,
      handler
    );
    return this;
  };
  getOpenAPIDocument = (config2) => {
    const generator = new import_zod_to_openapi.OpenApiGeneratorV3(this.openAPIRegistry.definitions);
    const document = generator.generateDocument(config2);
    return this._basePath ? addBasePathToDocument(document, this._basePath) : document;
  };
  getOpenAPI31Document = (config2) => {
    const generator = new import_zod_to_openapi.OpenApiGeneratorV31(this.openAPIRegistry.definitions);
    const document = generator.generateDocument(config2);
    return this._basePath ? addBasePathToDocument(document, this._basePath) : document;
  };
  doc = (path, configure) => {
    return this.get(path, (c) => {
      const config2 = typeof configure === "function" ? configure(c) : configure;
      try {
        const document = this.getOpenAPIDocument(config2);
        return c.json(document);
      } catch (e) {
        return c.json(e, 500);
      }
    });
  };
  doc31 = (path, configure) => {
    return this.get(path, (c) => {
      const config2 = typeof configure === "function" ? configure(c) : configure;
      try {
        const document = this.getOpenAPI31Document(config2);
        return c.json(document);
      } catch (e) {
        return c.json(e, 500);
      }
    });
  };
  route(path, app2) {
    const pathForOpenAPI = path.replaceAll(/:([^\/]+)/g, "{$1}");
    super.route(path, app2);
    if (!(app2 instanceof _OpenAPIHono)) {
      return this;
    }
    app2.openAPIRegistry.definitions.forEach((def) => {
      switch (def.type) {
        case "component":
          return this.openAPIRegistry.registerComponent(def.componentType, def.name, def.component);
        case "route": {
          this.openAPIRegistry.registerPath({
            ...def.route,
            path: mergePath(
              pathForOpenAPI,
              // @ts-expect-error _basePath is private
              app2._basePath.replaceAll(/:([^\/]+)/g, "{$1}"),
              def.route.path
            )
          });
          return;
        }
        case "webhook": {
          this.openAPIRegistry.registerWebhook({
            ...def.webhook,
            path: mergePath(
              pathForOpenAPI,
              // @ts-expect-error _basePath is private
              app2._basePath.replaceAll(/:([^\/]+)/g, "{$1}"),
              def.webhook.path
            )
          });
          return;
        }
        case "schema":
          return this.openAPIRegistry.register(def.schema._def.openapi._internal.refId, def.schema);
        case "parameter":
          return this.openAPIRegistry.registerParameter(
            def.schema._def.openapi._internal.refId,
            def.schema
          );
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
(0, import_zod_to_openapi.extendZodWithOpenApi)(external_exports);
function addBasePathToDocument(document, basePath) {
  const updatedPaths = {};
  Object.keys(document.paths).forEach((path) => {
    updatedPaths[mergePath(basePath.replaceAll(/:([^\/]+)/g, "{$1}"), path)] = document.paths[path];
  });
  return {
    ...document,
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
  const lines = str.split("\n");
  return lines.map((line, index) => {
    if (index === 0 && !initialIndent) {
      return line;
    }
    return `${indent}${line}`;
  }).join("\n");
};
var getStyles = (configuration, customTheme2) => {
  const styles = [];
  if (configuration.customCss) {
    styles.push("/* Custom CSS */");
    styles.push(configuration.customCss);
  }
  if (!configuration.theme && customTheme2) {
    styles.push("/* Custom Theme */");
    styles.push(customTheme2);
  }
  if (styles.length === 0) {
    return "";
  }
  return `
    <style type="text/css">
      ${addIndent(styles.join("\n\n"), 6)}
    </style>`;
};
var getHtmlDocument = (givenConfiguration, customTheme2 = "") => {
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
      content="width=device-width, initial-scale=1" />${getStyles(configuration, customTheme2)}
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
  const configString = JSON.stringify(restConfig, null, 2).split("\n").map((line, index) => index === 0 ? line : "      " + line).join("\n").replace(/\s*}$/, "");
  const functionPropsString = functionProps.length ? `,
        ${functionProps.join(",\n        ")}
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
  return async (c) => c.html(
    /* html */
    `${getHtmlDocument(configuration, customTheme)}`
  );
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
  const { process, Deno } = globalThis;
  const isNoColor = typeof Deno?.noColor === "boolean" ? Deno.noColor : process !== void 0 ? (
    // eslint-disable-next-line no-unsafe-optional-chaining
    "NO_COLOR" in process?.env
  ) : false;
  return !isNoColor;
}
async function getColorEnabledAsync() {
  const { navigator } = globalThis;
  const cfWorkers = "cloudflare:workers";
  const isNoColor = navigator !== void 0 && navigator.userAgent === "Cloudflare-Workers" ? await (async () => {
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
  return humanize([delta < 1e3 ? delta + "ms" : Math.round(delta / 1e3) + "s"]);
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
  ;
  fn[DOM_INTERNAL_TAG] = true;
  return fn;
};

// node_modules/hono/dist/jsx/dom/context.js
var createContextProviderFunction = (values) => ({ value, children }) => {
  if (!children) {
    return void 0;
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
  const context = ((props) => {
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
  });
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
var isStylesheetLinkWithPrecedence = (props) => props.rel === "stylesheet" && "precedence" in props;
var shouldDeDupeByKey = (tagName, supportSort) => {
  if (tagName === "link") {
    return supportSort;
  }
  return deDupeKeyMap[tagName].length > 0;
};

// node_modules/hono/dist/jsx/intrinsic-element/components.js
var components_exports = {};
__export(components_exports, {
  button: () => button,
  form: () => form,
  input: () => input,
  link: () => link,
  meta: () => meta,
  script: () => script,
  style: () => style,
  title: () => title
});

// node_modules/hono/dist/jsx/children.js
var toArray = (children) => Array.isArray(children) ? children : [children];

// node_modules/hono/dist/jsx/intrinsic-element/components.js
var metaTagMap = /* @__PURE__ */ new WeakMap();
var insertIntoHead = (tagName, tag, props, precedence) => ({ buffer, context }) => {
  if (!buffer) {
    return;
  }
  const map = metaTagMap.get(context) || {};
  metaTagMap.set(context, map);
  const tags = map[tagName] ||= [];
  let duped = false;
  const deDupeKeys = deDupeKeyMap[tagName];
  const deDupeByKey = shouldDeDupeByKey(tagName, precedence !== void 0);
  if (deDupeByKey) {
    LOOP: for (const [, tagProps] of tags) {
      if (tagName === "link" && !(tagProps.rel === "stylesheet" && tagProps[dataPrecedenceAttr] !== void 0)) {
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
    if (tagName === "link" || precedence !== void 0) {
      const precedences = [];
      insertTags = tags.map(([tag2, , tagPrecedence], index) => {
        if (tagPrecedence === void 0) {
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
  precedence = sort ? precedence ?? "" : void 0;
  if (sort) {
    restProps[dataPrecedenceAttr] = precedence;
  }
  const string = new JSXNode(tag, restProps, toArray(children || [])).toString();
  if (string instanceof Promise) {
    return string.then(
      (resString) => raw(string, [
        ...resString.callbacks || [],
        insertIntoHead(tag, resString, restProps, precedence)
      ])
    );
  } else {
    return raw(string, [insertIntoHead(tag, string, restProps, precedence)]);
  }
};
var title = ({ children, ...props }) => {
  const nameSpaceContext2 = getNameSpaceContext();
  if (nameSpaceContext2) {
    const context = useContext(nameSpaceContext2);
    if (context === "svg" || context === "head") {
      return new JSXNode(
        "title",
        props,
        toArray(children ?? [])
      );
    }
  }
  return documentMetadataTag("title", children, props, false);
};
var script = ({
  children,
  ...props
}) => {
  const nameSpaceContext2 = getNameSpaceContext();
  if (["src", "async"].some((k) => !props[k]) || nameSpaceContext2 && useContext(nameSpaceContext2) === "head") {
    return returnWithoutSpecialBehavior("script", children, props);
  }
  return documentMetadataTag("script", children, props, false);
};
var style = ({
  children,
  ...props
}) => {
  if (!["href", "precedence"].every((k) => k in props)) {
    return returnWithoutSpecialBehavior("style", children, props);
  }
  props["data-href"] = props.href;
  delete props.href;
  return documentMetadataTag("style", children, props, true);
};
var link = ({ children, ...props }) => {
  if (["onLoad", "onError"].some((k) => k in props) || props.rel === "stylesheet" && (!("precedence" in props) || "disabled" in props)) {
    return returnWithoutSpecialBehavior("link", children, props);
  }
  return documentMetadataTag("link", children, props, isStylesheetLinkWithPrecedence(props));
};
var meta = ({ children, ...props }) => {
  const nameSpaceContext2 = getNameSpaceContext();
  if (nameSpaceContext2 && useContext(nameSpaceContext2) === "head") {
    return returnWithoutSpecialBehavior("meta", children, props);
  }
  return documentMetadataTag("meta", children, props, false);
};
var newJSXNode = (tag, { children, ...props }) => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new JSXNode(tag, props, toArray(children ?? []))
);
var form = (props) => {
  if (typeof props.action === "function") {
    props.action = PERMALINK in props.action ? props.action[PERMALINK] : void 0;
  }
  return newJSXNode("form", props);
};
var formActionableElement = (tag, props) => {
  if (typeof props.formAction === "function") {
    props.formAction = PERMALINK in props.formAction ? props.formAction[PERMALINK] : void 0;
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
var validAttributeNameCache = /* @__PURE__ */ new Set();
var validAttributeNameCacheMax = 1024;
var invalidTagNameCharRe = /^[!?]|[\s"'<>/=`\\\x00-\x1f\x7f-\x9f]/;
var validTagNameCache = /* @__PURE__ */ new Set();
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
  for (let i = 0; i < len; i++) {
    const c = name.charCodeAt(i);
    if (!(c >= 97 && c <= 122 || // a-z
    c >= 65 && c <= 90 || // A-Z
    c >= 48 && c <= 57 || // 0-9
    c === 45 || // -
    c === 95 || // _
    c === 46 || // .
    c === 58)) {
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
var validStylePropertyNameCache = /* @__PURE__ */ new Set();
var validStylePropertyNameCacheMax = 1024;
var isValidStylePropertyName = (name) => {
  if (validStylePropertyNameCache.has(name)) {
    return true;
  }
  const len = name.length;
  if (len === 0) {
    return false;
  }
  for (let i = 0; i < len; i++) {
    const c = name.charCodeAt(i);
    if (!(c >= 97 && c <= 122 || // a-z
    c >= 65 && c <= 90 || // A-Z
    c >= 48 && c <= 57 || // 0-9
    c === 45 || // -
    c === 95)) {
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
  for (let i = 0, len = value.length; i < len; i++) {
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
      value = !key.match(
        /^(?:a|border-im|column(?:-c|s)|flex(?:$|-[^b])|grid-(?:ar|[^a])|font-w|li|or|sca|st|ta|wido|z)|ty$/
      ) ? `${v}px` : `${v}`;
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
var nameSpaceContext = void 0;
var getNameSpaceContext = () => nameSpaceContext;
var toSVGAttributeName = (key) => /[A-Z]/.test(key) && // Presentation attributes are findable in style object. "clip-path", "font-size", "stroke-width", etc.
// Or other un-deprecated kebab-case attributes. "overline-position", "paint-order", "strikethrough-position", etc.
key.match(
  /^(?:al|basel|clip(?:Path|Rule)$|co|do|fill|fl|fo|gl|let|lig|i|marker[EMS]|o|pai|pointe|sh|st[or]|text[^L]|tr|u|ve|w)/
) ? key.replace(/([A-Z])/g, "-$1").toLowerCase() : key;
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
  for (let i = 0, len = children.length; i < len; i++) {
    const child = children[i];
    if (typeof child === "string") {
      escapeToBuffer(child, buffer);
    } else if (typeof child === "boolean" || child === null || child === void 0) {
      continue;
    } else if (child instanceof JSXNode) {
      child.toStringToBuffer(buffer);
    } else if (typeof child === "number" || child.isEscaped) {
      ;
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
  // Added for compatibility with libraries that rely on React's internal structure
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      if (key === "children") {
      } else if (key === "style" && typeof v === "object") {
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
      } else if (v === null || v === void 0) {
      } else if (typeof v === "number" || v.isEscaped) {
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
        buffer.unshift(
          "",
          res.then((childRes) => {
            if (childRes instanceof JSXNode) {
              childRes.localContexts = currentContexts;
            }
            return childRes;
          })
        );
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
      ;
      components_exports[k][DOM_RENDERER] = domRenderers[k];
    }
    initDomRenderer = true;
  }
  if (typeof tag === "function") {
    return new JSXFunctionNode(tag, props, children);
  } else if (components_exports[tag]) {
    return new JSXFunctionNode(
      components_exports[tag],
      props,
      children
    );
  } else if (tag === "svg" || tag === "head") {
    nameSpaceContext ||= createContext("");
    return new JSXNode(tag, props, [
      new JSXFunctionNode(
        nameSpaceContext,
        {
          value: tag
        },
        children
      )
    ]);
  } else {
    return new JSXNode(tag, props, children);
  }
};
var Fragment = ({
  children
}) => {
  return new JSXFragmentNode(
    "",
    {
      children
    },
    Array.isArray(children) ? children : children ? [children] : []
  );
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
var Home = new Hono2();
var Meteors = ({ number }) => {
  return /* @__PURE__ */ jsxDEV(Fragment, { children: Array.from({ length: number || 20 }, (_, idx) => /* @__PURE__ */ jsxDEV(
    "span",
    {
      class: "meteor animate-[meteorAnimation_3s_linear_infinite] absolute h-1 w-1 rounded-[9999px] shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
      style: {
        top: 0,
        left: `${Math.floor(Math.random() * (400 - -400) + -400)}px`,
        animationDelay: `${Math.random() * (0.8 - 0.2) + 0.2}s`,
        animationDuration: `${Math.floor(Math.random() * (10 - 2) + 2)}s`
      }
    },
    idx
  )) });
};
Home.get("/", (c) => {
  const title2 = "JioSaavn API";
  const description = "JioSaavn API is an unofficial wrapper written in TypeScript for jiosaavn.com providing programmatic access to a vast library of songs, albums, artists, playlists, and more.";
  return c.html(
    /* @__PURE__ */ jsxDEV("html", { children: [
      /* @__PURE__ */ jsxDEV("head", { children: [
        /* @__PURE__ */ jsxDEV("title", { children: "JioSaavn API" }),
        /* @__PURE__ */ jsxDEV("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
        /* @__PURE__ */ jsxDEV("meta", { charset: "utf-8" }),
        /* @__PURE__ */ jsxDEV("meta", { name: "description", content: description }),
        /* @__PURE__ */ jsxDEV("meta", { property: "og:type", content: "website" }),
        /* @__PURE__ */ jsxDEV("meta", { property: "og:url", content: "https://saavn.dev/" }),
        /* @__PURE__ */ jsxDEV("meta", { property: "og:title", content: title2 }),
        /* @__PURE__ */ jsxDEV("meta", { property: "og:description", content: description }),
        /* @__PURE__ */ jsxDEV("meta", { property: "twitter:card", content: "summary_large_image" }),
        /* @__PURE__ */ jsxDEV("meta", { property: "twitter:url", content: "https://saavn.dev/" }),
        /* @__PURE__ */ jsxDEV("meta", { property: "twitter:title", content: title2 }),
        /* @__PURE__ */ jsxDEV("meta", { property: "twitter:description", content: description }),
        /* @__PURE__ */ jsxDEV(
          "meta",
          {
            property: "og:image",
            content: "https://raw.githubusercontent.com/sumitkolhe/jiosaavn-api/main/assets/preview.jpg"
          }
        ),
        /* @__PURE__ */ jsxDEV(
          "meta",
          {
            property: "twitter:image",
            content: "https://raw.githubusercontent.com/sumitkolhe/jiosaavn-api/main/assets/preview.jpg"
          }
        ),
        /* @__PURE__ */ jsxDEV(
          "link",
          {
            rel: "icon",
            type: "image/x-icon",
            href: "https://raw.githubusercontent.com/sumitkolhe/jiosaavn-api/main/assets/favicon.ico"
          }
        ),
        /* @__PURE__ */ jsxDEV("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
        /* @__PURE__ */ jsxDEV("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" }),
        /* @__PURE__ */ jsxDEV("link", { href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap", rel: "stylesheet" }),
        /* @__PURE__ */ jsxDEV("script", { src: "https://cdn.tailwindcss.com" }),
        /* @__PURE__ */ jsxDEV(
          "style",
          {
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
          }
        )
      ] }),
      /* @__PURE__ */ jsxDEV("body", { class: "bg-black mx-auto md:min-h-screen max-w-screen-lg flex flex-col", children: /* @__PURE__ */ jsxDEV("main", { class: "mx-auto my-auto flex flex-col space-y-8 px-4 pb-8 md:py-10 relative overflow-y-hidden overflow-x-hidden", children: [
        /* @__PURE__ */ jsxDEV(Meteors, { number: 15 }),
        /* @__PURE__ */ jsxDEV("div", { class: "flex flex-row items-center space-x-4 ml-6", children: [
          /* @__PURE__ */ jsxDEV("svg", { class: "sm:h-12 sm:w-12 h-8 w-8 shrink-0", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: [
            /* @__PURE__ */ jsxDEV(
              "path",
              {
                fill: "#ff7d78",
                d: "M3.172 3.464C2 4.93 2 7.286 2 12c0 4.714 0 7.071 1.172 8.535C4.343 22 6.229 22 10 22h3.376A4.25 4.25 0 0 1 17 16.007V12.25a2.25 2.25 0 0 1 4.5 0a.75.75 0 0 0 .5.707V12c0-4.714 0-7.071-1.172-8.536C19.657 2 17.771 2 14 2h-4C6.229 2 4.343 2 3.172 3.464",
                opacity: ".5"
              }
            ),
            /* @__PURE__ */ jsxDEV(
              "path",
              {
                fill: "#ff7d78",
                "fill-rule": "evenodd",
                d: "M8.25 12a3.75 3.75 0 1 1 7.5 0a3.75 3.75 0 0 1-7.5 0m11-.5a.75.75 0 0 1 .75.75a2.25 2.25 0 0 0 2.25 2.25a.75.75 0 0 1 0 1.5a3.734 3.734 0 0 1-2.25-.75v5a2.75 2.75 0 1 1-1.5-2.45v-5.55a.75.75 0 0 1 .75-.75m-.75 8.75a1.25 1.25 0 1 0-2.5 0a1.25 1.25 0 0 0 2.5 0",
                "clip-rule": "evenodd"
              }
            )
          ] }),
          /* @__PURE__ */ jsxDEV("p", { class: "text-2xl md:text-4xl text-transparent font-bold leading-none bg-clip-text bg-gradient-to-r from-[#ff7d78] to-purple-600", children: [
            "JioSaavn API",
            /* @__PURE__ */ jsxDEV("span", { class: "uppercase text-sm ml-3 text-gray-500 font-normal sm:hidden", children: "Unofficial" })
          ] }),
          /* @__PURE__ */ jsxDEV("p", { class: "hidden sm:block animate-[borderAnimation_3s_linear_infinite] rounded bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:400%_400%] p-1", children: /* @__PURE__ */ jsxDEV("span", { class: "block rounded px-1.5 py-0.5 text-xs text-white uppercase tracking-wider", children: "Unofficial" }) })
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-2 sm:gap-0 relative grid-flow-row", children: [
          /* @__PURE__ */ jsxDEV(
            "a",
            {
              target: "_blank",
              class: "p-4 sm:p-8 hover:bg-opacity-5 hover:bg-white rounded-lg duration-100 sm:col-span-4",
              href: "/docs",
              children: /* @__PURE__ */ jsxDEV("div", { class: "flex flex-col", children: [
                /* @__PURE__ */ jsxDEV("span", { class: "text-xs uppercase bg-opacity-15 rounded text-center max-w-fit px-2 py-1 font-bold tracking-wide bg-red-500 text-red-500", children: "Get Started" }),
                /* @__PURE__ */ jsxDEV("span", { class: "text-neutral-200 font-bold text-lg sm:text-xl md:text-2xl mt-2", children: "Explore the Docs" }),
                /* @__PURE__ */ jsxDEV("div", { class: "text-neutral-500 mt-2", children: "Check out the documentation to learn how to use the JioSaavn API." })
              ] })
            }
          ),
          /* @__PURE__ */ jsxDEV(
            "a",
            {
              target: "_blank",
              class: "p-4 sm:p-8 hover:bg-opacity-5 hover:bg-white rounded-lg duration-100 sm:col-span-4",
              href: "https://github.com/sumitkolhe/jiosaavn-api",
              children: /* @__PURE__ */ jsxDEV("div", { class: "flex flex-col", children: [
                /* @__PURE__ */ jsxDEV("span", { class: "text-xs uppercase bg-opacity-15 rounded text-center max-w-fit px-2 py-1 font-bold tracking-wide bg-green-500 text-green-500", children: "Open Source" }),
                /* @__PURE__ */ jsxDEV("span", { class: "text-neutral-200 font-bold text-lg sm:text-xl md:text-2xl mt-2", children: "Open Source" }),
                /* @__PURE__ */ jsxDEV("div", { class: "text-neutral-500 mt-2", children: "Saavn API is open-source. Check out the source code on github." })
              ] })
            }
          ),
          /* @__PURE__ */ jsxDEV(
            "a",
            {
              target: "_blank",
              class: "p-4 sm:p-8 hover:bg-opacity-5 hover:bg-white rounded-lg duration-100 sm:col-span-4",
              href: "https://github.com/sumitkolhe/jiosaavn-api/issues",
              children: /* @__PURE__ */ jsxDEV("div", { class: "flex flex-col", children: [
                /* @__PURE__ */ jsxDEV("span", { class: "text-xs uppercase bg-opacity-15 rounded text-center max-w-fit px-2 py-1 font-bold tracking-wide bg-violet-500 text-violet-500", children: "Contribute" }),
                /* @__PURE__ */ jsxDEV("span", { class: "text-neutral-200 font-bold text-lg sm:text-xl md:text-2xl mt-2", children: "Get Involved" }),
                /* @__PURE__ */ jsxDEV("div", { class: "text-neutral-500 mt-2", children: "Encounter a bug or have a feature suggestion? Report it on GitHub or contribute by submitting a pull request." })
              ] })
            }
          ),
          /* @__PURE__ */ jsxDEV("div", { class: "p-4 sm:p-8 hover:bg-opacity-5 hover:bg-white rounded-lg duration-100 sm:col-span-4", children: /* @__PURE__ */ jsxDEV("div", { class: "flex flex-col", children: [
            /* @__PURE__ */ jsxDEV("span", { class: "text-xs uppercase bg-opacity-15 rounded text-center max-w-fit px-2 py-1 font-bold tracking-wide bg-blue-500 text-blue-500", children: "Contact" }),
            /* @__PURE__ */ jsxDEV("span", { class: "text-neutral-200 font-bold text-lg sm:text-xl md:text-2xl mt-2", children: "Sumit Kolhe" }),
            /* @__PURE__ */ jsxDEV("div", { class: "text-neutral-500 mt-2", children: [
              "Have a question or need help? Reach out on",
              " ",
              /* @__PURE__ */ jsxDEV(
                "a",
                {
                  href: "https://github.com/sumitkolhe",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "hover:underline text-indigo-500",
                  children: "GitHub"
                }
              ),
              ",",
              " ",
              /* @__PURE__ */ jsxDEV(
                "a",
                {
                  href: "https://twitter.com/thesumitkolhe",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "hover:underline text-sky-500",
                  children: "Twitter"
                }
              ),
              ", or",
              " ",
              /* @__PURE__ */ jsxDEV(
                "a",
                {
                  href: "https://t.me/sumitkolhe",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "hover:underline text-pink-500",
                  children: "Telegram."
                }
              )
            ] })
          ] }) })
        ] })
      ] }) })
    ] })
  );
});

// src/app.ts
var App = class {
  app;
  constructor(routes) {
    this.app = new OpenAPIHono();
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
    this.app.get(
      "/docs",
      apiReference({
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
      })
    );
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
};

// src/common/models/download.model.ts
var DownloadLinkModel = external_exports.object({
  quality: external_exports.string(),
  url: external_exports.string()
});

// src/modules/artists/models/artist-map.model.ts
var ArtistMapAPIResponseModel = external_exports.object({
  id: external_exports.string(),
  name: external_exports.string(),
  role: external_exports.string(),
  type: external_exports.string(),
  image: external_exports.string(),
  perma_url: external_exports.string()
});
var ArtistMapModel = external_exports.object({
  id: external_exports.string(),
  name: external_exports.string(),
  role: external_exports.string(),
  type: external_exports.string(),
  image: external_exports.array(DownloadLinkModel),
  url: external_exports.string()
});

// src/modules/songs/models/song.model.ts
var SongAPIResponseModel = external_exports.object({
  id: external_exports.string(),
  title: external_exports.string(),
  subtitle: external_exports.string(),
  header_desc: external_exports.string(),
  type: external_exports.string(),
  perma_url: external_exports.string(),
  image: external_exports.string(),
  language: external_exports.string(),
  year: external_exports.string(),
  play_count: external_exports.string(),
  explicit_content: external_exports.string(),
  list_count: external_exports.string(),
  list_type: external_exports.string(),
  list: external_exports.string(),
  more_info: external_exports.object({
    music: external_exports.string(),
    album_id: external_exports.string(),
    album: external_exports.string(),
    label: external_exports.string(),
    origin: external_exports.string(),
    is_dolby_content: external_exports.boolean(),
    "320kbps": external_exports.string(),
    encrypted_media_url: external_exports.string(),
    encrypted_cache_url: external_exports.string(),
    album_url: external_exports.string(),
    duration: external_exports.string(),
    rights: external_exports.object({
      code: external_exports.string(),
      cacheable: external_exports.string(),
      delete_cached_object: external_exports.string(),
      reason: external_exports.string()
    }),
    cache_state: external_exports.string(),
    has_lyrics: external_exports.string(),
    lyrics_snippet: external_exports.string(),
    starred: external_exports.string(),
    copyright_text: external_exports.string(),
    artistMap: external_exports.object({
      primary_artists: external_exports.array(ArtistMapAPIResponseModel),
      featured_artists: external_exports.array(ArtistMapAPIResponseModel),
      artists: external_exports.array(ArtistMapAPIResponseModel)
    }),
    release_date: external_exports.string(),
    label_url: external_exports.string(),
    vcode: external_exports.string(),
    vlink: external_exports.string(),
    triller_available: external_exports.boolean(),
    request_jiotune_flag: external_exports.boolean(),
    webp: external_exports.string(),
    lyrics_id: external_exports.string()
  })
});
var SongModel = external_exports.object({
  id: external_exports.string(),
  name: external_exports.string(),
  type: external_exports.string(),
  year: external_exports.string().nullable(),
  releaseDate: external_exports.string().nullable(),
  duration: external_exports.number().nullable(),
  label: external_exports.string().nullable(),
  explicitContent: external_exports.boolean(),
  playCount: external_exports.number().nullable(),
  language: external_exports.string(),
  hasLyrics: external_exports.boolean(),
  lyricsId: external_exports.string().nullable(),
  url: external_exports.string(),
  copyright: external_exports.string().nullable(),
  album: external_exports.object({
    id: external_exports.string().nullable(),
    name: external_exports.string().nullable(),
    url: external_exports.string().nullable()
  }),
  artists: external_exports.object({
    primary: external_exports.array(ArtistMapModel),
    featured: external_exports.array(ArtistMapModel),
    all: external_exports.array(ArtistMapModel)
  }),
  image: external_exports.array(DownloadLinkModel),
  downloadUrl: external_exports.array(DownloadLinkModel)
});

// src/modules/albums/models/album.model.ts
var AlbumAPIResponseModel = external_exports.object({
  id: external_exports.string(),
  title: external_exports.string(),
  subtitle: external_exports.string(),
  header_desc: external_exports.string(),
  type: external_exports.string(),
  perma_url: external_exports.string(),
  image: external_exports.string(),
  language: external_exports.string(),
  year: external_exports.string(),
  play_count: external_exports.string(),
  explicit_content: external_exports.string(),
  list_count: external_exports.string(),
  list_type: external_exports.string(),
  list: external_exports.array(SongAPIResponseModel),
  more_info: external_exports.object({
    artistMap: SongAPIResponseModel.shape.more_info.shape.artistMap,
    song_count: external_exports.string(),
    copyright_text: external_exports.string(),
    is_dolby_content: external_exports.boolean(),
    label_url: external_exports.string()
  })
});
var AlbumModel = external_exports.object({
  id: external_exports.string(),
  name: external_exports.string(),
  description: external_exports.string(),
  year: external_exports.number().nullable(),
  type: external_exports.string(),
  playCount: external_exports.number().nullable(),
  language: external_exports.string(),
  explicitContent: external_exports.boolean(),
  artists: external_exports.object(SongModel.shape.artists.shape),
  songCount: external_exports.number().nullable(),
  url: external_exports.string(),
  image: external_exports.array(DownloadLinkModel),
  songs: external_exports.array(SongModel).nullable()
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
  const response = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json", "User-Agent": randomUserAgent }
  });
  const data = await response.json();
  return { data, ok: response.ok };
};

// src/common/helpers/link.helper.ts
var import_node_forge = __toESM(require("node-forge"), 1);
var createDownloadLinks = (encryptedMediaUrl) => {
  if (!encryptedMediaUrl) return [];
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
  if (!link2) return [];
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
var GetAlbumByIdUseCase = class {
  constructor() {
  }
  async execute(id) {
    const { data } = await useFetch({
      endpoint: Endpoints.albums.id,
      params: { albumid: id }
    });
    if (!data) throw new HTTPException(404, { message: "album not found" });
    return createAlbumPayload(data);
  }
};

// src/modules/albums/use-cases/get-album-by-link/get-album-by-link.use-case.ts
var GetAlbumByLinkUseCase = class {
  constructor() {
  }
  async execute(token) {
    const { data } = await useFetch({
      endpoint: Endpoints.albums.link,
      params: {
        token,
        type: "album"
      }
    });
    if (!data) throw new HTTPException(404, { message: "album not found" });
    return createAlbumPayload(data);
  }
};

// src/modules/albums/services/album.service.ts
var AlbumService = class {
  getAlbumByIdUseCase;
  getAlbumByLinkUseCase;
  constructor() {
    this.getAlbumByIdUseCase = new GetAlbumByIdUseCase();
    this.getAlbumByLinkUseCase = new GetAlbumByLinkUseCase();
  }
  getAlbumById = (albumId) => {
    return this.getAlbumByIdUseCase.execute(albumId);
  };
  getAlbumByLink = (albumLink) => {
    return this.getAlbumByLinkUseCase.execute(albumLink);
  };
};

// src/modules/albums/controllers/album.controller.ts
var AlbumController = class {
  controller;
  albumService;
  constructor() {
    this.controller = new OpenAPIHono();
    this.albumService = new AlbumService();
  }
  initRoutes() {
    this.controller.openapi(
      createRoute({
        method: "get",
        path: "/albums",
        tags: ["Album"],
        summary: "Retrieve an album by ID or link",
        description: "Retrieve an album by providing either an ID or a direct link to the album on JioSaavn.",
        operationId: "getAlbumByIdOrLink",
        request: {
          query: external_exports.object({
            id: external_exports.string().optional().openapi({
              title: "Album ID",
              description: "The unique ID of the album",
              type: "string",
              example: "23241654",
              default: "23241654"
            }),
            link: external_exports.string().url().optional().transform((value) => value?.match(/jiosaavn\.com\/album\/[^/]+\/([^/]+)$/)?.[1]).openapi({
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
                schema: external_exports.object({
                  success: external_exports.boolean().openapi({
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
      }),
      async (ctx) => {
        const { id, link: link2 } = ctx.req.valid("query");
        const response = link2 ? await this.albumService.getAlbumByLink(link2) : await this.albumService.getAlbumById(id);
        return ctx.json({ success: true, data: response });
      }
    );
  }
};

// src/modules/search/models/search.model.ts
var SearchAPIResponseModel = external_exports.object({
  albums: external_exports.object({
    data: external_exports.array(
      external_exports.object({
        id: external_exports.string(),
        title: external_exports.string(),
        subtitle: external_exports.string(),
        type: external_exports.string(),
        image: external_exports.string(),
        perma_url: external_exports.string(),
        more_info: external_exports.object({
          music: external_exports.string(),
          ctr: external_exports.number(),
          year: external_exports.string(),
          is_movie: external_exports.string(),
          language: external_exports.string(),
          song_pids: external_exports.string()
        }),
        explicit_content: external_exports.string(),
        mini_obj: external_exports.boolean(),
        description: external_exports.string()
      })
    ),
    position: external_exports.number()
  }),
  songs: external_exports.object({
    data: external_exports.array(
      external_exports.object({
        id: external_exports.string(),
        title: external_exports.string(),
        subtitle: external_exports.string(),
        type: external_exports.string(),
        image: external_exports.string(),
        perma_url: external_exports.string(),
        more_info: external_exports.object({
          album: external_exports.string(),
          ctr: external_exports.number(),
          score: external_exports.string().optional(),
          vcode: external_exports.string(),
          vlink: external_exports.string().optional(),
          primary_artists: external_exports.string(),
          singers: external_exports.string(),
          video_available: external_exports.boolean(),
          triller_available: external_exports.boolean(),
          language: external_exports.string()
        }),
        explicit_content: external_exports.string(),
        mini_obj: external_exports.boolean(),
        description: external_exports.string()
      })
    ),
    position: external_exports.number()
  }),
  playlists: external_exports.object({
    data: external_exports.array(
      external_exports.object({
        id: external_exports.string(),
        title: external_exports.string(),
        subtitle: external_exports.string(),
        type: external_exports.string(),
        image: external_exports.string(),
        perma_url: external_exports.string(),
        more_info: external_exports.object({
          firstname: external_exports.string(),
          artist_name: external_exports.array(external_exports.string()),
          entity_type: external_exports.string(),
          entity_sub_type: external_exports.string(),
          video_available: external_exports.boolean(),
          is_dolby_content: external_exports.boolean(),
          sub_types: external_exports.any(),
          images: external_exports.any(),
          lastname: external_exports.string(),
          language: external_exports.string()
        }),
        explicit_content: external_exports.string(),
        mini_obj: external_exports.boolean(),
        description: external_exports.string()
      })
    ),
    position: external_exports.number()
  }),
  artists: external_exports.object({
    data: external_exports.array(
      external_exports.object({
        id: external_exports.string(),
        title: external_exports.string(),
        image: external_exports.string(),
        extra: external_exports.string(),
        type: external_exports.string(),
        mini_obj: external_exports.boolean(),
        isRadioPresent: external_exports.boolean(),
        ctr: external_exports.number(),
        entity: external_exports.number(),
        description: external_exports.string(),
        position: external_exports.number()
      })
    ),
    position: external_exports.number()
  }),
  topquery: external_exports.object({
    data: external_exports.array(
      external_exports.object({
        id: external_exports.string(),
        title: external_exports.string(),
        subtitle: external_exports.string(),
        type: external_exports.string(),
        image: external_exports.string(),
        perma_url: external_exports.string(),
        more_info: external_exports.object({
          album: external_exports.string(),
          ctr: external_exports.number(),
          score: external_exports.string().optional(),
          vcode: external_exports.string(),
          vlink: external_exports.string(),
          primary_artists: external_exports.string(),
          singers: external_exports.string(),
          video_available: external_exports.boolean(),
          triller_available: external_exports.boolean(),
          language: external_exports.string()
        }),
        explicit_content: external_exports.string().optional(),
        mini_obj: external_exports.boolean(),
        description: external_exports.string()
      })
    ),
    position: external_exports.number()
  })
});
var SearchResponseModel = (model) => external_exports.object({
  results: model,
  position: external_exports.number()
});
var SearchModel = external_exports.object({
  albums: SearchResponseModel(
    external_exports.array(
      external_exports.object({
        id: external_exports.string(),
        title: external_exports.string(),
        image: external_exports.array(DownloadLinkModel),
        artist: external_exports.string(),
        url: external_exports.string(),
        type: external_exports.string(),
        description: external_exports.string(),
        year: external_exports.string(),
        language: external_exports.string(),
        songIds: external_exports.string()
      })
    )
  ),
  songs: SearchResponseModel(
    external_exports.array(
      external_exports.object({
        id: external_exports.string(),
        title: external_exports.string(),
        image: external_exports.array(DownloadLinkModel),
        album: external_exports.string(),
        url: external_exports.string(),
        type: external_exports.string(),
        description: external_exports.string(),
        primaryArtists: external_exports.string(),
        singers: external_exports.string(),
        language: external_exports.string()
      })
    )
  ),
  artists: SearchResponseModel(
    external_exports.array(
      external_exports.object({
        id: external_exports.string(),
        title: external_exports.string(),
        image: external_exports.array(DownloadLinkModel),
        type: external_exports.string(),
        description: external_exports.string(),
        position: external_exports.number()
      })
    )
  ),
  playlists: SearchResponseModel(
    external_exports.array(
      external_exports.object({
        id: external_exports.string(),
        title: external_exports.string(),
        image: external_exports.array(DownloadLinkModel),
        url: external_exports.string(),
        language: external_exports.string(),
        type: external_exports.string(),
        description: external_exports.string()
      })
    )
  ),
  topQuery: SearchResponseModel(
    external_exports.array(
      external_exports.object({
        id: external_exports.string(),
        title: external_exports.string(),
        image: external_exports.array(DownloadLinkModel),
        album: external_exports.string(),
        url: external_exports.string(),
        type: external_exports.string(),
        description: external_exports.string(),
        primaryArtists: external_exports.string(),
        singers: external_exports.string(),
        language: external_exports.string()
      })
    )
  )
});

// src/modules/search/models/search-artist.model.ts
var SearchArtistAPIResponseModel = external_exports.object({
  total: external_exports.number(),
  start: external_exports.number(),
  results: external_exports.array(
    external_exports.object({
      name: external_exports.string(),
      id: external_exports.string(),
      ctr: external_exports.number(),
      entity: external_exports.number(),
      image: external_exports.string().url(),
      role: external_exports.string(),
      perma_url: external_exports.string().url(),
      type: external_exports.string(),
      mini_obj: external_exports.boolean(),
      isRadioPresent: external_exports.boolean(),
      is_followed: external_exports.boolean()
    })
  )
});
var SearchArtistModel = external_exports.object({
  total: external_exports.number(),
  start: external_exports.number(),
  results: external_exports.array(
    external_exports.object({
      id: external_exports.string(),
      name: external_exports.string(),
      role: external_exports.string(),
      type: external_exports.string(),
      image: external_exports.array(DownloadLinkModel),
      url: external_exports.string()
    })
  )
});

// src/modules/search/models/search-song.model.ts
var SearchSongAPIResponseModel = external_exports.object({
  total: external_exports.number(),
  start: external_exports.number(),
  results: external_exports.array(SongAPIResponseModel)
});
var SearchSongModel = external_exports.object({
  total: external_exports.number(),
  start: external_exports.number(),
  results: external_exports.array(SongModel)
});

// src/modules/search/models/search-album.model.ts
var SearchAlbumAPIResponseModel = external_exports.object({
  total: external_exports.number(),
  start: external_exports.number(),
  results: external_exports.array(
    external_exports.object({
      id: external_exports.string(),
      title: external_exports.string(),
      subtitle: external_exports.string(),
      header_desc: external_exports.string(),
      type: external_exports.string(),
      perma_url: external_exports.string(),
      image: external_exports.string(),
      language: external_exports.string(),
      year: external_exports.string(),
      play_count: external_exports.string(),
      explicit_content: external_exports.string(),
      list_count: external_exports.string(),
      list_type: external_exports.string(),
      list: external_exports.array(SongAPIResponseModel),
      more_info: external_exports.object({
        query: external_exports.string(),
        text: external_exports.string(),
        music: external_exports.string(),
        song_count: external_exports.string(),
        artistMap: SongAPIResponseModel.shape.more_info.shape.artistMap
      })
    })
  )
});
var SearchAlbumModel = external_exports.object({
  total: external_exports.number(),
  start: external_exports.number(),
  results: external_exports.array(
    external_exports.object({
      id: external_exports.string(),
      name: external_exports.string(),
      description: external_exports.string(),
      year: external_exports.number().nullable(),
      type: external_exports.string(),
      playCount: external_exports.number().nullable(),
      language: external_exports.string(),
      explicitContent: external_exports.boolean(),
      artists: external_exports.object(SongModel.shape.artists.shape),
      url: external_exports.string(),
      image: external_exports.array(DownloadLinkModel)
    })
  )
});

// src/modules/search/models/search-playlist.model.ts
var SearchPlaylistAPIResponseModel = external_exports.object({
  total: external_exports.number(),
  start: external_exports.number(),
  results: external_exports.array(
    external_exports.object({
      id: external_exports.string(),
      title: external_exports.string(),
      subtitle: external_exports.string(),
      type: external_exports.string(),
      image: external_exports.string(),
      perma_url: external_exports.string(),
      more_info: external_exports.object({
        uid: external_exports.string(),
        firstname: external_exports.string(),
        artist_name: external_exports.any(),
        entity_type: external_exports.string(),
        entity_sub_type: external_exports.string(),
        video_available: external_exports.boolean(),
        is_dolby_content: external_exports.any(),
        sub_types: external_exports.any(),
        images: external_exports.any(),
        lastname: external_exports.string(),
        song_count: external_exports.string(),
        language: external_exports.string()
      }),
      explicit_content: external_exports.string(),
      mini_obj: external_exports.boolean(),
      numsongs: external_exports.any()
    })
  )
});
var SearchPlaylistModel = external_exports.object({
  total: external_exports.number(),
  start: external_exports.number(),
  results: external_exports.array(
    // TODO: Do this for all search models
    external_exports.object({
      id: external_exports.string(),
      name: external_exports.string(),
      type: external_exports.string(),
      image: external_exports.array(DownloadLinkModel),
      url: external_exports.string(),
      songCount: external_exports.number().nullable(),
      language: external_exports.string(),
      explicitContent: external_exports.boolean()
    })
  )
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
var SearchAllUseCase = class {
  async execute(query) {
    const { data } = await useFetch({
      endpoint: Endpoints.search.all,
      params: { query }
    });
    if (!data) throw new HTTPException(404, { message: `no results found for ${query}` });
    return createSearchPayload(data);
  }
};

// src/modules/search/use-cases/search-albums/search-albums.use-case.ts
var SearchAlbumsUseCase = class {
  constructor() {
  }
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
};

// src/modules/search/use-cases/search-songs/search-songs.use-case.ts
var SearchSongsUseCase = class {
  constructor() {
  }
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
};

// src/modules/search/use-cases/search-artists/search-artists.use-case.ts
var SearchArtistsUseCase = class {
  constructor() {
  }
  async execute({ query, limit, page }) {
    const { data } = await useFetch({
      endpoint: Endpoints.search.artists,
      params: {
        q: query,
        p: page,
        n: limit
      }
    });
    if (!data) throw new HTTPException(404, { message: "artist not found" });
    return {
      total: data.total,
      start: data.start,
      results: data.results?.map(createArtistMapPayload).slice(0, limit) || []
    };
  }
};

// src/modules/search/use-cases/search-playlists/search-playlists.use-case.ts
var SearchPlaylistsUseCase = class {
  constructor() {
  }
  async execute({ query, limit, page }) {
    const { data } = await useFetch({
      endpoint: Endpoints.search.playlists,
      params: {
        q: query,
        p: page,
        n: limit
      }
    });
    if (!data) throw new HTTPException(404, { message: "playlist not found" });
    return createSearchPlaylistPayload(data);
  }
};

// src/modules/search/services/search.service.ts
var SearchService = class {
  searchAllUseCase;
  searchSongsUseCase;
  searchAlbumsUseCase;
  searchArtistsUseCase;
  searchPlaylistsUseCase;
  constructor() {
    this.searchAllUseCase = new SearchAllUseCase();
    this.searchSongsUseCase = new SearchSongsUseCase();
    this.searchAlbumsUseCase = new SearchAlbumsUseCase();
    this.searchArtistsUseCase = new SearchArtistsUseCase();
    this.searchPlaylistsUseCase = new SearchPlaylistsUseCase();
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
};

// src/modules/search/controllers/search.controller.ts
var SearchController = class {
  controller;
  searchService;
  constructor() {
    this.controller = new OpenAPIHono();
    this.searchService = new SearchService();
  }
  initRoutes() {
    this.controller.openapi(
      createRoute({
        method: "get",
        path: "/search",
        tags: ["Search"],
        summary: "Global search",
        description: "Search for songs, albums, artists, and playlists based on the provided query string.",
        operationId: "globalSearch",
        request: {
          query: external_exports.object({
            query: external_exports.string().openapi({
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
                schema: external_exports.object({
                  success: external_exports.boolean().openapi({
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
      }),
      async (ctx) => {
        const { query } = ctx.req.valid("query");
        const result = await this.searchService.searchAll(query);
        return ctx.json({ success: true, data: result });
      }
    );
    this.controller.openapi(
      createRoute({
        method: "get",
        path: "/search/songs",
        tags: ["Search"],
        summary: "Search for songs",
        description: "Search for songs based on the provided query",
        operationId: "searchSongs",
        request: {
          query: external_exports.object({
            query: external_exports.string().openapi({
              title: "Search query",
              description: "Search query for songs",
              type: "string",
              example: "Believer"
            }),
            page: external_exports.string().pipe(external_exports.coerce.number()).optional().openapi({
              title: "Page Number",
              description: "The page number of the search results to retrieve",
              type: "integer",
              example: "0",
              default: "0"
            }),
            limit: external_exports.string().pipe(external_exports.coerce.number()).optional().openapi({
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
                schema: external_exports.object({
                  success: external_exports.boolean().openapi({
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
      }),
      async (ctx) => {
        const { query, page, limit } = ctx.req.valid("query");
        const result = await this.searchService.searchSongs({ query, page: page || 0, limit: limit || 10 });
        return ctx.json({ success: true, data: result });
      }
    );
    this.controller.openapi(
      createRoute({
        method: "get",
        path: "/search/albums",
        tags: ["Search"],
        summary: "Search for albums",
        description: "Search for albums based on the provided query",
        operationId: "searchAlbums",
        request: {
          query: external_exports.object({
            query: external_exports.string().openapi({
              description: "Search query for albums",
              type: "string",
              example: "Evolve"
            }),
            page: external_exports.string().pipe(external_exports.coerce.number()).optional().openapi({
              description: "The page number of the search results to retrieve",
              type: "integer",
              example: "0",
              default: "0"
            }),
            limit: external_exports.string().pipe(external_exports.coerce.number()).optional().openapi({
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
                schema: external_exports.object({
                  success: external_exports.boolean().openapi({
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
      }),
      async (ctx) => {
        const { query, page, limit } = ctx.req.valid("query");
        const result = await this.searchService.searchAlbums({ query, page: page || 0, limit: limit || 10 });
        return ctx.json({ success: true, data: result });
      }
    );
    this.controller.openapi(
      createRoute({
        method: "get",
        path: "/search/artists",
        tags: ["Search"],
        summary: "Search for artists",
        description: "Search for artists based on the provided query",
        operationId: "searchArtists",
        request: {
          query: external_exports.object({
            query: external_exports.string().openapi({
              title: "Search query",
              description: "Search query for artists",
              type: "string",
              example: "Adele"
            }),
            page: external_exports.string().pipe(external_exports.coerce.number()).optional().openapi({
              title: "Page Number",
              description: "The page number of the search results to retrieve",
              type: "integer",
              example: "0",
              default: "0"
            }),
            limit: external_exports.string().pipe(external_exports.coerce.number()).optional().openapi({
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
                schema: external_exports.object({
                  success: external_exports.boolean().openapi({
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
      }),
      async (ctx) => {
        const { query, page, limit } = ctx.req.valid("query");
        const result = await this.searchService.searchArtists({ query, page: page || 0, limit: limit || 10 });
        return ctx.json({ success: true, data: result });
      }
    );
    this.controller.openapi(
      createRoute({
        method: "get",
        path: "/search/playlists",
        tags: ["Search"],
        summary: "Search for playlists",
        description: "Search for playlists based on the provided query",
        operationId: "searchPlaylists",
        request: {
          query: external_exports.object({
            query: external_exports.string().openapi({
              title: "Search query",
              description: "Search query for playlists",
              type: "string",
              example: "Indie"
            }),
            page: external_exports.string().pipe(external_exports.coerce.number()).optional().openapi({
              title: "Page Number",
              description: "The page number of the search results to retrieve",
              type: "integer",
              example: "0",
              default: "0"
            }),
            limit: external_exports.string().pipe(external_exports.coerce.number()).optional().openapi({
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
                schema: external_exports.object({
                  success: external_exports.boolean().openapi({
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
      }),
      async (ctx) => {
        const { query, page, limit } = ctx.req.valid("query");
        const result = await this.searchService.searchPlaylists({ query, page: page || 0, limit: limit || 10 });
        return ctx.json({ success: true, data: result });
      }
    );
  }
};

// src/modules/songs/use-cases/get-song-by-id/get-song-by-id.use-case.ts
var GetSongByIdUseCase = class {
  constructor() {
  }
  async execute({ songIds }) {
    const { data } = await useFetch({
      endpoint: Endpoints.songs.id,
      params: {
        pids: songIds
      }
    });
    if (!data.songs?.length) throw new HTTPException(404, { message: "song not found" });
    const songs = data.songs.map((song) => createSongPayload(song));
    return songs;
  }
};

// src/modules/songs/use-cases/get-song-by-link/get-song-by-link.use-case.ts
var GetSongByLinkUseCase = class {
  constructor() {
  }
  async execute(token) {
    const { data } = await useFetch({
      endpoint: Endpoints.songs.link,
      params: { token, type: "song" }
    });
    if (!data.songs?.length) throw new HTTPException(404, { message: "song not found" });
    return data.songs.map((song) => createSongPayload(song));
  }
};

// src/modules/songs/use-cases/create-song-station/create-song-station.use-case.ts
var CreateSongStationUseCase = class {
  constructor() {
  }
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
    if (!data || !ok || !data.stationid) throw new HTTPException(500, { message: "could not create station" });
    return data.stationid;
  }
};

// src/modules/songs/use-cases/get-song-suggestions/get-song-suggestions.use-case.ts
var GetSongSuggestionsUseCase = class {
  createSongStation;
  constructor() {
    this.createSongStation = new CreateSongStationUseCase();
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
};

// src/modules/songs/services/song.service.ts
var SongService = class {
  getSongByIdUseCase;
  getSongByLinkUseCase;
  createSongStationUseCase;
  getSongSuggestionsUseCase;
  constructor() {
    this.getSongByIdUseCase = new GetSongByIdUseCase();
    this.getSongByLinkUseCase = new GetSongByLinkUseCase();
    this.createSongStationUseCase = new CreateSongStationUseCase();
    this.getSongSuggestionsUseCase = new GetSongSuggestionsUseCase();
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
};

// src/modules/songs/controllers/song.controller.ts
var SongController = class {
  controller;
  static songClient;
  songService;
  constructor() {
    this.controller = new OpenAPIHono();
    this.songService = new SongService();
  }
  initRoutes() {
    this.controller.openapi(
      createRoute({
        method: "get",
        path: "/songs",
        tags: ["Songs"],
        summary: "Retrieve songs by ID or link",
        description: "Retrieve songs by a comma-separated list of IDs or by a direct link to the song on JioSaavn.",
        operationId: "getSongByIdsOrLink",
        request: {
          query: external_exports.object({
            ids: external_exports.string().optional().openapi({
              title: "Song IDs",
              description: "Comma-separated list of song IDs",
              type: "string",
              example: "3IoDK8qI,4IoDK8qI,5IoDK8qI"
            }),
            link: external_exports.string().url().optional().transform((value) => value?.match(/jiosaavn\.com\/song\/[^/]+\/([^/]+)$/)?.[1]).openapi({
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
                schema: external_exports.object({
                  success: external_exports.boolean().openapi({
                    description: "Indicates whether the request was successful",
                    type: "boolean",
                    example: true
                  }),
                  data: external_exports.array(SongModel).openapi({
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
      }),
      async (ctx) => {
        const { link: link2, ids } = ctx.req.valid("query");
        if (!link2 && !ids) {
          return ctx.json({ success: false, message: "Either song IDs or link is required" }, 400);
        }
        const response = link2 ? await this.songService.getSongByLink(link2) : await this.songService.getSongByIds({ songIds: ids });
        return ctx.json({ success: true, data: response });
      }
    );
    this.controller.openapi(
      createRoute({
        method: "get",
        path: "/songs/{id}",
        tags: ["Songs"],
        summary: "Retrieve song by ID",
        description: "Retrieve a song by its ID. Optionally, include lyrics in the response.",
        operationId: "getSongById",
        request: {
          params: external_exports.object({
            id: external_exports.string().openapi({
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
                schema: external_exports.object({
                  success: external_exports.boolean().openapi({
                    description: "Indicates whether the request was successful",
                    type: "boolean",
                    example: true
                  }),
                  data: external_exports.array(SongModel).openapi({
                    description: "Array of songs"
                  })
                })
              }
            }
          },
          400: { description: "Bad request when query parameters are missing or invalid" },
          404: { description: "Song not found for the given ID" }
        }
      }),
      async (ctx) => {
        const songId = ctx.req.param("id");
        const response = await this.songService.getSongByIds({ songIds: songId });
        return ctx.json({ success: true, data: response });
      }
    );
    this.controller.openapi(
      createRoute({
        method: "get",
        path: "/songs/{id}/suggestions",
        tags: ["Songs"],
        summary: "Retrieve song suggestions",
        description: "Retrieve song suggestions based on the given song ID. This can be used to get similar songs to the one provided for infinite playback.",
        operationId: "getSongSuggestions",
        request: {
          params: external_exports.object({
            id: external_exports.string().openapi({
              description: "ID of the song to retrieve suggestions for",
              type: "string",
              example: "yDeAS8Eh"
            })
          }),
          query: external_exports.object({
            limit: external_exports.string().pipe(external_exports.coerce.number()).optional().openapi({
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
                schema: external_exports.object({
                  success: external_exports.boolean().openapi({
                    description: "Indicates whether the request was successful",
                    type: "boolean",
                    example: true
                  }),
                  data: external_exports.array(SongModel).openapi({
                    description: "Array of song suggestions"
                  })
                })
              }
            }
          }
        }
      }),
      async (ctx) => {
        const songId = ctx.req.param("id");
        const { limit } = ctx.req.valid("query");
        const suggestions = await this.songService.getSongSuggestions({ songId, limit: limit || 10 });
        return ctx.json({ success: true, data: suggestions });
      }
    );
  }
};

// src/modules/artists/models/artist-album.model.ts
var ArtistAlbumAPIResponseModel = external_exports.object({
  artistId: external_exports.string(),
  name: external_exports.string(),
  subtitle: external_exports.string(),
  image: external_exports.string(),
  follower_count: external_exports.string(),
  type: external_exports.string(),
  isVerified: external_exports.boolean(),
  dominantLanguage: external_exports.string(),
  dominantType: external_exports.string(),
  topAlbums: external_exports.object({
    albums: external_exports.array(AlbumAPIResponseModel),
    total: external_exports.number()
  })
});
var ArtistAlbumModel = external_exports.object({
  total: external_exports.number(),
  albums: external_exports.array(AlbumModel)
});

// src/modules/artists/models/artist-song.model.ts
var ArtistSongAPIResponseModel = external_exports.object({
  artistId: external_exports.string(),
  name: external_exports.string(),
  subtitle: external_exports.string(),
  image: external_exports.string(),
  follower_count: external_exports.string(),
  type: external_exports.string(),
  isVerified: external_exports.boolean(),
  dominantLanguage: external_exports.string(),
  dominantType: external_exports.string(),
  topSongs: external_exports.object({
    songs: external_exports.array(SongAPIResponseModel),
    total: external_exports.number()
  })
});
var ArtistSongModel = external_exports.object({
  total: external_exports.number(),
  songs: external_exports.array(SongModel)
});

// src/modules/artists/models/artist.model.ts
var ArtistAPIResponseModel = external_exports.object({
  artistId: external_exports.string(),
  name: external_exports.string(),
  subtitle: external_exports.string(),
  image: external_exports.string(),
  follower_count: external_exports.string(),
  type: external_exports.string(),
  isVerified: external_exports.boolean(),
  dominantLanguage: external_exports.string(),
  dominantType: external_exports.string(),
  topSongs: external_exports.array(SongAPIResponseModel),
  topAlbums: external_exports.array(AlbumAPIResponseModel),
  singles: external_exports.array(SongAPIResponseModel),
  dedicated_artist_playlist: external_exports.array(
    external_exports.object({
      id: external_exports.string(),
      title: external_exports.string(),
      subtitle: external_exports.string(),
      type: external_exports.string(),
      image: external_exports.string(),
      perma_url: external_exports.string(),
      more_info: external_exports.object({
        uid: external_exports.string(),
        firstname: external_exports.string(),
        artist_name: external_exports.array(external_exports.string()),
        entity_type: external_exports.string(),
        entity_sub_type: external_exports.string(),
        video_available: external_exports.boolean(),
        is_dolby_content: external_exports.any(),
        sub_types: external_exports.any(),
        images: external_exports.any(),
        lastname: external_exports.string(),
        song_count: external_exports.string(),
        language: external_exports.string()
      }),
      explicit_content: external_exports.string(),
      mini_obj: external_exports.boolean(),
      numsongs: external_exports.number()
    })
  ),
  featured_artist_playlist: external_exports.array(
    external_exports.object({
      id: external_exports.string(),
      title: external_exports.string(),
      subtitle: external_exports.string(),
      type: external_exports.string(),
      image: external_exports.string(),
      perma_url: external_exports.string(),
      more_info: external_exports.object({
        uid: external_exports.string(),
        firstname: external_exports.string(),
        artist_name: external_exports.any(),
        entity_type: external_exports.string(),
        entity_sub_type: external_exports.string(),
        video_available: external_exports.boolean(),
        is_dolby_content: external_exports.any(),
        sub_types: external_exports.any(),
        images: external_exports.any(),
        lastname: external_exports.string(),
        song_count: external_exports.string(),
        language: external_exports.string()
      }),
      explicit_content: external_exports.string(),
      mini_obj: external_exports.boolean(),
      numsongs: external_exports.number()
    })
  ),
  similarArtists: external_exports.array(
    external_exports.object({
      _id: external_exports.string(),
      similar: external_exports.string(),
      languages: external_exports.string(),
      isVerified: external_exports.string(),
      image_url: external_exports.string(),
      wiki: external_exports.string(),
      roles: external_exports.string(),
      combine_artist_pages: external_exports.number(),
      webp: external_exports.boolean(),
      search_keywords: external_exports.string(),
      replace_with_primary_artists: external_exports.number(),
      twitter: external_exports.string(),
      dob: external_exports.string(),
      aka: external_exports.string(),
      name: external_exports.string(),
      primary_artist_id: external_exports.string(),
      id: external_exports.string(),
      fb: external_exports.string(),
      bio: external_exports.string(),
      perma_url: external_exports.string(),
      type: external_exports.string(),
      mini_obj: external_exports.boolean(),
      isRadioPresent: external_exports.boolean(),
      dominantType: external_exports.string()
    })
  ),
  isRadioPresent: external_exports.boolean(),
  bio: external_exports.string(),
  dob: external_exports.string(),
  fb: external_exports.string(),
  twitter: external_exports.string(),
  wiki: external_exports.string(),
  urls: external_exports.object({
    albums: external_exports.string(),
    bio: external_exports.string(),
    comments: external_exports.string(),
    songs: external_exports.string(),
    overview: external_exports.string()
  }),
  availableLanguages: external_exports.array(external_exports.string()),
  fan_count: external_exports.string(),
  topEpisodes: external_exports.array(external_exports.any()),
  is_followed: external_exports.boolean()
}).extend({
  id: external_exports.string(),
  perma_url: external_exports.string()
});
var ArtistModel = external_exports.object({
  id: external_exports.string(),
  name: external_exports.string(),
  url: external_exports.string(),
  type: external_exports.string(),
  image: external_exports.array(DownloadLinkModel),
  followerCount: external_exports.number().nullable(),
  fanCount: external_exports.string().nullable(),
  isVerified: external_exports.boolean().nullable(),
  dominantLanguage: external_exports.string().nullable(),
  dominantType: external_exports.string().nullable(),
  bio: external_exports.array(
    external_exports.object({
      text: external_exports.string().nullable(),
      title: external_exports.string().nullable(),
      sequence: external_exports.number().nullable()
    })
  ).nullable(),
  dob: external_exports.string().nullable(),
  fb: external_exports.string().nullable(),
  twitter: external_exports.string().nullable(),
  wiki: external_exports.string().nullable(),
  availableLanguages: external_exports.array(external_exports.string()),
  isRadioPresent: external_exports.boolean().nullable(),
  topSongs: external_exports.array(SongModel).nullable(),
  topAlbums: external_exports.array(AlbumModel).nullable(),
  singles: external_exports.array(SongModel).nullable(),
  similarArtists: external_exports.array(
    external_exports.object({
      id: external_exports.string(),
      name: external_exports.string(),
      url: external_exports.string(),
      image: external_exports.array(DownloadLinkModel),
      languages: external_exports.record(external_exports.string(), external_exports.string()).nullable(),
      wiki: external_exports.string(),
      dob: external_exports.string(),
      fb: external_exports.string(),
      twitter: external_exports.string(),
      isRadioPresent: external_exports.boolean(),
      type: external_exports.string(),
      dominantType: external_exports.string(),
      aka: external_exports.string(),
      bio: external_exports.string().nullable(),
      similarArtists: external_exports.array(
        external_exports.object({
          id: external_exports.string(),
          name: external_exports.string()
        })
      ).nullable()
    })
  ).nullable()
});

// src/modules/artists/use-cases/get-artist-by-id/get-artist-by-id.use-case.ts
var GetArtistByIdUseCase = class {
  constructor() {
  }
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
    if (!data) throw new HTTPException(404, { message: "artist not found" });
    return createArtistPayload(data);
  }
};

// src/modules/artists/use-cases/get-artist-by-link/get-artist-by-link.use-case.ts
var GetArtistByLinkUseCase = class {
  constructor() {
  }
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
    if (!data) throw new HTTPException(404, { message: "artist not found" });
    return createArtistPayload(data);
  }
};

// src/modules/artists/use-cases/get-artist-songs/get-artist-songs.use-case.ts
var GetArtistSongsUseCase = class {
  constructor() {
  }
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
    if (!data) throw new HTTPException(404, { message: "artist songs not found" });
    return {
      total: data.topSongs.total,
      songs: data.topSongs.songs.map((song) => createSongPayload(song))
    };
  }
};

// src/modules/artists/use-cases/get-artist-albums/get-artist-albums.use-case.ts
var GetArtistAlbumsUseCase = class {
  constructor() {
  }
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
    if (!data) throw new HTTPException(404, { message: "artist albums not found" });
    return {
      total: data.topAlbums.total,
      albums: data.topAlbums.albums.map((album) => createAlbumPayload(album))
    };
  }
};

// src/modules/artists/services/artist.service.ts
var ArtistService = class {
  getArtistByIdUseCase;
  getArtistByLinkUseCase;
  getArtistSongsUseCase;
  getArtistAlbumsUseCase;
  constructor() {
    this.getArtistByIdUseCase = new GetArtistByIdUseCase();
    this.getArtistByLinkUseCase = new GetArtistByLinkUseCase();
    this.getArtistSongsUseCase = new GetArtistSongsUseCase();
    this.getArtistAlbumsUseCase = new GetArtistAlbumsUseCase();
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
};

// src/modules/artists/controllers/artist.controller.ts
var ArtistController = class {
  controller;
  artistService;
  constructor() {
    this.controller = new OpenAPIHono();
    this.artistService = new ArtistService();
  }
  initRoutes() {
    this.controller.openapi(
      createRoute({
        method: "get",
        path: "/artists",
        tags: ["Artists"],
        summary: "Retrieve artists by ID or link",
        description: `Retrieve artists by ID or by a direct artist link.`,
        operationId: "getArtistByIdOrLink",
        request: {
          query: external_exports.object({
            id: external_exports.string().optional().openapi({
              title: "Artist ID",
              description: "Artist ID",
              type: "string",
              example: "1274170"
            }),
            link: external_exports.string().url().optional().transform((value) => value?.match(/jiosaavn\.com\/artist\/[^/]+\/([^/]+)$/)?.[1]).openapi({
              title: "Artist Link",
              description: "A direct link to the artist on JioSaavn",
              type: "string",
              example: "https://www.jiosaavn.com/artist/dua-lipa-songs/r-OWIKgpX2I_"
            }),
            page: external_exports.string().pipe(external_exports.coerce.number()).optional().openapi({
              title: "Page number",
              description: "page number",
              type: "number",
              example: "1"
            }),
            songCount: external_exports.string().pipe(external_exports.coerce.number()).optional().openapi({
              title: "Song count",
              description: "Number of songs to fetch",
              type: "number",
              example: "10"
            }),
            albumCount: external_exports.string().pipe(external_exports.coerce.number()).optional().openapi({
              title: "Album count",
              description: "Number of albums to fetch",
              type: "number",
              example: "10"
            }),
            sortBy: external_exports.enum(["popularity", "latest", "alphabetical"]).optional().openapi({
              title: "Sort by",
              description: "sort by",
              type: "string",
              example: "popularity"
            }),
            sortOrder: external_exports.enum(["asc", "desc"]).optional().openapi({
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
                schema: external_exports.object({
                  success: external_exports.boolean().openapi({
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
      }),
      async (ctx) => {
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
      }
    );
    this.controller.openapi(
      createRoute({
        method: "get",
        path: "/artists/{id}",
        tags: ["Artists"],
        summary: "Retrieve artist by ID",
        description: "Retrieve artist by ID",
        operationId: "getArtistById",
        request: {
          params: external_exports.object({
            id: external_exports.string().openapi({
              title: "Artist ID",
              description: "ID of the artist to retrieve",
              type: "string",
              example: "1274170"
            })
          }),
          query: external_exports.object({
            page: external_exports.string().pipe(external_exports.coerce.number()).optional().openapi({
              title: "Page number",
              description: "The page number of the results to retrieve",
              type: "integer",
              example: "0"
            }),
            songCount: external_exports.string().pipe(external_exports.coerce.number()).optional().openapi({
              title: "Song count",
              description: "The number of songs to retrieve for the artist",
              type: "integer",
              example: "10"
            }),
            albumCount: external_exports.string().pipe(external_exports.coerce.number()).optional().openapi({
              title: "Album count",
              description: "The number of albums to retrieve for the artist",
              type: "integer",
              example: "10"
            }),
            sortBy: external_exports.enum(["popularity", "latest", "alphabetical"]).optional().openapi({
              title: "Sort by",
              description: "The field to sort the results by",
              type: "string",
              example: "popularity",
              enum: ["popularity", "latest", "alphabetical"]
            }),
            sortOrder: external_exports.enum(["asc", "desc"]).optional().openapi({
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
                schema: external_exports.object({
                  success: external_exports.boolean().openapi({
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
      }),
      async (ctx) => {
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
      }
    );
    this.controller.openapi(
      createRoute({
        method: "get",
        path: "/artists/{id}/songs",
        tags: ["Artists"],
        summary: `Retrieve artist's songs`,
        description: "Retrieve a list of songs for a given artist by their ID, with optional sorting and pagination.",
        operationId: "getArtistSongs",
        request: {
          params: external_exports.object({
            id: external_exports.string().openapi({
              description: "ID of the artist to retrieve the songs for",
              type: "string",
              example: "1274170",
              default: "1274170"
            })
          }),
          query: external_exports.object({
            page: external_exports.string().pipe(external_exports.coerce.number()).optional().openapi({
              description: "The page number of the results to retrieve",
              type: "number",
              example: "0",
              default: "0"
            }),
            sortBy: external_exports.enum(["popularity", "latest", "alphabetical"]).optional().openapi({
              description: "The criterion to sort the songs by",
              type: "string",
              example: "popularity",
              enum: ["popularity", "latest", "alphabetical"],
              default: "popularity"
            }),
            sortOrder: external_exports.enum(["asc", "desc"]).optional().openapi({
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
                schema: external_exports.object({
                  success: external_exports.boolean().openapi({
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
      }),
      async (ctx) => {
        const artistId = ctx.req.param("id");
        const { page, sortBy, sortOrder } = ctx.req.valid("query");
        const response = await this.artistService.getArtistSongs({
          artistId,
          page: page || 0,
          sortBy: sortBy || "popularity",
          sortOrder: sortOrder || "desc"
        });
        return ctx.json({ success: true, data: response });
      }
    );
    this.controller.openapi(
      createRoute({
        method: "get",
        path: "/artists/{id}/albums",
        tags: ["Artists"],
        summary: `Retrieve artist's albums`,
        description: "Retrieve a list of albums for a given artist by their ID, with optional sorting and pagination.",
        operationId: "getArtistAlbums",
        request: {
          params: external_exports.object({
            id: external_exports.string().openapi({
              description: "ID of the artist to retrieve the albums for",
              type: "string",
              example: "1274170",
              default: "1274170"
            })
          }),
          query: external_exports.object({
            page: external_exports.string().pipe(external_exports.coerce.number()).optional().openapi({
              description: "The page number of the results to retrieve",
              type: "number",
              example: "0",
              default: "0"
            }),
            sortBy: external_exports.enum(["popularity", "latest", "alphabetical"]).optional().openapi({
              description: "The criterion to sort the albums by",
              type: "string",
              example: "popularity",
              enum: ["popularity", "latest", "alphabetical"],
              default: "popularity"
            }),
            sortOrder: external_exports.enum(["asc", "desc"]).optional().openapi({
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
                schema: external_exports.object({
                  success: external_exports.boolean().openapi({
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
      }),
      async (ctx) => {
        const artistId = ctx.req.param("id");
        const { page, sortBy, sortOrder } = ctx.req.valid("query");
        const response = await this.artistService.getArtistAlbums({
          artistId,
          page: page || 0,
          sortBy: sortBy || "popularity",
          sortOrder: sortOrder || "desc"
        });
        return ctx.json({ success: true, data: response });
      }
    );
  }
};

// src/modules/playlists/models/playlist.model.ts
var PlaylistAPIResponseModel = external_exports.object({
  id: external_exports.string(),
  title: external_exports.string(),
  subtitle: external_exports.string(),
  header_desc: external_exports.string(),
  type: external_exports.string(),
  perma_url: external_exports.string(),
  image: external_exports.string(),
  language: external_exports.string(),
  year: external_exports.string(),
  play_count: external_exports.string(),
  explicit_content: external_exports.string(),
  list_count: external_exports.string(),
  list_type: external_exports.string(),
  list: external_exports.array(SongAPIResponseModel),
  more_info: external_exports.object({
    uid: external_exports.string(),
    is_dolby_content: external_exports.boolean(),
    subtype: external_exports.array(external_exports.string()).default([]),
    last_updated: external_exports.string(),
    username: external_exports.string(),
    firstname: external_exports.string(),
    lastname: external_exports.string(),
    is_followed: external_exports.string(),
    isFY: external_exports.boolean(),
    follower_count: external_exports.string(),
    fan_count: external_exports.string(),
    playlist_type: external_exports.string(),
    share: external_exports.string(),
    sub_types: external_exports.array(external_exports.string()),
    images: external_exports.array(external_exports.string()),
    H2: external_exports.string().nullable(),
    subheading: external_exports.string(),
    video_count: external_exports.string(),
    artists: external_exports.array(
      external_exports.object({
        id: external_exports.string(),
        name: external_exports.string(),
        role: external_exports.string(),
        image: external_exports.string(),
        type: external_exports.string(),
        perma_url: external_exports.string()
      })
    )
  })
}).extend({
  description: external_exports.string()
});
var PlaylistModel = external_exports.object({
  id: external_exports.string(),
  name: external_exports.string(),
  description: external_exports.string().nullable(),
  year: external_exports.number().nullable(),
  type: external_exports.string(),
  playCount: external_exports.number().nullable(),
  language: external_exports.string(),
  explicitContent: external_exports.boolean(),
  songCount: external_exports.number().nullable(),
  url: external_exports.string(),
  image: external_exports.array(DownloadLinkModel),
  songs: external_exports.array(SongModel).nullable(),
  artists: external_exports.array(ArtistMapModel).nullable()
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
var GetPlaylistByIdUseCase = class {
  constructor() {
  }
  async execute({ id, limit, page }) {
    const { data } = await useFetch({
      endpoint: Endpoints.playlists.id,
      params: {
        listid: id,
        n: limit,
        p: page
      }
    });
    if (!data) throw new HTTPException(404, { message: "playlist not found" });
    const playlist = createPlaylistPayload(data);
    return {
      ...playlist,
      songCount: playlist?.songs?.length || null,
      songs: playlist?.songs?.slice(0, limit) || []
    };
  }
};

// src/modules/playlists/use-cases/get-playlist-by-link/get-playlist-by-link.use-case.ts
var GetPlaylistByLinkUseCase = class {
  constructor() {
  }
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
    if (!data) throw new HTTPException(404, { message: "playlist not found" });
    const playlist = createPlaylistPayload(data);
    return {
      ...playlist,
      songCount: playlist?.songs?.length || null,
      songs: playlist?.songs?.slice(0, limit) || []
    };
  }
};

// src/modules/playlists/services/playlist.service.ts
var PlaylistService = class {
  getPlaylistByIdUseCase;
  getPlaylistByLinkUseCase;
  constructor() {
    this.getPlaylistByIdUseCase = new GetPlaylistByIdUseCase();
    this.getPlaylistByLinkUseCase = new GetPlaylistByLinkUseCase();
  }
  getPlaylistById = (args) => {
    return this.getPlaylistByIdUseCase.execute(args);
  };
  getPlaylistByLink = (args) => {
    return this.getPlaylistByLinkUseCase.execute(args);
  };
};

// src/modules/playlists/controllers/playlist.controller.ts
var PlaylistController = class {
  controller;
  playlistService;
  constructor() {
    this.controller = new OpenAPIHono();
    this.playlistService = new PlaylistService();
  }
  initRoutes() {
    this.controller.openapi(
      createRoute({
        method: "get",
        path: "/playlists",
        tags: ["Playlist"],
        summary: "Retrieve a playlist by ID or link",
        description: "Retrieve a playlist by providing either an ID or a direct link to the playlist on JioSaavn.",
        operationId: "getPlaylistByIdOrLink",
        request: {
          query: external_exports.object({
            id: external_exports.string().optional().openapi({
              title: "Playlist ID",
              description: "The unique ID of the playlist",
              type: "string",
              example: "82914609",
              default: "82914609"
            }),
            link: external_exports.string().url().optional().transform((value) => {
              const matches = value?.match(
                /(?:jiosaavn\.com|saavn\.com)\/(?:featured|s\/playlist)\/[^/]+\/([^/]+)$|\/([^/]+)$/
              );
              const filteredMatches = matches?.filter((each) => each !== void 0);
              return filteredMatches && filteredMatches[filteredMatches?.length - 1 || 0] || void 0;
            }).openapi({
              title: "Playlist Link",
              description: "A direct link to the playlist on JioSaavn",
              type: "string",
              example: "https://www.jiosaavn.com/featured/its-indie-english/AMoxtXyKHoU_",
              default: "https://www.jiosaavn.com/featured/its-indie-english/AMoxtXyKHoU_"
            }),
            page: external_exports.string().pipe(external_exports.coerce.number()).optional().openapi({
              title: "Page Number",
              description: "The page number of the songs to retrieve from the playlist",
              type: "integer",
              example: "0",
              default: "0"
            }),
            limit: external_exports.string().pipe(external_exports.coerce.number()).optional().openapi({
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
                schema: external_exports.object({
                  success: external_exports.boolean().openapi({
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
      }),
      async (ctx) => {
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
      }
    );
  }
};

// src/api/index.ts
var config = { runtime: "nodejs" };
var app = new App([
  new SearchController(),
  new SongController(),
  new AlbumController(),
  new ArtistController(),
  new PlaylistController()
]).getApp();
var index_default = handle(app);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  config
});
