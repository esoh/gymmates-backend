function registerAccount(username, email, password){
    return fetch('/accounts', {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                username,
                email,
                password,
            })
        })
            .then(res => res.json())
}

function authenticateUser(username, password){
    return fetch('/auth/token', {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                username: username,
                password: password,
            })
        })
            .then(res => res.json())
}

function checkLoggedIn(){
    return new Promise((resolve, reject) => {
        fetch('/auth/me')
            .then(res => res.json())
            .then(data => {
                // possibly invalid cookie
                if(data && data.error){
                    reject({error: data.error})
                }

                // empty response means no cookie was sent
                if(!data.user){
                    resolve(null)
                }

                // success: return returned account
                resolve({user: data.user})
            })
            .catch(err => {
                reject(err)
            })
    })
}

function deauthenticateAccountLocally(){
    return fetch('/auth/cookie', { method: "DELETE" });
}

module.exports = {
    registerAccount,
    authenticateUser,
    checkLoggedIn,
    deauthenticateAccountLocally,
}
