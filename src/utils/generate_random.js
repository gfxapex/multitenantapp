const generateRandom = (limit = 999999) => {
    const randomNumber = Math.floor(Math.random() * limit + 1);
    const formattedNumber = randomNumber.toString().padStart(limit.toString().length, '0');
    return formattedNumber;
};

module.exports = generateRandom;
