const express = require('express')
const ejs = require('ejs')
const path = require('path')
var mysql = require('mysql');
const bcrypt = require('bcrypt');

var app = express();
const router = express.Router()
app.set('view engine','ejs')

app.use(express.static(__dirname))
app.use(express.urlencoded())
app.use('/',router)

var con = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "Iamsammed@12",
   database: "jobforfreshers"
 });
 
 con.connect(function(err) {
   if (err) throw err;
   console.log("Connected to Database!");
 });

router.route('/')
.get((req,res)=>{
   con.query("SELECT * FROM job_info limit 3",  (err,result)=>{
     if (err) throw err;
     //   console.log(result);
   //   var r = result;
   res.render('index',{result:result})
   });
})


router.route('/jobs')
.get((req,res)=>{
   const resultsPerPage = 8;
   const page = req.query.page || 1;
   const offset = (page - 1) * resultsPerPage;

   const query = "SELECT * FROM job_info LIMIT ?, ?";
   con.query(query, [offset, resultsPerPage], (err,result)=>{
      if (err) throw err;
      
      const queryCount = "SELECT COUNT(*) as count FROM job_info";
      con.query(queryCount, (err, countResult) => {
         if (err) throw err;
         const count = countResult[0].count;
         const pageCount = Math.ceil(count / resultsPerPage);

         res.render('jobs', { 
            result: result, 
            currentPage: page,
            pageCount: pageCount
         });
      });
   });
})
.post((req,res)=>{
   var search = req.body.searchbar;
   // console.log(search)
   const resultsPerPage = 8;
   const page = req.query.page || 1;
   const offset = (page - 1) * resultsPerPage;

   const query = `SELECT * FROM job_info WHERE Location LIKE '%${search}%' OR Company_Name LIKE '%${search}%' OR Batch LIKE '%${search}%' OR Job_Position LIKE '%${search}%' LIMIT ?, ?`;
   con.query(query, [offset, resultsPerPage], (err,result)=>{
      if (err) throw err;
      
      const queryCount = `SELECT COUNT(*) as count FROM job_info WHERE Location LIKE '%${search}%' OR Company_Name LIKE '%${search}%' OR Batch LIKE '%${search}%'`;
      con.query(queryCount, (err, countResult) => {
         if (err) throw err;
         const count = countResult[0].count;
         const pageCount = Math.ceil(count / resultsPerPage);

         res.render('jobs', { 
            result: result, 
            currentPage: page,
            pageCount: pageCount
         });
      });
   });
});

router.route('/jobs/:location')
.get((req,res)=>{
   var location = req.params.location;
   // console.log(search)
   const resultsPerPage = 8;
   const page = req.query.page || 1;
   const offset = (page - 1) * resultsPerPage;

   const query = `SELECT * FROM job_info WHERE Location LIKE '%${location}%'  OR Job_Position LIKE '%${location}%' LIMIT ?, ?`;
   con.query(query, [offset, resultsPerPage], (err,result)=>{
      if (err) throw err;
      
      const queryCount = `SELECT COUNT(*) as count FROM job_info WHERE Location LIKE '%${location}%'  OR Job_Position LIKE '%${location}%'`;
      con.query(queryCount, (err, countResult) => {
         if (err) throw err;
         const count = countResult[0].count;
         const pageCount = Math.ceil(count / resultsPerPage);

         res.render('jobs', { 
            result: result, 
            currentPage: page,
            pageCount: pageCount
         });
      });
   });
})
.post((req,res)=>{
   var search = req.body.searchbar;
   // console.log(search)
   const resultsPerPage = 8;
   const page = req.query.page || 1;
   const offset = (page - 1) * resultsPerPage;

   const query = `SELECT * FROM job_info WHERE Location LIKE '%${search}%' OR Company_Name LIKE '%${search}%' OR Batch LIKE '%${search}%' OR Job_Position LIKE '%${search}%' LIMIT ?, ?`;
   con.query(query, [offset, resultsPerPage], (err,result)=>{
      if (err) throw err;
      
      const queryCount = `SELECT COUNT(*) as count FROM job_info WHERE Location LIKE '%${search}%' OR Company_Name LIKE '%${search}%' OR Batch LIKE '%${search}%'`;
      con.query(queryCount, (err, countResult) => {
         if (err) throw err;
         const count = countResult[0].count;
         const pageCount = Math.ceil(count / resultsPerPage);

         res.render('jobs', { 
            result: result, 
            currentPage: page,
            pageCount: pageCount
         });
      });
   });
});



