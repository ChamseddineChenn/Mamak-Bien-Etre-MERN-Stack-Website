import express from 'express';
import bodyParser from 'body-parser';
import {
  initiateKonnectPayment,
  konnectWebhookHandler,
} from '../controllers/paymentController.js';

const paymentRouter = express.Router();

paymentRouter.post('/konnect/initiate', initiateKonnectPayment);
paymentRouter.post(
  '/konnect/webhook',
  bodyParser.raw({ type: 'application/json' }),
  konnectWebhookHandler
);

export default paymentRouter;
