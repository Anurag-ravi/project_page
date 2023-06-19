const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    project_id: {
        type: String,
        required: true,
        unique: true
    },
    name : {
        type: String,
        required: true
    },
    markdown: {
        type: String,
        default: ""
    },
    links: [
        {
            name: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
            link_type: {
                type: String,
                enum: ['github', 'website', 'apk'],
                required: true
            }
        }
    ],
    images: [
        {
            src: {
                type: String,
                required: true
            },
            alt: {
                type: String,
                default: "image"
            }
        }
    ],
    videos : [
        {
            src: {
                type: String,
                required: true
            },
            alt: {
                type: String,
                default: "video"
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
