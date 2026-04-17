import { Schema } from "mongoose";
import { model } from "mongoose";


const job_posts = new Schema({
    role: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true,

    },
    job_description: {
        required: true,
        type: String
    },
    work_type: {
        type: String,
        required: true
    },
    skills: [{
        type: String,
        required: true
    }],
    apply_link: {
        type: String,
        required: true
    },
    verify: {
        type: Boolean
    },
    created_at: {
        type: String
    }
});

const job_post = model("job_posts", job_posts, "job_posts");

export default job_post