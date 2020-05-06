const axios = require("axios");
const { eagles } = require("../../Seeds/golden-eagle-data-test");

const fetchData = async function (params) {
  const url = "https://www.movebank.org/movebank/service/json-auth";
  const username = process.env.MB_USERNAME;
  const password = process.env.PASSWORD;

  return await axios({
    method: "GET",
    url,
    params,
    withCredentials: true,
    auth: {
      username,
      password,
    },
  });
};

// const fetchData = (params) => {
//   const url = "https://www.movebank.org/movebank/service/json-auth";
//   const username = process.env.MB_USERNAME;
//   const password = process.env.PASSWORD;

//   return Promise.resolve({ data: eagles });
//   //   return axios({
//   //     method: "GET",
//   //     url,
//   //     params,
//   //     withCredentials: true,
//   //     auth: {
//   //       username,
//   //       password,
//   //     },
//   //   });
// };

module.exports = {
  fetchData,
};
