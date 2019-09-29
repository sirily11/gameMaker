export abstract class BasePlayer<T>{

    public abstract select(data: T): void

    public abstract deselect(): void;

}