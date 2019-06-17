const Router = require('koa-router');
const queries = require('../db/queries/user');


const router = new Router();
const BASE_URL = `/api/v1/auth/`;

router.get(BASE_URL, async (ctx) => {
    try {
      const movies = await queries.getAllUser();
      ctx.body = {
         status:"true",
         data : movies
      };
    } catch (err) {
      console.log(err)
    }
  });
  
router.get(BASE_URL+'list', async(ctx) => {
    ctx.body = {
        status: {
            "success": true,
            "code": 200,
            "message": "Call successfully"
          }
      }
});


module.exports = router;

  