const router = require("express-promise-router")();
const authControllers = require("../controllers/users");
const contactsControllers = require("../controllers/contacts");
const messagesControllers = require("../controllers/messages");
const {validateData} = require("../helpers/validation");
const {UserSchema, messageSchema} = require("../helpers/validation/schema");

const {verifyToken} = require("../helpers/jwt");
const { getContact, getCurrentUser } = require("../helpers/middleware");
const contact = {
  name: UserSchema.name,
  phoneNumber: UserSchema.phoneNumber
};

router
  .route("/user/signup")
  .post(validateData(UserSchema), authControllers.signUp);
router.route("/user/signin").post(authControllers.signIn);

router
  .route("/user/contacts")
  .get(verifyToken(), getCurrentUser, contactsControllers.getUserContacts);
router
  .route("/user/contacts")
  .post(verifyToken(), validateData(contact), getCurrentUser, contactsControllers.addContact);
router
  .route("/user/contacts/:id")
  .put(verifyToken(), validateData(contact), getCurrentUser, getContact('id'), contactsControllers.updateContact);
router
  .route("/user/contacts/:id")
  .delete(verifyToken(), getCurrentUser, getContact('id'), contactsControllers.deleteContact);

router
  .route("/:name/send")
  .post(
    verifyToken(),
    validateData(messageSchema),
    getCurrentUser,
    getContact('name'),
    messagesControllers.sendMessage);

router.route('/:name/:type').get(verifyToken(), getCurrentUser, getContact('name'), messagesControllers.conversation);
router.route('/:name/:type/:msg_id').get(verifyToken(), getCurrentUser, getContact('name'), messagesControllers.getMessage);
router.route('/:name/:type/:msg_id').put(verifyToken(), getCurrentUser, getContact('name'), messagesControllers.editMessage);
router.route('/:name/:type/:msg_id').delete(verifyToken(), getCurrentUser, getContact('name'), messagesControllers.deleteMessage);

module.exports = router;