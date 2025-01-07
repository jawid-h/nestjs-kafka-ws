import { Schema, Prop } from '@nestjs/mongoose';
import { BaseEntity } from './base.entity';

@Schema({ timestamps: true })
export abstract class MongooseEntity<ID = string> extends BaseEntity<ID> {
    @Prop({ type: String })
    id: ID;

    @Prop({ type: Number, default: () => Date.now() })
    createdAt?: number;

    @Prop({ type: Number, default: () => Date.now() })
    updatedAt?: number;
}
