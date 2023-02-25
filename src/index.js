const express = require('express')
require('./util/db')
const User = require('./models/Users.model')
const gps_model = require('./models/GpsSummary.model')
const auth = require('./middleware/auth')
const path = require('path')
const hbs = require('hbs')


const router = new express.Router();
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const viewsPath = path.join(__dirname, '../template/views')
const partialsPath = path.join(__dirname, '../template/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
app.use(express.static('./public'))

router.get('/gps', async (req, res) => {
    let data = await gps_model.find({})
    // delete data['_id']
    let dom = `<table id="example" class="display" style="width:100%"><thead><tr>`;

    dom += `<th>DeviceId</th>`
    dom += `<th>Device Type</th>`
    dom += `<th>Timestamp</th>`
    dom += `<th>location</th>`
    dom += `</tr></thead><tbody>`;

    (await data).forEach((row) => {
        dom += `<tr><td>${row.DeviceId}</td>
                <td>${row['Device Type']}</td>
                <td>${row.Timestamp}</td>
                <td>${row.location}</td></tr>`
    })
    dom += `</tbody></table>`;

    res.render('gps', {
        data: dom
    })
})
// login
router.get('/login', async (req, res) => {
    res.render('login')
})
router.post('/login', async (req, res) => {
    if(!req.body.email || !req.body.password) return res.status(400).send({
        success: false,
        message: 'Email & Password, both are required.'
    })
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send(`<script>location.href = './gps'</script>`)
    }catch(e){
        res.status(400).send(`<script>location.reload()</script>`)
    }
})
// for signup 
router.get('/signup', async (req, res) => {
    res.render('signup')
})
router.post('/signup', async(req, res) => {
    const user = new User(req.body)
    try{
        const token = await user.generateAuthToken()

        await user.save()

        res.status(201).send(`<script>location.href = './login'</script>`)
    }catch(error){
        res.status(500).send(error)
    }
})
// logout
router.post('/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            token.token !== req.token
        })
        await req.user.save();

        res.send({'message': 'Successfully logout.'})
    }catch(e){
        res.status(500).send(e);
    }
})



app.use(router)
app.listen('80', () => {
    console.log('Server is up on PORT 80.')
})