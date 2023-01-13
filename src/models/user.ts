import mongoose, { Mongoose } from "mongoose";
import { Password } from "../services/password";

interface UserAttrs {
	email: string;
	password: string;
}

//interface for user model
interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}

//interface for user doc

interface UserDoc extends mongoose.Document {
	email: string;
	password: string;
}

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		}
	},
	{
		toJSON: {
			transform(doc, ret, options) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.password;
			}
		},
		versionKey: false
	}
);

userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs);
};

userSchema.pre("save", async function (done) {
	if (this.isModified("password")) {
		const hashedPass = await Password.toHash(this.get("password"));
		this.set("password", hashedPass);
	}

	done();
});

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

User.build({
	email: "asd",
	password: "asd"
});

export { User };
