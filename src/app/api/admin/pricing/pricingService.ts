import { postgresDb } from "@/lib/postgresDatabase";


export async function getPricing() {
  const result = await postgresDb.executeQuery("SELECT * FROM pricing ORDER BY id ASC;");
  return result.rows;
}

export async function updatePricing(newPricing: any[]) {
  // newPricing: array of pricing objects
  for (const item of newPricing) {
    if (item.id) {
      // Update existing row
      await postgresDb.executeQuery(
        `UPDATE pricing SET ticket_type = $1, price = $2, normal_price = $3, label = $4, promotional_text = $5, early_bird_end = $6, updated_at = NOW() WHERE id = $7`,
        [item.ticket_type, item.price, item.normal_price, item.label, item.promotional_text, item.early_bird_end, item.id]
      );
    } else {
      // Insert new row
      await postgresDb.executeQuery(
        `INSERT INTO pricing (ticket_type, price, normal_price, label, promotional_text, early_bird_end, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [item.ticket_type, item.price, item.normal_price, item.label, item.promotional_text, item.early_bird_end]
      );
    }
  }
  return getPricing();
}
