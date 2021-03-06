/**
 * A method which is called once an asynchronous operation has completed, an alternative
 * to using Promises.
 * @param T The type of object returned by the asynchronous operation.
 */
export interface Callback<T> {
    /**
     * A function which is called upon the completion of an asynchronous operation
     * @param {Error} err The error object, if one occurred, otherwise null if the operation completed successfully.
     * @param {Object} object The result of the asynchronous operation if it completed successfully. If err is defined, the presence of this value is unknown.
     */
    (err: Error|null, object?: T): void;
}

/**
 * A method which is used to determine whether a value within a collection meets a set of criteria.
 * @param {any} T The type of item in the collection.
 */
export interface Predicate<TThis,TObject> {
    /**
     * A function which is called to determine whether a value meets arbitrary criteria
     * @param {Object} object The value of the item in the collection
     * @param {String} key The key, if one is available, under which the item appeared within the collection
     * @returns {Boolean} A true-y value if the item met the predicate conditions, false-y values if it did not.
     */
    (this: TThis, object: TObject, key?: string): boolean;
}

/**
 * A method which is used to map values of one type to another across a list.
 * @param {any} TIn The type of the values in the list
 * @param {any} TOut The type of the values generated by the mapper
 */
export interface Mapper<TIn,TOut> {
    /**
     * A function which is called to map values in a list from one type to another
     * @param {any} value The value of the item to be mapped
     * @returns {any} The mapped value which will appear in the output list
     */
    (value: TIn): TOut;
}

/**
 * A method which is called to retrieve a value of the given type.
 * @param {any} T The type of value to be retrieved.
 */
export interface PropertyGetter<T> {
    /**
     * Gets the current value of the property
     * @returns {T} The current value
     */
    (): T;
}

/**
 * A method which is called to set a value of the given type.
 * @param {any} T The type of value to set
 */
export interface PropertySetter<T> {
    /**
     * Sets the value to the provided one
     * @param {T} value The new value to set
     */
    (value: T): void;
}

/**
 * A compound property which provides either a getter, setter or both.
 * @param {any} T The type of objects stored in the property
 */
export interface Property<T> {
    /**
     * An optional getter which can be used to retrieve the property's value
     */
    get?: PropertyGetter<T>;
    /**
     * An optional setter which can be used to set the property's value
     */
    set?: PropertySetter<T>;
}