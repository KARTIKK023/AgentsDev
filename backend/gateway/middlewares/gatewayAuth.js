import redis from "../config/redis.js";

export const gatewayAuth = async (req, res, next) => {
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

    // User info attach kar rahe hain taaki proxyReqOptDecorator use kar sake
    req.user = {
      id: session.userId,
      name: session.name,
      email: session.email,
      avatar: session.avatar,
    };

    next();
  } catch (error) {
    console.error("Gateway Auth Error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};