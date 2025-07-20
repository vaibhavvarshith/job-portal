const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * This function checks for a valid JSON Web Token (JWT) in the request's Authorization header.
 * If the token is valid, it decodes the user information and attaches it to the request object (`req.user`).
 * If the token is missing or invalid, it sends a 401 (Unauthorized) error response.
 */
const auth = (req, res, next) => {
  // Get the token from the Authorization header.
  // The header format is typically "Bearer <token>".
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // If no token is found, deny access.
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  try {
    // Verify the token using the same secret key used to sign it.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded payload (which contains user's id, email, role) to the request object.
    // This makes the user's information available to any subsequent protected route handlers.
    req.user = decoded;

    // Call `next()` to pass control to the next middleware or the actual route handler.
    next();
  } catch (error) {
    // If jwt.verify fails (e.g., token is expired or malformed), send an error response.
    res.status(401).json({ message: 'Token is not valid.' });
  }
};

module.exports = auth;
