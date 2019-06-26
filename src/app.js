'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const Koa = require('koa');
const jwt = require('koa-jwt');
const logger = require('koa-logger');
const router = require('koa-router')();
const koaBody = require('koa-body');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const productRoutes = require('./routes/prodctRoute');
const authRoutes = require('./routes/loginRoute');
const secret = process.env.JWT_SECRET || 'jwt_secret123';
const Muser = require('./db/queries/user');
const app = new Koa();
const saltRounds = 10;

const users = [{
  "username": "user1",
  "password": "$2a$05$3PbgZWLbAyycMxuuaUN4juV4f7nfhVVoBHOvP6FBKA9JMLweZpSri",
  "email": "thedude@slacker.com",
  "name": "srzzz"
}]; 


// Custom 401 handling
app.use(async function (ctx, next) {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401;
      let errMessage = err.originalError ?
        err.originalError.message :
        err.message
      ctx.body = {
        error: errMessage
      };
      ctx.set("X-Status-Reason", errMessage)
    } else {
      throw err;
    }
  });
});


app.use(function *(next){
  try {
    yield next;
  } catch (err) {
    if (401 == err.status) {
      this.status = 401;
      this.body = {
        code : this.status,
        descriptions : "Protected resource, use Authorization header to get access or jwt expired"  
      }
    } else {
      throw err;
    }
  }
});

app.use(jwt({
 secret: secret
}).unless({
  path: [/^\/public/, "/"]
}));

app.use(async(ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

if (process.env.NODE_ENV != 'test') {
  app.use(logger());
}
app.use(koaBody());

router.get('/', async(ctx) => { 
  const movies = await Muser.getAllUser();
  ctx.body = movies;
});
router.get('/api/sule', async(ctx) => {
  ctx.body = 'Hezzzllo';
});

router.get('/public/user', async(ctx) => {
  var data_user = users;
  ctx.body = {
    "code":"200",
    "data" : data_user
  };
});
/**
 * You can register with:
 * curl -X POST --data '{"username":"thedude", "password":"abides", "email":"thedude@slacker.com", "name":"Mr. Lebowski"}' http://localhost:9000/public/register
 */
router.post('/public/register', async(ctx, next) => {
  if (!ctx.request.body.username || !ctx.request.body.password || !ctx.request.body.email || !ctx.request.body.name) {
    ctx.status = 400;
    ctx.body = {
      error: 'expected an object with username, password, email, name but got: ' + ctx.request.body
    }
    return;
  }

  ctx.request.body.password = await bcrypt.hash(ctx.request.body.password, 5);
  const user = getUserByUsername(ctx.request.body.username, users);

  console.log("Register   ");
 
  console.log(ctx.request.body);

  if (!user) {
    users.push(ctx.request.body);
    ctx.status = 200;
    ctx.body = {
      message: "success"
    };
    next();
  } else {
    ctx.status = 406;
    ctx.body = {
      error: "User exists"
    }
    return;
  }
});

/**
 * You can login with:
 * curl -X POST -H "Content-Type: application/json" --data '{"username":"thedude", "password":"abides"}' http://localhost:9000/public/login
 */
// router.post('/public/login', async(ctx, next) => {
//   let user = await getUserByUsername(ctx.request.body.username, users);
//   if (!user) {
//     ctx.status = 401;
//     ctx.body = {
//       error: "bad username"
//     }
//     return;
//   }
//   const {
//     password
//   } = user;
//   if (await bcrypt.compare(ctx.request.body.password, password)) {
 
//    console.log('Data User Login');
//    console.log(user);
//     ctx.body = {
//       token: 'Bearer '+jsonwebtoken.sign({
//         data: user,
//         //exp in seconds
//        // exp: Math.floor(Date.now() / 1000) - (60 * 60) // 60 seconds * 60 minutes = 1 hour
//       },
//        secret,{expiresIn : (60*60)*12 }
//       )
//     }
//     next();
//   } else {
//     ctx.status = 401;
//     ctx.body = {
//       error: "bad password"
//     }
//     return;
//   }
// });
 
router.post('/public/login', async(ctx, next) => {
  var email =ctx.request.body.email; 
  var password2 =  ctx.request.body.password;
  var passhass11 = bcrypt.hashSync(password2, saltRounds);
  const user = await Muser.getUserByEmail(email); 
 
  let hash = user[0].password;
  
  if(bcrypt.compareSync(password2, hash)) {

    var  token=  'Bearer '+jsonwebtoken.sign({
      data: user,
    },
     secret,{expiresIn : (60*60)*12 }
    );
    user.token = token;
    var respon = user; 
    respon[0].token= token;
    ctx.body = {
      code: 200,
      description : "ok",
      content: respon[0],  
    }
   } else {
    ctx.status = 404;
    ctx.body = {
      code: 200,
      description : "credential not found",
    }
  }
});

/**
 * After you login and get a token you can access
 * this (and any other non public endpoint) with:
 * curl -X GET -H "Authorization: Bearer INSERT_TOKEN_HERE" http://localhost:9000/sacred
 */
router.get('/api/v1/DB', async(ctx) => {
  console.log('Data user TOken '); 
  var token_header = ctx.request.header.authorization;
  let authorizationArr = token_header.split(' ');
  if(authorizationArr[0] != 'Bearer'){
    return res.status(401).send('Invalid token format');
  }
  let token_sec_a = authorizationArr[1];
  try {
    var decoded = jsonwebtoken.verify(token_sec_a, secret);
  } catch(err) {
    console.log(err);
  }

  ctx.body = {
    "code" : 200,
    "description" : "data user",
    "content" : decoded.data[0]
  }
});


 

function getUserByUsername(username, users) {
  let user;
  for (let i = 0; i < users.length; i++) {
    user = users[i];
    if (user.username === username) {
      return user;
    }
  }
  return null;
};

function getUserByEmail(){
   try {
    // const movies = await Muser.getAllUser();
   } catch (error) {
    console.log(err)
   }
};

/**
 * After you login and get a token you can access
 * this (and any other non public endpoint) with:
 * curl -X GET -H "Authorization: Bearer INSERT_TOKEN_HERE" http://localhost:9000/sacred
 */
router.get('/api/v1', async(ctx) => {
  console.log('Data user TOken '); 
  var token_header = ctx.request.header.authorization;
  console.log(token_header); 
  console.log('Sekret kode :'+secret);


  let authorizationArr = token_header.split(' ');

  if(authorizationArr[0] != 'Bearer'){
    return res.status(401).send('Invalid token format');
  }

  let token_sec_a = authorizationArr[1];


  try {
    var decoded = jsonwebtoken.verify(token_sec_a, secret);
    console.log(decoded);
  } catch(err) {
    console.log(err);
  }
 
  ctx.body = 'Hello '  + ctx.state.user.data.name
});

router.post('/api/v1', async(ctx) => {
  console.log(ctx.request.body);
  ctx.body ={
    code : 200,
    description : "hello",
    content :ctx.state.user.data[0]
  }  
});

app.use(router.routes());
app.use(productRoutes.routes());
app.use(authRoutes.routes()); 
app.use(router.allowedMethods());

module.exports = app;