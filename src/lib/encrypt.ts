import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { User, user_role } from "../../prisma/interfaces";

const secretKey = process.env.SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

export interface SessionPayload extends JWTPayload {
  user_id: User["id"];
  expiresAt: Date;
  name: User["name"];
  email: User["email"];
  role: user_role;
}

// create session token
export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(encodedKey);
}

// verify session token
export async function verifySessionToken(session: string | undefined = "") {
  try {
    if (session === undefined) {
      console.log("session is undefined");
      return null;
    }
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("Error verifying session token:", error);
  }
}
