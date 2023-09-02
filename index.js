const express = require('express');
const router = express();
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
require('dotenv').config();
const Project = require('./models/project');
const User = require('./models/user');
const auth = require('./middleware/user');
/** Connect to Mongo */
mongoose
    .set('strictQuery', true)
    .connect(process.env.MONGODB_URI, {})
    .then(() => {
        console.log('Mongo connected successfully.');
        StartServer();
    })
    .catch((error) => console.error(error));
function isValidString(str) {
    const regex = /^[a-zA-Z0-9_-]+$/;
    return regex.test(str);
}
async function renderPage(project,res) {
    const lls = [
        "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
        "https://img.icons8.com/?size=512&id=a04gr8MLo013&format=png",
        "https://img.icons8.com/?size=512&id=3OLJ5A25EACa&format=png",
        "https://img.icons8.com/?size=512&id=22813&format=png"
    ]
    let links = [];
    project.links.forEach(link => {
        if(link.link_type === 'github') {
            links.push({
                url: link.url,
                name: link.name,
                link_type: lls[0]
            });
        } else if(link.link_type === 'website') {
            links.push({
                url: link.url,
                name: link.name,
                link_type: lls[1]
            });
        } else if(link.link_type === 'apk') {
            links.push({
                url: link.url,
                name: link.name,
                link_type: lls[2]
            });
        } else if(link.link_type === 'docker') {
            links.push({
                url: link.url,
                name: link.name,
                link_type: lls[3]
            });
        }
    });
    project.links = links;
    res.render('index', { project, project });
}
/** Only Start Server if Mongoose Connects */
const StartServer = () => {
    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());
    router.use(cors());
    router.set('view engine', 'ejs');
    router.use(express.static('assets'));
    router.get('/', async (req, res) => {
        const project = await Project.findOne({ project_id:'project_page' })
        .select('-markdown')
        .populate(
            {
                path: 'user',
                select: 'name'
            }
        );
        if (project) {
            renderPage(project,res);
        } else {
            res.render('404',{ project_id : "Home" });
        }
    });
    router.get('/:project_id', async (req, res) => {
        const { project_id } = req.params;
        const project = await Project.findOne({ project_id })
        .select('-markdown')
        .populate(
            {
                path: 'user',
                select: 'name'
            }
        );
        if (project) {
            renderPage(project,res);
        } else {
            res.render('404',{ project_id, project_id });
        }
    });

    router.get('/:project_id/markdown', async (req, res) => {
        const { project_id } = req.params;
        const project = await Project.findOne({ project_id }).select('markdown');
        if (project) {
            res.send(project.markdown);
        } else {
            res.status(404).json({ error: 'Project Not Found' });
        }
    });

    router.get('/:project_id/get',auth, async (req, res) => {
        const { project_id } = req.params;
        const project = await Project.findOne({ project_id }).select('-_id -__v -markdown -createdAt -updatedAt -links._id -images._id -videos._id');
        if (project && project.user._id.toString() === req.user._id.toString()) {
            project.user = undefined;
            project.project_id = undefined;
            res.status(200).json({ project });
        } else {
            res.status(404).json({ error: 'Project Not Found' });
        }
    });

    router.post('/generate-key', async (req, res) => {
        const { password,name } = req.body;
        if(!password || !name) {
            res.status(400).json({ error: 'Missing Fields' });
        } else if(password === process.env.PASSWORD) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let randomString = '';
            for (let i = 0; i < 20; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                randomString += characters.charAt(randomIndex);
            }
            const user = await User.findOne({api_key: randomString});
            while(user) {
                randomString = '';
                for (let i = 0; i < 20; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    randomString += characters.charAt(randomIndex);
                }
                user = await User.findOne({api_key: randomString});
            }
            const newUser = new User({
                name: name,
                api_key: randomString
            });
            await newUser.save();
            res.status(200).json({ user: newUser });
        } else {
            res.status(401).json({ error: 'Incorrect Password' });
        }
    });

    router.post('/create-project',auth, async (req, res) => {
        const { project_id, name,links,images,videos } = req.body;
        if(!project_id || !name) {
            res.status(400).json({ error: 'Missing Fields' });
        } else {
            const project = await Project.findOne({ project_id });
            if(project) {
                res.status(400).json({ error: 'Project ID already exists' });
            } else {
                if(!isValidString(project_id)) {
                    res.status(400).json({ error: "Project ID must be combination of alphanumeric, '-' and '_'" });
                } else {
                    const newProject = new Project({
                        project_id: project_id,
                        name: name,
                        links: links || [],
                        images: images || [],
                        videos: videos || [],
                        user: req.user._id
                    });
                    await newProject.save();
                    res.status(200).json({
                        "status": "success",
                        "message": "Project created successfully",
                        "project_id": project_id
                    });
                }
            }
        }
    });

    router.put('/update-project/:project_id',auth, async (req, res) => {
        const { project_id } = req.params;
        const { name,links,images,videos } = req.body;
        const project = await Project.findOne({ project_id });
        if(!project) {
            res.status(400).json({ error: 'Project ID does not exist' });
        } else {
            if(project.user.toString() !== req.user._id.toString()) {
                res.status(401).json({ error: 'Unauthorized' });
            } else {
                if(name) {
                    project.name = name;
                }
                if(links) {
                    project.links = links;
                }
                if(images) {
                    project.images = images;
                }
                if(videos) {
                    project.videos = videos;
                }
                await project.save();
                const newProject  = await Project.findOne({ project_id }).select('-_id -__v -markdown -createdAt -updatedAt -links._id -images._id -videos._id -user -project_id');

                res.status(200).json({ project : newProject });
            }
        }
    });


    router.post('/add-md/:project_id',auth,upload.fields([
        { name: 'readme', maxCount: 1 },
      ]), async (req, res) => {
        const { project_id } = req.params;
        const project = await Project.findOne({ project_id });
        if(!project) {
            res.status(400).json({ error: 'Project ID does not exist' });
        } else {
            if(project.user.toString() !== req.user._id.toString()) {
                res.status(401).json({ error: 'Unauthorized' });
            } else {
                const readmeFile = req.files['readme'][0];
                const readme = readmeFile.buffer.toString();
                project.markdown = readme;
                await project.save();
                res.status(200).json({ project });
            }
        }
    });

    const httpServer = http.createServer(router);
    const port = process.env.PORT || 5000;
    httpServer.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}