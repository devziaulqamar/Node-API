// index.js

// Import required modules
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3001;

app.post("/api/keycloak-token", async (req, res) => {
  try {
    const { code } = req.body;

    // Make the request to Keycloak
    const keycloakUrl =
      "https://ssodev.dragonteam.dev/auth/realms/Variiance/protocol/openid-connect/token";
    const response = await axios.post(
      keycloakUrl,
      {
        client_id: "VLC",
         redirect_uri: "https://localhost:3000/assets/redirectPage.html",
        //redirect_uri: "https://projects.ziaulqamar.com/v-connect/assets/redirectPage.html",
        code: code,
        grant_type: "authorization_code",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Respond with the token data
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.data) {
      // If the error response contains data, return it
      return res.status(error.response.status).json(error.response.data);
    } else {
      // Otherwise, return a generic error message
      console.error("Error:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.post("/api/refresh-token", async (req, res) => {
  try {
    const { refresh_token } = req.body;

    // Make the request to refresh the token
    const keycloakUrl =
      "https://ssodev.dragonteam.dev/auth/realms/Variiance/protocol/openid-connect/token";
    const response = await axios.post(
      keycloakUrl,
      {
        client_id: "VLC",
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Respond with the refreshed token data
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.response.data);
    res.status(500).json({ error: "Failed to refresh token" });
  }
});

app.get("/api/prodcut", async (req, res) => {
  try {
    const response = await axios.get("https://dummyjson.com/products");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST endpoint
app.post("/api/createProduct", async (req, res) => {
  try {
    const { productName, price } = req.body;

    // Check if productName and price are present in the request body
    if (!productName || !price) {
      throw new Error("productName and price are required");
    }

    console.log(`Creating product: ${productName} with price: ${price}`);

    // Send a success response
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Static JSON response
const jsonResponse = [
  { id: "S00001099", content: "Here is the content for shipment S00001099" },
  { id: "S00001100", content: "Here is the content for shipment S00001100" },
  { id: "S00001101", content: "Here is the content for shipment S00001101" },
];

app.get("/api/html", (req, res) => {
  let renderedHtml = `<ul id="shipments">`;

  jsonResponse.forEach((shipment) => {
    renderedHtml += `
      <li class="shipment-item">
        <div class="rounded border border-blue-500 p-2 my-2">
          <div class="flex w-full justify-between" data-shipment-id="${
            shipment.id
          }">
            <p class="shipment-id">${shipment.id}</p>
            <span class="text-lg cursor-pointer toggle-button" data-shipment='${JSON.stringify(
              shipment
            )}'>+</span>
          </div>
          <p class="details hidden">${shipment.content}</p>
        </div>
      </li>`;
  });

  renderedHtml += `</ul>`;

  res.send(renderedHtml);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
