import job_post from "../models/jobPost.model.js"


export const getJob = async (req, res) => {
    try {
        const jobs = await job_post.find({ verify: false }).lean();

        res.status(200).json({
            message: "fetch success",
            jobs
        })

    } catch (e) {
        res.status(500).json({
            message: "Internal server error"
        })
    }

}

// update jobs 

export const updateJob = async (req, res) => {
    const { id } = req.params;
   

    try {

        const result = await job_post.updateOne({ _id: id }, { $set: { verify: true } }, { strict: false });


        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "job not found"
            });
        }


        return res.status(200).json({ message: "updated" });

    } catch (e) {
        return res.status(500).json({
            message: "internal server error",
            error: e.message
        });
    }
}

export const deleteJob = async (req, res) => {
    const { id } = req.params;
   const _id = id

    try {
        const response = await job_post.findByIdAndDelete(_id);

        if (!response) {
            res.status(404).json({
                message: "Job post not found"
            })
        }
        return res.status(200).json({
            message: "Job deleted successfully",
        
        });
    } catch (e) {
        res.status(500).json({
            message: "Internal server error", e
        })
    }
}