const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const { Expense } = require('./schema.js')
const e = require('express')

const app = express()
app.use(bodyParser.json())
app.use(cors)
/**
 * git clone <link>
 * 
 * (add .gitignore file)
 * 
 * git add .
 * git commit -m "any msg"
 * git push origin main
 * 
 * git config --global user.name '<username>'
 * git config --global user.email <emailId>
 */

/**
 * Expense Tracker
 * 
 * Features and end points
 * 
 * Adding a new expense/income : /add-expense -> post
 * Displaying existing expenses : /get-expenses -> get
 * Editing existing entries : /edit-expense -> patch/put
 * Deleting expenses : /delete-expense -> delete
 * 
 * Budget reporting
 * Creating new user
 * Validating user
 * 
 * Defining schema
 * category, amount, date 
 */

async function connectToDb() {
    try{
    
    await mongoose.connect('mongodb+srv://jeevika:jeevi2110@cluster0.mzlapyn.mongodb.net/ExpenseTracker?retryWrites=true&w=majority&appName=Cluster0')
    console.log("connection established")
    //const port = 8000
    const port = process.env.PORT || 8000
    app.listen(port, function() {
        console.log(`Listening on port ${port}...`)
    })
}catch(e){
    console.log(e)
    console.log("could not establish")
}
}
connectToDb()

app.post('/add-expense', async function(request, response) {
    try{
        console.log(request.body)
        await Expense.create({  
            "amount" : request.body.amount,
            "category" : request.body.category,
            "date" : request.body.date
        })
        response.status(200).json({
            "status" : "success",
            "message" : "new entry created"
        })
    }catch(error){
        response.status(500).json({
            "status" : "failure",
            "message" : "entry not created",
            "error" : error
        })
    }
})
try{
    app.get('/get-expenses',async function(request,response){
        const expensesData = await Expense.find()
        response.status(200).json(expensesData)
    })
}catch(e){
    response.status(500).json({
        "status" : "failure",
        "message" : "could not fetch enteries",
        "error" : error
    })
}
app.delete('/delete-expense/:id',async function(request,response)
{
    const expenseData = await Expense.findById(request.params.id)
    try{
        if(expenseData)
        {
            await Expense.findByIdAndDelete(request.params.id)
            response.status(200).json(
                {
                    "status" : "success",
                    "message" : "deleted entry"
                }
            )
        }
        else
        {
            response.status(404).json(
                {
                    "status" : "Failure",
                    "message" : "could not delete"
                }
            )
        }
    }
    catch(error)
    {
        response.status(500).json(
            {
                "status" : "failure",
                "message" : "could not delete",
                "error" : error
            }
        )
    }
})
app.patch('/edit-expense/:id',async function(request,response){
try{
    const expenseEntry = await Expense.findById(request.params.id)
    if(expenseEntry){
        await expenseEntry.updateOne({
            "amount" : request.body.amount,
            "category" : request.body.category,
            "date" : request.body.date
        })
        request.status(200).json({
            "status" : "Success",
            "message" : "update entry"
        })
    
    }else{
        response.status(404).json(
            {
                "status" : "Failure",
                "message" : "could not delete"
            }
        )
    }
}catch(e){
    
    response.status(500).json(
        {
            "status" : "failure",
            "message" : "could not update",
            "error" : e
        }
    )
}

})