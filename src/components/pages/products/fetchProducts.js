const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchProducts({ countryId, categoryId }) {
  if (categoryId) {
    const params = new URLSearchParams({
      country_id: countryId,
      category_id: categoryId,
    });
    const res = await fetch(`${BASE_URL}/all-products?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch products");
    const json = await res.json();
    return json.data;
  } else {
    const res = await fetch(`${BASE_URL}/all-products`);
    if (!res.ok) throw new Error("Failed to fetch products");
    const json = await res.json();
    return json.data;
  }
}
