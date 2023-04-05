

const { Schema, model } = require('mongoose');;


const ProductoSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    categorie: {
        type: Schema.Types.ObjectId,
        ref: 'Categorie',
        required: true
    },
    description: { type: String },
    available: { type: Boolean, default: true }
});

ProductoSchema.methods.toJSON = function() {
    const { __v, state, ...data } = this.toObject();
    return data;
}

module.exports = model( 'Product', ProductoSchema );