import { MongoClient } from 'mongodb'
import clientPromise from './mongodb'

// This file is an adapter to allow using Mongoose logic with the existing MongoClient setup
// OR to established a Mongoose connection if needed by the User model.
// However, since the user is mixing patterns (mongoose models vs native client), 
// we should ideally unify. 
// Given the User model (likely Mongoose), we need a Mongoose connection.

import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null }
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        }

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose
        })
    }

    try {
        cached.conn = await cached.promise
    } catch (e) {
        cached.promise = null
        throw e
    }

    return cached.conn
}

export default dbConnect
