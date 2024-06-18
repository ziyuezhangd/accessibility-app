const DEV = import.meta.env.DEV;
let API_HOST;
if (DEV) {
  API_HOST = import.meta.env.VITE_DEV_API_HOST;
} else {
  API_HOST = import.meta.env.VITE_PROD_API_HOST;
}

export { API_HOST };
