'use strict';
const {
  sanitizeEntity
} = require('strapi-utils');

async function getQuizzes() {
  const quizzes = await strapi.services.quiz.find();
  const parsedQuizzes = quizzes.map((quiz) => {
    return {
      id: quiz.id,
      title: quiz.title
    }
  });
  return parsedQuizzes;
}

module.exports = {
  index: async ctx => {
    const quizzes = await getQuizzes();
    ctx.send(quizzes);
  }
};
