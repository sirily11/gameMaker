let base = 'https://toebpt5v9j.execute-api.us-east-1.amazonaws.com/dev'

export const config = {
    baseURL: `${base}`,
    signUpURL: `${base}/account/register/`,
    signInURL: `${base}/api/token/`,
    token: () => { return sessionStorage.getItem("access") }
}