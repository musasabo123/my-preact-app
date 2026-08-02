import mongoose, { Document, Schema } from 'mongoose';


export interface ICourse {
  code: string;
  grade: string;
  units: number;
}

export interface IResult extends Document {
  userId: string;
  semester: string;
  gpa: number;
  cgpa: number;
  courses: ICourse[];
  date: Date;
}


const CourseSchema: Schema = new Schema({
  code: { type: String, required: true },
  grade: { type: String, required: true },
  units: { type: Number, required: true },
}, { _id: false });

const ResultSchema: Schema = new Schema({
  userId: { type: String, required: true },
  semester: { type: String, required: true },
  gpa: { type: Number, required: true },
  cgpa: { type: Number, required: true },
  courses: { type: [CourseSchema], required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<IResult>('Result', ResultSchema);
