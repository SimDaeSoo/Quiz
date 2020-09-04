'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  picture: async ctx => {
    const { picture, token } = ctx.request.body;
    try {
      await strapi.query('token').update({ id: token }, { character: picture });
      ctx.status = 200;
      ctx.res.end();
    } catch (e) {
      ctx.status = 400;
      ctx.res.end();
    }
  }
};
