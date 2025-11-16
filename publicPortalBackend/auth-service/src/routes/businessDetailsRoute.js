import exprss from 'express';
import BusinessDetailsContoller from '../controllers/BusinessDetailsContoller.js';

const router = exprss.Router();

router.post('/business-details', BusinessDetailsContoller.handleAddBusinessDetails);

export default router;