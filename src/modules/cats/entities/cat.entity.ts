import { MongooseEntity } from 'src/database/entities/base-mongoose.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: 'cats' })
export class CatEntity extends MongooseEntity {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    age: number;

    @Prop({ required: true })
    breed: string;
}

export const CatSchema = SchemaFactory.createForClass(CatEntity);
