const mongoose = require( 'mongoose' );

const RabbitSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minlength : 2,
        maxlength : 20
    }, 
    color : {
        type : String,
        required : true,
        minlength : 2,
        maxlength : 20
    },
    weight : {
        type : Number,
        required : true,
    },
    height : {
        type : Number,
        required : true,
    }
    ,
    health : {
        type : String,
        required : true,
        minlength : 3,
        maxlength : 100
    }
    
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Rabbit = mongoose.model( 'rabbit', RabbitSchema );

const RabbitModel = {
    createRabbit : function( newRabbit ){
        return Rabbit.create( newRabbit );
    },
    getRabbits : function( ){
        return Rabbit.find().sort( { created_at: -1 } );
    },
    getRabbitById : function( id ){
        return Rabbit.findOne( { _id : id } );
    },
    updateInfo : function( id, newRabbit ){
        return Rabbit.updateOne( { _id : id }, newRabbit );
    },
    destroy : function( id ){
        return Rabbit.remove({ _id : id });
    }
};

module.exports = {RabbitModel};