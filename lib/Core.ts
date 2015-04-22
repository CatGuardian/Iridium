/// <reference path="../_references.d.ts" />
import Promise = require('bluebird');
import MongoDB = require('mongodb');
import _ = require('lodash');
import http = require('http');
import events = require('events');

import config = require('./Configuration');
import IPlugin = require('./Plugins');
import model = require('./Model');
import instance = require('./Instance');

import middleware = require('./Middleware');
import expressMiddleware = require('./middleware/Express');

import cache = require('./Cache');
import noOpCache = require('./caches/NoOpCache');
import memoryCache = require('./caches/MemoryCache');

var MongoConnectAsyc = Promise.promisify(MongoDB.MongoClient.connect);

export = Core;

class Core {
    private _plugins: IPlugin[] = [];
    private _url: string;
    private _config: config;
    private _connection: MongoDB.Db;
    private _cache: cache = new noOpCache();
    
    /**
     * Gets the plugins registered with this Iridium Core
     * @returns {[Iridium.Plugin]}
     */
    get plugins(): IPlugin[] {
        return this._plugins;
    }

    /**
     * Gets the configuration specified in the construction of this
     * Iridium Core.
     * @returns {Iridium.Configuration}
     */
    get settings(): config {
        return this._config;
    }

    /**
     * Gets the currently active database connection for this Iridium
     * Core.
     * @returns {MongoDB.Db}
     */
    get connection(): MongoDB.Db {
        return this._connection;
    }

    /**
     * Gets the URL used to connect to MongoDB
     * @returns {String}
     */
    get url(): string {
        if (this._url) return this._url;
        var url: string = 'mongodb://';

        if (this._config.username) {
            url += this._config.username;
            if (this._config.password)
                url += ':' + this._config.password;
            url += '@';
        }

        url += (this._config.host || 'localhost');
        if (this._config.port)
            url += ':' + this._config.port;

        url += '/' + this._config.database;

        return url;
    }

    /**
     * Gets the cache used to store objects retrieved from the database for performance reasons
     * @returns {cache}
     */
    get cache(): cache {
        return this._cache;
    }

    set cache(value: cache) {
        this._cache = value;
    }

    /**
     * Creates a new Iridium Core instance connected to the specified MongoDB instance
     * @param {Iridium.IridiumConfiguration} config The config object defining the database to connect to
     * @constructs Core
     */
    constructor(config: config);
    /**
     * Creates a new Iridium Core instance connected to the specified MongoDB instance
     * @param {String} url The URL of the MongoDB instance to connect to
     * @param {Iridium.IridiumConfiguration} config The config object made available as settings
     * @constructs Core
     */
    constructor(uri: string, config?: config);
    constructor(uri: string | config, config?: config) {

        var args = Array.prototype.slice.call(arguments, 0);
        uri = config = null;
        for(var i = 0; i < args.length; i++) {
            if(typeof args[i] == 'string')
                uri = args[i];
            else if(typeof args[i] == 'object')
                config = args[i];
        }

        if(!uri && !config) throw new Error("Expected either a URI or config object to be supplied when initializing Iridium");

        this._url = <string>uri;
        this._config = config;
    }

    /**
     * Registers a new plugin with this Iridium Core
     * @param {Iridium.Plugin} plugin The plugin to register with this Iridium Core
     * @returns {Iridium.Core}
     */
    register(plugin: IPlugin): Core {
        this.plugins.push(plugin);
        return this;
    }

    /**
     * Connects to the database server specified in the provided configuration
     * @param {function(Error, Iridium.Core)} [callback] A callback to be triggered once the connection is established.
     * @returns {Promise}
     */
    connect(callback?: (err: Error, core: Core) => any): Promise<Core> {
        var self = this;
        return Promise.bind(this).then(function() {
            if (self._connection) return self._connection;
            return MongoConnectAsyc(self.url);
        }).then(function (db: MongoDB.Db) {
            self._connection = db;
            return self;
        }).nodeify(callback);
    }

    /**
     * Closes the active database connection
     * @type {Promise}
     */
    close(): Promise<Core> {
        var self = this;
        return Promise.bind(this).then(function() {
            if (!self._connection) return this;
            var conn: MongoDB.Db = self._connection;
            self._connection = null;
            conn.close();
            return this;
        });
    }

    /**
     * Provides an express middleware which can be used to set the req.db property
     * to the current Iridium instance.
     * @returns {Iridium.ExpressMiddleware}
     */
    express(): expressMiddleware.ExpressMiddleware {
        return expressMiddleware.ExpressMiddlewareFactory(this);
    }
}
