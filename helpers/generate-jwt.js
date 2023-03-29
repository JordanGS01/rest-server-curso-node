

const jwt = require('jsonwebtoken');


const generateJWT = ( uid = '') => {
    return new Promise((resolve, reject) => {
        // What we are going to save in the payload
        const payload = { uid };

        jwt.sign( payload, process.env.SECRETORPUBLICKEY, {
            expiresIn: '4h'
        }, (error, token) => {
            if (error) {
                console.log(error);
                reject( 'No se pudo generar el token' );
            } else {
                resolve( token );
            }
        })
    })
}

module.exports = {
    generateJWT
}