const express = require( 'express' );
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');


mongoose.connect( 'mongodb://localhost/rabbits_db', {useNewUrlParser:true} );

const { RabbitModel } = require('./models/rabbitModel');

app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs');
app.use( express.static(__dirname + '/static') );
app.use(session({secret: 'verySecret'}));
app.use(flash());

app.use( express.urlencoded({ extended: true }) );

//render index 
app.get("/", function( request, response ){
    RabbitModel
        .getRabbits()
        .then( data =>{
            //console.log(data);
            response.render( 'index', {rabbits:data});
        } )

});

//render new 
app.get( '/new', function( request, response ){
    response.render( 'new' );
});

//create rabbits
app.post("/new", function( request, response ){
    //console.log(request.body);

    const name = request.body.name;
    const color = request.body.color;
    const weight = request.body.weight;
    const height = request.body.height;
    const health = request.body.health;

    const newRabbit = {
        name,
        color,
        weight,
        height,
        health
    };
    console.log( newRabbit );
    RabbitModel
        .createRabbit( newRabbit )
        .then( result => {
            //console.log(result);
            response.redirect('/');
        })
        .catch( err => {
            //console.log( "Something went wrong!", err );
            request.flash( 'messageError', 'You have to fill all the spaces!' );
            response.redirect( '/new' );
        })

    
});

//render show
app.get("/show/:id", function( request, response ){
    let id = ( request.params.id );

    RabbitModel
        .getRabbitById( id )
        .then( result =>{
            if( result === null ){
                throw new Error( "That rabbit doesn't exist" );
            }
            console.log("---------------------------------------");
            console.log(result);
            response.render( 'show', { found: true, rabbit: result });
        })
        .catch( error => {
            response.render( 'show', {found: false} );
        });
});

//render edit
app.get("/edit/:id", function( request, response ){
    let id = request.params.id;

    RabbitModel
        .getRabbitById( id )
        .then( result =>{
            if( result === null ){
                throw new Error( "That rabbit doesn't exist" );
            }
            response.render( 'edit', { found: true, rabbit: result });
        })
        .catch( error => {
            response.render( 'edit', {found: false} );
        });
});

//update rabbit
app.post("/edit/:id", function( request, response ){
    let id = request.params.id;
    const name = request.body.name;
    const color = request.body.color;
    const weight = request.body.weight;
    const height = request.body.height;
    const health = request.body.health;

    const currentRabbit = {
        name,
        color,
        weight,
        height,
        health
    };

    RabbitModel
        .updateInfo( id, currentRabbit )
        .then( result =>{
            console.log( result );
        })
        .catch( err =>{
            console.log( "Something went wrong!", err);
        });
        response.redirect('/');
});



//delete rabbit
app.post("/destroy/:id", function( request, response ){
    let id = request.params.id;

    RabbitModel
        .destroy( id )
        .then( result => {
            console.log( result);
            response.redirect( '/' );
        })
        .catch( err => {
            console.log( "Something went wrong!", err );
        })
});



app.listen(7077, function() {
    console.log("running on port 7077");
});