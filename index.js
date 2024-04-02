// index.js

// Import required modules
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
const port = process.env.PORT;

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

// Express route
app.get("/api/html", (req, res) => {
  const renderedHtml = `
    <ul>
      ${jsonResponse
        .map(
          (item, index) => `
        <li>
          <div class="rounded border border-blue-500 p-2 my-2">
            <div class="flex w-full justify-between">
              <p>${item.id}</p>
              <span class="text-lg cursor-pointer">⯅</span>
            </div>
            <p>${item.content}</p>
          </div>
        </li>
      `
        )
        .join("")}
    </ul>
  `;
  res.send(renderedHtml);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
