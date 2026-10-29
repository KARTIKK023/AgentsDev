import redis from "../../../shared/redis/redis.js";

export const authenticate = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.session;

    if (!sessionId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const sessionData = await redis.get(`session-${sessionId}`);

    if (!sessionData) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const session = JSON.parse(sessionData);

    req.user = {
      id: session.userId,
      name: session.name,
      email: session.email,
      avatar: session.avatar
    };

    next();
  } catch (error) {
    next(error);
  }
};