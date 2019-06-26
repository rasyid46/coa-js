const Router = require('koa-router');
const queries = require('../db/queries/product');


const router = new Router();
const BASE_URL = `/api/v1/product/`;

router.get(BASE_URL, async (ctx) => {
    try {
      const product = await queries.getAllProduct();
      ctx.body = {
         code : 200,
         description : "Data Produk",
         content : product
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

  