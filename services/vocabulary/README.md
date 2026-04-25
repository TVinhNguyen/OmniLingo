# Vocabulary Service

OpenAPI: [openapi.yaml](./openapi.yaml)

```bash
curl -s http://localhost:3004/api/v1/vocab/entries/search \
  -H 'Content-Type: application/json' \
  -d '{"query":"ohayou","language":"ja","page":1,"page_size":20}'
```
