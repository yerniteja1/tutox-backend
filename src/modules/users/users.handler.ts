import { and, eq } from "drizzle-orm";
import { userInstMap, userLogin } from "../../db/schema";
import { db } from "../../db";
import { FastifyReply } from "fastify";

export const getUsersHandler = async (req: any, reply: FastifyReply) => {
  const { institutionId } = req.user;

  const users = await db
    .select({
      id: userLogin.id,
      name: userLogin.name,
      mobileNo: userLogin.mobileNo,
      role: userInstMap.role,
    })
    .from(userInstMap)
    .leftJoin(userLogin, eq(userInstMap.userId, userLogin.id))
    .where(eq(userInstMap.institutionId, institutionId));

  return reply.send(users);
};

export const getUserHandler = async (req: any, reply: FastifyReply) => {
  const { id } = req.params;
  const { institutionId } = req.user;

  const res = await db
    .select({
      id: userLogin.id,
      name: userLogin.name,
      mobileNo: userLogin.mobileNo,
      role: userInstMap.role,
    })
    .from(userInstMap)
    .leftJoin(userLogin, eq(userInstMap.userId, userLogin.id))
    .where(
      and(
        eq(userInstMap.userId, id),
        eq(userInstMap.institutionId, institutionId)
      )
    );

  return reply.send(res[0]);
};

import bcrypt from "bcrypt";

export const createUserHandler = async (req: any, reply: FastifyReply) => {
  const { name, mobileNo, password, role } = req.body;
  const { institutionId } = req.user;

  const passwordHash = await bcrypt.hash(password, 10);

  // 1. create user
  const userRes = await db
    .insert(userLogin)
    .values({
      name,
      mobileNo,
      passwordHash,
    })
    .returning();

  const user = userRes[0];

  // 2. map to institution
  await db.insert(userInstMap).values({
    userId: user.id,
    institutionId,
    role,
  });

  return reply.send(user);
};

export const updateUserHandler = async (req: any, reply: FastifyReply) => {
  const { id } = req.params;
  const { name, role } = req.body;
  const { institutionId } = req.user;

  await db
    .update(userLogin)
    .set({ name })
    .where(eq(userLogin.id, id));

  await db
    .update(userInstMap)
    .set({ role })
    .where(
      and(
        eq(userInstMap.userId, id),
        eq(userInstMap.institutionId, institutionId)
      )
    );

  return reply.send({ success: true });
};