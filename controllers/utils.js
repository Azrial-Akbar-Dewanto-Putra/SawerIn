const generateID = (prefix, panjang) => {
    const prefixID_TX = prefix;
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = prefixID_TX;
    for (let i = 0; i < panjang; i++) {
        randomString += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }
    return randomString;
};



export default { generateID }