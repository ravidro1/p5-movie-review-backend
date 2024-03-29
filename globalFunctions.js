const jwt = require("jsonwebtoken");

const isTokenVerify = (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];

    console.error(token, 1);
    if (!token) return res.status(401).json({ message: "Token Required" });
    else {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          res.status(401).json({ message: "Token Wrong" });
        } else {
          req.userID = decoded.user_id;
          next();
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const StringInvalidCharsError = (stringValue) => {
  if (typeof stringValue != "string") return;

  if (
    !/^[$A-Za-z0-9=/:;_.-\s,()"^\[\]]*$/.test(stringValue) ||
    stringValue.includes("--")
  )
    throw new Error(`Contain Invalid Chars: ${stringValue}`);
};

const ArrayInvalidCharsError = (arrayOfValues) => {
  if (!Array.isArray(arrayOfValues)) return;

  arrayOfValues.forEach((value) => {
    StringInvalidCharsError(value);
  });
};

const checkArrayNotNull = (array) => {
  if (!Array.isArray(array)) return true;

  let returnValue = false;
  array.forEach((item) => {
    if (item == null) returnValue = true;
  });

  return returnValue;
};

const checkArrayNotString = (array) => {
  if (!Array.isArray(array)) return true;

  let returnValue = false;
  array.forEach((item) => {
    if (typeof item == "string") returnValue = true;
  });

  return returnValue;
};

const isParsable = (value) => {
  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }
  return true;
};

const parseIfString = (value) => {
  let newValue = null;
  if (isParsable(value)) newValue = JSON.parse(value);

  return newValue;
};

const convertCharsToSafeChars = (array) => {
  const tempArray = array?.map((item) => {
    if (item == null) return null;
    const tempItem = String(item).replaceAll("'", "\\'").replaceAll('"', '\\"');
    if (isParsable(tempItem)) return JSON.parse(tempItem);
    return tempItem;
  });
  return tempArray;
};

module.exports = {
  isTokenVerify,
  StringInvalidCharsError,
  ArrayInvalidCharsError,
  checkArrayNotNull,
  checkArrayNotString,
  isParsable,
  parseIfString,
  convertCharsToSafeChars,
};
