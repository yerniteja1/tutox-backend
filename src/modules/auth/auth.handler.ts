import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../db";
import { institution, userInstMap, userLogin } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import bcrypt from "bcrypt";

type LoginBody = {
  mobileNo: string;
  password: string;
  rememberMe: boolean;
};
export const loginHandler = async (
  req: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply,
) => {
  try {
    const { mobileNo, password } = req.body;
    // 1. Find user
    const users = await db
      .select()
      .from(userLogin)
      .where(eq(userLogin.mobileNo, mobileNo));
    const user = users[0];

    if (!user) {
      return reply.status(401).send({ message: "Invalid credentials" });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return reply.status(401).send({ message: "Invalid credentials" });
    }

    // 3. Get institutions
    const mappings = await db
      .select({
        institutionId: userInstMap.institutionId,
        name: institution.name,
        address: institution.address,
      })
      .from(userInstMap)
      .leftJoin(institution, eq(userInstMap.institutionId, institution.id))
      .where(eq(userInstMap.userId, user.id));

    const institutions = mappings.map((m) => {
      id: m.institutionId;
      name: m.name;
      address: m.address;
    });

    // 4. Create Token
    const token = await reply.jwtSign({
      userId: user.id,
      mobileNo: user.mobileNo,
    });

    // 5. Response
    return reply.send({
      token,
      user: {
        id: user.id,
        name: user.name,
        mobileNo: user.mobileNo,
      },
      institutions,
    });
  } catch (err) {
    console.log(err);
  }
};

export const selectInstitutionHandler = async (
  req: FastifyRequest<{ Body: { institutionId: string } }>,
  reply: FastifyReply
) => {
  const { institutionId } = req.body;

  const user = req.user as { userId: string };

  // 1. Check mapping
  const mappings = await db
    .select()
    .from(userInstMap)
    .where(
      and(
        eq(userInstMap.userId, user.userId),
        eq(userInstMap.institutionId, institutionId)
      )
    );

  const mapping = mappings[0];

  if (!mapping) {
    return reply.status(403).send({ message: "Access denied" });
  }

  // 2. Get institution
  const instRes = await db
    .select()
    .from(institution)
    .where(eq(institution.id, institutionId));

  const inst = instRes[0];

  // 3. Create new token (WITH institution)
  const token = await reply.jwtSign({
    userId: user.userId,
    institutionId: institutionId,
    role: mapping.role,
  });

  // 4. Return response
  return reply.send({
    token,
    institution: inst,
  });
};

export const meHandler = async (req: any, reply: FastifyReply) => {
  const { userId, institutionId } = req.user;

  if (!institutionId) {
    return reply.status(400).send({ message: "Institution not selected" });
  }

  // 1. Get user
  const userRes = await db
    .select()
    .from(userLogin)
    .where(eq(userLogin.id, userId));

  const user = userRes[0];

  // 2. Get institution
  const instRes = await db
    .select()
    .from(institution)
    .where(eq(institution.id, institutionId));

  const inst = instRes[0];

  // 3. Get role from mapping
  const mapRes = await db
    .select()
    .from(userInstMap)
    .where(
      and(
        eq(userInstMap.userId, userId),
        eq(userInstMap.institutionId, institutionId)
      )
    );

  const mapping = mapRes[0];

  return reply.send({
    user: {
      id: user.id,
      name: user.name,
      mobileNo: user.mobileNo,
    },
    institution: inst,
    role: mapping?.role,
  });
};