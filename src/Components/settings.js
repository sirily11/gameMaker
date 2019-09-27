function getURL(path){
    let testURL = "http://0.0.0.0:8000/survey"
    let production = "https://lvslzvofwc.execute-api.us-east-1.amazonaws.com/api"
    return `${testURL}/${path}`
}
export default getURL