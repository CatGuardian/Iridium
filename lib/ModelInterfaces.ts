﻿/// <reference path="../_references.d.ts" />
import Iridium = require('./Core');
import ISchema = require('./Schema');
import MongoDB = require('mongodb');
import Model = require('./Model');
import ModelCache = require('./ModelCache');
import CacheDirector = require('./CacheDirector');
import Hooks = require('./Hooks');

export interface IModelBase {
    collection: MongoDB.Collection;
    collectionName: string;
    core: Iridium;
    schema: ISchema;
    cache: ModelCache;
    cacheDirector: CacheDirector;
}

export interface IModel<TDocument extends { _id?: any }, TInstance> extends IModelBase {
    Instance: new (doc: TDocument, isNew?: boolean, isPartial?: boolean) => TInstance;
}

export interface InstanceImplementation<TDocument extends { _id?: any }, TInstance> extends Hooks<TDocument, TInstance> {
    new (model: Model<TDocument, TInstance>, doc: TDocument, isNew?: boolean, isPartial?: boolean): TInstance;
}

export interface InstanceCreator<TDocument extends { _id?: any }, TInstance> {
    (model: Model<TDocument, TInstance>, doc: TDocument, isNew?: boolean, isPartial?: boolean): TInstance;
}

export interface ModelSpecificInstanceConstructor<TDocument extends { _id?: any }, TInstance> {
    new (doc: TDocument, isNew?: boolean, isPartial?: boolean): TInstance;
}