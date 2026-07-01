export abstract class BaseError extends Error {
    public readonly code: string
    
    protected constructor(code: string, message: string) {
        super(message)
        this.code = code
        this.name = new.target.name
        
        Object.setPrototypeOf(this, new.target.prototype)
    }
}
