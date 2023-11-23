import { Router } from "express";
import { MiddlewareAuth } from "middleware/auth-middleware";
import { userClientService } from "./service/user-client-service";

const router = Router();
const baseUrl = "/user-client";

router.use(MiddlewareAuth.authenticate);
router.post(`${baseUrl}`, userClientService.create);
router.get(`${baseUrl}`, userClientService.listAll);
router.get(`${baseUrl}/:id`, userClientService.read);
router.patch(`${baseUrl}/:id`, userClientService.update);
router.delete(`${baseUrl}/:id`, userClientService.delete);

export const userClientRouter = router;
