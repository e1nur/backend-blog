import jwt from "jsonwebtoken"

export const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "")
  if (token) {
    try {
      const decoded = jwt.verify(token, "secretId")
      req.userId = decoded._id
      next()
    } catch (err) {
      return res.status(402).json({
        message: "token is invalid",
      })
    }
  } else {
    return res.status(403).json({
      message: "access denied",
    })
  }
}
