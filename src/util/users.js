const users = [
    {
        email: "seraj@khan.com",
        password: "password"
    },
    {
        email: "serajkhan@bamboobox.ai",
        password: "123456"
    }
]

const addUser = (email, password) => {
    if(email && password){
        users.push({
            email,
            password
        })
    }
}

const loginVerify = (email, password) => {
    const index = users.findIndex((user) => {
        return user.email === email && user.password === password
    })

    return index >= 0 ? true : false;
}

module.exports = {
    addUser,
    loginVerify
}