/* eslint-disable @typescript-eslint/no-explicit-any */
import { store } from "@ecomplus/client";

function fetchProductBody({ appState, _id }: any) {
  return store({
    url: `/products/${_id}.json`,
    authenticationId: appState.ecomAuthID,
    accessToken: appState.ecomToken,
    storeId: appState.ecomStoreID,
  });
}

export const post = async (
  order: any,
  storeDomain: any,
  storeId: any,
  token: any,
  requestReviewAt: any,
  appState: any
) => {
  const { items } = order;

  const products: any = [];
  // const products = items.map((item: any) => {
  //   const product: any = {
  //     product_id: item.product_id,
  //     sku: item.sku,
  //     name: item.name,
  //     price: item.final_price || item.price || 10,
  //     url: item.permalink || `${storeDomain}/${item.sku}`,
  //   };

  //   if (item.picture) {
  //     const pictures = ["normal", "big"].map((size) => {
  //       if (item?.picture[size]) {
  //         return item.picture[size].url;
  //       }
  //     });

  //     if (pictures.find((p) => p !== null)) {
  //       product.pictures = pictures.filter((pp) => typeof pp === "string");
  //     }
  //   }

  //   return product;
  // });

  async function getProducts() {
    return new Promise((resolve) => {
      let productIndex = 0;

      const start = async function () {
        if (items[productIndex]) {
          const { data, error, status } = await fetchProductBody({
            appState,
            _id: items[productIndex].product_id,
          });

          if (data) {
            const product: any = {
              product_id: data._id,
              sku: data.sku,
              name: data.name,
              price: data.final_price || data.price || 10,
              url: `${storeDomain}/${data.slug}`,
            };

            if (data?.gtin && Array.isArray(data.gtin)) {
              product.gtin = data.gtin.toString()
            }

            if (data?.mpn && Array.isArray(data.mpn)) {
              product.mpn = data.mpn.toString()
            }

            if (items[productIndex]?.picture) {
              const pictures = ["normal", "big"].map((size) => {
                if (items[productIndex].picture[size]) {
                  return items[productIndex].picture[size].url;
                }
              });

              if (pictures.find((p) => p !== null)) {
                product.pictures = pictures.filter(
                  (pp) => typeof pp === "string"
                );
              }
            }

            products.push(product)
            productIndex++;
            setTimeout(async () => {
              await start();
            }, 100);
          } else if (error && status >= 500) {
            setTimeout(async () => {
              await start();
            }, 1500);
          }
        } else {
          return resolve(true);
        }
      };

      start();
    });
  }

  await getProducts();
  const customers = [];

  const { buyers } = order;
  if (buyers && Array.isArray(buyers) && buyers.length) {
    // only the first buyer is supported by now :/
    const customer: any = {};
    for (let b = 0; b <= 0; b++) {
      const buyer = buyers[b];
      if (buyer.name) {
        const { name } = buyer;
        if (name.given_name) {
          customer.name = name.given_name;
        }

        if (name.middle_name) {
          customer.name = `${customer.name} ${name.middle_name}`;
        }

        if (name.family_name) {
          customer.name = `${customer.name} ${name.family_name}`;
        }
      } else {
        customer.name = buyer.display_name;
      }

      customer.email = buyer.main_email;

      if (buyer.phones && Array.isArray(buyer.phones) && buyer.phones.length) {
        const { phones } = buyer;
        for (let p = 0; p <= 0; p++) {
          const phone = phones[p];
          customer.phone = phone.number;
        }
      }
    }

    customers.push(customer);
  }

  let deliveredData = order.updated_at;
  if (order.fulfillments) {
    const fulfillment = order.fulfillments.find(
      (ful: any) => ful.status === "delivered"
    );
    if (fulfillment && fulfillment.date_time) {
      deliveredData = fulfillment.date_time;
    }
  }


  const data: any = {
    products,
    customers,
    order_id: order._id,
    order_date: order.created_at,
    delivery_date: deliveredData,
  };

  if (requestReviewAt) {
    data.request_review_at = requestReviewAt;
  }

  console.table('Sincronizando Pedido', data)
  return fetch("https://api.martan.app/v1/orders.json", {
    method: "post",
    headers: {
      "X-Store-Id": storeId,
      "X-Token": token,
    },
    body: JSON.stringify(data),
  }).then(async (response) => {
    if (response.status >= 400 && response.status < 600) {
      return Promise.reject(await response.json());
    }

    return response.json();
  });
};
