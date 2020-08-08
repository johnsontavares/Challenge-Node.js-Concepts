const express = require('express');
const { response } = require('express');
// Primeiro Arquivo executado da aplicação
const app = express();
const {uuid, isUuid} = require('uuidv4');
app.use(express.json())

const projects = [];

function logRequests(req, res, next){
    const { method, url } = req;
    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.log('1')
    console.time(logLabel)
    return next()
    console.timeEnd(logLabel)

} 

function validateProjectId(req, res, next){
    const { id } = req.params;

    if(!isUuid(id)){
        return res.status(400).json({error: 'Invalid project ID.'})
    }

    return next()
}

// app.use(logRequests);

app.get('/projects',logRequests, (req, res)=>{
    console.log('3')
    const { title } = req.query;
    const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects
    return res.json(results)
})

app.post('/projects', (req, res)=>{
    const body = req.body;
    const {title, owner} = req.body;
    const project = { id: uuid(),title, owner}
    projects.push(project)
    return res.json(projects)
})

app.put('/projects/:id',validateProjectId, (req, res) => {        
    const { id } = req.params;
    const { title, owner} = req.body;
    const projectIndex = projects.findIndex(project => project.id == id);            // retornando JSON por ID

    if(projectIndex < 0){
        return res.status(400).json({erro: "Project Not Found"})
    }

    const project = {
        id, 
        title,
        owner,
    }

    projects[projectIndex] = project;
    return res.json(project)
})

app.delete('/projects/:id',validateProjectId, (req, res) => {
    const { id } = req.params;
    const projectIndex = projects.findIndex(project => project.id == id)

    if(projectIndex < 0){
        return res.status(400).json({error: 'Project not found'})
    }

    projects.splice(projectIndex,1)

    return res.json(projects)
})

app.get('/', (req,res) => {
    return res.json(projects)
})

app.listen(5000, () => {
    console.log('Back-end started !');
})