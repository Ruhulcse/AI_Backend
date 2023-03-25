module.exports.createResponse = (data, message = null, error = false) => {
  // return {
  // 	error,
  // 	data,
  // 	message
  // };
  if (error) {
    return {
      status: false,
      message,
    };
  }
  if (!error) {
    return {
      status: true,
      data,
    };
  }
};
