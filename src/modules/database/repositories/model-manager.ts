import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class ModelManager<TModels extends Record<string, any>> {
    private readonly models: Partial<Record<keyof TModels, Model<any>>> = {};

    constructor(models: Partial<Record<keyof TModels, Model<any>>>) {
        this.models = models;
    }

    getModel<K extends keyof TModels>(name: K): Model<TModels[K]> {
        const model = this.models[name];
        if (!model) {
            throw new Error(`Model "${String(name)}" is not registered.`);
        }
        return model;
    }

    addModel<K extends keyof TModels>(name: K, model: Model<TModels[K]>): void {
        if (this.models[name]) {
            throw new Error(`Model "${String(name)}" is already registered.`);
        }
        this.models[name] = model;
    }
}
