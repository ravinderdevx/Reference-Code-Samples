export const baseUrl = process.env.REACT_APP_API_URL;

export async function handleResponse(response) {
  if (response.ok) {
    const paginationStr = response.headers.get('X-Pagination');

    if (paginationStr) {
      let res = {};
      res.list = await response.json();
      res.pagination = JSON.parse(paginationStr);
      return res;
    } else {
      return response.json();
    }
  }

  if (response.status === 404) {
    throw new Error("Not found.");
  }

  if (response.status === 400) {
    // So, a server-side validation error occurred.
    // Server side validation returns a string error message, so parse as text instead of json.
    const error = await response.text();
    throw new Error(error);
  }
  throw new Error("Network response was not ok.");
}

// In a real app, would likely call an error logging service.
export function handleError(error) {
  // eslint-disable-next-line no-console
  console.error("API call failed. " + error);
  throw error;
}
