const router = require("express-promise-router")();
const authControllers = require("../controllers/users");
const contactsControllers = require("../controllers/contacts");
const messagesControllers = require("../controllers/messages");
const {validateData} = require("../helpers/validation");
const {UserSchema, messageSchema} = require("../helpers/validation/schema");

const {verifyToken} = require("../helpers/jwt");
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
  .get(verifyToken(), contactsControllers.getUserContacts);
router
  .route("/user/contacts")
  .post(verifyToken(), validateData(contact), contactsControllers.addContact);
router
  .route("/user/contacts/:id")
  .put(verifyToken(), validateData(contact), contactsControllers.updateContact);
router
  .route("/user/contacts/:id")
  .delete(verifyToken(), contactsControllers.deleteContact);

router
  .route("/:name/send")
  .post(
    verifyToken(),
    validateData(messageSchema),
    messagesControllers.sendMessage);

router.route('/:name/conversation').get(verifyToken(), messagesControllers.conversation);

module.exports = router;