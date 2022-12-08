import http from '../http'

// send email
export function sendCode(data){
  return http.post('/sendCode',data)
}

// administer login
export function login(data){
  return http.post('/admin/login',data)
}

export function register(data){
  return http.post('/admin/register',data)
}

// enter site count
export function countAdd(){
  return http.post('/countAdd')
}

//get 20 whitelisted users 
export function getWhitelistedUsers(data){
  return http.get('/getWhitelistedUsers', data)
}

// get whitelisted users sum
export function getWhitelistedUsersSum(){
  return http.post('/getWhitelistedUsersSum')
}


//get 20 mint infos
export function getMintInfo(data){
  return http.get('/mintInfo', data)
}


// get mint infos sum
export function getMintInfoSum(){
  return http.post('/getMintInfoSum')
}

// get mint info by addr 
export function mintInfoByAddr(data){
  return http.post('/mintInfo/getByAddr', data)
}


// get 24 hours count 
export function hourCount(data){
  return http.post('/hourCount',data)
}


// set whitelisted user
export function setWhitelistedUser(data){
  return http.post('/setWhitelistedUser',data)
}

// set mint count
export function setMintCount(data){
  return http.post('/mint', data)
}

// set mint info 
export function setMintInfo(data){
  return http.post('/saveMintInfo')
}

export function isWhitelisted(data){
  return http.post('/isWhitelisted',data)
}

