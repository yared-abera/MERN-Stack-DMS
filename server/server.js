const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const cookieParser=require('cookie-parser')



//create a database connection  
mongoose.connect( 'mongodb+srv://soul:dms%40433@cluster0.jm8wi.mongodb.net/dms?retryWrites=true&w=majority',
)
.then(()=>{
    console.log("connected to database")
}).catch((err)=>{
    console.log(err)
})


const app=express()

const PORT=process.env.PORT||5000

app.use(cors({
    credentials:true,
    origin:'http://localhost:5173/',
    methods:['GET','PUT','POST','DELETE'],
    allowedHeaders:['Content-Type',
         'Authorization',
         'cache-control',
         'Expires',
         'pragma'
        ]
}))

app.use(cookieParser())
app.use(express.json())

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})

