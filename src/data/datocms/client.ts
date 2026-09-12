const DATOCMS_ENDPOINT = 'https://graphql.datocms.com/'

export async function postDatoCmsQuery(query: string, apiKey: string): Promise<Response> {
  return fetch(DATOCMS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query }),
  })
}
