const express = require('express');
const taskRoutes = require('./routes/tasks')
const authRoutes = require('./routes/auth');

const app=express();
const PORT = 3000;

app.use(express.json());
app.use('/auth', authRoutes);

app.use('/tasks',taskRoutes);

app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json({message: 'Something went wrong!'});
});

app.listen(PORT, ()=> {
    console.log(`Server running at http://localhost:${PORT}`)
})