import mongoose, { Schema } from 'mongoose'
import validator from 'validator' // for validating email
import bcrypt from 'bcrypt-nodejs' // for hashing password
import cuid from 'cuid' // for initial username


import { DEFAULT_PROFILE } from '../../client/utils/initialData.js'

const profileSchema = new Schema({
    username: {
	type: String,
	default: ""
    },
    email: {
	type: 'String',
	lowercase: true,
    	validate: {
	    validator: validator.isEmail,
	    message: '{VALUE} is not a valid email'
	}
    },
    /* For email auth */
    password: { type: 'String' },
    /* For google auth */
    googleId: { type: 'String' },
    /* Meta */
    createdAt: { type: Date, default: new Date() },
    lastLoggedIn: { type: Date, default: new Date() },
    source: { type: String, default: null },
    /* Prefs */
    prefs: {
	type: JSON,
	unique: false,
	required: false,
	default: DEFAULT_PROFILE.prefs
    }
})


/* Profile collection */
export default mongoose.model('Profile', profileSchema)
