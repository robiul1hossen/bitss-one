const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/all-categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  const json = await res.json();
  return json.data;
}
