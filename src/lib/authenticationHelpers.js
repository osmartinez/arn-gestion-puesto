module.exports = {
    async comparePwd(pwd, pwd2){
        const result = await pwd === pwd;
        return result;
    }
}