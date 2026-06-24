import client from "./axios";

export async function createProduk(payload) {
  return client.post("/produk/create", payload);
}
export async function createProdukBulk(payload) {
  return client.post("/produk/create/bulk", payload);
}
export async function listProduk() {
  return client.get(`/produk/list`);
}
export async function deleteProduk(id) {
  return client.delete(`/produk/delete/${id}`)
}
export async function detailProduk(id) {
  return client.get(`/produk/detail/${id}`)
}
export async function updateProduk(payload) {
  return client.put(`/produk/update/${payload.id}`, payload)
}