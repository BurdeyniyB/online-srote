const fs = require("fs");
const path = require("path");
const https = require("https");

const staticDir = path.resolve(__dirname, "..", "static");

const images = [
  {
    filename: "placeholder-smartphone-1.jpg",
    url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-smartphone-2.jpg",
    url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-smartphone-3.jpg",
    url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-smartphone-4.jpg",
    url: "https://images.unsplash.com/photo-1603898037225-1c6d1b2d7d70?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-smartphone-5.jpg",
    url: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-smartphone-6.jpg",
    url: "https://images.unsplash.com/photo-1583573636246-18cb2246697f?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-smartphone-7.jpg",
    url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-smartphone-8.jpg",
    url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80",
  },

  // headphones
  {
    filename: "placeholder-headphone-1.jpg",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-headphone-2.jpg",
    url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-headphone-3.jpg",
    url: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-headphone-4.jpg",
    url: "https://images.unsplash.com/photo-1578319439584-104c94d37305?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-headphone-5.jpg",
    url: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-headphone-6.jpg",
    url: "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-headphone-7.jpg",
    url: "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=800&q=80",
  },

  // watches
  {
    filename: "placeholder-watch-1.jpg",
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-watch-2.jpg",
    url: "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-watch-3.jpg",
    url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-watch-4.jpg",
    url: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=80",
  },

  // chargers
  {
    filename: "placeholder-charger-1.jpg",
    url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-charger-2.jpg",
    url: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-charger-3.jpg",
    url: "https://images.unsplash.com/photo-1609592806787-3d9d4d3b2fdd?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-charger-4.jpg",
    url: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=800&q=80",
  },

  // mice
  {
    filename: "placeholder-mouse-1.jpg",
    url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-mouse-2.jpg",
    url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-mouse-3.jpg",
    url: "https://images.unsplash.com/photo-1629429407756-01cd3d7cfb38?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-mouse-4.jpg",
    url: "https://images.unsplash.com/photo-1613141412501-9012977f1969?auto=format&fit=crop&w=800&q=80",
  },

  // power banks
  {
    filename: "placeholder-powerbank-1.jpg",
    url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-powerbank-2.jpg",
    url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-powerbank-3.jpg",
    url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
  },
  {
    filename: "placeholder-powerbank-4.jpg",
    url: "https://images.unsplash.com/photo-1587033411391-5d9e51cce126?auto=format&fit=crop&w=800&q=80",
  },
];

function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);

    https
      .get(url, (response) => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          file.close();
          fs.unlink(destination, () => {});
          return resolve(downloadFile(response.headers.location, destination));
        }

        if (response.statusCode !== 200) {
          file.close();
          fs.unlink(destination, () => {});
          return reject(
            new Error(
              `Failed to download ${url}. Status: ${response.statusCode}`,
            ),
          );
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close(resolve);
        });
      })
      .on("error", (err) => {
        file.close();
        fs.unlink(destination, () => {});
        reject(err);
      });
  });
}

async function main() {
  if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true });
  }

  for (const item of images) {
    const destination = path.join(staticDir, item.filename);
    try {
      await downloadFile(item.url, destination);
      console.log(`Downloaded: ${item.filename}`);
    } catch (error) {
      console.error(`Failed: ${item.filename}`, error.message);
    }
  }

  console.log("Done.");
}

main();
