/* eslint-disable @typescript-eslint/no-explicit-any */
export function searchApi(ids: any, storeId: number) {
  return fetch(
    `https://apx-search.e-com.plus/api/v1/items.json?q=_id:(${ids})`,
    {
      method: "get",
      headers: {
        "X-Store-Id": storeId,
      },
    }
  ).then(async (response) => {
    if (response.status >= 400 && response.status < 600) {
      return Promise.reject(await response.json());
    }

    return response.json();
  });
}
