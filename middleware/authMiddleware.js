import jwt from "jsonwebtoken"
import User from "../models/Users.js"

export const protect = async(req, res, next) => {
	try{
		const { token } = req.cookies
		if (!token) {
			console.log(token)
			return res.status(401).json({msg: 'You are not authorized!.'})
		}
		//verify token
		const isTokenVerified = jwt.verify(token, process.env.JWT_SECRET)
		if (!isTokenVerified) {
			return res.status(401).json({msg: 'Your are not authorized.'})
		}
		const user = await User.findById(isTokenVerified.userId).select('-password')
		if (!user) {
			return res.status(401).json({msg: 'User not found.'})
		}
		req.user = user
		next()
	}catch (error) {
		return res.status(401).json({msg: 'User not Authorized, please login.'})
	}
}

export const verifyAdmin = async(req, res, next) => {
	try {
		const { token } = req.cookies
		if (!token) {
			return res.status(401).json({msg: 'You are not authorized!.'})
		}
		const isTokenVerified = jwt.verify(token, process.env.JWT_SECRET) // verifying token
		if (!isTokenVerified) {
			return res.status(401).json({msg: 'Your are not authorized.'})
		}
		const admin = await User.find(isTokenVerified.isAdmin).select('-password')
		if (!admin) {
			return res.status(401).json({msg: 'You are not an Admin.'})
		}
		req.admin = admin
		next()
	} catch (error) {
		return res.status(401).json( {msg: 'User not Authorized, you are not an admin.'} )
	}
}