// Make BigInt json serializable, note this doesn't go from string -> BigInt when parsing
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

export function stripObjectUnicode(t: object): object {
    if (!t) return t;
    // Warning negative lookbehind `(?<!\\)` in regex might not work in all JS versions
    return JSON.parse(
        JSON.stringify(t)
            .replace(/(?<!\\)\\u[0-9A-Fa-f]{4}/g, '')
    );
}
