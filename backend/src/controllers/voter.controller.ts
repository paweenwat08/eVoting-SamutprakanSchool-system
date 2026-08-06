import { Voter } from "../models/voter.model";
import { Request, Response } from "express";

const registerVoter = async (req: Request, res: Response) => {
    try {
        const { studentId, firstname, lastname, password } = req.body;

        //basic validation

        if (!studentId || !firstname || !lastname || !password) {
            return res.status(400).json({ message: "All fields are important!" })
        }

        //check if existing

        const existing = await Voter.findOne({ studentId });
        if (existing) {
            return res.status(400).json({ message: "student Id already exists" })
        }

        const voter = await Voter.create({
            studentId,
            firstname,
            lastname,
            password
        })

        res.status(201).json({
            message: "voter added",
            voter: { id: voter._id, studentId: voter.studentId, firstname: voter.firstname }
        })

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message,
            });
        }

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

const loginVoter = async (req: Request, res: Response) => {
    try {
        
        //checking if voter alreasdy exists
        const { studentId, password } = req.body;

        const voter = await Voter.findOne({
            studentId: studentId.trim()
        });

        if (!voter) return res.status(400).json({ 
            message: "Voter not found"
        });

        //compare passwords
        const isMatch = await voter.comparePassword(password);
        if (!isMatch) return res.status(400).json({
            message: "invalid credentials"
        })

        res.status(200).json({
            message: "Voter Logged In",
            voter: {
                id: voter.id,
                studentId: voter.studentId,
                firstname: voter.firstname,
                lastname: voter.lastname
            }
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const logoutVoter = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.body;

        const voter = await Voter.findOne({
            studentId
        });

        if (!voter) return res.status(404).json({
            message: "Voter not found"
        });

        res.status(200).json({
            message: "Logout successful"
        })


    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error
        });
    }
}

export {
    registerVoter,
    loginVoter,
    logoutVoter
};