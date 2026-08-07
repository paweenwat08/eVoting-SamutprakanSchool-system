import { Candidate } from "../models/candidate.model";
import { Request, Response } from "express";

const addCandidate = async (req: Request, res: Response) => {
    try {

        const { firstname, lastname, party, district } = req.body;

        //basic validation
        if (!firstname || !lastname || !party || !district) {
            return res.status(400).json({ message: "All fields are important!" })
        }

        //check if existing
        const existing = await Candidate.findOne({ firstname, lastname });
        if (existing) {
            return res.status(400).json({ message: `${firstname} ${lastname} already exists` })
        }

        const candidate = await Candidate.create({
            firstname,
            lastname,
            party,
            district
        })
        res.status(201).json({
            message: "Candidate added",
            voter: { id: candidate._id, firstname: candidate.firstname, party: candidate.party }
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error", error
        });
    }
}

const getCandidates = async (req: Request, res: Response) => {
    try {
        const candidates = await Candidate.find().populate("party");;

        res.status(200).json({
            success: true,
            candidates
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get parties"
        });
    }
}

export {
    addCandidate,
    getCandidates
}