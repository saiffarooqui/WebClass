var BASE_URL = new URL('https://www.googleapis.com/books/v1/volumes?');

export default async function handler(req, res) {
  let { keyword, max_results = 4 } = req.query;
  BASE_URL.searchParams.set('q', keyword);
  BASE_URL.searchParams.set('maxResults', max_results);
  let response = await fetch(BASE_URL);
  let result = await response.json();
  res.status(200).json(result);
}
