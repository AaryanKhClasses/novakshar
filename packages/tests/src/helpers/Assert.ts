export class Assert {
    public static isTrue(value: boolean, message: string): void {
        if(!value) throw new Error(message)
    }

    public static isFalse(value: boolean, message: string): void {
        this.isTrue(!value, message)
    }

    public static isNotNull<T>(value: T | null | undefined, message: string): T {
        if(value == null) throw new Error(message)
        return value
    }

    public static areEqual<T>(expected: T, actual: T, message: string): void {
        if(expected !== actual) throw new Error(`${message}\nExpected: ${expected}\nActual: ${actual}`)
    }
}
