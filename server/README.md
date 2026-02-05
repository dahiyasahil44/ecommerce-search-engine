# 🛒 Smart Search Microservice (MERN + Fuse.js)

A high-performance, intent-aware search engine microservice designed for Tier-2/Tier-3 e-commerce markets in India. It handles typos ("Ifone"), Hinglish intent ("Sasta"), and business-logic ranking (Stock, Ratings).

## 🚀 Features

- **In-Memory Search:** Loads the product catalog into memory on startup for sub-100ms latency.
- **Fuzzy Matching:** Uses `Fuse.js` to handle spelling mistakes (e.g., `Ifone 16` -> `iPhone 16`).
- **Hinglish & Intent Parsing:**
  - Detects price constraints (e.g., "under 50k", "50000").
  - Detects intent keywords like "Sasta" (Cheap) and adjusts ranking logic dynamically.
- **Smart Ranking Algorithm:**
  - **Base Score:** Text relevance.
  - **Boosts:** High ratings and high sales count boost visibility.
  - **Penalties:** Out-of-stock items and high return rates are demoted.
- **Feature-Centric Architecture:** scalable folder structure (`src/features/search`, `src/features/product`).

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Persistence)
- **Search Engine:** Fuse.js (In-memory fuzzy search)

---

## 🏃‍♂️ How to Run

1.  **Install Dependencies**

    ```bash
    npm install
    ```

2.  **Setup Environment**
    Create a `.env` file in the root directory:

    ```env
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/ecommerce_search
    ```

3.  **Seed the Database** (Generates 1000+ synthetic products)

    ```bash
    npm run seed
    ```

4.  **Start the Server**
    ```bash
    npm run dev
    ```

---

## 🧠 The Ranking Algorithm

The search engine uses a composite score to rank products. The formula is:

```javascript
FinalScore = (TextMatchScore * 100)
           + (Rating * 5)
           + (log10(SalesCount) * 2)
           - (Stock == 0 ? 500 : 0)
           - (ReturnRate > 10% ? ReturnRate * 2 : 0)
```

## API Endpoints

- POST /api/v1/product
- GET /api/v1/search/product?query=Sasta Iphone
