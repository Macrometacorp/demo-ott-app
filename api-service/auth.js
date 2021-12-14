const jsC8 = require("jsc8");
const crypto = require("crypto");
const { v4: uuid } = require("uuid");

const jsc8Client = new jsC8({
  url: process.env.GDN_URL,
  apiKey: process.env.API_KEY,
});

const signup = async (request, response) => {
  try {
    const { email, password, displayName: name } = request.body;
    const passwordHash = await crypto
      .createHash("sha256")
      .update(password, "utf-8")
      .digest("hex");

    const customerId = uuid();

    const restQlResponse = await jsc8Client.executeRestql("signUp", {
      email,
      passwordHash,
      customerId,
      name,
    });

    return response.status(200).send(restQlResponse.result);
  } catch (error) {
    return response.status(400).send("User already exists");
  }
};

const signin = async (request, response) => {
  try {
    const { email, password } = request.body;

    const passwordHash = await crypto
      .createHash("sha256")
      .update(password, "utf-8")
      .digest("hex");

    const restQlResponse = await jsc8Client.executeRestql("signIn", {
      email,
      passwordHash,
    });

    if (restQlResponse && !restQlResponse.result.length) {
      throw new Error();
    }

    return response.status(200).send(restQlResponse.result);
  } catch (error) {
    return response.status(404).send("User does not exist");
  }
};

module.exports = {
  signin,
  signup,
};
