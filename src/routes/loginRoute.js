const Router = require('koa-router');
const queries = require('../db/queries/user');
const bcrypt = require('bcrypt');

const router = new Router();
const BASE_URL = `/api/v1/user/`;

router.get(BASE_URL, async (ctx) => {
    try {
      const user = await queries.getAllUser();
      ctx.body = {
         code:200,
         description : "User registered",
         content : user
      };
    } catch (err) {
      console.log(err)
    }
  });

  router.post(BASE_URL+'list', async(ctx) => { 
    try {
      var email ='bluedot@askrindo.com'; 
      var password2 =  ctx.request.body.password2;
      const user = await queries.getUserByEmail(email); 
      let hash = user[0].password;
      var cocok = false; 
      console.log("data password");
      console.log(password2,hash);
      
      if(bcrypt.compareSync(password2, hash)) {
        // Passwords match
        var cocok = true; 
      }  

      ctx.body = {
            status: {
                "success": cocok,
                "code": password2,
                "message": "Call successfully"
              },
            "data" : user
          }
    } catch (error) {
      console.log(error)
    }
  
});


module.exports = router;

  