router.route('/job_detail/:id')
.get((req,res)=>{
   var id = req.params.id;
   con.query("SELECT * FROM job_info where job_id = ?", [id], (err,result)=>{
      if (err) throw err;
   con.query("SELECT * FROM job_info WHERE job_id = ? ORDER BY Job_Released_Date DESC limit 3", [id], (err, result1) => {
      if (err) throw err;
    res.render('job_detail',{result:result,result1:result1})
    });
   });
})

router.route('/contact')
.get((req,res)=>{
   res.render('contact')
})

router.route('/about')
.get((req,res)=>{
   res.render('about')
})

router.route('/privacy_policy')
.get((req,res)=>{
   res.render('privacy_policy')
})

router.route('/admin/login')
.get((req,res)=>{
   
   res.render('admin/login',{message:""})
})
.post((req, res) => {
   const email = req.body.email;
   const password = req.body.password;
   console.log(email,password)
   con.query(`SELECT * FROM admin WHERE email='${email}'`, (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
          if (password === results[0].password) {
            //   res.send('Login successful!');
            res.redirect('/admin/dashboard')
          } else {
            res.render('admin/login',{message:"password is wrong"})
          }
      } else {
         res.render('admin/login',{message:"User Not Found"})
      }
   });
});

router.route('/admin/dashboard')
.get((req,res)=>{
   res.render('admin/dashboard')
})

router.route('/admin/add_jobs')
.get((req,res)=>{

   res.render('admin/add_jobs')
})
.post((req, res) => {
   const company = req.body.company;
   const drive_name = req.body.drive;
   const job_role = req.body.jobrole;
   const qualification = req.body.qualification;
   const batch = req.body.batch;
   const experience = req.body.experience;
   const salary = req.body.salary;
   const last_date = req.body.last_date;
   const location = req.body.location;
   const job_summary = req.body.job_summary;
   const responsibilities = req.body.responsibilities;
   const eligibility = req.body.eligibility;
   const skills = req.body.skills;
   const about = req.body.about;
   const URL = req.body.URL;

   // get the current date and format it
   const released_date = new Date().toISOString().slice(0, 19).replace('T', ' ');

   // create the SQL query for inserting data
   const sql = `INSERT INTO job_info (job_id,Company_Name, Job_Released_Date, Job_Position, Package_CTC, Qualification, Batch, Job_Summary, Eligibility_Criteria, Experience, Location, Last_Date_to_Apply, Company_Name_Recruitment_2023, About_Company, Job_Responsibilities, Preferred_Skills, Apply_Here_URL) 
                VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
   const values = [null,company, released_date, job_role, salary, qualification, batch, job_summary, eligibility, experience, location, last_date, drive_name, about, responsibilities, skills, URL];

   // execute the SQL query
   con.query(sql, values, (error, results) => {
     if (error) {
       console.error(error);
       res.status(500).send('Error inserting job info into database.');
     } else {
       console.log('Job info added to database.');
       res.redirect('/admin/dashboard');
     }
   });
 });

router.route('/admin/view_jobs')
.get((req,res)=>{
   res.render('admin/view_jobs')
})


app.use((req,res)=>{
   if (req.status = '400')
   // res.status(400).send("bad Request")
   res.status(404).send("`<h1>Page Not Found</h1>`");
})



app.listen(3000, (req,res)=>{
console.log("Server Started")
})