import exprss from 'express';
import BusinessDetailsContoller from '../controllers/BusinessDetailsContoller.js';

const router = exprss.Router();

router.post('/business-details', BusinessDetailsContoller.handleAddBusinessDetails);
router.post('/get-business-details', BusinessDetailsContoller.handleViewBusinessDetails);

export default router;