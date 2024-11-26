export default async function handler(req, res) {
  // Handle OPTIONS request
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.status(200).end();
    return;
  }

  try {
    // Get raw body content
    const rawBody = await getRawBody(req);
    const xmlString = rawBody.toString();

    // Extract data using regex
    const udid = extractValue(xmlString, "UDID");
    const product = extractValue(xmlString, "PRODUCT");
    const version = extractValue(xmlString, "VERSION");

    // Create query parameters
    const params = new URLSearchParams({
      udid,
      product,
      version,
    }).toString();

    // Send response with Location header
    res.setHeader(
      "Location",
      `https://hos-engineering.github.io/jubilant-happiness/show-udid.html?${params}`,
    );
    // Redirect with 301 - required
    res.status(301).send("");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = [];
    req.on("data", (chunk) => {
      data.push(chunk);
    });
    req.on("end", () => {
      resolve(Buffer.concat(data));
    });
    req.on("error", reject);
  });
}

function extractValue(xmlString, key) {
  const match = xmlString.match(
    new RegExp(`<key>${key}</key>\\s*<string>(.*?)</string>`),
  );
  return match ? match[1] : "";
}
