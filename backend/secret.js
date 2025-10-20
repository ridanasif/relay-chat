// Paste the generated secreted in .env file under the name JWT_SECRET
import crypto from "crypto";

const secret = crypto.randomBytes(64).toString("hex");
console.log(secret);
