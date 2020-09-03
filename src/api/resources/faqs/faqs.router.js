import express from 'express';
import passport from 'passport';
import faqsController from './faqs.controller';

export const faqsRouter = express.Router();
faqsRouter
  .route('/')
  .post(passport.authenticate('jwt', { session: false }), faqsController.create)
  .get(passport.authenticate('jwt', { session: false }), faqsController.findAll);

faqsRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), faqsController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), faqsController.delete)
  .put(passport.authenticate('jwt', { session: false }), faqsController.update);
