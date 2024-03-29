import { config } from '../config';
import axios from "axios"



export abstract class Base<T, K>{

    /**
     * We will use this path to delete, update, create
     */
    path: string;
    /**
     * Created object's data
     */
    object?: T;
    /**
     * Children objects
     */
    children: K[];
    /**
     * If this has objects
     */
    hasChildren: boolean;


    constructor(args: { path: string, object?: T, hasChildren?: boolean }) {
        const { path, object, hasChildren } = args
        this.path = path;
        this.object = object;
        this.children = [];
        this.hasChildren = hasChildren === undefined
    }

    /**
     * Build tree
     */
    public abstract toJSON(): T | undefined

    /**
     * Call this at the begining
     * @param data Data from internet
     */
    public abstract async build(data: T): Promise<Base<T, K>>

    /**
     * Create new object<T>.
     * And send it's data to the server
     */
    public async create(): Promise<Base<T, K>> {
        const { baseURL, token } = config
        let url = `${baseURL}${this.path}/`
        let result = await axios.post<T>(url, this.object, { headers: { Authorization: `Bearer ${token()}` } })
        this.object = result.data
        return this
    }


    /**
     * Delete object.
     * And send the deletion request to the server
     */
    public async delete(): Promise<Base<T, K>> {
        const { baseURL, token } = config
        let url = `${baseURL}${this.path}/${(this.object as any).id}/`
        let result = await axios.delete<T>(url, { headers: { Authorization: `Bearer ${token()}` } })
        return this;
    }

    /**
     * Update the current object,
     * and then send the update request to the server
     * @param newData The object you want to update
     */
    public async update(newData: T): Promise<T> {
        if (this.object) {
            const { baseURL, token } = config
            let url = `${baseURL}${this.path}/${(this.object as any).id}/`
            let result = await axios.patch<T>(url, newData, { headers: { Authorization: `Bearer ${token()}` } })
            this.object = newData;
            return result.data;
        } else {
            throw ("No id in objecy")
        }

    }

    /**
     * Add child to children
     * @param child Child
     */
    public async  addChild(child: K): Promise<void> {
        if (this.hasChildren) {
            this.children.push(child)
        }
    }

    /**
     * Delete child
     * @param child Child you want to delete
     */
    public async deleteChild(child: K) {
        if (this.hasChildren) {
            let found = this.children.findIndex((c) => (c as any).object.id === (child as any).object.id)
            if (found > -1) {
                this.children.splice(found, 1)
            }
        }

    }
}