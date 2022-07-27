const fetch = require("node-fetch").default;

// const sendMessageToManager = async (manager, order) => {
//   console.log("------------------");
//   console.log(` Order № ${order.id} send to Manager ${manager.name}`);
//   console.log("------------------");
// };

const sendOrder = async (order) => {
  const URL = "http://170.130.40.237:5000/api/order";
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
  return response;
};

const sendChatData = async (data) => {
  const URL = "http://170.130.40.237:5000/api/product";
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
};

module.exports = { sendOrder, sendChatData };
