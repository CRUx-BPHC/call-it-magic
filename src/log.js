module.exports = function (data) {
  if (data.toString().startsWith("<")) {
    console.log("NotHub:", data.toString());
    return false;
  }
  console.log("Hub:", data.toString());
  return true;
};
