// utils/jwt.js
import jwt from 'jsonwebtoken';
import { ApiError } from './ApiError.js';

export const generateTokens = async (user) => {
  try {
    const accessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role || 'user',
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d',
      }
    );

    const refreshToken = jwt.sign(
      {
        _id: user._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
      }
    );

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error while generating tokens");
  }
};

export const verifyAccessToken = (token) => {
  try {
    if (!token) {
      throw new ApiError(401, "Access token is required");
    }
    
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, "Access token has expired");
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(401, "Invalid access token");
    }
    throw new ApiError(401, error.message || "Invalid access token");
  }
};

export const verifyRefreshToken = (token) => {
  try {
    if (!token) {
      throw new ApiError(401, "Refresh token is required");
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, "Refresh token has expired");
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(401, "Invalid refresh token");
    }
    throw new ApiError(401, error.message || "Invalid refresh token");
  }
};

export const attachCookiesToResponse = (res, { accessToken, refreshToken }) => {
  const accessTokenExpiry = parseInt(process.env.ACCESS_TOKEN_EXPIRY_DAYS || '1') * 24 * 60 * 60 * 1000;
  const refreshTokenExpiry = parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || '7') * 24 * 60 * 60 * 1000;

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + accessTokenExpiry),
    sameSite: 'strict'
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + refreshTokenExpiry),
    sameSite: 'strict'
  });
};

export const clearTokens = (res) => {
  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  
  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
};

export const extractTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.split(' ')[1];
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    
    // Here you would typically verify the user still exists in the database
    // and that the refresh token matches what's stored
    // This is just an example structure
    const user = await User.findById(decoded._id);
    if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const tokens = await generateTokens(user);
    return tokens;
  } catch (error) {
    throw new ApiError(401, error.message || "Error refreshing access token");
  }
};