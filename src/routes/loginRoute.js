const Router = require('koa-router');
const queries = require('../db/queries/user');
const bcrypt = require('bcrypt');

const router = new Router();
const BASE_URL = `/api/v1/auth/`;

router.get(BASE_URL, async (ctx) => {
    try {
      const user = await queries.getAllUser();
      ctx.body = {
         status:"true",
         data : user
      };
    } catch (err) {
      console.log(err)
    }
  });
  
router.get(BASE_URL+'list', async(ctx) => {

  console.log('zz okoko');

  
  console.log(ctx.request.body);
  
try {
  var email ='bluedot@askrindo.com';
  var password ='admin1234!';  
  var password2 =  ctx.request.body.password;
  const user = await queries.getUserByEmail(email); 
  let hash = user[0].password;
  var cocok = false; 
 
 

  
  if(bcrypt.compareSync(password, hash)) {
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

  