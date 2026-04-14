import db from "../db/connection.db.js";
import '../utils/loadEnv.js'

// create post 
export const CreateJobPost = async (req, res) => {
    const { role, company, job_description, skills, work_type, apply_link } = req.body

    if (!role || !company || !job_description || !skills || !work_type || !apply_link) {
        return res.status(400).json({
            message: "Invalid Input"
        });
    }

    // data convert 
    const createdAt = new Date();

    const formattedDate = createdAt.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const sansitizeInput = {
        role: role,
        company: company,
        job_description: job_description,
        skills: skills,
        work_type: work_type,
        apply_link: apply_link,
        verify: false,
        created_at: formattedDate
    }

    try {

        const result = await db.collection("job_posts").insertOne(sansitizeInput);
        console.log("db", result)
        if (!res) {
            return res.status(400).json({ message: "Failed to Upload" })
        }
        res.status(201).json({ message: "Job post created successfully ", sansitizeInput })
    } catch (err) {
        res.status(500).json({ message: "Internal server error" })
    }


}

// get job from db
export const JobPost = async (req, res) => {
    try {
        const job = await db.collection("job_posts").find({ verify: true }).toArray();

        res.status(200).json({
            message: "Successfully fetch data from db",
            data: job
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error", err
        })
    }
}